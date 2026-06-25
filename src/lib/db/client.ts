import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

function getDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL?.trim();

  if (!raw) {
    throw new Error(
      "DATABASE_URL is required. Set it in .env.local — see docs/SUPABASE_SETUP.md.",
    );
  }

  return normalizeDatabaseUrl(raw);
}

/** Use Supabase transaction pooler (6543) when a direct session URL (5432) is set. */
function normalizeDatabaseUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const isSupabaseDbHost = /db\.[a-z0-9]+\.supabase\.co$/i.test(
      parsed.hostname,
    );

    if (isSupabaseDbHost && (parsed.port === "5432" || parsed.port === "")) {
      parsed.port = "6543";
    }

    if (isSupabaseDbHost) {
      parsed.searchParams.set("pgbouncer", "true");
      parsed.searchParams.set("sslmode", "require");
    }

    return parsed.toString();
  } catch {
    // keep original if URL parsing fails
  }

  return url;
}

type DbGlobal = {
  sql?: ReturnType<typeof postgres>;
  db?: ReturnType<typeof drizzle<typeof schema>>;
};

const globalForDb = globalThis as unknown as DbGlobal;

function getSql() {
  if (!globalForDb.sql) {
    globalForDb.sql = postgres(getDatabaseUrl(), {
      prepare: false,
      max: 1,
      idle_timeout: 20,
      connect_timeout: 15,
    });
  }

  return globalForDb.sql;
}

export function getDb() {
  if (!globalForDb.db) {
    globalForDb.db = drizzle(getSql(), { schema });
  }

  return globalForDb.db;
}
