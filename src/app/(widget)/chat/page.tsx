import { ChatPageClient } from "@/components/chat/chat-page-client";
import { getTenant } from "@/lib/tenant/get-tenant";
import { getTenantSettings } from "@/modules/settings/service";
import { buildChatWidgetConfigFromSettings } from "@/modules/widget/service";

export default async function ChatWidgetPage() {
  const tenant = await getTenant();
  const settings = await getTenantSettings(tenant.id);

  return (
    <ChatPageClient
      config={buildChatWidgetConfigFromSettings(
        tenant.publicKey,
        tenant.name,
        settings,
      )}
    />
  );
}
