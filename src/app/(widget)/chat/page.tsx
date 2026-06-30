import { ChatPageClient } from "@/components/chat/chat-page-client";
import { HeroChatPageClient } from "@/components/chat/hero-chat-page-client";
import { getTenant } from "@/lib/tenant/get-tenant";
import {
  parseWidgetThemeOverride,
  resolveEffectiveWidgetTheme,
} from "@/lib/widget/theme";
import { getTenantSettings } from "@/modules/settings/service";
import { buildChatWidgetConfigFromSettings } from "@/modules/widget/service";

type ChatWidgetPageProps = {
  searchParams: Promise<{ theme?: string; mode?: string; inline?: string }>;
};

export default async function ChatWidgetPage({
  searchParams,
}: ChatWidgetPageProps) {
  const tenant = await getTenant();
  const settings = await getTenantSettings(tenant.id);
  const params = await searchParams;
  const themeOverride = parseWidgetThemeOverride(params.theme);
  const baseConfig = buildChatWidgetConfigFromSettings(
    tenant.publicKey,
    tenant.name,
    settings,
  );

  const config = {
    ...baseConfig,
    theme: resolveEffectiveWidgetTheme(
      settings?.widgetTheme,
      themeOverride,
    ),
  };

  if (params.mode === "hero") {
    return (
      <HeroChatPageClient
        config={config}
        inline={params.inline === "1" || params.inline === "true"}
      />
    );
  }

  return <ChatPageClient config={config} />;
}
