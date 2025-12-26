 



import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    accountNumber: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/register', form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/create-upi-pin')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-400/10 to-emerald-400/10 rounded-full blur-3xl" />

      {/* Logo Link - Top Left */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center gap-2.5 group z-10"
      >
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/50 group-hover:shadow-emerald-500/70 group-hover:scale-110 transition-all duration-300">
          <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <span className="font-bold tracking-tight text-base text-gray-900">
          SECURE<span className="text-emerald-600">ATM</span>
        </span>
      </Link>

      {/* Register Card with Glassmorphism */}
      <div className="relative w-full max-w-md z-10">
        <div className="bg-white/70 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl shadow-emerald-500/10">
          
          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600">Step 1 of 2</span>
              <span className="text-xs font-semibold text-emerald-600">50%</span>
            </div>
            <div className="w-full h-2 bg-gray-200/50 rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 rounded-full shadow-lg shadow-emerald-500/30 transition-all duration-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Next: Create UPI PIN</p>
          </div>

          {/* Registration Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/60 shadow-lg shadow-emerald-500/10 mb-4">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
            <span className="text-xs font-semibold text-emerald-700">Secure Registration</span>
          </div>

          {/* Header */}
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-base text-gray-600 mb-6">
            Join thousands of secure users today.
          </p>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50/80 backdrop-blur-sm border border-red-200/60 shadow-lg">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-red-800">{error}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full rounded-xl bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-emerald-300/50 transition-all duration-300"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Account Number
              </label>
              <input
                type="text"
                name="accountNumber"
                value={form.accountNumber}
                onChange={handleChange}
                className="w-full rounded-xl bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-emerald-300/50 transition-all duration-300"
                placeholder="Enter your bank account number"
                required
              />
              <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Your existing bank account number
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-emerald-300/50 transition-all duration-300"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-xl bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-emerald-300/50 transition-all duration-300"
                placeholder="Minimum 8 characters"
                required
                minLength="8"
              />
              <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Use at least 8 characters with letters and numbers
              </p>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/40">
              <svg className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <p className="text-xs text-gray-600 leading-relaxed">
                By creating an account, you agree to our{' '}
                <Link to="/terms" className="font-semibold text-emerald-600 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="font-semibold text-emerald-600 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white text-base font-bold shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 hover:scale-105 hover:-translate-y-1 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                'Create Account →'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            <span className="text-xs font-medium text-gray-500">OR</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-all"
            >
              Sign In →
            </Link>
          </p>

          </div>

         
      </div>
    </div>
  )
}

export default RegisterPage
