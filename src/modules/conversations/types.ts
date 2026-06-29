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

export type ConversationSearchFilters = {
  query?: string;
  startedFrom?: Date;
  startedTo?: Date;
};

export type ConversationListItem = Conversation & {
  startedAtLabel: string;
  leadName: string | null;
};

export type MessageListItem = Message & {
  createdAtLabel: string;
};
