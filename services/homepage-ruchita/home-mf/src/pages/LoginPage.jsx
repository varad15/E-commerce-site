// src/pages/LoginPage.jsx
// Login page with authentication

import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Get the redirect path from location state, or default to home
  const from = location.state?.from || '/';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(formData.email, formData.password);
      // Redirect to the page they were trying to access, or home
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    }
  };

  // Demo account quick login
  const handleDemoLogin = async () => {
    try {
      await login('demo@ecomart.com', 'password123');
      navigate(from, { replace: true });
    } catch (err) {
      setError('Demo login failed');
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              {/* Header */}
              <h2 className="card-title text-3xl font-bold text-center justify-center mb-2">
                Welcome Back!
              </h2>
              <p className="text-center text-base-content/70 mb-6">
                Login to continue shopping eco-friendly products
              </p>

              {/* Error Alert */}
              {error && (
                <div className="alert alert-error mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Email</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    className="input input-bordered"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Enter your password"
                      className="input input-bordered w-full pr-10"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <label className="label">
                    <Link to="/forgot-password" className="label-text-alt link link-hover text-primary">
                      Forgot password?
                    </Link>
                  </label>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full"
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </button>
              </form>

              <div className="divider">OR</div>

              {/* Demo Login */}
              <button
                onClick={handleDemoLogin}
                disabled={loading}
                className="btn btn-outline btn-accent w-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Try Demo Account
              </button>
              <p className="text-xs text-center text-base-content/60 mt-2">
                demo@ecomart.com / password123
              </p>

              {/* Sign Up Link */}
              <div className="text-center mt-6">
                <p className="text-base-content/70">
                  Don't have an account?{' '}
                  <Link to="/register" className="link link-primary font-semibold">
                    Sign up here
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="text-primary text-3xl mb-2">🌱</div>
              <h3 className="font-bold mb-1">Eco-Friendly</h3>
              <p className="text-sm text-base-content/70">100+ sustainable products</p>
            </div>
            <div className="text-center p-4">
              <div className="text-secondary text-3xl mb-2">🚚</div>
              <h3 className="font-bold mb-1">Fast Delivery</h3>
              <p className="text-sm text-base-content/70">Free shipping over ₹50</p>
            </div>
            <div className="text-center p-4">
              <div className="text-accent text-3xl mb-2">⭐</div>
              <h3 className="font-bold mb-1">Top Rated</h3>
              <p className="text-sm text-base-content/70">10,000+ happy customers</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}