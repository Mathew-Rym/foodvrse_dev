import { Heart, MapPin, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MobileLayout from "@/components/MobileLayout";
import { useState, useEffect } from "react";
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ListingCard from "@/components/ListingCard";

const Favorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favoriteListings, setFavoriteListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFavoriteListings();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchFavoriteListings = async () => {
    if (!user) return;

    try {
      // Get all listings that the user has favorited
      const { data, error } = await supabase
        .from('listings')
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
        .contains('favorited_by_user_ids', [user.id])
        .neq('status', 'sold-out')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setFavoriteListings(data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = (listingId: string, isFavorited: boolean) => {
    // Update local state immediately for better UX
    if (!isFavorited) {
      setFavoriteListings(prev => prev.filter(listing => listing.id !== listingId));
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

        {loading ? (
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