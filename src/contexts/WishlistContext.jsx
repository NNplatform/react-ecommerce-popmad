import React, { createContext, useState, useEffect, useContext } from 'react';
import { getWishList } from '../apis/product';
import config from '../config';
import { useAuth } from './AuthContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { userId } = useAuth();
  const [wishlistItemCount, setWishlistItemCount] = useState(0);

  useEffect(() => {
    const fetchWishlistItemCount = async () => {
      try {
        const wishlistUrl = `${config.apiBaseUrl}/product-svc/wishlist/${userId}`;
        const response = await getWishList(wishlistUrl);
        const items = response.data.result || [];
        setWishlistItemCount(items.length);
      } catch (error) {
        console.error('Error fetching wishlist items:', error);
        setWishlistItemCount(0);
      }
    };

    if (userId) {
      fetchWishlistItemCount();
    } else {
      setWishlistItemCount(0);
    }
  }, [userId]);

  const updateWishlistItemCount = async () => {
    try {
      const wishlistUrl = `${config.apiBaseUrl}/product-svc/wishlist/${userId}`;
      const response = await getWishList(wishlistUrl);
      setWishlistItemCount(response.data.result.length);
    } catch (error) {
      console.error('Error updating wishlist item count:', error);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlistItemCount, updateWishlistItemCount }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
