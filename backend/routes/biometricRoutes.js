import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import auth from '../middleware/auth.js'
import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from '@simplewebauthn/server'
import { isoUint8Array, isoBase64URL } from '@simplewebauthn/server/helpers'
import { compareFaces } from '../services/geminiService.js'

const router = express.Router()

// ---------------------------------------------------
// Dynamic RP & Origin
// ---------------------------------------------------
const getExpectedOrigin = () =>
  process.env.FRONTEND_URL || 'http://localhost:5173'

const getExpectedRPID = () => {
  const origin = getExpectedOrigin()
  if (origin.includes('devtunnels.ms')) {
    return 'inc1.devtunnels.ms'
  }
  return process.env.RP_ID || 'localhost'
}

// ---------------------------------------------------
// GET /api/biometric/status
// ---------------------------------------------------
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    res.json({
      faceRegistered: user.faceRegistered || false,
      fingerprintRegistered: user.biometricDevices.length > 0,
      deviceCount: user.biometricDevices.length,
    })
  } catch (err) {
    console.error('BIOMETRIC STATUS ERROR:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// ---------------------------------------------------
// POST /api/biometric/register-face
// ---------------------------------------------------
router.post('/register-face', auth, async (req, res) => {
  try {
    const { faceData } = req.body
    
    if (!faceData) {
      return res.status(400).json({ message: 'Face data required' })
    }

    // ✅ Validate base64 format
    if (!faceData.startsWith('data:image/')) {
      return res.status(400).json({ message: 'Invalid face data format' })
    }

    // ✅ Check minimum size (should be at least 5KB for a real face photo)
    if (faceData.length < 5000) {
      return res.status(400).json({ message: 'Face data too small - capture failed' })
    }

    const user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    // 🔁 Allow unlimited updates
    user.faceData = faceData
    user.faceRegistered = true
    await user.save()

    console.log(`✅ Face registered for user: ${user.email}`)
    res.json({ success: true, message: 'Face registered successfully' })
  } catch (err) {
    console.error('FACE REGISTRATION ERROR:', err)
    res.status(500).json({ message: 'Server error: ' + err.message })
  }
})

// ---------------------------------------------------
// POST /api/biometric/verify-face
// ---------------------------------------------------
router.post('/verify-face', auth, async (req, res) => {
  try {
    const { faceData } = req.body
    const user = await User.findById(req.user.userId)

    if (!user || !user.faceRegistered) {
      return res.status(400).json({ message: 'Face not registered' })
    }

    if (!faceData) {
      return res.status(400).json({ message: 'Face data required for verification' })
    }

    const isMatch = await compareFaces(faceData, user.faceData)

    if (!isMatch) {
      return res.status(401).json({ verified: false, message: 'Face verification failed' })
    }

    res.json({
      verified: true,
      message: 'Face verified successfully',
    })
  } catch (err) {
    console.error('FACE VERIFICATION ERROR:', err)
    res.status(500).json({ message: 'Server error: ' + err.message })
  }
})

// ---------------------------------------------------
// ✅ FIXED: GET /api/biometric/register-options (fingerprint)
// ---------------------------------------------------
router.get('/register-options', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const options = await generateRegistrationOptions({
      rpName: 'SecureATM',
      rpID: getExpectedRPID(),
      
      // ✅ Use email as userID (better for passkey managers)
      userID: isoUint8Array.fromUTF8String(user.email),
      userName: user.email,
      
      // ✅ CRITICAL FIX: Add userDisplayName for passkey manager UI
      userDisplayName: user.fullName || user.email,
      
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
        
        // ✅ CRITICAL FIX: Makes it a discoverable credential (passkey)
        residentKey: 'required',
        requireResidentKey: true,
      },
      
      // ✅ CRITICAL FIX: Use fromBuffer instead of toBuffer
      excludeCredentials: user.biometricDevices.map((d) => ({
        id: isoBase64URL.fromBuffer(d.credentialID),  // ✅ CHANGED from toBuffer
        type: 'public-key',
        transports: d.transports || ['internal'],
      })),
      
      // ✅ Attestation for security (use 'direct' in production)
      attestationType: 'none',
    })

    user.webauthnChallenge = options.challenge
    await user.save()

    console.log(`✅ Registration options generated for: ${user.email}`)
    res.json(options)
  } catch (err) {
    console.error('REGISTER OPTIONS ERROR:', err)
    res.status(500).json({ message: 'Server error: ' + err.message })
  }
})

// ---------------------------------------------------
// ✅ FIXED: POST /api/biometric/register-verify (fingerprint)
// ---------------------------------------------------
router.post('/register-verify', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    if (!user.webauthnChallenge) {
      return res.status(400).json({ message: 'No challenge found - call /register-options first' })
    }

    const verification = await verifyRegistrationResponse({
      response: req.body.registrationResult,
      expectedChallenge: user.webauthnChallenge,
      expectedOrigin: getExpectedOrigin(),
      expectedRPID: getExpectedRPID(),
      requireUserVerification: true,
    })

    if (!verification.verified) {
      return res.status(400).json({ message: 'Registration verification failed' })
    }

    const { credential, credentialBackedUp, credentialDeviceType } = verification.registrationInfo

    // ✅ Store credential with complete metadata
    user.biometricDevices = [{
      credentialID: Buffer.from(credential.id),
      credentialPublicKey: Buffer.from(credential.publicKey),
      counter: credential.counter,
      
      // ✅ Important for passkey sync across devices
      transports: credential.transports || ['internal'],
      
      // ✅ Track backup status (synced to cloud or not)
      backedUp: credentialBackedUp || false,
      deviceType: credentialDeviceType || 'platform',
      
      // ✅ Metadata for debugging
      createdAt: new Date(),
      lastUsed: new Date(),
    }]

    user.webauthnChallenge = null
    await user.save()

    console.log(`✅ Fingerprint registered for: ${user.email}, Backed up: ${credentialBackedUp}`)
    
    res.json({ 
      success: true,
      message: 'Fingerprint registered successfully',
      backedUp: credentialBackedUp,
      deviceType: credentialDeviceType,
    })
  } catch (err) {
    console.error('REGISTER VERIFY ERROR:', err)
    res.status(500).json({ message: 'Server error: ' + err.message })
  }
})

// ---------------------------------------------------
// ✅ CRITICAL FIX: GET /api/biometric/auth-options
// ---------------------------------------------------
router.get('/auth-options', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user || user.biometricDevices.length === 0) {
      return res.status(400).json({ message: 'No fingerprint registered' })
    }

    const options = await generateAuthenticationOptions({
      rpID: getExpectedRPID(),
      
      // ✅ CRITICAL FIX: Use fromBuffer instead of toBuffer
      allowCredentials: user.biometricDevices.map((d) => ({
        id: isoBase64URL.fromBuffer(d.credentialID),  // ✅ CHANGED from toBuffer
        type: 'public-key',
        transports: d.transports || ['internal'],
      })),
      
      userVerification: 'required',
    })

    user.webauthnChallenge = options.challenge
    await user.save()

    console.log('✅ Auth options generated, credential IDs:', 
      user.biometricDevices.map(d => isoBase64URL.fromBuffer(d.credentialID).substring(0, 20) + '...')
    )

    res.json(options)
  } catch (err) {
    console.error('AUTH OPTIONS ERROR:', err)
    res.status(500).json({ message: 'Server error: ' + err.message })
  }
})

// ---------------------------------------------------
// POST /api/biometric/auth-verify
// ---------------------------------------------------
router.post('/auth-verify', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    if (!user.webauthnChallenge) {
      return res.status(400).json({ message: 'No challenge found - call /auth-options first' })
    }

    // ✅ Find matching authenticator by comparing credential IDs
    const authenticator = user.biometricDevices.find(
      (d) => isoBase64URL.fromBuffer(d.credentialID) === req.body.authResult.rawId
    )

    if (!authenticator) {
      console.error('❌ Credential ID not found. Received:', req.body.authResult.rawId)
      console.error('❌ Available IDs:', user.biometricDevices.map(d => 
        isoBase64URL.fromBuffer(d.credentialID)
      ))
      return res.status(400).json({ message: 'Device not registered on this account' })
    }

    const verification = await verifyAuthenticationResponse({
      response: req.body.authResult,
      expectedChallenge: user.webauthnChallenge,
      expectedOrigin: getExpectedOrigin(),
      expectedRPID: getExpectedRPID(),
      authenticator: {
        credentialID: authenticator.credentialID,
        credentialPublicKey: authenticator.credentialPublicKey,
        counter: authenticator.counter,
      },
      requireUserVerification: true,
    })

    if (!verification.verified) {
      return res.status(401).json({ verified: false, message: 'Authentication failed' })
    }

    // ✅ Update counter and last used timestamp
    authenticator.counter = verification.authenticationInfo.newCounter
    authenticator.lastUsed = new Date()

    user.webauthnChallenge = null
    await user.save()

    // ✅ Generate short-lived token for withdrawal
    const biometricToken = jwt.sign(
      { userId: user._id, type: 'fingerprint' },
      process.env.JWT_SECRET,
      { expiresIn: '2m' }
    )

    console.log(`✅ Fingerprint verified for: ${user.email}`)
    res.json({ verified: true, biometricToken })
  } catch (err) {
    console.error('AUTH VERIFY ERROR:', err)
    res.status(500).json({ message: 'Server error: ' + err.message })
  }
})

export default router



































// import express from 'express'
// import jwt from 'jsonwebtoken'
// import User from '../models/User.js'
// import auth from '../middleware/auth.js'
// import { isoUint8Array, isoBase64URL } from '@simplewebauthn/server/helpers'

// import { compareFaces } from '../services/geminiService.js'
// import {
//   generateAuthenticationOptions,
//   verifyAuthenticationResponse,
//   generateRegistrationOptions,
//   verifyRegistrationResponse,
// } from '@simplewebauthn/server'

// const router = express.Router()

// // ---------------------------------------------------
// // GET /api/biometric/status
// // ---------------------------------------------------
// router.get('/status', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId)
//     if (!user) return res.status(404).json({ message: 'User not found' })

//     res.json({
//       faceRegistered: user.faceRegistered || false,
//       fingerprintRegistered: user.fingerprintRegistered || false,
//       webAuthnRegistered: (user.biometricDevices?.length || 0) > 0,
//       deviceCount: user.biometricDevices?.length || 0,
//     })
//   } catch (err) {
//     console.error('STATUS ERROR:', err)
//     res.status(500).json({ message: 'Server error' })
//   }
// })

// // ---------------------------------------------------
// // POST /api/biometric/register-face
// // ---------------------------------------------------
// router.post('/register-face', auth, async (req, res) => {
//   try {
//     const { faceData } = req.body
//     if (!faceData) {
//       return res.status(400).json({ message: 'Face data required' })
//     }

//     const user = await User.findById(req.user.userId)
//     if (!user) return res.status(404).json({ message: 'User not found' })

//     user.faceData = faceData
//     user.faceRegistered = true
//     await user.save()

//     res.json({ success: true, message: 'Face registered successfully' })
//   } catch (err) {
//     console.error('REGISTER FACE ERROR:', err)
//     res.status(500).json({ message: 'Server error' })
//   }
// })

// // ---------------------------------------------------
// // POST /api/biometric/verify-face
// // ---------------------------------------------------
// router.post('/verify-face', auth, async (req, res) => {
//   try {
//     const { faceData } = req.body
//     const user = await User.findById(req.user.userId)

//     if (!user || !user.faceRegistered) {
//       return res.status(400).json({ message: 'Face not registered' })
//     }

//     const isMatch = await compareFaces(faceData, user.faceData)

//     res.json({
//       verified: isMatch,
//       message: isMatch ? 'Face verified' : 'Face verification failed',
//     })
//   } catch (err) {
//     console.error('VERIFY FACE ERROR:', err)
//     res.status(500).json({ message: 'Server error' })
//   }
// })

// // ---------------------------------------------------
// // GET /api/biometric/fingerprint-register-options
// // ---------------------------------------------------
// router.get('/fingerprint-register-options', auth, async (req, res) => {
//   const user = await User.findById(req.user.userId)
//   if (!user) return res.status(404).json({ message: 'User not found' })

//   const options = await generateRegistrationOptions({
//     rpName: 'SecureATM',
//     rpID: process.env.RP_ID || 'localhost',
//     userID: isoUint8Array.fromUTF8String(user._id.toString()),
//     userName: user.email,
//     authenticatorSelection: {
//       authenticatorAttachment: 'platform',
//       userVerification: 'required',
//     },
//     excludeCredentials:
//       user.biometricDevices?.map((dev) => ({
//         id: isoBase64URL.fromBuffer(dev.credentialID),
//         type: 'public-key',
//       })) || [],
//   })

//   user.webauthnChallenge = options.challenge
//   await user.save()

//   res.json(options)
// })

// // ---------------------------------------------------
// // POST /api/biometric/fingerprint-register-verify
// // ---------------------------------------------------
// router.post('/fingerprint-register-verify', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId)
//     if (!user) return res.status(404).json({ message: 'User not found' })

//     const verification = await verifyRegistrationResponse({
//       response: req.body.registrationResult,
//       expectedChallenge: user.webauthnChallenge,
//       expectedOrigin: process.env.FRONTEND_URL || 'http://localhost:5173',
//       expectedRPID: process.env.RP_ID || 'localhost',
//       requireUserVerification: true,
//     })

//     if (!verification.verified) {
//       return res.status(400).json({ message: 'Registration failed' })
//     }

//     const { credential } = verification.registrationInfo

//     user.biometricDevices.push({
//       credentialID: Buffer.from(credential.id),
//       credentialPublicKey: Buffer.from(credential.publicKey),
//       counter: credential.counter,
//     })

//     user.fingerprintRegistered = true
//     user.webauthnChallenge = null
//     await user.save()

//     res.json({ success: true, message: 'Fingerprint registered' })
//   } catch (err) {
//     console.error('REGISTER VERIFY ERROR:', err)
//     res.status(500).json({ message: 'Server error' })
//   }
// })

// // ---------------------------------------------------
// // GET /api/biometric/fingerprint-options
// // ---------------------------------------------------
// router.get('/fingerprint-options', auth, async (req, res) => {
//   const user = await User.findById(req.user.userId)
//   if (!user || !user.biometricDevices.length) {
//     return res.status(400).json({ message: 'No biometric device registered' })
//   }

//   const options = await generateAuthenticationOptions({
//     rpID: process.env.RP_ID || 'localhost',
//     allowCredentials: user.biometricDevices.map((dev) => ({
//       id: isoBase64URL.fromBuffer(dev.credentialID),
//       type: 'public-key',
//     })),
//     userVerification: 'required',
//   })

//   user.webauthnChallenge = options.challenge
//   await user.save()

//   res.json(options)
// })

// // ---------------------------------------------------
// // 🔥 POST /api/biometric/verify-fingerprint (FIXED)
// // ---------------------------------------------------
// router.post('/verify-fingerprint', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId)
//     if (!user) return res.status(404).json({ message: 'User not found' })

//     const authenticator = user.biometricDevices.find(
//       (d) => isoBase64URL.fromBuffer(d.credentialID) === req.body.authResult.rawId
//     )

//     if (!authenticator) {
//       return res.status(400).json({ message: 'Device not registered' })
//     }

//     const verification = await verifyAuthenticationResponse({
//       response: req.body.authResult,
//       expectedChallenge: user.webauthnChallenge,
//       expectedOrigin: process.env.FRONTEND_URL || 'http://localhost:5173',
//       expectedRPID: process.env.RP_ID || 'localhost',
//       authenticator,
//       requireUserVerification: true,
//     })

//     if (!verification.verified) {
//       return res.status(401).json({ verified: false })
//     }

//     // 🔐 ISSUE SHORT-LIVED BIOMETRIC TOKEN
//     const biometricToken = jwt.sign(
//       { userId: user._id, type: 'fingerprint' },
//       process.env.JWT_SECRET,
//       { expiresIn: '2m' }
//     )

//     authenticator.counter = verification.authenticationInfo.newCounter
//     user.webauthnChallenge = null
//     await user.save()

//     res.json({
//       verified: true,
//       biometricToken,
//       message: 'Fingerprint verified',
//     })
//   } catch (err) {
//     console.error('VERIFY FINGERPRINT ERROR:', err)
//     res.status(500).json({ verified: false, message: 'Server error' })
//   }
// })

// export default router








































// // routes/biometricRoutes.js - COMPLETE WITH GEMINI + WEBAUTHN
// import express from 'express'
// import User from '../models/User.js'
// import auth from '../middleware/auth.js'
// import { isoUint8Array, isoBase64URL } from '@simplewebauthn/server/helpers'

// import { compareFaces } from '../services/geminiService.js'
// import {
//   generateAuthenticationOptions,
//   verifyAuthenticationResponse,
//   generateRegistrationOptions,
//   verifyRegistrationResponse,
// } from '@simplewebauthn/server'

// const router = express.Router()

// // GET /api/biometric/status
// router.get('/status', auth, async (req, res) => {
//   try {
//     console.log('GET /status - User ID:', req.user.userId)

//     const user = await User.findById(req.user.userId)
//     if (!user) {
//       console.log('User not found')
//       return res.status(404).json({ message: 'User not found' })
//     }

//     console.log('User biometric status:', {
//       faceRegistered: user.faceRegistered,
//       fingerprintRegistered: user.fingerprintRegistered,
//       webAuthnDevices: user.biometricDevices?.length || 0,
//     })

//     res.json({
//       faceRegistered: user.faceRegistered || false,
//       fingerprintRegistered: user.fingerprintRegistered || false,
//       webAuthnRegistered: (user.biometricDevices?.length || 0) > 0,
//       deviceCount: user.biometricDevices?.length || 0,
//     })
//   } catch (err) {
//     console.error('Status error:', err)
//     res.status(500).json({ message: 'Server error' })
//   }
// })

// // POST /api/biometric/register-face (GEMINI)
// router.post('/register-face', auth, async (req, res) => {
//   try {
//     console.log('POST /register-face - User ID:', req.user.userId)

//     const { faceData } = req.body

//     if (!faceData || faceData.trim() === '') {
//       console.log('ERROR: faceData is empty or missing')
//       return res.status(400).json({
//         success: false,
//         message: 'Face data is required',
//       })
//     }

//     console.log('Face data received, length:', faceData.length)

//     const user = await User.findById(req.user.userId)
//     if (!user) {
//       console.log('ERROR: User not found')
//       return res.status(404).json({
//         success: false,
//         message: 'User not found',
//       })
//     }

//     // Store FULL face data for Gemini
//     user.faceData = faceData
//     user.faceRegistered = true

//     await user.save()

//     console.log('✅ Face registered for user:', user.email, 'Length:', faceData.length)

//     res.json({
//       success: true,
//       message: 'Face registered successfully',
//     })
//   } catch (err) {
//     console.error('Register face error:', err.message)
//     res.status(500).json({
//       success: false,
//       message: 'Server error: ' + err.message,
//     })
//   }
// })

// // POST /api/biometric/verify-face (GEMINI)
// router.post('/verify-face', auth, async (req, res) => {
//   try {
//     console.log('POST /verify-face - User ID:', req.user.userId)

//     const { faceData } = req.body

//     if (!faceData || faceData.trim() === '') {
//       return res.status(400).json({
//         success: false,
//         message: 'Face data is required for verification',
//       })
//     }

//     const user = await User.findById(req.user.userId)
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found',
//       })
//     }

//     if (!user.faceRegistered || !user.faceData) {
//       return res.status(400).json({
//         success: false,
//         message: 'Face not registered. Please register face first.',
//       })
//     }

//     console.log('🔍 Calling Gemini for face verification...')

//     const isMatch = await compareFaces(faceData, user.faceData)

//     console.log('✅ Gemini verification result:', isMatch)

//     if (isMatch) {
//       res.json({
//         success: true,
//         message: 'Face verified successfully',
//         verified: true,
//       })
//     } else {
//       res.json({
//         success: false,
//         message: 'Face verification failed',
//         verified: false,
//       })
//     }
//   } catch (err) {
//     console.error('Verify face error:', err)
//     res.status(500).json({
//       success: false,
//       message: 'Server error: ' + err.message,
//     })
//   }
// })

// // ✅ GET fingerprint registration options (WebAuthn)
// router.get('/fingerprint-register-options', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId)
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' })
//     }

//     const rpName = 'SecureATM'
//     const rpID = process.env.RP_ID || 'localhost'
//     const userID = isoUint8Array.fromUTF8String(user._id.toString())

//     const options = await generateRegistrationOptions({
//       rpName,
//       rpID,
//       userID,
//       userName: user.email,
//       timeout: 60000,
//       attestationType: 'none',
//       authenticatorSelection: {
//         authenticatorAttachment: 'platform',
//         userVerification: 'required',
//         residentKey: 'preferred',
//       },
//       excludeCredentials:
//         user.biometricDevices?.map((dev) => ({
//           // 🔥 IMPORTANT: convert Buffer → base64url string
//           id: isoBase64URL.fromBuffer(dev.credentialID),
//           type: 'public-key',
//           transports: dev.transports || [],
//         })) || [],
//       supportedAlgorithmIDs: [-7, -257],
//     })

//     user.webauthnChallenge = options.challenge
//     await user.save()

//     console.log('✅ Registration options generated for:', user.email)
//     res.json(options)
//   } catch (error) {
//     console.error('Error generating registration options:', error)
//     res.status(500).json({ message: 'Failed to generate registration options' })
//   }
// })

// // ✅ POST verify fingerprint registration (WebAuthn)
// router.post('/fingerprint-register-verify', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId)
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' })
//     }

//     const { registrationResult, deviceName } = req.body
//     const expectedChallenge = user.webauthnChallenge

//     if (!expectedChallenge) {
//       return res.status(400).json({
//         success: false,
//         message: 'No challenge found. Please try again.',
//       })
//     }

//     const rpID = process.env.RP_ID || 'localhost'
//     const expectedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173'

//     const verification = await verifyRegistrationResponse({
//       response: registrationResult,
//       expectedChallenge,
//       expectedOrigin,
//       expectedRPID: rpID,
//       requireUserVerification: true,
//     })

//     if (verification.verified && verification.registrationInfo) {
//       const { registrationInfo } = verification
//       const { credential } = registrationInfo
//       const { id, publicKey, counter } = credential

//       // Ensure biometricDevices array exists
//       if (!user.biometricDevices) {
//         user.biometricDevices = []
//       }

//       user.biometricDevices.push({
//         // id & publicKey are usually Buffers; Buffer.from is safe either way
//         credentialID: Buffer.isBuffer(id) ? id : Buffer.from(id),
//         credentialPublicKey: Buffer.isBuffer(publicKey)
//           ? publicKey
//           : Buffer.from(publicKey),
//         counter,
//         transports:
//           registrationResult?.response?.transports ||
//           registrationResult?.response?.response?.transports ||
//           [],
//         deviceName: deviceName || 'Biometric Device',
//         registeredAt: new Date(),
//       })

//       user.fingerprintRegistered = true
//       user.webauthnChallenge = null
//       await user.save()

//       console.log('✅ Biometric device registered for:', user.email)
//       return res.json({
//         success: true,
//         message: 'Biometric device registered successfully',
//       })
//     } else {
//       // Clear challenge on failure too
//       user.webauthnChallenge = null
//       await user.save()

//       return res.status(400).json({
//         success: false,
//         message: 'Registration verification failed',
//       })
//     }
//   } catch (error) {
//     console.error('Registration verification error:', error)

//     // Try to clear challenge on error as well
//     try {
//       const user = await User.findById(req.user.userId)
//       if (user) {
//         user.webauthnChallenge = null
//         await user.save()
//       }
//     } catch (e) {
//       console.error('Error clearing challenge after registration error:', e)
//     }

//     return res.status(500).json({
//       success: false,
//       message: 'Registration failed: ' + error.message,
//     })
//   }
// })
// // ✅ GET fingerprint authentication options (WebAuthn)
// router.get('/fingerprint-options', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId)
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' })
//     }

//     if (!user.biometricDevices || user.biometricDevices.length === 0) {
//       return res.status(400).json({
//         message: 'No biometric device registered. Please register in Settings first.',
//       })
//     }

//     const rpID = process.env.RP_ID || 'localhost'

//     const options = await generateAuthenticationOptions({
//       timeout: 60000,
//       allowCredentials: user.biometricDevices.map((dev) => ({
//         // ✅ convert Buffer → base64url string
//         id: isoBase64URL.fromBuffer(dev.credentialID),
//         type: 'public-key',
//         transports: dev.transports || [],
//       })),
//       userVerification: 'required',
//       rpID,
//     })

//     user.webauthnChallenge = options.challenge
//     await user.save()

//     console.log('✅ Authentication options generated for:', user.email)
//     res.json(options)
//   } catch (error) {
//     console.error('Error generating authentication options:', error)
//     res.status(500).json({ message: 'Failed to generate authentication options' })
//   }
// })


// // ✅ POST verify fingerprint authentication (WebAuthn)
// router.post('/verify-fingerprint', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId)
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' })
//     }

//     const { authResult } = req.body
//     const expectedChallenge = user.webauthnChallenge

//     if (!expectedChallenge) {
//       return res.status(400).json({
//         verified: false,
//         message: 'No challenge found. Please try again.',
//       })
//     }

//     // Find the authenticator device by comparing stored credentialID with authResult.rawId
//     const authenticator = user.biometricDevices?.find(
//       (dev) => isoBase64URL.fromBuffer(dev.credentialID) === authResult.rawId
//     )

//     if (!authenticator) {
//       user.webauthnChallenge = null
//       await user.save()
//       return res.status(400).json({
//         verified: false,
//         message: 'Device not registered',
//       })
//     }

//     const rpID = process.env.RP_ID || 'localhost'
//     const expectedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173'

//     // Verify the authentication response
//     const verification = await verifyAuthenticationResponse({
//       response: authResult,
//       expectedChallenge,
//       expectedOrigin,
//       expectedRPID: rpID,
//       authenticator: {
//         credentialID: authenticator.credentialID,
//         credentialPublicKey: authenticator.credentialPublicKey,
//         counter: authenticator.counter,
//       },
//       requireUserVerification: true,
//     })

//     if (verification.verified) {
//       authenticator.counter = verification.authenticationInfo.newCounter
//       user.webauthnChallenge = null
//       await user.save()
//     } else {
//       user.webauthnChallenge = null
//       await user.save()
//     }

//     console.log(
//       '✅ Fingerprint verification result:',
//       verification.verified,
//       'for:',
//       user.email
//     )

//     res.json({
//       verified: verification.verified,
//       message: verification.verified
//         ? 'Fingerprint verified successfully'
//         : 'Verification failed',
//     })
//   } catch (error) {
//     console.error('Fingerprint verification error:', error)

//     try {
//       const user = await User.findById(req.user.userId)
//       if (user) {
//         user.webauthnChallenge = null
//         await user.save()
//       }
//     } catch (e) {
//       console.error('Error clearing challenge after auth error:', e)
//     }

//     res.status(500).json({
//       verified: false,
//       message: 'Verification failed: ' + error.message,
//     })
//   }
// })

// // OLD: Legacy dummy fingerprint (keep for backward compatibility)
// router.post('/register-fingerprint', auth, async (req, res) => {
//   try {
//     console.log('POST /register-fingerprint (legacy)')

//     const { fingerprintData } = req.body

//     if (!fingerprintData || fingerprintData.trim() === '') {
//       return res.status(400).json({
//         success: false,
//         message: 'Fingerprint data is required',
//       })
//     }

//     const user = await User.findById(req.user.userId)
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found',
//       })
//     }

//     user.fingerprintData = fingerprintData
//     user.fingerprintRegistered = true
//     await user.save()

//     res.json({
//       success: true,
//       message: 'Fingerprint registered successfully',
//     })
//   } catch (err) {
//     console.error('Register fingerprint error:', err)
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//     })
//   }
// })

// export default router






