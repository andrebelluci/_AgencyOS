"use server";

import { redirect } from "next/navigation";

import { linkUserToTenant } from "@/lib/auth/link-user-tenant";
import { resolveTenantForAuth } from "@/lib/auth/resolve-tenant-for-auth";
import { createClient } from "@/lib/supabase/server";
import { findUserById } from "@/modules/users/repository";

export type LoginState = {
  error?: string;
};

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/dashboard").trim() || "/dashboard";

  if (!email || !password) {
    return { error: "Informe e-mail e senha." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "E-mail ou senha inválidos." };
  }

  if (!data.user) {
    return { error: "Não foi possível iniciar a sessão." };
  }

  const existingUser = await findUserById(data.user.id);
  if (!existingUser) {
    const tenant = await resolveTenantForAuth();
    await linkUserToTenant(data.user, tenant.id);
  }

  redirect(next.startsWith("/") ? next : "/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
