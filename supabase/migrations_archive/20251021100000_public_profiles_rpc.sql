-- Expose only public profile names via SECURITY DEFINER RPC for visitors
-- Allows anon/visitors to resolve user_id -> (first_name, last_name) safely

create or replace function public.get_public_profiles(user_ids text[])
returns table (
  user_id uuid,
  first_name text,
  last_name text
)
language sql
security definer
set search_path = public
stable
as $$
  select p.user_id, p.first_name, p.last_name
  from public.profiles as p
  where p.user_id = any ((user_ids)::uuid[]);
$$;

-- Ensure ownership is postgres (handled by Supabase migrations runner by default)
-- Grant execute to anon and authenticated
grant execute on function public.get_public_profiles(text[]) to anon;
grant execute on function public.get_public_profiles(text[]) to authenticated;
