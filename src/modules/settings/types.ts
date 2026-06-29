import type { QuickActionConfig } from "@/lib/widget/quick-actions";
import type { WidgetTheme } from "@/lib/widget/theme";
import { normalizeHexColor } from "@/lib/utils/color";

export type UpdateTenantSettingsInput = {
  companyName: string;
  whatsapp?: string | null;
  city?: string | null;
  services: string[];
  systemPrompt?: string | null;
  initialMessage?: string | null;
  assistantLabel?: string | null;
  primaryColor?: string | null;
  widgetTheme?: WidgetTheme;
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
