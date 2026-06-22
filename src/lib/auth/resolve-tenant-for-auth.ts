import "server-only";

import { headers } from "next/headers";
import { notFound } from "next/navigation";

import type { Tenant } from "@/lib/db";
import {
  DEFAULT_PLATFORM_DOMAIN,
  DEV_TENANT_SLUG,
  TENANT_HEADER_ID,
  TENANT_HEADER_PUBLIC_KEY,
  TENANT_HEADER_SLUG,
} from "@/lib/tenant/constants";
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

function resolveSlugFromHost(host: string): string | null {
  if (host === "localhost" || host === "127.0.0.1") {
    return DEV_TENANT_SLUG;
  }

  const platformDomain =
    process.env.PLATFORM_DOMAIN?.trim() || DEFAULT_PLATFORM_DOMAIN;

  if (host === platformDomain || host === `www.${platformDomain}`) {
    return null;
  }

  const suffix = `.${platformDomain}`;
  if (host.endsWith(suffix)) {
    const slug = host.slice(0, -suffix.length);
    if (slug && !slug.includes(".")) {
      return slug;
    }
  }

  return null;
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
  const slugFromHost = resolveSlugFromHost(host);

  if (slugFromHost) {
    return assertActiveTenant(await findTenantBySlug(slugFromHost));
  }

  notFound();
}
