
drop policy "Community members viewable by members" on "public"."community_members";

drop policy "Communities viewable by public" on "public"."communities";

revoke delete on table "public"."communities" from "anon";

revoke insert on table "public"."communities" from "anon";

revoke references on table "public"."communities" from "anon";

revoke select on table "public"."communities" from "anon";

revoke trigger on table "public"."communities" from "anon";

revoke truncate on table "public"."communities" from "anon";

revoke update on table "public"."communities" from "anon";

revoke delete on table "public"."communities" from "authenticated";

revoke insert on table "public"."communities" from "authenticated";

revoke references on table "public"."communities" from "authenticated";

revoke select on table "public"."communities" from "authenticated";

revoke trigger on table "public"."communities" from "authenticated";

revoke truncate on table "public"."communities" from "authenticated";

revoke update on table "public"."communities" from "authenticated";

revoke delete on table "public"."communities" from "service_role";

revoke insert on table "public"."communities" from "service_role";

revoke references on table "public"."communities" from "service_role";

revoke select on table "public"."communities" from "service_role";

revoke trigger on table "public"."communities" from "service_role";

revoke truncate on table "public"."communities" from "service_role";

revoke update on table "public"."communities" from "service_role";

revoke delete on table "public"."community_members" from "anon";

revoke insert on table "public"."community_members" from "anon";

revoke references on table "public"."community_members" from "anon";

revoke select on table "public"."community_members" from "anon";

revoke trigger on table "public"."community_members" from "anon";

revoke truncate on table "public"."community_members" from "anon";

revoke update on table "public"."community_members" from "anon";

revoke delete on table "public"."community_members" from "authenticated";

revoke insert on table "public"."community_members" from "authenticated";

revoke references on table "public"."community_members" from "authenticated";

revoke select on table "public"."community_members" from "authenticated";

revoke trigger on table "public"."community_members" from "authenticated";

revoke truncate on table "public"."community_members" from "authenticated";

revoke update on table "public"."community_members" from "authenticated";

revoke delete on table "public"."community_members" from "service_role";

revoke insert on table "public"."community_members" from "service_role";

revoke references on table "public"."community_members" from "service_role";

revoke select on table "public"."community_members" from "service_role";

revoke trigger on table "public"."community_members" from "service_role";

revoke truncate on table "public"."community_members" from "service_role";

revoke update on table "public"."community_members" from "service_role";

revoke delete on table "public"."membership_requests" from "anon";

revoke insert on table "public"."membership_requests" from "anon";

revoke references on table "public"."membership_requests" from "anon";

revoke select on table "public"."membership_requests" from "anon";

revoke trigger on table "public"."membership_requests" from "anon";

revoke truncate on table "public"."membership_requests" from "anon";

revoke update on table "public"."membership_requests" from "anon";

revoke delete on table "public"."membership_requests" from "authenticated";

revoke insert on table "public"."membership_requests" from "authenticated";

revoke references on table "public"."membership_requests" from "authenticated";

revoke select on table "public"."membership_requests" from "authenticated";

revoke trigger on table "public"."membership_requests" from "authenticated";

revoke truncate on table "public"."membership_requests" from "authenticated";

revoke update on table "public"."membership_requests" from "authenticated";

revoke delete on table "public"."membership_requests" from "service_role";

revoke insert on table "public"."membership_requests" from "service_role";

revoke references on table "public"."membership_requests" from "service_role";

revoke select on table "public"."membership_requests" from "service_role";

revoke trigger on table "public"."membership_requests" from "service_role";

revoke truncate on table "public"."membership_requests" from "service_role";

revoke update on table "public"."membership_requests" from "service_role";

revoke delete on table "public"."profiles" from "anon";

revoke insert on table "public"."profiles" from "anon";

revoke references on table "public"."profiles" from "anon";

revoke select on table "public"."profiles" from "anon";

revoke trigger on table "public"."profiles" from "anon";

revoke truncate on table "public"."profiles" from "anon";

revoke update on table "public"."profiles" from "anon";

revoke delete on table "public"."profiles" from "authenticated";

revoke insert on table "public"."profiles" from "authenticated";

revoke references on table "public"."profiles" from "authenticated";

revoke select on table "public"."profiles" from "authenticated";

revoke trigger on table "public"."profiles" from "authenticated";

revoke truncate on table "public"."profiles" from "authenticated";

revoke update on table "public"."profiles" from "authenticated";

revoke delete on table "public"."profiles" from "service_role";

revoke insert on table "public"."profiles" from "service_role";

revoke references on table "public"."profiles" from "service_role";

revoke select on table "public"."profiles" from "service_role";

revoke trigger on table "public"."profiles" from "service_role";

revoke truncate on table "public"."profiles" from "service_role";

revoke update on table "public"."profiles" from "service_role";

revoke delete on table "public"."project_members" from "anon";

revoke insert on table "public"."project_members" from "anon";

revoke references on table "public"."project_members" from "anon";

revoke select on table "public"."project_members" from "anon";

revoke trigger on table "public"."project_members" from "anon";

revoke truncate on table "public"."project_members" from "anon";

revoke update on table "public"."project_members" from "anon";

revoke delete on table "public"."project_members" from "authenticated";

revoke insert on table "public"."project_members" from "authenticated";

revoke references on table "public"."project_members" from "authenticated";

revoke select on table "public"."project_members" from "authenticated";

revoke trigger on table "public"."project_members" from "authenticated";

revoke truncate on table "public"."project_members" from "authenticated";

revoke update on table "public"."project_members" from "authenticated";

revoke delete on table "public"."project_members" from "service_role";

revoke insert on table "public"."project_members" from "service_role";

revoke references on table "public"."project_members" from "service_role";

revoke select on table "public"."project_members" from "service_role";

revoke trigger on table "public"."project_members" from "service_role";

revoke truncate on table "public"."project_members" from "service_role";

revoke update on table "public"."project_members" from "service_role";

revoke delete on table "public"."projects" from "anon";

revoke insert on table "public"."projects" from "anon";

revoke references on table "public"."projects" from "anon";

revoke select on table "public"."projects" from "anon";

revoke trigger on table "public"."projects" from "anon";

revoke truncate on table "public"."projects" from "anon";

revoke update on table "public"."projects" from "anon";

revoke delete on table "public"."projects" from "authenticated";

revoke insert on table "public"."projects" from "authenticated";

revoke references on table "public"."projects" from "authenticated";

revoke select on table "public"."projects" from "authenticated";

revoke trigger on table "public"."projects" from "authenticated";

revoke truncate on table "public"."projects" from "authenticated";

revoke update on table "public"."projects" from "authenticated";

revoke delete on table "public"."projects" from "service_role";

revoke insert on table "public"."projects" from "service_role";

revoke references on table "public"."projects" from "service_role";

revoke select on table "public"."projects" from "service_role";

revoke trigger on table "public"."projects" from "service_role";

revoke truncate on table "public"."projects" from "service_role";

revoke update on table "public"."projects" from "service_role";

revoke delete on table "public"."resources" from "anon";

revoke insert on table "public"."resources" from "anon";

revoke references on table "public"."resources" from "anon";

revoke select on table "public"."resources" from "anon";

revoke trigger on table "public"."resources" from "anon";

revoke truncate on table "public"."resources" from "anon";

revoke update on table "public"."resources" from "anon";

revoke delete on table "public"."resources" from "authenticated";

revoke insert on table "public"."resources" from "authenticated";

revoke references on table "public"."resources" from "authenticated";

revoke select on table "public"."resources" from "authenticated";

revoke trigger on table "public"."resources" from "authenticated";

revoke truncate on table "public"."resources" from "authenticated";

revoke update on table "public"."resources" from "authenticated";

revoke delete on table "public"."resources" from "service_role";

revoke insert on table "public"."resources" from "service_role";

revoke references on table "public"."resources" from "service_role";

revoke select on table "public"."resources" from "service_role";

revoke trigger on table "public"."resources" from "service_role";

revoke truncate on table "public"."resources" from "service_role";

revoke update on table "public"."resources" from "service_role";

revoke delete on table "public"."user_roles" from "anon";

revoke insert on table "public"."user_roles" from "anon";

revoke references on table "public"."user_roles" from "anon";

revoke select on table "public"."user_roles" from "anon";

revoke trigger on table "public"."user_roles" from "anon";

revoke truncate on table "public"."user_roles" from "anon";

revoke update on table "public"."user_roles" from "anon";

revoke delete on table "public"."user_roles" from "authenticated";

revoke insert on table "public"."user_roles" from "authenticated";

revoke references on table "public"."user_roles" from "authenticated";

revoke select on table "public"."user_roles" from "authenticated";

revoke trigger on table "public"."user_roles" from "authenticated";

revoke truncate on table "public"."user_roles" from "authenticated";

revoke update on table "public"."user_roles" from "authenticated";

revoke delete on table "public"."user_roles" from "service_role";

revoke insert on table "public"."user_roles" from "service_role";

revoke references on table "public"."user_roles" from "service_role";

revoke select on table "public"."user_roles" from "service_role";

revoke trigger on table "public"."user_roles" from "service_role";

revoke truncate on table "public"."user_roles" from "service_role";

revoke update on table "public"."user_roles" from "service_role";

alter table "public"."user_roles" drop constraint "user_roles_user_id_role_key";

drop index if exists "public"."user_roles_user_id_role_key";

create table "public"."join_requests" (
    "id" uuid not null default gen_random_uuid(),
    "first_name" text not null,
    "last_name" text not null,
    "email" text not null,
    "phone" text,
    "project_description" text not null,
    "status" text default 'pending'::text,
    "created_at" timestamp with time zone not null default now(),
    "reviewed_at" timestamp with time zone,
    "reviewed_by" uuid
);


alter table "public"."join_requests" enable row level security;

alter table "public"."communities" add column "is_public" boolean default true;

alter table "public"."membership_requests" add column "user_id" uuid;

CREATE UNIQUE INDEX join_requests_pkey ON public.join_requests USING btree (id);

CREATE UNIQUE INDEX user_roles_user_id_key ON public.user_roles USING btree (user_id);

alter table "public"."join_requests" add constraint "join_requests_pkey" PRIMARY KEY using index "join_requests_pkey";

alter table "public"."join_requests" add constraint "join_requests_reviewed_by_fkey" FOREIGN KEY (reviewed_by) REFERENCES auth.users(id) not valid;

alter table "public"."join_requests" validate constraint "join_requests_reviewed_by_fkey";

alter table "public"."join_requests" add constraint "join_requests_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text]))) not valid;

alter table "public"."join_requests" validate constraint "join_requests_status_check";

alter table "public"."membership_requests" add constraint "membership_requests_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."membership_requests" validate constraint "membership_requests_user_id_fkey";

alter table "public"."user_roles" add constraint "user_roles_user_id_key" UNIQUE using index "user_roles_user_id_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.review_join_request(_request_id uuid, _new_status text)
 RETURNS TABLE(id uuid, first_name text, last_name text, email text, phone text, project_description text, status text, created_at timestamp with time zone, reviewed_at timestamp with time zone, reviewed_by uuid)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  _caller uuid;
BEGIN
  -- ensure valid status
  IF _new_status NOT IN ('approved','rejected') THEN
    RAISE EXCEPTION 'invalid status: %, allowed: approved,rejected', _new_status;
  END IF;

  -- ensure caller context exists
  _caller := auth.uid();
  IF _caller IS NULL THEN
    RAISE EXCEPTION 'must be called by an authenticated user';
  END IF;

  -- check admin role using your helper
  IF NOT public.has_role(_caller, 'admin') THEN
    RAISE EXCEPTION 'only admins can review join requests';
  END IF;

  -- perform update
  UPDATE public.join_requests
  SET status = _new_status,
      reviewed_at = now(),
      reviewed_by = _caller
  WHERE id = _request_id
  RETURNING id, first_name, last_name, email, phone, project_description, status, created_at, reviewed_at, reviewed_by
  INTO id, first_name, last_name, email, phone, project_description, status, created_at, reviewed_at, reviewed_by;

  IF id IS NULL THEN
    RAISE EXCEPTION 'join_request with id % not found', _request_id;
  END IF;

  RETURN NEXT;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_public_profiles(user_ids text[])
 RETURNS TABLE(user_id uuid, first_name text, last_name text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select p.user_id, p.first_name, p.last_name
  from public.profiles as p
  where p.user_id = any ((user_ids)::uuid[]);
$function$
;

grant execute on function public.get_public_profiles(text[]) to anon;
grant execute on function public.get_public_profiles(text[]) to authenticated;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  
  -- Assign visitor role by default
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'visitor');
  
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

create policy "Community members viewable by members and admins"
on "public"."community_members"
as permissive
for select
to authenticated
using ((has_role(auth.uid(), 'member'::app_role) OR has_role(auth.uid(), 'admin'::app_role)));


create policy "Community members viewable by visitors"
on "public"."community_members"
as permissive
for select
to anon
using ((EXISTS ( SELECT 1
   FROM communities c
  WHERE ((c.id = community_members.community_id) AND (c.is_public = true)))));


create policy "Admins can update join requests"
on "public"."join_requests"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM user_roles ur
  WHERE ((ur.user_id = auth.uid()) AND (ur.role = 'admin'::app_role)))));


create policy "Anyone can create join request"
on "public"."join_requests"
as permissive
for insert
to anon, authenticated
with check (true);


create policy "Join requests viewable by admins"
on "public"."join_requests"
as permissive
for select
to authenticated
using (has_role(auth.uid(), 'admin'::app_role));


create policy "Only admins can update join requests"
on "public"."join_requests"
as permissive
for update
to authenticated
using (has_role(auth.uid(), 'admin'::app_role));


create policy "Users can update own profile"
on "public"."membership_requests"
as permissive
for update
to authenticated
using ((auth.uid() = user_id));


create policy "users can own request"
on "public"."membership_requests"
as permissive
for update
to public
using ((auth.email() = email))
with check ((auth.email() = email));


create policy "Communities viewable by public"
on "public"."communities"
as permissive
for select
to anon
using ((is_public = true));




