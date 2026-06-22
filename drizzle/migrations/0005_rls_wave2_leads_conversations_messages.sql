-- ISSUE-007 — RLS Onda 2: leads, conversations, messages
-- Cross-tenant access must fail for the authenticated role.

--> statement-breakpoint
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE public.leads FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY "leads_select_authenticated"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (tenant_id = (SELECT public.current_tenant_id()));
--> statement-breakpoint
CREATE POLICY "leads_insert_authenticated"
  ON public.leads
  FOR INSERT
  TO authenticated
  WITH CHECK (tenant_id = (SELECT public.current_tenant_id()));
--> statement-breakpoint
CREATE POLICY "leads_update_authenticated"
  ON public.leads
  FOR UPDATE
  TO authenticated
  USING (tenant_id = (SELECT public.current_tenant_id()))
  WITH CHECK (tenant_id = (SELECT public.current_tenant_id()));
--> statement-breakpoint
CREATE POLICY "leads_delete_authenticated"
  ON public.leads
  FOR DELETE
  TO authenticated
  USING (tenant_id = (SELECT public.current_tenant_id()));
--> statement-breakpoint
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE public.conversations FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY "conversations_select_authenticated"
  ON public.conversations
  FOR SELECT
  TO authenticated
  USING (tenant_id = (SELECT public.current_tenant_id()));
--> statement-breakpoint
CREATE POLICY "conversations_insert_authenticated"
  ON public.conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (tenant_id = (SELECT public.current_tenant_id()));
--> statement-breakpoint
CREATE POLICY "conversations_update_authenticated"
  ON public.conversations
  FOR UPDATE
  TO authenticated
  USING (tenant_id = (SELECT public.current_tenant_id()))
  WITH CHECK (tenant_id = (SELECT public.current_tenant_id()));
--> statement-breakpoint
CREATE POLICY "conversations_delete_authenticated"
  ON public.conversations
  FOR DELETE
  TO authenticated
  USING (tenant_id = (SELECT public.current_tenant_id()));
--> statement-breakpoint
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE public.messages FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY "messages_select_authenticated"
  ON public.messages
  FOR SELECT
  TO authenticated
  USING (tenant_id = (SELECT public.current_tenant_id()));
--> statement-breakpoint
CREATE POLICY "messages_insert_authenticated"
  ON public.messages
  FOR INSERT
  TO authenticated
  WITH CHECK (tenant_id = (SELECT public.current_tenant_id()));
--> statement-breakpoint
CREATE POLICY "messages_update_authenticated"
  ON public.messages
  FOR UPDATE
  TO authenticated
  USING (tenant_id = (SELECT public.current_tenant_id()))
  WITH CHECK (tenant_id = (SELECT public.current_tenant_id()));
--> statement-breakpoint
CREATE POLICY "messages_delete_authenticated"
  ON public.messages
  FOR DELETE
  TO authenticated
  USING (tenant_id = (SELECT public.current_tenant_id()));
