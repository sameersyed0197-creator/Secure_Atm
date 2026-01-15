import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import auth from '../middleware/auth.js'
import Transaction from '../models/Transaction.js'
import PDFDocument from 'pdfkit'
import { compareFaces } from '../services/geminiService.js'

const router = express.Router()

// ---------------------------------------------------
// POST /api/wallet/withdraw - SUPPORTS BOTH FACE & FINGERPRINT
// ---------------------------------------------------
router.post('/withdraw', auth, async (req, res) => {
  try {
    const { amount, pin, faceData, biometricToken } = req.body
    const amt = Number(amount)

    if (!amt || amt <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' })
    }
    if (!pin) {
      return res.status(400).json({ message: 'PIN is required' })
    }

    const user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    if (amt > user.balance) {
      return res.status(400).json({ message: 'Insufficient balance' })
    }

    const pinOk = await bcrypt.compare(pin, user.upiPin)
    if (!pinOk) {
      return res.status(400).json({ message: 'Invalid PIN' })
    }

    // 🔐 BIOMETRIC CHECK (FACE OR FINGERPRINT)
    const biometricThreshold = user.securitySettings?.biometricThreshold || 5000

    console.log('💰 Withdraw Request:', {
      user: user.email,
      accountNumber: user.accountNumber,
      amount: amt,
      biometricThreshold,
      requiresBiometric: amt >= biometricThreshold,
      hasToken: !!biometricToken,
      hasFace: !!faceData,
    })

    // ---------------------------------------------------
    // STEP-UP AUTHENTICATION - BIOMETRIC VERIFICATION
    // ---------------------------------------------------
    if (amt >= biometricThreshold) {
      let biometricVerified = false

      // ✅ CHECK BIOMETRIC TOKEN (FACE OR FINGERPRINT)
      if (biometricToken) {
        console.log('🔐 Checking biometric token...')
        
        // Try to verify the token directly (for face verification)
        try {
          const decoded = jwt.verify(biometricToken, process.env.JWT_SECRET)
          if (decoded.userId === user._id.toString()) {
            biometricVerified = true
            console.log('✅ Biometric token validated (face or fingerprint)')
          }
        } catch (tokenErr) {
          // If JWT verification fails, check stored fingerprint token
          if (user.biometricToken === biometricToken && user.biometricTokenExpiry > new Date()) {
            biometricVerified = true
            console.log('✅ Fingerprint token validated')
            user.biometricToken = undefined
            user.biometricTokenExpiry = undefined
          }
        }
        
        if (!biometricVerified) {
          return res.status(401).json({ 
            message: 'Invalid or expired biometric token' 
          })
        }
      }
      // ✅ NO BIOMETRIC PROVIDED
      else {
        return res.status(401).json({ 
          requiresBiometric: true,
          message: `Biometric verification required for withdrawals ≥ ₹${biometricThreshold}` 
        })
      }

      // ✅ Double check verification happened
      if (!biometricVerified) {
        return res.status(401).json({ 
          message: 'Biometric verification failed' 
        })
      }
    }

    // ---------------------------------------------------
    // PROCESS WITHDRAWAL
    // ---------------------------------------------------
    user.balance -= amt
    await user.save()

    const tx = await Transaction.create({
      userId: user._id,
      type: 'WITHDRAW',
      amount: amt,
      balanceAfter: user.balance,
      description: 'ATM cash withdrawal',
    })

    console.log('✅✅✅ Withdrawal successful!')
    console.log(`💵 Amount: ₹${amt}`)
    console.log(`💰 New Balance: ₹${user.balance}`)

    res.status(201).json({
      success: true,
      message: 'Withdrawal successful!',
      balance: user.balance,
      transaction: tx,
    })
  } catch (err) {
    console.error('❌ WITHDRAW ERROR:', err)
    res.status(500).json({
      success: false,
      message: 'Server error: ' + err.message,
    })
  }
})

// ---------------------------------------------------
// POST /api/wallet/deposit
// ---------------------------------------------------
router.post('/deposit', auth, async (req, res) => {
  try {
    const { amount, pin } = req.body
    const amt = Number(amount)

    if (!amt || amt <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' })
    }
    if (!pin) {
      return res.status(400).json({ message: 'PIN is required' })
    }

    const user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const pinOk = await bcrypt.compare(pin, user.upiPin)
    if (!pinOk) {
      return res.status(400).json({ message: 'Invalid PIN' })
    }

    user.balance += amt
    await user.save()

    const tx = await Transaction.create({
      userId: user._id,
      type: 'DEPOSIT',
      amount: amt,
      balanceAfter: user.balance,
      description: 'ATM cash deposit',
    })

    res.status(201).json({
      success: true,
      message: 'Deposit successful',
      balance: user.balance,
      transaction: tx,
    })
  } catch (err) {
    console.error('DEPOSIT ERROR:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// ---------------------------------------------------
// GET /api/wallet/history
// ---------------------------------------------------
router.get('/history', auth, async (req, res) => {
  try {
    const txs = await Transaction.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(50)
    res.json(txs)
  } catch (err) {
    console.error('HISTORY ERROR:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// ---------------------------------------------------
// GET /api/wallet/balance
// ---------------------------------------------------
router.get('/balance', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    res.json({ success: true, balance: user.balance })
  } catch (err) {
    console.error('BALANCE ERROR:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

// ---------------------------------------------------
// GET /api/wallet/receipt/:transactionId
// ---------------------------------------------------
router.get('/receipt/:transactionId', auth, async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.transactionId)
    if (!tx) return res.status(404).json({ message: 'Transaction not found' })

    if (tx.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    const user = await User.findById(req.user.userId)
    const doc = new PDFDocument()

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="receipt_${tx._id}.pdf"`
    )

    doc.pipe(res)
    doc.fontSize(20).text('SecureATM Receipt', { align: 'center' })
    doc.moveDown()
    doc.fontSize(10).text(`Transaction ID: ${tx._id}`)
    doc.text(`Amount: ₹${tx.amount}`)
    doc.text(`Balance After: ₹${tx.balanceAfter}`)
    doc.text(`Date: ${new Date(tx.createdAt).toLocaleString()}`)
    doc.text(`Account: ${user.accountNumber}`)
    doc.end()
  } catch (err) {
    console.error('RECEIPT ERROR:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router 