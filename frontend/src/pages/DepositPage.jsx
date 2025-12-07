// // // src/pages/DepositPage.jsx
// // import React, { useState } from 'react'
// // import { useNavigate } from 'react-router-dom'
// // import api from '../services/api'

// // function DepositPage() {
// //   const navigate = useNavigate()
// //   const [amount, setAmount] = useState('')
// //   const [pin, setPin] = useState('')
// //   const [step, setStep] = useState(1) // 1 = amount, 2 = PIN, 3 = fingerprint
// //   const [loading, setLoading] = useState(false)
// //   const [error, setError] = useState('')
// //   const [success, setSuccess] = useState('')

// //   const handleNextFromAmount = () => {
// //     setError('')
// //     const amt = Number(amount)
// //     if (!amt || amt <= 0) {
// //       setError('Enter a valid amount greater than 0.')
// //       return
// //     }
// //     setStep(2)
// //   }

// //   const handleNextFromPin = () => {
// //     setError('')
// //     if (!pin || pin.length < 4) {
// //       setError('Enter your 4 or 6 digit transaction PIN.')
// //       return
// //     }
// //     setStep(3)
// //   }

// //  const handleConfirmDeposit = async () => {
// //   setError('')
// //   setSuccess('')
// //   const amt = Number(amount)
// //   if (!amt || amt <= 0) {
// //     setError('Enter a valid amount.')
// //     return
// //   }

// //   try {
// //     setLoading(true)
// //     const token = localStorage.getItem('token')
// //     const res = await api.post(
// //       '/wallet/deposit',
// //       {
// //         amount: amt,
// //         pinOk: true,
// //         fingerprintOk: true,
// //       },
// //       {
// //         headers: { Authorization: `Bearer ${token}` },
// //       }
// //     )

// //     // NEW: save updated balance for Dashboard
// //     localStorage.setItem('balance', String(res.data.balance))

// //     setSuccess('Deposit successful.')
// //     setAmount('')
// //     setPin('')
// //     setStep(1)
// //     console.log('New balance:', res.data.balance)
// //   } catch (err) {
// //     console.error(err)
// //     setError(err.response?.data?.message || 'Deposit failed. Please try again.')
// //   } finally {
// //     setLoading(false)
// //   }
// // }

// //   const handleBack = () => {
// //     if (step === 1) {
// //       navigate('/dashboard')
// //     } else {
// //       setStep(step - 1)
// //       setError('')
// //     }
// //   }

// //   return (
// //     <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col">
// //       {/* Top bar */}
// //       <header className="border-b border-dashed border-gray-800 bg-black/40 backdrop-blur-xl">
// //         <div className="max-w-xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
// //           <div className="flex items-center gap-2.5">
// //             <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
// //               <svg
// //                 className="h-4 w-4 text-black"
// //                 fill="none"
// //                 stroke="currentColor"
// //                 strokeWidth="2.5"
// //                 viewBox="0 0 24 24"
// //               >
// //                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
// //               </svg>
// //             </div>
// //             <div>
// //               <p className="text-xs text-gray-400 uppercase tracking-wide">SecureATM</p>
// //               <p className="text-sm font-semibold">Deposit Cash</p>
// //             </div>
// //           </div>

// //           <button
// //             onClick={() => navigate('/dashboard')}
// //             className="text-xs sm:text-sm px-3 py-1.5 rounded-full border border-dashed border-gray-700 text-gray-300 hover:border-emerald-500 hover:text-emerald-300 transition"
// //           >
// //             ← Back to Dashboard
// //           </button>
// //         </div>
// //       </header>

// //       {/* Main */}
// //       <main className="flex-1 flex items-center justify-center px-4 py-6 sm:py-10">
// //         <div className="w-full max-w-xl bg-[#101010] rounded-2xl border border-dashed border-gray-800 p-5 sm:p-6 shadow-2xl space-y-4">
// //           {/* Step indicator */}
// //           <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
// //             <span className={step >= 1 ? 'text-emerald-300' : ''}>1. Amount</span>
// //             <span className={step >= 2 ? 'text-emerald-300' : ''}>2. PIN</span>
// //             <span className={step >= 3 ? 'text-emerald-300' : ''}>3. Fingerprint</span>
// //           </div>

// //           {error && (
// //             <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/40 rounded-lg px-3 py-2">
// //               {error}
// //             </p>
// //           )}
// //           {success && (
// //             <p className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/40 rounded-lg px-3 py-2">
// //               {success}
// //             </p>
// //           )}

// //           {/* Step 1: Amount */}
// //           {step === 1 && (
// //             <div className="space-y-4 text-xs sm:text-sm">
// //               <h1 className="text-lg sm:text-xl font-semibold">Enter deposit amount</h1>
// //               <p className="text-gray-400">
// //                 Cash will be added to your SecureATM balance instantly after verification.
// //               </p>

// //               <div className="space-y-1.5">
// //                 <label className="block text-gray-300">Amount (₹)</label>
// //                 <input
// //                   type="number"
// //                   min="1"
// //                   value={amount}
// //                   onChange={(e) => setAmount(e.target.value)}
// //                   className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
// //                   placeholder="Enter amount"
// //                 />
// //               </div>
// //             </div>
// //           )}

// //           {/* Step 2: PIN */}
// //           {step === 2 && (
// //             <div className="space-y-4 text-xs sm:text-sm">
// //               <h1 className="text-lg sm:text-xl font-semibold">Confirm with PIN</h1>
// //               <p className="text-gray-400">
// //                 Use your transaction PIN to authorize this deposit.
// //               </p>

// //               <div className="space-y-1.5">
// //                 <label className="block text-gray-300">Transaction PIN</label>
// //                 <input
// //                   type="password"
// //                   maxLength={6}
// //                   value={pin}
// //                   onChange={(e) => setPin(e.target.value)}
// //                   className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
// //                   placeholder="Enter 4 or 6 digit PIN"
// //                 />
// //               </div>
// //             </div>
// //           )}

// //           {/* Step 3: Fingerprint */}
// //           {step === 3 && (
// //             <div className="space-y-4 text-xs sm:text-sm">
// //               <h1 className="text-lg sm:text-xl font-semibold">Fingerprint verification</h1>
// //               <p className="text-gray-400">
// //                 Place your finger on the SecureATM sensor to complete this deposit.
// //               </p>

// //               <div className="mt-2 flex flex-col items-center gap-3">
// //                 <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
// //                   <svg
// //                     className="h-9 w-9 text-black"
// //                     fill="none"
// //                     stroke="currentColor"
// //                     strokeWidth="2"
// //                     viewBox="0 0 24 24"
// //                   >
// //                     <path
// //                       strokeLinecap="round"
// //                       strokeLinejoin="round"
// //                       d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
// //                     />
// //                   </svg>
// //                 </div>
// //                 <p className="text-[11px] text-gray-400 text-center">
// //                   For now this step is simulated. On real ATM hardware, this would verify your
// //                   fingerprint.
// //                 </p>
// //               </div>
// //             </div>
// //           )}

// //           {/* Actions */}
// //           <div className="flex items-center justify-between pt-3">
// //             <button
// //               type="button"
// //               onClick={handleBack}
// //               className="px-4 py-2 rounded-lg border border-dashed border-gray-700 text-gray-300 text-xs sm:text-sm hover:border-gray-500"
// //               disabled={loading}
// //             >
// //               {step === 1 ? 'Cancel' : 'Back'}
// //             </button>

// //             {step === 1 && (
// //               <button
// //                 type="button"
// //                 onClick={handleNextFromAmount}
// //                 className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold text-xs sm:text-sm hover:brightness-110"
// //               >
// //                 Continue
// //               </button>
// //             )}

// //             {step === 2 && (
// //               <button
// //                 type="button"
// //                 onClick={handleNextFromPin}
// //                 className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold text-xs sm:text-sm hover:brightness-110"
// //               >
// //                 Verify PIN
// //               </button>
// //             )}

// //             {step === 3 && (
// //               <button
// //                 type="button"
// //                 onClick={handleConfirmDeposit}
// //                 disabled={loading}
// //                 className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold text-xs sm:text-sm hover:brightness-110 disabled:opacity-60"
// //               >
// //                 {loading ? 'Processing...' : 'Confirm Deposit'}
// //               </button>
// //             )}
// //           </div>
// //         </div>
// //       </main>
// //     </div>
// //   )
// // }

// // export default DepositPage


















// // src/pages/DepositPage.jsx
// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import api from '../services/api'

// function DepositPage() {
//   const navigate = useNavigate()
//   const [amount, setAmount] = useState('')
//   const [pin, setPin] = useState('')
//   const [step, setStep] = useState(1) // 1 = amount, 2 = PIN
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')

//   const handleNextFromAmount = () => {
//     setError('')
//     const amt = Number(amount)
//     if (!amt || amt <= 0) {
//       setError('Enter a valid amount greater than 0.')
//       return
//     }
//     setStep(2)
//   }

//   const handleConfirmDeposit = async () => {
//     setError('')
//     setSuccess('')
//     const amt = Number(amount)
//     if (!amt || amt <= 0) {
//       setError('Enter a valid amount.')
//       return
//     }
    
//     if (!pin || pin.length < 4) {
//       setError('Enter your 4 or 6 digit transaction PIN.')
//       return
//     }

//     try {
//       setLoading(true)
//       const token = localStorage.getItem('token')
//       const res = await api.post(
//         '/wallet/deposit',
//         {
//           amount: amt,
//           pinOk: true,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       )

//       // Save updated balance for Dashboard
//       localStorage.setItem('balance', String(res.data.balance))

//       setSuccess('Deposit successful.')
//       setAmount('')
//       setPin('')
//       setStep(1)
//       console.log('New balance:', res.data.balance)
      
//       // Redirect to dashboard after 2 seconds
//       setTimeout(() => {
//         navigate('/dashboard')
//       }, 2000)
      
//     } catch (err) {
//       console.error(err)
//       setError(err.response?.data?.message || 'Deposit failed. Please try again.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleBack = () => {
//     if (step === 1) {
//       navigate('/dashboard')
//     } else {
//       setStep(step - 1)
//       setError('')
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col">
//       {/* Top bar */}
//       <header className="border-b border-dashed border-gray-800 bg-black/40 backdrop-blur-xl">
//         <div className="max-w-xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-2.5">
//             <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
//               <svg
//                 className="h-4 w-4 text-black"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2.5"
//                 viewBox="0 0 24 24"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//               </svg>
//             </div>
//             <div>
//               <p className="text-xs text-gray-400 uppercase tracking-wide">SecureATM</p>
//               <p className="text-sm font-semibold">Deposit Cash</p>
//             </div>
//           </div>

//           <button
//             onClick={() => navigate('/dashboard')}
//             className="text-xs sm:text-sm px-3 py-1.5 rounded-full border border-dashed border-gray-700 text-gray-300 hover:border-emerald-500 hover:text-emerald-300 transition"
//           >
//             ← Back to Dashboard
//           </button>
//         </div>
//       </header>

//       {/* Main */}
//       <main className="flex-1 flex items-center justify-center px-4 py-6 sm:py-10">
//         <div className="w-full max-w-xl bg-[#101010] rounded-2xl border border-dashed border-gray-800 p-5 sm:p-6 shadow-2xl space-y-4">
//           {/* Step indicator */}
//           <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
//             <span className={step >= 1 ? 'text-emerald-300' : ''}>1. Amount</span>
//             <span className={step >= 2 ? 'text-emerald-300' : ''}>2. PIN</span>
//           </div>

//           {error && (
//             <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/40 rounded-lg px-3 py-2">
//               {error}
//             </p>
//           )}
//           {success && (
//             <p className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/40 rounded-lg px-3 py-2">
//               {success}
//             </p>
//           )}

//           {/* Step 1: Amount */}
//           {step === 1 && (
//             <div className="space-y-4 text-xs sm:text-sm">
//               <h1 className="text-lg sm:text-xl font-semibold">Enter deposit amount</h1>
//               <p className="text-gray-400">
//                 Cash will be added to your SecureATM balance instantly after verification.
//               </p>

//               <div className="space-y-1.5">
//                 <label className="block text-gray-300">Amount (₹)</label>
//                 <input
//                   type="number"
//                   min="1"
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                   className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
//                   placeholder="Enter amount"
//                 />
//               </div>
//             </div>
//           )}

//           {/* Step 2: PIN */}
//           {step === 2 && (
//             <div className="space-y-4 text-xs sm:text-sm">
//               <h1 className="text-lg sm:text-xl font-semibold">Confirm with PIN</h1>
//               <p className="text-gray-400">
//                 Use your transaction PIN to authorize this deposit.
//               </p>

//               <div className="space-y-1.5">
//                 <label className="block text-gray-300">Transaction PIN</label>
//                 <input
//                   type="password"
//                   maxLength={6}
//                   value={pin}
//                   onChange={(e) => setPin(e.target.value)}
//                   className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
//                   placeholder="Enter 4 or 6 digit PIN"
//                 />
//               </div>
//             </div>
//           )}

//           {/* Actions */}
//           <div className="flex items-center justify-between pt-3">
//             <button
//               type="button"
//               onClick={handleBack}
//               className="px-4 py-2 rounded-lg border border-dashed border-gray-700 text-gray-300 text-xs sm:text-sm hover:border-gray-500"
//               disabled={loading}
//             >
//               {step === 1 ? 'Cancel' : 'Back'}
//             </button>

//             {step === 1 && (
//               <button
//                 type="button"
//                 onClick={handleNextFromAmount}
//                 className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold text-xs sm:text-sm hover:brightness-110"
//               >
//                 Continue
//               </button>
//             )}

//             {step === 2 && (
//               <button
//                 type="button"
//                 onClick={handleConfirmDeposit}
//                 disabled={loading}
//                 className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold text-xs sm:text-sm hover:brightness-110 disabled:opacity-60"
//               >
//                 {loading ? 'Processing...' : 'Confirm Deposit'}
//               </button>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }

// export default DepositPage




// src/pages/DepositPage.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function DepositPage() {
  const navigate = useNavigate()
  const [amount, setAmount] = useState('')
  const [pin, setPin] = useState('')
  const [step, setStep] = useState(1) // 1 = amount, 2 = PIN
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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
  setSuccess('')
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
    
    // FIXED: Send actual PIN, not pinOk: true
    const res = await api.post(
      '/wallet/deposit',
      {
        amount: amt,
        pin: pin, // Send the actual PIN value
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )

    // Save updated balance for Dashboard
    localStorage.setItem('balance', String(res.data.balance))

    setSuccess('Deposit successful.')
    setAmount('')
    setPin('')
    setStep(1)
    console.log('New balance:', res.data.balance)
    
    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
      navigate('/dashboard')
    }, 2000)
    
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
    } else {
      setStep(step - 1)
      setError('')
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col">
      {/* Top bar */}
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
              <p className="text-sm font-semibold">Deposit Cash</p>
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
      <main className="flex-1 flex items-center justify-center px-4 py-6 sm:py-10">
        <div className="w-full max-w-xl bg-[#101010] rounded-2xl border border-dashed border-gray-800 p-5 sm:p-6 shadow-2xl space-y-4">
          {/* Step indicator */}
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span className={step >= 1 ? 'text-emerald-300' : ''}>1. Amount</span>
            <span className={step >= 2 ? 'text-emerald-300' : ''}>2. PIN</span>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/40 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {success && (
            <p className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/40 rounded-lg px-3 py-2">
              {success}
            </p>
          )}

          {/* Step 1: Amount */}
          {step === 1 && (
            <div className="space-y-4 text-xs sm:text-sm">
              <h1 className="text-lg sm:text-xl font-semibold">Enter deposit amount</h1>
              <p className="text-gray-400">
                Cash will be added to your SecureATM balance instantly after verification.
              </p>

              <div className="space-y-1.5">
                <label className="block text-gray-300">Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
                  placeholder="Enter amount"
                />
              </div>
            </div>
          )}

          {/* Step 2: PIN */}
          {step === 2 && (
            <div className="space-y-4 text-xs sm:text-sm">
              <h1 className="text-lg sm:text-xl font-semibold">Confirm with PIN</h1>
              <p className="text-gray-400">
                Use your transaction PIN to authorize this deposit.
              </p>

              <div className="space-y-1.5">
                <label className="block text-gray-300">Transaction PIN</label>
                <input
                  type="password"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
                  placeholder="Enter 4 or 6 digit PIN"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-3">
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 rounded-lg border border-dashed border-gray-700 text-gray-300 text-xs sm:text-sm hover:border-gray-500"
              disabled={loading}
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </button>

            {step === 1 && (
              <button
                type="button"
                onClick={handleNextFromAmount}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold text-xs sm:text-sm hover:brightness-110"
              >
                Continue
              </button>
            )}

            {step === 2 && (
              <button
                type="button"
                onClick={handleConfirmDeposit}
                disabled={loading}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold text-xs sm:text-sm hover:brightness-110 disabled:opacity-60"
              >
                {loading ? 'Processing...' : 'Confirm Deposit'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default DepositPage
