import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import auth from '../middleware/auth.js'
import { compareFaces } from '../services/geminiService.js'

const router = express.Router()

// ---------------------------------------------------
// GET /api/biometric/status
// ---------------------------------------------------
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    res.json({
      faceRegistered: user.faceRegistered || false,
      hasFaceData: !!user.faceData,
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

    // ✅ Check minimum size (at least 5KB for real face photo)
    if (faceData.length < 5000) {
      return res.status(400).json({ 
        message: 'Face data too small - capture failed' 
      })
    }

    const user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    // 🔄 Allow unlimited face updates
    user.faceData = faceData
    user.faceRegistered = true
    await user.save()

    console.log(`✅ Face registered/updated for user: ${user.email}`)
    
    res.json({ 
      success: true, 
      message: user.faceRegistered 
        ? 'Face updated successfully' 
        : 'Face registered successfully',
      faceRegistered: true
    })
  } catch (err) {
    console.error('FACE REGISTRATION ERROR:', err)
    res.status(500).json({ message: 'Server error: ' + err.message })
  }
})

// // ---------------------------------------------------
// // POST /api/biometric/verify-face
// // ---------------------------------------------------
// router.post('/verify-face', auth, async (req, res) => {
//   try {
//     const { faceData } = req.body
//     const user = await User.findById(req.user.userId)

//     if (!user || !user.faceRegistered || !user.faceData) {
//       return res.status(400).json({ 
//         message: 'Face not registered. Please register your face first.' 
//       })
//     }

//     if (!faceData) {
//       return res.status(400).json({ 
//         message: 'Face data required for verification' 
//       })
//     }

//     const isMatch = await compareFaces(faceData, user.faceData)

//     if (!isMatch) {
//       return res.status(401).json({ 
//         verified: false, 
//         message: 'Face verification failed - faces do not match' 
//       })
//     }

//     // ✅ Generate short-lived token for withdrawal
//     const biometricToken = jwt.sign(
//       { userId: user._id, type: 'face' },
//       process.env.JWT_SECRET,
//       { expiresIn: '2m' }
//     )

//     res.json({
//       verified: true,
//       message: 'Face verified successfully',
//       biometricToken,
//     })
//   } catch (err) {
//     console.error('FACE VERIFICATION ERROR:', err)
//     res.status(500).json({ message: 'Server error: ' + err.message })
//   }
// })




// POST /api/biometric/verify-face
router.post('/verify-face', auth, async (req, res) => {
  try {
    const { faceData } = req.body; // Incoming base64 from camera
    const user = await User.findById(req.user.userId);

    if (!user || !user.faceRegistered || !user.faceData) {
      return res.status(400).json({ 
        message: 'Face not registered. Please register your face first.' 
      });
    }

    if (!faceData) {
      return res.status(400).json({ 
        message: 'Face data required for verification' 
      });
    }

    // Call the updated compareFaces function
    const isMatch = await compareFaces(faceData, user.faceData);

    if (!isMatch) {
      return res.status(401).json({ 
        verified: false, 
        message: 'Face verification failed - Identity could not be confirmed' 
      });
    }

    // ✅ Generate short-lived token for withdrawal
    const biometricToken = jwt.sign(
      { userId: user._id, type: 'face' },
      process.env.JWT_SECRET,
      { expiresIn: '2m' }
    );

    res.json({
      verified: true,
      message: 'Face verified successfully',
      biometricToken,
    });
    
  } catch (err) {
    console.error('FACE VERIFICATION ROUTE ERROR:', err);
    res.status(500).json({ message: 'Server error during verification' });
  }
});

// ---------------------------------------------------
// DELETE /api/biometric/remove-face
// ---------------------------------------------------
router.delete('/remove-face', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    user.faceData = null
    user.faceRegistered = false
    await user.save()

    console.log(`🗑️ Face data removed for user: ${user.email}`)
    
    res.json({ 
      success: true, 
      message: 'Face data removed successfully' 
    })
  } catch (err) {
    console.error('FACE REMOVAL ERROR:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router


























 