export function thankYouTemplate(data: any) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px;">
      <h2>Hi ${data.name},</h2>
      <p>Thank you for reaching out to us! We have received your message and our team will get back to you shortly.</p>
      <p><strong>Your Message:</strong></p>
      <p>${data.message?.replace(/\n/g, "<br/>")}</p>
      <p>Best regards,<br />SuperChennai Team</p>
      <hr />
      <p style="font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} SuperChennai. All rights reserved.</p>
    </div>
  `;
}
