// // import express from 'express'
// // import dotenv from 'dotenv'
// // import cors from 'cors'
// // import mongoose from 'mongoose'

// // import authRoutes from './routes/auth.js'
// // import upiRoutes from './routes/upiRoutes.js'
// // import settingsRoutes from './routes/settingsRoutes.js'
// // import walletRoutes from './routes/walletRoutes.js'
// // import biometricRoutes from './routes/biometricRoutes.js'

// // dotenv.config()

// // const app = express()
// // const PORT = process.env.PORT || 5000

// // // FIX: Allow big image uploads
// // app.use(cors())
// // app.use(express.json({ limit: "25mb" }))
// // app.use(express.urlencoded({ extended: true, limit: "25mb" }))

// // // Health Check Route
// // app.get("/", (req, res) => {
// //   res.send("Secure ATM Backend Running...")
// // })

// // // API Routes
// // app.use('/api/auth', authRoutes)
// // app.use('/api/upi', upiRoutes)
// // app.use('/api/settings', settingsRoutes)
// // app.use('/api/wallet', walletRoutes)
// // app.use('/api/biometric', biometricRoutes)

// // // DB Connection
// // mongoose.connect(process.env.MONGO_URI)
// //   .then(() => {
// //     console.log('[✔] MongoDB Connected')
// //     app.listen(PORT, () =>
// //       console.log(`[🚀] Server running at http://localhost:${PORT}`)
// //     )
// //   })
// //   .catch((err) => {
// //     console.error('[❌] MongoDB Error:', err.message)
// //   })





























// // // import express from 'express'
// // // import dotenv from 'dotenv'
// // // import cors from 'cors'
// // // import mongoose from 'mongoose'
// // // import authRoutes from './routes/auth.js'
// // // import upiRoutes from './routes/upiRoutes.js'
// // // import settingsRoutes from './routes/settingsRoutes.js'
// // // import walletRoutes from './routes/walletRoutes.js'
// // // import biometricRoutes from "./routes/biometricRoutes.js";

// // // dotenv.config()

// // // const app = express()
// // // const PORT = process.env.PORT || 5000

// // // // ---- Middlewares ----
// // // app.use(cors());
// // // app.use(express.json({ limit: "10mb" }));
// // // app.use(express.urlencoded({ limit: "10mb", extended: true }));


// // // // ---- API Routes ----
// // // app.use('/api/auth', authRoutes)
// // // app.use('/api/upi', upiRoutes)
// // // app.use('/api/settings', settingsRoutes)
// // // app.use('/api/wallet', walletRoutes)
// // // app.use("/api/biometric", biometricRoutes);


// // // // ---- MongoDB Connection ----
// // // mongoose
// // //   .connect(process.env.MONGO_URI)
// // //   .then(() => {
// // //     console.log('[✔] MongoDB Connected')
// // //     app.listen(PORT, () =>
// // //       console.log(`[🚀] Server running at http://localhost:${PORT}`)
// // //     )
// // //   })
// // //   .catch((err) => {
// // //     console.error('[❌] MongoDB Connection Error:', err.message)
// // //     process.exit(1)
// // //   })

























// // // // import express from 'express'
// // // // import dotenv from 'dotenv'
// // // // import cors from 'cors'
// // // // import mongoose from 'mongoose'
// // // // import authRoutes from './routes/auth.js'
// // // // import upiRoutes from './routes/upiRoutes.js'
// // // // import settingsRoutes from './routes/settingsRoutes.js'
// // // // import walletRoutes from './routes/walletRoutes.js'

// // // // dotenv.config()

// // // // const app = express()
// // // // const PORT = process.env.PORT || 5000

// // // // // ---- Middlewares ----
// // // // app.use(cors())
// // // // app.use(express.json())

// // // // // ---- API Routes ----
// // // // app.use('/api/auth', authRoutes)
// // // // app.use('/api/upi', upiRoutes)
// // // // app.use('/api/settings', settingsRoutes)
// // // // app.use('/api/wallet', walletRoutes)

// // // // // ---- MongoDB Connection ----
// // // // mongoose
// // // //   .connect(process.env.MONGO_URI)
// // // //   .then(() => {
// // // //     console.log('[✔] MongoDB Connected')
// // // //     app.listen(PORT, () =>
// // // //       console.log(`[🚀] Server running at http://localhost:${PORT}`)
// // // //     )
// // // //   })
// // // //   .catch((err) => {
// // // //     console.error('[❌] MongoDB Connection Error:', err.message)
// // // //     process.exit(1)
// // // //   })





// // server.js - MUST HAVE THESE LINES
// import express from 'express'
// import dotenv from 'dotenv'
// import cors from 'cors'
// import mongoose from 'mongoose'
// import authRoutes from './routes/auth.js'
// import upiRoutes from './routes/upiRoutes.js'
// import settingsRoutes from './routes/settingsRoutes.js'
// import walletRoutes from './routes/walletRoutes.js'
// import biometricRoutes from './routes/biometricRoutes.js' // ✅ ADD THIS LINE

// dotenv.config()

// const app = express()
// const PORT = process.env.PORT || 5000

// // ---- Middlewares ----
// app.use(cors())
// app.use(express.json({ limit: '10mb' })) // ✅ INCREASE LIMIT FOR IMAGES

// // ---- API Routes ----
// app.use('/api/auth', authRoutes)
// app.use('/api/upi', upiRoutes)
// app.use('/api/settings', settingsRoutes)
// app.use('/api/wallet', walletRoutes)
// app.use('/api/biometric', biometricRoutes) // ✅ ADD THIS LINE

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







// server.js - ADD SESSION MIDDLEWARE
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import session from 'express-session' // ✅ ADD THIS
import authRoutes from './routes/auth.js'
import upiRoutes from './routes/upiRoutes.js'
import settingsRoutes from './routes/settingsRoutes.js'
import walletRoutes from './routes/walletRoutes.js'
import biometricRoutes from './routes/biometricRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// ---- Middlewares ----
// ✅ UPDATE CORS to allow credentials
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true // ✅ IMPORTANT for sessions
}))

app.use(express.json({ limit: '10mb' }))

// ✅ ADD SESSION MIDDLEWARE (before routes)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // true on Render
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // ✅ Important for cross-origin
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
    app.listen(PORT, () =>
      console.log(`[🚀] Server running at http://localhost:${PORT}`)
    )
  })
  .catch((err) => {
    console.error('[❌] MongoDB Connection Error:', err.message)
    process.exit(1)
  })
