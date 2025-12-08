

// // // models/User.js
// // import mongoose from 'mongoose'

// // const userSchema = new mongoose.Schema(
// //   {
// //     fullName: { type: String, required: true },

// //     email: {
// //       type: String,
// //       required: true,
// //       unique: true,
// //       lowercase: true,
// //       trim: true,
// //     },

// //     accountNumber: {
// //       type: String,
// //       required: true,
// //       unique: true,
// //     },

// //     passwordHash: {
// //       type: String,
// //       required: true,
// //     },

// //     // extra profile fields
// //     phone: {
// //       type: String,
// //       default: '',
// //     },
// //     city: {
// //       type: String,
// //       default: '',
// //     },
// //     address: {
// //       type: String,
// //       default: '',
// //     },

// //     // UPI PIN fields
// //     upiPin: {
// //       type: String,
// //       default: null,
// //     },
// //     hasUpiPin: {
// //       type: Boolean,
// //       default: false,
// //     },

// //     balance: {
// //       type: Number,
// //       default: 0,
// //     },
// //     fingerprintRegistered: {
// //       type: Boolean,
// //       default: false,
// //     },
// //     faceRegistered: {
// //       type: Boolean,
// //       default: false,
// //     },
// //     dailyLimit: {
// //       type: Number,
// //       default: 10000,
// //     },
// //   },
// //   { timestamps: true }
// // )

// // export default mongoose.model('User', userSchema)








// // models/User.js - UPDATED VERSION
// import mongoose from 'mongoose'

// const userSchema = new mongoose.Schema(
//   {
//     fullName: { type: String, required: true },

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

//     // extra profile fields
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
    
//     // 🔑 BIOMETRIC FIELDS - ADD THESE!
//     fingerprintRegistered: {
//       type: Boolean,
//       default: false,
//     },
//     faceRegistered: {
//       type: Boolean,
//       default: false,
//     },
    
//     // ❗️ ADD THESE TWO FIELDS FOR GEMINI:
//     faceData: {
//       type: String,          // Stores base64 image for Gemini
//       default: null,
//     },
//     fingerprintData: {
//       type: String,          // For fingerprint (optional)
//       default: null,
//     },
    
//     dailyLimit: {
//       type: Number,
//       default: 10000,
//     },
//   },
//   { timestamps: true }
// )

// export default mongoose.model('User', userSchema)


// models/User.js - COMPLETE UPDATED VERSION WITH WEBAUTHN
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
    phone: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },

    // UPI PIN fields
    upiPin: {
      type: String,
      default: null,
    },
    hasUpiPin: {
      type: Boolean,
      default: false,
    },

    balance: {
      type: Number,
      default: 0,
    },
    
    // 🔑 BIOMETRIC FIELDS (existing)
    fingerprintRegistered: {
      type: Boolean,
      default: false,
    },
    faceRegistered: {
      type: Boolean,
      default: false,
    },
    
    // For Gemini AI face verification
    faceData: {
      type: String,
      default: null,
    },
    fingerprintData: {
      type: String,
      default: null,
    },
    
    // ✅ NEW: WebAuthn biometric devices storage
    biometricDevices: [{
      credentialID: {
        type: Buffer,
        required: true
      },
      credentialPublicKey: {
        type: Buffer,
        required: true
      },
      counter: {
        type: Number,
        required: true,
        default: 0
      },
      transports: {
        type: [String],
        default: []
      },
      deviceName: {
        type: String,
        default: 'Biometric Device'
      },
      registeredAt: {
        type: Date,
        default: Date.now
      }
    }],
    
    dailyLimit: {
      type: Number,
      default: 10000,
    },
  },
  { 
    timestamps: true 
  }
)

export default mongoose.model('User', userSchema)
