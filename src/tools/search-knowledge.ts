import "server-only";

import { z } from "zod";

import { logStructured } from "@/lib/logging";

import { searchKnowledge as searchKnowledgeService } from "@/modules/knowledge/service";
import type { KnowledgeSearchResult } from "@/modules/knowledge/types";

export const searchKnowledgeInputSchema = z.object({
  query: z.string().trim().min(1, "Informe uma consulta."),
  topK: z.number().int().min(1).max(10).optional(),
});

export type SearchKnowledgeInput = z.infer<typeof searchKnowledgeInputSchema>;

export type SearchKnowledgeResult =
  | { ok: true; data: KnowledgeSearchResult }
  | { ok: false; error: string };

export async function searchKnowledge(
  tenantId: string,
  input: unknown,
): Promise<SearchKnowledgeResult> {
  const parsed = searchKnowledgeInputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues.map((issue) => issue.message).join("; "),
    };
  }

  try {
    const data = await searchKnowledgeService(
      tenantId,
      parsed.data.query,
      parsed.data.topK,
    );

    logStructured({
      level: "info",
      message: "search_knowledge_tool_called",
      metric: true,
      tenant_id: tenantId,
      query: parsed.data.query,
      top_k: parsed.data.topK ?? 5,
      result_count: data.chunks.length,
      source: data.source,
    });

    return { ok: true, data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to search knowledge.";
    return { ok: false, error: message };
  }
}
