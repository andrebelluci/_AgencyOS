import type { ResolvedQuickAction } from "@/lib/widget/quick-actions";
import type { WidgetTheme } from "@/lib/widget/theme";

export type ChatUiMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  status: "complete" | "streaming" | "error";
};

export type ChatWidgetConfig = {
  publicKey: string;
  companyName: string;
  assistantLabel: string;
  welcomeMessage: string;
  primaryColor?: string | null;
  theme: WidgetTheme;
  whatsapp?: string | null;
  quickActions?: ResolvedQuickAction[];
};
