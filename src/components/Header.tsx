
import { ShoppingBag, User, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
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

          {/* Location */}
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Nairobi, Kenya</span>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="flex items-center space-x-1">
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              Become a Partner
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
