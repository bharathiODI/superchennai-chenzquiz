'use server'

import { createTransporter } from './emailComponents/transporter'
import { inquiryTemplate } from './emailComponents/inquiryTemplate'
import { thankYouTemplate } from './emailComponents/thankYouTemplate'
import { generateExtraFieldsHTML } from './emailComponents/generateExtraFields'
import { capitalizeWords } from './emailComponents/capitalizeWords'

interface SendFormEmailData {
  name: string
  email: string
  message: string
  phoneNumber?: string
  context?: string
  subject?: string
  templateTitle?: string
  extraFields?: Record<string, any>
  buildercontactEmail?: string
}

export async function sendFormEmail(data: SendFormEmailData): Promise<boolean> {
  try {
    const transporter = createTransporter()
    const { FORM_RECEIVER_EMAIL, FORM_CC_EMAIL, SMTP_USER } = process.env
    const extraFieldsHTML = generateExtraFieldsHTML(data.extraFields)
    const titleText = capitalizeWords(data.templateTitle || 'Real Estate Inquiry Received')
    const adminHTML = inquiryTemplate(data, extraFieldsHTML, titleText)
    const thankYouHTML = thankYouTemplate(data)

    // send to admin
    await transporter.sendMail({
      from: `"Website Contact" <${SMTP_USER}>`,
      to: FORM_RECEIVER_EMAIL,
      cc: FORM_CC_EMAIL || '',
      subject: data.subject || `New Form Message from ${data.name}`,
      html: adminHTML,
      text: adminHTML.replace(/<[^>]+>/g, ''),
    })

    // send thank you USER ############
    await transporter.sendMail({
      from: `"SuperChennai" <${SMTP_USER}>`,
      to: data.email,
      subject: 'Thank you for contacting SuperChennai!',
      html: thankYouHTML,
      text: thankYouHTML.replace(/<[^>]+>/g, ''),
    })

    //  Send Notification to Builder ---
    if (data.buildercontactEmail) {
      const builderHTML = inquiryTemplate(
        {
          ...data,
          templateTitle: 'New Client Inquiry for Your Property',
          context: 'This inquiry was submitted through the SuperChennai website.',
        },
        extraFieldsHTML,
        'New Client Inquiry for Your Property',
      )

      await transporter.sendMail({
        from: `"SuperChennai" <${SMTP_USER}>`,
        to: data.buildercontactEmail,
        subject: `New Client Inquiry from ${data.name} - SuperChennai`,
        html: builderHTML,
        text: builderHTML.replace(/<[^>]+>/g, ''),
      })
    }

    return true
  } catch (err: any) {
    console.error('Error sending email:', err)
    return false
  }
}

