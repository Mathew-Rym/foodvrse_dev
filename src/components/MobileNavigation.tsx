
import { Home, Search, ShoppingBag, Trophy, User } from "lucide-react";
import { useState } from "react";

const MobileNavigation = () => {
  const [activeTab, setActiveTab] = useState("home");

  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "discover", label: "Discover", icon: Search },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "impact", label: "Impact", icon: Trophy },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb z-50">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center px-3 py-2 min-w-0 flex-1 transition-colors ${
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
