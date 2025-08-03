import { Leaf, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import VideoSection from "./VideoSection";
import { useTranslation } from 'react-i18next';

interface PlatformMetrics {
  total_co2_saved_tonnes: number;
  total_water_conserved_liters: number;
  total_energy_saved_kwh: number;
  total_meals_rescued: number;
  total_money_saved_ksh: number;
}

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data, error } = await supabase
          .from('platform_impact_metrics')
          .select('*')
          .single();

        if (error) {
          console.error('Error fetching platform metrics:', error);
          return;
        }

        setMetrics(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchMetrics();

    // Set up real-time subscription
    const channel = supabase
      .channel('hero-metrics-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'platform_impact_metrics'
        },
        (payload) => {
          setMetrics(payload.new as PlatformMetrics);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
    // For now, open business dashboard for any logged in user
    if (user) {
      navigate("/business-dashboard");
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
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-brand-green leading-tight">
                {t('hero.save_food')},
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-orange-500"> {t('hero.save_money')}</span>
              </h1>
                              <p className="text-lg lg:text-xl text-brand-green/80 leading-relaxed">
                  {t('hero.discover_surplus_food')} (Mystery bags) from local restaurants and stores. 
                  {t('hero.help_reduce_food_waste')} while enjoying delicious meals at up to 70% off.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-2 mx-auto">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-lg sm:text-2xl font-bold text-brand-green">
                  {formatNumber(metrics?.total_meals_rescued || 1247)}+
                </p>
                <p className="text-xs sm:text-sm text-brand-green/70">{t('hero.meals_saved')}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-brand-green/20 rounded-full mb-2 mx-auto">
                  <Clock className="w-6 h-6 text-brand-green" />
                </div>
                <p className="text-lg sm:text-2xl font-bold text-brand-green">
                  {formatTonnes(metrics?.total_co2_saved_tonnes || 2.5)}
                </p>
                <p className="text-xs sm:text-sm text-brand-green/70">{t('hero.co2_saved')}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-brand-yellow/20 rounded-full mb-2 mx-auto">
                  <DollarSign className="w-6 h-6 text-brand-yellow" />
                </div>
                <p className="text-lg sm:text-2xl font-bold text-brand-green">
                  {formatMoney(metrics?.total_money_saved_ksh || 580000)}
                </p>
                <p className="text-xs sm:text-sm text-brand-green/70">{t('hero.money_saved')}</p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button 
                size="lg" 
                className="bg-brand-yellow text-brand-green font-semibold text-sm sm:text-base px-6 sm:px-8 py-3 hover:bg-brand-yellow/90"
                onClick={handleStartSaving}
              >
                {t('hero.start_saving_food')}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white text-sm sm:text-base px-6 sm:px-8 py-3"
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
