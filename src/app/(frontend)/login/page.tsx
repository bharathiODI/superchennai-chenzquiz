
'use client'

import axios from 'axios'
import {
  Building2,
  ChevronDown,
  Eye,
  EyeOff,
  Key,
  Lightbulb,
  Lock,
  Mail,
  Smartphone,
  User
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('+91')
  const [agreeTerms, setAgreeTerms] = useState(false)

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

  // 1. Token irundha /quizzes page-ku redirect pannum
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      router.replace('/quizzes')
    } else {
      setCheckingAuth(false)
    }
  }, [router])

  // 2. Auth check mudiyura varaikum screen flicker aagama irukka indha loading UI
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

  // 1. Send OTP Function
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

  // 2. Verify OTP Function
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

  // 3. Form Submission (Login or Register)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

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
    }

    setLoading(true)

    const endpoint = isRegister ? '/api/quiz-users' : '/api/quiz-users/login'
    const body = isRegister
      ? { name, email, password, phone: `${countryCode}${phone}` }
      : { email, password }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (!res.ok)
        throw new Error(data.errors?.[0]?.message || data.message || 'Authentication failed')

      const token = data.token
      const user = data.user || data.doc

      if (token) {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        router.push('/quizzes')
      } else if (isRegister) {
        setIsRegister(false)
        setOtpVerified(false)
        setOtp('')
        setPassword('')
        setConfirmPassword('')
        setSuccessMsg('Account created successfully! Please log in.')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Handle Social Login Placeholders
  const handleSocialLogin = (provider: string) => {
    alert(`${provider} login will be configured soon.`)
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white text-slate-900 font-sans">
      {/* ========================================================= */}
      {/* LEFT SIDE: BRAND PANEL (Visible desktop & scaled mobile) */}
      {/* ========================================================= */}
      <div className="relative lg:w-1/2 w-full bg-gradient-to-br from-[#4B20D8] via-[#3215A8] to-[#17145C] min-h-[220px] lg:min-h-screen flex flex-col justify-between p-8 lg:p-12 overflow-hidden text-white">
        {/* Layered Organic Background Shapes */}
        <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-[#5A2BE2]/30 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-20 w-96 h-96 rounded-full bg-[#4B20D8]/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-10 w-96 h-96 rounded-full bg-[#17145C]/60 blur-2xl pointer-events-none" />

        {/* Top Branding Section */}
        <div className="relative z-10">
          <div className="inline-block">
            <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-none text-white drop-shadow-md">
              TRIVIA
            </h1>
            <p className="text-sm lg:text-base font-semibold text-purple-200 tracking-wider mt-1 opacity-90">
              by Super Chennai
            </p>
          </div>
        </div>

        {/* Middle Mascot / Character Graphic */}
        <div className="relative z-10 hidden lg:flex flex-col items-center justify-center my-auto py-8">
          <div className="relative w-64 h-64 bg-gradient-to-tr from-purple-600/40 to-indigo-400/20 rounded-full p-6 border border-white/10 flex items-center justify-center backdrop-blur-md shadow-2xl">
            {/* Glowing Lightbulb representing Trivia Knowledge */}
            <div className="absolute -top-4 right-12 bg-amber-400 p-3 rounded-full shadow-lg shadow-amber-400/50 animate-bounce">
              <Lightbulb className="w-8 h-8 text-slate-950 fill-amber-300" />
            </div>

            {/* Custom Trivia Character Avatar Badge */}
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

        {/* Bottom Chennai Skyline Line-Art Illustration */}
        <div className="relative z-10 pt-4 opacity-30 flex justify-between items-end border-t border-white/10">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-purple-200">
            <Building2 className="w-4 h-4" /> Chennai Landmark Edition
          </div>
          <span className="text-[10px] text-purple-300 font-mono">v3.0 Powered</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT SIDE: FORM CONTAINER                                */}
      {/* ========================================================= */}
      <div className="lg:w-1/2 w-full flex items-center justify-center p-6 lg:p-12 bg-white min-h-screen overflow-y-auto">
        <div className="w-full max-w-[520px] py-4">
          {/* Header Mobile Brand & Page Title */}
          <div className="text-center lg:text-left mb-8">
            <div className="lg:hidden mb-4">
              <h2 className="text-2xl font-black text-[#11145A]">TRIVIA</h2>
              <p className="text-xs font-semibold text-[#5B2EE6]">by Super Chennai</p>
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#11145A] tracking-tight">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-sm text-[#74799A] mt-1.5 font-medium">
              {isRegister
                ? 'Join thousands of quiz fans across Chennai'
                : 'Enter your credentials to access your quiz dashboard'}
            </p>
          </div>

          {/* Social Sign Up Options */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              className="h-14 rounded-2xl border border-[#DFE2EF] hover:border-[#4B20D8] bg-white flex items-center justify-center transition-all hover:shadow-md cursor-pointer group"
              aria-label="Sign up with Google"
            >
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('Facebook')}
              className="h-14 rounded-2xl border border-[#DFE2EF] hover:border-[#4B20D8] bg-white flex items-center justify-center transition-all hover:shadow-md cursor-pointer group"
              aria-label="Sign up with Facebook"
            >
              <svg
                className="w-5 h-5 fill-[#1877F2] group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('LinkedIn')}
              className="h-14 rounded-2xl border border-[#DFE2EF] hover:border-[#4B20D8] bg-white flex items-center justify-center transition-all hover:shadow-md cursor-pointer group"
              aria-label="Sign up with LinkedIn"
            >
              <svg
                className="w-5 h-5 fill-[#0A66C2] group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
              >
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.72a1.47 1.47 0 1 0 0 2.94 1.47 1.47 0 0 0 0-2.94Z" />
              </svg>
            </button>
          </div>

          {/* OR Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="border-t border-[#DFE2EF] w-full" />
            <span className="bg-white px-4 text-xs font-bold text-[#858AA8] uppercase tracking-wider absolute">
              OR
            </span>
          </div>

          {/* Alert Error / Success Banners */}
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

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                {/* Full Name */}
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

                {/* Mobile Number + Send OTP Row */}
                <div>
                  <label className="block text-xs font-bold text-[#11145A] mb-1.5 uppercase tracking-wider">
                    Mobile Number
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex items-center">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="h-14 pl-3 pr-8 rounded-xl border border-[#DFE2EF] bg-slate-50 text-slate-800 font-bold text-sm appearance-none outline-none focus:border-[#4B20D8]"
                      >
                        <option value="+91">+91 (IN)</option>
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-2 text-slate-500 pointer-events-none" />
                    </div>

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

                {/* OTP Verification Input */}
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
              </>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-[#11145A] mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-5 h-5 absolute left-4 text-[#858AA8]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-14 pl-12 pr-4 rounded-xl border border-[#DFE2EF] bg-white text-slate-900 font-medium placeholder-[#858AA8] focus:border-[#4B20D8] focus:ring-2 focus:ring-[#4B20D8]/10 outline-none transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-[#11145A] mb-1.5 uppercase tracking-wider">
                Password
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
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field (Register Only) */}
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

            {/* Terms & Conditions Checkbox */}
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
                  <Link href="/terms" className="text-[#4B20D8] font-bold hover:underline">
                    Terms & Conditions
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-[#4B20D8] font-bold hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>
            )}

            {/* Submit Action Button */}
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

          {/* Toggle Login/Register Link */}
          <div className="mt-8 text-center">
            <p className="text-sm font-medium text-[#74799A]">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister)
                  setError('')
                  setSuccessMsg('')
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
