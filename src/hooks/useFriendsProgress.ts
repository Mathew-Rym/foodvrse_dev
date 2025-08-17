import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PurchaseImpactService, FriendProgress } from '@/services/purchaseImpactService';
import { supabase } from '@/integrations/supabase/client';

export const useFriendsProgress = () => {
  const { user } = useAuth();
  const [friendsProgress, setFriendsProgress] = useState<FriendProgress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFriendsProgress = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const friends = await PurchaseImpactService.getFriendsProgress(user.id);
      setFriendsProgress(friends);
    } catch (err) {
      console.error('Error fetching friends progress:', err);
      setError('Failed to load friends progress');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Set up real-time subscriptions for friends' updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('friends-progress-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_progress'
        },
        (payload) => {
          // Check if the updated user is a friend
          const isFriend = friendsProgress.some(friend => friend.user_id === payload.new.user_id);
          if (isFriend) {
            console.log('Friend progress updated:', payload);
            fetchFriendsProgress(); // Refresh friends data
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, friendsProgress, fetchFriendsProgress]);

  // Initial fetch
  useEffect(() => {
    fetchFriendsProgress();
  }, [fetchFriendsProgress]);

  return {
    friendsProgress,
    isLoading,
    error,
    refreshFriendsProgress: fetchFriendsProgress,
  };
};
