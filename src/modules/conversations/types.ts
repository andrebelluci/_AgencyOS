import type { Conversation, Message } from "@/lib/db";

export type CreateConversationInput = {
  visitorId: string;
  leadId?: string | null;
  status?: Conversation["status"];
};

export type UpdateConversationInput = {
  leadId?: string | null;
  status?: Conversation["status"];
  endedAt?: Date | null;
  metadata?: Conversation["metadata"];
};

export type CreateMessageInput = {
  conversationId: string;
  role: Message["role"];
  content: string;
};

export type UpdateMessageInput = {
  content: string;
};
