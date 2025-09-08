-- Remove the problematic function that might be causing database errors
DROP FUNCTION IF EXISTS public.send_admin_password_reset(text);

-- Fix the user creation trigger to be more robust
CREATE OR REPLACE FUNCTION public.handle_new_user_safe()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Insert user record safely
    INSERT INTO public.users (auth_id, name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        NEW.email
    )
    ON CONFLICT (auth_id) DO NOTHING;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't block user creation
        RAISE LOG 'Error in handle_new_user_safe: %', SQLERRM;
        RETURN NEW;
END;
$$;