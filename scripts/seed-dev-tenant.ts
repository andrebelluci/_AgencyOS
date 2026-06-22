/**
 * ISSUE-004 / ISSUE-010 — Seed idempotente do tenant de desenvolvimento.
 *
 * Uso: npm run db:seed
 */
import postgres from "postgres";

const DEV_TENANT_SLUG = "development";
const DEV_PUBLIC_KEY = "pk_dev_local";
const DEV_COMPANY_NAME = "Belluci Acabamentos (Dev)";

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error("DATABASE_URL is required in .env.local");
  }
  return url;
}

async function main() {
  const sql = postgres(getDatabaseUrl(), { prepare: false, max: 1 });

  const existing = await sql<{ id: string }[]>`
    SELECT id FROM tenants WHERE slug = ${DEV_TENANT_SLUG} LIMIT 1
  `;

  if (existing[0]) {
    console.log(`Tenant "${DEV_TENANT_SLUG}" já existe — seed ignorado.`);
    await sql.end();
    return;
  }

  const [tenant] = await sql<{ id: string }[]>`
    INSERT INTO tenants (name, slug, public_key, status)
    VALUES (${DEV_COMPANY_NAME}, ${DEV_TENANT_SLUG}, ${DEV_PUBLIC_KEY}, 'active')
    RETURNING id
  `;

  if (!tenant) {
    throw new Error("Failed to create development tenant.");
  }

  await sql`
    INSERT INTO tenant_settings (
      tenant_id,
      company_name,
      city,
      services,
      welcome_message,
      primary_color
    )
    VALUES (
      ${tenant.id},
      ${DEV_COMPANY_NAME},
      ${"Mogi Mirim"},
      ${sql.json(["Cimento queimado", "Porcelanato", "Reformas"])},
      ${"Olá! Como posso ajudar você hoje?"},
      ${"#1e40af"}
    )
  `;

  console.log(`Tenant "${DEV_TENANT_SLUG}" criado (public_key: ${DEV_PUBLIC_KEY}).`);
  await sql.end();
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
