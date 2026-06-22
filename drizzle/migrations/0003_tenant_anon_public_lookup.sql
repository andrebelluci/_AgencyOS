-- ISSUE-004 + ISSUE-006: allow anon to resolve tenant by slug/public_key via PostgREST.
-- Required for middleware edge lookup (widget, public routes).
-- Exposes only active tenants; operational data remains protected by RLS.

CREATE POLICY "tenants_select_anon_public_lookup"
  ON public.tenants
  FOR SELECT
  TO anon
  USING (status = 'active');
