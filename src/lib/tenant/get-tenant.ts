import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import type { Tenant } from "@/lib/db";
import {
  findTenantById,
  findTenantByPublicKey,
  findTenantBySlug,
} from "@/modules/tenants/repository";

import {
  TENANT_HEADER_ID,
  TENANT_HEADER_PUBLIC_KEY,
  TENANT_HEADER_SLUG,
} from "./constants";

function assertActiveTenant(tenant: Tenant | undefined): Tenant {
  if (!tenant || tenant.status !== "active") {
    notFound();
  }

  return tenant;
}

async function resolveFromHeaders(): Promise<Tenant> {
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

  notFound();
}

/**
 * Retorna o tenant da requisição atual (headers definidos pelo middleware).
 * Lança notFound() se não houver tenant válido.
 */
export const getTenant = cache(resolveFromHeaders);

async function resolveFromHeadersOrNull(): Promise<Tenant | null> {
  const headersList = await headers();

  const tenantId = headersList.get(TENANT_HEADER_ID)?.trim();
  if (tenantId) {
    const tenant = await findTenantById(tenantId);
    return tenant?.status === "active" ? tenant : null;
  }

  const slug = headersList.get(TENANT_HEADER_SLUG)?.trim();
  if (slug) {
    const tenant = await findTenantBySlug(slug);
    return tenant?.status === "active" ? tenant : null;
  }

  const publicKey = headersList.get(TENANT_HEADER_PUBLIC_KEY)?.trim();
  if (publicKey) {
    const tenant = await findTenantByPublicKey(publicKey);
    return tenant?.status === "active" ? tenant : null;
  }

  return null;
}

/**
 * Retorna o tenant ou null sem disparar 404 (útil para rotas opcionais).
 */
export const getTenantOrNull = cache(resolveFromHeadersOrNull);
