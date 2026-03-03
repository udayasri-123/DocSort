
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '../firebase'; // Ensure you have your Firebase configuration set up
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { FcGoogle } from 'react-icons/fc'; // Official Google icon
import './LoginPage.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  // Toggle password visibility
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      
      // Store the email in localStorage
      localStorage.setItem('username', user.email);

      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', formData.email);
      } else {
        localStorage.removeItem('rememberMe');
      }

      navigate('/upload');  // Redirect to Upload page
    } catch (error) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle forgot password
  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Please enter your email to reset your password.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, formData.email);
      setError('Password reset email sent!');
    } catch (error) {
      setError('Failed to send password reset email.');
    }
  };

// Handle Google login with account selection
const handleGoogleLogin = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' }); // Force account selection

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Store the email in localStorage
    localStorage.setItem('username', user.email);

    navigate('/upload');  // Redirect to Upload page
  } catch (error) {
    setError('Google login failed. Please try again.');
  }
};

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span onClick={handleTogglePassword} className="password-toggle-icon">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </span>
            </div>
          </div>

          <div className="form-remember-forgot">
            <label className="remember-me">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              Remember Me
            </label>
            <a href="#" onClick={handleForgotPassword}>
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <button type="button" className="google-login-btn" onClick={handleGoogleLogin}>
            <FcGoogle size={20} /> Login with Google
          </button>
        </form>

        <p>
          Don't have an account? <a href="/signup">Sign up here</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;