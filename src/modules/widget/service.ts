import "server-only";

import type { TenantSettings } from "@/lib/db";
import {
  DEFAULT_ASSISTANT_LABEL,
  resolveInitialMessage,
} from "@/lib/widget/initial-message";
import { resolveEnabledQuickActions } from "@/lib/widget/resolve-quick-actions";
import { getTenantSettings } from "@/modules/settings/service";
import { DEFAULT_PRIMARY_COLOR } from "@/modules/provisioning/defaults";
import { findTenantByPublicKey } from "@/modules/tenants/repository";
import { assertActiveTenantForApi } from "@/modules/tenants/assert-active";

import type { WidgetPublicConfig } from "./types";

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
  const companyName = settings?.companyName ?? tenantName;
  const assistantLabel = settings?.assistantLabel?.trim() || DEFAULT_ASSISTANT_LABEL;
  const resolvedMessage = resolveInitialMessage(
    settings?.initialMessage,
    companyName,
    settings?.welcomeMessage,
    assistantLabel,
  );

  return {
    public_key: publicKey,
    company_name: companyName,
    assistant_label: assistantLabel,
    welcome_message: resolvedMessage,
    initial_message: resolvedMessage,
    primary_color: settings?.primaryColor ?? DEFAULT_PRIMARY_COLOR,
    logo_url: settings?.logoUrl ?? null,
    quick_actions: resolveEnabledQuickActions(
      settings?.quickActions,
      settings?.whatsapp,
    ),
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

export function buildChatWidgetConfigFromSettings(
  publicKey: string,
  tenantName: string,
  settings: TenantSettings | null,
): {
  publicKey: string;
  companyName: string;
  assistantLabel: string;
  welcomeMessage: string;
  primaryColor: string;
  whatsapp: string | null;
  quickActions: WidgetPublicConfig["quick_actions"];
} {
  const companyName = settings?.companyName ?? tenantName;
  const publicConfig = toPublicConfig(publicKey, tenantName, settings);

  return {
    publicKey,
    companyName,
    assistantLabel: publicConfig.assistant_label,
    welcomeMessage: publicConfig.welcome_message,
    primaryColor: publicConfig.primary_color,
    whatsapp: settings?.whatsapp ?? null,
    quickActions: publicConfig.quick_actions,
  };
}
