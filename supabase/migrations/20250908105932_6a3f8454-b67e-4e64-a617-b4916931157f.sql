-- Add password reset functionality for pratikgmodi22@gmail.com
-- First, let's make sure the user exists and can reset password

-- Create a function to send password reset for specific admin email
CREATE OR REPLACE FUNCTION send_admin_password_reset(admin_email text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_record auth.users%ROWTYPE;
BEGIN
  -- Check if user exists in auth.users
  SELECT * INTO user_record
  FROM auth.users 
  WHERE email = admin_email;
  
  IF NOT FOUND THEN
    RETURN 'User not found';
  END IF;
  
  -- The actual password reset will be handled by the client-side code
  RETURN 'Reset available for user: ' || admin_email;
END;
$$;