import { requireOwnerTenant } from "@/lib/auth/require-owner";
import { listLeads } from "@/modules/leads/service";
import type { LeadListItem } from "@/modules/leads/types";

import { LeadsTable } from "./leads-table";

function formatLeadDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(date);
}

export default async function LeadsPage() {
  const { tenant } = await requireOwnerTenant();
  const leads = await listLeads(tenant.id);

  const leadItems: LeadListItem[] = leads.map((lead) => ({
    ...lead,
    createdAtLabel: formatLeadDate(lead.createdAt),
  }));

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie os leads capturados e atualize o status do CRM.
        </p>
      </div>

      <LeadsTable leads={leadItems} />
    </div>
  );
}
