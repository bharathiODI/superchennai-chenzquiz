// // 'use client'

// // import axios from 'axios'
// // import {
// //   Building2,
// //   ChevronDown,
// //   Eye,
// //   EyeOff,
// //   Key,
// //   Lightbulb,
// //   Lock,
// //   Mail,
// //   Smartphone,
// //   User,
// // } from 'lucide-react'
// // import Link from 'next/link'
// // import { useRouter } from 'next/navigation'
// // import { useEffect, useState } from 'react'

// // export default function LoginPage() {
// //   const [isRegister, setIsRegister] = useState(false)
// //   const [checkingAuth, setCheckingAuth] = useState(true)
// //   const [email, setEmail] = useState('')
// //   const [password, setPassword] = useState('')
// //   const [confirmPassword, setConfirmPassword] = useState('')
// //   const [showPassword, setShowPassword] = useState(false)
// //   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
// //   const [name, setName] = useState('')
// //   const [phone, setPhone] = useState('')
// //   const [countryCode, setCountryCode] = useState('+91')
// //   const [agreeTerms, setAgreeTerms] = useState(false)

// //   // OTP States
// //   const [otp, setOtp] = useState('')
// //   const [generatedOtp, setGeneratedOtp] = useState('')
// //   const [sendingOtp, setSendingOtp] = useState(false)
// //   const [otpVerified, setOtpVerified] = useState(false)
// //   const [resendTimer, setResendTimer] = useState(0)

// //   // Feedback & Loading States
// //   const [loading, setLoading] = useState(false)
// //   const [error, setError] = useState('')
// //   const [successMsg, setSuccessMsg] = useState('')
// //   const router = useRouter()

// //   // Resend OTP Countdown Effect
// //   useEffect(() => {
// //     let interval: NodeJS.Timeout
// //     if (resendTimer > 0) {
// //       interval = setInterval(() => {
// //         setResendTimer((prev) => prev - 1)
// //       }, 1000)
// //     }
// //     return () => clearInterval(interval)
// //   }, [resendTimer])

// //   // 1. Token irundha /quizzes page-ku redirect pannum
// //   useEffect(() => {
// //     const token = localStorage.getItem('token')
// //     if (token) {
// //       router.replace('/quizzes')
// //     } else {
// //       setCheckingAuth(false)
// //     }
// //   }, [router])

// //   // 2. Auth check mudiyura varaikum screen flicker aagama irukka indha loading UI
// //   if (checkingAuth) {
// //     return (
// //       <div className="min-h-screen w-full flex items-center justify-center bg-[#11145A] text-white">
// //         <div className="flex flex-col items-center gap-3">
// //           <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
// //           <p className="text-sm font-semibold tracking-wide text-purple-200">Checking Session...</p>
// //         </div>
// //       </div>
// //     )
// //   }

// //   // 1. Send OTP Function
// //   const handleSendOtp = async () => {
// //     try {
// //       setError('')
// //       setSuccessMsg('')

// //       if (!phone || String(phone).trim().length < 10) {
// //         setError('Enter a valid 10-digit mobile number')
// //         return
// //       }

// //       setSendingOtp(true)
// //       const newOtp = Math.floor(100000 + Math.random() * 900000).toString()
// //       setGeneratedOtp(newOtp)

// //       await axios.post('/api/send-otp', { mobile: `${countryCode}${phone}`, otp: newOtp })
// //       setSuccessMsg('OTP sent successfully to your mobile number!')
// //       setResendTimer(30)
// //     } catch (err: any) {
// //       setError('Failed to send OTP. Please try again.')
// //     } finally {
// //       setSendingOtp(false)
// //     }
// //   }

// //   // 2. Verify OTP Function
// //   const handleVerifyOtp = () => {
// //     setError('')
// //     setSuccessMsg('')

// //     if (otp && otp === generatedOtp) {
// //       setOtpVerified(true)
// //       setSuccessMsg('Mobile number verified successfully!')
// //     } else {
// //       setError('Invalid OTP entered. Please check and try again.')
// //     }
// //   }

// //   // 3. Form Submission (Login or Register)
// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault()
// //     setError('')
// //     setSuccessMsg('')

// //     if (isRegister) {
// //       if (!otpVerified) {
// //         setError('Please verify your mobile number with OTP before registering.')
// //         return
// //       }
// //       if (password !== confirmPassword) {
// //         setError('Passwords do not match.')
// //         return
// //       }
// //       if (!agreeTerms) {
// //         setError('You must agree to the Terms & Conditions to create an account.')
// //         return
// //       }
// //     }

// //     setLoading(true)

// //     const endpoint = isRegister ? '/api/quiz-users' : '/api/quiz-users/login'
// //     const body = isRegister
// //       ? { name, email, password, phone: `${countryCode}${phone}` }
// //       : { email, password }

// //     try {
// //       const res = await fetch(endpoint, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(body),
// //       })

// //       const data = await res.json()
// //       if (!res.ok)
// //         throw new Error(data.errors?.[0]?.message || data.message || 'Authentication failed')

// //       const token = data.token
// //       const user = data.user || data.doc

// //       if (token) {
// //         localStorage.setItem('token', token)
// //         localStorage.setItem('user', JSON.stringify(user))
// //         router.push('/quizzes')
// //       } else if (isRegister) {
// //         setIsRegister(false)
// //         setOtpVerified(false)
// //         setOtp('')
// //         setPassword('')
// //         setConfirmPassword('')
// //         setSuccessMsg('Account created successfully! Please log in.')
// //       }
// //     } catch (err: any) {
// //       setError(err.message)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   // Handle Social Login Placeholders
// //   const handleSocialLogin = (provider: string) => {
// //     alert(`${provider} login will be configured soon.`)
// //   }

// //   return (
// //     <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white text-slate-900 font-sans">
// //       {/* ========================================================= */}
// //       {/* LEFT SIDE: BRAND PANEL (Visible desktop & scaled mobile) */}
// //       {/* ========================================================= */}
// //       <div className="relative lg:w-1/2 w-full bg-gradient-to-br from-[#4B20D8] via-[#3215A8] to-[#17145C] min-h-[220px] lg:min-h-screen flex flex-col justify-between p-8 lg:p-12 overflow-hidden text-white">
// //         {/* Layered Organic Background Shapes */}
// //         <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-[#5A2BE2]/30 blur-3xl pointer-events-none" />
// //         <div className="absolute top-1/2 -right-20 w-96 h-96 rounded-full bg-[#4B20D8]/40 blur-3xl pointer-events-none" />
// //         <div className="absolute -bottom-20 left-10 w-96 h-96 rounded-full bg-[#17145C]/60 blur-2xl pointer-events-none" />

// //         {/* Top Branding Section */}
// //         <div className="relative z-10">
// //           <div className="inline-block">
// //             <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-none text-white drop-shadow-md">
// //               TRIVIA
// //             </h1>
// //             <p className="text-sm lg:text-base font-semibold text-purple-200 tracking-wider mt-1 opacity-90">
// //               by Super Chennai
// //             </p>
// //           </div>
// //         </div>

// //         {/* Middle Mascot / Character Graphic */}
// //         <div className="relative z-10 hidden lg:flex flex-col items-center justify-center my-auto py-8">
// //           <div className="relative w-64 h-64 bg-gradient-to-tr from-purple-600/40 to-indigo-400/20 rounded-full p-6 border border-white/10 flex items-center justify-center backdrop-blur-md shadow-2xl">
// //             {/* Glowing Lightbulb representing Trivia Knowledge */}
// //             <div className="absolute -top-4 right-12 bg-amber-400 p-3 rounded-full shadow-lg shadow-amber-400/50 animate-bounce">
// //               <Lightbulb className="w-8 h-8 text-slate-950 fill-amber-300" />
// //             </div>

// //             {/* Custom Trivia Character Avatar Badge */}
// //             <div className="w-48 h-48 rounded-full bg-[#5A2BE2] flex items-center justify-center border-4 border-white/20 shadow-inner overflow-hidden">
// //               <div className="text-center">
// //                 <span className="text-6xl select-none">🧙‍♂️</span>
// //                 <p className="text-xs font-bold text-purple-200 mt-2 tracking-wide">
// //                   CHENNAI QUIZ MASTER
// //                 </p>
// //               </div>
// //             </div>
// //           </div>
// //           <p className="text-center text-sm font-medium text-purple-200/80 mt-6 max-w-xs">
// //             Test your Chennai knowledge, climb the leaderboards & win daily rewards!
// //           </p>
// //         </div>

// //         {/* Bottom Chennai Skyline Line-Art Illustration */}
// //         <div className="relative z-10 pt-4 opacity-30 flex justify-between items-end border-t border-white/10">
// //           <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-purple-200">
// //             <Building2 className="w-4 h-4" /> Chennai Landmark Edition
// //           </div>
// //           <span className="text-[10px] text-purple-300 font-mono">v3.0 Powered</span>
// //         </div>
// //       </div>

// //       {/* ========================================================= */}
// //       {/* RIGHT SIDE: FORM CONTAINER                                */}
// //       {/* ========================================================= */}
// //       <div className="lg:w-1/2 w-full flex items-center justify-center p-6 lg:p-12 bg-white min-h-screen overflow-y-auto">
// //         <div className="w-full max-w-[520px] py-4">
// //           {/* Header Mobile Brand & Page Title */}
// //           <div className="text-center lg:text-left mb-8">
// //             <div className="lg:hidden mb-4">
// //               <h2 className="text-2xl font-black text-[#11145A]">TRIVIA</h2>
// //               <p className="text-xs font-semibold text-[#5B2EE6]">by Super Chennai</p>
// //             </div>
// //             <h2 className="text-3xl lg:text-4xl font-extrabold text-[#11145A] tracking-tight">
// //               {isRegister ? 'Create Account' : 'Welcome Back'}
// //             </h2>
// //             <p className="text-sm text-[#74799A] mt-1.5 font-medium">
// //               {isRegister
// //                 ? 'Join thousands of quiz fans across Chennai'
// //                 : 'Enter your credentials to access your quiz dashboard'}
// //             </p>
// //           </div>

// //           {error && (
// //             <div className="p-4 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
// //               {error}
// //             </div>
// //           )}
// //           {successMsg && (
// //             <div className="p-4 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
// //               {successMsg}
// //             </div>
// //           )}

// //           <form onSubmit={handleSubmit} className="space-y-4">
// //             {isRegister && (
// //               <>
// //                 <div>
// //                   <label className="block text-xs font-bold text-[#11145A] mb-1.5 uppercase tracking-wider">
// //                     Full Name
// //                   </label>
// //                   <div className="relative flex items-center">
// //                     <User className="w-5 h-5 absolute left-4 text-[#858AA8]" />
// //                     <input
// //                       type="text"
// //                       required
// //                       value={name}
// //                       onChange={(e) => setName(e.target.value)}
// //                       placeholder="Enter your full name"
// //                       className="w-full h-14 pl-12 pr-4 rounded-xl border border-[#DFE2EF] bg-white text-slate-900 font-medium placeholder-[#858AA8] focus:border-[#4B20D8] focus:ring-2 focus:ring-[#4B20D8]/10 outline-none transition"
// //                     />
// //                   </div>
// //                 </div>

// //                 <div>
// //                   <label className="block text-xs font-bold text-[#11145A] mb-1.5 uppercase tracking-wider">
// //                     Mobile Number
// //                   </label>
// //                   <div className="flex flex-col sm:flex-row gap-2">
// //                     {/* <div className="relative flex items-center">
// //                       <select
// //                         value={countryCode}
// //                         onChange={(e) => setCountryCode(e.target.value)}
// //                         className="h-14 pl-3 pr-8 rounded-xl border border-[#DFE2EF] bg-slate-50 text-slate-800 font-bold text-sm appearance-none outline-none focus:border-[#4B20D8]"
// //                       >
// //                         <option value="+91">+91 (IN)</option>
// //                       </select>
// //                       <ChevronDown className="w-4 h-4 absolute right-2 text-slate-500 pointer-events-none" />
// //                     </div> */}

// //                     <div className="relative flex-1 flex items-center">
// //                       <Smartphone className="w-5 h-5 absolute left-4 text-[#858AA8]" />
// //                       <input
// //                         type="tel"
// //                         required
// //                         disabled={otpVerified}
// //                         value={phone}
// //                         onChange={(e) => setPhone(e.target.value)}
// //                         placeholder="10-digit mobile number"
// //                         className="w-full h-14 pl-12 pr-4 rounded-xl border border-[#DFE2EF] bg-white text-slate-900 font-medium placeholder-[#858AA8] focus:border-[#4B20D8] focus:ring-2 focus:ring-[#4B20D8]/10 outline-none transition disabled:bg-slate-100 disabled:text-slate-500"
// //                       />
// //                     </div>

// //                     <button
// //                       type="button"
// //                       onClick={handleSendOtp}
// //                       disabled={sendingOtp || otpVerified || resendTimer > 0}
// //                       className="h-14 px-6 bg-[#4B20D8] hover:bg-[#3215A8] text-white font-bold text-xs rounded-xl transition duration-200 disabled:opacity-50 whitespace-nowrap cursor-pointer flex items-center justify-center"
// //                     >
// //                       {sendingOtp
// //                         ? 'Sending...'
// //                         : otpVerified
// //                           ? 'Verified ✓'
// //                           : resendTimer > 0
// //                             ? `Resend in ${resendTimer}s`
// //                             : 'Send OTP'}
// //                     </button>
// //                   </div>
// //                 </div>

// //                 {!otpVerified && generatedOtp && (
// //                   <div>
// //                     <label className="block text-xs font-bold text-[#11145A] mb-1.5 uppercase tracking-wider">
// //                       Enter 6-digit OTP
// //                     </label>
// //                     <div className="flex gap-2">
// //                       <div className="relative flex-1 flex items-center">
// //                         <Key className="w-5 h-5 absolute left-4 text-[#858AA8]" />
// //                         <input
// //                           type="text"
// //                           maxLength={6}
// //                           value={otp}
// //                           onChange={(e) => setOtp(e.target.value)}
// //                           placeholder="------"
// //                           className="w-full h-14 pl-12 pr-4 rounded-xl border border-[#DFE2EF] bg-white text-slate-900 font-mono text-center tracking-[0.5em] text-lg font-bold placeholder-[#858AA8] focus:border-[#4B20D8] focus:ring-2 focus:ring-[#4B20D8]/10 outline-none transition"
// //                         />
// //                       </div>
// //                       <button
// //                         type="button"
// //                         onClick={handleVerifyOtp}
// //                         className="h-14 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
// //                       >
// //                         Verify OTP
// //                       </button>
// //                     </div>
// //                   </div>
// //                 )}
// //               </>
// //             )}

// //             <div>
// //               <label className="block text-xs font-bold text-[#11145A] mb-1.5 uppercase tracking-wider">
// //                 Email Address
// //               </label>
// //               <div className="relative flex items-center">
// //                 <Mail className="w-5 h-5 absolute left-4 text-[#858AA8]" />
// //                 <input
// //                   type="email"
// //                   required
// //                   value={email}
// //                   onChange={(e) => setEmail(e.target.value)}
// //                   placeholder="name@example.com"
// //                   className="w-full h-14 pl-12 pr-4 rounded-xl border border-[#DFE2EF] bg-white text-slate-900 font-medium placeholder-[#858AA8] focus:border-[#4B20D8] focus:ring-2 focus:ring-[#4B20D8]/10 outline-none transition"
// //                 />
// //               </div>
// //             </div>

// //             <div>
// //               <label className="block text-xs font-bold text-[#11145A] mb-1.5 uppercase tracking-wider">
// //                 Password
// //               </label>
// //               <div className="relative flex items-center">
// //                 <Lock className="w-5 h-5 absolute left-4 text-[#858AA8]" />
// //                 <input
// //                   type={showPassword ? 'text' : 'password'}
// //                   required
// //                   value={password}
// //                   onChange={(e) => setPassword(e.target.value)}
// //                   placeholder="••••••••"
// //                   className="w-full h-14 pl-12 pr-12 rounded-xl border border-[#DFE2EF] bg-white text-slate-900 font-medium placeholder-[#858AA8] focus:border-[#4B20D8] focus:ring-2 focus:ring-[#4B20D8]/10 outline-none transition"
// //                 />
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowPassword(!showPassword)}
// //                   className="absolute right-4 text-[#858AA8] hover:text-[#11145A]"
// //                   aria-label={showPassword ? 'Hide password' : 'Show password'}
// //                 >
// //                   {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
// //                 </button>
// //               </div>
// //             </div>

// //             {isRegister && (
// //               <div>
// //                 <label className="block text-xs font-bold text-[#11145A] mb-1.5 uppercase tracking-wider">
// //                   Confirm Password
// //                 </label>
// //                 <div className="relative flex items-center">
// //                   <Lock className="w-5 h-5 absolute left-4 text-[#858AA8]" />
// //                   <input
// //                     type={showConfirmPassword ? 'text' : 'password'}
// //                     required
// //                     value={confirmPassword}
// //                     onChange={(e) => setConfirmPassword(e.target.value)}
// //                     placeholder="••••••••"
// //                     className="w-full h-14 pl-12 pr-12 rounded-xl border border-[#DFE2EF] bg-white text-slate-900 font-medium placeholder-[#858AA8] focus:border-[#4B20D8] focus:ring-2 focus:ring-[#4B20D8]/10 outline-none transition"
// //                   />
// //                   <button
// //                     type="button"
// //                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
// //                     className="absolute right-4 text-[#858AA8] hover:text-[#11145A]"
// //                     aria-label={
// //                       showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
// //                     }
// //                   >
// //                     {showConfirmPassword ? (
// //                       <EyeOff className="w-5 h-5" />
// //                     ) : (
// //                       <Eye className="w-5 h-5" />
// //                     )}
// //                   </button>
// //                 </div>
// //               </div>
// //             )}

// //             {isRegister && (
// //               <div className="flex items-start gap-3 pt-2">
// //                 <input
// //                   type="checkbox"
// //                   id="terms"
// //                   checked={agreeTerms}
// //                   onChange={(e) => setAgreeTerms(e.target.checked)}
// //                   className="mt-1 w-4 h-4 text-[#4B20D8] border-[#DFE2EF] rounded focus:ring-[#4B20D8]"
// //                 />
// //                 <label htmlFor="terms" className="text-xs text-[#74799A] leading-relaxed">
// //                   I agree to the{' '}
// //                   <Link href="/terms" className="text-[#4B20D8] font-bold hover:underline">
// //                     Terms & Conditions
// //                   </Link>{' '}
// //                   and{' '}
// //                   <Link href="/privacy" className="text-[#4B20D8] font-bold hover:underline">
// //                     Privacy Policy
// //                   </Link>
// //                   .
// //                 </label>
// //               </div>
// //             )}

// //             <button
// //               type="submit"
// //               disabled={loading}
// //               className="w-full h-14 mt-4 bg-gradient-to-r from-[#4B20D8] to-[#5B2EE6] hover:from-[#3215A8] hover:to-[#4B20D8] text-white font-extrabold text-base rounded-xl shadow-lg shadow-[#4B20D8]/20 transition-all duration-200 cursor-pointer disabled:opacity-60 flex items-center justify-center"
// //             >
// //               {loading
// //                 ? isRegister
// //                   ? 'Creating Account...'
// //                   : 'Logging in...'
// //                 : isRegister
// //                   ? 'Sign Up'
// //                   : 'Login'}
// //             </button>
// //           </form>

// //           <div className="mt-8 text-center">
// //             <p className="text-sm font-medium text-[#74799A]">
// //               {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
// //               <button
// //                 type="button"
// //                 onClick={() => {
// //                   setIsRegister(!isRegister)
// //                   setError('')
// //                   setSuccessMsg('')
// //                 }}
// //                 className="text-[#4B20D8] font-bold hover:underline cursor-pointer ml-1"
// //               >
// //                 {isRegister ? 'Login' : 'Sign Up'}
// //               </button>
// //             </p>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// 'use client'

// import axios from 'axios'
// import {
//   Building2,
//   ChevronLeft,
//   Eye,
//   EyeOff,
//   Key,
//   Lightbulb,
//   Lock,
//   Smartphone,
//   User,
// } from 'lucide-react'
// import { useRouter } from 'next/navigation'
// import { useEffect, useState } from 'react'

// export default function LoginPage() {
//   const [isRegister, setIsRegister] = useState(false)
//   const [isForgotPassword, setIsForgotPassword] = useState(false)
//   const [checkingAuth, setCheckingAuth] = useState(true)

//   // Form Fields
//   const [phone, setPhone] = useState('')
//   const [countryCode] = useState('+91')
//   const [password, setPassword] = useState('')
//   const [confirmPassword, setConfirmPassword] = useState('')
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const [name, setName] = useState('')
//   const [agreeTerms, setAgreeTerms] = useState(false)

//   // Login Mode: 'password' | 'otp'
//   const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password')

//   // OTP States
//   const [otp, setOtp] = useState('')
//   const [generatedOtp, setGeneratedOtp] = useState('')
//   const [sendingOtp, setSendingOtp] = useState(false)
//   const [otpVerified, setOtpVerified] = useState(false)
//   const [resendTimer, setResendTimer] = useState(0)

//   // Feedback & Loading States
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
//   const [successMsg, setSuccessMsg] = useState('')
//   const router = useRouter()

//   // Resend OTP Countdown Effect
//   useEffect(() => {
//     let interval: NodeJS.Timeout
//     if (resendTimer > 0) {
//       interval = setInterval(() => {
//         setResendTimer((prev) => prev - 1)
//       }, 1000)
//     }
//     return () => clearInterval(interval)
//   }, [resendTimer])

//   // Check auth session on load
//   useEffect(() => {
//     const token = localStorage.getItem('token')
//     if (token) {
//       router.replace('/quizzes')
//     } else {
//       setCheckingAuth(false)
//     }
//   }, [router])

//   // Reset form states on switching views
//   const resetFormState = () => {
//     setError('')
//     setSuccessMsg('')
//     setOtp('')
//     setGeneratedOtp('')
//     setOtpVerified(false)
//     setPassword('')
//     setConfirmPassword('')
//   }

//   if (checkingAuth) {
//     return (
//       <div className="min-h-screen w-full flex items-center justify-center bg-[#11145A] text-white">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm font-semibold tracking-wide text-purple-200">Checking Session...</p>
//         </div>
//       </div>
//     )
//   }

//   const handleSendOtp = async () => {
//     try {
//       setError('')
//       setSuccessMsg('')

//       if (!phone || String(phone).trim().length < 10) {
//         setError('Enter a valid 10-digit mobile number')
//         return
//       }

//       setSendingOtp(true)
//       const newOtp = Math.floor(100000 + Math.random() * 900000).toString()
//       setGeneratedOtp(newOtp)

//       await axios.post('/api/send-otp', { mobile: `${countryCode}${phone}`, otp: newOtp })
//       setSuccessMsg('OTP sent successfully to your mobile number!')
//       setResendTimer(30)
//     } catch (err: any) {
//       setError('Failed to send OTP. Please try again.')
//     } finally {
//       setSendingOtp(false)
//     }
//   }

//   const handleVerifyOtp = () => {
//     setError('')
//     setSuccessMsg('')

//     if (otp && otp === generatedOtp) {
//       setOtpVerified(true)
//       setSuccessMsg('Mobile number verified successfully!')
//     } else {
//       setError('Invalid OTP entered. Please check and try again.')
//     }
//   }

//   const handleResetPassword = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')
//     setSuccessMsg('')

//     if (!otpVerified) {
//       setError('Please verify your mobile number with OTP first.')
//       return
//     }
//     if (!password) {
//       setError('Please enter a new password.')
//       return
//     }
//     if (password !== confirmPassword) {
//       setError('Passwords do not match.')
//       return
//     }

//     setLoading(true)
//     try {
//       const res = await fetch('/api/quiz-users/reset-password', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ phone: `${countryCode}${phone}`, password }),
//       })
//       const data = await res.json()
//       if (!res.ok) throw new Error(data.message || 'Failed to reset password')

//       setSuccessMsg('Password updated successfully! Please login with your new password.')
//       setIsForgotPassword(false)
//       setIsRegister(false)
//       resetFormState()
//     } catch (err: any) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')
//     setSuccessMsg('')

//     const formattedPhone = `${countryCode}${phone}`

//     if (isRegister) {
//       if (!otpVerified) {
//         setError('Please verify your mobile number with OTP before registering.')
//         return
//       }
//       if (password !== confirmPassword) {
//         setError('Passwords do not match.')
//         return
//       }
//       if (!agreeTerms) {
//         setError('You must agree to the Terms & Conditions to create an account.')
//         return
//       }
//     } else if (loginMethod === 'otp') {
//       if (!otpVerified) {
//         setError('Please verify your mobile number with OTP to log in.')
//         return
//       }
//     }

//     setLoading(true)

//     let endpoint = ''
//     let body = {}

//     if (isRegister) {
//       endpoint = '/api/quiz-users'
//       body = { name, phone: formattedPhone, password }
//     } else {
//       endpoint = '/api/quiz-users/login'
//       body =
//         loginMethod === 'otp'
//           ? { phone: formattedPhone, otpVerified: true }
//           : { phone: formattedPhone, password }
//     }

//     try {
//       const res = await fetch(endpoint, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(body),
//       })

//       const data = await res.json()
//       if (!res.ok) {
//         throw new Error(data.errors?.[0]?.message || data.message || 'Authentication failed')
//       }

//       const token = data.token
//       const user = data.user || data.doc

//       if (token) {
//         localStorage.setItem('token', token)
//         localStorage.setItem('user', JSON.stringify(user))
//         router.push('/quizzes')
//       } else if (isRegister) {
//         setIsRegister(false)
//         resetFormState()
//         setSuccessMsg('Account created successfully! Please log in.')
//       }
//     } catch (err: any) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white text-slate-900 font-sans">
//       {/* LEFT SIDE: BRAND PANEL */}
//       <div className="relative lg:w-1/2 w-full bg-gradient-to-br from-[#4B20D8] via-[#3215A8] to-[#17145C] min-h-[220px] lg:min-h-screen flex flex-col justify-between p-8 lg:p-12 overflow-hidden text-white">
//         <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-[#5A2BE2]/30 blur-3xl pointer-events-none" />
//         <div className="absolute top-1/2 -right-20 w-96 h-96 rounded-full bg-[#4B20D8]/40 blur-3xl pointer-events-none" />
//         <div className="absolute -bottom-20 left-10 w-96 h-96 rounded-full bg-[#17145C]/60 blur-2xl pointer-events-none" />

//         <div className="relative z-10">
//           <div className="inline-block">
//             <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-none text-white drop-shadow-md">
//               TRIVIA
//             </h1>
//             <p className="text-sm lg:text-base font-semibold text-purple-200 tracking-wider mt-1 opacity-90">
//               by Super Chennai
//             </p>
//           </div>
//         </div>

//         <div className="relative z-10 hidden lg:flex flex-col items-center justify-center my-auto py-8">
//           <div className="relative w-64 h-64 bg-gradient-to-tr from-purple-600/40 to-indigo-400/20 rounded-full p-6 border border-white/10 flex items-center justify-center backdrop-blur-md shadow-2xl">
//             <div className="absolute -top-4 right-12 bg-amber-400 p-3 rounded-full shadow-lg shadow-amber-400/50 animate-bounce">
//               <Lightbulb className="w-8 h-8 text-slate-950 fill-amber-300" />
//             </div>
//             <div className="w-48 h-48 rounded-full bg-[#5A2BE2] flex items-center justify-center border-4 border-white/20 shadow-inner overflow-hidden">
//               <div className="text-center">
//                 <span className="text-6xl select-none">🧙‍♂️</span>
//                 <p className="text-xs font-bold text-purple-200 mt-2 tracking-wide">
//                   CHENNAI QUIZ MASTER
//                 </p>
//               </div>
//             </div>
//           </div>
//           <p className="text-center text-sm font-medium text-purple-200/80 mt-6 max-w-xs">
//             Test your Chennai knowledge, climb the leaderboards & win daily rewards!
//           </p>
//         </div>

//         <div className="relative z-10 pt-4 opacity-30 flex justify-between items-end border-t border-white/10">
//           <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-purple-200">
//             <Building2 className="w-4 h-4" /> Chennai Landmark Edition
//           </div>
//           <span className="text-[10px] text-purple-300 font-mono">v3.0 Powered</span>
//         </div>
//       </div>

//       {/* RIGHT SIDE: FORM CONTAINER */}
//       <div className="lg:w-1/2 w-full flex items-center justify-center p-6 lg:p-12 bg-white min-h-screen overflow-y-auto">
//         <div className="w-full max-w-[520px] py-4">
//           {/* Header */}
//           <div className="text-center lg:text-left mb-8">
//             <div className="lg:hidden mb-4">
//               <h2 className="text-2xl font-black text-[#11145A]">TRIVIA</h2>
//               <p className="text-xs font-semibold text-[#5B2EE6]">by Super Chennai</p>
//             </div>
//             <h2 className="text-3xl lg:text-4xl font-extrabold text-[#11145A] tracking-tight">
//               {isForgotPassword ? 'Reset Password' : isRegister ? 'Create Account' : 'Welcome Back'}
//             </h2>
//             <p className="text-sm text-[#74799A] mt-1.5 font-medium">
//               {isForgotPassword
//                 ? 'Verify your mobile number to set a new password'
//                 : isRegister
//                   ? 'Join thousands of quiz fans across Chennai'
//                   : 'Enter your phone number to access your quiz dashboard'}
//             </p>
//           </div>

//           {error && (
//             <div className="p-4 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
//               {error}
//             </div>
//           )}
//           {successMsg && (
//             <div className="p-4 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
//               {successMsg}
//             </div>
//           )}

//           {/* FORGOT PASSWORD FORM */}
//           {isForgotPassword ? (
//             <form onSubmit={handleResetPassword} className="space-y-4">
//               <div>
//                 <label className="block text-xs font-bold text-[#11145A] mb-1.5 uppercase tracking-wider">
//                   Mobile Number
//                 </label>
//                 <div className="flex gap-2">
//                   <div className="relative flex-1 flex items-center">
//                     <Smartphone className="w-5 h-5 absolute left-4 text-[#858AA8]" />
//                     <input
//                       type="tel"
//                       required
//                       disabled={otpVerified}
//                       value={phone}
//                       onChange={(e) => setPhone(e.target.value)}
//                       placeholder="10-digit mobile number"
//                       className="w-full h-14 pl-12 pr-4 rounded-xl border border-[#DFE2EF] bg-white text-slate-900 font-medium placeholder-[#858AA8] focus:border-[#4B20D8] focus:ring-2 focus:ring-[#4B20D8]/10 outline-none transition disabled:bg-slate-100 disabled:text-slate-500"
//                     />
//                   </div>
//                   <button
//                     type="button"
//                     onClick={handleSendOtp}
//                     disabled={sendingOtp || otpVerified || resendTimer > 0}
//                     className="h-14 px-6 bg-[#4B20D8] hover:bg-[#3215A8] text-white font-bold text-xs rounded-xl transition duration-200 disabled:opacity-50 whitespace-nowrap cursor-pointer flex items-center justify-center"
//                   >
//                     {sendingOtp
//                       ? 'Sending...'
//                       : otpVerified
//                         ? 'Verified ✓'
//                         : resendTimer > 0
//                           ? `Resend in ${resendTimer}s`
//                           : 'Send OTP'}
//                   </button>
//                 </div>
//               </div>

//               {!otpVerified && generatedOtp && (
//                 <div>
//                   <label className="block text-xs font-bold text-[#11145A] mb-1.5 uppercase tracking-wider">
//                     Enter 6-digit OTP
//                   </label>
//                   <div className="flex gap-2">
//                     <div className="relative flex-1 flex items-center">
//                       <Key className="w-5 h-5 absolute left-4 text-[#858AA8]" />
//                       <input
//                         type="text"
//                         maxLength={6}
//                         value={otp}
//                         onChange={(e) => setOtp(e.target.value)}
//                         placeholder="------"
//                         className="w-full h-14 pl-12 pr-4 rounded-xl border border-[#DFE2EF] bg-white text-slate-900 font-mono text-center tracking-[0.5em] text-lg font-bold placeholder-[#858AA8] focus:border-[#4B20D8] focus:ring-2 focus:ring-[#4B20D8]/10 outline-none transition"
//                       />
//                     </div>
//                     <button
//                       type="button"
//                       onClick={handleVerifyOtp}
//                       className="h-14 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
//                     >
//                       Verify OTP
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {otpVerified && (
//                 <>
//                   <div>
//                     <label className="block text-xs font-bold text-[#11145A] mb-1.5 uppercase tracking-wider">
//                       New Password
//                     </label>
//                     <div className="relative flex items-center">
//                       <Lock className="w-5 h-5 absolute left-4 text-[#858AA8]" />
//                       <input
//                         type={showPassword ? 'text' : 'password'}
//                         required
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         placeholder="••••••••"
//                         className="w-full h-14 pl-12 pr-12 rounded-xl border border-[#DFE2EF] bg-white text-slate-900 font-medium placeholder-[#858AA8] focus:border-[#4B20D8] focus:ring-2 focus:ring-[#4B20D8]/10 outline-none transition"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-4 text-[#858AA8] hover:text-[#11145A]"
//                         aria-label={showPassword ? 'Hide password' : 'Show password'}
//                       >
//                         {showPassword ? (
//                           <EyeOff className="w-5 h-5" />
//                         ) : (
//                           <Eye className="w-5 h-5" />
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-xs font-bold text-[#11145A] mb-1.5 uppercase tracking-wider">
//                       Confirm New Password
//                     </label>
//                     <div className="relative flex items-center">
//                       <Lock className="w-5 h-5 absolute left-4 text-[#858AA8]" />
//                       <input
//                         type={showConfirmPassword ? 'text' : 'password'}
//                         required
//                         value={confirmPassword}
//                         onChange={(e) => setConfirmPassword(e.target.value)}
//                         placeholder="••••••••"
//                         className="w-full h-14 pl-12 pr-12 rounded-xl border border-[#DFE2EF] bg-white text-slate-900 font-medium placeholder-[#858AA8] focus:border-[#4B20D8] focus:ring-2 focus:ring-[#4B20D8]/10 outline-none transition"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                         className="absolute right-4 text-[#858AA8] hover:text-[#11145A]"
//                         aria-label={
//                           showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
//                         }
//                       >
//                         {showConfirmPassword ? (
//                           <EyeOff className="w-5 h-5" />
//                         ) : (
//                           <Eye className="w-5 h-5" />
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full h-14 mt-4 bg-gradient-to-r from-[#4B20D8] to-[#5B2EE6] hover:from-[#3215A8] hover:to-[#4B20D8] text-white font-extrabold text-base rounded-xl shadow-lg shadow-[#4B20D8]/20 transition-all duration-200 cursor-pointer disabled:opacity-60 flex items-center justify-center"
//                   >
//                     {loading ? 'Updating Password...' : 'Reset Password'}
//                   </button>
//                 </>
//               )}

//               <div className="mt-4 text-center">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setIsForgotPassword(false)
//                     resetFormState()
//                   }}
//                   className="inline-flex items-center text-xs font-bold text-[#4B20D8] hover:underline cursor-pointer"
//                 >
//                   <ChevronLeft className="w-4 h-4 mr-1" /> Back to Login
//                 </button>
//               </div>
//             </form>
//           ) : (
//             /* LOGIN / REGISTER FORM */
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {/* TOGGLE METHOD FOR LOGIN */}
//               {!isRegister && (
//                 <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setLoginMethod('password')
//                       resetFormState()
//                     }}
//                     className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
//                       loginMethod === 'password'
//                         ? 'bg-white text-[#4B20D8] shadow-sm'
//                         : 'text-slate-500 hover:text-slate-800'
//                     }`}
//                   >
//                     Login with Password
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setLoginMethod('otp')
//                       resetFormState()
//                     }}
//                     className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
//                       loginMethod === 'otp'
//                         ? 'bg-white text-[#4B20D8] shadow-sm'
//                         : 'text-slate-500 hover:text-slate-800'
//                     }`}
//                   >
//                     Login with Mobile OTP
//                   </button>
//                 </div>
//               )}

//               {/* REGISTER FIELD: NAME */}
//               {isRegister && (
//                 <div>
//                   <label className="block text-xs font-bold text-[#11145A] mb-1.5 uppercase tracking-wider">
//                     Full Name
//                   </label>
//                   <div className="relative flex items-center">
//                     <User className="w-5 h-5 absolute left-4 text-[#858AA8]" />
//                     <input
//                       type="text"
//                       required
//                       value={name}
//                       onChange={(e) => setName(e.target.value)}
//                       placeholder="Enter your full name"
//                       className="w-full h-14 pl-12 pr-4 rounded-xl border border-[#DFE2EF] bg-white text-slate-900 font-medium placeholder-[#858AA8] focus:border-[#4B20D8] focus:ring-2 focus:ring-[#4B20D8]/10 outline-none transition"
//                     />
//                   </div>
//                 </div>
//               )}

//               {/* MOBILE NUMBER INPUT */}
//               <div>
//                 <label className="block text-xs font-bold text-[#11145A] mb-1.5 uppercase tracking-wider">
//                   Mobile Number
//                 </label>
//                 <div className="flex gap-2">
//                   <div className="relative flex-1 flex items-center">
//                     <Smartphone className="w-5 h-5 absolute left-4 text-[#858AA8]" />
//                     <input
//                       type="tel"
//                       required
//                       disabled={otpVerified && (isRegister || loginMethod === 'otp')}
//                       value={phone}
//                       onChange={(e) => setPhone(e.target.value)}
//                       placeholder="10-digit mobile number"
//                       className="w-full h-14 pl-12 pr-4 rounded-xl border border-[#DFE2EF] bg-white text-slate-900 font-medium placeholder-[#858AA8] focus:border-[#4B20D8] focus:ring-2 focus:ring-[#4B20D8]/10 outline-none transition disabled:bg-slate-100 disabled:text-slate-500"
//                     />
//                   </div>

//                   {(isRegister || loginMethod === 'otp') && (
//                     <button
//                       type="button"
//                       onClick={handleSendOtp}
//                       disabled={sendingOtp || otpVerified || resendTimer > 0}
//                       className="h-14 px-6 bg-[#4B20D8] hover:bg-[#3215A8] text-white font-bold text-xs rounded-xl transition duration-200 disabled:opacity-50 whitespace-nowrap cursor-pointer flex items-center justify-center"
//                     >
//                       {sendingOtp
//                         ? 'Sending...'
//                         : otpVerified
//                           ? 'Verified ✓'
//                           : resendTimer > 0
//                             ? `Resend in ${resendTimer}s`
//                             : 'Send OTP'}
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* OTP VERIFICATION SECTION */}
//               {(isRegister || loginMethod === 'otp') && !otpVerified && generatedOtp && (
//                 <div>
//                   <label className="block text-xs font-bold text-[#11145A] mb-1.5 uppercase tracking-wider">
//                     Enter 6-digit OTP
//                   </label>
//                   <div className="flex gap-2">
//                     <div className="relative flex-1 flex items-center">
//                       <Key className="w-5 h-5 absolute left-4 text-[#858AA8]" />
//                       <input
//                         type="text"
//                         maxLength={6}
//                         value={otp}
//                         onChange={(e) => setOtp(e.target.value)}
//                         placeholder="------"
//                         className="w-full h-14 pl-12 pr-4 rounded-xl border border-[#DFE2EF] bg-white text-slate-900 font-mono text-center tracking-[0.5em] text-lg font-bold placeholder-[#858AA8] focus:border-[#4B20D8] focus:ring-2 focus:ring-[#4B20D8]/10 outline-none transition"
//                       />
//                     </div>
//                     <button
//                       type="button"
//                       onClick={handleVerifyOtp}
//                       className="h-14 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
//                     >
//                       Verify OTP
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* PASSWORD FIELD (If Registering OR Login with Password) */}
//               {(isRegister || loginMethod === 'password') && (
//                 <div>
//                   <div className="flex justify-between items-center mb-1.5">
//                     <label className="block text-xs font-bold text-[#11145A] uppercase tracking-wider">
//                       Password
//                     </label>
//                     {!isRegister && loginMethod === 'password' && (
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setIsForgotPassword(true)
//                           resetFormState()
//                         }}
//                         className="text-xs font-bold text-[#4B20D8] hover:underline cursor-pointer"
//                       >
//                         Forgot Password?
//                       </button>
//                     )}
//                   </div>
//                   <div className="relative flex items-center">
//                     <Lock className="w-5 h-5 absolute left-4 text-[#858AA8]" />
//                     <input
//                       type={showPassword ? 'text' : 'password'}
//                       required
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       placeholder="••••••••"
//                       className="w-full h-14 pl-12 pr-12 rounded-xl border border-[#DFE2EF] bg-white text-slate-900 font-medium placeholder-[#858AA8] focus:border-[#4B20D8] focus:ring-2 focus:ring-[#4B20D8]/10 outline-none transition"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-4 text-[#858AA8] hover:text-[#11145A]"
//                       aria-label={showPassword ? 'Hide password' : 'Show password'}
//                     >
//                       {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* CONFIRM PASSWORD FIELD (Register Only) */}
//               {isRegister && (
//                 <div>
//                   <label className="block text-xs font-bold text-[#11145A] mb-1.5 uppercase tracking-wider">
//                     Confirm Password
//                   </label>
//                   <div className="relative flex items-center">
//                     <Lock className="w-5 h-5 absolute left-4 text-[#858AA8]" />
//                     <input
//                       type={showConfirmPassword ? 'text' : 'password'}
//                       required
//                       value={confirmPassword}
//                       onChange={(e) => setConfirmPassword(e.target.value)}
//                       placeholder="••••••••"
//                       className="w-full h-14 pl-12 pr-12 rounded-xl border border-[#DFE2EF] bg-white text-slate-900 font-medium placeholder-[#858AA8] focus:border-[#4B20D8] focus:ring-2 focus:ring-[#4B20D8]/10 outline-none transition"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                       className="absolute right-4 text-[#858AA8] hover:text-[#11145A]"
//                       aria-label={
//                         showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
//                       }
//                     >
//                       {showConfirmPassword ? (
//                         <EyeOff className="w-5 h-5" />
//                       ) : (
//                         <Eye className="w-5 h-5" />
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* TERMS & CONDITIONS CHECKBOX */}
//               {isRegister && (
//                 <div className="flex items-start gap-3 pt-2">
//                   <input
//                     type="checkbox"
//                     id="terms"
//                     checked={agreeTerms}
//                     onChange={(e) => setAgreeTerms(e.target.checked)}
//                     className="mt-1 w-4 h-4 text-[#4B20D8] border-[#DFE2EF] rounded focus:ring-[#4B20D8]"
//                   />
//                   <label htmlFor="terms" className="text-xs text-[#74799A] leading-relaxed">
//                     I agree to the{' '}
//                     <a href="/terms" className="text-[#4B20D8] font-bold hover:underline">
//                       Terms & Conditions
//                     </a>{' '}
//                     and{' '}
//                     <a href="/privacy" className="text-[#4B20D8] font-bold hover:underline">
//                       Privacy Policy
//                     </a>
//                     .
//                   </label>
//                 </div>
//               )}

//               {/* SUBMIT BUTTON */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full h-14 mt-4 bg-gradient-to-r from-[#4B20D8] to-[#5B2EE6] hover:from-[#3215A8] hover:to-[#4B20D8] text-white font-extrabold text-base rounded-xl shadow-lg shadow-[#4B20D8]/20 transition-all duration-200 cursor-pointer disabled:opacity-60 flex items-center justify-center"
//               >
//                 {loading
//                   ? isRegister
//                     ? 'Creating Account...'
//                     : 'Logging in...'
//                   : isRegister
//                     ? 'Sign Up'
//                     : 'Login'}
//               </button>
//             </form>
//           )}

//           {/* TOGGLE LOGIN / REGISTER */}
//           {!isForgotPassword && (
//             <div className="mt-8 text-center">
//               <p className="text-sm font-medium text-[#74799A]">
//                 {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setIsRegister(!isRegister)
//                     resetFormState()
//                   }}
//                   className="text-[#4B20D8] font-bold hover:underline cursor-pointer ml-1"
//                 >
//                   {isRegister ? 'Login' : 'Sign Up'}
//                 </button>
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

/* eslint-disable @next/next/no-html-link-for-pages */
'use client'

import axios from 'axios'
import {
  Building2,
  ChevronLeft,
  Eye,
  EyeOff,
  Key,
  Lightbulb,
  Lock,
  Mail,
  Smartphone,
  User,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  // Form Fields
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [countryCode] = useState('+91')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [name, setName] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)

  // Login Mode: 'password' | 'otp'
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password')

  // OTP States
  const [otp, setOtp] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [sendingOtp, setSendingOtp] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  // Feedback & Loading States
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const router = useRouter()

  // Resend OTP Countdown Effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  // Check auth session on load
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      router.replace('/quizzes')
    } else {
      setCheckingAuth(false)
    }
  }, [router])

  // Reset form states on switching views
  const resetFormState = () => {
    setError('')
    setSuccessMsg('')
    setOtp('')
    setGeneratedOtp('')
    setOtpVerified(false)
    setPassword('')
    setConfirmPassword('')
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#11145A] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold tracking-wide text-purple-200">Checking Session...</p>
        </div>
      </div>
    )
  }

  const handleSendOtp = async () => {
    try {
      setError('')
      setSuccessMsg('')

      if (!phone || String(phone).trim().length < 10) {
        setError('Enter a valid 10-digit mobile number')
        return
      }

      setSendingOtp(true)
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString()
      setGeneratedOtp(newOtp)

      await axios.post('/api/send-otp', { mobile: `${countryCode}${phone}`, otp: newOtp })
      setSuccessMsg('OTP sent successfully to your mobile number!')
      setResendTimer(30)
    } catch (err: any) {
      setError('Failed to send OTP. Please try again.')
    } finally {
      setSendingOtp(false)
    }
  }

  const handleVerifyOtp = () => {
    setError('')
    setSuccessMsg('')

    if (otp && otp === generatedOtp) {
      setOtpVerified(true)
      setSuccessMsg('Mobile number verified successfully!')
    } else {
      setError('Invalid OTP entered. Please check and try again.')
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    if (!otpVerified) {
      setError('Please verify your mobile number with OTP first.')
      return
    }
    if (!password) {
      setError('Please enter a new password.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/quiz-users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `${countryCode}${phone}`, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to reset password')

      setSuccessMsg('Password updated successfully! Please login with your new password.')
      setIsForgotPassword(false)
      setIsRegister(false)
      resetFormState()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    const formattedPhone = `${countryCode}${phone}`

    if (isRegister) {
      if (!otpVerified) {
        setError('Please verify your mobile number with OTP before registering.')
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }
      if (!agreeTerms) {
        setError('You must agree to the Terms & Conditions to create an account.')
        return
      }
    } else if (loginMethod === 'otp') {
      if (!otpVerified) {
        setError('Please verify your mobile number with OTP to log in.')
        return
      }
    }

    setLoading(true)

    let endpoint = ''
    let body = {}

    if (isRegister) {
      endpoint = '/api/quiz-users'
      // Registration time la username place laiyum phone pass pannanum
      body = {
        name,
        phone: formattedPhone,
        username: formattedPhone,
        email: email.trim() || undefined,
        password,
      }
    } else {
      if (loginMethod === 'otp') {
        // OTP-based custom login handle panna custom API route call pannanum
        endpoint = '/api/quiz-users/login-otp'
        body = { phone: formattedPhone, otp: otp }
      } else {
        // Standard Payload Password Login
        endpoint = '/api/quiz-users/login'
        body = {
          username: formattedPhone, // Mobile number direct ah username ah pass pandrom
          password,
        }
      }
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.errors?.[0]?.message || data.message || 'Authentication failed')
      }

      const token = data.token
      const user = data.user || data.doc

      if (token) {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        router.push('/quizzes')
      } else if (isRegister) {
        setIsRegister(false)
        resetFormState()
        setSuccessMsg('Account created successfully! Please log in.')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white text-slate-900 font-sans loginheightttt1">
      {/* LEFT SIDE: BRAND PANEL */}
      <div className="relative lg:w-1/2 w-full bg-gradient-to-br from-[#4B20D8] via-[#3215A8] to-[#17145C] min-h-[220px] lg:min-h-screen flex flex-col justify-between p-8 lg:p-12 overflow-hidden text-white loginnnpageeeee">
        <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-[#5A2BE2]/30 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-20 w-96 h-96 rounded-full bg-[#4B20D8]/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-10 w-96 h-96 rounded-full bg-[#17145C]/60 blur-2xl pointer-events-none" />

        {/* <div className="relative z-10">
          <div className="inline-block">
            <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-none text-white drop-shadow-md">
              TRIVIA
            </h1>
            <p className="text-sm lg:text-base font-semibold text-purple-200 tracking-wider mt-1 opacity-90">
              by Super Chennai
            </p>
          </div>
        </div> */}

        <div className="relative z-10 hidden lg:flex flex-col items-center justify-center my-auto py-8">
          <div className="relative w-64 h-64 bg-gradient-to-tr from-purple-600/40 to-indigo-400/20 rounded-full p-6 border border-white/10 flex items-center justify-center backdrop-blur-md shadow-2xl">
            <div className="absolute -top-4 right-12 bg-amber-400 p-3 rounded-full shadow-lg shadow-amber-400/50 animate-bounce">
              <Lightbulb className="w-8 h-8 text-slate-950 fill-amber-300" />
            </div>
            <div className="w-48 h-48 rounded-full bg-[#5A2BE2] flex items-center justify-center border-4 border-white/20 shadow-inner overflow-hidden">
              <div className="text-center">
                <span className="text-6xl select-none">🧙‍♂️</span>
                <p className="text-xs font-bold text-purple-200 mt-2 tracking-wide">
                  CHENNAI QUIZ MASTER
                </p>
              </div>
            </div>
          </div>
          <p className="text-center text-sm font-medium text-purple-200/80 mt-6 max-w-xs">
            Test your Chennai knowledge, climb the leaderboards & win daily rewards!
          </p>
        </div>

        <div className="relative z-10 pt-4 opacity-30 flex justify-between items-end border-t border-white/10">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-purple-200">
            <Building2 className="w-4 h-4" /> Chennai Landmark Edition
          </div>
          <span className="text-[10px] text-purple-300 font-mono">v3.0 Powered</span>
        </div>
      </div>

      {/* RIGHT SIDE: FORM CONTAINER */}
      <div className="lg:w-1/2 w-full flex items-center justify-center p-6 lg:p-12 bg-white min-h-screen overflow-y-auto loginheightttt">
        <div className="w-full max-w-[520px] py-4">
          {/* Header */}
          <div className="text-center lg:text-left mb-8">
            <div className="lg:hidden mb-4">
              <h2 className="text-2xl font-black text-[#11145A]">TRIVIA</h2>
              <p className="text-xs font-semibold text-[#5B2EE6]">by Super Chennai</p>
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight ">
              {isForgotPassword ? 'Reset Password' : isRegister ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-sm text-[#74799A] mt-1.5 font-medium">
              {isForgotPassword
                ? 'Verify your mobile number to set a new password'
                : isRegister
                  ? 'Join thousands of quiz fans across Chennai'
                  : 'Enter your phone number to access your quiz dashboard'}
            </p>
          </div>

          {error && (
            <div className="p-4 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="p-4 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              {successMsg}
            </div>
          )}

          {/* FORGOT PASSWORD FORM */}
          {isForgotPassword ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#11145A] mb-1.5 uppercase tracking-wider">
                  Mobile Number
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1 flex items-center">
                    <Smartphone className="w-5 h-5 absolute left-4 text-[#858AA8]" />
                    <input
                      type="tel"
                      required
                      disabled={otpVerified}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full h-14 pl-12 pr-4 rounded-xl border border-[#DFE2EF] bg-white text-slate-900 font-medium placeholder-[#858AA8] focus:border-[#4B20D8] focus:ring-2 focus:ring-[#4B20D8]/10 outline-none transition disabled:bg-slate-100 disabled:text-slate-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp || otpVerified || resendTimer > 0}
                    className="h-14 px-6 bg-[#4B20D8] hover:bg-[#3215A8] text-white font-bold text-xs rounded-xl transition duration-200 disabled:opacity-50 whitespace-nowrap cursor-pointer flex items-center justify-center"
                  >
                    {sendingOtp
                      ? 'Sending...'
                      : otpVerified
                        ? 'Verified ✓'
                        : resendTimer > 0
                          ? `Resend in ${resendTimer}s`
                          : 'Send OTP'}
                  </button>
                </div>
              </div>

              {!otpVerified && generatedOtp && (
                <div>
                  <label className="block text-xs font-bold text-[#11145A] mb-1.5 uppercase tracking-wider">
                    Enter 6-digit OTP
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1 flex items-center">
                      <Key className="w-5 h-5 absolute left-4 text-[#858AA8]" />
                      <input
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="------"
                        className="w-full h-14 pl-12 pr-4 rounded-xl border border-[#DFE2EF] bg-white text-slate-900 font-mono text-center tracking-[0.5em] text-lg font-bold placeholder-[#858AA8] focus:border-[#4B20D8] focus:ring-2 focus:ring-[#4B20D8]/10 outline-none transition"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="h-14 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                    >
                      Verify OTP
                    </button>
                  </div>
                </div>
              )}

              {otpVerified && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-[#11145A] mb-1.5 uppercase tracking-wider">
                      New Password
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="w-5 h-5 absolute left-4 text-[#858AA8]" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-14 pl-12 pr-12 rounded-xl border border-[#DFE2EF] bg-white text-slate-900 font-medium placeholder-[#858AA8] focus:border-[#4B20D8] focus:ring-2 focus:ring-[#4B20D8]/10 outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 text-[#858AA8] hover:text-[#11145A]"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#11145A] mb-1.5 uppercase tracking-wider">
                      Confirm New Password
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="w-5 h-5 absolute left-4 text-[#858AA8]" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-14 pl-12 pr-12 rounded-xl border border-[#DFE2EF] bg-white text-slate-900 font-medium placeholder-[#858AA8] focus:border-[#4B20D8] focus:ring-2 focus:ring-[#4B20D8]/10 outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 text-[#858AA8] hover:text-[#11145A]"
                        aria-label={
                          showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 mt-4 bg-gradient-to-r from-[#4B20D8] to-[#5B2EE6] hover:from-[#3215A8] hover:to-[#4B20D8] text-white font-extrabold text-base rounded-xl shadow-lg shadow-[#4B20D8]/20 transition-all duration-200 cursor-pointer disabled:opacity-60 flex items-center justify-center"
                  >
                    {loading ? 'Updating Password...' : 'Reset Password'}
                  </button>
                </>
              )}

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false)
                    resetFormState()
                  }}
                  className="inline-flex items-center text-xs font-bold text-[#4B20D8] hover:underline cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back to Login
                </button>
              </div>
            </form>
          ) : (
            /* LOGIN / REGISTER FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* TOGGLE METHOD FOR LOGIN */}
              {!isRegister && (
                <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod('password')
                      resetFormState()
                    }}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                      loginMethod === 'password'
                        ? 'bg-white text-[#4B20D8] shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Login with Password
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod('otp')
                      resetFormState()
                    }}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                      loginMethod === 'otp'
                        ? 'bg-white text-[#4B20D8] shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Login with Mobile OTP
                  </button>
                </div>
              )}

              {/* REGISTER FIELD: NAME */}
              {isRegister && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-[#11145A] mb-1.5 uppercase tracking-wider">
                      Full Name
                    </label>
                    <div className="relative flex items-center">
                      <User className="w-5 h-5 absolute left-4 text-[#858AA8]" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full h-14 pl-12 pr-4 rounded-xl border border-[#DFE2EF] bg-white text-slate-900 font-medium placeholder-[#858AA8] focus:border-[#4B20D8] focus:ring-2 focus:ring-[#4B20D8]/10 outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#11145A] mb-1.5 uppercase tracking-wider">
                      Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="w-5 h-5 absolute left-4 text-[#858AA8]" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full h-14 pl-12 pr-4 rounded-xl border border-[#DFE2EF] bg-white text-slate-900 font-medium placeholder-[#858AA8] focus:border-[#4B20D8] focus:ring-2 focus:ring-[#4B20D8]/10 outline-none transition"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* MOBILE NUMBER INPUT */}
              <div>
                <label className="block text-xs font-bold text-[#11145A] mb-1.5 uppercase tracking-wider">
                  Mobile Number
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1 flex items-center">
                    <Smartphone className="w-5 h-5 absolute left-4 text-[#858AA8]" />
                    <input
                      type="tel"
                      required
                      disabled={otpVerified && (isRegister || loginMethod === 'otp')}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full h-14 pl-12 pr-4 rounded-xl border border-[#DFE2EF] bg-white text-slate-900 font-medium placeholder-[#858AA8] focus:border-[#4B20D8] focus:ring-2 focus:ring-[#4B20D8]/10 outline-none transition disabled:bg-slate-100 disabled:text-slate-500"
                    />
                  </div>

                  {(isRegister || loginMethod === 'otp') && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={sendingOtp || otpVerified || resendTimer > 0}
                      className="h-14 px-6 bg-[#4B20D8] hover:bg-[#3215A8] text-white font-bold text-xs rounded-xl transition duration-200 disabled:opacity-50 whitespace-nowrap cursor-pointer flex items-center justify-center"
                    >
                      {sendingOtp
                        ? 'Sending...'
                        : otpVerified
                          ? 'Verified ✓'
                          : resendTimer > 0
                            ? `Resend in ${resendTimer}s`
                            : 'Send OTP'}
                    </button>
                  )}
                </div>
              </div>

              {/* OTP VERIFICATION SECTION */}
              {(isRegister || loginMethod === 'otp') && !otpVerified && generatedOtp && (
                <div>
                  <label className="block text-xs font-bold text-[#11145A] mb-1.5 uppercase tracking-wider">
                    Enter 6-digit OTP
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1 flex items-center">
                      <Key className="w-5 h-5 absolute left-4 text-[#858AA8]" />
                      <input
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="------"
                        className="w-full h-14 pl-12 pr-4 rounded-xl border border-[#DFE2EF] bg-white text-slate-900 font-mono text-center tracking-[0.5em] text-lg font-bold placeholder-[#858AA8] focus:border-[#4B20D8] focus:ring-2 focus:ring-[#4B20D8]/10 outline-none transition"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="h-14 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                    >
                      Verify OTP
                    </button>
                  </div>
                </div>
              )}

              {/* PASSWORD FIELD (If Registering OR Login with Password) */}
              {(isRegister || loginMethod === 'password') && (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold text-[#11145A] uppercase tracking-wider">
                      Password
                    </label>
                    {!isRegister && loginMethod === 'password' && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(true)
                          resetFormState()
                        }}
                        className="text-xs font-bold text-[#4B20D8] hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="w-5 h-5 absolute left-4 text-[#858AA8]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-14 pl-12 pr-12 rounded-xl border border-[#DFE2EF] bg-white text-slate-900 font-medium placeholder-[#858AA8] focus:border-[#4B20D8] focus:ring-2 focus:ring-[#4B20D8]/10 outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 text-[#858AA8] hover:text-[#11145A]"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* CONFIRM PASSWORD FIELD (Register Only) */}
              {isRegister && (
                <div>
                  <label className="block text-xs font-bold text-[#11145A] mb-1.5 uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="w-5 h-5 absolute left-4 text-[#858AA8]" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-14 pl-12 pr-12 rounded-xl border border-[#DFE2EF] bg-white text-slate-900 font-medium placeholder-[#858AA8] focus:border-[#4B20D8] focus:ring-2 focus:ring-[#4B20D8]/10 outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 text-[#858AA8] hover:text-[#11145A]"
                      aria-label={
                        showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* TERMS & CONDITIONS CHECKBOX */}
              {isRegister && (
                <div className="flex items-start gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#4B20D8] border-[#DFE2EF] rounded focus:ring-[#4B20D8]"
                  />
                  <label htmlFor="terms" className="text-xs text-[#74799A] leading-relaxed">
                    I agree to the{' '}
                    <a href="/terms" className="text-[#4B20D8] font-bold hover:underline">
                      Terms & Conditions
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-[#4B20D8] font-bold hover:underline">
                      Privacy Policy
                    </a>
                    .
                  </label>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 mt-4 bg-gradient-to-r from-[#4B20D8] to-[#5B2EE6] hover:from-[#3215A8] hover:to-[#4B20D8] text-white font-extrabold text-base rounded-xl shadow-lg shadow-[#4B20D8]/20 transition-all duration-200 cursor-pointer disabled:opacity-60 flex items-center justify-center"
              >
                {loading
                  ? isRegister
                    ? 'Creating Account...'
                    : 'Logging in...'
                  : isRegister
                    ? 'Sign Up'
                    : 'Login'}
              </button>
            </form>
          )}

          {/* TOGGLE LOGIN / REGISTER */}
          {!isForgotPassword && (
            <div className="mt-8 text-center">
              <p className="text-sm font-medium text-[#74799A]">
                {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(!isRegister)
                    resetFormState()
                  }}
                  className="text-[#4B20D8] font-bold hover:underline cursor-pointer ml-1"
                >
                  {isRegister ? 'Login' : 'Sign Up'}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
