import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import config from '../config';
import { getProductById, addWishList } from '../apis/product';
import { addProductToCart } from '../apis/cart';
import artToyImage from '../../images/art-toy.jpg';
import { HeartOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext'; // Import useCart hook
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const { userId } = useAuth();
  const { addToCart } = useCart(); // Use addToCart from CartContext
  const navigate = useNavigate(); // Initialize useNavigate

  const productUrl = `${config.apiBaseUrl}/product-svc/product/${id}`;
  const cartUrl = `${config.apiBaseUrl}/cart-svc/cart/${userId}/add`;
  const wishlistUrl = `${config.apiBaseUrl}/product-svc/wishlist/${userId}/add/${id}`;

  useEffect(() => {
    setLoading(true);
    getProductById(productUrl)
      .then((response) => {
        console.log('Get ProductById Response:', response.data);
        const product = extractProductDetails(response.data);
        setProduct(product);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching product:', error);
        setLoading(false);
        toast.error('Failed to load product');
      });
  }, [productUrl, id]);

  function extractProductDetails(data) {
    if (data.code === '0' && data.result) {
      return {
        productId: data.result.productId,
        name: data.result.name,
        description: data.result.desc,
        price: data.result.price,
        isSoldOut: data.result.isSoldOut,
        stock: data.result.stock,
        imageUrl: artToyImage,
      };
    }
    return {};
  }

  const handleAddToCart = () => {
    if (product) {
      addProductToCart(cartUrl, product.productId, quantity)
        .then((response) => {
          console.log('Add CartItem Response:', response.data);
          if (response.data.code === '-1') {
            toast.error(response.data.message || 'Failed to add to cart. Please try again.');
          } else {
            addToCart(quantity); // Update cart item count
            toast.success('Add to Cart Success');
          }
        })
        .catch(error => {
          console.error('Add to Cart error:', error); 
          if (!userId) {
            navigate('/login'); // Redirect to login page
          } else {
            toast.error('An error occurred. Please try again.');
          }
        });
    } else {
      toast.error('Add Cart failed. Product not available.');
    }
  };

  const handleWishlist = () => {
    if (!userId) {
      navigate('/login'); // Redirect to login page
      return;
    }

    addWishList(wishlistUrl)
      .then((response) => {
        console.log('Add Wishlist Response:', response.data);
        toast.success('Add to Wishlist Success');
      })
      .catch(error => {
        console.error('Add to Wishlist error:', error); // Log the error
        toast.error('An error occurred. Please try again.');
      });
  };

  const incrementQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prevQuantity => Math.max(prevQuantity - 1, 1));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="center-container">
      <ToastContainer />
      <div className="product-detail">
        <div className="product-image-container">
          <img src={product.imageUrl} alt={product.name} className="product-image" />
        </div>
        <div className="product-content">
          <div className="detail-box">
            <h2>{product.name}</h2>
            <p className="price">฿ {product.price}</p>
            <p>{product.description}</p>
          </div>
          <div className="cart-box">
            <div className="quantity-controls">
              <button onClick={decrementQuantity} className="quantity-button"> - </button>
              <span className="quantity-display"> {quantity} </span>
              <button onClick={incrementQuantity} className="quantity-button"> + </button>
            </div>
            <button 
              onClick={handleAddToCart} 
              className="add-to-cart-button" 
              disabled={product.isSoldOut}
            >
              Add to Cart
            </button>
            <button 
              onClick={handleWishlist} 
              className="wishlist-button"
            >
              <HeartOutlined /> Add to Wishlist
            </button>
          </div>
          <div className="manual-box">
            <h3> ยี่ห้อ: POP MAD</h3>
            <h3>ขนาด : สูงโดยประมาณ 6.9-10.9 เซนติเมตร</h3>
            <h3>ส่วนประกอบ:PVC/ABS</h3>
            <h3>ทั้งเซ็ตจะประกอบไปด้วยกล่องสุ่ม 12 ชิ้น</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
