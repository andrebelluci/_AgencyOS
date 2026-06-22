import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL?.trim();

  if (!url) {
    throw new Error(
      "DATABASE_URL is required. Set it in .env.local — see docs/SUPABASE_SETUP.md.",
    );
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
    globalForDb.sql = postgres(getDatabaseUrl(), { prepare: false });
  }

  return globalForDb.sql;
}

export function getDb() {
  if (!globalForDb.db) {
    globalForDb.db = drizzle(getSql(), { schema });
  }

  return globalForDb.db;
}
