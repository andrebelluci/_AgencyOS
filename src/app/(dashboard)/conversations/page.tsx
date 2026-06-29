import { Suspense } from "react";

import { requireOwnerTenant } from "@/lib/auth/require-owner";
import { listConversations } from "@/modules/conversations/service";
import { listLeads } from "@/modules/leads/service";
import type { ConversationListItem } from "@/modules/conversations/types";

import { ConversationsFilters } from "./conversations-filters";
import { ConversationsPanel } from "./conversations-panel";
import {
  hasActiveConversationFilters,
  parseConversationsSearchParams,
  type ConversationsPageSearchParams,
} from "./search-params";

function formatConversationDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(date);
}

type ConversationsPageProps = {
  searchParams: Promise<ConversationsPageSearchParams>;
};

export default async function ConversationsPage({
  searchParams,
}: ConversationsPageProps) {
  const params = await searchParams;
  const { tenant } = await requireOwnerTenant();
  const { filters, ui } = parseConversationsSearchParams(params);
  const hasFilters = hasActiveConversationFilters(filters);

  const [conversations, leads] = await Promise.all([
    listConversations(tenant.id, filters),
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

      <Suspense fallback={null}>
        <ConversationsFilters defaultValues={ui} />
      </Suspense>

      <ConversationsPanel
        conversations={conversationItems}
        hasActiveFilters={hasFilters}
      />
    </div>
  );
}
