import { useState, useEffect } from "react";
import { X, Filter, Clock, Calendar, Package, Leaf, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { DynamicPopup } from "@/components/DynamicPopup";

interface FilterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  clickEvent?: React.MouseEvent;
}

export interface FilterOptions {
  showSoldOut: boolean;
  pickupDay: string[];
  pickupWindow: [number, number];
  surpriseBagTypes: string[];
  dietaryPreferences: string[];
  priceRange: [number, number];
  distanceRange: [number, number];
  ratingFilter: number;
}

export const FilterPopup = ({ isOpen, onClose, onApplyFilters, clickEvent }: FilterPopupProps) => {
  const [showSoldOut, setShowSoldOut] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState<[number, number]>([0, 23]);
  const [selectedBagTypes, setSelectedBagTypes] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [distanceRange, setDistanceRange] = useState<[number, number]>([0, 10]);
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [activeFilters, setActiveFilters] = useState<number>(0);

  const bagTypes = [
    "Meals", 
    "Bread & Pastries", 
    "Groceries", 
    "Drinks", 
    "Desserts",
    "Snacks",
    "Coffee & Tea",
    "Fresh Produce"
  ];
  
  const dietaryOptions = [
    "Vegetarian", 
    "Vegan", 
    "Gluten-Free", 
    "Dairy-Free",
    "Halal",
    "Kosher"
  ];
  
  const days = ["Today", "Tomorrow", "This Week"];
  const ratingOptions = [0, 3, 3.5, 4, 4.5, 5];

  // Calculate active filters count
  useEffect(() => {
    let count = 0;
    if (showSoldOut) count++;
    if (selectedDays.length > 0) count++;
    if (timeRange[0] !== 0 || timeRange[1] !== 23) count++;
    if (selectedBagTypes.length > 0) count++;
    if (selectedDietary.length > 0) count++;
    if (priceRange[0] !== 0 || priceRange[1] !== 1000) count++;
    if (distanceRange[0] !== 0 || distanceRange[1] !== 10) count++;
    if (ratingFilter > 0) count++;
    setActiveFilters(count);
  }, [showSoldOut, selectedDays, timeRange, selectedBagTypes, selectedDietary, priceRange, distanceRange, ratingFilter]);

  const toggleSelection = (value: string, array: string[], setter: (arr: string[]) => void) => {
    if (array.includes(value)) {
      setter(array.filter(item => item !== value));
    } else {
      setter([...array, value]);
    }
  };

  const formatTime = (hour: number) => {
    if (hour === 0) return "12:00 AM";
    if (hour === 12) return "12:00 PM";
    if (hour < 12) return `${hour}:00 AM`;
    return `${hour - 12}:00 PM`;
  };

  const formatPrice = (price: number) => {
    return `KSh ${price}`;
  };

  const formatDistance = (distance: number) => {
    return `${distance} km`;
  };

  const handleApply = () => {
    const filters: FilterOptions = {
      showSoldOut,
      pickupDay: selectedDays,
      pickupWindow: timeRange,
      surpriseBagTypes: selectedBagTypes,
      dietaryPreferences: selectedDietary,
      priceRange,
      distanceRange,
      ratingFilter,
    };
    
    onApplyFilters(filters);
    toast.success(`Applied ${activeFilters} filter${activeFilters !== 1 ? 's' : ''}`);
    onClose();
  };

  const handleClearAll = () => {
    setShowSoldOut(false);
    setSelectedDays([]);
    setTimeRange([0, 23]);
    setSelectedBagTypes([]);
    setSelectedDietary([]);
    setPriceRange([0, 1000]);
    setDistanceRange([0, 10]);
    setRatingFilter(0);
    toast.success("All filters cleared");
  };

  const handleCancel = () => {
    // Reset to previous state or close without applying
    onClose();
  };

  return (
    <DynamicPopup isOpen={isOpen} onClose={onClose} clickEvent={clickEvent}>
      <div className="bg-white rounded-lg shadow-lg max-w-md max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold">Filters</h2>
            {activeFilters > 0 && (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {activeFilters}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={handleCancel} className="hover:bg-gray-100">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 space-y-6">
          {/* Show sold out */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Show sold out</h3>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="sold-out"
                checked={showSoldOut}
                onCheckedChange={setShowSoldOut}
              />
              <Label htmlFor="sold-out" className="text-sm">Include sold out items</Label>
            </div>
          </div>

          {/* Pick-up day */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Pick-up day</h3>
            </div>
            <div className="flex gap-2">
              {days.map((day) => (
                <Button
                  key={day}
                  variant={selectedDays.includes(day) ? "default" : "outline"}
                  className="flex-1 text-sm"
                  onClick={() => toggleSelection(day, selectedDays, setSelectedDays)}
                >
                  {day}
                </Button>
              ))}
            </div>
          </div>

          {/* Pick-up window */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Pick-up window</h3>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                {timeRange[0] === 0 && timeRange[1] === 23 
                  ? "All day" 
                  : `${formatTime(timeRange[0])} - ${formatTime(timeRange[1])}`
                }
              </div>
              <Slider
                value={timeRange}
                onValueChange={setTimeRange as (value: number[]) => void}
                min={0}
                max={23}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Price Range</h3>
            <div className="space-y-2">
              <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
              </div>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange as (value: number[]) => void}
                min={0}
                max={1000}
                step={50}
                className="w-full"
              />
            </div>
          </div>

          {/* Distance Range */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Distance</h3>
            <div className="space-y-2">
              <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                Up to {formatDistance(distanceRange[1])}
              </div>
              <Slider
                value={distanceRange}
                onValueChange={setDistanceRange as (value: number[]) => void}
                min={0}
                max={10}
                step={0.5}
                className="w-full"
              />
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Minimum Rating</h3>
            <div className="flex gap-2">
              {ratingOptions.map((rating) => (
                <Button
                  key={rating}
                  variant={ratingFilter === rating ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRatingFilter(rating)}
                >
                  {rating === 0 ? "Any" : `${rating}+`}
                </Button>
              ))}
            </div>
          </div>

          {/* Surprise Bag types */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Bag Types</h3>
            <div className="flex flex-wrap gap-2">
              {bagTypes.map((type) => (
                <Button
                  key={type}
                  variant={selectedBagTypes.includes(type) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleSelection(type, selectedBagTypes, setSelectedBagTypes)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Dietary preferences */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Dietary Preferences</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map((option) => (
                <Button
                  key={option}
                  variant={selectedDietary.includes(option) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleSelection(option, selectedDietary, setSelectedDietary)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t bg-white sticky bottom-0">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={handleClearAll}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear all
          </Button>
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button 
            className="flex-1 bg-green-600 hover:bg-green-700" 
            onClick={handleApply}
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </DynamicPopup>
  );
};
