-- Create normalized database structure following 5NF principles

-- 1. Locations table (normalize location data)
CREATE TABLE public.locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'India',
    postal_code TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(city, state, country)
);

-- 2. Categories table (normalize waste categories)
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    color_code TEXT DEFAULT '#3b82f6',
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Report statuses table (normalize status data)
CREATE TABLE public.report_statuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    color_code TEXT DEFAULT '#6b7280',
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Roles table (normalize admin roles)
CREATE TABLE public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    permissions JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Achievement types table (normalize badges/achievements)
CREATE TABLE public.achievement_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    badge_icon TEXT,
    points INTEGER DEFAULT 0,
    criteria JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. User statistics table (separate from users for better normalization)
CREATE TABLE public.user_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    total_reports INTEGER DEFAULT 0,
    weekly_reports INTEGER DEFAULT 0,
    monthly_reports INTEGER DEFAULT 0,
    yearly_reports INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    last_week_reset TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_month_reset TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_year_reset TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id)
);

-- 7. User achievements table (many-to-many relationship)
CREATE TABLE public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    achievement_type_id UUID NOT NULL,
    count INTEGER DEFAULT 1,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, achievement_type_id)
);

-- 8. Images table (normalize image storage)
CREATE TABLE public.images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID,
    url TEXT NOT NULL,
    image_type TEXT NOT NULL CHECK (image_type IN ('main', 'before', 'after')),
    file_size INTEGER,
    mime_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 9. Report activities/audit trail table
CREATE TABLE public.report_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL,
    user_id UUID,
    activity_type TEXT NOT NULL,
    description TEXT,
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default data
INSERT INTO public.categories (name, description, color_code, icon) VALUES
('Plastic Waste', 'Bottles, bags, and other plastic items', '#ef4444', '♻️'),
('Organic Waste', 'Food scraps, garden waste, biodegradable items', '#22c55e', '🍃'),
('Paper Waste', 'Newspapers, cardboard, paper products', '#f59e0b', '📄'),
('Electronic Waste', 'Old electronics, batteries, circuits', '#8b5cf6', '🔌'),
('Metal Waste', 'Cans, metal scraps, appliances', '#6b7280', '🔩'),
('Glass Waste', 'Bottles, jars, broken glass', '#06b6d4', '🍶'),
('Hazardous Waste', 'Chemicals, medical waste, toxic materials', '#dc2626', '☢️'),
('Construction Debris', 'Building materials, concrete, wood', '#a3a3a3', '🏗️'),
('Textile Waste', 'Old clothes, fabric scraps', '#ec4899', '👕'),
('Mixed Waste', 'Combination of different waste types', '#64748b', '🗑️');

INSERT INTO public.report_statuses (name, description, color_code, sort_order) VALUES
('Pending', 'Report submitted and awaiting review', '#f59e0b', 1),
('Under Review', 'Report is being investigated', '#3b82f6', 2),
('In Progress', 'Cleanup work has started', '#8b5cf6', 3),
('Resolved', 'Issue has been successfully addressed', '#22c55e', 4),
('Rejected', 'Report was invalid or duplicate', '#ef4444', 5),
('Requires More Info', 'Additional information needed', '#f97316', 6);

INSERT INTO public.roles (name, description, permissions) VALUES
('super_admin', 'Full system access', '["all"]'),
('admin', 'General administration', '["manage_users", "manage_reports", "view_analytics"]'),
('moderator', 'Content moderation', '["manage_reports", "view_reports"]'),
('viewer', 'Read-only access', '["view_reports", "view_analytics"]');

INSERT INTO public.achievement_types (name, description, badge_icon, points, criteria) VALUES
('First Report', 'Submit your first waste report', '🌟', 10, '{"reports_count": 1}'),
('Eco Warrior', '10 reports submitted', '🛡️', 50, '{"reports_count": 10}'),
('Green Champion', '50 reports submitted', '🏆', 200, '{"reports_count": 50}'),
('Environmental Hero', '100 reports submitted', '🦸', 500, '{"reports_count": 100}'),
('Citizen of the Week', 'Top reporter of the week', '👑', 100, '{"weekly_rank": 1}'),
('Citizen of the Month', 'Top reporter of the month', '💎', 300, '{"monthly_rank": 1}'),
('Citizen of the Year', 'Top reporter of the year', '🌍', 1000, '{"yearly_rank": 1}'),
('Category Expert', 'Expert in specific waste category', '🔬', 75, '{"category_reports": 25}'),
('Quick Reporter', 'Fast response time', '⚡', 25, '{"avg_response_time": 3600}'),
('Community Builder', 'Active community participant', '🤝', 150, '{"community_actions": 50}');

-- Add location data for Aurangabad
INSERT INTO public.locations (city, state, country, latitude, longitude) VALUES
('Aurangabad', 'Maharashtra', 'India', 19.8762, 75.3433),
('Mumbai', 'Maharashtra', 'India', 19.0760, 72.8777),
('Pune', 'Maharashtra', 'India', 18.5204, 73.8567),
('Nashik', 'Maharashtra', 'India', 19.9975, 73.7898),
('Nagpur', 'Maharashtra', 'India', 21.1458, 79.0882);

-- Now update existing tables to reference new normalized tables
-- Update waste_reports table
ALTER TABLE public.waste_reports 
ADD COLUMN category_id UUID REFERENCES public.categories(id),
ADD COLUMN status_id UUID REFERENCES public.report_statuses(id),
ADD COLUMN location_id UUID REFERENCES public.locations(id);

-- Update users table
ALTER TABLE public.users 
ADD COLUMN location_id UUID REFERENCES public.locations(id);

-- Update admins table
ALTER TABLE public.admins 
ADD COLUMN role_id UUID REFERENCES public.roles(id);

-- Create foreign key relationships
ALTER TABLE public.user_statistics 
ADD CONSTRAINT fk_user_statistics_user_id 
FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_achievements 
ADD CONSTRAINT fk_user_achievements_user_id 
FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
ADD CONSTRAINT fk_user_achievements_achievement_type_id 
FOREIGN KEY (achievement_type_id) REFERENCES public.achievement_types(id) ON DELETE CASCADE;

ALTER TABLE public.images 
ADD CONSTRAINT fk_images_report_id 
FOREIGN KEY (report_id) REFERENCES public.waste_reports(id) ON DELETE CASCADE;

ALTER TABLE public.report_activities 
ADD CONSTRAINT fk_report_activities_report_id 
FOREIGN KEY (report_id) REFERENCES public.waste_reports(id) ON DELETE CASCADE,
ADD CONSTRAINT fk_report_activities_user_id 
FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;

-- Enable RLS on all new tables
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievement_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access to reference tables
CREATE POLICY "Public read access to locations" ON public.locations FOR SELECT USING (true);
CREATE POLICY "Public read access to categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read access to report_statuses" ON public.report_statuses FOR SELECT USING (true);
CREATE POLICY "Public read access to achievement_types" ON public.achievement_types FOR SELECT USING (true);

-- Admin-only access to roles
CREATE POLICY "Admins can view roles" ON public.roles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.admins WHERE auth_id = auth.uid())
);

-- User statistics policies
CREATE POLICY "Users can view their own statistics" ON public.user_statistics 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE users.id = user_statistics.user_id AND users.auth_id = auth.uid())
);

CREATE POLICY "System can update user statistics" ON public.user_statistics 
FOR ALL USING (true);

-- User achievements policies
CREATE POLICY "Users can view their own achievements" ON public.user_achievements 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE users.id = user_achievements.user_id AND users.auth_id = auth.uid())
);

CREATE POLICY "Public can view all achievements for leaderboard" ON public.user_achievements 
FOR SELECT USING (true);

CREATE POLICY "System can manage achievements" ON public.user_achievements 
FOR ALL USING (true);

-- Images policies
CREATE POLICY "Public can view images" ON public.images FOR SELECT USING (true);
CREATE POLICY "Users can upload images for their reports" ON public.images 
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.waste_reports wr 
    JOIN public.users u ON wr.user_id = u.id 
    WHERE wr.id = images.report_id AND u.auth_id = auth.uid()
  )
);

-- Report activities policies
CREATE POLICY "Users can view activities for their reports" ON public.report_activities 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.waste_reports wr 
    JOIN public.users u ON wr.user_id = u.id 
    WHERE wr.id = report_activities.report_id AND u.auth_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all activities" ON public.report_activities 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.admins WHERE auth_id = auth.uid())
);

CREATE POLICY "System can create activities" ON public.report_activities 
FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_waste_reports_category_id ON public.waste_reports(category_id);
CREATE INDEX idx_waste_reports_status_id ON public.waste_reports(status_id);
CREATE INDEX idx_waste_reports_location_id ON public.waste_reports(location_id);
CREATE INDEX idx_user_statistics_user_id ON public.user_statistics(user_id);
CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_type_id ON public.user_achievements(achievement_type_id);
CREATE INDEX idx_images_report_id ON public.images(report_id);
CREATE INDEX idx_report_activities_report_id ON public.report_activities(report_id);
CREATE INDEX idx_locations_city_state ON public.locations(city, state);

-- Create updated triggers for the normalized structure
CREATE OR REPLACE FUNCTION public.handle_new_user_normalized()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    -- Insert user record
    INSERT INTO public.users (auth_id, name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        NEW.email
    );
    
    -- Initialize user statistics
    INSERT INTO public.user_statistics (user_id)
    SELECT id FROM public.users WHERE auth_id = NEW.id;
    
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_user_statistics_normalized()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Update user statistics
    INSERT INTO public.user_statistics (user_id, total_reports, weekly_reports, monthly_reports, yearly_reports, updated_at)
    VALUES (NEW.user_id, 1, 1, 1, 1, now())
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        total_reports = user_statistics.total_reports + 1,
        weekly_reports = user_statistics.weekly_reports + 1,
        monthly_reports = user_statistics.monthly_reports + 1,
        yearly_reports = user_statistics.yearly_reports + 1,
        updated_at = now();
    
    -- Log the activity
    INSERT INTO public.report_activities (report_id, user_id, activity_type, description)
    VALUES (NEW.id, NEW.user_id, 'created', 'Report submitted');
    
    -- Check for achievements
    -- First report achievement
    IF (SELECT total_reports FROM public.user_statistics WHERE user_id = NEW.user_id) = 1 THEN
        INSERT INTO public.user_achievements (user_id, achievement_type_id)
        SELECT NEW.user_id, id FROM public.achievement_types WHERE name = 'First Report'
        ON CONFLICT (user_id, achievement_type_id) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Drop old triggers and create new ones
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_user_report_counts_trigger ON public.waste_reports;

CREATE TRIGGER on_auth_user_created_normalized
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_normalized();

CREATE TRIGGER update_user_statistics_trigger
    AFTER INSERT ON public.waste_reports
    FOR EACH ROW EXECUTE FUNCTION public.update_user_statistics_normalized();