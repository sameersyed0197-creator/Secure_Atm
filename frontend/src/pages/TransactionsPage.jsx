// src/pages/TransactionsPage.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function TransactionsPage() {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true)
        setError('')
        const token = localStorage.getItem('token')
        const res = await api.get('/wallet/history', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setTransactions(res.data)
      } catch (err) {
        console.error(err)
        setError(err.response?.data?.message || 'Failed to load transactions')
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const handleDownloadReceipt = async (txId) => {
    try {
      const token = localStorage.getItem('token')
      const res = await api.get(`/wallet/receipt/${txId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `receipt_${txId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed:', err)
      alert('Failed to download receipt')
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col">
      {/* Top bar */}
      <header className="border-b border-dashed border-gray-800 bg-black/40 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
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
              <p className="text-sm font-semibold">Transaction History</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs sm:text-sm px-3 py-1.5 rounded-full border border-dashed border-gray-700 text-gray-300 hover:border-emerald-500 hover:text-emerald-300 transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        <section className="space-y-1 mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold">Transaction History</h1>
          <p className="text-xs sm:text-sm text-gray-400">
            All your deposits and withdrawals, with downloadable PDF receipts.
          </p>
        </section>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/40 text-xs text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-400 text-sm">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="border border-dashed border-gray-700 rounded-xl p-8 text-center">
            <p className="text-sm text-gray-400">No transactions yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx._id}
                className="bg-[#101010] rounded-xl border border-dashed border-gray-800 p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold ${
                      tx.type === 'DEPOSIT'
                        ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-300'
                        : 'bg-red-500/10 border border-red-500/40 text-red-300'
                    }`}
                  >
                    {tx.type === 'DEPOSIT' ? '+' : '-'}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold">
                      {tx.type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'}
                    </p>
                    <p className="text-[11px] sm:text-xs text-gray-400">
                      {new Date(tx.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="text-right flex items-center gap-3">
                  <div>
                    <p
                      className={`text-xs sm:text-sm font-semibold ${
                        tx.type === 'DEPOSIT' ? 'text-emerald-300' : 'text-red-300'
                      }`}
                    >
                      {tx.type === 'DEPOSIT' ? '+' : '-'}₹ {tx.amount.toFixed(2)}
                    </p>
                    <p className="text-[11px] sm:text-xs text-gray-400">
                      Balance: ₹ {tx.balanceAfter.toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDownloadReceipt(tx._id)}
                    className="px-2 py-1 rounded text-[10px] sm:text-xs bg-emerald-500/10 border border-dashed border-emerald-500/60 text-emerald-300 hover:bg-emerald-500/20 transition"
                  >
                    PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default TransactionsPage
