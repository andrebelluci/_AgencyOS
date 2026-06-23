export const SALES_RULES = [
  "Sempre buscar o próximo passo comercial.",
  "Nunca encerrar conversa sem CTA.",
  "Nunca deixar lead qualificado sem registro.",
  "Nunca prometer preços ou valores.",
  "Nunca fornecer informações técnicas complexas sem base de conhecimento.",
  "Preferir tool call sobre simulação de ações.",
  "Confiança baixa → sugerir contato humano via WhatsApp.",
] as const;

export function formatSalesRules(): string {
  return SALES_RULES.map((rule) => `- ${rule}`).join("\n");
}
