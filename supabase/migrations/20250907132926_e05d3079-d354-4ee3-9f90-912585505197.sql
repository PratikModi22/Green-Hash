-- Create user account for the admin
-- Check if user already exists first
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE auth_id = '3859fe1e-6914-4784-9906-a2b52164659a') THEN
        INSERT INTO public.users (auth_id, name, email)
        VALUES ('3859fe1e-6914-4784-9906-a2b52164659a', 'Pratik Modi', 'pratikgmodi22@gmail.com');
    END IF;
END
$$;