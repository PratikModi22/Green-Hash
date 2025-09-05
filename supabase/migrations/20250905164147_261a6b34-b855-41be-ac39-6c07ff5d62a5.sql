-- Update database policies to prevent users from deleting their own reports
-- This makes reports permanent once created

-- Drop the existing delete policy for users
DROP POLICY IF EXISTS "Users can delete their own reports" ON public.waste_reports;

-- Keep only admin delete access (they can still delete if needed)
CREATE POLICY "Only admins can delete reports" 
ON public.waste_reports 
FOR DELETE 
USING (EXISTS (
    SELECT 1 FROM public.admins 
    WHERE admins.auth_id = auth.uid()
));

-- Add a policy to require after_image_url when status is updated to 'completed' or 'cleaned'
-- This will be enforced at the application level, but we'll add a comment for documentation
COMMENT ON COLUMN public.waste_reports.after_image_url IS 
'Required when status is completed or cleaned. Must be enforced by admin interface.';