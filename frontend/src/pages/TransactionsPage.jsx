 

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex flex-col">
      {/* Top bar */}
      <header className="border-b border-white/20 bg-white/70 backdrop-blur-2xl shadow-lg shadow-emerald-500/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
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
              <p className="text-sm font-bold text-gray-900">Transaction History</p>
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
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        <section className="space-y-1 mb-6">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Transaction History</h1>
          <p className="text-xs sm:text-sm text-gray-600">
            All your deposits and withdrawals, with downloadable PDF receipts.
          </p>
        </section>


        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-50/80 backdrop-blur-sm border border-red-200/60 shadow-lg">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-red-800">{error}</span>
            </div>
          </div>
        )}


        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin h-8 w-8 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600 text-sm font-medium">Loading transactions...</p>
            </div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="border-2 border-emerald-200/40 rounded-2xl p-8 text-center bg-white/60 backdrop-blur-sm">
            <p className="text-sm text-gray-600 font-medium">No transactions yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx._id}
                className="bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-gray-200/50 p-4 flex items-center justify-between shadow-sm hover:shadow-lg hover:shadow-emerald-500/10 hover:border-emerald-300/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold shadow-lg ${
                      tx.type === 'DEPOSIT'
                        ? 'bg-emerald-50 border-2 border-emerald-500/40 text-emerald-600 shadow-emerald-500/20'
                        : 'bg-red-50 border-2 border-red-500/40 text-red-600 shadow-red-500/20'
                    }`}
                  >
                    {tx.type === 'DEPOSIT' ? '+' : '-'}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-gray-900">
                      {tx.type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'}
                    </p>
                    <p className="text-[11px] sm:text-xs text-gray-500">
                      {new Date(tx.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>


                <div className="text-right flex items-center gap-3">
                  <div>
                    <p
                      className={`text-xs sm:text-sm font-bold ${
                        tx.type === 'DEPOSIT' ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {tx.type === 'DEPOSIT' ? '+' : '-'}₹ {tx.amount.toFixed(2)}
                    </p>
                    <p className="text-[11px] sm:text-xs text-gray-500">
                      Balance: ₹ {tx.balanceAfter.toFixed(2)}
                    </p>
                  </div>


                  <button
                    onClick={() => handleDownloadReceipt(tx._id)}
                    className="px-3 py-1.5 rounded-full text-[10px] sm:text-xs bg-emerald-50 border-2 border-emerald-500/60 text-emerald-600 font-semibold hover:bg-emerald-100 hover:scale-105 transition-all duration-300 shadow-sm"
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
