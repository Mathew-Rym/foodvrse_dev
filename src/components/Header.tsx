
import { User, MapPin, Info, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import CartSheet from "./CartSheet";
import LocationSearch from "./LocationSearch";
import { useState, useEffect } from "react";

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { totalItems } = useCart();
  const { latitude, longitude } = useGeolocation();
  const [currentLocation, setCurrentLocation] = useState("Nairobi, Kenya");

  // Update location display when geolocation is available
  useEffect(() => {
    if (latitude && longitude) {
      // In a real app, you'd reverse geocode these coordinates
      setCurrentLocation(`${latitude.toFixed(3)}, ${longitude.toFixed(3)}`);
    }
  }, [latitude, longitude]);

  const handlePartnerClick = () => {
    navigate("/partner-application");
  };

  const handleAuthClick = () => {
    navigate("/auth");
  };

  const handleProfileClick = () => {
    // Check if user is a business user and redirect accordingly
    if (user?.isPartner) {
      navigate("/business-dashboard");
    } else {
      navigate("/profile");
    }
  };

  const handleFoodWasteClick = () => {
    navigate("/food-waste");
  };

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setCurrentLocation(location.address);
    console.log('Selected location:', location);
  };

  return (
    <header className="bg-white shadow-sm border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">🍽️</span>
            </div>
            <span className="text-xl font-bold text-gray-900">FoodVrse</span>
            <span className="text-xs text-gray-500 hidden sm:block">Good food deserves a second chance</span>
          </div>

          {/* Location with Search */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <LocationSearch onLocationSelect={handleLocationSelect} />
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className={`w-4 h-4 ${latitude && longitude ? 'text-green-500' : ''}`} />
              <span className="text-sm">{currentLocation}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center space-x-1 text-orange-600 hover:text-orange-700"
              onClick={handleFoodWasteClick}
            >
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">About Food Waste</span>
            </Button>
            
            {isAuthenticated ? (
              <>
                <CartSheet />
                <Button variant="ghost" size="sm" className="flex items-center space-x-1" onClick={handleProfileClick}>
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user?.isPartner ? 'Dashboard' : 'Profile'}</span>
                </Button>
              </>
            ) : (
              <>
                {totalItems > 0 && (
                  <Button variant="ghost" size="sm" className="flex items-center space-x-1 relative">
                    <ShoppingBag className="w-4 h-4" />
                    <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-5 h-5 flex items-center justify-center p-0">
                      {totalItems}
                    </Badge>
                    <span className="hidden sm:inline">Cart</span>
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="flex items-center space-x-1" onClick={handleAuthClick}>
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              </>
            )}
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white"
              onClick={handlePartnerClick}
            >
              Become a Partner
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
