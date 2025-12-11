// src/context/AuthContext.jsx
// Authentication context with Spring Boot Auth Service integration

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Auth Service URL
  const AUTH_API_URL = 'http://localhost:8080';

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        const email = localStorage.getItem('email');
        const role = localStorage.getItem('role');

        if (token && email) {
          // User is logged in
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          } else {
            // Create user object from stored data
            setUser({
              email: email,
              name: email.split('@')[0], // Fallback name
              role: role || 'USER'
            });
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('email');
        localStorage.removeItem('role');
      } finally {
        setInitialLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      console.log('🔐 Attempting login to Auth Service...');

      const response = await fetch(`${AUTH_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: email,
          password: password
        })
      });

      const data = await response.json();
      console.log('📥 Login response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.bearer) {
        // Store token
        localStorage.setItem('token', data.bearer);
        localStorage.setItem('email', email);

        // Decode JWT to get user info
        try {
          const payload = JSON.parse(atob(data.bearer.split('.')[1]));
          console.log('🔓 Decoded JWT payload:', payload);

          const role = payload.role || 'USER';
          localStorage.setItem('role', role);

          const userData = {
            email: email,
            name: payload.firstName || payload.name || email.split('@')[0],
            role: role
          };

          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);

          console.log('✅ Login successful:', userData);
        } catch (e) {
          console.error('Error decoding JWT:', e);
          // Fallback user data
          const userData = {
            email: email,
            name: email.split('@')[0],
            role: 'USER'
          };
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
        }

        return { success: true };
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      throw new Error(error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (firstName, email, password) => {
    setLoading(true);
    try {
      console.log('📝 Attempting registration...');

      const response = await fetch(`${AUTH_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: firstName,
          email: email,
          password: password
        })
      });

      const data = await response.json();
      console.log('📥 Registration response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      console.log('✅ Registration successful');
      return { success: true, message: 'Registration successful! Please check your email.' };
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw new Error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    console.log('🚪 Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    setUser(null);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  // Check if user is admin
  const isAdmin = () => {
    const role = localStorage.getItem('role');
    return role === 'ADMIN' || role === 'ROLE_ADMIN';
  };

  const value = {
    user,
    loading,
    initialLoading,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};