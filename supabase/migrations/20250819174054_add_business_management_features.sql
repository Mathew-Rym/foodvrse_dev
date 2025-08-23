-- Enhanced Business Management Features Migration
-- This migration adds comprehensive business management capabilities

-- Step 1: Create business status enum
CREATE TYPE business_status AS ENUM (
  'pending',      -- New business application
  'active',       -- Approved and operational
  'verified',     -- Verified with documents
  'suspended',    -- Temporarily suspended
  'rejected',     -- Application rejected
  'inactive'      -- Business no longer active
);

-- Step 2: Create business categories enum
CREATE TYPE business_category AS ENUM (
  'restaurant',
  'cafe',
  'bakery',
  'grocery_store',
  'supermarket',
  'hotel',
  'catering_service',
  'food_manufacturer',
  'food_distributor',
  'convenience_store',
  'food_truck',
  'farmers_market',
  'other'
);

-- Step 3: Create business verification levels enum
CREATE TYPE verification_level AS ENUM (
  'unverified',   -- No verification
  'basic',        -- Basic business info verified
  'documented',   -- Documents submitted and verified
  'premium'       -- Premium verification with site visit
);

-- Step 4: Add new columns to business_profiles table
ALTER TABLE business_profiles 
ADD COLUMN IF NOT EXISTS status business_status DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS category business_category,
ADD COLUMN IF NOT EXISTS verification_level verification_level DEFAULT 'unverified',
ADD COLUMN IF NOT EXISTS verification_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS verification_documents JSONB,
ADD COLUMN IF NOT EXISTS business_license VARCHAR(255),
ADD COLUMN IF NOT EXISTS tax_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS contact_person VARCHAR(255),
ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS operating_hours JSONB,
ADD COLUMN IF NOT EXISTS delivery_radius INTEGER DEFAULT 5000,
ADD COLUMN IF NOT EXISTS max_daily_orders INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS commission_rate DECIMAL(5,2) DEFAULT 15.00,
ADD COLUMN IF NOT EXISTS payment_methods TEXT[],
ADD COLUMN IF NOT EXISTS social_media JSONB,
ADD COLUMN IF NOT EXISTS business_description TEXT,
ADD COLUMN IF NOT EXISTS special_offers TEXT,
ADD COLUMN IF NOT EXISTS dietary_options TEXT[],
ADD COLUMN IF NOT EXISTS sustainability_practices TEXT[],
ADD COLUMN IF NOT EXISTS last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS analytics_enabled BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS auto_accept_orders BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS minimum_order_amount DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS preparation_time_minutes INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Step 5: Create business_analytics table for enhanced tracking
CREATE TABLE IF NOT EXISTS business_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  
  -- Order metrics
  total_orders INTEGER DEFAULT 0,
  completed_orders INTEGER DEFAULT 0,
  cancelled_orders INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0.00,
  commission_earned DECIMAL(12,2) DEFAULT 0.00,
  
  -- Food waste metrics
  food_waste_kg DECIMAL(10,2) DEFAULT 0.00,
  food_waste_value DECIMAL(12,2) DEFAULT 0.00,
  meals_saved INTEGER DEFAULT 0,
  co2_prevented_kg DECIMAL(10,2) DEFAULT 0.00,
  
  -- Customer metrics
  unique_customers INTEGER DEFAULT 0,
  repeat_customers INTEGER DEFAULT 0,
  average_order_value DECIMAL(10,2) DEFAULT 0.00,
  
  -- Performance metrics
  average_preparation_time_minutes INTEGER DEFAULT 0,
  customer_rating DECIMAL(3,2) DEFAULT 0.00,
  rating_count INTEGER DEFAULT 0,
  
  -- Operational metrics
  peak_hours JSONB,
  popular_items JSONB,
  customer_feedback JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(business_id, date)
);

-- Step 6: Create business_verification table
CREATE TABLE IF NOT EXISTS business_verification (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE,
  verification_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  document_url VARCHAR(500),
  document_type VARCHAR(50),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 7: Create business_notifications table
CREATE TABLE IF NOT EXISTS business_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  action_url VARCHAR(500),
  priority VARCHAR(20) DEFAULT 'normal',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 8: Create business_settings table
CREATE TABLE IF NOT EXISTS business_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE,
  setting_key VARCHAR(100) NOT NULL,
  setting_value JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(business_id, setting_key)
);

-- Step 9: Create business_operating_hours table
CREATE TABLE IF NOT EXISTS business_operating_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL,
  open_time TIME,
  close_time TIME,
  is_closed BOOLEAN DEFAULT FALSE,
  break_start TIME,
  break_end TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(business_id, day_of_week)
);

-- Step 10: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_business_profiles_status ON business_profiles(status);
CREATE INDEX IF NOT EXISTS idx_business_profiles_category ON business_profiles(category);
CREATE INDEX IF NOT EXISTS idx_business_profiles_verification_level ON business_profiles(verification_level);
CREATE INDEX IF NOT EXISTS idx_business_analytics_business_date ON business_analytics(business_id, date);
CREATE INDEX IF NOT EXISTS idx_business_verification_business ON business_verification(business_id);
CREATE INDEX IF NOT EXISTS idx_business_notifications_business ON business_notifications(business_id, read);
CREATE INDEX IF NOT EXISTS idx_business_operating_hours_business ON business_operating_hours(business_id);

-- Step 11: Create functions for business management

-- Function to update business analytics
CREATE OR REPLACE FUNCTION update_business_analytics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO business_analytics (
    business_id, 
    date, 
    total_orders,
    completed_orders,
    cancelled_orders,
    total_revenue,
    commission_earned,
    food_waste_kg,
    food_waste_value,
    meals_saved,
    co2_prevented_kg,
    unique_customers,
    average_order_value,
    customer_rating,
    rating_count
  )
  VALUES (
    NEW.business_id,
    CURRENT_DATE,
    1,
    CASE WHEN NEW.status = 'completed' THEN 1 ELSE 0 END,
    CASE WHEN NEW.status = 'cancelled' THEN 1 ELSE 0 END,
    NEW.total_amount,
    NEW.total_amount * 0.15,
    NEW.food_waste_kg,
    NEW.food_waste_value,
    NEW.meals_saved,
    NEW.co2_prevented_kg,
    1,
    NEW.total_amount,
    NEW.customer_rating,
    CASE WHEN NEW.customer_rating IS NOT NULL THEN 1 ELSE 0 END
  )
  ON CONFLICT (business_id, date)
  DO UPDATE SET
    total_orders = business_analytics.total_orders + 1,
    completed_orders = business_analytics.completed_orders + CASE WHEN NEW.status = 'completed' THEN 1 ELSE 0 END,
    cancelled_orders = business_analytics.cancelled_orders + CASE WHEN NEW.status = 'cancelled' THEN 1 ELSE 0 END,
    total_revenue = business_analytics.total_revenue + NEW.total_amount,
    commission_earned = business_analytics.commission_earned + (NEW.total_amount * 0.15),
    food_waste_kg = business_analytics.food_waste_kg + COALESCE(NEW.food_waste_kg, 0),
    food_waste_value = business_analytics.food_waste_value + COALESCE(NEW.food_waste_value, 0),
    meals_saved = business_analytics.meals_saved + COALESCE(NEW.meals_saved, 0),
    co2_prevented_kg = business_analytics.co2_prevented_kg + COALESCE(NEW.co2_prevented_kg, 0),
    average_order_value = (business_analytics.total_revenue + NEW.total_amount) / (business_analytics.total_orders + 1),
    customer_rating = CASE 
      WHEN NEW.customer_rating IS NOT NULL THEN 
        (business_analytics.customer_rating * business_analytics.rating_count + NEW.customer_rating) / (business_analytics.rating_count + 1)
      ELSE business_analytics.customer_rating
    END,
    rating_count = business_analytics.rating_count + CASE WHEN NEW.customer_rating IS NOT NULL THEN 1 ELSE 0 END,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update business last activity
CREATE OR REPLACE FUNCTION update_business_last_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE business_profiles 
  SET last_activity = NOW()
  WHERE id = NEW.business_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to create business notification
CREATE OR REPLACE FUNCTION create_business_notification(
  p_business_id UUID,
  p_type VARCHAR(50),
  p_title VARCHAR(255),
  p_message TEXT,
  p_priority VARCHAR(20) DEFAULT 'normal'
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO business_notifications (
    business_id,
    type,
    title,
    message,
    priority
  ) VALUES (
    p_business_id,
    p_type,
    p_title,
    p_message,
    p_priority
  ) RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- Step 12: Create triggers
DROP TRIGGER IF EXISTS trigger_update_business_analytics ON orders;
CREATE TRIGGER trigger_update_business_last_activity
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_business_last_activity();

DROP TRIGGER IF EXISTS trigger_update_business_last_activity ON orders;
CREATE TRIGGER trigger_update_business_last_activity
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_business_last_activity();

-- Step 13: Create RLS policies for new tables

-- Business analytics policies
ALTER TABLE business_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business owners can view their own analytics" ON business_analytics
  FOR SELECT USING (
    business_id IN (
      SELECT id FROM business_profiles WHERE user_id = auth.uid()
    )
  );

-- Business verification policies
ALTER TABLE business_verification ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business owners can view their own verification" ON business_verification
  FOR SELECT USING (
    business_id IN (
      SELECT id FROM business_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Business owners can insert their own verification" ON business_verification
  FOR INSERT WITH CHECK (
    business_id IN (
      SELECT id FROM business_profiles WHERE user_id = auth.uid()
    )
  );

-- Business notifications policies
ALTER TABLE business_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business owners can view their own notifications" ON business_notifications
  FOR SELECT USING (
    business_id IN (
      SELECT id FROM business_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Business owners can update their own notifications" ON business_notifications
  FOR UPDATE USING (
    business_id IN (
      SELECT id FROM business_profiles WHERE user_id = auth.uid()
    )
  );

-- Business settings policies
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business owners can manage their own settings" ON business_settings
  FOR ALL USING (
    business_id IN (
      SELECT id FROM business_profiles WHERE user_id = auth.uid()
    )
  );

-- Business operating hours policies
ALTER TABLE business_operating_hours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business owners can manage their own operating hours" ON business_operating_hours
  FOR ALL USING (
    business_id IN (
      SELECT id FROM business_profiles WHERE user_id = auth.uid()
    )
  );

-- Step 14: Insert default operating hours for existing businesses
INSERT INTO business_operating_hours (business_id, day_of_week, open_time, close_time, is_closed)
SELECT 
  id as business_id,
  generate_series(0, 6) as day_of_week,
  '08:00:00' as open_time,
  '22:00:00' as close_time,
  false as is_closed
FROM business_profiles
ON CONFLICT (business_id, day_of_week) DO NOTHING;

-- Step 15: Insert default settings for existing businesses
INSERT INTO business_settings (business_id, setting_key, setting_value)
SELECT 
  id as business_id,
  'notifications' as setting_key,
  '{"email": true, "sms": false, "push": true}' as setting_value
FROM business_profiles
ON CONFLICT (business_id, setting_key) DO NOTHING;

-- Step 16: Create view for business dashboard data
CREATE OR REPLACE VIEW business_dashboard_data AS
SELECT 
  bp.id,
  bp.business_name,
  bp.status,
  bp.category,
  bp.verification_level,
  bp.location,
  bp.average_rating,
  bp.rating_count,
  bp.last_activity,
  bp.onboarding_completed,
  COALESCE(ba.total_orders, 0) as total_orders,
  COALESCE(ba.total_revenue, 0) as total_revenue,
  COALESCE(ba.commission_earned, 0) as commission_earned,
  COALESCE(ba.food_waste_kg, 0) as food_waste_kg,
  COALESCE(ba.meals_saved, 0) as meals_saved,
  COALESCE(ba.co2_prevented_kg, 0) as co2_prevented_kg,
  COALESCE(ba.unique_customers, 0) as unique_customers,
  COALESCE(ba.average_order_value, 0) as average_order_value,
  COALESCE(ba.customer_rating, 0) as customer_rating,
  (SELECT COUNT(*) FROM business_notifications WHERE business_id = bp.id AND read = false) as unread_notifications
FROM business_profiles bp
LEFT JOIN (
  SELECT 
    business_id,
    SUM(total_orders) as total_orders,
    SUM(total_revenue) as total_revenue,
    SUM(commission_earned) as commission_earned,
    SUM(food_waste_kg) as food_waste_kg,
    SUM(meals_saved) as meals_saved,
    SUM(co2_prevented_kg) as co2_prevented_kg,
    SUM(unique_customers) as unique_customers,
    AVG(average_order_value) as average_order_value,
    AVG(customer_rating) as customer_rating
  FROM business_analytics
  WHERE date >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY business_id
) ba ON bp.id = ba.business_id;

-- Step 17: Grant necessary permissions
GRANT SELECT ON business_dashboard_data TO authenticated;
GRANT SELECT ON business_analytics TO authenticated;
GRANT SELECT, INSERT, UPDATE ON business_verification TO authenticated;
GRANT SELECT, UPDATE ON business_notifications TO authenticated;
GRANT ALL ON business_settings TO authenticated;
GRANT ALL ON business_operating_hours TO authenticated;

-- Migration completed successfully!








