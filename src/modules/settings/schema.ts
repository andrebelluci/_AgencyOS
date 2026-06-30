import { z } from "zod";

import { QUICK_ACTION_TYPES } from "@/lib/widget/quick-actions";
import { WIDGET_THEMES } from "@/lib/widget/theme";
import { isValidHexColor } from "@/lib/utils/color";
import { DEFAULT_INITIAL_MESSAGE_TEMPLATE } from "@/lib/widget/initial-message";

export const quickActionFormSchema = z.object({
  label: z.string().trim().min(1, "Informe o rótulo da ação.").max(40),
  type: z.enum(QUICK_ACTION_TYPES),
  url: z.string().trim().optional(),
  enabled: z.boolean(),
});

export const tenantSettingsFormSchema = z.object({
  companyName: z.string().trim().min(1, "Informe o nome da empresa."),
  whatsapp: z.string().trim().optional(),
  city: z.string().trim().optional(),
  servicesText: z.string(),
  systemPrompt: z.string().optional(),
  initialMessage: z
    .string()
    .trim()
    .min(1, "Informe a mensagem inicial do widget.")
    .max(2000, "Máximo de 2000 caracteres."),
  assistantLabel: z
    .string()
    .trim()
    .min(1, "Informe como o assistente aparece no widget.")
    .max(60, "Máximo de 60 caracteres."),
  primaryColor: z
    .string()
    .trim()
    .refine((value) => !value || isValidHexColor(value), {
      message: "Cor inválida. Use o formato #RRGGBB.",
    }),
  widgetTheme: z.enum(WIDGET_THEMES),
  quickActions: z.array(quickActionFormSchema).max(6),
});

export type TenantSettingsFormValues = z.infer<typeof tenantSettingsFormSchema>;

export function parseServicesText(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export function formatServicesText(services: string[]): string {
  return services.join("\n");
}

export const INITIAL_MESSAGE_PLACEHOLDER = DEFAULT_INITIAL_MESSAGE_TEMPLATE;
