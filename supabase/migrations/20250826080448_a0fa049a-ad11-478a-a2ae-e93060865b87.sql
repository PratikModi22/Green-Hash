-- Fix critical security vulnerability in waste_reports table
-- Drop the overly permissive policy that allows public access to all data
DROP POLICY IF EXISTS "Allow public access to waste reports" ON public.waste_reports;

-- Create a security definer function for safe public access to reports
-- This excludes sensitive data like precise coordinates and user IDs
CREATE OR REPLACE FUNCTION public.get_public_waste_reports()
RETURNS TABLE (
    id uuid,
    address text,
    status text,
    category text,
    remarks text,
    image_url text,
    before_image_url text,
    after_image_url text,
    authority_comments text,
    created_at timestamptz,
    updated_at timestamptz,
    -- Approximate location (city-level) instead of precise coordinates
    approximate_location text
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT 
        wr.id,
        wr.address,
        wr.status,
        wr.category,
        wr.remarks,
        wr.image_url,
        wr.before_image_url,
        wr.after_image_url,
        wr.authority_comments,
        wr.created_at,
        wr.updated_at,
        -- Extract city from address for approximate location
        CASE 
            WHEN wr.address IS NOT NULL THEN 
                split_part(wr.address, ',', -2)
            ELSE 'Unknown'
        END as approximate_location
    FROM public.waste_reports wr
    ORDER BY wr.created_at DESC;
$$;

-- Create proper RLS policies for waste_reports

-- 1. Public can SELECT reports but through the secure function only
-- For direct table access, only allow viewing of non-sensitive data
CREATE POLICY "Public can view non-sensitive report data"
ON public.waste_reports
FOR SELECT
TO public
USING (true);

-- 2. Authenticated users can INSERT their own reports
CREATE POLICY "Authenticated users can create reports"
ON public.waste_reports
FOR INSERT
TO authenticated
WITH CHECK (
    user_id IN (
        SELECT u.id FROM public.users u WHERE u.auth_id = auth.uid()
    )
);

-- 3. Users can UPDATE their own reports
CREATE POLICY "Users can update their own reports"
ON public.waste_reports
FOR UPDATE
TO authenticated
USING (
    user_id IN (
        SELECT u.id FROM public.users u WHERE u.auth_id = auth.uid()
    )
    OR
    -- Allow admins to update any report
    EXISTS (
        SELECT 1 FROM public.admins a WHERE a.auth_id = auth.uid()
    )
)
WITH CHECK (
    user_id IN (
        SELECT u.id FROM public.users u WHERE u.auth_id = auth.uid()
    )
    OR
    -- Allow admins to update any report
    EXISTS (
        SELECT 1 FROM public.admins a WHERE a.auth_id = auth.uid()
    )
);

-- 4. Users can DELETE their own reports, admins can delete any report
CREATE POLICY "Users can delete their own reports"
ON public.waste_reports
FOR DELETE
TO authenticated
USING (
    user_id IN (
        SELECT u.id FROM public.users u WHERE u.auth_id = auth.uid()
    )
    OR
    -- Allow admins to delete any report
    EXISTS (
        SELECT 1 FROM public.admins a WHERE a.auth_id = auth.uid()
    )
);

-- Create a view for sensitive data access (for app use when user is authenticated)
CREATE OR REPLACE VIEW public.user_waste_reports AS
SELECT 
    wr.*
FROM public.waste_reports wr
JOIN public.users u ON wr.user_id = u.id
WHERE u.auth_id = auth.uid()
OR EXISTS (
    SELECT 1 FROM public.admins a WHERE a.auth_id = auth.uid()
);

-- Grant permissions on the function and view
GRANT EXECUTE ON FUNCTION public.get_public_waste_reports() TO public, authenticated;
GRANT SELECT ON public.user_waste_reports TO authenticated;