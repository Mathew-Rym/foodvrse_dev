import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Star, Clock, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { loadGoogleMaps } from '@/services/googleMapsLoader';
import { toast } from 'sonner';

interface Business {
  id: string;
  business_name: string;
  business_type: string;
  location: string;
  latitude: number;
  longitude: number;
  rating: number;
  address: string;
  phone?: string;
  website?: string;
  is_active: boolean;
  mystery_bags?: Array<{
    id: string;
    title: string;
    price: number;
    original_price: number;
    pickup_start_time: string;
    pickup_end_time: string;
    items_left: number;
  }>;
  distance?: string;
}

interface InteractiveMapProps {
  userLocation: { lat: number; lng: number; address: string };
  onBusinessSelect?: (business: Business) => void;
  onLocationChange?: (location: { lat: number; lng: number; address: string }) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  userLocation,
  onBusinessSelect,
  onLocationChange
}) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);

  // Mock businesses for fallback
  const mockBusinesses: Business[] = [
    {
      id: '1',
      business_name: 'Java House Westlands',
      business_type: 'Cafe',
      location: 'Westlands, Nairobi',
      latitude: -1.2641,
      longitude: 36.8156,
      rating: 4.5,
      address: 'Westlands Road, Nairobi',
      is_active: true,
      mystery_bags: [
        {
          id: '1',
          title: 'Mystery Bag - Fresh Pastries & Coffee',
          price: 250,
          original_price: 800,
          pickup_start_time: '17:30',
          pickup_end_time: '18:00',
          items_left: 4
        }
      ]
    },
    {
      id: '2',
      business_name: 'Artcaffe Sarit',
      business_type: 'Bakery',
      location: 'Sarit Centre, Nairobi',
      latitude: -1.2921,
      longitude: 36.8219,
      rating: 4.3,
      address: 'Sarit Centre, Nairobi',
      is_active: true,
      mystery_bags: [
        {
          id: '2',
          title: 'Pastry Surprise Bag',
          price: 200,
          original_price: 600,
          pickup_start_time: '18:00',
          pickup_end_time: '19:00',
          items_left: 2
        }
      ]
    },
    {
      id: '3',
      business_name: 'Pizza Inn Kilimani',
      business_type: 'Restaurant',
      location: 'Kilimani, Nairobi',
      latitude: -1.3000,
      longitude: 36.8000,
      rating: 4.2,
      address: 'Kilimani Road, Nairobi',
      is_active: true,
      mystery_bags: [
        {
          id: '3',
          title: 'Pizza & Sides Mystery Box',
          price: 350,
          original_price: 1200,
          pickup_start_time: '19:00',
          pickup_end_time: '20:00',
          items_left: 3
        }
      ]
    },
    {
      id: '4',
      business_name: 'KFC CBD',
      business_type: 'Fast Food',
      location: 'CBD, Nairobi',
      latitude: -1.2833,
      longitude: 36.8172,
      rating: 4.1,
      address: 'Moi Avenue, Nairobi',
      is_active: true,
      mystery_bags: [
        {
          id: '4',
          title: 'Chicken & Sides Mystery Box',
          price: 300,
          original_price: 900,
          pickup_start_time: '18:30',
          pickup_end_time: '19:30',
          items_left: 5
        }
      ]
    }
  ];

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return;

      try {
        // Load Google Maps API using centralized loader
        await loadGoogleMaps({ libraries: ['places'] });

        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: { lat: userLocation.lat, lng: userLocation.lng },
          zoom: 13,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
          styles: [
            {
              featureType: 'poi.business',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        setMap(mapInstance);

        // Add user location marker
        new window.google.maps.Marker({
          position: { lat: userLocation.lat, lng: userLocation.lng },
          map: mapInstance,
          title: 'Your Location',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="8" fill="#4F46E5" stroke="white" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" fill="white"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(24, 24),
            anchor: new window.google.maps.Point(12, 12)
          }
        });

        setLoading(false);
      } catch (error) {
        console.error('Failed to load Google Maps:', error);
        toast.error('Failed to load map. Please refresh the page.');
        setLoading(false);
      }
    };

    initMap();
  }, [userLocation]);

  // Fetch businesses from Supabase
  useEffect(() => {
    fetchBusinesses();
  }, [userLocation]);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      // Try to fetch real businesses from Supabase
      const { data, error } = await supabase
        .from('business_profiles')
        .select(`
          id,
          business_name,
          location,
          latitude,
          longitude,
          address,
          phone,
          website_url,
          description,
          business_logo_url,
          created_at,
          updated_at
        `)
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (error) {
        console.error('Error fetching businesses:', error);
        // Use mock data as fallback
        setBusinesses(mockBusinesses);
      } else if (data && data.length > 0) {
        // Calculate distances and format data
        const businessesWithDistance = data.map(business => ({
          ...business,
          business_type: 'restaurant', // Default type since category might not exist
          rating: 4.5, // Default rating since average_rating might not exist
          website: business.website_url || '',
          is_active: true, // Default to active since status might not exist
          mystery_bags: [], // We'll fetch these separately if needed
          distance: calculateDistance(
            userLocation.lat,
            userLocation.lng,
            business.latitude as number || 0,
            business.longitude as number || 0
          ).toFixed(1) + ' km'
        }));
        setBusinesses(businessesWithDistance);
      } else {
        // Use mock data if no real data
        setBusinesses(mockBusinesses);
      }
    } catch (error) {
      console.error('Error in fetchBusinesses:', error);
      setBusinesses(mockBusinesses);
    } finally {
      setLoading(false);
    }
  };

  // Add business markers to map
  useEffect(() => {
    if (!map || businesses.length === 0) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));

    const newMarkers = businesses.map(business => {
      const marker = new window.google.maps.Marker({
        position: { lat: business.latitude, lng: business.longitude },
        map: map,
        title: business.business_name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" fill="#10B981" stroke="white" stroke-width="2"/>
              <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">
                ${getBusinessIcon(business.business_type)}
              </text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 16)
        }
      });

      // Add click listener
      marker.addListener('click', () => {
        setSelectedBusiness(business);
        onBusinessSelect?.(business);
      });

      return marker;
    });

    setMarkers(newMarkers);

    // Fit map to show all markers
    if (newMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      newMarkers.forEach(marker => bounds.extend(marker.getPosition()!));
      map.fitBounds(bounds);
    }
  }, [map, businesses]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getBusinessIcon = (businessType: string): string => {
    const icons: { [key: string]: string } = {
      'restaurant': '🍽️',
      'cafe': '☕',
      'bakery': '🥐',
      'fast_food': '🍔',
      'pizza': '🍕',
      'coffee': '☕',
      'juice': '🥤',
      'dessert': '🍰',
      'default': '🏪'
    };
    return icons[businessType?.toLowerCase()] || icons.default;
  };

  const handleBusinessClick = (business: Business) => {
    setSelectedBusiness(business);
    onBusinessSelect?.(business);
  };

  const handleCloseBusinessInfo = () => {
    setSelectedBusiness(null);
  };

  // Show fallback view if Google Maps is not available
  if (!map) {
    return (
      <div className="relative w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center p-6">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Map View Unavailable</h3>
          <p className="text-gray-600 mb-4">Google Maps API key not configured. Showing business list instead.</p>
          
          {/* Business List Fallback */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Nearby Businesses ({businesses.length})</h3>
              <div className="space-y-3">
                {businesses.map((business) => (
                  <button
                    key={business.id}
                    onClick={() => handleBusinessClick(business)}
                    className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm">
                        {getBusinessIcon(business.business_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{business.business_name}</div>
                        <div className="text-sm text-gray-600 truncate">{business.address}</div>
                        <div className="text-xs text-gray-500">{business.business_type}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">{business.distance}</div>
                        <div className="text-xs text-gray-500">{business.rating} ★</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg"
        style={{ minHeight: '400px' }}
      />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading businesses...</p>
          </div>
        </div>
      )}

      {/* Business Info Panel */}
      {selectedBusiness && (
        <div className="absolute top-4 left-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 max-w-sm">
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-lg">
                  {getBusinessIcon(selectedBusiness.business_type)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedBusiness.business_name}</h3>
                  <p className="text-sm text-gray-600">{selectedBusiness.business_type}</p>
                </div>
              </div>
              <button
                onClick={handleCloseBusinessInfo}
                className="text-gray-400 hover:text-gray-600"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-3 h-3" />
                <span>{selectedBusiness.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span>{selectedBusiness.rating} rating</span>
              </div>
              {selectedBusiness.distance && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-3 h-3" />
                  <span>{selectedBusiness.distance} away</span>
                </div>
              )}
            </div>

            {selectedBusiness.mystery_bags && selectedBusiness.mystery_bags.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Available Deals</h4>
                {selectedBusiness.mystery_bags.map((bag) => (
                  <div key={bag.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-medium text-gray-900">{bag.title}</h5>
                      <Badge variant="secondary" className="text-xs">
                        {bag.items_left} left
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-green-600">KSh {bag.price}</span>
                        <span className="text-gray-500 line-through">KSh {bag.original_price}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{bag.pickup_start_time} - {bag.pickup_end_time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => {
                  // Navigate to business details or order page
                  toast.success(`Viewing ${selectedBusiness.business_name}`);
                }}
              >
                View Deals
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  // Get directions
                  const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedBusiness.latitude},${selectedBusiness.longitude}`;
                  window.open(url, '_blank');
                }}
              >
                Directions
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Business List Panel */}
      <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 max-h-48 overflow-y-auto">
        <div className="p-3">
          <h3 className="font-semibold text-gray-900 mb-2">Nearby Businesses ({businesses.length})</h3>
          <div className="space-y-2">
            {businesses.slice(0, 3).map((business) => (
              <button
                key={business.id}
                onClick={() => handleBusinessClick(business)}
                className="w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-sm">
                    {getBusinessIcon(business.business_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{business.business_name}</div>
                    <div className="text-sm text-gray-600 truncate">{business.address}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">{business.distance}</div>
                    <div className="text-xs text-gray-500">{business.rating} ★</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
