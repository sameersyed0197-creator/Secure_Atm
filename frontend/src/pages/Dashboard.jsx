// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function Dashboard() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [balance, setBalance] = useState(0)
  const [dailyLimit, setDailyLimit] = useState(10000)
  const [usedPercent, setUsedPercent] = useState(0)
  const [user, setUser] = useState({ fullName: '', email: '' })

  // useEffect(() => {
  //   // load user + balance from localStorage
  //   const storedUser = localStorage.getItem('user')
  //   if (storedUser) {
  //     try {
  //       const parsed = JSON.parse(storedUser)
  //       setUser({
  //         fullName: parsed.fullName || '',
  //         email: parsed.email || '',
  //       })
  //       if (parsed.dailyLimit) {
  //         setDailyLimit(parsed.dailyLimit)
  //       }
  //     } catch (e) {
  //       console.error('Failed to parse user from localStorage', e)
  //     }
  //   }

  //   const storedBalance = localStorage.getItem('balance')
  //   if (storedBalance) {
  //     const num = Number(storedBalance)
  //     if (!isNaN(num)) {
  //       setBalance(num)
  //     }
  //   }
  // }, [])
useEffect(() => {
  // Load user info from localStorage
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser)
      setUser({
        fullName: parsed.fullName || '',
        email: parsed.email || '',
      })
      if (parsed.dailyLimit) {
        setDailyLimit(parsed.dailyLimit)
      }
    } catch (e) {
      console.error('Failed to parse user from localStorage', e)
    }
  }

  // Fetch balance from backend
  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }
      
      const res = await api.get('/wallet/balance', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (res.data && res.data.balance !== undefined) {
        const backendBalance = Number(res.data.balance)
        setBalance(backendBalance)
        console.log('✅ Balance from backend:', backendBalance)
      }
    } catch (error) {
      console.error('❌ Error fetching balance:', error)
      // Optional: Fallback to localStorage
      const storedBalance = localStorage.getItem('balance')
      if (storedBalance) {
        const num = Number(storedBalance)
        if (!isNaN(num)) setBalance(num)
      }
    }
  }

  fetchBalance()
}, [navigate])

  // compute how much of daily limit is used today
  useEffect(() => {
    const fetchTodayUsed = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token || !dailyLimit) return

        const res = await api.get('/wallet/history', {
          headers: { Authorization: `Bearer ${token}` },
        })

        const todayStr = new Date().toDateString()
        const todayWithdrawn = res.data
          .filter(
            (tx) =>
              tx.type === 'WITHDRAW' &&
              new Date(tx.createdAt).toDateString() === todayStr
          )
          .reduce((sum, tx) => sum + tx.amount, 0)

        const pct = Math.min((todayWithdrawn / dailyLimit) * 100, 100)
        setUsedPercent(pct)
      } catch (e) {
        console.error('Failed to compute daily used', e)
      }
    }

    fetchTodayUsed()
  }, [dailyLimit])

  const handleSettingsClick = () => {
    setMenuOpen(false)
    navigate('/settings')
  }

  const handleSignOutClick = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setMenuOpen(false)
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Top App Bar */}
      <header className="border-b border-dashed border-gray-800 bg-black/40 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Logo / Brand */}
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <svg
                className="h-5 w-5 text-black"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <span className="font-bold tracking-tight text-sm sm:text-base">
              SECURE<span className="text-emerald-400">ATM</span>
            </span>
          </div>

          {/* Right user area */}
          <div className="flex items-center gap-4 text-sm">
            <div className="hidden sm:flex flex-col items-end">
              <span className="font-medium">{user.fullName || 'User'}</span>
              <span className="text-xs text-gray-400">
                {user.email || 'no-email@example.com'}
              </span>
            </div>

            {/* Avatar + dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-2 px-2 py-1 rounded-full border border-dashed border-gray-700 hover:border-emerald-500/60 transition"
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-xs font-bold text-black">
                  {(user.fullName || 'U')
                    .split(' ')
                    .filter(Boolean)
                    .map((p) => p[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-xl bg-[#111111] border border-dashed border-gray-700 shadow-xl py-1 text-xs z-50">
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-[#181818] text-gray-200"
                    onClick={handleSettingsClick}
                  >
                    Settings
                  </button>
                  <div className="border-t border-dashed border-gray-800 my-1" />
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-[#181818] text-red-400"
                    onClick={handleSignOutClick}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
        {/* Welcome Row */}
        <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">
              Welcome,{' '}
              <span className="text-emerald-400">
                {user.fullName || 'User'}
              </span>{' '}
              👋
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Manage your SecureATM account, limits and security settings from one place.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-dashed border-emerald-500/60 bg-emerald-500/5 text-xs text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Session secure</span>
          </div>
        </section>

        {/* Account Overview Row */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Available Balance Card */}
          <div className="bg-[#111111] rounded-2xl border border-dashed border-gray-700 p-4 sm:p-5 flex flex-col justify-between shadow-lg shadow-black/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Available Balance
                </p>
                <p className="text-2xl sm:text-3xl font-bold mt-1">
                  ₹ {balance.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-gray-500">Account No.</p>
                <p className="text-xs font-mono text-gray-300">**** 4321</p>
              </div>
            </div>
            <div className="border-t border-dashed border-gray-800 my-3" />
            <div className="flex items-center justify-between text-[11px] sm:text-xs text-gray-400">
              <span>Primary Wallet</span>
              <span className="text-emerald-400">Active</span>
            </div>
          </div>

          {/* Daily Limit Card */}
          <div className="bg-[#111111] rounded-2xl border border-dashed border-gray-700 p-4 sm:p-5 flex flex-col justify-between shadow-lg shadow-black/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Daily Withdrawal Limit
                </p>
                <p className="text-2xl sm:text-3xl font-bold mt-1">
                  ₹ {dailyLimit.toFixed(2)}
                </p>
              </div>
              <span className="px-2 py-1 rounded-full text-[11px] bg-emerald-500/10 border border-dashed border-emerald-400/70 text-emerald-300">
                Remaining today
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] sm:text-xs text-gray-400">
                <span>Used</span>
                <span>{usedPercent.toFixed(0)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#1b1b1b] border border-dashed border-gray-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                  style={{ width: `${usedPercent}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Primary Actions Row */}
        <section className="bg-[#101010] rounded-2xl border border-dashed border-gray-800 p-4 sm:p-5">
          <h2 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <button
              className="w-full px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-400 to-emerald-600 text-black shadow-lg shadow-emerald-500/30 hover:brightness-110 transition"
              onClick={() => navigate('/deposit')}
            >
              Deposit Amount
            </button>

            <button
              className="w-full px-4 py-3 rounded-xl text-sm font-semibold border border-dashed border-emerald-500/70 text-emerald-300 bg-emerald-500/5 hover:bg-emerald-500/10 transition"
              onClick={() => navigate('/withdraw')}
            >
              Withdraw Cash
            </button>

            <button
              className="w-full px-4 py-3 rounded-xl text-sm font-semibold border border-dashed border-gray-600 text-gray-200 hover:border-emerald-500/70 hover:text-emerald-200 transition"
              onClick={() => navigate('/transactions')}
            >
              View History
            </button>
          </div>
        </section>

        {/* Security Status Row */}
        <section className="bg-[#101010] rounded-2xl border border-dashed border-gray-800 p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm sm:text-base font-semibold">Security Status</h2>
            <span className="text-[11px] text-gray-400">
              Keep all checks green for maximum protection.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <SecurityTile
              status="Good"
              title="Email Verified"
              desc="Your email is confirmed."
              borderClass="border-emerald-500/70"
              dotClass="bg-emerald-400"
            />

            <SecurityTile
              status="Protected"
              title="PIN Enabled"
              desc="Transactions require your PIN."
              borderClass="border-teal-400/70"
              dotClass="bg-teal-400"
            />

            <SecurityTile
              status="Action needed"
              title="Face Recognition"
              desc="Biometric login not set up."
              borderClass="border-amber-500/70"
              dotClass="bg-amber-400"
            />
          </div>
        </section>

        {/* Session summary / shortcuts */}
        <section className="bg-[#101010] rounded-2xl border border-dashed border-gray-800 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-sm sm:text-base font-semibold">What would you like to do next?</h2>
            <span className="text-[11px] text-gray-500">
              Quick shortcuts for common ATM actions.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
            <button
              onClick={() => navigate('/deposit')}
              className="w-full text-left px-3 py-3 rounded-xl border border-dashed border-emerald-500/60 bg-emerald-500/5 hover:bg-emerald-500/10 transition"
            >
              <p className="font-semibold text-emerald-300">Add money now</p>
              <p className="text-[11px] text-gray-400">
                Deposit cash into your SecureATM wallet.
              </p>
            </button>

            <button
              onClick={() => navigate('/withdraw')}
              className="w-full text-left px-3 py-3 rounded-xl border border-dashed border-gray-600 hover:border-emerald-500/70 transition"
            >
              <p className="font-semibold text-gray-200">Withdraw safely</p>
              <p className="text-[11px] text-gray-400">
                Use PIN + biometrics for secure cash-out.
              </p>
            </button>

            <button
              onClick={() => navigate('/transactions')}
              className="w-full text-left px-3 py-3 rounded-xl border border-dashed border-gray-700 hover:border-emerald-500/70 transition"
            >
              <p className="font-semibold text-gray-200">View full history</p>
              <p className="text-[11px] text-gray-400">
                See all deposits & withdrawals, download receipts.
              </p>
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

function SecurityTile({ status, title, desc, borderClass, dotClass }) {
  return (
    <div
      className={`rounded-xl border border-dashed ${borderClass} bg-[#141414] p-4 flex items-start gap-3`}
    >
      <div
        className={`h-2.5 w-2.5 rounded-full mt-1.5 ${dotClass} shadow-[0_0_12px_rgba(16,185,129,0.8)]`}
      />
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold text-white">{title}</p>
          <span className="text-[10px] px-2 py-0.5 rounded-full border border-dashed border-gray-600 text-gray-300">
            {status}
          </span>
        </div>
        <p className="text-[11px] text-gray-400">{desc}</p>
      </div>
    </div>
  )
}

export default Dashboard
