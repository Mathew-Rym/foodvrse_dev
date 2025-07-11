import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface QuantitySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
  bag: {
    vendor: string;
    title: string;
    price: number;
    pickup: string;
    location: string;
  };
}

export const QuantitySelector = ({ isOpen, onClose, onConfirm, bag }: QuantitySelectorProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleConfirm = () => {
    onConfirm(quantity);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="font-bold text-lg">{bag.vendor} - {bag.location}</h2>
          <p className="text-gray-600 text-sm mt-1">Today: {bag.pickup}</p>
        </div>

        {/* Quantity selector */}
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">Select quantity</p>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-full"
              >
                <Minus className="w-4 h-4" />
              </Button>
              
              <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= 10}
                className="w-10 h-10 rounded-full"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Total */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total</span>
              <span className="font-bold text-lg">KSh {(bag.price * quantity).toLocaleString()}</span>
            </div>
          </div>

          {/* Terms */}
          <p className="text-xs text-gray-600 text-center">
            By reserving this meal you agree to Too Good To Go's{" "}
            <a href="/terms-of-service" className="text-primary hover:underline">
              terms & conditions
            </a>
          </p>

          {/* Reserve button */}
          <Button 
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3"
            onClick={handleConfirm}
          >
            RESERVE NOW
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};