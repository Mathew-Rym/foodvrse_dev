-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  is_time_based BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_profiles table for user information
CREATE TABLE public.user_profiles (
  id UUID NOT NULL PRIMARY KEY,
  user_id UUID NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  user_type TEXT DEFAULT 'consumer',
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create business_profiles table for enhanced business information
CREATE TABLE public.business_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  business_name TEXT NOT NULL,
  business_logo_url TEXT,
  location TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  website_url TEXT,
  description TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mystery_bags table for business listings
CREATE TABLE public.mystery_bags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.business_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2) NOT NULL,
  items_available INTEGER NOT NULL DEFAULT 0,
  pickup_start_time TIME NOT NULL,
  pickup_end_time TIME NOT NULL,
  pickup_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT true,
  category_name TEXT DEFAULT 'Meals',
  allergen_info TEXT,
  ingredients TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mystery_bag_categories junction table for many-to-many relationship
CREATE TABLE public.mystery_bag_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mystery_bag_id UUID NOT NULL REFERENCES public.mystery_bags(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(mystery_bag_id, category_id)
);

-- Create ratings table for business/product reviews
CREATE TABLE public.ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  business_id UUID NOT NULL REFERENCES public.business_profiles(id) ON DELETE CASCADE,
  mystery_bag_id UUID REFERENCES public.mystery_bags(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_comment TEXT,
  order_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mystery_bags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mystery_bag_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Create policies for categories (public read)
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage categories" 
ON public.categories 
FOR ALL 
USING (false);

-- Create policies for business_profiles
CREATE POLICY "Business profiles are viewable by everyone" 
ON public.business_profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own business profile" 
ON public.business_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business profile" 
ON public.business_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for mystery_bags
CREATE POLICY "Mystery bags are viewable by everyone" 
ON public.mystery_bags 
FOR SELECT 
USING (true);

CREATE POLICY "Business owners can manage their mystery bags" 
ON public.mystery_bags 
FOR ALL 
USING (
  business_id IN (
    SELECT id FROM public.business_profiles WHERE user_id = auth.uid()
  )
);

-- Create policies for mystery_bag_categories
CREATE POLICY "Mystery bag categories are viewable by everyone" 
ON public.mystery_bag_categories 
FOR SELECT 
USING (true);

CREATE POLICY "Business owners can manage their mystery bag categories" 
ON public.mystery_bag_categories 
FOR ALL 
USING (
  mystery_bag_id IN (
    SELECT mb.id FROM public.mystery_bags mb
    JOIN public.business_profiles bp ON mb.business_id = bp.id
    WHERE bp.user_id = auth.uid()
  )
);

-- Create policies for ratings
CREATE POLICY "Ratings are viewable by everyone" 
ON public.ratings 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own ratings" 
ON public.ratings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings" 
ON public.ratings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_business_profiles_updated_at
BEFORE UPDATE ON public.business_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mystery_bags_updated_at
BEFORE UPDATE ON public.mystery_bags
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ratings_updated_at
BEFORE UPDATE ON public.ratings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories
INSERT INTO public.categories (name, description, icon, color, is_time_based) VALUES
('Supermarkets', 'Grocery stores and supermarkets', '🛒', 'bg-green-100 text-green-600', false),
('Pick for Lunch', 'Perfect lunch options', '🍱', 'bg-blue-100 text-blue-600', false),
('Pick for Breakfast', 'Start your day right', '🥐', 'bg-yellow-100 text-yellow-600', false),
('Meals', 'Complete meal options', '🍽️', 'bg-orange-100 text-orange-600', false),
('Snacks', 'Quick bites and snacks', '🍿', 'bg-purple-100 text-purple-600', false),
('Pick Up Now', 'Available for immediate pickup', '🚀', 'bg-red-100 text-red-600', true),
('Pick Up Tomorrow', 'Available for pickup tomorrow', '📅', 'bg-indigo-100 text-indigo-600', true),
('Drinks', 'Beverages and drinks', '🥤', 'bg-teal-100 text-teal-600', false),
('Bread & Pastries', 'Fresh baked goods', '🥖', 'bg-amber-100 text-amber-600', false),
('Groceries', 'General grocery items', '🛍️', 'bg-gray-100 text-gray-600', false);

-- Create function to get time-based categories dynamically
CREATE OR REPLACE FUNCTION get_mystery_bags_by_pickup_time()
RETURNS TABLE (
  bag_id UUID,
  pickup_category TEXT
) AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;