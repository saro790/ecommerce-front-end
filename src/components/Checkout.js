import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import Payment from "./Payment";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const total = cart.reduce((acc, item) => acc + item.price, 0);
  const [address, setAddress] = useState("");
  const [paymentStarted, setPaymentStarted] = useState(false);

  if (!cart.length) return <p className="text-center mt-3">Cart is empty</p>;

  return (
    <div className="container mt-3">
      <h2>Checkout</h2>
      {!paymentStarted ? (
        <>
          <textarea
            placeholder="Enter delivery address"
            className="form-control mb-2"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button className="btn btn-primary" disabled={!address} onClick={() => setPaymentStarted(true)}>
            Pay ₹{total}
          </button>
        </>
      ) : (
        <Payment
          amount={total}
          cart={cart}
          address={address}
          onPaymentSuccess={() => clearCart()} // clear cart after payment success
        />
      )}
    </div>
  );
}
