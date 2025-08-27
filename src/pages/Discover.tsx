import { useState, useEffect } from "react";
import { Filter, MapPin, Heart, Star, Clock, Map, List, Hand, Search } from "lucide-react";
import InteractiveMap from "@/components/InteractiveMap";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MobileLayout from "@/components/MobileLayout";
import { FilterPopup, FilterOptions } from "@/components/FilterPopup";
import { LocationSelector } from "@/components/LocationSelector";

import { StoreProfilePage } from "@/components/StoreProfilePage";
import ListingsGrid from "@/components/ListingsGrid";
import GoogleMapsSearch from "@/components/GoogleMapsSearch";
import DonatePopup from "@/components/DonatePopup";
import EnhancedLocationSearch from "@/components/EnhancedLocationSearch";
import { DiscoverCheckoutPopup } from "@/components/DiscoverCheckoutPopup";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { checkIfBusinessPartner } from "@/services/businessPartnerService";
import { useNavigate } from "react-router-dom";

const Discover = () => {
  const { user } = useAuth();
  const { addFavorite, removeFavorite, isFavorited } = useFavorites();
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
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [mysteryBags, setMysteryBags] = useState<any[]>([]);
  const [partnerBusinesses, setPartnerBusinesses] = useState<any[]>([]);
  const [loadingMysteryBags, setLoadingMysteryBags] = useState(false);

  const navigate = useNavigate();

  // Mock data for demonstration - Dummy products with working favorites
  const dummyProducts = [
    {
      id: "dummy-1",
      name: "Chicken Burger Combo",
      storeName: "Java House",
      location: "Westlands",
      pickup: "5:00 PM - 8:00 PM",
      price: 240,
      originalPrice: 800,
      quantity: 5,
      rating: 4.5,
      image: "🍔"
    },
    {
      id: "dummy-2", 
      name: "Coffee & Pastry Bundle",
      storeName: "Java House",
      location: "Westlands", 
      pickup: "5:00 PM - 8:00 PM",
      price: 180,
      originalPrice: 600,
      quantity: 3,
      rating: 4.5,
      image: "☕"
    },
    {
      id: "dummy-3",
      name: "Pasta Carbonara", 
      storeName: "Artcaffe",
      location: "CBD",
      pickup: "6:00 PM - 9:00 PM",
      price: 480,
      originalPrice: 1200,
      quantity: 2,
      rating: 4.3,
      image: "🍝"
    },
    {
      id: "dummy-4",
      name: "Fresh Croissant Pack",
      storeName: "Artcaffe", 
      location: "CBD",
      pickup: "6:00 PM - 9:00 PM",
      price: 80,
      originalPrice: 200,
      quantity: 8,
      rating: 4.3,
      image: "🥐"
    },
    {
      id: "dummy-5",
      name: "Mystery Pizza Box",
      storeName: "Debonairs Pizza",
      location: "Karen",
      pickup: "7:00 PM - 10:00 PM", 
      price: 350,
      originalPrice: 900,
      quantity: 3,
      rating: 4.6,
      image: "🍕"
    },
    {
      id: "dummy-6",
      name: "Healthy Salad Bowl",
      storeName: "Healthy U",
      location: "Kilimani",
      pickup: "12:00 PM - 3:00 PM",
      price: 120,
      originalPrice: 400,
      quantity: 6,
      rating: 4.2,
      image: "🥗"
    }
  ];

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

  // Fetch mystery bags when location changes
  useEffect(() => {
    fetchMysteryBags();
    fetchPartnerBusinesses();
  }, [currentLocation]);

  // Auto-detect user location on first load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({
            lat: latitude,
            lng: longitude,
            address: "Your current location",
            distance: 10
          });
        },
        (error) => {
          console.log("Location access denied, using default location");
          // Default to Nairobi
        }
      );
    }
  }, []);

  const toggleFavorite = async (itemId: string) => {
    if (!user) {
      toast.error("Please sign in to save favorites");
      return;
    }

    try {
      if (isFavorited(itemId)) {
        await removeFavorite(itemId);
        toast.success("Removed from favorites");
      } else {
        await addFavorite(itemId);
        toast.success("Added to favorites");
      }
    } catch (error) {
      toast.error("Failed to update favorite");
    }
  };

  const handleReserveItem = (item: any) => {
    if (!user) {
      toast.error("Please sign in to reserve items");
      return;
    }
    setSelectedItem(item);
    setShowCheckout(true);
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
    setCurrentLocation({...location, distance: 10});
    setShowLocationSelector(false);
  };

  // Fetch mystery bags from partner businesses
  const fetchMysteryBags = async () => {
    setLoadingMysteryBags(true);
    try {
      // Fetch mystery bags from verified partner businesses within radius
      const { data: mysteryBagsData, error } = await supabase
        .from('mystery_bags')
        .select(`
          *,
          business_profiles!inner (
            id,
            business_name,
            location,
            latitude,
            longitude,
            address,
            business_logo_url,
            description
          )
        `)
        .eq('is_active', true)
        .gt('items_available', 0)
        .gte('pickup_date', new Date().toISOString().split('T')[0]); // Today or future

      if (error) {
        console.error('Error fetching mystery bags:', error);
        return;
      }

      if (mysteryBagsData && mysteryBagsData.length > 0) {
        // Calculate distances and filter by location
        const bagsWithDistance = mysteryBagsData
          .map((bag: any) => {
            const business = bag.business_profiles;
            if (!business?.latitude || !business?.longitude) return null;
            
            const distance = calculateDistance(
              currentLocation.lat,
              currentLocation.lng,
              business.latitude as number,
              business.longitude as number
            );
            
            return {
              ...bag,
              business: business,
              distance: distance
            };
          })
          .filter((bag: any) => bag !== null)
          .sort((a: any, b: any) => a.distance - b.distance);

        setMysteryBags(bagsWithDistance);
      }
    } catch (error) {
      console.error('Error in fetchMysteryBags:', error);
    } finally {
      setLoadingMysteryBags(false);
    }
  };

  // Fetch partner businesses
  const fetchPartnerBusinesses = async () => {
    try {
      const { data: businessData, error } = await supabase
        .from('business_profiles')
        .select('*')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (error) {
        console.error('Error fetching partner businesses:', error);
        return;
      }

      if (businessData) {
        // Filter verified partners using checkIfBusinessPartner
        const verifiedPartners: any[] = [];
        for (const business of businessData) {
          if (business.email && business.latitude && business.longitude) {
            const partnerCheck = await checkIfBusinessPartner(business.email);
            if (partnerCheck.isBusinessPartner) {
              const distance = calculateDistance(
                currentLocation.lat,
                currentLocation.lng,
                business.latitude,
                business.longitude
              );
              verifiedPartners.push({
                ...business,
                distance: distance
              });
            }
          }
        }
        
        setPartnerBusinesses(verifiedPartners.sort((a, b) => a.distance - b.distance));
      }
    } catch (error) {
      console.error('Error in fetchPartnerBusinesses:', error);
    }
  };

  // Calculate distance between two coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
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
                setCurrentLocation({...location, distance: 10});
              }}
            />
          </div>
        ) : (
          /* List View */
          <div className="space-y-6 p-4">
            {/* Mystery Bags from Partner Businesses */}
            {mysteryBags.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">🎒 Partner Mystery Bags</h2>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {mysteryBags.length} available
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {mysteryBags.slice(0, 6).map((bag) => (
                    <div key={bag.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="flex">
                        {/* Business Logo/Image */}
                        <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                          {bag.business.business_logo_url ? (
                            <img 
                              src={bag.business.business_logo_url} 
                              alt={bag.business.business_name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <span className="text-2xl">🏪</span>
                          )}
                        </div>

                        {/* Mystery Bag Details */}
                        <div className="flex-1 p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm text-gray-900 mb-1">{bag.title}</h3>
                              <p className="text-xs text-gray-600 mb-1">{bag.business.business_name}</p>
                              <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                                <MapPin className="w-3 h-3" />
                                <span>{(bag.distance).toFixed(1)} km away</span>
                                <Clock className="w-3 h-3 ml-2" />
                                <span>{bag.pickup_start_time} - {bag.pickup_end_time}</span>
                              </div>
                            </div>
                            
                            {/* Favorite Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(bag.id);
                              }}
                              className={`p-1 rounded-full ${
                                isFavorited(bag.id)
                                  ? "text-red-500"
                                  : "text-gray-400 hover:text-red-500"
                              } transition-colors`}
                            >
                              <Heart className={`w-4 h-4 ${isFavorited(bag.id) ? "fill-current" : ""}`} />
                            </button>
                          </div>

                          {/* Price and Reserve */}
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-green-600">KSh {bag.price}</span>
                                <span className="text-sm text-gray-500 line-through">KSh {bag.original_price}</span>
                              </div>
                              <div className="text-xs text-gray-500">{bag.items_available} items left</div>
                            </div>
                            <Button
                              onClick={() => handleReserveItem({
                                id: bag.id,
                                name: bag.title,
                                storeName: bag.business.business_name,
                                location: bag.business.location,
                                pickup: `${bag.pickup_start_time} - ${bag.pickup_end_time}`,
                                price: bag.price,
                                originalPrice: bag.original_price,
                                quantity: bag.items_available
                              })}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 text-xs rounded-lg"
                            >
                              Reserve
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {mysteryBags.length > 6 && (
                  <Button variant="outline" className="w-full">
                    View All {mysteryBags.length} Mystery Bags
                  </Button>
                )}
              </div>
            )}

            {/* Loading State for Mystery Bags */}
            {loadingMysteryBags && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">🎒 Partner Mystery Bags</h2>
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  <span className="ml-3 text-gray-600">Loading mystery bags...</span>
                </div>
              </div>
            )}

            {/* No Mystery Bags Found */}
            {!loadingMysteryBags && mysteryBags.length === 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">🎒 Partner Mystery Bags</h2>
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-3">🔍</div>
                  <h3 className="font-semibold text-gray-900 mb-2">No mystery bags found nearby</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    We couldn't find any mystery bags from partner businesses in your area.
                  </p>
                  <Button
                    onClick={() => setShowLocationSelector(true)}
                    variant="outline"
                    className="mr-3"
                  >
                    Change Location
                  </Button>
                  <Button
                    onClick={() => {
                      fetchMysteryBags();
                      fetchPartnerBusinesses();
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Refresh
                  </Button>
                </div>
              </div>
            )}

            {/* Dummy Products for Testing - Available Now */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">Available Now - Test Items</h2>
              <div className="grid grid-cols-1 gap-4">
                {dummyProducts.slice(0, 3).map((product) => (
                  <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Product Card */}
                    <div className="relative">
                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                        className={`absolute top-3 right-3 z-10 p-2 rounded-full ${
                          isFavorited(product.id)
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-white/90 text-gray-700 hover:bg-white"
                        } shadow-md transition-colors`}
                      >
                        <Heart className={`w-4 h-4 ${isFavorited(product.id) ? "fill-current" : ""}`} />
                      </button>

                      {/* Product Image/Emoji */}
                      <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <span className="text-6xl">{product.image}</span>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-4">
                      {/* Store Info */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg">🏪</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{product.storeName}</h3>
                          <p className="text-xs text-gray-600 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {product.location}
                          </p>
                        </div>
                      </div>

                      {/* Product Name */}
                      <h4 className="font-medium text-gray-900 mb-2">{product.name}</h4>
                      
                      {/* Pickup Time */}
                      <p className="text-sm text-gray-600 flex items-center gap-1 mb-3">
                        <Clock className="w-4 h-4" />
                        {product.pickup}
                      </p>

                      {/* Price and Reserve */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xl font-bold text-gray-900">KSh {product.price}</div>
                          {product.originalPrice > product.price && (
                            <div className="text-sm text-gray-500 line-through">
                              KSh {product.originalPrice}
                            </div>
                          )}
                        </div>
                        <Button
                          onClick={() => handleReserveItem(product)}
                          className="bg-gradient-to-r from-brand-green to-brand-yellow text-white hover:from-brand-green/90 hover:to-brand-yellow/90 px-6 py-2 rounded-xl"
                        >
                          Reserve
                        </Button>
                      </div>

                      {/* Quantity Left */}
                      <div className="mt-2 text-xs text-gray-500">
                        {product.quantity} items left
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* More Test Items */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">Pick Up Later - Test Items</h2>
              <div className="grid grid-cols-1 gap-4">
                {dummyProducts.slice(3).map((product) => (
                  <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Product Card */}
                    <div className="relative">
                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                        className={`absolute top-3 right-3 z-10 p-2 rounded-full ${
                          isFavorited(product.id)
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-white/90 text-gray-700 hover:bg-white"
                        } shadow-md transition-colors`}
                      >
                        <Heart className={`w-4 h-4 ${isFavorited(product.id) ? "fill-current" : ""}`} />
                      </button>

                      {/* Product Image/Emoji */}
                      <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <span className="text-6xl">{product.image}</span>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-4">
                      {/* Store Info */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg">🏪</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{product.storeName}</h3>
                          <p className="text-xs text-gray-600 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {product.location}
                          </p>
                        </div>
                      </div>

                      {/* Product Name */}
                      <h4 className="font-medium text-gray-900 mb-2">{product.name}</h4>
                      
                      {/* Pickup Time */}
                      <p className="text-sm text-gray-600 flex items-center gap-1 mb-3">
                        <Clock className="w-4 h-4" />
                        {product.pickup}
                      </p>

                      {/* Price and Reserve */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xl font-bold text-gray-900">KSh {product.price}</div>
                          {product.originalPrice > product.price && (
                            <div className="text-sm text-gray-500 line-through">
                              KSh {product.originalPrice}
                            </div>
                          )}
                        </div>
                        <Button
                          onClick={() => handleReserveItem(product)}
                          className="bg-gradient-to-r from-brand-green to-brand-yellow text-white hover:from-brand-green/90 hover:to-brand-yellow/90 px-6 py-2 rounded-xl"
                        >
                          Reserve
                        </Button>
                      </div>

                      {/* Quantity Left */}
                      <div className="mt-2 text-xs text-gray-500">
                        {product.quantity} items left
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pick Up Now - Dynamic time-based listings */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">Real Listings - Pick Up Now</h2>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { name: "Fast Food", icon: "🍔", color: "bg-orange-100 text-orange-600" },
                  { name: "Coffee & Tea", icon: "☕", color: "bg-brown-100 text-brown-600" },
                  { name: "Bakery", icon: "🥐", color: "bg-yellow-100 text-yellow-600" },
                  { name: "Healthy", icon: "🥗", color: "bg-green-100 text-green-600" },
                  { name: "Pizza", icon: "🍕", color: "bg-red-100 text-red-600" },
                  { name: "Desserts", icon: "🍰", color: "bg-pink-100 text-pink-600" }
                ].map((category) => (
                  <button
                    key={category.name}
                    onClick={() => {
                      console.log('Category clicked:', category.name);
                      window.location.href = `/category/${encodeURIComponent(category.name)}`;
                    }}
                    className={`p-4 rounded-lg ${category.color} border border-gray-200 hover:shadow-md transition-all duration-200 text-center`}
                  >
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <div className="text-sm font-medium">{category.name}</div>
                  </button>
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

      {/* Discover Checkout Popup */}
      {selectedItem && (
        <DiscoverCheckoutPopup
          isOpen={showCheckout}
          onClose={() => {
            setShowCheckout(false);
            setSelectedItem(null);
          }}
          item={selectedItem}
        />
      )}
    </MobileLayout>

  );
};

export default Discover;
