import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PurchaseData {
  id: string;
  user_id: string;
  total_amount: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    original_price: number;
  }>;
  created_at: string;
}

export interface FriendProgress {
  user_id: string;
  display_name: string;
  avatar_url: string;
  total_meals_saved: number;
  total_co2_saved: number;
  total_money_saved: number;
  current_streak: number;
  level: number;
  rank: number;
}

export class PurchaseImpactService {
  // Calculate impact metrics for a purchase
  static calculatePurchaseImpact(purchaseData: PurchaseData) {
    const totalOriginalPrice = purchaseData.items.reduce((sum, item) => 
      sum + (item.original_price * item.quantity), 0
    );
    const totalSavedPrice = totalOriginalPrice - purchaseData.total_amount;
    
    return {
      mealsSaved: purchaseData.items.reduce((sum, item) => sum + item.quantity, 0),
      co2Saved: purchaseData.items.reduce((sum, item) => sum + (item.quantity * 2.5), 0),
      moneySaved: totalSavedPrice,
      experiencePoints: purchaseData.items.reduce((sum, item) => sum + (item.quantity * 10), 0),
      waterSaved: purchaseData.items.reduce((sum, item) => sum + (item.quantity * 1000), 0)
    };
  }

  // Update user impact when a purchase is completed
  static async updateImpactFromPurchase(purchaseData: PurchaseData) {
    try {
      const impact = this.calculatePurchaseImpact(purchaseData);
      
      // Get current user progress
      const { data: currentProgress, error: fetchError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', purchaseData.user_id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      const newProgress = currentProgress ? {
        total_meals_saved: currentProgress.total_meals_saved + impact.mealsSaved,
        total_co2_saved: currentProgress.total_co2_saved + impact.co2Saved,
        total_money_saved: currentProgress.total_money_saved + impact.moneySaved,
        total_water_saved: currentProgress.total_water_saved + impact.waterSaved,
        experience_points: currentProgress.experience_points + impact.experiencePoints,
        current_streak: currentProgress.current_streak + 1,
        longest_streak: Math.max(currentProgress.longest_streak, currentProgress.current_streak + 1),
        updated_at: new Date().toISOString()
      } : {
        user_id: purchaseData.user_id,
        total_meals_saved: impact.mealsSaved,
        total_co2_saved: impact.co2Saved,
        total_money_saved: impact.moneySaved,
        total_water_saved: impact.waterSaved,
        experience_points: impact.experiencePoints,
        current_streak: 1,
        longest_streak: 1,
        level: 1,
        experience_to_next_level: 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Update or create user progress
      const { data: updatedProgress, error: updateError } = await supabase
        .from('user_progress')
        .upsert([newProgress])
        .select()
        .single();

      if (updateError) throw updateError;

      // Show success notification
      toast.success('�� Purchase completed!', {
        description: `+${impact.experiencePoints} XP | +${impact.co2Saved.toFixed(1)}kg CO₂ saved | +KSh ${impact.moneySaved.toFixed(0)} saved`,
        duration: 4000,
      });

      return updatedProgress;
    } catch (error) {
      console.error('Error updating impact from purchase:', error);
      throw error;
    }
  }

  // Get friends progress (users who were invited by current user)
  static async getFriendsProgress(userId: string): Promise<FriendProgress[]> {
    try {
      // For now, return mock data. In production, this would query the database
      // for users invited by the current user
      return [
        {
          user_id: 'friend1',
          display_name: 'Sarah K.',
          avatar_url: '',
          total_meals_saved: 63,
          total_co2_saved: 157.5,
          total_money_saved: 31500,
          current_streak: 7,
          level: 5,
          rank: 1
        },
        {
          user_id: 'friend2',
          display_name: 'John M.',
          avatar_url: '',
          total_meals_saved: 52,
          total_co2_saved: 130,
          total_money_saved: 26000,
          current_streak: 5,
          level: 4,
          rank: 2
        }
      ];
    } catch (error) {
      console.error('Error fetching friends progress:', error);
      return [];
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
}
