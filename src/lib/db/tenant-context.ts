import "server-only";

import { sql } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { getDb } from "./client";
import type * as schema from "./schema";

type Db = PostgresJsDatabase<typeof schema>;
type DbTransaction = Parameters<Parameters<Db["transaction"]>[0]>[0];

/**
 * Runs queries with `SET LOCAL app.tenant_id` for roles without a JWT (e.g. SQL tests).
 * When `auth.uid()` is set, RLS uses the user's tenant from `public.users` instead.
 */
export async function withTenantContext<T>(
  tenantId: string,
  fn: (tx: DbTransaction) => Promise<T>,
): Promise<T> {
  const db = getDb();

  return db.transaction(async (tx) => {
    await tx.execute(
      sql`SELECT set_config('app.tenant_id', ${tenantId}, true)`,
    );
    return fn(tx);
  });
}
