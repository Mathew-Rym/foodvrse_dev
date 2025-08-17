
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
import InteractiveMap from "@/components/InteractiveMap";
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
      image: "🍕",
      address: "Westlands Road, Nairobi",
      website: "https://javahouseafrica.com",
      yearsActive: 2,
      mealsWasted: 1200,
      currentOffers: [
        { id: "1", title: "Magic Bag", pickup: "Today: 17:30 - 18:00", price: 250, itemsLeft: 4 }
      ],
      pastOffers: [
        { id: "2", title: "Lunch Special", price: 300 }
      ]
    },
    {
      id: "2", 
      name: "Artcaffe",
      location: "Sarit",
      type: "Cafe & Bakery",
      distance: "1.2 km",
      rating: 4.3,
      savings: "Up to 60%",
      pickup: "6:00 PM - 9:00 PM",
      image: "🥐",
      address: "Sarit Centre, Nairobi",
      website: "https://artcaffe.co.ke",
      yearsActive: 3,
      mealsWasted: 850,
      currentOffers: [
        { id: "3", title: "Pastry Bag", pickup: "Today: 18:00 - 19:00", price: 200, itemsLeft: 2 }
      ],
      pastOffers: []
    }
  ];

  const popularSearches = ["Pizza", "Burgers", "Bakery", "bread", "Healthy", "Desserts", "Coffee"];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;

      setCategories(data || []);
      
      // Initialize category data with mock items
      const mockCategoryData: any = {};
      data?.forEach(category => {
        mockCategoryData[category.name] = mockStores;
      });
      setCategoryData(mockCategoryData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
    // TODO: Implement search functionality
  };

  const handleFilter = () => {
    setShowFilter(true);
  };

  const [activeFilters, setActiveFilters] = useState<FilterOptions | null>(null);

  const [activeFilters, setActiveFilters] = useState<FilterOptions | null>(null);

  const handleApplyFilters = (filters: FilterOptions) => {

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
    console.log("Applied filters:", filters);
    setActiveFilters(filters);
    
    const filterCount = getActiveFilterCount(filters);
    if (filterCount > 0) {
      toast.success(`Applied ${filterCount} filter${filterCount !== 1 ? "s" : ""}`);
    } else {
      toast.success("All filters cleared");
    }
    setActiveFilters(filters);
    
    // Apply filters to listings
    applyFiltersToListings(filters);
    
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

  const applyFiltersToListings = (filters: FilterOptions) => {
    // This function would apply filters to the actual listings data
    // For now, we'll just log the filter criteria
    console.log("Filtering listings with criteria:", {
      showSoldOut: filters.showSoldOut,
      pickupDays: filters.pickupDay,
      pickupWindow: `${filters.pickupWindow[0]}:00 - ${filters.pickupWindow[1]}:00`,
      bagTypes: filters.surpriseBagTypes,
      dietary: filters.dietaryPreferences,
      priceRange: `KSh ${filters.priceRange[0]} - KSh ${filters.priceRange[1]}`,
      distanceRange: `${filters.distanceRange[1]} km max`,
      minRating: filters.ratingFilter > 0 ? `${filters.ratingFilter}+` : "Any"
    });
    
    // TODO: Implement actual filtering logic for listings
    // This would involve:
    // 1. Fetching filtered listings from Supabase
    // 2. Updating the ListingsGrid components
    // 3. Refreshing the map markers
    // 4. Updating the business list
  };

  const handleLocationSelect = (location: { lat: number; lng: number; address: string; distance: number }) => {
    setCurrentLocation(location);
    console.log("Location selected:", location);
    toast.success("Location updated");
  };

  const handleSearchLocationSelect = (loc: { lat: number; lng: number; address: string }) => {
    const updated = { ...currentLocation, ...loc };
    setCurrentLocation(updated);
    toast.success("Location updated");
  };

  const handleCategoryClick = (categoryName: string) => {
    console.log("Selected category:", categoryName);
    navigate(`/category/${encodeURIComponent(categoryName)}`);
    // TODO: Navigate to category page or filter
  };

  const navigate = useNavigate();

  const handleSeeAllCategory = (categoryName: string) => {
    console.log("See all for category:", categoryName);
    navigate(`/category/${encodeURIComponent(categoryName)}`);
    // TODO: Navigate to category page
  };

  const handleItemClick = (itemId: string) => {
    console.log("Item clicked:", itemId);
    // TODO: Open item details
  };

  const handleStoreClick = (storeId: string) => {
    const store = mockStores.find(s => s.id === storeId);
    if (store) {
      setSelectedStore(store);
      setShowStoreProfile(true);
    }
  };

  const handlePopularSearchClick = (searchTerm: string) => {
    setSearchQuery(searchTerm);
    handleSearch();
  };

  // Check if there are any listings available
  const checkForListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('id')
        .limit(1);

      if (error) throw error;
      setHasAnyListings((data && data.length > 0) || false);
    } catch (error) {
      console.error('Error checking for listings:', error);
      setHasAnyListings(false);
    }
  };

  useEffect(() => {
    checkForListings();
  }, []);

  const handleDonate = () => {
    setShowDonatePopup(true);
  };

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
            <Button variant="outline" size="sm" className={`shrink-0 relative ${activeFilters ? "border-green-500 bg-green-50" : ""}`} onClick={handleFilter}>
              <Filter className="w-4 h-4" />
              {activeFilters <Filter className="w-4 h-4" /><Filter className="w-4 h-4" /> (
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

            {/* Pick Up Tomorrow */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">Pick Up Tomorrow</h2>
              <ListingsGrid 
                pickupTimeFilter="tomorrow"
                showSoldOut={false}
                limit={4}
                userLocation={{ lat: currentLocation.lat, lng: currentLocation.lng }}
                distanceFilter={currentLocation.distance}
                showNoItemsMessage={false}
              />
            </div>

            {/* Dynamic Categories */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Browse by Category</h2>
              
              {categories.map((category) => (
                <div key={category.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-medium text-gray-800">{category.name}</h3>
                    <button 
                      onClick={() => handleSeeAllCategory(category.name)}
                      className="text-sm text-brand-green hover:text-brand-green/80"
                    >
                      See all
                    </button>
                  </div>
                  <ListingsGrid 
                    categoryFilter={category.name}
                    showSoldOut={false}
                    limit={3}
                    userLocation={{ lat: currentLocation.lat, lng: currentLocation.lng }}
                    distanceFilter={currentLocation.distance}
                    showNoItemsMessage={false}
                  />
                </div>
              ))}
            </div>

            {/* Near You Section */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">Near You</h2>
              <div className="space-y-3">
                {mockStores.map((store) => (
                  <div 
                    key={store.id} 
                    className="bg-white rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleStoreClick(store.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                        {store.image}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{store.name}</h3>
                            <p className="text-sm text-gray-600">{store.type}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(store.id);
                            }}
                            className={`p-1 ${favorites.includes(store.id) ? 'text-red-500' : 'text-gray-400'}`}
                          >
                            <Heart className={`w-5 h-5 ${favorites.includes(store.id) ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{store.distance}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span>{store.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{store.pickup}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <Badge className="bg-green-100 text-green-600">{store.savings}</Badge>
                          <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                            View Deals
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
