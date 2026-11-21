import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { clearPhoneVerified, isPhoneVerified } from '@/utilities/otpSession'
import { issuePlayerToken, setPlayerCookie } from '@/utilities/playerSession'

export async function POST(req: NextRequest) {
  try {
    const { phone } = (await req.json()) ?? {}

    if (!phone) {
      return NextResponse.json({ message: 'Mobile number is required' }, { status: 400 })
    }

    // The OTP was checked by /api/verify-otp, which set a signed cookie for this number
    if (!isPhoneVerified(req, phone)) {
      return NextResponse.json(
        { message: 'Please verify your mobile number with OTP first.' },
        { status: 401 },
      )
    }

    const payload = await getPayload({ config: configPromise })

    const userResult = await payload.find({
      collection: 'quiz-users',
      where: {
        phone: {
          equals: phone,
        },
      },
      overrideAccess: true,
    })

    const user = userResult.docs[0]

    if (!user) {
      return NextResponse.json(
        { message: 'No account found with this mobile number. Please sign up first!' },
        { status: 404 },
      )
    }

    const token = await issuePlayerToken(payload, user)

    const response = NextResponse.json({
      message: 'Login successful',
      token,
      user,
    })
    setPlayerCookie(response, token)
    clearPhoneVerified(response)

    return response
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'OTP Authentication failed' },
      { status: 500 },
    )
  }
}
