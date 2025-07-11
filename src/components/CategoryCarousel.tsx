import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CategoryCarouselProps {
  category: {
    name: string;
    icon: string;
    color: string;
  };
  items: Array<{
    id: string;
    name: string;
    type: string;
    rating: number;
    distance: string;
    savings: string;
    pickup: string;
    image: string;
  }>;
  onSeeAll: (categoryName: string) => void;
  onItemClick: (itemId: string) => void;
}

export const CategoryCarousel = ({ category, items, onSeeAll, onItemClick }: CategoryCarouselProps) => {
  return (
    <div className="space-y-3">
      {/* Category Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center`}>
            <span className="text-lg">{category.icon}</span>
          </div>
          <h3 className="font-semibold text-gray-900">{category.name}</h3>
        </div>
        <Button
          variant="ghost"
          className="text-primary hover:text-primary/80 underline p-0 h-auto"
          onClick={() => onSeeAll(category.name)}
        >
          See all
        </Button>
      </div>

      {/* Items Carousel */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {items.slice(0, 5).map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-64 bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onItemClick(item.id)}
          >
            <div className="p-3">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  {item.image}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                  <p className="text-sm text-gray-600 truncate">{item.type}</p>
                  
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span>⭐ {item.rating}</span>
                    <span>•</span>
                    <span>{item.distance}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <Badge className="bg-green-100 text-green-600 text-xs">{item.savings}</Badge>
                    <span className="text-xs text-gray-500">{item.pickup}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};