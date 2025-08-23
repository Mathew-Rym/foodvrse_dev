-- Create get_listings_with_distance function for real-time distance calculation
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
    l.business_id,
    bp.business_name,
    bp.business_logo_url,
    bp.location,
    COALESCE(l.average_rating, 0) as average_rating,
    COALESCE(l.rating_count, 0) as rating_count,
    bp.latitude as business_lat,
    bp.longitude as business_lon,
    CASE 
      WHEN user_lat IS NOT NULL AND user_lon IS NOT NULL 
           AND bp.latitude IS NOT NULL AND bp.longitude IS NOT NULL
      THEN (
        6371 * acos(
          cos(radians(user_lat)) * cos(radians(bp.latitude)) * 
          cos(radians(bp.longitude) - radians(user_lon)) + 
          sin(radians(user_lat)) * sin(radians(bp.latitude))
        )
      )
      ELSE NULL
    END as distance_km
  FROM public.listings l
  JOIN public.business_profiles bp ON l.business_id = bp.id
  WHERE l.status != 'sold-out'
    AND (category_filter IS NULL OR l.category ILIKE '%' || category_filter || '%')
    AND (search_query IS NULL OR 
         l.item_name ILIKE '%' || search_query || '%' OR 
         l.description ILIKE '%' || search_query || '%' OR
         bp.business_name ILIKE '%' || search_query || '%')
    AND (max_distance IS NULL OR 
         (user_lat IS NOT NULL AND user_lon IS NOT NULL AND 
          bp.latitude IS NOT NULL AND bp.longitude IS NOT NULL AND
          (6371 * acos(
            cos(radians(user_lat)) * cos(radians(bp.latitude)) * 
            cos(radians(bp.longitude) - radians(user_lon)) + 
            sin(radians(user_lat)) * sin(radians(bp.latitude))
          )) <= max_distance))
  ORDER BY 
    CASE WHEN user_lat IS NOT NULL AND user_lon IS NOT NULL 
         AND bp.latitude IS NOT NULL AND bp.longitude IS NOT NULL
    THEN (6371 * acos(
      cos(radians(user_lat)) * cos(radians(bp.latitude)) * 
      cos(radians(bp.longitude) - radians(user_lon)) + 
      sin(radians(user_lat)) * sin(radians(bp.latitude))
    ))
    ELSE 999999 END,
    l.created_at DESC;
END;
$$ LANGUAGE plpgsql STABLE;
