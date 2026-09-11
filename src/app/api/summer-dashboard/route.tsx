import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({
      config,
    })
    const registrations = await payload.find({
      collection: 'summer-registrations',
      limit: 1000,
      depth: 3,
    })
    return NextResponse.json({
      success: true,
      docs: registrations.docs,
      totalDocs: registrations.totalDocs,
    })
  } catch (error: any) {
    console.log('SUMMER DASHBOARD ERROR:', error)

    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Something went wrong',
      },
      {
        status: 500,
      },
    )
  }
}
