
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Bot, Lightbulb } from 'lucide-react';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: any) => void;
}

interface ItemFormData {
  name: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  quantity: number;
  pickupStart: string;
  pickupEnd: string;
  category: string;
  tags: string[];
}

const AddItemModal = ({ isOpen, onClose, onAddItem }: AddItemModalProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const form = useForm<ItemFormData>({
    defaultValues: {
      name: '',
      description: '',
      originalPrice: 0,
      discountPrice: 0,
      quantity: 1,
      pickupStart: '',
      pickupEnd: '',
      category: '',
      tags: []
    }
  });

  // Suggestion data
  const itemNameSuggestions = [
    "Mixed Pastries Box", "Fresh Salad Bundle", "Sandwich Platter", "Fruit Bowl Mix",
    "Bakery Surprise Box", "Daily Soup Special", "Veggie Wrap Pack", "Coffee & Pastry Combo",
    "Hot Meals Box", "Dessert Selection", "Breakfast Bundle", "Lunch Special"
  ];

  const categorySuggestions = [
    "Bakery", "Salads", "Hot Food", "Sandwiches", "Desserts", "Beverages", 
    "Breakfast", "Lunch", "Dinner", "Snacks", "Fruits", "Vegan"
  ];

  const descriptionSuggestions = [
    "Fresh daily selection of seasonal items at great savings",
    "Perfectly good food that would otherwise go to waste",
    "Made with love using quality ingredients",
    "A delicious variety pack perfect for sharing",
    "Healthy and nutritious options ready for pickup",
    "Artisan-made items from our kitchen to yours"
  ];

  const availableTags = [
    "vegetarian-friendly", "vegan", "gluten-free", "halal", "protein-rich", 
    "mixed", "coffee-included", "dairy-free", "nut-free", "organic",
    "locally-sourced", "fresh-made", "spicy", "mild", "sweet", "savory"
  ];

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    form.setValue('tags', newTags);
  };

  const fillSuggestion = (field: string, value: string) => {
    form.setValue(field as keyof ItemFormData, value);
    setShowSuggestions(false);
  };

  const onSubmit = (data: ItemFormData) => {
    // Format pickup times as ISO strings
    const now = new Date();
    const pickupStart = new Date(now.toDateString() + ' ' + data.pickupStart);
    const pickupEnd = new Date(now.toDateString() + ' ' + data.pickupEnd);

    const newItem = {
      name: data.name,
      description: data.description,
      originalPrice: data.originalPrice,
      discountPrice: data.discountPrice,
      quantity: data.quantity,
      category: data.category,
      tags: selectedTags,
      pickupStart: pickupStart.toISOString(),
      pickupEnd: pickupEnd.toISOString()
    };

    onAddItem(newItem);
    toast.success('Item added successfully!');
    form.reset();
    setSelectedTags([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Food Item</DialogTitle>
        </DialogHeader>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="flex items-center gap-2"
            >
              <Bot className="w-4 h-4" />
              AI Suggestions
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: 'Item name is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Item Name
                    <Lightbulb className="w-3 h-3 text-yellow-500" />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Mixed Pastries Box" {...field} />
                  </FormControl>
                  {showSuggestions && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {itemNameSuggestions.slice(0, 4).map((suggestion, index) => (
                        <Button
                          key={index}
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100"
                          onClick={() => fillSuggestion('name', suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Description
                    <Lightbulb className="w-3 h-3 text-yellow-500" />
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your food item..." rows={3} {...field} />
                  </FormControl>
                  {showSuggestions && (
                    <div className="space-y-1 mt-2">
                      {descriptionSuggestions.slice(0, 3).map((suggestion, index) => (
                        <Button
                          key={index}
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto text-xs bg-green-50 text-green-700 hover:bg-green-100 whitespace-normal text-left p-2"
                          onClick={() => fillSuggestion('description', suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="originalPrice"
                rules={{ required: 'Original price is required', min: 1 }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Price (KSh)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        min="1"
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discountPrice"
                rules={{ required: 'Discount price is required', min: 1 }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Price (KSh)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        min="1"
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* CO2 Impact Preview */}
            {form.watch('quantity') > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-green-600 text-sm">🌱</span>
                  <span className="text-sm font-medium text-green-800">Environmental Impact</span>
                </div>
                <p className="text-sm text-green-700">
                  This listing could save <strong>{(form.watch('quantity') * 0.8).toFixed(1)}kg of CO₂</strong> from going to waste!
                </p>
              </div>
            )}

            <FormField
              control={form.control}
              name="quantity"
              rules={{ required: 'Quantity is required', min: 1 }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Quantity</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1"
                      max="999"
                      {...field} 
                      onChange={(e) => field.onChange(Number(e.target.value))} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pickupStart"
                rules={{ required: 'Pickup start time is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pickup Start</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pickupEnd"
                rules={{ required: 'Pickup end time is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pickup End</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category"
              rules={{ required: 'Category is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Category
                    <Lightbulb className="w-3 h-3 text-yellow-500" />
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categorySuggestions.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags Section */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Tags (Optional)</label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <Button
                    key={tag}
                    type="button"
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    size="sm"
                    className={`h-8 text-xs ${
                      selectedTags.includes(tag) 
                        ? 'bg-orange-500 text-white hover:bg-orange-600' 
                        : 'hover:bg-orange-50'
                    }`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                Add Item
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemModal;
