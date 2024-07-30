import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getCartItem, addProductToCart, removeProductInCart } from '../apis/cart';
import { getProductAll } from '../apis/product';  
import { checkout } from '../apis/order';  
import config from '../config';
import artToyImage from '../../images/art-toy.jpg';
import { useNavigate } from 'react-router-dom'; 
import './styles/Cart.css'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateCartItem, setUpdateCartItem] = useState(null);
  const [removeCartItem, setRemoveCartItem] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [isCheckoutPending, setIsCheckoutPending] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const { userId } = useAuth();
  const navigate = useNavigate();
  const fetchCartUrl = `${config.apiBaseUrl}/cart-svc/cart/user/${userId}`;
  const productUrl = `${config.apiBaseUrl}/product-svc/product`;

  useEffect(() => {
    setLoading(true);
    setError(null);
    getCartItem(fetchCartUrl)
      .then((response) => {
        const carts = extractCarts(response.data);
        return findProductDetail().then(products => ({ carts, products }));
      })
      .then(({ carts, products }) => {
        const result = extractResult(carts, products);
        setCartItems(result);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching cart items:', error);
        setError(error);
        setLoading(false);
      });
  }, [fetchCartUrl]);

  useEffect(() => {
    if (updateCartItem) {
      const { productId, quantity } = updateCartItem;
      const addCartUrl = `${config.apiBaseUrl}/cart-svc/cart/${userId}/add`;
      addProductToCart(addCartUrl, productId, quantity)
        .then(response => {
          console.log('cart result:', response.data);
  
          if (response.data.code === '-1') {
            toast.error(response.data.message || 'Failed to update cart item. Please try again.');
          } else {
            setErrorMessages(prev => ({
              ...prev,
              [productId]: null
            }));
            console.log('Add Cart Response:', response.data);
            //toast.success('Item added to cart successfully.');
          }
        })
        .catch(error => {
          toast.error('An error occurred. Please try again.');
          console.error('An error occurred. Please try again.', error);
        });
    }
  }, [updateCartItem, userId]);
  

  useEffect(() => {
    if (removeCartItem) {
      const { productId, quantity } = removeCartItem;
      const removeCartUrl = `${config.apiBaseUrl}/cart-svc/cart/${userId}`;
      console.log(`Removing productId ${productId} amount ${quantity} of userId: ${userId}`);
      removeProductInCart(removeCartUrl, productId, quantity)
        .then(response => {
          console.log('Remove Cart Response:', response.data);
  
          if (response.data.code === '-1') {
            toast.error(response.data.message || 'Failed to remove item from cart. Please try again.');
          } else {
            setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
            setShowPopup(false);
            setRemoveCartItem(null);
          }
        })
        .catch(error => {
          toast.error('An error occurred. Please try again.');
          console.error('An error occurred. Please try again.', error);
        });
    }
  }, [removeCartItem, userId]);
  
  useEffect(() => {
    if (isCheckoutPending) {
      const orderUrl = `${config.apiBaseUrl}/order-svc/order/checkout`;
      checkout(orderUrl, userId)
        .then(response => {
          console.log('Checkout Order response:', response.data);
  
          if (response.data.code === '-1') {
            // Show error message if the code is '-1'
            toast.error(response.data.message || 'Failed to complete checkout. Please try again.');
            setIsCheckoutPending(false); // Stop the checkout process
          } else {
            // Proceed to checkout summary page if no error
            const totalPrice = calculateTotal(); // Get the total price for the order
            setCartItems([]);
            setIsCheckoutPending(false);
            navigate('/checkout-summary', { state: { totalPrice } }); // Redirect to CheckoutSummary page
          }
        })
        .catch(error => {
          toast.error('An error occurred during checkout. Please try again.');
          setIsCheckoutPending(false); // Stop the checkout process
          console.error('An error occurred during checkout. Please try again.', error);
        });
    }
  }, [isCheckoutPending, userId, navigate]);
  

  function extractResult(carts, products) {
    return products.map(product => {
      const matchingItem = carts.find(cart => cart.productId === product.productId);
      return matchingItem ? { ...product, ...matchingItem } : null;
    }).filter(Boolean);
  }

  function extractCarts(data) {
    if (data.code === "0" && Array.isArray(data.result)) {
      const sortedItems = data.result.sort((a, b) => a.cartItemId - b.cartItemId);
      return sortedItems.map(cart => ({
        productId: cart.productId,
        quantity: cart.quantity,
        cartItemId: cart.cartItemId
      }));
    }
    return [];
  }

  function findProductDetail() {
    return new Promise((resolve, reject) => {
      getProductAll(productUrl)
        .then((response) => {
          console.log('Response data:', response.data);
          const products = extractProducts(response.data);
          resolve(products);
        })
        .catch((error) => {
          console.error('Error fetching products:', error);
          reject(error);
        });
    });
  }

  function extractProducts(data) {
    if (data.code === "0" && Array.isArray(data.result)) {
      const sortedProducts = data.result.sort((a, b) => a.productId - b.productId);
      return sortedProducts.map(product => ({
        productId: product.productId,
        name: product.name,
        price: product.price,
        stock: product.stock,
        imageUrl: artToyImage
      }));
    }
    return [];
  }

  const handleQuantityChange = (itemId, newQuantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.productId === itemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
    setUpdateCartItem({ productId: itemId, quantity: newQuantity });
  };

  const handleRemoveItem = (itemId, quantity) => {
    setItemToRemove({ productId: itemId, quantity });
    setShowPopup(true);
  };

  const confirmRemoveItem = () => {
    if (itemToRemove) {
      setRemoveCartItem(itemToRemove);
      setItemToRemove(null);
    }
  };

  const handleCheckout = () => {
    setIsCheckoutPending(true);
  };

  const cancelRemoveItem = () => {
    setShowPopup(false);
    setItemToRemove(null);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const isCheckoutDisabled = calculateTotal() === 0 || cartItems.length === 0;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="center-container">
      <div className="cart-container">
        <ToastContainer position="top-right" autoClose={80} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        <h2 className="cart-title">SHOPPING CART</h2>
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.productId} className="cart-item">
              <img src={item.imageUrl} alt={item.name} className="item-image" />
              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-price">THB {item.price.toFixed(2)}</p>
                <div className="item-quantity">
                  QUANTITY:
                  <select 
                    className="quantity-select"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value))}
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>
                <p className="item-subtotal">SUBTOTAL: THB {(item.price * item.quantity).toFixed(2)}</p>
                {errorMessages[item.productId] && (
                  <p className="error-message">{errorMessages[item.productId]}</p>
                )}
              </div>
              <button className="remove-item" onClick={() => handleRemoveItem(item.productId, item.quantity)}>×</button>
            </div>
          ))}
        </div>
        <div className="order-summary">
          <h3 className="summary-title">ORDER SUMMARY: {calculateTotalQuantity()} ITEM(S)</h3>
          <div className="summary-item">
            <span>Item(s) subtotal</span>
            <span>THB {calculateTotal().toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <strong>SUBTOTAL</strong>
            <strong>THB {calculateTotal().toFixed(2)}</strong>
          </div>
          <div className="summary-item">
            <strong>ORDER TOTAL</strong>
            <strong>THB {calculateTotal().toFixed(2)}</strong>
          </div>
        </div>
        <button
          className={`checkout-button ${isCheckoutDisabled ? 'disabled' : ''}`}
          onClick={handleCheckout}
          disabled={isCheckoutDisabled}
        >
        CHECKOUT
        </button>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Confirm Removal</h3>
            <p>Are you sure you want to remove this item from your cart?</p>
            <button className="popup-button" onClick={confirmRemoveItem}>Remove</button>
            <button className="popup-button" onClick={cancelRemoveItem}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
