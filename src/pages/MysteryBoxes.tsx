
import { Sparkles, Clock, Gift, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MobileLayout from "@/components/MobileLayout";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const MysteryBoxes = () => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const allMysteryBoxes = [
    {
      id: 101,
      vendor: "Java House",
      title: "Breakfast Surprise",
      originalValue: "KSh 800-1200",
      price: 350,
      originalPrice: 900,
      pickup: "7:00 AM - 10:00 AM",
      items: "Pastries, Coffee & Light Meal",
      gradient: "from-amber-400 to-orange-500",
      location: "Westlands"
    },
    {
      id: 102,
      vendor: "Artcaffe",
      title: "Baker's Choice",
      originalValue: "KSh 600-900",
      price: 250,
      originalPrice: 700,
      pickup: "5:00 PM - 7:00 PM",
      items: "Fresh Bread, Cakes & Treats",
      gradient: "from-pink-400 to-red-500",
      location: "Sarit Centre"
    },
    {
      id: 103,
      vendor: "Healthy U",
      title: "Wellness Box",
      originalValue: "KSh 1000-1500",
      price: 450,
      originalPrice: 1200,
      pickup: "12:00 PM - 3:00 PM",
      items: "Salads, Smoothies & Snacks",
      gradient: "from-green-400 to-emerald-500",
      location: "Junction Mall"
    },
    {
      id: 104,
      vendor: "KFC",
      title: "Chicken Feast",
      originalValue: "KSh 1200-1800",
      price: 500,
      originalPrice: 1400,
      pickup: "6:00 PM - 8:00 PM",
      items: "Chicken Pieces, Fries & Drinks",
      gradient: "from-red-400 to-orange-500",
      location: "Garden City"
    },
    {
      id: 105,
      vendor: "Dormans Coffee",
      title: "Coffee & Treats",
      originalValue: "KSh 500-800",
      price: 200,
      originalPrice: 600,
      pickup: "3:00 PM - 6:00 PM",
      items: "Coffee, Pastries & Sandwiches",
      gradient: "from-brown-400 to-amber-500",
      location: "Karen"
    },
    {
      id: 106,
      vendor: "Pizza Inn",
      title: "Pizza Mystery",
      originalValue: "KSh 1000-1400",
      price: 400,
      originalPrice: 1100,
      pickup: "7:00 PM - 9:00 PM",
      items: "Pizza Slices & Sides",
      gradient: "from-yellow-400 to-red-500",
      location: "City Centre"
    }
  ];

  const handleGetMysteryBox = (box: any) => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    const cartItem = {
      id: box.id,
      title: box.title,
      vendor: box.vendor,
      price: box.price,
      originalPrice: box.originalPrice,
      pickup: box.pickup
    };

    addToCart(cartItem);
    console.log("Added mystery box to cart:", box.title);
  };

  return (
    <MobileLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 pb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4">
          <div className="flex items-center gap-3 mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/discover")}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Mystery Boxes</h1>
              <p className="text-white/90 text-sm">Surprise yourself, save more</p>
            </div>
            <Sparkles className="w-6 h-6 ml-auto" />
          </div>
        </div>

        {/* Mystery Boxes Grid */}
        <div className="p-4 space-y-4">
          {allMysteryBoxes.map((box) => (
            <div key={box.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
              {/* Header with gradient */}
              <div className={`bg-gradient-to-r ${box.gradient} p-4 text-white relative`}>
                <div className="absolute top-4 right-4">
                  <Gift className="w-5 h-5 opacity-80" />
                </div>
                <h3 className="font-bold text-lg mb-1">{box.title}</h3>
                <p className="text-white/90 text-sm">{box.vendor} • {box.location}</p>
                <div className="mt-3">
                  <span className="text-xl font-bold">KSh {box.price}</span>
                  <p className="text-white/80 text-xs">Value: {box.originalValue}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{box.pickup}</span>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">What's Inside:</p>
                  <p className="text-gray-700 font-medium text-sm">{box.items}</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-green-600 border-green-200 text-xs">
                    {Math.round(((box.originalPrice - box.price) / box.originalPrice) * 100)}% Savings
                  </Badge>
                  <Badge variant="outline" className="text-purple-600 border-purple-200 text-xs">
                    Surprise Inside
                  </Badge>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                  onClick={() => handleGetMysteryBox(box)}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Mystery Box
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default MysteryBoxes;
