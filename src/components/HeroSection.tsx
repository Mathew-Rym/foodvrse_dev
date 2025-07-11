import { Leaf, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import VideoSection from "./VideoSection";

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
                Discover surplus food (Mystery bags) from local restaurants and stores. 
                Help reduce food waste while enjoying delicious meals at up to 70% off.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-2 mx-auto">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {formatNumber(metrics?.total_meals_rescued || 1247)}+
                </p>
                <p className="text-xs sm:text-sm text-gray-600">Meals Saved</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-2 mx-auto">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {formatTonnes(metrics?.total_co2_saved_tonnes || 2.5)}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">CO₂ Saved</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-2 mx-auto">
                  <DollarSign className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {formatMoney(metrics?.total_money_saved_ksh || 580000)}
                </p>
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
