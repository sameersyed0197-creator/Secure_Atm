// // // // // // routes/biometricRoutes.js - COMPLETE WORKING CODE
// // // // // import express from 'express'
// // // // // import User from '../models/User.js'
// // // // // import auth from '../middleware/auth.js'

// // // // // const router = express.Router()

// // // // // // GET /api/biometric/status
// // // // // router.get('/status', auth, async (req, res) => {
// // // // //   try {
// // // // //     const user = await User.findById(req.user.userId)
// // // // //     if (!user) return res.status(404).json({ message: 'User not found' })

// // // // //     res.json({
// // // // //       faceRegistered: user.faceRegistered || false,
// // // // //       fingerprintRegistered: user.fingerprintRegistered || false
// // // // //     })
// // // // //   } catch (err) {
// // // // //     console.error('Status error:', err)
// // // // //     res.status(500).json({ message: 'Server error' })
// // // // //   }
// // // // // })

// // // // // // POST /api/biometric/register-face
// // // // // router.post('/register-face', auth, async (req, res) => {
// // // // //   try {
// // // // //     console.log('Register face request body:', req.body) // ADD THIS FOR DEBUGGING
    
// // // // //     const { faceData } = req.body
// // // // //     const userId = req.user.userId

// // // // //     if (!faceData || faceData.trim() === '') {
// // // // //       console.log('Missing faceData')
// // // // //       return res.status(400).json({ message: 'Face data is required' })
// // // // //     }

// // // // //     const user = await User.findById(userId)
// // // // //     if (!user) {
// // // // //       console.log('User not found:', userId)
// // // // //       return res.status(404).json({ message: 'User not found' })
// // // // //     }

// // // // //     // Save face data
// // // // //     user.faceData = faceData
// // // // //     user.faceRegistered = true
// // // // //     await user.save()

// // // // //     console.log('Face registered for user:', userId)
    
// // // // //     res.json({ 
// // // // //       success: true, 
// // // // //       message: 'Face registered successfully' 
// // // // //     })
// // // // //   } catch (err) {
// // // // //     console.error('Register face error:', err)
// // // // //     res.status(500).json({ message: 'Server error: ' + err.message })
// // // // //   }
// // // // // })

// // // // // // POST /api/biometric/register-fingerprint
// // // // // router.post('/register-fingerprint', auth, async (req, res) => {
// // // // //   try {
// // // // //     console.log('Register fingerprint request body:', req.body)
    
// // // // //     const { fingerprintData } = req.body
// // // // //     const userId = req.user.userId

// // // // //     if (!fingerprintData || fingerprintData.trim() === '') {
// // // // //       return res.status(400).json({ message: 'Fingerprint data is required' })
// // // // //     }

// // // // //     const user = await User.findById(userId)
// // // // //     if (!user) return res.status(404).json({ message: 'User not found' })

// // // // //     user.fingerprintData = fingerprintData
// // // // //     user.fingerprintRegistered = true
// // // // //     await user.save()

// // // // //     res.json({ 
// // // // //       success: true, 
// // // // //       message: 'Fingerprint registered successfully' 
// // // // //     })
// // // // //   } catch (err) {
// // // // //     console.error('Register fingerprint error:', err)
// // // // //     res.status(500).json({ message: 'Server error' })
// // // // //   }
// // // // // })

// // // // // export default router




// // // // // routes/biometricRoutes.js - ADD THIS ROUTE
// // // // import express from 'express'
// // // // import User from '../models/User.js'
// // // // import auth from '../middleware/auth.js'

// // // // const router = express.Router()

// // // // // ... your existing routes ...

// // // // // ADD THIS NEW ENDPOINT FOR FACE VERIFICATION
// // // // router.post('/verify-face', auth, async (req, res) => {
// // // //   try {
// // // //     console.log('POST /verify-face - User ID:', req.user.userId);
    
// // // //     const { faceData } = req.body;
    
// // // //     if (!faceData || faceData.trim() === '') {
// // // //       return res.status(400).json({ 
// // // //         success: false,
// // // //         message: 'Face data is required for verification' 
// // // //       });
// // // //     }

// // // //     const user = await User.findById(req.user.userId);
// // // //     if (!user) {
// // // //       return res.status(404).json({ 
// // // //         success: false,
// // // //         message: 'User not found' 
// // // //       });
// // // //     }

// // // //     // SIMPLE STRING COMPARISON
// // // //     // This is for demo - in real app use facial recognition
// // // //     const isMatch = user.faceData && user.faceData === faceData;
    
// // // //     console.log('Face verification result:', {
// // // //       match: isMatch,
// // // //       storedLength: user.faceData ? user.faceData.length : 0,
// // // //       incomingLength: faceData.length
// // // //     });
    
// // // //     if (isMatch) {
// // // //       res.json({ 
// // // //         success: true, 
// // // //         message: 'Face verified successfully',
// // // //         verified: true
// // // //       });
// // // //     } else {
// // // //       res.json({ 
// // // //         success: false, 
// // // //         message: 'Face verification failed',
// // // //         verified: false
// // // //       });
// // // //     }
// // // //   } catch (err) {
// // // //     console.error('Verify face error:', err);
// // // //     res.status(500).json({ 
// // // //       success: false,
// // // //       message: 'Server error: ' + err.message 
// // // //     });
// // // //   }
// // // // });

// // // // export default router;



// // // // routes/biometricRoutes.js - COMPLETE FILE
// // // import express from 'express'
// // // import User from '../models/User.js'
// // // import auth from '../middleware/auth.js'

// // // const router = express.Router()

// // // // GET /api/biometric/status
// // // router.get('/status', auth, async (req, res) => {
// // //   try {
// // //     console.log('GET /status - User ID:', req.user.userId)
    
// // //     const user = await User.findById(req.user.userId)
// // //     if (!user) {
// // //       console.log('User not found')
// // //       return res.status(404).json({ message: 'User not found' })
// // //     }

// // //     console.log('User biometric status:', {
// // //       faceRegistered: user.faceRegistered,
// // //       fingerprintRegistered: user.fingerprintRegistered
// // //     })
    
// // //     res.json({
// // //       faceRegistered: user.faceRegistered || false,
// // //       fingerprintRegistered: user.fingerprintRegistered || false
// // //     })
// // //   } catch (err) {
// // //     console.error('Status error:', err)
// // //     res.status(500).json({ message: 'Server error' })
// // //   }
// // // })

// // // // POST /api/biometric/register-face
// // // router.post('/register-face', auth, async (req, res) => {
// // //   try {
// // //     console.log('POST /register-face - User ID:', req.user.userId)
    
// // //     const { faceData } = req.body
    
// // //     if (!faceData || faceData.trim() === '') {
// // //       console.log('ERROR: faceData is empty or missing')
// // //       return res.status(400).json({ 
// // //         success: false,
// // //         message: 'Face data is required' 
// // //       })
// // //     }

// // //     console.log('Face data received, length:', faceData.length)
    
// // //     // Truncate if too long for demo
// // //     const maxLength = 50000
// // //     let faceDataToStore = faceData
    
// // //     if (faceData.length > maxLength) {
// // //       console.log(`Face data too long (${faceData.length} > ${maxLength}), truncating...`)
// // //       faceDataToStore = faceData.substring(0, maxLength)
// // //     }

// // //     const user = await User.findById(req.user.userId)
// // //     if (!user) {
// // //       console.log('ERROR: User not found')
// // //       return res.status(404).json({ 
// // //         success: false,
// // //         message: 'User not found' 
// // //       })
// // //     }

// // //     // Store face data
// // //     user.faceData = faceDataToStore
// // //     user.faceRegistered = true
    
// // //     await user.save()
    
// // //     console.log('SUCCESS: Face registered for user:', user.email, 'Length stored:', faceDataToStore.length)
    
// // //     res.json({ 
// // //       success: true, 
// // //       message: 'Face registered successfully',
// // //       dataLength: faceDataToStore.length
// // //     })
// // //   } catch (err) {
// // //     console.error('Register face error:', err.message)
// // //     res.status(500).json({ 
// // //       success: false,
// // //       message: 'Server error: ' + err.message 
// // //     })
// // //   }
// // // })

// // // // POST /api/biometric/register-fingerprint
// // // router.post('/register-fingerprint', auth, async (req, res) => {
// // //   try {
// // //     console.log('POST /register-fingerprint')
    
// // //     const { fingerprintData } = req.body
    
// // //     if (!fingerprintData || fingerprintData.trim() === '') {
// // //       return res.status(400).json({ 
// // //         success: false,
// // //         message: 'Fingerprint data is required' 
// // //       })
// // //     }

// // //     const user = await User.findById(req.user.userId)
// // //     if (!user) return res.status(404).json({ 
// // //       success: false,
// // //       message: 'User not found' 
// // //     })

// // //     user.fingerprintData = fingerprintData
// // //     user.fingerprintRegistered = true
// // //     await user.save()

// // //     res.json({ 
// // //       success: true, 
// // //       message: 'Fingerprint registered successfully' 
// // //     })
// // //   } catch (err) {
// // //     console.error('Register fingerprint error:', err)
// // //     res.status(500).json({ 
// // //       success: false,
// // //       message: 'Server error' 
// // //     })
// // //   }
// // // })

// // // // POST /api/biometric/verify-face
// // // router.post('/verify-face', auth, async (req, res) => {
// // //   try {
// // //     console.log('POST /verify-face - User ID:', req.user.userId)
    
// // //     const { faceData } = req.body
    
// // //     if (!faceData || faceData.trim() === '') {
// // //       return res.status(400).json({ 
// // //         success: false,
// // //         message: 'Face data is required for verification' 
// // //       })
// // //     }

// // //     const user = await User.findById(req.user.userId)
// // //     if (!user) {
// // //       return res.status(404).json({ 
// // //         success: false,
// // //         message: 'User not found' 
// // //       })
// // //     }

// // //     // Check if face is registered
// // //     if (!user.faceRegistered || !user.faceData) {
// // //       return res.status(400).json({ 
// // //         success: false,
// // //         message: 'Face not registered. Please register face first.' 
// // //       })
// // //     }

// // //     // SIMPLE STRING COMPARISON
// // //     const isMatch = user.faceData === faceData
    
// // //     console.log('Face verification check:', {
// // //       match: isMatch,
// // //       storedLength: user.faceData.length,
// // //       incomingLength: faceData.length,
// // //       storedFirst50: user.faceData.substring(0, 50),
// // //       incomingFirst50: faceData.substring(0, 50)
// // //     })
    
// // //     if (isMatch) {
// // //       res.json({ 
// // //         success: true, 
// // //         message: 'Face verified successfully',
// // //         verified: true
// // //       })
// // //     } else {
// // //       res.json({ 
// // //         success: false, 
// // //         message: 'Face verification failed',
// // //         verified: false
// // //       })
// // //     }
// // //   } catch (err) {
// // //     console.error('Verify face error:', err)
// // //     res.status(500).json({ 
// // //       success: false,
// // //       message: 'Server error: ' + err.message 
// // //     })
// // //   }
// // // })

// // // export default router










// // // routes/biometricRoutes.js - UPDATED FOR GEMINI
// // import express from 'express'
// // import User from '../models/User.js'
// // import auth from '../middleware/auth.js'
// // import { compareFaces } from '../services/geminiService.js' // ✅ ADD THIS IMPORT

// // const router = express.Router()

// // // GET /api/biometric/status
// // router.get('/status', auth, async (req, res) => {
// //   try {
// //     console.log('GET /status - User ID:', req.user.userId)
    
// //     const user = await User.findById(req.user.userId)
// //     if (!user) {
// //       console.log('User not found')
// //       return res.status(404).json({ message: 'User not found' })
// //     }

// //     console.log('User biometric status:', {
// //       faceRegistered: user.faceRegistered,
// //       fingerprintRegistered: user.fingerprintRegistered
// //     })
    
// //     res.json({
// //       faceRegistered: user.faceRegistered || false,
// //       fingerprintRegistered: user.fingerprintRegistered || false
// //     })
// //   } catch (err) {
// //     console.error('Status error:', err)
// //     res.status(500).json({ message: 'Server error' })
// //   }
// // })

// // // POST /api/biometric/register-face
// // router.post('/register-face', auth, async (req, res) => {
// //   try {
// //     console.log('POST /register-face - User ID:', req.user.userId)
    
// //     const { faceData } = req.body
    
// //     if (!faceData || faceData.trim() === '') {
// //       console.log('ERROR: faceData is empty or missing')
// //       return res.status(400).json({ 
// //         success: false,
// //         message: 'Face data is required' 
// //       })
// //     }

// //     console.log('Face data received, length:', faceData.length)
    
// //     // ✅ DON'T TRUNCATE - Gemini needs full image
// //     const user = await User.findById(req.user.userId)
// //     if (!user) {
// //       console.log('ERROR: User not found')
// //       return res.status(404).json({ 
// //         success: false,
// //         message: 'User not found' 
// //       })
// //     }

// //     // ✅ Store FULL face data for Gemini
// //     user.faceData = faceData
// //     user.faceRegistered = true
    
// //     await user.save()
    
// //     console.log('✅ Face registered for user:', user.email, 'Length:', faceData.length)
    
// //     res.json({ 
// //       success: true, 
// //       message: 'Face registered successfully'
// //     })
// //   } catch (err) {
// //     console.error('Register face error:', err.message)
// //     res.status(500).json({ 
// //       success: false,
// //       message: 'Server error: ' + err.message 
// //     })
// //   }
// // })

// // // POST /api/biometric/register-fingerprint
// // router.post('/register-fingerprint', auth, async (req, res) => {
// //   try {
// //     console.log('POST /register-fingerprint')
    
// //     const { fingerprintData } = req.body
    
// //     if (!fingerprintData || fingerprintData.trim() === '') {
// //       return res.status(400).json({ 
// //         success: false,
// //         message: 'Fingerprint data is required' 
// //       })
// //     }

// //     const user = await User.findById(req.user.userId)
// //     if (!user) return res.status(404).json({ 
// //       success: false,
// //       message: 'User not found' 
// //     })

// //     user.fingerprintData = fingerprintData
// //     user.fingerprintRegistered = true
// //     await user.save()

// //     res.json({ 
// //       success: true, 
// //       message: 'Fingerprint registered successfully' 
// //     })
// //   } catch (err) {
// //     console.error('Register fingerprint error:', err)
// //     res.status(500).json({ 
// //       success: false,
// //       message: 'Server error' 
// //     })
// //   }
// // })

// // // POST /api/biometric/verify-face - UPDATED WITH GEMINI
// // router.post('/verify-face', auth, async (req, res) => {
// //   try {
// //     console.log('POST /verify-face - User ID:', req.user.userId)
    
// //     const { faceData } = req.body
    
// //     if (!faceData || faceData.trim() === '') {
// //       return res.status(400).json({ 
// //         success: false,
// //         message: 'Face data is required for verification' 
// //       })
// //     }

// //     const user = await User.findById(req.user.userId)
// //     if (!user) {
// //       return res.status(404).json({ 
// //         success: false,
// //         message: 'User not found' 
// //       })
// //     }

// //     // Check if face is registered
// //     if (!user.faceRegistered || !user.faceData) {
// //       return res.status(400).json({ 
// //         success: false,
// //         message: 'Face not registered. Please register face first.' 
// //       })
// //     }

// //     console.log('🔍 Calling Gemini for face verification...')
    
// //     // ✅ USE GEMINI FOR FACE COMPARISON
// //     const isMatch = await compareFaces(faceData, user.faceData)
    
// //     console.log('✅ Gemini verification result:', isMatch)
    
// //     if (isMatch) {
// //       res.json({ 
// //         success: true, 
// //         message: 'Face verified successfully',
// //         verified: true
// //       })
// //     } else {
// //       res.json({ 
// //         success: false, 
// //         message: 'Face verification failed',
// //         verified: false
// //       })
// //     }
// //   } catch (err) {
// //     console.error('Verify face error:', err)
// //     res.status(500).json({ 
// //       success: false,
// //       message: 'Server error: ' + err.message 
// //     })
// //   }
// // })

// // export default router



// // routes/biometricRoutes.js - COMPLETE WITH GEMINI + WEBAUTHN
// import express from 'express'
// import User from '../models/User.js'
// import auth from '../middleware/auth.js'
// // ⬆ at the top with other imports
// import { isoUint8Array } from '@simplewebauthn/server/helpers'


// import { compareFaces } from '../services/geminiService.js'
// import { 
//   generateAuthenticationOptions, 
//   verifyAuthenticationResponse,
//   generateRegistrationOptions,
//   verifyRegistrationResponse
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
//       webAuthnDevices: user.biometricDevices?.length || 0
//     })
    
//     res.json({
//       faceRegistered: user.faceRegistered || false,
//       fingerprintRegistered: user.fingerprintRegistered || false,
//       webAuthnRegistered: (user.biometricDevices?.length || 0) > 0,
//       deviceCount: user.biometricDevices?.length || 0
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
//         message: 'Face data is required' 
//       })
//     }

//     console.log('Face data received, length:', faceData.length)
    
//     const user = await User.findById(req.user.userId)
//     if (!user) {
//       console.log('ERROR: User not found')
//       return res.status(404).json({ 
//         success: false,
//         message: 'User not found' 
//       })
//     }

//     // Store FULL face data for Gemini
//     user.faceData = faceData
//     user.faceRegistered = true
    
//     await user.save()
    
//     console.log('✅ Face registered for user:', user.email, 'Length:', faceData.length)
    
//     res.json({ 
//       success: true, 
//       message: 'Face registered successfully'
//     })
//   } catch (err) {
//     console.error('Register face error:', err.message)
//     res.status(500).json({ 
//       success: false,
//       message: 'Server error: ' + err.message 
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
//         message: 'Face data is required for verification' 
//       })
//     }

//     const user = await User.findById(req.user.userId)
//     if (!user) {
//       return res.status(404).json({ 
//         success: false,
//         message: 'User not found' 
//       })
//     }

//     if (!user.faceRegistered || !user.faceData) {
//       return res.status(400).json({ 
//         success: false,
//         message: 'Face not registered. Please register face first.' 
//       })
//     }

//     console.log('🔍 Calling Gemini for face verification...')
    
//     const isMatch = await compareFaces(faceData, user.faceData)
    
//     console.log('✅ Gemini verification result:', isMatch)
    
//     if (isMatch) {
//       res.json({ 
//         success: true, 
//         message: 'Face verified successfully',
//         verified: true
//       })
//     } else {
//       res.json({ 
//         success: false, 
//         message: 'Face verification failed',
//         verified: false
//       })
//     }
//   } catch (err) {
//     console.error('Verify face error:', err)
//     res.status(500).json({ 
//       success: false,
//       message: 'Server error: ' + err.message 
//     })
//   }
// })

// // ✅ NEW: GET fingerprint registration options (WebAuthn)
// router.get('/fingerprint-register-options', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId)
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' })
//     }

//     const rpName = 'SecureATM'
//     const rpID = process.env.RP_ID || 'localhost'

//     // 🔥 FIX: userID must be Uint8Array, not string
//     const userID = isoUint8Array.fromUTF8String(user._id.toString())

//     const options = await generateRegistrationOptions({
//       rpName,
//       rpID,
//       userID,                 // now correct type
//       userName: user.email,
//       timeout: 60000,
//       attestationType: 'none',
//       authenticatorSelection: {
//         authenticatorAttachment: 'platform',
//         userVerification: 'required',
//         residentKey: 'preferred'
//       },
//       excludeCredentials: user.biometricDevices?.map(dev => ({
//         id: dev.credentialID,
//         type: 'public-key',
//         transports: dev.transports
//       })) || [],
//       supportedAlgorithmIDs: [-7, -257],
//     })

//     req.session.currentChallenge = options.challenge

//     console.log('✅ Registration options generated for:', user.email)
//     res.json(options)
//   } catch (error) {
//     console.error('Error generating registration options:', error)
//     res.status(500).json({ message: 'Failed to generate registration options' })
//   }
// })

// // ✅ NEW: POST verify fingerprint registration (WebAuthn)
// router.post('/fingerprint-register-verify', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId)
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' })
//     }

//     const { registrationResult, deviceName } = req.body
//     const expectedChallenge = req.session.currentChallenge

//     if (!expectedChallenge) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'No challenge found. Please try again.' 
//       })
//     }

//     const rpID = process.env.RP_ID || 'localhost'
//     const expectedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173'

//     const verification = await verifyRegistrationResponse({
//       response: registrationResult,
//       expectedChallenge,
//       expectedOrigin,
//       expectedRPID: rpID,
//       requireUserVerification: true
//     })

//     if (verification.verified && verification.registrationInfo) {
//       const { credentialPublicKey, credentialID, counter } = verification.registrationInfo

//       // Add new device to user's biometric devices
//       if (!user.biometricDevices) {
//         user.biometricDevices = []
//       }

//       user.biometricDevices.push({
//         credentialID: Buffer.from(credentialID),
//         credentialPublicKey: Buffer.from(credentialPublicKey),
//         counter,
//         transports: registrationResult.response.transports || [],
//         deviceName: deviceName || 'Biometric Device',
//         registeredAt: new Date()
//       })

//       user.fingerprintRegistered = true
//       await user.save()

//       // Clear challenge
//       delete req.session.currentChallenge

//       console.log('✅ Biometric device registered for:', user.email)
//       res.json({ 
//         success: true, 
//         message: 'Biometric device registered successfully' 
//       })
//     } else {
//       res.status(400).json({ 
//         success: false, 
//         message: 'Registration verification failed' 
//       })
//     }
//   } catch (error) {
//     console.error('Registration verification error:', error)
//     res.status(500).json({ 
//       success: false, 
//       message: 'Registration failed: ' + error.message 
//     })
//   }
// })

// // ✅ NEW: GET fingerprint authentication options (WebAuthn)
// router.get('/fingerprint-options', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId)
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' })
//     }

//     if (!user.biometricDevices || user.biometricDevices.length === 0) {
//       return res.status(400).json({ 
//         message: 'No biometric device registered. Please register in Settings first.' 
//       })
//     }

//     const rpID = process.env.RP_ID || 'localhost'

//     const options = await generateAuthenticationOptions({
//       timeout: 60000,
//       allowCredentials: user.biometricDevices.map(dev => ({
//         id: dev.credentialID,
//         type: 'public-key',
//         transports: dev.transports || []
//       })),
//       userVerification: 'required',
//       rpID
//     })

//     // Store challenge in session
//     req.session.currentChallenge = options.challenge
    
//     console.log('✅ Authentication options generated for:', user.email)
//     res.json(options)
//   } catch (error) {
//     console.error('Error generating authentication options:', error)
//     res.status(500).json({ message: 'Failed to generate authentication options' })
//   }
// })

// // ✅ NEW: POST verify fingerprint authentication (WebAuthn)
// router.post('/verify-fingerprint', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId)
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' })
//     }

//     const { authResult } = req.body
//     const expectedChallenge = req.session.currentChallenge

//     if (!expectedChallenge) {
//       return res.status(400).json({ 
//         verified: false,
//         message: 'No challenge found. Please try again.' 
//       })
//     }

//     // Find the authenticator device
//     const authenticator = user.biometricDevices?.find(dev => 
//       dev.credentialID.toString('base64url') === authResult.id
//     )

//     if (!authenticator) {
//       return res.status(400).json({ 
//         verified: false, 
//         message: 'Device not registered' 
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
//         counter: authenticator.counter
//       },
//       requireUserVerification: true
//     })

//     // Update counter if verification succeeded
//     if (verification.verified) {
//       authenticator.counter = verification.authenticationInfo.newCounter
//       await user.save()
//     }

//     // Clear the challenge
//     delete req.session.currentChallenge

//     console.log('✅ Fingerprint verification result:', verification.verified, 'for:', user.email)

//     res.json({ 
//       verified: verification.verified,
//       message: verification.verified ? 'Fingerprint verified successfully' : 'Verification failed'
//     })
//   } catch (error) {
//     console.error('Fingerprint verification error:', error)
//     res.status(500).json({ 
//       verified: false, 
//       message: 'Verification failed: ' + error.message 
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
//         message: 'Fingerprint data is required' 
//       })
//     }

//     const user = await User.findById(req.user.userId)
//     if (!user) {
//       return res.status(404).json({ 
//         success: false,
//         message: 'User not found' 
//       })
//     }

//     user.fingerprintData = fingerprintData
//     user.fingerprintRegistered = true
//     await user.save()

//     res.json({ 
//       success: true, 
//       message: 'Fingerprint registered successfully' 
//     })
//   } catch (err) {
//     console.error('Register fingerprint error:', err)
//     res.status(500).json({ 
//       success: false,
//       message: 'Server error' 
//     })
//   }
// })

// export default router









// routes/biometricRoutes.js - COMPLETE WITH GEMINI + WEBAUTHN
import express from 'express'
import User from '../models/User.js'
import auth from '../middleware/auth.js'
import { isoUint8Array, isoBase64URL } from '@simplewebauthn/server/helpers'

import { compareFaces } from '../services/geminiService.js'
import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from '@simplewebauthn/server'

const router = express.Router()

// GET /api/biometric/status
router.get('/status', auth, async (req, res) => {
  try {
    console.log('GET /status - User ID:', req.user.userId)

    const user = await User.findById(req.user.userId)
    if (!user) {
      console.log('User not found')
      return res.status(404).json({ message: 'User not found' })
    }

    console.log('User biometric status:', {
      faceRegistered: user.faceRegistered,
      fingerprintRegistered: user.fingerprintRegistered,
      webAuthnDevices: user.biometricDevices?.length || 0,
    })

    res.json({
      faceRegistered: user.faceRegistered || false,
      fingerprintRegistered: user.fingerprintRegistered || false,
      webAuthnRegistered: (user.biometricDevices?.length || 0) > 0,
      deviceCount: user.biometricDevices?.length || 0,
    })
  } catch (err) {
    console.error('Status error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/biometric/register-face (GEMINI)
router.post('/register-face', auth, async (req, res) => {
  try {
    console.log('POST /register-face - User ID:', req.user.userId)

    const { faceData } = req.body

    if (!faceData || faceData.trim() === '') {
      console.log('ERROR: faceData is empty or missing')
      return res.status(400).json({
        success: false,
        message: 'Face data is required',
      })
    }

    console.log('Face data received, length:', faceData.length)

    const user = await User.findById(req.user.userId)
    if (!user) {
      console.log('ERROR: User not found')
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    // Store FULL face data for Gemini
    user.faceData = faceData
    user.faceRegistered = true

    await user.save()

    console.log('✅ Face registered for user:', user.email, 'Length:', faceData.length)

    res.json({
      success: true,
      message: 'Face registered successfully',
    })
  } catch (err) {
    console.error('Register face error:', err.message)
    res.status(500).json({
      success: false,
      message: 'Server error: ' + err.message,
    })
  }
})

// POST /api/biometric/verify-face (GEMINI)
router.post('/verify-face', auth, async (req, res) => {
  try {
    console.log('POST /verify-face - User ID:', req.user.userId)

    const { faceData } = req.body

    if (!faceData || faceData.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Face data is required for verification',
      })
    }

    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    if (!user.faceRegistered || !user.faceData) {
      return res.status(400).json({
        success: false,
        message: 'Face not registered. Please register face first.',
      })
    }

    console.log('🔍 Calling Gemini for face verification...')

    const isMatch = await compareFaces(faceData, user.faceData)

    console.log('✅ Gemini verification result:', isMatch)

    if (isMatch) {
      res.json({
        success: true,
        message: 'Face verified successfully',
        verified: true,
      })
    } else {
      res.json({
        success: false,
        message: 'Face verification failed',
        verified: false,
      })
    }
  } catch (err) {
    console.error('Verify face error:', err)
    res.status(500).json({
      success: false,
      message: 'Server error: ' + err.message,
    })
  }
})

// ✅ GET fingerprint registration options (WebAuthn)
router.get('/fingerprint-register-options', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const rpName = 'SecureATM'
    const rpID = process.env.RP_ID || 'localhost'

    // userID must be Uint8Array, not string
    const userID = isoUint8Array.fromUTF8String(user._id.toString())

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID,
      userName: user.email,
      timeout: 60000,
      attestationType: 'none',
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
        residentKey: 'preferred',
      },
      excludeCredentials:
        user.biometricDevices?.map((dev) => ({
          id: dev.credentialID,
          type: 'public-key',
          transports: dev.transports,
        })) || [],
      supportedAlgorithmIDs: [-7, -257],
    })

    // Save challenge on user instead of session
    user.webauthnChallenge = options.challenge
    await user.save()

    console.log('✅ Registration options generated for:', user.email)
    res.json(options)
  } catch (error) {
    console.error('Error generating registration options:', error)
    res.status(500).json({ message: 'Failed to generate registration options' })
  }
})

// ✅ POST verify fingerprint registration (WebAuthn)
router.post('/fingerprint-register-verify', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const { registrationResult, deviceName } = req.body
    const expectedChallenge = user.webauthnChallenge

    if (!expectedChallenge) {
      return res.status(400).json({
        success: false,
        message: 'No challenge found. Please try again.',
      })
    }

    const rpID = process.env.RP_ID || 'localhost'
    const expectedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173'

    const verification = await verifyRegistrationResponse({
      response: registrationResult,
      expectedChallenge,
      expectedOrigin,
      expectedRPID: rpID,
      requireUserVerification: true,
    })

    if (verification.verified && verification.registrationInfo) {
      const { registrationInfo } = verification
      const { credential } = registrationInfo
      const { id, publicKey, counter } = credential

      // Ensure biometricDevices array exists
      if (!user.biometricDevices) {
        user.biometricDevices = []
      }

      user.biometricDevices.push({
        // id & publicKey are usually Buffers; Buffer.from is safe either way
        credentialID: Buffer.isBuffer(id) ? id : Buffer.from(id),
        credentialPublicKey: Buffer.isBuffer(publicKey)
          ? publicKey
          : Buffer.from(publicKey),
        counter,
        transports:
          registrationResult?.response?.transports ||
          registrationResult?.response?.response?.transports ||
          [],
        deviceName: deviceName || 'Biometric Device',
        registeredAt: new Date(),
      })

      user.fingerprintRegistered = true
      user.webauthnChallenge = null
      await user.save()

      console.log('✅ Biometric device registered for:', user.email)
      return res.json({
        success: true,
        message: 'Biometric device registered successfully',
      })
    } else {
      // Clear challenge on failure too
      user.webauthnChallenge = null
      await user.save()

      return res.status(400).json({
        success: false,
        message: 'Registration verification failed',
      })
    }
  } catch (error) {
    console.error('Registration verification error:', error)

    // Try to clear challenge on error as well
    try {
      const user = await User.findById(req.user.userId)
      if (user) {
        user.webauthnChallenge = null
        await user.save()
      }
    } catch (e) {
      console.error('Error clearing challenge after registration error:', e)
    }

    return res.status(500).json({
      success: false,
      message: 'Registration failed: ' + error.message,
    })
  }
})
// ✅ GET fingerprint authentication options (WebAuthn)
router.get('/fingerprint-options', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (!user.biometricDevices || user.biometricDevices.length === 0) {
      return res.status(400).json({
        message: 'No biometric device registered. Please register in Settings first.',
      })
    }

    const rpID = process.env.RP_ID || 'localhost'

    const options = await generateAuthenticationOptions({
      timeout: 60000,
      allowCredentials: user.biometricDevices.map((dev) => ({
        // ✅ convert Buffer → base64url string
        id: isoBase64URL.fromBuffer(dev.credentialID),
        type: 'public-key',
        transports: dev.transports || [],
      })),
      userVerification: 'required',
      rpID,
    })

    user.webauthnChallenge = options.challenge
    await user.save()

    console.log('✅ Authentication options generated for:', user.email)
    res.json(options)
  } catch (error) {
    console.error('Error generating authentication options:', error)
    res.status(500).json({ message: 'Failed to generate authentication options' })
  }
})


// ✅ POST verify fingerprint authentication (WebAuthn)
router.post('/verify-fingerprint', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const { authResult } = req.body
    const expectedChallenge = user.webauthnChallenge

    if (!expectedChallenge) {
      return res.status(400).json({
        verified: false,
        message: 'No challenge found. Please try again.',
      })
    }

    // Find the authenticator device by comparing stored credentialID with authResult.rawId
    const authenticator = user.biometricDevices?.find(
      (dev) => isoBase64URL.fromBuffer(dev.credentialID) === authResult.rawId
    )

    if (!authenticator) {
      user.webauthnChallenge = null
      await user.save()
      return res.status(400).json({
        verified: false,
        message: 'Device not registered',
      })
    }

    const rpID = process.env.RP_ID || 'localhost'
    const expectedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173'

    // Verify the authentication response
    const verification = await verifyAuthenticationResponse({
      response: authResult,
      expectedChallenge,
      expectedOrigin,
      expectedRPID: rpID,
      authenticator: {
        credentialID: authenticator.credentialID,
        credentialPublicKey: authenticator.credentialPublicKey,
        counter: authenticator.counter,
      },
      requireUserVerification: true,
    })

    if (verification.verified) {
      authenticator.counter = verification.authenticationInfo.newCounter
      user.webauthnChallenge = null
      await user.save()
    } else {
      user.webauthnChallenge = null
      await user.save()
    }

    console.log(
      '✅ Fingerprint verification result:',
      verification.verified,
      'for:',
      user.email
    )

    res.json({
      verified: verification.verified,
      message: verification.verified
        ? 'Fingerprint verified successfully'
        : 'Verification failed',
    })
  } catch (error) {
    console.error('Fingerprint verification error:', error)

    try {
      const user = await User.findById(req.user.userId)
      if (user) {
        user.webauthnChallenge = null
        await user.save()
      }
    } catch (e) {
      console.error('Error clearing challenge after auth error:', e)
    }

    res.status(500).json({
      verified: false,
      message: 'Verification failed: ' + error.message,
    })
  }
})

// OLD: Legacy dummy fingerprint (keep for backward compatibility)
router.post('/register-fingerprint', auth, async (req, res) => {
  try {
    console.log('POST /register-fingerprint (legacy)')

    const { fingerprintData } = req.body

    if (!fingerprintData || fingerprintData.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Fingerprint data is required',
      })
    }

    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    user.fingerprintData = fingerprintData
    user.fingerprintRegistered = true
    await user.save()

    res.json({
      success: true,
      message: 'Fingerprint registered successfully',
    })
  } catch (err) {
    console.error('Register fingerprint error:', err)
    res.status(500).json({
      success: false,
      message: 'Server error',
    })
  }
})

export default router






