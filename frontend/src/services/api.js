// import axios from 'axios'

// const api = axios.create({
//   baseURL: 'http://localhost:5000/api',
//   withCredentials: true // ✅ REQUIRED for sending cookies/sessions
// })

// export default api


 import axios from 'axios'

const api = axios.create({
  baseURL: 'https://secure-atm-backend.onrender.com/api',  // ✅ Updated to production
  withCredentials: true
})

export default api
