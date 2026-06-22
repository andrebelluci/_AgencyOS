/**
 * ISSUE-006 — Verifica isolamento RLS nas tabelas da Onda 1.
 *
 * Uso: npm run db:test-rls
 * Requer .env.local com DATABASE_URL e tabelas migradas.
 */
import postgres from "postgres";

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error("DATABASE_URL is required in .env.local");
  }
  return url;
}

type TenantRow = { id: string; slug: string };
type SettingsRow = { tenant_id: string; company_name: string };
type UserRow = { id: string; tenant_id: string; email: string };

async function main() {
  const admin = postgres(getDatabaseUrl(), { prepare: false, max: 1 });

  console.log("Agency OS — RLS wave 1 test (ISSUE-006)\n");

  const existingTenants = await admin<TenantRow[]>`
  SELECT id, slug FROM tenants ORDER BY created_at LIMIT 2
`;

  let tenantA: TenantRow;
  let tenantB: TenantRow;
  let userA: UserRow;
  let userB: UserRow;

  if (existingTenants.length >= 2) {
    tenantA = existingTenants[0]!;
    tenantB = existingTenants[1]!;
    const users = await admin<UserRow[]>`
      SELECT id, tenant_id, email
      FROM users
      WHERE tenant_id IN (${tenantA.id}, ${tenantB.id})
      ORDER BY created_at
    `;
    userA = users.find((u) => u.tenant_id === tenantA.id)!;
    userB = users.find((u) => u.tenant_id === tenantB.id)!;
    if (!userA || !userB) {
      throw new Error(
        "Need one user per tenant for RLS test. Run seed or create users first.",
      );
    }
    console.log("Using existing tenants:", tenantA.slug, tenantB.slug);
  } else {
    tenantA = {
      id: crypto.randomUUID(),
      slug: `rls-a-${Date.now()}`,
    };
    tenantB = {
      id: crypto.randomUUID(),
      slug: `rls-b-${Date.now()}`,
    };
    userA = {
      id: crypto.randomUUID(),
      tenant_id: tenantA.id,
      email: `rls-a-${Date.now()}@test.local`,
    };
    userB = {
      id: crypto.randomUUID(),
      tenant_id: tenantB.id,
      email: `rls-b-${Date.now()}@test.local`,
    };

    await admin.begin(async (tx) => {
      await tx`
        INSERT INTO tenants (id, name, slug, public_key)
        VALUES
          (${tenantA.id}, 'RLS Tenant A', ${tenantA.slug}, ${`pk-${tenantA.slug}`}),
          (${tenantB.id}, 'RLS Tenant B', ${tenantB.slug}, ${`pk-${tenantB.slug}`})
      `;
      await tx`
        INSERT INTO tenant_settings (tenant_id, company_name)
        VALUES
          (${tenantA.id}, 'Company A'),
          (${tenantB.id}, 'Company B')
      `;
      await tx`
        INSERT INTO users (id, tenant_id, email, name)
        VALUES
          (${userA.id}, ${tenantA.id}, ${userA.email}, 'User A'),
          (${userB.id}, ${tenantB.id}, ${userB.email}, 'User B')
      `;
    });

    console.log("Seeded temporary tenants:", tenantA.slug, tenantB.slug);
  }

  const rls = postgres(getDatabaseUrl(), { prepare: false, max: 1 });

  const ownSettings = await rls.begin(async (tx) => {
    await tx.unsafe("SET LOCAL ROLE authenticated");
    await tx.unsafe(
      `SELECT set_config('request.jwt.claim.sub', '${userA.id}', true)`,
    );

    return tx<SettingsRow[]>`
      SELECT tenant_id, company_name FROM tenant_settings ORDER BY company_name
    `;
  });

  const crossTenantAttempt = await rls.begin(async (tx) => {
    await tx.unsafe("SET LOCAL ROLE authenticated");
    await tx.unsafe(
      `SELECT set_config('request.jwt.claim.sub', '${userA.id}', true)`,
    );
    await tx.unsafe(
      `SELECT set_config('app.tenant_id', '${tenantB.id}', true)`,
    );

    return tx<SettingsRow[]>`
      SELECT tenant_id, company_name
      FROM tenant_settings
      WHERE tenant_id = ${tenantB.id}
    `;
  });

  const otherTenantRows = await rls.begin(async (tx) => {
    await tx.unsafe("SET LOCAL ROLE authenticated");
    await tx.unsafe(
      `SELECT set_config('request.jwt.claim.sub', '${userA.id}', true)`,
    );

    return tx<TenantRow[]>`
      SELECT id, slug FROM tenants WHERE id = ${tenantB.id}
    `;
  });

  await rls.end();
  await admin.end();

  const ownOk =
    ownSettings.length === 1 && ownSettings[0]?.tenant_id === tenantA.id;
  const crossBlocked = crossTenantAttempt.length === 0;
  const tenantBlocked = otherTenantRows.length === 0;

  console.log(
    ownOk ? "PASS" : "FAIL",
    "— user A sees only own tenant_settings",
  );
  console.log(
    crossBlocked ? "PASS" : "FAIL",
    "— user A cannot read tenant B settings (even with app.tenant_id spoof)",
  );
  console.log(
    tenantBlocked ? "PASS" : "FAIL",
    "— user A cannot read tenant B row in tenants",
  );

  if (!ownOk || !crossBlocked || !tenantBlocked) {
    process.exit(1);
  }

  console.log("\nRLS wave 1 OK — cross-tenant queries blocked for authenticated.");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`\nErro: ${message}`);
  process.exit(1);
});
