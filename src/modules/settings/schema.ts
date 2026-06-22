import { z } from "zod";

export const tenantSettingsFormSchema = z.object({
  companyName: z.string().trim().min(1, "Informe o nome da empresa."),
  whatsapp: z.string().trim().optional(),
  city: z.string().trim().optional(),
  servicesText: z.string(),
  systemPrompt: z.string().optional(),
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
