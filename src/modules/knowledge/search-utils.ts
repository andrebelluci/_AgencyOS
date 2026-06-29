import "server-only";

import { logStructured } from "@/lib/logging";

import type { KnowledgeSearchChunk, KnowledgeSearchResult } from "./types";

export function logKnowledgeSearch(
  tenantId: string,
  query: string,
  result: KnowledgeSearchResult,
): void {
  const chunks = result.chunks;
  const topScore = chunks[0]?.score ?? null;
  const documentTypes = [
    ...new Set(chunks.map((chunk) => chunk.documentType).filter(Boolean)),
  ];

  const base = {
    tenant_id: tenantId,
    query,
    result_count: chunks.length,
    source: result.source,
    top_score: topScore,
    document_types: documentTypes,
    chunk_ids: chunks.map((chunk) => chunk.id),
    chunk_scores: chunks.map((chunk) => ({
      id: chunk.id,
      score: chunk.score,
      document_type: chunk.documentType,
      source: chunk.source,
    })),
  };

  if (chunks.length === 0) {
    logStructured({
      level: "info",
      message: "knowledge_search_empty",
      metric: true,
      ...base,
    });
    return;
  }

  logStructured({
    level: "info",
    message: "knowledge_search_completed",
    metric: true,
    ...base,
  });
}

export function mergeSearchChunks(
  semantic: KnowledgeSearchChunk[],
  text: KnowledgeSearchChunk[],
  topK: number,
): KnowledgeSearchChunk[] {
  const byId = new Map<string, KnowledgeSearchChunk>();

  for (const chunk of [...semantic, ...text]) {
    const existing = byId.get(chunk.id);
    if (!existing || chunk.score > existing.score) {
      byId.set(chunk.id, chunk);
    }
  }

  return [...byId.values()]
    .sort((a, b) => b.score - a.score || a.position - b.position)
    .slice(0, topK);
}

export function resolveSearchSource(
  merged: KnowledgeSearchChunk[],
  semantic: KnowledgeSearchChunk[],
  text: KnowledgeSearchChunk[],
): KnowledgeSearchResult["source"] {
  if (merged.length === 0) {
    return "none";
  }

  const hasSemantic = semantic.some((chunk) =>
    merged.some((item) => item.id === chunk.id),
  );
  const hasText = text.some((chunk) =>
    merged.some((item) => item.id === chunk.id),
  );

  if (hasSemantic && hasText) {
    return merged[0]?.source ?? "semantic";
  }

  if (hasSemantic) {
    return "semantic";
  }

  return "text";
}
