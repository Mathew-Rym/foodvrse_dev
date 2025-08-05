import { ArrowRight, Smartphone, Search, ShoppingBag, Heart, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/MobileLayout";
import BackToTop from "@/components/BackToTop";
import { useTranslation } from 'react-i18next';

const HowItWorks = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const steps = [
    {
      icon: Smartphone,
      title: t('howItWorks.downloadSignUp'),
      description: t('howItWorks.downloadSignUpDesc'),
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Search,
      title: t('howItWorks.browseMysteryBags'),
      description: t('howItWorks.browseMysteryBagsDesc'),
      color: "bg-green-100 text-green-600"
    },
    {
      icon: ShoppingBag,
      title: t('howItWorks.orderCollect'),
      description: t('howItWorks.orderCollectDesc'),
      color: "bg-orange-100 text-orange-600"
    },
    {
      icon: Heart,
      title: t('howItWorks.enjoyImpact'),
      description: t('howItWorks.enjoyImpactDesc'),
      color: "bg-red-100 text-red-600"
    }
  ];

  return (
    <MobileLayout hideNavbar={true}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('howItWorks.title')}</h1>
          <p className="text-lg text-gray-600">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className={`flex-shrink-0 w-12 h-12 rounded-full ${step.color} flex items-center justify-center`}>
                <step.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {index + 1}. {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Impact Section */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Impact Matters</h2>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">1 Meal</div>
              <div className="text-sm text-gray-600">= 2.5kg CO₂ Saved</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">Every Purchase</div>
              <div className="text-sm text-gray-600">= Food Waste Reduced</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-yellow">70% Off</div>
              <div className="text-sm text-gray-600">= Money Saved</div>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Video className="w-6 h-6 text-brand-green" />
            <h2 className="text-2xl font-bold text-gray-900">Coming Soon: VrsePoints</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Share your food waste reduction journey through content creation and earn VrsePoints! 
            Create videos, share your impact, and get rewarded for spreading awareness.
          </p>
          <div className="bg-white rounded-lg p-4 border border-brand-green">
            <h3 className="font-semibold text-gray-900 mb-2">Earn VrsePoints by:</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Creating video content about your FoodVrse experience</li>
              <li>• Sharing your food waste reduction impact</li>
              <li>• Referring friends to join the movement</li>
              <li>• Participating in community challenges</li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3"
          >
            Start Saving Food Today
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
      <BackToTop />
    </MobileLayout>
  );
};

export default HowItWorks;