-- Create user_preferences table to store user settings including cookie consent
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cookie_consent BOOLEAN DEFAULT FALSE,
  analytics_consent BOOLEAN DEFAULT FALSE,
  marketing_consent BOOLEAN DEFAULT FALSE,
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  theme_preference VARCHAR(20) DEFAULT 'system',
  language_preference VARCHAR(10) DEFAULT 'en',
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_last_activity ON user_preferences(last_activity);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_preferences_updated_at 
  BEFORE UPDATE ON user_preferences 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to get or create user preferences
CREATE OR REPLACE FUNCTION get_or_create_user_preferences(user_uuid UUID)
RETURNS user_preferences AS $$
DECLARE
  user_pref user_preferences;
BEGIN
  -- Try to get existing preferences
  SELECT * INTO user_pref 
  FROM user_preferences 
  WHERE user_id = user_uuid;
  
  -- If no preferences exist, create default ones
  IF user_pref IS NULL THEN
    INSERT INTO user_preferences (user_id, cookie_consent, analytics_consent, marketing_consent, last_activity)
    VALUES (user_uuid, FALSE, FALSE, FALSE, NOW())
    RETURNING * INTO user_pref;
  END IF;
  
  RETURN user_pref;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS (Row Level Security)
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for user_preferences
CREATE POLICY "Users can view their own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON user_preferences TO authenticated;
GRANT USAGE ON SEQUENCE user_preferences_id_seq TO authenticated; 