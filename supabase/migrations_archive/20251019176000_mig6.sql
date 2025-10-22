-- Allow authenticated users to view their own membership request(s)
-- Idempotent: drop then create policy

DROP POLICY IF EXISTS "Users can view own membership request" ON public.membership_requests;

CREATE POLICY "Users can view own membership request"
  ON public.membership_requests FOR SELECT
  TO authenticated
  USING (
    email = (
      SELECT p.email FROM public.profiles p WHERE p.user_id = auth.uid() LIMIT 1
    )
  );
