 

// src/pages/WithdrawPage.jsx - COMPLETE WITH SUCCESS CARD
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
  const [step, setStep] = useState(1) // 1 = amount, 2 = PIN, 3 = biometric, 4 = success
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showCamera, setShowCamera] = useState(false)
  const [capturedFace, setCapturedFace] = useState(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [balance, setBalance] = useState(0)
  const [withdrawData, setWithdrawData] = useState(null)
  
  const [biometricStatus, setBiometricStatus] = useState({
    faceRegistered: false,
    fingerprintRegistered: false,
  })

  const [chosenBiometric, setChosenBiometric] = useState(null)
  const [biometricToken, setBiometricToken] = useState(null)
  const [threshold, setThreshold] = useState(5000)

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  // Load user data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          navigate('/login')
          return
        }

        const headers = { Authorization: `Bearer ${token}` }

        const balanceRes = await api.get('/wallet/balance', { headers })
        const currentBalance = balanceRes.data.balance
        setBalance(currentBalance)
        localStorage.setItem('balance', String(currentBalance))

        const faceRes = await api.get('/biometric/status', { headers })
        const fpRes = await api.get('/fingerprint/status', { headers })

        setBiometricStatus({
          faceRegistered: Boolean(faceRes.data.faceRegistered),
          fingerprintRegistered: Boolean(fpRes.data.fingerprintRegistered),
        })

        const settingsRes = await api.get('/settings/me', { headers })
        if (settingsRes.data.biometricThreshold !== undefined) {
          setThreshold(settingsRes.data.biometricThreshold)
        } else if (settingsRes.data.securitySettings?.biometricThreshold !== undefined) {
          setThreshold(settingsRes.data.securitySettings.biometricThreshold)
        }
      } catch (err) {
        console.error('Error loading data:', err)
        if (err.response?.status === 401) {
          navigate('/login')
        } else {
          setError('Failed to load account data')
        }
      }
    }
    loadData()
  }, [navigate])

  const startCamera = async () => {
    try {
      setError('')
      setShowCamera(true)
      setIsCapturing(true)

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream

        await new Promise((resolve, reject) => {
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play()
              .then(resolve)
              .catch(reject)
          }
          setTimeout(() => reject(new Error('Video loading timeout')), 10000)
        })

        setTimeout(() => {
          if (streamRef.current) {
            captureFacePhoto()
          }
        }, 3000)
      }
    } catch (err) {
      console.error('Camera error:', err)
      
      if (err.name === 'NotAllowedError') {
        setError('Camera access denied. Please allow camera permissions.')
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.')
      } else {
        setError('Failed to start camera: ' + err.message)
      }
      
      setShowCamera(false)
      setIsCapturing(false)
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
        streamRef.current = null
      }
    }
  }

  const captureFacePhoto = () => {
    try {
      const canvas = canvasRef.current
      const video = videoRef.current

      if (!canvas || !video) {
        setError('Camera not ready')
        return
      }

      if (video.readyState < video.HAVE_ENOUGH_DATA) {
        setError('Video not ready - please try again')
        setShowCamera(false)
        setIsCapturing(false)
        return
      }

      const context = canvas.getContext('2d')
      canvas.width = 320
      canvas.height = 240

      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      const faceImage = canvas.toDataURL('image/jpeg', 0.7)

      if (!faceImage || faceImage.length < 5000) {
        setError('Captured image is blank - please try again')
        setShowCamera(false)
        setIsCapturing(false)
        return
      }

      console.log('📸 Face captured')
      setCapturedFace(faceImage)

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }

      setShowCamera(false)
      setIsCapturing(false)
    } catch (err) {
      console.error('Capture error:', err)
      setError('Failed to capture photo: ' + err.message)
      setShowCamera(false)
      setIsCapturing(false)
    }
  }

  const verifyFingerprint = async () => {
    try {
      if (!browserSupportsWebAuthn()) {
        setError('Biometric authentication not supported on this browser')
        return null
      }

      setError('')
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }

      const optionsRes = await api.get('/fingerprint/init-auth', { headers })
      const credential = await startAuthentication(optionsRes.data)

      const verifyRes = await api.post(
        '/fingerprint/verify-auth',
        credential,
        { headers }
      )

      if (verifyRes.data.verified && verifyRes.data.biometricToken) {
        return verifyRes.data.biometricToken
      }

      setError('Biometric verification failed')
      return null
    } catch (err) {
      console.error('Fingerprint verification error:', err)
      if (err.name === 'NotAllowedError') {
        setError('Fingerprint verification cancelled')
      } else {
        setError(err.response?.data?.error || 'Fingerprint verification failed')
      }
      return null
    }
  }

// Replace your ENTIRE verifyFace function with this:
const verifyFace = async (faceData) => {
  try {
    // ✅ NO MANUAL HEADERS - api.js handles automatically
    const res = await api.post('/biometric/verify-face', { faceData });
    
    // ✅ RETURN biometricToken for withdrawal (NOT just verified boolean)
    return res.data.biometricToken;
  } catch (err) {
    console.error('Face verification error:', err);
    setError(err.response?.data?.message || 'Face verification failed');
    return null;
  }
};


  // const verifyFace = async () => {
  //   try {
  //     const token = localStorage.getItem('token')
  //     const res = await api.post(
  //       '/biometric/verify-face',
  //       { faceData: capturedFace },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     )
  //     return res.data.verified === true
  //   } catch (err) {
  //     console.error('Face verification error:', err)
  //     setError(err.response?.data?.message || 'Face verification failed')
  //     return false
  //   }
  // }

  const processWithdrawal = async (fingerprintToken = null) => {
    setError('')
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
      const requestBody = { amount: amt, pin: pin }

      if (amt >= threshold) {
        if (!chosenBiometric) {
          setError('Biometric verification required.')
          setLoading(false)
          return
        }

        if (chosenBiometric === 'fingerprint') {
          const tokenToUse = fingerprintToken || biometricToken
          if (!tokenToUse) {
            setError('Fingerprint verification required.')
            setLoading(false)
            return
          }
          requestBody.biometricToken = tokenToUse
        }

       // In WithdrawPage.jsx - Update face verification section:
if (chosenBiometric === 'face') {
  if (!capturedFace) {
    setError('Face verification required.');
    return;
  }

  // ✅ Use fixed verifyFace - returns token now
  const faceToken = await verifyFace(capturedFace);
  if (!faceToken) {
    setError('Face verification failed.');
    return;
  }
  
  requestBody.biometricToken = faceToken;  // Send token to backend
}



        // if (chosenBiometric === 'face') {
        //   if (!capturedFace) {
        //     setError('Face verification required.')
        //     setLoading(false)
        //     return
        //   }

        //   const faceOk = await verifyFace()
        //   if (!faceOk) {
        //     setError('Face verification failed.')
        //     setLoading(false)
        //     return
        //   }
        //   requestBody.faceData = capturedFace
        // }
      }

      const response = await api.post('/wallet/withdraw', requestBody, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const newBalance = response.data.balance
      setBalance(newBalance)
      localStorage.setItem('balance', String(newBalance))

      setWithdrawData({
        amount: amt,
        balance: newBalance,
        timestamp: new Date().toLocaleString(),
        transactionId: response.data.transactionId || `TXN${Date.now()}`
      })

      setStep(4)
    } catch (err) {
      console.error('❌ Withdrawal error:', err)
      const errorMsg = err.response?.data?.message || 'Withdrawal failed.'
      setError(errorMsg)
      setCapturedFace(null)
      setBiometricToken(null)
      
      // Don't navigate away - stay on current step
      if (err.response?.status === 401 && errorMsg.includes('Face verification failed')) {
        // Reset face capture to allow retry
        setChosenBiometric('face')
        setShowCamera(false)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleFingerprintAuth = async () => {
    setLoading(true)
    const token = await verifyFingerprint()
    setLoading(false)
    
    if (token) {
      setBiometricToken(token)
      await new Promise(resolve => setTimeout(resolve, 500))
      await processWithdrawal(token)
    }
  }

  const handleNextFromAmount = () => {
    setError('')
    const amt = Number(amount)

    if (!amt || amt <= 0) {
      setError('Enter a valid amount greater than 0.')
      return
    }

    if (amt > balance) {
      setError(`Insufficient balance. Available: ₹${balance.toLocaleString('en-IN')}`)
      return
    }

    if (amt >= threshold) {
      if (!biometricStatus.faceRegistered && !biometricStatus.fingerprintRegistered) {
        setError(
          `Withdrawals above ₹${threshold.toLocaleString(
            'en-IN'
          )} require biometric verification. Please register in Settings first.`
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
      setChosenBiometric(null)
      setCapturedFace(null)
      setBiometricToken(null)
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
    setError('')
  }

  const retakePhoto = () => {
    setCapturedFace(null)
    setError('')
    startCamera()
  }

  const handleDone = () => {
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex flex-col">
      {/* Top bar */}
      <header className="border-b border-white/20 bg-white/70 backdrop-blur-2xl shadow-lg shadow-emerald-500/5">
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
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
              <p className="text-sm font-bold text-gray-900">Withdraw Cash</p>
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
      <main className="flex-1 flex items-center justify-center px-4 py-6 sm:py-10">
        <div className="w-full max-w-xl bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-gray-200/50 p-5 sm:p-6 shadow-2xl shadow-emerald-500/10 space-y-4">
          
          {/* Step indicator - Hide on success */}
          {step !== 4 && (
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1 font-medium">
              <span className={step >= 1 ? 'text-emerald-600 font-bold' : ''}>1. Amount</span>
              <span className={step >= 2 ? 'text-emerald-600 font-bold' : ''}>2. PIN</span>
              <span className={step >= 3 ? 'text-emerald-600 font-bold' : ''}>
                3. {Number(amount) >= threshold ? 'Biometric' : 'Confirm'}
              </span>
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

          {/* Step 1: Amount */}
          {step === 1 && (
            <div className="space-y-4 text-xs sm:text-sm">
              <h1 className="text-lg sm:text-xl font-extrabold text-gray-900">Enter withdrawal amount</h1>
              <p className="text-gray-600">
                Available balance: <span className="font-bold text-emerald-600">₹{balance.toLocaleString('en-IN')}</span>
              </p>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  max={balance}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-emerald-300/50 transition-all duration-300"
                  placeholder="Enter amount"
                />
              </div>

              {Number(amount) >= threshold && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50/50 border border-amber-200/40">
                  <svg className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div className="text-xs text-gray-700 leading-relaxed">
                    <p className="font-bold text-amber-700 mb-1">Biometric verification required</p>
                    <p>Withdrawals above ₹{threshold.toLocaleString('en-IN')} need additional security verification</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: PIN */}
          {step === 2 && (
            <div className="space-y-4 text-xs sm:text-sm">
              <h1 className="text-lg sm:text-xl font-extrabold text-gray-900">Confirm with PIN</h1>
              <p className="text-gray-600">
                Enter your transaction PIN to authorize this withdrawal.
              </p>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Transaction PIN</label>
                <input
                  type="password"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full rounded-xl bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-emerald-300/50 transition-all duration-300"
                  placeholder="Enter 4 or 6 digit PIN"
                />
              </div>
            </div>
          )}

          {/* Step 3: Biometric or Confirm */}
          {step === 3 && (
            <div className="space-y-4 text-xs sm:text-sm">
              {Number(amount) >= threshold ? (
                !chosenBiometric ? (
                  /* BIOMETRIC CHOICE */
                  <>
                    <h1 className="text-lg sm:text-xl font-extrabold text-gray-900">
                      Choose Verification Method
                    </h1>
                    <p className="text-gray-600 mb-4">
                      Select how you'd like to verify this withdrawal.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {biometricStatus.fingerprintRegistered && (
                        <button
                          onClick={() => setChosenBiometric('fingerprint')}
                          className="p-5 rounded-2xl border-2 border-emerald-200/50 bg-gradient-to-br from-emerald-50 to-teal-50 hover:border-emerald-300 hover:scale-105 transition-all duration-300 text-center shadow-lg"
                        >
                          <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 flex items-center justify-center mb-3 shadow-xl shadow-emerald-500/40">
                            <svg
                              className="h-8 w-8 text-white"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 11.5c1.657 0 3-1.343 3-3V8a3 3 0 10-6 0v.5c0 1.657 1.343 3 3 3z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 11.75A4.75 4.75 0 0113 6.97M5.5 15.25A7.25 7.25 0 0115 7.22M4 19.25A9.25 9.25 0 0117.5 8.5" />
                            </svg>
                          </div>
                          <p className="font-bold text-gray-900 mb-1">Fingerprint</p>
                          <p className="text-[10px] text-gray-600">Use device biometric sensor</p>
                        </button>
                      )}

                      {biometricStatus.faceRegistered && (
                        <button
                          onClick={() => setChosenBiometric('face')}
                          className="p-5 rounded-2xl border-2 border-amber-200/50 bg-gradient-to-br from-amber-50 to-orange-50 hover:border-amber-300 hover:scale-105 transition-all duration-300 text-center shadow-lg"
                        >
                          <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-3 shadow-xl shadow-amber-500/40">
                            <svg
                              className="h-8 w-8 text-white"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <p className="font-bold text-gray-900 mb-1">Face Recognition</p>
                          <p className="text-[10px] text-gray-600">Verify with camera</p>
                        </button>
                      )}
                    </div>
                  </>
                ) : chosenBiometric === 'fingerprint' ? (
                  /* FINGERPRINT VERIFICATION */
                  <>
                    <h1 className="text-lg sm:text-xl font-extrabold text-gray-900">
                      Fingerprint Verification
                    </h1>
                    <p className="text-gray-600 mb-4">
                      Use your device's biometric sensor to authorize this withdrawal.
                    </p>

                    <div className="flex flex-col items-center gap-4 py-4">
                      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/40 animate-pulse">
                        <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 11.5c1.657 0 3-1.343 3-3V8a3 3 0 10-6 0v.5c0 1.657 1.343 3 3 3z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 11.75A4.75 4.75 0 0113 6.97M5.5 15.25A7.25 7.25 0 0115 7.22M4 19.25A9.25 9.25 0 0117.5 8.5" />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-600 text-center max-w-xs">
                        {loading ? 'Processing biometric authentication...' : 'Click below to authenticate with your fingerprint'}
                      </p>
                      <button
                        type="button"
                        onClick={handleFingerprintAuth}
                        disabled={loading}
                        className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/60 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          'Authenticate & Withdraw'
                        )}
                      </button>
                    </div>
                  </>
                ) : chosenBiometric === 'face' ? (
                  /* FACE VERIFICATION */
                  <>
                    <h1 className="text-lg sm:text-xl font-extrabold text-gray-900">Face Verification</h1>
                    <p className="text-gray-600">
                      Look at the camera. Face will be captured automatically in 3 seconds.
                    </p>

                    {showCamera ? (
                      <div className="space-y-3">
                        <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400 bg-black shadow-xl">
                          <video ref={videoRef} autoPlay playsInline muted className="w-full h-48 object-cover" />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-2 px-3">
                            <p className="text-xs text-white text-center font-medium">
                              Capturing automatically in 3 seconds...
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={cancelCamera}
                          className="w-full px-4 py-2.5 text-sm rounded-full bg-gray-100 text-gray-700 border-2 border-gray-300 hover:bg-gray-200 font-semibold transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : capturedFace ? (
                      <div className="space-y-3">
                        <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400/50 bg-black shadow-xl">
                          <img src={capturedFace} alt="Captured face" className="w-full h-48 object-cover" />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-2 px-3">
                            <p className="text-xs text-amber-300 text-center font-medium">Ready for verification</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => processWithdrawal()}
                            disabled={loading}
                            className="flex-1 px-4 py-3 text-sm rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-white font-bold shadow-xl shadow-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/60 hover:scale-105 transition-all duration-300 disabled:opacity-50"
                          >
                            {loading ? (
                              <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
                            className="flex-1 px-4 py-3 text-sm rounded-full bg-gray-100 text-gray-700 border-2 border-gray-300 font-bold hover:bg-gray-200 hover:scale-105 transition-all duration-300 disabled:opacity-50"
                          >
                            Retake
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-4 shadow-xl shadow-amber-500/40">
                          <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                        </div>
                        <p className="text-xs text-gray-600 mb-4">
                          Click below to start face verification
                        </p>
                        <button
                          onClick={startCamera}
                          disabled={loading}
                          className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-white font-bold text-sm shadow-xl shadow-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/60 hover:scale-105 transition-all duration-300 disabled:opacity-50"
                        >
                          {loading ? 'Loading...' : 'Start Face Verification'}
                        </button>
                      </div>
                    )}
                  </>
                ) : null
              ) : (
                /* CONFIRM WITHOUT BIOMETRIC */
                <>
                  <h1 className="text-lg sm:text-xl font-extrabold text-gray-900">Confirm Withdrawal</h1>
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200/50 p-5 shadow-lg">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Amount:</span>
                        <span className="font-bold text-gray-900">₹{Number(amount).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Service Charge:</span>
                        <span className="text-emerald-600 font-bold">₹0</span>
                      </div>
                      <div className="border-t-2 border-emerald-200/50 pt-3 mt-2 flex justify-between items-center">
                        <span className="text-gray-700 font-bold">Total:</span>
                        <span className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                          ₹{Number(amount).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 4: Success Card */}
          {step === 4 && withdrawData && (
            <div className="space-y-6 py-4">
              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/40 animate-pulse">
                  <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              {/* Success Message */}
              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  Withdrawal Successful!
                </h1>
                <p className="text-sm text-gray-600">
                  Your cash is ready for collection
                </p>
              </div>

              {/* Transaction Details Card */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200/50 p-5 space-y-4 shadow-lg">
                {/* Amount */}
                <div className="text-center pb-4 border-b-2 border-emerald-200/50">
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1">
                    Amount Withdrawn
                  </p>
                  <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                    ₹ {withdrawData.amount.toLocaleString('en-IN')}
                  </p>
                </div>

                {/* Transaction Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">New Balance</span>
                    <span className="text-gray-900 font-bold">₹ {withdrawData.balance.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Transaction ID</span>
                    <span className="text-gray-900 font-mono text-xs font-semibold">{withdrawData.transactionId}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Date & Time</span>
                    <span className="text-gray-900 font-semibold">{withdrawData.timestamp}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Status</span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-500/40 text-emerald-700 font-bold text-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Completed
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50/50 border border-blue-200/40">
                <svg className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Please collect your cash from the ATM dispenser. Your receipt has been sent to your registered email.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          {step !== 4 && (
            <div className="flex items-center justify-between pt-3">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 rounded-full border-2 border-gray-300 text-gray-700 font-semibold text-xs sm:text-sm hover:border-gray-400 hover:scale-105 transition-all duration-300"
                disabled={loading || isCapturing}
              >
                {step === 1 ? 'Cancel' : 'Back'}
              </button>

              {step === 1 && (
                <button
                  type="button"
                  onClick={handleNextFromAmount}
                  disabled={!amount || Number(amount) <= 0 || loading}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/60 hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Continue →
                </button>
              )}

              {step === 2 && (
                <button
                  type="button"
                  onClick={handleNextFromPin}
                  disabled={!pin || pin.length < 4 || loading}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/60 hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Continue →
                </button>
              )}

              {step === 3 && Number(amount) < threshold && (
                <button
                  type="button"
                  onClick={() => processWithdrawal()}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/60 hover:scale-105 transition-all duration-300 disabled:opacity-60"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Confirm Withdrawal'
                  )}
                </button>
              )}
            </div>
          )}

          {/* Success Actions */}
          {step === 4 && (
            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <button
                type="button"
                onClick={() => navigate('/transactions')}
                className="flex-1 px-6 py-3 rounded-full border-2 border-emerald-500 text-emerald-600 font-bold text-sm hover:bg-emerald-50 hover:scale-105 transition-all duration-300"
              >
                View History
              </button>
              <button
                type="button"
                onClick={handleDone}
                className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/60 hover:scale-105 transition-all duration-300"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Hidden canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}

export default WithdrawPage
