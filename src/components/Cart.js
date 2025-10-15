// src/components/Cart.jsx
import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../styles/Cart.css"; // Import CSS

function Cart() {
  const { cart, setCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cart.length === 0) return alert("⚠️ Cart is empty!");
    navigate("/address");
  };

  const increaseQty = (item) => {
    const updated = cart.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    setCart(updated);
  };

  const decreaseQty = (item) => {
    const updated = cart.map((c) =>
      c.id === item.id ? { ...c, quantity: Math.max(c.quantity - 1, 1) } : c
    );
    setCart(updated);
  };

  const removeItem = (item) => setCart(cart.filter((c) => c.id !== item.id));

  return (
    <div className="cart-container">
      <div className="glass-card">
        <h2>🛒 Your Cart</h2>

        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered mt-3">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>₹{item.price}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={() => decreaseQty(item)}
                      >
                        -
                      </button>
                      {item.quantity || 1}
                      <button
                        className="btn btn-sm btn-outline-primary ms-1"
                        onClick={() => increaseQty(item)}
                      >
                        +
                      </button>
                    </td>
                    <td>₹{(item.price * (item.quantity || 1)).toFixed(2)}</td>
                    <td>
                      <button className="btn btn-sm btn-danger" onClick={() => removeItem(item)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Buttons */}
        <div className="d-flex justify-content-between mt-3">
          <button className="btn btn-outline-primary" onClick={() => navigate("/products")}>
            Go to Products
          </button>

          {cart.length > 0 && (
            <button className="btn btn-success" onClick={handleCheckout}>
              Proceed to Address
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;
