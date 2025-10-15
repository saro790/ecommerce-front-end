// src/components/Products.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import "../styles/products.css";
import "bootstrap/dist/css/bootstrap.min.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { cart, addToCart, clearCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { username, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/products/");
        const data = await res.json();
        setProducts(data);
        const productCategories = data.map((p) => p.category?.name).filter(Boolean);
        setCategories(["All", ...new Set(productCategories)]);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("⚠️ Failed to load products.");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === "All" || p.category?.name === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleWishlist = (product) => {
    if (wishlist.find((item) => item.id === product.id)) removeFromWishlist(product.id);
    else addToWishlist(product);
  };

  return (
    <div className="container products-container">
      <h1 className="text-center mb-4">🛒 Np Shop</h1>

      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <h5 className="mb-0">👋 Welcome, {username || "Guest"}</h5>
        {username && (
          <button className="btn btn-outline-danger btn-sm mt-2 mt-md-0" onClick={logout}>
            Logout
          </button>
        )}
      </div>

      {/* Cart + Go to Cart + Wishlist button */}
      <div className="cart-summary text-end mb-3 d-flex gap-2 flex-wrap justify-content-end">
        🧺 <strong>Cart Items:</strong> {cart.length}
        <button className="btn btn-outline-dark btn-sm" onClick={() => navigate("/cart")}>
          Go to Cart
        </button>
        <button className="btn btn-outline-warning btn-sm" onClick={() => navigate("/wishlist")}>
          Go to Wishlist ({wishlist.length})
        </button>
        {cart.length > 0 && (
          <button className="btn btn-danger btn-sm" onClick={clearCart}>
            Clear Cart
          </button>
        )}
      </div>

      {/* Search + Categories */}
      <div className="mb-3 d-flex justify-content-center gap-2 flex-wrap">
        <input
          type="text"
          className="form-control search-bar"
          placeholder="🔍 Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {categories.map((cat) => (
          <button
            key={cat}
            className={`btn btn-sm ${selectedCategory === cat ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <p className="text-center">Loading products...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && filteredProducts.length === 0 && <p className="text-center">❌ No products found</p>}

      {/* Products Grid */}
      <div className="row row-cols-2 row-cols-sm-3 row-cols-md-5 g-3">
        {filteredProducts.map((product) => (
          <div className="col" key={product.id}>
            <ProductCard
              product={product}
              addToCart={addToCart}
              toggleWishlist={toggleWishlist}
              inWishlist={wishlist.find((item) => item.id === product.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;

// 🌟 Product Card
function ProductCard({ product, addToCart, toggleWishlist, inWishlist }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const navigate = useNavigate();

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateMax = 10;
    setRotateY(((x - centerX) / centerX) * rotateMax);
    setRotateX(((centerY - y) / centerY) * rotateMax);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      className="card product-card"
      style={{ transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {product.stock === 0 && <span className="stock-badge">Out of Stock</span>}

      <div className="image-wrapper">
        {product.image ? (
          <img
            src={product.image.startsWith("http") ? product.image : `http://127.0.0.1:8000${product.image}`}
            alt={product.name}
            className={`product-image ${product.stock === 0 ? "out-of-stock-img" : ""}`}
          />
        ) : (
          <div className="no-image">No Image</div>
        )}
      </div>

      <div className="card-body d-flex flex-column p-2 text-center">
        <h6 className="fw-bold">{product.name}</h6>
        <p className="text-muted small">{product.description}</p>
        <p className="card-price mb-2">₹{product.price}</p>

        <div className="d-flex gap-2 justify-content-center flex-wrap">
          {/* Add to Cart */}
          <button
            className="btn btn-sm btn-success flex-grow-1"
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
          >
            🛍 Add
          </button>

          {/* Wishlist: toggle + go to wishlist */}
          <button
            className={`btn btn-sm ${inWishlist ? "btn-danger" : "btn-outline-danger"}`}
            onClick={() => {
              toggleWishlist(product);
              navigate("/wishlist");
            }}
          >
            {inWishlist ? "♥" : "♡"}
          </button>
        </div>
      </div>
    </div>
  );
}
