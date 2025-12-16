import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import auth from '../middleware/auth.js'
import User from '../models/User.js'
import Transaction from '../models/Transaction.js'
import PDFDocument from 'pdfkit'
import { compareFaces } from '../services/geminiService.js'

const router = express.Router()

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
// 🔥 POST /api/wallet/withdraw (FIXED)
// ---------------------------------------------------
router.post('/withdraw', auth, async (req, res) => {
  try {
    const { amount, pin, biometricToken, faceData } = req.body
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

    // 🔐 USER-DEFINED SECURITY SETTINGS
    const { biometricThreshold, biometricMode } = user.securitySettings

    console.log('💰 Withdraw Request:', {
      user: user.email,
      amount: amt,
      biometricThreshold,
      biometricMode,
    })

    // ---------------------------------------------------
    // STEP-UP AUTHENTICATION
    // ---------------------------------------------------
    if (amt >= biometricThreshold) {
      // 🔹 Fingerprint required
      if (biometricMode === 'fingerprint' || biometricMode === 'both') {
        if (!biometricToken) {
          return res
            .status(401)
            .json({ message: 'Fingerprint verification required' })
        }

        const decoded = jwt.verify(biometricToken, process.env.JWT_SECRET)
        if (
          decoded.userId !== user.id ||
          decoded.type !== 'fingerprint'
        ) {
          return res
            .status(401)
            .json({ message: 'Invalid biometric token' })
        }
      }

      // 🔹 Face required
      if (biometricMode === 'face' || biometricMode === 'both') {
        if (!faceData) {
          return res
            .status(401)
            .json({ message: 'Face verification required' })
        }

        if (!user.faceRegistered || !user.faceData) {
          return res
            .status(400)
            .json({ message: 'Face not registered' })
        }

        const faceOk = await compareFaces(faceData, user.faceData)
        if (!faceOk) {
          return res
            .status(401)
            .json({ message: 'Face verification failed' })
        }
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

    res.status(201).json({
      success: true,
      message: 'Withdrawal successful!',
      balance: user.balance,
      transaction: tx,
    })
  } catch (err) {
    console.error('WITHDRAW ERROR:', err)
    res.status(500).json({
      success: false,
      message: 'Server error: ' + err.message,
    })
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

export default router










































// import express from 'express'
// import bcrypt from 'bcryptjs'
// import auth from '../middleware/auth.js'
// import User from '../models/User.js'
// import Transaction from '../models/Transaction.js'
// import PDFDocument from 'pdfkit'
// import { compareFaces } from '../services/geminiService.js'

// const router = express.Router()

// // POST /api/wallet/deposit
// router.post('/deposit', auth, async (req, res) => {
//   try {
//     const { amount, pin } = req.body

//     const amt = Number(amount)
//     if (!amt || amt <= 0) {
//       return res.status(400).json({ message: 'Amount must be greater than 0' })
//     }
//     if (!pin) {
//       return res.status(400).json({ message: 'PIN is required' })
//     }

//     const user = await User.findById(req.user.userId)
//     if (!user) return res.status(404).json({ message: 'User not found' })

//     const pinOk = await bcrypt.compare(pin, user.upiPin)
//     if (!pinOk) {
//       return res.status(400).json({ message: 'Invalid PIN' })
//     }

//     user.balance += amt
//     await user.save()

//     const tx = await Transaction.create({
//       userId: user._id,
//       type: 'DEPOSIT',
//       amount: amt,
//       balanceAfter: user.balance,
//       description: 'ATM cash deposit',
//     })

//     res.status(201).json({ 
//       success: true,
//       message: 'Deposit successful', 
//       balance: user.balance, 
//       transaction: tx 
//     })
//   } catch (err) {
//     console.error('DEPOSIT ERROR:', err)
//     res.status(500).json({ message: 'Server error' })
//   }
// })

// // POST /api/wallet/withdraw
// router.post('/withdraw', auth, async (req, res) => {
//   try {
//     const { amount, pin, biometricData, biometricType } = req.body
//     const amt = Number(amount)
    
//     if (!amt || amt <= 0) {
//       return res.status(400).json({ message: 'Amount must be greater than 0' })
//     }
//     if (!pin) {
//       return res.status(400).json({ message: 'PIN is required' })
//     }

//     const user = await User.findById(req.user.userId)
//     if (!user) return res.status(404).json({ message: 'User not found' })

//     if (amt > user.balance) {
//       return res.status(400).json({ message: 'Insufficient balance' })
//     }

//     if (!user.upiPin) {
//       return res.status(400).json({ message: 'Set UPI PIN first' })
//     }

//     const pinOk = await bcrypt.compare(pin, user.upiPin)
//     if (!pinOk) {
//       return res.status(400).json({ message: 'Invalid PIN' })
//     }

//     const threshold = 5000
    
//     console.log('💰 Withdraw Request:', {
//       amount: amt,
//       threshold: threshold,
//       user: user.email,
//       faceRegistered: user.faceRegistered
//     })

//     if (amt >= threshold) {
//       if (!biometricData || !biometricType) {
//         return res.status(400).json({ 
//           success: false,
//           message: `Face verification required for withdrawals above ₹${threshold}` 
//         })
//       }

//       let biometricOk = false
      
//       if (biometricType === 'face') {
//         if (!user.faceRegistered || !user.faceData) {
//           return res.status(400).json({ 
//             success: false,
//             message: 'Face not registered. Please register face first.' 
//           })
//         }

//         console.log('🎯 Calling Gemini face comparison...')
        
//         const geminiMatch = await compareFaces(biometricData, user.faceData)
        
//         if (geminiMatch) {
//           console.log('✅ Gemini: Face verified successfully')
//           biometricOk = true
//         } else {
//           console.log('❌ Gemini: Face verification failed')
//           return res.status(400).json({ 
//             success: false,
//             message: 'Face verification failed. Please try again.' 
//           })
//         }
        
//       } else if (biometricType === 'fingerprint') {
//         if (!user.fingerprintRegistered || !user.fingerprintData) {
//           return res.status(400).json({ 
//             success: false,
//             message: 'Fingerprint not registered.' 
//           })
//         }
        
//         biometricOk = user.fingerprintData === biometricData
//         if (!biometricOk) {
//           return res.status(400).json({ 
//             success: false,
//             message: 'Fingerprint verification failed.' 
//           })
//         }
//       } else {
//         return res.status(400).json({ 
//           success: false,
//           message: 'Invalid biometric type.' 
//         })
//       }
//     }

//     user.balance -= amt
//     await user.save()

//     const tx = await Transaction.create({
//       userId: user._id,
//       type: 'WITHDRAW',
//       amount: amt,
//       balanceAfter: user.balance,
//       description: 'ATM cash withdrawal',
//     })

//     res.status(201).json({ 
//       success: true,
//       message: 'Withdrawal successful!', 
//       balance: user.balance, 
//       transaction: tx
//     })
//   } catch (err) {
//     console.error('WITHDRAW ERROR:', err)
//     res.status(500).json({ 
//       success: false,
//       message: 'Server error: ' + err.message 
//     })
//   }
// })

// // GET /api/wallet/history
// router.get('/history', auth, async (req, res) => {
//   try {
//     const txs = await Transaction.find({ userId: req.user.userId })
//       .sort({ createdAt: -1 })
//       .limit(50)
//     res.json(txs)
//   } catch (err) {
//     console.error('HISTORY ERROR:', err)
//     res.status(500).json({ message: 'Server error' })
//   }
// })

// // GET /api/wallet/receipt/:transactionId
// router.get('/receipt/:transactionId', auth, async (req, res) => {
//   try {
//     const tx = await Transaction.findById(req.params.transactionId)
//     if (!tx) return res.status(404).json({ message: 'Transaction not found' })
    
//     if (tx.userId.toString() !== req.user.userId) {
//       return res.status(403).json({ message: 'Unauthorized' })
//     }

//     const user = await User.findById(req.user.userId)
    
//     const doc = new PDFDocument()
//     res.setHeader('Content-Type', 'application/pdf')
//     res.setHeader('Content-Disposition', `attachment; filename="receipt_${tx._id}.pdf"`)
    
//     doc.pipe(res)
//     doc.fontSize(20).font('Helvetica-Bold').text('SecureATM Receipt', { align: 'center' })
//     doc.moveDown(0.5)
//     doc.fontSize(10).font('Helvetica').text('Secure ATM Transaction Receipt', { align: 'center' })
//     doc.moveTo(50, doc.y).lineTo(500, doc.y).stroke()
//     doc.moveDown(1)
    
//     doc.fontSize(12).font('Helvetica-Bold').text('Transaction Details')
//     doc.fontSize(10).font('Helvetica')
//     doc.text(`Transaction ID: ${tx._id}`)
//     doc.text(`Type: ${tx.type}`)
//     doc.text(`Amount: ₹ ${tx.amount.toFixed(2)}`)
//     doc.text(`Balance After: ₹ ${tx.balanceAfter.toFixed(2)}`)
//     doc.text(`Date: ${new Date(tx.createdAt).toLocaleString()}`)
//     doc.text(`Status: ${tx.status}`)
//     doc.moveDown(1)
    
//     doc.fontSize(12).font('Helvetica-Bold').text('Account Holder')
//     doc.fontSize(10).font('Helvetica')
//     doc.text(`Name: ${user.fullName}`)
//     doc.text(`Email: ${user.email}`)
//     doc.text(`Account: ${user.accountNumber}`)
//     doc.moveDown(1)
    
//     doc.moveTo(50, doc.y).lineTo(500, doc.y).stroke()
//     doc.fontSize(8).text('This is an electronically generated receipt. For assistance, contact SecureATM support.', { align: 'center' })
//     doc.text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' })
    
//     doc.end()
//   } catch (err) {
//     console.error('RECEIPT ERROR:', err)
//     res.status(500).json({ message: 'Server error' })
//   }
// })


// // GET /api/wallet/balance - Returns current balance
// router.get('/balance', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId)
//     if (!user) return res.status(404).json({ message: 'User not found' })

//     // Return balance from User model
//     res.json({ 
//       success: true, 
//       balance: user.balance 
//     })
//   } catch (err) {
//     console.error('BALANCE ERROR:', err)
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error' 
//     })
//   }
// })


// export default router


















