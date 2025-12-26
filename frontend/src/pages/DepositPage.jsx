 


// src/pages/DepositPage.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'


function DepositPage() {
  const navigate = useNavigate()
  const [amount, setAmount] = useState('')
  const [pin, setPin] = useState('')
  const [step, setStep] = useState(1) // 1 = amount, 2 = PIN, 3 = success
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [depositData, setDepositData] = useState(null) // Store transaction details


  const handleNextFromAmount = () => {
    setError('')
    const amt = Number(amount)
    if (!amt || amt <= 0) {
      setError('Enter a valid amount greater than 0.')
      return
    }
    setStep(2)
  }


  const handleConfirmDeposit = async () => {
    setError('')
    const amt = Number(amount)
    if (!amt || amt <= 0) {
      setError('Enter a valid amount.')
      return
    }
    
    if (!pin || pin.length < 4) {
      setError('Enter your 4 or 6 digit transaction PIN.')
      return
    }


    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      const res = await api.post(
        '/wallet/deposit',
        {
          amount: amt,
          pin: pin,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )


      // Save updated balance for Dashboard
      localStorage.setItem('balance', String(res.data.balance))


      // Store transaction details for success card
      setDepositData({
        amount: amt,
        balance: res.data.balance,
        timestamp: new Date().toLocaleString(),
        transactionId: res.data.transactionId || `TXN${Date.now()}`
      })


      // Move to success step
      setStep(3)
      console.log('New balance:', res.data.balance)
      
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Deposit failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }


  const handleBack = () => {
    if (step === 1) {
      navigate('/dashboard')
    } else if (step === 2) {
      setStep(1)
      setError('')
    }
  }


  const handleDone = () => {
    navigate('/dashboard')
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex flex-col">
      {/* Top bar */}
      <header className="border-b border-white/20 bg-white/70 backdrop-blur-2xl shadow-lg shadow-emerald-500/5">
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/40">
              <svg
                className="h-4 w-4 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">SecureATM</p>
              <p className="text-sm font-bold text-gray-900">Deposit Cash</p>
            </div>
          </div>


          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs sm:text-sm px-4 py-2 rounded-full border-2 border-emerald-500 text-emerald-600 font-semibold hover:bg-emerald-50 hover:scale-105 transition-all duration-300"
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>


      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-6 sm:py-10">
        <div className="w-full max-w-xl bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-gray-200/50 p-5 sm:p-6 shadow-2xl shadow-emerald-500/10 space-y-4">
          
          {/* Step indicator - Hide on success */}
          {step !== 3 && (
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1 font-medium">
              <span className={step >= 1 ? 'text-emerald-600 font-bold' : ''}>1. Amount</span>
              <span className={step >= 2 ? 'text-emerald-600 font-bold' : ''}>2. PIN</span>
            </div>
          )}


          {error && (
            <div className="p-4 rounded-xl bg-red-50/80 backdrop-blur-sm border border-red-200/60 shadow-lg">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-red-800">{error}</span>
              </div>
            </div>
          )}


          {/* Step 1: Amount */}
          {step === 1 && (
            <div className="space-y-4 text-xs sm:text-sm">
              <h1 className="text-lg sm:text-xl font-extrabold text-gray-900">Enter deposit amount</h1>
              <p className="text-gray-600">
                Cash will be added to your SecureATM balance instantly after verification.
              </p>


              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-emerald-300/50 transition-all duration-300"
                  placeholder="Enter amount"
                />
              </div>
            </div>
          )}


          {/* Step 2: PIN */}
          {step === 2 && (
            <div className="space-y-4 text-xs sm:text-sm">
              <h1 className="text-lg sm:text-xl font-extrabold text-gray-900">Confirm with PIN</h1>
              <p className="text-gray-600">
                Use your transaction PIN to authorize this deposit.
              </p>


              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Transaction PIN</label>
                <input
                  type="password"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full rounded-xl bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-emerald-300/50 transition-all duration-300"
                  placeholder="Enter 4 or 6 digit PIN"
                />
              </div>
            </div>
          )}


          {/* Step 3: Success Card */}
          {step === 3 && depositData && (
            <div className="space-y-6 py-4">
              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/40 animate-pulse">
                  <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>


              {/* Success Message */}
              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  Deposit Successful!
                </h1>
                <p className="text-sm text-gray-600">
                  Your money has been added to your account
                </p>
              </div>


              {/* Transaction Details Card */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200/50 p-5 space-y-4 shadow-lg">
                {/* Amount */}
                <div className="text-center pb-4 border-b-2 border-emerald-200/50">
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1">
                    Amount Deposited
                  </p>
                  <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                    ₹ {depositData.amount.toFixed(2)}
                  </p>
                </div>


                {/* Transaction Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">New Balance</span>
                    <span className="text-gray-900 font-bold">₹ {depositData.balance.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Transaction ID</span>
                    <span className="text-gray-900 font-mono text-xs font-semibold">{depositData.transactionId}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Date & Time</span>
                    <span className="text-gray-900 font-semibold">{depositData.timestamp}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Status</span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-500/40 text-emerald-700 font-bold text-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Completed
                    </span>
                  </div>
                </div>
              </div>


              {/* Additional Info */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50/50 border border-blue-200/40">
                <svg className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Your receipt has been sent to your registered email. You can also view this transaction in your history.
                </p>
              </div>
            </div>
          )}


          {/* Actions */}
          {step !== 3 && (
            <div className="flex items-center justify-between pt-3">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 rounded-full border-2 border-gray-300 text-gray-700 font-semibold text-xs sm:text-sm hover:border-gray-400 hover:scale-105 transition-all duration-300"
                disabled={loading}
              >
                {step === 1 ? 'Cancel' : 'Back'}
              </button>


              {step === 1 && (
                <button
                  type="button"
                  onClick={handleNextFromAmount}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/60 hover:scale-105 transition-all duration-300"
                >
                  Continue →
                </button>
              )}


              {step === 2 && (
                <button
                  type="button"
                  onClick={handleConfirmDeposit}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/60 hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Confirm Deposit'
                  )}
                </button>
              )}
            </div>
          )}


          {/* Success Actions */}
          {step === 3 && (
            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <button
                type="button"
                onClick={() => navigate('/transactions')}
                className="flex-1 px-6 py-3 rounded-full border-2 border-emerald-500 text-emerald-600 font-bold text-sm hover:bg-emerald-50 hover:scale-105 transition-all duration-300"
              >
                View History
              </button>
              <button
                type="button"
                onClick={handleDone}
                className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/60 hover:scale-105 transition-all duration-300"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}


export default DepositPage

