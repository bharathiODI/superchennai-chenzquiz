// /* eslint-disable @next/next/no-html-link-for-pages */
// 'use client'
// import axios from 'axios'
// import { Building2, Key, Lightbulb, Mail, Smartphone, User, MessageSquare } from 'lucide-react'
// import { useRouter } from 'next/navigation'
// import { useEffect, useState } from 'react'

// export default function LoginPage() {
//   const [isRegister, setIsRegister] = useState(false)
//   const [checkingAuth, setCheckingAuth] = useState(true)
//   const [phone, setPhone] = useState('')
//   const [email, setEmail] = useState('')
//   const [message, setMessage] = useState('')
//   const [countryCode] = useState('+91')
//   const [name, setName] = useState('')
//   const [agreeTerms, setAgreeTerms] = useState(false)
//   const [otp, setOtp] = useState('')
//   const [generatedOtp, setGeneratedOtp] = useState('')
//   const [sendingOtp, setSendingOtp] = useState(false)
//   const [otpVerified, setOtpVerified] = useState(false)
//   const [resendTimer, setResendTimer] = useState(0)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
//   const [successMsg, setSuccessMsg] = useState('')
//   const router = useRouter()

//   useEffect(() => {
//     let interval: NodeJS.Timeout
//     if (resendTimer > 0) {
//       interval = setInterval(() => {
//         setResendTimer((prev) => prev - 1)
//       }, 1000)
//     }
//     return () => clearInterval(interval)
//   }, [resendTimer])

//   useEffect(() => {
//     const token = localStorage.getItem('token')
//     if (token) {
//       router.replace('/quizzes')
//     } else {
//       setCheckingAuth(false)
//     }
//   }, [router])

//   const resetFormState = () => {
//     setError('')
//     setSuccessMsg('')
//     setOtp('')
//     setGeneratedOtp('')
//     setOtpVerified(false)
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

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')
//     setSuccessMsg('')

//     const formattedPhone = `${countryCode}${phone}`

//     if (!otpVerified) {
//       setError('Please verify your mobile number with OTP first.')
//       return
//     }

//     if (isRegister && !agreeTerms) {
//       setError('You must agree to the Terms & Conditions to create an account.')
//       return
//     }

//     setLoading(true)

//     const endpoint = isRegister ? '/api/quiz-users/user-login' : '/api/quiz-users/login-otp'
//     const body = isRegister
//       ? {
//           name,
//           phone: formattedPhone,
//           username: formattedPhone,
//           email: email.trim() || undefined,
//           message: message.trim() || undefined,
//         }
//       : {
//           phone: formattedPhone,
//           otp: otp,
//         }

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
//         setSuccessMsg('Account created successfully! Please log in with OTP.')
//       }
//     } catch (err: any) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white text-slate-900 font-sans">
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

//       <div className="lg:w-1/2 w-full flex items-center justify-center p-6 lg:p-12 bg-white min-h-screen overflow-y-auto">
//         <div className="w-full max-w-[520px] py-4">
//           <div className="text-center lg:text-left mb-8">
//             <div className="lg:hidden mb-4">
//               <h2 className="text-2xl font-black text-[#000]">TRIVIA</h2>
//               <p className="text-xs font-semibold text-[#5B2EE6]">by Super Chennai</p>
//             </div>
//             <h2 className="text-3xl lg:text-4xl font-extrabold text-[#000] tracking-tight">
//               {isRegister ? 'Create Account' : 'Welcome Back'}
//             </h2>
//             <p className="text-sm text-[#74799A] mt-1.5 font-medium">
//               {isRegister
//                 ? 'Join thousands of quiz fans across Chennai'
//                 : 'Enter your mobile number to get OTP and access your dashboard'}
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

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {isRegister && (
//               <>
//                 <div>
//                   <label className="block text-xs font-bold text-[#000] mb-1.5 uppercase tracking-wider">
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

//                 <div>
//                   <label className="block text-xs font-bold text-[#000] mb-1.5 uppercase tracking-wider">
//                     Email Address <span className="text-slate-400 font-normal">(Optional)</span>
//                   </label>
//                   <div className="relative flex items-center">
//                     <Mail className="w-5 h-5 absolute left-4 text-[#858AA8]" />
//                     <input
//                       type="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       placeholder="name@example.com"
//                       className="w-full h-14 pl-12 pr-4 rounded-xl border border-[#DFE2EF] bg-white text-slate-900 font-medium placeholder-[#858AA8] focus:border-[#4B20D8] focus:ring-2 focus:ring-[#4B20D8]/10 outline-none transition"
//                     />
//                   </div>
//                 </div>
//               </>
//             )}

//             <div>
//               <label className="block text-xs font-bold text-[#000] mb-1.5 uppercase tracking-wider">
//                 Message <span className="text-slate-400 font-normal">(Optional)</span>
//               </label>
//               <div className="relative flex items-start">
//                 <MessageSquare className="w-5 h-5 absolute left-4 top-4 text-[#858AA8]" />
//                 <textarea
//                   rows={3}
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   placeholder="Write your note or message here..."
//                   className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#DFE2EF] bg-white text-slate-900 font-medium placeholder-[#858AA8] focus:border-[#4B20D8] focus:ring-2 focus:ring-[#4B20D8]/10 outline-none transition resize-none"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-xs font-bold text-[#000] mb-1.5 uppercase tracking-wider">
//                 Mobile Number
//               </label>
//               <div className="flex gap-2">
//                 <div className="relative flex-1 flex items-center">
//                   <Smartphone className="w-5 h-5 absolute left-4 text-[#858AA8]" />
//                   <input
//                     type="tel"
//                     required
//                     disabled={otpVerified}
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value)}
//                     placeholder="10-digit mobile number"
//                     className="w-full h-14 pl-12 pr-4 rounded-xl border border-[#DFE2EF] bg-white text-slate-900 font-medium placeholder-[#858AA8] focus:border-[#4B20D8] focus:ring-2 focus:ring-[#4B20D8]/10 outline-none transition disabled:bg-slate-100 disabled:text-slate-500"
//                   />
//                 </div>

//                 <button
//                   type="button"
//                   onClick={handleSendOtp}
//                   disabled={sendingOtp || otpVerified || resendTimer > 0}
//                   className="h-14 px-6 bg-[#4B20D8] hover:bg-[#3215A8] text-white font-bold text-xs rounded-xl transition duration-200 disabled:opacity-50 whitespace-nowrap cursor-pointer flex items-center justify-center"
//                 >
//                   {sendingOtp
//                     ? 'Sending...'
//                     : otpVerified
//                       ? 'Verified ✓'
//                       : resendTimer > 0
//                         ? `Resend in ${resendTimer}s`
//                         : 'Send OTP'}
//                 </button>
//               </div>
//             </div>

//             {!otpVerified && generatedOtp && (
//               <div>
//                 <label className="block text-xs font-bold text-[#000] mb-1.5 uppercase tracking-wider">
//                   Enter 6-digit OTP
//                 </label>
//                 <div className="flex gap-2">
//                   <div className="relative flex-1 flex items-center">
//                     <Key className="w-5 h-5 absolute left-4 text-[#858AA8]" />
//                     <input
//                       type="text"
//                       maxLength={6}
//                       value={otp}
//                       onChange={(e) => setOtp(e.target.value)}
//                       placeholder="------"
//                       className="w-full h-14 pl-12 pr-4 rounded-xl border border-[#DFE2EF] bg-white text-slate-900 font-mono text-center tracking-[0.5em] text-lg font-bold placeholder-[#858AA8] focus:border-[#4B20D8] focus:ring-2 focus:ring-[#4B20D8]/10 outline-none transition"
//                     />
//                   </div>
//                   <button
//                     type="button"
//                     onClick={handleVerifyOtp}
//                     className="h-14 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
//                   >
//                     Verify OTP
//                   </button>
//                 </div>
//               </div>
//             )}

//             {isRegister && (
//               <div className="flex items-start gap-3 pt-2">
//                 <input
//                   type="checkbox"
//                   id="terms"
//                   checked={agreeTerms}
//                   onChange={(e) => setAgreeTerms(e.target.checked)}
//                   className="mt-1 w-4 h-4 text-[#4B20D8] border-[#DFE2EF] rounded focus:ring-[#4B20D8]"
//                 />
//                 <label htmlFor="terms" className="text-xs text-[#74799A] leading-relaxed">
//                   I agree to the{' '}
//                   <a href="/terms" className="text-[#4B20D8] font-bold hover:underline">
//                     Terms & Conditions
//                   </a>{' '}
//                   and{' '}
//                   <a href="/privacy" className="text-[#4B20D8] font-bold hover:underline">
//                     Privacy Policy
//                   </a>
//                   .
//                 </label>
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={loading || !otpVerified}
//               className="w-full h-14 mt-4 bg-gradient-to-r from-[#4B20D8] to-[#5B2EE6] hover:from-[#3215A8] hover:to-[#4B20D8] text-white font-extrabold text-base rounded-xl shadow-lg shadow-[#4B20D8]/20 transition-all duration-200 cursor-pointer disabled:opacity-60 flex items-center justify-center"
//             >
//               {loading
//                 ? isRegister
//                   ? 'Creating Account...'
//                   : 'Logging in...'
//                 : isRegister
//                   ? 'Sign Up'
//                   : 'Login with OTP'}
//             </button>
//           </form>

//           <div className="mt-8 text-center">
//             <p className="text-sm font-medium text-[#74799A]">
//               {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
//               <button
//                 type="button"
//                 onClick={() => {
//                   setIsRegister(!isRegister)
//                   resetFormState()
//                 }}
//                 className="text-[#4B20D8] font-bold hover:underline cursor-pointer ml-1"
//               >
//                 {isRegister ? 'Login' : 'Sign Up'}
//               </button>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
/* eslint-disable @next/next/no-html-link-for-pages */
'use client'
import axios from 'axios'
import { Building2, Key, Lightbulb, Mail, MessageSquare, Smartphone, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('') // 👈 புது State
  const [countryCode] = useState('+91')
  const [name, setName] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [otp, setOtp] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [sendingOtp, setSendingOtp] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const router = useRouter()

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      router.replace('/quizzes')
    } else {
      setCheckingAuth(false)
    }
  }, [router])

  const resetFormState = () => {
    setError('')
    setSuccessMsg('')
    setOtp('')
    setGeneratedOtp('')
    setOtpVerified(false)
    setMessage('')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    const formattedPhone = `${countryCode}${phone}`

    if (!otpVerified) {
      setError('Please verify your mobile number with OTP first.')
      return
    }

    if (isRegister && !agreeTerms) {
      setError('You must agree to the Terms & Conditions to create an account.')
      return
    }

    setLoading(true)

    const endpoint = isRegister ? '/api/quiz-users/user-login' : '/api/quiz-users/login-otp'
    const body = isRegister
      ? {
          name,
          phone: formattedPhone,
          username: formattedPhone,
          email: email.trim() || undefined,
          message: message.trim() || undefined, // 👈 payload அனுப்பப்படுகிறது
        }
      : {
          phone: formattedPhone,
          otp: otp,
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
        setSuccessMsg('Account created successfully! Please log in with OTP.')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white text-slate-900 font-sans loginheightttt1">
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
                <span className="text-6xl select-none">🧙‍♂️️</span>
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

      <div className="lg:w-1/2 w-full flex items-center justify-center p-6 lg:p-12 bg-white min-h-screen overflow-y-auto loginheightttt">
        <div className="w-full max-w-[520px] py-4">
          <div className="text-center lg:text-left mb-8">
            <div className="lg:hidden mb-4">
              <h2 className="text-2xl font-black text-[#000]">TRIVIA</h2>
              <p className="text-xs font-semibold text-[#5B2EE6]">by Super Chennai</p>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#03045e] via-[#7000ff] to-[#ff007a]">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-sm text-[#74799A] mt-1.5 font-medium">
              {isRegister
                ? 'Join thousands of quiz fans across Chennai'
                : 'Enter your mobile number to get OTP and access your dashboard'}
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label className="block text-xs font-bold text-[#000] mb-1.5 uppercase tracking-wider">
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
                  <label className="block text-xs font-bold text-[#000] mb-1.5 uppercase tracking-wider">
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

                {/* 👈 புது Textarea Message Input */}
                <div>
                  <label className="block text-xs font-bold text-[#000] mb-1.5 uppercase tracking-wider">
                    Message <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative flex items-start">
                    <MessageSquare className="w-5 h-5 absolute left-4 top-4 text-[#858AA8]" />
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your note or message here..."
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#DFE2EF] bg-white text-slate-900 font-medium placeholder-[#858AA8] focus:border-[#4B20D8] focus:ring-2 focus:ring-[#4B20D8]/10 outline-none transition resize-none"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-[#000] mb-1.5 uppercase tracking-wider">
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
                <label className="block text-xs font-bold text-[#000] mb-1.5 uppercase tracking-wider">
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

            <button
              type="submit"
              disabled={loading || !otpVerified}
              className="w-full h-14 mt-4 bg-gradient-to-r from-[#4B20D8] to-[#5B2EE6] hover:from-[#3215A8] hover:to-[#4B20D8] text-white font-extrabold text-base rounded-xl shadow-lg shadow-[#4B20D8]/20 transition-all duration-200 cursor-pointer disabled:opacity-60 flex items-center justify-center"
            >
              {loading
                ? isRegister
                  ? 'Creating Account...'
                  : 'Logging in...'
                : isRegister
                  ? 'Sign Up'
                  : 'Login with OTP'}
            </button>
          </form>

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
        </div>
      </div>
    </div>
  )
}
