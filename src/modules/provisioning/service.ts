import type { SupabaseClient } from "@supabase/supabase-js";
import postgres from "postgres";

import { buildDefaultTenantSettings } from "./defaults";
import { generatePublicKey } from "./public-key";
import { normalizeSlug, slugFromCompanyName } from "./slug";
import {
  ProvisioningError,
  type ProvisionTenantInput,
  type ProvisionTenantResult,
} from "./types";

const PUBLIC_KEY_INSERT_RETRIES = 5;

type TenantRow = {
  id: string;
  slug: string;
  public_key: string;
};

type OwnerRow = {
  id: string;
  email: string;
};

export type ProvisionTenantDeps = {
  sql: postgres.Sql;
  supabase: SupabaseClient;
};

function resolveSlug(input: ProvisionTenantInput): string {
  if (input.slug?.trim()) {
    return normalizeSlug(input.slug);
  }

  return slugFromCompanyName(input.companyName);
}

function validateInput(input: ProvisionTenantInput): void {
  const companyName = input.companyName?.trim();
  const ownerEmail = input.ownerEmail?.trim();
  const ownerPassword = input.ownerPassword ?? "";

  if (!companyName) {
    throw new ProvisioningError("companyName is required.", "INVALID_INPUT");
  }

  if (!ownerEmail || !ownerEmail.includes("@")) {
    throw new ProvisioningError("ownerEmail must be a valid email.", "INVALID_INPUT");
  }

  if (ownerPassword.length < 8) {
    throw new ProvisioningError(
      "ownerPassword must be at least 8 characters.",
      "INVALID_INPUT",
    );
  }
}

async function findTenantBySlug(
  sql: postgres.Sql,
  slug: string,
): Promise<TenantRow | undefined> {
  const rows = await sql<TenantRow[]>`
    SELECT id, slug, public_key
    FROM tenants
    WHERE slug = ${slug}
    LIMIT 1
  `;

  return rows[0];
}

async function findOwnerByTenantId(
  sql: postgres.Sql,
  tenantId: string,
): Promise<OwnerRow | undefined> {
  const rows = await sql<OwnerRow[]>`
    SELECT id, email
    FROM users
    WHERE tenant_id = ${tenantId} AND role = 'owner'
    ORDER BY created_at ASC
    LIMIT 1
  `;

  return rows[0];
}

async function ensureAuthUser(
  supabase: SupabaseClient,
  email: string,
  password: string,
  name: string | null,
  existingAuthId?: string,
): Promise<string> {
  if (existingAuthId) {
    const { data, error } = await supabase.auth.admin.updateUserById(
      existingAuthId,
      {
        email,
        password,
        email_confirm: true,
        user_metadata: name ? { name } : undefined,
      },
    );

    if (error) {
      throw new ProvisioningError(
        `Failed to update auth user: ${error.message}`,
        "AUTH_FAILED",
      );
    }

    if (!data.user) {
      throw new ProvisioningError(
        "Auth user update returned no user.",
        "AUTH_FAILED",
      );
    }

    return data.user.id;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: name ? { name } : undefined,
  });

  if (error) {
    throw new ProvisioningError(
      `Failed to create auth user: ${error.message}`,
      "AUTH_FAILED",
    );
  }

  if (!data.user) {
    throw new ProvisioningError(
      "Auth user creation returned no user.",
      "AUTH_FAILED",
    );
  }

  return data.user.id;
}

async function ensureDbUser(
  sql: postgres.Sql,
  authUserId: string,
  tenantId: string,
  email: string,
  name: string | null,
): Promise<void> {
  const existing = await sql<{ id: string; tenant_id: string }[]>`
    SELECT id, tenant_id FROM users WHERE id = ${authUserId} LIMIT 1
  `;

  if (existing[0]) {
    if (existing[0].tenant_id !== tenantId) {
      throw new ProvisioningError(
        "Auth user is already linked to a different tenant.",
        "OWNER_CONFLICT",
      );
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

    return;
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
}

async function ensureTenantSettings(
  sql: postgres.Sql,
  tenantId: string,
  companyName: string,
): Promise<void> {
  const existing = await sql<{ tenant_id: string }[]>`
    SELECT tenant_id FROM tenant_settings WHERE tenant_id = ${tenantId} LIMIT 1
  `;

  if (existing[0]) {
    return;
  }

  const defaults = buildDefaultTenantSettings(companyName);

  await sql`
    INSERT INTO tenant_settings (
      tenant_id,
      company_name,
      city,
      services,
      welcome_message,
      initial_message,
      assistant_label,
      quick_actions,
      primary_color,
      whatsapp
    )
    VALUES (
      ${tenantId},
      ${defaults.companyName},
      ${defaults.city},
      ${sql.json(defaults.services)},
      ${defaults.welcomeMessage},
      ${defaults.initialMessage},
      ${defaults.assistantLabel},
      ${sql.json(defaults.quickActions)},
      ${defaults.primaryColor},
      ${defaults.whatsapp}
    )
  `;
}

async function insertTenant(
  sql: postgres.Sql,
  companyName: string,
  slug: string,
): Promise<TenantRow> {
  for (let attempt = 0; attempt < PUBLIC_KEY_INSERT_RETRIES; attempt += 1) {
    const publicKey = generatePublicKey();

    try {
      const rows = await sql<TenantRow[]>`
        INSERT INTO tenants (name, slug, public_key, status)
        VALUES (${companyName}, ${slug}, ${publicKey}, 'active')
        RETURNING id, slug, public_key
      `;

      const tenant = rows[0];
      if (!tenant) {
        throw new ProvisioningError("Failed to create tenant.", "DB_FAILED");
      }

      return tenant;
    } catch (error) {
      const message =
        error instanceof Error ? error.message.toLowerCase() : String(error);

      if (message.includes("tenants_slug") || message.includes("slug")) {
        throw new ProvisioningError(
          `Slug "${slug}" is already in use.`,
          "DB_FAILED",
        );
      }

      if (
        message.includes("public_key") ||
        message.includes("tenants_public_key")
      ) {
        continue;
      }

      throw error;
    }
  }

  throw new ProvisioningError(
    "Could not generate a unique public_key after several attempts.",
    "DB_FAILED",
  );
}

async function handleExistingTenant(
  sql: postgres.Sql,
  supabase: SupabaseClient,
  existing: TenantRow,
  input: ProvisionTenantInput,
  slug: string,
  ownerEmail: string,
  ownerName: string | null,
): Promise<ProvisionTenantResult> {
  const owner = await findOwnerByTenantId(sql, existing.id);

  if (owner && owner.email.toLowerCase() !== ownerEmail.toLowerCase()) {
    throw new ProvisioningError(
      `Slug "${slug}" already exists with a different owner (${owner.email}).`,
      "OWNER_CONFLICT",
    );
  }

  const authUserId = await ensureAuthUser(
    supabase,
    ownerEmail,
    input.ownerPassword,
    ownerName,
    owner?.id,
  );

  await ensureTenantSettings(sql, existing.id, input.companyName.trim());
  await ensureDbUser(sql, authUserId, existing.id, ownerEmail, ownerName);

  return {
    tenantId: existing.id,
    slug: existing.slug,
    publicKey: existing.public_key,
    ownerAuthId: authUserId,
    ownerEmail,
    ownerPassword: input.ownerPassword,
    created: false,
  };
}

/**
 * Creates (or idempotently reuses) a tenant with default settings and an owner user.
 */
export async function provisionTenant(
  input: ProvisionTenantInput,
  deps: ProvisionTenantDeps,
): Promise<ProvisionTenantResult> {
  validateInput(input);

  const companyName = input.companyName.trim();
  const ownerEmail = input.ownerEmail.trim();
  const ownerName = input.ownerName?.trim() || null;
  const slug = resolveSlug({ ...input, companyName });

  const existing = await findTenantBySlug(deps.sql, slug);
  if (existing) {
    return handleExistingTenant(
      deps.sql,
      deps.supabase,
      existing,
      input,
      slug,
      ownerEmail,
      ownerName,
    );
  }

  const tenant = await insertTenant(deps.sql, companyName, slug);
  const authUserId = await ensureAuthUser(
    deps.supabase,
    ownerEmail,
    input.ownerPassword,
    ownerName,
  );

  await ensureTenantSettings(deps.sql, tenant.id, companyName);
  await ensureDbUser(
    deps.sql,
    authUserId,
    tenant.id,
    ownerEmail,
    ownerName,
  );

  return {
    tenantId: tenant.id,
    slug: tenant.slug,
    publicKey: tenant.public_key,
    ownerAuthId: authUserId,
    ownerEmail,
    ownerPassword: input.ownerPassword,
    created: true,
  };
}
