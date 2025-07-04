
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  id: number;
  title: string;
  vendor: string;
  price: number;
  originalPrice: number;
  pickup: string;
  quantity: number;
}

interface AddOn {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  showAddOnPopup: boolean;
  setShowAddOnPopup: (show: boolean) => void;
  selectedAddOns: AddOn[];
  addAddOn: (addOn: AddOn) => void;
  removeAddOn: (addOnId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [showAddOnPopup, setShowAddOnPopup] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      const newItem = { ...item, quantity: 1 };
      setShowAddOnPopup(true);
      return [...prevItems, newItem];
    });
  };

  const removeFromCart = (id: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setSelectedAddOns([]);
  };

  const addAddOn = (addOn: AddOn) => {
    setSelectedAddOns(prev => [...prev, addOn]);
  };

  const removeAddOn = (addOnId: string) => {
    setSelectedAddOns(prev => prev.filter(addon => addon.id !== addOnId));
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 
                    selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    showAddOnPopup,
    setShowAddOnPopup,
    selectedAddOns,
    addAddOn,
    removeAddOn
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
