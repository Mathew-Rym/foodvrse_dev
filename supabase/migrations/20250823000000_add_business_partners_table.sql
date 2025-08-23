-- Create business_partners table for tracking approved business partner emails
CREATE TABLE IF NOT EXISTS public.business_partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  business_name TEXT NOT NULL,
  domain TEXT GENERATED ALWAYS AS (split_part(email, '@', 2)) STORED,
  is_approved BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_business_partners_email ON public.business_partners(email);
CREATE INDEX IF NOT EXISTS idx_business_partners_domain ON public.business_partners(domain);
CREATE INDEX IF NOT EXISTS idx_business_partners_approved ON public.business_partners(is_approved);

-- Add RLS policies
ALTER TABLE public.business_partners ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read approved business partners
CREATE POLICY "Users can read approved business partners" ON public.business_partners
  FOR SELECT USING (is_approved = true);

-- Policy: Only authenticated users can check business partner status  
CREATE POLICY "Authenticated users can check partner status" ON public.business_partners
  FOR SELECT TO authenticated USING (true);

-- Insert some initial approved business partners
INSERT INTO public.business_partners (email, business_name, is_approved, approved_at) VALUES
  ('admin@javahousekenya.com', 'Java House Kenya', true, now()),
  ('manager@artcaffegroup.com', 'Artcaffe Group', true, now()),
  ('operations@galitoskenya.com', 'Galito''s Kenya', true, now()),
  ('partnerships@naivaskenya.com', 'Naivas Kenya', true, now()),
  ('contact@pizzainnkenya.com', 'Pizza Inn Kenya', true, now())
ON CONFLICT (email) DO NOTHING;

-- Function to check if email is approved business partner
CREATE OR REPLACE FUNCTION public.is_business_partner_email(email_to_check TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if email exists in approved business partners
  RETURN EXISTS (
    SELECT 1 FROM public.business_partners 
    WHERE email = lower(email_to_check) 
    AND is_approved = true
  );
END;
$$;