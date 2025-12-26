// frontend/src/services/api.js
import axios from 'axios'

// ✅ FIXED: Use your backend Dev Tunnel URL
const api = axios.create({
  baseURL: 'https://zlx30n8l-5000.inc1.devtunnels.ms/api',
  withCredentials: true
})

export default api
