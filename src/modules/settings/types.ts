export type UpdateTenantSettingsInput = {
  companyName: string;
  whatsapp?: string | null;
  city?: string | null;
  services: string[];
  systemPrompt?: string | null;
};
