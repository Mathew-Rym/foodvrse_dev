import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Globe, MapPin, Search, X, Loader2, AlertCircle, Store, Clock, Star } from "lucide-react";
import { API_CONFIG } from '@/config/api';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '@/config/emailjs';

interface Location {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

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
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface EnhancedLocationSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
  onDealsFound?: (deals: BusinessDeal[]) => void;
}

const EnhancedLocationSearch: React.FC<EnhancedLocationSearchProps> = ({
  isOpen,
  onClose,
  onLocationSelect,
  onDealsFound
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showExpansionForm, setShowExpansionForm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [nearbyDeals, setNearbyDeals] = useState<BusinessDeal[]>([]);
  const [showDeals, setShowDeals] = useState(false);
  const [expansionFormData, setExpansionFormData] = useState({
    name: '',
    email: '',
    location: '',
    message: ''
  });

  // Mock business deals data
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
      coordinates: { lat: -1.2921, lng: 36.8219 }
    },
    {
      id: '3',
      businessName: 'Pizza Inn Kilimani',
      dealTitle: 'Pizza & Sides Mystery Box',
      price: 350,
      originalPrice: 1200,
      pickupTime: 'Today: 19:00 - 20:00',
      distance: '2.1 km',
      rating: 4.2,
      image: '🍕',
      category: 'Restaurant',
      location: 'Kilimani, Nairobi',
      coordinates: { lat: -1.3000, lng: 36.8000 }
    }
  ];

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  }, []);

  // Auto-focus search input when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setPredictions([]);
      setShowExpansionForm(false);
      setShowDeals(false);
      setSelectedLocation(null);
      setNearbyDeals([]);
      
      const timer = setTimeout(() => {
        const searchInput = document.querySelector('input[placeholder*="location"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Calculate distance between coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
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
      .filter(deal => parseFloat(deal.distance) <= 10)
      .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
      .slice(0, 6);
  };

  // Search locations
  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      setPredictions([]);
      return;
    }

    setIsLoading(true);
    
    try {
      // First try with Kenya restriction
      let searchParams = new URLSearchParams({
        input: query,
        types: 'geocode|establishment', // Simplified types parameter
        key: API_CONFIG.GOOGLE_MAPS_API_KEY
      });

      let response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?${searchParams.toString()}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      let data = await response.json();
      
      console.log('Google Places API response:', data);
      
      // If no results, try without any restrictions
      if (data.status === 'ZERO_RESULTS' || (data.status === 'OK' && data.predictions.length === 0)) {
        console.log('No results found, trying broader search...');
        
        searchParams = new URLSearchParams({
          input: query,
          key: API_CONFIG.GOOGLE_MAPS_API_KEY
        });

        response = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?${searchParams.toString()}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        data = await response.json();
        console.log('Google Places API response (broader search):', data);
      }
      
      if (data.status === 'OK') {
        setPredictions(data.predictions);
        console.log('Found predictions:', data.predictions.length);
      } else if (data.status === 'ZERO_RESULTS') {
        setPredictions([]);
        console.log('No predictions found for:', query);
      } else {
        console.error('Google Places API error:', data.status, data.error_message);
        setPredictions([]);
        
        // Show user-friendly error message
        if (data.status === 'REQUEST_DENIED') {
          toast.error('Location search is temporarily unavailable. Please try again later.');
        } else if (data.status === 'OVER_QUERY_LIMIT') {
          toast.error('Search limit reached. Please try again in a moment.');
        } else if (data.status === 'INVALID_REQUEST') {
          toast.error('Invalid search request. Please try a different search term.');
        } else {
          toast.error('Unable to search locations. Please check your connection and try again.');
        }
      }
    } catch (error) {
      console.error('Error searching locations:', error);
      setPredictions([]);
      toast.error('Failed to search locations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get place details
  const getPlaceDetails = async (placeId: string): Promise<{ lat: number; lng: number; address: string; country: string } | null> => {
    try {
      const searchParams = new URLSearchParams({
        place_id: placeId,
        fields: 'geometry,formatted_address,address_components,place_id',
        key: API_CONFIG.GOOGLE_MAPS_API_KEY
      });

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?${searchParams.toString()}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log('Place Details API response:', data);
      
      if (data.status === 'OK' && data.result) {
        const { geometry, formatted_address, address_components } = data.result;
        
        // Extract country from address components
        const countryComponent = address_components?.find((component: any) => 
          component.types.includes('country')
        );
        const country = countryComponent?.long_name || '';
        
        console.log('Extracted location details:', {
          lat: geometry.location.lat,
          lng: geometry.location.lng,
          address: formatted_address,
          country
        });
        
        return {
          lat: geometry.location.lat,
          lng: geometry.location.lng,
          address: formatted_address,
          country
        };
      } else {
        console.error('Place Details API error:', data.status, data.error_message);
        return null;
      }
    } catch (error) {
      console.error('Error getting place details:', error);
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
  const handleLocationSelect = async (location: Location) => {
    setIsLoading(true);
    
    try {
      const placeDetails = await getPlaceDetails(location.place_id);
      
      if (placeDetails) {
        // Check if location is in Kenya
        if (placeDetails.country.toLowerCase() !== 'kenya') {
          setShowExpansionForm(true);
          setExpansionFormData(prev => ({
            ...prev,
            location: placeDetails.address
          }));
          return;
        }
        
        // Location is in Kenya, find nearby deals
        const deals = findNearbyDeals(placeDetails.lat, placeDetails.lng);
        setNearbyDeals(deals);
        setSelectedLocation({
          lat: placeDetails.lat,
          lng: placeDetails.lng,
          address: placeDetails.address
        });
        setShowDeals(true);
        
        // Notify parent component
        if (onLocationSelect) {
          onLocationSelect({
            lat: placeDetails.lat,
            lng: placeDetails.lng,
            address: placeDetails.address
          });
        }
        
        if (onDealsFound) {
          onDealsFound(deals);
        }
        
        toast.success(`Found ${deals.length} deals near ${placeDetails.address}`);
      }
    } catch (error) {
      console.error('Error handling location selection:', error);
      toast.error('Error selecting location. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
        message: expansionFormData.message,
        subject: 'FoodVrse Expansion Interest - ' + expansionFormData.location
      };

      const result = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );

      if (result.status === 200) {
        toast.success('Thank you for your interest! We\'ll get back to you soon.');
        onClose();
      } else {
        throw new Error('Email sending failed');
      }
    } catch (error) {
      console.error('Error sending expansion interest:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  // Handle confirm location
  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onClose();
      toast.success(`Location set to ${selectedLocation.address}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex items-center justify-between border-b bg-gray-50">
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-green-600" />
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">Search Location</CardTitle>
              <p className="text-sm text-gray-600">Search for any location in Kenya</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-0">
          {!showExpansionForm ? (
            <div className="space-y-4 p-6">
              {/* Search Input */}
              <div className="relative mb-4 flex-shrink-0 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🔍 Search for any location worldwide
                </label>
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Enter any location, city, or landmark..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-12 pr-4 py-3 text-base border-2 border-gray-300 bg-white shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:ring-opacity-50 hover:border-gray-400 transition-all duration-200"
                  style={{ 
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', 
                    backgroundColor: '#ffffff'
                  }}
                  spellCheck="false"
                  autoComplete="off"
                />
                {isLoading && (
                  <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
                )}
              </div>

              {/* Location Predictions */}
              {predictions.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
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
                  <p className="font-medium text-gray-700 mb-2">No locations found for "{searchQuery}"</p>
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
                      <div className="text-gray-500">kilimani, westlands</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Expansion Form */
            <div className="p-6">
              <div className="text-center mb-6">
                <Globe className="w-12 h-12 mx-auto mb-3 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">We're Not in Your Area Yet</h3>
                <p className="text-gray-600">Let us know you're interested, and we'll notify you when we expand to your location!</p>
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
                    placeholder="Tell us why you'd like FoodVrse in your area..."
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
                    Send Interest
                  </Button>
                </div>
              </form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedLocationSearch;
