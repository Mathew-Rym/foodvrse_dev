import { useState } from "react";
import { Clock, MapPin, Star, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";

const FoodListings = () => {
  const [filter, setFilter] = useState("all");
  const { addToCart } = useCart();

  const listings = [
    {
      id: 1,
      title: "Italian Mystery Box",
      vendor: "Mama Mia Restaurant",
      originalPrice: 1200,
      discountedPrice: 400,
      pickup: "5:00 PM - 7:00 PM",
      distance: "0.8 km",
      rating: 4.6,
      category: "mystery",
      dietary: ["vegetarian-friendly"],
      co2Saved: 2.4,
      image: "from-orange-300 to-red-300"
    },
    {
      id: 2,
      title: "Fresh Bakery Items",
      vendor: "Corner Bakery",
      originalPrice: 800,
      discountedPrice: 250,
      pickup: "6:00 PM - 8:00 PM",
      distance: "1.2 km",
      rating: 4.8,
      category: "bakery",
      dietary: ["vegan", "gluten-free"],
      co2Saved: 1.8,
      image: "from-yellow-300 to-orange-300"
    },
    {
      id: 3,
      title: "Healthy Meal Prep Box",
      vendor: "FitFood Kenya",
      originalPrice: 1500,
      discountedPrice: 500,
      pickup: "4:30 PM - 6:30 PM",
      distance: "2.1 km",
      rating: 4.7,
      category: "healthy",
      dietary: ["halal", "protein-rich"],
      co2Saved: 3.2,
      image: "from-green-300 to-blue-300"
    },
    {
      id: 4,
      title: "Grocery Rescue Pack",
      vendor: "Nakumatt Mega",
      originalPrice: 2000,
      discountedPrice: 600,
      pickup: "All Day",
      distance: "0.5 km",
      rating: 4.4,
      category: "grocery",
      dietary: ["mixed"],
      co2Saved: 4.1,
      image: "from-purple-300 to-pink-300"
    },
    {
      id: 5,
      title: "Surprise Breakfast Box",
      vendor: "Java House",
      originalPrice: 900,
      discountedPrice: 300,
      pickup: "7:00 AM - 10:00 AM",
      distance: "1.5 km",
      rating: 4.9,
      category: "mystery",
      dietary: ["coffee-included"],
      co2Saved: 2.1,
      image: "from-amber-300 to-yellow-300"
    },
    {
      id: 6,
      title: "Local Nyama Choma Deal",
      vendor: "Carnivore Restaurant",
      originalPrice: 1800,
      discountedPrice: 650,
      pickup: "12:00 PM - 3:00 PM",
      distance: "3.2 km",
      rating: 4.5,
      category: "meat",
      dietary: ["halal", "high-protein"],
      co2Saved: 5.6,
      image: "from-red-300 to-orange-300"
    }
  ];

  const categories = [
    { id: "all", label: "All Items", count: listings.length },
    { id: "mystery", label: "Mystery Boxes", count: listings.filter(l => l.category === "mystery").length },
    { id: "bakery", label: "Bakery", count: listings.filter(l => l.category === "bakery").length },
    { id: "healthy", label: "Healthy", count: listings.filter(l => l.category === "healthy").length },
    { id: "grocery", label: "Grocery", count: listings.filter(l => l.category === "grocery").length }
  ];

  const filteredListings = filter === "all" ? listings : listings.filter(l => l.category === filter);

  const handleReserveNow = (listing: typeof listings[0]) => {
    addToCart({
      id: listing.id,
      title: listing.title,
      vendor: listing.vendor,
      price: listing.discountedPrice,
      originalPrice: listing.originalPrice,
      pickup: listing.pickup
    });
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Near You</h2>
          <p className="text-lg text-gray-600">Fresh deals updated every hour</p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={filter === category.id ? "default" : "outline"}
              onClick={() => setFilter(category.id)}
              className={`${
                filter === category.id 
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white" 
                  : "hover:bg-orange-50"
              }`}
            >
              {category.label} ({category.count})
            </Button>
          ))}
        </div>

        {/* Listings Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              {/* Image */}
              <div className={`h-48 bg-gradient-to-br ${listing.image} relative`}>
                <div className="absolute top-3 left-3">
                  <Badge className="bg-green-500 text-white">
                    {Math.round(((listing.originalPrice - listing.discountedPrice) / listing.originalPrice) * 100)}% OFF
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-white/90 text-gray-700 flex items-center gap-1">
                    <Leaf className="w-3 h-3 text-green-500" />
                    {listing.co2Saved}kg CO₂
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                {/* Title and Vendor */}
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{listing.title}</h3>
                  <p className="text-gray-600 text-sm">{listing.vendor}</p>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-green-600">KSh {listing.discountedPrice}</span>
                  <span className="text-sm line-through text-gray-400">KSh {listing.originalPrice}</span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{listing.pickup}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{listing.distance} away</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{listing.rating}</span>
                  </div>
                </div>

                {/* Dietary Tags */}
                <div className="flex flex-wrap gap-1">
                  {listing.dietary.map((diet, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {diet}
                    </Badge>
                  ))}
                </div>

                {/* Action Button */}
                <Button 
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
                  onClick={() => handleReserveNow(listing)}
                >
                  Reserve Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FoodListings;
