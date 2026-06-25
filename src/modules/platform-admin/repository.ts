import "server-only";

import { count, gte } from "drizzle-orm";

import { conversations, getDb, leads, messages, tenants } from "@/lib/db";

function getSevenDaysAgo(): Date {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - 7);
  date.setUTCHours(0, 0, 0, 0);
  return date;
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
