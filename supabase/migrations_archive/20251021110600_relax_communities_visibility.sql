-- Allow all authenticated users (including visitors) to view communities
-- Previously, only members/admin could read when authenticated, which blocked visitors

DROP POLICY IF EXISTS "Communities viewable by authenticated" ON public.communities;
DROP POLICY IF EXISTS "Communities viewable by members" ON public.communities;

CREATE POLICY "Communities viewable by authenticated"
  ON public.communities FOR SELECT
  TO authenticated
  USING (true);
