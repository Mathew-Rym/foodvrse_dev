import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

export interface UserProgress {
  id: string;
  user_id: string;
  total_meals_saved: number;
  total_co2_saved: number;
  total_money_saved: number;
  total_water_saved: number;
  current_streak: number;
  longest_streak: number;
  level: number;
  experience_points: number;
  experience_to_next_level: number;
  created_at: string;
  updated_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  requirement_type: string;
  requirement_value: number;
  rarity: string;
  is_active: boolean;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  is_featured: boolean;
  badge: Badge;
}

export interface WeeklyChallenge {
  id: string;
  user_id: string;
  week_start_date: string;
  challenge_type: string;
  goal_value: number;
  current_value: number;
  is_completed: boolean;
  completed_at: string | null;
  badge_awarded_id: string | null;
  created_at: string;
  updated_at: string;
}

export const useGamification = () => {
  const { user, isAuthenticated } = useAuth();
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [weeklyChallenges, setWeeklyChallenges] = useState<WeeklyChallenge[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user progress
  const fetchUserProgress = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (progressError && progressError.code !== 'PGRST116') {
        throw progressError;
      }

      if (!data) {
        // Create new user progress
        const { data: newProgress, error: createError } = await supabase
          .from('user_progress')
          .insert([{ user_id: user.id }])
          .select()
          .single();

        if (createError) throw createError;
        setUserProgress(newProgress);
      } else {
        setUserProgress(data);
      }
    } catch (err) {
      console.error('Error fetching user progress:', err);
      setError('Failed to load user progress');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Fetch user badges
  const fetchUserBadges = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error: badgesError } = await supabase
        .from('user_badges')
        .select(`
          *,
          badge:badges(*)
        `)
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (badgesError) throw badgesError;
      setUserBadges(data || []);
    } catch (err) {
      console.error('Error fetching user badges:', err);
    }
  }, [user]);

  // Fetch weekly challenges
  const fetchWeeklyChallenges = useCallback(async () => {
    if (!user) return;

    try {
      const currentWeekStart = new Date();
      currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay() + 1);
      currentWeekStart.setHours(0, 0, 0, 0);

      const { data, error: challengesError } = await supabase
        .from('weekly_challenges')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_start_date', currentWeekStart.toISOString().split('T')[0]);

      if (challengesError) throw challengesError;
      setWeeklyChallenges(data || []);
    } catch (err) {
      console.error('Error fetching weekly challenges:', err);
    }
  }, [user]);

  // Update user progress
  const updateUserProgress = useCallback(async (updates: Partial<UserProgress>) => {
    if (!user || !userProgress) return;

    try {
      const { data, error: updateError } = await supabase
        .from('user_progress')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;
      setUserProgress(data);
      return data;
    } catch (err) {
      console.error('Error updating user progress:', err);
      throw err;
    }
  }, [user, userProgress]);

  // Award badge to user
  const awardBadge = useCallback(async (badgeId: string) => {
    if (!user) return;

    try {
      const { data, error: badgeError } = await supabase
        .from('user_badges')
        .insert([{ user_id: user.id, badge_id: badgeId }])
        .select(`
          *,
          badge:badges(*)
        `)
        .single();

      if (badgeError && badgeError.code !== '23505') {
        throw badgeError;
      }

      if (data) {
        setUserBadges(prev => [data, ...prev]);
        toast.success(`🏆 Badge earned: ${data.badge.name}!`, {
          description: data.badge.description,
          duration: 5000,
        });
      }

      return data;
    } catch (err) {
      console.error('Error awarding badge:', err);
      throw err;
    }
  }, [user]);

  // Update weekly challenge progress
  const updateWeeklyChallenge = useCallback(async (
    challengeType: string,
    incrementValue: number
  ) => {
    if (!user) return;

    try {
      const currentWeekStart = new Date();
      currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay() + 1);
      currentWeekStart.setHours(0, 0, 0, 0);

      // Get or create weekly challenge
      let { data: challenge, error: fetchError } = await supabase
        .from('weekly_challenges')
        .select('*')
        .eq('user_id', user.id)
        .eq('challenge_type', challengeType)
        .eq('week_start_date', currentWeekStart.toISOString().split('T')[0])
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (!challenge) {
        // Create new challenge
        const { data: newChallenge, error: createError } = await supabase
          .from('weekly_challenges')
          .insert([{
            user_id: user.id,
            week_start_date: currentWeekStart.toISOString().split('T')[0],
            challenge_type: challengeType,
            goal_value: 10
          }])
          .select()
          .single();

        if (createError) throw createError;
        challenge = newChallenge;
      }

      // Update challenge progress
      const newValue = challenge.current_value + incrementValue;
      const isCompleted = newValue >= challenge.goal_value && !challenge.is_completed;

      const { data: updatedChallenge, error: updateError } = await supabase
        .from('weekly_challenges')
        .update({
          current_value: newValue,
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', challenge.id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Update local state
      setWeeklyChallenges(prev => 
        prev.map(c => c.id === updatedChallenge.id ? updatedChallenge : c)
      );

      // Show completion notification
      if (isCompleted) {
        toast.success('🎉 Weekly Challenge Completed!', {
          description: `You've reached your goal of ${challenge.goal_value} ${challengeType}!`,
          duration: 5000,
        });
      }

      return updatedChallenge;
    } catch (err) {
      console.error('Error updating weekly challenge:', err);
      throw err;
    }
  }, [user]);

  // Initialize gamification data
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserProgress();
      fetchUserBadges();
      fetchWeeklyChallenges();
    }
  }, [isAuthenticated, user, fetchUserProgress, fetchUserBadges, fetchWeeklyChallenges]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('gamification-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_progress',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            setUserProgress(payload.new as UserProgress);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_badges',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          fetchUserBadges();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'weekly_challenges',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          fetchWeeklyChallenges();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchUserBadges, fetchWeeklyChallenges]);

  return {
    userProgress,
    userBadges,
    weeklyChallenges,
    isLoading,
    error,
    fetchUserProgress,
    fetchUserBadges,
    fetchWeeklyChallenges,
    updateUserProgress,
    awardBadge,
    updateWeeklyChallenge,
  };
};
