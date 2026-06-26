-- ISSUE-031A/B — initial_message + quick_actions on tenant_settings

ALTER TABLE "tenant_settings" ADD COLUMN IF NOT EXISTS "initial_message" text;
--> statement-breakpoint
ALTER TABLE "tenant_settings" ADD COLUMN IF NOT EXISTS "quick_actions" jsonb DEFAULT '[]'::jsonb NOT NULL;
--> statement-breakpoint
UPDATE "tenant_settings"
SET "initial_message" = COALESCE("initial_message", "welcome_message")
WHERE "initial_message" IS NULL AND "welcome_message" IS NOT NULL;
