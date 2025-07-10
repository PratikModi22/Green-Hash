
-- Create waste_reports table
CREATE TABLE public.waste_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('dirty', 'cleaning', 'cleaned', 'in-progress', 'completed')),
  category TEXT NOT NULL,
  remarks TEXT,
  before_image_url TEXT,
  after_image_url TEXT,
  authority_comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (making it public for now since no auth is implemented)
ALTER TABLE public.waste_reports ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public access (since no authentication is implemented yet)
CREATE POLICY "Allow public access to waste reports" ON public.waste_reports
  FOR ALL USING (true);

-- Create storage bucket for waste report images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('waste-images', 'waste-images', true);

-- Create policy for public access to waste images
CREATE POLICY "Allow public access to waste images" ON storage.objects
  FOR ALL USING (bucket_id = 'waste-images');
