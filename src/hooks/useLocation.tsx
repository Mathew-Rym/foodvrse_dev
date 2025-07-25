import { useState, useEffect } from 'react';

interface LocationData {
  lat: number;
  lng: number;
  address?: string;
}

interface UseLocationReturn {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  requestLocation: () => void;
  setManualLocation: (location: LocationData) => void;
}

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try to get saved location from localStorage
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        setLocation(JSON.parse(savedLocation));
      } catch (e) {
        console.error('Failed to parse saved location:', e);
      }
    }
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const locationData = { lat: latitude, lng: longitude };

        try {
          // Try to get address from coordinates using reverse geocoding
          // In a real app, you'd use Google Maps or another geocoding service
          const address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          const fullLocationData = { ...locationData, address };
          
          setLocation(fullLocationData);
          localStorage.setItem('userLocation', JSON.stringify(fullLocationData));
        } catch (e) {
          setLocation(locationData);
          localStorage.setItem('userLocation', JSON.stringify(locationData));
        }
        
        setLoading(false);
      },
      (error) => {
        let errorMessage = 'Unable to retrieve location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location services.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        
        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const setManualLocation = (newLocation: LocationData) => {
    setLocation(newLocation);
    localStorage.setItem('userLocation', JSON.stringify(newLocation));
    setError(null);
  };

  return {
    location,
    loading,
    error,
    requestLocation,
    setManualLocation
  };
};