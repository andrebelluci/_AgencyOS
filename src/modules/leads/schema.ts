import { z } from "zod";

export const leadStatusSchema = z.enum([
  "novo",
  "qualificado",
  "proposta",
  "fechado",
  "perdido",
]);

export const updateLeadStatusSchema = z.object({
  leadId: z.string().uuid("Lead inválido."),
  status: leadStatusSchema,
});

export type LeadStatus = z.infer<typeof leadStatusSchema>;
