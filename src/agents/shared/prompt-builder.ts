/**
 * Four-layer prompt builder (V0.1): system → platform → tenant → agent.
 * @see docs/PROMPT_SYSTEM.md
 */

export type TenantPromptContext = {
  companyName: string;
  city?: string | null;
  services?: string[];
  whatsapp?: string | null;
  email?: string | null;
  address?: string | null;
  /** Optional instructions from tenant_settings.system_prompt */
  customInstructions?: string | null;
};

export type TenantSettingsPromptSource = {
  companyName: string;
  city?: string | null;
  services?: string[] | null;
  whatsapp?: string | null;
  email?: string | null;
  address?: string | null;
  systemPrompt?: string | null;
};

export type PromptLayers = {
  system: string;
  platform: string;
  tenant: string;
  agent: string;
};

export type BuildPromptInput = {
  tenant: TenantPromptContext;
  agentPrompt: string;
};

const LAYER_SEPARATOR = "\n\n---\n\n";

export const SYSTEM_PROMPT = `Você faz parte do Agency OS.

Seu objetivo é ajudar empresas a operar através de inteligência artificial.

Você deve:
- ser preciso
- ser útil
- ser profissional
- ser transparente

Nunca invente informações.
Nunca invente preços.
Nunca invente dados empresariais.

Sempre peça esclarecimentos quando necessário.`;

export const PLATFORM_PROMPT = `Agency OS é uma plataforma para transformar pequenas empresas em empresas operáveis por IA.

Toda interação deve buscar:
- eficiência
- automação
- geração de valor
- melhoria operacional`;

export function buildSystemPrompt(): string {
  return SYSTEM_PROMPT;
}

export function buildPlatformPrompt(): string {
  return PLATFORM_PROMPT;
}

export function buildTenantPrompt(tenant: TenantPromptContext): string {
  const lines: string[] = ["## Contexto da empresa", `Empresa: ${tenant.companyName}`];

  if (tenant.city?.trim()) {
    lines.push(`Cidade: ${tenant.city.trim()}`);
  }

  if (tenant.address?.trim()) {
    lines.push(`Endereço: ${tenant.address.trim()}`);
  }

  const services = tenant.services?.filter((service) => service.trim().length > 0) ?? [];
  if (services.length > 0) {
    lines.push("Serviços:");
    for (const service of services) {
      lines.push(`- ${service.trim()}`);
    }
  }

  if (tenant.whatsapp?.trim()) {
    lines.push(`WhatsApp: ${tenant.whatsapp.trim()}`);
  }

  if (tenant.email?.trim()) {
    lines.push(`Email: ${tenant.email.trim()}`);
  }

  if (tenant.customInstructions?.trim()) {
    lines.push("", "Instruções adicionais:", tenant.customInstructions.trim());
  }

  return lines.join("\n");
}

export function tenantPromptContextFromSettings(
  settings: TenantSettingsPromptSource,
): TenantPromptContext {
  return {
    companyName: settings.companyName,
    city: settings.city,
    services: settings.services ?? [],
    whatsapp: settings.whatsapp,
    email: settings.email,
    address: settings.address,
    customInstructions: settings.systemPrompt,
  };
}

export function buildPromptLayers(input: BuildPromptInput): PromptLayers {
  return {
    system: buildSystemPrompt(),
    platform: buildPlatformPrompt(),
    tenant: buildTenantPrompt(input.tenant),
    agent: input.agentPrompt.trim(),
  };
}

export function buildPrompt(input: BuildPromptInput): string {
  const layers = buildPromptLayers(input);
  return [layers.system, layers.platform, layers.tenant, layers.agent].join(
    LAYER_SEPARATOR,
  );
}
