-- User Preferences Migration Script
-- Apply this in your Supabase Dashboard > SQL Editor

-- Add last_activity column to user_preferences table
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create index on last_activity for better performance
CREATE INDEX IF NOT EXISTS idx_user_preferences_last_activity 
ON user_preferences(last_activity);

-- Update the get_or_create_user_preferences function to set last_activity
CREATE OR REPLACE FUNCTION get_or_create_user_preferences(user_id UUID)
RETURNS user_preferences AS $$
DECLARE
    user_pref user_preferences;
BEGIN
    -- Try to get existing preferences
    SELECT * INTO user_pref 
    FROM user_preferences 
    WHERE user_id = get_or_create_user_preferences.user_id;
    
    -- If no preferences exist, create them
    IF user_pref IS NULL THEN
        INSERT INTO user_preferences (
            user_id, 
            cookie_consent, 
            analytics_consent, 
            marketing_consent, 
            last_activity
        ) VALUES (
            get_or_create_user_preferences.user_id, 
            false, 
            false, 
            false, 
            NOW()
        ) RETURNING * INTO user_pref;
    END IF;
    
    RETURN user_pref;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing user preferences to have last_activity set
UPDATE user_preferences 
SET last_activity = NOW() 
WHERE last_activity IS NULL;

-- Verify the migration
SELECT 
    'Migration completed successfully' as status,
    COUNT(*) as total_user_preferences,
    COUNT(CASE WHEN last_activity IS NOT NULL THEN 1 END) as with_last_activity
FROM user_preferences; 