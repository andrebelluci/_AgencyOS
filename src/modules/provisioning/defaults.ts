export const DEFAULT_PRIMARY_COLOR = "#1e40af";
export const DEFAULT_WELCOME_MESSAGE =
  "Olá! Como posso ajudar você hoje?";

export function buildDefaultTenantSettings(companyName: string) {
  return {
    companyName,
    city: null as string | null,
    services: [] as string[],
    welcomeMessage: DEFAULT_WELCOME_MESSAGE,
    primaryColor: DEFAULT_PRIMARY_COLOR,
    whatsapp: null as string | null,
    logoUrl: null as string | null,
    secondaryColor: null as string | null,
    email: null as string | null,
    address: null as string | null,
    systemPrompt: null as string | null,
  };
}
