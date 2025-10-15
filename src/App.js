// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

import Navbar from "./components/Navbar";
import Products from "./components/Products";
import Cart from "./components/Cart";
import AddressForm from "./components/AddressForm";
import Payment from "./components/Payment";
import OrderHistory from "./components/OrderHistory";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [orderAddress, setOrderAddress] = useState("");
  const [orderAmount, setOrderAmount] = useState(0);

  // ✅ Cart update → localStorage & Total Amount
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));

    const total = cart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
    setOrderAmount(total);
  }, [cart]);

  const handleAddressSubmit = (address) => {
    setOrderAddress(address);
  };

  const handlePaymentSuccess = () => {
    alert("✅ Order placed successfully!");
    setCart([]);
    setOrderAddress("");
    localStorage.removeItem("cart");
  };

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Navigate to="/products" />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
              <Route
                path="/address"
                element={<AddressForm onAddressSubmit={handleAddressSubmit} />}
              />
              <Route
                path="/payment"
                element={
                  <Payment
                    amount={orderAmount}
                    cart={cart}
                    address={orderAddress}
                    onPaymentSuccess={handlePaymentSuccess}
                  />
                }
              />
              <Route path="/order-history" element={<OrderHistory />} />
              <Route path="*" element={<Navigate to="/products" />} />
            </Routes>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
