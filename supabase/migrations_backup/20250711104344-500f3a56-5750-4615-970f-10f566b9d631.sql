-- Add user_type enum to distinguish between user types
CREATE TYPE public.user_type AS ENUM ('consumer', 'business');

-- Add user_type column to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN user_type public.user_type DEFAULT 'consumer' NOT NULL;

-- Add user_type column to business_profiles table  
ALTER TABLE public.business_profiles 
ADD COLUMN user_type public.user_type DEFAULT 'business' NOT NULL;

-- Create unique constraint to ensure a user can only have one profile type
ALTER TABLE public.user_profiles 
ADD CONSTRAINT unique_consumer_profile UNIQUE (user_id);

ALTER TABLE public.business_profiles 
ADD CONSTRAINT unique_business_profile UNIQUE (user_id);

-- Create a function to prevent users from having both profile types
CREATE OR REPLACE FUNCTION public.prevent_dual_profiles()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if user already has a consumer profile when creating business profile
    IF TG_TABLE_NAME = 'business_profiles' THEN
        IF EXISTS (SELECT 1 FROM public.user_profiles WHERE user_id = NEW.user_id) THEN
            RAISE EXCEPTION 'User already has a consumer profile. Cannot create business profile.';
        END IF;
    END IF;
    
    -- Check if user already has a business profile when creating consumer profile
    IF TG_TABLE_NAME = 'user_profiles' THEN
        IF EXISTS (SELECT 1 FROM public.business_profiles WHERE user_id = NEW.user_id) THEN
            RAISE EXCEPTION 'User already has a business profile. Cannot create consumer profile.';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers to enforce profile separation
CREATE TRIGGER prevent_dual_profiles_user_profiles
    BEFORE INSERT ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.prevent_dual_profiles();

CREATE TRIGGER prevent_dual_profiles_business_profiles
    BEFORE INSERT ON public.business_profiles
    FOR EACH ROW EXECUTE FUNCTION public.prevent_dual_profiles();

-- Update the handle_new_user function to support user types
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    profile_type TEXT;
BEGIN
    -- Get user type from metadata, default to 'consumer'
    profile_type := COALESCE(NEW.raw_user_meta_data ->> 'user_type', 'consumer');
    
    -- Create appropriate profile based on user type
    IF profile_type = 'business' THEN
        INSERT INTO public.business_profiles (
            user_id, 
            business_name, 
            address, 
            location,
            user_type
        ) VALUES (
            NEW.id, 
            COALESCE(NEW.raw_user_meta_data ->> 'business_name', 'New Business'),
            COALESCE(NEW.raw_user_meta_data ->> 'address', ''),
            COALESCE(NEW.raw_user_meta_data ->> 'location', ''),
            'business'::public.user_type
        );
    ELSE
        INSERT INTO public.user_profiles (
            user_id, 
            display_name,
            user_type
        ) VALUES (
            NEW.id, 
            COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email),
            'consumer'::public.user_type
        );
        
        INSERT INTO public.user_impact (user_id)
        VALUES (NEW.id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user type
CREATE OR REPLACE FUNCTION public.get_user_type(user_uuid UUID)
RETURNS public.user_type AS $$
BEGIN
    -- Check if user has business profile
    IF EXISTS (SELECT 1 FROM public.business_profiles WHERE user_id = user_uuid) THEN
        RETURN 'business'::public.user_type;
    -- Check if user has consumer profile  
    ELSIF EXISTS (SELECT 1 FROM public.user_profiles WHERE user_id = user_uuid) THEN
        RETURN 'consumer'::public.user_type;
    ELSE
        RETURN NULL;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Update RLS policies to ensure proper separation
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
CREATE POLICY "Consumers can view their own profile" ON public.user_profiles
FOR SELECT USING (
    auth.uid() = user_id AND 
    user_type = 'consumer'::public.user_type
);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
CREATE POLICY "Consumers can update their own profile" ON public.user_profiles
FOR UPDATE USING (
    auth.uid() = user_id AND 
    user_type = 'consumer'::public.user_type
);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
CREATE POLICY "Consumers can insert their own profile" ON public.user_profiles
FOR INSERT WITH CHECK (
    auth.uid() = user_id AND 
    user_type = 'consumer'::public.user_type
);

-- Update business profile policies
DROP POLICY IF EXISTS "Users can update their own business profile" ON public.business_profiles;
CREATE POLICY "Business users can update their own profile" ON public.business_profiles
FOR UPDATE USING (
    auth.uid() = user_id AND 
    user_type = 'business'::public.user_type
);

DROP POLICY IF EXISTS "Users can create their own business profile" ON public.business_profiles;
CREATE POLICY "Business users can create their own profile" ON public.business_profiles
FOR INSERT WITH CHECK (
    auth.uid() = user_id AND 
    user_type = 'business'::public.user_type
);

-- Create view for getting current user type
CREATE OR REPLACE VIEW public.current_user_type AS
SELECT 
    CASE 
        WHEN bp.user_id IS NOT NULL THEN 'business'::public.user_type
        WHEN up.user_id IS NOT NULL THEN 'consumer'::public.user_type
        ELSE NULL
    END as user_type,
    COALESCE(bp.user_id, up.user_id) as user_id
FROM auth.users u
LEFT JOIN public.business_profiles bp ON u.id = bp.user_id
LEFT JOIN public.user_profiles up ON u.id = up.user_id
WHERE u.id = auth.uid();