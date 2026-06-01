
REVOKE EXECUTE ON FUNCTION public.verify_api_key(TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_api_key(TEXT, TEXT) TO service_role;

REVOKE EXECUTE ON FUNCTION public.create_api_key(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_api_key(TEXT) TO authenticated, service_role;
