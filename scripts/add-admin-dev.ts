/**
 * Idempotently adds platform admin user(s) to the dev Supabase project.
 *
 * Usage:
 *   npm run db:add-admin-dev
 *   npm run db:add-admin-dev -- --email admin@example.com --password "TempPass123"
 *
 * Reads PLATFORM_ADMIN_EMAILS from .env.local when --email is omitted.
 * Refuses to run against production.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";
import postgres from "postgres";

import { DEV_TENANT_SLUG } from "../src/lib/tenant/constants";

const DEV_SUPABASE_REF = "dcvqeqdpokhzqgfylpts";
const PROD_SUPABASE_REF = "heofpktpncugzrzmkzwk";
const DEFAULT_ADMIN_NAME = "Platform Admin";

type CliArgs = {
  email: string;
  password?: string;
  name?: string;
  tenantSlug: string;
};

type TenantRow = {
  id: string;
  slug: string;
};

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

function assertDevTarget(): void {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";

  if (supabaseUrl.includes(PROD_SUPABASE_REF)) {
    throw new Error(
      `Refusing to run: NEXT_PUBLIC_SUPABASE_URL targets production (${PROD_SUPABASE_REF}).`,
    );
  }

  if (!supabaseUrl.includes(DEV_SUPABASE_REF)) {
    throw new Error(
      `Refusing to run: NEXT_PUBLIC_SUPABASE_URL must target dev (${DEV_SUPABASE_REF}).`,
    );
  }
}

function parseAdminEmailsFromEnv(): string[] {
  const raw = process.env.PLATFORM_ADMIN_EMAILS?.trim();
  if (!raw) {
    return [];
  }

  return raw
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

function parseArgs(argv: string[]): CliArgs {
  const args: Record<string, string> = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token?.startsWith("--")) {
      continue;
    }

    const key = token.slice(2);
    const value = argv[index + 1];

    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for --${key}`);
    }

    args[key] = value;
    index += 1;
  }

  const envEmails = parseAdminEmailsFromEnv();
  const email = args.email?.trim() || envEmails[0];

  if (!email || !email.includes("@")) {
    throw new Error(
      "Admin email is required. Set PLATFORM_ADMIN_EMAILS in .env.local or pass --email.",
    );
  }

  return {
    email,
    password: args.password,
    name: args.name?.trim() || DEFAULT_ADMIN_NAME,
    tenantSlug: args.slug?.trim() || DEV_TENANT_SLUG,
  };
}

function generateTempPassword(): string {
  const suffix = randomBytes(6).toString("base64url");
  return `AgencyDev!${suffix}`;
}

async function findTenantBySlug(
  sql: postgres.Sql,
  slug: string,
): Promise<TenantRow | undefined> {
  const rows = await sql<TenantRow[]>`
    SELECT id, slug FROM tenants WHERE slug = ${slug} LIMIT 1
  `;

  return rows[0];
}

async function findAuthUserByEmail(
  supabase: SupabaseClient,
  email: string,
): Promise<{ id: string; email: string } | undefined> {
  const target = email.toLowerCase();
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      throw new Error(`Failed to list auth users: ${error.message}`);
    }

    const match = data.users.find(
      (user) => user.email?.toLowerCase() === target,
    );

    if (match?.email) {
      return { id: match.id, email: match.email };
    }

    if (data.users.length < perPage) {
      return undefined;
    }

    page += 1;
  }
}

async function ensureAuthUser(
  supabase: SupabaseClient,
  email: string,
  password: string | undefined,
  name: string,
  existingAuthId?: string,
): Promise<{ authUserId: string; created: boolean; passwordSet: boolean }> {
  if (existingAuthId) {
    const updates: {
      email: string;
      email_confirm: boolean;
      user_metadata: { name: string };
      password?: string;
    } = {
      email,
      email_confirm: true,
      user_metadata: { name },
    };

    if (password) {
      updates.password = password;
    }

    const { data, error } = await supabase.auth.admin.updateUserById(
      existingAuthId,
      updates,
    );

    if (error) {
      throw new Error(`Failed to update auth user: ${error.message}`);
    }

    if (!data.user) {
      throw new Error("Auth user update returned no user.");
    }

    return {
      authUserId: data.user.id,
      created: false,
      passwordSet: Boolean(password),
    };
  }

  if (!password) {
    throw new Error("Password is required when creating a new auth user.");
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  });

  if (error) {
    throw new Error(`Failed to create auth user: ${error.message}`);
  }

  if (!data.user) {
    throw new Error("Auth user creation returned no user.");
  }

  return { authUserId: data.user.id, created: true, passwordSet: true };
}

async function ensureDbUser(
  sql: postgres.Sql,
  authUserId: string,
  tenantId: string,
  email: string,
  name: string,
): Promise<"created" | "updated" | "unchanged"> {
  const existing = await sql<{
    id: string;
    tenant_id: string;
    role: string;
    email: string;
  }[]>`
    SELECT id, tenant_id, role, email
    FROM users
    WHERE id = ${authUserId}
    LIMIT 1
  `;

  if (existing[0]) {
    if (existing[0].tenant_id !== tenantId) {
      throw new Error(
        `Auth user is already linked to a different tenant (${existing[0].tenant_id}).`,
      );
    }

    if (
      existing[0].role === "owner" &&
      existing[0].email.toLowerCase() === email.toLowerCase()
    ) {
      return "unchanged";
    }

    await sql`
      UPDATE users
      SET email = ${email},
          name = ${name},
          role = 'owner',
          status = 'active',
          updated_at = NOW()
      WHERE id = ${authUserId}
    `;

    return "updated";
  }

  await sql`
    INSERT INTO users (id, tenant_id, email, name, role, status)
    VALUES (
      ${authUserId},
      ${tenantId},
      ${email},
      ${name},
      'owner',
      'active'
    )
  `;

  return "created";
}

async function provisionAdmin(cli: CliArgs): Promise<void> {
  const password = cli.password ?? generateTempPassword();
  const sql = postgres(getDatabaseUrl(), { prepare: false, max: 1 });
  const supabase = getSupabaseAdmin();

  try {
    const tenant = await findTenantBySlug(sql, cli.tenantSlug);
    if (!tenant) {
      throw new Error(
        `Tenant "${cli.tenantSlug}" not found. Run npm run db:seed first.`,
      );
    }

    const existingAuth = await findAuthUserByEmail(supabase, cli.email);
    const passwordForAuth = existingAuth && !cli.password ? undefined : password;
    const { authUserId, created: authCreated, passwordSet } =
      await ensureAuthUser(
        supabase,
        cli.email,
        passwordForAuth,
        cli.name ?? DEFAULT_ADMIN_NAME,
        existingAuth?.id,
      );

    const dbStatus = await ensureDbUser(
      sql,
      authUserId,
      tenant.id,
      cli.email,
      cli.name ?? DEFAULT_ADMIN_NAME,
    );

    const platformAdmins = parseAdminEmailsFromEnv();
    const inAllowlist = platformAdmins.some(
      (entry) => entry.toLowerCase() === cli.email.toLowerCase(),
    );

    console.log("\nPlatform admin provisioned on dev.\n");
    console.log(`  tenant:     ${tenant.slug} (${tenant.id})`);
    console.log(`  auth_user:  ${authUserId} (${authCreated ? "created" : "updated"})`);
    console.log(`  db_user:    ${dbStatus}`);
    console.log(`  email:      ${cli.email}`);
    if (passwordSet) {
      console.log(`  password:   ${password}`);
    } else {
      console.log("  password:   (unchanged — use existing credentials)");
    }
    console.log(`  /admin:     ${inAllowlist ? "allowed (PLATFORM_ADMIN_EMAILS)" : "DENIED — add email to PLATFORM_ADMIN_EMAILS"}`);
    console.log("\nLogin: http://localhost:3000/login");
    console.log("Admin: http://localhost:3000/admin\n");
  } finally {
    await sql.end();
  }
}

async function main() {
  assertDevTarget();
  const cli = parseArgs(process.argv.slice(2));
  await provisionAdmin(cli);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
