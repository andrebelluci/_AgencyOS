import { buildWhatsAppLink } from "@/tools/build-whatsapp-link";

type ToolCallEndResult = {
  ok?: boolean;
  tool?: string;
  data?: unknown;
  error?: string;
};

type LeadToolData = {
  id?: string;
  name?: string | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseToolResult(result: unknown): ToolCallEndResult | null {
  if (!isRecord(result)) {
    return null;
  }

  return result as ToolCallEndResult;
}

export function extractWhatsAppUrlFromToolResult(
  toolName: string,
  result: unknown,
  tenantWhatsApp?: string | null,
): string | null {
  const parsed = parseToolResult(result);

  if (!parsed?.ok) {
    return null;
  }

  if (toolName === "buildWhatsAppLink" && isRecord(parsed.data)) {
    const url = parsed.data.url;
    return typeof url === "string" && url.startsWith("https://wa.me/")
      ? url
      : null;
  }

  if (toolName !== "createLead" || !tenantWhatsApp?.trim()) {
    return null;
  }

  const lead = parsed.data as LeadToolData | undefined;
  const link = buildWhatsAppLink({
    phone: tenantWhatsApp,
    leadName: lead?.name?.trim() || undefined,
  });

  return link.ok ? link.url : null;
}
