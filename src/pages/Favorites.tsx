import { Heart, MapPin, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MobileLayout from "@/components/MobileLayout";
import { useState, useEffect } from "react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ListingCard from "@/components/ListingCard";

const Favorites = () => {
  const { user } = useAuth();
  const { favorites: userFavorites, loading: favoritesLoading, addFavorite, removeFavorite } = useFavorites();
  const navigate = useNavigate();
  const [favoriteListings, setFavoriteListings] = useState<any[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);

  // Authentication check - redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  // Don't render anything if user is not authenticated
  if (!user) {
    return null;
  }

  useEffect(() => {
    if (user && !favoritesLoading) {
      fetchFavoriteListings();
    } else if (!user) {
      setListingsLoading(false);
    }
  }, [user, userFavorites, favoritesLoading]);

  const fetchFavoriteListings = async () => {
    if (!user || userFavorites.length === 0) {
      setFavoriteListings([]);
      setListingsLoading(false);
      return;
    }

    try {
      setListingsLoading(true);
      
      // Get listings for the favorited businesses from context
      const { data: listingsData, error: listingsError } = await supabase
        .from('mystery_bags')
        .select(`
          *,
          business:business_profiles(
            id,
            business_name,
            business_logo_url,
            location,
            average_rating,
            rating_count
          )
        `)
        .in('business_id', userFavorites)
        .neq('status', 'sold-out')
        .order('created_at', { ascending: false });

      if (listingsError) throw listingsError;

      setFavoriteListings(listingsData || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setListingsLoading(false);
    }
  };

  const handleFavorite = async (listingId: string, isFavorited: boolean) => {
    if (!user) {
      toast.error('Please sign in to manage favorites');
      return;
    }

    try {
      if (isFavorited) {
        await removeFavorite(listingId);
        // Update local state
        setFavoriteListings(prev => prev.filter(listing => listing.business_id !== listingId));
      } else {
        await addFavorite(listingId);
        // Refresh the list to show the new favorite
        await fetchFavoriteListings();
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
      toast.error('Failed to update favorite');
    }
  };

  const handlePurchase = (listingId: string, quantity: number) => {
    // Update local state immediately for better UX
    setFavoriteListings(prev => prev.map(listing => 
      listing.id === listingId 
        ? { ...listing, quantity: listing.quantity - quantity }
        : listing
    ));
  };

  return (
    <MobileLayout>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="bg-card border-b border-border px-4 py-6">
          <h1 className="text-2xl font-bold text-foreground">My Favorites</h1>
          <p className="text-muted-foreground mt-1">Your saved restaurants and stores</p>
        </div>

        {favoritesLoading || listingsLoading ? (
          <div className="p-4">
            <div className="grid grid-cols-1 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-muted rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          </div>
        ) : favoriteListings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <Heart className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No favorites yet</h3>
            <p className="text-muted-foreground text-center mb-6">
              Start adding your favorite restaurants and stores to see them here
            </p>
            <Button 
              onClick={() => navigate('/discover')}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white"
            >
              Discover Places
            </Button>
          </div>
        ) : (
          <div className="p-4">
            <div className="grid grid-cols-1 gap-6">
              {favoriteListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onPurchase={handlePurchase}
                  onFavorite={handleFavorite}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default Favorites;
