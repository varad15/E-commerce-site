// src/services/api.js
// Centralized API configuration with axios for Auth + Homepage services

import axios from 'axios';

// ============================================
// API BASE URLS
// ============================================
const AUTH_BASE_URL = 'http://localhost:8080';      // Spring Boot Auth Service
const HOMEPAGE_BASE_URL = 'http://localhost:3001/api'; // Node.js Homepage Service

// ============================================
// AUTH SERVICE AXIOS INSTANCE
// ============================================
const authAPI = axios.create({
  baseURL: AUTH_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auth response interceptor - Handle auth errors
authAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ Auth API Error:', error.response?.data || error.message);

    // Return structured error
    if (error.response?.data) {
      return Promise.reject(new Error(error.response.data.message || 'Authentication failed'));
    }
    return Promise.reject(error);
  }
);

// ============================================
// HOMEPAGE SERVICE AXIOS INSTANCE
// ============================================
const homepageAPI = axios.create({
  baseURL: HOMEPAGE_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add auth token to homepage requests
homepageAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token added to request:', config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors for homepage
homepageAPI.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('❌ Homepage API Error:', error.response?.data || error.message);

    // Handle 401 Unauthorized - clear token and redirect to login
    if (error.response?.status === 401) {
      console.log('🚨 Unauthorized - Redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('email');
      localStorage.removeItem('role');

      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.log('🚫 Forbidden - Insufficient permissions');
    }

    // Handle network errors
    if (!error.response) {
      console.error('🌐 Network error - Server may be down');
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    return Promise.reject(error);
  }
);

// ============================================
// AUTH SERVICE API FUNCTIONS
// ============================================
export const auth = {
  // Login
  login: async (email, password) => {
    try {
      console.log('🔐 Attempting login to Auth Service...');

      const response = await authAPI.post('/login', {
        username: email,
        password: password
      });

      console.log('✅ Login successful');

      // Store token
      if (response.data.bearer) {
        localStorage.setItem('token', response.data.bearer);
        localStorage.setItem('email', email);

        // Decode JWT to get role and user info
        try {
          const payload = JSON.parse(atob(response.data.bearer.split('.')[1]));
          console.log('🔓 JWT Payload:', payload);

          const role = payload.role || 'USER';
          localStorage.setItem('role', role);

          const userData = {
            email: email,
            name: payload.firstName || payload.name || email.split('@')[0],
            role: role
          };

          localStorage.setItem('user', JSON.stringify(userData));
          console.log('👤 User data stored:', userData);
        } catch (e) {
          console.error('⚠️ Error decoding token:', e);
          // Fallback - store basic user info
          const userData = {
            email: email,
            name: email.split('@')[0],
            role: 'USER'
          };
          localStorage.setItem('user', JSON.stringify(userData));
        }
      }

      return response.data;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  },

  // Register
  register: async (firstName, email, password) => {
    try {
      console.log('📝 Attempting registration...');

      const response = await authAPI.post('/register', {
        firstName: firstName,
        email: email,
        password: password
      });

      console.log('✅ Registration successful');
      return response.data;
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    }
  },

  // Logout
  logout: () => {
    console.log('🚪 Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    window.location.href = '/login';
  },

  // Check if user is logged in
  isAuthenticated: () => {
    const hasToken = !!localStorage.getItem('token');
    console.log('🔍 Is authenticated:', hasToken);
    return hasToken;
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error('Error parsing user data:', e);
        return null;
      }
    }
    return null;
  },

  // Check if user is admin
  isAdmin: () => {
    const role = localStorage.getItem('role');
    const isAdminRole = role === 'ADMIN' || role === 'ROLE_ADMIN';
    console.log('👑 Is admin:', isAdminRole, '(role:', role, ')');
    return isAdminRole;
  }
};

// ============================================
// HOMEPAGE SERVICE API FUNCTIONS
// ============================================
export const homepage = {
  // Products
  products: {
    getAll: async (params = {}) => {
      console.log('📦 Fetching all products with params:', params);
      const response = await homepageAPI.get('/products', { params });
      return response.data;
    },

    getBySlug: async (slug) => {
      console.log('📦 Fetching product by slug:', slug);
      const response = await homepageAPI.get(`/products/slug/${slug}`);
      return response.data;
    },

    getFeatured: async (limit = 10) => {
      console.log('⭐ Fetching featured products, limit:', limit);
      const response = await homepageAPI.get('/products/featured', {
        params: { limit }
      });
      return response.data;
    },

    search: async (query) => {
      console.log('🔍 Searching products:', query);
      const response = await homepageAPI.get('/products/search', {
        params: { q: query }
      });
      return response.data;
    }
  },

  // Categories
  categories: {
    getAll: async () => {
      console.log('📂 Fetching all categories');
      const response = await homepageAPI.get('/categories');
      return response.data;
    }
  },

  // Cart
  cart: {
    get: async () => {
      console.log('🛒 Fetching cart');
      const response = await homepageAPI.get('/cart');
      return response.data;
    },

    add: async (productId, quantity = 1) => {
      console.log('➕ Adding to cart:', productId, 'qty:', quantity);
      const response = await homepageAPI.post('/cart/items', {
        productId,
        quantity
      });
      return response.data;
    },

    update: async (itemId, quantity) => {
      console.log('🔄 Updating cart item:', itemId, 'qty:', quantity);
      const response = await homepageAPI.put(`/cart/items/${itemId}`, {
        quantity
      });
      return response.data;
    },

    remove: async (itemId) => {
      console.log('🗑️ Removing cart item:', itemId);
      const response = await homepageAPI.delete(`/cart/items/${itemId}`);
      return response.data;
    },

    clear: async () => {
      console.log('🧹 Clearing cart');
      const response = await homepageAPI.delete('/cart');
      return response.data;
    }
  },

  // Orders
  orders: {
    create: async (orderData) => {
      console.log('📝 Creating order:', orderData);
      const response = await homepageAPI.post('/orders', orderData);
      return response.data;
    },

    getAll: async () => {
      console.log('📋 Fetching all orders');
      const response = await homepageAPI.get('/orders');
      return response.data;
    },

    getById: async (orderId) => {
      console.log('📋 Fetching order:', orderId);
      const response = await homepageAPI.get(`/orders/${orderId}`);
      return response.data;
    }
  }
};

// Default export (for backwards compatibility)
export default homepageAPI;