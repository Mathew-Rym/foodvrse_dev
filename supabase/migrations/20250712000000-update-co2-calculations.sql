-- Update CO2 calculations to use real-world values
-- Based on research: 2.5 kg CO2 per meal saved (production, transport, waste)

-- Update the trigger function with new CO2 calculation
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
    
    -- Calculate metrics with real-world calculations
    meals_count := NEW.quantity;
    money_saved := NEW.original_total - NEW.total_amount;
    -- Real-world CO2 calculation: 2.5 kg CO2 per meal saved (based on food production, transport, and waste)
    co2_saved := meals_count * 0.0025; -- 2.5 kg per meal = 0.0025 tonnes
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
    
    -- Calculate metrics to subtract (using same real-world calculations)
    meals_count := NEW.quantity;
    money_saved := NEW.original_total - NEW.total_amount;
    co2_saved := meals_count * 0.0025; -- 2.5 kg per meal = 0.0025 tonnes
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

-- Update existing platform metrics to reflect new calculations
-- Recalculate based on current meals rescued with new CO2 factor
UPDATE public.platform_impact_metrics 
SET 
  total_co2_saved_tonnes = total_meals_rescued * 0.0025,
  total_water_conserved_liters = total_meals_rescued * 200,
  total_energy_saved_kwh = total_meals_rescued * 2.5,
  updated_at = now()
WHERE id = (SELECT id FROM public.platform_impact_metrics LIMIT 1); 