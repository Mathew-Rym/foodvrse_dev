-- CRITICAL SECURITY FIXES

-- 1. DROP the security definer view that exposes auth.users
DROP VIEW IF EXISTS public.current_user_type;

-- 2. Create a secure function to get user type instead
CREATE OR REPLACE FUNCTION public.get_current_user_type()
RETURNS user_type
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check business profiles first
  IF EXISTS (SELECT 1 FROM public.business_profiles WHERE user_id = auth.uid()) THEN
    RETURN 'business'::public.user_type;
  END IF;
  
  -- Check user profiles
  IF EXISTS (SELECT 1 FROM public.user_profiles WHERE user_id = auth.uid()) THEN
    RETURN 'consumer'::public.user_type;
  END IF;
  
  -- Return null if no profile found
  RETURN NULL;
END;
$$;

-- 3. Fix all security definer functions to have proper search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_mystery_bags_by_pickup_time()
RETURNS TABLE(bag_id uuid, pickup_category text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mb.id as bag_id,
    CASE 
      WHEN mb.pickup_date = CURRENT_DATE AND 
           mb.pickup_start_time <= (CURRENT_TIME + INTERVAL '3 hours') AND
           mb.pickup_end_time >= CURRENT_TIME
      THEN 'Pick Up Now'
      WHEN mb.pickup_date = (CURRENT_DATE + INTERVAL '1 day')
      THEN 'Pick Up Tomorrow'
      ELSE NULL
    END as pickup_category
  FROM public.mystery_bags mb
  WHERE mb.is_active = true;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_impact_metrics_on_order_completion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  mystery_bag_record RECORD;
  meals_count INTEGER;
  money_saved DECIMAL(10, 2);
  co2_saved DECIMAL(10, 6);
  water_saved BIGINT;
  energy_saved DECIMAL(10, 2);
BEGIN
  -- Only process when status changes to 'collected'
  IF NEW.status = 'collected' AND (OLD.status IS NULL OR OLD.status != 'collected') THEN
    -- Get mystery bag details
    SELECT * INTO mystery_bag_record 
    FROM public.mystery_bags 
    WHERE id = NEW.mystery_bag_id;
    
    -- Calculate metrics
    meals_count := NEW.quantity;
    money_saved := NEW.original_total - NEW.total_amount;
    co2_saved := meals_count * 0.0008; -- 0.8 kg per meal = 0.0008 tonnes
    water_saved := meals_count * 200; -- 200 liters per meal
    energy_saved := meals_count * 2.5; -- 2.5 kWh per meal
    
    -- Update platform metrics
    UPDATE public.platform_impact_metrics 
    SET 
      total_meals_rescued = total_meals_rescued + meals_count,
      total_money_saved_ksh = total_money_saved_ksh + money_saved,
      total_co2_saved_tonnes = total_co2_saved_tonnes + co2_saved,
      total_water_conserved_liters = total_water_conserved_liters + water_saved,
      total_energy_saved_kwh = total_energy_saved_kwh + energy_saved,
      updated_at = now()
    WHERE id = (SELECT id FROM public.platform_impact_metrics LIMIT 1);
    
    -- Update user's weekly challenge count
    INSERT INTO public.user_challenges (
      user_id, 
      challenge_type, 
      current_count, 
      week_start_date, 
      week_end_date
    )
    VALUES (
      NEW.user_id,
      'weekly_rescue',
      meals_count,
      date_trunc('week', CURRENT_DATE),
      date_trunc('week', CURRENT_DATE) + interval '6 days'
    )
    ON CONFLICT (user_id, challenge_type, week_start_date) 
    DO UPDATE SET 
      current_count = user_challenges.current_count + meals_count,
      updated_at = now();
    
    -- Check if challenge is completed and award badge
    PERFORM public.check_and_award_weekly_badge(NEW.user_id);
    
    -- Set collected_at timestamp
    NEW.collected_at = now();
  
  -- Handle refunds - decrement metrics
  ELSIF NEW.status = 'refunded' AND OLD.status = 'collected' THEN
    -- Get mystery bag details
    SELECT * INTO mystery_bag_record 
    FROM public.mystery_bags 
    WHERE id = NEW.mystery_bag_id;
    
    -- Calculate metrics to subtract
    meals_count := NEW.quantity;
    money_saved := NEW.original_total - NEW.total_amount;
    co2_saved := meals_count * 0.0008;
    water_saved := meals_count * 200;
    energy_saved := meals_count * 2.5;
    
    -- Decrement platform metrics
    UPDATE public.platform_impact_metrics 
    SET 
      total_meals_rescued = total_meals_rescued - meals_count,
      total_money_saved_ksh = total_money_saved_ksh - money_saved,
      total_co2_saved_tonnes = total_co2_saved_tonnes - co2_saved,
      total_water_conserved_liters = total_water_conserved_liters - water_saved,
      total_energy_saved_kwh = total_energy_saved_kwh - energy_saved,
      updated_at = now()
    WHERE id = (SELECT id FROM public.platform_impact_metrics LIMIT 1);
    
    -- Decrement user's weekly challenge count
    UPDATE public.user_challenges 
    SET 
      current_count = GREATEST(0, current_count - meals_count),
      updated_at = now()
    WHERE 
      user_id = NEW.user_id 
      AND challenge_type = 'weekly_rescue' 
      AND week_start_date = date_trunc('week', CURRENT_DATE);
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.check_and_award_weekly_badge(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  challenge_record RECORD;
  settings_record RECORD;
  badge_record RECORD;
  current_week_start DATE;
BEGIN
  current_week_start := date_trunc('week', CURRENT_DATE);
  
  -- Get challenge settings
  SELECT * INTO settings_record 
  FROM public.challenge_settings 
  WHERE challenge_type = 'weekly_rescue';
  
  -- Get user's current week challenge
  SELECT * INTO challenge_record 
  FROM public.user_challenges 
  WHERE 
    user_id = p_user_id 
    AND challenge_type = 'weekly_rescue' 
    AND week_start_date = current_week_start;
  
  -- Check if challenge is completed and badge not yet awarded
  IF challenge_record.current_count >= settings_record.goal_value 
     AND NOT challenge_record.badge_awarded THEN
    
    -- Get badge
    SELECT * INTO badge_record 
    FROM public.badges 
    WHERE name = settings_record.badge_name;
    
    -- Award badge
    INSERT INTO public.user_badges (user_id, badge_id, week_earned)
    VALUES (p_user_id, badge_record.id, current_week_start)
    ON CONFLICT (user_id, badge_id, week_earned) DO NOTHING;
    
    -- Mark challenge as completed and badge awarded
    UPDATE public.user_challenges 
    SET 
      completed = true,
      badge_awarded = true,
      completed_at = now(),
      updated_at = now()
    WHERE 
      user_id = p_user_id 
      AND challenge_type = 'weekly_rescue' 
      AND week_start_date = current_week_start;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_business_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  avg_rating NUMERIC(3,2);
  rating_count INTEGER;
BEGIN
  -- Calculate new average rating and count
  SELECT AVG(rating)::NUMERIC(3,2), COUNT(*)
  INTO avg_rating, rating_count
  FROM ratings 
  WHERE business_id = COALESCE(NEW.business_id, OLD.business_id);
  
  -- Update business profile
  UPDATE business_profiles 
  SET 
    average_rating = COALESCE(avg_rating, 0),
    rating_count = rating_count,
    updated_at = NOW()
  WHERE id = COALESCE(NEW.business_id, OLD.business_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE OR REPLACE FUNCTION public.process_purchase(p_listing_id uuid, p_user_id text, p_quantity integer DEFAULT 1)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  listing_record RECORD;
  business_record RECORD;
  total_cost NUMERIC(10,2);
  co2_impact NUMERIC(10,3);
  result JSON;
BEGIN
  -- Get listing details
  SELECT * INTO listing_record 
  FROM listings 
  WHERE id = p_listing_id AND quantity >= p_quantity;
  
  IF NOT FOUND THEN
    RETURN '{"success": false, "error": "Insufficient quantity or listing not found"}'::JSON;
  END IF;
  
  -- Calculate totals
  total_cost := listing_record.price * p_quantity;
  co2_impact := listing_record.co2_saved_per_item_kg * p_quantity;
  
  -- Update listing quantity
  UPDATE listings 
  SET quantity = quantity - p_quantity
  WHERE id = p_listing_id;
  
  -- Update business metrics
  UPDATE business_profiles 
  SET 
    total_sales = total_sales + p_quantity,
    total_revenue = total_revenue + total_cost,
    total_co2_saved_kg = total_co2_saved_kg + co2_impact,
    updated_at = NOW()
  WHERE id = listing_record.business_id;
  
  -- Create order record
  INSERT INTO orders (
    user_id, 
    mystery_bag_id, 
    business_id, 
    quantity, 
    total_amount, 
    original_total, 
    status
  ) VALUES (
    p_user_id::UUID, 
    p_listing_id, 
    listing_record.business_id, 
    p_quantity, 
    total_cost, 
    listing_record.original_price * p_quantity,
    'pending'
  );
  
  result := json_build_object(
    'success', true,
    'total_cost', total_cost,
    'co2_saved', co2_impact,
    'remaining_quantity', listing_record.quantity - p_quantity
  );
  
  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_listing_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.quantity = 0 THEN
        NEW.status = 'sold-out';
    ELSIF NEW.quantity <= 2 THEN
        NEW.status = 'low-stock';
    ELSE
        NEW.status = 'active';
    END IF;
    
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_user_impact()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  meals_count INTEGER;
  money_saved NUMERIC;
  co2_saved NUMERIC;
BEGIN
  -- Only process when status changes to 'collected'
  IF NEW.status = 'collected' AND (OLD.status IS NULL OR OLD.status != 'collected') THEN
    meals_count := NEW.quantity;
    money_saved := NEW.original_total - NEW.total_amount;
    co2_saved := meals_count * 0.8; -- 0.8 kg per meal
    
    -- Update user impact
    INSERT INTO public.user_impact (
      user_id, 
      total_meals_saved, 
      total_co2_saved_kg, 
      total_money_saved_ksh,
      experience_points
    )
    VALUES (
      NEW.user_id, 
      meals_count, 
      co2_saved, 
      money_saved,
      meals_count * 10 -- 10 XP per meal
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      total_meals_saved = user_impact.total_meals_saved + meals_count,
      total_co2_saved_kg = user_impact.total_co2_saved_kg + co2_saved,
      total_money_saved_ksh = user_impact.total_money_saved_ksh + money_saved,
      experience_points = user_impact.experience_points + (meals_count * 10),
      level = CASE 
        WHEN (user_impact.experience_points + (meals_count * 10)) >= 1000 THEN 3
        WHEN (user_impact.experience_points + (meals_count * 10)) >= 500 THEN 2
        ELSE 1
      END,
      updated_at = now();
      
    -- Create notification
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (
      NEW.user_id,
      'Impact Updated!',
      'You saved ' || meals_count || ' meals and ' || co2_saved || 'kg CO₂!',
      'order'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_business_metrics_on_purchase()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    listing_record RECORD;
    business_record RECORD;
    co2_impact NUMERIC;
    revenue_amount NUMERIC;
BEGIN
    -- Only process when status changes to 'collected'
    IF NEW.status = 'collected' AND (OLD.status IS NULL OR OLD.status != 'collected') THEN
        -- Get listing details
        SELECT * INTO listing_record 
        FROM listings 
        WHERE id = NEW.mystery_bag_id;
        
        IF FOUND THEN
            co2_impact := listing_record.co2_saved_per_item_kg * NEW.quantity;
            revenue_amount := NEW.total_amount;
            
            -- Update business metrics
            UPDATE business_profiles 
            SET 
                total_sales = total_sales + NEW.quantity,
                total_revenue = total_revenue + revenue_amount,
                total_co2_saved_kg = total_co2_saved_kg + co2_impact,
                updated_at = NOW()
            WHERE id = NEW.business_id;
            
            -- Update listing quantity
            UPDATE listings 
            SET quantity = quantity - NEW.quantity
            WHERE id = NEW.mystery_bag_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_favorited_users()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_id UUID;
BEGIN
    -- When status changes from sold-out to active, notify favorited users
    IF OLD.status = 'sold-out' AND NEW.status = 'active' THEN
        -- Insert notifications for all users who favorited this item
        FOR user_id IN 
            SELECT UNNEST(NEW.favorited_by_user_ids)::UUID
        LOOP
            INSERT INTO notifications (user_id, title, message, type, action_url)
            VALUES (
                user_id,
                'Your favorited item is back!',
                'The item "' || NEW.item_name || '" is now available again. Get it before it sells out!',
                'stock_alert',
                '/listing/' || NEW.id
            );
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.prevent_dual_profiles()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.get_user_type(user_uuid uuid DEFAULT auth.uid())
RETURNS user_type
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.business_profiles WHERE user_id = user_uuid) THEN
    RETURN 'business'::public.user_type;
  ELSIF EXISTS (SELECT 1 FROM public.user_profiles WHERE user_id = user_uuid) THEN
    RETURN 'consumer'::public.user_type;
  ELSE
    RETURN NULL;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.calculate_distance(lat1 numeric, lon1 numeric, lat2 numeric, lon2 numeric)
RETURNS numeric
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Haversine formula for calculating distance between two points
  RETURN (
    6371 * acos(
      cos(radians(lat1)) * cos(radians(lat2)) * 
      cos(radians(lon2) - radians(lon1)) + 
      sin(radians(lat1)) * sin(radians(lat2))
    )
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_listings_with_distance(user_lat numeric DEFAULT NULL::numeric, user_lon numeric DEFAULT NULL::numeric, max_distance numeric DEFAULT NULL::numeric, category_filter text DEFAULT NULL::text, search_query text DEFAULT NULL::text)
RETURNS TABLE(id uuid, item_name text, description text, quantity integer, price numeric, original_price numeric, pickup_start timestamp with time zone, pickup_end timestamp with time zone, status text, category text, thumbnail_url text, business_thumbnail_url text, favorited_by_user_ids text[], business_id uuid, business_name text, business_logo_url text, location text, average_rating numeric, rating_count integer, business_lat numeric, business_lon numeric, distance_km numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.id,
    l.item_name,
    l.description,
    l.quantity,
    l.price,
    l.original_price,
    l.pickup_start,
    l.pickup_end,
    l.status,
    l.category,
    l.thumbnail_url,
    l.business_thumbnail_url,
    l.favorited_by_user_ids,
    bp.id as business_id,
    bp.business_name,
    bp.business_logo_url,
    bp.location,
    bp.average_rating,
    bp.rating_count,
    bp.latitude as business_lat,
    bp.longitude as business_lon,
    CASE 
      WHEN user_lat IS NOT NULL AND user_lon IS NOT NULL AND bp.latitude IS NOT NULL AND bp.longitude IS NOT NULL
      THEN public.calculate_distance(user_lat, user_lon, bp.latitude, bp.longitude)
      ELSE NULL
    END as distance_km
  FROM public.listings l
  JOIN public.business_profiles bp ON l.business_id = bp.id
  WHERE 
    (category_filter IS NULL OR l.category = category_filter OR category_filter = 'all')
    AND (search_query IS NULL OR 
         l.item_name ILIKE '%' || search_query || '%' OR 
         bp.business_name ILIKE '%' || search_query || '%')
    AND (max_distance IS NULL OR 
         user_lat IS NULL OR user_lon IS NULL OR 
         bp.latitude IS NULL OR bp.longitude IS NULL OR
         public.calculate_distance(user_lat, user_lon, bp.latitude, bp.longitude) <= max_distance)
  ORDER BY 
    CASE WHEN user_lat IS NOT NULL AND user_lon IS NOT NULL THEN distance_km END ASC NULLS LAST,
    l.created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.update_business_analytics()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  business_record RECORD;
  total_views INTEGER;
  total_favorites INTEGER;
  total_purchases INTEGER;
  total_revenue NUMERIC;
BEGIN
  -- Get business from listing
  SELECT bp.* INTO business_record
  FROM business_profiles bp
  JOIN listings l ON l.business_id = bp.id
  WHERE l.id = COALESCE(NEW.listing_id, OLD.listing_id);
  
  IF business_record.id IS NOT NULL THEN
    -- Calculate real analytics
    SELECT 
      COALESCE(SUM(views), 0),
      COALESCE(SUM(favorites), 0),
      COALESCE(SUM(purchases), 0),
      COALESCE(SUM(revenue), 0)
    INTO total_views, total_favorites, total_purchases, total_revenue
    FROM listing_performance 
    WHERE business_id = business_record.id;
    
    -- Update business profile with real analytics
    UPDATE business_profiles 
    SET 
      total_sales = total_purchases,
      total_revenue = total_revenue,
      updated_at = NOW()
    WHERE id = business_record.id;
    
    -- Upsert listing performance for today
    INSERT INTO listing_performance (
      listing_id, 
      business_id, 
      date, 
      views, 
      favorites, 
      purchases, 
      revenue
    )
    VALUES (
      COALESCE(NEW.listing_id, OLD.listing_id),
      business_record.id,
      CURRENT_DATE,
      0, 0, 0, 0
    )
    ON CONFLICT (listing_id, date) 
    DO NOTHING;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE OR REPLACE FUNCTION public.track_listing_view(listing_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  business_uuid UUID;
BEGIN
  -- Get business_id from listing
  SELECT business_id INTO business_uuid
  FROM listings
  WHERE id = listing_uuid;
  
  -- Update listing performance for today
  INSERT INTO listing_performance (
    listing_id, 
    business_id, 
    date, 
    views,
    favorites,
    purchases,
    revenue
  )
  VALUES (
    listing_uuid,
    business_uuid,
    CURRENT_DATE,
    1, 0, 0, 0
  )
  ON CONFLICT (listing_id, date)
  DO UPDATE SET 
    views = listing_performance.views + 1,
    updated_at = NOW();
END;
$$;

CREATE OR REPLACE FUNCTION public.track_listing_favorite(listing_uuid uuid, is_favorited boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  business_uuid UUID;
  favorite_change INTEGER;
BEGIN
  -- Get business_id from listing
  SELECT business_id INTO business_uuid
  FROM listings
  WHERE id = listing_uuid;
  
  favorite_change := CASE WHEN is_favorited THEN 1 ELSE -1 END;
  
  -- Update listing performance for today
  INSERT INTO listing_performance (
    listing_id, 
    business_id, 
    date, 
    views,
    favorites,
    purchases,
    revenue
  )
  VALUES (
    listing_uuid,
    business_uuid,
    CURRENT_DATE,
    0, favorite_change, 0, 0
  )
  ON CONFLICT (listing_id, date)
  DO UPDATE SET 
    favorites = listing_performance.favorites + favorite_change,
    updated_at = NOW();
END;
$$;

-- 4. Add input validation trigger for ratings
CREATE OR REPLACE FUNCTION public.validate_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate rating is between 1 and 5
  IF NEW.rating < 1 OR NEW.rating > 5 THEN
    RAISE EXCEPTION 'Rating must be between 1 and 5, got %', NEW.rating;
  END IF;
  
  -- Ensure user exists (basic validation)
  IF NEW.user_id IS NULL THEN
    RAISE EXCEPTION 'User ID cannot be null';
  END IF;
  
  -- Ensure business exists
  IF NEW.business_id IS NULL THEN
    RAISE EXCEPTION 'Business ID cannot be null';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the validation trigger for ratings
DROP TRIGGER IF EXISTS validate_rating_trigger ON public.ratings;
CREATE TRIGGER validate_rating_trigger
  BEFORE INSERT OR UPDATE ON public.ratings
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_rating();

-- 5. Add validation for business profiles
CREATE OR REPLACE FUNCTION public.validate_business_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate required fields
  IF NEW.business_name IS NULL OR LENGTH(TRIM(NEW.business_name)) = 0 THEN
    RAISE EXCEPTION 'Business name cannot be empty';
  END IF;
  
  IF NEW.address IS NULL OR LENGTH(TRIM(NEW.address)) = 0 THEN
    RAISE EXCEPTION 'Business address cannot be empty';
  END IF;
  
  -- Validate email format if provided
  IF NEW.email IS NOT NULL AND NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Validate coordinates if provided
  IF NEW.latitude IS NOT NULL AND (NEW.latitude < -90 OR NEW.latitude > 90) THEN
    RAISE EXCEPTION 'Latitude must be between -90 and 90 degrees';
  END IF;
  
  IF NEW.longitude IS NOT NULL AND (NEW.longitude < -180 OR NEW.longitude > 180) THEN
    RAISE EXCEPTION 'Longitude must be between -180 and 180 degrees';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the validation trigger for business profiles
DROP TRIGGER IF EXISTS validate_business_profile_trigger ON public.business_profiles;
CREATE TRIGGER validate_business_profile_trigger
  BEFORE INSERT OR UPDATE ON public.business_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_business_profile();