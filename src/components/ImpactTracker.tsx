
import { Leaf, Droplets, Zap, Users } from "lucide-react";

const ImpactTracker = () => {
  const impacts = [
    {
      icon: Leaf,
      value: "12.7 tonnes",
      label: "CO₂ Emissions Saved",
      description: "Equivalent to planting 158 trees",
      color: "text-green-600",
      bg: "bg-green-100"
    },
    {
      icon: Droplets,
      value: "45,200L",
      label: "Water Conserved",
      description: "Enough for 180 people for a day",
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      icon: Zap,
      value: "8,450 kWh",
      label: "Energy Saved",
      description: "Powers 12 homes for a month",
      color: "text-yellow-600",
      bg: "bg-yellow-100"
    },
    {
      icon: Users,
      value: "1,247",
      label: "Meals Rescued",
      description: "Fed 1,247 people this month",
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
            <div key={index} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 ${impact.bg} rounded-full mb-4`}>
                <impact.icon className={`w-8 h-8 ${impact.color}`} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{impact.value}</h3>
              <p className="font-semibold text-gray-700 mb-2">{impact.label}</p>
              <p className="text-sm text-gray-500">{impact.description}</p>
            </div>
          ))}
        </div>

        {/* Achievement Progress */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Community Achievement</h3>
            <p className="text-gray-600">Together, we're making a difference</p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress to 2024 Goal</span>
                <span>67% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500" style={{ width: '67%' }}></div>
              </div>
            </div>

            {/* Milestones */}
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <p className="font-semibold text-green-600">✓ 10K Meals</p>
                <p className="text-gray-500">Achieved</p>
              </div>
              <div>
                <p className="font-semibold text-yellow-600">📍 15K Meals</p>
                <p className="text-gray-500">In Progress</p>
              </div>
              <div>
                <p className="font-semibold text-gray-400">🎯 20K Meals</p>
                <p className="text-gray-500">Goal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactTracker;
