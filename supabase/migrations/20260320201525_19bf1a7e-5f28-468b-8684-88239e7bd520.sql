CREATE POLICY "Anyone can delete servers"
ON public.shared_servers
FOR DELETE
TO anon, authenticated
USING (true);