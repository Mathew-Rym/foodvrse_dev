
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
import { useTranslation } from 'react-i18next';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isBusinessUser } = useAuth();
  const { totalItems } = useCart();
  const { latitude, longitude } = useGeolocation();
  const [currentLocation, setCurrentLocation] = useState("Nairobi, Kenya");
  const { t } = useTranslation();

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
    if (isBusinessUser) {
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
        {/* Main header row */}
        <div className="flex items-center justify-between h-16 lg:h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">🍽️</span>
            </div>
            <span className="text-xl font-bold text-gray-900">FoodVrse</span>
            <span className="text-xs text-gray-500 hidden lg:block">Good food deserves a second chance</span>
          </div>

          {/* Desktop location and actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <LocationSearch onLocationSelect={handleLocationSelect} />
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className={`w-4 h-4 ${latitude && longitude ? 'text-green-500' : ''}`} />
              <span className="text-sm">{currentLocation}</span>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center space-x-1 text-orange-600 hover:text-orange-700"
              onClick={handleFoodWasteClick}
            >
              <Info className="w-4 h-4" />
              <span>{t('header.aboutFoodWaste')}</span>
            </Button>
            
            {isAuthenticated ? (
              <>
                <CartSheet />
                <Button variant="ghost" size="sm" className="flex items-center space-x-1" onClick={handleProfileClick}>
                  <User className="w-4 h-4" />
                  <span>{isBusinessUser ? t('header.dashboard') : t('header.profile')}</span>
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
                    <span>{t('header.cart')}</span>
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="flex items-center space-x-1" onClick={handleAuthClick}>
                  <User className="w-4 h-4" />
                  <span>{t('header.signIn')}</span>
                </Button>
              </>
            )}
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white whitespace-nowrap"
              onClick={handlePartnerClick}
            >
              {t('header.becomePartner')}
            </Button>
          </div>

          {/* Mobile/Tablet Actions */}
          <div className="flex lg:hidden items-center space-x-2">
            {isAuthenticated ? (
              <>
                <CartSheet />
                <Button variant="ghost" size="sm" className="p-2" onClick={handleProfileClick}>
                  <User className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                {totalItems > 0 && (
                  <Button variant="ghost" size="sm" className="p-2 relative">
                    <ShoppingBag className="w-4 h-4" />
                    <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-5 h-5 flex items-center justify-center p-0">
                      {totalItems}
                    </Badge>
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="p-2" onClick={handleAuthClick}>
                  <User className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile/Tablet expanded content */}
        <div className="lg:hidden border-t border-gray-100 py-3 space-y-3">
          {/* Location row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-600 flex-1">
              <MapPin className={`w-4 h-4 ${latitude && longitude ? 'text-green-500' : ''}`} />
              <span className="text-sm truncate">{currentLocation}</span>
            </div>
            <div className="md:block">
              <LocationSearch onLocationSelect={handleLocationSelect} />
            </div>
          </div>

          {/* Action buttons row */}
          <div className="flex items-center justify-between space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 flex-1"
              onClick={handleFoodWasteClick}
            >
              <Info className="w-4 h-4" />
              <span className="text-xs">{t('header.aboutFoodWaste')}</span>
            </Button>
            
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs whitespace-nowrap px-3"
              onClick={handlePartnerClick}
            >
              {t('header.becomePartner')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
