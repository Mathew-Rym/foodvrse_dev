import { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface GoogleMapsSearchProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
}

// Enhanced global locations for better search experience
const worldLocations = [
  // Africa
  { id: '1', address: 'Westlands, Nairobi, Kenya', lat: -1.2634, lng: 36.8084, country: 'Kenya' },
  { id: '2', address: 'Karen, Nairobi, Kenya', lat: -1.3195, lng: 36.6829, country: 'Kenya' },
  { id: '3', address: 'CBD, Nairobi, Kenya', lat: -1.2921, lng: 36.8219, country: 'Kenya' },
  { id: '4', address: 'Mombasa, Kenya', lat: -4.0435, lng: 39.6682, country: 'Kenya' },
  { id: '5', address: 'Cape Town, South Africa', lat: -33.9249, lng: 18.4241, country: 'South Africa' },
  { id: '6', address: 'Lagos, Nigeria', lat: 6.5244, lng: 3.3792, country: 'Nigeria' },
  { id: '7', address: 'Cairo, Egypt', lat: 30.0444, lng: 31.2357, country: 'Egypt' },
  
  // Asia
  { id: '8', address: 'Shibuya, Tokyo, Japan', lat: 35.6598, lng: 139.7006, country: 'Japan' },
  { id: '9', address: 'Gangnam, Seoul, South Korea', lat: 37.4979, lng: 127.0276, country: 'South Korea' },
  { id: '10', address: 'Bandra, Mumbai, India', lat: 19.0596, lng: 72.8295, country: 'India' },
  { id: '11', address: 'Chinatown, Singapore', lat: 1.2812, lng: 103.8440, country: 'Singapore' },
  { id: '12', address: 'Central, Hong Kong', lat: 22.2908, lng: 114.1501, country: 'Hong Kong' },
  { id: '13', address: 'Sukhumvit, Bangkok, Thailand', lat: 13.7563, lng: 100.5018, country: 'Thailand' },
  
  // Europe
  { id: '14', address: 'Camden, London, UK', lat: 51.5392, lng: -0.1426, country: 'United Kingdom' },
  { id: '15', address: 'Marais, Paris, France', lat: 48.8566, lng: 2.3522, country: 'France' },
  { id: '16', address: 'Kreuzberg, Berlin, Germany', lat: 52.4987, lng: 13.4180, country: 'Germany' },
  { id: '17', address: 'Trastevere, Rome, Italy', lat: 41.8896, lng: 12.4695, country: 'Italy' },
  { id: '18', address: 'Barrio Gótico, Barcelona, Spain', lat: 41.3825, lng: 2.1769, country: 'Spain' },
  { id: '19', address: 'Jordaan, Amsterdam, Netherlands', lat: 52.3676, lng: 4.8832, country: 'Netherlands' },
  
  // Americas
  { id: '20', address: 'Manhattan, New York, USA', lat: 40.7831, lng: -73.9712, country: 'United States' },
  { id: '21', address: 'Hollywood, Los Angeles, USA', lat: 34.0928, lng: -118.3287, country: 'United States' },
  { id: '22', address: 'Downtown, Toronto, Canada', lat: 43.6532, lng: -79.3832, country: 'Canada' },
  { id: '23', address: 'Copacabana, Rio de Janeiro, Brazil', lat: -22.9707, lng: -43.1823, country: 'Brazil' },
  { id: '24', address: 'Palermo, Buenos Aires, Argentina', lat: -34.5875, lng: -58.4067, country: 'Argentina' },
  
  // Oceania
  { id: '25', address: 'Bondi, Sydney, Australia', lat: -33.8915, lng: 151.2767, country: 'Australia' },
  { id: '26', address: 'CBD, Melbourne, Australia', lat: -37.8136, lng: 144.9631, country: 'Australia' },
  { id: '27', address: 'Viaduct Harbour, Auckland, New Zealand', lat: -36.8485, lng: 174.7633, country: 'New Zealand' },
];

const GoogleMapsSearch = ({ onLocationSelect }: GoogleMapsSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<typeof worldLocations>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchQuery.length > 2) {
      setIsSearching(true);
      
      // Enhanced search that matches city, district, or country
      const filtered = worldLocations.filter(location => {
        const query = searchQuery.toLowerCase();
        return (
          location.address.toLowerCase().includes(query) ||
          location.country.toLowerCase().includes(query)
        );
      });
      
      setSuggestions(filtered.slice(0, 8));
      setIsSearching(false);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleLocationSelect = (location: typeof worldLocations[0]) => {
    setSearchQuery(location.address);
    setSuggestions([]);
    onLocationSelect({
      lat: location.lat,
      lng: location.lng,
      address: location.address,
    });
  };

  const getDisplayName = (location: typeof worldLocations[0]) => {
    // Return the full address with proper formatting
    return location.address;
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search cities worldwide: London, Tokyo, Nairobi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 w-full"
        />
      </div>

      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1 max-h-64 overflow-y-auto">
          {suggestions.map((location) => (
            <button
              key={location.id}
              onClick={() => handleLocationSelect(location)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center space-x-3 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-sm text-gray-700 block">{getDisplayName(location)}</span>
                <span className="text-xs text-gray-500">{location.country}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {searchQuery.length > 2 && suggestions.length === 0 && !isSearching && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1">
          <div className="px-4 py-3 text-sm text-gray-500">
            No locations found. Try searching for a major city or country name.
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMapsSearch;