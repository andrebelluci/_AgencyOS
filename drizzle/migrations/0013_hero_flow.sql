-- ISSUE-036 (#42) — conversational hero flow config per tenant

ALTER TABLE public.tenant_settings
  ADD COLUMN IF NOT EXISTS hero_flow jsonb;
