-- Fix the handle_new_user function to provide required fields for business profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  is_business BOOLEAN DEFAULT FALSE;
  display_name TEXT;
BEGIN
  -- Check if user signed up as business
  is_business := COALESCE((NEW.raw_user_meta_data ->> 'is_business')::BOOLEAN, FALSE);
  display_name := COALESCE(NEW.raw_user_meta_data ->> 'display_name', 'Unnamed Business');
  
  IF is_business THEN
    -- Create business profile with required fields
    INSERT INTO public.business_profiles (
      user_id, 
      business_name, 
      user_type, 
      address, 
      location
    )
    VALUES (
      NEW.id, 
      display_name, 
      'business'::public.user_type,
      'Address not provided',
      'Location not provided'
    );
  ELSE
    -- Create consumer profile and impact tracking
    INSERT INTO public.user_profiles (user_id, display_name, user_type)
    VALUES (NEW.id, display_name, 'consumer'::public.user_type);
    
    INSERT INTO public.user_impact (user_id)
    VALUES (NEW.id);
  END IF;
  
  RETURN NEW;
END;
$function$;