import { PayloadRequest } from 'payload'

export const verifyOTP = async (req: PayloadRequest): Promise<Response> => {
  const body = req.body as {
    userId?: string
    otp?: string
  }

  const { userId, otp } = body

  if (!userId || !otp) {
    return new Response(
      JSON.stringify({ message: 'userId and otp required' }),
      { status: 400 }
    )
  }

  const user = await req.payload.findByID({
    collection: 'users',
    id: userId,
  })

  if (!user) {
    return new Response(
      JSON.stringify({ message: 'User not found' }),
      { status: 404 }
    )
  }

  if (!user.otp || user.otp !== otp) {
    return new Response(
      JSON.stringify({ message: 'Invalid OTP' }),
      { status: 400 }
    )
  }

  if (!user.otpExpires) {
    return new Response(
      JSON.stringify({ message: 'OTP expired' }),
      { status: 400 }
    )
  }

  if (new Date(user.otpExpires).getTime() < Date.now()) {
    return new Response(
      JSON.stringify({ message: 'OTP expired' }),
      { status: 400 }
    )
  }

  await req.payload.update({
    collection: 'users',
    id: userId,
    data: {
      phoneVerified: true,
      otp: null,
      otpExpires: null,
    },
  })

  return new Response(
    JSON.stringify({ message: 'Phone verified successfully' }),
    { status: 200 }
  )
}
