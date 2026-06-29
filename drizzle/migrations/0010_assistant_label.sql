-- Widget assistant subtitle (replaces hardcoded "Funcionário Digital" per tenant)

ALTER TABLE "tenant_settings" ADD COLUMN IF NOT EXISTS "assistant_label" text;
