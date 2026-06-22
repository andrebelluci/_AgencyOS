"use server";

import { requireOwnerTenant } from "@/lib/auth/require-owner";
import {
  parseServicesText,
  tenantSettingsFormSchema,
  type TenantSettingsFormValues,
} from "@/modules/settings/schema";
import { updateTenantSettings } from "@/modules/settings/service";

export type SettingsActionState = {
  error?: string;
  success?: boolean;
};

export async function updateTenantSettingsAction(
  input: TenantSettingsFormValues,
): Promise<SettingsActionState> {
  const parsed = tenantSettingsFormSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  try {
    const { tenant } = await requireOwnerTenant();

    await updateTenantSettings(tenant.id, {
      companyName: parsed.data.companyName,
      whatsapp: parsed.data.whatsapp || null,
      city: parsed.data.city || null,
      services: parseServicesText(parsed.data.servicesText),
      systemPrompt: parsed.data.systemPrompt || null,
    });

    return { success: true };
  } catch {
    return { error: "Não foi possível salvar as configurações." };
  }
}
