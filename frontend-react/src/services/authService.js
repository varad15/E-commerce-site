import axios from 'axios';
import API_BASE_URL, { ENDPOINTS } from '../config/api';

// Configure axios defaults
axios.defaults.withCredentials = true;

const authService = {
    register: async (userData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}${ENDPOINTS.REGISTER}`, {
                firstName: userData.name,
                email: userData.email,
                password: userData.password
            });
            return response.data;
        } catch (error) {
            console.error('Register error:', error.response?.data || error.message);
            throw error;
        }
    },

    login: async (credentials) => {
        try {
            console.log('Attempting login with:', credentials);
            const response = await axios.post(`${API_BASE_URL}${ENDPOINTS.LOGIN}`, {
                username: credentials.email,
                password: credentials.password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Login response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            throw error;
        }
    },

    activate: async (email, code) => {
        try {
            const response = await axios.post(`${API_BASE_URL}${ENDPOINTS.ACTIVATE}`, {
                email,
                code
            });
            return response.data;
        } catch (error) {
            console.error('Activate error:', error.response?.data || error.message);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    getToken: () => {
        return localStorage.getItem('authToken');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('authToken');
    },

    isAdmin: () => {
        const user = authService.getCurrentUser();
        return user && user.email && user.email.toLowerCase().includes('admin');
    }
};

export default authService;