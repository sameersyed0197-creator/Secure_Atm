// // frontend/src/services/api.js
// import axios from 'axios'

// // ✅ FIXED: Use your backend Dev Tunnel URL
// const api = axios.create({
//  // baseURL: 'https://zlx30n8l-5000.inc1.devtunnels.ms/api',
//   baseURL: 'https://secure-atm-backend.onrender.com/api',
//   withCredentials: true
// })

// export default api




// frontend/src/services/api.js - COMPLETE FIXED VERSION
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://secure-atm-backend.onrender.com/api',
  withCredentials: true
});

// ✅ AUTOMATIC JWT TOKEN HANDLING FOR ALL REQUESTS
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    try {
      // Check expiry BEFORE every request
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (Date.now() >= payload.exp * 1000) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(new Error('Session expired'));
      }
      config.headers.Authorization = `Bearer ${token}`;
    } catch (e) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }
  return config;
});

// ✅ AUTO-REDIRECT ON 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
