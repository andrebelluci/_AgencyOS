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
    if (existing.tenantId !== tenantId) {
      throw new Error("User is linked to a different tenant.");
    }

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
