/** Dev tenant from `npm run db:seed` (scripts/seed-dev-tenant.ts). */
export const DEV_PUBLIC_KEY =
  process.env.E2E_PUBLIC_KEY?.trim() || "pk_dev_local";

export const DEV_OWNER_EMAIL =
  process.env.E2E_OWNER_EMAIL?.trim() || "owner@belluci.dev";

export const DEV_OWNER_PASSWORD =
  process.env.E2E_OWNER_PASSWORD?.trim() || "BelluciDev2026!";

export const DEV_COMPANY_NAME =
  process.env.E2E_COMPANY_NAME?.trim() || "Belluci Acabamentos";

/** Default from `src/lib/widget/initial-message.ts` (tenant_settings.assistant_label). */
export const DEV_ASSISTANT_LABEL =
  process.env.E2E_ASSISTANT_LABEL?.trim() || "Funcionário Digital";

export const INVALID_PUBLIC_KEY = "pk_invalid_does_not_exist";

export const hasOpenAiKey = Boolean(process.env.OPENAI_API_KEY?.trim());
