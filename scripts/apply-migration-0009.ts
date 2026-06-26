/**
 * Apply migration 0009 to the DB pointed by DATABASE_URL in the active env file.
 *
 *   npx tsx --env-file=.env.local scripts/apply-migration-0009.ts
 *   npx tsx --env-file=.env scripts/apply-migration-0009.ts
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
        AND column_name IN ('initial_message', 'quick_actions')
    `;

    console.log(`Target: ${target}`);
    console.log(`Before: ${before.map((row) => row.column_name).join(", ") || "(none)"}`);

    await sql.unsafe(
      `ALTER TABLE "tenant_settings" ADD COLUMN IF NOT EXISTS "initial_message" text`,
    );
    await sql.unsafe(
      `ALTER TABLE "tenant_settings" ADD COLUMN IF NOT EXISTS "quick_actions" jsonb DEFAULT '[]'::jsonb NOT NULL`,
    );
    await sql.unsafe(`
      UPDATE "tenant_settings"
      SET "initial_message" = COALESCE("initial_message", "welcome_message")
      WHERE "initial_message" IS NULL AND "welcome_message" IS NOT NULL
    `);

    const after = await sql<{ column_name: string }[]>`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'tenant_settings'
        AND column_name IN ('initial_message', 'quick_actions')
    `;

    console.log(`After: ${after.map((row) => row.column_name).join(", ")}`);
    console.log("Migration 0009 applied (idempotent).");
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
