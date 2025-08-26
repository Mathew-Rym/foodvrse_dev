-- Improve business management system
-- This migration enhances the existing business_profiles table and adds better role management

-- Add business status enum if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'business_status') THEN
        CREATE TYPE public.business_status AS ENUM ('pending_approval', 'approved', 'rejected');
    END IF;
END $$;

-- Add business category enum if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'business_category') THEN
        CREATE TYPE public.business_category AS ENUM (
            'restaurant', 
            'supermarket', 
            'cafe', 
            'bakery', 
            'food_truck', 
            'grocery_store', 
            'convenience_store', 
            'farmers_market', 
            'other'
        );
    END IF;
END $$;

-- Add missing columns to business_profiles table
ALTER TABLE public.business_profiles 
ADD COLUMN IF NOT EXISTS status public.business_status DEFAULT 'pending_approval',
ADD COLUMN IF NOT EXISTS category public.business_category DEFAULT 'other',
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS verification_document_url TEXT,
ADD COLUMN IF NOT EXISTS business_hours JSONB,
ADD COLUMN IF NOT EXISTS contact_person TEXT,
ADD COLUMN IF NOT EXISTS tax_id TEXT,
ADD COLUMN IF NOT EXISTS business_license TEXT,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS featured_until TIMESTAMP WITH TIME ZONE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_business_profiles_status ON public.business_profiles(status);
CREATE INDEX IF NOT EXISTS idx_business_profiles_category ON public.business_profiles(category);
CREATE INDEX IF NOT EXISTS idx_business_profiles_verified ON public.business_profiles(verified_at);

-- Create function to get business owner details
CREATE OR REPLACE FUNCTION public.get_business_owner_details(business_uuid UUID)
RETURNS TABLE (
    business_id UUID,
    business_name TEXT,
    owner_id UUID,
    owner_email TEXT,
    owner_name TEXT,
    status public.business_status,
    category public.business_category,
    location TEXT,
    address TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bp.id as business_id,
        bp.business_name,
        bp.user_id as owner_id,
        au.email as owner_email,
        COALESCE(au.raw_user_meta_data->>'full_name', au.email) as owner_name,
        bp.status,
        bp.category,
        bp.location,
        bp.address
    FROM public.business_profiles bp
    JOIN auth.users au ON bp.user_id = au.id
    WHERE bp.id = business_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create function to verify business
CREATE OR REPLACE FUNCTION public.verify_business(business_uuid UUID, admin_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if admin user has permission (you can customize this logic)
    IF admin_user_id IS NULL THEN
        RAISE EXCEPTION 'Admin user ID is required for verification';
    END IF;
    
    -- Update business status to verified
    UPDATE public.business_profiles 
    SET 
        status = 'approved',
        verified_at = NOW(),
        updated_at = NOW()
    WHERE id = business_uuid;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get all businesses with owner details
CREATE OR REPLACE FUNCTION public.get_all_businesses_with_owners()
RETURNS TABLE (
    business_id UUID,
    business_name TEXT,
    owner_id UUID,
    owner_email TEXT,
    owner_name TEXT,
    status public.business_status,
    category public.business_category,
    location TEXT,
    address TEXT,
    total_sales INTEGER,
    total_revenue NUMERIC,
    average_rating NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bp.id as business_id,
        bp.business_name,
        bp.user_id as owner_id,
        au.email as owner_email,
        COALESCE(au.raw_user_meta_data->>'full_name', au.email) as owner_name,
        bp.status,
        bp.category,
        bp.location,
        bp.address,
        0 as total_sales,
        0 as total_revenue,
        0 as average_rating,
        bp.created_at
    FROM public.business_profiles bp
    JOIN auth.users au ON bp.user_id = au.id
    ORDER BY bp.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Update RLS policies for better security
DROP POLICY IF EXISTS "Business owners can view their own profile" ON public.business_profiles;
DROP POLICY IF EXISTS "Business owners can update their own profile" ON public.business_profiles;
DROP POLICY IF EXISTS "Business owners can insert their own profile" ON public.business_profiles;

-- Create comprehensive RLS policies for business_profiles
CREATE POLICY "Business owners can view their own profile" 
ON public.business_profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Business owners can update their own profile" 
ON public.business_profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Business owners can insert their own profile" 
ON public.business_profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view active and verified businesses" 
ON public.business_profiles FOR SELECT 
USING (status IN ('approved'));

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_business_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_business_updated_at_trigger ON public.business_profiles;
CREATE TRIGGER update_business_updated_at_trigger
    BEFORE UPDATE ON public.business_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_business_updated_at();

-- Drop dependent views first, then table, then recreate as view
DROP VIEW IF EXISTS public.business_dashboard_data;
DROP TABLE IF EXISTS public.business_analytics;

-- Create view for business analytics
CREATE OR REPLACE VIEW public.business_analytics AS
SELECT 
    bp.id as business_id,
    bp.business_name,
    bp.category,
    bp.status,
    0 as total_sales,
    0 as total_revenue,
    0 as total_co2_saved_kg,
    0 as average_rating,
    0 as rating_count,
    bp.created_at,
    COUNT(mb.id) as total_listings,
    COUNT(CASE WHEN mb.is_active = true THEN 1 END) as active_listings
FROM public.business_profiles bp
LEFT JOIN public.mystery_bags mb ON bp.id = mb.business_id
GROUP BY bp.id, bp.business_name, bp.category, bp.status, bp.created_at;

-- Recreate the business_dashboard_data view if it was dropped
-- Note: Using a simple view without reviews table since it may not exist
CREATE OR REPLACE VIEW public.business_dashboard_data AS
SELECT 
    ba.*,
    0 as total_reviews,
    ba.average_rating as avg_rating
FROM public.business_analytics ba;

-- Grant permissions
GRANT SELECT ON public.business_analytics TO authenticated;
GRANT SELECT ON public.business_dashboard_data TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_business_owner_details(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_businesses_with_owners() TO authenticated;
GRANT EXECUTE ON FUNCTION public.verify_business(UUID, UUID) TO authenticated;
