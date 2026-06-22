import { NextResponse } from "next/server";

import { linkUserToTenant } from "@/lib/auth/link-user-tenant";
import { resolveTenantForAuth } from "@/lib/auth/resolve-tenant-for-auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const safeNext = next.startsWith("/") ? next : "/dashboard";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  const tenant = await resolveTenantForAuth();
  await linkUserToTenant(data.user, tenant.id);

  return NextResponse.redirect(`${origin}${safeNext}`);
}
