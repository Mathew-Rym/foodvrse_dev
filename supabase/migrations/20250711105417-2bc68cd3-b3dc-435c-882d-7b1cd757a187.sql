-- Add missing columns to listings table for business thumbnail/item image
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
ADD COLUMN IF NOT EXISTS business_thumbnail_url TEXT;

-- Add image/thumbnail URLs to business_profiles table 
ALTER TABLE public.business_profiles 
ADD COLUMN IF NOT EXISTS business_thumbnail_url TEXT;

-- Update listings table to include proper geolocation support
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS latitude NUMERIC,
ADD COLUMN IF NOT EXISTS longitude NUMERIC;

-- Add distance calculation function
CREATE OR REPLACE FUNCTION public.calculate_distance(lat1 NUMERIC, lon1 NUMERIC, lat2 NUMERIC, lon2 NUMERIC)
RETURNS NUMERIC AS $$
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
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create function to get listings with distance
CREATE OR REPLACE FUNCTION public.get_listings_with_distance(
  user_lat NUMERIC DEFAULT NULL,
  user_lon NUMERIC DEFAULT NULL,
  max_distance NUMERIC DEFAULT NULL,
  category_filter TEXT DEFAULT NULL,
  search_query TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  item_name TEXT,
  description TEXT,
  quantity INTEGER,
  price NUMERIC,
  original_price NUMERIC,
  pickup_start TIMESTAMP WITH TIME ZONE,
  pickup_end TIMESTAMP WITH TIME ZONE,
  status TEXT,
  category TEXT,
  thumbnail_url TEXT,
  business_thumbnail_url TEXT,
  favorited_by_user_ids TEXT[],
  business_id UUID,
  business_name TEXT,
  business_logo_url TEXT,
  location TEXT,
  average_rating NUMERIC,
  rating_count INTEGER,
  business_lat NUMERIC,
  business_lon NUMERIC,
  distance_km NUMERIC
) AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;