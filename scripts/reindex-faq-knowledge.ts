/**
 * Reindex all FAQ chunks (question + answer format + embeddings).
 *
 *   npx tsx --env-file=.env.local scripts/reindex-faq-knowledge.ts
 *   npx tsx --env-file=.env scripts/reindex-faq-knowledge.ts
 *   npx tsx --env-file=.env scripts/reindex-faq-knowledge.ts --tenant-slug=dharmalabs
 */
import OpenAI from "openai";
import postgres from "postgres";

import {
  formatFaqChunkContent,
  parseFaqAnswerFromChunk,
} from "../src/modules/knowledge/faq-format";

const EMBEDDING_MODEL = "text-embedding-3-small";

type TenantRow = { id: string; slug: string };
type FaqRow = {
  id: string;
  tenant_id: string;
  question: string;
  answer: string;
};
type ChunkRow = { id: string };

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error("DATABASE_URL is required");
  }
  return url;
}

function getTenantSlugArg(): string | null {
  const arg = process.argv.find((item) => item.startsWith("--tenant-slug="));
  if (!arg) {
    return null;
  }
  return arg.split("=")[1]?.trim() || null;
}

function formatVectorForPg(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}

async function createEmbedding(
  client: OpenAI,
  content: string,
): Promise<number[] | undefined> {
  const response = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: content,
  });

  const embedding = response.data[0]?.embedding;
  return embedding?.length ? embedding : undefined;
}

async function upsertFaqChunk(
  sql: postgres.Sql,
  tenantId: string,
  documentId: string,
  content: string,
  embedding?: number[],
): Promise<boolean> {
  const existing = await sql<ChunkRow[]>`
    SELECT id
    FROM knowledge_chunks
    WHERE tenant_id = ${tenantId}::uuid
      AND document_id = ${documentId}::uuid
      AND position = 0
    LIMIT 1
  `;

  if (existing.length > 0) {
    const chunkId = existing[0]!.id;

    if (embedding) {
      const vector = formatVectorForPg(embedding);
      await sql`
        UPDATE knowledge_chunks
        SET content = ${content}, embedding = ${vector}::vector
        WHERE id = ${chunkId}::uuid
          AND tenant_id = ${tenantId}::uuid
      `;
    } else {
      await sql`
        UPDATE knowledge_chunks
        SET content = ${content}
        WHERE id = ${chunkId}::uuid
          AND tenant_id = ${tenantId}::uuid
      `;
    }

    return Boolean(embedding);
  }

  if (embedding) {
    const vector = formatVectorForPg(embedding);
    await sql`
      INSERT INTO knowledge_chunks (tenant_id, document_id, content, position, embedding)
      VALUES (
        ${tenantId}::uuid,
        ${documentId}::uuid,
        ${content},
        0,
        ${vector}::vector
      )
    `;
  } else {
    await sql`
      INSERT INTO knowledge_chunks (tenant_id, document_id, content, position)
      VALUES (
        ${tenantId}::uuid,
        ${documentId}::uuid,
        ${content},
        0
      )
    `;
  }

  return Boolean(embedding);
}

async function main() {
  const tenantSlug = getTenantSlugArg();
  const sql = postgres(getDatabaseUrl(), { prepare: false, max: 1 });
  const openaiKey = process.env.OPENAI_API_KEY?.trim();
  const openai = openaiKey ? new OpenAI({ apiKey: openaiKey }) : null;

  try {
    const tenants = tenantSlug
      ? await sql<TenantRow[]>`
          SELECT id, slug FROM tenants WHERE slug = ${tenantSlug} LIMIT 1
        `
      : await sql<TenantRow[]>`
          SELECT id, slug FROM tenants WHERE status = 'active' ORDER BY slug
        `;

    if (tenants.length === 0) {
      throw new Error(
        tenantSlug
          ? `Tenant not found: ${tenantSlug}`
          : "No active tenants found.",
      );
    }

    let total = 0;

    for (const tenant of tenants) {
      const faqs = await sql<FaqRow[]>`
        SELECT
          d.id,
          d.tenant_id,
          d.title AS question,
          COALESCE(c.content, '') AS answer
        FROM knowledge_documents d
        LEFT JOIN knowledge_chunks c
          ON c.document_id = d.id
          AND c.tenant_id = d.tenant_id
          AND c.position = 0
        WHERE d.tenant_id = ${tenant.id}::uuid
          AND d.type = 'faq'
        ORDER BY d.created_at ASC
      `;

      console.log(`\nTenant ${tenant.slug}: ${faqs.length} FAQ(s)`);

      for (const faq of faqs) {
        const answer = parseFaqAnswerFromChunk(faq.answer);
        const content = formatFaqChunkContent(faq.question, answer);

        let embedding: number[] | undefined;
        if (openai) {
          embedding = await createEmbedding(openai, content);
        }

        const embedded = await upsertFaqChunk(
          sql,
          faq.tenant_id,
          faq.id,
          content,
          embedding,
        );

        total += 1;
        console.log(
          `  ✓ ${faq.question.slice(0, 60)}${faq.question.length > 60 ? "…" : ""} (embedded: ${embedded})`,
        );
      }
    }

    console.log(`\nReindexed ${total} FAQ(s).`);
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
