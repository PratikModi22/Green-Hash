-- Fix Security Definer function issue
-- Drop the SECURITY DEFINER function and replace with proper RLS approach

-- Remove the security definer function
DROP FUNCTION IF EXISTS public.get_public_waste_reports();

-- The waste_reports table already has proper RLS policies:
-- "Public can view reports for map display" with USING (true)
-- This allows public read access while maintaining other security controls

-- Add comment to document the security approach
COMMENT ON TABLE public.waste_reports IS 
'Public read access is allowed for map display. Frontend should filter sensitive data like exact coordinates for privacy.';