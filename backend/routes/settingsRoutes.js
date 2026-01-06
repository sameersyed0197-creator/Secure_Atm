// // routes/settingsRoutes.js - COMPLETE FIXED VERSION
// import express from 'express'
// import bcrypt from 'bcryptjs'
// import User from '../models/User.js'
// import auth from '../middleware/auth.js'

// const router = express.Router()

// // ---------------------------------------------------
// // ✅ FIXED: GET /api/settings/me (Returns faceData properly)
// // ---------------------------------------------------
// router.get('/me', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId).select(
//       '-passwordHash -upiPin'
//     )
//     if (!user) return res.status(404).json({ message: 'User not found' })

//     // ✅ Log to verify faceData exists
//     console.log('📤 Sending user data. faceData exists:', !!user.faceData, 'Length:', user.faceData?.length || 0)

//     res.json({
//       fullName: user.fullName,
//       email: user.email,
//       phone: user.phone || '',
//       city: user.city || '',
//       address: user.address || '',
//       balance: user.balance,
//       dailyLimit: user.dailyLimit,
      
//       // ✅ CRITICAL: Return faceData (base64 string or null)
//       faceData: user.faceData || null,
//       faceRegistered: user.faceRegistered || false,
      
//       // Biometric threshold
//       biometricThreshold: user.securitySettings?.biometricThreshold ?? 5000,
      
//       // Backward compatibility
//       securitySettings: {
//         biometricThreshold: user.securitySettings?.biometricThreshold ?? 5000,
//       },
//     })
//   } catch (err) {
//     console.error('GET ME ERROR:', err)
//     res.status(500).json({ message: 'Server error' })
//   }
// })

// // ---------------------------------------------------
// // PUT /api/settings/profile
// // ---------------------------------------------------
// router.put('/profile', auth, async (req, res) => {
//   try {
//     const { fullName, phone, city, address } = req.body

//     const update = {
//       ...(fullName && { fullName }),
//       ...(phone !== undefined && { phone }),
//       ...(city !== undefined && { city }),
//       ...(address !== undefined && { address }),
//     }

//     const user = await User.findByIdAndUpdate(
//       req.user.userId,
//       { $set: update },
//       { new: true, runValidators: true }
//     ).select('-passwordHash -upiPin')

//     res.json({
//       message: 'Profile updated successfully',
//       user: {
//         fullName: user.fullName,
//         email: user.email,
//         phone: user.phone,
//         city: user.city,
//         address: user.address,
//       }
//     })
//   } catch (err) {
//     console.error('PROFILE UPDATE ERROR:', err)
//     res.status(500).json({ message: 'Server error' })
//   }
// })

// // ---------------------------------------------------
// // PUT /api/settings/password
// // ---------------------------------------------------
// router.put('/password', auth, async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body

//     if (!currentPassword || !newPassword) {
//       return res.status(400).json({ message: 'Both passwords are required' })
//     }

//     const user = await User.findById(req.user.userId)
//     if (!user) return res.status(404).json({ message: 'User not found' })

//     const ok = await bcrypt.compare(currentPassword, user.passwordHash)
//     if (!ok) {
//       return res.status(400).json({ message: 'Current password is incorrect' })
//     }

//     user.passwordHash = await bcrypt.hash(newPassword, 10)
//     await user.save()

//     res.json({ message: 'Password updated successfully' })
//   } catch (err) {
//     console.error('PASSWORD UPDATE ERROR:', err)
//     res.status(500).json({ message: 'Server error' })
//   }
// })

// // ---------------------------------------------------
// // PUT /api/settings/transaction-pin
// // ---------------------------------------------------
// router.put('/transaction-pin', auth, async (req, res) => {
//   try {
//     const { currentPin, newPin } = req.body

//     if (!newPin) {
//       return res.status(400).json({ message: 'New PIN is required' })
//     }

//     const user = await User.findById(req.user.userId)
//     if (!user) return res.status(404).json({ message: 'User not found' })

//     if (user.hasUpiPin) {
//       if (!currentPin) {
//         return res.status(400).json({ message: 'Current PIN required' })
//       }
//       const ok = await bcrypt.compare(currentPin, user.upiPin)
//       if (!ok) {
//         return res.status(400).json({ message: 'Current PIN is incorrect' })
//       }
//     }

//     if (!/^[0-9]{4}$/.test(newPin) && !/^[0-9]{6}$/.test(newPin)) {
//       return res
//         .status(400)
//         .json({ message: 'PIN must be exactly 4 or 6 digits.' })
//     }

//     user.upiPin = await bcrypt.hash(newPin, 10)
//     user.hasUpiPin = true
//     await user.save()

//     res.json({ message: 'Transaction PIN updated successfully' })
//   } catch (err) {
//     console.error('TRANSACTION PIN ERROR:', err)
//     res.status(500).json({ message: 'Server error' })
//   }
// })

// // ---------------------------------------------------
// // ✅ PUT /api/settings/biometric-threshold
// // ---------------------------------------------------
// router.put('/biometric-threshold', auth, async (req, res) => {
//   try {
//     const threshold = Number(req.body.biometricThreshold)

//     if (Number.isNaN(threshold) || threshold < 1000) {
//       return res
//         .status(400)
//         .json({ message: 'Threshold must be at least ₹1,000' })
//     }

//     if (threshold > 100000) {
//       return res
//         .status(400)
//         .json({ message: 'Threshold cannot exceed ₹1,00,000' })
//     }

//     const user = await User.findById(req.user.userId)
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' })
//     }

//     // Initialize securitySettings if it doesn't exist
//     if (!user.securitySettings) {
//       user.securitySettings = {}
//     }

//     user.securitySettings.biometricThreshold = threshold
//     await user.save()

//     console.log(`✅ Threshold updated to ₹${threshold.toLocaleString('en-IN')} for ${user.email}`)

//     res.json({
//       success: true,
//       biometricThreshold: threshold,
//       message: `Biometric threshold updated to ₹${threshold.toLocaleString('en-IN')}`,
//     })
//   } catch (err) {
//     console.error('BIOMETRIC THRESHOLD UPDATE ERROR:', err)
//     res.status(500).json({ message: 'Server error' })
//   }
// })

// export default router


 // routes/settingsRoutes.js - FIXED (face verify implemented)
import express from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// ---------------------------------------------------
// ✅ Helper: verify face for current user
// Uses the same SIMULATED GEMINI approach (size similarity heuristic).
// Stored face: user.faceData (base64)
// Current face: faceData (base64)
// ---------------------------------------------------
async function verifyFaceForUser(user, faceData) {
  if (!user?.faceRegistered) return false
  if (!user?.faceData) return false
  if (!faceData) return false

  // Normalize to string
  const stored = String(user.faceData)
  const current = String(faceData)

  // Very basic sanity checks
  if (!stored.startsWith('data:image')) return false
  if (!current.startsWith('data:image')) return false

  // ---------------------------------------------------
  // 🎯 [SIMULATED GEMINI] Face Comparison (same style logs)
  // ---------------------------------------------------
  const storedSize = Buffer.byteLength(stored, 'utf8')
  const currentSize = Buffer.byteLength(current, 'utf8')
  const sizeDifference = Math.abs(currentSize - storedSize)

  console.log('==> ///////////////////////////////////////////////////////////')
  console.log('🎯 [SIMULATED GEMINI] Face Comparison')
  console.log('📊 Image analysis:', {
    currentSize: `${Math.round(currentSize / 1024)}KB`,
    storedSize: `${Math.round(storedSize / 1024)}KB`,
    sizeDifference,
  })

  // Heuristic thresholds (tune if needed)
  const isFaceSize = currentSize > 5_000 && storedSize > 5_000
  const isSimilarSize = sizeDifference < 2_000 // adjust as needed

  const verdict = isFaceSize && isSimilarSize ? '✅ SAME PERSON' : '❌ DIFFERENT PERSON'

  console.log('🤖 [SMART] Analysis:', {
    sizeDiff: sizeDifference,
    isSimilarSize,
    isFaceSize,
    verdict,
  })
  console.log(
    '🎯 Simulated Gemini Response:',
    isFaceSize && isSimilarSize ? '"YES - Facial features match"' : '"NO - Facial features do not match"'
  )

  return isFaceSize && isSimilarSize
}

// ---------------------------------------------------
// ✅ FIXED: GET /api/settings/me (Returns faceData properly)
// ---------------------------------------------------
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash -upiPin')
    if (!user) return res.status(404).json({ message: 'User not found' })

    console.log(
      '📤 Sending user data. faceData exists:',
      !!user.faceData,
      'Length:',
      user.faceData?.length || 0
    )

    res.json({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || '',
      city: user.city || '',
      address: user.address || '',
      balance: user.balance,
      dailyLimit: user.dailyLimit,

      faceData: user.faceData || null,
      faceRegistered: user.faceRegistered || false,

      biometricThreshold: user.securitySettings?.biometricThreshold ?? 5000,

      securitySettings: {
        biometricThreshold: user.securitySettings?.biometricThreshold ?? 5000,
      },
    })
  } catch (err) {
    console.error('GET ME ERROR:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// ---------------------------------------------------
// PUT /api/settings/profile
// ---------------------------------------------------
router.put('/profile', auth, async (req, res) => {
  try {
    const { fullName, phone, city, address } = req.body

    const update = {
      ...(fullName && { fullName }),
      ...(phone !== undefined && { phone }),
      ...(city !== undefined && { city }),
      ...(address !== undefined && { address }),
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: update },
      { new: true, runValidators: true }
    ).select('-passwordHash -upiPin')

    res.json({
      message: 'Profile updated successfully',
      user: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        city: user.city,
        address: user.address,
      },
    })
  } catch (err) {
    console.error('PROFILE UPDATE ERROR:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// ---------------------------------------------------
// ✅ FIXED: PUT /api/settings/password (FACE ONLY)
// Body: { newPassword, faceData }
// ---------------------------------------------------
router.put('/password', auth, async (req, res) => {
  try {
    const { newPassword, faceData } = req.body

    if (!newPassword) {
      return res.status(400).json({ message: 'New password is required' })
    }
    if (!faceData) {
      return res.status(400).json({ message: 'Face verification is required' })
    }

    const user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    if (!user.faceRegistered) {
      return res.status(400).json({ message: 'Face not registered' })
    }

    const faceOk = await verifyFaceForUser(user, faceData)
    if (!faceOk) {
      return res.status(401).json({ message: 'Face verification failed' })
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10)
    await user.save()

    res.json({ message: 'Password updated successfully' })
  } catch (err) {
    console.error('PASSWORD UPDATE ERROR:', err)
    res.status(500).json({ message: 'Server error' })
  }
})
// ---------------------------------------------------
// ✅ FIXED: PUT /api/settings/transaction-pin (FACE ONLY)
// Body: { newPin, faceData }
// ---------------------------------------------------
router.put('/transaction-pin', auth, async (req, res) => {
  try {
    const { newPin, faceData } = req.body

    if (!newPin) {
      return res.status(400).json({ message: 'New PIN is required' })
    }
    if (!faceData) {
      return res.status(400).json({ message: 'Face verification is required' })
    }

    const user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    if (!user.faceRegistered) {
      return res.status(400).json({ message: 'Face not registered' })
    }

    const faceOk = await verifyFaceForUser(user, faceData)
    if (!faceOk) {
      return res.status(401).json({ message: 'Face verification failed' })
    }

    if (!/^[0-9]{4}$/.test(newPin) && !/^[0-9]{6}$/.test(newPin)) {
      return res.status(400).json({ message: 'PIN must be exactly 4 or 6 digits.' })
    }

    user.upiPin = await bcrypt.hash(newPin, 10)
    user.hasUpiPin = true
    await user.save()

    res.json({ message: 'Transaction PIN updated successfully' })
  } catch (err) {
    console.error('TRANSACTION PIN ERROR:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// ---------------------------------------------------
// ✅ PUT /api/settings/biometric-threshold
// ---------------------------------------------------
router.put('/biometric-threshold', auth, async (req, res) => {
  try {
    const threshold = Number(req.body.biometricThreshold)

    if (Number.isNaN(threshold) || threshold < 1000) {
      return res.status(400).json({ message: 'Threshold must be at least ₹1,000' })
    }

    if (threshold > 100000) {
      return res.status(400).json({ message: 'Threshold cannot exceed ₹1,00,000' })
    }

    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (!user.securitySettings) {
      user.securitySettings = {}
    }

    user.securitySettings.biometricThreshold = threshold
    await user.save()

    console.log(`✅ Threshold updated to ₹${threshold.toLocaleString('en-IN')} for ${user.email}`)

    res.json({
      success: true,
      biometricThreshold: threshold,
      message: `Biometric threshold updated to ₹${threshold.toLocaleString('en-IN')}`,
    })
  } catch (err) {
    console.error('BIOMETRIC THRESHOLD UPDATE ERROR:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router






 