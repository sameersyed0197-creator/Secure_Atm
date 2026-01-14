 

// // src/pages/SettingsPage.jsx - SYNCED VERSION
// import React, { useEffect, useState, useRef } from 'react'
// import { useNavigate } from 'react-router-dom'
// import api from '../services/api'
// import { browserSupportsWebAuthn, startRegistration } from '@simplewebauthn/browser'


// function SettingsPage() {
//   const navigate = useNavigate()
//   const videoRef = useRef(null)
//   const canvasRef = useRef(null)
//   const streamRef = useRef(null)

//   const [profile, setProfile] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//     city: '',
//     address: '',
//   })

//   const [biometricStatus, setBiometricStatus] = useState({
//     faceRegistered: false,
//     fingerprintRegistered: false,
//   })

//   const [passwordForm, setPasswordForm] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: '',
//   })

//   const [pinForm, setPinForm] = useState({
//     currentPin: '',
//     newPin: '',
//     confirmPin: '',
//   })

//   const [threshold, setThreshold] = useState(5000)
//   const [loading, setLoading] = useState(false)
//   const [message, setMessage] = useState('')
//   const [error, setError] = useState('')
//   const [capturedFace, setCapturedFace] = useState(null)
//   const [showCamera, setShowCamera] = useState(false)
//   const [isCapturing, setIsCapturing] = useState(false)

//   // Cleanup camera on unmount
//   useEffect(() => {
//     return () => {
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach(t => t.stop())
//       }
//     }
//   }, [])

//   // Load user data on mount
//   useEffect(() => {
//     const load = async () => {
//       const token = localStorage.getItem('token')
//       if (!token) return

//       const headers = { Authorization: `Bearer ${token}` }

//       try {
//         const res = await api.get('/settings/me', { headers })
//         setProfile({
//           fullName: res.data.fullName || '',
//           email: res.data.email || '',
//           phone: res.data.phone || '',
//           city: res.data.city || '',
//           address: res.data.address || '',
//         })

//         setThreshold(
//           res.data.biometricThreshold ??
//           res.data.securitySettings?.biometricThreshold ??
//           5000
//         )

//         const faceRes = await api.get('/biometric/status', { headers })
//         const fpRes = await api.get('/fingerprint/status', { headers })

//         setBiometricStatus({
//           faceRegistered: Boolean(faceRes.data.faceRegistered),
//           fingerprintRegistered: Boolean(fpRes.data.fingerprintRegistered),
//         })

//         if (faceRes.data.faceRegistered && res.data.faceData) {
//           setCapturedFace(res.data.faceData)
//           console.log('✅ Loaded saved face photo')
//         }

//       } catch (err) {
//         console.error('Failed to load settings:', err)
//         setError('Failed to load settings')
//       }
//     }

//     load()
//   }, [])

//   const withAuth = () => {
//     const token = localStorage.getItem('token')
//     return token ? { Authorization: `Bearer ${token}` } : null
//   }

//   const startCamera = async () => {
//     try {
//       setShowCamera(true)
//       setIsCapturing(true)
//       setError('')
//       setMessage('')

//       const stream = await navigator.mediaDevices.getUserMedia({ 
//         video: { 
//           width: { ideal: 640 },
//           height: { ideal: 480 },
//           facingMode: 'user' 
//         } 
//       })
      
//       streamRef.current = stream
      
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream
        
//         await new Promise((resolve, reject) => {
//           videoRef.current.onloadedmetadata = () => {
//             videoRef.current.play()
//               .then(resolve)
//               .catch(reject)
//           }
//           setTimeout(() => reject(new Error('Video loading timeout')), 10000)
//         })
        
//         setTimeout(() => {
//           if (streamRef.current) {
//             captureFacePhoto()
//           }
//         }, 3000)
//       }
//     } catch (err) {
//       console.error('Camera error:', err)
      
//       if (err.name === 'NotAllowedError') {
//         setError('Camera access denied. Please allow camera permissions.')
//       } else if (err.name === 'NotFoundError') {
//         setError('No camera found on this device.')
//       } else {
//         setError('Failed to start camera: ' + err.message)
//       }
      
//       setShowCamera(false)
//       setIsCapturing(false)
      
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach(t => t.stop())
//         streamRef.current = null
//       }
//     }
//   }

//   const captureFacePhoto = () => {
//     try {
//       const canvas = canvasRef.current
//       const video = videoRef.current
      
//       if (!canvas || !video) {
//         setError('Camera not ready')
//         return
//       }

//       if (video.readyState < video.HAVE_ENOUGH_DATA) {
//         setError('Video not ready - please try again')
//         setShowCamera(false)
//         setIsCapturing(false)
//         return
//       }
      
//       const ctx = canvas.getContext('2d')
//       canvas.width = 320
//       canvas.height = 240
      
//       ctx.drawImage(video, 0, 0, 320, 240)
      
//       const imageData = canvas.toDataURL('image/jpeg', 0.7)
      
//       if (!imageData || imageData.length < 5000) {
//         setError('Captured image is blank or too small - please try again')
//         setShowCamera(false)
//         setIsCapturing(false)
//         return
//       }
      
//       setCapturedFace(imageData)
//       console.log('✅ Face captured successfully')

//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach(t => t.stop())
//         streamRef.current = null
//       }
      
//       setShowCamera(false)
//       setIsCapturing(false)
//       setMessage('✅ Face captured! Click "Save Face" to register.')
//     } catch (err) {
//       console.error('Capture error:', err)
//       setError('Failed to capture photo: ' + err.message)
//       setShowCamera(false)
//       setIsCapturing(false)
//     }
//   }

//   const registerFace = async () => {
//     const headers = withAuth()
//     if (!headers) {
//       setError('Not authenticated - please login again')
//       return
//     }
    
//     if (!capturedFace) {
//       setError('No face data captured - please capture your face first')
//       return
//     }

//     try {
//       setLoading(true)
//       setError('')
//       setMessage('')
      
//       const response = await api.post(
//         '/biometric/register-face', 
//         { faceData: capturedFace }, 
//         { headers }
//       )
      
//       setBiometricStatus(s => ({ ...s, faceRegistered: true }))
//       setMessage('✅ Face registered successfully! You can now use face verification.')
      
//     } catch (err) {
//       console.error('Face registration error:', err)
//       setError(err.response?.data?.message || 'Failed to register face')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const reuploadFace = () => {
//     setCapturedFace(null)
//     setShowCamera(false)
//     setError('')
//     setMessage('')
//     startCamera()
//   }

//   const cancelCamera = () => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach(track => track.stop())
//       streamRef.current = null
//     }
//     setShowCamera(false)
//     setIsCapturing(false)
//     setError('')
//   }

//   const registerFingerprint = async () => {
//     const headers = withAuth()
//     if (!headers) {
//       setError('Not authenticated - please login again')
//       return
//     }
    
//     if (!browserSupportsWebAuthn()) {
//       setError('Your browser does not support fingerprint authentication')
//       return
//     }

//     try {
//       setLoading(true)
//       setError('')
//       setMessage('')
      
//       const optResponse = await api.get('/fingerprint/init-register', { headers })
//       const credential = await startRegistration(optResponse.data)
      
//       const verifyResponse = await api.post(
//         '/fingerprint/verify-register', 
//         credential, 
//         { headers }
//       )
      
//       setBiometricStatus(s => ({ ...s, fingerprintRegistered: true }))
//       setMessage('✅ Fingerprint registered successfully!')
      
//     } catch (err) {
//       console.error('Fingerprint registration error:', err)
      
//       if (err.name === 'NotAllowedError') {
//         setError('Fingerprint registration cancelled by user')
//       } else {
//         setError(err.response?.data?.error || 'Failed to register fingerprint')
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleThresholdUpdate = async () => {
//     const headers = withAuth()
//     if (!headers) {
//       setError('Not authenticated')
//       return
//     }
    
//     if (threshold < 1000 || threshold > 100000) {
//       setError('Threshold must be between ₹1,000 and ₹1,00,000')
//       return
//     }

//     try {
//       setLoading(true)
//       setError('')
//       setMessage('')
      
//       await api.put(
//         '/settings/biometric-threshold', 
//         { biometricThreshold: threshold }, 
//         { headers }
//       )
      
//       setMessage('✅ Biometric threshold updated to ₹' + threshold.toLocaleString('en-IN'))
//     } catch (err) {
//       console.error('Threshold update error:', err)
//       setError(err.response?.data?.message || 'Failed to update threshold')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSaveProfile = async (e) => {
//     e.preventDefault()
//     setError('')
//     setMessage('')

//     const headers = withAuth()
//     if (!headers) return

//     try {
//       setLoading(true)
//       await api.put(
//         '/settings/profile',
//         {
//           fullName: profile.fullName,
//           phone: profile.phone,
//           city: profile.city,
//           address: profile.address,
//         },
//         { headers }
//       )
//       setMessage('✅ Profile updated successfully.')
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to update profile.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // const handlePasswordUpdate = async (e) => {
//   //   e.preventDefault()
//   //   setError('')
//   //   setMessage('')

//   //   if (passwordForm.newPassword !== passwordForm.confirmPassword) {
//   //     setError('Passwords do not match')
//   //     return
//   //   }

//   //   const headers = withAuth()
//   //   if (!headers) return

//   //   try {
//   //     setLoading(true)
//   //     await api.put(
//   //       '/settings/password',
//   //       {
//   //         currentPassword: passwordForm.currentPassword,
//   //         newPassword: passwordForm.newPassword,
//   //       },
//   //       { headers }
//   //     )
//   //     setMessage('✅ Password updated successfully')
//   //     setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
//   //   } catch (err) {
//   //     setError(err.response?.data?.message || 'Failed to update password')
//   //   } finally {
//   //     setLoading(false)
//   //   }
//   // }

//   // const handlePinUpdate = async (e) => {
//   //   e.preventDefault()
//   //   setError('')
//   //   setMessage('')

//   //   if (pinForm.newPin !== pinForm.confirmPin) {
//   //     setError('PINs do not match')
//   //     return
//   //   }

//   //   const headers = withAuth()
//   //   if (!headers) return

//   //   try {
//   //     setLoading(true)
//   //     await api.put(
//   //       '/settings/transaction-pin',
//   //       {
//   //         currentPin: pinForm.currentPin || undefined,
//   //         newPin: pinForm.newPin,
//   //       },
//   //       { headers }
//   //     )
//   //     setMessage('✅ Transaction PIN updated successfully')
//   //     setPinForm({ currentPin: '', newPin: '', confirmPin: '' })
//   //   } catch (err) {
//   //     setError(err.response?.data?.message || 'Failed to update PIN')
//   //   } finally {
//   //     setLoading(false)
//   //   }
//   // }


// const verifyFace = async (faceData) => {
//   const token = localStorage.getItem('token')
//   if (!token) throw new Error('Not authenticated')

//   const res = await api.post(
//     '/biometric/verify-face',
//     { faceData },
//     { headers: { Authorization: `Bearer ${token}` } }
//   )

//   return res.data?.verified === true
// }

// const handlePinUpdate = async (e) => {
//   e.preventDefault()
//   setError('')
//   setMessage('')

//   if (pinForm.newPin !== pinForm.confirmPin) {
//     setError('PINs do not match')
//     return
//   }

//   const newPinStr = String(pinForm.newPin || '')
//   if (!(newPinStr.length === 4 || newPinStr.length === 6)) {
//     setError('PIN must be 4 or 6 digits')
//     return
//   }

//   const headers = withAuth()
//   if (!headers) {
//     setError('Not authenticated - please login again')
//     return
//   }

//   // Require face to be registered
//   if (!biometricStatus.faceRegistered) {
//     setError('Face not registered. Please register your face in Settings first.')
//     return
//   }

//   // Require a fresh captured face for this action
//   if (!capturedFace) {
//     setError('Please capture your face to change PIN.')
//     // Optional: auto-open camera
//     // startCamera()
//     return
//   }

//   try {
//     setLoading(true)

//     // 1) verify face
//     const ok = await verifyFace(capturedFace)
//     if (!ok) {
//       setError('Face verification failed.')
//       return
//     }

//     // 2) update pin
//     await api.put(
//       '/settings/transaction-pin',
//       {
//         currentPin: pinForm.currentPin || undefined,
//         newPin: pinForm.newPin,
//       },
//       { headers }
//     )

//     setMessage('✅ Transaction PIN updated successfully (Face verified)')
//     setPinForm({ currentPin: '', newPin: '', confirmPin: '' })

//     // clear captured face after using it
//     setCapturedFace(null)
//   } catch (err) {
//     setError(err.response?.data?.message || err.message || 'Failed to update PIN')
//   } finally {
//     setLoading(false)
//   }
// }
// const handlePasswordUpdate = async (e) => {
//   e.preventDefault()
//   setError('')
//   setMessage('')

//   if (passwordForm.newPassword !== passwordForm.confirmPassword) {
//     setError('Passwords do not match')
//     return
//   }

//   if ((passwordForm.newPassword || '').length < 8) {
//     setError('Password must be at least 8 characters')
//     return
//   }

//   const headers = withAuth()
//   if (!headers) {
//     setError('Not authenticated - please login again')
//     return
//   }

//   // Require face to be registered
//   if (!biometricStatus.faceRegistered) {
//     setError('Face not registered. Please register your face in Settings first.')
//     return
//   }

//   // Require a fresh captured face for this action
//   if (!capturedFace) {
//     setError('Please capture your face to change password.')
//     // Optional: auto-open camera
//     // startCamera()
//     return
//   }

//   try {
//     setLoading(true)

//     // 1) verify face
//     const ok = await verifyFace(capturedFace)
//     if (!ok) {
//       setError('Face verification failed.')
//       return
//     }

//     // 2) update password
//     await api.put(
//       '/settings/password',
//       {
//         currentPassword: passwordForm.currentPassword,
//         newPassword: passwordForm.newPassword,
//       },
//       { headers }
//     )

//     setMessage('✅ Password updated successfully (Face verified)')
//     setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })

//     // clear captured face after using it
//     setCapturedFace(null)
//   } catch (err) {
//     setError(err.response?.data?.message || err.message || 'Failed to update password')
//   } finally {
//     setLoading(false)
//   }
// }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
//       {/* Top Bar */}
//       <header className="border-b border-white/20 bg-white/70 backdrop-blur-2xl shadow-lg shadow-emerald-500/5">
//         <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-2.5">
//             <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/40">
//               <svg
//                 className="h-4 w-4 text-white"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2.5"
//                 viewBox="0 0 24 24"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//               </svg>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Account</p>
//               <p className="text-sm font-bold text-gray-900">Settings</p>
//             </div>
//           </div>

//           <button
//             onClick={() => navigate('/dashboard')}
//             className="text-xs sm:text-sm px-4 py-2 rounded-full border-2 border-emerald-500 text-emerald-600 font-semibold hover:bg-emerald-50 hover:scale-105 transition-all duration-300"
//           >
//             ← Back to Dashboard
//           </button>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
//         {/* Messages */}
//         {(message || error) && (
//           <div className="space-y-2">
//             {message && (
//               <div className="p-4 rounded-xl bg-emerald-50/80 backdrop-blur-sm border border-emerald-200/60 shadow-lg">
//                 <div className="flex items-center gap-2">
//                   <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//                   </svg>
//                   <span className="text-sm font-medium text-emerald-800">{message}</span>
//                 </div>
//               </div>
//             )}
//             {error && (
//               <div className="p-4 rounded-xl bg-red-50/80 backdrop-blur-sm border border-red-200/60 shadow-lg">
//                 <div className="flex items-center gap-2">
//                   <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   <span className="text-sm font-medium text-red-800">{error}</span>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Header */}
//         <section className="space-y-1">
//           <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Security & Profile</h1>
//           <p className="text-xs sm:text-sm text-gray-600">
//             Manage biometrics, personal information, password and transaction PIN.
//           </p>
//         </section>

//         {/* Biometric Threshold Setting */}
//         <section className="bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-gray-200/50 p-4 sm:p-5 space-y-3 shadow-xl shadow-emerald-500/5">
//           <h2 className="text-sm sm:text-base font-extrabold text-gray-900">Biometric Threshold</h2>
//           <p className="text-xs sm:text-sm text-gray-600">
//             Set the minimum withdrawal amount that requires biometric verification.
//           </p>

//           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
//             <div className="flex items-center gap-2">
//               <span className="text-sm text-gray-600 font-semibold">₹</span>
//               <input
//                 type="number"
//                 min="1000"
//                 max="100000"
//                 step="500"
//                 value={threshold}
//                 onChange={(e) => {
//                   const val = Number(e.target.value)
//                   setThreshold(val)
//                   if (error.includes('Threshold')) setError('')
//                 }}
//                 className="w-32 rounded-xl bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-emerald-300/50 transition-all duration-300"
//               />
//             </div>

//             <div className="text-xs text-gray-500 font-medium">
//               Min: ₹1,000 • Max: ₹1,00,000
//             </div>

//             <button
//               onClick={handleThresholdUpdate}
//               disabled={loading || threshold < 1000 || threshold > 100000}
//               className="px-5 py-2 text-xs rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-500/70 font-bold hover:bg-emerald-100 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300"
//             >
//               {loading ? 'Saving...' : 'Save Threshold'}
//             </button>
//           </div>

//           <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50/50 border border-blue-200/40">
//             <svg className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             <p className="text-xs text-gray-600 leading-relaxed">
//               Withdrawals above <span className="text-emerald-600 font-bold">₹{threshold.toLocaleString('en-IN')}</span> will require biometric verification
//             </p>
//           </div>
//         </section>

//         {/* Biometric Settings */}
//         <section className="bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-gray-200/50 p-4 sm:p-5 space-y-4 shadow-xl shadow-emerald-500/5">
//           <h2 className="text-sm sm:text-base font-extrabold text-gray-900 mb-1">Biometric Security</h2>
//           <p className="text-xs sm:text-sm text-gray-600 mb-2">
//             Link your fingerprint and face data for secure withdrawals above ₹{threshold.toLocaleString('en-IN')}.
//           </p>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {/* Fingerprint Section */}
//             <div className="rounded-2xl border-2 border-emerald-200/50 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 shadow-lg hover:shadow-xl hover:border-emerald-300 transition-all duration-300">
//               <div className="flex items-center gap-3 mb-3">
//                 <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
//                   <svg
//                     className="h-5 w-5 text-white"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     viewBox="0 0 24 24"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="text-sm font-bold text-gray-900">Fingerprint</p>
//                   <p className="text-xs text-gray-600">For withdrawals above ₹{threshold.toLocaleString('en-IN')}</p>
//                 </div>
//               </div>

//               {biometricStatus.fingerprintRegistered ? (
//                 <div className="space-y-2">
//                   <div className="text-xs text-emerald-600 font-bold">✓ Fingerprint registered</div>
//                   <div className="text-xs text-gray-600">Ready for secure transactions</div>
//                 </div>
//               ) : (
//                 <button
//                   onClick={registerFingerprint}
//                   disabled={loading}
//                   className="w-full px-4 py-2.5 text-xs rounded-full bg-emerald-100 text-emerald-600 border-2 border-emerald-500/70 font-bold hover:bg-emerald-200 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
//                 >
//                   {loading ? 'Connecting...' : 'Register Fingerprint'}
//                 </button>
//               )}
//             </div>

//             {/* Face Section */}
//             <div className="rounded-2xl border-2 border-amber-200/50 bg-gradient-to-br from-amber-50 to-orange-50 p-4 shadow-lg hover:shadow-xl hover:border-amber-300 transition-all duration-300">
//               <div className="flex items-center gap-3 mb-3">
//                 <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
//                   <svg
//                     className="h-5 w-5 text-white"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     viewBox="0 0 24 24"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="text-sm font-bold text-gray-900">Face Recognition</p>
//                   <p className="text-xs text-gray-600">For withdrawals above ₹{threshold.toLocaleString('en-IN')}</p>
//                 </div>
//               </div>

//               {biometricStatus.faceRegistered ? (
//                 <div className="space-y-3">
//                   <div className="text-xs text-amber-600 font-bold">✓ Face registered</div>
//                   <div className="relative rounded-xl overflow-hidden border-2 border-amber-200/40 bg-black shadow-lg">
//                     {capturedFace ? (
//                       <img
//                         src={capturedFace}
//                         alt="Registered face"
//                         className="w-full h-40 object-cover"
//                       />
//                     ) : (
//                       <div className="w-full h-40 flex items-center justify-center bg-gray-900">
//                         <svg
//                           className="h-12 w-12 text-gray-600"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="1.5"
//                           viewBox="0 0 24 24"
//                         >
//                           <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
//                         </svg>
//                       </div>
//                     )}
//                     <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-1 px-2">
//                       <p className="text-[10px] text-amber-300 text-center font-medium">
//                         Your Registered Face
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={reuploadFace}
//                     disabled={loading}
//                     className="w-full px-4 py-2.5 text-xs rounded-full bg-gray-100 text-gray-700 border-2 border-gray-300 font-bold hover:bg-gray-200 hover:scale-105 transition-all duration-300"
//                   >
//                     Update Face
//                   </button>
//                 </div>
//               ) : showCamera ? (
//                 <div className="space-y-3">
//                   <div className="relative rounded-xl overflow-hidden border-2 border-amber-400 bg-black shadow-xl">
//                     <video
//                       ref={videoRef}
//                       autoPlay
//                       playsInline
//                       muted
//                       className="w-full h-40 object-cover"
//                     />
//                     <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-2 px-3">
//                       <p className="text-xs text-white text-center font-medium">
//                         Capturing automatically in 3 seconds...
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={cancelCamera}
//                     className="w-full px-4 py-2.5 text-xs rounded-full bg-gray-100 text-gray-700 border-2 border-gray-300 font-bold hover:bg-gray-200 transition-all"
//                   >
//                     Cancel Camera
//                   </button>
//                 </div>
//               ) : capturedFace ? (
//                 <div className="space-y-3">
//                   <div className="relative rounded-xl overflow-hidden border-2 border-amber-400/50 bg-black shadow-lg">
//                     <img
//                       src={capturedFace}
//                       alt="Captured face"
//                       className="w-full h-40 object-cover"
//                     />
//                     <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-1 px-2">
//                       <p className="text-xs text-amber-300 text-center font-medium">Captured Face</p>
//                     </div>
//                   </div>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={registerFace}
//                       disabled={loading}
//                       className="flex-1 px-4 py-2.5 text-xs rounded-full bg-amber-100 text-amber-600 border-2 border-amber-500/70 font-bold hover:bg-amber-200 hover:scale-105 transition-all duration-300 disabled:opacity-50"
//                     >
//                       {loading ? 'Saving...' : 'Save Face'}
//                     </button>
//                     <button
//                       onClick={startCamera}
//                       className="flex-1 px-4 py-2.5 text-xs rounded-full bg-gray-100 text-gray-700 border-2 border-gray-300 font-bold hover:bg-gray-200 hover:scale-105 transition-all duration-300"
//                     >
//                       Retake
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-white">
//                     <svg
//                       className="h-12 w-12 mx-auto text-gray-400 mb-2"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="1.5"
//                       viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
//                     </svg>
//                     <p className="text-xs text-gray-600 mb-1 font-medium">No face registered yet</p>
//                     <p className="text-[10px] text-gray-500 mb-3">
//                       Tap below to add your face
//                     </p>
//                     <button
//                       onClick={startCamera}
//                       disabled={isCapturing}
//                       className="px-4 py-2.5 text-xs rounded-full bg-amber-100 text-amber-600 border-2 border-amber-500/70 font-bold hover:bg-amber-200 hover:scale-105 transition-all duration-300 disabled:opacity-50"
//                     >
//                       {isCapturing ? 'Opening Camera...' : 'Capture Your Face'}
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </section>

//         {/* Hidden canvas */}
//         <canvas ref={canvasRef} className="hidden" />

//         {/* Personal Info Section */}
//         <section className="bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-gray-200/50 p-4 sm:p-5 space-y-4 shadow-xl shadow-emerald-500/5">
//           <div className="flex items-center justify-between">
//             <h2 className="text-sm sm:text-base font-extrabold text-gray-900">Personal Information</h2>
//             <span className="text-xs text-gray-500 font-medium">
//               Keep this up to date for recovery and KYC.
//             </span>
//           </div>

//           <form
//             className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm"
//             onSubmit={handleSaveProfile}
//           >
//             <div className="space-y-2">
//               <label className="block text-sm font-semibold text-gray-700">Full Name</label>
//               <input
//                 type="text"
//                 value={profile.fullName}
//                 onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
//                 className="w-full rounded-xl bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-emerald-300/50 transition-all duration-300"
//               />
//             </div>
//             <div className="space-y-2">
//               <label className="block text-sm font-semibold text-gray-700">Email</label>
//               <input
//                 type="email"
//                 value={profile.email}
//                 disabled
//                 className="w-full rounded-xl bg-gray-100 border-2 border-gray-300 px-4 py-3 text-sm text-gray-500 cursor-not-allowed"
//               />
//             </div>
//             <div className="space-y-2">
//               <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
//               <input
//                 type="tel"
//                 value={profile.phone}
//                 onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
//                 placeholder="+91 XXXXX XXXXX"
//                 className="w-full rounded-xl bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-emerald-300/50 transition-all duration-300"
//               />
//             </div>
//             <div className="space-y-2">
//               <label className="block text-sm font-semibold text-gray-700">City</label>
//               <input
//                 type="text"
//                 value={profile.city}
//                 onChange={(e) => setProfile({ ...profile, city: e.target.value })}
//                 placeholder="Your city"
//                 className="w-full rounded-xl bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-emerald-300/50 transition-all duration-300"
//               />
//             </div>
//             <div className="space-y-2 sm:col-span-2">
//               <label className="block text-sm font-semibold text-gray-700">Address</label>
//               <input
//                 type="text"
//                 value={profile.address}
//                 onChange={(e) => setProfile({ ...profile, address: e.target.value })}
//                 placeholder="Flat / Street / Area"
//                 className="w-full rounded-xl bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-emerald-300/50 transition-all duration-300"
//               />
//             </div>

//             <div className="flex justify-end pt-2 sm:col-span-2">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="px-6 py-3 rounded-full text-sm bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white font-bold shadow-xl shadow-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/60 hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:hover:scale-100"
//               >
//                 {loading ? 'Saving...' : 'Save Personal Info'}
//               </button>
//             </div>
//           </form>
//         </section>

//         {/* Password & Transaction PIN Sections */}
//         <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
//           {/* Password */}
//           <div className="bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-gray-200/50 p-4 sm:p-5 space-y-3 shadow-xl shadow-emerald-500/5">
//             <h2 className="text-sm sm:text-base font-extrabold text-gray-900">Password</h2>
//             <p className="text-xs text-gray-600">
//               Create a strong password with at least 8 characters.
//             </p>

//             <form className="space-y-3 text-xs sm:text-sm" onSubmit={handlePasswordUpdate}>
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-gray-700">Current Password</label>
//                 <input
//                   type="password"
//                   value={passwordForm.currentPassword}
//                   onChange={(e) =>
//                     setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
//                   }
//                   className="w-full rounded-xl bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-emerald-300/50 transition-all duration-300"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-gray-700">New Password</label>
//                 <input
//                   type="password"
//                   value={passwordForm.newPassword}
//                   onChange={(e) =>
//                     setPasswordForm({ ...passwordForm, newPassword: e.target.value })
//                   }
//                   className="w-full rounded-xl bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-emerald-300/50 transition-all duration-300"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-gray-700">Confirm New Password</label>
//                 <input
//                   type="password"
//                   value={passwordForm.confirmPassword}
//                   onChange={(e) =>
//                     setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
//                   }
//                   className="w-full rounded-xl bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-emerald-300/50 transition-all duration-300"
//                 />
//               </div>

//               <div className="pt-2 flex justify-end">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="px-5 py-2.5 rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-500/70 font-bold text-sm hover:bg-emerald-100 hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 transition-all duration-300"
//                 >
//                   {loading ? 'Updating...' : 'Update Password'}
//                 </button>
//               </div>
//             </form>
//           </div>

//           {/* Transaction PIN
//           <div className="bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-gray-200/50 p-4 sm:p-5 space-y-3 shadow-xl shadow-emerald-500/5">
//             <h2 className="text-sm sm:text-base font-extrabold text-gray-900">Transaction PIN</h2>
//             <p className="text-xs text-gray-600">
//               Set a 4 or 6 digit PIN to approve withdrawals and deposits.
//             </p>

//             <form className="space-y-3 text-xs sm:text-sm" onSubmit={handlePinUpdate}>
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-gray-700">Current PIN (optional)</label>
//                 <input
//                   type="password"
//                   maxLength={6}
//                   value={pinForm.currentPin}
//                   onChange={(e) =>
//                     setPinForm({ ...pinForm, currentPin: e.target.value })
//                   }
//                   className="w-full rounded-xl bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-emerald-300/50 transition-all duration-300"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-gray-700">New PIN</label>
//                 <input
//                   type="password"
//                   maxLength={6}
//                   value={pinForm.newPin}
//                   onChange={(e) =>
//                     setPinForm({ ...pinForm, newPin: e.target.value })
//                   }
//                   className="w-full rounded-xl bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-emerald-300/50 transition-all duration-300"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-gray-700">Confirm New PIN</label>
//                 <input
//                   type="password"
//                   maxLength={6}
//                   value={pinForm.confirmPin}
//                   onChange={(e) =>
//                     setPinForm({ ...pinForm, confirmPin: e.target.value })
//                   }
//                   className="w-full rounded-xl bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-emerald-300/50 transition-all duration-300"
//                 />
//               </div>

//               <div className="pt-2 flex justify-end">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/60 hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:hover:scale-100"
//                 >
//                   {loading ? 'Saving...' : 'Save PIN'}
//                 </button>
//               </div>
//             </form>
//           </div> */}
//           {/* Transaction PIN */}
// <div className="bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-gray-200/50 p-4 sm:p-5 space-y-3 shadow-xl shadow-emerald-500/5">
//   <h2 className="text-sm sm:text-base font-extrabold text-gray-900">Transaction PIN</h2>
//   <p className="text-xs text-gray-600">
//     Set a 4 or 6 digit PIN to approve withdrawals and deposits.
//   </p>

//   {/* Face verification requirement note */}
//   <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50/60 border border-amber-200/50">
//     <svg className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//     </svg>
//     <div className="text-xs text-gray-700 leading-relaxed">
//       <p className="font-bold text-amber-700">Face verification required</p>
//       <p>Capture your face below before saving the PIN.</p>
//     </div>
//   </div>

//   {/* Face capture UI (for PIN change) */}
//   {!biometricStatus.faceRegistered ? (
//     <div className="p-4 rounded-xl bg-red-50/80 border border-red-200/60 text-xs text-red-700 font-semibold">
//       Face not registered. Please register your face in the Face Recognition section first.
//     </div>
//   ) : showCamera ? (
//     <div className="space-y-3">
//       <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400 bg-black shadow-xl">
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           muted
//           className="w-full h-48 object-cover"
//         />
//         <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-2 px-3">
//           <p className="text-xs text-white text-center font-medium">
//             Capturing automatically in 3 seconds...
//           </p>
//         </div>
//       </div>

//       <button
//         type="button"
//         onClick={cancelCamera}
//         className="w-full px-4 py-2.5 text-xs rounded-full bg-gray-100 text-gray-700 border-2 border-gray-300 font-bold hover:bg-gray-200 transition-all"
//       >
//         Cancel Camera
//       </button>
//     </div>
//   ) : capturedFace ? (
//     <div className="space-y-3">
//       <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400/60 bg-black shadow-xl">
//         <img
//           src={capturedFace}
//           alt="Face captured for PIN update"
//           className="w-full h-48 object-cover"
//         />
//         <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-2 px-3">
//           <p className="text-xs text-amber-300 text-center font-medium">
//             Face captured for verification
//           </p>
//         </div>
//       </div>

//       <button
//         type="button"
//         onClick={() => {
//           setCapturedFace(null)
//           startCamera()
//         }}
//         disabled={loading}
//         className="w-full px-4 py-2.5 text-xs rounded-full bg-gray-100 text-gray-700 border-2 border-gray-300 font-bold hover:bg-gray-200 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
//       >
//         Retake Face
//       </button>
//     </div>
//   ) : (
//     <button
//       type="button"
//       onClick={startCamera}
//       disabled={loading || isCapturing}
//       className="w-full px-4 py-2.5 text-xs rounded-full bg-amber-100 text-amber-700 border-2 border-amber-500/60 font-bold hover:bg-amber-200 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
//     >
//       {isCapturing ? 'Opening Camera...' : 'Capture Face for PIN Change'}
//     </button>
//   )}

//   {/* PIN form */}
//   <form className="space-y-3 text-xs sm:text-sm pt-2" onSubmit={handlePinUpdate}>
//     <div className="space-y-2">
//       <label className="block text-sm font-semibold text-gray-700">Current PIN (optional)</label>
//       <input
//         type="password"
//         inputMode="numeric"
//         maxLength={6}
//         value={pinForm.currentPin}
//         onChange={(e) => setPinForm({ ...pinForm, currentPin: e.target.value })}
//         className="w-full rounded-xl bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-emerald-300/50 transition-all duration-300"
//       />
//     </div>

//     <div className="space-y-2">
//       <label className="block text-sm font-semibold text-gray-700">New PIN</label>
//       <input
//         type="password"
//         inputMode="numeric"
//         maxLength={6}
//         value={pinForm.newPin}
//         onChange={(e) => setPinForm({ ...pinForm, newPin: e.target.value })}
//         className="w-full rounded-xl bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-emerald-300/50 transition-all duration-300"
//       />
//     </div>

//     <div className="space-y-2">
//       <label className="block text-sm font-semibold text-gray-700">Confirm New PIN</label>
//       <input
//         type="password"
//         inputMode="numeric"
//         maxLength={6}
//         value={pinForm.confirmPin}
//         onChange={(e) => setPinForm({ ...pinForm, confirmPin: e.target.value })}
//         className="w-full rounded-xl bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-emerald-300/50 transition-all duration-300"
//       />
//     </div>

//     <div className="pt-2 flex justify-end">
//       <button
//         type="submit"
//         disabled={loading || !biometricStatus.faceRegistered || !capturedFace}
//         className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/60 hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed"
//       >
//         {loading ? 'Saving...' : 'Save PIN (Face Verified)'}
//       </button>
//     </div>

//     {!capturedFace && biometricStatus.faceRegistered && (
//       <p className="text-[11px] text-gray-500">
//         Capture face to enable Save PIN.
//       </p>
//     )}
//   </form>
// </div>

//         </section>
//       </main>
//     </div>
//   )
// }

// export default SettingsPage














// src/pages/SettingsPage.jsx - FULL FIXED (Face verify for Password + PIN, no current password)
import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { browserSupportsWebAuthn, startRegistration } from '@simplewebauthn/browser'

function SettingsPage() {
  const navigate = useNavigate()

  // Shared camera refs
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    address: '',
  })

  const [biometricStatus, setBiometricStatus] = useState({
    faceRegistered: false,
    fingerprintRegistered: false,
  })

  // Password: NO currentPassword (only new + confirm)
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
  })

  const [pinForm, setPinForm] = useState({
    currentPin: '',
    newPin: '',
    confirmPin: '',
  })

  const [threshold, setThreshold] = useState(5000)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Registered face preview (for Face Registration section ONLY)
  const [registeredFace, setRegisteredFace] = useState(null)

  // Camera flow control
  const [cameraMode, setCameraMode] = useState(null) // 'REGISTER_FACE' | 'VERIFY_PIN' | 'VERIFY_PASSWORD' | null
  const [showCamera, setShowCamera] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)

  // Fresh verification captures for sensitive actions
  const [pinVerifyFace, setPinVerifyFace] = useState(null)
  const [passwordVerifyFace, setPasswordVerifyFace] = useState(null)

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
        streamRef.current = null
      }
    }
  }, [])

  // Load data on mount
  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem('token')
      if (!token) return

      const headers = { Authorization: `Bearer ${token}` }

      try {
        const res = await api.get('/settings/me', { headers })

        setProfile({
          fullName: res.data.fullName || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          city: res.data.city || '',
          address: res.data.address || '',
        })

        setThreshold(
          res.data.biometricThreshold ??
            res.data.securitySettings?.biometricThreshold ??
            5000
        )

        const faceRes = await api.get('/biometric/status', { headers })
        const fpRes = await api.get('/fingerprint/status', { headers })

        setBiometricStatus({
          faceRegistered: Boolean(faceRes.data.faceRegistered),
          fingerprintRegistered: Boolean(fpRes.data.fingerprintRegistered),
        })

        // If backend sends faceData in /settings/me, keep preview
        if (faceRes.data.faceRegistered && res.data.faceData) {
          setRegisteredFace(res.data.faceData)
        }
      } catch (err) {
        console.error('Failed to load settings:', err)
        setError('Failed to load settings')
      }
    }

    load()
  }, [])

  const withAuth = () => {
    const token = localStorage.getItem('token')
    return token ? { Authorization: `Bearer ${token}` } : null
  }

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  const cancelCamera = () => {
    stopCameraStream()
    setShowCamera(false)
    setIsCapturing(false)
    setCameraMode(null)
  }

  const startCamera = async (mode) => {
    try {
      setCameraMode(mode)
      setShowCamera(true)
      setIsCapturing(true)
      setError('')
      setMessage('')

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream

        await new Promise((resolve, reject) => {
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().then(resolve).catch(reject)
          }
          setTimeout(() => reject(new Error('Video loading timeout')), 10000)
        })

        // Auto capture after 3 seconds
        setTimeout(() => {
          if (streamRef.current) captureFacePhoto(mode)
        }, 3000)
      }
    } catch (err) {
      console.error('Camera error:', err)

      if (err.name === 'NotAllowedError') setError('Camera access denied. Please allow camera permissions.')
      else if (err.name === 'NotFoundError') setError('No camera found on this device.')
      else setError('Failed to start camera: ' + err.message)

      setShowCamera(false)
      setIsCapturing(false)
      setCameraMode(null)
      stopCameraStream()
    }
  }

  const captureFacePhoto = (mode) => {
    try {
      const canvas = canvasRef.current
      const video = videoRef.current

      if (!canvas || !video) {
        setError('Camera not ready')
        return
      }

      if (video.readyState < video.HAVE_ENOUGH_DATA) {
        setError('Video not ready - please try again')
        cancelCamera()
        return
      }

      const ctx = canvas.getContext('2d')
      canvas.width = 320
      canvas.height = 240
      ctx.drawImage(video, 0, 0, 320, 240)

      const imageData = canvas.toDataURL('image/jpeg', 0.7)
      if (!imageData || imageData.length < 5000) {
        setError('Captured image is blank or too small - please try again')
        cancelCamera()
        return
      }

      if (mode === 'REGISTER_FACE') {
        setRegisteredFace(imageData)
        setMessage('✅ Face captured! Click "Save Face" to register.')
      } else if (mode === 'VERIFY_PIN') {
        setPinVerifyFace(imageData)
        setMessage('✅ Face captured for PIN verification.')
      } else if (mode === 'VERIFY_PASSWORD') {
        setPasswordVerifyFace(imageData)
        setMessage('✅ Face captured for password verification.')
      }

      stopCameraStream()
      setShowCamera(false)
      setIsCapturing(false)
      setCameraMode(null)
    } catch (err) {
      console.error('Capture error:', err)
      setError('Failed to capture photo: ' + err.message)
      cancelCamera()
    }
  }

  // Register/Update face
  const registerFace = async () => {
    const headers = withAuth()
    if (!headers) {
      setError('Not authenticated - please login again')
      return
    }

    if (!registeredFace) {
      setError('No face data captured - please capture your face first')
      return
    }

    try {
      setLoading(true)
      setError('')
      setMessage('')

      await api.post('/biometric/register-face', { faceData: registeredFace }, { headers })

      setBiometricStatus(s => ({ ...s, faceRegistered: true }))
      setMessage('✅ Face registered successfully! You can now use face verification.')
    } catch (err) {
      console.error('Face registration error:', err)
      setError(err.response?.data?.message || 'Failed to register face')
    } finally {
      setLoading(false)
    }
  }

  const reuploadFace = () => {
    setRegisteredFace(null)
    setError('')
    setMessage('')
    startCamera('REGISTER_FACE')
  }

  // Fingerprint registration
  const registerFingerprint = async () => {
    const headers = withAuth()
    if (!headers) {
      setError('Not authenticated - please login again')
      return
    }

    if (!browserSupportsWebAuthn()) {
      setError('Your browser does not support fingerprint authentication')
      return
    }

    try {
      setLoading(true)
      setError('')
      setMessage('')

      const optResponse = await api.get('/fingerprint/init-register', { headers })
      const credential = await startRegistration(optResponse.data)
      await api.post('/fingerprint/verify-register', credential, { headers })

      setBiometricStatus(s => ({ ...s, fingerprintRegistered: true }))
      setMessage('✅ Fingerprint registered successfully!')
    } catch (err) {
      console.error('Fingerprint registration error:', err)
      if (err.name === 'NotAllowedError') setError('Fingerprint registration cancelled by user')
      else setError(err.response?.data?.error || 'Failed to register fingerprint')
    } finally {
      setLoading(false)
    }
  }

  // Threshold update
  const handleThresholdUpdate = async () => {
    const headers = withAuth()
    if (!headers) {
      setError('Not authenticated')
      return
    }

    if (threshold < 1000 || threshold > 100000) {
      setError('Threshold must be between ₹1,000 and ₹1,00,000')
      return
    }

    try {
      setLoading(true)
      setError('')
      setMessage('')

      await api.put('/settings/biometric-threshold', { biometricThreshold: threshold }, { headers })
      setMessage('✅ Biometric threshold updated to ₹' + threshold.toLocaleString('en-IN'))
    } catch (err) {
      console.error('Threshold update error:', err)
      setError(err.response?.data?.message || 'Failed to update threshold')
    } finally {
      setLoading(false)
    }
  }

  // Save profile
  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    const headers = withAuth()
    if (!headers) return

    try {
      setLoading(true)
      await api.put(
        '/settings/profile',
        {
          fullName: profile.fullName,
          phone: profile.phone,
          city: profile.city,
          address: profile.address,
        },
        { headers }
      )
      setMessage('✅ Profile updated successfully.')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  // Face verify helper
  const verifyFace = async (faceData) => {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Not authenticated')

    const res = await api.post(
      '/biometric/verify-face',
      { faceData },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    return res.data?.verified === true
  }

  // Password update (NO currentPassword)
  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if ((passwordForm.newPassword || '').length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    const headers = withAuth()
    if (!headers) {
      setError('Not authenticated - please login again')
      return
    }

    if (!biometricStatus.faceRegistered) {
      setError('Face not registered. Please register your face in Settings first.')
      return
    }

    if (!passwordVerifyFace) {
      setError('Please verify your face to change password.')
      return
    }

    try {
      setLoading(true)

      const ok = await verifyFace(passwordVerifyFace)
      if (!ok) {
        setError('Face verification failed.')
        return
      }

   await api.put(
  '/settings/password',
  { newPassword: passwordForm.newPassword, faceData: passwordVerifyFace },
  { headers }
)


      setMessage('✅ Password updated successfully')
      setPasswordForm({ newPassword: '', confirmPassword: '' })
      setPasswordVerifyFace(null)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  // PIN update
  const handlePinUpdate = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (pinForm.newPin !== pinForm.confirmPin) {
      setError('PINs do not match')
      return
    }

    const newPinStr = String(pinForm.newPin || '')
    if (!(newPinStr.length === 4 || newPinStr.length === 6)) {
      setError('PIN must be 4 or 6 digits')
      return
    }

    const headers = withAuth()
    if (!headers) {
      setError('Not authenticated - please login again')
      return
    }

    if (!biometricStatus.faceRegistered) {
      setError('Face not registered. Please register your face in Settings first.')
      return
    }

    if (!pinVerifyFace) {
      setError('Please verify your face to change PIN.')
      return
    }

    try {
      setLoading(true)

      const ok = await verifyFace(pinVerifyFace)
      if (!ok) {
        setError('Face verification failed.')
        return
      }

 await api.put(
  '/settings/transaction-pin',
  { newPin: pinForm.newPin, faceData: pinVerifyFace },
  { headers }
)



      setMessage('✅ Transaction PIN updated successfully')
      setPinForm({ currentPin: '', newPin: '', confirmPin: '' })
      setPinVerifyFace(null)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update PIN')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      {/* Top Bar */}
      <header className="border-b border-white/20 bg-white/70 backdrop-blur-2xl shadow-lg shadow-emerald-500/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/40">
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Account</p>
              <p className="text-sm font-bold text-gray-900">Settings</p>
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Messages */}
        {(message || error) && (
          <div className="space-y-2">
            {message && (
              <div className="p-4 rounded-xl bg-emerald-50/80 backdrop-blur-sm border border-emerald-200/60 shadow-lg">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium text-emerald-800">{message}</span>
                </div>
              </div>
            )}
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
          </div>
        )}

        {/* Header */}
        <section className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Security & Profile</h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Manage biometrics, personal information, password and transaction PIN.
          </p>
        </section>

        {/* Threshold */}
        <section className="bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-gray-200/50 p-4 sm:p-5 space-y-3 shadow-xl shadow-emerald-500/5">
          <h2 className="text-sm sm:text-base font-extrabold text-gray-900">Biometric Threshold</h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Set the minimum withdrawal amount that requires biometric verification.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-semibold">₹</span>
              <input
                type="number"
                min="1000"
                max="100000"
                step="500"
                value={threshold}
                onChange={(e) => {
                  const val = Number(e.target.value)
                  setThreshold(val)
                  if (error.includes('Threshold')) setError('')
                }}
                className="w-32 rounded-xl bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-emerald-300/50 transition-all duration-300"
              />
            </div>

            <div className="text-xs text-gray-500 font-medium">
              Min: ₹1,000 • Max: ₹1,00,000
            </div>

            <button
              onClick={handleThresholdUpdate}
              disabled={loading || threshold < 1000 || threshold > 100000}
              className="px-5 py-2 text-xs rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-500/70 font-bold hover:bg-emerald-100 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300"
            >
              {loading ? 'Saving...' : 'Save Threshold'}
            </button>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50/50 border border-blue-200/40">
            <svg className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-gray-600 leading-relaxed">
              Withdrawals above <span className="text-emerald-600 font-bold">₹{threshold.toLocaleString('en-IN')}</span> will require biometric verification
            </p>
          </div>
        </section>

        {/* Biometrics */}
        <section className="bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-gray-200/50 p-4 sm:p-5 space-y-4 shadow-xl shadow-emerald-500/5">
          <h2 className="text-sm sm:text-base font-extrabold text-gray-900 mb-1">Biometric Security</h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-2">
            Link your fingerprint and face data for secure withdrawals above ₹{threshold.toLocaleString('en-IN')}.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Fingerprint */}
            <div className="rounded-2xl border-2 border-emerald-200/50 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 shadow-lg hover:shadow-xl hover:border-emerald-300 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Fingerprint</p>
                  <p className="text-xs text-gray-600">For withdrawals above ₹{threshold.toLocaleString('en-IN')}</p>
                </div>
              </div>

              {biometricStatus.fingerprintRegistered ? (
                <div className="space-y-2">
                  <div className="text-xs text-emerald-600 font-bold">✓ Fingerprint registered</div>
                  <div className="text-xs text-gray-600">Ready for secure transactions</div>
                </div>
              ) : (
                <button
                  onClick={registerFingerprint}
                  disabled={loading}
                  className="w-full px-4 py-2.5 text-xs rounded-full bg-emerald-100 text-emerald-600 border-2 border-emerald-500/70 font-bold hover:bg-emerald-200 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {loading ? 'Connecting...' : 'Register Fingerprint'}
                </button>
              )}
            </div>

            {/* Face */}
            <div className="rounded-2xl border-2 border-amber-200/50 bg-gradient-to-br from-amber-50 to-orange-50 p-4 shadow-lg hover:shadow-xl hover:border-amber-300 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Face Recognition</p>
                  <p className="text-xs text-gray-600">For withdrawals above ₹{threshold.toLocaleString('en-IN')}</p>
                </div>
              </div>

              {biometricStatus.faceRegistered ? (
                <div className="space-y-3">
                  <div className="text-xs text-amber-600 font-bold">✓ Face registered</div>

                  <div className="relative rounded-xl overflow-hidden border-2 border-amber-200/40 bg-black shadow-lg">
                    {registeredFace ? (
                      <img src={registeredFace} alt="Registered face" className="w-full h-40 object-cover" />
                    ) : (
                      <div className="w-full h-40 flex items-center justify-center bg-gray-900">
                        <div className="text-xs text-gray-400">No preview available</div>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-1 px-2">
                      <p className="text-[10px] text-amber-300 text-center font-medium">Your Registered Face</p>
                    </div>
                  </div>

                  <button
                    onClick={reuploadFace}
                    disabled={loading}
                    className="w-full px-4 py-2.5 text-xs rounded-full bg-gray-100 text-gray-700 border-2 border-gray-300 font-bold hover:bg-gray-200 hover:scale-105 transition-all duration-300"
                  >
                    Update Face
                  </button>
                </div>
              ) : showCamera && cameraMode === 'REGISTER_FACE' ? (
                <div className="space-y-3">
                  <div className="relative rounded-xl overflow-hidden border-2 border-amber-400 bg-black shadow-xl">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-40 object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-2 px-3">
                      <p className="text-xs text-white text-center font-medium">Capturing automatically in 3 seconds...</p>
                    </div>
                  </div>
                  <button
                    onClick={cancelCamera}
                    className="w-full px-4 py-2.5 text-xs rounded-full bg-gray-100 text-gray-700 border-2 border-gray-300 font-bold hover:bg-gray-200 transition-all"
                  >
                    Cancel Camera
                  </button>
                </div>
              ) : registeredFace ? (
                <div className="space-y-3">
                  <div className="relative rounded-xl overflow-hidden border-2 border-amber-400/50 bg-black shadow-lg">
                    <img src={registeredFace} alt="Captured face" className="w-full h-40 object-cover" />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={registerFace}
                      disabled={loading}
                      className="flex-1 px-4 py-2.5 text-xs rounded-full bg-amber-100 text-amber-600 border-2 border-amber-500/70 font-bold hover:bg-amber-200 hover:scale-105 transition-all duration-300 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Face'}
                    </button>
                    <button
                      onClick={() => startCamera('REGISTER_FACE')}
                      className="flex-1 px-4 py-2.5 text-xs rounded-full bg-gray-100 text-gray-700 border-2 border-gray-300 font-bold hover:bg-gray-200 hover:scale-105 transition-all duration-300"
                    >
                      Retake
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => startCamera('REGISTER_FACE')}
                  disabled={isCapturing}
                  className="w-full px-4 py-2.5 text-xs rounded-full bg-amber-100 text-amber-600 border-2 border-amber-500/70 font-bold hover:bg-amber-200 hover:scale-105 transition-all duration-300 disabled:opacity-50"
                >
                  {isCapturing ? 'Opening Camera...' : 'Capture Your Face'}
                </button>
              )}
            </div>
          </div>
        </section>

        {/* hidden canvas */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Personal Info */}
        <section className="bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-gray-200/50 p-4 sm:p-5 space-y-4 shadow-xl shadow-emerald-500/5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-extrabold text-gray-900">Personal Information</h2>
            <span className="text-xs text-gray-500 font-medium">Keep this up to date for recovery and KYC.</span>
          </div>

          <form className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm" onSubmit={handleSaveProfile}>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Full Name</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full rounded-xl bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-emerald-300/50 transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Email</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full rounded-xl bg-gray-100 border-2 border-gray-300 px-4 py-3 text-sm text-gray-500 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
                className="w-full rounded-xl bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-emerald-300/50 transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">City</label>
              <input
                type="text"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                placeholder="Your city"
                className="w-full rounded-xl bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-emerald-300/50 transition-all duration-300"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700">Address</label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                placeholder="Flat / Street / Area"
                className="w-full rounded-xl bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-emerald-300/50 transition-all duration-300"
              />
            </div>

            <div className="flex justify-end pt-2 sm:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-full text-sm bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white font-bold shadow-xl shadow-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/60 hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:hover:scale-100"
              >
                {loading ? 'Saving...' : 'Save Personal Info'}
              </button>
            </div>
          </form>
        </section>

        {/* Password & PIN */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Password */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-gray-200/50 p-4 sm:p-5 space-y-3 shadow-xl shadow-emerald-500/5">
            <h2 className="text-sm sm:text-base font-extrabold text-gray-900">Password</h2>
            <p className="text-xs text-gray-600">Create a strong password with at least 8 characters.</p>

            {/* Password face verify capture */}
            {biometricStatus.faceRegistered && (
              <div className="space-y-3">
                {showCamera && cameraMode === 'VERIFY_PASSWORD' ? (
                  <div className="space-y-3">
                    <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400 bg-black shadow-xl">
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-40 object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-2 px-3">
                        <p className="text-xs text-white text-center font-medium">Capturing automatically in 3 seconds...</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={cancelCamera}
                      className="w-full px-4 py-2.5 text-xs rounded-full bg-gray-100 text-gray-700 border-2 border-gray-300 font-bold hover:bg-gray-200 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                ) : passwordVerifyFace ? (
                  <div className="space-y-2">
                    <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-400 bg-black shadow-lg">
                      <img src={passwordVerifyFace} alt="Password verification face" className="w-full h-40 object-cover" />
                      <div className="absolute top-2 right-2 bg-emerald-500 rounded-full p-2 shadow-lg">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-emerald-600/90 py-2 px-3">
                        <p className="text-xs text-white text-center font-bold">✓ Face Verified Successfully</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPasswordVerifyFace(null)
                        startCamera('VERIFY_PASSWORD')
                      }}
                      disabled={loading}
                      className="w-full px-4 py-2 text-xs rounded-full bg-gray-100 text-gray-700 border-2 border-gray-300 font-bold hover:bg-gray-200 transition-all disabled:opacity-50"
                    >
                      Retake Face
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => startCamera('VERIFY_PASSWORD')}
                    disabled={loading || isCapturing}
                    className="w-full px-4 py-2.5 text-xs rounded-full bg-amber-100 text-amber-700 border-2 border-amber-500/60 font-bold hover:bg-amber-200 hover:scale-105 transition-all duration-300 disabled:opacity-50"
                  >
                    {isCapturing ? 'Opening Camera...' : 'Verify Face for Password Change'}
                  </button>
                )}
              </div>
            )}

            <form className="space-y-3 text-xs sm:text-sm" onSubmit={handlePasswordUpdate}>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full rounded-xl bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-emerald-300/50 transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full rounded-xl bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-emerald-300/50 transition-all duration-300"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading || (biometricStatus.faceRegistered && !passwordVerifyFace)}
                  className="px-5 py-2.5 rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-500/70 font-bold text-sm hover:bg-emerald-100 hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 transition-all duration-300"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>

          {/* Transaction PIN */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-gray-200/50 p-4 sm:p-5 space-y-3 shadow-xl shadow-emerald-500/5">
            <h2 className="text-sm sm:text-base font-extrabold text-gray-900">Transaction PIN</h2>
            <p className="text-xs text-gray-600">Set a 4 or 6 digit PIN to approve withdrawals and deposits.</p>

            {/* PIN face verify capture */}
            {biometricStatus.faceRegistered && (
              <div className="space-y-3">
                {showCamera && cameraMode === 'VERIFY_PIN' ? (
                  <div className="space-y-3">
                    <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400 bg-black shadow-xl">
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-40 object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-2 px-3">
                        <p className="text-xs text-white text-center font-medium">Capturing automatically in 3 seconds...</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={cancelCamera}
                      className="w-full px-4 py-2.5 text-xs rounded-full bg-gray-100 text-gray-700 border-2 border-gray-300 font-bold hover:bg-gray-200 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                ) : pinVerifyFace ? (
                  <div className="space-y-2">
                    <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-400 bg-black shadow-lg">
                      <img src={pinVerifyFace} alt="PIN verification face" className="w-full h-40 object-cover" />
                      <div className="absolute top-2 right-2 bg-emerald-500 rounded-full p-2 shadow-lg">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-emerald-600/90 py-2 px-3">
                        <p className="text-xs text-white text-center font-bold">✓ Face Verified Successfully</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPinVerifyFace(null)
                        startCamera('VERIFY_PIN')
                      }}
                      disabled={loading}
                      className="w-full px-4 py-2 text-xs rounded-full bg-gray-100 text-gray-700 border-2 border-gray-300 font-bold hover:bg-gray-200 transition-all disabled:opacity-50"
                    >
                      Retake Face
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => startCamera('VERIFY_PIN')}
                    disabled={loading || isCapturing}
                    className="w-full px-4 py-2.5 text-xs rounded-full bg-amber-100 text-amber-700 border-2 border-amber-500/60 font-bold hover:bg-amber-200 hover:scale-105 transition-all duration-300 disabled:opacity-50"
                  >
                    {isCapturing ? 'Opening Camera...' : 'Verify Face for PIN Change'}
                  </button>
                )}
              </div>
            )}

            <form className="space-y-3 text-xs sm:text-sm" onSubmit={handlePinUpdate}>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Current PIN (optional)</label>
                <input
                  type="password"
                  maxLength={6}
                  value={pinForm.currentPin}
                  onChange={(e) => setPinForm({ ...pinForm, currentPin: e.target.value })}
                  className="w-full rounded-xl bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-emerald-300/50 transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">New PIN</label>
                <input
                  type="password"
                  maxLength={6}
                  value={pinForm.newPin}
                  onChange={(e) => setPinForm({ ...pinForm, newPin: e.target.value })}
                  className="w-full rounded-xl bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-emerald-300/50 transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Confirm New PIN</label>
                <input
                  type="password"
                  maxLength={6}
                  value={pinForm.confirmPin}
                  onChange={(e) => setPinForm({ ...pinForm, confirmPin: e.target.value })}
                  className="w-full rounded-xl bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-emerald-300/50 transition-all duration-300"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading || (biometricStatus.faceRegistered && !pinVerifyFace)}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/60 hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:hover:scale-100"
                >
                  {loading ? 'Saving...' : 'Save PIN'}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Shared camera overlay area (if you want to show camera globally) */}
        {showCamera && (
          <div className="hidden">
            {/* camera is already rendered inside the cards; keeping this placeholder */}
          </div>
        )}
      </main>
    </div>
  )
}

export default SettingsPage
