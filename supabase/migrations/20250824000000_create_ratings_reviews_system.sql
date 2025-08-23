-- World-Class Rating and Review System
-- This migration creates a comprehensive rating system for businesses and listings

-- Create ratings table for business ratings
CREATE TABLE IF NOT EXISTS public.business_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.business_profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  review_title VARCHAR(255),
  helpful_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one rating per user per business
  UNIQUE(business_id, user_id)
);

-- Create listing ratings table for individual listing ratings
CREATE TABLE IF NOT EXISTS public.listing_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  review_title VARCHAR(255),
  helpful_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one rating per user per listing
  UNIQUE(listing_id, user_id)
);

-- Add rating columns to existing tables if they don't exist
ALTER TABLE public.business_profiles 
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0;

ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0;

-- Enable RLS
ALTER TABLE public.business_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for business_ratings
CREATE POLICY "Users can view all business ratings" 
ON public.business_ratings FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own business ratings" 
ON public.business_ratings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business ratings" 
ON public.business_ratings FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own business ratings" 
ON public.business_ratings FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for listing_ratings
CREATE POLICY "Users can view all listing ratings" 
ON public.listing_ratings FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own listing ratings" 
ON public.listing_ratings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listing ratings" 
ON public.listing_ratings FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listing ratings" 
ON public.listing_ratings FOR DELETE 
USING (auth.uid() = user_id); 