import type { TenantSettingsPromptSource } from "@/agents/shared/prompt-builder";

export type ChatContext = {
  tenantId: string;
  conversationId: string;
  leadId: string | null;
  tenantSettings: TenantSettingsPromptSource;
};

export type PrepareChatInput = {
  publicKey: string;
  message: string;
  conversationId?: string;
  visitorId?: string;
};

export type ChatHistoryMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type ChatHistoryResult = {
  conversationId: string;
  messages: ChatHistoryMessage[];
  whatsappUrl: string | null;
};
