import { NextResponse } from "next/server";
import postgres from "postgres";

import { formatVectorForPg } from "@/ai/embeddings";
import { hasOpenAIConfig } from "@/env";
import { searchKnowledge } from "@/tools/search-knowledge";

export const dynamic = "force-dynamic";

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error("DATABASE_URL is required.");
  }
  return url;
}

async function createTenant(sql: postgres.Sql, slug: string): Promise<string> {
  const [tenant] = await sql<{ id: string }[]>`
    INSERT INTO tenants (name, slug, public_key, status)
    VALUES (${`Knowledge Test ${slug}`}, ${slug}, ${`pk-${slug}`}, 'active')
    RETURNING id
  `;

  if (!tenant) {
    throw new Error(`Failed to create tenant ${slug}.`);
  }

  return tenant.id;
}

async function seedFaqChunk(
  sql: postgres.Sql,
  tenantId: string,
  title: string,
  content: string,
  embedding?: number[],
): Promise<void> {
  const [document] = await sql<{ id: string }[]>`
    INSERT INTO knowledge_documents (tenant_id, title, type, status)
    VALUES (${tenantId}::uuid, ${title}, 'faq', 'ready')
    RETURNING id
  `;

  if (!document) {
    throw new Error("Failed to create knowledge document.");
  }

  if (embedding) {
    const vector = formatVectorForPg(embedding);
    await sql`
      INSERT INTO knowledge_chunks (tenant_id, document_id, content, position, embedding)
      VALUES (
        ${tenantId}::uuid,
        ${document.id}::uuid,
        ${content},
        0,
        ${vector}::vector
      )
    `;
    return;
  }

  await sql`
    INSERT INTO knowledge_chunks (tenant_id, document_id, content, position)
    VALUES (${tenantId}::uuid, ${document.id}::uuid, ${content}, 0)
  `;
}

async function cleanupTenant(sql: postgres.Sql, tenantId: string): Promise<void> {
  await sql`DELETE FROM tenants WHERE id = ${tenantId}::uuid`;
}

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const sql = postgres(getDatabaseUrl(), { prepare: false, max: 1 });
  const checks: string[] = [];
  const suffix = Date.now().toString(36);
  const tenantASlug = `knw-a-${suffix}`;
  const tenantBSlug = `knw-b-${suffix}`;

  try {
    const tenantAId = await createTenant(sql, tenantASlug);
    const tenantBId = await createTenant(sql, tenantBSlug);

    const targetContent =
      "O cimento queimado tem garantia de 5 anos contra descascamento em ambientes internos.";
    const otherContent =
      "A pintura epóxi industrial cobre pisos de galpões com alta resistência química.";
    const decoyContent =
      "Oferecemos instalação de porcelanato líquido com acabamento premium.";

    await seedFaqChunk(sql, tenantAId, "Garantia cimento queimado", targetContent);
    await seedFaqChunk(sql, tenantAId, "Porcelanato", decoyContent);
    await seedFaqChunk(sql, tenantBId, "Pintura epóxi", otherContent);

    const textResult = await searchKnowledge(tenantAId, {
      query: "garantia cimento queimado",
      topK: 3,
    });

    if (!textResult.ok) {
      throw new Error(textResult.error);
    }

    if (textResult.data.chunks.length === 0) {
      throw new Error("Text search returned no chunks.");
    }

    const topChunk = textResult.data.chunks[0];
    if (!topChunk?.content.includes("garantia de 5 anos")) {
      throw new Error("Top chunk is not relevant to the query.");
    }

    const leaked = textResult.data.chunks.some((chunk) =>
      chunk.content.includes("pintura epóxi"),
    );
    if (leaked) {
      throw new Error("Search leaked chunks from another tenant.");
    }

    checks.push("search:text-relevant");
    checks.push("search:tenant-isolation");

    const crossTenant = await searchKnowledge(tenantBId, {
      query: "garantia cimento queimado",
      topK: 3,
    });

    if (!crossTenant.ok) {
      throw new Error(crossTenant.error);
    }

    const crossLeak = crossTenant.data.chunks.some((chunk) =>
      chunk.content.includes("garantia de 5 anos"),
    );
    if (crossLeak) {
      throw new Error("Tenant B received tenant A chunks.");
    }

    checks.push("search:cross-tenant-empty");

    if (hasOpenAIConfig()) {
      const { createQueryEmbedding } = await import("@/ai/embeddings");
      const embedding = await createQueryEmbedding(
        "qual a garantia do cimento queimado",
      );

      await seedFaqChunk(
        sql,
        tenantAId,
        "Garantia semântica",
        targetContent,
        embedding,
      );

      const semanticResult = await searchKnowledge(tenantAId, {
        query: "garantia cimento queimado interno",
        topK: 3,
      });

      if (!semanticResult.ok) {
        throw new Error(semanticResult.error);
      }

      if (semanticResult.data.source !== "semantic") {
        throw new Error("Expected semantic search when embeddings exist.");
      }

      if (
        !semanticResult.data.chunks[0]?.content.includes("garantia de 5 anos")
      ) {
        throw new Error("Semantic search did not return the expected chunk.");
      }

      checks.push("search:semantic-relevant");
    } else {
      checks.push("search:semantic-skipped-no-openai");
    }

    await cleanupTenant(sql, tenantAId);
    await cleanupTenant(sql, tenantBId);
    checks.push("cleanup:ok");

    await sql.end();

    return NextResponse.json({
      ok: true,
      issue: "ISSUE-022",
      checks,
    });
  } catch (error: unknown) {
    await sql`DELETE FROM tenants WHERE slug IN (${tenantASlug}, ${tenantBSlug})`;
    await sql.end();

    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ ok: false, error: message, checks }, { status: 500 });
  }
}
