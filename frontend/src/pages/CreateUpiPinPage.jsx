 


// src/pages/CreateUpiPinPage.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'


function CreateUpiPinPage() {
  const navigate = useNavigate()
  const [upiId, setUpiId] = useState('')
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Load user data and generate UPI ID from fullName
  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      try {
        const parsed = JSON.parse(user)
        // Convert full name to UPI ID format
        // Example: "John Doe" -> "johndoe@secureatm"
        const fullName = parsed.fullName || 'user'
        const upiUsername = fullName
          .toLowerCase()
          .replace(/\s+/g, '') // Remove all spaces
          .replace(/[^a-z0-9]/g, '') // Remove special characters, keep only alphanumeric
        
        setUpiId(`${upiUsername}@secureatm`)
      } catch (e) {
        console.error('Failed to parse user:', e)
        setUpiId('user@secureatm')
      }
    } else {
      setUpiId('user@secureatm')
    }
  }, [])

  const validatePin = (value) => {
    const onlyDigits = /^[0-9]+$/
    return onlyDigits.test(value) && (value.length === 4 || value.length === 6)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validatePin(pin)) {
      setError('PIN must be 4 or 6 digits and contain only numbers.')
      return
    }

    if (pin !== confirmPin) {
      setError('PIN and Confirm PIN must match.')
      return
    }

    try {
      setLoading(true)

      const token = localStorage.getItem('token')
      if (!token) {
        setError('You must be logged in to set your UPI PIN.')
        setLoading(false)
        return
      }

      await api.post(
        '/upi/set-pin',
        { pin },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      setError(
        err.response?.data?.message ||
          'Something went wrong while setting your UPI PIN. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex flex-col">
      {/* Top Bar */}
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
              <p className="text-sm font-bold text-gray-900">Create UPI PIN</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs sm:text-sm px-4 py-2 rounded-full border-2 border-gray-300 text-gray-700 font-semibold hover:border-emerald-500 hover:text-emerald-600 hover:scale-105 transition-all duration-300"
            disabled={loading}
          >
            Skip for now →
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-6 sm:py-10">
        <div className="w-full max-w-xl bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-gray-200/50 p-5 sm:p-6 shadow-2xl shadow-emerald-500/10">
          
          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600">Step 2 of 2</span>
              <span className="text-xs font-semibold text-emerald-600">100%</span>
            </div>
            <div className="w-full h-2 bg-gray-200/50 rounded-full overflow-hidden">
              <div className="h-full w-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 rounded-full shadow-lg shadow-emerald-500/30 transition-all duration-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Final step: Secure your account</p>
          </div>

          {/* UPI Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/60 shadow-lg shadow-emerald-500/10 mb-4">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
            <span className="text-xs font-semibold text-emerald-700">UPI Setup</span>
          </div>

          <div className="mb-5">
            <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 mb-2">
              Set up your UPI PIN
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              This PIN will be used to authorize UPI transactions from your SecureATM linked account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            {/* UPI ID */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Your UPI ID</label>
              <div className="relative">
                <input
                  type="text"
                  value={upiId}
                  disabled
                  className="w-full rounded-xl bg-gray-100 border-2 border-gray-300 px-4 py-3 text-sm text-gray-600 font-mono font-semibold cursor-not-allowed"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="flex items-start gap-2 text-xs text-gray-500">
                <svg className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                This UPI ID is automatically generated from your name. You can change it later in Settings.
              </p>
            </div>

            {/* New PIN */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Create UPI PIN</label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={6}
                disabled={loading}
                className="w-full rounded-xl bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-emerald-300/50 transition-all duration-300"
                placeholder="Enter 4 or 6 digit PIN"
              />
            </div>

            {/* Confirm PIN */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Confirm UPI PIN</label>
              <input
                type="password"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                maxLength={6}
                disabled={loading}
                className="w-full rounded-xl bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-emerald-300/50 transition-all duration-300"
                placeholder="Re-enter PIN"
              />
            </div>

            {/* Security Info */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50/50 border border-amber-200/40">
              <svg className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div className="text-xs text-gray-700 leading-relaxed">
                <p className="font-bold text-amber-700 mb-1">Keep your PIN secure</p>
                <p>Do not share your UPI PIN with anyone. SecureATM will never ask for it in a call or message.</p>
              </div>
            </div>

            {/* Error */}
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

            {/* Actions */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full border-2 border-gray-300 text-gray-700 font-semibold hover:border-gray-400 hover:scale-105 text-xs sm:text-sm transition-all duration-300"
                disabled={loading}
              >
                Do this later
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/60 hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving PIN...
                  </span>
                ) : (
                  'Create UPI PIN →'
                )}
              </button>
            </div>
          </form>

          {/* Additional Features Info */}
          <div className="mt-6 pt-6 border-t border-gray-200/50">
            <p className="text-xs text-gray-500 text-center mb-3 font-medium">
              What you can do with your UPI PIN:
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="flex flex-col items-center gap-1">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-600">Pay Anyone</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-600">Request Money</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-600">Bill Payments</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CreateUpiPinPage
