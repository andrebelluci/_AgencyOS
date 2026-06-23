import "server-only";

import { z } from "zod";

import type { Lead } from "@/lib/db";
import { updateLead as updateLeadService } from "@/modules/leads/service";

const leadStatusSchema = z.enum([
  "novo",
  "qualificado",
  "proposta",
  "fechado",
  "perdido",
]);

const leadScoreSchema = z.enum(["baixo", "médio", "alto"]);

export const updateLeadInputSchema = z.object({
  leadId: z.string().uuid("Informe um ID de lead válido."),
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

export type UpdateLeadInput = z.infer<typeof updateLeadInputSchema>;

export type UpdateLeadResult =
  | { ok: true; data: Lead }
  | { ok: false; error: string };

export async function updateLead(
  tenantId: string,
  input: unknown,
): Promise<UpdateLeadResult> {
  const parsed = updateLeadInputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues.map((issue) => issue.message).join("; "),
    };
  }

  const { leadId, ...fields } = parsed.data;

  try {
    const data = await updateLeadService(tenantId, leadId, fields);

    if (!data) {
      return { ok: false, error: "Lead not found." };
    }

    return { ok: true, data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update lead.";
    return { ok: false, error: message };
  }
}
