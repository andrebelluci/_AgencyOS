import Link from "next/link";

import { ConversionFunnel } from "@/components/dashboard/conversion-funnel";
import { MetricCard } from "@/components/dashboard/metric-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { requireOwnerTenant } from "@/lib/auth/require-owner";
import {
  getConversionFunnelMetrics,
  getDashboardMetrics,
} from "@/modules/dashboard/service";

export default async function DashboardPage() {
  const { tenant } = await requireOwnerTenant();
  const [metrics, funnel7d] = await Promise.all([
    getDashboardMetrics(tenant.id),
    getConversionFunnelMetrics(tenant.id, "7d"),
  ]);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Visão geral do seu Funcionário Digital.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          label="Total de conversas"
          value={metrics.totalConversations}
        />
        <MetricCard label="Total de leads" value={metrics.totalLeads} />
        <MetricCard
          label="Leads da semana"
          value={metrics.leadsThisWeek}
        />
      </div>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight">
              Funil de conversão
            </h2>
            <p className="text-sm text-muted-foreground">
              Últimos 7 dias — sessões → mensagens → leads → WhatsApp.
            </p>
          </div>
          <Link
            href="/dashboard/conversion"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Ver 7d / 30d
          </Link>
        </div>

        <ConversionFunnel metrics={funnel7d} />
      </section>
    </div>
  );
}
