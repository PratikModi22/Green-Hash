-- Fix infinite recursion in admins RLS policies
DROP POLICY IF EXISTS "Admins can view admin profiles" ON public.admins;
DROP POLICY IF EXISTS "Admins can insert admin profiles" ON public.admins;
DROP POLICY IF EXISTS "Admins can update admin profiles" ON public.admins;

-- Create non-recursive policies for admins table
CREATE POLICY "Users can view their own admin profile" 
ON public.admins 
FOR SELECT 
USING (auth.uid() = auth_id);

CREATE POLICY "Users can insert their own admin profile" 
ON public.admins 
FOR INSERT 
WITH CHECK (auth.uid() = auth_id);

CREATE POLICY "Users can update their own admin profile" 
ON public.admins 
FOR UPDATE 
USING (auth.uid() = auth_id);

-- Create a simple function to check if current user is admin (non-recursive)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admins 
    WHERE auth_id = auth.uid()
  );
$$;

-- Allow admins to view all admin profiles using the function
CREATE POLICY "Admins can view all profiles" 
ON public.admins 
FOR SELECT 
USING (public.is_admin());

-- Insert admin record for lordmodizz@gmail.com (already signed up)
INSERT INTO public.admins (auth_id, name, email, role) 
SELECT '58e6e881-e4c3-4fb7-9704-7bd564cc4b8f', 'Lord', 'lordmodizz@gmail.com', 'admin'
WHERE NOT EXISTS (
  SELECT 1 FROM public.admins WHERE auth_id = '58e6e881-e4c3-4fb7-9704-7bd564cc4b8f'
);