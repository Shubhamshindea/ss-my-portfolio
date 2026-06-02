CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.portfolio_settings (
  id TEXT PRIMARY KEY DEFAULT 'main' CHECK (id = 'main'),
  portrait_path TEXT,
  portrait_object_position TEXT NOT NULL DEFAULT '50% 0%',
  portrait_zoom NUMERIC(4,2) NOT NULL DEFAULT 1,
  resume_path TEXT,
  updated_by UUID,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_settings TO authenticated;
GRANT ALL ON public.portfolio_settings TO service_role;

ALTER TABLE public.portfolio_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view portfolio settings"
ON public.portfolio_settings
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert portfolio settings"
ON public.portfolio_settings
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update portfolio settings"
ON public.portfolio_settings
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.portfolio_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL CHECK (char_length(label) BETWEEN 1 AND 80),
  category TEXT NOT NULL DEFAULT 'General' CHECK (char_length(category) BETWEEN 1 AND 80),
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  updated_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_skills TO authenticated;
GRANT ALL ON public.portfolio_skills TO service_role;

ALTER TABLE public.portfolio_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view skills"
ON public.portfolio_skills
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create skills"
ON public.portfolio_skills
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update skills"
ON public.portfolio_skills
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete skills"
ON public.portfolio_skills
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX portfolio_skills_active_order_idx ON public.portfolio_skills (active, sort_order, label);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_portfolio_settings_updated_at
BEFORE UPDATE ON public.portfolio_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_skills_updated_at
BEFORE UPDATE ON public.portfolio_skills
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.portfolio_settings (id)
VALUES ('main')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.portfolio_skills (label, category, sort_order)
VALUES
  ('Java', 'Languages & Backend', 10),
  ('Spring Boot', 'Languages & Backend', 20),
  ('REST APIs', 'Languages & Backend', 30),
  ('OOP & DSA', 'Languages & Backend', 40),
  ('HTML5', 'Frontend & Web', 50),
  ('CSS3', 'Frontend & Web', 60),
  ('JavaScript', 'Frontend & Web', 70),
  ('Responsive Design', 'Frontend & Web', 80),
  ('PostgreSQL', 'Databases', 90),
  ('MySQL', 'Databases', 100),
  ('Query Optimization', 'Databases', 110),
  ('Data Modeling', 'Databases', 120),
  ('Git & GitHub', 'Tooling & Ops', 130),
  ('Vercel', 'Tooling & Ops', 140),
  ('Cloud Concepts', 'Tooling & Ops', 150),
  ('Incident Mgmt.', 'Tooling & Ops', 160);

CREATE POLICY "Admins can read portfolio files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'portfolio-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can upload portfolio files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update portfolio files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio-assets' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'portfolio-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete portfolio files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-assets' AND public.has_role(auth.uid(), 'admin'));