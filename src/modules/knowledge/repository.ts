import "server-only";

import { sql } from "drizzle-orm";

import { formatVectorForPg } from "@/ai/embeddings";
import { getDb } from "@/lib/db";

import type { KnowledgeSearchChunk } from "./types";

const DEFAULT_TOP_K = 5;

type ChunkRow = {
  id: string;
  document_id: string;
  content: string;
  position: number;
  score: number;
};

export async function countEmbeddedChunks(tenantId: string): Promise<number> {
  const db = getDb();
  const result = await db.execute<{ count: string }>(sql`
    SELECT COUNT(*)::text AS count
    FROM knowledge_chunks
    WHERE tenant_id = ${tenantId}::uuid
      AND embedding IS NOT NULL
  `);

  const [row] = result as unknown as { count: string }[];
  return Number(row?.count ?? 0);
}

export async function searchSemanticChunks(
  tenantId: string,
  embedding: number[],
  topK: number = DEFAULT_TOP_K,
): Promise<KnowledgeSearchChunk[]> {
  const vector = formatVectorForPg(embedding);
  const db = getDb();

  const result = await db.execute<ChunkRow>(sql`
    SELECT
      id,
      document_id,
      content,
      position,
      (1 - (embedding <=> ${vector}::vector))::float8 AS score
    FROM knowledge_chunks
    WHERE tenant_id = ${tenantId}::uuid
      AND embedding IS NOT NULL
    ORDER BY embedding <=> ${vector}::vector
    LIMIT ${topK}
  `);

  const rows = result as unknown as ChunkRow[];

  return rows.map((row) => ({
    id: row.id,
    documentId: row.document_id,
    content: row.content,
    position: row.position,
    score: Number(row.score),
    source: "semantic",
  }));
}

export async function searchTextChunks(
  tenantId: string,
  query: string,
  topK: number = DEFAULT_TOP_K,
): Promise<KnowledgeSearchChunk[]> {
  const db = getDb();
  const pattern = `%${query.trim()}%`;

  const result = await db.execute<ChunkRow>(sql`
    SELECT
      id,
      document_id,
      content,
      position,
      GREATEST(
        CASE WHEN content ILIKE ${pattern} THEN 1.0 ELSE 0.0 END,
        ts_rank(
          to_tsvector('portuguese', content),
          plainto_tsquery('portuguese', ${query})
        )
      )::float8 AS score
    FROM knowledge_chunks
    WHERE tenant_id = ${tenantId}::uuid
      AND (
        content ILIKE ${pattern}
        OR to_tsvector('portuguese', content) @@ plainto_tsquery('portuguese', ${query})
      )
    ORDER BY score DESC, position ASC
    LIMIT ${topK}
  `);

  const rows = result as unknown as ChunkRow[];

  return rows.map((row) => ({
    id: row.id,
    documentId: row.document_id,
    content: row.content,
    position: row.position,
    score: Number(row.score),
    source: "text",
  }));
}
