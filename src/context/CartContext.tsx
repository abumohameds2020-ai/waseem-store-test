"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  fulfillment: 'local' | 'global';
  aliexpress_link?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, method: 'local' | 'global') => void;
  removeFromCart: (productId: string, method: 'local' | 'global') => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('kz-phantom-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem('kz-phantom-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: any, method: 'local' | 'global') => {
    setCart(prev => {
      // Check for same ID AND same method
      const existing = prev.find(item => item.id === product.id && item.fulfillment === method);
      
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.fulfillment === method) 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }

      const price = method === 'local' 
        ? parseFloat(product.local_price) 
        : parseFloat(product.global_price);

      return [...prev, { 
        id: product.id, 
        name: `${product.name} [${method.toUpperCase()}]`, 
        price: price || 0, 
        image: product.images?.product || '',
        quantity: 1,
        fulfillment: method,
        aliexpress_link: product.aliexpress_link || ''
      }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, method: 'local' | 'global') => {
    setCart(prev => prev.filter(item => !(item.id === productId && item.fulfillment === method)));
  };

  const clearCart = () => setCart([]);

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, clearCart, 
      totalCount, totalPrice, isCartOpen, setIsCartOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
