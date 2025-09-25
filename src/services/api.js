import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-storage');
    if (token) {
      try {
        const authData = JSON.parse(token);
        if (authData.state?.token) {
          config.headers.Authorization = `Bearer ${authData.state.token}`;
        }
      } catch (error) {
        // Handle error silently
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't auto-redirect on 401, let components handle it
    // Only clear auth storage for 401 errors
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-storage');
    }
    
    // Don't show toast for login errors, let login component handle it
    const isLoginError = error.config?.url?.includes('/auth/login') || 
                        error.config?.url?.includes('/auth/admin/login');
    
    if (!isLoginError) {
      if (error.response?.status >= 500) {
        toast.error('Server error. Please try again later.');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 