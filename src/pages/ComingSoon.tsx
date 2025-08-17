import { ArrowLeft, Smartphone, Globe, Gift, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Logo from "@/components/Logo";

const ComingSoon = () => {
  const navigate = useNavigate();

  const handleUseWebApp = () => {
    navigate("/");
  };

  const handleGetMysteryBag = () => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    
    navigate("/discover");
    navigate("/mystery-boxes");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-green to-brand-yellow flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-8">
          <Logo size="lg" className="mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">Coming Soon!</h1>
          <p className="text-xl text-white/90">
            Our mobile app is in development
          </p>
        </div>

        {/* Main Content */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0 mb-8">
          <CardContent className="p-8">
            <div className="flex items-center justify-center mb-6">
              <Smartphone className="w-16 h-16 text-brand-green" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Mobile App Launching Soon
            </h2>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              We're working hard to bring you the best mobile experience for saving food and reducing waste. 
              Our app will feature all the amazing functionality you love, plus exclusive mobile-only features!
            </p>

            {/* Features Preview */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-brand-light-green rounded-lg">
                <Star className="w-8 h-8 text-brand-green mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Push Notifications</h3>
                <p className="text-sm text-gray-600">Get instant alerts for new deals</p>
              </div>
              <div className="text-center p-4 bg-brand-light-green rounded-lg">
                <Gift className="w-8 h-8 text-brand-green mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Mystery Bags</h3>
                <p className="text-sm text-gray-600">Exclusive mobile mystery bags</p>
              </div>
              <div className="text-center p-4 bg-brand-light-green rounded-lg">
                <Globe className="w-8 h-8 text-brand-green mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Location Services</h3>
                <p className="text-sm text-gray-600">Find deals near you instantly</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button 
                onClick={handleUseWebApp}
                className="w-full bg-gradient-to-r from-brand-green to-brand-yellow text-white py-3 text-lg font-semibold hover:from-brand-green/90 hover:to-brand-yellow/90"
              >
                <Globe className="w-5 h-5 mr-2" />
                Use Web App Now
              </Button>
              
              <Button 
                onClick={handleGetMysteryBag}
                variant="outline"
                className="w-full border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white py-3 text-lg font-semibold"
              >
                <Gift className="w-5 h-5 mr-2" />
                Get Mystery Bag
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="text-white/80 text-sm">
          <p className="mb-2">
            Sign up for early access and get notified when we launch!
          </p>
          <p>
            In the meantime, enjoy our full web experience with all features available.
          </p>
        </div>

        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mt-8 text-white hover:text-white/80"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default ComingSoon; 