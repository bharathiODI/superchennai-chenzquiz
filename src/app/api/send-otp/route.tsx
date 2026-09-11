import { NextRequest, NextResponse } from 'next/server'
import { sendOtp } from '@/utilities/sms/sendOtp'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { mobile, otp } = body

    if (!mobile) {
      return NextResponse.json(
        {
          success: false,
          message: 'Mobile number required',
        },
        {
          status: 400,
        },
      )
    }

    await sendOtp({
      mobile,
      otp,
    })

    return NextResponse.json({
      success: true,
      message: 'OTP Sent Successfully',
    })
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to send OTP',
      },
      {
        status: 500,
      },
    )
  }
}
