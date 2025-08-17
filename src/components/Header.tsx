
import { User, MapPin, Info, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import CartSheet from "./CartSheet";
import EnhancedLocationSearch from "./EnhancedLocationSearch";
import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import Logo from "./Logo";
import { API_CONFIG } from '@/config/api';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isBusinessUser } = useAuth();
  const { totalItems } = useCart();
  const { latitude, longitude } = useGeolocation();
  const [currentLocation, setCurrentLocation] = useState("Nairobi, Kenya");
  const [isLocationSearchOpen, setIsLocationSearchOpen] = useState(false);
  const { t } = useTranslation();

  // Update location display when geolocation is available
  useEffect(() => {
    if (latitude && longitude) {
      // Reverse geocode coordinates to get readable address
      reverseGeocode(latitude, longitude);
    }
  }, [latitude, longitude]);

  // Reverse geocode coordinates to get readable address
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_CONFIG.GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const address = data.results[0].formatted_address;
        // Extract city and country for cleaner display
        const addressParts = address.split(', ');
        if (addressParts.length >= 2) {
          const city = addressParts[0];
          const country = addressParts[addressParts.length - 1];
          setCurrentLocation(`${city}, ${country}`);
        } else {
          setCurrentLocation(address);
        }
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      // Fallback to coordinates if geocoding fails
      setCurrentLocation(`${lat.toFixed(3)}, ${lng.toFixed(3)}`);
    }
  };

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
    setIsLocationSearchOpen(false);
    console.log('Selected location:', location);
  };

  // Listen for location search events from other components
  useEffect(() => {
    const handleOpenLocationSearch = () => {
      setIsLocationSearchOpen(true);
    };

    window.addEventListener('openLocationSearch', handleOpenLocationSearch);
    
    return () => {
      window.removeEventListener('openLocationSearch', handleOpenLocationSearch);
    };
  }, []);

  return (
    <header className="bg-brand-green shadow-sm border-b border-brand-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main header row */}
        <div className="flex items-center justify-between h-16 lg:h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 flex-shrink-0 min-w-0">
            <Logo size="md" className="flex-shrink-0" />
            <span className="text-lg sm:text-xl font-bold text-white truncate">FoodVrse</span>
            <span className="text-xs text-white/90 hidden lg:block truncate">Good food deserves a second chance</span>
          </div>

          {/* Desktop location and actions */}
          <div className="hidden lg:flex items-center space-x-4 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 text-white/90 hover:text-white"
              onClick={() => setIsLocationSearchOpen(true)}
            >
              <MapPin className={`w-4 h-4 flex-shrink-0 ${latitude && longitude ? 'text-green-500' : ''}`} />
              <span className="text-sm truncate">{currentLocation}</span>
            </Button>
            <EnhancedLocationSearch 
              isOpen={isLocationSearchOpen}
              onClose={() => setIsLocationSearchOpen(false)}
              onLocationSelect={handleLocationSelect}
            />
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center space-x-1 text-brand-yellow hover:text-brand-yellow/80"
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
                <Button 
                  size="sm" 
                  className="bg-brand-yellow text-brand-green flex items-center space-x-1 hover:bg-brand-green hover:text-white transition-all duration-200" 
                  onClick={handleAuthClick}
                >
                  <User className="w-4 h-4" />
                  <span>{t('header.signIn')}</span>
                </Button>
              </>
            )}
            <Button 
              id="become-partner-button"
              variant="outline"
              size="sm" 
              className="border-gray-300 text-gray-700 bg-white whitespace-nowrap hover:bg-gray-50 transition-all duration-200"
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
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-800"
                onClick={() => setIsLocationSearchOpen(true)}
              >
                Change
              </Button>
            </div>
          </div>
          <EnhancedLocationSearch 
            isOpen={isLocationSearchOpen}
            onClose={() => setIsLocationSearchOpen(false)}
            onLocationSelect={handleLocationSelect}
          />

          {/* Action buttons row */}
          <div className="flex items-center justify-between space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
                              className="flex items-center space-x-1 text-brand-yellow hover:text-brand-yellow/80 flex-1"
              onClick={handleFoodWasteClick}
            >
              <Info className="w-4 h-4" />
              <span className="text-xs">{t('header.aboutFoodWaste')}</span>
            </Button>
            
            <Button 
              id="become-partner-button-mobile"
              variant="outline"
              size="sm" 
              className="border-gray-300 text-gray-700 bg-white text-xs whitespace-nowrap px-3 hover:bg-gray-50 transition-all duration-200"
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
