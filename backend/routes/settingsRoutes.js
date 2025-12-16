import express from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// ---------------------------------------------------
// GET /api/settings/me  -> get current user
// ---------------------------------------------------
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      '-passwordHash -upiPin'
    )
    if (!user) return res.status(404).json({ message: 'User not found' })
    
    res.json({
      ...user.toObject(),
      biometricThreshold: user.securitySettings.biometricThreshold,
    })
  } catch (err) {
    console.error('GET ME ERROR:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// ---------------------------------------------------
// PUT /api/settings/profile  -> update personal info
// ---------------------------------------------------
router.put('/profile', auth, async (req, res) => {
  try {
    const { fullName, phone, city, address } = req.body

    const update = {
      ...(fullName && { fullName }),
      ...(phone && { phone }),
      ...(city && { city }),
      ...(address && { address }),
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: update },
      { new: true, runValidators: true }
    ).select('-passwordHash -upiPin')

    res.json(user)
  } catch (err) {
    console.error('PROFILE UPDATE ERROR:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// ---------------------------------------------------
// PUT /api/settings/password  -> change login password
// ---------------------------------------------------
router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    const user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const ok = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!ok) {
      return res.status(400).json({ message: 'Current password is incorrect' })
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
// PUT /api/settings/transaction-pin  -> update UPI PIN
// ---------------------------------------------------
router.put('/transaction-pin', auth, async (req, res) => {
  try {
    const { currentPin, newPin } = req.body

    const user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    if (user.hasUpiPin) {
      if (!currentPin) {
        return res.status(400).json({ message: 'Current PIN required' })
      }
      const ok = await bcrypt.compare(currentPin, user.upiPin)
      if (!ok) {
        return res.status(400).json({ message: 'Current PIN is incorrect' })
      }
    }

    if (!/^[0-9]{4}$/.test(newPin) && !/^[0-9]{6}$/.test(newPin)) {
      return res
        .status(400)
        .json({ message: 'PIN must be exactly 4 or 6 digits.' })
    }

    user.upiPin = await bcrypt.hash(newPin, 10)
    user.hasUpiPin = true
    await user.save()

    res.json({ message: 'Transaction PIN updated' })
  } catch (err) {
    console.error('TRANSACTION PIN ERROR:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// ---------------------------------------------------
// ✅ NEW: PUT /api/settings/biometric-threshold
//    Update biometric verification threshold
// ---------------------------------------------------
router.put('/biometric-threshold', auth, async (req, res) => {
  try {
    const { biometricThreshold } = req.body

    // Validation
    if (typeof biometricThreshold !== 'number' || biometricThreshold < 1000) {
      return res.status(400).json({ 
        message: 'Threshold must be at least ₹1000' 
      })
    }

    if (biometricThreshold > 100000) {
      return res.status(400).json({ 
        message: 'Threshold cannot exceed ₹1,00,000' 
      })
    }

    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Update only the threshold
    user.securitySettings.biometricThreshold = biometricThreshold
    await user.save()

    console.log(`✅ User ${user.email} updated biometric threshold to ₹${biometricThreshold}`)

    res.json({
      success: true,
      message: 'Biometric threshold updated successfully',
      biometricThreshold: user.securitySettings.biometricThreshold,
    })
  } catch (err) {
    console.error('BIOMETRIC THRESHOLD UPDATE ERROR:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// ---------------------------------------------------
// ✅ GET /api/settings/security  -> get security rules
// ---------------------------------------------------
router.get('/security', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('securitySettings')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user.securitySettings)
  } catch (err) {
    console.error('GET SECURITY SETTINGS ERROR:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// ---------------------------------------------------
// ✅ PUT /api/settings/security  -> update security rules
// ---------------------------------------------------
router.put('/security', auth, async (req, res) => {
  try {
    const { biometricThreshold, biometricMode } = req.body

    if (typeof biometricThreshold !== 'number' || biometricThreshold < 0) {
      return res
        .status(400)
        .json({ message: 'Invalid biometric threshold' })
    }

    if (!['fingerprint', 'face', 'both'].includes(biometricMode)) {
      return res.status(400).json({ message: 'Invalid biometric mode' })
    }

    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.securitySettings = {
      biometricThreshold,
      biometricMode,
    }

    await user.save()

    res.json({
      success: true,
      message: 'Security settings updated successfully',
      securitySettings: user.securitySettings,
    })
  } catch (err) {
    console.error('UPDATE SECURITY SETTINGS ERROR:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router

















// import express from 'express'
// import bcrypt from 'bcryptjs'
// import User from '../models/User.js'
// import auth from '../middleware/auth.js'

// const router = express.Router()

// // GET /api/settings/me  -> get current user
// router.get('/me', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId).select('-passwordHash -upiPin')
//     if (!user) return res.status(404).json({ message: 'User not found' })
//     res.json(user)
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' })
//   }
// })

// // PUT /api/settings/profile  -> update personal info
// router.put('/profile', auth, async (req, res) => {
//   try {
//     const { fullName, phone, city, address } = req.body

//     const update = {
//       ...(fullName && { fullName }),
//       ...(phone && { phone }),
//       ...(city && { city }),
//       ...(address && { address }),
//     }

//     const user = await User.findByIdAndUpdate(
//       req.user.userId,
//       { $set: update },
//       { new: true, runValidators: true }
//     ).select('-passwordHash -upiPin')

//     res.json(user)
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' })
//   }
// })

// // PUT /api/settings/password  -> change login password
// router.put('/password', auth, async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body
//     const user = await User.findById(req.user.userId)

//     if (!user) return res.status(404).json({ message: 'User not found' })

//     const ok = await bcrypt.compare(currentPassword, user.passwordHash)
//     if (!ok) return res.status(400).json({ message: 'Current password is incorrect' })

//     user.passwordHash = await bcrypt.hash(newPassword, 10)
//     await user.save()

//     res.json({ message: 'Password updated successfully' })
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' })
//   }
// })
// router.put('/transaction-pin', auth, async (req, res) => {
//   try {
//     const { currentPin, newPin } = req.body

//     const user = await User.findById(req.user.userId)
//     if (!user) return res.status(404).json({ message: 'User not found' })

//     // If user already has a PIN, currentPin is required and must match
//     if (user.hasUpiPin) {
//       if (!currentPin) {
//         return res.status(400).json({ message: 'Current PIN required' })
//       }
//       const ok = await bcrypt.compare(currentPin, user.upiPin)
//       if (!ok) {
//         return res.status(400).json({ message: 'Current PIN is incorrect' })
//       }
//     }

//     // Validate new PIN
//     if (!/^[0-9]{4}$/.test(newPin) && !/^[0-9]{6}$/.test(newPin)) {
//       return res.status(400).json({ message: 'PIN must be exactly 4 or 6 digits.' })
//     }

//     user.upiPin = await bcrypt.hash(newPin, 10)
//     user.hasUpiPin = true
//     await user.save()

//     res.json({ message: 'Transaction PIN updated' })
//   } catch (err) {
//     console.error('TRANSACTION PIN ERROR:', err)
//     res.status(500).json({ message: 'Server error' })
//   }
// })


// export default router
