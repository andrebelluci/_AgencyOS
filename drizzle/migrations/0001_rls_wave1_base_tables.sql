-- ISSUE-006 — RLS Onda 1: tenants, tenant_settings, users
-- Cross-tenant access must fail for the authenticated role.
-- service_role bypasses RLS (Supabase default).

CREATE OR REPLACE FUNCTION public.current_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT CASE
    WHEN (SELECT auth.uid()) IS NOT NULL THEN (
      SELECT u.tenant_id
      FROM public.users AS u
      WHERE u.id = (SELECT auth.uid())
    )
    ELSE NULLIF(current_setting('app.tenant_id', true), '')::uuid
  END;
$$;

COMMENT ON FUNCTION public.current_tenant_id() IS
  'Tenant scope for RLS: auth.users row in public.users, or app.tenant_id when no JWT.';

--> statement-breakpoint
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE public.tenants FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY "tenants_select_authenticated"
  ON public.tenants
  FOR SELECT
  TO authenticated
  USING (id = (SELECT public.current_tenant_id()));
--> statement-breakpoint
CREATE POLICY "tenants_update_authenticated"
  ON public.tenants
  FOR UPDATE
  TO authenticated
  USING (id = (SELECT public.current_tenant_id()))
  WITH CHECK (id = (SELECT public.current_tenant_id()));
--> statement-breakpoint
ALTER TABLE public.tenant_settings ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE public.tenant_settings FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY "tenant_settings_select_authenticated"
  ON public.tenant_settings
  FOR SELECT
  TO authenticated
  USING (tenant_id = (SELECT public.current_tenant_id()));
--> statement-breakpoint
CREATE POLICY "tenant_settings_insert_authenticated"
  ON public.tenant_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (tenant_id = (SELECT public.current_tenant_id()));
--> statement-breakpoint
CREATE POLICY "tenant_settings_update_authenticated"
  ON public.tenant_settings
  FOR UPDATE
  TO authenticated
  USING (tenant_id = (SELECT public.current_tenant_id()))
  WITH CHECK (tenant_id = (SELECT public.current_tenant_id()));
--> statement-breakpoint
CREATE POLICY "tenant_settings_delete_authenticated"
  ON public.tenant_settings
  FOR DELETE
  TO authenticated
  USING (tenant_id = (SELECT public.current_tenant_id()));
--> statement-breakpoint
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE public.users FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY "users_select_authenticated"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (tenant_id = (SELECT public.current_tenant_id()));
--> statement-breakpoint
CREATE POLICY "users_insert_authenticated"
  ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (tenant_id = (SELECT public.current_tenant_id()));
--> statement-breakpoint
CREATE POLICY "users_update_authenticated"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (tenant_id = (SELECT public.current_tenant_id()))
  WITH CHECK (tenant_id = (SELECT public.current_tenant_id()));
--> statement-breakpoint
CREATE POLICY "users_delete_authenticated"
  ON public.users
  FOR DELETE
  TO authenticated
  USING (tenant_id = (SELECT public.current_tenant_id()));
