import { NextRequest, NextResponse } from 'next/server'
import { sendOtp } from '@/utilities/sms/sendOtp'
import {
  generateOtp,
  isValidMobile,
  resendWaitSeconds,
  startOtpChallenge,
} from '@/utilities/otpSession'
import { getTestOtp, isTestPhone } from '@/utilities/testPlayers'
import { getQuizSiteSettings } from '@/globals/QuizSiteSettings/getQuizSiteSettings'
import { readSiteFlags } from '@/utilities/siteFlags'

export async function POST(req: NextRequest) {
  try {
    const flags = readSiteFlags()
    if (flags.maintenance) {
      return NextResponse.json({ success: false, maintenance: true, message: flags.message }, { status: 503 })
    }

    const body = await req.json()
    const { mobile, otp } = body ?? {}

    if (!mobile) {
      return NextResponse.json(
        { success: false, message: 'Mobile number required' },
        { status: 400 },
      )
    }

    // Older forms (event registration) still generate their own code; they never log anyone in.
    if (otp !== undefined) {
      if (!/^\d{4,8}$/.test(String(otp))) {
        return NextResponse.json({ success: false, message: 'Invalid OTP format' }, { status: 400 })
      }
      await sendOtp({ mobile, otp: String(otp) })
      return NextResponse.json({ success: true, message: 'OTP Sent Successfully' })
    }

    // Quiz login / sign up: the code is created and checked on the server.
    if (!isValidMobile(mobile)) {
      return NextResponse.json(
        { success: false, message: 'Enter a valid 10-digit mobile number' },
        { status: 400 },
      )
    }

    const wait = resendWaitSeconds(mobile)
    if (wait > 0) {
      return NextResponse.json(
        { success: false, message: `Please wait ${wait}s before requesting another OTP.`, retryAfter: wait },
        { status: 429 },
      )
    }

    let code: string
    if (isTestPhone(mobile)) {
      // Needs TEST_OTP in the server .env AND "Allow test player logins" ticked in the CMS
      const testOtp = getTestOtp()
      const { testPlayers } = await getQuizSiteSettings()
      if (!testOtp || !testPlayers.allowTestLogins) {
        return NextResponse.json(
          { success: false, message: 'Test logins are switched off.' },
          { status: 403 },
        )
      }
      code = testOtp
    } else {
      code = generateOtp()
      await sendOtp({ mobile, otp: code })
    }

    const res = NextResponse.json({
      success: true,
      message: 'OTP sent successfully to your mobile number!',
    })
    startOtpChallenge(res, mobile, code)
    return res
  } catch (error) {
    console.error('send-otp failed:', error)
    return NextResponse.json({ success: false, message: 'Failed to send OTP' }, { status: 500 })
  }
}
