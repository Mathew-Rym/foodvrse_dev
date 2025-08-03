
import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface LocationSearchProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
}

const LocationSearch = ({ onLocationSelect }: LocationSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{
    id: string;
    address: string;
    lat: number;
    lng: number;
  }>>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Enhanced mock locations with global coverage
  const mockLocations = [
    // Kenya
    { id: '1', address: 'Westlands, Nairobi, Kenya', lat: -1.2634, lng: 36.8084 },
    { id: '2', address: 'Karen, Nairobi, Kenya', lat: -1.3195, lng: 36.6829 },
    { id: '3', address: 'Kilimani, Nairobi, Kenya', lat: -1.2913, lng: 36.7895 },
    { id: '4', address: 'CBD, Nairobi, Kenya', lat: -1.2921, lng: 36.8219 },
    { id: '5', address: 'Kileleshwa, Nairobi, Kenya', lat: -1.2696, lng: 36.7879 },
    { id: '6', address: 'Mombasa, Kenya', lat: -4.0435, lng: 39.6682 },
    { id: '7', address: 'Kisumu, Kenya', lat: -0.1022, lng: 34.7617 },
    
    // Global Cities
    { id: '8', address: 'Shibuya, Tokyo, Japan', lat: 35.6598, lng: 139.7006 },
    { id: '9', address: 'Manhattan, New York, USA', lat: 40.7831, lng: -73.9712 },
    { id: '10', address: 'Camden, London, UK', lat: 51.5392, lng: -0.1426 },
    { id: '11', address: 'Marais, Paris, France', lat: 48.8566, lng: 2.3522 },
    { id: '12', address: 'Kreuzberg, Berlin, Germany', lat: 52.4987, lng: 13.4180 },
    { id: '13', address: 'Trastevere, Rome, Italy', lat: 41.8896, lng: 12.4695 },
    { id: '14', address: 'Barrio Gótico, Barcelona, Spain', lat: 41.3825, lng: 2.1769 },
    { id: '15', address: 'Chinatown, Singapore', lat: 1.2812, lng: 103.8440 },
    { id: '16', address: 'Bondi, Sydney, Australia', lat: -33.8915, lng: 151.2767 },
    { id: '17', address: 'Copacabana, Rio de Janeiro, Brazil', lat: -22.9707, lng: -43.1823 },
    { id: '18', address: 'Cape Town, South Africa', lat: -33.9249, lng: 18.4241 },
    { id: '19', address: 'Bandra, Mumbai, India', lat: 19.0596, lng: 72.8295 },
    { id: '20', address: 'Gangnam, Seoul, South Korea', lat: 37.4979, lng: 127.0276 },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);

    if (query.length > 2) {
      // Enhanced filtering that matches city, district, or country
      const filtered = mockLocations.filter(location =>
        location.address.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 8)); // Limit to 8 results
    } else {
      setSuggestions([]);
    }
    
    setIsSearching(false);
  };

  const handleLocationSelect = (location: typeof mockLocations[0]) => {
    setSearchQuery(location.address);
    setSuggestions([]);
    onLocationSelect({
      lat: location.lat,
      lng: location.lng,
      address: location.address,
    });
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search: Westlands, Tokyo, London..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-4 w-64"
        />
      </div>

      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1 max-h-64 overflow-y-auto">
          {suggestions.map((location) => (
            <button
              key={location.id}
              onClick={() => handleLocationSelect(location)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center space-x-2 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <MapPin className="w-4 h-4 text-brand-green flex-shrink-0" />
              <span className="text-sm text-gray-700">{location.address}</span>
            </button>
          ))}
        </div>
      )}

      {searchQuery.length > 2 && suggestions.length === 0 && !isSearching && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1">
          <div className="px-4 py-3 text-sm text-gray-500">
            No locations found. Try searching for a city or district name.
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
