-- ISSUE-038 (#44) — indexes for conversations search and date filters
CREATE INDEX IF NOT EXISTS "conversations_tenant_started_at_idx"
  ON "conversations" USING btree ("tenant_id", "started_at" DESC);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "messages_tenant_conversation_idx"
  ON "messages" USING btree ("tenant_id", "conversation_id");
