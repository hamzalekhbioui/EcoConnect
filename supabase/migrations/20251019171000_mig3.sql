-- Create app_role enum for user roles (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'app_role' AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'member', 'visitor');
  END IF;
END
$$;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  sector TEXT,
  skills TEXT[],
  bio TEXT,
  avatar_url TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL DEFAULT 'visitor',
  UNIQUE(user_id, role)
);

-- Create communities table
CREATE TABLE IF NOT EXISTS public.communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  sector TEXT NOT NULL,
  icon TEXT,
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create community_members table
CREATE TABLE IF NOT EXISTS public.community_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(community_id, user_id)
);

-- Create membership_requests table
CREATE TABLE IF NOT EXISTS public.membership_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  project_description TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Create resources table for storing resources
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  category TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create projects table for collaborative projects
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create project_members table
CREATE TABLE IF NOT EXISTS public.project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(project_id, user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
-- Drop existing triggers to ensure idempotency
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_communities_updated_at ON public.communities;
DROP TRIGGER IF EXISTS update_resources_updated_at ON public.resources;
DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_communities_updated_at
  BEFORE UPDATE ON public.communities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for profiles
-- Drop existing policies to ensure idempotency
DROP POLICY IF EXISTS "Profiles are viewable by members" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Profiles are viewable by members"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'member') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_roles
-- Drop existing policies to ensure idempotency
DROP POLICY IF EXISTS "User roles viewable by authenticated users" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;

CREATE POLICY "User roles viewable by authenticated users"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for communities
-- Drop existing policies to ensure idempotency
DROP POLICY IF EXISTS "Communities viewable by members" ON public.communities;
DROP POLICY IF EXISTS "Communities viewable by public" ON public.communities;
DROP POLICY IF EXISTS "Only admins can manage communities" ON public.communities;

CREATE POLICY "Communities viewable by members"
  ON public.communities FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'member') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Communities viewable by public"
  ON public.communities FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Only admins can manage communities"
  ON public.communities FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for community_members
-- Drop existing policies to ensure idempotency
DROP POLICY IF EXISTS "Community members viewable by members" ON public.community_members;
DROP POLICY IF EXISTS "Users can join communities" ON public.community_members;
DROP POLICY IF EXISTS "Users can leave communities" ON public.community_members;

CREATE POLICY "Community members viewable by members"
  ON public.community_members FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'member') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can join communities"
  ON public.community_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND (public.has_role(auth.uid(), 'member') OR public.has_role(auth.uid(), 'admin')));

CREATE POLICY "Users can leave communities"
  ON public.community_members FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for membership_requests
-- Drop existing policies to ensure idempotency
DROP POLICY IF EXISTS "Membership requests viewable by admins" ON public.membership_requests;
DROP POLICY IF EXISTS "Anyone can create membership request" ON public.membership_requests;
DROP POLICY IF EXISTS "Only admins can update membership requests" ON public.membership_requests;

CREATE POLICY "Membership requests viewable by admins"
  ON public.membership_requests FOR SELECT
  TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can create membership request"
  ON public.membership_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Only admins can update membership requests"
  ON public.membership_requests FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for resources
-- Drop existing policies to ensure idempotency
DROP POLICY IF EXISTS "Resources viewable by members" ON public.resources;
DROP POLICY IF EXISTS "Members can create resources" ON public.resources;
DROP POLICY IF EXISTS "Users can update own resources" ON public.resources;
DROP POLICY IF EXISTS "Users can delete own resources" ON public.resources;

CREATE POLICY "Resources viewable by members"
  ON public.resources FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'member') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Members can create resources"
  ON public.resources FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'member') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own resources"
  ON public.resources FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own resources"
  ON public.resources FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- RLS Policies for projects
-- Drop existing policies to ensure idempotency
DROP POLICY IF EXISTS "Projects viewable by members" ON public.projects;
DROP POLICY IF EXISTS "Members can create projects" ON public.projects;
DROP POLICY IF EXISTS "Project creators can update projects" ON public.projects;
DROP POLICY IF EXISTS "Project creators can delete projects" ON public.projects;

CREATE POLICY "Projects viewable by members"
  ON public.projects FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'member') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Members can create projects"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'member') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Project creators can update projects"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Project creators can delete projects"
  ON public.projects FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- RLS Policies for project_members
-- Drop existing policies to ensure idempotency
DROP POLICY IF EXISTS "Project members viewable by members" ON public.project_members;
DROP POLICY IF EXISTS "Members can join projects" ON public.project_members;
DROP POLICY IF EXISTS "Users can leave projects" ON public.project_members;

CREATE POLICY "Project members viewable by members"
  ON public.project_members FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'member') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Members can join projects"
  ON public.project_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND (public.has_role(auth.uid(), 'member') OR public.has_role(auth.uid(), 'admin')));

CREATE POLICY "Users can leave projects"
  ON public.project_members FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert some sample data
INSERT INTO public.communities (name, description, sector, icon, member_count) VALUES
('Tech Innovators', 'Communauté des innovateurs technologiques', 'tech', '💻', 0),
('Écologie & Durabilité', 'Acteurs du développement durable', 'ecology', '🌱', 0),
('Santé & Bien-être', 'Professionnels de la santé', 'health', '🏥', 0),
('Créatifs & Artistes', 'Artistes et créateurs', 'creative', '🎨', 0),
('Coaching Professionnel', 'Coachs et consultants', 'coaching', '🎯', 0),
('Éducation & Formation', 'Éducateurs et formateurs', 'education', '📚', 0);

-- Insert some sample resources
INSERT INTO public.resources (title, description, category, created_by) VALUES
('Guide de l''économie circulaire', 'Documentation complète sur les principes de l''économie circulaire', 'Documentation', NULL),
('Outils de collaboration', 'Liste d''outils pour faciliter la collaboration en équipe', 'Outils', NULL),
('Formation Supabase', 'Tutoriels pour apprendre à utiliser Supabase', 'Formation', NULL);

-- Create an admin user (you'll need to replace this with actual admin user ID)
-- This is just a placeholder - you'll need to update this with a real user ID
-- INSERT INTO public.user_roles (user_id, role) VALUES ('your-admin-user-id-here', 'admin');
