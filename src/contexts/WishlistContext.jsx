import React, { createContext, useState, useEffect, useContext } from 'react';
import { getWishList } from '../apis/product';
import config from '../config';
import { useAuth } from './AuthContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { userId } = useAuth();
  const [wishlistItemCount, setWishlistItemCount] = useState(0);
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const fetchWishlistItemCount = async () => {
      try {
        const wishlistUrl = `${config.apiBaseUrl}/product-svc/wishlist/${userId}`;
        const response = await getWishList(wishlistUrl);
        const items = response.data.result || [];
        setWishlistItemCount(items.length);
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error('Error fetching wishlist items:', error);
        setWishlistItemCount(0);
        setError('Wishlist Page Not Available'); // Set error message
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
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error updating wishlist item count:', error);
      setError('Wishlist Page Not Available'); // Set error message
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlistItemCount, updateWishlistItemCount, error }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
