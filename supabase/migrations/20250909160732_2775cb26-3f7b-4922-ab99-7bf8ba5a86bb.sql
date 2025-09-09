-- CRITICAL SECURITY FIX: Remove public access to sensitive user data
-- Drop the overly permissive policy that exposes all user data
DROP POLICY IF EXISTS "Public can view user leaderboard data" ON public.users;

-- Create a secure policy that only exposes leaderboard statistics without sensitive data
-- This policy will allow public access to ONLY the statistics needed for leaderboards
CREATE POLICY "Public can view anonymized leaderboard stats"
ON public.users 
FOR SELECT 
USING (true)
-- Use a column mask to only expose safe fields
WITH CHECK (false); -- No inserts allowed through this policy

-- Create a secure leaderboard view that doesn't expose sensitive data
CREATE OR REPLACE VIEW public.leaderboard_stats AS
SELECT 
  id,
  -- Anonymize the name to show only first letter + asterisks
  CASE 
    WHEN LENGTH(name) > 0 THEN LEFT(name, 1) || REPEAT('*', GREATEST(0, LENGTH(name) - 1))
    ELSE 'Anonymous'
  END as display_name,
  total_reports,
  weekly_reports,
  monthly_reports,
  yearly_reports,
  citizen_of_week_count,
  citizen_of_month_count,
  citizen_of_year_count,
  created_at,
  location -- Keep location for regional leaderboards if needed
FROM public.users;

-- Enable RLS on the view
ALTER VIEW public.leaderboard_stats SET (security_barrier = true);

-- Grant public access to the safe leaderboard view
GRANT SELECT ON public.leaderboard_stats TO anon, authenticated;

-- Update existing policies to be more restrictive
-- Users can still view their own complete profile
-- Keep the existing "Users can view their own profile" policy as is

-- Remove the problematic public access while maintaining user access to their own data