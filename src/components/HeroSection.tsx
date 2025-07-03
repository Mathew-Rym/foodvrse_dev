
import { Leaf, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleStartSaving = () => {
    navigate("/auth");
  };

  return (
    <section className="bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Save Food,
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500"> Save Money</span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
                Discover surplus meals and near-expiry items from local restaurants and stores. 
                Help reduce food waste while enjoying delicious meals at up to 70% off.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-2 mx-auto">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">12K+</p>
                <p className="text-sm text-gray-600">Meals Saved</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-2 mx-auto">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">2.5T</p>
                <p className="text-sm text-gray-600">CO₂ Saved</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-2 mx-auto">
                  <DollarSign className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">KSh 580K</p>
                <p className="text-sm text-gray-600">Money Saved</p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-base px-8 py-3"
                onClick={handleStartSaving}
              >
                Start Saving Food
              </Button>
              <Button variant="outline" size="lg" className="text-base px-8 py-3">
                For Businesses
              </Button>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-4 shadow-lg">
                  <div className="w-full h-32 bg-gradient-to-br from-orange-200 to-red-200 rounded-lg mb-3"></div>
                  <h3 className="font-semibold text-sm">Pizza Mystery Box</h3>
                  <p className="text-xs text-gray-600">Java House</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-green-600 font-bold">KSh 300</span>
                    <span className="text-xs line-through text-gray-400">KSh 1000</span>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-lg">
                  <div className="w-full h-24 bg-gradient-to-br from-green-200 to-yellow-200 rounded-lg mb-3"></div>
                  <h3 className="font-semibold text-sm">Fresh Salads</h3>
                  <p className="text-xs text-gray-600">Healthy U</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-green-600 font-bold">KSh 200</span>
                    <span className="text-xs line-through text-gray-400">KSh 600</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-white rounded-2xl p-4 shadow-lg">
                  <div className="w-full h-24 bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg mb-3"></div>
                  <h3 className="font-semibold text-sm">Pastries & Bread</h3>
                  <p className="text-xs text-gray-600">Artcaffe</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-green-600 font-bold">KSh 150</span>
                    <span className="text-xs line-through text-gray-400">KSh 500</span>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-lg">
                  <div className="w-full h-32 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-lg mb-3"></div>
                  <h3 className="font-semibold text-sm">Grocery Bundle</h3>
                  <p className="text-xs text-gray-600">Carrefour</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-green-600 font-bold">KSh 400</span>
                    <span className="text-xs line-through text-gray-400">KSh 1200</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
