import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import { SignJWT } from 'jose'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { phone, otp, generatedOtp } = body

    if (!phone) {
      return NextResponse.json({ message: 'Mobile number is required' }, { status: 400 })
    }

    if (!otp) {
      return NextResponse.json({ message: 'Please enter the OTP' }, { status: 400 })
    }

    if (generatedOtp && otp !== generatedOtp) {
      return NextResponse.json(
        { message: 'Invalid OTP. Please enter the correct code.' },
        { status: 400 },
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

    // 1. Generate Auth JWT Token
    const secretKey = new TextEncoder().encode(payload.secret)

    const token = await new SignJWT({
      id: user.id,
      collection: 'quiz-users',
      email: (user as any).email || (user as any).phone,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('30d')
      .sign(secretKey)

    // 2. Prepare Response
    const response = NextResponse.json({
      message: 'Login successful',
      token,
      user,
    })

    // 3. Set Cookie for Server-Side Payload Auth (30 Days = 2592000 seconds)
    response.cookies.set('payload-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 2592000, // 30 days
    })

    return response
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'OTP Authentication failed' },
      { status: 500 },
    )
  }
}
