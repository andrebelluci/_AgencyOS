/**
 * ISSUE-034 — CLI para provisionar tenant + owner.
 *
 * Uso:
 *   npm run provision:tenant -- --company "Acme" --email owner@acme.com --password "SenhaSegura1"
 *   npm run provision:tenant -- --company "Acme" --slug acme --email owner@acme.com --password "SenhaSegura1" --name "Maria Owner"
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import postgres from "postgres";

import {
  ProvisioningError,
  provisionTenant,
  type ProvisionTenantResult,
} from "../src/modules/provisioning";

type CliArgs = {
  company: string;
  email: string;
  password: string;
  slug?: string;
  name?: string;
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

function parseArgs(argv: string[]): CliArgs {
  const envCompany = process.env.PROVISION_COMPANY?.trim();
  const envEmail = process.env.PROVISION_EMAIL?.trim();
  const envPassword = process.env.PROVISION_PASSWORD ?? "";
  const envSlug = process.env.PROVISION_SLUG?.trim();
  const envName = process.env.PROVISION_NAME?.trim();

  if (envCompany && envEmail && envPassword) {
    return {
      company: envCompany,
      email: envEmail,
      password: envPassword,
      slug: envSlug,
      name: envName,
    };
  }

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

  const company = args.company?.trim();
  const email = args.email?.trim();
  const password = args.password ?? "";

  if (!company || !email || !password) {
    throw new Error(
      'Usage: npm run provision:tenant -- --company "Name" --email owner@example.com --password "min8chars" [--slug slug] [--name "Owner Name"]\n' +
        "PowerShell: set PROVISION_COMPANY, PROVISION_EMAIL, PROVISION_PASSWORD (and optional PROVISION_SLUG, PROVISION_NAME) then npm run provision:tenant\n" +
        'Or: npx tsx --env-file=.env.local scripts/provision-tenant.ts --company "Name" ...',
    );
  }

  return {
    company,
    email,
    password,
    slug: args.slug?.trim(),
    name: args.name?.trim(),
  };
}

function logResult(result: ProvisionTenantResult): void {
  const status = result.created ? "criado" : "já existia (idempotente)";

  console.log(`\nTenant ${status} com sucesso.\n`);
  console.log(`  tenant_id:  ${result.tenantId}`);
  console.log(`  slug:       ${result.slug}`);
  console.log(`  public_key: ${result.publicKey}`);
  console.log(`  owner_id:   ${result.ownerAuthId}`);
  console.log(`  login:      ${result.ownerEmail} / ${result.ownerPassword}`);
  console.log(
    `\nPainel: https://${result.slug}.agencyos.com.br/dashboard`,
  );
  console.log(
    "Local (subdomínio no hosts): http://{slug}.agencyos.com.br:3000/dashboard\n",
  );
}

async function main() {
  const cli = parseArgs(process.argv.slice(2));
  const sql = postgres(getDatabaseUrl(), { prepare: false, max: 1 });
  const supabase = getSupabaseAdmin();

  try {
    const result = await provisionTenant(
      {
        companyName: cli.company,
        slug: cli.slug,
        ownerEmail: cli.email,
        ownerPassword: cli.password,
        ownerName: cli.name,
      },
      { sql, supabase },
    );

    logResult(result);
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  if (error instanceof ProvisioningError) {
    console.error(`[${error.code}] ${error.message}`);
  } else {
    console.error(error instanceof Error ? error.message : error);
  }
  process.exit(1);
});
