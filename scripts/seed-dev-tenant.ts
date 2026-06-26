/**
 * ISSUE-010 — Seed idempotente do tenant de desenvolvimento.
 *
 * Cria tenant "Belluci Acabamentos", settings de exemplo, usuário owner no
 * Supabase Auth e registro em `users` vinculado ao tenant.
 *
 * Uso: npm run db:seed
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import postgres from "postgres";

import { DEFAULT_INITIAL_MESSAGE_TEMPLATE } from "../src/lib/widget/initial-message";

const DEV_TENANT_SLUG = "development";
const DEV_PUBLIC_KEY = "pk_dev_local";
const DEV_COMPANY_NAME = "Belluci Acabamentos";
const DEV_OWNER_EMAIL = "owner@belluci.dev";
const DEV_OWNER_PASSWORD = "BelluciDev2026!";
const DEV_OWNER_NAME = "Owner Belluci";
const DEV_OWNER_AUTH_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
const DEV_CITY = "Mogi Mirim";
const DEV_SERVICES = ["Acabamento", "Reforma"];

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error("DATABASE_URL is required in .env.local");
  }
  return url;
}

function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceRoleKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in .env.local",
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

async function ensureAuthUser(supabase: SupabaseClient): Promise<string> {
  const { data: existingById } = await supabase.auth.admin.getUserById(
    DEV_OWNER_AUTH_ID,
  );

  if (existingById.user) {
    return existingById.user.id;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    id: DEV_OWNER_AUTH_ID,
    email: DEV_OWNER_EMAIL,
    password: DEV_OWNER_PASSWORD,
    email_confirm: true,
    user_metadata: { name: DEV_OWNER_NAME },
  });

  if (error) {
    throw new Error(`Failed to create auth user: ${error.message}`);
  }

  if (!data.user) {
    throw new Error("Auth user creation returned no user.");
  }

  return data.user.id;
}

async function ensureDbUser(
  sql: postgres.Sql,
  authUserId: string,
  tenantId: string,
): Promise<void> {
  const existing = await sql<{ id: string }[]>`
    SELECT id FROM users WHERE id = ${authUserId} LIMIT 1
  `;

  if (existing[0]) {
    return;
  }

  await sql`
    INSERT INTO users (id, tenant_id, email, name, role, status)
    VALUES (
      ${authUserId},
      ${tenantId},
      ${DEV_OWNER_EMAIL},
      ${DEV_OWNER_NAME},
      'owner',
      'active'
    )
  `;
}

async function ensureTenantSettings(
  sql: postgres.Sql,
  tenantId: string,
): Promise<void> {
  const existing = await sql<{ tenant_id: string }[]>`
    SELECT tenant_id FROM tenant_settings WHERE tenant_id = ${tenantId} LIMIT 1
  `;

  if (existing[0]) {
    return;
  }

  await sql`
    INSERT INTO tenant_settings (
      tenant_id,
      company_name,
      city,
      services,
      welcome_message,
      initial_message,
      quick_actions,
      primary_color,
      whatsapp
    )
    VALUES (
      ${tenantId},
      ${DEV_COMPANY_NAME},
      ${DEV_CITY},
      ${sql.json(DEV_SERVICES)},
      ${"Olá! Como posso ajudar você hoje?"},
      ${DEFAULT_INITIAL_MESSAGE_TEMPLATE},
      ${sql.json([])},
      ${"#1e40af"},
      ${"5519999999999"}
    )
  `;
}

function logSeedSummary(created: boolean): void {
  console.log(
    created
      ? `Tenant "${DEV_TENANT_SLUG}" criado com sucesso.`
      : `Tenant "${DEV_TENANT_SLUG}" já existe — dados verificados.`,
  );
  console.log(`  Empresa: ${DEV_COMPANY_NAME}`);
  console.log(`  public_key: ${DEV_PUBLIC_KEY}`);
  console.log(`  Login: ${DEV_OWNER_EMAIL} / ${DEV_OWNER_PASSWORD}`);
}

async function main() {
  const sql = postgres(getDatabaseUrl(), { prepare: false, max: 1 });
  const supabase = getSupabaseAdmin();

  const existingTenant = await sql<{ id: string }[]>`
    SELECT id FROM tenants WHERE slug = ${DEV_TENANT_SLUG} LIMIT 1
  `;

  const authUserId = await ensureAuthUser(supabase);

  if (existingTenant[0]) {
    await ensureTenantSettings(sql, existingTenant[0].id);
    await ensureDbUser(sql, authUserId, existingTenant[0].id);
    logSeedSummary(false);
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

  await ensureTenantSettings(sql, tenant.id);
  await ensureDbUser(sql, authUserId, tenant.id);
  logSeedSummary(true);
  await sql.end();
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
