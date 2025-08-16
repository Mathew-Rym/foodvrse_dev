-- Add missing category column to badges table
ALTER TABLE badges ADD COLUMN IF NOT EXISTS category VARCHAR(50) NOT NULL DEFAULT 'general';

-- Update existing badges to have a category if they don't have one
UPDATE badges SET category = 'general' WHERE category IS NULL OR category = '';
