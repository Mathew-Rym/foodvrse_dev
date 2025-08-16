-- Comprehensive Gamification System for FoodVrse
-- This migration creates all necessary tables for tracking user progress, achievements, and community features

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. User Progress Tracking Table
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    total_meals_saved INTEGER DEFAULT 0,
    total_co2_saved DECIMAL(10,2) DEFAULT 0.0,
    total_money_saved DECIMAL(10,2) DEFAULT 0.0,
    total_water_saved DECIMAL(10,2) DEFAULT 0.0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    experience_points INTEGER DEFAULT 0,
    experience_to_next_level INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 2. Badges Table
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    color VARCHAR(20) NOT NULL,
    category VARCHAR(50) NOT NULL,
    requirement_type VARCHAR(50) NOT NULL,
    requirement_value INTEGER NOT NULL,
    rarity VARCHAR(20) DEFAULT 'common',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. User Badges Table
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_featured BOOLEAN DEFAULT false,
    UNIQUE(user_id, badge_id)
);

-- 4. Weekly Challenges Table
CREATE TABLE IF NOT EXISTS weekly_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    week_start_date DATE NOT NULL,
    challenge_type VARCHAR(50) NOT NULL,
    goal_value INTEGER NOT NULL,
    current_value INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    badge_awarded_id UUID REFERENCES badges(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, week_start_date, challenge_type)
);

-- 5. Community Challenges Table
CREATE TABLE IF NOT EXISTS community_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    challenge_type VARCHAR(50) NOT NULL,
    goal_value INTEGER NOT NULL,
    current_value INTEGER DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    reward_badge_id UUID REFERENCES badges(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. User Community Challenge Participation
CREATE TABLE IF NOT EXISTS user_community_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    community_challenge_id UUID REFERENCES community_challenges(id) ON DELETE CASCADE,
    contribution_value INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, community_challenge_id)
);

-- 7. Leaderboard Table
CREATE TABLE IF NOT EXISTS leaderboard (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    period_type VARCHAR(20) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE,
    meals_saved INTEGER DEFAULT 0,
    co2_saved DECIMAL(10,2) DEFAULT 0.0,
    money_saved DECIMAL(10,2) DEFAULT 0.0,
    rank INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, period_type, period_start)
);

-- 8. User Activity Log
CREATE TABLE IF NOT EXISTS user_activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL,
    activity_data JSONB,
    points_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Achievement Milestones
CREATE TABLE IF NOT EXISTS achievement_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    milestone_type VARCHAR(50) NOT NULL,
    milestone_value INTEGER NOT NULL,
    reward_points INTEGER DEFAULT 0,
    reward_badge_id UUID REFERENCES badges(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. User Milestones Progress
CREATE TABLE IF NOT EXISTS user_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES achievement_milestones(id) ON DELETE CASCADE,
    current_value INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, milestone_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_challenges_user_id ON weekly_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_user_id ON leaderboard(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_id ON user_activity_log(user_id);

-- Enable RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_community_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievement_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_milestones ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
