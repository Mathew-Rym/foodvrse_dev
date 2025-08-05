
import { Leaf, Droplets, Zap, Users, CheckCircle, MapPin, Target } from "lucide-react";
import { useRealTimeMetrics } from "@/hooks/useRealTimeMetrics";
import { Skeleton } from "@/components/ui/skeleton";

const ImpactTracker = () => {
  const metrics = useRealTimeMetrics();



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

  if (metrics.isLoading) {
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
      value: formatTonnes(metrics?.totalCo2SavedTonnes || 0),
      label: "CO₂ Emissions Saved",
      description: `Equivalent to planting ${calculateTreesEquivalent(metrics?.totalCo2SavedTonnes || 0)} trees`,
      color: "text-green-600",
      bg: "bg-green-100"
    },
    {
      icon: Droplets,
      value: formatLiters(metrics?.totalWaterConservedLiters || 0),
      label: "Water Conserved",
      description: `Enough for ${calculatePeopleWaterEquivalent(metrics?.totalWaterConservedLiters || 0)} people for a day`,
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      icon: Zap,
      value: formatKwh(metrics?.totalEnergySavedKwh || 0),
      label: "Energy Saved",
      description: `Powers ${calculateHomesEnergyEquivalent(metrics?.totalEnergySavedKwh || 0)} homes for a month`,
      color: "text-yellow-600",
      bg: "bg-yellow-100"
    },
    {
      icon: Users,
      value: formatNumber(metrics?.totalMealsRescued || 0),
      label: "Meals Rescued",
      description: `Fed ${formatNumber(metrics?.totalMealsRescued || 0)} people this month`,
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
            <div key={index} className="bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 text-center relative">
              {metrics.isLoading && (
                <div className="absolute top-2 right-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-green"></div>
                </div>
              )}
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
            <p className="text-muted-foreground">
              Together, we're making a difference
              {metrics.isLoading && (
                <span className="ml-2 inline-flex items-center text-sm text-brand-green">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-brand-green mr-1"></div>
                  Updating...
                </span>
              )}
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Progress to 2025 Goal</span>
                {metrics.isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-brand-green"></div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ) : (
                  <span className="flex items-center gap-1">
                    {Math.round(((metrics?.totalMealsRescued || 0) / 20000) * 100)}% Complete
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </span>
                )}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                {metrics.isLoading ? (
                  <Skeleton className="h-3 w-full" />
                ) : (
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500 relative overflow-hidden" 
                    style={{ width: `${Math.min(((metrics?.totalMealsRescued || 0) / 20000) * 100, 100)}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Milestones */}
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                {metrics.isLoading ? (
                  <>
                    <Skeleton className="h-4 w-16 mx-auto mb-1" />
                    <Skeleton className="h-3 w-12 mx-auto" />
                  </>
                ) : (
                  <>
                    <p className={`font-semibold ${(metrics?.totalMealsRescued || 0) >= 1000 ? 'text-green-600' : 'text-gray-400'}`}>
                      {(metrics?.totalMealsRescued || 0) >= 1000 ? <CheckCircle className="inline w-4 h-4" /> : <span className="text-gray-400">○</span>} 1K Meals
                    </p>
                    <p className="text-muted-foreground">{(metrics?.totalMealsRescued || 0) >= 1000 ? 'Achieved' : 'Goal'}</p>
                  </>
                )}
              </div>
              <div>
                {metrics.isLoading ? (
                  <>
                    <Skeleton className="h-4 w-20 mx-auto mb-1" />
                    <Skeleton className="h-3 w-16 mx-auto" />
                  </>
                ) : (
                  <>
                    <p className={`font-semibold ${(metrics?.totalMealsRescued || 0) >= 10000 ? 'text-green-600' : (metrics?.totalMealsRescued || 0) >= 1000 ? 'text-yellow-600' : 'text-gray-400'}`}>
                      {(metrics?.totalMealsRescued || 0) >= 10000 ? <CheckCircle className="inline w-4 h-4" /> : <MapPin className="inline w-4 h-4" />} 10K Meals
                    </p>
                    <p className="text-muted-foreground">
                      {(metrics?.totalMealsRescued || 0) >= 10000 ? 'Achieved' : (metrics?.totalMealsRescued || 0) >= 1000 ? 'In Progress' : 'Goal'}
                    </p>
                  </>
                )}
              </div>
              <div>
                {metrics.isLoading ? (
                  <>
                    <Skeleton className="h-4 w-20 mx-auto mb-1" />
                    <Skeleton className="h-3 w-8 mx-auto" />
                  </>
                ) : (
                  <>
                    <p className={`font-semibold ${(metrics?.totalMealsRescued || 0) >= 20000 ? 'text-green-600' : 'text-gray-400'}`}>
                      <Target className="inline w-4 h-4" /> 20K Meals
                    </p>
                    <p className="text-muted-foreground">{(metrics?.totalMealsRescued || 0) >= 20000 ? 'Achieved' : 'Goal'}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactTracker;
