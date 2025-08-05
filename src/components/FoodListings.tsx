
import { useState } from "react";
import ListingsGrid from "@/components/ListingsGrid";
import { Button } from "@/components/ui/button";
import { useLocation } from "@/hooks/useLocation";

const FoodListings = () => {
  const [filter, setFilter] = useState("all");
  const { location } = useLocation();

  const categories = [
    { id: "all", label: "All Items" },
    { id: "Meals", label: "Mystery Bags" },
    { id: "Bakery", label: "Bakery" },
    { id: "Healthy", label: "Healthy" },
    { id: "Grocery", label: "Grocery" }
  ];

  return (
    <section className="py-12 bg-brand-light-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-brand-green mb-4">Available Near You</h2>
          <p className="text-lg text-brand-green/80">Fresh deals updated every hour</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={filter === category.id ? "default" : "outline"}
              onClick={() => setFilter(category.id)}
              className={`${
                filter === category.id 
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white" 
                  : "hover:bg-brand-light-green"
              }`}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Real-time Listings Grid */}
        <ListingsGrid 
          categoryFilter={filter}
          pickupTimeFilter="any"
          showSoldOut={false}
          userLocation={location}
          distanceFilter={location ? 25 : undefined}
        />
      </div>
    </section>
  );
};

export default FoodListings;
