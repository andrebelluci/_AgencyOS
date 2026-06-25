import type { Conversation } from "@/lib/db";

export const CONVERSATION_STATUS_LABELS: Record<Conversation["status"], string> =
  {
    active: "Ativa",
    closed: "Encerrada",
  };

export const MESSAGE_ROLE_LABELS = {
  user: "Visitante",
  assistant: "Assistente",
  system: "Sistema",
} as const;
