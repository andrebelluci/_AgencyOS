import "server-only";

import {
  countConversationsByTenant,
  countLeadsByTenant,
  countLeadsThisWeekByTenant,
} from "./repository";
import type { DashboardMetrics } from "./types";

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
