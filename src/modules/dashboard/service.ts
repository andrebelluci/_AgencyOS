import "server-only";

import {
  countConversationsByTenant,
  countLeadsByTenant,
  countLeadsThisWeekByTenant,
  fetchConversionFunnelMetrics,
} from "./repository";
import type {
  ConversionFunnelMetrics,
  ConversionPeriod,
  DashboardMetrics,
} from "./types";

export async function getDashboardMetrics(
  tenantId: string,
): Promise<DashboardMetrics> {
  const [totalConversations, totalLeads, leadsThisWeek] = await Promise.all([
    countConversationsByTenant(tenantId),
    countLeadsByTenant(tenantId),
    countLeadsThisWeekByTenant(tenantId),
  ]);

  return {
    totalConversations,
    totalLeads,
    leadsThisWeek,
  };
}

export async function getConversionFunnelMetrics(
  tenantId: string,
  period: ConversionPeriod,
): Promise<ConversionFunnelMetrics> {
  return fetchConversionFunnelMetrics(tenantId, period);
}
