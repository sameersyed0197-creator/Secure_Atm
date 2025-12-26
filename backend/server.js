// // server.js - FIXED CORS FOR DEV TUNNELS
// import express from 'express'
// import dotenv from 'dotenv'
// import cors from 'cors'
// import mongoose from 'mongoose'
// import helmet from 'helmet'

// import authRoutes from './routes/auth.js'
// import upiRoutes from './routes/upiRoutes.js'
// import settingsRoutes from './routes/settingsRoutes.js'
// import walletRoutes from './routes/walletRoutes.js'
// import biometricRoutes from './routes/biometricRoutes.js'
// import fingerprintRoutes from './routes/fingerprintRoutes.js'

// dotenv.config()

// const app = express()
// const PORT = process.env.PORT || 5000

// // ✅ UPDATED: Helmet config for Dev Tunnels
// app.use(helmet({
//   contentSecurityPolicy: false, // Allow dev tunnels
//   crossOriginEmbedderPolicy: false
// }))

// // ✅ FIXED CORS - Allow Dev Tunnel origins
// app.use(cors({
//   origin: (origin, callback) => {
//     const allowedOrigins = [
//       'http://localhost:5173',
//       'http://localhost:5000',
//       'http://127.0.0.1:5173',
//       'https://secure-atm-yzh1.onrender.com', // ✅ Render frontend
//       // 'https://zlx30n8l-5173.inc1.devtunnels.ms', // ✅ Frontend tunnel
//       // 'https://zlx30n8l-5000.inc1.devtunnels.ms', // ✅ Backend tunnel
//       // /^https:\/\/.*\.devtunnels\.ms$/, // ✅ Allow all VS Code tunnels
//       process.env.FRONTEND_URL,
//       process.env.CLIENT_URL,
//     ].filter(Boolean)
    
//     // Allow requests with no origin (Postman, mobile apps)
//     if (!origin || allowedOrigins.some(allowed => 
//       allowed instanceof RegExp ? allowed.test(origin) : allowed === origin
//     )) {
//       callback(null, true)
//     } else {
//       console.log('❌ CORS blocked origin:', origin)
//       callback(null, true) // Allow for testing
//     }
//   },
//   credentials: true,
// }))

// app.use(express.json({ limit: '10mb' }))

// // ---- Routes ----
// app.use('/api/auth', authRoutes)
// app.use('/api/upi', upiRoutes)
// app.use('/api/settings', settingsRoutes)
// app.use('/api/wallet', walletRoutes)
// app.use('/api/biometric', biometricRoutes)
// app.use('/api/fingerprint', fingerprintRoutes)

// // ✅ Health check endpoint
// app.get('/api/health', (req, res) => {
//   res.json({ 
//     status: 'ok', 
//     message: 'Server is running',
//     timestamp: new Date().toISOString()
//   })
// })

// function listAllRoutes() {
//   console.log('\n📋 Available API Endpoints:\n')
  
//   const routeMap = {
//     '/api/auth': [
//       'POST /register', 
//       'POST /login'
//     ],
//     '/api/upi': [
//       'POST /set-pin'
//     ],
//     '/api/settings': [
//       'GET /me',
//       'PUT /profile',
//       'PUT /password',
//       'PUT /transaction-pin',
//       'PUT /biometric-threshold'
//     ],
//     '/api/biometric': [
//       'GET /status',
//       'POST /register-face',
//       'POST /verify-face',
//       'DELETE /remove-face'
//     ],
//     '/api/fingerprint': [
//       'GET /status',
//       'GET /init-register',
//       'POST /verify-register',
//       'GET /init-auth',
//       'POST /verify-auth'
//     ],
//     '/api/wallet': [
//       'POST /deposit',
//       'POST /withdraw',
//       'GET /history',
//       'GET /balance',
//       'GET /receipt/:transactionId'
//     ]
//   }
  
//   let totalRoutes = 0
  
//   Object.entries(routeMap).forEach(([base, routes]) => {
//     console.log(`\n🔹 ${base}`)
//     routes.forEach(route => {
//       const [method, path] = route.split(' ')
//       console.log(`   ${method.padEnd(7)} -> ${base}${path}`)
//       totalRoutes++
//     })
//   })
  
//   console.log(`\n✅ Total: ${totalRoutes} endpoints`)
//   console.log(`\n🌐 Access URLs:`)
//   console.log(`   Local:   http://localhost:${PORT}`)
//   console.log(`   Tunnel:  https://zlx30n8l-5000.inc1.devtunnels.ms`)
//   console.log(`\n`)
// }

// // ---- MongoDB ----
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log('[✔] MongoDB Connected')
//     listAllRoutes()
    
//     app.listen(PORT, '0.0.0.0', () => {
//       console.log(`[🚀] Server running on http://localhost:${PORT}`)
//     })
//   })
//   .catch((err) => {
//     console.error('[❌] MongoDB Error:', err.message)
//     process.exit(1)
//   })



// server.js - PRODUCTION READY (Render Compatible)

import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import helmet from 'helmet'

// Routes
import authRoutes from './routes/auth.js'
import upiRoutes from './routes/upiRoutes.js'
import settingsRoutes from './routes/settingsRoutes.js'
import walletRoutes from './routes/walletRoutes.js'
import biometricRoutes from './routes/biometricRoutes.js'
import fingerprintRoutes from './routes/fingerprintRoutes.js'

// Load env
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// -------------------- SECURITY --------------------
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
)

// -------------------- CORS (FIXED FOR RENDER + BIOMETRICS) --------------------
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'https://secure-atm-yzh1.onrender.com', // ✅ Render frontend
        'http://localhost:5173',
        'http://127.0.0.1:5173',
      ]

      // Allow browser frontend
      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      // ✅ Allow NO-ORIGIN requests
      // (fingerprint devices, SDKs, Postman, server-to-server)
      if (!origin) {
        return callback(null, true)
      }

      console.log('❌ CORS blocked origin:', origin)
      return callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  })
)

// -------------------- BODY PARSER --------------------
app.use(express.json({ limit: '10mb' }))

// -------------------- API ROUTES --------------------
app.use('/api/auth', authRoutes)
app.use('/api/upi', upiRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/wallet', walletRoutes)
app.use('/api/biometric', biometricRoutes)
app.use('/api/fingerprint', fingerprintRoutes)

// -------------------- HEALTH CHECK --------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Secure ATM Backend is running',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString(),
  })
})

// -------------------- ROUTE LOGGER --------------------
function listAllRoutes() {
  console.log('\n📋 API ENDPOINTS\n')

  const routes = {
    '/api/auth': ['POST /register', 'POST /login'],
    '/api/upi': ['POST /set-pin'],
    '/api/settings': [
      'GET /me',
      'PUT /profile',
      'PUT /password',
      'PUT /transaction-pin',
      'PUT /biometric-threshold',
    ],
    '/api/biometric': [
      'GET /status',
      'POST /register-face',
      'POST /verify-face',
      'DELETE /remove-face',
    ],
    '/api/fingerprint': [
      'GET /status',
      'GET /init-register',
      'POST /verify-register',
      'GET /init-auth',
      'POST /verify-auth',
    ],
    '/api/wallet': [
      'POST /deposit',
      'POST /withdraw',
      'GET /history',
      'GET /balance',
      'GET /receipt/:transactionId',
    ],
  }

  let count = 0
  Object.entries(routes).forEach(([base, list]) => {
    console.log(`\n🔹 ${base}`)
    list.forEach((r) => {
      console.log(`   ${r}`)
      count++
    })
  })

  console.log(`\n✅ Total APIs: ${count}`)
  console.log(`🌐 Backend URL: https://secure-atm-backend.onrender.com\n`)
}

// -------------------- DATABASE + SERVER --------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('[✔] MongoDB Connected')
    listAllRoutes()

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[🚀] Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('[❌] MongoDB Connection Error:', err.message)
    process.exit(1)
  })



















 