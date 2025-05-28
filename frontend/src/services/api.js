// frontend/src/services/api.js
import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  // The baseURL will be prefixed to all request URLs.
  // During development, if you have a proxy setup in package.json (e.g., "proxy": "http://localhost:5000"),
  // you can use relative paths like '/api'.
  // If not using proxy or for production, use the full backend URL.
  baseURL: '/api', // This will be proxied to http://localhost:5000/api
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Optional: Add a response interceptor for global error handling (e.g., 401 unauthorized)
api.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    if (error.response && error.response.status === 401) {
      // Handle 401 Unauthorized (e.g., token expired or invalid)
      console.warn('Unauthorized access - 401. Token might be invalid or expired.');
      // localStorage.removeItem('token'); // Clear invalid token
      // localStorage.removeItem('user');
      // Redirect to login page, but avoid infinite loops if login page itself causes 401
      // if (window.location.pathname !== '/login') {
      //   window.location.href = '/login';
      // }
    }
    return Promise.reject(error);
  }
);


export default api;
