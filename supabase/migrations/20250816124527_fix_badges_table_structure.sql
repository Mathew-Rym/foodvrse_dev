-- Fix badges table structure by adding all missing columns

-- Add missing columns to badges table
ALTER TABLE badges ADD COLUMN IF NOT EXISTS category VARCHAR(50) NOT NULL DEFAULT 'general';
ALTER TABLE badges ADD COLUMN IF NOT EXISTS requirement_type VARCHAR(50) NOT NULL DEFAULT 'meals_saved';
ALTER TABLE badges ADD COLUMN IF NOT EXISTS requirement_value INTEGER NOT NULL DEFAULT 1;
ALTER TABLE badges ADD COLUMN IF NOT EXISTS rarity VARCHAR(20) DEFAULT 'common';
ALTER TABLE badges ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update existing badges to have default values for new columns
UPDATE badges SET 
    category = COALESCE(category, 'general'),
    requirement_type = COALESCE(requirement_type, 'meals_saved'),
    requirement_value = COALESCE(requirement_value, 1),
    rarity = COALESCE(rarity, 'common'),
    is_active = COALESCE(is_active, true)
WHERE category IS NULL OR requirement_type IS NULL OR requirement_value IS NULL OR rarity IS NULL OR is_active IS NULL;
