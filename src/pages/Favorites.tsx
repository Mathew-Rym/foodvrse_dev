import { Heart, MapPin, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MobileLayout from "@/components/MobileLayout";
import { useState } from "react";

const Favorites = () => {
  const [favorites, setFavorites] = useState([
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
      id: 3,
      name: "Healthy U Junction",
      type: "Health Food",
      distance: "0.8 km",
      rating: 4.7,
      savings: "Up to 80%",
      pickup: "4:00 PM - 7:00 PM",
      image: "🥗"
    }
  ]);

  const removeFavorite = (id: number) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  };

  return (
    <MobileLayout>
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">My Favorites</h1>
          <p className="text-gray-600 mt-1">Your saved restaurants and stores</p>
        </div>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <Heart className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 text-center mb-6">
              Start adding your favorite restaurants and stores to see them here
            </p>
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              Discover Places
            </Button>
          </div>
        ) : (
          <div className="p-4">
            <div className="space-y-3">
              {favorites.map((place) => (
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
                          onClick={() => removeFavorite(place.id)}
                          className="p-1 text-red-500"
                        >
                          <Heart className="w-5 h-5 fill-current" />
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
        )}
      </div>
    </MobileLayout>
  );
};

export default Favorites;