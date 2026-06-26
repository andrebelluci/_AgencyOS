export const DEFAULT_INITIAL_MESSAGE_TEMPLATE =
  "Olá! Sou o Funcionário Digital da {{company_name}}. Posso ajudar você a conhecer nossos serviços, tirar dúvidas ou solicitar um orçamento.";

const COMPANY_NAME_PLACEHOLDER = /\{\{\s*company_name\s*\}\}/gi;

/**
 * Resolves the widget's first message from tenant_settings.initial_message.
 * Falls back to welcome_message (legacy) then the platform default template.
 */
export function resolveInitialMessage(
  template: string | null | undefined,
  companyName: string,
  legacyWelcomeMessage?: string | null,
): string {
  const raw =
    template?.trim() ||
    legacyWelcomeMessage?.trim() ||
    DEFAULT_INITIAL_MESSAGE_TEMPLATE;

  const safeName = companyName.trim() || "nossa empresa";

  return raw.replace(COMPANY_NAME_PLACEHOLDER, safeName);
}
