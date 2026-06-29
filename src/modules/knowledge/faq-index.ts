import "server-only";

import { createDocumentEmbeddings } from "@/ai/embeddings";
import { hasOpenAIConfig } from "@/env";
import { logStructured } from "@/lib/logging";

import { formatFaqChunkContent } from "./faq-format";
import { upsertFaqChunkIndexed } from "./repository";

/**
 * Indexes FAQ content as a single chunk (question + answer) with optional embedding.
 */
export async function indexFaqChunk(
  tenantId: string,
  documentId: string,
  question: string,
  answer: string,
): Promise<{ content: string; embedded: boolean }> {
  const content = formatFaqChunkContent(question, answer);

  let embedding: number[] | undefined;

  if (hasOpenAIConfig()) {
    const [vector] = await createDocumentEmbeddings([content]);
    embedding = vector;
  }

  await upsertFaqChunkIndexed(tenantId, documentId, content, embedding);

  logStructured({
    level: "info",
    message: "faq_indexed",
    metric: true,
    tenant_id: tenantId,
    document_id: documentId,
    embedded: Boolean(embedding),
    content_length: content.length,
  });

  return { content, embedded: Boolean(embedding) };
}

export { formatFaqChunkContent, parseFaqAnswerFromChunk } from "./faq-format";
