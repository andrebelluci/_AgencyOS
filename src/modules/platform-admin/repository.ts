import "server-only";

import { count, gte, sql } from "drizzle-orm";

import { conversations, getDb, leads, messages, tenants } from "@/lib/db";

import type { PlatformMetrics } from "./types";

function getSevenDaysAgo(): Date {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - 7);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

/** Uma round-trip ao Postgres para todas as métricas (evita timeout no serverless). */
export async function fetchPlatformMetrics(): Promise<PlatformMetrics> {
  const since = getSevenDaysAgo();
  const db = getDb();

  const result = await db.execute<{
    total_tenants: number;
    leads_last_7_days: number;
    conversations_last_7_days: number;
    messages_last_7_days: number;
  }>(sql`
    SELECT
      (SELECT count(*)::int FROM ${tenants}) AS total_tenants,
      (SELECT count(*)::int FROM ${leads} WHERE ${leads.createdAt} >= ${since}) AS leads_last_7_days,
      (SELECT count(*)::int FROM ${conversations} WHERE ${conversations.createdAt} >= ${since}) AS conversations_last_7_days,
      (SELECT count(*)::int FROM ${messages} WHERE ${messages.createdAt} >= ${since}) AS messages_last_7_days
  `);

  const row = result[0];

  return {
    totalTenants: row?.total_tenants ?? 0,
    leadsLast7Days: row?.leads_last_7_days ?? 0,
    conversationsLast7Days: row?.conversations_last_7_days ?? 0,
    messagesLast7Days: row?.messages_last_7_days ?? 0,
  };
}

export async function countAllTenants(): Promise<number> {
  const [row] = await getDb().select({ count: count() }).from(tenants);
  return row?.count ?? 0;
}

export async function countLeadsLast7Days(): Promise<number> {
  const since = getSevenDaysAgo();
  const [row] = await getDb()
    .select({ count: count() })
    .from(leads)
    .where(gte(leads.createdAt, since));

  return row?.count ?? 0;
}

export async function countConversationsLast7Days(): Promise<number> {
  const since = getSevenDaysAgo();
  const [row] = await getDb()
    .select({ count: count() })
    .from(conversations)
    .where(gte(conversations.createdAt, since));

  return row?.count ?? 0;
}

export async function countMessagesLast7Days(): Promise<number> {
  const since = getSevenDaysAgo();
  const [row] = await getDb()
    .select({ count: count() })
    .from(messages)
    .where(gte(messages.createdAt, since));

  return row?.count ?? 0;
}
