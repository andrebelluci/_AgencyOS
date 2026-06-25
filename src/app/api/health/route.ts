import { NextResponse } from "next/server";

import { hasSupabaseConfig } from "@/env";
import { getDb } from "@/lib/db/client";
import { tenants } from "@/lib/db/schema";
import { checkSupabaseConnection } from "@/lib/supabase/check-connection";

export async function GET() {
  const payload: Record<string, unknown> = {
    status: "ok",
    service: "agency-os",
    version: "0.1.0",
  };

  if (hasSupabaseConfig()) {
    try {
      payload.supabase = await checkSupabaseConnection();
    } catch (error) {
      payload.supabase = {
        configured: true,
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  } else {
    payload.supabase = { configured: false };
  }

  if (process.env.DATABASE_URL?.trim()) {
    try {
      await getDb().select({ id: tenants.id }).from(tenants).limit(1);
      payload.database = { configured: true, ok: true };
    } catch (error) {
      payload.database = {
        configured: true,
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
      payload.status = "degraded";
    }
  } else {
    payload.database = { configured: false };
  }

  return NextResponse.json(payload);
}
