import { getClientEnv } from "@/env";
import { requireOwnerTenant } from "@/lib/auth/require-owner";
import { DEFAULT_INITIAL_MESSAGE_TEMPLATE } from "@/lib/widget/initial-message";
import { DEFAULT_ASSISTANT_LABEL, DEFAULT_PRIMARY_COLOR } from "@/modules/provisioning/defaults";
import {
  formatServicesText,
  type TenantSettingsFormValues,
} from "@/modules/settings/schema";
import { getTenantSettings } from "@/modules/settings/service";
import { buildEmbedScriptSnippet } from "@/modules/widget/embed-snippet";

import { EmbedCodeCard } from "./embed-code-card";
import { SettingsForm } from "./settings-form";

function toFormValues(
  settings: Awaited<ReturnType<typeof getTenantSettings>>,
): TenantSettingsFormValues {
  return {
    companyName: settings?.companyName ?? "",
    whatsapp: settings?.whatsapp ?? "",
    city: settings?.city ?? "",
    servicesText: formatServicesText(settings?.services ?? []),
    systemPrompt: settings?.systemPrompt ?? "",
    initialMessage:
      settings?.initialMessage ??
      settings?.welcomeMessage ??
      DEFAULT_INITIAL_MESSAGE_TEMPLATE,
    assistantLabel: settings?.assistantLabel ?? DEFAULT_ASSISTANT_LABEL,
    primaryColor: settings?.primaryColor ?? DEFAULT_PRIMARY_COLOR,
    quickActions: settings?.quickActions ?? [],
  };
}

export default async function SettingsPage() {
  const { tenant } = await requireOwnerTenant();
  const settings = await getTenantSettings(tenant.id);
  const { NEXT_PUBLIC_APP_URL } = getClientEnv();
  const embedSnippet = buildEmbedScriptSnippet(
    NEXT_PUBLIC_APP_URL,
    tenant.publicKey,
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
        <p className="text-sm text-muted-foreground">
          Personalize os dados da sua empresa no Funcionário Digital.
        </p>
      </div>

      <SettingsForm defaultValues={toFormValues(settings)} />

      <EmbedCodeCard snippet={embedSnippet} publicKey={tenant.publicKey} />
    </div>
  );
}
