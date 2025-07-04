import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileLayout from "@/components/MobileLayout";
import { useCart } from "@/contexts/CartContext";
import MobileMoneyCheckout from "@/components/MobileMoneyCheckout";
import { useState } from "react";

const Cart = () => {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, selectedAddOns } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  if (totalItems === 0) {
    return (
      <MobileLayout>
        <div className="min-h-screen bg-gray-50 pb-20">
          <div className="bg-white border-b border-gray-200 px-4 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
          </div>
          
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 text-center">Add some rescued food to get started</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white border-b border-gray-200 px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
          <p className="text-gray-600 mt-1">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
        </div>

        <div className="p-4 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{item.vendor}</p>
                  <p className="text-lg font-bold text-green-600">KSh {item.price}</p>
                  {item.originalPrice > item.price && (
                    <p className="text-sm text-gray-500 line-through">KSh {item.originalPrice}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="text-sm font-medium px-2">{item.quantity}</span>
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
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {selectedAddOns.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Add-ons</h4>
              {selectedAddOns.map((addon) => (
                <div key={addon.id} className="flex justify-between items-center text-sm py-1">
                  <span>{addon.name}</span>
                  <span className="font-medium">KSh {addon.price}</span>
                </div>
              ))}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total:</span>
              <span className="text-green-600">KSh {totalPrice}</span>
            </div>
          </div>

          <Button 
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white h-12 text-lg"
            onClick={() => setShowCheckout(true)}
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>

      <MobileMoneyCheckout 
        isOpen={showCheckout} 
        onClose={() => setShowCheckout(false)} 
      />
    </MobileLayout>
  );
};

export default Cart;
