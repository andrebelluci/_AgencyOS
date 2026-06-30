import { MetricCard } from "@/components/dashboard/metric-card";
import type { ConversionFunnelMetrics } from "@/modules/dashboard/types";

type ConversionFunnelProps = {
  metrics: ConversionFunnelMetrics;
};

const FUNNEL_STEPS = [
  { key: "chatSessions" as const, label: "Sessões de chat" },
  { key: "messages" as const, label: "Mensagens" },
  { key: "leads" as const, label: "Leads criados" },
  { key: "whatsappClicks" as const, label: "Cliques WhatsApp" },
];

export function ConversionFunnel({ metrics }: ConversionFunnelProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {FUNNEL_STEPS.map((step) => (
        <MetricCard
          key={step.key}
          label={step.label}
          value={metrics[step.key]}
        />
      ))}
    </div>
  );
}
