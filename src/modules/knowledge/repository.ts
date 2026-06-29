import "server-only";

import { and, desc, eq, sql } from "drizzle-orm";

import { formatVectorForPg } from "@/ai/embeddings";
import {
  getDb,
  knowledgeChunks,
  knowledgeDocuments,
  type KnowledgeDocument,
} from "@/lib/db";

import type {
  CreateFaqInput,
  FaqItem,
  KnowledgeDocumentStatus,
  KnowledgeSearchChunk,
  PdfDocumentItem,
  UpdateFaqInput,
} from "./types";
import { parseFaqAnswerFromChunk } from "./faq-format";

const DEFAULT_TOP_K = 5;

type ChunkRow = {
  id: string;
  document_id: string;
  document_type: "faq" | "pdf";
  content: string;
  position: number;
  score: number;
};

function mapChunkRow(row: ChunkRow, source: KnowledgeSearchChunk["source"]) {
  return {
    id: row.id,
    documentId: row.document_id,
    documentType: row.document_type,
    content: row.content,
    position: row.position,
    score: Number(row.score),
    source,
  };
}

async function findFaqChunk(tenantId: string, documentId: string) {
  const [row] = await getDb()
    .select()
    .from(knowledgeChunks)
    .where(
      and(
        eq(knowledgeChunks.documentId, documentId),
        eq(knowledgeChunks.tenantId, tenantId),
      ),
    )
    .limit(1);

  return row;
}

function toFaqItem(document: KnowledgeDocument, chunkContent: string): FaqItem {
  return {
    id: document.id,
    question: document.title,
    answer: parseFaqAnswerFromChunk(chunkContent),
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  };
}

export async function findFaqsByTenant(tenantId: string): Promise<FaqItem[]> {
  const rows = await getDb()
    .select({
      id: knowledgeDocuments.id,
      question: knowledgeDocuments.title,
      answer: knowledgeChunks.content,
      createdAt: knowledgeDocuments.createdAt,
      updatedAt: knowledgeDocuments.updatedAt,
    })
    .from(knowledgeDocuments)
    .leftJoin(
      knowledgeChunks,
      and(
        eq(knowledgeChunks.documentId, knowledgeDocuments.id),
        eq(knowledgeChunks.tenantId, tenantId),
      ),
    )
    .where(
      and(
        eq(knowledgeDocuments.tenantId, tenantId),
        eq(knowledgeDocuments.type, "faq"),
      ),
    )
    .orderBy(desc(knowledgeDocuments.createdAt));

  return rows.map((row) => ({
    id: row.id,
    question: row.question,
    answer: parseFaqAnswerFromChunk(row.answer ?? ""),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }));
}

export async function findFaqById(
  tenantId: string,
  id: string,
): Promise<FaqItem | undefined> {
  const [document] = await getDb()
    .select()
    .from(knowledgeDocuments)
    .where(
      and(
        eq(knowledgeDocuments.id, id),
        eq(knowledgeDocuments.tenantId, tenantId),
        eq(knowledgeDocuments.type, "faq"),
      ),
    )
    .limit(1);

  if (!document) {
    return undefined;
  }

  const chunk = await findFaqChunk(tenantId, document.id);
  return toFaqItem(document, chunk?.content ?? "");
}

export async function insertFaq(
  tenantId: string,
  input: CreateFaqInput,
): Promise<FaqItem> {
  const db = getDb();

  const [document] = await db
    .insert(knowledgeDocuments)
    .values({
      tenantId,
      title: input.question,
      type: "faq",
      status: "ready",
    })
    .returning();

  if (!document) {
    throw new Error("Failed to create FAQ document.");
  }

  const { indexFaqChunk } = await import("./faq-index");
  const indexed = await indexFaqChunk(
    tenantId,
    document.id,
    input.question,
    input.answer,
  );

  return toFaqItem(document, indexed.content);
}

export async function updateFaqById(
  tenantId: string,
  id: string,
  input: UpdateFaqInput,
): Promise<FaqItem | undefined> {
  const existing = await findFaqById(tenantId, id);
  if (!existing) {
    return undefined;
  }

  const question = input.question ?? existing.question;
  const answer = input.answer ?? existing.answer;

  const [document] = await getDb()
    .update(knowledgeDocuments)
    .set({ title: question })
    .where(
      and(
        eq(knowledgeDocuments.id, id),
        eq(knowledgeDocuments.tenantId, tenantId),
        eq(knowledgeDocuments.type, "faq"),
      ),
    )
    .returning();

  if (!document) {
    return undefined;
  }

  const { indexFaqChunk } = await import("./faq-index");
  const indexed = await indexFaqChunk(tenantId, id, question, answer);

  return toFaqItem(document, indexed.content);
}

export async function deleteFaqById(
  tenantId: string,
  id: string,
): Promise<boolean> {
  const [row] = await getDb()
    .delete(knowledgeDocuments)
    .where(
      and(
        eq(knowledgeDocuments.id, id),
        eq(knowledgeDocuments.tenantId, tenantId),
        eq(knowledgeDocuments.type, "faq"),
      ),
    )
    .returning();

  return row !== undefined;
}

function toPdfDocumentItem(document: KnowledgeDocument): PdfDocumentItem {
  return {
    id: document.id,
    title: document.title,
    status: document.status,
    fileUrl: document.fileUrl,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  };
}

export async function findPdfDocumentsByTenant(
  tenantId: string,
): Promise<PdfDocumentItem[]> {
  const rows = await getDb()
    .select()
    .from(knowledgeDocuments)
    .where(
      and(
        eq(knowledgeDocuments.tenantId, tenantId),
        eq(knowledgeDocuments.type, "pdf"),
      ),
    )
    .orderBy(desc(knowledgeDocuments.createdAt));

  return rows.map(toPdfDocumentItem);
}

export async function findPdfDocumentById(
  tenantId: string,
  id: string,
): Promise<PdfDocumentItem | undefined> {
  const [document] = await getDb()
    .select()
    .from(knowledgeDocuments)
    .where(
      and(
        eq(knowledgeDocuments.id, id),
        eq(knowledgeDocuments.tenantId, tenantId),
        eq(knowledgeDocuments.type, "pdf"),
      ),
    )
    .limit(1);

  return document ? toPdfDocumentItem(document) : undefined;
}

export async function deletePdfDocumentById(
  tenantId: string,
  id: string,
): Promise<PdfDocumentItem | undefined> {
  const [row] = await getDb()
    .delete(knowledgeDocuments)
    .where(
      and(
        eq(knowledgeDocuments.id, id),
        eq(knowledgeDocuments.tenantId, tenantId),
        eq(knowledgeDocuments.type, "pdf"),
      ),
    )
    .returning();

  return row ? toPdfDocumentItem(row) : undefined;
}

export async function insertPdfDocument(
  tenantId: string,
  title: string,
): Promise<PdfDocumentItem> {
  const [document] = await getDb()
    .insert(knowledgeDocuments)
    .values({
      tenantId,
      title,
      type: "pdf",
      status: "pending",
    })
    .returning();

  if (!document) {
    throw new Error("Failed to create PDF document.");
  }

  return toPdfDocumentItem(document);
}

export async function updateDocumentStatus(
  tenantId: string,
  documentId: string,
  status: KnowledgeDocumentStatus,
  fileUrl?: string | null,
): Promise<PdfDocumentItem | undefined> {
  const [document] = await getDb()
    .update(knowledgeDocuments)
    .set({
      status,
      ...(fileUrl !== undefined ? { fileUrl } : {}),
    })
    .where(
      and(
        eq(knowledgeDocuments.id, documentId),
        eq(knowledgeDocuments.tenantId, tenantId),
      ),
    )
    .returning();

  return document ? toPdfDocumentItem(document) : undefined;
}

export async function deleteChunksByDocumentId(
  tenantId: string,
  documentId: string,
): Promise<void> {
  await getDb()
    .delete(knowledgeChunks)
    .where(
      and(
        eq(knowledgeChunks.documentId, documentId),
        eq(knowledgeChunks.tenantId, tenantId),
      ),
    );
}

type ChunkInsert = {
  content: string;
  position: number;
  embedding?: number[];
};

export async function insertChunks(
  tenantId: string,
  documentId: string,
  chunks: ChunkInsert[],
): Promise<void> {
  if (chunks.length === 0) {
    return;
  }

  const db = getDb();

  for (const chunk of chunks) {
    if (chunk.embedding) {
      const vector = formatVectorForPg(chunk.embedding);
      await db.execute(sql`
        INSERT INTO knowledge_chunks (tenant_id, document_id, content, position, embedding)
        VALUES (
          ${tenantId}::uuid,
          ${documentId}::uuid,
          ${chunk.content},
          ${chunk.position},
          ${vector}::vector
        )
      `);
      continue;
    }

    await db.insert(knowledgeChunks).values({
      tenantId,
      documentId,
      content: chunk.content,
      position: chunk.position,
    });
  }
}

export async function upsertFaqChunkIndexed(
  tenantId: string,
  documentId: string,
  content: string,
  embedding?: number[],
): Promise<void> {
  const existing = await findFaqChunk(tenantId, documentId);
  const db = getDb();

  if (existing) {
    if (embedding) {
      const vector = formatVectorForPg(embedding);
      await db.execute(sql`
        UPDATE knowledge_chunks
        SET content = ${content}, embedding = ${vector}::vector
        WHERE id = ${existing.id}::uuid
          AND tenant_id = ${tenantId}::uuid
      `);
      return;
    }

    await db
      .update(knowledgeChunks)
      .set({ content })
      .where(
        and(
          eq(knowledgeChunks.id, existing.id),
          eq(knowledgeChunks.tenantId, tenantId),
        ),
      );
    return;
  }

  await insertChunks(tenantId, documentId, [
    { content, position: 0, embedding },
  ]);
}

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
      c.id,
      c.document_id,
      d.type AS document_type,
      c.content,
      c.position,
      (1 - (c.embedding <=> ${vector}::vector))::float8 AS score
    FROM knowledge_chunks c
    INNER JOIN knowledge_documents d
      ON d.id = c.document_id
      AND d.tenant_id = c.tenant_id
    WHERE c.tenant_id = ${tenantId}::uuid
      AND c.embedding IS NOT NULL
    ORDER BY c.embedding <=> ${vector}::vector
    LIMIT ${topK}
  `);

  const rows = result as unknown as ChunkRow[];

  return rows.map((row) => mapChunkRow(row, "semantic"));
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
      c.id,
      c.document_id,
      d.type AS document_type,
      c.content,
      c.position,
      GREATEST(
        CASE WHEN c.content ILIKE ${pattern} THEN 1.0 ELSE 0.0 END,
        CASE WHEN d.title ILIKE ${pattern} THEN 0.95 ELSE 0.0 END,
        ts_rank(
          to_tsvector('portuguese', c.content || ' ' || d.title),
          plainto_tsquery('portuguese', ${query})
        )
      )::float8 AS score
    FROM knowledge_chunks c
    INNER JOIN knowledge_documents d
      ON d.id = c.document_id
      AND d.tenant_id = c.tenant_id
    WHERE c.tenant_id = ${tenantId}::uuid
      AND (
        c.content ILIKE ${pattern}
        OR d.title ILIKE ${pattern}
        OR to_tsvector('portuguese', c.content || ' ' || d.title)
          @@ plainto_tsquery('portuguese', ${query})
      )
    ORDER BY score DESC, c.position ASC
    LIMIT ${topK}
  `);

  const rows = result as unknown as ChunkRow[];

  return rows.map((row) => mapChunkRow(row, "text"));
}
