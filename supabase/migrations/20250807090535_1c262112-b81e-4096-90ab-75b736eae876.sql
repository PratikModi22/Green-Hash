-- Create users table for general user signup/login
CREATE TABLE public.users (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    location TEXT,
    total_reports INTEGER DEFAULT 0,
    weekly_reports INTEGER DEFAULT 0,
    monthly_reports INTEGER DEFAULT 0,
    yearly_reports INTEGER DEFAULT 0,
    citizen_of_week_count INTEGER DEFAULT 0,
    citizen_of_month_count INTEGER DEFAULT 0,
    citizen_of_year_count INTEGER DEFAULT 0,
    last_week_reset TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_month_reset TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_year_reset TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admins table for admin login only
CREATE TABLE public.admins (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- RLS policies for users
CREATE POLICY "Users can view their own profile" 
ON public.users 
FOR SELECT 
USING (auth.uid() = auth_id);

CREATE POLICY "Users can update their own profile" 
ON public.users 
FOR UPDATE 
USING (auth.uid() = auth_id);

CREATE POLICY "Users can insert their own profile" 
ON public.users 
FOR INSERT 
WITH CHECK (auth.uid() = auth_id);

CREATE POLICY "Public can view user leaderboard data" 
ON public.users 
FOR SELECT 
USING (true);

-- RLS policies for admins
CREATE POLICY "Admins can view admin profiles" 
ON public.admins 
FOR SELECT 
USING (auth.uid() = auth_id OR EXISTS (
    SELECT 1 FROM public.admins WHERE auth_id = auth.uid()
));

CREATE POLICY "Admins can update admin profiles" 
ON public.admins 
FOR UPDATE 
USING (auth.uid() = auth_id);

CREATE POLICY "Admins can insert admin profiles" 
ON public.admins 
FOR INSERT 
WITH CHECK (auth.uid() = auth_id);

-- Add user_id reference to waste_reports table
ALTER TABLE public.waste_reports ADD COLUMN user_id UUID REFERENCES public.users(id);

-- Create function to update user report counts
CREATE OR REPLACE FUNCTION public.update_user_report_counts()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger for report count updates
CREATE TRIGGER update_user_counts_on_report
    AFTER INSERT ON public.waste_reports
    FOR EACH ROW
    EXECUTE FUNCTION public.update_user_report_counts();

-- Create function to reset weekly counts (runs every Sunday 11:59 PM)
CREATE OR REPLACE FUNCTION public.reset_weekly_counts()
RETURNS void AS $$
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
$$ LANGUAGE plpgsql;

-- Create function to reset monthly counts (runs on 1st of every month)
CREATE OR REPLACE FUNCTION public.reset_monthly_counts()
RETURNS void AS $$
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
$$ LANGUAGE plpgsql;

-- Create function to reset yearly counts (runs on 1st January)
CREATE OR REPLACE FUNCTION public.reset_yearly_counts()
RETURNS void AS $$
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
$$ LANGUAGE plpgsql;

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (auth_id, name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Insert the specific admin user
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change_token_current
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'pratikgmodi22@gmail.com',
    crypt('Pgmodi22', gen_salt('bf')),
    now(),
    now(),
    now(),
    '',
    '',
    '',
    ''
);

-- Insert into admins table
INSERT INTO public.admins (auth_id, name, email, role)
SELECT 
    id,
    'Pratik Modi',
    'pratikgmodi22@gmail.com',
    'admin'
FROM auth.users 
WHERE email = 'pratikgmodi22@gmail.com';