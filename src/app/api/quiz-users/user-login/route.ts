import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { clearPhoneVerified, isPhoneVerified } from '@/utilities/otpSession'
import { issuePlayerToken, setPlayerCookie } from '@/utilities/playerSession'

// Sign up: creates the player and logs them straight in (one OTP instead of two)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, phone, message } = body
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''

    if (!phone || !name || !email) {
      return NextResponse.json(
        { message: 'Name, email and mobile number are required' },
        { status: 400 }
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: 'Please enter a valid email address' }, { status: 400 })
    }

    if (!isPhoneVerified(req, phone)) {
      return NextResponse.json(
        { message: 'Please verify your mobile number with OTP first.' },
        { status: 401 }
      )
    }

    const payload = await getPayload({ config: configPromise })

    // Check if phone already registered
    const existing = await payload.find({
      collection: 'quiz-users',
      where: {
        phone: { equals: phone },
      },
      overrideAccess: true,
    })

    if (existing.docs.length > 0) {
      return NextResponse.json(
        { message: 'Mobile number already registered. Please log in.' },
        { status: 400 }
      )
    }

    // Create user without password
    const newUser = await payload.create({
      collection: 'quiz-users',
      data: {
        name,
        phone,
        email,
        message: message?.trim() || undefined,
      },
    })

    const token = await issuePlayerToken(payload, newUser)

    const response = NextResponse.json({
      message: 'Account created successfully',
      doc: newUser,
      user: newUser,
      token,
    })
    setPlayerCookie(response, token)
    clearPhoneVerified(response)

    return response
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to create user' },
      { status: 500 }
    )
  }
}
