import { ChatPageClient } from "@/components/chat/chat-page-client";
import { getTenant } from "@/lib/tenant/get-tenant";
import {
  parseWidgetThemeOverride,
  resolveEffectiveWidgetTheme,
} from "@/lib/widget/theme";
import { getTenantSettings } from "@/modules/settings/service";
import { buildChatWidgetConfigFromSettings } from "@/modules/widget/service";

type ChatWidgetPageProps = {
  searchParams: Promise<{ theme?: string }>;
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

  return (
    <ChatPageClient
      config={{
        ...baseConfig,
        theme: resolveEffectiveWidgetTheme(
          settings?.widgetTheme,
          themeOverride,
        ),
      }}
    />
  );
}
