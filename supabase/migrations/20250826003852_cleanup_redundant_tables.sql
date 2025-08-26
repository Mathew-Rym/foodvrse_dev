-- Cleanup redundant tables and update business_profiles schema
-- Migration: 20250826003852_cleanup_redundant_tables.sql

-- Remove redundant tables
DROP TABLE IF EXISTS business_partners CASCADE;
DROP TABLE IF EXISTS business_verification CASCADE;
DROP TABLE IF EXISTS user_challenges CASCADE;

-- Add status column to business_profiles if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'business_profiles' AND column_name = 'status') THEN
        ALTER TABLE business_profiles ADD COLUMN status VARCHAR(20) DEFAULT 'pending_approval';
    END IF;
END $$;

-- Add is_approved column for backward compatibility (boolean version)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'business_profiles' AND column_name = 'is_approved') THEN
        ALTER TABLE business_profiles ADD COLUMN is_approved BOOLEAN DEFAULT false;
    END IF;
END $$;


-- Add constraint to ensure valid status values
ALTER TABLE business_profiles 
ADD CONSTRAINT check_business_status 
CHECK (status IN ('pending_approval', 'approved', 'rejected'));

-- Create function to sync is_approved with status
CREATE OR REPLACE FUNCTION sync_business_approval_status()
RETURNS TRIGGER AS $$
BEGIN
    NEW.is_approved := (NEW.status = 'approved');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically sync is_approved
DROP TRIGGER IF EXISTS sync_business_approval_trigger ON business_profiles;
CREATE TRIGGER sync_business_approval_trigger
    BEFORE INSERT OR UPDATE ON business_profiles
    FOR EACH ROW
    EXECUTE FUNCTION sync_business_approval_status();

-- Update existing records to have proper status
UPDATE business_profiles 
SET status = 'approved' 
WHERE is_approved = true AND (status IS NULL OR status = 'pending_approval');

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
