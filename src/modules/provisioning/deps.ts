import "server-only";

import postgres from "postgres";

import { getServerEnv } from "@/env";
import { createAdminClient } from "@/lib/supabase/admin";

import type { ProvisionTenantDeps } from "./service";

export async function withProvisioningDeps<T>(
  fn: (deps: ProvisionTenantDeps) => Promise<T>,
): Promise<T> {
  const env = getServerEnv();

  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required for tenant provisioning.");
  }

  const sql = postgres(env.DATABASE_URL, { prepare: false, max: 1 });
  const supabase = createAdminClient();

  try {
    return await fn({ sql, supabase });
  } finally {
    await sql.end();
  }
}
