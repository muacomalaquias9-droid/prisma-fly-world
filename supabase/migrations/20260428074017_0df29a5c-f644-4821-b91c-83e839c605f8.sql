-- Corrigir RLS shared_servers: exigir autenticação
DROP POLICY IF EXISTS "Anyone can add servers" ON public.shared_servers;
DROP POLICY IF EXISTS "Anyone can delete servers" ON public.shared_servers;

CREATE POLICY "Authenticated can add servers"
  ON public.shared_servers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can delete servers"
  ON public.shared_servers FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Revogar EXECUTE público das funções SECURITY DEFINER
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.has_active_subscription(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_active_subscription(uuid) TO authenticated;