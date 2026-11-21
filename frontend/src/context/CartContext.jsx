import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCart(data);
    } catch (err) {
      console.error('Failed to load cart', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (bookId, quantity = 1) => {
    const updatedCart = await cartService.addToCart(bookId, quantity);
    setCart(updatedCart);
    return updatedCart;
  };

  const updateQuantity = async (itemId, quantity) => {
    const updatedCart = await cartService.updateQuantity(itemId, quantity);
    setCart(updatedCart);
    return updatedCart;
  };

  const removeItem = async (itemId) => {
    const updatedCart = await cartService.removeItem(itemId);
    setCart(updatedCart);
    return updatedCart;
  };

  const clearCart = async () => {
    await cartService.clearCart();
    setCart({ id: null, items: [], totalAmount: 0, totalItems: 0 });
  };

  const totalItems = cart?.totalItems || 0;
  const totalAmount = cart?.totalAmount || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        totalItems,
        totalAmount,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
