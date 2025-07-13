
import { Home, Search, Trophy, User, Heart } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';

const MobileNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { isBusinessUser } = useAuth();
  const { t } = useTranslation();

  // Don't show navigation for business users
  if (isBusinessUser) {
    return null;
  }

  const tabs = [
    { id: "home", label: t('nav.home'), icon: Home, path: "/" },
    { id: "discover", label: t('nav.discover'), icon: Search, path: "/discover" },
    { id: "impact", label: t('nav.impact'), icon: Trophy, path: "/impact" },
    { id: "favorites", label: t('nav.favorites'), icon: Heart, path: "/favorites" },
    { id: "profile", label: t('nav.profile'), icon: User, path: "/profile" },
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
