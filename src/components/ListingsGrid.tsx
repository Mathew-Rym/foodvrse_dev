import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Clock, MapPin, Star, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface ListingsGridProps {
  pickupTimeFilter?: 'now' | 'later';
  showSoldOut?: boolean;
  limit?: number;
  userLocation?: { lat: number; lng: number };
  distanceFilter?: number;
  showNoItemsMessage?: boolean;
  showAllItems?: boolean;
}

export const ListingsGrid: React.FC<ListingsGridProps> = ({
  pickupTimeFilter,
  showSoldOut = true,
  limit,
  userLocation,
  distanceFilter,
  showNoItemsMessage = true,
  showAllItems = false
}) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [listings, setListings] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const mockListings = [
    {
      id: "1",
      name: "Chicken Burger",
      originalPrice: 800,
      price: 240,
      quantity: 5,
      vendor: "Java House",
      pickup: "5:00 PM - 8:00 PM",
      location: "Westlands",
      rating: 4.5,
      distance: "0.5 km",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      category: "Burgers"
    },
    {
      id: "2",
      name: "Coffee & Cake",
      originalPrice: 600,
      price: 180,
      quantity: 3,
      vendor: "Artcaffe",
      pickup: "6:00 PM - 9:00 PM",
      location: "CBD",
      rating: 4.3,
      distance: "1.2 km",
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop",
      category: "Beverages"
    },
    {
      id: "3",
      name: "Pasta Carbonara",
      originalPrice: 1200,
      price: 480,
      quantity: 2,
      vendor: "Pizza Place",
      pickup: "7:00 PM - 10:00 PM",
      location: "Kilimani",
      rating: 4.7,
      distance: "2.1 km",
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop",
      category: "Pasta"
    },
    {
      id: "4",
      name: "Croissant",
      originalPrice: 200,
      price: 80,
      quantity: 8,
      vendor: "Bakery Corner",
      pickup: "4:00 PM - 7:00 PM",
      location: "Lavington",
      rating: 4.2,
      distance: "1.8 km",
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop",
      category: "Bakery"
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      let filteredListings = [...mockListings];

      // Apply pickup time filter
      if (pickupTimeFilter === 'now') {
        filteredListings = filteredListings.filter(item => 
          item.pickup.includes('5:00') || item.pickup.includes('6:00')
        );
      } else if (pickupTimeFilter === 'later') {
        filteredListings = filteredListings.filter(item => 
          item.pickup.includes('7:00') || item.pickup.includes('8:00')
        );
      }

      // Apply sold out filter
      if (!showSoldOut) {
        filteredListings = filteredListings.filter(item => item.quantity > 0);
      }

      // Apply limit
      if (limit && !showAllItems) {
        filteredListings = filteredListings.slice(0, limit);
      }

      setListings(filteredListings);
      setLoading(false);
    }, 500);
  }, [pickupTimeFilter, showSoldOut, limit, showAllItems]);

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleAddToCart = (item: any) => {
    if (!user) {
      toast.error('Please log in to add items to cart');
      return;
    }

    if (item.quantity <= 0) {
      toast.error('This item is sold out');
      return;
    }

    addToCart({
      ...item,
      quantity: 1
    });
    toast.success(`${item.name} added to cart`);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (listings.length === 0 && showNoItemsMessage) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingCart className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
        <p className="text-gray-600">Try adjusting your filters or check back later for new listings.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {listings.map((item) => (
        <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative">
            <img 
              src={item.image} 
              alt={item.name}
              className="w-full h-48 object-cover"
            />
            <button
              onClick={() => toggleFavorite(item.id)}
              className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
                favorites.includes(item.id) 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
              }`}
            >
              <Heart className="w-4 h-4" fill={favorites.includes(item.id) ? 'currentColor' : 'none'} />
            </button>
            {item.quantity <= 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive">Sold Out</Badge>
              </div>
            )}
          </div>
          
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-sm line-clamp-2">{item.name}</h3>
              <Badge variant="outline" className="text-xs">{item.category}</Badge>
            </div>
            
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
              <MapPin className="w-3 h-3" />
              <span>{item.location}</span>
              <span>•</span>
              <span>{item.distance}</span>
            </div>
            
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{item.rating}</span>
              <span>•</span>
              <Clock className="w-3 h-3" />
              <span>{item.pickup}</span>
            </div>
            
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-green-600">KSh {item.price}</span>
                <span className="text-sm text-gray-500 line-through">KSh {item.originalPrice}</span>
              </div>
              <span className="text-xs text-gray-500">{item.quantity} left</span>
            </div>
            
            <Button 
              onClick={() => handleAddToCart(item)}
              disabled={item.quantity <= 0}
              className="w-full"
              size="sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {item.quantity <= 0 ? 'Sold Out' : 'Add to Cart'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ListingsGrid;
