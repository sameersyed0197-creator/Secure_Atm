// src/pages/CreateUpiPinPage.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function CreateUpiPinPage() {
  const navigate = useNavigate()
  const [upiId] = useState('sameer@secureatm') // later: load from backend/user profile
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col">
      {/* Top Bar */}
      <header className="border-b border-dashed border-gray-800 bg-black/40 backdrop-blur-xl">
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <svg
                className="h-4 w-4 text-black"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">SecureATM</p>
              <p className="text-sm font-semibold">Create UPI PIN</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs sm:text-sm px-3 py-1.5 rounded-full border border-dashed border-gray-700 text-gray-300 hover:border-emerald-500 hover:text-emerald-300 transition"
            disabled={loading}
          >
            Skip for now →
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-6 sm:py-10">
        <div className="w-full max-w-xl bg-[#101010] rounded-2xl border border-dashed border-gray-800 p-5 sm:p-6 shadow-2xl">
          <div className="mb-4 sm:mb-5">
            <h1 className="text-lg sm:text-xl font-semibold mb-1">
              Set up your UPI PIN
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              This PIN will be used to authorize UPI transactions from your SecureATM
              linked account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            {/* UPI ID */}
            <div className="space-y-1.5">
              <label className="block text-gray-300">Linked UPI ID</label>
              <input
                type="text"
                value={upiId}
                disabled
                className="w-full rounded-lg bg-[#181818] border border-dashed border-gray-700 px-3 py-2 text-gray-500 cursor-not-allowed"
              />
              <p className="text-[11px] text-gray-500">
                This UPI ID is linked to your bank account. You can change it later in
                Settings.
              </p>
            </div>

            {/* New PIN */}
            <div className="space-y-1.5">
              <label className="block text-gray-300">Create UPI PIN</label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={6}
                disabled={loading}
                className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
                placeholder="Enter 4 or 6 digit PIN"
              />
            </div>

            {/* Confirm PIN */}
            <div className="space-y-1.5">
              <label className="block text-gray-300">Confirm UPI PIN</label>
              <input
                type="password"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                maxLength={6}
                disabled={loading}
                className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
                placeholder="Re-enter PIN"
              />
            </div>

            {/* Info strip */}
            <div className="mt-1 flex items-start gap-2 rounded-xl bg-[#141414] border border-dashed border-gray-700 px-3 py-2">
              <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <p className="text-[11px] text-gray-400">
                Do not share your UPI PIN with anyone. SecureATM will never ask for it
                in a call or message.
              </p>
            </div>

            {/* Error */}
            {error && (
              <p className="text-[11px] text-red-400 mt-1">
                {error}
              </p>
            )}

            {/* Actions */}
            <div className="pt-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 rounded-lg border border-dashed border-gray-700 text-gray-300 hover:border-gray-500 text-xs sm:text-sm"
                disabled={loading}
              >
                Do this later
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold text-xs sm:text-sm hover:brightness-110 disabled:opacity-60 transition"
              >
                {loading ? 'Saving PIN...' : 'Create UPI PIN'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default CreateUpiPinPage
