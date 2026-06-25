import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts } from "pdf-lib";
import postgres from "postgres";

import { hasOpenAIConfig } from "@/env";
import { processPdfBuffer } from "@/modules/knowledge/pdf-pipeline";
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
    VALUES (${`PDF Pipeline ${slug}`}, ${slug}, ${`pk-${slug}`}, 'active')
    RETURNING id
  `;

  if (!tenant) {
    throw new Error(`Failed to create tenant ${slug}.`);
  }

  return tenant.id;
}

async function createSamplePdf(text: string): Promise<Buffer> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  page.drawText(text, {
    x: 50,
    y: 700,
    size: 12,
    font,
    maxWidth: 500,
    lineHeight: 16,
  });

  const bytes = await pdf.save();
  return Buffer.from(bytes);
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
  const tenantSlug = `pdf-${suffix}`;

  try {
    const tenantId = await createTenant(sql, tenantSlug);
    const uniquePhrase =
      "O revestimento epóxi premium possui garantia de 7 anos contra bolhas em pisos internos.";

    const pdfBuffer = await createSamplePdf(
      `${uniquePhrase} Este documento descreve condições comerciais, prazos de entrega e política de garantia para clientes corporativos.`,
    );

    const [document] = await sql<{ id: string }[]>`
      INSERT INTO knowledge_documents (tenant_id, title, type, status)
      VALUES (${tenantId}::uuid, 'Catálogo epóxi', 'pdf', 'processing')
      RETURNING id
    `;

    if (!document) {
      throw new Error("Failed to create PDF document.");
    }

    const chunkCount = await processPdfBuffer(tenantId, document.id, pdfBuffer);

    if (chunkCount === 0) {
      throw new Error("PDF pipeline produced zero chunks.");
    }

    checks.push("pdf:extract-chunk");

    await sql`
      UPDATE knowledge_documents
      SET status = 'ready'
      WHERE id = ${document.id}::uuid
    `;

    checks.push("pdf:status-ready");

    const searchResult = await searchKnowledge(tenantId, {
      query: "garantia epóxi pisos internos",
      topK: 3,
    });

    if (!searchResult.ok) {
      throw new Error(searchResult.error);
    }

    if (searchResult.data.chunks.length === 0) {
      throw new Error("searchKnowledge returned no chunks for PDF content.");
    }

    const hasPhrase = searchResult.data.chunks.some((chunk) =>
      chunk.content.includes("garantia de 7 anos"),
    );

    if (!hasPhrase) {
      throw new Error("PDF content is not searchable via searchKnowledge.");
    }

    checks.push("pdf:searchable");

    if (hasOpenAIConfig()) {
      const embeddingRows = await sql<{ count: string }[]>`
        SELECT COUNT(*)::text AS count
        FROM knowledge_chunks
        WHERE tenant_id = ${tenantId}::uuid
          AND document_id = ${document.id}::uuid
          AND embedding IS NOT NULL
      `;

      if (Number(embeddingRows[0]?.count ?? 0) === 0) {
        throw new Error("Expected embeddings on PDF chunks when OpenAI is configured.");
      }

      checks.push("pdf:embeddings");
    } else {
      checks.push("pdf:embeddings-skipped-no-openai");
    }

    await cleanupTenant(sql, tenantId);
    checks.push("cleanup:ok");
    await sql.end();

    return NextResponse.json({
      ok: true,
      issue: "ISSUE-024",
      checks,
    });
  } catch (error: unknown) {
    await sql`DELETE FROM tenants WHERE slug = ${tenantSlug}`;
    await sql.end();

    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ ok: false, error: message, checks }, { status: 500 });
  }
}
