// src/App.jsx
// Complete routing setup for interactive navigation

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import ProductDetail from './pages/ProductDetail';
import ProductsPage from './pages/ProductsPage';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import ProfilePage from './pages/ProfilePage';
// import OrdersPage from './pages/OrdersPage';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Homepage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* <Route path="/register" element={<RegisterPage />} /> */}
            <Route path="/cart" element={<CartPage />} />
            
            {/* Protected Routes
            <Route path="/checkout" element={
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