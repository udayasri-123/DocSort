// src/components/SignUpPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUpPage.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // State for toggling password visibility
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation for form fields
    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill all the fields');
      return;
    }

    // Call API or handle form submission logic here

    // On successful submission, route to Home Page (you can modify the routing as needed)
    navigate('/upload');
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="signup-container">
      <div className="signup-form-container">
        <h2>Create an Account</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group password-input">
            <label htmlFor="password">Password</label>
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              className="password-toggle-icon"
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />} {/* Display eye icon */}
            </span>
          </div>
          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>
        <p>
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;