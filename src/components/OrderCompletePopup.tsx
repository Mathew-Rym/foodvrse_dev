
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, MapPin } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const OrderCompletePopup = () => {
  const { showOrderCompletePopup, setShowOrderCompletePopup, currentOrder } = useCart();

  const handleClose = () => {
    setShowOrderCompletePopup(false);
  };

  if (!currentOrder) return null;

  return (
    <Dialog open={showOrderCompletePopup} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <DialogTitle>Order Confirmed!</DialogTitle>
          </div>
          <DialogDescription>
            Your order has been placed successfully
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Pickup Information</h3>
            <div className="space-y-2 text-sm text-green-700">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{currentOrder.restaurant}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{currentOrder.pickup}</span>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-sm text-orange-700">
              <strong>Important:</strong> Please arrive during the designated pickup time. 
              Late pickups may result in order cancellation.
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Order #{currentOrder.id}
            </p>
            <Button 
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white"
            >
              Got it!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderCompletePopup;
