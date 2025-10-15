// src/components/CartPayment.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CartPayment() {
  const navigate = useNavigate();

  // Sample cart data
  const [cart, setCart] = useState([
    { product: { id: 1, name: "Apple", price: 50 }, quantity: 2 },
    { product: { id: 2, name: "Banana", price: 30 }, quantity: 3 },
  ]);

  const [userAddress, setUserAddress] = useState("123, MG Road, Bangalore");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);

  // Calculate total amount
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  useEffect(() => {
    // Load Razorpay script dynamically
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => alert("Failed to load Razorpay SDK");
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    if (!razorpayLoaded) return alert("Razorpay not loaded yet");
    if (!cart || cart.length === 0 || totalAmount <= 0)
      return alert("Cart is empty!");

    try {
      setCreatingOrder(true);

      // 1️⃣ Create order on backend
      const res = await fetch("http://127.0.0.1:8000/api/create-order/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount * 100, // Razorpay expects paise
          currency: "INR",
          cart,
          address: userAddress,
        }),
      });

      const orderData = await res.json();
      if (!res.ok) {
        setCreatingOrder(false);
        return alert(orderData.error || "Failed to create order");
      }

      const { razorpay_order_id, amount: serverAmount, currency, order_id } =
        orderData;

      // 2️⃣ Open Razorpay checkout
      const options = {
        key: "rzp_test_yourkeyhere", // move to env in production
        amount: serverAmount || totalAmount * 100,
        currency: currency || "INR",
        name: "Saro Shop",
        description: "Order Payment",
        order_id: razorpay_order_id,
        prefill: { name: "", email: "" },
        handler: async function (response) {
          try {
            // 3️⃣ Verify payment on backend
            const verifyRes = await fetch(
              "http://127.0.0.1:8000/api/verify/",
              {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  order_id,
                }),
              }
            );

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              alert("Payment verification failed");
              return;
            }

            // ✅ Payment successful
            alert("Payment successful! Order ID: " + verifyData.order.id);
            setCart([]); // clear cart
            navigate("/order-history");
          } catch (err) {
            console.error("Verification error:", err);
            alert("Payment verification error");
          }
        },
        modal: {
          ondismiss: function () {
            alert("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setCreatingOrder(false);
    } catch (err) {
      setCreatingOrder(false);
      console.error(err);
      alert("Payment initiation failed");
    }
  };

  return (
    <div className="container mt-3">
      <h2>Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty!</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.product.id}>
              {item.product.name} x {item.quantity} = ₹
              {item.product.price * item.quantity}
            </div>
          ))}
          <h4>Total: ₹{totalAmount}</h4>
          <button
            className="btn btn-primary"
            onClick={handlePayment}
            disabled={!razorpayLoaded || creatingOrder}
          >
            {!razorpayLoaded
              ? "Loading payment..."
              : creatingOrder
              ? "Preparing payment..."
              : `Pay ₹${totalAmount}`}
          </button>
        </div>
      )}
    </div>
  );
}

export default CartPayment;
