import { ChatWidgetLoader } from "@/components/chat/chat-widget-loader";
import { getTenant } from "@/lib/tenant/get-tenant";
import { getTenantSettings } from "@/modules/settings/service";

const DEFAULT_WELCOME =
  "Olá! Como posso ajudar você hoje?";

export default async function ChatWidgetPage() {
  const tenant = await getTenant();
  const settings = await getTenantSettings(tenant.id);

  return (
    <ChatWidgetLoader
      config={{
        publicKey: tenant.publicKey,
        companyName: settings?.companyName ?? tenant.name,
        welcomeMessage: settings?.welcomeMessage ?? DEFAULT_WELCOME,
        primaryColor: settings?.primaryColor,
        whatsapp: settings?.whatsapp,
      }}
    />
  );
}
