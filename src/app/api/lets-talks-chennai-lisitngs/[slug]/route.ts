import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params

    const payload = await getPayload({
      config,
    })

    const event = await payload.find({
      collection: 'lets-talks-chennai',
      where: {
        slug: {
          equals: slug,
        },
      },
      depth: 3,
      limit: 1,
    })

    return NextResponse.json({
      success: true,
      doc: event.docs?.[0] || null,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      },
    )
  }
}
