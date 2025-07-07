
import { Home, Search, ShoppingBag, Trophy, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

const MobileNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { isBusinessUser } = useAuth();

  // Don't show navigation for business users
  if (isBusinessUser) {
    return null;
  }

  const tabs = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    { id: "discover", label: "Discover", icon: Search, path: "/discover" },
    { id: "cart", label: "Cart", icon: ShoppingBag, path: "/cart" },
    { id: "impact", label: "Impact", icon: Trophy, path: "/impact" },
    { id: "profile", label: "Profile", icon: User, path: "/profile" },
  ];

  const handleTabClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb z-50">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.path)}
              className={`flex flex-col items-center justify-center px-3 py-2 min-w-0 flex-1 transition-colors relative ${
                isActive 
                  ? "text-orange-500" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon 
                className={`w-6 h-6 mb-1 ${isActive ? "text-orange-500" : "text-gray-500"}`}
              />
              {tab.id === "cart" && totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-5 h-5 flex items-center justify-center p-0">
                  {totalItems}
                </Badge>
              )}
              <span className={`text-xs font-medium truncate ${
                isActive ? "text-orange-500" : "text-gray-500"
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;
