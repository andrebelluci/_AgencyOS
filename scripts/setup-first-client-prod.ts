/**
 * Provision first real client on production and remove seed/test tenant(s).
 *
 *   npx tsx --env-file=.env scripts/setup-first-client-prod.ts           # preview
 *   npx tsx --env-file=.env scripts/setup-first-client-prod.ts --execute
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import postgres from "postgres";

import { provisionTenant } from "../src/modules/provisioning/service";

const PROD_SUPABASE_REF = "heofpktpncugzrzmkzwk";
const REMOVE_SLUGS = ["development"] as const;
const CLIENT_SLUG = "dharmalabs";
const CLIENT_COMPANY = "Dharma Labs";
const OWNER_EMAIL = "andrebelluci@dharmalabs.com.br";
const OWNER_PASSWORD = "AgencyOS-Temp2026!";
const OWNER_NAME = "André Belluci";

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

function assertProdTarget(): void {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  if (!supabaseUrl.includes(PROD_SUPABASE_REF)) {
    throw new Error(
      `Refusing to run: target is not prod (${PROD_SUPABASE_REF}).`,
    );
  }
}

async function findAuthUserByEmail(
  supabase: SupabaseClient,
  email: string,
): Promise<{ id: string; email: string } | undefined> {
  const target = email.toLowerCase();
  let page = 1;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 200,
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

    if (data.users.length < 200) {
      return undefined;
    }

    page += 1;
  }
}

async function main() {
  const execute = process.argv.includes("--execute");

  assertProdTarget();

  const sql = postgres(getDatabaseUrl(), { prepare: false, max: 1 });
  const supabase = getSupabaseAdmin();

  try {
    const tenants = await sql<{ id: string; slug: string; name: string }[]>`
      SELECT id, slug, name FROM tenants ORDER BY slug
    `;

    console.log("\n=== SETUP FIRST CLIENT (prod) ===\n");
    console.log("Current tenants:");
    for (const tenant of tenants) {
      console.log(`  - ${tenant.slug} (${tenant.name})`);
    }

    const removeTenants = tenants.filter((tenant) =>
      REMOVE_SLUGS.includes(tenant.slug as (typeof REMOVE_SLUGS)[number]),
    );

    const existingClient = tenants.find((tenant) => tenant.slug === CLIENT_SLUG);

    console.log(`\nWill remove: ${removeTenants.map((t) => t.slug).join(", ") || "(none)"}`);
    console.log(`Will ensure client tenant: ${CLIENT_SLUG} (${CLIENT_COMPANY})`);
    console.log(`Owner: ${OWNER_EMAIL}`);

    if (!execute) {
      console.log("\nRun with --execute to apply.\n");
      return;
    }

    if (removeTenants.length > 0) {
      const removeIds = removeTenants.map((tenant) => tenant.id);
      console.log(`\nDeleting tenant(s): ${removeTenants.map((t) => t.slug).join(", ")}...`);
      await sql`DELETE FROM tenants WHERE id IN ${sql(removeIds)}`;
    }

    const authUser = await findAuthUserByEmail(supabase, OWNER_EMAIL);
    if (authUser && !existingClient) {
      console.log("Removing existing auth user so provisioning can recreate owner...");
      const { error } = await supabase.auth.admin.deleteUser(authUser.id);
      if (error) {
        throw new Error(`Failed to delete auth user: ${error.message}`);
      }
    }

    const result = await provisionTenant(
      {
        companyName: CLIENT_COMPANY,
        slug: CLIENT_SLUG,
        ownerEmail: OWNER_EMAIL,
        ownerPassword: OWNER_PASSWORD,
        ownerName: OWNER_NAME,
      },
      { sql, supabase },
    );

    console.log("\nClient tenant ready.");
    console.log(`  tenant_id:  ${result.tenantId}`);
    console.log(`  slug:       ${result.slug}`);
    console.log(`  public_key: ${result.publicKey}`);
    console.log(`  login:      ${result.ownerEmail} / ${result.ownerPassword}`);
    console.log(`\nSet PLATFORM_APEX_TENANT_SLUG=${CLIENT_SLUG} on Vercel Production.`);
    console.log(`Dashboard: /dashboard  |  Admin: /admin\n`);
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
