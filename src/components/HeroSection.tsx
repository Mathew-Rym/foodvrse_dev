import { Leaf, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import VideoSection from "./VideoSection";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartSaving = () => {
    navigate("/auth");
  };

  const handleForBusinesses = () => {
    // For now, open business dashboard for any logged in user
    if (user) {
      navigate("/business-dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <section className="bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 py-8 lg:py-20 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 lg:space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Save Food,
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500"> Save Money</span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
                Discover surplus meals and near-expiry items from local restaurants and stores. 
                Help reduce food waste while enjoying delicious meals at up to 70% off.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-2 mx-auto">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">12K+</p>
                <p className="text-xs sm:text-sm text-gray-600">Meals Saved</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-2 mx-auto">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">2.5T</p>
                <p className="text-xs sm:text-sm text-gray-600">CO₂ Saved</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-2 mx-auto">
                  <DollarSign className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">KSh 580K</p>
                <p className="text-xs sm:text-sm text-gray-600">Money Saved</p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm sm:text-base px-6 sm:px-8 py-3"
                onClick={handleStartSaving}
              >
                Start Saving Food
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-sm sm:text-base px-6 sm:px-8 py-3"
                onClick={handleForBusinesses}
              >
                For Businesses
              </Button>
            </div>
          </div>

          {/* Visual */}
          <div className="relative order-first lg:order-last">
            <VideoSection />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
