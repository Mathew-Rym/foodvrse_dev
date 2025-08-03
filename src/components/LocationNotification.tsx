
import { MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';

const LocationNotification = () => {
  const [showNotification, setShowNotification] = useState(false);
  const { latitude, longitude, error, loading, requestLocation } = useGeolocation();

  const shouldShowNotification = () => {
    // Don't show if location is already enabled
    if (latitude && longitude) return false;
    
    // Check if user recently dismissed the notification
    const lastDismissed = localStorage.getItem('location_notification_last_dismissed');
    if (lastDismissed) {
      const now = Date.now();
      const timeSinceLastDismissed = now - parseInt(lastDismissed);
      const cooldownPeriod = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
      
      if (timeSinceLastDismissed < cooldownPeriod) {
        return false;
      }
    }
    
    return true;
  };

  useEffect(() => {
    // Show notification if location is not available, not loading, and cooldown period has passed
    if (!loading && !latitude && !longitude && shouldShowNotification()) {
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
    // Remember when user dismissed the notification
    localStorage.setItem('location_notification_last_dismissed', Date.now().toString());
  };

  if (!showNotification) return null;

  return (
          <div className="bg-brand-light-green border-l-4 border-brand-green p-4 mx-4 my-2 rounded-r-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <MapPin className="w-5 h-5 text-brand-green" />
          <div>
            <p className="text-sm font-medium text-brand-green">
              Enable location for better deals
            </p>
            <p className="text-xs text-brand-green/70 mt-1">
              Turn on location access to find the best food deals near you
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            size="sm" 
            onClick={handleEnableLocation}
            className="bg-brand-green hover:bg-brand-green/90 text-white"
          >
            Enable
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleDismiss}
            className="text-brand-green hover:text-brand-green/80"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LocationNotification;
