import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, phone, email, message } = body 

    if (!phone || !name) {
      return NextResponse.json(
        { message: 'Name and Phone number are required' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config: configPromise })

    // Check if phone already registered
    const existing = await payload.find({
      collection: 'quiz-users',
      where: {
        phone: { equals: phone },
      },
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
        email: email || undefined,
        message: message?.trim() || undefined,
      },
    })

    return NextResponse.json({
      message: 'Account created successfully',
      doc: newUser,
    })
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to create user' },
      { status: 500 }
    )
  }
}