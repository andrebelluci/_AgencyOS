"use server";

import { requireOwnerTenant } from "@/lib/auth/require-owner";
import {
  getConversation,
  listMessages,
} from "@/modules/conversations/service";
import type { MessageListItem } from "@/modules/conversations/types";

export type ConversationMessagesActionState = {
  error?: string;
  messages?: MessageListItem[];
};

function formatMessageDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(date);
}

export async function getConversationMessagesAction(
  conversationId: string,
): Promise<ConversationMessagesActionState> {
  if (!conversationId.trim()) {
    return { error: "Conversa inválida." };
  }

  try {
    const { tenant } = await requireOwnerTenant();
    const conversation = await getConversation(tenant.id, conversationId);

    if (!conversation) {
      return { error: "Conversa não encontrada." };
    }

    const messages = await listMessages(tenant.id, conversationId);

    return {
      messages: messages.map((message) => ({
        ...message,
        createdAtLabel: formatMessageDate(message.createdAt),
      })),
    };
  } catch {
    return { error: "Não foi possível carregar as mensagens." };
  }
}
