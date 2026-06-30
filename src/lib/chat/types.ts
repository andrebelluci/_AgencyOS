import type { ResolvedQuickAction } from "@/lib/widget/quick-actions";
import type { WidgetTheme } from "@/lib/widget/theme";
import type { HeroFlowConfig } from "@/lib/widget/hero-flow";

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

export type HeroChatConfig = ChatWidgetConfig & {
  heroFlow: HeroFlowConfig;
};
