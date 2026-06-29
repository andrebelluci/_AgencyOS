import type { QuickActionConfig } from "@/lib/widget/quick-actions";
import {
  DEFAULT_ASSISTANT_LABEL,
  DEFAULT_INITIAL_MESSAGE_TEMPLATE,
} from "@/lib/widget/initial-message";

export const DEFAULT_PRIMARY_COLOR = "#1e40af";
export const DEFAULT_WELCOME_MESSAGE =
  "Olá! Como posso ajudar você hoje?";

export { DEFAULT_ASSISTANT_LABEL, DEFAULT_INITIAL_MESSAGE_TEMPLATE };

export function buildDefaultTenantSettings(companyName: string) {
  return {
    companyName,
    city: null as string | null,
    services: [] as string[],
    welcomeMessage: DEFAULT_WELCOME_MESSAGE,
    initialMessage: DEFAULT_INITIAL_MESSAGE_TEMPLATE,
    assistantLabel: DEFAULT_ASSISTANT_LABEL,
    quickActions: [] as QuickActionConfig[],
    primaryColor: DEFAULT_PRIMARY_COLOR,
    whatsapp: null as string | null,
    logoUrl: null as string | null,
    secondaryColor: null as string | null,
    email: null as string | null,
    address: null as string | null,
    systemPrompt: null as string | null,
  };
}
