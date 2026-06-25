import "server-only";

import { z } from "zod";

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

    return { ok: true, data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to search knowledge.";
    return { ok: false, error: message };
  }
}
