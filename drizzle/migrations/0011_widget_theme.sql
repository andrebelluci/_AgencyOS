-- ISSUE-045 — Widget dark mode theme (V0.2)

ALTER TABLE "tenant_settings" ADD COLUMN IF NOT EXISTS "widget_theme" text DEFAULT 'light' NOT NULL;

ALTER TABLE "tenant_settings" DROP CONSTRAINT IF EXISTS "tenant_settings_widget_theme_check";

ALTER TABLE "tenant_settings" ADD CONSTRAINT "tenant_settings_widget_theme_check"
  CHECK ("widget_theme" IN ('light', 'dark', 'auto'));
