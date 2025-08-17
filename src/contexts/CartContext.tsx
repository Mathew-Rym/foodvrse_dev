
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

interface Order {
  id: string;
  items: CartItem[];
  addOns: AddOn[];
  total: number;
  status: 'preparing' | 'ready' | 'completed';
  pickup: string;
  date: string;
  restaurant: string;
}

interface CartContextType {
  items: CartItem[];
  orders: Order[];
  addToCart: (item: Omit<CartItem, 'quantity'>, requiresAuth?: boolean) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  completeOrder: () => void;
  updateOrderStatus: (orderId: string, status: 'preparing' | 'ready' | 'completed') => void;
  totalItems: number;
  totalPrice: number;
  showAddOnPopup: boolean;
  setShowAddOnPopup: (show: boolean) => void;
  selectedAddOns: AddOn[];
  addAddOn: (addOn: AddOn) => void;
  removeAddOn: (addOnId: string) => void;
  showOrderCompletePopup: boolean;
  setShowOrderCompletePopup: (show: boolean) => void;
  currentOrder: Order | null;
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [showAddOnPopup, setShowAddOnPopup] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [showOrderCompletePopup, setShowOrderCompletePopup] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const addToCart = (item: Omit<CartItem, 'quantity'>, requiresAuth = false) => {
    if (requiresAuth) {
      // This will be handled by the component calling this function
      return;
    }

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

  const completeOrder = async () => {
const { user } = useAuth();
    if (items.length === 0) return;

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      items: [...items],
      addOns: [...selectedAddOns],
      total: totalPrice,
      status: 'preparing',
      pickup: items[0]?.pickup || 'TBD',
      date: new Date().toLocaleDateString(),
      restaurant: items[0]?.vendor || 'Restaurant'
    };

    setOrders(prev => [newOrder, ...prev]);
    setCurrentOrder(newOrder);
    setItems([]);
    setSelectedAddOns([]);
    setShowOrderCompletePopup(true);
n    // Update user impact if user is authenticated
    if (user) {
      try {
        const purchaseData = {
          id: newOrder.id,
          user_id: user.id,
          total_amount: newOrder.total,
          items: newOrder.items.map(item => ({
            name: item.title,
            quantity: item.quantity,
            price: item.price,
            original_price: item.originalPrice
          })),
          created_at: new Date().toISOString()
        };
        
        await PurchaseImpactService.updateImpactFromPurchase(purchaseData);
      } catch (error) {
        console.error("Error updating impact from purchase:", error);
      }
    }
  };

  const updateOrderStatus = (orderId: string, status: 'preparing' | 'ready' | 'completed') => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status } : order
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
    orders,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    completeOrder,
    updateOrderStatus,
    totalItems,
    totalPrice,
    showAddOnPopup,
    setShowAddOnPopup,
    selectedAddOns,
    addAddOn,
    removeAddOn,
    showOrderCompletePopup,
    setShowOrderCompletePopup,
    currentOrder
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
