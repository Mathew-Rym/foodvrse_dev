import { Search, Filter, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MobileLayout from "@/components/MobileLayout";

const Discover = () => {
  const categories = [
    { name: "Restaurants", count: 24, color: "bg-orange-100 text-orange-600" },
    { name: "Bakeries", count: 12, color: "bg-yellow-100 text-yellow-600" },
    { name: "Grocery", count: 8, color: "bg-green-100 text-green-600" },
    { name: "Cafes", count: 15, color: "bg-blue-100 text-blue-600" },
  ];

  return (
    <MobileLayout>
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search food, restaurants..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Nairobi, Kenya</span>
          </div>
        </div>

        {/* Categories */}
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Browse Categories</h2>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => (
              <div key={category.name} className="bg-white rounded-lg p-4 shadow-sm">
                <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-3`}>
                  <span className="text-lg">🍽️</span>
                </div>
                <h3 className="font-medium text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count} nearby</p>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Searches */}
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Searches</h2>
          <div className="flex flex-wrap gap-2">
            {["Pizza", "Burgers", "Sushi", "Healthy", "Desserts", "Coffee"].map((tag) => (
              <Badge key={tag} variant="outline" className="px-3 py-1">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Discover;
