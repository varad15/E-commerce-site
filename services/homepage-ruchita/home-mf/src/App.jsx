// src/App.jsx
// Complete routing setup - Login/Register handled by Auth Frontend (port 3000)

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Homepage from './pages/Homepage';
import ProductDetail from './pages/ProductDetail';
import ProductsPage from './pages/ProductsPage';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
// REMOVED: import LoginPage from './pages/LoginPage';
// REMOVED: import RegisterPage from './pages/RegisterPage';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';

// ✅ Token Handler Component - Captures token from URL after login
function TokenHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token is in URL params (from auth service redirect)
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      console.log('🔑 Token received from auth service');

      // Store token in localStorage
      localStorage.setItem('token', token);

      // Decode JWT and store user info
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('🔓 JWT Payload:', payload);

        const email = payload.email || payload.sub;
        const role = payload.role || 'USER';

        localStorage.setItem('email', email);
        localStorage.setItem('role', role);

        const userData = {
          email: email,
          name: payload.firstName || payload.name || email.split('@')[0],
          role: role
        };
        localStorage.setItem('user', JSON.stringify(userData));

        console.log('✅ User authenticated:', userData);
      } catch (e) {
        console.error('Error decoding token:', e);
      }

      // Remove token from URL and redirect to clean homepage
      navigate('/', { replace: true });

      // Reload to trigger AuthContext update
      window.location.reload();
    }
  }, [location, navigate]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <TokenHandler /> {/* ✅ Captures token from URL */}
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Homepage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/cart" element={<CartPage />} />

            {/* Login & Register are handled by Auth Frontend (port 3000) */}

            {/* Protected Routes */}
            {/* <Route path="/checkout" element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            } /> */}
            {/* <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } /> */}
            {/* <Route path="/orders" element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            } /> */}
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;