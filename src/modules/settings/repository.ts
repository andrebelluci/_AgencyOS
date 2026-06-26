import "server-only";

import { eq } from "drizzle-orm";

import { getDb, tenantSettings, type TenantSettings } from "@/lib/db";

import type { UpdateTenantSettingsInput } from "./types";

export async function findTenantSettingsByTenantId(
  tenantId: string,
): Promise<TenantSettings | undefined> {
  const [row] = await getDb()
    .select()
    .from(tenantSettings)
    .where(eq(tenantSettings.tenantId, tenantId))
    .limit(1);

  return row;
}

export async function upsertTenantSettings(
  tenantId: string,
  input: UpdateTenantSettingsInput,
): Promise<TenantSettings> {
  const [row] = await getDb()
    .insert(tenantSettings)
    .values({
      tenantId,
      companyName: input.companyName,
      whatsapp: input.whatsapp ?? null,
      city: input.city ?? null,
      services: input.services,
      systemPrompt: input.systemPrompt ?? null,
      initialMessage: input.initialMessage ?? null,
      primaryColor: input.primaryColor ?? null,
      quickActions: input.quickActions ?? [],
    })
    .onConflictDoUpdate({
      target: tenantSettings.tenantId,
      set: {
        companyName: input.companyName,
        whatsapp: input.whatsapp ?? null,
        city: input.city ?? null,
        services: input.services,
        systemPrompt: input.systemPrompt ?? null,
        initialMessage: input.initialMessage ?? null,
        primaryColor: input.primaryColor ?? null,
        quickActions: input.quickActions ?? [],
      },
    })
    .returning();

  if (!row) {
    throw new Error("Failed to save tenant settings.");
  }

  return row;
}
