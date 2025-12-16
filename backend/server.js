// server.js - PRODUCTION VERSION
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import session from 'express-session'
import authRoutes from './routes/auth.js'
import upiRoutes from './routes/upiRoutes.js'
import settingsRoutes from './routes/settingsRoutes.js'
import walletRoutes from './routes/walletRoutes.js'
import biometricRoutes from './routes/biometricRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// ---- Middlewares ----
// ✅ CORS for production
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://secure-atm-yzh1.onrender.com',  // ✅ Your production frontend
  ],
  credentials: true
}))

app.use(express.json({ limit: '10mb' }))

// ✅ SESSION MIDDLEWARE - Production settings
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',  // ✅ true in production
    httpOnly: true,
    sameSite: 'none',  // ✅ Required for cross-origin cookies
    maxAge: 10 * 60 * 1000 // 10 minutes
  }
}))

// ---- API Routes ----
app.use('/api/auth', authRoutes)
app.use('/api/upi', upiRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/wallet', walletRoutes)
app.use('/api/biometric', biometricRoutes)

// ---- MongoDB Connection ----
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('[✔] MongoDB Connected')
    console.log('[✔] Routes loaded: /api/auth, /api/upi, /api/settings, /api/wallet, /api/biometric')
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[🚀] Server running on port ${PORT}`)
      console.log(`[🌍] Environment: ${process.env.NODE_ENV || 'development'}`)
    })
  })
  .catch((err) => {
    console.error('[❌] MongoDB Connection Error:', err.message)
    process.exit(1)
  })












// // server.js - LOCAL DEVELOPMENT VERSION
// import express from 'express'
// import dotenv from 'dotenv'
// import cors from 'cors'
// import mongoose from 'mongoose'
// import session from 'express-session'
// import authRoutes from './routes/auth.js'
// import upiRoutes from './routes/upiRoutes.js'
// import settingsRoutes from './routes/settingsRoutes.js'
// import walletRoutes from './routes/walletRoutes.js'
// import biometricRoutes from './routes/biometricRoutes.js'

// dotenv.config()

// const app = express()
// const PORT = process.env.PORT || 5000

// // ---- Middlewares ----
// // ✅ SIMPLE CORS for local development
// app.use(cors({
//   origin: 'http://localhost:5173', // Your frontend URL
//   credentials: true
// }))

// app.use(express.json({ limit: '10mb' }))

// // ✅ SESSION MIDDLEWARE
// app.use(session({
//   secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
//   resave: false,
//   saveUninitialized: false,
//   cookie: { 
//     secure: false, // false for localhost (HTTP)
//     httpOnly: true,
//     sameSite: 'lax', // 'lax' for localhost
//     maxAge: 10 * 60 * 1000 // 10 minutes
//   }
// }))

// // ---- API Routes ----
// app.use('/api/auth', authRoutes)
// app.use('/api/upi', upiRoutes)
// app.use('/api/settings', settingsRoutes)
// app.use('/api/wallet', walletRoutes)
// app.use('/api/biometric', biometricRoutes)

// // ---- MongoDB Connection ----
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log('[✔] MongoDB Connected')
//     console.log('[✔] Routes loaded: /api/auth, /api/upi, /api/settings, /api/wallet, /api/biometric')
//     app.listen(PORT, () =>
//       console.log(`[🚀] Server running at http://localhost:${PORT}`)
//     )
//   })
//   .catch((err) => {
//     console.error('[❌] MongoDB Connection Error:', err.message)
//     process.exit(1)
//   })





// // // server.js - LOCAL DEVELOPMENT VERSION
// // import express from 'express'
// // import dotenv from 'dotenv'
// // import cors from 'cors'
// // import mongoose from 'mongoose'
// // import session from 'express-session'
// // import authRoutes from './routes/auth.js'
// // import upiRoutes from './routes/upiRoutes.js'
// // import settingsRoutes from './routes/settingsRoutes.js'
// // import walletRoutes from './routes/walletRoutes.js'
// // import biometricRoutes from './routes/biometricRoutes.js'

// // dotenv.config()

// // const app = express()
// // const PORT = process.env.PORT || 5000

// // // ---- Middlewares ----
// // // ✅ UPDATED CORS - Allow both localhost AND network IP
// // app.use(cors({
// //   origin: [
// //     'http://localhost:5173',
// //     'http://127.0.0.1:5173',
// //     'http://192.168.1.57:5173',  // ✅ Add your laptop IP
// //     'http://192.168.1.57:5000',
// //   ],
// //   credentials: true
// // }))

// // app.use(express.json({ limit: '10mb' }))

// // // ✅ SESSION MIDDLEWARE
// // app.use(session({
// //   secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
// //   resave: false,
// //   saveUninitialized: false,
// //   cookie: { 
// //     secure: false, // false for localhost (HTTP)
// //     httpOnly: true,
// //     sameSite: 'lax',
// //     maxAge: 10 * 60 * 1000 // 10 minutes
// //   }
// // }))

// // // ---- API Routes ----
// // app.use('/api/auth', authRoutes)
// // app.use('/api/upi', upiRoutes)
// // app.use('/api/settings', settingsRoutes)
// // app.use('/api/wallet', walletRoutes)
// // app.use('/api/biometric', biometricRoutes)

// // // ---- MongoDB Connection ----
// // mongoose
// //   .connect(process.env.MONGO_URI)
// //   .then(() => {
// //     console.log('[✔] MongoDB Connected')
// //     console.log('[✔] Routes loaded: /api/auth, /api/upi, /api/settings, /api/wallet, /api/biometric')
// //     app.listen(PORT, '0.0.0.0', () => {  // ✅ Listen on all network interfaces
// //       console.log(`[🚀] Server running at http://localhost:${PORT}`)
// //       console.log(`[📱] Access from phone: http://192.168.1.57:${PORT}`)  // ✅ Show phone URL
// //     })
// //   })
// //   .catch((err) => {
// //     console.error('[❌] MongoDB Connection Error:', err.message)
// //     process.exit(1)
// //   })

