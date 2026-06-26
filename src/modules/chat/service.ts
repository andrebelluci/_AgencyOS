import "server-only";

import { randomUUID } from "node:crypto";

import type { TenantSettingsPromptSource } from "@/agents/shared/prompt-builder";
import { streamSalesAgent } from "@/ai/sales-stream";
import type { StreamChatEvent } from "@/ai/types";
import type { TenantSettings } from "@/lib/db";
import {
  createConversation,
  createMessage,
  getConversation,
  listMessages,
} from "@/modules/conversations/service";
import { getLead } from "@/modules/leads/service";
import { getTenantSettings } from "@/modules/settings/service";
import { findTenantByPublicKey } from "@/modules/tenants/repository";
import { assertActiveTenantForApi } from "@/modules/tenants/assert-active";
import { buildWhatsAppLink } from "@/tools/build-whatsapp-link";

import type { ChatContext, ChatHistoryResult, PrepareChatInput } from "./types";

export class ChatApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ChatApiError";
  }
}

function toTenantSettingsPromptSource(
  settings: TenantSettings,
): TenantSettingsPromptSource {
  return {
    companyName: settings.companyName,
    city: settings.city,
    services: settings.services,
    whatsapp: settings.whatsapp,
    email: settings.email,
    address: settings.address,
    systemPrompt: settings.systemPrompt,
  };
}

async function resolveOrCreateConversation(
  tenantId: string,
  conversationId: string | undefined,
  visitorId: string | undefined,
): Promise<{ conversationId: string; leadId: string | null }> {
  if (conversationId) {
    const conversation = await getConversation(tenantId, conversationId);
    if (!conversation) {
      throw new ChatApiError("Conversation not found.", 404);
    }

    return {
      conversationId: conversation.id,
      leadId: conversation.leadId,
    };
  }

  const conversation = await createConversation(tenantId, {
    visitorId: visitorId?.trim() || randomUUID(),
  });

  return {
    conversationId: conversation.id,
    leadId: conversation.leadId,
  };
}

export async function getChatHistory(
  publicKey: string,
  conversationId: string,
): Promise<ChatHistoryResult> {
  const tenant = await findTenantByPublicKey(publicKey);

  const activeTenant = assertActiveTenantForApi(tenant, ChatApiError);

  const conversation = await getConversation(activeTenant.id, conversationId);

  if (!conversation) {
    throw new ChatApiError("Conversation not found.", 404);
  }

  const settings = await getTenantSettings(activeTenant.id);
  const storedMessages = await listMessages(activeTenant.id, conversationId);

  const messages = storedMessages
    .filter((row) => row.role === "user" || row.role === "assistant")
    .map((row) => ({
      id: row.id,
      role: row.role as "user" | "assistant",
      content: row.content,
    }));

  let whatsappUrl: string | null = null;

  if (settings?.whatsapp?.trim() && conversation.leadId) {
    const lead = await getLead(activeTenant.id, conversation.leadId);

    if (lead) {
      const link = buildWhatsAppLink({
        phone: settings.whatsapp,
        leadName: lead.name?.trim() || undefined,
      });

      if (link.ok) {
        whatsappUrl = link.url;
      }
    }
  }

  return {
    conversationId,
    messages,
    whatsappUrl,
  };
}

export async function prepareChatContext(
  input: PrepareChatInput,
): Promise<ChatContext> {
  const tenant = await findTenantByPublicKey(input.publicKey);

  const activeTenant = assertActiveTenantForApi(tenant, ChatApiError);

  const settings = await getTenantSettings(activeTenant.id);
  if (!settings) {
    throw new ChatApiError("Tenant settings not found.", 404);
  }

  const { conversationId, leadId } = await resolveOrCreateConversation(
    activeTenant.id,
    input.conversationId,
    input.visitorId,
  );

  return {
    tenantId: activeTenant.id,
    conversationId,
    leadId,
    tenantSettings: toTenantSettingsPromptSource(settings),
  };
}

export async function* streamChatResponse(
  context: ChatContext,
  message: string,
): AsyncGenerator<StreamChatEvent> {
  await createMessage(context.tenantId, {
    conversationId: context.conversationId,
    role: "user",
    content: message,
  });

  const storedMessages = await listMessages(
    context.tenantId,
    context.conversationId,
  );

  const history = storedMessages
    .filter((row) => row.role === "user" || row.role === "assistant")
    .slice(0, -1)
    .map((row) => ({
      role: row.role as "user" | "assistant",
      content: row.content,
    }));

  yield { type: "meta", conversationId: context.conversationId };

  let assistantContent = "";

  for await (const event of streamSalesAgent({
    tenantId: context.tenantId,
    conversationId: context.conversationId,
    message,
    leadId: context.leadId,
    tenantSettings: context.tenantSettings,
    history,
  })) {
    if (event.type === "token") {
      assistantContent += event.content;
    }

    if (event.type === "done") {
      assistantContent = event.content;
    }

    yield event;
  }

  const trimmed = assistantContent.trim();
  if (trimmed) {
    await createMessage(context.tenantId, {
      conversationId: context.conversationId,
      role: "assistant",
      content: trimmed,
    });
  }
}
