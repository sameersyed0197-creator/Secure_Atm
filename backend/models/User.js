// models/User.js - FINAL FIXED VERSION (STEP 1)
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    fullName: { 
      type: String, 
      required: true 
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    accountNumber: {
      type: String,
      required: true,
      unique: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    // Extra profile fields
    phone: { type: String, default: '' },
    city: { type: String, default: '' },
    address: { type: String, default: '' },

    // UPI PIN fields
    upiPin: { type: String, default: null },
    hasUpiPin: { type: Boolean, default: false },

    balance: { type: Number, default: 0 },

    // 🔑 BIOMETRIC FLAGS
    fingerprintRegistered: { type: Boolean, default: false },
    faceRegistered: { type: Boolean, default: false },

    // For Gemini AI face verification
    faceData: { type: String, default: null },

    // (legacy – no longer used for withdraw, kept for compatibility)
    fingerprintData: { type: String, default: null },

    // ✅ WebAuthn biometric devices
    biometricDevices: [
      {
        credentialID: { type: Buffer, required: true },
        credentialPublicKey: { type: Buffer, required: true },
        counter: { type: Number, required: true, default: 0 },
        transports: { type: [String], default: [] },
        deviceName: { type: String, default: 'Biometric Device' },
        registeredAt: { type: Date, default: Date.now },
      },
    ],

    // ⭐ WebAuthn challenge storage
    webauthnChallenge: { type: String, default: null },

    // ⭐ USER-DEFINED SECURITY SETTINGS (NEW)
    securitySettings: {
      biometricThreshold: {
        type: Number,
        default: 5000, // replaces hardcoded 5000
      },
      biometricMode: {
        type: String,
        enum: ['fingerprint', 'face', 'both'],
        default: 'both',
      },
    },

    dailyLimit: {
      type: Number,
      default: 10000,
    },
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)

























// // models/User.js - COMPLETE UPDATED VERSION WITH WEBAUTHN
// import mongoose from 'mongoose'

// const userSchema = new mongoose.Schema(
//   {
//     fullName: { 
//       type: String, 
//       required: true 
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },

//     accountNumber: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     passwordHash: {
//       type: String,
//       required: true,
//     },

//     // Extra profile fields
//     phone: {
//       type: String,
//       default: '',
//     },
//     city: {
//       type: String,
//       default: '',
//     },
//     address: {
//       type: String,
//       default: '',
//     },

//     // UPI PIN fields
//     upiPin: {
//       type: String,
//       default: null,
//     },
//     hasUpiPin: {
//       type: Boolean,
//       default: false,
//     },

//     balance: {
//       type: Number,
//       default: 0,
//     },
    
//     // 🔑 BIOMETRIC FIELDS (existing)
//     fingerprintRegistered: {
//       type: Boolean,
//       default: false,
//     },
//     faceRegistered: {
//       type: Boolean,
//       default: false,
//     },
    
//     // For Gemini AI face verification
//     faceData: {
//       type: String,
//       default: null,
//     },
//     fingerprintData: {
//       type: String,
//       default: null,
//     },
    
//     // ✅ WebAuthn biometric devices storage
//     biometricDevices: [{
//       credentialID: {
//         type: Buffer,
//         required: true
//       },
//       credentialPublicKey: {
//         type: Buffer,
//         required: true
//       },
//       counter: {
//         type: Number,
//         required: true,
//         default: 0
//       },
//       transports: {
//         type: [String],
//         default: []
//       },
//       deviceName: {
//         type: String,
//         default: 'Biometric Device'
//       },
//       registeredAt: {
//         type: Date,
//         default: Date.now
//       }
//     }],

//     // ⭐ NEW: store current WebAuthn challenge per user
//     webauthnChallenge: {
//       type: String,
//       default: null,
//     },
    
//     dailyLimit: {
//       type: Number,
//       default: 10000,
//     },
//   },
//   { 
//     timestamps: true 
//   }
// )

// export default mongoose.model('User', userSchema)
