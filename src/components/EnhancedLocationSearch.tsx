import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, X, MapPin, Store, Clock, Star, Globe, Loader2 } from "lucide-react";
import { API_CONFIG } from '@/config/api';
import { toast } from "sonner";
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '@/config/emailjs';

interface BusinessDeal {
  id: string;
  businessName: string;
  dealTitle: string;
  price: number;
  originalPrice: number;
  pickupTime: string;
  distance: string;
  rating: number;
  image: string;
  category: string;
  location: string;
  coordinates: { lat: number; lng: number };
}

interface EnhancedLocationSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: { lat: number; lng: number; address: string; country: string }) => void;
}

const EnhancedLocationSearch: React.FC<EnhancedLocationSearchProps> = ({
  isOpen,
  onClose,
  onLocationSelect
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [predictions, setPredictions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string; country: string } | null>(null);
  const [showDeals, setShowDeals] = useState(false);
  const [nearbyDeals, setNearbyDeals] = useState<BusinessDeal[]>([]);
  const [showExpansionForm, setShowExpansionForm] = useState(false);
  const [expansionFormData, setExpansionFormData] = useState({
    name: '',
    email: '',
    location: '',
    message: ''
  });
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Mock business deals data - in real app, this would come from API
  const mockBusinessDeals: BusinessDeal[] = [
    {
      id: '1',
      businessName: 'Java House Westlands',
      dealTitle: 'Mystery Bag - Fresh Pastries & Coffee',
      price: 250,
      originalPrice: 800,
      pickupTime: 'Today: 17:30 - 18:00',
      distance: '0.5 km',
      rating: 4.5,
      image: '☕',
      category: 'Cafe',
      location: 'Westlands, Nairobi',
      coordinates: { lat: -1.2641, lng: 36.8156 }
    },
    {
      id: '2',
      businessName: 'Artcaffe Sarit',
      dealTitle: 'Pastry Surprise Bag',
      price: 200,
      originalPrice: 600,
      pickupTime: 'Today: 18:00 - 19:00',
      distance: '1.2 km',
      rating: 4.3,
      image: '🥐',
      category: 'Bakery',
      location: 'Sarit Centre, Nairobi',
      coordinates: { lat: -1.2641, lng: 36.8156 }
    },
    {
      id: '3',
      businessName: 'Pizza Inn Kilimani',
      dealTitle: 'Pizza & Sides Mystery Box',
      price: 350,
      originalPrice: 1200,
      pickupTime: 'Today: 19:00 - 20:00',
      distance: '0.8 km',
      rating: 4.2,
      image: '🍕',
      category: 'Restaurant',
      location: 'Kilimani, Nairobi',
      coordinates: { lat: -1.2921, lng: 36.8219 }
    },
    {
      id: '4',
      businessName: 'Chicken Inn CBD',
      dealTitle: 'Chicken & Chips Combo',
      price: 300,
      originalPrice: 900,
      pickupTime: 'Today: 18:30 - 19:30',
      distance: '1.5 km',
      rating: 4.1,
      image: '🍗',
      category: 'Fast Food',
      location: 'CBD, Nairobi',
      coordinates: { lat: -1.2921, lng: 36.8219 }
    },
    {
      id: '5',
      businessName: 'Dormans Coffee Westlands',
      dealTitle: 'Coffee & Pastry Bundle',
      price: 180,
      originalPrice: 550,
      pickupTime: 'Today: 17:00 - 18:00',
      distance: '0.3 km',
      rating: 4.4,
      image: '☕',
      category: 'Cafe',
      location: 'Westlands, Nairobi',
      coordinates: { lat: -1.2641, lng: 36.8156 }
    },
    {
      id: '6',
      businessName: 'KFC Sarit',
      dealTitle: 'Chicken Bucket Mystery',
      price: 400,
      originalPrice: 1500,
      pickupTime: 'Today: 19:30 - 20:30',
      distance: '1.1 km',
      rating: 4.0,
      image: '🍗',
      category: 'Fast Food',
      location: 'Sarit Centre, Nairobi',
      coordinates: { lat: -1.2641, lng: 36.8156 }
    }
  ];

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  }, []);

  // Auto-focus search input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Calculate distance between coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Find nearby deals
  const findNearbyDeals = (lat: number, lng: number): BusinessDeal[] => {
    return mockBusinessDeals
      .map(deal => ({
        ...deal,
        distance: `${calculateDistance(lat, lng, deal.coordinates.lat, deal.coordinates.lng).toFixed(1)} km`
      }))
      .filter(deal => parseFloat(deal.distance) <= 5) // Within 5km
      .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
      .slice(0, 6);
  };

  // Search locations using Google Maps JavaScript API
  const searchLocations = async (query: string) => {
    if (!query.trim()) { setPredictions([]); return; }
    setIsLoading(true);
    console.log('🔍 Starting search for:', query);
    try {
      let attempts = 0;
      while (!window.google || !window.google.maps || !window.google.maps.places) {
        if (attempts > 10) {
          console.error('❌ Google Maps JavaScript API not loaded after 10 attempts');
          toast.error('Location search is not available. Please refresh the page.');
          setIsLoading(false);
          return;
        }
        console.log('⏳ Waiting for Google Maps API to load...', attempts + 1);
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
      }
      console.log('✅ Google Maps API is ready');
      const service = new window.google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        { input: query, types: ['establishment', 'geocode'] },
        (predictions, status) => {
          console.log('📊 Google Maps API Response:', { status, predictions });
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            console.log('✅ Found predictions:', predictions.length);
            setPredictions(predictions);
          } else {
            console.log('❌ No predictions found. Status:', status);
            setPredictions([]);
          }
          setIsLoading(false);
          console.log('🏁 Search completed');
        }
      );
    } catch (error) {
      console.error('❌ Error searching locations:', error);
      setPredictions([]);
      setIsLoading(false);
      toast.error('Failed to search locations. Please try again.');
    }
  };

  // Get place details using Google Maps JavaScript API
  const getPlaceDetails = async (placeId: string): Promise<{ lat: number; lng: number; address: string; country: string } | null> => {
    try {
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        console.error('❌ Google Maps JavaScript API not loaded');
        return null;
      }
      const service = new window.google.maps.places.PlacesService(document.createElement('div'));
      return new Promise((resolve) => {
        service.getDetails(
          { placeId: placeId, fields: ['geometry', 'formatted_address', 'address_components'] },
          (place, status) => {
            console.log('📍 Place Details API Response:', { status, place });
            if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
              const countryComponent = place.address_components?.find((component: any) => component.types.includes('country'));
              const country = countryComponent?.long_name || '';
              const result = {
                lat: place.geometry?.location?.lat() || 0,
                lng: place.geometry?.location?.lng() || 0,
                address: place.formatted_address || '',
                country: country
              };
              console.log('📍 Extracted location details:', result);
              resolve(result);
            } else {
              console.error('📍 Place Details API error:', status);
              resolve(null);
            }
          }
        );
      });
    } catch (error) {
      console.error('❌ Error getting place details:', error);
      return null;
    }
  };

  // Handle search input changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.length > 1) { // Reduced from 2 to 1 character
      searchLocations(value);
    } else {
      setPredictions([]);
    }
  };

  // Handle location selection
  const handleLocationSelect = async (prediction: any) => {
    console.log('📍 Location selected:', prediction);
    setSearchQuery(prediction.description);
    setPredictions([]);
    setIsLoading(true);

    const placeDetails = await getPlaceDetails(prediction.place_id);
    if (placeDetails) {
      setSelectedLocation(placeDetails);
      
      // Check if location is in Kenya
      if (placeDetails.country.toLowerCase() === 'kenya') {
        // Location is in Kenya, find nearby deals
        const deals = findNearbyDeals(placeDetails.lat, placeDetails.lng);
        setNearbyDeals(deals);
        setShowDeals(true);
        setShowExpansionForm(false);
        console.log('✅ Location in Kenya, found deals:', deals.length);
      } else {
        // Not in Kenya, show expansion form
        setShowExpansionForm(true);
        setShowDeals(false);
        setExpansionFormData(prev => ({ ...prev, location: placeDetails.address }));
        console.log('❌ Location not in Kenya:', placeDetails.country);
      }
    } else {
      toast.error('Failed to get location details. Please try again.');
    }
    setIsLoading(false);
  };

  // Handle expansion form submission
  const handleExpansionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const templateParams = {
        to_email: 'hello@foodvrse.com',
        from_name: expansionFormData.name,
        from_email: expansionFormData.email,
        location: expansionFormData.location,
        message: expansionFormData.message || 'User interested in FoodVrse expansion to their area'
      };

      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );

      toast.success('Thank you for your interest! We\'ll notify you when we expand to your area.');
      onClose();
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send interest. Please try again.');
    }
  };

  // Handle confirm location
  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal - Positioned at top */}
      <div className="absolute inset-0 flex items-start justify-center p-4 pt-8">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Search Location</h2>
                <p className="text-sm text-gray-600">Find businesses and deals near you</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto">
            {/* Search Input */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                🔍 Search for any location worldwide
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Enter any location, city, or landmark..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-12 pr-4 py-4 text-base border-2 border-gray-200 bg-white shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:ring-opacity-50 hover:border-gray-300 transition-all duration-200 rounded-xl"
                  style={{ 
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
                    backgroundColor: '#ffffff'
                  }}
                  spellCheck="false"
                  autoComplete="off"
                />
                {isLoading && (
                  <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500 animate-spin" />
                )}
              </div>
            </div>

            {/* Location Predictions */}
            {predictions.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <div className="text-xs text-gray-500 mb-2">Found {predictions.length} results:</div>
                {predictions.map((prediction) => (
                  <button
                    key={prediction.place_id}
                    onClick={() => handleLocationSelect(prediction)}
                    className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {prediction.structured_formatting.main_text}
                        </div>
                        <div className="text-sm text-gray-600">
                          {prediction.structured_formatting.secondary_text}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Selected Location & Deals */}
            {showDeals && selectedLocation && (
              <div className="space-y-4">
                {/* Selected Location */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-800">Selected Location</span>
                  </div>
                  <p className="text-green-700">{selectedLocation.address}</p>
                </div>

                {/* Nearby Deals */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Store className="w-5 h-5 text-green-600" />
                    Deals Near You ({nearbyDeals.length})
                  </h3>
                  
                  {nearbyDeals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                      {nearbyDeals.map((deal) => (
                        <div key={deal.id} className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                              {deal.image}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900 truncate">{deal.businessName}</h4>
                                <Badge variant="secondary" className="text-xs">
                                  {deal.category}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2 truncate">{deal.dealTitle}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg font-bold text-green-600">KSh {deal.price}</span>
                                  <span className="text-sm text-gray-500 line-through">KSh {deal.originalPrice}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  {deal.pickupTime}
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <MapPin className="w-3 h-3" />
                                  {deal.distance}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                  {deal.rating}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Store className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No deals available in this area yet.</p>
                      <p className="text-sm">Check back later or try a different location!</p>
                    </div>
                  )}
                </div>

                {/* Confirm Button */}
                <Button
                  onClick={handleConfirmLocation}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                >
                  Confirm Location & View Deals
                </Button>
              </div>
            )}

            {/* No Results */}
            {searchQuery && predictions.length === 0 && !isLoading && (
              <div className="text-center py-8 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium text-gray-700 mb-2">No locations found for &quot;{searchQuery}&quot;</p>
                <p className="text-sm text-gray-500 mb-4">Try searching for:</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-700">Cities</div>
                    <div className="text-gray-500">nairobi, mombasa, kisumu</div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-700">Neighborhoods</div>
                    <div className="text-gray-500">westlands, kilimani, cbd</div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-700">Landmarks</div>
                    <div className="text-gray-500">two rivers, sarit centre</div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-700">Full Names</div>
                    <div className="text-gray-500">citam woodley, westlands</div>
                  </div>
                </div>
              </div>
            )}

            {/* Expansion Form */}
            {showExpansionForm && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <Globe className="w-12 h-12 mx-auto mb-3 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">We&apos;re Not in Your Area Yet</h3>
                  <p className="text-gray-600">Let us know you&apos;re interested, and we&apos;ll notify you when we expand to your location!</p>
                </div>
                
                <form onSubmit={handleExpansionSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                    <Input
                      type="text"
                      value={expansionFormData.name}
                      onChange={(e) => setExpansionFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <Input
                      type="email"
                      value={expansionFormData.email}
                      onChange={(e) => setExpansionFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Location</label>
                    <Input
                      type="text"
                      value={expansionFormData.location}
                      onChange={(e) => setExpansionFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Your city or area"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                    <textarea
                      value={expansionFormData.message}
                      onChange={(e) => setExpansionFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Tell us why you&apos;d like FoodVrse in your area..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowExpansionForm(false)}
                      className="flex-1"
                    >
                      Back to Search
                    </Button>
                    <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                      🎁 Claim My Spot
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLocationSearch;
