
import { Leaf, Droplets, Zap, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PlatformMetrics {
  total_co2_saved_tonnes: number;
  total_water_conserved_liters: number;
  total_energy_saved_kwh: number;
  total_meals_rescued: number;
  total_money_saved_ksh: number;
}

const ImpactTracker = () => {
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();

    // Set up real-time subscription
    const channel = supabase
      .channel('platform-metrics-changes')
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

  const formatLiters = (liters: number): string => {
    return formatNumber(liters) + 'L';
  };

  const formatKwh = (kwh: number): string => {
    return formatNumber(kwh) + ' kWh';
  };

  const formatTonnes = (tonnes: number): string => {
    return tonnes.toFixed(1) + ' tonnes';
  };

  const calculateTreesEquivalent = (tonnes: number): number => {
    // 25 kg CO₂ per tree per year
    return Math.round((tonnes * 1000) / 25);
  };

  const calculatePeopleWaterEquivalent = (liters: number): number => {
    // 150 liters per person per day
    return Math.round(liters / 150);
  };

  const calculateHomesEnergyEquivalent = (kwh: number): number => {
    // 150 kWh per home per month
    return Math.round(kwh / 150);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-green mb-4">
              Your Environmental Impact
            </h2>
            <p className="text-lg text-brand-green/80 max-w-2xl mx-auto">
              Loading impact metrics...
            </p>
          </div>
        </div>
      </section>
    );
  }

  const impacts = [
    {
      icon: Leaf,
      value: formatTonnes(metrics?.total_co2_saved_tonnes || 0),
      label: "CO₂ Emissions Saved",
      description: `Equivalent to planting ${calculateTreesEquivalent(metrics?.total_co2_saved_tonnes || 0)} trees`,
      color: "text-green-600",
      bg: "bg-green-100"
    },
    {
      icon: Droplets,
      value: formatLiters(metrics?.total_water_conserved_liters || 0),
      label: "Water Conserved",
      description: `Enough for ${calculatePeopleWaterEquivalent(metrics?.total_water_conserved_liters || 0)} people for a day`,
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      icon: Zap,
      value: formatKwh(metrics?.total_energy_saved_kwh || 0),
      label: "Energy Saved",
      description: `Powers ${calculateHomesEnergyEquivalent(metrics?.total_energy_saved_kwh || 0)} homes for a month`,
      color: "text-yellow-600",
      bg: "bg-yellow-100"
    },
    {
      icon: Users,
      value: formatNumber(metrics?.total_meals_rescued || 0),
      label: "Meals Rescued",
      description: `Fed ${formatNumber(metrics?.total_meals_rescued || 0)} people this month`,
      color: "text-purple-600",
      bg: "bg-purple-100"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Your Environmental Impact
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Every meal you save through FoodVrse contributes to a more sustainable future. 
            Here's the positive impact our community has made together.
          </p>
        </div>

        {/* Impact Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {impacts.map((impact, index) => (
            <div key={index} className="bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 ${impact.bg} rounded-full mb-4`}>
                <impact.icon className={`w-8 h-8 ${impact.color}`} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">{impact.value}</h3>
              <p className="font-semibold text-foreground mb-2">{impact.label}</p>
              <p className="text-sm text-muted-foreground">{impact.description}</p>
            </div>
          ))}
        </div>

        {/* Achievement Progress */}
        <div className="bg-card rounded-2xl shadow-sm p-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-foreground mb-2">Community Achievement</h3>
            <p className="text-muted-foreground">Together, we're making a difference</p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Progress to 2024 Goal</span>
                <span>{Math.round(((metrics?.total_meals_rescued || 0) / 20000) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(((metrics?.total_meals_rescued || 0) / 20000) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Milestones */}
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <p className={`font-semibold ${(metrics?.total_meals_rescued || 0) >= 1000 ? 'text-green-600' : 'text-gray-400'}`}>
                  {(metrics?.total_meals_rescued || 0) >= 1000 ? '✓' : '○'} 1K Meals
                </p>
                <p className="text-muted-foreground">{(metrics?.total_meals_rescued || 0) >= 1000 ? 'Achieved' : 'Goal'}</p>
              </div>
              <div>
                <p className={`font-semibold ${(metrics?.total_meals_rescued || 0) >= 10000 ? 'text-green-600' : (metrics?.total_meals_rescued || 0) >= 1000 ? 'text-yellow-600' : 'text-gray-400'}`}>
                  {(metrics?.total_meals_rescued || 0) >= 10000 ? '✓' : '📍'} 10K Meals
                </p>
                <p className="text-muted-foreground">
                  {(metrics?.total_meals_rescued || 0) >= 10000 ? 'Achieved' : (metrics?.total_meals_rescued || 0) >= 1000 ? 'In Progress' : 'Goal'}
                </p>
              </div>
              <div>
                <p className={`font-semibold ${(metrics?.total_meals_rescued || 0) >= 20000 ? 'text-green-600' : 'text-gray-400'}`}>
                  🎯 20K Meals
                </p>
                <p className="text-muted-foreground">{(metrics?.total_meals_rescued || 0) >= 20000 ? 'Achieved' : 'Goal'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactTracker;
