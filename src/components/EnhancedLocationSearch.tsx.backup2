import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Globe, MapPin, Search, X, Loader2, AlertCircle, Store, Clock, Star } from "lucide-react";
import { API_CONFIG } from '@/config/api';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '@/config/emailjs';
import ReCAPTCHA from 'react-google-recaptcha';
import { RECAPTCHA_CONFIG } from '@/config/recaptcha';
import { supabase } from '@/integrations/supabase/client';

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
  const [showWaitlistForm, setShowWaitlistForm] = useState(false);
  const [expansionFormData, setExpansionFormData] = useState({
    name: '',
    email: '',
    location: '',
    message: ''
  });
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // Mock business deals data (fallback)
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
    },
    {
      id: '4',
      businessName: 'KFC CBD',
      dealTitle: 'Chicken & Sides Mystery Box',
      price: 300,
      originalPrice: 900,
      pickupTime: 'Today: 18:30 - 19:30',
      distance: '0.8 km',
      rating: 4.1,
      image: '🍗',
      category: 'Fast Food',
      location: 'CBD, Nairobi',
      coordinates: { lat: -1.2833, lng: 36.8172 }
    },
    {
      id: '5',
      businessName: 'Subway Westlands',
      dealTitle: 'Sandwich & Drink Combo',
      price: 180,
      originalPrice: 450,
      pickupTime: 'Today: 17:00 - 18:00',
      distance: '1.5 km',
      rating: 4.0,
      image: '🥪',
      category: 'Fast Food',
      location: 'Westlands, Nairobi',
      coordinates: { lat: -1.2650, lng: 36.8200 }
    },
    {
      id: '6',
      businessName: 'Dormans Coffee',
      dealTitle: 'Coffee & Pastry Bundle',
      price: 150,
      originalPrice: 400,
      pickupTime: 'Today: 19:00 - 20:00',
      distance: '2.3 km',
      rating: 4.4,
      image: '☕',
      category: 'Cafe',
      location: 'Kilimani, Nairobi',
      coordinates: { lat: -1.3050, lng: 36.8050 }
    },
    {
      id: '7',
      businessName: 'Chicken Inn CBD',
      dealTitle: 'Chicken & Chips Mystery Pack',
      price: 280,
      originalPrice: 750,
      pickupTime: 'Today: 18:00 - 19:00',
      distance: '1.0 km',
      rating: 4.0,
      image: '🍗',
      category: 'Fast Food',
      location: 'CBD, Nairobi',
      coordinates: { lat: -1.2850, lng: 36.8150 }
    },
    {
      id: '8',
      businessName: 'Cafe Deli Westlands',
      dealTitle: 'Gourmet Sandwich & Salad',
      price: 220,
      originalPrice: 550,
      pickupTime: 'Today: 17:30 - 18:30',
      distance: '0.7 km',
      rating: 4.6,
      image: '🥪',
      category: 'Cafe',
      location: 'Westlands, Nairobi',
      coordinates: { lat: -1.2620, lng: 36.8180 }
    },
    {
      id: '9',
      businessName: 'Pizza Hut Kilimani',
      dealTitle: 'Pizza & Wings Combo',
      price: 400,
      originalPrice: 1100,
      pickupTime: 'Today: 19:30 - 20:30',
      distance: '2.5 km',
      rating: 4.3,
      image: '🍕',
      category: 'Restaurant',
      location: 'Kilimani, Nairobi',
      coordinates: { lat: -1.3080, lng: 36.8020 }
    },
    {
      id: '10',
      businessName: 'Bakers Inn CBD',
      dealTitle: 'Fresh Bread & Pastries',
      price: 120,
      originalPrice: 300,
      pickupTime: 'Today: 18:00 - 19:00',
      distance: '0.9 km',
      rating: 4.2,
      image: '🥐',
      category: 'Bakery',
      location: 'CBD, Nairobi',
      coordinates: { lat: -1.2840, lng: 36.8160 }
    }
  ];

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  }, []);

  // Debug component lifecycle
  useEffect(() => {
    console.log('🔧 EnhancedLocationSearch mounted. isOpen:', isOpen);
    if (isOpen) {
      console.log('🔧 Modal opened, current state:', {
        searchQuery,
        predictions: predictions.length,
        isLoading,
        showDeals,
        selectedLocation
      });
    }
  }, [isOpen, searchQuery, predictions.length, isLoading, showDeals, selectedLocation]);

  // Debug predictions changes
  useEffect(() => {
    console.log('📊 Predictions changed:', predictions.length, predictions);
  }, [predictions]);

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

  // Search locations using Google Maps JavaScript API
  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      setPredictions([]);
      return;
    }

    setIsLoading(true);
    console.log('🔍 Starting search for:', query);
    console.log('🔧 Using Google Maps JavaScript API (not REST API)');
    
    try {
      // Wait for Google Maps API to load
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
      console.log('🔧 Creating AutocompleteService...');

      const service = new window.google.maps.places.AutocompleteService();
      console.log('🔧 AutocompleteService created successfully');
      
      console.log('🔧 Calling getPlacePredictions...');
      service.getPlacePredictions(
        {
          input: query,
          types: ['establishment', 'geocode']
        },
        (predictions, status) => {
          console.log('📊 Google Maps JavaScript API Response:', { status, predictions });
          console.log('🔧 Status comparison:', status, window.google.maps.places.PlacesServiceStatus.OK);
          
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
          {
            placeId: placeId,
            fields: ['geometry', 'formatted_address', 'address_components']
          },
          (place, status) => {
            console.log('📍 Place Details API Response:', { status, place });
            
            if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
              const countryComponent = place.address_components?.find((component: any) =>
                component.types.includes('country')
              );
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

  // Handle search input changes with debouncing
  const handleSearchChange = (value: string) => {
    console.log('🔍 Search input changed:', value);
    setSearchQuery(value);
    
    // Clear previous timeout
    if ((window as any).searchTimeout) {
      clearTimeout((window as any).searchTimeout);
    }
    
    if (value.length > 1) {
      // Debounce search to avoid too many API calls
      (window as any).searchTimeout = setTimeout(() => {
        console.log('🚀 Triggering search for:', value);
        searchLocations(value);
      }, 300); // 300ms delay
    } else {
      console.log('⏹️ Clearing predictions (query too short)');
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
          // Automatically show the waitlist form for non-Kenya locations
          setShowWaitlistForm(true);
          setExpansionFormData(prev => ({
            ...prev,
            location: placeDetails.address
          }));
          setIsLoading(false);
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
        
        // Show success message with deal count
        if (deals.length > 0) {
          toast.success(`Found ${deals.length} deals near ${placeDetails.address}!`);
        } else {
          toast.info(`No deals available in ${placeDetails.address} yet. Check back later!`);
        }
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

  // Handle expansion form submission
  const handleExpansionFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!expansionFormData.name || !expansionFormData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!recaptchaToken) {
      toast.error("Please complete the reCAPTCHA verification");
      return;
    }

    try {
      const templateParams = {
        from_name: expansionFormData.name,
        from_email: expansionFormData.email,
        location: expansionFormData.location,
        message: expansionFormData.message || 'User wants FoodVrse in their area',
        to_email: 'hello@foodvrse.com'
      };

      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      toast.success('Thank you! We\'ll notify you when FoodVrse comes to your area.');
      setShowWaitlistForm(false);
      setExpansionFormData({ name: '', email: '', location: '', message: '' });
      setRecaptchaToken(null);
      recaptchaRef.current?.reset();
      onClose();
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to submit. Please try again.');
    }
  };

  const handleWaitlistFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!expansionFormData.name || !expansionFormData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!recaptchaToken) {
      toast.error("Please complete the reCAPTCHA verification");
      return;
    }

    try {
      const templateParams = {
        from_name: expansionFormData.name,
        from_email: expansionFormData.email,
        location: expansionFormData.location,
        message: expansionFormData.message || 'User wants FoodVrse in their area',
        to_email: 'hello@foodvrse.com'
      };

      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      toast.success('Thank you! We\'ll notify you when FoodVrse comes to your area.');
      setShowWaitlistForm(false);
      setExpansionFormData({ name: '', email: '', location: '', message: '' });
      setRecaptchaToken(null);
      recaptchaRef.current?.reset();
      onClose();
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to submit. Please try again.');
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
    <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal - Positioned at top */}
      <div className="absolute inset-0 flex items-start justify-center p-4 pt-8">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Search Location</h2>
                <p className="text-sm text-gray-600">Find businesses with food offerings near you</p>
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
          </div>

          {/* Content */}
          <div className="p-4 space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto">
            {/* Search Input */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔍 Search for locations to find available businesses and deals
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search location (e.g., Kenyatta Market, Nairobi, Westlands)"
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
                  <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
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
                    className="w-full text-left p-3 hover:bg-green-50 rounded-lg border border-gray-200 transition-colors hover:border-green-300"
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
                        <div key={deal.id} className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white">
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
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl"
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
                <div className="grid grid-cols-2 gap-2 text-sm mb-6">
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
                
                {/* Waitlist Button */}
                <div className="border-t border-gray-200 pt-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Don't see your area? Request FoodVrse to come to your location!
                  </p>
                  <Button
                    onClick={() => {
                      setExpansionFormData(prev => ({ ...prev, location: searchQuery }));
                      setShowWaitlistForm(true);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl"
                  >
                    Request FoodVrse in My Area
                  </Button>
                </div>
                
                <div className="mt-4 text-xs text-gray-400">
                  Debug: Search query: "{searchQuery}", Predictions: {predictions.length}, Loading: {isLoading.toString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

              {/* Waitlist Form Popup */}
        {showWaitlistForm && (
          <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-8">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowWaitlistForm(false)}
          />
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden relative">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">FoodVrse (Mystery Bag)</h2>
                  <p className="text-sm text-gray-600">Is Coming, Will Your Area Be Next?</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowWaitlistForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Form Content */}
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-6">
                Friends and neighbors are already joining the waitlist, don't miss your chance! 
                Request FoodVrse in your area today and unlock exclusive launch perks like 
                first-order discounts and early access meals.
              </p>

              <form onSubmit={handleWaitlistFormSubmit} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={expansionFormData.name}
                    onChange={(e) => setExpansionFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full"
                    required
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={expansionFormData.email}
                    onChange={(e) => setExpansionFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full"
                    required
                  />
                </div>

                {/* Location Field */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Location
                  </label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="Enter your location"
                    value={expansionFormData.location}
                    onChange={(e) => setExpansionFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message (Optional)
                  </label>
                  <textarea
                    id="message"
                    placeholder="Tell us why you'd like FoodVrse in your area..."
                    value={expansionFormData.message}
                    onChange={(e) => setExpansionFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                    rows={3}
                  />
                </div>

                {/* reCAPTCHA */}
                <div className="flex justify-center">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={RECAPTCHA_CONFIG.SITE_KEY}
                    onChange={(token) => setRecaptchaToken(token)}
                    onExpired={() => setRecaptchaToken(null)}
                    onError={() => {
                      setRecaptchaToken(null);
                      toast.error("reCAPTCHA verification failed. Please try again.");
                    }}
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowWaitlistForm(false)}
                    className="flex-1"
                  >
                    Back to Search
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <span className="mr-2">🎁</span>
                    Claim My Spot
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedLocationSearch;
