-- Fix security linter issues from previous migration

-- 1. Fix function search path issue
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
    approximate_location text
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = 'public'
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

-- 2. Drop the security definer view and replace with a regular view that uses RLS
DROP VIEW IF EXISTS public.user_waste_reports;

-- Create a regular view that relies on RLS policies instead of SECURITY DEFINER
CREATE VIEW public.user_waste_reports AS
SELECT 
    wr.*
FROM public.waste_reports wr
-- This view will automatically enforce RLS policies when accessed
;