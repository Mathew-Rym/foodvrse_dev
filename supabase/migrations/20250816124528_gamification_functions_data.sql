-- Functions and Data for Gamification System

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_weekly_challenges_updated_at BEFORE UPDATE ON weekly_challenges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_community_challenges_updated_at BEFORE UPDATE ON community_challenges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_community_challenges_updated_at BEFORE UPDATE ON user_community_challenges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leaderboard_updated_at BEFORE UPDATE ON leaderboard FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_milestones_updated_at BEFORE UPDATE ON user_milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get or create user progress
CREATE OR REPLACE FUNCTION get_or_create_user_progress(user_uuid UUID)
RETURNS user_progress AS $$
DECLARE
    user_progress_record user_progress;
BEGIN
    SELECT * INTO user_progress_record 
    FROM user_progress 
    WHERE user_id = user_uuid;
    
    IF NOT FOUND THEN
        INSERT INTO user_progress (user_id) 
        VALUES (user_uuid)
        RETURNING * INTO user_progress_record;
    END IF;
    
    RETURN user_progress_record;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate level and experience
CREATE OR REPLACE FUNCTION calculate_user_level(exp_points INTEGER)
RETURNS TABLE(level INTEGER, exp_to_next INTEGER) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CASE 
            WHEN exp_points < 100 THEN 1
            WHEN exp_points < 300 THEN 2
            WHEN exp_points < 600 THEN 3
            WHEN exp_points < 1000 THEN 4
            WHEN exp_points < 1500 THEN 5
            WHEN exp_points < 2100 THEN 6
            WHEN exp_points < 2800 THEN 7
            WHEN exp_points < 3600 THEN 8
            WHEN exp_points < 4500 THEN 9
            ELSE 10
        END as level,
        CASE 
            WHEN exp_points < 100 THEN 100 - exp_points
            WHEN exp_points < 300 THEN 300 - exp_points
            WHEN exp_points < 600 THEN 600 - exp_points
            WHEN exp_points < 1000 THEN 1000 - exp_points
            WHEN exp_points < 1500 THEN 1500 - exp_points
            WHEN exp_points < 2100 THEN 2100 - exp_points
            WHEN exp_points < 2800 THEN 2800 - exp_points
            WHEN exp_points < 3600 THEN 3600 - exp_points
            WHEN exp_points < 4500 THEN 4500 - exp_points
            ELSE 0
        END as exp_to_next;
END;
$$ LANGUAGE plpgsql;

-- Function to award badge to user
CREATE OR REPLACE FUNCTION award_badge_to_user(user_uuid UUID, badge_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    INSERT INTO user_badges (user_id, badge_id)
    VALUES (user_uuid, badge_uuid)
    ON CONFLICT (user_id, badge_id) DO NOTHING;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Function to update weekly challenge progress
CREATE OR REPLACE FUNCTION update_weekly_challenge_progress(
    user_uuid UUID,
    challenge_type_val VARCHAR(50),
    increment_value INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    current_week_start DATE;
    challenge_record weekly_challenges;
    new_value INTEGER;
    is_completed_val BOOLEAN;
BEGIN
    -- Get current week start (Monday)
    current_week_start := DATE_TRUNC('week', CURRENT_DATE)::DATE;
    
    -- Get or create weekly challenge
    SELECT * INTO challenge_record
    FROM weekly_challenges
    WHERE user_id = user_uuid 
    AND challenge_type = challenge_type_val
    AND week_start_date = current_week_start;
    
    IF NOT FOUND THEN
        -- Create new weekly challenge
        INSERT INTO weekly_challenges (user_id, week_start_date, challenge_type, goal_value)
        VALUES (user_uuid, current_week_start, challenge_type_val, 10)
        RETURNING * INTO challenge_record;
    END IF;
    
    -- Update progress
    new_value := challenge_record.current_value + increment_value;
    is_completed_val := new_value >= challenge_record.goal_value AND NOT challenge_record.is_completed;
    
    UPDATE weekly_challenges
    SET 
        current_value = new_value,
        is_completed = is_completed_val,
        completed_at = CASE WHEN is_completed_val THEN NOW() ELSE NULL END,
        updated_at = NOW()
    WHERE id = challenge_record.id;
    
    RETURN is_completed_val;
END;
$$ LANGUAGE plpgsql;

-- Insert default badges
INSERT INTO badges (name, description, icon, color, category, requirement_type, requirement_value, rarity) VALUES
-- Achievement Badges
('First Saver', 'Saved your first meal', '🥗', 'green', 'achievement', 'meals_saved', 1, 'common'),
('Eco Warrior', 'Saved 25 meals', '🌱', 'green', 'achievement', 'meals_saved', 25, 'common'),
('Planet Hero', 'Prevented 20kg CO₂', '🌍', 'blue', 'achievement', 'co2_saved', 20, 'rare'),
('Century Club', 'Saved 100 meals', '💯', 'purple', 'achievement', 'meals_saved', 100, 'epic'),
('Streak Master', '7-day saving streak', '🔥', 'orange', 'achievement', 'streak', 7, 'rare'),
('Money Saver', 'Saved KSh 5,000', '💰', 'yellow', 'achievement', 'money_saved', 5000, 'common'),
('Level 5 Champion', 'Reached level 5', '⭐', 'gold', 'achievement', 'level', 5, 'epic'),

-- Weekly Challenge Badges
('Weekly Hero', 'Completed weekly challenge', '🏆', 'gold', 'weekly', 'meals_saved', 10, 'common'),
('Consistent Saver', 'Completed 3 weekly challenges', '📅', 'blue', 'weekly', 'streak', 3, 'rare'),
('Challenge Master', 'Completed 10 weekly challenges', '👑', 'purple', 'weekly', 'streak', 10, 'epic'),

-- Community Badges
('Community Leader', 'Top 10 in community challenge', '👥', 'purple', 'community', 'rank', 10, 'epic'),
('Team Player', 'Participated in 5 community challenges', '🤝', 'blue', 'community', 'participation', 5, 'rare'),

-- Special Badges
('Early Adopter', 'Joined FoodVrse in first month', '🚀', 'gold', 'special', 'join_date', 1, 'legendary'),
('Food Waste Warrior', 'Saved 500 meals', '⚔️', 'red', 'special', 'meals_saved', 500, 'legendary');

-- Insert default achievement milestones
INSERT INTO achievement_milestones (name, description, milestone_type, milestone_value, reward_points, reward_badge_id) VALUES
('First Steps', 'Save your first meal', 'meals_saved', 1, 10, (SELECT id FROM badges WHERE name = 'First Saver')),
('Getting Started', 'Save 10 meals', 'meals_saved', 10, 25, NULL),
('Making Progress', 'Save 50 meals', 'meals_saved', 50, 50, NULL),
('Eco Warrior', 'Save 100 meals', 'meals_saved', 100, 100, (SELECT id FROM badges WHERE name = 'Century Club')),
('Streak Beginner', '3-day saving streak', 'streak', 3, 20, NULL),
('Streak Master', '7-day saving streak', 'streak', 7, 50, (SELECT id FROM badges WHERE name = 'Streak Master')),
('CO₂ Fighter', 'Prevent 10kg CO₂', 'co2_saved', 10, 30, NULL),
('Planet Hero', 'Prevent 50kg CO₂', 'co2_saved', 50, 75, (SELECT id FROM badges WHERE name = 'Planet Hero')),
('Money Saver', 'Save KSh 2,000', 'money_saved', 2000, 25, NULL),
('Big Saver', 'Save KSh 10,000', 'money_saved', 10000, 100, NULL);

-- Create RLS policies
-- User Progress policies
CREATE POLICY "Users can view their own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON user_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Badges policies (public read, authenticated insert)
CREATE POLICY "Anyone can view badges" ON badges FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert badges" ON badges FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- User Badges policies
CREATE POLICY "Users can view their own badges" ON user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own badges" ON user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own badges" ON user_badges FOR UPDATE USING (auth.uid() = user_id);

-- Weekly Challenges policies
CREATE POLICY "Users can view their own challenges" ON weekly_challenges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own challenges" ON weekly_challenges FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own challenges" ON weekly_challenges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Community Challenges policies (public read, authenticated write)
CREATE POLICY "Anyone can view community challenges" ON community_challenges FOR SELECT USING (true);
CREATE POLICY "Authenticated users can update community challenges" ON community_challenges FOR UPDATE USING (auth.role() = 'authenticated');

-- User Community Challenges policies
CREATE POLICY "Users can view their own community participation" ON user_community_challenges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own community participation" ON user_community_challenges FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own community participation" ON user_community_challenges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Leaderboard policies (public read, authenticated write)
CREATE POLICY "Anyone can view leaderboard" ON leaderboard FOR SELECT USING (true);
CREATE POLICY "Authenticated users can update leaderboard" ON leaderboard FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert leaderboard" ON leaderboard FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- User Activity Log policies
CREATE POLICY "Users can view their own activity" ON user_activity_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own activity" ON user_activity_log FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Achievement Milestones policies (public read)
CREATE POLICY "Anyone can view achievement milestones" ON achievement_milestones FOR SELECT USING (true);

-- User Milestones policies
CREATE POLICY "Users can view their own milestones" ON user_milestones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own milestones" ON user_milestones FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own milestones" ON user_milestones FOR INSERT WITH CHECK (auth.uid() = user_id);
