-- Add user_type column to user_profiles if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_profiles' AND column_name = 'user_type') THEN
        ALTER TABLE public.user_profiles 
        ADD COLUMN user_type public.user_type DEFAULT 'consumer'::public.user_type;
    END IF;
END $$;

-- Add user_type column to business_profiles if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'business_profiles' AND column_name = 'user_type') THEN
        ALTER TABLE public.business_profiles 
        ADD COLUMN user_type public.user_type DEFAULT 'business'::public.user_type;
    END IF;
END $$;

-- Create function to prevent users from having both profiles
CREATE OR REPLACE FUNCTION public.prevent_dual_profiles()
RETURNS TRIGGER AS $$
BEGIN
  -- If inserting into user_profiles, check if user already has business profile
  IF TG_TABLE_NAME = 'user_profiles' THEN
    IF EXISTS (SELECT 1 FROM public.business_profiles WHERE user_id = NEW.user_id) THEN
      RAISE EXCEPTION 'User already has a business profile and cannot create a consumer profile';
    END IF;
  END IF;
  
  -- If inserting into business_profiles, check if user already has consumer profile
  IF TG_TABLE_NAME = 'business_profiles' THEN
    IF EXISTS (SELECT 1 FROM public.user_profiles WHERE user_id = NEW.user_id) THEN
      RAISE EXCEPTION 'User already has a consumer profile and cannot create a business profile';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS prevent_dual_profiles_user_profiles ON public.user_profiles;
DROP TRIGGER IF EXISTS prevent_dual_profiles_business_profiles ON public.business_profiles;

-- Create triggers to enforce profile separation
CREATE TRIGGER prevent_dual_profiles_user_profiles
  BEFORE INSERT ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_dual_profiles();

CREATE TRIGGER prevent_dual_profiles_business_profiles
  BEFORE INSERT ON public.business_profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_dual_profiles();

-- Update handle_new_user function to support user types
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  is_business BOOLEAN DEFAULT FALSE;
  display_name TEXT;
BEGIN
  -- Check if user signed up as business
  is_business := COALESCE((NEW.raw_user_meta_data ->> 'is_business')::BOOLEAN, FALSE);
  display_name := NEW.raw_user_meta_data ->> 'display_name';
  
  IF is_business THEN
    -- Create business profile
    INSERT INTO public.business_profiles (user_id, business_name, user_type)
    VALUES (NEW.id, display_name, 'business'::public.user_type);
  ELSE
    -- Create consumer profile and impact tracking
    INSERT INTO public.user_profiles (user_id, display_name, user_type)
    VALUES (NEW.id, display_name, 'consumer'::public.user_type);
    
    INSERT INTO public.user_impact (user_id)
    VALUES (NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get current user type
CREATE OR REPLACE FUNCTION public.get_user_type(user_uuid UUID DEFAULT auth.uid())
RETURNS public.user_type AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.business_profiles WHERE user_id = user_uuid) THEN
    RETURN 'business'::public.user_type;
  ELSIF EXISTS (SELECT 1 FROM public.user_profiles WHERE user_id = user_uuid) THEN
    RETURN 'consumer'::public.user_type;
  ELSE
    RETURN NULL;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;