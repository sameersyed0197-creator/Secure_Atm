// // // // routes/biometricRoutes.js - COMPLETE WORKING CODE
// // // import express from 'express'
// // // import User from '../models/User.js'
// // // import auth from '../middleware/auth.js'

// // // const router = express.Router()

// // // // GET /api/biometric/status
// // // router.get('/status', auth, async (req, res) => {
// // //   try {
// // //     const user = await User.findById(req.user.userId)
// // //     if (!user) return res.status(404).json({ message: 'User not found' })

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
// // //     console.log('Register face request body:', req.body) // ADD THIS FOR DEBUGGING
    
// // //     const { faceData } = req.body
// // //     const userId = req.user.userId

// // //     if (!faceData || faceData.trim() === '') {
// // //       console.log('Missing faceData')
// // //       return res.status(400).json({ message: 'Face data is required' })
// // //     }

// // //     const user = await User.findById(userId)
// // //     if (!user) {
// // //       console.log('User not found:', userId)
// // //       return res.status(404).json({ message: 'User not found' })
// // //     }

// // //     // Save face data
// // //     user.faceData = faceData
// // //     user.faceRegistered = true
// // //     await user.save()

// // //     console.log('Face registered for user:', userId)
    
// // //     res.json({ 
// // //       success: true, 
// // //       message: 'Face registered successfully' 
// // //     })
// // //   } catch (err) {
// // //     console.error('Register face error:', err)
// // //     res.status(500).json({ message: 'Server error: ' + err.message })
// // //   }
// // // })

// // // // POST /api/biometric/register-fingerprint
// // // router.post('/register-fingerprint', auth, async (req, res) => {
// // //   try {
// // //     console.log('Register fingerprint request body:', req.body)
    
// // //     const { fingerprintData } = req.body
// // //     const userId = req.user.userId

// // //     if (!fingerprintData || fingerprintData.trim() === '') {
// // //       return res.status(400).json({ message: 'Fingerprint data is required' })
// // //     }

// // //     const user = await User.findById(userId)
// // //     if (!user) return res.status(404).json({ message: 'User not found' })

// // //     user.fingerprintData = fingerprintData
// // //     user.fingerprintRegistered = true
// // //     await user.save()

// // //     res.json({ 
// // //       success: true, 
// // //       message: 'Fingerprint registered successfully' 
// // //     })
// // //   } catch (err) {
// // //     console.error('Register fingerprint error:', err)
// // //     res.status(500).json({ message: 'Server error' })
// // //   }
// // // })

// // // export default router




// // // routes/biometricRoutes.js - ADD THIS ROUTE
// // import express from 'express'
// // import User from '../models/User.js'
// // import auth from '../middleware/auth.js'

// // const router = express.Router()

// // // ... your existing routes ...

// // // ADD THIS NEW ENDPOINT FOR FACE VERIFICATION
// // router.post('/verify-face', auth, async (req, res) => {
// //   try {
// //     console.log('POST /verify-face - User ID:', req.user.userId);
    
// //     const { faceData } = req.body;
    
// //     if (!faceData || faceData.trim() === '') {
// //       return res.status(400).json({ 
// //         success: false,
// //         message: 'Face data is required for verification' 
// //       });
// //     }

// //     const user = await User.findById(req.user.userId);
// //     if (!user) {
// //       return res.status(404).json({ 
// //         success: false,
// //         message: 'User not found' 
// //       });
// //     }

// //     // SIMPLE STRING COMPARISON
// //     // This is for demo - in real app use facial recognition
// //     const isMatch = user.faceData && user.faceData === faceData;
    
// //     console.log('Face verification result:', {
// //       match: isMatch,
// //       storedLength: user.faceData ? user.faceData.length : 0,
// //       incomingLength: faceData.length
// //     });
    
// //     if (isMatch) {
// //       res.json({ 
// //         success: true, 
// //         message: 'Face verified successfully',
// //         verified: true
// //       });
// //     } else {
// //       res.json({ 
// //         success: false, 
// //         message: 'Face verification failed',
// //         verified: false
// //       });
// //     }
// //   } catch (err) {
// //     console.error('Verify face error:', err);
// //     res.status(500).json({ 
// //       success: false,
// //       message: 'Server error: ' + err.message 
// //     });
// //   }
// // });

// // export default router;



// // routes/biometricRoutes.js - COMPLETE FILE
// import express from 'express'
// import User from '../models/User.js'
// import auth from '../middleware/auth.js'

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
//       fingerprintRegistered: user.fingerprintRegistered
//     })
    
//     res.json({
//       faceRegistered: user.faceRegistered || false,
//       fingerprintRegistered: user.fingerprintRegistered || false
//     })
//   } catch (err) {
//     console.error('Status error:', err)
//     res.status(500).json({ message: 'Server error' })
//   }
// })

// // POST /api/biometric/register-face
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
    
//     // Truncate if too long for demo
//     const maxLength = 50000
//     let faceDataToStore = faceData
    
//     if (faceData.length > maxLength) {
//       console.log(`Face data too long (${faceData.length} > ${maxLength}), truncating...`)
//       faceDataToStore = faceData.substring(0, maxLength)
//     }

//     const user = await User.findById(req.user.userId)
//     if (!user) {
//       console.log('ERROR: User not found')
//       return res.status(404).json({ 
//         success: false,
//         message: 'User not found' 
//       })
//     }

//     // Store face data
//     user.faceData = faceDataToStore
//     user.faceRegistered = true
    
//     await user.save()
    
//     console.log('SUCCESS: Face registered for user:', user.email, 'Length stored:', faceDataToStore.length)
    
//     res.json({ 
//       success: true, 
//       message: 'Face registered successfully',
//       dataLength: faceDataToStore.length
//     })
//   } catch (err) {
//     console.error('Register face error:', err.message)
//     res.status(500).json({ 
//       success: false,
//       message: 'Server error: ' + err.message 
//     })
//   }
// })

// // POST /api/biometric/register-fingerprint
// router.post('/register-fingerprint', auth, async (req, res) => {
//   try {
//     console.log('POST /register-fingerprint')
    
//     const { fingerprintData } = req.body
    
//     if (!fingerprintData || fingerprintData.trim() === '') {
//       return res.status(400).json({ 
//         success: false,
//         message: 'Fingerprint data is required' 
//       })
//     }

//     const user = await User.findById(req.user.userId)
//     if (!user) return res.status(404).json({ 
//       success: false,
//       message: 'User not found' 
//     })

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

// // POST /api/biometric/verify-face
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

//     // Check if face is registered
//     if (!user.faceRegistered || !user.faceData) {
//       return res.status(400).json({ 
//         success: false,
//         message: 'Face not registered. Please register face first.' 
//       })
//     }

//     // SIMPLE STRING COMPARISON
//     const isMatch = user.faceData === faceData
    
//     console.log('Face verification check:', {
//       match: isMatch,
//       storedLength: user.faceData.length,
//       incomingLength: faceData.length,
//       storedFirst50: user.faceData.substring(0, 50),
//       incomingFirst50: faceData.substring(0, 50)
//     })
    
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

// export default router










// routes/biometricRoutes.js - UPDATED FOR GEMINI
import express from 'express'
import User from '../models/User.js'
import auth from '../middleware/auth.js'
import { compareFaces } from '../services/geminiService.js' // ✅ ADD THIS IMPORT

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
      fingerprintRegistered: user.fingerprintRegistered
    })
    
    res.json({
      faceRegistered: user.faceRegistered || false,
      fingerprintRegistered: user.fingerprintRegistered || false
    })
  } catch (err) {
    console.error('Status error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/biometric/register-face
router.post('/register-face', auth, async (req, res) => {
  try {
    console.log('POST /register-face - User ID:', req.user.userId)
    
    const { faceData } = req.body
    
    if (!faceData || faceData.trim() === '') {
      console.log('ERROR: faceData is empty or missing')
      return res.status(400).json({ 
        success: false,
        message: 'Face data is required' 
      })
    }

    console.log('Face data received, length:', faceData.length)
    
    // ✅ DON'T TRUNCATE - Gemini needs full image
    const user = await User.findById(req.user.userId)
    if (!user) {
      console.log('ERROR: User not found')
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      })
    }

    // ✅ Store FULL face data for Gemini
    user.faceData = faceData
    user.faceRegistered = true
    
    await user.save()
    
    console.log('✅ Face registered for user:', user.email, 'Length:', faceData.length)
    
    res.json({ 
      success: true, 
      message: 'Face registered successfully'
    })
  } catch (err) {
    console.error('Register face error:', err.message)
    res.status(500).json({ 
      success: false,
      message: 'Server error: ' + err.message 
    })
  }
})

// POST /api/biometric/register-fingerprint
router.post('/register-fingerprint', auth, async (req, res) => {
  try {
    console.log('POST /register-fingerprint')
    
    const { fingerprintData } = req.body
    
    if (!fingerprintData || fingerprintData.trim() === '') {
      return res.status(400).json({ 
        success: false,
        message: 'Fingerprint data is required' 
      })
    }

    const user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ 
      success: false,
      message: 'User not found' 
    })

    user.fingerprintData = fingerprintData
    user.fingerprintRegistered = true
    await user.save()

    res.json({ 
      success: true, 
      message: 'Fingerprint registered successfully' 
    })
  } catch (err) {
    console.error('Register fingerprint error:', err)
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    })
  }
})

// POST /api/biometric/verify-face - UPDATED WITH GEMINI
router.post('/verify-face', auth, async (req, res) => {
  try {
    console.log('POST /verify-face - User ID:', req.user.userId)
    
    const { faceData } = req.body
    
    if (!faceData || faceData.trim() === '') {
      return res.status(400).json({ 
        success: false,
        message: 'Face data is required for verification' 
      })
    }

    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      })
    }

    // Check if face is registered
    if (!user.faceRegistered || !user.faceData) {
      return res.status(400).json({ 
        success: false,
        message: 'Face not registered. Please register face first.' 
      })
    }

    console.log('🔍 Calling Gemini for face verification...')
    
    // ✅ USE GEMINI FOR FACE COMPARISON
    const isMatch = await compareFaces(faceData, user.faceData)
    
    console.log('✅ Gemini verification result:', isMatch)
    
    if (isMatch) {
      res.json({ 
        success: true, 
        message: 'Face verified successfully',
        verified: true
      })
    } else {
      res.json({ 
        success: false, 
        message: 'Face verification failed',
        verified: false
      })
    }
  } catch (err) {
    console.error('Verify face error:', err)
    res.status(500).json({ 
      success: false,
      message: 'Server error: ' + err.message 
    })
  }
})

export default router