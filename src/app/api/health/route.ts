import { NextResponse } from "next/server";

import { hasSupabaseConfig } from "@/env";
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

  return NextResponse.json(payload);
}
