import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { createTransporter } from '@/utilities/emailComponents/transporter'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const payload = await getPayload({ config })

    const registration = await payload.findByID({
      collection: 'arattai-registrations' as any,

      id: body.id,
    })

    if (!registration?.email) {
      return NextResponse.json({ success: false, message: 'Email not found' }, { status: 400 })
    }

    const adminMessage = registration?.adminMessage

    /* =========================
       TRANSPORTER EMAIL SEND
    ========================= */
    const transporter = createTransporter()

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: registration.email,
      subject: 'Your Registration is Confirmed 🎉',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration Confirmed</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f4f7;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    .email-wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #f4f4f7;
      padding-bottom: 40px;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .header-bar {
      height: 6px;
      background-color: #ec4899; /* Pink Accent from previous code */
      background: linear-gradient(to right, #ec4899, #8b5cf6);
    }
    .content {
      padding: 40px 40px 20px 40px;
    }
    .greeting {
      color: #111827;
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 20px 0;
    }
    .text {
      color: #4b5563;
      font-size: 16px;
      line-height: 1.6;
      margin: 0 0 20px 0;
    }
    .highlight-box {
      background-color: #fdf2f8; /* Very light pink */
      border: 1px solid #fbcfe8;
      border-left: 4px solid #ec4899;
      border-radius: 4px;
      padding: 20px;
      margin: 25px 0;
    }
    .highlight-title {
      color: #831843;
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0 0 8px 0;
    }
    .highlight-text {
      color: #9d174d;
      font-size: 16px;
      margin: 0;
      line-height: 1.5;
    }
    .footer {
      background-color: #f9fafb;
      padding: 30px 40px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer-text {
      color: #9ca3af;
      font-size: 12px;
      margin: 0;
    }
    .footer-link {
      color: #6b7280;
      text-decoration: underline;
    }
    
    /* Mobile Responsive */
    @media (max-width: 600px) {
      .email-container { width: 100% !important; border-radius: 0; }
      .content { padding: 30px 20px !important; }
      .footer { padding: 20px !important; }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <center>
      <table class="email-container" role="presentation" cellspacing="0" cellpadding="0">
        <tr>
          <td>
            <!-- Top Color Bar -->
            <div class="header-bar"></div>
            
            <!-- Main Content -->
            <div class="content">
              <h1 class="greeting">Hi ${registration.name},</h1>
              ${
                adminMessage
                  ? `
                <!-- Admin Message Conditional Block -->
                <div class="highlight-box">
                  <p class="highlight-text">${adminMessage}</p>
                </div>
                `
                  : ''
              }

              <p class="text">
                We look forward to seeing you at the event!
              </p>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p class="footer-text">
                © ${new Date().getFullYear()} Arattai Events. All rights reserved.
              </p>
              <p class="footer-text" style="margin-top: 8px;">
                <a href="#" class="footer_link">Unsubscribe</a> | <a href="#" class="footer_link">Privacy Policy</a>
              </p>
            </div>
          </td>
        </tr>
      </table>
    </center>
  </div>
</body>
</html>
      `,
    })

    /* =========================
       UPDATE COLLECTION
    ========================= */

    await payload.update({
      collection: 'arattai-registrations' as any,

      id: body.id,
      data: {
        thankYouMailSent: true,
        status: 'confirmed',
        confirmedAt: new Date().toISOString(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.log('EMAIL ERROR:', error)

    return NextResponse.json({ success: false, message: 'Email failed' }, { status: 500 })
  }
}
