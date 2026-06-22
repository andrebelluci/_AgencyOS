-- Fix ISSUE-006: avoid RLS recursion when resolving tenant from public.users

CREATE OR REPLACE FUNCTION public.get_auth_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT u.tenant_id
  FROM public.users AS u
  WHERE u.id = (SELECT auth.uid())
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_auth_tenant_id() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_auth_tenant_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_auth_tenant_id() TO service_role;

COMMENT ON FUNCTION public.get_auth_tenant_id() IS
  'RLS helper: tenant_id for auth.uid(). SECURITY DEFINER avoids users-table policy recursion.';

--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.current_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT COALESCE(
    (SELECT public.get_auth_tenant_id()),
    NULLIF(current_setting('app.tenant_id', true), '')::uuid
  );
$$;

REVOKE ALL ON FUNCTION public.current_tenant_id() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_tenant_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_tenant_id() TO service_role;

COMMENT ON FUNCTION public.current_tenant_id() IS
  'Tenant scope for RLS: JWT user tenant, else app.tenant_id session var.';
