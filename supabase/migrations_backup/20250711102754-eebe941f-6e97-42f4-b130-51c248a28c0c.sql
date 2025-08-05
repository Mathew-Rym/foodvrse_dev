-- Update business_profiles table to add more tracking fields
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS co2_missed_kg NUMERIC DEFAULT 0.0;
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS carbon_credits_earned NUMERIC DEFAULT 0.0;

-- Create listings table if it doesn't exist with all required fields
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'listings') THEN
        -- Table doesn't exist, create it
        CREATE TABLE public.listings (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            business_id UUID NOT NULL,
            item_name TEXT NOT NULL,
            description TEXT,
            original_price NUMERIC NOT NULL,
            price NUMERIC NOT NULL,
            quantity INTEGER NOT NULL DEFAULT 0,
            initial_quantity INTEGER NOT NULL DEFAULT 0,
            category TEXT NOT NULL DEFAULT 'Meals',
            tags TEXT[] DEFAULT '{}',
            pickup_start TIMESTAMP WITH TIME ZONE NOT NULL,
            pickup_end TIMESTAMP WITH TIME ZONE NOT NULL,
            status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'low-stock', 'sold-out')),
            co2_saved_per_item_kg NUMERIC DEFAULT 0.8,
            favorited_by_user_ids TEXT[] DEFAULT '{}',
            times_favorited INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );

        -- Enable RLS
        ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

        -- Create policies
        CREATE POLICY "Listings are viewable by everyone" 
        ON public.listings 
        FOR SELECT 
        USING (true);

        CREATE POLICY "Business owners can manage their listings" 
        ON public.listings 
        FOR ALL 
        USING (business_id IN (
            SELECT id FROM business_profiles WHERE user_id = auth.uid()
        ));

        -- Create foreign key
        ALTER TABLE public.listings 
        ADD CONSTRAINT listings_business_id_fkey 
        FOREIGN KEY (business_id) REFERENCES business_profiles(id);
    END IF;
END $$;

-- Create notifications table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'notifications') THEN
        CREATE TABLE public.notifications (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            type TEXT NOT NULL,
            action_url TEXT,
            read BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );

        ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "Users can view their own notifications" 
        ON public.notifications 
        FOR SELECT 
        USING (auth.uid() = user_id);

        CREATE POLICY "Users can update their own notifications" 
        ON public.notifications 
        FOR UPDATE 
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- Create carbon_credit_waitlist table for waitlist functionality
CREATE TABLE IF NOT EXISTS public.carbon_credit_waitlist (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID NOT NULL,
    business_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    estimated_monthly_co2_kg NUMERIC,
    business_type TEXT,
    interested_features TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.carbon_credit_waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business owners can manage their waitlist entries" 
ON public.carbon_credit_waitlist 
FOR ALL 
USING (business_id IN (
    SELECT id FROM business_profiles WHERE user_id = auth.uid()
));

-- Create listing_performance table for analytics
CREATE TABLE IF NOT EXISTS public.listing_performance (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID NOT NULL,
    business_id UUID NOT NULL,
    views INTEGER DEFAULT 0,
    favorites INTEGER DEFAULT 0,
    purchases INTEGER DEFAULT 0,
    revenue NUMERIC DEFAULT 0,
    co2_saved_kg NUMERIC DEFAULT 0,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(listing_id, date)
);

ALTER TABLE public.listing_performance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business owners can view their listing performance" 
ON public.listing_performance 
FOR SELECT 
USING (business_id IN (
    SELECT id FROM business_profiles WHERE user_id = auth.uid()
));

-- Function to update listing status based on quantity
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

-- Create trigger for automatic status updates
DROP TRIGGER IF EXISTS trigger_update_listing_status ON public.listings;
CREATE TRIGGER trigger_update_listing_status
    BEFORE UPDATE OF quantity ON public.listings
    FOR EACH ROW
    EXECUTE FUNCTION update_listing_status();

-- Function to update business metrics when orders are completed
CREATE OR REPLACE FUNCTION update_business_metrics_on_purchase()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger for business metrics updates
DROP TRIGGER IF EXISTS trigger_update_business_metrics ON public.orders;
CREATE TRIGGER trigger_update_business_metrics
    AFTER UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION update_business_metrics_on_purchase();

-- Function to notify favorited users when item comes back in stock
CREATE OR REPLACE FUNCTION notify_favorited_users()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger for stock notifications
DROP TRIGGER IF EXISTS trigger_notify_favorited_users ON public.listings;
CREATE TRIGGER trigger_notify_favorited_users
    AFTER UPDATE OF status ON public.listings
    FOR EACH ROW
    EXECUTE FUNCTION notify_favorited_users();

-- Enable realtime for tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.listings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.business_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;