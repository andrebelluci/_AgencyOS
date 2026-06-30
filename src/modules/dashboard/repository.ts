import "server-only";

import { and, count, eq, gte, sql } from "drizzle-orm";

import { conversations, getDb, leads } from "@/lib/db";

import type { ConversionFunnelMetrics, ConversionPeriod } from "./types";

function getPeriodStart(period: ConversionPeriod): Date {
  const days = period === "30d" ? 30 : 7;
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

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

/** Single round-trip for conversion funnel metrics (tenant-scoped, period-filtered). */
export async function fetchConversionFunnelMetrics(
  tenantId: string,
  period: ConversionPeriod,
): Promise<ConversionFunnelMetrics> {
  const since = getPeriodStart(period);
  const sinceIso = since.toISOString();
  const db = getDb();

  const result = await db.execute<{
    chat_sessions: number;
    messages: number;
    leads: number;
    whatsapp_clicks: number;
  }>(sql`
    SELECT
      (SELECT count(*)::int FROM conversations
        WHERE tenant_id = ${tenantId}::uuid
          AND started_at >= ${sinceIso}::timestamptz) AS chat_sessions,
      (SELECT count(*)::int FROM messages
        WHERE tenant_id = ${tenantId}::uuid
          AND created_at >= ${sinceIso}::timestamptz) AS messages,
      (SELECT count(*)::int FROM leads
        WHERE tenant_id = ${tenantId}::uuid
          AND created_at >= ${sinceIso}::timestamptz) AS leads,
      (SELECT count(*)::int FROM conversations
        WHERE tenant_id = ${tenantId}::uuid
          AND metadata->>'whatsapp_clicked_at' IS NOT NULL
          AND (metadata->>'whatsapp_clicked_at')::timestamptz >= ${sinceIso}::timestamptz) AS whatsapp_clicks
  `);

  const row = result[0];

  return {
    period,
    chatSessions: row?.chat_sessions ?? 0,
    messages: row?.messages ?? 0,
    leads: row?.leads ?? 0,
    whatsappClicks: row?.whatsapp_clicks ?? 0,
  };
}
