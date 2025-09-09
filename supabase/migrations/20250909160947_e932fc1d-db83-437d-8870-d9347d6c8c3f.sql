-- CRITICAL SECURITY FIX: Remove public access to sensitive user data
-- Drop the overly permissive policy that exposes all user data
DROP POLICY IF EXISTS "Public can view user leaderboard data" ON public.users;

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

-- Enable RLS on the leaderboard view
ALTER VIEW public.leaderboard_stats SET (security_barrier = true);

-- Create RLS policy for the leaderboard view
CREATE POLICY "Public can view safe leaderboard data"
ON public.leaderboard_stats
FOR SELECT 
USING (true);

-- Grant public access to the safe leaderboard view only
GRANT SELECT ON public.leaderboard_stats TO anon, authenticated;

-- Ensure the users table now only allows access to own data or admin access
-- The existing policies should handle this:
-- "Users can view their own profile" - allows users to see their own data
-- No public policy exists anymore, so sensitive data is protected