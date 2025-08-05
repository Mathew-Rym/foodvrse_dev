-- Create comprehensive listings system based on the uploaded image design

-- Update businesses table to add missing columns for comprehensive tracking
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS total_sales INTEGER DEFAULT 0;
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS total_revenue NUMERIC(10,2) DEFAULT 0.0;
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS total_co2_saved_kg NUMERIC(10,3) DEFAULT 0.0;
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS last_month_sales INTEGER DEFAULT 0;
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS last_month_revenue NUMERIC(10,2) DEFAULT 0.0;
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS average_rating NUMERIC(3,2) DEFAULT 0.0;
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0;

-- Create comprehensive listings table
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  initial_quantity INTEGER NOT NULL DEFAULT 0,
  price NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2) NOT NULL,
  category TEXT NOT NULL DEFAULT 'Meals',
  tags TEXT[] DEFAULT '{}',
  pickup_start TIMESTAMPTZ NOT NULL,
  pickup_end TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'low-stock', 'sold-out')),
  co2_saved_per_item_kg NUMERIC(10,3) DEFAULT 0.8,
  favorited_by_user_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on listings table
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Drop and recreate RLS policies for listings to ensure they're correct
DROP POLICY IF EXISTS "Listings are viewable by everyone" ON listings;
CREATE POLICY "Listings are viewable by everyone" 
ON listings FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Business owners can manage their listings" ON listings;
CREATE POLICY "Business owners can manage their listings" 
ON listings FOR ALL 
USING (business_id IN (
  SELECT id FROM business_profiles WHERE user_id = auth.uid()
));

-- Function to automatically update listing status based on quantity
CREATE OR REPLACE FUNCTION update_listing_status()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Trigger to automatically update listing status
DROP TRIGGER IF EXISTS trigger_update_listing_status ON listings;
CREATE TRIGGER trigger_update_listing_status
  BEFORE UPDATE OF quantity ON listings
  FOR EACH ROW
  EXECUTE FUNCTION update_listing_status();

-- Function to update business rating when new rating is added
CREATE OR REPLACE FUNCTION update_business_rating()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Trigger to update business rating
DROP TRIGGER IF EXISTS trigger_update_business_rating ON ratings;
CREATE TRIGGER trigger_update_business_rating
  AFTER INSERT OR UPDATE OR DELETE ON ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_business_rating();

-- Function to handle purchase and update metrics
CREATE OR REPLACE FUNCTION process_purchase(
  p_listing_id UUID,
  p_user_id TEXT,
  p_quantity INTEGER DEFAULT 1
)
RETURNS JSON AS $$
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
  
  -- Create order record (assuming orders table exists)
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample data for testing
INSERT INTO listings (
  business_id,
  item_name,
  description,
  quantity,
  initial_quantity,
  price,
  original_price,
  category,
  tags,
  pickup_start,
  pickup_end
) 
SELECT 
  bp.id,
  'Magic Bag',
  'Surprise selection of fresh items',
  4,
  10,
  259.00,
  600.00,
  'Meals',
  ARRAY['surprise', 'value'],
  CURRENT_DATE + INTERVAL '17 hours 30 minutes',
  CURRENT_DATE + INTERVAL '18 hours'
FROM business_profiles bp
LIMIT 1
ON CONFLICT DO NOTHING;

-- Enable realtime for listings table
ALTER TABLE listings REPLICA IDENTITY FULL;
ALTER TABLE business_profiles REPLICA IDENTITY FULL;