import type { SalesToolName } from "./types";

export type SalesToolDefinition = {
  type: "function";
  function: {
    name: SalesToolName;
    description: string;
    parameters: Record<string, unknown>;
  };
};

export const SALES_TOOL_DEFINITIONS: SalesToolDefinition[] = [
  {
    type: "function",
    function: {
      name: "createLead",
      description:
        "Registra um novo lead no CRM com os dados coletados na conversa.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "Nome do visitante." },
          email: { type: "string", description: "E-mail do visitante." },
          phone: {
            type: "string",
            description: "Telefone do visitante com DDD.",
          },
          city: { type: "string", description: "Cidade do visitante." },
          source: {
            type: "string",
            description: "Origem do lead. Padrão: chat.",
          },
          status: {
            type: "string",
            enum: ["novo", "qualificado", "proposta", "fechado", "perdido"],
          },
          score: {
            type: "string",
            enum: ["baixo", "médio", "alto"],
            description: "Potencial comercial estimado.",
          },
          notes: {
            type: "string",
            description: "Observações da qualificação.",
          },
        },
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "updateLead",
      description: "Atualiza dados de um lead existente.",
      parameters: {
        type: "object",
        properties: {
          leadId: { type: "string", description: "UUID do lead." },
          name: { type: "string" },
          email: { type: "string" },
          phone: { type: "string" },
          city: { type: "string" },
          status: {
            type: "string",
            enum: ["novo", "qualificado", "proposta", "fechado", "perdido"],
          },
          score: { type: "string", enum: ["baixo", "médio", "alto"] },
          notes: { type: "string" },
        },
        required: ["leadId"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "searchKnowledge",
      description:
        "Busca na base de conhecimento da empresa (FAQ, documentos). Use em perguntas factuais sobre garantia, prazo, processo, políticas ou serviços antes de responder.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "Pergunta ou termos de busca em linguagem natural.",
          },
          topK: {
            type: "integer",
            description: "Quantidade máxima de trechos (1-10). Padrão: 5.",
            minimum: 1,
            maximum: 10,
          },
        },
        required: ["query"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "buildWhatsAppLink",
      description:
        "Gera link wa.me para continuar o atendimento no WhatsApp da empresa.",
      parameters: {
        type: "object",
        properties: {
          phone: {
            type: "string",
            description: "Telefone de destino com DDD.",
          },
          message: {
            type: "string",
            description: "Mensagem pré-preenchida opcional.",
          },
          leadName: {
            type: "string",
            description: "Nome do lead para personalizar a mensagem.",
          },
        },
        required: ["phone"],
        additionalProperties: false,
      },
    },
  },
];

export function getSalesToolNames(): SalesToolName[] {
  return SALES_TOOL_DEFINITIONS.map((tool) => tool.function.name);
}
