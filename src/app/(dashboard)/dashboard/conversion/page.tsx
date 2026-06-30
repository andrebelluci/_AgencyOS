import { Suspense } from "react";

import { ConversionFunnel } from "@/components/dashboard/conversion-funnel";
import { ConversionPeriodSelector } from "@/components/dashboard/conversion-period-selector";
import { requireOwnerTenant } from "@/lib/auth/require-owner";
import {
  conversionPeriodLabel,
  parseConversionPeriod,
} from "@/modules/dashboard/conversion-period";
import { getConversionFunnelMetrics } from "@/modules/dashboard/service";

type ConversionPageProps = {
  searchParams: Promise<{ period?: string }>;
};

export default async function ConversionPage({
  searchParams,
}: ConversionPageProps) {
  const params = await searchParams;
  const period = parseConversionPeriod(params.period);
  const { tenant } = await requireOwnerTenant();
  const metrics = await getConversionFunnelMetrics(tenant.id, period);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Conversão
          </h1>
          <p className="text-sm text-muted-foreground">
            Funil widget → mensagens → leads → WhatsApp.{" "}
            {conversionPeriodLabel(period)}.
          </p>
        </div>

        <Suspense fallback={null}>
          <ConversionPeriodSelector currentPeriod={period} />
        </Suspense>
      </div>

      <ConversionFunnel metrics={metrics} />
    </div>
  );
}
