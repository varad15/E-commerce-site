// src/context/CartContext.jsx
// Global cart management with localStorage for guest users

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const CartContext = createContext();

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const isInitialized = useRef(false);

  const loadCart = useCallback(() => {
    if (isInitialized.current) return;
    
    try {
      const savedCart = localStorage.getItem('guestCart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (err) {
      console.error('Error loading cart:', err);
    } finally {
      setLoading(false);
      isInitialized.current = true;
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  useEffect(() => {
    if (!loading && isInitialized.current) {
      localStorage.setItem('guestCart', JSON.stringify(cart));
    }
  }, [cart, loading]);

  const addToCart = useCallback((product, quantity = 1) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(
        item => item.productId === product._id
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevCart.items];
        updatedItems[existingItemIndex].quantity += quantity;
        return { items: updatedItems };
      } else {
        const newItem = {
          _id: `${product._id}-${Date.now()}`,
          productId: product._id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image,
          categoryName: product.categoryName,
          quantity: quantity,
          stockQuantity: product.stockQuantity
        };
        return { items: [...prevCart.items, newItem] };
      }
    });
  }, []);

  const updateQuantity = useCallback((itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart => {
      const updatedItems = prevCart.items.map(item =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      );
      return { items: updatedItems };
    });
  }, []);

  const removeItem = useCallback((itemId) => {
    setCart(prevCart => {
      const updatedItems = prevCart.items.filter(item => item._id !== itemId);
      return { items: updatedItems };
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart({ items: [] });
    localStorage.removeItem('guestCart');
  }, []);

  const getCartCount = useCallback(() => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  }, [cart.items]);

  const getCartTotal = useCallback(() => {
    return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart.items]);

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    getCartCount,
    getCartTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};