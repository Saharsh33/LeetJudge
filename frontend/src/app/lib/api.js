import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
});

// Request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    // In browser environment, get token from localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle rate limits globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 429) {
      if (typeof window !== 'undefined') {
        const { toast } = require('react-hot-toast');
        toast.error('Too many requests. Please slow down!', {
          id: 'rate-limit-toast', // Prevent duplicate toasts
        });
      }
    }
    return Promise.reject(error);
  }
);

export default api;
