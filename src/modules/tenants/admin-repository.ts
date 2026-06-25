import "server-only";

import { desc, eq } from "drizzle-orm";

import { getDb, tenants, type Tenant } from "@/lib/db";

export async function listAllTenants(): Promise<Tenant[]> {
  return getDb().select().from(tenants).orderBy(desc(tenants.createdAt));
}

export async function updateTenantStatus(
  tenantId: string,
  status: "active" | "inactive",
): Promise<Tenant | undefined> {
  const [row] = await getDb()
    .update(tenants)
    .set({ status, updatedAt: new Date() })
    .where(eq(tenants.id, tenantId))
    .returning();

  return row;
}
