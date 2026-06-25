import "server-only";

import { createQueryEmbedding } from "@/ai/embeddings";
import { hasOpenAIConfig } from "@/env";

import {
  countEmbeddedChunks,
  deleteFaqById,
  findFaqById,
  findFaqsByTenant,
  insertFaq,
  searchSemanticChunks,
  searchTextChunks,
  updateFaqById,
} from "./repository";
import type {
  CreateFaqInput,
  FaqItem,
  KnowledgeSearchResult,
  UpdateFaqInput,
} from "./types";

const DEFAULT_TOP_K = 5;
const MIN_SEMANTIC_SCORE = 0.2;

export async function listFaqs(tenantId: string): Promise<FaqItem[]> {
  return findFaqsByTenant(tenantId);
}

export async function getFaq(
  tenantId: string,
  id: string,
): Promise<FaqItem | null> {
  const row = await findFaqById(tenantId, id);
  return row ?? null;
}

export async function createFaq(
  tenantId: string,
  input: CreateFaqInput,
): Promise<FaqItem> {
  return insertFaq(tenantId, input);
}

export async function updateFaq(
  tenantId: string,
  id: string,
  input: UpdateFaqInput,
): Promise<FaqItem | null> {
  const row = await updateFaqById(tenantId, id, input);
  return row ?? null;
}

export async function deleteFaq(
  tenantId: string,
  id: string,
): Promise<boolean> {
  return deleteFaqById(tenantId, id);
}

export async function searchKnowledge(
  tenantId: string,
  query: string,
  topK: number = DEFAULT_TOP_K,
): Promise<KnowledgeSearchResult> {
  const trimmed = query.trim();

  if (!trimmed) {
    return { chunks: [], source: "none" };
  }

  const limit = Math.min(Math.max(topK, 1), 10);
  const hasEmbeddings = (await countEmbeddedChunks(tenantId)) > 0;

  if (hasOpenAIConfig() && hasEmbeddings) {
    try {
      const embedding = await createQueryEmbedding(trimmed);
      const semanticChunks = await searchSemanticChunks(
        tenantId,
        embedding,
        limit,
      );
      const relevant = semanticChunks.filter(
        (chunk) => chunk.score >= MIN_SEMANTIC_SCORE,
      );

      if (relevant.length > 0) {
        return { chunks: relevant, source: "semantic" };
      }
    } catch {
      // Fall through to text search when embedding or vector query fails.
    }
  }

  const textChunks = await searchTextChunks(tenantId, trimmed, limit);

  if (textChunks.length > 0) {
    return { chunks: textChunks, source: "text" };
  }

  return { chunks: [], source: "none" };
}
