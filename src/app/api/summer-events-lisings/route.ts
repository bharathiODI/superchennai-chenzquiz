import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({
      config,
    })

    const events = await payload.find({
      collection: 'lets-talks-chennai',
      depth: 2,
      pagination: false,
      sort: '-createdAt',
    })

    return NextResponse.json({
      success: true,
      docs: events.docs,
    })
  } catch (error: any) {
    console.log(error)

    return NextResponse.json(
      {
        success: false,
        message: error?.message,
      },
      {
        status: 500,
      },
    )
  }
}
