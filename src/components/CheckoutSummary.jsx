import React from 'react';
import { useLocation } from 'react-router-dom';
import './styles/CheckoutSummary.css'; // Create a CSS file for styling

const CheckoutSummary = () => {
  const location = useLocation();
  const { totalPrice } = location.state || {};

  if (!totalPrice) {
    return <div>No data available</div>;
  }

  return (
    <div className="checkout-summary-container">
      <h2>Order Summary</h2>
      <p>Your order has been successfully placed!</p>
      <h3>Total Price: THB {totalPrice.toFixed(2)}</h3>
    </div>
  );
};

export default CheckoutSummary;
