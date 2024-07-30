// src/contexts/CartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCartItem } from '../apis/cart';
import config from '../config';
import { useAuth } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { userId } = useAuth();
  const [cartItemCount, setCartItemCount] = useState(0);

  // Fetch cart item count whenever userId changes
  useEffect(() => {
    const fetchCartItemCount = async () => {
      try {
        const cartUrl = `${config.apiBaseUrl}/cart-svc/cart/user/${userId}`;
        const response = await getCartItem(cartUrl);
        const items = response.data.result || [];
        setCartItemCount(items.reduce((total, item) => total + item.quantity, 0));
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setCartItemCount(0);
      }
    };

    if (userId) {
      fetchCartItemCount();
    } else {
      setCartItemCount(0);
    }
  }, [userId]);

  const addToCart = (quantity) => {
    setCartItemCount(prevCount => prevCount + quantity);
  };

  return (
    <CartContext.Provider value={{ cartItemCount, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
