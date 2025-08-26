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
    mb.id,
    mb.item_name,
    mb.description,
    mb.quantity,
    mb.price,
    mb.original_price,
    mb.pickup_start,
    mb.pickup_end,
    mb.status,
    mb.category,
    mb.thumbnail_url,
    mb.business_thumbnail_url,
    mb.favorited_by_user_ids,
    mb.business_id,
    bp.business_name,
    bp.business_logo_url,
    bp.location,
    COALESCE(mb.average_rating, 0) as average_rating,
    COALESCE(mb.rating_count, 0) as rating_count,
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
  FROM public.mystery_bags l
  JOIN public.business_profiles bp ON mb.business_id = bp.id
  WHERE mb.status != 'sold-out'
    AND (category_filter IS NULL OR mb.category ILIKE '%' || category_filter || '%')
    AND (search_query IS NULL OR 
         mb.item_name ILIKE '%' || search_query || '%' OR 
         mb.description ILIKE '%' || search_query || '%' OR
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
    mb.created_at DESC;
END;
$$ LANGUAGE plpgsql STABLE;
