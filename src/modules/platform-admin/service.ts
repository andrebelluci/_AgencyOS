import "server-only";

import { listAllTenants } from "@/modules/tenants/admin-repository";

import {
  countAllTenants,
  countConversationsLast7Days,
  countLeadsLast7Days,
  countMessagesLast7Days,
} from "./repository";
import type { PlatformMetrics, TenantListItem } from "./types";

export async function getPlatformMetrics(): Promise<PlatformMetrics> {
  const [
    totalTenants,
    leadsLast7Days,
    conversationsLast7Days,
    messagesLast7Days,
  ] = await Promise.all([
    countAllTenants(),
    countLeadsLast7Days(),
    countConversationsLast7Days(),
    countMessagesLast7Days(),
  ]);

  return {
    totalTenants,
    leadsLast7Days,
    conversationsLast7Days,
    messagesLast7Days,
  };
}

export async function listTenantsForAdmin(): Promise<TenantListItem[]> {
  const rows = await listAllTenants();

  return rows.map((tenant) => ({
    id: tenant.id,
    name: tenant.name,
    slug: tenant.slug,
    publicKey: tenant.publicKey,
    status: tenant.status,
    createdAt: tenant.createdAt,
  }));
}
