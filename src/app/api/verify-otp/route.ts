import { NextRequest, NextResponse } from 'next/server'
import { checkOtp, isValidMobile, markPhoneVerified } from '@/utilities/otpSession'

export async function POST(req: NextRequest) {
  try {
    const { mobile, otp } = (await req.json()) ?? {}

    if (!isValidMobile(mobile)) {
      return NextResponse.json(
        { success: false, message: 'Enter a valid 10-digit mobile number' },
        { status: 400 },
      )
    }
    if (typeof otp !== 'string' || !/^\d{6}$/.test(otp.trim())) {
      return NextResponse.json({ success: false, message: 'Enter the 6-digit OTP.' }, { status: 400 })
    }

    const result = checkOtp(req, mobile, otp.trim())
    if (!result.ok) {
      return NextResponse.json({ success: false, message: result.message }, { status: result.status })
    }

    const res = NextResponse.json({ success: true, message: 'Mobile number verified successfully!' })
    markPhoneVerified(res, mobile)
    return res
  } catch (error) {
    console.error('verify-otp failed:', error)
    return NextResponse.json({ success: false, message: 'Could not verify OTP' }, { status: 500 })
  }
}
