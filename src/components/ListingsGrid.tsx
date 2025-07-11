import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ListingCard from "./ListingCard";
import { toast } from "sonner";

interface ListingsGridProps {
  categoryFilter?: string;
  searchQuery?: string;
  pickupTimeFilter?: 'now' | 'tomorrow' | 'any';
  showSoldOut?: boolean;
  limit?: number;
  distanceFilter?: number;
  userLocation?: { lat: number; lng: number };
}

export const ListingsGrid: React.FC<ListingsGridProps> = ({
  categoryFilter = 'all',
  searchQuery = '',
  pickupTimeFilter = 'any',
  showSoldOut = false,
  limit,
  distanceFilter,
  userLocation
}) => {
  const { user } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('listings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'listings'
        },
        (payload) => {
          console.log('Listing updated:', payload);
          fetchListings(); // Refetch to get updated data with joins
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'business_profiles'
        },
        (payload) => {
          console.log('Business updated:', payload);
          fetchListings(); // Refetch for rating updates
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [categoryFilter, searchQuery, pickupTimeFilter, showSoldOut, distanceFilter, userLocation]);

  const fetchListings = async () => {
    try {
      // Use the new distance-based function if location and distance filter are provided
      if (userLocation && distanceFilter) {
        const { data, error } = await supabase.rpc('get_listings_with_distance', {
          user_lat: userLocation.lat,
          user_lon: userLocation.lng,
          max_distance: distanceFilter,
          category_filter: categoryFilter === 'all' ? null : categoryFilter,
          search_query: searchQuery || null
        });

        if (error) throw error;

        let filteredData = data || [];

        // Apply pickup time filter
        if (pickupTimeFilter !== 'any') {
          filteredData = filteredData.filter((listing: any) => {
            const pickupStart = new Date(listing.pickup_start);
            if (pickupTimeFilter === 'now') {
              const now = new Date();
              const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000);
              return pickupStart <= threeHoursLater && new Date(listing.pickup_end) >= now;
            } else if (pickupTimeFilter === 'tomorrow') {
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              tomorrow.setHours(0, 0, 0, 0);
              const endOfTomorrow = new Date(tomorrow);
              endOfTomorrow.setHours(23, 59, 59, 999);
              return pickupStart >= tomorrow && pickupStart <= endOfTomorrow;
            }
            return true;
          });
        }

        // Filter sold out items
        if (!showSoldOut) {
          filteredData = filteredData.filter((listing: any) => listing.status !== 'sold-out');
        }

        // Apply limit
        if (limit) {
          filteredData = filteredData.slice(0, limit);
        }

        // Transform data to match expected format
        const transformedData = filteredData.map((item: any) => ({
          ...item,
          business: {
            id: item.business_id,
            business_name: item.business_name,
            business_logo_url: item.business_logo_url,
            location: item.location,
            average_rating: item.average_rating,
            rating_count: item.rating_count
          }
        }));

        setListings(transformedData);
      } else {
        // Fallback to original query for listings without distance filtering
        let query = supabase
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
          .order('created_at', { ascending: false });

        // Apply category filter
        if (categoryFilter && categoryFilter !== 'all') {
          query = query.eq('category', categoryFilter);
        }

        // Apply search filter
        if (searchQuery) {
          query = query.or(`item_name.ilike.%${searchQuery}%,business_profiles.business_name.ilike.%${searchQuery}%`);
        }

        // Apply pickup time filter
        if (pickupTimeFilter === 'now') {
          const now = new Date();
          const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000);
          query = query
            .lte('pickup_start', threeHoursLater.toISOString())
            .gte('pickup_end', now.toISOString());
        } else if (pickupTimeFilter === 'tomorrow') {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(0, 0, 0, 0);
          const endOfTomorrow = new Date(tomorrow);
          endOfTomorrow.setHours(23, 59, 59, 999);
          
          query = query
            .gte('pickup_start', tomorrow.toISOString())
            .lte('pickup_start', endOfTomorrow.toISOString());
        }

        // Filter sold out items
        if (!showSoldOut) {
          query = query.neq('status', 'sold-out');
        }

        // Apply limit
        if (limit) {
          query = query.limit(limit);
        }

        const { data, error } = await query;

        if (error) throw error;

        setListings(data || []);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = (listingId: string, quantity: number) => {
    // Update local state immediately for better UX
    setListings(prev => prev.map(listing => 
      listing.id === listingId 
        ? { ...listing, quantity: listing.quantity - quantity }
        : listing
    ));
  };

  const handleFavorite = (listingId: string, isFavorited: boolean) => {
    if (!user) return;
    
    // Update local state immediately for better UX
    setListings(prev => prev.map(listing => {
      if (listing.id === listingId) {
        const updatedFavorites = isFavorited
          ? [...listing.favorited_by_user_ids, user.id]
          : listing.favorited_by_user_ids.filter((id: string) => id !== user.id);
        return { ...listing, favorited_by_user_ids: updatedFavorites };
      }
      return listing;
    }));
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🔍</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
        <p className="text-gray-600 mb-6">
          Be an explorer! Try adjusting your filters or search in a different area.
        </p>
        <div className="flex gap-3 justify-center">
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600"
          >
            Discover More Bags!
          </button>
          <button 
            onClick={() => {/* TODO: Implement location change */}}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Change Location
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          onPurchase={handlePurchase}
          onFavorite={handleFavorite}
        />
      ))}
    </div>
  );
};

export default ListingsGrid;