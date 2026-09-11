
import { styles } from "./inlineStyles";

export function inquiryTemplate(data: any, extraFieldsHTML: string, titleText: string) {
  return `
  <div style="${styles.wrapper}">
    <div style="${styles.container}">
      <div style="${styles.header}">
        <div style="position: absolute; top: 20px; right: 30px; font-size: 12px; opacity: 0.8;">🏠 New Property Inquiry</div>
        <h1 style="margin:0 0 10px; font-size:28px; font-weight:600; letter-spacing:0.5px;">${titleText}</h1>
        <p style="margin:0 0 5px; font-size:16px; opacity:0.95;">A potential client has reached out regarding property opportunities</p>
        <p style="margin:0; font-size:14px; opacity:0.8; font-style:italic;">Let's connect them with their dream home</p>
      </div>
      
      <div style="padding:35px 30px;">
        <div style="background:linear-gradient(145deg,#f8fafc 0%,#e2e8f0 100%);border-radius:12px;padding:25px;margin-bottom:30px;border-left:5px solid #2c5aa0;">
          <h2 style="margin:0 0 20px;color:#1e293b;font-size:20px;font-weight:500;">👤 Client Profile</h2>
          <table style="width:100%;font-size:15px;color:#475569;">
            <tr><td><b>Name:</b></td><td>${data.name}</td></tr>
            <tr><td><b>Email:</b></td><td>${data.email}</td></tr>
            ${data.phoneNumber ? `<tr><td><b>Phone:</b></td><td>${data.phoneNumber}</td></tr>` : ""}
            ${data.context ? `<tr><td><b>Context:</b></td><td>${data.context}</td></tr>` : ""}
            ${extraFieldsHTML}
          </table>
        </div>

        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:25px;">
          <h2 style="margin:0 0 20px;color:#1e293b;font-size:20px;font-weight:500;">💬 Message</h2>
          <div style="background:#f9fafb;padding:20px;border-left:4px solid #2c5aa0;border-radius:8px;">
            ${data.message?.replace(/\n/g, "<br/>") || "No message provided"}
          </div>
        </div>
      </div>

      <div style="${styles.footer}">
        <p style="margin:0 0 10px;font-size:14px;">&copy; ${new Date().getFullYear()} SuperChennai</p>
      </div>
    </div>
  </div>
  `;
}
