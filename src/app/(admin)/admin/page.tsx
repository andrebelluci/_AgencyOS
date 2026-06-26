import Link from "next/link";

import { MetricCard } from "@/components/dashboard/metric-card";
import { buttonVariants } from "@/components/ui/button";
import { getPlatformMetrics } from "@/modules/platform-admin/service";
import { cn } from "@/lib/utils";

export default async function AdminOverviewPage() {
  const metrics = await getPlatformMetrics();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Platform Admin
          </h1>
          <p className="text-sm text-muted-foreground">
            Visão operacional cross-tenant da plataforma.
          </p>
        </div>
        <Link href="/admin/tenants/new" className={cn(buttonVariants())}>
          Novo tenant
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total de tenants" value={metrics.totalTenants} />
        <MetricCard
          label="Leads (7 dias)"
          value={metrics.leadsLast7Days}
        />
        <MetricCard
          label="Conversas (7 dias)"
          value={metrics.conversationsLast7Days}
        />
        <MetricCard
          label="Mensagens (7 dias)"
          value={metrics.messagesLast7Days}
        />
      </div>
    </div>
  );
}
