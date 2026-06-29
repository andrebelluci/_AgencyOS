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
import {
  logKnowledgeSearch,
  mergeSearchChunks,
  resolveSearchSource,
} from "./search-utils";
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
    const empty = { chunks: [], source: "none" as const };
    logKnowledgeSearch(tenantId, trimmed, empty);
    return empty;
  }

  const limit = Math.min(Math.max(topK, 1), 10);
  let semanticChunks: Awaited<ReturnType<typeof searchSemanticChunks>> = [];

  const hasEmbeddings = (await countEmbeddedChunks(tenantId)) > 0;

  if (hasOpenAIConfig() && hasEmbeddings) {
    try {
      const embedding = await createQueryEmbedding(trimmed);
      const rawSemantic = await searchSemanticChunks(
        tenantId,
        embedding,
        limit,
      );
      semanticChunks = rawSemantic.filter(
        (chunk) => chunk.score >= MIN_SEMANTIC_SCORE,
      );
    } catch {
      // Fall through to text search when embedding or vector query fails.
    }
  }

  const textChunks = await searchTextChunks(tenantId, trimmed, limit);
  const merged = mergeSearchChunks(semanticChunks, textChunks, limit);
  const source = resolveSearchSource(merged, semanticChunks, textChunks);

  const result: KnowledgeSearchResult = {
    chunks: merged,
    source,
  };

  logKnowledgeSearch(tenantId, trimmed, result);

  return result;
}
