import "server-only";

import { and, desc, eq } from "drizzle-orm";

import {
  getDb,
  knowledgeChunks,
  knowledgeDocuments,
  type KnowledgeDocument,
} from "@/lib/db";

import type { CreateFaqInput, FaqItem, UpdateFaqInput } from "./types";

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

function toFaqItem(
  document: KnowledgeDocument,
  answer: string,
): FaqItem {
  return {
    id: document.id,
    question: document.title,
    answer,
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
    answer: row.answer ?? "",
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

  const [chunk] = await db
    .insert(knowledgeChunks)
    .values({
      tenantId,
      documentId: document.id,
      content: input.answer,
      position: 0,
    })
    .returning();

  if (!chunk) {
    throw new Error("Failed to create FAQ chunk.");
  }

  return toFaqItem(document, chunk.content);
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

  const chunk = await findFaqChunk(tenantId, id);

  if (chunk) {
    await getDb()
      .update(knowledgeChunks)
      .set({ content: answer })
      .where(
        and(
          eq(knowledgeChunks.id, chunk.id),
          eq(knowledgeChunks.tenantId, tenantId),
        ),
      );
  } else {
    await getDb().insert(knowledgeChunks).values({
      tenantId,
      documentId: id,
      content: answer,
      position: 0,
    });
  }

  return toFaqItem(document, answer);
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
