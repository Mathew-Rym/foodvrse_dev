import { useState, useEffect } from "react";
import { Heart, Star, Clock, MapPin, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { MysteryBagDetailPopup } from "./MysteryBagDetailPopup";

interface ListingCardProps {
  listing: {
    id: string;
    item_name: string;
    description?: string;
    quantity: number;
    price: number;
    original_price: number;
    pickup_start: string;
    pickup_end: string;
    status: 'active' | 'low-stock' | 'sold-out';
    favorited_by_user_ids: string[];
    thumbnail_url?: string;
    business_thumbnail_url?: string;
    distance_km?: number;
    business: {
      id: string;
      business_name: string;
      business_logo_url?: string;
      location: string;
      average_rating: number;
    };
  };
  onPurchase?: (listingId: string, quantity: number) => void;
  onFavorite?: (listingId: string, isFavorited: boolean) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ 
  listing, 
  onPurchase = () => {},
  onFavorite = () => {}
}) => {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [showReserveQuick, setShowReserveQuick] = useState(false);
  const [showSoldOut, setShowSoldOut] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDetailPopup, setShowDetailPopup] = useState(false);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user) {
        const { data } = await supabase
          .from('user_favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('business_id', listing.business.id)
          .single();
        
        setIsFavorited(!!data);
      }
    };

    checkFavoriteStatus();
  }, [user, listing.business.id]);

  useEffect(() => {
    // Show "Reserve Quick!" popup for low stock items
    if (listing.status === 'low-stock' && listing.quantity <= 2) {
      setShowReserveQuick(true);
      const timer = setTimeout(() => setShowReserveQuick(false), 5000);
      return () => clearTimeout(timer);
    }
    
    // Show sold out message and handle cleanup
    if (listing.status === 'sold-out') {
      setShowSoldOut(true);
      // In production, this would be handled by backend cleanup
      const timer = setTimeout(() => setShowSoldOut(false), 60000); // 1 minute for demo
      return () => clearTimeout(timer);
    }
  }, [listing.status, listing.quantity]);

  const formatPickupTime = (start: string, end: string) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const today = new Date();
    
    const isToday = startTime.toDateString() === today.toDateString();
    const isTomorrow = startTime.toDateString() === new Date(today.getTime() + 24 * 60 * 60 * 1000).toDateString();
    
    const formatTime = (date: Date) => 
      date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    if (isToday) {
      return `Collect today: ${formatTime(startTime)} - ${formatTime(endTime)}`;
    } else if (isTomorrow) {
      return `Collect tomorrow: ${formatTime(startTime)} - ${formatTime(endTime)}`;
    } else {
      return `Collect ${startTime.toLocaleDateString()}: ${formatTime(startTime)} - ${formatTime(endTime)}`;
    }
  };

  const calculateDistance = () => {
    if (listing.distance_km) {
      return `${listing.distance_km.toFixed(1)} km`;
    }
    // Fallback for listings without distance data
    return `${(Math.random() * 5 + 0.5).toFixed(1)} km`;
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      toast.error("Please sign in to add favorites");
      return;
    }

    try {
      if (isFavorited) {
        // Remove from user_favorites table
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('business_id', listing.business.id);

        if (error) throw error;
      } else {
        // Add to user_favorites table
        const { error } = await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            business_id: listing.business.id
          });

        if (error) throw error;
      }

      setIsFavorited(!isFavorited);
      onFavorite(listing.id, !isFavorited);
      toast.success(isFavorited ? "Removed from favorites" : "Added to favorites");
    } catch (error) {
      console.error('Error updating favorite:', error);
      toast.error("Failed to update favorite");
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      toast.error("Please sign in to make a purchase");
      return;
    }

    if (listing.status === 'sold-out') {
      toast.error("This item is sold out");
      return;
    }

    setIsProcessing(true);

    try {
      const { data, error } = await supabase.rpc('process_purchase', {
        p_listing_id: listing.id,
        p_user_id: user.id,
        p_quantity: 1
      });

      if (error) throw error;

      const result = typeof data === 'string' ? JSON.parse(data) : data;

      if (result.success) {
        onPurchase(listing.id, 1);
        toast.success(`Reserved ${listing.item_name} for KSh ${listing.price}`);
      } else {
        toast.error(result.error || "Failed to process purchase");
      }
    } catch (error) {
      console.error('Error processing purchase:', error);
      toast.error("Failed to process purchase");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRatingSubmit = async () => {
    if (!user || userRating === 0) return;

    try {
      const { error } = await supabase
        .from('ratings')
        .upsert({
          business_id: listing.business.id,
          user_id: user.id,
          rating: userRating
        });

      if (error) throw error;

      toast.success("Rating submitted successfully");
      setShowRatingModal(false);
      setUserRating(0);
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error("Failed to submit rating");
    }
  };

  if (showSoldOut && listing.status === 'sold-out') {
    return (
      <div className="bg-gray-100 rounded-2xl shadow-sm p-4 opacity-75 relative">
        <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 text-center max-w-xs">
            <h3 className="font-semibold text-gray-900 mb-2">Sold Out!</h3>
            <p className="text-sm text-gray-600 mb-3">
              Want to explore and try it next time? Favorite it to get notified first!
            </p>
            <Button 
              size="sm" 
              onClick={handleFavoriteToggle}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white"
            >
              <Heart className="w-4 h-4 mr-1" />
              Add to Favorites
            </Button>
          </div>
        </div>
        
        {/* Grayed out card content */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                {listing.business.business_logo_url ? (
                  <img 
                    src={listing.business.business_logo_url} 
                    alt={listing.business.business_name}
                    className="w-8 h-8 rounded"
                  />
                ) : (
                  <span className="text-lg">🏪</span>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-500">{listing.business.business_name}</h3>
                <p className="text-sm text-gray-400">{listing.business.location}</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-red-100 text-red-600">
              Sold Out
            </Badge>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-500">{listing.item_name}</h4>
            <p className="text-sm text-gray-400">{formatPickupTime(listing.pickup_start, listing.pickup_end)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden relative">
      {/* Item thumbnail image */}
      <div className="relative h-48 bg-gray-100">
        {listing.thumbnail_url || listing.business_thumbnail_url ? (
          <img 
            src={listing.thumbnail_url || listing.business_thumbnail_url} 
            alt={listing.item_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-4xl">🍽️</span>
          </div>
        )}
        
        {/* Status badge and favorite button overlay */}
        <div className="absolute top-3 left-3">
          <Badge 
            className={`text-white font-medium ${
              listing.quantity > 2 ? 'bg-green-500' : 'bg-orange-500'
            }`}
          >
            {listing.quantity} left
          </Badge>
        </div>

        <div className="absolute top-3 right-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleFavoriteToggle();
            }}
            className={`p-2 rounded-full ${
              isFavorited
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-white/90 text-gray-700 hover:bg-white"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Content area */}
      <div className="p-4" onClick={() => setShowDetailPopup(true)} style={{ cursor: 'pointer' }}>
        {/* Business header with logo */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
              {listing.business.business_logo_url ? (
                <img 
                  src={listing.business.business_logo_url} 
                  alt={listing.business.business_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg">🏪</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 truncate">{listing.business.business_name}</h3>
              <p className="text-sm text-gray-600 truncate">{listing.business.location}</p>
            </div>
          </div>
        </div>

        {/* Item details */}
        <div className="mb-3">
          <h4 className="font-medium text-gray-900 mb-1">{listing.item_name}</h4>
          <p className="text-sm text-gray-600">{formatPickupTime(listing.pickup_start, listing.pickup_end)}</p>
        </div>

        {/* Metrics row */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <button
            onClick={() => setShowRatingModal(true)}
            className="flex items-center gap-1 hover:text-orange-500 transition-colors"
          >
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span>{(listing.business.average_rating || 0).toFixed(1)}</span>
          </button>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{calculateDistance()}</span>
          </div>
        </div>

        {/* Price and reserve button */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">KSh {listing.price}</div>
            {listing.original_price > listing.price && (
              <div className="text-sm text-gray-500 line-through">
                KSh {listing.original_price}
              </div>
            )}
          </div>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setShowDetailPopup(true);
            }}
            disabled={listing.status === 'sold-out'}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 disabled:opacity-50 px-6 py-2"
          >
            Reserve
          </Button>
        </div>
      </div>

      {/* Reserve Quick popup */}
      {showReserveQuick && listing.status === 'low-stock' && (
        <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center z-20">
          <div className="bg-white rounded-lg p-4 mx-4 text-center animate-pulse">
            <AlertCircle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Reserve Quick!</h3>
            <p className="text-sm text-gray-600 mb-3">Only {listing.quantity} left!</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowReserveQuick(false)}
              >
                Maybe Later
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setShowReserveQuick(false);
                  handlePurchase();
                }}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white"
              >
                Reserve Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      <Dialog open={showRatingModal} onOpenChange={setShowRatingModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rate {listing.business.business_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setUserRating(star)}
                  className={`p-2 ${
                    star <= userRating ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowRatingModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRatingSubmit}
                disabled={userRating === 0}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white"
              >
                Submit Rating
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Popup */}
      {showDetailPopup && (
        <MysteryBagDetailPopup
          isOpen={showDetailPopup}
          onClose={() => setShowDetailPopup(false)}
          bag={{
            id: parseInt(listing.id),
            vendor: listing.business.business_name,
            title: listing.item_name,
            price: listing.price,
            originalPrice: listing.original_price,
            pickup: formatPickupTime(listing.pickup_start, listing.pickup_end),
            items: listing.description || "Mystery selection of items",
            location: listing.business.location,
            address: listing.business.location,
            itemsLeft: listing.quantity,
            rating: listing.business.average_rating || 4.6,
            reviewCount: 171,
            category: "Meals",
            description: listing.description || "Rescue a selection of goodies from your favourite food retailer! You can expect to receive a mixture of items that would otherwise go to waste.",
            gradient: "from-orange-400 to-red-500"
          }}
        />
      )}
    </div>
  );
};

export default ListingCard;