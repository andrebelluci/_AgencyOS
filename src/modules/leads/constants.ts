import type { Lead } from "@/lib/db";

import type { LeadStatus } from "./schema";

export const LEAD_STATUS_OPTIONS: Array<{
  value: LeadStatus;
  label: string;
}> = [
  { value: "novo", label: "Novo" },
  { value: "qualificado", label: "Qualificado" },
  { value: "proposta", label: "Proposta" },
  { value: "fechado", label: "Fechado" },
  { value: "perdido", label: "Perdido" },
];

export const LEAD_STATUS_LABELS: Record<Lead["status"], string> = {
  novo: "Novo",
  qualificado: "Qualificado",
  proposta: "Proposta",
  fechado: "Fechado",
  perdido: "Perdido",
};

export const LEAD_SCORE_LABELS: Record<NonNullable<Lead["score"]>, string> = {
  baixo: "Baixo",
  médio: "Médio",
  alto: "Alto",
};
