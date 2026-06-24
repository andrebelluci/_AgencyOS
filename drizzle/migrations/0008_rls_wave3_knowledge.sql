-- ISSUE-020 — RLS Onda 3: knowledge_documents, knowledge_chunks
-- Cross-tenant access must fail for the authenticated role.

--> statement-breakpoint
ALTER TABLE public.knowledge_documents ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE public.knowledge_documents FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY "knowledge_documents_select_authenticated"
  ON public.knowledge_documents
  FOR SELECT
  TO authenticated
  USING (tenant_id = (SELECT public.current_tenant_id()));
--> statement-breakpoint
CREATE POLICY "knowledge_documents_insert_authenticated"
  ON public.knowledge_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (tenant_id = (SELECT public.current_tenant_id()));
--> statement-breakpoint
CREATE POLICY "knowledge_documents_update_authenticated"
  ON public.knowledge_documents
  FOR UPDATE
  TO authenticated
  USING (tenant_id = (SELECT public.current_tenant_id()))
  WITH CHECK (tenant_id = (SELECT public.current_tenant_id()));
--> statement-breakpoint
CREATE POLICY "knowledge_documents_delete_authenticated"
  ON public.knowledge_documents
  FOR DELETE
  TO authenticated
  USING (tenant_id = (SELECT public.current_tenant_id()));
--> statement-breakpoint
ALTER TABLE public.knowledge_chunks ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE public.knowledge_chunks FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY "knowledge_chunks_select_authenticated"
  ON public.knowledge_chunks
  FOR SELECT
  TO authenticated
  USING (tenant_id = (SELECT public.current_tenant_id()));
--> statement-breakpoint
CREATE POLICY "knowledge_chunks_insert_authenticated"
  ON public.knowledge_chunks
  FOR INSERT
  TO authenticated
  WITH CHECK (tenant_id = (SELECT public.current_tenant_id()));
--> statement-breakpoint
CREATE POLICY "knowledge_chunks_update_authenticated"
  ON public.knowledge_chunks
  FOR UPDATE
  TO authenticated
  USING (tenant_id = (SELECT public.current_tenant_id()))
  WITH CHECK (tenant_id = (SELECT public.current_tenant_id()));
--> statement-breakpoint
CREATE POLICY "knowledge_chunks_delete_authenticated"
  ON public.knowledge_chunks
  FOR DELETE
  TO authenticated
  USING (tenant_id = (SELECT public.current_tenant_id()));
