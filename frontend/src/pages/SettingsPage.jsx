// // src/pages/SettingsPage.jsx
// import React, { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import api from '../services/api'

// function SettingsPage() {
//   const navigate = useNavigate()

//   const [profile, setProfile] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//     city: '',
//     address: '',
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

//   const [loading, setLoading] = useState(false)
//   const [message, setMessage] = useState('')
//   const [error, setError] = useState('')

//   // Load profile on mount
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem('token')
//         if (!token) return

//         const res = await api.get('/settings/me', {
//           headers: { Authorization: `Bearer ${token}` },
//         })

//         setProfile({
//           fullName: res.data.fullName || '',
//           email: res.data.email || '',
//           phone: res.data.phone || '',
//           city: res.data.city || '',
//           address: res.data.address || '',
//         })
//       } catch (err) {
//         console.error(err)
//       }
//     }

//     fetchProfile()
//   }, [])

//   const withAuth = () => {
//     const token = localStorage.getItem('token')
//     if (!token) {
//       setError('You must be logged in to update settings.')
//       return null
//     }
//     return { Authorization: `Bearer ${token}` }
//   }

//   // Save personal info
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
//       setMessage('Profile updated successfully.')
//     } catch (err) {
//       console.error(err)
//       setError(err.response?.data?.message || 'Failed to update profile.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Update password
//   const handlePasswordUpdate = async (e) => {
//     e.preventDefault()
//     setError('')
//     setMessage('')

//     if (passwordForm.newPassword !== passwordForm.confirmPassword) {
//       setError('New password and confirm password must match.')
//       return
//     }

//     const headers = withAuth()
//     if (!headers) return

//     try {
//       setLoading(true)
//       await api.put(
//         '/settings/password',
//         {
//           currentPassword: passwordForm.currentPassword,
//           newPassword: passwordForm.newPassword,
//         },
//         { headers }
//       )
//       setMessage('Password updated successfully.')
//       setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
//     } catch (err) {
//       console.error(err)
//       setError(err.response?.data?.message || 'Failed to update password.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Update transaction PIN
//   const handlePinUpdate = async (e) => {
//     e.preventDefault()
//     setError('')
//     setMessage('')

//     if (pinForm.newPin !== pinForm.confirmPin) {
//       setError('New PIN and confirm PIN must match.')
//       return
//     }
//     if (
//       !/^[0-9]{4}$/.test(pinForm.newPin) &&
//       !/^[0-9]{6}$/.test(pinForm.newPin)
//     ) {
//       setError('PIN must be exactly 4 or 6 digits.')
//       return
//     }

//     const headers = withAuth()
//     if (!headers) return

//     try {
//       setLoading(true)
//       await api.put(
//         '/settings/transaction-pin',
//         {
//           currentPin: pinForm.currentPin || null,
//           newPin: pinForm.newPin,
//         },
//         { headers }
//       )
//       setMessage('Transaction PIN updated.')
//       setPinForm({ currentPin: '', newPin: '', confirmPin: '' })
//     } catch (err) {
//       console.error(err)
//       setError(err.response?.data?.message || 'Failed to update PIN.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[#0D0D0D] text-white">
//       {/* Top Bar (simple) */}
//       <header className="border-b border-dashed border-gray-800 bg-black/40 backdrop-blur-xl">
//         <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
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
//               <p className="text-xs text-gray-400 uppercase tracking-wide">Account</p>
//               <p className="text-sm font-semibold">Settings</p>
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

//       {/* Main Content */}
//       <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
//         {/* Global message / error */}
//         {(message || error) && (
//           <div className="text-xs sm:text-sm">
//             {message && (
//               <p className="mb-1 text-emerald-300">
//                 {message}
//               </p>
//             )}
//             {error && (
//               <p className="text-red-400">
//                 {error}
//               </p>
//             )}
//           </div>
//         )}

//         {/* Header */}
//         <section className="space-y-1">
//           <h1 className="text-xl sm:text-2xl font-semibold">Security & Profile</h1>
//           <p className="text-xs sm:text-sm text-gray-400">
//             Manage biometrics, personal information, password and transaction PIN.
//           </p>
//         </section>

//         {/* Biometric Settings (UI only for now) */}
//         <section className="bg-[#101010] rounded-2xl border border-dashed border-gray-800 p-4 sm:p-5 space-y-4">
//           <h2 className="text-sm sm:text-base font-semibold mb-1">Biometric Security</h2>
//           <p className="text-xs sm:text-sm text-gray-400 mb-2">
//             Link your fingerprint and face data to enable faster and safer verification.
//           </p>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//             {/* Fingerprint */}
//             <div className="rounded-xl border border-dashed border-emerald-500/60 bg-[#141414] p-4 flex flex-col gap-2">
//               <div className="flex items-center justify-between gap-2">
//                 <div>
//                   <p className="text-xs font-semibold text-white">Fingerprint Authentication</p>
//                   <p className="text-[11px] text-gray-400">
//                     Use your fingerprint for ATM login & high-value withdrawals.
//                   </p>
//                 </div>
//               </div>
//               <button
//                 type="button"
//                 className="self-start mt-1 px-3 py-1.5 text-[11px] rounded-full bg-emerald-500/10 text-emerald-300 border border-dashed border-emerald-400/70 hover:bg-emerald-500/20 transition"
//                 disabled={loading}
//               >
//                 Activate Fingerprint
//               </button>
//             </div>

//             {/* Face ID */}
//             <div className="rounded-xl border border-dashed border-amber-500/70 bg-[#141414] p-4 flex flex-col gap-2">
//               <div className="flex items-center justify-between gap-2">
//                 <div>
//                   <p className="text-xs font-semibold text-white">Face Recognition</p>
//                   <p className="text-[11px] text-gray-400">
//                     Add your face data to enable face unlock and identity checks.
//                   </p>
//                 </div>
//               </div>
//               <button
//                 type="button"
//                 className="self-start mt-1 px-3 py-1.5 text-[11px] rounded-full bg-amber-500/10 text-amber-300 border border-dashed border-amber-400/70 hover:bg-amber-500/20 transition"
//                 disabled={loading}
//               >
//                 Add Face Data
//               </button>
//             </div>
//           </div>
//         </section>

//         {/* Personal Info */}
//         <section className="bg-[#101010] rounded-2xl border border-dashed border-gray-800 p-4 sm:p-5 space-y-4">
//           <div className="flex items-center justify-between">
//             <h2 className="text-sm sm:text-base font-semibold">Personal Information</h2>
//             <span className="text-[11px] text-gray-500">
//               Keep this up to date for recovery and KYC.
//             </span>
//           </div>

//           <form
//             className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm"
//             onSubmit={handleSaveProfile}
//           >
//             <div className="space-y-1.5">
//               <label className="block text-gray-300">Full Name</label>
//               <input
//                 type="text"
//                 value={profile.fullName}
//                 onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
//                 className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
//               />
//             </div>
//             <div className="space-y-1.5">
//               <label className="block text-gray-300">Email</label>
//               <input
//                 type="email"
//                 value={profile.email}
//                 disabled
//                 className="w-full rounded-lg bg-[#181818] border border-dashed border-gray-700 px-3 py-2 text-gray-500 cursor-not-allowed"
//               />
//             </div>
//             <div className="space-y-1.5">
//               <label className="block text-gray-300">Phone Number</label>
//               <input
//                 type="tel"
//                 value={profile.phone}
//                 onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
//                 placeholder="+91 XXXXX XXXXX"
//                 className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
//               />
//             </div>
//             <div className="space-y-1.5">
//               <label className="block text-gray-300">City</label>
//               <input
//                 type="text"
//                 value={profile.city}
//                 onChange={(e) => setProfile({ ...profile, city: e.target.value })}
//                 placeholder="Hyderabad"
//                 className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
//               />
//             </div>
//             <div className="space-y-1.5 sm:col-span-2">
//               <label className="block text-gray-300">Address</label>
//               <input
//                 type="text"
//                 value={profile.address}
//                 onChange={(e) => setProfile({ ...profile, address: e.target.value })}
//                 placeholder="Flat / Street / Area"
//                 className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
//               />
//             </div>

//             <div className="flex justify-end pt-2 sm:col-span-2">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="px-4 py-2 rounded-lg text-xs sm:text-sm bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold hover:brightness-110 disabled:opacity-60 transition"
//               >
//                 Save Personal Info
//               </button>
//             </div>
//           </form>
//         </section>

//         {/* Password & Transaction PIN */}
//         <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
//           {/* Password */}
//           <div className="bg-[#101010] rounded-2xl border border-dashed border-gray-800 p-4 sm:p-5 space-y-3">
//             <h2 className="text-sm sm:text-base font-semibold">Password</h2>
//             <p className="text-[11px] text-gray-400">
//               Create a strong password with at least 8 characters.
//             </p>

//             <form
//               className="space-y-2 text-xs sm:text-sm"
//               onSubmit={handlePasswordUpdate}
//             >
//               <div className="space-y-1">
//                 <label className="block text-gray-300">Current Password</label>
//                 <input
//                   type="password"
//                   value={passwordForm.currentPassword}
//                   onChange={(e) =>
//                     setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
//                   }
//                   className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
//                 />
//               </div>
//               <div className="space-y-1">
//                 <label className="block text-gray-300">New Password</label>
//                 <input
//                   type="password"
//                   value={passwordForm.newPassword}
//                   onChange={(e) =>
//                     setPasswordForm({ ...passwordForm, newPassword: e.target.value })
//                   }
//                   className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
//                 />
//               </div>
//               <div className="space-y-1">
//                 <label className="block text-gray-300">Confirm New Password</label>
//                 <input
//                   type="password"
//                   value={passwordForm.confirmPassword}
//                   onChange={(e) =>
//                     setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
//                   }
//                   className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
//                 />
//               </div>

//               <div className="pt-2 flex justify-end">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-300 border border-dashed border-emerald-400/70 text-xs sm:text-sm hover:bg-emerald-500/20 disabled:opacity-60 transition"
//                 >
//                   Update Password
//                 </button>
//               </div>
//             </form>
//           </div>

//           {/* Transaction PIN */}
//           <div className="bg-[#101010] rounded-2xl border border-dashed border-gray-800 p-4 sm:p-5 space-y-3">
//             <h2 className="text-sm sm:text-base font-semibold">Transaction PIN</h2>
//             <p className="text-[11px] text-gray-400">
//               Set a 4 or 6 digit PIN to approve withdrawals and deposits.
//             </p>

//             <form
//               className="space-y-2 text-xs sm:text-sm"
//               onSubmit={handlePinUpdate}
//             >
//               <div className="space-y-1">
//                 <label className="block text-gray-300">Current PIN (optional)</label>
//                 <input
//                   type="password"
//                   maxLength={6}
//                   value={pinForm.currentPin}
//                   onChange={(e) =>
//                     setPinForm({ ...pinForm, currentPin: e.target.value })
//                   }
//                   className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
//                 />
//               </div>
//               <div className="space-y-1">
//                 <label className="block text-gray-300">New PIN</label>
//                 <input
//                   type="password"
//                   maxLength={6}
//                   value={pinForm.newPin}
//                   onChange={(e) =>
//                     setPinForm({ ...pinForm, newPin: e.target.value })
//                   }
//                   className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
//                 />
//               </div>
//               <div className="space-y-1">
//                 <label className="block text-gray-300">Confirm New PIN</label>
//                 <input
//                   type="password"
//                   maxLength={6}
//                   value={pinForm.confirmPin}
//                   onChange={(e) =>
//                     setPinForm({ ...pinForm, confirmPin: e.target.value })
//                   }
//                   className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
//                 />
//               </div>

//               <div className="pt-2 flex justify-end">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold text-xs sm:text-sm hover:brightness-110 disabled:opacity-60 transition"
//                 >
//                   Save PIN
//                 </button>
//               </div>
//             </form>
//           </div>
//         </section>
//       </main>
//     </div>
//   )
// }

// export default SettingsPage



































// // // src/pages/SettingsPage.jsx
// // import React from 'react'
// // import { useNavigate } from 'react-router-dom'

// // function SettingsPage() {
// //   const navigate = useNavigate()

// //   return (
// //     <div className="min-h-screen bg-[#0D0D0D] text-white">
// //       {/* Top Bar (simple) */}
// //       <header className="border-b border-dashed border-gray-800 bg-black/40 backdrop-blur-xl">
// //         <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
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
// //               <p className="text-xs text-gray-400 uppercase tracking-wide">Account</p>
// //               <p className="text-sm font-semibold">Settings</p>
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

// //       {/* Main Content */}
// //       <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
// //         {/* Header */}
// //         <section className="space-y-1">
// //           <h1 className="text-xl sm:text-2xl font-semibold">Security & Profile</h1>
// //           <p className="text-xs sm:text-sm text-gray-400">
// //             Manage biometrics, personal information, password and transaction PIN.
// //           </p>
// //         </section>

// //         {/* Biometric Settings */}
// //         <section className="bg-[#101010] rounded-2xl border border-dashed border-gray-800 p-4 sm:p-5 space-y-4">
// //           <h2 className="text-sm sm:text-base font-semibold mb-1">Biometric Security</h2>
// //           <p className="text-xs sm:text-sm text-gray-400 mb-2">
// //             Link your fingerprint and face data to enable faster and safer verification.
// //           </p>

// //           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
// //             {/* Fingerprint */}
// //             <div className="rounded-xl border border-dashed border-emerald-500/60 bg-[#141414] p-4 flex flex-col gap-2">
// //               <div className="flex items-center justify-between gap-2">
// //                 <div>
// //                   <p className="text-xs font-semibold text-white">Fingerprint Authentication</p>
// //                   <p className="text-[11px] text-gray-400">
// //                     Use your fingerprint for ATM login & high-value withdrawals.
// //                   </p>
// //                 </div>
// //               </div>
// //               <button className="self-start mt-1 px-3 py-1.5 text-[11px] rounded-full bg-emerald-500/10 text-emerald-300 border border-dashed border-emerald-400/70 hover:bg-emerald-500/20 transition">
// //                 Activate Fingerprint
// //               </button>
// //             </div>

// //             {/* Face ID */}
// //             <div className="rounded-xl border border-dashed border-amber-500/70 bg-[#141414] p-4 flex flex-col gap-2">
// //               <div className="flex items-center justify-between gap-2">
// //                 <div>
// //                   <p className="text-xs font-semibold text-white">Face Recognition</p>
// //                   <p className="text-[11px] text-gray-400">
// //                     Add your face data to enable face unlock and identity checks.
// //                   </p>
// //                 </div>
// //               </div>
// //               <button className="self-start mt-1 px-3 py-1.5 text-[11px] rounded-full bg-amber-500/10 text-amber-300 border border-dashed border-amber-400/70 hover:bg-amber-500/20 transition">
// //                 Add Face Data
// //               </button>
// //             </div>
// //           </div>
// //         </section>

// //         {/* Personal Info */}
// //         <section className="bg-[#101010] rounded-2xl border border-dashed border-gray-800 p-4 sm:p-5 space-y-4">
// //           <div className="flex items-center justify-between">
// //             <h2 className="text-sm sm:text-base font-semibold">Personal Information</h2>
// //             <span className="text-[11px] text-gray-500">
// //               Keep this up to date for recovery and KYC.
// //             </span>
// //           </div>

// //           <form className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
// //             <div className="space-y-1.5">
// //               <label className="block text-gray-300">Full Name</label>
// //               <input
// //                 type="text"
// //                 defaultValue="Sameer Syed"
// //                 className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
// //               />
// //             </div>
// //             <div className="space-y-1.5">
// //               <label className="block text-gray-300">Email</label>
// //               <input
// //                 type="email"
// //                 defaultValue="sameer.syed@example.com"
// //                 disabled
// //                 className="w-full rounded-lg bg-[#181818] border border-dashed border-gray-700 px-3 py-2 text-gray-500 cursor-not-allowed"
// //               />
// //             </div>
// //             <div className="space-y-1.5">
// //               <label className="block text-gray-300">Phone Number</label>
// //               <input
// //                 type="tel"
// //                 placeholder="+91 XXXXX XXXXX"
// //                 className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
// //               />
// //             </div>
// //             <div className="space-y-1.5">
// //               <label className="block text-gray-300">City</label>
// //               <input
// //                 type="text"
// //                 placeholder="Hyderabad"
// //                 className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
// //               />
// //             </div>
// //             <div className="space-y-1.5 sm:col-span-2">
// //               <label className="block text-gray-300">Address</label>
// //               <input
// //                 type="text"
// //                 placeholder="Flat / Street / Area"
// //                 className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
// //               />
// //             </div>
// //           </form>

// //           <div className="flex justify-end pt-2">
// //             <button className="px-4 py-2 rounded-lg text-xs sm:text-sm bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold hover:brightness-110 transition">
// //               Save Personal Info
// //             </button>
// //           </div>
// //         </section>

// //         {/* Password & Transaction PIN */}
// //         <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
// //           {/* Password */}
// //           <div className="bg-[#101010] rounded-2xl border border-dashed border-gray-800 p-4 sm:p-5 space-y-3">
// //             <h2 className="text-sm sm:text-base font-semibold">Password</h2>
// //             <p className="text-[11px] text-gray-400">
// //               Create a strong password with at least 8 characters.
// //             </p>

// //             <form className="space-y-2 text-xs sm:text-sm">
// //               <div className="space-y-1">
// //                 <label className="block text-gray-300">Current Password</label>
// //                 <input
// //                   type="password"
// //                   className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
// //                 />
// //               </div>
// //               <div className="space-y-1">
// //                 <label className="block text-gray-300">New Password</label>
// //                 <input
// //                   type="password"
// //                   className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
// //                 />
// //               </div>
// //               <div className="space-y-1">
// //                 <label className="block text-gray-300">Confirm New Password</label>
// //                 <input
// //                   type="password"
// //                   className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
// //                 />
// //               </div>

// //               <div className="pt-2 flex justify-end">
// //                 <button className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-300 border border-dashed border-emerald-400/70 text-xs sm:text-sm hover:bg-emerald-500/20 transition">
// //                   Update Password
// //                 </button>
// //               </div>
// //             </form>
// //           </div>

// //           {/* Transaction PIN */}
// //           <div className="bg-[#101010] rounded-2xl border border-dashed border-gray-800 p-4 sm:p-5 space-y-3">
// //             <h2 className="text-sm sm:text-base font-semibold">Transaction PIN</h2>
// //             <p className="text-[11px] text-gray-400">
// //               Set a 4 or 6 digit PIN to approve withdrawals and deposits.
// //             </p>

// //             <form className="space-y-2 text-xs sm:text-sm">
// //               <div className="space-y-1">
// //                 <label className="block text-gray-300">Current PIN (optional)</label>
// //                 <input
// //                   type="password"
// //                   maxLength={6}
// //                   className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
// //                 />
// //               </div>
// //               <div className="space-y-1">
// //                 <label className="block text-gray-300">New PIN</label>
// //                 <input
// //                   type="password"
// //                   maxLength={6}
// //                   className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
// //                 />
// //               </div>
// //               <div className="space-y-1">
// //                 <label className="block text-gray-300">Confirm New PIN</label>
// //                 <input
// //                   type="password"
// //                   maxLength={6}
// //                   className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
// //                 />
// //               </div>

// //               <div className="pt-2 flex justify-end">
// //                 <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold text-xs sm:text-sm hover:brightness-110 transition">
// //                   Save PIN
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </section>
// //       </main>
// //     </div>
// //   )
// // }

// // export default SettingsPage


// // src/pages/SettingsPage.jsx
// import React, { useEffect, useState, useRef } from 'react'
// import { useNavigate } from 'react-router-dom'
// import api from '../services/api'

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

//   const [loading, setLoading] = useState(false)
//   const [message, setMessage] = useState('')
//   const [error, setError] = useState('')
  
//   // Face capture states
//   const [capturedFace, setCapturedFace] = useState(null)
//   const [showCamera, setShowCamera] = useState(false)
//   const [isCapturing, setIsCapturing] = useState(false)

//   // Clean up camera on unmount
//   useEffect(() => {
//     return () => {
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach(track => track.stop())
//       }
//     }
//   }, [])

//   // Load profile and biometric status
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem('token')
//         if (!token) return

//         // Get profile
//         const res = await api.get('/settings/me', {
//           headers: { Authorization: `Bearer ${token}` },
//         })

//         setProfile({
//           fullName: res.data.fullName || '',
//           email: res.data.email || '',
//           phone: res.data.phone || '',
//           city: res.data.city || '',
//           address: res.data.address || '',
//         })

//         // Get biometric status
//         const bioRes = await api.get('/biometric/status', {
//           headers: { Authorization: `Bearer ${token}` },
//         })
        
//         setBiometricStatus({
//           faceRegistered: bioRes.data.faceRegistered || false,
//           fingerprintRegistered: bioRes.data.fingerprintRegistered || false,
//         })

//         // Load saved face image if exists
//         const savedFace = localStorage.getItem('userFaceImage')
//         if (savedFace && bioRes.data.faceRegistered) {
//           setCapturedFace(savedFace)
//         }

//       } catch (err) {
//         console.error(err)
//       }
//     }

//     fetchData()
//   }, [])

//   const withAuth = () => {
//     const token = localStorage.getItem('token')
//     if (!token) {
//       setError('You must be logged in to update settings.')
//       return null
//     }
//     return { Authorization: `Bearer ${token}` }
//   }

//   // Start camera for face capture - SIMPLIFIED
//   const startCamera = async () => {
//     try {
//       setError('')
//       setShowCamera(true)
//       setIsCapturing(true)
      
//       // Request camera permissions
//       const stream = await navigator.mediaDevices.getUserMedia({ 
//         video: {
//           facingMode: 'user',
//           width: { ideal: 640 },
//           height: { ideal: 480 }
//         },
//         audio: false
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

//   // Capture face photo - SIMPLIFIED
//  // SettingsPage.jsx - captureFacePhoto function
// const captureFacePhoto = () => {
//   if (!videoRef.current || !canvasRef.current) {
//     setError('Camera not ready')
//     return
//   }

//   const video = videoRef.current
//   const canvas = canvasRef.current
//   const context = canvas.getContext('2d')

//   // USE FIXED SIZE FOR CONSISTENCY
//   canvas.width = 320
//   canvas.height = 240

//   // Draw video frame to canvas (scaled)
//   context.drawImage(video, 0, 0, canvas.width, canvas.height)

//   // Get image as data URL with 50% quality
//   const faceImage = canvas.toDataURL('image/jpeg', 0.5)
//   setCapturedFace(faceImage)
  
//   console.log('Face captured in Settings, length:', faceImage.length, 'First 50:', faceImage.substring(0, 50))
  
//   // Stop camera
//   if (streamRef.current) {
//     streamRef.current.getTracks().forEach(track => track.stop())
//     streamRef.current = null
//   }
  
//   setShowCamera(false)
//   setIsCapturing(false)
// }
//   // Register captured face
//   const registerFace = async () => {
//     if (!capturedFace) {
//       setError('Please capture your face first.')
//       return
//     }

//     setLoading(true)
//     setError('')
//     setMessage('')

//     const headers = withAuth()
//     if (!headers) {
//       setLoading(false)
//       return
//     }

//     try {
//       // Send captured face image as faceData
//       await api.post('/biometric/register-face', {
//         faceData: capturedFace
//       }, { headers })

//       setMessage('Face registered successfully!')
//       setBiometricStatus(prev => ({
//         ...prev,
//         faceRegistered: true
//       }))
      
//       // Store face image locally for display
//       localStorage.setItem('userFaceImage', capturedFace)

//     } catch (err) {
//       console.error(err)
//       setError(err.response?.data?.message || 'Failed to register face.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Register fingerprint
//   const registerFingerprint = async () => {
//     setLoading(true)
//     setError('')
//     setMessage('')

//     const headers = withAuth()
//     if (!headers) {
//       setLoading(false)
//       return
//     }

//     try {
//       // Simulate fingerprint data
//       const fingerprintData = `fingerprint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
//       await api.post('/biometric/register-fingerprint', {
//         fingerprintData: fingerprintData
//       }, { headers })

//       setMessage('Fingerprint registered successfully!')
//       setBiometricStatus(prev => ({
//         ...prev,
//         fingerprintRegistered: true
//       }))

//     } catch (err) {
//       console.error(err)
//       setError(err.response?.data?.message || 'Failed to register fingerprint.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Re-upload face
//   const reuploadFace = () => {
//     setCapturedFace(null)
//     setShowCamera(false)
//     setBiometricStatus(prev => ({ ...prev, faceRegistered: false }))
//     localStorage.removeItem('userFaceImage')
//     startCamera() // Start camera immediately
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

//   // Rest of the functions remain the same...
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
//       setMessage('Profile updated successfully.')
//     } catch (err) {
//       console.error(err)
//       setError(err.response?.data?.message || 'Failed to update profile.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handlePasswordUpdate = async (e) => {
//     e.preventDefault()
//     setError('')
//     setMessage('')

//     if (passwordForm.newPassword !== passwordForm.confirmPassword) {
//       setError('New password and confirm password must match.')
//       return
//     }

//     const headers = withAuth()
//     if (!headers) return

//     try {
//       setLoading(true)
//       await api.put(
//         '/settings/password',
//         {
//           currentPassword: passwordForm.currentPassword,
//           newPassword: passwordForm.newPassword,
//         },
//         { headers }
//       )
//       setMessage('Password updated successfully.')
//       setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
//     } catch (err) {
//       console.error(err)
//       setError(err.response?.data?.message || 'Failed to update password.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handlePinUpdate = async (e) => {
//     e.preventDefault()
//     setError('')
//     setMessage('')

//     if (pinForm.newPin !== pinForm.confirmPin) {
//       setError('New PIN and confirm PIN must match.')
//       return
//     }
//     if (
//       !/^[0-9]{4}$/.test(pinForm.newPin) &&
//       !/^[0-9]{6}$/.test(pinForm.newPin)
//     ) {
//       setError('PIN must be exactly 4 or 6 digits.')
//       return
//     }

//     const headers = withAuth()
//     if (!headers) return

//     try {
//       setLoading(true)
//       await api.put(
//         '/settings/transaction-pin',
//         {
//           currentPin: pinForm.currentPin || null,
//           newPin: pinForm.newPin,
//         },
//         { headers }
//       )
//       setMessage('Transaction PIN updated.')
//       setPinForm({ currentPin: '', newPin: '', confirmPin: '' })
//     } catch (err) {
//       console.error(err)
//       setError(err.response?.data?.message || 'Failed to update PIN.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[#0D0D0D] text-white">
//       {/* Top Bar */}
//       <header className="border-b border-dashed border-gray-800 bg-black/40 backdrop-blur-xl">
//         <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-2.5">
//             <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
//               <svg className="h-4 w-4 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//               </svg>
//             </div>
//             <div>
//               <p className="text-xs text-gray-400 uppercase tracking-wide">Account</p>
//               <p className="text-sm font-semibold">Settings</p>
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

//       {/* Main Content */}
//       <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
//         {/* Global message / error */}
//         {(message || error) && (
//           <div className="text-xs sm:text-sm">
//             {message && <p className="mb-1 text-emerald-300">{message}</p>}
//             {error && <p className="text-red-400">{error}</p>}
//           </div>
//         )}

//         {/* Header */}
//         <section className="space-y-1">
//           <h1 className="text-xl sm:text-2xl font-semibold">Security & Profile</h1>
//           <p className="text-xs sm:text-sm text-gray-400">
//             Manage biometrics, personal information, password and transaction PIN.
//           </p>
//         </section>

//         {/* Biometric Settings */}
//         <section className="bg-[#101010] rounded-2xl border border-dashed border-gray-800 p-4 sm:p-5 space-y-4">
//           <h2 className="text-sm sm:text-base font-semibold mb-1">Biometric Security</h2>
//           <p className="text-xs sm:text-sm text-gray-400 mb-2">
//             Link your fingerprint and face data for secure withdrawals above ₹5000.
//           </p>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {/* Fingerprint Section */}
//             <div className="rounded-xl border border-dashed border-emerald-500/60 bg-[#141414] p-4">
//               <div className="flex items-center gap-3 mb-3">
//                 <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
//                   <svg className="h-5 w-5 text-emerald-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="text-sm font-semibold text-white">Fingerprint</p>
//                   <p className="text-xs text-gray-400">For withdrawals above ₹5000</p>
//                 </div>
//               </div>
              
//               {biometricStatus.fingerprintRegistered ? (
//                 <div className="space-y-2">
//                   <div className="text-xs text-emerald-300">✓ Fingerprint registered</div>
//                   <div className="text-xs text-gray-400">Ready for secure transactions</div>
//                 </div>
//               ) : (
//                 <button
//                   onClick={registerFingerprint}
//                   disabled={loading}
//                   className="w-full px-4 py-2 text-xs rounded-lg bg-emerald-500/10 text-emerald-300 border border-dashed border-emerald-400/70 hover:bg-emerald-500/20 transition disabled:opacity-50"
//                 >
//                   Register Fingerprint
//                 </button>
//               )}
//             </div>

//             {/* Face Section */}
//             <div className="rounded-xl border border-dashed border-amber-500/70 bg-[#141414] p-4">
//               <div className="flex items-center gap-3 mb-3">
//                 <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
//                   <svg className="h-5 w-5 text-amber-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="text-sm font-semibold text-white">Face Recognition</p>
//                   <p className="text-xs text-gray-400">For withdrawals above ₹5000</p>
//                 </div>
//               </div>

//               {/* Face Capture Flow */}
//               {biometricStatus.faceRegistered ? (
//                 <div className="space-y-3">
//                   <div className="text-xs text-amber-300">✓ Face registered</div>
//                   <div className="relative rounded-lg overflow-hidden border border-dashed border-amber-400/30 bg-black">
//                     {capturedFace ? (
//                       <img 
//                         src={capturedFace} 
//                         alt="Registered face" 
//                         className="w-full h-40 object-cover"
//                       />
//                     ) : (
//                       <div className="w-full h-40 flex items-center justify-center bg-gray-900">
//                         <svg className="h-12 w-12 text-gray-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
//                         </svg>
//                       </div>
//                     )}
//                     <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-1 px-2">
//                       <p className="text-[10px] text-amber-300 text-center">Your Registered Face</p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={reuploadFace}
//                     disabled={loading}
//                     className="w-full px-4 py-2 text-xs rounded-lg bg-gray-800 text-gray-300 border border-dashed border-gray-700 hover:bg-gray-700 transition"
//                   >
//                     Update Face
//                   </button>
//                 </div>
//               ) : showCamera ? (
//                 <div className="space-y-3">
//                   <div className="relative rounded-lg overflow-hidden border-2 border-dashed border-amber-400 bg-black">
//                     <video
//                       ref={videoRef}
//                       autoPlay
//                       playsInline
//                       muted
//                       className="w-full h-40 object-cover"
//                     />
//                     <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-1 px-2">
//                       <p className="text-[10px] text-white text-center">Camera will capture automatically...</p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={cancelCamera}
//                     className="w-full px-4 py-2 text-xs rounded-lg bg-gray-800 text-gray-300 border border-dashed border-gray-700 hover:bg-gray-700"
//                   >
//                     Cancel Camera
//                   </button>
//                 </div>
//               ) : capturedFace ? (
//                 <div className="space-y-3">
//                   <div className="relative rounded-lg overflow-hidden border border-dashed border-amber-400/50 bg-black">
//                     <img 
//                       src={capturedFace} 
//                       alt="Captured face" 
//                       className="w-full h-40 object-cover"
//                     />
//                     <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-1 px-2">
//                       <p className="text-[10px] text-amber-300 text-center">Captured Face</p>
//                     </div>
//                   </div>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={registerFace}
//                       disabled={loading}
//                       className="flex-1 px-4 py-2 text-xs rounded-lg bg-amber-500/20 text-amber-300 border border-dashed border-amber-400/70 hover:bg-amber-500/30 transition disabled:opacity-50"
//                     >
//                       {loading ? 'Saving...' : 'Save Face'}
//                     </button>
//                     <button
//                       onClick={startCamera}
//                       className="flex-1 px-4 py-2 text-xs rounded-lg bg-gray-800 text-gray-300 border border-dashed border-gray-700 hover:bg-gray-700"
//                     >
//                       Retake
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center bg-black">
//                     <svg className="h-12 w-12 mx-auto text-gray-600 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
//                     </svg>
//                     <p className="text-xs text-gray-400 mb-3">No face registered yet</p>
//                     <button
//                       onClick={startCamera}
//                       disabled={isCapturing}
//                       className="px-4 py-2 text-xs rounded-lg bg-amber-500/10 text-amber-300 border border-dashed border-amber-400/70 hover:bg-amber-500/20 transition disabled:opacity-50"
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
//         <section className="bg-[#101010] rounded-2xl border border-dashed border-gray-800 p-4 sm:p-5 space-y-4">
//           <div className="flex items-center justify-between">
//             <h2 className="text-sm sm:text-base font-semibold">Personal Information</h2>
//             <span className="text-[11px] text-gray-500">
//               Keep this up to date for recovery and KYC.
//             </span>
//           </div>

//           <form
//             className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm"
//             onSubmit={handleSaveProfile}
//           >
//             <div className="space-y-1.5">
//               <label className="block text-gray-300">Full Name</label>
//               <input
//                 type="text"
//                 value={profile.fullName}
//                 onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
//                 className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
//               />
//             </div>
//             <div className="space-y-1.5">
//               <label className="block text-gray-300">Email</label>
//               <input
//                 type="email"
//                 value={profile.email}
//                 disabled
//                 className="w-full rounded-lg bg-[#181818] border border-dashed border-gray-700 px-3 py-2 text-gray-500 cursor-not-allowed"
//               />
//             </div>
//             <div className="space-y-1.5">
//               <label className="block text-gray-300">Phone Number</label>
//               <input
//                 type="tel"
//                 value={profile.phone}
//                 onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
//                 placeholder="+91 XXXXX XXXXX"
//                 className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
//               />
//             </div>
//             <div className="space-y-1.5">
//               <label className="block text-gray-300">City</label>
//               <input
//                 type="text"
//                 value={profile.city}
//                 onChange={(e) => setProfile({ ...profile, city: e.target.value })}
//                 placeholder="Hyderabad"
//                 className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
//               />
//             </div>
//             <div className="space-y-1.5 sm:col-span-2">
//               <label className="block text-gray-300">Address</label>
//               <input
//                 type="text"
//                 value={profile.address}
//                 onChange={(e) => setProfile({ ...profile, address: e.target.value })}
//                 placeholder="Flat / Street / Area"
//                 className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
//               />
//             </div>

//             <div className="flex justify-end pt-2 sm:col-span-2">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="px-4 py-2 rounded-lg text-xs sm:text-sm bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold hover:brightness-110 disabled:opacity-60 transition"
//               >
//                 Save Personal Info
//               </button>
//             </div>
//           </form>
//         </section>

//         {/* Password & Transaction PIN Sections */}
//         <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
//           {/* Password */}
//           <div className="bg-[#101010] rounded-2xl border border-dashed border-gray-800 p-4 sm:p-5 space-y-3">
//             <h2 className="text-sm sm:text-base font-semibold">Password</h2>
//             <p className="text-[11px] text-gray-400">
//               Create a strong password with at least 8 characters.
//             </p>

//             <form className="space-y-2 text-xs sm:text-sm" onSubmit={handlePasswordUpdate}>
//               <div className="space-y-1">
//                 <label className="block text-gray-300">Current Password</label>
//                 <input
//                   type="password"
//                   value={passwordForm.currentPassword}
//                   onChange={(e) =>
//                     setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
//                   }
//                   className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
//                 />
//               </div>
//               <div className="space-y-1">
//                 <label className="block text-gray-300">New Password</label>
//                 <input
//                   type="password"
//                   value={passwordForm.newPassword}
//                   onChange={(e) =>
//                     setPasswordForm({ ...passwordForm, newPassword: e.target.value })
//                   }
//                   className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
//                 />
//               </div>
//               <div className="space-y-1">
//                 <label className="block text-gray-300">Confirm New Password</label>
//                 <input
//                   type="password"
//                   value={passwordForm.confirmPassword}
//                   onChange={(e) =>
//                     setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
//                   }
//                   className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
//                 />
//               </div>

//               <div className="pt-2 flex justify-end">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-300 border border-dashed border-emerald-400/70 text-xs sm:text-sm hover:bg-emerald-500/20 disabled:opacity-60 transition"
//                 >
//                   Update Password
//                 </button>
//               </div>
//             </form>
//           </div>

//           {/* Transaction PIN */}
//           <div className="bg-[#101010] rounded-2xl border border-dashed border-gray-800 p-4 sm:p-5 space-y-3">
//             <h2 className="text-sm sm:text-base font-semibold">Transaction PIN</h2>
//             <p className="text-[11px] text-gray-400">
//               Set a 4 or 6 digit PIN to approve withdrawals and deposits.
//             </p>

//             <form className="space-y-2 text-xs sm:text-sm" onSubmit={handlePinUpdate}>
//               <div className="space-y-1">
//                 <label className="block text-gray-300">Current PIN (optional)</label>
//                 <input
//                   type="password"
//                   maxLength={6}
//                   value={pinForm.currentPin}
//                   onChange={(e) =>
//                     setPinForm({ ...pinForm, currentPin: e.target.value })
//                   }
//                   className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
//                 />
//               </div>
//               <div className="space-y-1">
//                 <label className="block text-gray-300">New PIN</label>
//                 <input
//                   type="password"
//                   maxLength={6}
//                   value={pinForm.newPin}
//                   onChange={(e) =>
//                     setPinForm({ ...pinForm, newPin: e.target.value })
//                   }
//                   className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
//                 />
//               </div>
//               <div className="space-y-1">
//                 <label className="block text-gray-300">Confirm New PIN</label>
//                 <input
//                   type="password"
//                   maxLength={6}
//                   value={pinForm.confirmPin}
//                   onChange={(e) =>
//                     setPinForm({ ...pinForm, confirmPin: e.target.value })
//                   }
//                   className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
//                 />
//               </div>

//               <div className="pt-2 flex justify-end">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold text-xs sm:text-sm hover:brightness-110 disabled:opacity-60 transition"
//                 >
//                   Save PIN
//                 </button>
//               </div>
//             </form>
//           </div>
//         </section>
//       </main>
//     </div>
//   )
// }

// export default SettingsPage






// // src/pages/SettingsPage.jsx - COMPLETE FIXED
// import React, { useEffect, useState, useRef } from 'react'
// import { useNavigate } from 'react-router-dom'
// import api from '../services/api'

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

//   const [loading, setLoading] = useState(false)
//   const [message, setMessage] = useState('')
//   const [error, setError] = useState('')
  
//   // Face capture states
//   const [capturedFace, setCapturedFace] = useState(null)
//   const [showCamera, setShowCamera] = useState(false)
//   const [isCapturing, setIsCapturing] = useState(false)

//   // Clean up camera on unmount
//   useEffect(() => {
//     return () => {
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach(track => track.stop())
//       }
//     }
//   }, [])

//   // Load profile and biometric status
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem('token')
//         if (!token) return

//         // Get profile
//         const res = await api.get('/settings/me', {
//           headers: { Authorization: `Bearer ${token}` },
//         })

//         setProfile({
//           fullName: res.data.fullName || '',
//           email: res.data.email || '',
//           phone: res.data.phone || '',
//           city: res.data.city || '',
//           address: res.data.address || '',
//         })

//         // Get biometric status
//         const bioRes = await api.get('/biometric/status', {
//           headers: { Authorization: `Bearer ${token}` },
//         })
        
//         console.log('Biometric status from API:', bioRes.data)
        
//         setBiometricStatus({
//           faceRegistered: bioRes.data.faceRegistered || false,
//           fingerprintRegistered: bioRes.data.fingerprintRegistered || false,
//         })

//         // Load saved face image if exists
//         const savedFace = localStorage.getItem('userFaceImage')
//         if (savedFace && bioRes.data.faceRegistered) {
//           setCapturedFace(savedFace)
//         }

//       } catch (err) {
//         console.error('Error fetching data:', err)
//       }
//     }

//     fetchData()
//   }, [])

//   const withAuth = () => {
//     const token = localStorage.getItem('token')
//     if (!token) {
//       setError('You must be logged in to update settings.')
//       return null
//     }
//     return { Authorization: `Bearer ${token}` }
//   }

//   // Start camera for face capture - FIXED TO MATCH WITHDRAW PAGE
//   const startCamera = async () => {
//     try {
//       setError('')
//       setShowCamera(true)
//       setIsCapturing(true)
      
//       // ⚠️ FIXED: Use SAME video constraints as Withdraw page
//       const stream = await navigator.mediaDevices.getUserMedia({ 
//         video: { 
//           facingMode: 'user',
//           width: { ideal: 320 },      // SAME as Withdraw
//           height: { ideal: 240 }      // SAME as Withdraw
//         },
//         audio: false
//       })
      
//       streamRef.current = stream
      
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream
//         // Auto-capture after 3 seconds (SAME as Withdraw)
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

//   // Capture face photo - FIXED
//   const captureFacePhoto = () => {
//     if (!videoRef.current || !canvasRef.current) {
//       setError('Camera not ready')
//       return
//     }

//     const video = videoRef.current
//     const canvas = canvasRef.current
//     const context = canvas.getContext('2d')

//     // ⚠️ FIXED: Use SAME size as Withdraw page
//     canvas.width = 320
//     canvas.height = 240

//     // Draw video frame to canvas
//     context.drawImage(video, 0, 0, canvas.width, canvas.height)

//     // ⚠️ FIXED: Use SAME quality as Withdraw page
//     const faceImage = canvas.toDataURL('image/jpeg', 0.7) // 50% quality
    
//     console.log('Face captured in Settings:', {
//       length: faceImage.length,
//       first50: faceImage.substring(0, 50),
//       size: `${canvas.width}x${canvas.height}`,
//       quality: '50%'
//     })
    
//     setCapturedFace(faceImage)
    
//     // Stop camera
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach(track => track.stop())
//       streamRef.current = null
//     }
    
//     setShowCamera(false)
//     setIsCapturing(false)
//   }

//   // Register captured face - WITH DEBUG LOGS
//   const registerFace = async () => {
//     if (!capturedFace) {
//       setError('Please capture your face first.')
//       return
//     }

//     setLoading(true)
//     setError('')
//     setMessage('')

//     const headers = withAuth()
//     if (!headers) {
//       setLoading(false)
//       return
//     }

//     try {
//       console.log('Sending face data to register:', {
//         length: capturedFace.length,
//         first100: capturedFace.substring(0, 100)
//       })

//       const response = await api.post('/biometric/register-face', {
//         faceData: capturedFace
//       }, { headers })

//       console.log('Register face API response:', response.data)
      
//       if (response.data.success) {
//         setMessage('Face registered successfully!')
//         setBiometricStatus(prev => ({
//           ...prev,
//           faceRegistered: true
//         }))
        
//         // Store face image locally for display
//         localStorage.setItem('userFaceImage', capturedFace)
        
//         // Refresh biometric status
//         const bioRes = await api.get('/biometric/status', {
//           headers: { Authorization: headers.Authorization },
//         })
//         console.log('Updated biometric status:', bioRes.data)
//       } else {
//         setError(response.data.message || 'Failed to register face.')
//       }

//     } catch (err) {
//       console.error('Register face error:', {
//         status: err.response?.status,
//         data: err.response?.data,
//         message: err.message
//       })
//       setError(err.response?.data?.message || 'Failed to register face.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Register fingerprint
//   const registerFingerprint = async () => {
//     setLoading(true)
//     setError('')
//     setMessage('')

//     const headers = withAuth()
//     if (!headers) {
//       setLoading(false)
//       return
//     }

//     try {
//       // Simulate fingerprint data
//       const fingerprintData = `fingerprint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
//       await api.post('/biometric/register-fingerprint', {
//         fingerprintData: fingerprintData
//       }, { headers })

//       setMessage('Fingerprint registered successfully!')
//       setBiometricStatus(prev => ({
//         ...prev,
//         fingerprintRegistered: true
//       }))

//     } catch (err) {
//       console.error(err)
//       setError(err.response?.data?.message || 'Failed to register fingerprint.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Re-upload face
//   const reuploadFace = () => {
//     setCapturedFace(null)
//     setShowCamera(false)
//     setBiometricStatus(prev => ({ ...prev, faceRegistered: false }))
//     localStorage.removeItem('userFaceImage')
//     startCamera() // Start camera immediately
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

//   // Rest of the functions remain the same...
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
//       setMessage('Profile updated successfully.')
//     } catch (err) {
//       console.error(err)
//       setError(err.response?.data?.message || 'Failed to update profile.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handlePasswordUpdate = async (e) => {
//     e.preventDefault()
//     setError('')
//     setMessage('')

//     if (passwordForm.newPassword !== passwordForm.confirmPassword) {
//       setError('New password and confirm password must match.')
//       return
//     }

//     const headers = withAuth()
//     if (!headers) return

//     try {
//       setLoading(true)
//       await api.put(
//         '/settings/password',
//         {
//           currentPassword: passwordForm.currentPassword,
//           newPassword: passwordForm.newPassword,
//         },
//         { headers }
//       )
//       setMessage('Password updated successfully.')
//       setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
//     } catch (err) {
//       console.error(err)
//       setError(err.response?.data?.message || 'Failed to update password.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handlePinUpdate = async (e) => {
//     e.preventDefault()
//     setError('')
//     setMessage('')

//     if (pinForm.newPin !== pinForm.confirmPin) {
//       setError('New PIN and confirm PIN must match.')
//       return
//     }
//     if (
//       !/^[0-9]{4}$/.test(pinForm.newPin) &&
//       !/^[0-9]{6}$/.test(pinForm.newPin)
//     ) {
//       setError('PIN must be exactly 4 or 6 digits.')
//       return
//     }

//     const headers = withAuth()
//     if (!headers) return

//     try {
//       setLoading(true)
//       await api.put(
//         '/settings/transaction-pin',
//         {
//           currentPin: pinForm.currentPin || null,
//           newPin: pinForm.newPin,
//         },
//         { headers }
//       )
//       setMessage('Transaction PIN updated.')
//       setPinForm({ currentPin: '', newPin: '', confirmPin: '' })
//     } catch (err) {
//       console.error(err)
//       setError(err.response?.data?.message || 'Failed to update PIN.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[#0D0D0D] text-white">
//       {/* Top Bar */}
//       <header className="border-b border-dashed border-gray-800 bg-black/40 backdrop-blur-xl">
//         <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-2.5">
//             <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
//               <svg className="h-4 w-4 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//               </svg>
//             </div>
//             <div>
//               <p className="text-xs text-gray-400 uppercase tracking-wide">Account</p>
//               <p className="text-sm font-semibold">Settings</p>
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

//       {/* Main Content */}
//       <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
//         {/* Global message / error */}
//         {(message || error) && (
//           <div className="text-xs sm:text-sm">
//             {message && <p className="mb-1 text-emerald-300">{message}</p>}
//             {error && <p className="text-red-400">{error}</p>}
//           </div>
//         )}

//         {/* Header */}
//         <section className="space-y-1">
//           <h1 className="text-xl sm:text-2xl font-semibold">Security & Profile</h1>
//           <p className="text-xs sm:text-sm text-gray-400">
//             Manage biometrics, personal information, password and transaction PIN.
//           </p>
//         </section>

//         {/* Biometric Settings */}
//         <section className="bg-[#101010] rounded-2xl border border-dashed border-gray-800 p-4 sm:p-5 space-y-4">
//           <h2 className="text-sm sm:text-base font-semibold mb-1">Biometric Security</h2>
//           <p className="text-xs sm:text-sm text-gray-400 mb-2">
//             Link your fingerprint and face data for secure withdrawals above ₹5000.
//           </p>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {/* Fingerprint Section */}
//             <div className="rounded-xl border border-dashed border-emerald-500/60 bg-[#141414] p-4">
//               <div className="flex items-center gap-3 mb-3">
//                 <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
//                   <svg className="h-5 w-5 text-emerald-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="text-sm font-semibold text-white">Fingerprint</p>
//                   <p className="text-xs text-gray-400">For withdrawals above ₹5000</p>
//                 </div>
//               </div>
              
//               {biometricStatus.fingerprintRegistered ? (
//                 <div className="space-y-2">
//                   <div className="text-xs text-emerald-300">✓ Fingerprint registered</div>
//                   <div className="text-xs text-gray-400">Ready for secure transactions</div>
//                 </div>
//               ) : (
//                 <button
//                   onClick={registerFingerprint}
//                   disabled={loading}
//                   className="w-full px-4 py-2 text-xs rounded-lg bg-emerald-500/10 text-emerald-300 border border-dashed border-emerald-400/70 hover:bg-emerald-500/20 transition disabled:opacity-50"
//                 >
//                   Register Fingerprint
//                 </button>
//               )}
//             </div>

//             {/* Face Section */}
//             <div className="rounded-xl border border-dashed border-amber-500/70 bg-[#141414] p-4">
//               <div className="flex items-center gap-3 mb-3">
//                 <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
//                   <svg className="h-5 w-5 text-amber-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="text-sm font-semibold text-white">Face Recognition</p>
//                   <p className="text-xs text-gray-400">For withdrawals above ₹5000</p>
//                 </div>
//               </div>

//               {/* Face Capture Flow */}
//               {biometricStatus.faceRegistered ? (
//                 <div className="space-y-3">
//                   <div className="text-xs text-amber-300">✓ Face registered</div>
//                   <div className="relative rounded-lg overflow-hidden border border-dashed border-amber-400/30 bg-black">
//                     {capturedFace ? (
//                       <img 
//                         src={capturedFace} 
//                         alt="Registered face" 
//                         className="w-full h-40 object-cover"
//                       />
//                     ) : (
//                       <div className="w-full h-40 flex items-center justify-center bg-gray-900">
//                         <svg className="h-12 w-12 text-gray-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
//                         </svg>
//                       </div>
//                     )}
//                     <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-1 px-2">
//                       <p className="text-[10px] text-amber-300 text-center">Your Registered Face</p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={reuploadFace}
//                     disabled={loading}
//                     className="w-full px-4 py-2 text-xs rounded-lg bg-gray-800 text-gray-300 border border-dashed border-gray-700 hover:bg-gray-700 transition"
//                   >
//                     Update Face
//                   </button>
//                 </div>
//               ) : showCamera ? (
//                 <div className="space-y-3">
//                   <div className="relative rounded-lg overflow-hidden border-2 border-dashed border-amber-400 bg-black">
//                     <video
//                       ref={videoRef}
//                       autoPlay
//                       playsInline
//                       muted
//                       className="w-full h-40 object-cover"
//                     />
//                     <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-1 px-2">
//                       <p className="text-[10px] text-white text-center">Camera will capture automatically...</p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={cancelCamera}
//                     className="w-full px-4 py-2 text-xs rounded-lg bg-gray-800 text-gray-300 border border-dashed border-gray-700 hover:bg-gray-700"
//                   >
//                     Cancel Camera
//                   </button>
//                 </div>
//               ) : capturedFace ? (
//                 <div className="space-y-3">
//                   <div className="relative rounded-lg overflow-hidden border border-dashed border-amber-400/50 bg-black">
//                     <img 
//                       src={capturedFace} 
//                       alt="Captured face" 
//                       className="w-full h-40 object-cover"
//                     />
//                     <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-1 px-2">
//                       <p className="text-[10px] text-amber-300 text-center">Captured Face</p>
//                     </div>
//                   </div>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={registerFace}
//                       disabled={loading}
//                       className="flex-1 px-4 py-2 text-xs rounded-lg bg-amber-500/20 text-amber-300 border border-dashed border-amber-400/70 hover:bg-amber-500/30 transition disabled:opacity-50"
//                     >
//                       {loading ? 'Saving...' : 'Save Face'}
//                     </button>
//                     <button
//                       onClick={startCamera}
//                       className="flex-1 px-4 py-2 text-xs rounded-lg bg-gray-800 text-gray-300 border border-dashed border-gray-700 hover:bg-gray-700"
//                     >
//                       Retake
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center bg-black">
//                     <svg className="h-12 w-12 mx-auto text-gray-600 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
//                     </svg>
//                     <p className="text-xs text-gray-400 mb-3">No face registered yet</p>
//                     <button
//                       onClick={startCamera}
//                       disabled={isCapturing}
//                       className="px-4 py-2 text-xs rounded-lg bg-amber-500/10 text-amber-300 border border-dashed border-amber-400/70 hover:bg-amber-500/20 transition disabled:opacity-50"
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
//         <section className="bg-[#101010] rounded-2xl border border-dashed border-gray-800 p-4 sm:p-5 space-y-4">
//           <div className="flex items-center justify-between">
//             <h2 className="text-sm sm:text-base font-semibold">Personal Information</h2>
//             <span className="text-[11px] text-gray-500">
//               Keep this up to date for recovery and KYC.
//             </span>
//           </div>

//           <form
//             className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm"
//             onSubmit={handleSaveProfile}
//           >
//             <div className="space-y-1.5">
//               <label className="block text-gray-300">Full Name</label>
//               <input
//                 type="text"
//                 value={profile.fullName}
//                 onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
//                 className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
//               />
//             </div>
//             <div className="space-y-1.5">
//               <label className="block text-gray-300">Email</label>
//               <input
//                 type="email"
//                 value={profile.email}
//                 disabled
//                 className="w-full rounded-lg bg-[#181818] border border-dashed border-gray-700 px-3 py-2 text-gray-500 cursor-not-allowed"
//               />
//             </div>
//             <div className="space-y-1.5">
//               <label className="block text-gray-300">Phone Number</label>
//               <input
//                 type="tel"
//                 value={profile.phone}
//                 onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
//                 placeholder="+91 XXXXX XXXXX"
//                 className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
//               />
//             </div>
//             <div className="space-y-1.5">
//               <label className="block text-gray-300">City</label>
//               <input
//                 type="text"
//                 value={profile.city}
//                 onChange={(e) => setProfile({ ...profile, city: e.target.value })}
//                 placeholder="Hyderabad"
//                 className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
//               />
//             </div>
//             <div className="space-y-1.5 sm:col-span-2">
//               <label className="block text-gray-300">Address</label>
//               <input
//                 type="text"
//                 value={profile.address}
//                 onChange={(e) => setProfile({ ...profile, address: e.target.value })}
//                 placeholder="Flat / Street / Area"
//                 className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
//               />
//             </div>

//             <div className="flex justify-end pt-2 sm:col-span-2">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="px-4 py-2 rounded-lg text-xs sm:text-sm bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold hover:brightness-110 disabled:opacity-60 transition"
//               >
//                 Save Personal Info
//               </button>
//             </div>
//           </form>
//         </section>

//         {/* Password & Transaction PIN Sections */}
//         <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
//           {/* Password */}
//           <div className="bg-[#101010] rounded-2xl border border-dashed border-gray-800 p-4 sm:p-5 space-y-3">
//             <h2 className="text-sm sm:text-base font-semibold">Password</h2>
//             <p className="text-[11px] text-gray-400">
//               Create a strong password with at least 8 characters.
//             </p>

//             <form className="space-y-2 text-xs sm:text-sm" onSubmit={handlePasswordUpdate}>
//               <div className="space-y-1">
//                 <label className="block text-gray-300">Current Password</label>
//                 <input
//                   type="password"
//                   value={passwordForm.currentPassword}
//                   onChange={(e) =>
//                     setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
//                   }
//                   className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
//                 />
//               </div>
//               <div className="space-y-1">
//                 <label className="block text-gray-300">New Password</label>
//                 <input
//                   type="password"
//                   value={passwordForm.newPassword}
//                   onChange={(e) =>
//                     setPasswordForm({ ...passwordForm, newPassword: e.target.value })
//                   }
//                   className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
//                 />
//               </div>
//               <div className="space-y-1">
//                 <label className="block text-gray-300">Confirm New Password</label>
//                 <input
//                   type="password"
//                   value={passwordForm.confirmPassword}
//                   onChange={(e) =>
//                     setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
//                   }
//                   className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
//                 />
//               </div>

//               <div className="pt-2 flex justify-end">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-300 border border-dashed border-emerald-400/70 text-xs sm:text-sm hover:bg-emerald-500/20 disabled:opacity-60 transition"
//                 >
//                   Update Password
//                 </button>
//               </div>
//             </form>
//           </div>

//           {/* Transaction PIN */}
//           <div className="bg-[#101010] rounded-2xl border border-dashed border-gray-800 p-4 sm:p-5 space-y-3">
//             <h2 className="text-sm sm:text-base font-semibold">Transaction PIN</h2>
//             <p className="text-[11px] text-gray-400">
//               Set a 4 or 6 digit PIN to approve withdrawals and deposits.
//             </p>

//             <form className="space-y-2 text-xs sm:text-sm" onSubmit={handlePinUpdate}>
//               <div className="space-y-1">
//                 <label className="block text-gray-300">Current PIN (optional)</label>
//                 <input
//                   type="password"
//                   maxLength={6}
//                   value={pinForm.currentPin}
//                   onChange={(e) =>
//                     setPinForm({ ...pinForm, currentPin: e.target.value })
//                   }
//                   className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
//                 />
//               </div>
//               <div className="space-y-1">
//                 <label className="block text-gray-300">New PIN</label>
//                 <input
//                   type="password"
//                   maxLength={6}
//                   value={pinForm.newPin}
//                   onChange={(e) =>
//                     setPinForm({ ...pinForm, newPin: e.target.value })
//                   }
//                   className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
//                 />
//               </div>
//               <div className="space-y-1">
//                 <label className="block text-gray-300">Confirm New PIN</label>
//                 <input
//                   type="password"
//                   maxLength={6}
//                   value={pinForm.confirmPin}
//                   onChange={(e) =>
//                     setPinForm({ ...pinForm, confirmPin: e.target.value })
//                   }
//                   className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
//                 />
//               </div>

//               <div className="pt-2 flex justify-end">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold text-xs sm:text-sm hover:brightness-110 disabled:opacity-60 transition"
//                 >
//                   Save PIN
//                 </button>
//               </div>
//             </form>
//           </div>
//         </section>
//       </main>
//     </div>
//   )
// }

// export default SettingsPage













// src/pages/SettingsPage.jsx - FIXED FOR NEW USERS
import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function SettingsPage() {
  const navigate = useNavigate()
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

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [pinForm, setPinForm] = useState({
    currentPin: '',
    newPin: '',
    confirmPin: '',
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  
  // Face capture states - NEW USERS START EMPTY
  const [capturedFace, setCapturedFace] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // Load profile and biometric status - REMOVED LOCAL STORAGE FACE LOADING
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        // Get profile
        const res = await api.get('/settings/me', {
          headers: { Authorization: `Bearer ${token}` },
        })

        setProfile({
          fullName: res.data.fullName || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          city: res.data.city || '',
          address: res.data.address || '',
        })

        // Get biometric status - ONLY RELY ON API, NOT LOCAL STORAGE
        const bioRes = await api.get('/biometric/status', {
          headers: { Authorization: `Bearer ${token}` },
        })
        
        console.log('Biometric status from API:', bioRes.data)
        
        // Set biometric status from API only
        setBiometricStatus({
          faceRegistered: bioRes.data.faceRegistered || false,
          fingerprintRegistered: bioRes.data.fingerprintRegistered || false,
        })

        // If face is registered, we might want to show it, but for new users it will be false
        // We DON'T load from localStorage for new users

      } catch (err) {
        console.error('Error fetching data:', err)
      }
    }

    fetchData()
  }, [])

  const withAuth = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('You must be logged in to update settings.')
      return null
    }
    return { Authorization: `Bearer ${token}` }
  }

  // Start camera for face capture
  const startCamera = async () => {
    try {
      setError('')
      setShowCamera(true)
      setIsCapturing(true)
      
      // Use same video constraints as Withdraw page
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
        // Auto-capture after 3 seconds
        setTimeout(() => {
          captureFacePhoto()
        }, 3000)
      }
    } catch (err) {
      console.error('Camera error:', err)
      setError('Camera permission denied. Please allow camera access.')
      setShowCamera(false)
      setIsCapturing(false)
    }
  }

  // Capture face photo
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

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const faceImage = canvas.toDataURL('image/jpeg', 0.7)
    
    console.log('Face captured in Settings:', {
      length: faceImage.length,
      first50: faceImage.substring(0, 50),
      size: `${canvas.width}x${canvas.height}`,
      quality: '50%'
    })
    
    setCapturedFace(faceImage)
    
    // Stop camera
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    setShowCamera(false)
    setIsCapturing(false)
  }

  // Register captured face
  const registerFace = async () => {
    if (!capturedFace) {
      setError('Please capture your face first.')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    const headers = withAuth()
    if (!headers) {
      setLoading(false)
      return
    }

    try {
      console.log('Sending face data to register:', {
        length: capturedFace.length,
        first100: capturedFace.substring(0, 100)
      })

      const response = await api.post('/biometric/register-face', {
        faceData: capturedFace
      }, { headers })

      console.log('Register face API response:', response.data)
      
      if (response.data.success) {
        setMessage('Face registered successfully!')
        setBiometricStatus(prev => ({
          ...prev,
          faceRegistered: true
        }))
        
        // DO NOT store in localStorage for new users
        // We rely on API state only
        
        // Refresh biometric status
        const bioRes = await api.get('/biometric/status', {
          headers: { Authorization: headers.Authorization },
        })
        console.log('Updated biometric status:', bioRes.data)
      } else {
        setError(response.data.message || 'Failed to register face.')
      }

    } catch (err) {
      console.error('Register face error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      })
      setError(err.response?.data?.message || 'Failed to register face.')
    } finally {
      setLoading(false)
    }
  }

  // Register fingerprint
  const registerFingerprint = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    const headers = withAuth()
    if (!headers) {
      setLoading(false)
      return
    }

    try {
      // Simulate fingerprint data
      const fingerprintData = `fingerprint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      await api.post('/biometric/register-fingerprint', {
        fingerprintData: fingerprintData
      }, { headers })

      setMessage('Fingerprint registered successfully!')
      setBiometricStatus(prev => ({
        ...prev,
        fingerprintRegistered: true
      }))

    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to register fingerprint.')
    } finally {
      setLoading(false)
    }
  }

  // Re-upload face
  const reuploadFace = () => {
    setCapturedFace(null)
    setShowCamera(false)
    setBiometricStatus(prev => ({ ...prev, faceRegistered: false }))
    // Don't use localStorage for new users
    startCamera() // Start camera immediately
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

  // Handle save profile (unchanged)
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
      setMessage('Profile updated successfully.')
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  // Handle password update (unchanged)
  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New password and confirm password must match.')
      return
    }

    const headers = withAuth()
    if (!headers) return

    try {
      setLoading(true)
      await api.put(
        '/settings/password',
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        { headers }
      )
      setMessage('Password updated successfully.')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to update password.')
    } finally {
      setLoading(false)
    }
  }

  // Handle PIN update (unchanged)
  const handlePinUpdate = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (pinForm.newPin !== pinForm.confirmPin) {
      setError('New PIN and confirm PIN must match.')
      return
    }
    if (
      !/^[0-9]{4}$/.test(pinForm.newPin) &&
      !/^[0-9]{6}$/.test(pinForm.newPin)
    ) {
      setError('PIN must be exactly 4 or 6 digits.')
      return
    }

    const headers = withAuth()
    if (!headers) return

    try {
      setLoading(true)
      await api.put(
        '/settings/transaction-pin',
        {
          currentPin: pinForm.currentPin || null,
          newPin: pinForm.newPin,
        },
        { headers }
      )
      setMessage('Transaction PIN updated.')
      setPinForm({ currentPin: '', newPin: '', confirmPin: '' })
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to update PIN.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Top Bar */}
      <header className="border-b border-dashed border-gray-800 bg-black/40 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <svg className="h-4 w-4 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Account</p>
              <p className="text-sm font-semibold">Settings</p>
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

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Global message / error */}
        {(message || error) && (
          <div className="text-xs sm:text-sm">
            {message && <p className="mb-1 text-emerald-300">{message}</p>}
            {error && <p className="text-red-400">{error}</p>}
          </div>
        )}

        {/* Header */}
        <section className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-semibold">Security & Profile</h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Manage biometrics, personal information, password and transaction PIN.
          </p>
        </section>

        {/* Biometric Settings */}
        <section className="bg-[#101010] rounded-2xl border border-dashed border-gray-800 p-4 sm:p-5 space-y-4">
          <h2 className="text-sm sm:text-base font-semibold mb-1">Biometric Security</h2>
          <p className="text-xs sm:text-sm text-gray-400 mb-2">
            Link your fingerprint and face data for secure withdrawals above ₹5000.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Fingerprint Section */}
            <div className="rounded-xl border border-dashed border-emerald-500/60 bg-[#141414] p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <svg className="h-5 w-5 text-emerald-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Fingerprint</p>
                  <p className="text-xs text-gray-400">For withdrawals above ₹5000</p>
                </div>
              </div>
              
              {biometricStatus.fingerprintRegistered ? (
                <div className="space-y-2">
                  <div className="text-xs text-emerald-300">✓ Fingerprint registered</div>
                  <div className="text-xs text-gray-400">Ready for secure transactions</div>
                </div>
              ) : (
                <button
                  onClick={registerFingerprint}
                  disabled={loading}
                  className="w-full px-4 py-2 text-xs rounded-lg bg-emerald-500/10 text-emerald-300 border border-dashed border-emerald-400/70 hover:bg-emerald-500/20 transition disabled:opacity-50"
                >
                  Register Fingerprint
                </button>
              )}
            </div>

            {/* Face Section - FIXED FOR NEW USERS */}
            <div className="rounded-xl border border-dashed border-amber-500/70 bg-[#141414] p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <svg className="h-5 w-5 text-amber-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Face Recognition</p>
                  <p className="text-xs text-gray-400">For withdrawals above ₹5000</p>
                </div>
              </div>

              {/* Face Capture Flow */}
              {biometricStatus.faceRegistered ? (
                // Face already registered
                <div className="space-y-3">
                  <div className="text-xs text-amber-300">✓ Face registered</div>
                  <div className="relative rounded-lg overflow-hidden border border-dashed border-amber-400/30 bg-black">
                    {capturedFace ? (
                      <img 
                        src={capturedFace} 
                        alt="Registered face" 
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <div className="w-full h-40 flex items-center justify-center bg-gray-900">
                        <svg className="h-12 w-12 text-gray-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-1 px-2">
                      <p className="text-[10px] text-amber-300 text-center">Your Registered Face</p>
                    </div>
                  </div>
                  <button
                    onClick={reuploadFace}
                    disabled={loading}
                    className="w-full px-4 py-2 text-xs rounded-lg bg-gray-800 text-gray-300 border border-dashed border-gray-700 hover:bg-gray-700 transition"
                  >
                    Update Face
                  </button>
                </div>
              ) : showCamera ? (
                // Camera active
                <div className="space-y-3">
                  <div className="relative rounded-lg overflow-hidden border-2 border-dashed border-amber-400 bg-black">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-1 px-2">
                      <p className="text-[10px] text-white text-center">Camera will capture automatically...</p>
                    </div>
                  </div>
                  <button
                    onClick={cancelCamera}
                    className="w-full px-4 py-2 text-xs rounded-lg bg-gray-800 text-gray-300 border border-dashed border-gray-700 hover:bg-gray-700"
                  >
                    Cancel Camera
                  </button>
                </div>
              ) : capturedFace ? (
                // Face captured but not registered yet
                <div className="space-y-3">
                  <div className="relative rounded-lg overflow-hidden border border-dashed border-amber-400/50 bg-black">
                    <img 
                      src={capturedFace} 
                      alt="Captured face" 
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-1 px-2">
                      <p className="text-[10px] text-amber-300 text-center">Captured Face</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={registerFace}
                      disabled={loading}
                      className="flex-1 px-4 py-2 text-xs rounded-lg bg-amber-500/20 text-amber-300 border border-dashed border-amber-400/70 hover:bg-amber-500/30 transition disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Face'}
                    </button>
                    <button
                      onClick={startCamera}
                      className="flex-1 px-4 py-2 text-xs rounded-lg bg-gray-800 text-gray-300 border border-dashed border-gray-700 hover:bg-gray-700"
                    >
                      Retake
                    </button>
                  </div>
                </div>
              ) : (
                // New user - No face registered yet (DEFAULT STATE)
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center bg-black">
                    <svg className="h-12 w-12 mx-auto text-gray-600 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    <p className="text-xs text-gray-400 mb-1">No face registered yet</p>
                    <p className="text-[10px] text-gray-500 mb-3">Tap below to add your face</p>
                    <button
                      onClick={startCamera}
                      disabled={isCapturing}
                      className="px-4 py-2 text-xs rounded-lg bg-amber-500/10 text-amber-300 border border-dashed border-amber-400/70 hover:bg-amber-500/20 transition disabled:opacity-50"
                    >
                      {isCapturing ? 'Opening Camera...' : 'Capture Your Face'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Hidden canvas */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Personal Info Section (unchanged) */}
        <section className="bg-[#101010] rounded-2xl border border-dashed border-gray-800 p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-semibold">Personal Information</h2>
            <span className="text-[11px] text-gray-500">
              Keep this up to date for recovery and KYC.
            </span>
          </div>

          <form
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm"
            onSubmit={handleSaveProfile}
          >
            <div className="space-y-1.5">
              <label className="block text-gray-300">Full Name</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-gray-300">Email</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full rounded-lg bg-[#181818] border border-dashed border-gray-700 px-3 py-2 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-gray-300">Phone Number</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
                className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-gray-300">City</label>
              <input
                type="text"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                placeholder="Hyderabad"
                className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-gray-300">Address</label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                placeholder="Flat / Street / Area"
                className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
              />
            </div>

            <div className="flex justify-end pt-2 sm:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg text-xs sm:text-sm bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold hover:brightness-110 disabled:opacity-60 transition"
              >
                Save Personal Info
              </button>
            </div>
          </form>
        </section>

        {/* Password & Transaction PIN Sections (unchanged) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Password */}
          <div className="bg-[#101010] rounded-2xl border border-dashed border-gray-800 p-4 sm:p-5 space-y-3">
            <h2 className="text-sm sm:text-base font-semibold">Password</h2>
            <p className="text-[11px] text-gray-400">
              Create a strong password with at least 8 characters.
            </p>

            <form className="space-y-2 text-xs sm:text-sm" onSubmit={handlePasswordUpdate}>
              <div className="space-y-1">
                <label className="block text-gray-300">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
                  className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-gray-300">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                  }
                  className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-gray-300">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                  className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-300 border border-dashed border-emerald-400/70 text-xs sm:text-sm hover:bg-emerald-500/20 disabled:opacity-60 transition"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>

          {/* Transaction PIN */}
          <div className="bg-[#101010] rounded-2xl border border-dashed border-gray-800 p-4 sm:p-5 space-y-3">
            <h2 className="text-sm sm:text-base font-semibold">Transaction PIN</h2>
            <p className="text-[11px] text-gray-400">
              Set a 4 or 6 digit PIN to approve withdrawals and deposits.
            </p>

            <form className="space-y-2 text-xs sm:text-sm" onSubmit={handlePinUpdate}>
              <div className="space-y-1">
                <label className="block text-gray-300">Current PIN (optional)</label>
                <input
                  type="password"
                  maxLength={6}
                  value={pinForm.currentPin}
                  onChange={(e) =>
                    setPinForm({ ...pinForm, currentPin: e.target.value })
                  }
                  className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-gray-300">New PIN</label>
                <input
                  type="password"
                  maxLength={6}
                  value={pinForm.newPin}
                  onChange={(e) =>
                    setPinForm({ ...pinForm, newPin: e.target.value })
                  }
                  className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-gray-300">Confirm New PIN</label>
                <input
                  type="password"
                  maxLength={6}
                  value={pinForm.confirmPin}
                  onChange={(e) =>
                    setPinForm({ ...pinForm, confirmPin: e.target.value })
                  }
                  className="w-full rounded-lg bg-[#151515] border border-dashed border-gray-700 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold text-xs sm:text-sm hover:brightness-110 disabled:opacity-60 transition"
                >
                  Save PIN
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}

export default SettingsPage