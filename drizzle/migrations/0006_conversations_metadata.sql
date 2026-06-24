-- ISSUE-019 — conversation metadata for WhatsApp click tracking

ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb;
