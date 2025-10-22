-- Add sector to membership_requests for capturing user's secteur d'activité in the join request
-- Idempotent
ALTER TABLE IF EXISTS public.membership_requests
  ADD COLUMN IF NOT EXISTS sector TEXT;


