import "server-only";

import { and, count, eq, gte } from "drizzle-orm";

import { conversations, getDb, leads } from "@/lib/db";

function getStartOfWeek(date: Date): Date {
  const start = new Date(date);
  const day = start.getUTCDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;
  start.setUTCDate(start.getUTCDate() - daysFromMonday);
  start.setUTCHours(0, 0, 0, 0);
  return start;
}

export async function countConversationsByTenant(
  tenantId: string,
): Promise<number> {
  const [row] = await getDb()
    .select({ count: count() })
    .from(conversations)
    .where(eq(conversations.tenantId, tenantId));

  return row?.count ?? 0;
}

export async function countLeadsByTenant(tenantId: string): Promise<number> {
  const [row] = await getDb()
    .select({ count: count() })
    .from(leads)
    .where(eq(leads.tenantId, tenantId));

  return row?.count ?? 0;
}

export async function countLeadsThisWeekByTenant(
  tenantId: string,
): Promise<number> {
  const weekStart = getStartOfWeek(new Date());

  const [row] = await getDb()
    .select({ count: count() })
    .from(leads)
    .where(
      and(eq(leads.tenantId, tenantId), gte(leads.createdAt, weekStart)),
    );

  return row?.count ?? 0;
}
