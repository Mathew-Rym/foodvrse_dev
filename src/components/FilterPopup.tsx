import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface FilterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  showSoldOut: boolean;
  pickupDay: string[];
  pickupWindow: [number, number];
  surpriseBagTypes: string[];
  dietaryPreferences: string[];
}

export const FilterPopup = ({ isOpen, onClose, onApplyFilters }: FilterPopupProps) => {
  const [showSoldOut, setShowSoldOut] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState<[number, number]>([0, 23]);
  const [selectedBagTypes, setSelectedBagTypes] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);

  const bagTypes = ["Meals", "Bread & pastries", "Groceries", "Drinks", "Other"];
  const dietaryOptions = ["Vegetarian", "Vegan"];
  const days = ["Today", "Tomorrow"];

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

  const handleApply = () => {
    onApplyFilters({
      showSoldOut,
      pickupDay: selectedDays,
      pickupWindow: timeRange,
      surpriseBagTypes: selectedBagTypes,
      dietaryPreferences: selectedDietary,
    });
    onClose();
  };

  const handleClearAll = () => {
    setShowSoldOut(false);
    setSelectedDays([]);
    setTimeRange([0, 23]);
    setSelectedBagTypes([]);
    setSelectedDietary([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto p-0 max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">Filter Options</DialogTitle>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Filters</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 space-y-6">
          {/* Show sold out */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Show sold out</h3>
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
            <h3 className="font-semibold text-gray-900">Pick-up day</h3>
            <div className="flex gap-2">
              {days.map((day) => (
                <Button
                  key={day}
                  variant={selectedDays.includes(day) ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => toggleSelection(day, selectedDays, setSelectedDays)}
                >
                  {day}
                </Button>
              ))}
            </div>
          </div>

          {/* Pick-up window */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Pick-up window</h3>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
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

          {/* Surprise Bag types */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Surprise Bag types</h3>
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
            <h3 className="font-semibold text-gray-900">Dietary preferences</h3>
            <div className="flex gap-2">
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
        <div className="flex gap-3 p-4 border-t">
          <Button variant="outline" className="flex-1" onClick={handleClearAll}>
            Clear all
          </Button>
          <Button className="flex-1 bg-black text-white" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};