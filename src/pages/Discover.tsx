
import { useState, useEffect } from "react";
import { Search, Filter, MapPin, Heart, Star, Clock, Map, List, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MobileLayout from "@/components/MobileLayout";
import { FilterPopup, FilterOptions } from "@/components/FilterPopup";
import { LocationSelector } from "@/components/LocationSelector";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import { StoreProfilePage } from "@/components/StoreProfilePage";
import ListingsGrid from "@/components/ListingsGrid";
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

  const handleApplyFilters = (filters: FilterOptions) => {
    console.log("Applied filters:", filters);
    // TODO: Implement filter logic
    toast.success("Filters applied");
  };

  const handleLocationSelect = (location: { lat: number; lng: number; address: string; distance: number }) => {
    setCurrentLocation(location);
    console.log("Location selected:", location);
    toast.success("Location updated");
  };

  const handleCategoryClick = (categoryName: string) => {
    console.log("Selected category:", categoryName);
    // TODO: Navigate to category page or filter
  };

  const handleSeeAllCategory = (categoryName: string) => {
    console.log("See all for category:", categoryName);
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

  const handleDonate = () => {
    // TODO: Implement donate functionality
    toast.success("Thank you for your interest in donating!");
  };

  return (
    <MobileLayout>
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          {/* Search Bar */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search food, restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <Button variant="outline" size="sm" onClick={handleFilter}>
              <Filter className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowLocationSelector(true)}
            >
              <MapPin className="w-4 h-4" />
            </Button>
          </div>

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
          
          {/* Current Location */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4 text-green-500" />
              <span className="text-sm">{currentLocation.address}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDonate}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-none hover:from-yellow-500 hover:to-orange-600"
            >
              <Hand className="w-4 h-4 mr-1" />
              Donate
            </Button>
          </div>
        </div>

        {viewMode === 'map' ? (
          /* Map View */
          <div className="h-96 bg-gray-100 relative">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                <p className="text-sm text-gray-600">Map View</p>
                <p className="text-xs text-gray-500">Shows stores with mystery bags near you</p>
              </div>
            </div>
            
            {/* Store pins on map */}
            {mockStores.map((store, index) => (
              <button
                key={store.id}
                className="absolute w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-brand-green cursor-pointer hover:scale-110 transition-transform"
                style={{
                  top: `${30 + index * 15}%`,
                  left: `${25 + index * 20}%`
                }}
                onClick={() => handleStoreClick(store.id)}
              >
                <span className="text-lg">{store.image}</span>
              </button>
            ))}
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
              />
            </div>

            {/* Pick Up Tomorrow */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">Pick Up Tomorrow</h2>
              <ListingsGrid 
                pickupTimeFilter="tomorrow"
                showSoldOut={false}
                limit={4}
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
    </MobileLayout>
  );
};

export default Discover;
