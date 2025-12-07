// backend/routes/upiRoutes.js
import express from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import auth from '../middleware/auth.js' // you still need to create this

const router = express.Router()

// POST /api/upi/set-pin
router.post('/set-pin', auth, async (req, res) => {
  try {
    const { pin } = req.body

    // Validate PIN: must be exactly 4 or 6 digits
    if (!/^[0-9]{4}$/.test(pin) && !/^[0-9]{6}$/.test(pin)) {
      return res.status(400).json({
        message: 'PIN must be exactly 4 or 6 digits.',
      })
    }

    const user = await User.findById(req.user.userId) // from JWT payload

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (user.hasUpiPin === true) {
      return res.status(400).json({
        message: 'UPI PIN already exists. Use settings to update.',
      })
    }

    const hashedPin = await bcrypt.hash(pin, 10)

    user.upiPin = hashedPin
    user.hasUpiPin = true
    await user.save()

    return res.status(200).json({
      message: 'UPI PIN created successfully.',
      hasUpiPin: true,
    })
  } catch (error) {
    console.error('UPI PIN ERROR:', error)
    res.status(500).json({ message: 'Server Error' })
  }
})

export default router
