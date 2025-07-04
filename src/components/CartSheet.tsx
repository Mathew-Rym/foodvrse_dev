
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import MobileMoneyCheckout from "./MobileMoneyCheckout";

const CartSheet = () => {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, selectedAddOns } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  if (totalItems === 0) {
    return (
      <Button variant="ghost" size="sm" className="flex items-center space-x-1">
        <ShoppingBag className="w-4 h-4" />
        <span className="hidden sm:inline">Cart</span>
      </Button>
    );
  }

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center space-x-1 relative">
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
              {totalItems}
            </Badge>
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Your Cart</SheetTitle>
            <SheetDescription>
              {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {/* Cart Items */}
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-600">{item.vendor}</p>
                  <p className="text-sm font-bold text-green-600">KSh {item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="text-sm font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}

            {/* Add-ons */}
            {selectedAddOns.length > 0 && (
              <div className="pt-4 border-t">
                <h4 className="font-medium text-sm mb-2">Add-ons</h4>
                {selectedAddOns.map((addon) => (
                  <div key={addon.id} className="flex justify-between items-center text-sm">
                    <span>{addon.name}</span>
                    <span>KSh {addon.price}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Total */}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span>KSh {totalPrice}</span>
              </div>
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white"
              onClick={() => setShowCheckout(true)}
            >
              Checkout
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <MobileMoneyCheckout 
        isOpen={showCheckout} 
        onClose={() => setShowCheckout(false)} 
      />
    </>
  );
};

export default CartSheet;
