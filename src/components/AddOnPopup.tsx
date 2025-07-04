
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const AddOnPopup = () => {
  const { showAddOnPopup, setShowAddOnPopup, selectedAddOns, addAddOn, removeAddOn } = useCart();

  const availableAddOns = [
    {
      id: 'drink-1',
      name: 'Fresh Juice',
      price: 150,
      description: 'Freshly squeezed orange juice'
    },
    {
      id: 'drink-2',
      name: 'Soda',
      price: 80,
      description: 'Assorted soft drinks'
    },
    {
      id: 'dessert-1',
      name: 'Ice Cream',
      price: 200,
      description: 'Vanilla or chocolate ice cream'
    },
    {
      id: 'extra-1',
      name: 'Extra Bread',
      price: 50,
      description: 'Fresh baked bread'
    }
  ];

  const isSelected = (addOnId: string) => {
    return selectedAddOns.some(addon => addon.id === addOnId);
  };

  const handleAddOnToggle = (addOn: typeof availableAddOns[0]) => {
    if (isSelected(addOn.id)) {
      removeAddOn(addOn.id);
    } else {
      addAddOn(addOn);
    }
  };

  return (
    <Dialog open={showAddOnPopup} onOpenChange={setShowAddOnPopup}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Order</DialogTitle>
          <DialogDescription>
            Add some extras to make your meal even better!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {availableAddOns.map((addOn) => (
            <div key={addOn.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{addOn.name}</h4>
                <p className="text-sm text-gray-600">{addOn.description}</p>
                <Badge variant="outline" className="mt-1">
                  KSh {addOn.price}
                </Badge>
              </div>
              <Button
                variant={isSelected(addOn.id) ? "default" : "outline"}
                size="sm"
                onClick={() => handleAddOnToggle(addOn)}
                className={isSelected(addOn.id) ? "bg-green-500 hover:bg-green-600" : ""}
              >
                {isSelected(addOn.id) ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </Button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={() => setShowAddOnPopup(false)} className="flex-1">
            Skip
          </Button>
          <Button onClick={() => setShowAddOnPopup(false)} className="flex-1 bg-gradient-to-r from-orange-500 to-red-500">
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddOnPopup;
