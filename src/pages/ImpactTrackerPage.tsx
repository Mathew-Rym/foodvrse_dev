import { Trophy, Leaf, Users, TrendingUp, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import MobileLayout from "@/components/MobileLayout";
import BackToTop from "@/components/BackToTop";

const ImpactTrackerPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const hideNavbar = location.state?.hideNavbar;

  const handleBack = () => {
    navigate(-1);
  };

  const features = [
    {
      icon: Leaf,
      title: "Environmental Impact",
      description: "Track your CO₂ savings, food waste reduction, and environmental contribution in real-time.",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Trophy,
      title: "Personal Achievements",
      description: "Unlock badges, reach milestones, and see your progress as a food waste champion.",
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      icon: Users,
      title: "Community Impact",
      description: "See how your actions contribute to the larger FoodVrse community's collective impact.",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: TrendingUp,
      title: "Progress Analytics",
      description: "Detailed insights into your savings patterns, favorite restaurants, and impact trends.",
      color: "bg-purple-100 text-purple-600"
    }
  ];

  const stats = [
    { value: "12,000+", label: "Meals Saved", color: "text-green-600" },
    { value: "2.5T", label: "CO₂ Reduced", color: "text-blue-600" },
            { value: "KSh 580K", label: "Money Saved", color: "text-brand-yellow" },
    { value: "500+", label: "Partner Restaurants", color: "text-purple-600" }
  ];

  return (
    <MobileLayout hideNavbar={hideNavbar}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center gap-2 mb-4 justify-center">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Impact Tracker</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Visualize your positive impact on the environment and community. Track your journey 
            as a food waste champion and see the difference you're making.
          </p>
        </div>

        {/* Community Stats */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Community Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Track Your Impact</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-gray-50 rounded-lg p-6 mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">How Impact Tracking Works</h2>
          <div className="space-y-3 text-gray-600">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-brand-green text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">1</div>
              <div>Every mystery bag you purchase automatically tracks your environmental impact</div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-brand-green text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">2</div>
              <div>View detailed analytics about your CO₂ savings and food waste reduction</div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-brand-green text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</div>
              <div>Earn badges and achievements as you reach impact milestones</div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-brand-green text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">4</div>
              <div>Share your impact with friends and inspire others to join the movement</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-4">
          {isAuthenticated ? (
            <Button 
              onClick={() => navigate("/gamification")}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3"
            >
              View My Impact Dashboard
              <Trophy className="ml-2 w-4 h-4" />
            </Button>
          ) : (
            <>
              <Button 
                onClick={() => navigate("/auth")}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3"
              >
                Sign Up to Track Your Impact
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <div className="text-center">
                <Button 
                  variant="outline"
                  onClick={() => navigate("/food-waste")}
                  className="text-sm"
                >
                  Learn About Food Waste
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      <BackToTop />
    </MobileLayout>
  );
};

export default ImpactTrackerPage;