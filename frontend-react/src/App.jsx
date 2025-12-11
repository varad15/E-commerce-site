import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Activate from './pages/Activate';
import Products from './pages/Products';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  const isAdmin = () => {
    const role = localStorage.getItem('role');
    return role === 'ADMIN' || role === 'ROLE_ADMIN';
  };

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const AdminRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }
    if (!isAdmin()) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes - MUST come first */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/activate" element={<Activate />} />

        {/* Protected Routes */}
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Catch-all - MUST be last */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;