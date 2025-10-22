-- supabase/migrations/20251020100000_add_skills_to_membership_requests.sql
alter table public.membership_requests
add column if not exists skills text;

-- Optional: add a simple check constraint to avoid empty strings
alter table public.membership_requests
add constraint membership_requests_skills_nonempty
check (skills is null or length(trim(skills)) > 0);



