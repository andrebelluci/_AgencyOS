import { MetricCard } from "@/components/dashboard/metric-card";
import { requireOwnerTenant } from "@/lib/auth/require-owner";
import { getDashboardMetrics } from "@/modules/dashboard/service";

export default async function DashboardPage() {
  const { tenant } = await requireOwnerTenant();
  const metrics = await getDashboardMetrics(tenant.id);

  return (
    <div className="space-y-6">
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
    </div>
  );
}
