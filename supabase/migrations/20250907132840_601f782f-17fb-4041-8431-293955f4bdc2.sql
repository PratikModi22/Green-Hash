-- Create user account for the admin if not exists
-- First, let's insert the user profile (the auth user should be created via signup)
INSERT INTO public.users (auth_id, name, email)
VALUES ('3859fe1e-6914-4784-9906-a2b52164659a', 'Pratik Modi', 'pratikgmodi22@gmail.com')
ON CONFLICT (auth_id) DO NOTHING;