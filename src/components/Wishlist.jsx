import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getWishList, removeWishList } from '../apis/product'; 
import config from '../config';
import { HeartFilled, DeleteOutlined } from '@ant-design/icons'; // Import DeleteOutlined icon
import './styles/Wishlist.css';
import artToyImage from '../../images/art-toy.jpg'; // Default image if item doesn't have an image

const Wishlist = () => {
  const { userId } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const wishlistUrl = `${config.apiBaseUrl}/product-svc/wishlist/${userId}`;
        const response = await getWishList(wishlistUrl);
        console.log('Get WishlistItem Response:', response.data);
        setWishlistItems(response.data.result || []);
      } catch (error) {
        console.error('Error fetching wishlist items:', error);
      }
    };

    if (userId) {
      fetchWishlist();
    }
  }, [userId]);

  const handleRemoveItem = async (productId) => {
    try {
      const removeUrl = `${config.apiBaseUrl}/product-svc/wishlist/${userId}/remove/${productId}`;
      await removeWishList(removeUrl);
      setWishlistItems(prevItems => prevItems.filter(item => item.productId !== productId));
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
    }
  };

  return (
    <div className="wishlist-container">
      <h1>WISH LIST</h1>
      <p>{wishlistItems.length} Item(s)</p>
      <div className="wishlist-items">
        {wishlistItems.length > 0 ? (
          wishlistItems.map(item => (
            <div key={item.productId} className="wishlist-item">
              <div className="wishlist-item-image">
                <img 
                  src={item.imageUrl || artToyImage} 
                  alt={item.name} 
                  className="wishlist-item-img"
                />
                <HeartFilled className="heart-icon" />
              </div>
              <div className="wishlist-item-details">
                <h3>{item.name}</h3>
                <p>Product ID: {item.productId}</p>
                {item.isSoldOut && <p className="sold-out">SOLD OUT</p>}
              </div>
              <button 
                onClick={() => handleRemoveItem(item.productId)} 
                className="remove-button"
              >
                <DeleteOutlined />
              </button>
            </div>
          ))
        ) : (
          <p>No items in your wishlist.</p>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
