import { z } from "zod";

export const buildWhatsAppLinkInputSchema = z.object({
  phone: z.string().trim().min(8, "Informe um telefone válido."),
  message: z.string().trim().optional(),
  leadName: z.string().trim().min(1).optional(),
});

export type BuildWhatsAppLinkInput = z.infer<typeof buildWhatsAppLinkInputSchema>;

export type BuildWhatsAppLinkResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

export function normalizePhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 0) {
    return "";
  }

  if (digits.startsWith("55") && digits.length >= 12) {
    return digits;
  }

  const local = digits.startsWith("0") ? digits.slice(1) : digits;

  if (local.length === 10 || local.length === 11) {
    return `55${local}`;
  }

  return digits;
}

function buildDefaultMessage(leadName?: string): string {
  if (leadName) {
    return `Olá! Sou ${leadName} e gostaria de continuar o atendimento.`;
  }

  return "Olá! Gostaria de continuar o atendimento.";
}

export function buildWhatsAppLink(input: unknown): BuildWhatsAppLinkResult {
  const parsed = buildWhatsAppLinkInputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues.map((issue) => issue.message).join("; "),
    };
  }

  const phone = normalizePhoneForWhatsApp(parsed.data.phone);

  if (phone.length < 10) {
    return { ok: false, error: "Informe um telefone válido." };
  }

  const message =
    parsed.data.message?.trim() || buildDefaultMessage(parsed.data.leadName);
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${phone}?text=${encodedMessage}`;

  return { ok: true, url };
}
