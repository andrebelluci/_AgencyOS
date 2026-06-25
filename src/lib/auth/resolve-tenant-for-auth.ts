import "server-only";

import { headers } from "next/headers";
import { notFound } from "next/navigation";

import type { Tenant } from "@/lib/db";
import {
  TENANT_HEADER_ID,
  TENANT_HEADER_PUBLIC_KEY,
  TENANT_HEADER_SLUG,
} from "@/lib/tenant/constants";
import { resolveSlugFromHostname } from "@/lib/tenant/resolve-hostname";
import {
  findTenantById,
  findTenantByPublicKey,
  findTenantBySlug,
} from "@/modules/tenants/repository";

function assertActiveTenant(tenant: Tenant | undefined): Tenant {
  if (!tenant || tenant.status !== "active") {
    notFound();
  }

  return tenant;
}

/**
 * Resolves tenant for auth flows (login, callback) when middleware headers
 * may be absent on tenant-exempt paths like /login.
 */
export async function resolveTenantForAuth(): Promise<Tenant> {
  const headersList = await headers();

  const tenantId = headersList.get(TENANT_HEADER_ID)?.trim();
  if (tenantId) {
    return assertActiveTenant(await findTenantById(tenantId));
  }

  const slug = headersList.get(TENANT_HEADER_SLUG)?.trim();
  if (slug) {
    return assertActiveTenant(await findTenantBySlug(slug));
  }

  const publicKey = headersList.get(TENANT_HEADER_PUBLIC_KEY)?.trim();
  if (publicKey) {
    return assertActiveTenant(await findTenantByPublicKey(publicKey));
  }

  const host = headersList.get("host")?.split(":")[0] ?? "";
  const slugFromHost = resolveSlugFromHostname(host);

  if (slugFromHost) {
    return assertActiveTenant(await findTenantBySlug(slugFromHost));
  }

  notFound();
}
