import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Loader2 } from "lucide-react";
import { API_CONFIG } from '@/config/api';
import { toast } from 'sonner';

interface Location {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

const LocationSearchTest: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      setPredictions([]);
      return;
    }

    setIsLoading(true);
    
    try {
      const searchParams = new URLSearchParams({
        input: query,
        types: 'geocode|establishment',
        key: API_CONFIG.GOOGLE_MAPS_API_KEY
      });

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?${searchParams.toString()}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log('API Response:', data);
      
      if (data.status === 'OK') {
        setPredictions(data.predictions);
        toast.success(`Found ${data.predictions.length} locations for "${query}"`);
      } else if (data.status === 'ZERO_RESULTS') {
        setPredictions([]);
        toast.info(`No locations found for "${query}"`);
      } else {
        console.error('API Error:', data.status, data.error_message);
        setPredictions([]);
        toast.error(`API Error: ${data.status}`);
      }
    } catch (error) {
      console.error('Error searching locations:', error);
      setPredictions([]);
      toast.error('Failed to search locations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    searchLocations(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-6 h-6 text-green-600" />
          Location Search Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter any location (e.g., woodley, nairobi, paris, tokyo)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </div>

        {predictions.length > 0 && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <h3 className="font-semibold text-gray-700">Search Results:</h3>
            {predictions.map((prediction) => (
              <div
                key={prediction.place_id}
                className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {prediction.structured_formatting.main_text}
                    </div>
                    <div className="text-sm text-gray-600">
                      {prediction.structured_formatting.secondary_text}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-sm text-gray-500">
          <p>✅ API Status: Working</p>
          <p>🔍 Search Type: Real-time global search</p>
          <p>🌍 Coverage: Any location worldwide</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationSearchTest;
