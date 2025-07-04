
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

  // Mock locations for demo - in real app, you'd use a geocoding service
  const mockLocations = [
    { id: '1', address: 'Westlands, Nairobi', lat: -1.2634, lng: 36.8084 },
    { id: '2', address: 'Karen, Nairobi', lat: -1.3195, lng: 36.6829 },
    { id: '3', address: 'Kilimani, Nairobi', lat: -1.2913, lng: 36.7895 },
    { id: '4', address: 'CBD, Nairobi', lat: -1.2921, lng: 36.8219 },
    { id: '5', address: 'Kileleshwa, Nairobi', lat: -1.2696, lng: 36.7879 },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);

    if (query.length > 2) {
      // Filter mock locations based on search query
      const filtered = mockLocations.filter(location =>
        location.address.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
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
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1">
          {suggestions.map((location) => (
            <button
              key={location.id}
              onClick={() => handleLocationSelect(location)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center space-x-2 border-b border-gray-100 last:border-b-0"
            >
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700">{location.address}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
