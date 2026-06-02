CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.has_role(_user_id UUID, _role public.app_role)
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

GRANT USAGE ON SCHEMA private TO authenticated;
GRANT EXECUTE ON FUNCTION private.has_role(UUID, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION private.has_role(UUID, public.app_role) TO service_role;

DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view portfolio settings" ON public.portfolio_settings;
DROP POLICY IF EXISTS "Admins can insert portfolio settings" ON public.portfolio_settings;
DROP POLICY IF EXISTS "Admins can update portfolio settings" ON public.portfolio_settings;
DROP POLICY IF EXISTS "Admins can view skills" ON public.portfolio_skills;
DROP POLICY IF EXISTS "Admins can create skills" ON public.portfolio_skills;
DROP POLICY IF EXISTS "Admins can update skills" ON public.portfolio_skills;
DROP POLICY IF EXISTS "Admins can delete skills" ON public.portfolio_skills;
DROP POLICY IF EXISTS "Admins can read portfolio files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload portfolio files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update portfolio files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete portfolio files" ON storage.objects;

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (private.has_role(auth.uid(), 'admin'))
WITH CHECK (private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view portfolio settings"
ON public.portfolio_settings
FOR SELECT
TO authenticated
USING (private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert portfolio settings"
ON public.portfolio_settings
FOR INSERT
TO authenticated
WITH CHECK (private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update portfolio settings"
ON public.portfolio_settings
FOR UPDATE
TO authenticated
USING (private.has_role(auth.uid(), 'admin'))
WITH CHECK (private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view skills"
ON public.portfolio_skills
FOR SELECT
TO authenticated
USING (private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create skills"
ON public.portfolio_skills
FOR INSERT
TO authenticated
WITH CHECK (private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update skills"
ON public.portfolio_skills
FOR UPDATE
TO authenticated
USING (private.has_role(auth.uid(), 'admin'))
WITH CHECK (private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete skills"
ON public.portfolio_skills
FOR DELETE
TO authenticated
USING (private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read portfolio files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'portfolio-assets' AND private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can upload portfolio files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-assets' AND private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update portfolio files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio-assets' AND private.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'portfolio-assets' AND private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete portfolio files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-assets' AND private.has_role(auth.uid(), 'admin'));

DROP FUNCTION public.has_role(UUID, public.app_role);