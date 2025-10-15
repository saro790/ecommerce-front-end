import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/address.css";

function AddressForm({ onAddressSubmit }) {
  const [address, setAddress] = useState("");
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [bgX, setBgX] = useState(50); // Background position X (%)
  const [bgY, setBgY] = useState(50); // Background position Y (%)
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!address) return alert("⚠️ Please enter your address");
    onAddressSubmit(address);
    navigate("/payment");
  };

  // Mouse movement for 3D tilt + background parallax
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateMax = 10; // Max rotation degrees

    setRotateY(((x - centerX) / centerX) * rotateMax);
    setRotateX(((centerY - y) / centerY) * rotateMax);

    // Parallax background (small movement)
    const parallaxMax = 5; // max 5% movement
    setBgX(50 + ((x - centerX) / centerX) * parallaxMax);
    setBgY(50 + ((centerY - y) / centerY) * parallaxMax);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setBgX(50);
    setBgY(50);
  };

  return (
    <div
      className="address-container"
      style={{ backgroundPosition: `${bgX}% ${bgY}%` }}
    >
      <div
        className="glass-card"
        style={{ transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)` }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <h2>🏠 Enter Shipping Address</h2>
        <form onSubmit={handleSubmit} className="address-form">
          <textarea
            placeholder="Enter address..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></textarea>
          <button type="submit" className="btn-glass">
            Continue to Payment
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddressForm;
