// import React, { useState, useRef, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import api from '../services/api'
// import { browserSupportsWebAuthn, startAuthentication } from '@simplewebauthn/browser'

// function WithdrawPage() {
//   const navigate = useNavigate()
//   const videoRef = useRef(null)
//   const canvasRef = useRef(null)
//   const streamRef = useRef(null)

//   const [amount, setAmount] = useState('')
//   const [pin, setPin] = useState('')
//   const [step, setStep] = useState(1)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [showCamera, setShowCamera] = useState(false)
//   const [capturedFace, setCapturedFace] = useState(null)
//   const [isCapturing, setIsCapturing] = useState(false)
//   const [biometricStatus, setBiometricStatus] = useState({
//     faceRegistered: false,
//     fingerprintRegistered: false,
//   })
//   const [fingerprintVerified, setFingerprintVerified] = useState(false)

//   // Check biometric status on mount
//   useEffect(() => {
//     const checkBiometricStatus = async () => {
//       try {
//         const token = localStorage.getItem('token')
//         if (!token) return

//         const response = await api.get('/biometric/status', {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         setBiometricStatus({
//           faceRegistered: response.data.faceRegistered || false,
//           fingerprintRegistered: response.data.webAuthnRegistered || false,
//         })
//       } catch (err) {
//         console.error('Error checking biometric status:', err)
//       }
//     }
//     checkBiometricStatus()
//   }, [])

//   // Start camera for face verification
//   const startCamera = async () => {
//     try {
//       setError('')
//       setShowCamera(true)
//       setIsCapturing(true)

//       // Request camera permissions
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           facingMode: 'user',
//           width: { ideal: 320 },
//           height: { ideal: 240 },
//         },
//         audio: false,
//       })

//       streamRef.current = stream

//       if (videoRef.current) {
//         videoRef.current.srcObject = stream
//         // Auto-capture after 2 seconds
//         setTimeout(() => {
//           captureFacePhoto()
//         }, 2000)
//       }
//     } catch (err) {
//       console.error('Camera error:', err)
//       setError('Camera permission denied. Please allow camera access.')
//       setShowCamera(false)
//       setIsCapturing(false)
//     }
//   }

//   // Capture face photo - OPTIMIZED FOR GEMINI
//   const captureFacePhoto = () => {
//     if (!videoRef.current || !canvasRef.current) {
//       setError('Camera not ready')
//       return
//     }

//     const video = videoRef.current
//     const canvas = canvasRef.current
//     const context = canvas.getContext('2d')

//     // Set canvas size - IMPORTANT: Same as registration
//     canvas.width = 320
//     canvas.height = 240

//     // Draw video frame to canvas
//     context.drawImage(video, 0, 0, canvas.width, canvas.height)

//     // Better quality, same as registration
//     const faceImage = canvas.toDataURL('image/jpeg', 0.7) // 70% quality

//     console.log('📸 Face captured for Gemini, length:', faceImage.length)

//     setCapturedFace(faceImage)

//     // Stop camera
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach((track) => track.stop())
//       streamRef.current = null
//     }

//     setShowCamera(false)
//     setIsCapturing(false)
//   }

//   // ✅ NEW: Real fingerprint verification using WebAuthn
//   const verifyFingerprint = async () => {
//     try {
//       // Check browser support
//       if (!browserSupportsWebAuthn()) {
//         setError('Biometric authentication not supported on this browser')
//         return false
//       }

//       setLoading(true)
//       setError('')

//       const token = localStorage.getItem('token')

//       // Step 1: Get authentication challenge from backend
//       const optionsResponse = await api.get('/biometric/fingerprint-options', {
//         headers: { Authorization: `Bearer ${token}` },
//       })

//       // Step 2: Trigger actual device biometric (Touch ID, Face ID, Windows Hello, etc.)
//       const authResult = await startAuthentication(optionsResponse.data)

//       // Step 3: Verify with backend
//       const verificationResponse = await api.post(
//         '/biometric/verify-fingerprint',
//         { authResult },
//         { headers: { Authorization: `Bearer ${token}` } }
//       )

//       setLoading(false)

//       if (verificationResponse.data.verified) {
//         setFingerprintVerified(true)
//         return true
//       } else {
//         setError('Biometric verification failed. Please try again.')
//         return false
//       }
//     } catch (err) {
//       console.error('Fingerprint error:', err)
//       setLoading(false)

//       if (err.name === 'NotAllowedError') {
//         setError('Biometric authentication was cancelled or denied')
//       } else if (err.response?.data?.message) {
//         setError(err.response.data.message)
//       } else {
//         setError('Biometric authentication failed. Please try again.')
//       }

//       return false
//     }
//   }

//   // Process withdrawal - UPDATED FOR GEMINI
//   const processWithdrawal = async () => {
//     setError('')
//     setSuccess('')
//     const amt = Number(amount)

//     if (!amt || amt <= 0) {
//       setError('Enter a valid amount.')
//       return
//     }

//     if (!pin || pin.length < 4) {
//       setError('Enter your transaction PIN.')
//       return
//     }

//     const token = localStorage.getItem('token')
//     if (!token) {
//       setError('Please login again.')
//       navigate('/login')
//       return
//     }

//     setLoading(true)

//     try {
//       const threshold = 5000
//       let biometricData = null
//       let biometricType = null

//       // If amount >= 5000, we need face verification
//       if (amt >= threshold) {
//         if (!capturedFace) {
//           setError('Please capture your face for verification.')
//           setLoading(false)
//           return
//         }

//         biometricData = capturedFace
//         biometricType = 'face'
//       }

//       // Send withdrawal request to backend (which calls Gemini)
//       console.log('🚀 Sending withdrawal request to backend...')

//       const response = await api.post(
//         '/wallet/withdraw',
//         {
//           amount: amt,
//           pin: pin,
//           biometricData: biometricData,
//           biometricType: biometricType,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       )

//       console.log('✅ Withdrawal successful:', response.data)

//       // Update balance in localStorage
//       localStorage.setItem('balance', String(response.data.balance))

//       setSuccess(
//         `₹${amt} withdrawn successfully! New balance: ₹${response.data.balance}`
//       )

//       // Reset form after 3 seconds
//       setTimeout(() => {
//         setAmount('')
//         setPin('')
//         setCapturedFace(null)
//         setStep(1)
//         setSuccess('')
//         setFingerprintVerified(false)
//         navigate('/dashboard')
//       }, 3000)
//     } catch (err) {
//       console.error('❌ Withdrawal error:', err.response?.data || err.message)

//       // Show user-friendly error
//       if (err.response?.data?.message) {
//         setError(err.response.data.message)
//       } else if (err.message.includes('Network Error')) {
//         setError('Network error. Please check your connection.')
//       } else {
//         setError('Withdrawal failed. Please try again.')
//       }

//       // Reset face capture on error
//       setCapturedFace(null)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleNextFromAmount = () => {
//     setError('')
//     const amt = Number(amount)

//     if (!amt || amt <= 0) {
//       setError('Enter a valid amount greater than 0.')
//       return
//     }

//     const balance = Number(localStorage.getItem('balance') || 0)
//     if (amt > balance) {
//       setError(`Insufficient balance. Available: ₹${balance}`)
//       return
//     }

//     // For high value transactions, ensure both biometrics are registered
//     if (amt >= 5000) {
//       if (!biometricStatus.faceRegistered) {
//         setError(
//           'Withdrawals above ₹5000 require face registration. Please register your face in Settings first.'
//         )
//         return
//       }
//       if (!biometricStatus.fingerprintRegistered) {
//         setError(
//           'Withdrawals above ₹5000 require fingerprint registration. Please register your fingerprint in Settings first.'
//         )
//         return
//       }
//     }

//     setStep(2)
//   }

//   const handleNextFromPin = () => {
//     setError('')
//     if (!pin || pin.length < 4) {
//       setError('Enter your 4 or 6 digit transaction PIN.')
//       return
//     }

//     const amt = Number(amount)

//     if (amt >= 5000) {
//       // For high value withdrawals → fingerprint + face
//       setFingerprintVerified(false)
//       setCapturedFace(null)
//       setStep(3)
//     } else {
//       // For small amounts: PIN → direct withdraw
//       processWithdrawal()
//     }
//   }

//   const handleBack = () => {
//     if (step === 1) {
//       navigate('/dashboard')
//     } else {
//       setStep(step - 1)
//       setError('')
//       setShowCamera(false)
//       setCapturedFace(null)
//       setFingerprintVerified(false)
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach((track) => track.stop())
//         streamRef.current = null
//       }
//     }
//   }

//   // Cancel camera
//   const cancelCamera = () => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach((track) => track.stop())
//       streamRef.current = null
//     }
//     setShowCamera(false)
//     setIsCapturing(false)
//   }

//   // Retake photo
//   const retakePhoto = () => {
//     setCapturedFace(null)
//     startCamera()
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
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//                 />
//               </svg>
//             </div>
//             <div>
//               <p className="text-xs text-gray-400 uppercase tracking-wide">
//                 SecureATM
//               </p>
//               <p className="text-sm font-semibold">Withdraw Cash</p>
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
//             <span className={step >= 1 ? 'text-emerald-300' : ''}>
//               1. Amount
//             </span>
//             <span className={step >= 2 ? 'text-emerald-300' : ''}>2. PIN</span>
//             <span className={step >= 3 ? 'text-emerald-300' : ''}>
//               3. {Number(amount) >= 5000 ? 'Biometric Verify' : 'Confirm'}
//             </span>
//           </div>

//           {error && (
//             <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/40 rounded-lg px-3 py-2">
//               ⚠️ {error}
//             </div>
//           )}

//           {success && (
//             <div className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/40 rounded-lg px-3 py-2">
//               ✅ {success}
//             </div>
//           )}

//           {/* Step 1: Amount */}
//           {step === 1 && (
//             <div className="space-y-4 text-xs sm:text-sm">
//               <h1 className="text-lg sm:text-xl font-semibold">
//                 Enter withdrawal amount
//               </h1>
//               <p className="text-gray-400">
//                 Available balance: ₹{localStorage.getItem('balance') || '0'}
//               </p>

//               <div className="space-y-1.5">
//                 <label className="block text-gray-300">Amount (₹)</label>
//                 <input
//                   type="number"
//                   min="1"
//                   max={localStorage.getItem('balance') || 0}
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                   className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
//                   placeholder="Enter amount"
//                 />
//               </div>

//               {Number(amount) >= 5000 && (
//                 <div className="text-xs text-amber-300 bg-amber-500/10 border border-dashed border-amber-500/30 rounded-lg p-3">
//                   ⚠️ Withdrawals above ₹5000 require biometric verification (fingerprint + face)
//                   {(!biometricStatus.faceRegistered || !biometricStatus.fingerprintRegistered) && (
//                     <p className="mt-1 text-amber-200">
//                       Please register your biometrics in Settings first.
//                     </p>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Step 2: PIN */}
//           {step === 2 && (
//             <div className="space-y-4 text-xs sm:text-sm">
//               <h1 className="text-lg sm:text-xl font-semibold">
//                 Confirm with PIN
//               </h1>
//               <p className="text-gray-400">
//                 Enter your transaction PIN to authorize this withdrawal.
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

//           {/* Step 3: Biometric or Confirm */}
//           {step === 3 && (
//             <div className="space-y-4 text-xs sm:text-sm">
//               {Number(amount) >= 5000 ? (
//                 !fingerprintVerified ? (
//                   // ✅ REAL Fingerprint verification using WebAuthn
//                   <>
//                     <h1 className="text-lg sm:text-xl font-semibold">
//                       Fingerprint Verification
//                     </h1>
//                     <p className="text-gray-400 mb-4">
//                       Use your device's biometric sensor (Touch ID, Face ID, or fingerprint scanner) to authorize this withdrawal.
//                     </p>

//                     <div className="flex flex-col items-center gap-4 py-4">
//                       <div className="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
//                         <svg
//                           className="h-10 w-10 text-black"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="1.8"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M12 11.5c1.657 0 3-1.343 3-3V8a3 3 0 10-6 0v.5c0 1.657 1.343 3 3 3z"
//                           />
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M8.25 11.75A4.75 4.75 0 0113 6.97M5.5 15.25A7.25 7.25 0 0115 7.22M4 19.25A9.25 9.25 0 0117.5 8.5"
//                           />
//                         </svg>
//                       </div>
//                       <p className="text-[11px] text-gray-400 text-center max-w-xs">
//                         {loading ? 'Please complete biometric authentication on your device...' : 'Click below to authenticate using your device biometric'}
//                       </p>
//                       <button
//                         type="button"
//                         onClick={verifyFingerprint}
//                         disabled={loading}
//                         className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold text-xs sm:text-sm hover:brightness-110 disabled:opacity-50"
//                       >
//                         {loading ? 'Authenticating...' : 'Authenticate with Biometric'}
//                       </button>
//                     </div>
//                   </>
//                 ) : (
//                   // AFTER fingerprint: Face verification (existing UI)
//                   <>
//                     <h1 className="text-lg sm:text-xl font-semibold">
//                       Face Verification
//                     </h1>
//                     <p className="text-gray-400">
//                       Look at the camera. Face will be automatically captured
//                       in 2 seconds.
//                     </p>

//                     {showCamera ? (
//                       <div className="space-y-3">
//                         <div className="relative rounded-lg overflow-hidden border-2 border-dashed border-amber-400 bg-black">
//                           <video
//                             ref={videoRef}
//                             autoPlay
//                             playsInline
//                             muted
//                             className="w-full h-48 object-cover"
//                           />
//                           <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-1 px-2">
//                             <p className="text-[10px] text-white text-center">
//                               Capturing in 2 seconds...
//                             </p>
//                           </div>
//                         </div>
//                         <button
//                           onClick={cancelCamera}
//                           className="w-full px-4 py-2 text-xs rounded-lg bg-gray-800 text-gray-300 border border-dashed border-gray-700 hover:bg-gray-700"
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     ) : capturedFace ? (
//                       <div className="space-y-3">
//                         <div className="relative rounded-lg overflow-hidden border border-dashed border-amber-400/50 bg-black">
//                           <img
//                             src={capturedFace}
//                             alt="Captured face"
//                             className="w-full h-48 object-cover"
//                           />
//                           <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-1 px-2">
//                             <p className="text-[10px] text-amber-300 text-center">
//                               Ready for verification with Gemini AI
//                             </p>
//                           </div>
//                         </div>
//                         <div className="flex gap-2">
//                           <button
//                             onClick={processWithdrawal}
//                             disabled={loading}
//                             className="flex-1 px-4 py-2 text-xs rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 text-black font-semibold hover:brightness-110 transition disabled:opacity-50"
//                           >
//                             {loading ? (
//                               <span className="flex items-center justify-center gap-2">
//                                 <svg
//                                   className="animate-spin h-4 w-4"
//                                   fill="none"
//                                   viewBox="0 0 24 24"
//                                 >
//                                   <circle
//                                     className="opacity-25"
//                                     cx="12"
//                                     cy="12"
//                                     r="10"
//                                     stroke="currentColor"
//                                     strokeWidth="4"
//                                   />
//                                   <path
//                                     className="opacity-75"
//                                     fill="currentColor"
//                                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                                   />
//                                 </svg>
//                                 Verifying with Gemini...
//                               </span>
//                             ) : (
//                               'Verify & Withdraw'
//                             )}
//                           </button>
//                           <button
//                             onClick={retakePhoto}
//                             disabled={loading}
//                             className="flex-1 px-4 py-2 text-xs rounded-lg bg-gray-800 text-gray-300 border border-dashed border-gray-700 hover:bg-gray-700 disabled:opacity-50"
//                           >
//                             Retake
//                           </button>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="text-center py-4">
//                         <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center mb-4">
//                           <svg
//                             className="h-10 w-10 text-black"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
//                             />
//                           </svg>
//                         </div>
//                         <p className="text-[11px] text-gray-400 mb-4">
//                           Click below to start face verification
//                         </p>
//                         <button
//                           onClick={startCamera}
//                           className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 text-black font-semibold text-sm hover:brightness-110"
//                         >
//                           Start Face Verification
//                         </button>
//                       </div>
//                     )}
//                   </>
//                 )
//               ) : (
//                 // amount < 5000 → Confirm Withdrawal
//                 <>
//                   <h1 className="text-lg sm:text-xl font-semibold">
//                     Confirm Withdrawal
//                   </h1>
//                   <div className="bg-[#151515] rounded-lg border border-dashed border-gray-700 p-4">
//                     <div className="space-y-2">
//                       <div className="flex justify-between">
//                         <span className="text-gray-400">Amount:</span>
//                         <span className="font-semibold">₹{amount}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-400">Service Charge:</span>
//                         <span className="text-emerald-300">₹0</span>
//                       </div>
//                       <div className="border-t border-dashed border-gray-700 pt-2 mt-2 flex justify-between">
//                         <span className="text-gray-400">Total:</span>
//                         <span className="font-semibold text-lg">
//                           ₹{amount}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           )}

//           {/* Actions */}
//           <div className="flex items-center justify-between pt-3">
//             <button
//               type="button"
//               onClick={handleBack}
//               className="px-4 py-2 rounded-lg border border-dashed border-gray-700 text-gray-300 text-xs sm:text-sm hover:border-gray-500 disabled:opacity-50"
//               disabled={loading || isCapturing}
//             >
//               {step === 1 ? 'Cancel' : 'Back'}
//             </button>

//             {step === 1 && (
//               <button
//                 type="button"
//                 onClick={handleNextFromAmount}
//                 disabled={!amount || Number(amount) <= 0}
//                 className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold text-xs sm:text-sm hover:brightness-110 disabled:opacity-60"
//               >
//                 Continue
//               </button>
//             )}

//             {step === 2 && (
//               <button
//                 type="button"
//                 onClick={handleNextFromPin}
//                 disabled={!pin || pin.length < 4}
//                 className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold text-xs sm:text-sm hover:brightness-110 disabled:opacity-60"
//               >
//                 Continue
//               </button>
//             )}

//             {step === 3 && Number(amount) < 5000 && (
//               <button
//                 type="button"
//                 onClick={processWithdrawal}
//                 disabled={loading}
//                 className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold text-xs sm:text-sm hover:brightness-110 disabled:opacity-60"
//               >
//                 {loading ? 'Processing...' : 'Confirm Withdrawal'}
//               </button>
//             )}
//           </div>
//         </div>
//       </main>

//       {/* Hidden canvas */}
//       <canvas ref={canvasRef} className="hidden" />
//     </div>
//   )
// }

// export default WithdrawPage






// src/pages/WithdrawPage.jsx - FINAL FIXED VERSION
import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { browserSupportsWebAuthn, startAuthentication } from '@simplewebauthn/browser'


function WithdrawPage() {
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  const [amount, setAmount] = useState('')
  const [pin, setPin] = useState('')
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showCamera, setShowCamera] = useState(false)
  const [capturedFace, setCapturedFace] = useState(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [biometricStatus, setBiometricStatus] = useState({
    faceRegistered: false,
    fingerprintRegistered: false,
  })
  
  const [chosenBiometric, setChosenBiometric] = useState(null)
  const [biometricVerified, setBiometricVerified] = useState(false)
  const [biometricToken, setBiometricToken] = useState(null)
  const [threshold, setThreshold] = useState(5000)

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  // Check biometric status on mount
  useEffect(() => {
    const checkBiometricStatus = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        const response = await api.get('/biometric/status', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setBiometricStatus({
          faceRegistered: response.data.faceRegistered || false,
          fingerprintRegistered: response.data.webAuthnRegistered || false,
        })

        const settingsRes = await api.get('/settings/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        
        if (settingsRes.data.biometricThreshold !== undefined) {
          setThreshold(settingsRes.data.biometricThreshold)
        } else if (settingsRes.data.securitySettings?.biometricThreshold !== undefined) {
          setThreshold(settingsRes.data.securitySettings.biometricThreshold)
        }
        
      } catch (err) {
        console.error('Error checking biometric status:', err)
      }
    }
    checkBiometricStatus()
  }, [])

  // Start camera for face verification
  const startCamera = async () => {
    try {
      setError('')
      setShowCamera(true)
      setIsCapturing(true)

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 320 },
          height: { ideal: 240 },
        },
        audio: false,
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          setTimeout(captureFacePhoto, 2000)
        }
      }
    } catch (err) {
      console.error('Camera error:', err)
      setError('Camera permission denied. Please allow camera access.')
      setShowCamera(false)
      setIsCapturing(false)
    }
  }

  const captureFacePhoto = () => {
    if (!videoRef.current || !canvasRef.current) {
      setError('Camera not ready')
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    canvas.width = 320
    canvas.height = 240

    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const faceImage = canvas.toDataURL('image/jpeg', 0.7)

    console.log('📸 Face captured for verification, length:', faceImage.length)

    setCapturedFace(faceImage)

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    setShowCamera(false)
    setIsCapturing(false)
  }
// ✅ Real fingerprint verification using WebAuthn
const verifyFingerprint = async () => {
  try {
    console.log('🔐 [1/4] Checking WebAuthn support...')
    
    if (!browserSupportsWebAuthn()) {
      setError('Biometric authentication not supported on this browser')
      return false
    }

    console.log('✅ WebAuthn is supported')

    setLoading(true)
    setError('')

    const token = localStorage.getItem('token')

    console.log('🔐 [2/4] Fetching authentication options from backend...')
    
    const optionsResponse = await api.get('/biometric/fingerprint-options', {
      headers: { Authorization: `Bearer ${token}` },
    })

    console.log('✅ Got options from backend:', optionsResponse.data)
    console.log('🔐 [3/4] Triggering native biometric prompt...')
    console.log('⚠️ NATIVE POPUP SHOULD APPEAR NOW!')

    // This line should trigger the native fingerprint/Face ID prompt
    const authResult = await startAuthentication(optionsResponse.data)

    console.log('✅ User completed biometric! Result:', authResult)
    console.log('🔐 [4/4] Sending verification to backend...')

    const verificationResponse = await api.post(
      '/biometric/verify-fingerprint',
      { authResult },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    console.log('✅ Backend verification response:', verificationResponse.data)

    setLoading(false)

    if (verificationResponse.data.verified) {
      console.log('🎉 Fingerprint verified successfully!')
      setBiometricVerified(true)
      setBiometricToken(verificationResponse.data.biometricToken)
      return true
    } else {
      setError('Biometric verification failed. Please try again.')
      return false
    }
  } catch (err) {
    console.error('❌ Fingerprint verification error:', err)
    console.error('Error name:', err.name)
    console.error('Error message:', err.message)
    console.error('Full error:', err)
    
    setLoading(false)

    if (err.name === 'NotAllowedError') {
      setError('Biometric authentication was cancelled')
    } else if (err.name === 'AbortError') {
      setError('Biometric authentication was denied or timed out')
    } else if (err.name === 'NotSupportedError') {
      setError('Biometric authentication not supported on this device')
    } else if (err.response?.data?.message) {
      setError(err.response.data.message)
    } else {
      setError(`Biometric authentication failed: ${err.message}`)
    }

    return false
  }
}

  // ✅ Process withdrawal with chosen biometric method
  const processWithdrawal = async () => {
    setError('')
    setSuccess('')
    const amt = Number(amount)

    if (!amt || amt <= 0) {
      setError('Enter a valid amount.')
      return
    }

    if (!pin || pin.length < 4) {
      setError('Enter your transaction PIN.')
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      setError('Please login again.')
      navigate('/login')
      return
    }

    setLoading(true)

    try {
      let requestBody = {
        amount: amt,
        pin: pin,
      }

      // ✅ If amount >= threshold, include the chosen biometric data
      if (amt >= threshold) {
        if (chosenBiometric === 'fingerprint') {
          if (!biometricToken) {
            setError('Fingerprint verification required.')
            setLoading(false)
            return
          }
          requestBody.biometricToken = biometricToken
        } else if (chosenBiometric === 'face') {
          if (!capturedFace) {
            setError('Face verification required.')
            setLoading(false)
            return
          }
          requestBody.faceData = capturedFace
        }
      }

      console.log('🚀 Sending withdrawal request with biometric:', chosenBiometric)

      const response = await api.post('/wallet/withdraw', requestBody, {
        headers: { Authorization: `Bearer ${token}` },
      })

      console.log('✅ Withdrawal successful:', response.data)

      localStorage.setItem('balance', String(response.data.balance))

      setSuccess(
        `₹${amt.toLocaleString('en-IN')} withdrawn successfully! New balance: ₹${response.data.balance.toLocaleString('en-IN')}`
      )

      setTimeout(() => {
        setAmount('')
        setPin('')
        setCapturedFace(null)
        setStep(1)
        setSuccess('')
        setBiometricVerified(false)
        setBiometricToken(null)
        setChosenBiometric(null)
        navigate('/dashboard')
      }, 3000)
    } catch (err) {
      console.error('❌ Withdrawal error:', err.response?.data || err.message)

      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err.message.includes('Network Error')) {
        setError('Network error. Please check your connection.')
      } else {
        setError('Withdrawal failed. Please try again.')
      }

      setCapturedFace(null)
      setBiometricToken(null)
      setBiometricVerified(false)
    } finally {
      setLoading(false)
    }
  }

  const handleNextFromAmount = () => {
    setError('')
    const amt = Number(amount)

    if (!amt || amt <= 0) {
      setError('Enter a valid amount greater than 0.')
      return
    }

    const balance = Number(localStorage.getItem('balance') || 0)
    if (amt > balance) {
      setError(`Insufficient balance. Available: ₹${balance.toLocaleString('en-IN')}`)
      return
    }

    if (amt >= threshold) {
      if (!biometricStatus.faceRegistered && !biometricStatus.fingerprintRegistered) {
        setError(
          `Withdrawals above ₹${threshold.toLocaleString('en-IN')} require biometric verification. Please register your fingerprint or face in Settings first.`
        )
        return
      }
    }

    setStep(2)
  }

  const handleNextFromPin = () => {
    setError('')
    if (!pin || pin.length < 4) {
      setError('Enter your 4 or 6 digit transaction PIN.')
      return
    }

    const amt = Number(amount)

    if (amt >= threshold) {
      setBiometricVerified(false)
      setCapturedFace(null)
      setBiometricToken(null)
      setChosenBiometric(null)
      setStep(3)
    } else {
      processWithdrawal()
    }
  }

  const handleBack = () => {
    if (step === 1) {
      navigate('/dashboard')
    } else if (step === 3 && chosenBiometric !== null) {
      // ✅ FIX: If biometric method is chosen, go back to choice screen
      setChosenBiometric(null)
      setCapturedFace(null)
      setBiometricToken(null)
      setBiometricVerified(false)
      setError('')
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
      setShowCamera(false)
    } else {
      setStep(step - 1)
      setError('')
      setShowCamera(false)
      setCapturedFace(null)
      setBiometricVerified(false)
      setBiometricToken(null)
      setChosenBiometric(null)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
    }
  }

  const cancelCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setShowCamera(false)
    setIsCapturing(false)
  }

  const retakePhoto = () => {
    setCapturedFace(null)
    startCamera()
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                SecureATM
              </p>
              <p className="text-sm font-semibold">Withdraw Cash</p>
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
            <span className={step >= 1 ? 'text-emerald-300' : ''}>
              1. Amount
            </span>
            <span className={step >= 2 ? 'text-emerald-300' : ''}>2. PIN</span>
            <span className={step >= 3 ? 'text-emerald-300' : ''}>
              3. {Number(amount) >= threshold ? 'Biometric' : 'Confirm'}
            </span>
          </div>

          {error && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/40 rounded-lg px-3 py-2">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/40 rounded-lg px-3 py-2">
              ✅ {success}
            </div>
          )}

          {/* Step 1: Amount */}
          {step === 1 && (
            <div className="space-y-4 text-xs sm:text-sm">
              <h1 className="text-lg sm:text-xl font-semibold">
                Enter withdrawal amount
              </h1>
              <p className="text-gray-400">
                Available balance: ₹{Number(localStorage.getItem('balance') || 0).toLocaleString('en-IN')}
              </p>

              <div className="space-y-1.5">
                <label className="block text-gray-300">Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  max={localStorage.getItem('balance') || 0}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
                  placeholder="Enter amount"
                />
              </div>

              {Number(amount) >= threshold && (
                <div className="text-xs text-amber-300 bg-amber-500/10 border border-dashed border-amber-500/30 rounded-lg p-3">
                  🔒 Withdrawals above ₹{threshold.toLocaleString('en-IN')} require biometric verification
                  {(!biometricStatus.faceRegistered && !biometricStatus.fingerprintRegistered) && (
                    <p className="mt-1 text-amber-200">
                      Please register at least one biometric method in Settings first.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 2: PIN */}
          {step === 2 && (
            <div className="space-y-4 text-xs sm:text-sm">
              <h1 className="text-lg sm:text-xl font-semibold">
                Confirm with PIN
              </h1>
              <p className="text-gray-400">
                Enter your transaction PIN to authorize this withdrawal.
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

          {/* Step 3: Biometric Choice or Confirm */}
          {step === 3 && (
            <div className="space-y-4 text-xs sm:text-sm">
              {Number(amount) >= threshold ? (
                !chosenBiometric ? (
                  // ✅ BIOMETRIC CHOICE SCREEN
                  <>
                    <h1 className="text-lg sm:text-xl font-semibold">
                      Choose Verification Method
                    </h1>
                    <p className="text-gray-400 mb-4">
                      Select how you'd like to verify this withdrawal.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Fingerprint Option */}
                      {biometricStatus.fingerprintRegistered && (
                        <button
                          onClick={() => setChosenBiometric('fingerprint')}
                          className="p-5 rounded-xl border-2 border-dashed border-emerald-500/60 bg-[#141414] hover:bg-[#1a1a1a] transition text-center"
                        >
                          <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-3">
                            <svg
                              className="h-8 w-8 text-black"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 11.5c1.657 0 3-1.343 3-3V8a3 3 0 10-6 0v.5c0 1.657 1.343 3 3 3z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.25 11.75A4.75 4.75 0 0113 6.97M5.5 15.25A7.25 7.25 0 0115 7.22M4 19.25A9.25 9.25 0 0117.5 8.5"
                              />
                            </svg>
                          </div>
                          <p className="font-semibold text-white mb-1">Fingerprint</p>
                          <p className="text-[10px] text-gray-400">
                            Use device biometric sensor
                          </p>
                        </button>
                      )}

                      {/* Face Option */}
                      {biometricStatus.faceRegistered && (
                        <button
                          onClick={() => setChosenBiometric('face')}
                          className="p-5 rounded-xl border-2 border-dashed border-amber-500/70 bg-[#141414] hover:bg-[#1a1a1a] transition text-center"
                        >
                          <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-3">
                            <svg
                              className="h-8 w-8 text-black"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <p className="font-semibold text-white mb-1">Face Recognition</p>
                          <p className="text-[10px] text-gray-400">
                            Verify with camera
                          </p>
                        </button>
                      )}
                    </div>

                    {!biometricStatus.fingerprintRegistered && !biometricStatus.faceRegistered && (
                      <div className="text-center py-6 text-gray-400">
                        <p className="mb-2">No biometric methods registered</p>
                        <button
                          onClick={() => navigate('/settings')}
                          className="text-emerald-300 hover:underline"
                        >
                          Go to Settings →
                        </button>
                      </div>
                    )}
                  </>
                ) : chosenBiometric === 'fingerprint' && !biometricVerified ? (
                  // ✅ FINGERPRINT VERIFICATION
                  <>
                    <h1 className="text-lg sm:text-xl font-semibold">
                      Fingerprint Verification
                    </h1>
                    <p className="text-gray-400 mb-4">
                      Use your device's biometric sensor to authorize this withdrawal.
                    </p>

                    <div className="flex flex-col items-center gap-4 py-4">
                      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <svg
                          className="h-10 w-10 text-black"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 11.5c1.657 0 3-1.343 3-3V8a3 3 0 10-6 0v.5c0 1.657 1.343 3 3 3z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 11.75A4.75 4.75 0 0113 6.97M5.5 15.25A7.25 7.25 0 0115 7.22M4 19.25A9.25 9.25 0 0117.5 8.5"
                          />
                        </svg>
                      </div>
                      <p className="text-[11px] text-gray-400 text-center max-w-xs">
                        {loading ? 'Please complete biometric authentication on your device...' : 'Click below to authenticate'}
                      </p>
                      <button
                        type="button"
                        onClick={async () => {
                          const success = await verifyFingerprint()
                          if (success) {
                            setTimeout(() => processWithdrawal(), 500)
                          }
                        }}
                        disabled={loading}
                        className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold text-xs sm:text-sm hover:brightness-110 disabled:opacity-50 flex items-center gap-2"
                      >
                        {loading ? (
                          <>
                            <svg
                              className="animate-spin h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Authenticating...
                          </>
                        ) : (
                          'Authenticate with Biometric'
                        )}
                      </button>
                    </div>
                  </>
                ) : chosenBiometric === 'face' ? (
                  // ✅ FACE VERIFICATION
                  <>
                    <h1 className="text-lg sm:text-xl font-semibold">
                      Face Verification
                    </h1>
                    <p className="text-gray-400">
                      Look at the camera. Face will be captured in 2 seconds.
                    </p>

                    {showCamera ? (
                      <div className="space-y-3">
                        <div className="relative rounded-lg overflow-hidden border-2 border-dashed border-amber-400 bg-black">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-1 px-2">
                            <p className="text-[10px] text-white text-center">
                              Capturing in 2 seconds...
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={cancelCamera}
                          className="w-full px-4 py-2 text-xs rounded-lg bg-gray-800 text-gray-300 border border-dashed border-gray-700 hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : capturedFace ? (
                      <div className="space-y-3">
                        <div className="relative rounded-lg overflow-hidden border border-dashed border-amber-400/50 bg-black">
                          <img
                            src={capturedFace}
                            alt="Captured face"
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-1 px-2">
                            <p className="text-[10px] text-amber-300 text-center">
                              Ready for verification
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={processWithdrawal}
                            disabled={loading}
                            className="flex-1 px-4 py-2 text-xs rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 text-black font-semibold hover:brightness-110 transition disabled:opacity-50"
                          >
                            {loading ? (
                              <span className="flex items-center justify-center gap-2">
                                <svg
                                  className="animate-spin h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  />
                                </svg>
                                Verifying...
                              </span>
                            ) : (
                              'Verify & Withdraw'
                            )}
                          </button>
                          <button
                            onClick={retakePhoto}
                            disabled={loading}
                            className="flex-1 px-4 py-2 text-xs rounded-lg bg-gray-800 text-gray-300 border border-dashed border-gray-700 hover:bg-gray-700 disabled:opacity-50"
                          >
                            Retake
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center mb-4">
                          <svg
                            className="h-10 w-10 text-black"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                            />
                          </svg>
                        </div>
                        <p className="text-[11px] text-gray-400 mb-4">
                          Click below to start face verification
                        </p>
                        <button
                          onClick={startCamera}
                          className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 text-black font-semibold text-sm hover:brightness-110"
                        >
                          Start Face Verification
                        </button>
                      </div>
                    )}
                  </>
                ) : null
              ) : (
                // amount < threshold → Confirm Withdrawal
                <>
                  <h1 className="text-lg sm:text-xl font-semibold">
                    Confirm Withdrawal
                  </h1>
                  <div className="bg-[#151515] rounded-lg border border-dashed border-gray-700 p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Amount:</span>
                        <span className="font-semibold">₹{Number(amount).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Service Charge:</span>
                        <span className="text-emerald-300">₹0</span>
                      </div>
                      <div className="border-t border-dashed border-gray-700 pt-2 mt-2 flex justify-between">
                        <span className="text-gray-400">Total:</span>
                        <span className="font-semibold text-lg">
                          ₹{Number(amount).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-3">
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 rounded-lg border border-dashed border-gray-700 text-gray-300 text-xs sm:text-sm hover:border-gray-500 disabled:opacity-50"
              disabled={loading || isCapturing}
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </button>

            {step === 1 && (
              <button
                type="button"
                onClick={handleNextFromAmount}
                disabled={!amount || Number(amount) <= 0}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold text-xs sm:text-sm hover:brightness-110 disabled:opacity-60"
              >
                Continue
              </button>
            )}

            {step === 2 && (
              <button
                type="button"
                onClick={handleNextFromPin}
                disabled={!pin || pin.length < 4}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold text-xs sm:text-sm hover:brightness-110 disabled:opacity-60"
              >
                Continue
              </button>
            )}

            {step === 3 && Number(amount) < threshold && (
              <button
                type="button"
                onClick={processWithdrawal}
                disabled={loading}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold text-xs sm:text-sm hover:brightness-110 disabled:opacity-60"
              >
                {loading ? 'Processing...' : 'Confirm Withdrawal'}
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Hidden canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}

export default WithdrawPage



















































 