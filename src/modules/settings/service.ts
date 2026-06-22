import "server-only";

import type { TenantSettings } from "@/lib/db";

import { findTenantSettingsByTenantId, upsertTenantSettings } from "./repository";
import type { UpdateTenantSettingsInput } from "./types";

export async function getTenantSettings(
  tenantId: string,
): Promise<TenantSettings | null> {
  const row = await findTenantSettingsByTenantId(tenantId);
  return row ?? null;
}

export async function updateTenantSettings(
  tenantId: string,
  input: UpdateTenantSettingsInput,
): Promise<TenantSettings> {
  return upsertTenantSettings(tenantId, input);
}
