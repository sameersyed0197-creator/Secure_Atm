// models/User.js  
import mongoose from 'mongoose'

// ✅ Fingerprint Authenticator Schema
const authenticatorSchema = new mongoose.Schema(
  {
    credentialID: {
      type: Buffer,
      required: true,
    },
    credentialPublicKey: {
      type: Buffer,
      required: true,
    },
    counter: {
      type: Number,
      required: true,
      default: 0,
    },
    transports: {
      type: [String],
      default: [],
    },
    deviceType: {
      type: String,
      default: 'unknown',
    },
    backedUp: {
      type: Boolean,
      default: false,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
)

const userSchema = new mongoose.Schema(
  {
    // ---------------- BASIC INFO ----------------
    fullName: {
      type: String,
      required: true,
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

    // ---------------- PROFILE ----------------
    phone: { type: String, default: '' },
    city: { type: String, default: '' },
    address: { type: String, default: '' },

    // ---------------- TRANSACTION PIN ----------------
    upiPin: { type: String, default: null },
    hasUpiPin: { type: Boolean, default: false },

    // ---------------- BALANCE ----------------
    balance: { type: Number, default: 0 },

    // ---------------- FACE BIOMETRIC ----------------
    faceData: {
      type: String,
      default: null,
    },
    
    faceRegistered: {
      type: Boolean,
      default: false,
    },

    // ✅ ---------------- FINGERPRINT BIOMETRIC (WebAuthn) ----------------
    authenticators: {
      type: [authenticatorSchema],
      default: [],
    },
    
    fingerprintRegistered: {
      type: Boolean,
      default: false,
    },
    
    currentChallenge: {
      type: String,
      default: null,
    },

    webauthnUserId: {
      type: String,
      default: null,
    },

    // ✅✅✅ ADD THESE - BIOMETRIC TOKEN FOR WITHDRAWAL
    biometricToken: {
      type: String,
      default: null,
    },

    biometricTokenExpiry: {
      type: Date,
      default: null,
    },

    // ---------------- SECURITY SETTINGS ----------------
    securitySettings: {
      biometricThreshold: {
        type: Number,
        default: 5000,
      },
      biometricMode: {
        type: String,
        enum: ['face', 'fingerprint', 'both'],
        default: 'fingerprint',
      },
    },

    // ---------------- LIMITS ----------------
    dailyLimit: {
      type: Number,
      default: 10000,
    },
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)

 