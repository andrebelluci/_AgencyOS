import { requireOwnerTenant } from "@/lib/auth/require-owner";
import { listConversations } from "@/modules/conversations/service";
import { listLeads } from "@/modules/leads/service";
import type { ConversationListItem } from "@/modules/conversations/types";

import { ConversationsPanel } from "./conversations-panel";

function formatConversationDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(date);
}

export default async function ConversationsPage() {
  const { tenant } = await requireOwnerTenant();
  const [conversations, leads] = await Promise.all([
    listConversations(tenant.id),
    listLeads(tenant.id),
  ]);

  const leadNameById = new Map(
    leads.map((lead) => [lead.id, lead.name?.trim() || null]),
  );

  const conversationItems: ConversationListItem[] = conversations.map(
    (conversation) => ({
      ...conversation,
      startedAtLabel: formatConversationDate(conversation.startedAt),
      leadName: conversation.leadId
        ? (leadNameById.get(conversation.leadId) ?? null)
        : null,
    }),
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Conversas</h1>
        <p className="text-sm text-muted-foreground">
          Visualize o histórico completo das conversas do assistente virtual.
        </p>
      </div>

      <ConversationsPanel conversations={conversationItems} />
    </div>
  );
}
