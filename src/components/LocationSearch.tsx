
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, MapPin, Search, X, Loader2, AlertCircle } from "lucide-react";
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

interface LocationSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  isOpen,
  onClose,
  onLocationSelect
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showExpansionForm, setShowExpansionForm] = useState(false);
  const [expansionFormData, setExpansionFormData] = useState({
    name: '',
    email: '',
    location: '',
    message: ''
  });

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  }, []);

  // Auto-focus search input when modal opens
  useEffect(() => {
    if (isOpen) {
      // Reset form when opening
      setSearchQuery('');
      setPredictions([]);
      setShowExpansionForm(false);
      
      // Focus the search input after a short delay to ensure DOM is ready
      const timer = setTimeout(() => {
        const searchInput = document.querySelector('input[placeholder*="location"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Search for locations using Google Places API
  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      setPredictions([]);
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&types=geocode|establishment&key=${API_CONFIG.GOOGLE_MAPS_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK') {
        setPredictions(data.predictions);
      } else {
        setPredictions([]);
        console.log('No predictions found for:', query);
      }
    } catch (error) {
      console.error('Error searching locations:', error);
      setPredictions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Get place details including coordinates
  const getPlaceDetails = async (placeId: string): Promise<{ lat: number; lng: number; address: string; country: string } | null> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,formatted_address,address_components&key=${API_CONFIG.GOOGLE_MAPS_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.result) {
        const { geometry, formatted_address, address_components } = data.result;
        
        // Extract country from address components
        const countryComponent = address_components?.find((component: any) => 
          component.types.includes('country')
        );
        const country = countryComponent?.long_name || '';
        
        return {
          lat: geometry.location.lat,
          lng: geometry.location.lng,
          address: formatted_address,
          country
        };
      }
    } catch (error) {
      console.error('Error getting place details:', error);
    }
    
    return null;
  };

  // Handle search input changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
    if (value.length > 2) {
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
        
        // Location is in Kenya, proceed normally
        if (onLocationSelect) {
          onLocationSelect({
            lat: placeDetails.lat,
            lng: placeDetails.lng,
            address: placeDetails.address
          });
        }
        onClose();
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
        toast.success("Thank you! We'll contact you when we expand to your area.");
        setShowExpansionForm(false);
        onClose();
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending expansion form:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4 pt-8">
      <Card className="w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col mt-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-600" />
              <CardTitle>Search Location</CardTitle>
            </div>
            <Button variant="ghost" onClick={onClose} size="sm">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            Search for any location in Kenya
          </p>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-hidden flex flex-col">
          {!showExpansionForm ? (
            <>
              {/* Search Input - Always visible at top */}
              <div className="relative mb-4 flex-shrink-0 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🔍 Search for your location
                </label>
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Enter location, address, or landmark..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-12 pr-4 py-3 text-base border-2 border-gray-300 bg-white shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:ring-opacity-50 hover:border-gray-400 transition-all duration-200"
                  style={{
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#ffffff'
                  }}
                />
                {isLoading && (
                  <Loader2 className="absolute right-6 top-1/2 transform -translate-y-1/2 w-5 h-5 animate-spin text-green-500" />
                )}
              </div>

              {/* Search Results - Scrollable area */}
              <div className="flex-1 overflow-y-auto">
                {predictions.length > 0 && (
                  <div className="border rounded-lg">
                    {predictions.map((prediction) => (
                      <button
                        key={prediction.place_id}
                        onClick={() => handleLocationSelect(prediction)}
                        className="w-full p-3 text-left hover:bg-gray-50 border-b last:border-b-0 flex items-start gap-3"
                      >
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-sm">
                            {prediction.structured_formatting.main_text}
                          </div>
                          <div className="text-xs text-gray-500">
                            {prediction.structured_formatting.secondary_text}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {searchQuery && predictions.length === 0 && !isLoading && (
                  <div className="text-center text-gray-500 py-4">
                    No locations found for "{searchQuery}"
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Expansion Form */
            <div className="space-y-4 overflow-y-auto">
              <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900">We're not available in your area yet!</h3>
                  <p className="text-sm text-blue-700">
                    We're currently only available in Kenya, but we're expanding! Let us know you're interested and help us spread the word.
                  </p>
                </div>
              </div>

              <form onSubmit={handleExpansionSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    type="text"
                    value={expansionFormData.name}
                    onChange={(e) => setExpansionFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    value={expansionFormData.email}
                    onChange={(e) => setExpansionFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Your Location</label>
                  <Input
                    type="text"
                    value={expansionFormData.location}
                    onChange={(e) => setExpansionFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="City, Country"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Message (Optional)</label>
                  <textarea
                    value={expansionFormData.message}
                    onChange={(e) => setExpansionFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Tell us about your interest in FoodVrse or any suggestions..."
                    className="w-full p-3 border border-gray-300 rounded-md resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowExpansionForm(false)}
                    className="flex-1"
                  >
                    Back to Search
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
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

export default LocationSearch;
