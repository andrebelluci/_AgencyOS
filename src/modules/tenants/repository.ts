import "server-only";

import { eq } from "drizzle-orm";

import { getDb, tenants, type Tenant } from "@/lib/db";

export async function findTenantById(id: string): Promise<Tenant | undefined> {
  const [row] = await getDb()
    .select()
    .from(tenants)
    .where(eq(tenants.id, id))
    .limit(1);

  return row;
}

export async function findTenantBySlug(slug: string): Promise<Tenant | undefined> {
  const [row] = await getDb()
    .select()
    .from(tenants)
    .where(eq(tenants.slug, slug))
    .limit(1);

  return row;
}

export async function findTenantByPublicKey(
  publicKey: string,
): Promise<Tenant | undefined> {
  const [row] = await getDb()
    .select()
    .from(tenants)
    .where(eq(tenants.publicKey, publicKey))
    .limit(1);

  return row;
}
