/// <reference types="@types/google.maps" />
import { useState, useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Search, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from '@/lib/supabaseClient';
import { toast } from "sonner";
import { API_CONFIG } from "@/config/api";

interface GoogleMapsLocationPickerProps {
  businessId: string;
  currentLocation?: { lat: number; lng: number; address: string };
  onLocationUpdate: (location: { lat: number; lng: number; address: string }) => void;
}

const GoogleMapsLocationPicker = ({ 
  businessId, 
  currentLocation, 
  onLocationUpdate 
}: GoogleMapsLocationPickerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(currentLocation);
  const [showAddressSelector, setShowAddressSelector] = useState(false);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        // Use the centralized API configuration
        const apiKey = API_CONFIG.GOOGLE_MAPS_API_KEY;
        await loadMap(apiKey);
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        toast.error('Failed to load Google Maps. Please check your API key.');
        setIsLoading(false);
      }
    };

    const loadMap = async (apiKey: string) => {
      if (!mapRef.current) return;

      const loader = new Loader({
        apiKey,
        version: 'weekly',
        libraries: ['places']
      });

      try {
        await loader.load();
        
        // Default location or current location
        const defaultLocation = currentLocation || { lat: -1.2921, lng: 36.8219 }; // Nairobi, Kenya
        
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: defaultLocation,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
        });

        setMap(mapInstance);

        // Create initial marker
        const markerInstance = new google.maps.Marker({
          position: defaultLocation,
          map: mapInstance,
          draggable: true,
          title: 'Your Business Location'
        });

        setMarker(markerInstance);

        // Handle marker drag
        markerInstance.addListener('dragend', () => {
          const position = markerInstance.getPosition();
          if (position) {
            const lat = position.lat();
            const lng = position.lng();
            reverseGeocode(lat, lng);
          }
        });

        // Handle map click
        mapInstance.addListener('click', (event: google.maps.MapMouseEvent) => {
          if (event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            markerInstance.setPosition({ lat, lng });
            reverseGeocode(lat, lng);
          }
        });

        setIsLoading(false);
        
        // If current location exists, reverse geocode to get address
        if (currentLocation) {
          reverseGeocode(currentLocation.lat, currentLocation.lng);
        }

      } catch (error) {
        console.error('Error loading Google Maps:', error);
        toast.error('Failed to load Google Maps. Please check your API key.');
        setIsLoading(false);
      }
    };

    initializeMap();
  }, [businessId, currentLocation]);

  const reverseGeocode = async (lat: number, lng: number) => {
    if (!window.google) return;

    const geocoder = new google.maps.Geocoder();
    try {
      const response = await geocoder.geocode({ location: { lat, lng } });
      if (response.results[0]) {
        const address = response.results[0].formatted_address;
        setSelectedLocation({ lat, lng, address });
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  const handleSearch = async () => {
    if (!map || !searchValue.trim()) return;

    const service = new google.maps.places.PlacesService(map);
    const request = {
      query: searchValue,
      fields: ['name', 'geometry', 'formatted_address'],
    };

    service.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results?.[0]) {
        const place = results[0];
        if (place.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const address = place.formatted_address || searchValue;

          map.setCenter({ lat, lng });
          map.setZoom(17);
          
          if (marker) {
            marker.setPosition({ lat, lng });
          }
          
          setSelectedLocation({ lat, lng, address });
        }
      } else {
        toast.error('Location not found. Please try a different search term.');
      }
    });
  };

  const handleSaveLocation = async () => {
    if (!selectedLocation) {
      toast.error('Please select a location on the map');
      return;
    }

    try {
      const { error } = await supabase
        .from('business_profiles')
        .update({
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lng,
          address: selectedLocation.address,
          location: selectedLocation.address
        })
        .eq('id', businessId);

      if (error) throw error;

      onLocationUpdate(selectedLocation);
      toast.success('Business location updated successfully!');
    } catch (error) {
      console.error('Error saving location:', error);
      toast.error('Failed to save location');
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Set Business Location</h3>
        </div>
        
        <p className="text-sm text-gray-600">
          Set your business location so customers can find you easily. This location will be used for all your listings.
        </p>

        {/* Search Input */}
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search for your business address..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch} variant="outline">
            <Search className="w-4 h-4" />
          </Button>
          <Button 
            onClick={() => setShowAddressSelector(!showAddressSelector)} 
            variant="outline"
            className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
          >
            <Globe className="w-4 h-4" />
          </Button>
        </div>

        {/* Address Selection Iframe */}
        {showAddressSelector && (
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-green-50 p-3 border-b">
              <h4 className="font-medium text-green-800">Advanced Address Selection</h4>
              <p className="text-sm text-green-600">Use Google's address selection tool for precise location picking</p>
            </div>
            <div className="h-96">
              <iframe 
                src="https://storage.googleapis.com/maps-solutions-pafyahvhtl/address-selection/1zko/address-selection.html"
                width="100%" 
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                title="Address Selection"
              />
            </div>
          </div>
        )}

        {/* Map Container */}
        <div className="relative">
          <div 
            ref={mapRef} 
            className="w-full h-64 rounded-lg border"
            style={{ minHeight: '256px' }}
          />
          {isLoading && (
            <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading map...</p>
              </div>
            </div>
          )}
        </div>

        {/* Selected Location Info */}
        {selectedLocation && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-blue-800 mb-1">Selected Location:</p>
            <p className="text-sm text-blue-600">{selectedLocation.address}</p>
            <p className="text-xs text-blue-500 mt-1">
              Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
            </p>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">
            Click on the map or drag the marker to adjust the location
          </p>
          <Button 
            onClick={handleSaveLocation}
            disabled={!selectedLocation}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save Location
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default GoogleMapsLocationPicker;