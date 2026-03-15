CREATE TABLE public.shared_servers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  added_by TEXT DEFAULT 'anonymous',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.shared_servers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read servers"
  ON public.shared_servers FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can add servers"
  ON public.shared_servers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.shared_servers;