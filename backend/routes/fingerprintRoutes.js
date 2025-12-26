 






// // routes/fingerprintRoutes.js - COMPLETE & FIXED
// import express from 'express'
// import {
//   generateRegistrationOptions,
//   verifyRegistrationResponse,
//   generateAuthenticationOptions,
//   verifyAuthenticationResponse,
// } from '@simplewebauthn/server'
// import User from '../models/User.js'
// import auth from '../middleware/auth.js'

// const router = express.Router()

// // WebAuthn Configuration
// const RP_ID = process.env.RP_ID || 'zlx30n8l-5173.inc1.devtunnels.ms'
// const RP_NAME = process.env.RP_NAME || 'SecureATM'
// const CLIENT_URL = process.env.CLIENT_URL || 'https://zlx30n8l-5173.inc1.devtunnels.ms'

// // ---------------------------------------------------
// // GET /api/fingerprint/status
// // ---------------------------------------------------
// router.get('/status', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId)
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' })
//     }

//     res.json({
//       fingerprintRegistered: user.fingerprintRegistered || false,
//       deviceCount: user.authenticators?.length || 0,
//     })
//   } catch (err) {
//     console.error('FINGERPRINT STATUS ERROR:', err)
//     res.status(500).json({ error: 'Server error' })
//   }
// })

// // ---------------------------------------------------
// // GET /api/fingerprint/init-register
// // ---------------------------------------------------
// router.get('/init-register', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId)
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' })
//     }

//     const options = await generateRegistrationOptions({
//       rpID: RP_ID,
//       rpName: RP_NAME,
//       userName: user.email,
//     })

//     user.currentChallenge = options.challenge
//     user.webauthnUserId = options.user.id
//     await user.save()

//     console.log('✅ Fingerprint registration started for:', user.email)
//     res.json(options)
//   } catch (err) {
//     console.error('INIT REGISTER ERROR:', err)
//     res.status(500).json({ error: 'Server error: ' + err.message })
//   }
// })

// // ---------------------------------------------------
// // POST /api/fingerprint/verify-register
// // ---------------------------------------------------
// router.post('/verify-register', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId)
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' })
//     }

//     const expectedChallenge = user.currentChallenge
//     if (!expectedChallenge) {
//       return res.status(400).json({ error: 'Registration challenge not found' })
//     }

//     console.log('📥 Received registration response')

//     const verification = await verifyRegistrationResponse({
//       response: req.body,
//       expectedChallenge: expectedChallenge,
//       expectedOrigin: CLIENT_URL,
//       expectedRPID: RP_ID,
//     })

//     if (verification.verified && verification.registrationInfo) {
//       const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo

//       if (!credential || !credential.id || !credential.publicKey) {
//         console.error('❌ Invalid credential data:', credential)
//         return res.status(400).json({ error: 'Invalid registration response - missing credential data' })
//       }

//       const newAuthenticator = {
//         credentialID: Buffer.from(credential.id, 'base64url'),
//         credentialPublicKey: Buffer.from(credential.publicKey),
//         counter: credential.counter || 0,
//         transports: credential.transports || [],
//         deviceType: credentialDeviceType,
//         backedUp: credentialBackedUp,
//         registeredAt: new Date(),
//       }

//       if (!user.authenticators) {
//         user.authenticators = []
//       }

//       user.authenticators.push(newAuthenticator)
//       user.fingerprintRegistered = true
//       user.currentChallenge = null
//       await user.save()

//       console.log(`✅ Fingerprint registered successfully for: ${user.email}`)
//       console.log(`📦 CredentialID: ${credential.id}`)

//       return res.json({ 
//         verified: verification.verified,
//         message: 'Fingerprint registered successfully'
//       })
//     } else {
//       console.error('❌ Verification failed or missing registrationInfo')
//       return res.status(400).json({ 
//         verified: false, 
//         error: 'Verification failed' 
//       })
//     }
//   } catch (err) {
//     console.error('VERIFY REGISTER ERROR:', err)
//     console.error('Stack:', err.stack)
//     res.status(500).json({ error: 'Server error: ' + err.message })
//   }
// })

// // ---------------------------------------------------
// // GET /api/fingerprint/init-auth - FIXED
// // ---------------------------------------------------
// router.get('/init-auth', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId)
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' })
//     }

//     if (!user.fingerprintRegistered || !user.authenticators || user.authenticators.length === 0) {
//       return res.status(400).json({ 
//         error: 'No fingerprint registered. Please register in settings first.' 
//       })
//     }

//     const passKey = user.authenticators[0]

//     // ✅ Convert Buffer to base64url string for SimpleWebAuthn
//     const credentialID = Buffer.isBuffer(passKey.credentialID)
//       ? passKey.credentialID.toString('base64url')
//       : passKey.credentialID

//     const options = await generateAuthenticationOptions({
//       rpID: RP_ID,
//       allowCredentials: [
//         {
//           id: credentialID,
//           type: 'public-key',
//           transports: passKey.transports || [],
//         },
//       ],
//     })

//     user.currentChallenge = options.challenge
//     await user.save()

//     console.log('✅ Fingerprint authentication started for:', user.email)
//     res.json(options)
//   } catch (err) {
//     console.error('INIT AUTH ERROR:', err)
//     res.status(500).json({ error: 'Server error: ' + err.message })
//   }
// })

// // ---------------------------------------------------
// // POST /api/fingerprint/verify-auth - FIXED FOR v13
// // ---------------------------------------------------
// router.post('/verify-auth', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId)
//     if (!user) {
//       console.error('❌ User not found')
//       return res.status(404).json({ error: 'User not found' })
//     }

//     const expectedChallenge = user.currentChallenge
//     if (!expectedChallenge) {
//       console.error('❌ No challenge found')
//       return res.status(400).json({ error: 'Authentication challenge not found' })
//     }

//     console.log('📥 Received auth response:', {
//       id: req.body.id,
//       rawId: req.body.rawId,
//       type: req.body.type
//     })

//     const receivedCredentialID = req.body.rawId || req.body.id
    
//     if (!receivedCredentialID) {
//       console.error('❌ No credential ID in request')
//       return res.status(400).json({ error: 'No credential ID provided' })
//     }

//     const receivedIDBuffer = typeof receivedCredentialID === 'string'
//       ? Buffer.from(receivedCredentialID, 'base64url')
//       : Buffer.from(receivedCredentialID)

//     console.log('🔍 Looking for credential:', receivedIDBuffer.toString('base64url'))

//     const passKey = user.authenticators?.find(auth => {
//       const storedIDBuffer = Buffer.isBuffer(auth.credentialID) 
//         ? auth.credentialID 
//         : Buffer.from(auth.credentialID, 'base64url')
      
//       const matches = storedIDBuffer.equals(receivedIDBuffer)
//       console.log(`  Comparing: ${storedIDBuffer.toString('base64url')} === ${receivedIDBuffer.toString('base64url')} → ${matches}`)
//       return matches
//     })

//     if (!passKey) {
//       console.error('❌ No matching credential found!')
//       console.error('Available credentials:', user.authenticators?.map(a => 
//         (Buffer.isBuffer(a.credentialID) ? a.credentialID : Buffer.from(a.credentialID, 'base64url')).toString('base64url')
//       ))
//       return res.status(400).json({ error: 'Invalid credential - no match found' })
//     }

//     console.log('✅ Found matching credential')

//     // ✅ FIXED: Use 'credential' for v13
//     const credential = {
//       id: Buffer.isBuffer(passKey.credentialID) 
//         ? passKey.credentialID 
//         : Buffer.from(passKey.credentialID, 'base64url'),
//       publicKey: Buffer.isBuffer(passKey.credentialPublicKey)
//         ? passKey.credentialPublicKey
//         : Buffer.from(passKey.credentialPublicKey),
//       counter: passKey.counter ?? 0,
//       transports: passKey.transports,
//     }

//     console.log('🔐 Verifying with credential:', {
//       idLength: credential.id.length,
//       publicKeyLength: credential.publicKey.length,
//       counter: credential.counter,
//       transports: credential.transports
//     })

//     console.log('🌐 Expected:', {
//       challenge: expectedChallenge,
//       origin: CLIENT_URL,
//       rpID: RP_ID
//     })

//     const verification = await verifyAuthenticationResponse({
//       response: req.body,
//       expectedChallenge: expectedChallenge,
//       expectedOrigin: CLIENT_URL,
//       expectedRPID: RP_ID,
//       credential: credential,
//     })

//     console.log('✅ Verification result:', verification.verified)

//     if (verification.verified) {
//       // Update counter
//       const authIndex = user.authenticators.findIndex(auth => {
//         const storedIDBuffer = Buffer.isBuffer(auth.credentialID) 
//           ? auth.credentialID 
//           : Buffer.from(auth.credentialID, 'base64url')
//         return storedIDBuffer.equals(receivedIDBuffer)
//       })
      
//       if (authIndex !== -1) {
//         user.authenticators[authIndex].counter = verification.authenticationInfo.newCounter
//         console.log(`📊 Counter updated: ${passKey.counter} → ${verification.authenticationInfo.newCounter}`)
//       }
      
//       user.currentChallenge = null
//       await user.save()

//       console.log(`✅✅✅ Fingerprint verified successfully for: ${user.email}`)
      
//       return res.json({ 
//         verified: true,
//         message: 'Fingerprint verified successfully',
//       })
//     } else {
//       console.error('❌ Verification returned false')
//       return res.status(400).json({ 
//         verified: false, 
//         error: 'Verification failed' 
//       })
//     }
//   } catch (err) {
//     console.error('❌❌❌ VERIFY AUTH ERROR:', err.message)
//     console.error('Error details:', {
//       name: err.name,
//       message: err.message,
//       stack: err.stack
//     })
//     res.status(500).json({ error: 'Server error: ' + err.message })
//   }
// })

// // ---------------------------------------------------
// // Debug route
// // ---------------------------------------------------
// router.get('/debug', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId)
    
//     const authenticators = user.authenticators?.map(auth => ({
//       credentialID: (Buffer.isBuffer(auth.credentialID) 
//         ? auth.credentialID 
//         : Buffer.from(auth.credentialID, 'base64url')).toString('base64url'),
//       counter: auth.counter,
//       hasPublicKey: !!auth.credentialPublicKey,
//       publicKeyLength: auth.credentialPublicKey?.length,
//       deviceType: auth.deviceType,
//       transports: auth.transports
//     })) || []
    
//     res.json({ 
//       fingerprintRegistered: user.fingerprintRegistered,
//       authenticatorCount: authenticators.length,
//       authenticators 
//     })
//   } catch (err) {
//     res.status(500).json({ error: err.message })
//   }
// })

// export default router




















// routes/fingerprintRoutes.js - COMPLETE & FIXED WITH TOKEN
import express from 'express'
import crypto from 'crypto' // ✅ ADD THIS
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server'
import User from '../models/User.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// WebAuthn Configuration
const RP_ID = process.env.RP_ID || 'zlx30n8l-5173.inc1.devtunnels.ms'
const RP_NAME = process.env.RP_NAME || 'SecureATM'
const CLIENT_URL = process.env.CLIENT_URL || 'https://zlx30n8l-5173.inc1.devtunnels.ms'

// ---------------------------------------------------
// GET /api/fingerprint/status
// ---------------------------------------------------
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      fingerprintRegistered: user.fingerprintRegistered || false,
      deviceCount: user.authenticators?.length || 0,
    })
  } catch (err) {
    console.error('FINGERPRINT STATUS ERROR:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// ---------------------------------------------------
// GET /api/fingerprint/init-register
// ---------------------------------------------------
router.get('/init-register', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const options = await generateRegistrationOptions({
      rpID: RP_ID,
      rpName: RP_NAME,
      userName: user.email,
    })

    user.currentChallenge = options.challenge
    user.webauthnUserId = options.user.id
    await user.save()

    console.log('✅ Fingerprint registration started for:', user.email)
    res.json(options)
  } catch (err) {
    console.error('INIT REGISTER ERROR:', err)
    res.status(500).json({ error: 'Server error: ' + err.message })
  }
})

// ---------------------------------------------------
// POST /api/fingerprint/verify-register
// ---------------------------------------------------
router.post('/verify-register', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const expectedChallenge = user.currentChallenge
    if (!expectedChallenge) {
      return res.status(400).json({ error: 'Registration challenge not found' })
    }

    console.log('📥 Received registration response')

    const verification = await verifyRegistrationResponse({
      response: req.body,
      expectedChallenge: expectedChallenge,
      expectedOrigin: CLIENT_URL,
      expectedRPID: RP_ID,
    })

    if (verification.verified && verification.registrationInfo) {
      const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo

      if (!credential || !credential.id || !credential.publicKey) {
        console.error('❌ Invalid credential data:', credential)
        return res.status(400).json({ error: 'Invalid registration response - missing credential data' })
      }

      const newAuthenticator = {
        credentialID: Buffer.from(credential.id, 'base64url'),
        credentialPublicKey: Buffer.from(credential.publicKey),
        counter: credential.counter || 0,
        transports: credential.transports || [],
        deviceType: credentialDeviceType,
        backedUp: credentialBackedUp,
        registeredAt: new Date(),
      }

      if (!user.authenticators) {
        user.authenticators = []
      }

      user.authenticators.push(newAuthenticator)
      user.fingerprintRegistered = true
      user.currentChallenge = null
      await user.save()

      console.log(`✅ Fingerprint registered successfully for: ${user.email}`)
      console.log(`📦 CredentialID: ${credential.id}`)

      return res.json({ 
        verified: verification.verified,
        message: 'Fingerprint registered successfully'
      })
    } else {
      console.error('❌ Verification failed or missing registrationInfo')
      return res.status(400).json({ 
        verified: false, 
        error: 'Verification failed' 
      })
    }
  } catch (err) {
    console.error('VERIFY REGISTER ERROR:', err)
    console.error('Stack:', err.stack)
    res.status(500).json({ error: 'Server error: ' + err.message })
  }
})

// ---------------------------------------------------
// GET /api/fingerprint/init-auth
// ---------------------------------------------------
router.get('/init-auth', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (!user.fingerprintRegistered || !user.authenticators || user.authenticators.length === 0) {
      return res.status(400).json({ 
        error: 'No fingerprint registered. Please register in settings first.' 
      })
    }

    const passKey = user.authenticators[0]

    const credentialID = Buffer.isBuffer(passKey.credentialID)
      ? passKey.credentialID.toString('base64url')
      : passKey.credentialID

    const options = await generateAuthenticationOptions({
      rpID: RP_ID,
      allowCredentials: [
        {
          id: credentialID,
          type: 'public-key',
          transports: passKey.transports || [],
        },
      ],
    })

    user.currentChallenge = options.challenge
    await user.save()

    console.log('✅ Fingerprint authentication started for:', user.email)
    res.json(options)
  } catch (err) {
    console.error('INIT AUTH ERROR:', err)
    res.status(500).json({ error: 'Server error: ' + err.message })
  }
})

// ---------------------------------------------------
// POST /api/fingerprint/verify-auth - WITH TOKEN
// ---------------------------------------------------
router.post('/verify-auth', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) {
      console.error('❌ User not found')
      return res.status(404).json({ error: 'User not found' })
    }

    const expectedChallenge = user.currentChallenge
    if (!expectedChallenge) {
      console.error('❌ No challenge found')
      return res.status(400).json({ error: 'Authentication challenge not found' })
    }

    console.log('📥 Received auth response')

    const receivedCredentialID = req.body.rawId || req.body.id
    
    if (!receivedCredentialID) {
      console.error('❌ No credential ID in request')
      return res.status(400).json({ error: 'No credential ID provided' })
    }

    const receivedIDBuffer = typeof receivedCredentialID === 'string'
      ? Buffer.from(receivedCredentialID, 'base64url')
      : Buffer.from(receivedCredentialID)

    const passKey = user.authenticators?.find(auth => {
      const storedIDBuffer = Buffer.isBuffer(auth.credentialID) 
        ? auth.credentialID 
        : Buffer.from(auth.credentialID, 'base64url')
      
      return storedIDBuffer.equals(receivedIDBuffer)
    })

    if (!passKey) {
      console.error('❌ No matching credential found!')
      return res.status(400).json({ error: 'Invalid credential - no match found' })
    }

    const credential = {
      id: Buffer.isBuffer(passKey.credentialID) 
        ? passKey.credentialID 
        : Buffer.from(passKey.credentialID, 'base64url'),
      publicKey: Buffer.isBuffer(passKey.credentialPublicKey)
        ? passKey.credentialPublicKey
        : Buffer.from(passKey.credentialPublicKey),
      counter: passKey.counter ?? 0,
      transports: passKey.transports,
    }

    const verification = await verifyAuthenticationResponse({
      response: req.body,
      expectedChallenge: expectedChallenge,
      expectedOrigin: CLIENT_URL,
      expectedRPID: RP_ID,
      credential: credential,
    })

    if (verification.verified) {
      // Update counter
      const authIndex = user.authenticators.findIndex(auth => {
        const storedIDBuffer = Buffer.isBuffer(auth.credentialID) 
          ? auth.credentialID 
          : Buffer.from(auth.credentialID, 'base64url')
        return storedIDBuffer.equals(receivedIDBuffer)
      })
      
      if (authIndex !== -1) {
        user.authenticators[authIndex].counter = verification.authenticationInfo.newCounter
      }
      
      // ✅ GENERATE BIOMETRIC TOKEN
      const biometricToken = crypto.randomBytes(32).toString('hex')
      user.biometricToken = biometricToken
      user.biometricTokenExpiry = new Date(Date.now() + 5 * 60 * 1000) // 5 min
      user.currentChallenge = null
      
      await user.save()

      console.log(`✅✅✅ Fingerprint verified for: ${user.email}`)
      console.log(`🎫 Token generated: ${biometricToken.substring(0, 16)}...`)
      
      return res.json({ 
        verified: true,
        biometricToken: biometricToken, // ✅ RETURN TOKEN
        message: 'Fingerprint verified successfully',
      })
    } else {
      console.error('❌ Verification returned false')
      return res.status(400).json({ 
        verified: false, 
        error: 'Verification failed' 
      })
    }
  } catch (err) {
    console.error('❌❌❌ VERIFY AUTH ERROR:', err.message)
    res.status(500).json({ error: 'Server error: ' + err.message })
  }
})

// ---------------------------------------------------
// Debug route
// ---------------------------------------------------
router.get('/debug', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    
    const authenticators = user.authenticators?.map(auth => ({
      credentialID: (Buffer.isBuffer(auth.credentialID) 
        ? auth.credentialID 
        : Buffer.from(auth.credentialID, 'base64url')).toString('base64url'),
      counter: auth.counter,
      hasPublicKey: !!auth.credentialPublicKey,
      publicKeyLength: auth.credentialPublicKey?.length,
      deviceType: auth.deviceType,
      transports: auth.transports
    })) || []
    
    res.json({ 
      fingerprintRegistered: user.fingerprintRegistered,
      authenticatorCount: authenticators.length,
      authenticators 
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
