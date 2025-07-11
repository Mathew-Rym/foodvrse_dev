
import { Search, Filter, MapPin, Heart, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MobileLayout from "@/components/MobileLayout";
import GoogleMapsSearch from "@/components/GoogleMapsSearch";
import { useState } from "react";

const Discover = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [currentLocation, setCurrentLocation] = useState({
    address: "Nairobi, Kenya",
    lat: -1.2921,
    lng: 36.8219
  });

  const categories = [
    { name: "Restaurants", count: 24, color: "bg-orange-100 text-orange-600", emoji: "🍽️" },
    { name: "Bakeries", count: 12, color: "bg-yellow-100 text-yellow-600", emoji: "🥖" },
    { name: "Grocery", count: 8, color: "bg-green-100 text-green-600", emoji: "🛒" },
    { name: "Cafes", count: 15, color: "bg-blue-100 text-blue-600", emoji: "☕" },
  ];

  const nearbyPlaces = [
    {
      id: 1,
      name: "Java House Westlands",
      type: "Restaurant",
      distance: "0.5 km",
      rating: 4.5,
      savings: "Up to 70%",
      pickup: "5:00 PM - 8:00 PM",
      image: "🍕"
    },
    {
      id: 2,
      name: "Artcaffe Sarit",
      type: "Cafe & Bakery",
      distance: "1.2 km",
      rating: 4.3,
      savings: "Up to 60%",
      pickup: "6:00 PM - 9:00 PM",
      image: "🥐"
    },
    {
      id: 3,
      name: "Healthy U Junction",
      type: "Health Food",
      distance: "0.8 km",
      rating: 4.7,
      savings: "Up to 80%",
      pickup: "4:00 PM - 7:00 PM",
      image: "🥗"
    }
  ];

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
    // Implement search functionality
  };

  const handleFilter = () => {
    console.log("Opening filters");
    // Implement filter functionality
  };

  const handleCategoryClick = (category: string) => {
    console.log("Selected category:", category);
    // Implement category filtering
  };

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setCurrentLocation(location);
    console.log("Location selected:", location);
  };

  return (
    <MobileLayout>
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search food, restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <Button variant="outline" size="sm" onClick={handleFilter}>
              <Filter className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Location Search */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <GoogleMapsSearch onLocationSelect={handleLocationSelect} />
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4 text-green-500" />
            <span className="text-sm">{currentLocation.address}</span>
          </div>
        </div>

        {/* Categories */}
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Browse Categories</h2>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-3`}>
                  <span className="text-lg">{category.emoji}</span>
                </div>
                <h3 className="font-medium text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count} nearby</p>
              </button>
            ))}
          </div>
        </div>

        {/* Nearby Places */}
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Near You</h2>
          <div className="space-y-3">
            {nearbyPlaces.map((place) => (
              <div key={place.id} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                    {place.image}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{place.name}</h3>
                        <p className="text-sm text-gray-600">{place.type}</p>
                      </div>
                      <button
                        onClick={() => toggleFavorite(place.id)}
                        className={`p-1 ${favorites.includes(place.id) ? 'text-red-500' : 'text-gray-400'}`}
                      >
                        <Heart className={`w-5 h-5 ${favorites.includes(place.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{place.distance}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span>{place.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{place.pickup}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <Badge className="bg-green-100 text-green-600">{place.savings}</Badge>
                      <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                        View Deals
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Searches */}
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Searches</h2>
          <div className="flex flex-wrap gap-2">
            {["Pizza", "Burgers", "Sushi", "Healthy", "Desserts", "Coffee"].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-3 py-1 border border-gray-300 rounded-full text-sm hover:bg-orange-50 hover:border-orange-300"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Discover;
