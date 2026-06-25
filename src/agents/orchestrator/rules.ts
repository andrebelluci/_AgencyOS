import type { UserIntent } from "./types";

const PRICING_PATTERNS = [
  /\b(quanto custa|preço|preco|valor|orçamento|orcamento|quanto fica|quanto sai)\b/i,
  /\b(custo|investimento|tabela de preços|tabela de precos)\b/i,
];

const SUPPORT_PATTERNS = [
  /\b(garantia|prazo|como funciona|documentação|documentacao|manual)\b/i,
  /\b(dúvida|duvida|ajuda|suporte|problema|defeito)\b/i,
];

const COMMERCIAL_PATTERNS = [
  /\b(quero|gostaria|tenho interesse|me interesso|preciso de)\b/i,
  /\b(agendar|marcar|reunião|reuniao|visita|orçar|orcar)\b/i,
  /\b(contato|telefone|whatsapp|falar com|atendimento)\b/i,
  /\b(serviço|servico|reforma|aplicar|aplicação|aplicacao)\b/i,
];

export const ORCHESTRATOR_RULES = [
  "Nunca inventar respostas.",
  "Nunca executar tarefas fora da função de roteamento.",
  "Sempre escolher o agente mais adequado disponível.",
  "No V0.1, apenas o Sales Agent está disponível.",
  "Intenções de preço ou suporte devem ir ao Sales com hints apropriados.",
] as const;

export function classifyIntent(message: string): UserIntent {
  const text = message.trim();

  if (text.length === 0) {
    return "general";
  }

  if (PRICING_PATTERNS.some((pattern) => pattern.test(text))) {
    return "pricing";
  }

  if (SUPPORT_PATTERNS.some((pattern) => pattern.test(text))) {
    return "support";
  }

  if (COMMERCIAL_PATTERNS.some((pattern) => pattern.test(text))) {
    return "commercial";
  }

  return "general";
}

export function routingHintsForIntent(intent: UserIntent): string[] {
  switch (intent) {
    case "pricing":
      return [
        "O visitante busca informações de preço.",
        "Não informe valores. Explique que um consultor fará a avaliação.",
        "Qualifique o lead e incentive o próximo passo comercial.",
      ];
    case "support":
      return [
        "O visitante tem dúvida operacional ou técnica.",
        "Chame searchKnowledge antes de responder perguntas factuais.",
        "Responda apenas com base nos chunks retornados pela busca.",
        "Se a busca não retornar contexto, admita a limitação e sugira contato humano via WhatsApp.",
      ];
    case "commercial":
      return [
        "O visitante demonstra interesse comercial.",
        "Priorize qualificação e captura de contato.",
        "Sempre busque o próximo passo (WhatsApp ou reunião).",
      ];
  }

  return [
    "Conduza a conversa de forma comercial e acolhedora.",
    "Identifique necessidade e busque qualificar o visitante.",
  ];
}
