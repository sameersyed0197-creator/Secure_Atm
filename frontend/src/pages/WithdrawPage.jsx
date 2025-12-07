// // src/pages/WithdrawPage.jsx
// import React, { useState, useRef, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import api from '../services/api'

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
//     fingerprintRegistered: false
//   })

//   // Check biometric status on mount
//   useEffect(() => {
//     const checkBiometricStatus = async () => {
//       try {
//         const token = localStorage.getItem('token')
//         if (!token) return

//         const response = await api.get('/biometric/status', {
//           headers: { Authorization: `Bearer ${token}` }
//         })
//         setBiometricStatus({
//           faceRegistered: response.data.faceRegistered || false,
//           fingerprintRegistered: response.data.fingerprintRegistered || false
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
//           height: { ideal: 240 }
//         },
//         audio: false
//       })
      
//       streamRef.current = stream
      
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream
//         // Auto-capture after 3 seconds
//         setTimeout(() => {
//           captureFacePhoto()
//         }, 3000)
//       }
//     } catch (err) {
//       console.error('Camera error:', err)
//       setError('Camera permission denied. Please allow camera access.')
//       setShowCamera(false)
//       setIsCapturing(false)
//     }
//   }

//   // Capture face photo
//   const captureFacePhoto = () => {
//     if (!videoRef.current || !canvasRef.current) {
//       setError('Camera not ready')
//       return
//     }

//     const video = videoRef.current
//     const canvas = canvasRef.current
//     const context = canvas.getContext('2d')

//     // Set smaller canvas size to reduce data size
//     canvas.width = 320
//     canvas.height = 240

//     // Draw video frame to canvas
//     context.drawImage(video, 0, 0, canvas.width, canvas.height)

//     // Get image as data URL with lower quality
//     const faceImage = canvas.toDataURL('image/jpeg', 0.5) // 50% quality
//     setCapturedFace(faceImage)
    
//     console.log('Face captured, length:', faceImage.length)
    
//     // Stop camera
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach(track => track.stop())
//       streamRef.current = null
//     }
    
//     setShowCamera(false)
//     setIsCapturing(false)
//   }

//   // Verify captured face with backend
//   const verifyFace = async () => {
//     if (!capturedFace) {
//       setError('Please capture your face first.')
//       return false
//     }

//     setLoading(true)
//     setError('')

//     try {
//       const token = localStorage.getItem('token')
      
//       console.log('Verifying face...')
//       const response = await api.post('/biometric/verify-face', {
//         faceData: capturedFace
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       })

//       console.log('Verification response:', response.data)
      
//       if (response.data.success && response.data.verified) {
//         return true
//       } else {
//         setError('Face verification failed. Please try again.')
//         setCapturedFace(null)
//         return false
//       }
//     } catch (err) {
//       console.error('Verify face error:', err)
//       setError(err.response?.data?.message || 'Verification failed.')
//       return false
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Process withdrawal after face verification
//   const processWithdrawal = async () => {
//     setError('')
//     setSuccess('')
//     const amt = Number(amount)
    
//     if (!amt || amt <= 0) {
//       setError('Enter a valid amount.')
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

//       // If amount >= 5000, verify face first
//       if (amt >= threshold) {
//         // Verify face
//         const isVerified = await verifyFace()
//         if (!isVerified) {
//           setLoading(false)
//           return
//         }
        
//         biometricData = capturedFace
//         biometricType = 'face'
//       }

//       // Send withdrawal request
//       const response = await api.post('/wallet/withdraw', {
//         amount: amt,
//         pin: pin,
//         biometricData: biometricData,
//         biometricType: biometricType
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       })

//       localStorage.setItem('balance', String(response.data.balance))
//       setSuccess(`₹${amt} withdrawn successfully! New balance: ₹${response.data.balance}`)
      
//       // Reset form after 2 seconds
//       setTimeout(() => {
//         setAmount('')
//         setPin('')
//         setCapturedFace(null)
//         setStep(1)
//         setSuccess('')
//         navigate('/dashboard')
//       }, 2000)

//     } catch (err) {
//       console.error('Withdrawal error:', err)
//       setError(err.response?.data?.message || 'Withdrawal failed. Please try again.')
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
    
//     // Check if user has registered face for amounts >= 5000
//     if (amt >= 5000 && !biometricStatus.faceRegistered) {
//       setError(`Withdrawals above ₹5000 require face registration. Please register your face in Settings first.`)
//       return
//     }
    
//     setStep(2)
//   }

//   const handleNextFromPin = () => {
//     setError('')
//     if (!pin || pin.length < 4) {
//       setError('Enter your 4 or 6 digit transaction PIN.')
//       return
//     }
//     setStep(3)
//   }

//   const handleBack = () => {
//     if (step === 1) {
//       navigate('/dashboard')
//     } else {
//       setStep(step - 1)
//       setError('')
//       setShowCamera(false)
//       setCapturedFace(null)
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach(track => track.stop())
//         streamRef.current = null
//       }
//     }
//   }

//   // Cancel camera
//   const cancelCamera = () => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach(track => track.stop())
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
//               <svg className="h-4 w-4 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//               </svg>
//             </div>
//             <div>
//               <p className="text-xs text-gray-400 uppercase tracking-wide">SecureATM</p>
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
//             <span className={step >= 1 ? 'text-emerald-300' : ''}>1. Amount</span>
//             <span className={step >= 2 ? 'text-emerald-300' : ''}>2. PIN</span>
//             <span className={step >= 3 ? 'text-emerald-300' : ''}>3. {Number(amount) >= 5000 ? 'Face Verify' : 'Confirm'}</span>
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
//               <h1 className="text-lg sm:text-xl font-semibold">Enter withdrawal amount</h1>
//               <p className="text-gray-400">
//                 Available balance: ₹{localStorage.getItem('balance') || '0'}
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
              
//               {Number(amount) >= 5000 && (
//                 <div className="text-xs text-amber-300 bg-amber-500/10 border border-dashed border-amber-500/30 rounded-lg p-3">
//                   ⚠️ Withdrawals above ₹5000 require face verification
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Step 2: PIN */}
//           {step === 2 && (
//             <div className="space-y-4 text-xs sm:text-sm">
//               <h1 className="text-lg sm:text-xl font-semibold">Confirm with PIN</h1>
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

//           {/* Step 3: Face Verification or Confirmation */}
//           {step === 3 && (
//             <div className="space-y-4 text-xs sm:text-sm">
//               {Number(amount) >= 5000 ? (
//                 <>
//                   <h1 className="text-lg sm:text-xl font-semibold">Face Verification Required</h1>
//                   <p className="text-gray-400">
//                     For withdrawals above ₹5000, please verify your face.
//                   </p>

//                   {showCamera ? (
//                     <div className="space-y-3">
//                       <div className="relative rounded-lg overflow-hidden border-2 border-dashed border-amber-400 bg-black">
//                         <video
//                           ref={videoRef}
//                           autoPlay
//                           playsInline
//                           muted
//                           className="w-full h*48 object-cover"
//                         />
//                         <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-1 px-2">
//                           <p className="text-[10px] text-white text-center">Camera will capture automatically...</p>
//                         </div>
//                       </div>
//                       <button
//                         onClick={cancelCamera}
//                         className="w-full px-4 py-2 text-xs rounded-lg bg-gray-800 text-gray-300 border border-dashed border-gray-700 hover:bg-gray-700"
//                       >
//                         Cancel Camera
//                       </button>
//                     </div>
//                   ) : capturedFace ? (
//                     <div className="space-y-3">
//                       <div className="relative rounded-lg overflow-hidden border border-dashed border-amber-400/50 bg-black">
//                         <img 
//                           src={capturedFace} 
//                           alt="Captured face" 
//                           className="w-full h-48 object-cover"
//                         />
//                         <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-1 px-2">
//                           <p className="text-[10px] text-amber-300 text-center">Captured Face</p>
//                         </div>
//                       </div>
//                       <div className="flex gap-2">
//                         <button
//                           onClick={processWithdrawal}
//                           disabled={loading}
//                           className="flex-1 px-4 py-2 text-xs rounded-lg bg-amber-500/20 text-amber-300 border border-dashed border-amber-400/70 hover:bg-amber-500/30 transition disabled:opacity-50"
//                         >
//                           {loading ? 'Processing...' : 'Verify & Withdraw'}
//                         </button>
//                         <button
//                           onClick={retakePhoto}
//                           disabled={loading}
//                           className="flex-1 px-4 py-2 text-xs rounded-lg bg-gray-800 text-gray-300 border border-dashed border-gray-700 hover:bg-gray-700 disabled:opacity-50"
//                         >
//                           Retake Photo
//                         </button>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="text-center py-4">
//                       <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center mb-4">
//                         <svg className="h-10 w-10 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
//                         </svg>
//                       </div>
//                       <p className="text-[11px] text-gray-400 mb-4">
//                         Click "Start Face Verification" to begin
//                       </p>
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 <>
//                   <h1 className="text-lg sm:text-xl font-semibold">Confirm Withdrawal</h1>
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
//                         <span className="font-semibold text-lg">₹{amount}</span>
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
//               className="px-4 py-2 rounded-lg border border-dashed border-gray-700 text-gray-300 text-xs sm:text-sm hover:border-gray-500"
//               disabled={loading || isCapturing}
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
//                 onClick={handleNextFromPin}
//                 className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold text-xs sm:text-sm hover:brightness-110"
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

//             {step === 3 && Number(amount) >= 5000 && !showCamera && !capturedFace && (
//               <button
//                 type="button"
//                 onClick={startCamera}
//                 className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 text-black font-semibold text-xs sm:text-sm hover:brightness-110"
//               >
//                 Start Face Verification
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












































// // // src/pages/WithdrawPage.jsx
// // import React, { useState, useRef, useEffect } from 'react'
// // import { useNavigate } from 'react-router-dom'
// // import api from '../services/api'

// // function WithdrawPage() {
// //   const navigate = useNavigate()
// //   const videoRef = useRef(null)
// //   const canvasRef = useRef(null)

// //   const [amount, setAmount] = useState('')
// //   const [pin, setPin] = useState('')
// //   const [step, setStep] = useState(1)
// //   const [loading, setLoading] = useState(false)
// //   const [error, setError] = useState('')
// //   const [success, setSuccess] = useState('')
// //   const [showCamera, setShowCamera] = useState(false)
// //   const [capturedFace, setCapturedFace] = useState(null)
// //   const [biometricStatus, setBiometricStatus] = useState({
// //     faceRegistered: false,
// //     fingerprintRegistered: false
// //   })

// //   // Check biometric status on mount
// //   useEffect(() => {
// //     const checkBiometricStatus = async () => {
// //       try {
// //         const token = localStorage.getItem('token')
// //         if (!token) return

// //         const response = await api.get('/api/biometric/status', {
// //           headers: { Authorization: `Bearer ${token}` }
// //         })
// //         setBiometricStatus({
// //           faceRegistered: response.data.faceRegistered || false,
// //           fingerprintRegistered: response.data.fingerprintRegistered || false
// //         })
// //       } catch (err) {
// //         console.error('Error checking biometric status:', err)
// //       }
// //     }
// //     checkBiometricStatus()
// //   }, [])

// //   // Start camera for face verification
// //   const startCamera = async () => {
// //     try {
// //       const stream = await navigator.mediaDevices.getUserMedia({ 
// //         video: { facingMode: 'user' } 
// //       })
// //       if (videoRef.current) {
// //         videoRef.current.srcObject = stream
// //         setShowCamera(true)
// //       }
// //     } catch  {
// //       setError('Cannot access camera. Please check permissions.')
// //     }
// //   }

// //   // Capture face for verification
// //   const captureAndVerifyFace = async () => {
// //     if (!videoRef.current || !canvasRef.current) {
// //       setError('Camera not ready')
// //       return false
// //     }

// //     const video = videoRef.current
// //     const canvas = canvasRef.current
// //     const context = canvas.getContext('2d')

// //     canvas.width = video.videoWidth
// //     canvas.height = video.videoHeight
// //     context.drawImage(video, 0, 0, canvas.width, canvas.height)

// //     const faceImage = canvas.toDataURL('image/jpeg')
// //     setCapturedFace(faceImage)

// //     // Stop camera
// //     const stream = video.srcObject
// //     if (stream) {
// //       stream.getTracks().forEach(track => track.stop())
// //     }
// //     setShowCamera(false)

// //     return faceImage
// //   }

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

// //   const handleConfirmWithdraw = async () => {
// //     setError('')
// //     setSuccess('')
// //     const amt = Number(amount)
    
// //     if (!amt || amt <= 0) {
// //       setError('Enter a valid amount.')
// //       return
// //     }

// //     const token = localStorage.getItem('token')
// //     if (!token) {
// //       setError('Please login again.')
// //       navigate('/login')
// //       return
// //     }

// //     try {
// //       setLoading(true)

// //       // Check if biometric is needed (amount >= 5000)
// //       const threshold = 5000
// //       let biometricData = null
// //       let biometricType = null

// //       if (amt >= threshold) {
// //         if (!biometricStatus.faceRegistered && !biometricStatus.fingerprintRegistered) {
// //           setError(`Withdrawals above ₹${threshold} require biometric verification. Please register face/fingerprint first.`)
// //           return
// //         }

// //         // Start face verification
// //         setShowCamera(true)
// //         await startCamera()
        
// //         // Wait for user to capture face
// //         return // Exit early, user needs to capture face
// //       }

// //       // Process withdrawal (for amounts below threshold or after biometric capture)
// //       const response = await api.post('/api/wallet/withdraw', {
// //         amount: amt,
// //         pin: pin,
// //         biometricData: biometricData,
// //         biometricType: biometricType
// //       }, {
// //         headers: { Authorization: `Bearer ${token}` }
// //       })

// //       localStorage.setItem('balance', String(response.data.balance))
// //       setSuccess(`₹${amt} withdrawn successfully! New balance: ₹${response.data.balance}`)
      
// //       // Reset form
// //       setTimeout(() => {
// //         setAmount('')
// //         setPin('')
// //         setStep(1)
// //         setSuccess('')
// //         navigate('/dashboard')
// //       }, 2000)

// //     } catch (err) {
// //       console.error(err)
// //       setError(err.response?.data?.message || 'Withdrawal failed. Please try again.')
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   // Handle face capture and continue withdrawal
// //   const handleFaceCaptured = async () => {
// //     try {
// //       const faceImage = await captureAndVerifyFace()
// //       if (!faceImage) {
// //         setError('Failed to capture face')
// //         return
// //       }

// //       setLoading(true)
// //       const token = localStorage.getItem('token')
// //       const amt = Number(amount)

// //       // Send withdrawal request with face data
// //       const response = await api.post('/api/wallet/withdraw', {
// //         amount: amt,
// //         pin: pin,
// //         biometricData: faceImage,
// //         biometricType: 'face'
// //       }, {
// //         headers: { Authorization: `Bearer ${token}` }
// //       })

// //       localStorage.setItem('balance', String(response.data.balance))
// //       setSuccess(`₹${amt} withdrawn successfully! New balance: ₹${response.data.balance}`)
      
// //       setTimeout(() => {
// //         navigate('/dashboard')
// //       }, 2000)

// //     } catch (err) {
// //       setError(err.response?.data?.message || 'Face verification failed.')
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const handleBack = () => {
// //     if (step === 1) {
// //       navigate('/dashboard')
// //     } else {
// //       setStep(step - 1)
// //       setError('')
// //       setShowCamera(false)
// //     }
// //   }

// //   return (
// //     <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col">
// //       {/* Top bar */}
// //       <header className="border-b border-dashed border-gray-800 bg-black/40 backdrop-blur-xl">
// //         <div className="max-w-xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
// //           <div className="flex items-center gap-2.5">
// //             <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
// //               <svg className="h-4 w-4 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
// //                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
// //               </svg>
// //             </div>
// //             <div>
// //               <p className="text-xs text-gray-400 uppercase tracking-wide">SecureATM</p>
// //               <p className="text-sm font-semibold">Withdraw Cash</p>
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
// //             <span className={step >= 3 ? 'text-emerald-300' : ''}>3. {Number(amount) >= 5000 ? 'Face Verify' : 'Confirm'}</span>
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
// //               <h1 className="text-lg sm:text-xl font-semibold">Enter withdrawal amount</h1>
// //               <p className="text-gray-400">
// //                 Available balance: ₹{localStorage.getItem('balance') || '0'}
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
              
// //               {Number(amount) >= 5000 && (
// //                 <div className="text-xs text-amber-300 bg-amber-500/10 border border-dashed border-amber-500/30 rounded-lg p-3">
// //                   ⚠️ Withdrawals above ₹5000 require face verification
// //                 </div>
// //               )}
// //             </div>
// //           )}

// //           {/* Step 2: PIN */}
// //           {step === 2 && (
// //             <div className="space-y-4 text-xs sm:text-sm">
// //               <h1 className="text-lg sm:text-xl font-semibold">Confirm with PIN</h1>
// //               <p className="text-gray-400">
// //                 Enter your transaction PIN to authorize this withdrawal.
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

// //           {/* Step 3: Biometrics or Confirmation */}
// //           {step === 3 && (
// //             <div className="space-y-4 text-xs sm:text-sm">
// //               {Number(amount) >= 5000 ? (
// //                 <>
// //                   <h1 className="text-lg sm:text-xl font-semibold">Face Verification Required</h1>
// //                   <p className="text-gray-400">
// //                     For withdrawals above ₹5000, please verify your face.
// //                   </p>

// //                   {showCamera ? (
// //                     <div className="space-y-4">
// //                       <div className="mt-3 rounded-lg overflow-hidden bg-black border-2 border-dashed border-amber-400">
// //                         <video
// //                           ref={videoRef}
// //                           autoPlay
// //                           playsInline
// //                           muted
// //                           className="w-full h-48 object-cover"
// //                         />
// //                       </div>
// //                       <div className="flex gap-2 justify-center">
// //                         <button
// //                           onClick={handleFaceCaptured}
// //                           disabled={loading}
// //                           className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-300 border border-dashed border-amber-400/70 hover:bg-amber-500/30 disabled:opacity-50"
// //                         >
// //                           {loading ? 'Processing...' : 'Capture & Verify Face'}
// //                         </button>
// //                         <button
// //                           onClick={() => {
// //                             setShowCamera(false)
// //                             if (videoRef.current?.srcObject) {
// //                               videoRef.current.srcObject.getTracks().forEach(track => track.stop())
// //                             }
// //                           }}
// //                           className="px-4 py-2 rounded-lg border border-dashed border-gray-700 text-gray-300 hover:border-gray-500"
// //                         >
// //                           Cancel
// //                         </button>
// //                       </div>
// //                     </div>
// //                   ) : (
// //                     <div className="text-center py-4">
// //                       <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center mb-4">
// //                         <svg className="h-10 w-10 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
// //                           <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h.01M9 9h.01M8 13a4 4 0 008 0m4-1a8 8 0 11-16 0 8 8 0 0116 0z" />
// //                         </svg>
// //                       </div>
// //                       <p className="text-[11px] text-gray-400 mb-4">
// //                         Click "Continue" to start face verification
// //                       </p>
// //                     </div>
// //                   )}
// //                 </>
// //               ) : (
// //                 <>
// //                   <h1 className="text-lg sm:text-xl font-semibold">Confirm Withdrawal</h1>
// //                   <div className="bg-[#151515] rounded-lg border border-dashed border-gray-700 p-4">
// //                     <div className="space-y-2">
// //                       <div className="flex justify-between">
// //                         <span className="text-gray-400">Amount:</span>
// //                         <span className="font-semibold">₹{amount}</span>
// //                       </div>
// //                       <div className="flex justify-between">
// //                         <span className="text-gray-400">Service Charge:</span>
// //                         <span className="text-emerald-300">₹0</span>
// //                       </div>
// //                       <div className="border-t border-dashed border-gray-700 pt-2 mt-2 flex justify-between">
// //                         <span className="text-gray-400">Total:</span>
// //                         <span className="font-semibold text-lg">₹{amount}</span>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </>
// //               )}
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
// //                 Continue
// //               </button>
// //             )}

// //             {step === 3 && Number(amount) < 5000 && (
// //               <button
// //                 type="button"
// //                 onClick={handleConfirmWithdraw}
// //                 disabled={loading}
// //                 className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold text-xs sm:text-sm hover:brightness-110 disabled:opacity-60"
// //               >
// //                 {loading ? 'Processing...' : 'Confirm Withdrawal'}
// //               </button>
// //             )}

// //             {step === 3 && Number(amount) >= 5000 && !showCamera && (
// //               <button
// //                 type="button"
// //                 onClick={startCamera}
// //                 className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 text-black font-semibold text-xs sm:text-sm hover:brightness-110"
// //               >
// //                 Start Face Verification
// //               </button>
// //             )}
// //           </div>
// //         </div>
// //       </main>

// //       {/* Hidden canvas for face capture */}
// //       <canvas ref={canvasRef} className="hidden" />
// //     </div>
// //   )
// // }

// // export default WithdrawPage


















































// // // // src/pages/WithdrawPage.jsx
// // // import React, { useState } from 'react'
// // // import { useNavigate } from 'react-router-dom'
// // // import api from '../services/api'
// // // import { useFaceVerification } from '../hooks/useFaceVerification'



// // // function WithdrawPage() {
// // //   const navigate = useNavigate()
// // //   const [amount, setAmount] = useState('')
// // //   const [pin, setPin] = useState('')
// // //   const [step, setStep] = useState(1) // 1 = amount, 2 = PIN, 3 = biometrics
// // //   const [loading, setLoading] = useState(false)
// // //   const [error, setError] = useState('')
// // //   const [success, setSuccess] = useState('')
// // // const { verifyFace, error: faceError } = useFaceVerification()



// // //   const handleNextFromAmount = () => {
// // //     setError('')
// // //     const amt = Number(amount)
// // //     if (!amt || amt <= 0) {
// // //       setError('Enter a valid amount greater than 0.')
// // //       return
// // //     }
// // //     setStep(2)
// // //   }

// // //   const handleNextFromPin = () => {
// // //     setError('')
// // //     if (!pin || pin.length < 4) {
// // //       setError('Enter your 4 or 6 digit transaction PIN.')
// // //       return
// // //     }
// // //     setStep(3)
// // //   }
// // // // At the top
// // // import { useFaceVerification } from '../hooks/useFaceVerification'

// // // // Inside WithdrawPage
// // // const { verifyFace, verifying, error: faceError, videoRef, showCamera, stopCamera } = useFaceVerification()

// // // // Replace handleConfirmWithdraw
// // // const handleConfirmWithdraw = async () => {
// // //   setError('')
// // //   setSuccess('')
// // //   const amt = Number(amount)
// // //   if (!amt || amt <= 0) {
// // //     setError('Enter a valid amount.')
// // //     return
// // //   }

// // //   try {
// // //     // Get stored facialId from backend first
// // //     const token = localStorage.getItem('token')
// // //     const userRes = await api.get('/settings/me', {
// // //       headers: { Authorization: `Bearer ${token}` }
// // //     })

// // //     if (!userRes.data.facialId) {
// // //       setError('Please add face data in Settings first.')
// // //       return
// // //     }

// // //     // Face verification
// // //     const faceRes = await verifyFace(userRes.data.facialId)
// // //     if (!faceRes.success) {
// // //       setError(faceError || 'Face verification failed.')
// // //       return
// // //     }

// // //     setLoading(true)

// // //     const res = await api.post(
// // //       '/wallet/withdraw',
// // //       {
// // //         amount: amt,
// // //         pin,
// // //         faceOk: true,
// // //         facialId: faceRes.facialId,
// // //         fingerprintOk: true,
// // //       },
// // //       { headers: { Authorization: `Bearer ${token}` } }
// // //     )

// // //     localStorage.setItem('balance', String(res.data.balance))
// // //     setSuccess('Withdrawal successful.')
// // //     setAmount('')
// // //     setPin('')
// // //     setStep(1)
// // //   } catch (err) {
// // //     console.error(err)
// // //     setError(err.response?.data?.message || 'Withdrawal failed. Please try again.')
// // //   } finally {
// // //     setLoading(false)
// // //     stopCamera()
// // //   }
// // // }

// // // // Add camera preview in step 3 JSX (inside the biometrics step)
// // // {showCamera && (
// // //   <div className="mt-3 rounded-lg overflow-hidden bg-black">
// // //     <video
// // //       ref={videoRef}
// // //       autoPlay
// // //       playsInline
// // //       muted
// // //       className="w-full h-48 object-cover"
// // //     />
// // //   </div>
// // // )}


// // //   // const handleConfirmWithdraw = async () => {
// // //   //   setError('')
// // //   //   setSuccess('')
// // //   //   const amt = Number(amount)
// // //   //   if (!amt || amt <= 0) {
// // //   //     setError('Enter a valid amount.')
// // //   //     return
// // //   //   }

// // //   //   try {
// // //   //     setLoading(true)
// // //   //     const token = localStorage.getItem('token')

// // //   //     const res = await api.post(
// // //   //       '/wallet/withdraw',
// // //   //       {
// // //   //         amount: amt,
// // //   //         pinOk: true,          // later: real pin verification
// // //   //         fingerprintOk: true,  // later: real fingerprint
// // //   //         faceOk: true,         // required for high amounts (backend checks)
// // //   //       },
// // //   //       { headers: { Authorization: `Bearer ${token}` } }
// // //   //     )

// // //   //     // store new balance for Dashboard
// // //   //     localStorage.setItem('balance', String(res.data.balance))

// // //   //     setSuccess('Withdrawal successful.')
// // //   //     setAmount('')
// // //   //     setPin('')
// // //   //     setStep(1)
// // //   //     console.log('New balance after withdraw:', res.data.balance)
// // //   //   } catch (err) {
// // //   //     console.error(err)
// // //   //     setError(err.response?.data?.message || 'Withdrawal failed. Please try again.')
// // //   //   } finally {
// // //   //     setLoading(false)
// // //   //   }
// // //   // }

// // //   const handleBack = () => {
// // //     if (step === 1) {
// // //       navigate('/dashboard')
// // //     } else {
// // //       setStep(step - 1)
// // //       setError('')
// // //     }
// // //   }

// // //   return (
// // //     <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col">
// // //       {/* Top bar */}
// // //       <header className="border-b border-dashed border-gray-800 bg-black/40 backdrop-blur-xl">
// // //         <div className="max-w-xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
// // //           <div className="flex items-center gap-2.5">
// // //             <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
// // //               <svg
// // //                 className="h-4 w-4 text-black"
// // //                 fill="none"
// // //                 stroke="currentColor"
// // //                 strokeWidth="2.5"
// // //                 viewBox="0 0 24 24"
// // //               >
// // //                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
// // //               </svg>
// // //             </div>
// // //             <div>
// // //               <p className="text-xs text-gray-400 uppercase tracking-wide">SecureATM</p>
// // //               <p className="text-sm font-semibold">Withdraw Cash</p>
// // //             </div>
// // //           </div>

// // //           <button
// // //             onClick={() => navigate('/dashboard')}
// // //             className="text-xs sm:text-sm px-3 py-1.5 rounded-full border border-dashed border-gray-700 text-gray-300 hover:border-emerald-500 hover:text-emerald-300 transition"
// // //           >
// // //             ← Back to Dashboard
// // //           </button>
// // //         </div>
// // //       </header>

// // //       {/* Main */}
// // //       <main className="flex-1 flex items-center justify-center px-4 py-6 sm:py-10">
// // //         <div className="w-full max-w-xl bg-[#101010] rounded-2xl border border-dashed border-gray-800 p-5 sm:p-6 shadow-2xl space-y-4">
// // //           {/* Step indicator */}
// // //           <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
// // //             <span className={step >= 1 ? 'text-emerald-300' : ''}>1. Amount</span>
// // //             <span className={step >= 2 ? 'text-emerald-300' : ''}>2. PIN</span>
// // //             <span className={step >= 3 ? 'text-emerald-300' : ''}>3. Biometrics</span>
// // //           </div>

// // //           {error && (
// // //             <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/40 rounded-lg px-3 py-2">
// // //               {error}
// // //             </p>
// // //           )}
// // //           {success && (
// // //             <p className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/40 rounded-lg px-3 py-2">
// // //               {success}
// // //             </p>
// // //           )}

// // //           {/* Step 1: Amount */}
// // //           {step === 1 && (
// // //             <div className="space-y-4 text-xs sm:text-sm">
// // //               <h1 className="text-lg sm:text-xl font-semibold">Enter withdrawal amount</h1>
// // //               <p className="text-gray-400">
// // //                 Ensure the amount is within your available SecureATM balance.
// // //               </p>

// // //               <div className="space-y-1.5">
// // //                 <label className="block text-gray-300">Amount (₹)</label>
// // //                 <input
// // //                   type="number"
// // //                   min="1"
// // //                   value={amount}
// // //                   onChange={(e) => setAmount(e.target.value)}
// // //                   className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
// // //                   placeholder="Enter amount"
// // //                 />
// // //               </div>
// // //             </div>
// // //           )}

// // //           {/* Step 2: PIN */}
// // //           {step === 2 && (
// // //             <div className="space-y-4 text-xs sm:text-sm">
// // //               <h1 className="text-lg sm:text-xl font-semibold">Confirm with PIN</h1>
// // //               <p className="text-gray-400">
// // //                 Use your transaction PIN to authorize this withdrawal.
// // //               </p>

// // //               <div className="space-y-1.5">
// // //                 <label className="block text-gray-300">Transaction PIN</label>
// // //                 <input
// // //                   type="password"
// // //                   maxLength={6}
// // //                   value={pin}
// // //                   onChange={(e) => setPin(e.target.value)}
// // //                   className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
// // //                   placeholder="Enter 4 or 6 digit PIN"
// // //                 />
// // //               </div>
// // //             </div>
// // //           )}

// // //           {/* Step 3: Biometrics */}
// // //           {step === 3 && (
// // //             <div className="space-y-4 text-xs sm:text-sm">
// // //               <h1 className="text-lg sm:text-xl font-semibold">Biometric verification</h1>
// // //               <p className="text-gray-400">
// // //                 For high-value withdrawals, SecureATM asks for fingerprint and face
// // //                 verification. This is simulated here.
// // //               </p>

// // //               <div className="mt-2 flex flex-col items-center gap-3">
// // //                 <div className="flex gap-6">
// // //                   <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
// // //                     {/* Fingerprint icon */}
// // //                     <svg
// // //                       className="h-9 w-9 text-black"
// // //                       fill="none"
// // //                       stroke="currentColor"
// // //                       strokeWidth="2"
// // //                       viewBox="0 0 24 24"
// // //                     >
// // //                       <path
// // //                         strokeLinecap="round"
// // //                         strokeLinejoin="round"
// // //                         d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
// // //                       />
// // //                     </svg>
// // //                   </div>
// // //                   <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center">
// // //                     {/* Face icon */}
// // //                     <svg
// // //                       className="h-9 w-9 text-black"
// // //                       fill="none"
// // //                       stroke="currentColor"
// // //                       strokeWidth="2"
// // //                       viewBox="0 0 24 24"
// // //                     >
// // //                       <path
// // //                         strokeLinecap="round"
// // //                         strokeLinejoin="round"
// // //                         d="M15 9h.01M9 9h.01M8 13a4 4 0 008 0m4-1a8 8 0 11-16 0 8 8 0 0116 0z"
// // //                       />
// // //                     </svg>
// // //                   </div>
// // //                 </div>
// // //                 <p className="text-[11px] text-gray-400 text-center">
// // //                   On real hardware, the ATM would capture and match your fingerprint and face
// // //                   before releasing high-value cash.
// // //                 </p>
// // //               </div>
// // //             </div>
// // //           )}

// // //           {/* Actions */}
// // //           <div className="flex items-center justify-between pt-3">
// // //             <button
// // //               type="button"
// // //               onClick={handleBack}
// // //               className="px-4 py-2 rounded-lg border border-dashed border-gray-700 text-gray-300 text-xs sm:text-sm hover:border-gray-500"
// // //               disabled={loading}
// // //             >
// // //               {step === 1 ? 'Cancel' : 'Back'}
// // //             </button>

// // //             {step === 1 && (
// // //               <button
// // //                 type="button"
// // //                 onClick={handleNextFromAmount}
// // //                 className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold text-xs sm:text-sm hover:brightness-110"
// // //               >
// // //                 Continue
// // //               </button>
// // //             )}

// // //             {step === 2 && (
// // //               <button
// // //                 type="button"
// // //                 onClick={handleNextFromPin}
// // //                 className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold text-xs sm:text-sm hover:brightness-110"
// // //               >
// // //                 Verify PIN
// // //               </button>
// // //             )}

// // //             {step === 3 && (
// // //               <button
// // //                 type="button"
// // //                 onClick={handleConfirmWithdraw}
// // //                 disabled={loading}
// // //                 className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold text-xs sm:text-sm hover:brightness-110 disabled:opacity-60"
// // //               >
// // //                 {loading ? 'Processing...' : 'Confirm Withdrawal'}
// // //               </button>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </main>
// // //     </div>
// // //   )
// // // }

// // // export default WithdrawPage






// // // // // src/pages/WithdrawPage.jsx
// // // import React, { useState } from 'react'
// // // import { useNavigate } from 'react-router-dom'
// // // import api from '../services/api'
// // // import { useFaceVerification } from '../hooks/useFaceVerification'

// // // function WithdrawPage() {
// // //   const navigate = useNavigate()
// // //   const [amount, setAmount] = useState('')
// // //   const [pin, setPin] = useState('')
// // //   const [step, setStep] = useState(1) // 1 = amount, 2 = PIN, 3 = biometrics
// // //   const [loading, setLoading] = useState(false)
// // //   const [error, setError] = useState('')
// // //   const [success, setSuccess] = useState('')
  
// // //   const { verifyFace, verifying, error: faceError, videoRef, showCamera, stopCamera } = useFaceVerification()

// // //   const handleNextFromAmount = () => {
// // //     setError('')
// // //     const amt = Number(amount)
// // //     if (!amt || amt <= 0) {
// // //       setError('Enter a valid amount greater than 0.')
// // //       return
// // //     }
// // //     setStep(2)
// // //   }

// // //   const handleNextFromPin = () => {
// // //     setError('')
// // //     if (!pin || pin.length < 4) {
// // //       setError('Enter your 4 or 6 digit transaction PIN.')
// // //       return
// // //     }
// // //     setStep(3)
// // //   }

// // //   const handleConfirmWithdraw = async () => {
// // //     setError('')
// // //     setSuccess('')
// // //     const amt = Number(amount)
// // //     if (!amt || amt <= 0) {
// // //       setError('Enter a valid amount.')
// // //       return
// // //     }

// // //     try {
// // //       // Get stored facialId from backend first
// // //       const token = localStorage.getItem('token')
// // //       const userRes = await api.get('/settings/me', {
// // //         headers: { Authorization: `Bearer ${token}` }
// // //       })

// // //       if (!userRes.data.facialId) {
// // //         setError('Please add face data in Settings first.')
// // //         return
// // //       }

// // //       // Face verification
// // //       const faceRes = await verifyFace(userRes.data.facialId)
// // //       if (!faceRes.success) {
// // //         setError(faceError || 'Face verification failed.')
// // //         return
// // //       }

// // //       setLoading(true)

// // //       const res = await api.post(
// // //         '/wallet/withdraw',
// // //         {
// // //           amount: amt,
// // //           pin,
// // //           faceOk: true,
// // //           facialId: faceRes.facialId,
// // //           fingerprintOk: true,
// // //         },
// // //         { headers: { Authorization: `Bearer ${token}` } }
// // //       )

// // //       localStorage.setItem('balance', String(res.data.balance))
// // //       setSuccess('Withdrawal successful.')
// // //       setAmount('')
// // //       setPin('')
// // //       setStep(1)
// // //     } catch (err) {
// // //       console.error(err)
// // //       setError(err.response?.data?.message || 'Withdrawal failed. Please try again.')
// // //     } finally {
// // //       setLoading(false)
// // //       stopCamera()
// // //     }
// // //   }

// // //   const handleBack = () => {
// // //     if (step === 1) {
// // //       navigate('/dashboard')
// // //     } else {
// // //       setStep(step - 1)
// // //       setError('')
// // //     }
// // //   }

// // //   return (
// // //     <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col">
// // //       {/* Top bar */}
// // //       <header className="border-b border-dashed border-gray-800 bg-black/40 backdrop-blur-xl">
// // //         <div className="max-w-xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
// // //           <div className="flex items-center gap-2.5">
// // //             <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
// // //               <svg
// // //                 className="h-4 w-4 text-black"
// // //                 fill="none"
// // //                 stroke="currentColor"
// // //                 strokeWidth="2.5"
// // //                 viewBox="0 0 24 24"
// // //               >
// // //                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
// // //               </svg>
// // //             </div>
// // //             <div>
// // //               <p className="text-xs text-gray-400 uppercase tracking-wide">SecureATM</p>
// // //               <p className="text-sm font-semibold">Withdraw Cash</p>
// // //             </div>
// // //           </div>

// // //           <button
// // //             onClick={() => navigate('/dashboard')}
// // //             className="text-xs sm:text-sm px-3 py-1.5 rounded-full border border-dashed border-gray-700 text-gray-300 hover:border-emerald-500 hover:text-emerald-300 transition"
// // //           >
// // //             ← Back to Dashboard
// // //           </button>
// // //         </div>
// // //       </header>

// // //       {/* Main */}
// // //       <main className="flex-1 flex items-center justify-center px-4 py-6 sm:py-10">
// // //         <div className="w-full max-w-xl bg-[#101010] rounded-2xl border border-dashed border-gray-800 p-5 sm:p-6 shadow-2xl space-y-4">
// // //           {/* Step indicator */}
// // //           <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
// // //             <span className={step >= 1 ? 'text-emerald-300' : ''}>1. Amount</span>
// // //             <span className={step >= 2 ? 'text-emerald-300' : ''}>2. PIN</span>
// // //             <span className={step >= 3 ? 'text-emerald-300' : ''}>3. Biometrics</span>
// // //           </div>

// // //           {error && (
// // //             <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/40 rounded-lg px-3 py-2">
// // //               {error}
// // //             </p>
// // //           )}
// // //           {success && (
// // //             <p className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/40 rounded-lg px-3 py-2">
// // //               {success}
// // //             </p>
// // //           )}

// // //           {/* Step 1: Amount */}
// // //           {step === 1 && (
// // //             <div className="space-y-4 text-xs sm:text-sm">
// // //               <h1 className="text-lg sm:text-xl font-semibold">Enter withdrawal amount</h1>
// // //               <p className="text-gray-400">
// // //                 Ensure the amount is within your available SecureATM balance.
// // //               </p>

// // //               <div className="space-y-1.5">
// // //                 <label className="block text-gray-300">Amount (₹)</label>
// // //                 <input
// // //                   type="number"
// // //                   min="1"
// // //                   value={amount}
// // //                   onChange={(e) => setAmount(e.target.value)}
// // //                   className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
// // //                   placeholder="Enter amount"
// // //                 />
// // //               </div>
// // //             </div>
// // //           )}

// // //           {/* Step 2: PIN */}
// // //           {step === 2 && (
// // //             <div className="space-y-4 text-xs sm:text-sm">
// // //               <h1 className="text-lg sm:text-xl font-semibold">Confirm with PIN</h1>
// // //               <p className="text-gray-400">
// // //                 Use your transaction PIN to authorize this withdrawal.
// // //               </p>

// // //               <div className="space-y-1.5">
// // //                 <label className="block text-gray-300">Transaction PIN</label>
// // //                 <input
// // //                   type="password"
// // //                   maxLength={6}
// // //                   value={pin}
// // //                   onChange={(e) => setPin(e.target.value)}
// // //                   className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
// // //                   placeholder="Enter 4 or 6 digit PIN"
// // //                 />
// // //               </div>
// // //             </div>
// // //           )}

// // //           {/* Step 3: Biometrics */}
// // //           {step === 3 && (
// // //             <div className="space-y-4 text-xs sm:text-sm">
// // //               <h1 className="text-lg sm:text-xl font-semibold">Biometric verification</h1>
// // //               <p className="text-gray-400">
// // //                 For high-value withdrawals, SecureATM requires face verification.
// // //               </p>

// // //               {showCamera && (
// // //                 <div className="mt-3 rounded-lg overflow-hidden bg-black border-2 border-dashed border-emerald-400">
// // //                   <video
// // //                     ref={videoRef}
// // //                     autoPlay
// // //                     playsInline
// // //                     muted
// // //                     className="w-full h-48 object-cover"
// // //                   />
// // //                 </div>
// // //               )}

// // //               <div className="mt-2 flex flex-col items-center gap-3">
// // //                 <div className="flex gap-6">
// // //                   <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
// // //                     <svg
// // //                       className="h-9 w-9 text-black"
// // //                       fill="none"
// // //                       stroke="currentColor"
// // //                       strokeWidth="2"
// // //                       viewBox="0 0 24 24"
// // //                     >
// // //                       <path
// // //                         strokeLinecap="round"
// // //                         strokeLinejoin="round"
// // //                         d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
// // //                       />
// // //                     </svg>
// // //                   </div>
// // //                   <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center">
// // //                     <svg
// // //                       className="h-9 w-9 text-black"
// // //                       fill="none"
// // //                       stroke="currentColor"
// // //                       strokeWidth="2"
// // //                       viewBox="0 0 24 24"
// // //                     >
// // //                       <path
// // //                         strokeLinecap="round"
// // //                         strokeLinejoin="round"
// // //                         d="M15 9h.01M9 9h.01M8 13a4 4 0 008 0m4-1a8 8 0 11-16 0 8 8 0 0116 0z"
// // //                       />
// // //                     </svg>
// // //                   </div>
// // //                 </div>
// // //                 <p className="text-[11px] text-gray-400 text-center">
// // //                   Camera will open automatically for face verification when you confirm.
// // //                 </p>
// // //               </div>
// // //             </div>
// // //           )}

// // //           {/* Actions */}
// // //           <div className="flex items-center justify-between pt-3">
// // //             <button
// // //               type="button"
// // //               onClick={handleBack}
// // //               className="px-4 py-2 rounded-lg border border-dashed border-gray-700 text-gray-300 text-xs sm:text-sm hover:border-gray-500"
// // //               disabled={loading || verifying}
// // //             >
// // //               {step === 1 ? 'Cancel' : 'Back'}
// // //             </button>

// // //             {step === 1 && (
// // //               <button
// // //                 type="button"
// // //                 onClick={handleNextFromAmount}
// // //                 className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold text-xs sm:text-sm hover:brightness-110"
// // //               >
// // //                 Continue
// // //               </button>
// // //             )}

// // //             {step === 2 && (
// // //               <button
// // //                 type="button"
// // //                 onClick={handleNextFromPin}
// // //                 className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold text-xs sm:text-sm hover:brightness-110"
// // //               >
// // //                 Verify PIN
// // //               </button>
// // //             )}

// // //             {step === 3 && (
// // //               <button
// // //                 type="button"
// // //                 onClick={handleConfirmWithdraw}
// // //                 disabled={loading || verifying}
// // //                 className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold text-xs sm:text-sm hover:brightness-110 disabled:opacity-60"
// // //               >
// // //                 {verifying ? 'Verifying Face...' : loading ? 'Processing...' : 'Confirm Withdrawal'}
// // //               </button>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </main>
// // //     </div>
// // //   )
// // // }

// // // export default WithdrawPage









 import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

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
    fingerprintRegistered: false
  })

  // Check biometric status on mount
  useEffect(() => {
    const checkBiometricStatus = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        const response = await api.get('/biometric/status', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setBiometricStatus({
          faceRegistered: response.data.faceRegistered || false,
          fingerprintRegistered: response.data.fingerprintRegistered || false
        })
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
      
      // Request camera permissions
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 320 },
          height: { ideal: 240 }
        },
        audio: false
      })
      
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        // Auto-capture after 2 seconds
        setTimeout(() => {
          captureFacePhoto()
        }, 2000)
      }
    } catch (err) {
      console.error('Camera error:', err)
      setError('Camera permission denied. Please allow camera access.')
      setShowCamera(false)
      setIsCapturing(false)
    }
  }

  // Capture face photo - OPTIMIZED FOR GEMINI
  const captureFacePhoto = () => {
    if (!videoRef.current || !canvasRef.current) {
      setError('Camera not ready')
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    // Set canvas size - IMPORTANT: Same as registration
    canvas.width = 320
    canvas.height = 240

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // ✅ OPTIMIZE FOR GEMINI: Better quality, same as registration
    const faceImage = canvas.toDataURL('image/jpeg', 0.7) // 70% quality
    
    console.log('📸 Face captured for Gemini, length:', faceImage.length)
    
    setCapturedFace(faceImage)
    
    // Stop camera
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    setShowCamera(false)
    setIsCapturing(false)
  }

  // Process withdrawal - UPDATED FOR GEMINI
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
      const threshold = 5000
      let biometricData = null
      let biometricType = null

      // If amount >= 5000, we need face verification
      if (amt >= threshold) {
        if (!capturedFace) {
          setError('Please capture your face for verification.')
          setLoading(false)
          return
        }
        
        biometricData = capturedFace
        biometricType = 'face'
      }

      // ✅ Send withdrawal request to backend (which calls Gemini)
      console.log('🚀 Sending withdrawal request to backend...')
      
      const response = await api.post('/wallet/withdraw', {
        amount: amt,
        pin: pin,
        biometricData: biometricData,
        biometricType: biometricType
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      console.log('✅ Withdrawal successful:', response.data)
      
      // Update balance in localStorage
      localStorage.setItem('balance', String(response.data.balance))
      
      setSuccess(`₹${amt} withdrawn successfully! New balance: ₹${response.data.balance}`)
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setAmount('')
        setPin('')
        setCapturedFace(null)
        setStep(1)
        setSuccess('')
        navigate('/dashboard')
      }, 3000)

    } catch (err) {
      console.error('❌ Withdrawal error:', err.response?.data || err.message)
      
      // Show user-friendly error
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err.message.includes('Network Error')) {
        setError('Network error. Please check your connection.')
      } else {
        setError('Withdrawal failed. Please try again.')
      }
      
      // Reset face capture on error
      setCapturedFace(null)
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
      setError(`Insufficient balance. Available: ₹${balance}`)
      return
    }
    
    // Check if user has registered face for amounts >= 5000
    if (amt >= 5000 && !biometricStatus.faceRegistered) {
      setError(`Withdrawals above ₹5000 require face registration. Please register your face in Settings first.`)
      return
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
    if (amt >= 5000) {
      setStep(3) // Go to face verification
    } else {
      processWithdrawal() // Directly process if amount < 5000
    }
  }

  const handleBack = () => {
    if (step === 1) {
      navigate('/dashboard')
    } else {
      setStep(step - 1)
      setError('')
      setShowCamera(false)
      setCapturedFace(null)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }
  }

  // Cancel camera
  const cancelCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setShowCamera(false)
    setIsCapturing(false)
  }

  // Retake photo
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
              <svg className="h-4 w-4 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">SecureATM</p>
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
            <span className={step >= 1 ? 'text-emerald-300' : ''}>1. Amount</span>
            <span className={step >= 2 ? 'text-emerald-300' : ''}>2. PIN</span>
            <span className={step >= 3 ? 'text-emerald-300' : ''}>3. {Number(amount) >= 5000 ? 'Face Verify' : 'Confirm'}</span>
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
              <h1 className="text-lg sm:text-xl font-semibold">Enter withdrawal amount</h1>
              <p className="text-gray-400">
                Available balance: ₹{localStorage.getItem('balance') || '0'}
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
              
              {Number(amount) >= 5000 && (
                <div className="text-xs text-amber-300 bg-amber-500/10 border border-dashed border-amber-500/30 rounded-lg p-3">
                  ⚠️ Withdrawals above ₹5000 require face verification
                  {!biometricStatus.faceRegistered && (
                    <p className="mt-1 text-amber-200">Please register your face in Settings first.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 2: PIN */}
          {step === 2 && (
            <div className="space-y-4 text-xs sm:text-sm">
              <h1 className="text-lg sm:text-xl font-semibold">Confirm with PIN</h1>
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

          {/* Step 3: Face Verification or Confirmation */}
          {step === 3 && (
            <div className="space-y-4 text-xs sm:text-sm">
              {Number(amount) >= 5000 ? (
                <>
                  <h1 className="text-lg sm:text-xl font-semibold">Face Verification</h1>
                  <p className="text-gray-400">
                    Look at the camera. Face will be automatically captured in 2 seconds.
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
                          <p className="text-[10px] text-white text-center">Capturing in 2 seconds...</p>
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
                          <p className="text-[10px] text-amber-300 text-center">Ready for verification with Gemini AI</p>
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
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Verifying with Gemini...
                            </span>
                          ) : 'Verify & Withdraw'}
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
                        <svg className="h-10 w-10 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
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
              ) : (
                <>
                  <h1 className="text-lg sm:text-xl font-semibold">Confirm Withdrawal</h1>
                  <div className="bg-[#151515] rounded-lg border border-dashed border-gray-700 p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Amount:</span>
                        <span className="font-semibold">₹{amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Service Charge:</span>
                        <span className="text-emerald-300">₹0</span>
                      </div>
                      <div className="border-t border-dashed border-gray-700 pt-2 mt-2 flex justify-between">
                        <span className="text-gray-400">Total:</span>
                        <span className="font-semibold text-lg">₹{amount}</span>
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

            {step === 3 && Number(amount) < 5000 && (
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
