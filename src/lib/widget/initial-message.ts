export const DEFAULT_INITIAL_MESSAGE_TEMPLATE =
  "Olá! Sou o {{assistant_label}} da {{company_name}}. Posso ajudar você a conhecer nossos serviços, tirar dúvidas ou solicitar um orçamento.";

const COMPANY_NAME_PLACEHOLDER = /\{\{\s*company_name\s*\}\}/gi;
const ASSISTANT_LABEL_PLACEHOLDER = /\{\{\s*assistant_label\s*\}\}/gi;

export const DEFAULT_ASSISTANT_LABEL = "Funcionário Digital";

/**
 * Resolves the widget's first message from tenant_settings.initial_message.
 * Falls back to welcome_message (legacy) then the platform default template.
 */
export function resolveInitialMessage(
  template: string | null | undefined,
  companyName: string,
  legacyWelcomeMessage?: string | null,
  assistantLabel?: string | null,
): string {
  const raw =
    template?.trim() ||
    legacyWelcomeMessage?.trim() ||
    DEFAULT_INITIAL_MESSAGE_TEMPLATE;

  const safeName = companyName.trim() || "nossa empresa";
  const safeLabel = assistantLabel?.trim() || DEFAULT_ASSISTANT_LABEL;

  return raw
    .replace(COMPANY_NAME_PLACEHOLDER, safeName)
    .replace(ASSISTANT_LABEL_PLACEHOLDER, safeLabel);
}
