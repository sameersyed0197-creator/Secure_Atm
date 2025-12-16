// import axios from 'axios'

// const api = axios.create({
//   baseURL: 'http://localhost:5000/api',
//   withCredentials: true // ✅ REQUIRED for sending cookies/sessions
// })

// export default api


 import axios from 'axios'

const api = axios.create({
  baseURL: 'https://zlx30n8l-5000.inc1.devtunnels.ms/api',  // ✅ Your backend tunnel
  withCredentials: true
})

export default api
