import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, MapPin, Search, X, Loader2 } from "lucide-react";
import { loadGoogleMaps } from '@/services/googleMapsLoader';

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

interface AutocompletePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface GoogleLocationSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect?: (location: Location) => void;
  title?: string;
  description?: string;
  placeholder?: string;
}

const GoogleLocationSearch: React.FC<GoogleLocationSearchProps> = ({
  isOpen,
  onClose,
  onLocationSelect,
  title = "Search Location",
  description = "Search for any location worldwide using Google Places API",
  placeholder = "Enter location, address, or landmark..."
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState<AutocompletePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);

  // Initialize Google Maps API
  useEffect(() => {
    if (isOpen) {
      initializeGoogleMaps();
    }
  }, [isOpen]);

  const initializeGoogleMaps = async () => {
    if (!mapRef.current) return;

    try {
      // Load Google Maps API using centralized loader
      await loadGoogleMaps({ libraries: ['places'] });

      // Initialize services
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      
      // Initialize map
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: { lat: -1.2921, lng: 36.8219 }, // Nairobi
        zoom: 10,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      // Initialize places service
      placesService.current = new window.google.maps.places.PlacesService(mapInstance);
      
      setMap(mapInstance);
    } catch (error) {
      console.error('Failed to load Google Maps in location search:', error);
    }
  };

  // Search for locations
  const searchLocations = async (query: string) => {
    if (!query.trim() || !autocompleteService.current) {
      setPredictions([]);
      return;
    }

    setIsLoading(true);
    
    try {
      autocompleteService.current.getPlacePredictions(
        {
          input: query,
          types: ['geocode', 'establishment'],
          // Removed country restrictions to allow searching all places worldwide
        },
        (predictions, status) => {
          setIsLoading(false);
          
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setPredictions(predictions as AutocompletePrediction[]);
          } else {
            setPredictions([]);
            console.log('No predictions found for:', query);
          }
        }
      );
    } catch (error) {
      setIsLoading(false);
      console.error('Error searching locations:', error);
      setPredictions([]);
    }
  };

  // Handle search input changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setSelectedLocation(null);
    
    if (value.length > 2) {
      searchLocations(value);
    } else {
      setPredictions([]);
    }
  };

  // Handle location selection
  const handleLocationSelect = async (prediction: AutocompletePrediction) => {
    if (!placesService.current) return;

    // Get place details to fetch geometry
    placesService.current.getDetails(
      { placeId: prediction.place_id },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          const location: Location = {
            place_id: prediction.place_id,
            description: prediction.description,
            structured_formatting: prediction.structured_formatting,
            geometry: place.geometry ? {
              location: {
                lat: place.geometry.location!.lat(),
                lng: place.geometry.location!.lng()
              }
            } : undefined
          };

          setSelectedLocation(location);
          setSearchQuery(location.description);
          setPredictions([]);
          
          // Update map
          if (map && location.geometry) {
            const position = location.geometry.location;
            map.setCenter(position);
            map.setZoom(15);
            
            // Add or update marker
            if (marker) {
              marker.setMap(null);
            }
            
            const newMarker = new window.google.maps.Marker({
              position,
              map,
              title: location.description,
              animation: window.google.maps.Animation.DROP,
            });
            
            setMarker(newMarker);
          }
        }
      }
    );
  };

  // Handle final selection
  const handleConfirmSelection = () => {
    if (selectedLocation && onLocationSelect) {
      onLocationSelect(selectedLocation);
      onClose();
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
    setPredictions([]);
    setSelectedLocation(null);
    if (marker) {
      marker.setMap(null);
      setMarker(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4 pt-8">
      <Card className="w-full max-w-4xl h-[90vh] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-600" />
              <CardTitle>{title}</CardTitle>
            </div>
            <Button variant="ghost" onClick={onClose} size="sm">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600">{description}</p>
        </CardHeader>
        
        <CardContent className="flex-1 p-4 space-y-4">
          {/* Search Input */}
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              </div>
            )}
          </div>

          {/* Search Results */}
          {predictions.length > 0 && (
            <div className="max-h-48 overflow-y-auto border rounded-lg">
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

          {/* Map */}
          <div className="flex-1 border rounded-lg overflow-hidden">
            <div ref={mapRef} className="w-full h-full min-h-[300px]" />
          </div>

          {/* Selected Location Info */}
          {selectedLocation && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-green-600" />
                <span className="font-medium text-sm">Selected Location:</span>
              </div>
              <p className="text-sm text-gray-700">{selectedLocation.description}</p>
              <div className="mt-2 flex gap-2">
                <Button
                  onClick={handleConfirmSelection}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Confirm Selection
                </Button>
                <Button
                  onClick={handleClearSearch}
                  variant="outline"
                  size="sm"
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleLocationSearch; 