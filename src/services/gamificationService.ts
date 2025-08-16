import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

export interface OrderData {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export class GamificationService {
  // Calculate impact metrics for a meal order
  static calculateMealImpact(orderAmount: number) {
    return {
      co2Saved: 2.5, // kg CO2 saved per meal
      waterSaved: 1000, // liters of water saved per meal
      moneySaved: orderAmount * 0.7, // 70% of original price saved
      experiencePoints: 10 // XP per meal
    };
  }

  // Update user progress when an order is completed
  static async updateProgressFromOrder(orderData: OrderData) {
    try {
      const { user_id, total_amount } = orderData;
      const impact = this.calculateMealImpact(total_amount);

      // Get current user progress
      const { data: currentProgress, error: fetchError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user_id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      const newProgress = currentProgress ? {
        total_meals_saved: currentProgress.total_meals_saved + 1,
        total_co2_saved: currentProgress.total_co2_saved + impact.co2Saved,
        total_money_saved: currentProgress.total_money_saved + impact.moneySaved,
        total_water_saved: currentProgress.total_water_saved + impact.waterSaved,
        experience_points: currentProgress.experience_points + impact.experiencePoints,
        current_streak: currentProgress.current_streak + 1,
        longest_streak: Math.max(currentProgress.longest_streak, currentProgress.current_streak + 1)
      } : {
        user_id,
        total_meals_saved: 1,
        total_co2_saved: impact.co2Saved,
        total_money_saved: impact.moneySaved,
        total_water_saved: impact.waterSaved,
        experience_points: impact.experiencePoints,
        current_streak: 1,
        longest_streak: 1,
        level: 1,
        experience_to_next_level: 100
      };

      // Update or create user progress
      const { data: updatedProgress, error: updateError } = await supabase
        .from('user_progress')
        .upsert([newProgress])
        .select()
        .single();

      if (updateError) throw updateError;

      // Update weekly challenge
      await this.updateWeeklyChallenge(user_id, 'meals_saved', 1);

      // Check for achievements
      await this.checkAndAwardBadges(user_id, updatedProgress);

      // Record activity
      await this.recordActivity(user_id, 'meal_saved', {
        order_id: orderData.id,
        impact
      }, impact.experiencePoints);

      // Show success notification
      toast.success('🥗 Meal saved successfully!', {
        description: `+${impact.experiencePoints} XP | +${impact.co2Saved}kg CO₂ saved | +KSh ${impact.moneySaved.toFixed(0)} saved`,
        duration: 4000,
      });

      return updatedProgress;
    } catch (error) {
      console.error('Error updating progress from order:', error);
      throw error;
    }
  }

  // Update weekly challenge progress
  static async updateWeeklyChallenge(userId: string, challengeType: string, incrementValue: number) {
    try {
      const currentWeekStart = new Date();
      currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay() + 1);
      currentWeekStart.setHours(0, 0, 0, 0);

      // Get or create weekly challenge
      let { data: challenge, error: fetchError } = await supabase
        .from('weekly_challenges')
        .select('*')
        .eq('user_id', userId)
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
            user_id: userId,
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

      // Show completion notification
      if (isCompleted) {
        toast.success('🎉 Weekly Challenge Completed!', {
          description: `You've reached your goal of ${challenge.goal_value} ${challengeType}!`,
          duration: 5000,
        });
      }

      return updatedChallenge;
    } catch (error) {
      console.error('Error updating weekly challenge:', error);
      throw error;
    }
  }

  // Check and award badges based on user progress
  static async checkAndAwardBadges(userId: string, userProgress: any) {
    try {
      const { data: badges, error: badgesError } = await supabase
        .from('badges')
        .select('*')
        .eq('is_active', true);

      if (badgesError) throw badgesError;

      for (const badge of badges) {
        let shouldAward = false;

        switch (badge.requirement_type) {
          case 'meals_saved':
            shouldAward = userProgress.total_meals_saved >= badge.requirement_value;
            break;
          case 'co2_saved':
            shouldAward = userProgress.total_co2_saved >= badge.requirement_value;
            break;
          case 'money_saved':
            shouldAward = userProgress.total_money_saved >= badge.requirement_value;
            break;
          case 'streak':
            shouldAward = userProgress.current_streak >= badge.requirement_value;
            break;
          case 'level':
            const level = this.calculateLevel(userProgress.experience_points);
            shouldAward = level >= badge.requirement_value;
            break;
        }

        if (shouldAward) {
          await this.awardBadge(userId, badge.id);
        }
      }
    } catch (error) {
      console.error('Error checking badges:', error);
    }
  }

  // Award badge to user
  static async awardBadge(userId: string, badgeId: string) {
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .insert([{ user_id: userId, badge_id: badgeId }])
        .select(`
          *,
          badge:badges(*)
        `)
        .single();

      if (error && error.code !== '23505') { // Ignore duplicate key error
        throw error;
      }

      if (data) {
        toast.success(`🏆 Badge earned: ${data.badge.name}!`, {
          description: data.badge.description,
          duration: 5000,
        });
      }

      return data;
    } catch (error) {
      console.error('Error awarding badge:', error);
      throw error;
    }
  }

  // Record user activity
  static async recordActivity(userId: string, activityType: string, activityData: any = {}, pointsEarned: number = 0) {
    try {
      const { error } = await supabase
        .from('user_activity_log')
        .insert([{
          user_id: userId,
          activity_type: activityType,
          activity_data: activityData,
          points_earned: pointsEarned
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error recording activity:', error);
    }
  }

  // Calculate user level from experience points
  static calculateLevel(expPoints: number) {
    if (expPoints < 100) return 1;
    if (expPoints < 300) return 2;
    if (expPoints < 600) return 3;
    if (expPoints < 1000) return 4;
    if (expPoints < 1500) return 5;
    if (expPoints < 2100) return 6;
    if (expPoints < 2800) return 7;
    if (expPoints < 3600) return 8;
    if (expPoints < 4500) return 9;
    return 10;
  }

  // Get leaderboard data
  static async getLeaderboard(periodType: 'weekly' | 'monthly' | 'all_time' = 'weekly') {
    try {
      const periodStart = new Date();
      if (periodType === 'weekly') {
        periodStart.setDate(periodStart.getDate() - periodStart.getDay() + 1);
      } else if (periodType === 'monthly') {
        periodStart.setDate(1);
      }
      periodStart.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('leaderboard')
        .select(`
          *,
          user_profile:profiles(full_name, avatar_url)
        `)
        .eq('period_type', periodType)
        .eq('period_start', periodStart.toISOString().split('T')[0])
        .order('meals_saved', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  }
}
