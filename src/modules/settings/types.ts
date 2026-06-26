import type { QuickActionConfig } from "@/lib/widget/quick-actions";
import { normalizeHexColor } from "@/lib/utils/color";

export type UpdateTenantSettingsInput = {
  companyName: string;
  whatsapp?: string | null;
  city?: string | null;
  services: string[];
  systemPrompt?: string | null;
  initialMessage?: string | null;
  primaryColor?: string | null;
  quickActions?: QuickActionConfig[];
};

export function normalizePrimaryColorInput(
  value: string | undefined,
): string | null {
  if (!value?.trim()) {
    return null;
  }

  return normalizeHexColor(value);
}
