/**
 * Set the same Supabase Auth password for admin/owner accounts.
 *
 *   npx tsx --env-file=.env.local scripts/set-shared-admin-password.ts
 *   npx tsx --env-file=.env scripts/set-shared-admin-password.ts
 */
import { createClient } from "@supabase/supabase-js";

const SHARED_PASSWORD = "BelluciDev2026!";
const EMAILS = [
  "andre.belluci@dharmalabs.com.br",
  "owner@belluci.dev",
] as const;

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const ref = new URL(url).hostname.split(".")[0];
  console.log(`Target: ${ref}`);

  for (const email of EMAILS) {
    const { data: list, error: listError } =
      await supabase.auth.admin.listUsers({ perPage: 1000 });
    if (listError) throw listError;

    const user = list.users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase(),
    );
    if (!user) {
      console.log(`SKIP ${email} — not found in Auth`);
      continue;
    }

    const { error } = await supabase.auth.admin.updateUserById(user.id, {
      password: SHARED_PASSWORD,
    });
    if (error) throw new Error(`${email}: ${error.message}`);

    console.log(`OK ${email}`);
  }

  console.log("Done. Password synced (see scripts/seed-dev-tenant.ts for dev owner default).");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
