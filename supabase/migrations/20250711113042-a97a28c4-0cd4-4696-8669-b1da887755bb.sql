-- Create storage bucket for business images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('business-images', 'business-images', true);

-- Create storage policies for business images
CREATE POLICY "Business images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'business-images');

CREATE POLICY "Business owners can upload their images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'business-images' AND 
  auth.uid() IN (
    SELECT user_id FROM business_profiles 
    WHERE id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Business owners can update their images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'business-images' AND 
  auth.uid() IN (
    SELECT user_id FROM business_profiles 
    WHERE id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Business owners can delete their images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'business-images' AND 
  auth.uid() IN (
    SELECT user_id FROM business_profiles 
    WHERE id::text = (storage.foldername(name))[1]
  )
);

-- Update favorites functionality - ensure proper RLS on user_favorites
UPDATE user_favorites SET user_id = user_id; -- Trigger RLS update

-- Create function to update business analytics in real-time
CREATE OR REPLACE FUNCTION update_business_analytics()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Create triggers for real-time analytics
CREATE TRIGGER update_analytics_on_order
  AFTER INSERT OR UPDATE OR DELETE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_business_analytics();

-- Create function to track listing views
CREATE OR REPLACE FUNCTION track_listing_view(listing_uuid UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Create function to track favorites
CREATE OR REPLACE FUNCTION track_listing_favorite(listing_uuid UUID, is_favorited BOOLEAN)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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