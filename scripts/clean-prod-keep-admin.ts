/**
 * One-off production cleanup — remove operational/seed data, keep platform admin.
 *
 * Usage:
 *   npx tsx --env-file=.env scripts/clean-prod-keep-admin.ts           # preview counts
 *   npx tsx --env-file=.env scripts/clean-prod-keep-admin.ts --execute # destructive
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import postgres from "postgres";

const PROD_SUPABASE_REF = "heofpktpncugzrzmkzwk";

type CountRow = { count: string };

type TenantRow = {
  id: string;
  slug: string;
  name: string;
  status: string;
};

type UserRow = {
  id: string;
  email: string;
  tenant_id: string;
  role: string;
};

function parseAdminEmails(): string[] {
  const raw = process.env.PLATFORM_ADMIN_EMAILS?.trim();
  if (!raw) {
    throw new Error("PLATFORM_ADMIN_EMAILS is required in .env");
  }

  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function getApexTenantSlug(): string | null {
  const slug = process.env.PLATFORM_APEX_TENANT_SLUG?.trim();
  return slug || null;
}

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error("DATABASE_URL is required");
  }
  return url;
}

function assertProdTarget(): void {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  if (!supabaseUrl.includes(PROD_SUPABASE_REF)) {
    throw new Error(
      `Refusing to run: NEXT_PUBLIC_SUPABASE_URL does not target prod (${PROD_SUPABASE_REF}).`,
    );
  }
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

async function countTable(sql: postgres.Sql, table: string): Promise<number> {
  const rows = await sql.unsafe<CountRow[]>(
    `SELECT COUNT(*)::text AS count FROM ${table}`,
  );
  return Number(rows[0]?.count ?? 0);
}

async function countForTenants(
  sql: postgres.Sql,
  table: string,
  tenantIds: string[],
): Promise<number> {
  if (tenantIds.length === 0) {
    return 0;
  }

  const rows = await sql.unsafe<CountRow[]>(
    `SELECT COUNT(*)::text AS count FROM ${table} WHERE tenant_id = ANY($1::uuid[])`,
    [tenantIds],
  );
  return Number(rows[0]?.count ?? 0);
}

function resolveKeepTenantIds(
  tenants: TenantRow[],
  dbUsers: UserRow[],
  adminEmails: string[],
  apexSlug: string | null,
): Set<string> {
  const keep = new Set<string>();

  for (const user of dbUsers) {
    if (adminEmails.includes(user.email.toLowerCase())) {
      keep.add(user.tenant_id);
    }
  }

  if (apexSlug) {
    const apex = tenants.find((tenant) => tenant.slug === apexSlug);
    if (apex) {
      keep.add(apex.id);
    }
  }

  return keep;
}

async function listAuthUsers(
  supabase: SupabaseClient,
): Promise<Array<{ id: string; email: string | undefined }>> {
  const users: Array<{ id: string; email: string | undefined }> = [];
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) {
      throw new Error(`Failed to list auth users: ${error.message}`);
    }

    for (const user of data.users) {
      users.push({ id: user.id, email: user.email });
    }

    if (data.users.length < perPage) {
      break;
    }
    page += 1;
  }

  return users;
}

async function preview(
  sql: postgres.Sql,
  supabase: SupabaseClient,
  adminEmails: string[],
  apexSlug: string | null,
) {
  const tenants = await sql<TenantRow[]>`
    SELECT id, slug, name, status FROM tenants ORDER BY slug
  `;
  const dbUsers = await sql<UserRow[]>`
    SELECT id, email, tenant_id, role FROM users ORDER BY email
  `;
  const authUsers = await listAuthUsers(supabase);

  const keepTenantIds = resolveKeepTenantIds(
    tenants,
    dbUsers,
    adminEmails,
    apexSlug,
  );
  const removeTenantIds = tenants
    .filter((tenant) => !keepTenantIds.has(tenant.id))
    .map((tenant) => tenant.id);

  const operationalCounts = {
    messages: await countTable(sql, "messages"),
    conversations: await countTable(sql, "conversations"),
    leads: await countTable(sql, "leads"),
    knowledge_chunks: await countTable(sql, "knowledge_chunks"),
    knowledge_documents: await countTable(sql, "knowledge_documents"),
  };

  const removeTenantOperational = {
    messages: await countForTenants(sql, "messages", removeTenantIds),
    conversations: await countForTenants(sql, "conversations", removeTenantIds),
    leads: await countForTenants(sql, "leads", removeTenantIds),
    knowledge_chunks: await countForTenants(
      sql,
      "knowledge_chunks",
      removeTenantIds,
    ),
    knowledge_documents: await countForTenants(
      sql,
      "knowledge_documents",
      removeTenantIds,
    ),
  };

  const keepTenants = tenants.filter((tenant) => keepTenantIds.has(tenant.id));
  const removeTenants = tenants.filter((tenant) =>
    removeTenantIds.includes(tenant.id),
  );

  const keepDbUsers = dbUsers.filter(
    (user) =>
      keepTenantIds.has(user.tenant_id) &&
      adminEmails.includes(user.email.toLowerCase()),
  );
  const removeDbUsers = dbUsers.filter(
    (user) =>
      removeTenantIds.includes(user.tenant_id) ||
      (keepTenantIds.has(user.tenant_id) &&
        !adminEmails.includes(user.email.toLowerCase())),
  );

  const keepAuthUsers = authUsers.filter((user) =>
    adminEmails.includes((user.email ?? "").toLowerCase()),
  );
  const removeAuthUsers = authUsers.filter(
    (user) => !adminEmails.includes((user.email ?? "").toLowerCase()),
  );

  console.log("\n=== CLEAN PROD (preview) ===\n");
  console.log(`Target: prod (${PROD_SUPABASE_REF})`);
  console.log(`Platform admins: ${adminEmails.join(", ")}`);
  console.log(`Apex tenant slug: ${apexSlug ?? "(not set — only admin-linked tenants kept)"}`);

  console.log("\n--- Operational data (ALL tenants — will be deleted) ---");
  for (const [table, count] of Object.entries(operationalCounts)) {
    console.log(`  ${table}: ${count}`);
  }

  console.log("\n--- Tenants to KEEP ---");
  if (keepTenants.length === 0) {
    console.log("  (none — check PLATFORM_ADMIN_EMAILS / tenant linkage)");
  } else {
    for (const tenant of keepTenants) {
      console.log(`  ${tenant.slug} (${tenant.name}) [${tenant.status}]`);
    }
  }

  console.log("\n--- Tenants to DELETE ---");
  if (removeTenants.length === 0) {
    console.log("  (none)");
  } else {
    for (const tenant of removeTenants) {
      console.log(`  ${tenant.slug} (${tenant.name})`);
    }
    console.log("\n  Operational data on removed tenants:");
    for (const [table, count] of Object.entries(removeTenantOperational)) {
      console.log(`    ${table}: ${count}`);
    }
  }

  console.log("\n--- DB users to KEEP ---");
  if (keepDbUsers.length === 0) {
    console.log("  (none in users table — admin may only use /admin)");
  } else {
    for (const user of keepDbUsers) {
      console.log(`  ${user.email} (${user.role})`);
    }
  }

  console.log("\n--- DB users to DELETE ---");
  if (removeDbUsers.length === 0) {
    console.log("  (none)");
  } else {
    for (const user of removeDbUsers) {
      console.log(`  ${user.email} (${user.role})`);
    }
  }

  console.log("\n--- Auth users to KEEP ---");
  for (const user of keepAuthUsers) {
    console.log(`  ${user.email ?? "(no email)"}`);
  }

  console.log("\n--- Auth users to DELETE ---");
  if (removeAuthUsers.length === 0) {
    console.log("  (none)");
  } else {
    for (const user of removeAuthUsers) {
      console.log(`  ${user.email ?? user.id}`);
    }
  }

  console.log(
    "\nRun with --execute to apply deletions. Operational data is cleared on kept tenants too.\n",
  );

  return {
    keepTenantIds,
    removeTenantIds,
    removeDbUsers,
    removeAuthUsers,
    operationalCounts,
  };
}

async function executeCleanup(
  sql: postgres.Sql,
  supabase: SupabaseClient,
  previewData: Awaited<ReturnType<typeof preview>>,
) {
  const { keepTenantIds, removeTenantIds, removeDbUsers, removeAuthUsers } =
    previewData;

  console.log("\n=== EXECUTING CLEANUP ===\n");

  await sql.begin(async (tx) => {
    console.log("Deleting operational data (all tenants)...");
    await tx`DELETE FROM messages`;
    await tx`DELETE FROM conversations`;
    await tx`DELETE FROM leads`;
    await tx`DELETE FROM knowledge_chunks`;
    await tx`DELETE FROM knowledge_documents`;

    if (removeDbUsers.length > 0) {
      const removeUserIds = removeDbUsers.map((user) => user.id);
      console.log(`Deleting ${removeDbUsers.length} row(s) from users...`);
      await tx`DELETE FROM users WHERE id IN ${tx(removeUserIds)}`;
    }

    if (removeTenantIds.length > 0) {
      console.log(`Deleting ${removeTenantIds.length} tenant(s)...`);
      await tx`DELETE FROM tenants WHERE id IN ${tx(removeTenantIds)}`;
    }
  });

  if (removeAuthUsers.length > 0) {
    console.log(`Deleting ${removeAuthUsers.length} auth user(s)...`);
    for (const user of removeAuthUsers) {
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      if (error) {
        throw new Error(
          `Failed to delete auth user ${user.email ?? user.id}: ${error.message}`,
        );
      }
    }
  }

  const keptTenantIdList = [...keepTenantIds];
  const keptTenants =
    keptTenantIdList.length > 0
      ? await sql<TenantRow[]>`
          SELECT id, slug, name, status FROM tenants
          WHERE id IN ${sql(keptTenantIdList)}
          ORDER BY slug
        `
      : [];
  const keptUsers = await sql<UserRow[]>`
    SELECT id, email, tenant_id, role FROM users ORDER BY email
  `;

  console.log("\n=== CLEANUP COMPLETE ===\n");
  console.log("Remaining tenants:");
  for (const tenant of keptTenants) {
    console.log(`  ${tenant.slug} (${tenant.name})`);
  }
  console.log("\nRemaining DB users:");
  for (const user of keptUsers) {
    console.log(`  ${user.email} (${user.role})`);
  }
  console.log("\nOperational tables should be empty.");
}

async function main() {
  const execute = process.argv.includes("--execute");

  assertProdTarget();

  const adminEmails = parseAdminEmails();
  const apexSlug = getApexTenantSlug();
  const sql = postgres(getDatabaseUrl(), { prepare: false, max: 1 });
  const supabase = getSupabaseAdmin();

  try {
    const previewData = await preview(sql, supabase, adminEmails, apexSlug);

    if (!execute) {
      return;
    }

    await executeCleanup(sql, supabase, previewData);
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
