import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FavoritesContextType {
  favorites: string[];
  loading: boolean;
  addFavorite: (businessId: string) => Promise<void>;
  removeFavorite: (businessId: string) => Promise<void>;
  isFavorited: (businessId: string) => boolean;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Load user favorites
  const loadFavorites = async () => {
    if (!user) {
      setFavorites([]);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_favorites')
        .select('business_id')
        .eq('user_id', user.id);

      if (error) throw error;

      setFavorites(data?.map(fav => fav.business_id) || []);
    } catch (error) {
      console.error('Error loading favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  // Load favorites when user changes
  useEffect(() => {
    loadFavorites();
  }, [user]);

  // Add favorite
  const addFavorite = async (businessId: string) => {
    if (!user) {
      toast.error('Please sign in to save favorites');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: user.id,
          business_id: businessId
        });

      if (error) throw error;

      setFavorites(prev => [...prev, businessId]);
      toast.success('Added to favorites');
    } catch (error) {
      console.error('Error adding favorite:', error);
      toast.error('Failed to add to favorites');
    }
  };

  // Remove favorite
  const removeFavorite = async (businessId: string) => {
    if (!user) {
      toast.error('Please sign in to manage favorites');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('business_id', businessId);

      if (error) throw error;

      setFavorites(prev => prev.filter(id => id !== businessId));
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove from favorites');
    }
  };

  // Check if business is favorited
  const isFavorited = (businessId: string): boolean => {
    return favorites.includes(businessId);
  };

  // Refresh favorites
  const refreshFavorites = async () => {
    await loadFavorites();
  };

  const value: FavoritesContextType = {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorited,
    refreshFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
