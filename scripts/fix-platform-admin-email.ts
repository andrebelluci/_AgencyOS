/**
 * Fix platform admin email and set a shared temporary password.
 *
 *   npx tsx --env-file=.env.local scripts/fix-platform-admin-email.ts
 *   npx tsx --env-file=.env scripts/fix-platform-admin-email.ts
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import postgres from "postgres";

import { DEV_TENANT_SLUG } from "../src/lib/tenant/constants";

const OLD_EMAIL = "andre.belluci@dharmalabs.com.br";
const NEW_EMAIL = "andrebelluci@dharmalabs.com.br";
const TEMP_PASSWORD = "AgencyOS-Temp2026!";
const ADMIN_NAME = "Platform Admin";

const DEV_SUPABASE_REF = "dcvqeqdpokhzqgfylpts";
const PROD_SUPABASE_REF = "heofpktpncugzrzmkzwk";

type AuthUserRef = { id: string; email: string };

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error("DATABASE_URL is required");
  }
  return url;
}

function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceRoleKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required",
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function getProjectRef(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  return new URL(url).hostname.split(".")[0] ?? "";
}

function isDevTarget(): boolean {
  return getProjectRef() === DEV_SUPABASE_REF;
}

function isProdTarget(): boolean {
  return getProjectRef() === PROD_SUPABASE_REF;
}

async function findAuthUserByEmail(
  supabase: SupabaseClient,
  email: string,
): Promise<AuthUserRef | undefined> {
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

async function deleteAuthUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<void> {
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) {
    throw new Error(`Failed to delete auth user ${userId}: ${error.message}`);
  }
}

async function ensureAuthUser(
  supabase: SupabaseClient,
  oldUser: AuthUserRef | undefined,
  newUser: AuthUserRef | undefined,
): Promise<AuthUserRef> {
  if (newUser) {
    const { data, error } = await supabase.auth.admin.updateUserById(newUser.id, {
      email: NEW_EMAIL,
      email_confirm: true,
      password: TEMP_PASSWORD,
      user_metadata: { name: ADMIN_NAME },
    });

    if (error) {
      throw new Error(`Failed to update auth user: ${error.message}`);
    }

    if (!data.user?.email) {
      throw new Error("Auth user update returned no email.");
    }

    if (oldUser && oldUser.id !== newUser.id) {
      await deleteAuthUser(supabase, oldUser.id);
    }

    return { id: data.user.id, email: data.user.email };
  }

  if (oldUser) {
    const { data, error } = await supabase.auth.admin.updateUserById(oldUser.id, {
      email: NEW_EMAIL,
      email_confirm: true,
      password: TEMP_PASSWORD,
      user_metadata: { name: ADMIN_NAME },
    });

    if (error) {
      throw new Error(`Failed to migrate auth user email: ${error.message}`);
    }

    if (!data.user?.email) {
      throw new Error("Auth user migration returned no email.");
    }

    return { id: data.user.id, email: data.user.email };
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: NEW_EMAIL,
    password: TEMP_PASSWORD,
    email_confirm: true,
    user_metadata: { name: ADMIN_NAME },
  });

  if (error) {
    throw new Error(`Failed to create auth user: ${error.message}`);
  }

  if (!data.user?.email) {
    throw new Error("Auth user creation returned no email.");
  }

  return { id: data.user.id, email: data.user.email };
}

async function ensureDevDbUser(
  sql: postgres.Sql,
  authUserId: string,
): Promise<"created" | "updated" | "unchanged"> {
  const tenantRows = await sql<{ id: string }[]>`
    SELECT id FROM tenants WHERE slug = ${DEV_TENANT_SLUG} LIMIT 1
  `;
  const tenantId = tenantRows[0]?.id;
  if (!tenantId) {
    throw new Error(
      `Tenant "${DEV_TENANT_SLUG}" not found. Run npm run db:seed first.`,
    );
  }

  const existing = await sql<{
    id: string;
    tenant_id: string;
    role: string;
    email: string;
  }[]>`
    SELECT id, tenant_id, role, email
    FROM users
    WHERE id = ${authUserId}
       OR lower(email) IN (${OLD_EMAIL.toLowerCase()}, ${NEW_EMAIL.toLowerCase()})
  `;

  const byId = existing.find((row) => row.id === authUserId);
  const stale = existing.filter(
    (row) => row.id !== authUserId && row.email.toLowerCase() !== NEW_EMAIL.toLowerCase(),
  );

  for (const row of stale) {
    await sql`DELETE FROM users WHERE id = ${row.id}`;
  }

  if (byId) {
    if (
      byId.tenant_id === tenantId &&
      byId.role === "owner" &&
      byId.email.toLowerCase() === NEW_EMAIL.toLowerCase()
    ) {
      return "unchanged";
    }

    await sql`
      UPDATE users
      SET tenant_id = ${tenantId},
          email = ${NEW_EMAIL},
          name = ${ADMIN_NAME},
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
      ${NEW_EMAIL},
      ${ADMIN_NAME},
      'owner',
      'active'
    )
  `;
  return "created";
}

async function ensureProdDbUser(
  sql: postgres.Sql,
  authUserId: string,
): Promise<"created" | "updated" | "unchanged" | "skipped"> {
  const existing = await sql<{
    id: string;
    email: string;
    tenant_id: string;
    role: string;
  }[]>`
    SELECT id, email, tenant_id, role
    FROM users
    WHERE id = ${authUserId}
       OR lower(email) IN (${OLD_EMAIL.toLowerCase()}, ${NEW_EMAIL.toLowerCase()})
  `;

  const byId = existing.find((row) => row.id === authUserId);
  const stale = existing.filter((row) => row.id !== authUserId);

  for (const row of stale) {
    await sql`DELETE FROM users WHERE id = ${row.id}`;
  }

  if (!byId) {
    return "skipped";
  }

  if (byId.email.toLowerCase() === NEW_EMAIL.toLowerCase()) {
    return "unchanged";
  }

  await sql`
    UPDATE users
    SET email = ${NEW_EMAIL},
        name = ${ADMIN_NAME},
        updated_at = NOW()
    WHERE id = ${authUserId}
  `;
  return "updated";
}

async function main() {
  const ref = getProjectRef();
  if (!isDevTarget() && !isProdTarget()) {
    throw new Error(`Unknown Supabase project ref: ${ref}`);
  }

  const sql = postgres(getDatabaseUrl(), { prepare: false, max: 1 });
  const supabase = getSupabaseAdmin();

  try {
    const oldUser = await findAuthUserByEmail(supabase, OLD_EMAIL);
    const newUser = await findAuthUserByEmail(supabase, NEW_EMAIL);

    console.log(`\nTarget: ${isDevTarget() ? "dev" : "prod"} (${ref})`);
    console.log(`Old auth user: ${oldUser ? oldUser.email : "(not found)"}`);
    console.log(`New auth user: ${newUser ? newUser.email : "(not found)"}`);

    const authUser = await ensureAuthUser(supabase, oldUser, newUser);

    const dbStatus = isDevTarget()
      ? await ensureDevDbUser(sql, authUser.id)
      : await ensureProdDbUser(sql, authUser.id);

    console.log("\nPlatform admin fixed.");
    console.log(`  auth_user:  ${authUser.id}`);
    console.log(`  email:      ${authUser.email}`);
    console.log(`  password:   ${TEMP_PASSWORD}`);
    console.log(`  db_user:    ${dbStatus}`);
    console.log("");
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
