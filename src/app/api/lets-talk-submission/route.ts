import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const payload = await getPayload({ config: configPromise })

    const categoryType = (formData.get('categoryType') as string) || 'general'
    const title = (formData.get('title') as string) || 'Let’s Talk Entry'
    const userName = (formData.get('userName') as string) || 'Anonymous'
    const userEmail = (formData.get('userEmail') as string) || 'no-email@provided.com'
    const userPhone = (formData.get('userPhone') as string) || ''
    const valuesString = formData.get('values') as string

    let parsedValues = {}
    if (valuesString) {
      try {
        parsedValues = JSON.parse(valuesString)
      } catch (e) {
        console.error('Failed to parse JSON values:', e)
      }
    }

    // Process File Uploads into Payload Media collection
    const uploadedAttachments: { file: string; fieldName: string }[] = []

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        const fileBuffer = Buffer.from(await value.arrayBuffer())

        const mediaDoc = await payload.create({
          collection: 'media',
          data: {
            alt: `Attachment for ${title} - ${key}`,
          },
          file: {
            data: fileBuffer,
            name: value.name,
            mimetype: value.type,
            size: value.size,
          },
        })

        if (mediaDoc?.id) {
          uploadedAttachments.push({
            file: String(mediaDoc.id),
            fieldName: key,
          })
        }
      }
    }

    // Save Submission in lets-talk-submissions Collection
    const newSubmission = await payload.create({
     collection: 'lets-talk-submissions' as any,
      data: {
        title,
        categoryType: categoryType as any,
        userName,
        userEmail,
        userPhone,
        status: 'pending',
        values: parsedValues,
        attachments: uploadedAttachments,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Submission successfully saved.',
        data: newSubmission,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error('Submission Error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Failed to submit entry',
      },
      { status: 500 },
    )
  }
}