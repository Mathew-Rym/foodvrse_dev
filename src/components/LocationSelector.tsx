import { useState, useEffect, useRef } from "react";
import { X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface LocationSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: { lat: number; lng: number; address: string; distance: number }) => void;
  currentLocation?: { lat: number; lng: number; address: string };
}

export const LocationSelector = ({ isOpen, onClose, onLocationSelect, currentLocation }: LocationSelectorProps) => {
  const [distance, setDistance] = useState([7]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(currentLocation || {
    lat: -1.2921,
    lng: 36.8219,
    address: "Nairobi, Kenya"
  });
  const mapRef = useRef<HTMLDivElement>(null);

  // Initialize Google Maps (placeholder implementation)
  useEffect(() => {
    if (!isOpen || !mapRef.current) return;

    // This would initialize the actual Google Maps
    // For now, it's a placeholder
  }, [isOpen]);

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: "Current Location"
          };
          setSelectedLocation(newLocation);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const handleApply = () => {
    onLocationSelect({
      ...selectedLocation,
      distance: distance[0]
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto p-0 max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">Choose Location</DialogTitle>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Choose a location to see what's available</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Map View */}
        <div className="h-64 bg-gray-100 relative">
          <div ref={mapRef} className="w-full h-full">
            {/* Placeholder map - would be replaced with actual Google Maps */}
            <div className="flex items-center justify-center h-full bg-gray-200">
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                <p className="text-sm text-gray-600">Map View</p>
                <p className="text-xs text-gray-500">{selectedLocation.address}</p>
              </div>
            </div>
          </div>
          
          {/* Center pin */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <MapPin className="w-8 h-8 text-gray-800" />
          </div>

          {/* Store markers (placeholder) */}
          <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            3
          </div>
          <div className="absolute top-3/4 right-1/4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            5
          </div>
          <div className="absolute bottom-1/4 left-1/3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            2
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Distance slider */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">Select a distance</h3>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">{distance[0]} km</div>
              <Slider
                value={distance}
                onValueChange={setDistance}
                min={1}
                max={50}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Search */}
          <div className="space-y-2">
            <Input
              placeholder="Search for a city"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Use current location */}
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-blue-600 hover:text-blue-700"
            onClick={handleUseCurrentLocation}
          >
            <MapPin className="w-4 h-4" />
            Use my current location
          </Button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <Button className="w-full bg-black text-white" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};