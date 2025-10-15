// src/components/Wishlist.jsx
import React, { useState } from "react";
import { useWishlist } from "../context/WishlistContext"; // ✅ custom hook
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [toast, setToast] = useState("");

  const handleAddToCart = (product) => {
    addToCart(product);
    setToast(`✅ ${product.name} added to cart!`);
    setTimeout(() => setToast(""), 2000);
  };

  const handleRemove = (product) => {
    removeFromWishlist(product.id);
    setToast(`❌ ${product.name} removed from wishlist`);
    setTimeout(() => setToast(""), 2000);
  };

  if (wishlist.length === 0) {
    return <p className="text-center mt-3">💔 Your wishlist is empty</p>;
  }

  return (
    <div className="container mt-3">
      <h2 className="text-center mb-3">💖 My Wishlist</h2>

      {/* Toast Notification */}
      {toast && (
        <div className="alert alert-info text-center">
          {toast}
        </div>
      )}

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3">
        {wishlist.map((product) => (
          <div className="col" key={product.id}>
            <div className="card h-100">
              {product.image ? (
                <img
                  src={product.image.startsWith("http") ? product.image : `http://127.0.0.1:8000${product.image}`}
                  className="card-img-top"
                  alt={product.name}
                />
              ) : (
                <div className="no-image text-center p-3">No Image</div>
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <p className="mt-auto"><strong>₹{product.price}</strong></p>
                <div className="d-flex gap-2 mt-2">
                  <button
                    className="btn btn-primary btn-sm flex-grow-1"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemove(product)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-3">
        <Link to="/products" className="btn btn-outline-primary">Continue Shopping</Link>
      </div>
    </div>
  );
}

export default Wishlist;
