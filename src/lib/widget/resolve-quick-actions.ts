import { buildWhatsAppLink } from "@/tools/build-whatsapp-link";

import type { QuickActionConfig, ResolvedQuickAction } from "./quick-actions";

export function resolveQuickActionUrl(
  action: QuickActionConfig,
  tenantWhatsapp: string | null | undefined,
): string | null {
  const customUrl = action.url?.trim();

  if (action.type === "link") {
    if (!customUrl) {
      return null;
    }

    return customUrl.startsWith("http://") || customUrl.startsWith("https://")
      ? customUrl
      : `https://${customUrl}`;
  }

  if (customUrl) {
    return customUrl.startsWith("http://") || customUrl.startsWith("https://")
      ? customUrl
      : `https://${customUrl}`;
  }

  const phone = tenantWhatsapp?.trim();
  if (!phone) {
    return null;
  }

  const link = buildWhatsAppLink({ phone, message: "" });
  return link.ok ? link.url : null;
}

export function resolveEnabledQuickActions(
  actions: QuickActionConfig[] | null | undefined,
  tenantWhatsapp: string | null | undefined,
): ResolvedQuickAction[] {
  if (!actions?.length) {
    return [];
  }

  const resolved: ResolvedQuickAction[] = [];

  for (const action of actions) {
    if (!action.enabled || !action.label?.trim()) {
      continue;
    }

    const url = resolveQuickActionUrl(action, tenantWhatsapp);
    if (!url) {
      continue;
    }

    resolved.push({
      label: action.label.trim(),
      type: action.type,
      url,
    });
  }

  return resolved;
}
