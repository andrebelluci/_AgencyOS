/**
 * Apply migration 0010 (assistant_label) to the DB pointed by DATABASE_URL.
 *
 *   npx tsx --env-file=.env.local scripts/apply-migration-0010.ts
 *   npx tsx --env-file=.env scripts/apply-migration-0010.ts
 */
import postgres from "postgres";

const PROD_REF = "heofpktpncugzrzmkzwk";
const DEV_REF = "dcvqeqdpokhzqgfylpts";

function getRef(url: string): string {
  try {
    return new URL(url).hostname.split(".")[0] ?? "";
  } catch {
    return "";
  }
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }

  const ref = getRef(databaseUrl);
  const target =
    ref === PROD_REF ? "prod" : ref === DEV_REF ? "dev" : `unknown (${ref})`;

  const sql = postgres(databaseUrl, { prepare: false, max: 1 });

  try {
    const before = await sql<{ column_name: string }[]>`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'tenant_settings'
        AND column_name = 'assistant_label'
    `;

    console.log(`Target: ${target}`);
    console.log(
      `Before: ${before.map((row) => row.column_name).join(", ") || "(none)"}`,
    );

    await sql.unsafe(`
      ALTER TABLE "tenant_settings"
      ADD COLUMN IF NOT EXISTS "assistant_label" text
    `);

    const after = await sql<{ column_name: string }[]>`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'tenant_settings'
        AND column_name = 'assistant_label'
    `;

    console.log(`After: ${after.map((row) => row.column_name).join(", ")}`);
    console.log("Migration 0010 applied (idempotent).");
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
