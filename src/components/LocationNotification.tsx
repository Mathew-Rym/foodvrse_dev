
import { MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';

const LocationNotification = () => {
  const [showNotification, setShowNotification] = useState(false);
  const { latitude, longitude, error, loading, requestLocation } = useGeolocation();

  useEffect(() => {
    // Show notification if location is not available and not loading
    if (!loading && !latitude && !longitude) {
      setShowNotification(true);
    } else if (latitude && longitude) {
      setShowNotification(false);
    }
  }, [latitude, longitude, loading]);

  const handleEnableLocation = () => {
    requestLocation();
  };

  const handleDismiss = () => {
    setShowNotification(false);
  };

  if (!showNotification) return null;

  return (
    <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mx-4 my-2 rounded-r-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <MapPin className="w-5 h-5 text-orange-500" />
          <div>
            <p className="text-sm font-medium text-orange-800">
              Enable location for better deals
            </p>
            <p className="text-xs text-orange-600 mt-1">
              Turn on location access to find the best food deals near you
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            size="sm" 
            onClick={handleEnableLocation}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Enable
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleDismiss}
            className="text-orange-600 hover:text-orange-800"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LocationNotification;
