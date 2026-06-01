
-- Extensão para hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  api_key TEXT NOT NULL UNIQUE,
  secret_hash TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  last_used_at TIMESTAMPTZ,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.api_keys TO authenticated;
GRANT ALL ON public.api_keys TO service_role;

ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage api_keys"
ON public.api_keys
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Função para validar API key + secret (usada por edge function com service_role)
CREATE OR REPLACE FUNCTION public.verify_api_key(_api_key TEXT, _secret TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_hash TEXT;
  v_id UUID;
BEGIN
  SELECT id, secret_hash INTO v_id, v_hash
  FROM public.api_keys
  WHERE api_key = _api_key AND active = true
  LIMIT 1;

  IF v_id IS NULL THEN
    RETURN false;
  END IF;

  IF crypt(_secret, v_hash) = v_hash THEN
    UPDATE public.api_keys SET last_used_at = now() WHERE id = v_id;
    RETURN true;
  END IF;

  RETURN false;
END;
$$;

-- Função para criar API key (gera chave e faz hash do segredo)
CREATE OR REPLACE FUNCTION public.create_api_key(_name TEXT)
RETURNS TABLE(id UUID, api_key TEXT, secret TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_key TEXT;
  v_secret TEXT;
  v_hash TEXT;
  v_id UUID;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admin can create API keys';
  END IF;

  v_key := 'pf_' || encode(gen_random_bytes(16), 'hex');
  v_secret := 'sk_' || encode(gen_random_bytes(24), 'hex');
  v_hash := crypt(v_secret, gen_salt('bf', 8));

  INSERT INTO public.api_keys (name, api_key, secret_hash, created_by)
  VALUES (_name, v_key, v_hash, auth.uid())
  RETURNING public.api_keys.id INTO v_id;

  RETURN QUERY SELECT v_id, v_key, v_secret;
END;
$$;
