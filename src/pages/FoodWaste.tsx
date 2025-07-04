
import { ArrowLeft, Leaf, TrendingDown, Users, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const FoodWaste = () => {
  const navigate = useNavigate();

  const stats = [
    {
      icon: Globe,
      title: '1.3 Billion Tons',
      description: 'Food wasted globally every year',
      color: 'text-red-500',
    },
    {
      icon: TrendingDown,
      title: '30-40%',
      description: 'Of food supply is wasted',
      color: 'text-orange-500',
    },
    {
      icon: Users,
      title: '828 Million',
      description: 'People go hungry daily',
      color: 'text-blue-500',
    },
    {
      icon: Leaf,
      title: '8-10%',
      description: 'Of global greenhouse gases from food waste',
      color: 'text-green-500',
    },
  ];

  const impacts = [
    {
      title: 'Environmental Impact',
      description: 'Food waste contributes significantly to greenhouse gas emissions, wasted water resources, and unnecessary land use.',
      color: 'bg-green-50 border-green-200',
    },
    {
      title: 'Economic Impact',
      description: 'Global economic losses from food waste amount to nearly $1 trillion annually, affecting farmers, retailers, and consumers.',
      color: 'bg-blue-50 border-blue-200',
    },
    {
      title: 'Social Impact',
      description: 'While food is wasted, millions face hunger. Reducing waste can help redistribute resources to those in need.',
      color: 'bg-orange-50 border-orange-200',
    },
  ];

  const solutions = [
    'Buy only what you need and plan meals ahead',
    'Store food properly to extend shelf life',
    'Use apps like FoodVrse to rescue surplus food',
    'Compost food scraps instead of throwing them away',
    'Support businesses with sustainable practices',
    'Donate excess food to local food banks',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Understanding Food Waste
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Food waste is one of the world's most pressing issues. Learn about its impact and how you can make a difference.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm text-center">
                <Icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{stat.title}</h3>
                <p className="text-sm text-gray-600">{stat.description}</p>
              </div>
            );
          })}
        </div>

        {/* What is Food Waste */}
        <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What is Food Waste?</h2>
          <p className="text-gray-600 mb-4">
            Food waste refers to the decrease in the quantity or quality of food along the food supply chain. 
            It occurs at every stage - from production and processing to retail and consumption.
          </p>
          <p className="text-gray-600">
            In developed countries, most food waste happens at the consumer level, while in developing countries, 
            it often occurs during production, handling, and storage due to inadequate infrastructure.
          </p>
        </div>

        {/* Impacts */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">The Triple Impact</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {impacts.map((impact, index) => (
              <div key={index} className={`border-2 rounded-lg p-6 ${impact.color}`}>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{impact.title}</h3>
                <p className="text-gray-700">{impact.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Kenya Context */}
        <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Food Waste in Kenya</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">The Challenge</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 40% of food produced is lost or wasted</li>
                <li>• Post-harvest losses average 20-30%</li>
                <li>• Limited cold storage infrastructure</li>
                <li>• Poor transportation networks</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">The Opportunity</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Growing tech solutions like FoodVrse</li>
                <li>• Increased awareness among consumers</li>
                <li>• Government initiatives on food security</li>
                <li>• Partnership opportunities with retailers</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Solutions */}
        <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How You Can Help</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {solutions.map((solution, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">{index + 1}</span>
                </div>
                <p className="text-gray-700">{solution}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Join the Movement</h2>
          <p className="text-lg mb-6">
            Every rescued meal makes a difference. Start saving food and money today.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-orange-500 hover:bg-gray-100"
            onClick={() => navigate('/')}
          >
            Start Rescuing Food
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FoodWaste;
