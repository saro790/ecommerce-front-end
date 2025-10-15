// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

function Navbar() {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
      <Link className="navbar-brand" to="/products">🛒 Np Shop</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/products">Products</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/cart">Cart ({cart.length})</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/wishlist">Wishlist ({wishlist.length})</Link>
          </li>
        </ul>
        <div className="d-flex align-items-center">
          {username ? (
            <>
              <span className="me-2">👋 {username}</span>
              <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-success btn-sm me-2">Login</Link>
              <Link to="/register" className="btn btn-outline-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
