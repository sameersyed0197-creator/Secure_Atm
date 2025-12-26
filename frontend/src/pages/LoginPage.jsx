 



import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
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
      const res = await api.post('/auth/login', form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
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

      {/* Login Card with Glassmorphism */}
      <div className="relative w-full max-w-md z-10">
        <div className="bg-white/70 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl shadow-emerald-500/10">
          
          {/* Welcome Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/60 shadow-lg shadow-emerald-500/10 mb-4">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
            <span className="text-xs font-semibold text-emerald-700">Secure Login</span>
          </div>

          {/* Header */}
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-base text-gray-600 mb-6">
            Sign in to continue to your secure account.
          </p>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50/80 backdrop-blur-sm border border-red-200/60 shadow-lg">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <Link 
                to="/forgot-password" 
                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Forgot password?
              </Link>
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
                  Signing in...
                </span>
              ) : (
                'Sign In →'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            <span className="text-xs font-medium text-gray-500">OR</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link 
              to="/register" 
              className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-all"
            >
              Create Account →
            </Link>
          </p>

          {/* Biometric Login Option */}
          
        </div>

        {/* Floating Security Badge */}
         
      </div>
    </div>
  )
}

export default LoginPage
