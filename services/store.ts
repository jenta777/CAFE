import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, CartItem, Order, OrderStatus, Category } from '../types';
import { INITIAL_MENU } from '../constants';

interface StoreContextType {
  menu: MenuItem[];
  cart: CartItem[];
  orders: Order[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  placeOrder: (customerName: string, paymentMethod: 'Credit Card' | 'Apple Pay' | 'Cash') => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;
  isAdmin: boolean;
  loginAdmin: () => void;
  logoutAdmin: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from local storage or defaults
  const [menu, setMenu] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('lumina_menu');
    return saved ? JSON.parse(saved) : INITIAL_MENU;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('lumina_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('lumina_menu', JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    localStorage.setItem('lumina_orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(i => i.quantity > 0));
  };

  const clearCart = () => setCart([]);

  const placeOrder = async (customerName: string, paymentMethod: 'Credit Card' | 'Apple Pay' | 'Cash') => {
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      items: [...cart],
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: OrderStatus.PENDING,
      customerName,
      timestamp: Date.now(),
      paymentMethod
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const addMenuItem = (item: MenuItem) => {
    setMenu(prev => [...prev, item]);
  };

  const deleteMenuItem = (id: string) => {
    setMenu(prev => prev.filter(i => i.id !== id));
  };

  const loginAdmin = () => setIsAdmin(true);
  const logoutAdmin = () => setIsAdmin(false);

  return React.createElement(StoreContext.Provider, {
    value: {
      menu, cart, orders, addToCart, removeFromCart, updateCartQuantity, clearCart,
      placeOrder, updateOrderStatus, addMenuItem, deleteMenuItem, isAdmin, loginAdmin, logoutAdmin
    }
  }, children);
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};