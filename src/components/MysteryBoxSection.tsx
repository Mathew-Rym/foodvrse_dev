
import { useState } from "react";
import { Sparkles, Clock, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { MysteryBagDetailPopup } from "./MysteryBagDetailPopup";

const MysteryBoxSection = () => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedBag, setSelectedBag] = useState<any>(null);
  const [showDetailPopup, setShowDetailPopup] = useState(false);

  const mysteryBoxes = [
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
      location: "Westlands",
      address: "Sarit Centre, Westlands Road",
      website: "https://javahouse.co.ke",
      itemsLeft: 4,
      rating: 4.6,
      reviewCount: 171,
      category: "Breakfast & Coffee",
      description: "The Mystery Bag 🛍️: Rescue a selection of goodies from the nation's favourite coffee shop! ☕ You can expect to receive a mixture of pastries, sandwiches, and sweet treats 🥪🧁..."
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
      location: "Karen",
      address: "Karen Shopping Centre, Karen Road",
      website: "https://artcaffe.co.ke",
      itemsLeft: 2,
      rating: 4.4,
      reviewCount: 89,
      category: "Bread & Pastries",
      description: "The Mystery Bag 🛍️: Rescue a selection of goodies from Kenya's premium bakery! 🥖 You can expect to receive a mixture of fresh bread, cakes, and sweet treats 🍰🧁..."
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
      location: "Kilimani",
      address: "Yaya Centre, Kilimani Road",
      website: "https://healthyu.co.ke",
      itemsLeft: 6,
      rating: 4.8,
      reviewCount: 245,
      category: "Healthy Food",
      description: "The Mystery Bag 🛍️: Rescue a selection of healthy goodies! 🥗 You can expect to receive a mixture of fresh salads, smoothies, and nutritious snacks 🥤🥕..."
    }
  ];

  const handleGetMysteryBox = (box: any) => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    setSelectedBag(box);
    setShowDetailPopup(true);
  };

  const handleViewAllMysteryBoxes = () => {
    navigate("/mystery-boxes");
  };

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Mystery Bags
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-green mb-4">
            Surprise Yourself, Save More
          </h2>
          <p className="text-lg text-brand-green/80 max-w-2xl mx-auto">
            Get premium meals at unbeatable prices with our mystery bags. 
            You'll always get more value than what you pay!
          </p>
        </div>

        {/* Mystery Boxes Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {mysteryBoxes.map((box, index) => (
            <div key={index} className="bg-card rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
              {/* Header with gradient */}
              <div className={`bg-gradient-to-r ${box.gradient} p-6 text-white relative`}>
                <div className="absolute top-4 right-4">
                  <Gift className="w-6 h-6 opacity-80" />
                </div>
                <h3 className="font-bold text-xl mb-1">{box.title}</h3>
                <p className="text-white/90 text-sm">{box.vendor}</p>
                <div className="mt-4">
                  <span className="text-2xl font-bold">KSh {box.price}</span>
                  <p className="text-white/80 text-sm">Value: {box.originalValue}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{box.pickup}</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">What's Inside:</p>
                    <p className="text-foreground font-medium">{box.items}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    70-80% Savings
                  </Badge>
                  <Badge variant="outline" className="text-purple-600 border-purple-200">
                    Surprise Inside
                  </Badge>
                </div>

                <Button 
                  className="w-full bg-brand-yellow text-brand-green font-semibold hover:bg-brand-yellow/90 group-hover:scale-105 transition-transform"
                  onClick={() => handleGetMysteryBox(box)}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Mystery Bag
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button 
            size="lg"
            variant="outline"
            onClick={handleViewAllMysteryBoxes}
            className="border-brand-green text-brand-green hover:bg-brand-light-green"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            View All Mystery Bags
          </Button>
        </div>

        {/* How it Works */}
        <div className="bg-card rounded-2xl shadow-sm p-8 mt-12">
          <h3 className="text-xl font-bold text-foreground text-center mb-8">How Mystery Bags Work</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                1
              </div>
              <h4 className="font-semibold text-foreground mb-2">Choose Your Location</h4>
              <p className="text-muted-foreground text-sm">Select from available stores with mystery bags near you</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                2
              </div>
              <h4 className="font-semibold text-foreground mb-2">Pay & Reserve</h4>
              <p className="text-muted-foreground text-sm">Secure your mystery bag with instant payment</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                3
              </div>
              <h4 className="font-semibold text-foreground mb-2">Pickup & Enjoy</h4>
              <p className="text-muted-foreground text-sm">Collect your surprise meal during pickup window</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mystery Bag Detail Popup */}
      {selectedBag && (
        <MysteryBagDetailPopup
          isOpen={showDetailPopup}
          onClose={() => setShowDetailPopup(false)}
          bag={selectedBag}
        />
      )}
    </section>
  );
};

export default MysteryBoxSection;
