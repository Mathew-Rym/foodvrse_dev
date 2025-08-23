import { Leaf, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRealTimeMetrics } from "@/hooks/useRealTimeMetrics";
import VideoSection from "./VideoSection";
import { useTranslation } from 'react-i18next';
import { Skeleton } from "@/components/ui/skeleton";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user, isBusinessUser } = useAuth();
  const metrics = useRealTimeMetrics();
  const { t } = useTranslation();

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatTonnes = (tonnes: number): string => {
    return tonnes.toFixed(1) + 'T';
  };

  const formatMoney = (amount: number): string => {
    return 'KSh ' + formatNumber(amount);
  };

  const handleStartSaving = () => {
    navigate("/auth");
  };

  const handleForBusinesses = () => {
    if (user) {
      // Check if user is a business user
      if (isBusinessUser) {
        navigate("/business-dashboard");
      } else {
        // Regular user - redirect to partner application or business signup
        navigate("/partner-application");
      }
    } else {
      navigate("/auth");
    }
  };

  return (
    <section className="bg-brand-light-green py-8 lg:py-20 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 lg:space-y-8">
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-brand-green leading-tight">
                {t('hero.save_food')},
                <span className="text-brand-yellow font-bold"> {t('hero.save_money')}</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-brand-green/80 leading-relaxed">
                {t('hero.discover_surplus_food')} (Mystery bags) from local restaurants and stores. 
                {t('hero.help_reduce_food_waste')} while enjoying delicious meals at up to 70% off.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-full mb-2 sm:mb-3 mx-auto shadow-lg border-2 border-green-300 hover:scale-110 transition-transform duration-200">
                  <Leaf className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-green-700 drop-shadow-sm" />
                </div>
                <p className="text-sm sm:text-lg md:text-2xl font-bold text-brand-green">
                  {metrics.isLoading ? (
                  <Skeleton className="h-6 sm:h-8 w-12 sm:w-16 inline-block" />
                ) : (
                  formatNumber(metrics?.totalMealsRescued || 1247)
                )}+
                </p>
                <p className="text-xs text-brand-green/70">{t('hero.meals_saved')}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mb-2 sm:mb-3 mx-auto shadow-lg border-2 border-blue-300 hover:scale-110 transition-transform duration-200">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-blue-700 drop-shadow-sm" />
                </div>
                <p className="text-sm sm:text-lg md:text-2xl font-bold text-blue-700">
                  {metrics.isLoading ? (
                  <Skeleton className="h-6 sm:h-8 w-10 sm:w-12 inline-block" />
                ) : (
                  formatTonnes(metrics?.totalCo2SavedTonnes || 2.5)
                )}
                </p>
                <p className="text-xs text-blue-600">{t('hero.co2_saved')}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full mb-2 sm:mb-3 mx-auto shadow-lg border-2 border-yellow-300 hover:scale-110 transition-transform duration-200">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-yellow-600 drop-shadow-sm" />
                </div>
                <p className="text-sm sm:text-lg md:text-2xl font-bold text-brand-green">
                  {metrics.isLoading ? (
                  <Skeleton className="h-6 sm:h-8 w-16 sm:w-20 inline-block" />
                ) : (
                  formatMoney(metrics?.totalMoneySavedKsh || 580000)
                )}
                </p>
                <p className="text-xs text-brand-green/70">{t('hero.money_saved')}</p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button 
                size="lg" 
                className="bg-brand-yellow text-brand-green font-semibold text-sm sm:text-base px-6 sm:px-8 py-3 hover:bg-brand-green hover:text-white transition-all duration-200"
                onClick={handleStartSaving}
              >
                {t('hero.start_saving_food')}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white text-sm sm:text-base px-6 sm:px-8 py-3 transition-all duration-200"
                onClick={handleForBusinesses}
              >
                {t('hero.for_businesses')}
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
