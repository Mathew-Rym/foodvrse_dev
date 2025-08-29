import { Home, Search, Award, User, Heart } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

const MobileNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { isAuthenticated, isBusinessUser } = useAuth();
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true); // Always visible for now
  const [lastScrollY, setLastScrollY] = useState(0);

  // Show/hide navigation based on scroll direction
  // useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navigation when scrolling up or at top
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else {
        // Hide navigation when scrolling down (but not at top)
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  // }, [lastScrollY]);

  if (isBusinessUser || !isAuthenticated) {
    return null;
  }

  const tabs = [
    { id: "home", label: t('nav.home'), icon: Home, path: "/" },
    { id: "discover", label: t('nav.discover'), icon: Search, path: "/discover" },
    { id: "impact", label: t('nav.impact'), icon: Award, path: "/gamification" },
    { id: "favorites", label: t('nav.favorites'), icon: Heart, path: "/favorites" },
    { id: "profile", label: t('nav.profile'), icon: User, path: "/profile" },
  ];

  const handleTabClick = (path: string) => {
    navigate(path);
  };

  return (
    <>
      {/* Fixed navigation bar that shows/hides based on scroll */}
      <div 
        id="mobile-navigation" 
        className={`fixed bottom-0 left-0 right-0 bg-brand-green border-t border-brand-green safe-area-pb z-[9999] shadow-lg transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
        style={{
          paddingBottom: 'env(safe-area-inset-bottom, 0px)'
        }}
      >
        <div className="flex items-center justify-around py-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.path)}
                className={`flex flex-col items-center justify-center px-3 py-3 min-w-0 flex-1 transition-colors relative ${
                  isActive 
                    ? "text-brand-yellow" 
                    : "text-white/80 hover:text-white"
                }`}
              >
                <Icon 
                  className={`w-6 h-6 mb-1 ${isActive ? "text-brand-yellow" : "text-white/80"}`}
                />
                <span className={`text-xs font-medium truncate ${
                  isActive ? "text-brand-yellow" : "text-white/80"
                }`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;
