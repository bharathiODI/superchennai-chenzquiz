// import { NextRequest, NextResponse } from 'next/server'
// import { getPayload } from 'payload'
// import config from '@payload-config'
// import { createTransporter } from '@/utilities/emailComponents/transporter'

// export async function POST(req: NextRequest) {
//   try {
//     /* ======================================================
//        GET FORM DATA
//     ====================================================== */

//     const formData = await req.formData()

//     const eventId = formData.get('eventId')
//     const slug = formData.get('slug')
//     const emailTemplate = formData.get('emailTemplate')

//     /* ======================================================
//        VALIDATION
//     ====================================================== */

//     if (!eventId) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: 'Event ID is required',
//         },
//         {
//           status: 400,
//         },
//       )
//     }

//     /* ======================================================
//        PARSE VALUES
//     ====================================================== */

//     let values: Record<string, any> = {}

//     try {
//       values = JSON.parse(String(formData.get('values') || '{}'))
//     } catch (err) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: 'Invalid form values JSON',
//         },
//         {
//           status: 400,
//         },
//       )
//     }

//     /* ======================================================
//        PAYLOAD INSTANCE
//     ====================================================== */

//     const payload = await getPayload({
//       config,
//     })

//     const summerEvent = await payload.findByID({
//       collection: 'lets-talks-chennai',
//       id: Number(eventId),
//       depth: 1,
//     })

//     const week =
//       typeof summerEvent?.eventFields?.week === 'object'
//         ? summerEvent?.eventFields?.week?.id
//         : summerEvent?.eventFields?.week

//     // MEADIA UPLOAD LOGIC########

//     const uploadedFiles: any[] = []

//     for (const [key, value] of formData.entries()) {
//       if (value instanceof File) {
//         const bytes = await value.arrayBuffer()
//         const buffer = Buffer.from(bytes)

//         const mediaDoc = await payload.create({
//           collection: 'media',
//           data: {},
//           file: {
//             data: buffer,
//             mimetype: value.type,
//             name: value.name,
//             size: value.size,
//           },
//         })

//         uploadedFiles.push({
//           file: mediaDoc.id,
//           fieldName: key,
//         })
//       }
//     }

//     const registration = await payload.create({
//       collection: 'summer-registrations',

//       data: {
//         summer: Number(eventId),

//         week,

//         status: 'pending',

//         name: values?.name || '',

//         email: values?.email || '',

//         phone: values?.phone || values?.mobile || values?.phoneNumber || '',

//         company: values?.company || '',

//         // photo: uploadedMediaId,
//         attachments: uploadedFiles,

//         values,
//       },
//     })

//     /* ======================================================
//        SEND MAIL
//     ====================================================== */

//     const transporter = createTransporter()

//     if (registration?.email) {
//       await transporter.sendMail({
//         from: `"Super Chennai" <${process.env.SMTP_USER}>`,

//         to: registration.email,

//         subject: 'Registration Confirmed',

//         html: String(emailTemplate || ''),
//       })
//     }

//     /* ======================================================
//        RESPONSE
//     ====================================================== */

//     return NextResponse.json({
//       success: true,
//       message: 'Registration submitted successfully',
//       registration,
//     })
//   } catch (error: any) {
//     console.log('SUMMER REGISTRATION ERROR:', error)

//     return NextResponse.json(
//       {
//         success: false,
//         message: error?.message || 'Something went wrong',
//       },
//       {
//         status: 500,
//       },
//     )
//   }
// }

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { createTransporter } from '@/utilities/emailComponents/transporter'

// Helper to safely search case-insensitive keys from values object
const extractFieldValue = (values: Record<string, any>, targetKeys: string[]) => {
  if (!values) return ''
  for (const key of Object.keys(values)) {
    const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, '')
    for (const target of targetKeys) {
      if (cleanKey.includes(target)) {
        return values[key]
      }
    }
  }
  return ''
}

export async function POST(req: NextRequest) {
  try {
    /* ======================================================
       1. GET FORM DATA
    ====================================================== */
    const formData = await req.formData()

    const eventId = formData.get('eventId')
    const emailTemplate = formData.get('emailTemplate')

    if (!eventId) {
      return NextResponse.json(
        { success: false, message: 'Event ID is required' },
        { status: 400 },
      )
    }

    /* ======================================================
       2. PARSE VALUES
    ====================================================== */
    let values: Record<string, any> = {}

    try {
      values = JSON.parse(String(formData.get('values') || '{}'))
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid form values JSON' },
        { status: 400 },
      )
    }

    /* ======================================================
       3. PAYLOAD INSTANCE
    ====================================================== */
    const payload = await getPayload({ config })

    /* ======================================================
       4. MEDIA UPLOAD LOGIC
    ====================================================== */
    const uploadedFiles: { file: number | string; fieldName: string }[] = []

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        const bytes = await value.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const mediaDoc = await payload.create({
          collection: 'media',
          data: {},
          file: {
            data: buffer,
            mimetype: value.type,
            name: value.name,
            size: value.size,
          },
        })

        uploadedFiles.push({
          file: mediaDoc.id,
          fieldName: key,
        })
      }
    }

    /* ======================================================
       5. EXTRACT DYNAMIC CONTACT FIELDS
    ====================================================== */
    const extractedName =
      extractFieldValue(values, ['name', 'yourname']) || 'Anonymous'

    const extractedEmail =
      extractFieldValue(values, ['email', 'emailaddress', 'mail']) || ''

    const extractedPhone = String(
      extractFieldValue(values, ['phone', 'mobile', 'number', 'contact']) || '',
    )

    const extractedCompany =
      extractFieldValue(values, ['company', 'organization', 'handle', 'instagram']) || ''

    /* ======================================================
       6. CREATE REGISTRATION RECORD
    ====================================================== */
    const registration = await payload.create({
      collection: 'summer-registrations',
      data: {
        summer: Number(eventId),
        status: 'pending',
        name: extractedName,
        email: extractedEmail,
        phone: extractedPhone,
        company: extractedCompany,
        attachments: uploadedFiles as any,
        values,
      },
    })

    /* ======================================================
       7. SEND CONFIRMATION EMAIL
    ====================================================== */
    if (extractedEmail) {
      try {
        const transporter = createTransporter()
        await transporter.sendMail({
          from: `"Super Chennai" <${process.env.SMTP_USER}>`,
          to: extractedEmail,
          subject: 'Registration Confirmed',
          html: String(emailTemplate || ''),
        })
      } catch (mailError) {
        console.error('MAIL ERROR:', mailError)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Registration submitted successfully',
      registration,
    })
  } catch (error: any) {
    console.error('SUMMER REGISTRATION ERROR:', error)

    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Something went wrong',
      },
      { status: 500 },
    )
  }
}
