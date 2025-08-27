-- Sync display names from auth.users to user_profiles
-- This migration updates existing user_profiles to match the display names in auth.users

-- Update user_profiles with display names from auth.users
UPDATE user_profiles 
SET display_name = COALESCE(
  auth.users.raw_user_meta_data->>'full_name',
  auth.users.raw_user_meta_data->>'name',
  auth.users.raw_user_meta_data->>'display_name',
  SPLIT_PART(auth.users.email, '@', 1)
)
FROM auth.users 
WHERE user_profiles.user_id = auth.users.id
AND (
  user_profiles.display_name = 'User' 
  OR user_profiles.display_name = 'Unnamed Business'
  OR user_profiles.display_name IS NULL
  OR user_profiles.display_name = ''
);

-- Add a trigger to automatically sync display names when auth.users is updated
CREATE OR REPLACE FUNCTION sync_auth_display_name()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user_profiles when auth.users display name changes
  UPDATE user_profiles 
  SET 
    display_name = COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name', 
      NEW.raw_user_meta_data->>'display_name',
      SPLIT_PART(NEW.email, '@', 1)
    ),
    updated_at = NOW()
  WHERE user_id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS auth_users_display_name_sync ON auth.users;
CREATE TRIGGER auth_users_display_name_sync
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_auth_display_name();
