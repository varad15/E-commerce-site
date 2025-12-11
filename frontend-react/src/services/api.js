import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

axios.defaults.withCredentials = true;

const getAuthHeaders = () => {
    // ✅ FIXED: Looking for 'token' not 'authToken'
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};

export const loginUser = async (email, password) => {
    try {
        // ✅ FIXED: Changed backticks to parentheses
        const response = await axios.post(`${API_BASE_URL}/login`, {
            username: email,
            password: password
        });
        return response.data;
    } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        throw error;
    }
};

export const registerUser = async (name, email, password) => {
    try {
        console.log('Attempting registration:', { name, email });

        // ✅ FIXED: Changed backticks to parentheses
        const response = await axios.post(`${API_BASE_URL}/register`, {
            firstName: name,
            email: email,
            password: password
        });

        console.log('Registration response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Register error:', error.response?.data || error.message);
        throw error;
    }
};

export const activateAccount = async (email, code) => {
    try {
        // ✅ FIXED: Changed backticks to parentheses
        const response = await axios.post(`${API_BASE_URL}/activate`, {
            email: email,
            code: code
        });
        return response.data;
    } catch (error) {
        console.error('Activate error:', error.response?.data || error.message);
        throw error;
    }
};

export const getAllUsers = async () => {
    try {
        // ✅ FIXED: Changed backticks to parentheses
        const response = await axios.get(`${API_BASE_URL}/users`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Get users error:', error.response?.data || error.message);
        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {
        // ✅ FIXED: Changed backticks to parentheses
        const response = await axios.delete(`${API_BASE_URL}/users/${userId}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Delete user error:', error.response?.data || error.message);
        throw error;
    }
};

export const activateUser = async (userId) => {
    try {
        // ✅ FIXED: Changed to POST instead of PUT
        const response = await axios.post(
            `${API_BASE_URL}/users/${userId}/activate`,
            {},
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error('Activate user error:', error.response?.data || error.message);
        throw error;
    }
};