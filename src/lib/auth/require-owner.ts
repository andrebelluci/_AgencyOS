import "server-only";

import { notFound, redirect } from "next/navigation";

import { linkUserToTenant } from "@/lib/auth/link-user-tenant";
import { requireSession } from "@/lib/auth/require-session";
import { getTenant } from "@/lib/tenant/get-tenant";
import { findTenantById } from "@/modules/tenants/repository";
import { findUserById } from "@/modules/users/repository";

export async function requireOwnerTenant() {
  const { user } = await requireSession();

  let dbUser = await findUserById(user.id);

  if (!dbUser) {
    const hostnameTenant = await getTenant();
    dbUser = await linkUserToTenant(user, hostnameTenant.id);
  }

  const tenant = await findTenantById(dbUser.tenantId);

  if (!tenant || tenant.status !== "active") {
    notFound();
  }

  if (dbUser.role !== "owner") {
    redirect("/login");
  }

  return { user, tenant, dbUser };
}
