import "server-only";

import { listAllTenants } from "@/modules/tenants/admin-repository";

import { fetchPlatformMetrics } from "./repository";
import type { PlatformMetrics, TenantListItem } from "./types";

export async function getPlatformMetrics(): Promise<PlatformMetrics> {
  return fetchPlatformMetrics();
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
