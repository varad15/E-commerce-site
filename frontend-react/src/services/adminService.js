import axios from 'axios';
import API_BASE_URL, { ENDPOINTS } from '../config/api';
import authService from './authService';

const getAuthHeaders = () => ({
    headers: {
        'Authorization': `Bearer ${authService.getToken()}`,
        'Content-Type': 'application/json'
    }
});

const adminService = {
    getAllUsers: async () => {
        const response = await axios.get(`${API_BASE_URL}${ENDPOINTS.ADMIN_USERS}`, getAuthHeaders());
        return response.data;
    },

    deleteUser: async (userId) => {
        const response = await axios.delete(`${API_BASE_URL}${ENDPOINTS.ADMIN_DELETE}/${userId}`, getAuthHeaders());
        return response.data;
    },

    activateUser: async (userId) => {
        const response = await axios.put(`${API_BASE_URL}${ENDPOINTS.ADMIN_ACTIVATE}/${userId}/activate`, {}, getAuthHeaders());
        return response.data;
    },

    createAdmin: async (adminData) => {
        const response = await axios.post(`${API_BASE_URL}${ENDPOINTS.ADMIN_CREATE}`, adminData);
        return response.data;
    }
};

export default adminService;