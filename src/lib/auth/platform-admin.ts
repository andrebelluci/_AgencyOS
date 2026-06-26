import "server-only";

import type { User as AuthUser } from "@supabase/supabase-js";
import { forbidden } from "next/navigation";

import { requireSession } from "@/lib/auth/require-session";

function parsePlatformAdminEmails(): Set<string> {
  const raw = process.env.PLATFORM_ADMIN_EMAILS?.trim();

  if (!raw) {
    return new Set();
  }

  return new Set(
    raw
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isPlatformAdminEmail(email: string | null | undefined): boolean {
  if (!email?.trim()) {
    return false;
  }

  return parsePlatformAdminEmails().has(email.trim().toLowerCase());
}

export async function requirePlatformAdmin(): Promise<{ user: AuthUser }> {
  const { user } = await requireSession();

  if (!isPlatformAdminEmail(user.email)) {
    forbidden();
  }

  return { user };
}
