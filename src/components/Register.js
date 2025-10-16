import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import backImage from "../assets/images/back.jpg";
import "../styles/register.css"; // CSS import

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      setError("⚠️ Passwords do not match");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/register/", {
        username: formData.username,
        password: formData.password,
      });

      login(formData.username); // auto-login
      navigate("/products");
    } catch (err) {
      setError("⚠️ Registration failed. Username may already exist.");
    }
  };

  return (
    <div
  className="register-page"
  style={{ backgroundImage: `url(${backImage})` }} // ✅ Set background here
>
      <div className="register-container">
        <h2 className="register-title">Register</h2>
        {error && <div className="register-message">{error}</div>}
        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="register-input"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="register-input"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            className="register-input"
            value={formData.confirm_password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="register-button">
            Register
          </button>
        </form>
        <div className="register-footer">
          Already have an account?{" "}
          <Link to="/login" className="login-link">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
