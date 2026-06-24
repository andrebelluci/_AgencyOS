import "server-only";

import { mergeConversationMetadata } from "@/lib/db/conversation-metadata";
import {
  getConversation,
  updateConversation,
} from "@/modules/conversations/service";
import { findTenantByPublicKey } from "@/modules/tenants/repository";

import { ChatApiError } from "./service";

export async function recordWhatsAppClick(
  publicKey: string,
  conversationId: string,
): Promise<void> {
  const tenant = await findTenantByPublicKey(publicKey.trim());

  if (!tenant || tenant.status !== "active") {
    throw new ChatApiError("Tenant not found.", 404);
  }

  const conversation = await getConversation(tenant.id, conversationId);

  if (!conversation) {
    throw new ChatApiError("Conversation not found.", 404);
  }

  if (conversation.metadata?.whatsapp_clicked_at) {
    return;
  }

  const updated = await updateConversation(tenant.id, conversationId, {
    metadata: mergeConversationMetadata(conversation.metadata, {
      whatsapp_clicked_at: new Date().toISOString(),
    }),
  });

  if (!updated) {
    throw new ChatApiError("Failed to record WhatsApp click.", 500);
  }
}
