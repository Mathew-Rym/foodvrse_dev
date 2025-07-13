import React from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Partner {
  id: string;
  name: string;
  logo: string;
  website: string;
  description: string;
  category: string;
}

const PARTNERS: Partner[] = [
  {
    id: '1',
    name: 'FreshMart',
    logo: '🛒',
    website: 'https://freshmart.com',
    description: 'Your neighborhood grocery store committed to reducing food waste',
    category: 'Grocery'
  },
  {
    id: '2',
    name: 'Cafe Corner',
    logo: '☕',
    website: 'https://cafecorner.com',
    description: 'Artisan coffee and fresh pastries, saving surplus daily',
    category: 'Cafe'
  },
  {
    id: '3',
    name: 'Green Bakery',
    logo: '🥖',
    website: 'https://greenbakery.com',
    description: 'Organic bakery offering day-old bread at discounted prices',
    category: 'Bakery'
  },
  {
    id: '4',
    name: 'Ocean Delights',
    logo: '🐟',
    website: 'https://oceandelights.com',
    description: 'Fresh seafood with sustainable practices',
    category: 'Restaurant'
  },
  {
    id: '5',
    name: 'Veggie Paradise',
    logo: '🥬',
    website: 'https://veggieparadise.com',
    description: 'Farm-to-table vegetables and organic produce',
    category: 'Market'
  },
  {
    id: '6',
    name: 'Sweet Treats',
    logo: '🍰',
    website: 'https://sweettreats.com',
    description: 'Artisan desserts and confectionery',
    category: 'Dessert'
  },
  {
    id: '7',
    name: 'Meat & More',
    logo: '🥩',
    website: 'https://meatandmore.com',
    description: 'Quality meats and deli products',
    category: 'Butcher'
  },
  {
    id: '8',
    name: 'Healthy Eats',
    logo: '🥗',
    website: 'https://healthyeats.com',
    description: 'Nutritious meals and healthy food options',
    category: 'Health Food'
  }
];

const Partners: React.FC = () => {
  const navigate = useNavigate();

  const handlePartnerClick = (website: string) => {
    window.open(website, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Partners</h1>
          <p className="text-lg text-gray-600">
            We're proud to work with these amazing businesses to reduce food waste and bring you great savings.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {PARTNERS.map((partner) => (
            <div
              key={partner.id}
              onClick={() => handlePartnerClick(partner.website)}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
            >
              <div className="p-6">
                {/* Animated Logo */}
                <div className="flex items-center justify-center mb-4">
                  <div className="text-6xl animate-bounce group-hover:animate-pulse transition-all duration-300">
                    {partner.logo}
                  </div>
                </div>
                
                {/* Partner Info */}
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {partner.name}
                  </h3>
                  <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full mb-3">
                    {partner.category}
                  </span>
                  <p className="text-gray-600 text-sm mb-4">
                    {partner.description}
                  </p>
                  <div className="flex items-center justify-center text-orange-600 group-hover:text-orange-700">
                    <span className="text-sm font-medium mr-1">Visit Store</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Partner Application CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Want to become a partner?</h2>
            <p className="text-xl mb-6">
              Join our mission to reduce food waste and reach more customers
            </p>
            <button
              onClick={() => navigate('/partner-application')}
              className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partners;