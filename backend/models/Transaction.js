// import mongoose from 'mongoose'

// const transactionSchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     type: { type: String, enum: ['DEPOSIT', 'WITHDRAW'], required: true },
//     amount: { type: Number, required: true },
//     balanceAfter: { type: Number, required: true },
//     status: { type: String, enum: ['SUCCESS', 'FAILED'], default: 'SUCCESS' },
//     description: { type: String, default: '' },
//   },
//   { timestamps: true }
// )

// export default mongoose.model('Transaction', transactionSchema)
// models/Transaction.js - NO CHANGES NEEDED
import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    type: { 
      type: String, 
      enum: ['DEPOSIT', 'WITHDRAW'], 
      required: true 
    },
    amount: { 
      type: Number, 
      required: true 
    },
    balanceAfter: { 
      type: Number, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['SUCCESS', 'FAILED'], 
      default: 'SUCCESS' 
    },
    description: { 
      type: String, 
      default: '' 
    },
  },
  { timestamps: true }
)

export default mongoose.model('Transaction', transactionSchema)
