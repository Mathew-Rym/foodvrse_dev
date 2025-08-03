
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  const shouldShowLocationToast = () => {
    const lastShown = localStorage.getItem('location_toast_last_shown');
    if (!lastShown) return true;
    
    const now = Date.now();
    const timeSinceLastShown = now - parseInt(lastShown);
    const cooldownPeriod = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    return timeSinceLastShown > cooldownPeriod;
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser.',
        loading: false,
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        });
        
        // Only show toast if enough time has passed since last shown
        if (shouldShowLocationToast()) {
          toast.success('Location enabled! Now showing deals near you.');
          localStorage.setItem('location_toast_last_shown', Date.now().toString());
        }
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }

        setLocation(prev => ({
          ...prev,
          error: errorMessage,
          loading: false,
        }));
        
        toast.error(errorMessage, {
          action: {
            label: 'Try Again',
            onClick: requestLocation,
          },
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  return { ...location, requestLocation };
};
