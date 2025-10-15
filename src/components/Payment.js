// src/components/Payment.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/payment.css"; // Import CSS

function Payment() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  // Total amount
  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePayment = () => {
    setSuccess(true); // ✅ Show success message on page
    clearCart();
  };

  if (success) {
    return (
      <div className="payment-container">
        <div className="glass-card text-center">
          <h2>💳 Payment</h2>
          <p className="text-white">✅ Payment successful! Order placed.</p>
          <button className="btn-glass mt-3" onClick={() => navigate("/products")}>
            Go to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="glass-card">
        <h2>💳 Payment</h2>
        {cart.length === 0 ? (
          <p>⚠️ Cart is empty!</p>
        ) : (
          <>
            <ul className="payment-list">
              {cart.map((item) => (
                <li key={item.id}>
                  {item.name} x {item.quantity} - ₹{item.price * item.quantity}
                </li>
              ))}
            </ul>
            <p className="total"><strong>Total Amount: ₹{totalAmount}</strong></p>
            <button className="btn-glass" onClick={handlePayment}>
              Pay Now
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Payment;
