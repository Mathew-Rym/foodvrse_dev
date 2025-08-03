import React from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Partner {
  id: string;
  name: string;
  logo: string;
  logoUrl?: string; // Optional URL for actual logo image
  website: string;
  description: string;
  category: string;
}

const PARTNERS: Partner[] = [
  {
    id: '1',
    name: 'FreshMart',
    logo: 'FreshMart',
    logoUrl: 'https://via.placeholder.com/120x120/4ade80/ffffff?text=FM',
    website: 'https://freshmart.com',
    description: 'Your neighborhood grocery store committed to reducing food waste',
    category: 'Grocery'
  },
  {
    id: '2',
    name: 'Cafe Corner',
    logo: 'Cafe Corner',
    logoUrl: 'https://via.placeholder.com/120x120/fb923c/ffffff?text=CC',
    website: 'https://cafecorner.com',
    description: 'Artisan coffee and fresh pastries, saving surplus daily',
    category: 'Cafe'
  },
  {
    id: '3',
    name: 'Green Bakery',
    logo: 'Green Bakery',
    logoUrl: 'https://via.placeholder.com/120x120/22c55e/ffffff?text=GB',
    website: 'https://greenbakery.com',
    description: 'Organic bakery offering day-old bread at discounted prices',
    category: 'Bakery'
  },
  {
    id: '4',
    name: 'Ocean Delights',
    logo: 'Ocean Delights',
    logoUrl: 'https://via.placeholder.com/120x120/3b82f6/ffffff?text=OD',
    website: 'https://oceandelights.com',
    description: 'Fresh seafood with sustainable practices',
    category: 'Restaurant'
  },
  {
    id: '5',
    name: 'Veggie Paradise',
    logo: 'Veggie Paradise',
    logoUrl: 'https://via.placeholder.com/120x120/84cc16/ffffff?text=VP',
    website: 'https://veggieparadise.com',
    description: 'Farm-to-table vegetables and organic produce',
    category: 'Market'
  },
  {
    id: '6',
    name: 'Sweet Treats',
    logo: 'Sweet Treats',
    logoUrl: 'https://via.placeholder.com/120x120/f472b6/ffffff?text=ST',
    website: 'https://sweettreats.com',
    description: 'Artisan desserts and confectionery',
    category: 'Dessert'
  },
  {
    id: '7',
    name: 'Meat & More',
    logo: 'Meat & More',
    logoUrl: 'https://via.placeholder.com/120x120/ef4444/ffffff?text=MM',
    website: 'https://meatandmore.com',
    description: 'Quality meats and deli products',
    category: 'Butcher'
  },
  {
    id: '8',
    name: 'Healthy Eats',
    logo: 'Healthy Eats',
    logoUrl: 'https://via.placeholder.com/120x120/10b981/ffffff?text=HE',
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
                  <h1 className="text-4xl font-bold text-foreground mb-4">Our Partners</h1>
        <p className="text-lg text-muted-foreground">
            We're proud to work with these amazing businesses to reduce food waste and bring you great savings.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {PARTNERS.map((partner) => (
            <div
              key={partner.id}
              onClick={() => handlePartnerClick(partner.website)}
              className="bg-card rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
            >
              <div className="p-6">
                {/* Partner Logo */}
                <div className="flex items-center justify-center mb-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    {partner.logoUrl ? (
                      <img 
                        src={partner.logoUrl} 
                        alt={`${partner.name} logo`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to text if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center text-2xl font-bold text-muted-foreground ${partner.logoUrl ? 'hidden' : ''}`}>
                      {partner.logo.split(' ').map(word => word[0]).join('')}
                    </div>
                  </div>
                </div>
                
                {/* Partner Info */}
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-brand-green transition-colors">
                    {partner.name}
                  </h3>
                                      <span className="inline-block bg-brand-light-green text-brand-green text-xs px-2 py-1 rounded-full mb-3">
                    {partner.category}
                  </span>
                  <p className="text-muted-foreground text-sm mb-4">
                    {partner.description}
                  </p>
                                      <div className="flex items-center justify-center text-brand-green group-hover:text-brand-green/80">
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
              className="bg-brand-yellow text-brand-green px-8 py-3 rounded-lg font-semibold hover:bg-brand-yellow/90 transition-colors"
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