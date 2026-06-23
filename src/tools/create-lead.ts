import "server-only";

import { z } from "zod";

import type { Lead } from "@/lib/db";
import { createLead as createLeadService } from "@/modules/leads/service";

const leadStatusSchema = z.enum([
  "novo",
  "qualificado",
  "proposta",
  "fechado",
  "perdido",
]);

const leadScoreSchema = z.enum(["baixo", "médio", "alto"]);

export const createLeadInputSchema = z.object({
  name: z.string().trim().min(1).optional(),
  email: z
    .string()
    .trim()
    .email("Informe um e-mail válido.")
    .optional()
    .nullable(),
  phone: z.string().trim().min(8, "Informe um telefone válido.").optional(),
  city: z.string().trim().min(1).optional(),
  source: z.string().trim().min(1).optional(),
  status: leadStatusSchema.optional(),
  score: leadScoreSchema.optional().nullable(),
  notes: z.string().trim().optional().nullable(),
});

export type CreateLeadInput = z.infer<typeof createLeadInputSchema>;

export type CreateLeadResult =
  | { ok: true; data: Lead }
  | { ok: false; error: string };

export async function createLead(
  tenantId: string,
  input: unknown,
): Promise<CreateLeadResult> {
  const parsed = createLeadInputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues.map((issue) => issue.message).join("; "),
    };
  }

  try {
    const data = await createLeadService(tenantId, {
      ...parsed.data,
      source: parsed.data.source ?? "chat",
      status: parsed.data.status ?? "novo",
    });

    return { ok: true, data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create lead.";
    return { ok: false, error: message };
  }
}
