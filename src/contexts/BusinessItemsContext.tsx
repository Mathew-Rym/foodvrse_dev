
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface BusinessItem {
  id: number;
  title: string;
  vendor: string;
  description: string;
  price: number;
  originalPrice: number;
  pickup: string;
  quantity: number;
  category: string;
  status: 'active' | 'low_stock' | 'sold_out';
  image: string;
}

interface BusinessItemsContextType {
  items: BusinessItem[];
  addItem: (item: BusinessItem) => void;
  updateItem: (id: number, updates: Partial<BusinessItem>) => void;
  deleteItem: (id: number) => void;
  getConsumerItems: () => BusinessItem[];
}

const BusinessItemsContext = createContext<BusinessItemsContextType | undefined>(undefined);

export const useBusinessItems = () => {
  const context = useContext(BusinessItemsContext);
  if (context === undefined) {
    throw new Error('useBusinessItems must be used within a BusinessItemsProvider');
  }
  return context;
};

interface BusinessItemsProviderProps {
  children: ReactNode;
}

export const BusinessItemsProvider = ({ children }: BusinessItemsProviderProps) => {
  const [items, setItems] = useState<BusinessItem[]>([
    {
      id: 1,
      title: "Mixed Pastries Box",
      vendor: "Mama's Kitchen",
      description: "Assorted fresh pastries including croissants, muffins, and danish",
      price: 400,
      originalPrice: 800,
      pickup: "4:00 PM - 6:00 PM",
      quantity: 5,
      category: "Bakery",
      status: "active",
      image: "/placeholder.svg"
    },
    {
      id: 2,
      title: "Fresh Salad Bundle",
      vendor: "Mama's Kitchen",
      description: "Mixed green salads with seasonal vegetables",
      price: 300,
      originalPrice: 600,
      pickup: "5:00 PM - 7:00 PM",
      quantity: 3,
      category: "Salads",
      status: "low_stock",
      image: "/placeholder.svg"
    }
  ]);

  const addItem = (item: BusinessItem) => {
    setItems(prev => [...prev, item]);
  };

  const updateItem = (id: number, updates: Partial<BusinessItem>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const getConsumerItems = () => {
    return items.filter(item => item.status === 'active' && item.quantity > 0);
  };

  // Store items in localStorage to persist across page refreshes
  useEffect(() => {
    const storedItems = localStorage.getItem('businessItems');
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('businessItems', JSON.stringify(items));
  }, [items]);

  const value = {
    items,
    addItem,
    updateItem,
    deleteItem,
    getConsumerItems
  };

  return (
    <BusinessItemsContext.Provider value={value}>
      {children}
    </BusinessItemsContext.Provider>
  );
};
