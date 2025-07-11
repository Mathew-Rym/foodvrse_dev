-- Create platform impact metrics table
CREATE TABLE public.platform_impact_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  total_co2_saved_tonnes DECIMAL(10, 6) NOT NULL DEFAULT 0,
  total_water_conserved_liters BIGINT NOT NULL DEFAULT 0,
  total_energy_saved_kwh DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total_meals_rescued BIGINT NOT NULL DEFAULT 0,
  total_money_saved_ksh DECIMAL(15, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert initial record
INSERT INTO public.platform_impact_metrics (
  total_co2_saved_tonnes,
  total_water_conserved_liters,
  total_energy_saved_kwh,
  total_meals_rescued,
  total_money_saved_ksh
) VALUES (12.7, 45200, 8450, 1247, 580000);

-- Create orders table for tracking order completion
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  mystery_bag_id UUID NOT NULL REFERENCES public.mystery_bags(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES public.business_profiles(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_amount DECIMAL(10, 2) NOT NULL,
  original_total DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'collected', 'cancelled', 'refunded')),
  payment_method TEXT,
  payment_id TEXT,
  pickup_code TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  collected_at TIMESTAMP WITH TIME ZONE
);

-- Create challenge settings table
CREATE TABLE public.challenge_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_type TEXT NOT NULL UNIQUE,
  goal_value INTEGER NOT NULL,
  badge_name TEXT NOT NULL,
  week_start_day INTEGER NOT NULL DEFAULT 1, -- 1 = Monday
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default weekly challenge settings
INSERT INTO public.challenge_settings (challenge_type, goal_value, badge_name, week_start_day) 
VALUES ('weekly_rescue', 10, 'Rescue Streak Hero', 1);

-- Create user challenges table
CREATE TABLE public.user_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  challenge_type TEXT NOT NULL,
  current_count INTEGER NOT NULL DEFAULT 0,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  badge_awarded BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, challenge_type, week_start_date)
);

-- Create badges table
CREATE TABLE public.badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user badges junction table
CREATE TABLE public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  week_earned DATE,
  UNIQUE(user_id, badge_id, week_earned)
);

-- Insert default badges
INSERT INTO public.badges (name, description, icon, color) VALUES
('Rescue Streak Hero', 'Completed weekly rescue challenge', '🏆', 'bg-yellow-100 text-yellow-600'),
('Eco Warrior', 'Saved significant CO2 emissions', '🌱', 'bg-green-100 text-green-600'),
('Water Saver', 'Conserved large amounts of water', '💧', 'bg-blue-100 text-blue-600'),
('Energy Guardian', 'Saved substantial energy', '⚡', 'bg-purple-100 text-purple-600');

-- Enable RLS
ALTER TABLE public.platform_impact_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Create policies for platform_impact_metrics (public read)
CREATE POLICY "Platform metrics are viewable by everyone" 
ON public.platform_impact_metrics 
FOR SELECT 
USING (true);

-- Create policies for orders
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" 
ON public.orders 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Business owners can view orders for their items" 
ON public.orders 
FOR SELECT 
USING (
  business_id IN (
    SELECT id FROM public.business_profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Business owners can update order status" 
ON public.orders 
FOR UPDATE 
USING (
  business_id IN (
    SELECT id FROM public.business_profiles WHERE user_id = auth.uid()
  )
);

-- Create policies for challenge settings (public read)
CREATE POLICY "Challenge settings are viewable by everyone" 
ON public.challenge_settings 
FOR SELECT 
USING (true);

-- Create policies for user challenges
CREATE POLICY "Users can view their own challenges" 
ON public.user_challenges 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own challenges" 
ON public.user_challenges 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenges" 
ON public.user_challenges 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for badges (public read)
CREATE POLICY "Badges are viewable by everyone" 
ON public.badges 
FOR SELECT 
USING (true);

-- Create policies for user badges
CREATE POLICY "Users can view their own badges" 
ON public.user_badges 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own badges" 
ON public.user_badges 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to update impact metrics when order is completed
CREATE OR REPLACE FUNCTION public.update_impact_metrics_on_order_completion()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check and award weekly badge
CREATE OR REPLACE FUNCTION public.check_and_award_weekly_badge(p_user_id UUID)
RETURNS VOID AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for order completion
CREATE TRIGGER update_impact_metrics_trigger
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_impact_metrics_on_order_completion();

-- Create triggers for timestamp updates
CREATE TRIGGER update_platform_impact_metrics_updated_at
BEFORE UPDATE ON public.platform_impact_metrics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_challenge_settings_updated_at
BEFORE UPDATE ON public.challenge_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_challenges_updated_at
BEFORE UPDATE ON public.user_challenges
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();