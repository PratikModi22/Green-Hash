-- Fix function search path security issues
CREATE OR REPLACE FUNCTION public.update_user_report_counts()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
    -- Update total reports count
    UPDATE public.users 
    SET 
        total_reports = total_reports + 1,
        weekly_reports = weekly_reports + 1,
        monthly_reports = monthly_reports + 1,
        yearly_reports = yearly_reports + 1,
        updated_at = now()
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.reset_weekly_counts()
RETURNS void 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
    top_user_id UUID;
BEGIN
    -- Get the top user of the week
    SELECT id INTO top_user_id
    FROM public.users
    WHERE weekly_reports > 0
    ORDER BY weekly_reports DESC, created_at ASC
    LIMIT 1;
    
    -- Award citizen of the week badge
    IF top_user_id IS NOT NULL THEN
        UPDATE public.users
        SET citizen_of_week_count = citizen_of_week_count + 1
        WHERE id = top_user_id;
    END IF;
    
    -- Reset weekly counts for all users
    UPDATE public.users 
    SET 
        weekly_reports = 0,
        last_week_reset = now();
END;
$$;

CREATE OR REPLACE FUNCTION public.reset_monthly_counts()
RETURNS void 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
    top_user_id UUID;
BEGIN
    -- Get the top user of the month
    SELECT id INTO top_user_id
    FROM public.users
    WHERE monthly_reports > 0
    ORDER BY monthly_reports DESC, created_at ASC
    LIMIT 1;
    
    -- Award citizen of the month badge
    IF top_user_id IS NOT NULL THEN
        UPDATE public.users
        SET citizen_of_month_count = citizen_of_month_count + 1
        WHERE id = top_user_id;
    END IF;
    
    -- Reset monthly counts for all users
    UPDATE public.users 
    SET 
        monthly_reports = 0,
        last_month_reset = now();
END;
$$;

CREATE OR REPLACE FUNCTION public.reset_yearly_counts()
RETURNS void 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
    top_user_id UUID;
BEGIN
    -- Get the top user of the year
    SELECT id INTO top_user_id
    FROM public.users
    WHERE yearly_reports > 0
    ORDER BY yearly_reports DESC, created_at ASC
    LIMIT 1;
    
    -- Award citizen of the year badge
    IF top_user_id IS NOT NULL THEN
        UPDATE public.users
        SET citizen_of_year_count = citizen_of_year_count + 1
        WHERE id = top_user_id;
    END IF;
    
    -- Reset yearly counts for all users
    UPDATE public.users 
    SET 
        yearly_reports = 0,
        last_year_reset = now();
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER 
SET search_path = public, auth
LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO public.users (auth_id, name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        NEW.email
    );
    RETURN NEW;
END;
$$;