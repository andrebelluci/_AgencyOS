import "server-only";

import type { User as AuthUser } from "@supabase/supabase-js";

import type { User } from "@/lib/db";
import { createUser, findUserById } from "@/modules/users/repository";

export async function linkUserToTenant(
  authUser: AuthUser,
  tenantId: string,
): Promise<User> {
  const existing = await findUserById(authUser.id);

  if (existing) {
    // Hostname may resolve to PLATFORM_APEX_TENANT_SLUG on *.vercel.app while the
    // owner was provisioned on another slug — trust the DB link from provisioning.
    return existing;
  }

  const email = authUser.email;
  if (!email) {
    throw new Error("Authenticated user has no email.");
  }

  return createUser({
    id: authUser.id,
    tenantId,
    email,
    name: null,
  });
}
