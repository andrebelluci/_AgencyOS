import "server-only";

import { redirect } from "next/navigation";

import { linkUserToTenant } from "@/lib/auth/link-user-tenant";
import { requireSession } from "@/lib/auth/require-session";
import { getTenant } from "@/lib/tenant/get-tenant";

export async function requireOwnerTenant() {
  const { user } = await requireSession();
  const tenant = await getTenant();
  const dbUser = await linkUserToTenant(user, tenant.id);

  if (dbUser.role !== "owner") {
    redirect("/login");
  }

  return { user, tenant, dbUser };
}
