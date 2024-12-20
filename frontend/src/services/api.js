import axios from 'axios';

// Create axios instance with base URL from environment variable or fallback
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${baseURL}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false // Set to false since we're using token auth
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network or server error
      console.error('Network Error:', error.message);
      return Promise.reject({
        message: 'Unable to connect to the server. Please check your connection and try again.'
      });
    }

    // Handle authentication errors
    if (error.response.status === 401) {
      localStorage.removeItem('token'); // Clear invalid token
      if (!window.location.pathname.includes('/login')) {
        localStorage.setItem('redirectUrl', window.location.pathname);
        window.location.href = '/login';
      }
    }

    return Promise.reject(error.response.data);
  }
);

export default api; 