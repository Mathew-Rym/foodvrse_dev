import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { API_CONFIG } from '@/config/api';

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    position: { lat: number; lng: number };
    title?: string;
    icon?: string;
  }>;
  onMapClick?: (lat: number, lng: number) => void;
  onMarkerClick?: (marker: any) => void;
  className?: string;
  height?: string;
  showControls?: boolean;
  mapType?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  center = { lat: -1.2921, lng: 36.8219 }, // Default to Nairobi, Kenya
  zoom = 15,
  markers = [],
  onMapClick,
  onMarkerClick,
  className = "w-full h-64",
  height = "256px",
  showControls = true,
  mapType = 'roadmap'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapMarkers, setMapMarkers] = useState<google.maps.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current) return;

      try {
        const apiKey = API_CONFIG.GOOGLE_MAPS_API_KEY;
        const loader = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places']
        });

        await loader.load();

        const mapInstance = new google.maps.Map(mapRef.current, {
          center,
          zoom,
          mapTypeId: google.maps.MapTypeId[mapType.toUpperCase() as keyof typeof google.maps.MapTypeId],
          fullscreenControl: showControls,
          mapTypeControl: showControls,
          streetViewControl: showControls,
          zoomControl: showControls,
          scrollwheel: true,
          gestureHandling: 'cooperative'
        });

        setMap(mapInstance);

        // Add click listener
        if (onMapClick) {
          mapInstance.addListener('click', (event: google.maps.MapMouseEvent) => {
            if (event.latLng) {
              onMapClick(event.latLng.lat(), event.latLng.lng());
            }
          });
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load Google Maps');
        setIsLoading(false);
      }
    };

    initializeMap();
  }, []);

  // Update markers when markers prop changes
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    mapMarkers.forEach(marker => marker.setMap(null));
    const newMarkers: google.maps.Marker[] = [];

    // Add new markers
    markers.forEach(markerData => {
      const marker = new google.maps.Marker({
        position: markerData.position,
        map,
        title: markerData.title,
        icon: markerData.icon
      });

      if (onMarkerClick) {
        marker.addListener('click', () => onMarkerClick(marker));
      }

      newMarkers.push(marker);
    });

    setMapMarkers(newMarkers);
  }, [map, markers, onMarkerClick]);

  // Update center when center prop changes
  useEffect(() => {
    if (map && center) {
      map.setCenter(center);
    }
  }, [map, center]);

  // Update zoom when zoom prop changes
  useEffect(() => {
    if (map && zoom) {
      map.setZoom(zoom);
    }
  }, [map, zoom]);

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg"
      />
      
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 bg-red-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMap; 