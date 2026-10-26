import nodemailer from 'nodemailer';

const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'praveengupta6452@gmail.com';
const GMAIL_USER = process.env.GMAIL_USER || 'praveengupta6452@gmail.com';
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || '';

let transporter = null;

if (GMAIL_USER && GMAIL_APP_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  });
}

export async function sendContactNotification({ name, email, message, phone }) {
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  // 1. If Gmail App Password is configured, send via Nodemailer
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: `"Vertexx Client Contact" <${GMAIL_USER}>`,
        to: NOTIFICATION_EMAIL,
        replyTo: `"${name}" <${email}>`,
        subject: `🚨 New Contact Message from ${name} - Vertexx Website`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #0a3a3e 0%, #0f5257 100%); color: #ffffff; padding: 24px 28px;">
              <h2 style="margin: 0; font-size: 22px; font-weight: 700;">New Contact Form Message</h2>
              <p style="margin: 6px 0 0; font-size: 14px; color: #a7f3d0;">Vertexx Automation Website</p>
            </div>
            
            <div style="padding: 28px;">
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 120px;">Client Name:</td>
                  <td style="padding: 8px 0; color: #0f172a; font-size: 15px; font-weight: 600;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Client Email:</td>
                  <td style="padding: 8px 0; color: #0f5257; font-size: 15px; font-weight: 600;">
                    <a href="mailto:${email}" style="color: #0f5257; text-decoration: underline;">${email}</a>
                  </td>
                </tr>
                ${phone ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Phone:</td>
                  <td style="padding: 8px 0; color: #0f172a; font-size: 15px; font-weight: 600;">${phone}</td>
                </tr>` : ''}
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Time:</td>
                  <td style="padding: 8px 0; color: #64748b; font-size: 13px;">${timestamp} IST</td>
                </tr>
              </table>

              <div style="background: #f8fafc; border-left: 4px solid #0f5257; padding: 16px 20px; border-radius: 4px; margin-bottom: 24px;">
                <p style="margin: 0 0 6px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #0f5257;">Client Message:</p>
                <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #1e293b; white-space: pre-wrap;">${message}</p>
              </div>

              <div style="text-align: center; margin-top: 28px;">
                <a href="mailto:${email}?subject=Re:%20Vertexx%20Inquiry%20-%20${encodeURIComponent(name)}" style="display: inline-block; background: #0f5257; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 9999px; font-weight: 600; font-size: 14px;">Reply Directly to ${name}</a>
              </div>
            </div>

            <div style="background: #f1f5f9; padding: 16px 28px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
              Received via Contact Us page on Vertexx Automation.
            </div>
          </div>
        `,
      });
      console.log(`[EmailService] Sent to ${NOTIFICATION_EMAIL} via Gmail SMTP (id: ${info.messageId})`);
      return { success: true, method: 'gmail-smtp', id: info.messageId };
    } catch (err) {
      console.error('[EmailService] Gmail SMTP error:', err.message);
    }
  }

  // 2. Direct HTTP Dispatch via FormSubmit fallback
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${NOTIFICATION_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Referer': process.env.CORS_ORIGIN || 'http://localhost:5173',
      },
      body: JSON.stringify({
        _subject: `🚨 New Contact Message from ${name} (Vertexx)`,
        _replyto: email,
        name,
        email,
        phone: phone || 'Not provided',
        message,
        time: `${timestamp} IST`,
      }),
    });
    const data = await res.json().catch(() => ({}));
    console.log('[EmailService] Dispatched via FormSubmit:', data);
    return { success: true, method: 'formsubmit', data };
  } catch (err) {
    console.error('[EmailService] FormSubmit error:', err.message);
  }

  console.log(`[EmailService] Contact logged: ${name} <${email}>: "${message}"`);
  return { success: true, method: 'logged' };
}

export async function sendLeadNotification(lead) {
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  if (transporter) {
    try {
      const itemsList = Array.isArray(lead.items) ? lead.items.join(', ') : 'None specified';
      await transporter.sendMail({
        from: `"Vertexx Business Inquiries" <${GMAIL_USER}>`,
        to: NOTIFICATION_EMAIL,
        replyTo: `"${lead.name}" <${lead.email}>`,
        subject: `💼 New Business Lead: ${lead.name} (${lead.company || 'Individual'}) - ${lead.leadId || 'New'}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #0a3a3e 0%, #0f5257 100%); color: #ffffff; padding: 24px 28px;">
              <h2 style="margin: 0; font-size: 22px; font-weight: 700;">New Business Inquiry Received</h2>
              <p style="margin: 6px 0 0; font-size: 14px; color: #a7f3d0;">Reference ID: ${lead.leadId || 'N/A'}</p>
            </div>
            
            <div style="padding: 28px;">
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 140px;">Contact Person:</td>
                  <td style="padding: 8px 0; color: #0f172a; font-size: 15px; font-weight: 600;">${lead.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Company:</td>
                  <td style="padding: 8px 0; color: #0f172a; font-size: 15px;">${lead.company || 'Not specified'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Email:</td>
                  <td style="padding: 8px 0; color: #0f5257; font-size: 15px; font-weight: 600;">
                    <a href="mailto:${lead.email}" style="color: #0f5257; text-decoration: underline;">${lead.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Phone:</td>
                  <td style="padding: 8px 0; color: #0f172a; font-size: 15px;">${lead.phone || 'Not provided'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Industry:</td>
                  <td style="padding: 8px 0; color: #0f172a; font-size: 15px;">${lead.industry || 'General'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Budget:</td>
                  <td style="padding: 8px 0; color: #0f172a; font-size: 15px; font-weight: 600;">${lead.budget || 'Flexible'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Timeline:</td>
                  <td style="padding: 8px 0; color: #0f172a; font-size: 15px;">${lead.timeline || 'Flexible'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Meeting Mode:</td>
                  <td style="padding: 8px 0; color: #0f172a; font-size: 15px;">${lead.mode || 'Consultation call'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Requested Services:</td>
                  <td style="padding: 8px 0; color: #0f172a; font-size: 15px;">${itemsList}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Submitted At:</td>
                  <td style="padding: 8px 0; color: #64748b; font-size: 13px;">${timestamp} IST</td>
                </tr>
              </table>

              <div style="text-align: center; margin-top: 28px;">
                <a href="mailto:${lead.email}?subject=Vertexx%20Proposal%20for%20${encodeURIComponent(lead.company || lead.name)}" style="display: inline-block; background: #0f5257; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 9999px; font-weight: 600; font-size: 14px;">Reply to Lead</a>
              </div>
            </div>
          </div>
        `,
      });
    } catch (err) {
      console.error('[EmailService] Lead notification error:', err.message);
    }
  } else {
    try {
      await fetch(`https://formsubmit.co/ajax/${NOTIFICATION_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Referer': process.env.CORS_ORIGIN || 'http://localhost:5173',
        },
        body: JSON.stringify({
          _subject: `💼 New Business Lead: ${lead.name} (${lead.company || 'Individual'})`,
          _replyto: lead.email,
          leadId: lead.leadId,
          name: lead.name,
          company: lead.company,
          email: lead.email,
          phone: lead.phone,
          budget: lead.budget,
          timeline: lead.timeline,
          services: Array.isArray(lead.items) ? lead.items.join(', ') : '',
          time: `${timestamp} IST`,
        }),
      });
    } catch (err) {
      console.error('[EmailService] FormSubmit lead error:', err.message);
    }
  }
}
