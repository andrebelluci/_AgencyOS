import "server-only";

import type { TenantSettings } from "@/lib/db";
import { getTenantSettings } from "@/modules/settings/service";
import { findTenantByPublicKey } from "@/modules/tenants/repository";
import { assertActiveTenantForApi } from "@/modules/tenants/assert-active";

import type { WidgetPublicConfig } from "./types";

const DEFAULT_WELCOME_MESSAGE = "Olá! Como posso ajudar você hoje?";

export class WidgetConfigError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "WidgetConfigError";
  }
}

function toPublicConfig(
  publicKey: string,
  tenantName: string,
  settings: TenantSettings | null,
): WidgetPublicConfig {
  return {
    public_key: publicKey,
    company_name: settings?.companyName ?? tenantName,
    welcome_message: settings?.welcomeMessage ?? DEFAULT_WELCOME_MESSAGE,
    primary_color: settings?.primaryColor ?? null,
    secondary_color: settings?.secondaryColor ?? null,
    logo_url: settings?.logoUrl ?? null,
  };
}

export async function getWidgetPublicConfig(
  publicKey: string,
): Promise<WidgetPublicConfig> {
  const trimmedKey = publicKey.trim();

  if (!trimmedKey) {
    throw new WidgetConfigError("public_key is required.", 400);
  }

  const tenant = await findTenantByPublicKey(trimmedKey);

  const activeTenant = assertActiveTenantForApi(tenant, WidgetConfigError);

  const settings = await getTenantSettings(activeTenant.id);

  return toPublicConfig(trimmedKey, activeTenant.name, settings);
}
