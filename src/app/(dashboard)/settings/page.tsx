import { requireOwnerTenant } from "@/lib/auth/require-owner";
import {
  formatServicesText,
  type TenantSettingsFormValues,
} from "@/modules/settings/schema";
import { getTenantSettings } from "@/modules/settings/service";

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
  };
}

export default async function SettingsPage() {
  const { tenant } = await requireOwnerTenant();
  const settings = await getTenantSettings(tenant.id);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
        <p className="text-sm text-muted-foreground">
          Personalize os dados da sua empresa no Funcionário Digital.
        </p>
      </div>

      <SettingsForm defaultValues={toFormValues(settings)} />
    </div>
  );
}
