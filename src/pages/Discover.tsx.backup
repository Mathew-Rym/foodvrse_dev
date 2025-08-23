import { useState, useEffect } from "react";
import { Filter, MapPin, Heart, Star, Clock, Map, List, Hand, Search } from "lucide-react";
import InteractiveMap from "@/components/InteractiveMap";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MobileLayout from "@/components/MobileLayout";
import { FilterPopup, FilterOptions } from "@/components/FilterPopup";
import { LocationSelector } from "@/components/LocationSelector";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import { StoreProfilePage } from "@/components/StoreProfilePage";
import ListingsGrid from "@/components/ListingsGrid";
import GoogleMapsSearch from "@/components/GoogleMapsSearch";
import DonatePopup from "@/components/DonatePopup";
import EnhancedLocationSearch from "@/components/EnhancedLocationSearch";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

const Discover = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentLocation, setCurrentLocation] = useState({
    address: "Nairobi, Kenya",
    lat: -1.2921,
    lng: 36.8219,
    distance: 10
  });
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showFilter, setShowFilter] = useState(false);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [showStoreProfile, setShowStoreProfile] = useState(false);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any>({});
  const [showDonatePopup, setShowDonatePopup] = useState(false);
  const [showEnhancedLocationSearch, setShowEnhancedLocationSearch] = useState(false);
  const [hasAnyListings, setHasAnyListings] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions | null>(null);
  const [filterClickEvent, setFilterClickEvent] = useState<React.MouseEvent | null>(null);
  const [donateClickEvent, setDonateClickEvent] = useState<React.MouseEvent | null>(null);

  // Mock data for demonstration
  const mockStores = [
    {
      id: "1",
      name: "Java House",
      location: "Westlands",
      type: "Restaurant",
      distance: "0.5 km",
      rating: 4.5,
      savings: "Up to 70%",
      pickup: "5:00 PM - 8:00 PM",
      items: [
        { id: "1", name: "Chicken Burger", originalPrice: 800, price: 240, quantity: 5 },
        { id: "2", name: "Coffee & Cake", originalPrice: 600, price: 180, quantity: 3 }
      ]
    },
    {
      id: "2",
      name: "Artcaffe",
      location: "CBD",
      type: "Cafe",
      distance: "1.2 km",
      rating: 4.3,
      savings: "Up to 60%",
      pickup: "6:00 PM - 9:00 PM",
      items: [
        { id: "3", name: "Pasta Carbonara", originalPrice: 1200, price: 480, quantity: 2 },
        { id: "4", name: "Croissant", originalPrice: 200, price: 80, quantity: 8 }
      ]
    }
  ];

  const popularSearches = ["Pizza", "Coffee", "Burgers", "Desserts", "Healthy"];

  const toggleFavorite = (storeId: string) => {
    setFavorites(prev => 
      prev.includes(storeId) 
        ? prev.filter(id => id !== storeId)
        : [...prev, storeId]
    );
  };

  const handleSearchLocationSelect = ({ lat, lng, address }: { lat: number; lng: number; address: string }) => {
    setCurrentLocation({
      address,
      lat,
      lng,
      distance: 10
    });
    toast.success(`Location updated to ${address}`);
  };

  const handleLocationSelect = (location: any) => {
    setCurrentLocation(location);
    setShowLocationSelector(false);
  };

  const handleStoreSelect = (store: any) => {
    setSelectedStore(store);
    setShowStoreProfile(true);
  };

  const handleApplyFilters = (filters: FilterOptions) => {
    setActiveFilters(filters);
    setShowFilter(false);
    
    // Show success message with filter count
    const filterCount = getActiveFilterCount(filters);
    if (filterCount > 0) {
      toast.success(`Applied ${filterCount} filter${filterCount !== 1 ? 's' : ''}`);
    } else {
      toast.success("All filters cleared");
    }
  };

  const getActiveFilterCount = (filters: FilterOptions): number => {
    let count = 0;
    if (filters.showSoldOut) count++;
    if (filters.pickupDay.length > 0) count++;
    if (filters.pickupWindow[0] !== 0 || filters.pickupWindow[1] !== 23) count++;
    if (filters.surpriseBagTypes.length > 0) count++;
    if (filters.dietaryPreferences.length > 0) count++;
    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000) count++;
    if (filters.distanceRange[0] !== 0 || filters.distanceRange[1] !== 10) count++;
    if (filters.ratingFilter > 0) count++;
    return count;
  };

  const handlePopularSearchClick = (searchTerm: string) => {
    setSearchQuery(searchTerm);
    toast.success(`Searching for ${searchTerm}`);
  };

  const handleDonate = (event: React.MouseEvent) => {
    setShowDonatePopup(true);
    setDonateClickEvent(event);
  };

  const handleFilter = (event: React.MouseEvent) => {
    setShowFilter(true);
    setFilterClickEvent(event);
  };

  const checkForListings = () => {
    // Check if there are any listings available
    const hasListings = mockStores.length > 0;
    setHasAnyListings(hasListings);
  };

  useEffect(() => {
    checkForListings();
  }, []);

  return (
    <MobileLayout>
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          {/* View Toggle Buttons */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setViewMode('map')}
            >
              <Map className="w-4 h-4 mr-2" />
              Map
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4 mr-2" />
              List
            </Button>
          </div>
          
          {/* Current Location + Inline Search */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-brand-light-green text-brand-green rounded-xl px-3 py-1">
              <MapPin className="w-4 h-4 text-brand-green" />
              <span className="text-sm font-medium truncate max-w-[50vw]">{currentLocation.address}</span>
            </div>
            <div className="w-full sm:flex-1 min-w-[180px] mt-2 sm:mt-0">
              <GoogleMapsSearch
                onLocationSelect={({ lat, lng, address }) => {
                  handleSearchLocationSelect({ lat, lng, address });
                }}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => setShowEnhancedLocationSearch(true)}
            >
              <MapPin className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className={`shrink-0 relative ${activeFilters ? "border-green-500 bg-green-50" : ""}`} 
              onClick={handleFilter}
            >
              <Filter className="w-4 h-4" />
              {activeFilters && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDonate}
              className="hidden sm:inline-flex shrink-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-none hover:from-yellow-500 hover:to-orange-600"
            >
              <Hand className="w-4 h-4 mr-1" />
              Donate
            </Button>
          </div>
        </div>

        {viewMode === 'map' ? (
          /* Interactive Map View */
          <div className="h-96 relative">
            <InteractiveMap
              userLocation={currentLocation}
              onBusinessSelect={(business) => {
                console.log('Selected business:', business);
                toast.success(`Selected ${business.business_name}`);
                // You can add navigation to business details here
              }}
              onLocationChange={(location) => {
                setCurrentLocation(location);
              }}
            />
          </div>
        ) : (
          /* List View */
          <div className="space-y-6 p-4">
            {/* Pick Up Now - Dynamic time-based listings */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">Pick Up Now</h2>
              <ListingsGrid 
                pickupTimeFilter="now"
                showSoldOut={false}
                limit={4}
                userLocation={{ lat: currentLocation.lat, lng: currentLocation.lng }}
                distanceFilter={currentLocation.distance}
                showNoItemsMessage={false}
              />
            </div>

            {/* Pick Up Later - Evening pickups */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">Pick Up Later</h2>
              <ListingsGrid 
                pickupTimeFilter="later"
                showSoldOut={false}
                limit={4}
                userLocation={{ lat: currentLocation.lat, lng: currentLocation.lng }}
                distanceFilter={currentLocation.distance}
                showNoItemsMessage={false}
              />
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">Browse by Category</h2>
              <CategoryCarousel 
                onCategoryClick={(categoryName) => {
                  console.log('Category clicked:', categoryName);
                  // Navigate to category page
                  window.location.href = `/category/${encodeURIComponent(categoryName)}`;
                }}
              />
            </div>

            {/* Popular Searches */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">Popular Searches</h2>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handlePopularSearchClick(tag)}
                    className="px-3 py-1 border border-gray-300 rounded-full text-sm hover:bg-brand-light-green hover:border-brand-green transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* No Items Found - Show only when there are no listings */}
            {!hasAnyListings && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-brand-light-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Be an explorer! Try adjusting your filters or search in a different area.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <button 
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-gradient-to-r from-brand-green to-brand-yellow text-white rounded-lg hover:from-brand-green/90 hover:to-brand-yellow/90 transition-all duration-200 font-medium"
                  >
                    Discover More Bags!
                  </button>
                  <button 
                    onClick={() => {
                      // Open location search modal
                      const event = new CustomEvent('openLocationSearch');
                      window.dispatchEvent(event);
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                  >
                    Change Location
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter Popup */}
      <FilterPopup
        isOpen={showFilter}
        onClose={() => setShowFilter(false)}
        onApplyFilters={handleApplyFilters}
        clickEvent={filterClickEvent}
      />

      {/* Location Selector */}
      <LocationSelector
        isOpen={showLocationSelector}
        onClose={() => setShowLocationSelector(false)}
        onLocationSelect={handleLocationSelect}
        currentLocation={currentLocation}
      />

      {/* Store Profile */}
      {selectedStore && (
        <StoreProfilePage
          isOpen={showStoreProfile}
          onClose={() => setShowStoreProfile(false)}
          store={selectedStore}
        />
      )}

      {/* Donate Popup */}
      <DonatePopup
        isOpen={showDonatePopup}
        onClose={() => setShowDonatePopup(false)}
        clickEvent={donateClickEvent}
      />

      {/* Enhanced Location Search */}
      <EnhancedLocationSearch
        isOpen={showEnhancedLocationSearch}
        onClose={() => setShowEnhancedLocationSearch(false)}
        onLocationSelect={handleLocationSelect}
        onDealsFound={(deals) => {
          console.log('Found deals:', deals);
          toast.success(`Found ${deals.length} deals in your area!`);
        }}
      />
    </MobileLayout>

  );
};

export default Discover;
