/**
 * POST /api/contact/ — Contact form endpoint
 *
 * Replaces Web3Forms + R2 resume pipeline with a single MS Graph sendMail endpoint.
 *
 * Receives JSON body with form fields + optional resume as base64.
 * 1. Validates Turnstile server-side
 * 2. Validates resume file if present (magic bytes, size, type)
 * 3. Exchanges Azure AD client credentials for Graph token
 * 4. Sends HTML notification email to office@ + brad@ with resume attached
 * 5. Sends branded confirmation email to customer
 *
 * Environment secrets (set via wrangler pages secret put):
 *   TURNSTILE_SECRET, AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET
 */

interface Env {
  TURNSTILE_SECRET: string;
  AZURE_TENANT_ID: string;
  AZURE_CLIENT_ID: string;
  AZURE_CLIENT_SECRET: string;
}

interface ContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  service?: string;
  howHeard?: string;
  message: string;
  turnstileToken?: string;
  resume?: {
    name: string;
    type: string;
    data: string; // base64
  };
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB (base64 is ~33% larger, so ~6.7MB in payload)
const ALLOWED_TYPES: Record<string, string> = {
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
};
const MAGIC_BYTES: Record<string, number[]> = {
  'application/pdf': [0x25, 0x50, 0x44, 0x46],           // %PDF
  'application/msword': [0xd0, 0xcf, 0x11, 0xe0],         // OLE
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [0x50, 0x4b, 0x03, 0x04], // PK ZIP
};

const SENDER = 'website@westsideprolandscape.com';
// Who gets notified when a form comes in
const NOTIFY = [
  'office@westsideprolandscape.com',  // Heather
  'brad@westsideprolandscape.com',    // Brad
];
// Where customer replies go (shared mailbox — visible to all staff added as members)
const REPLY_TO = 'website@westsideprolandscape.com';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // --- Parse JSON body ---
  let payload: ContactPayload;
  try {
    payload = await request.json();
  } catch {
    return json(400, { success: false, message: 'Invalid request body.' });
  }

  const { firstName, lastName, email, message, turnstileToken } = payload;
  if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !message?.trim()) {
    return json(400, { success: false, message: 'First name, last name, email, and message are required.' });
  }

  // --- Turnstile server-side validation ---
  if (!turnstileToken) {
    return json(400, { success: false, message: 'Missing verification token.' });
  }

  const tsRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: env.TURNSTILE_SECRET,
      response: turnstileToken,
      remoteip: request.headers.get('CF-Connecting-IP') || '',
    }),
  });
  const tsResult = (await tsRes.json()) as { success: boolean };
  if (!tsResult.success) {
    return json(403, { success: false, message: 'Verification failed.' });
  }

  // --- Validate resume if present ---
  let resumeBytes: Uint8Array | null = null;
  if (payload.resume) {
    const { name, type, data } = payload.resume;

    if (!ALLOWED_TYPES[type]) {
      return json(400, { success: false, message: `Invalid file type: ${type}. PDF, DOC, or DOCX only.` });
    }

    try {
      resumeBytes = base64ToUint8Array(data);
    } catch {
      return json(400, { success: false, message: 'Invalid file data.' });
    }

    if (resumeBytes.byteLength === 0) {
      return json(400, { success: false, message: 'Empty file.' });
    }
    if (resumeBytes.byteLength > MAX_FILE_SIZE) {
      return json(400, { success: false, message: `File too large (${(resumeBytes.byteLength / 1024 / 1024).toFixed(1)} MB). Max 5 MB.` });
    }

    // Magic bytes check
    const expected = MAGIC_BYTES[type];
    if (expected && !expected.every((b, i) => resumeBytes![i] === b)) {
      return json(400, { success: false, message: 'File content does not match its type.' });
    }
  }

  // --- Format fields ---
  const phone = formatPhone(payload.phone || '');
  const service = payload.service?.trim() || 'Not specified';
  const howHeard = payload.howHeard?.trim() || 'Not specified';
  const isCareer = service === 'Career Inquiry';
  const submittedAt = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  });

  // --- Get Azure AD token ---
  const tokenRes = await fetch(
    `https://login.microsoftonline.com/${env.AZURE_TENANT_ID}/oauth2/v2.0/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: env.AZURE_CLIENT_ID,
        client_secret: env.AZURE_CLIENT_SECRET,
        scope: 'https://graph.microsoft.com/.default',
        grant_type: 'client_credentials',
      }),
    },
  );
  const tokenData = (await tokenRes.json()) as { access_token?: string; error?: string };
  if (!tokenData.access_token) {
    console.error('Azure AD token exchange failed:', tokenData);
    return json(500, { success: false, message: 'Unable to process your request. Please call us instead.' });
  }
  const graphToken = tokenData.access_token;

  // --- Build notification email ---
  const inquiryType = isCareer ? 'Career Inquiry' : 'Estimate Request';
  const subject = `[${inquiryType}] ${firstName.trim()} ${lastName.trim()} — ${service}`;

  const attachments: Record<string, unknown>[] = [];
  if (payload.resume && resumeBytes) {
    attachments.push({
      '@odata.type': '#microsoft.graph.fileAttachment',
      name: payload.resume.name,
      contentType: payload.resume.type,
      contentBytes: payload.resume.data, // already base64
    });
  }

  const notificationHtml = buildNotificationEmail({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim(),
    phone,
    service,
    howHeard,
    message: message.trim(),
    submittedAt,
    isCareer,
    hasResume: !!payload.resume,
  });

  // Send notification to office
  const sendRes = await fetch(
    `https://graph.microsoft.com/v1.0/users/${SENDER}/sendMail`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${graphToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: {
          subject,
          body: { contentType: 'HTML', content: notificationHtml },
          toRecipients: NOTIFY.map((addr) => ({ emailAddress: { address: addr } })),
          replyTo: [{ emailAddress: { address: email.trim(), name: `${firstName.trim()} ${lastName.trim()}` } }],
          attachments,
          categories: [service],
        },
        saveToSentItems: false,
      }),
    },
  );

  if (!sendRes.ok) {
    const err = await sendRes.text();
    console.error('Graph sendMail (notification) failed:', sendRes.status, err);
    return json(500, { success: false, message: 'Unable to send your message. Please call us instead.' });
  }

  // --- Send confirmation email to customer ---
  const confirmationHtml = buildConfirmationEmail({
    firstName: firstName.trim(),
    service,
    isCareer,
  });

  // Fire-and-forget — don't fail the submission if confirmation fails
  fetch(`https://graph.microsoft.com/v1.0/users/${SENDER}/sendMail`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${graphToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: {
        subject: isCareer
          ? 'Application received — Westside Professional Landscape'
          : 'We received your request — Westside Professional Landscape',
        body: { contentType: 'HTML', content: confirmationHtml },
        toRecipients: [{ emailAddress: { address: email.trim(), name: `${firstName.trim()} ${lastName.trim()}` } }],
        replyTo: [{ emailAddress: { address: REPLY_TO, name: 'Westside Professional Landscape' } }],
      },
      saveToSentItems: false,
    }),
  }).catch((err) => console.error('Confirmation email failed:', err));

  return json(200, { success: true });
};

// === Helpers ===

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

function base64ToUint8Array(base64: string): Uint8Array {
  // Handle data URL prefix if present
  const clean = base64.includes(',') ? base64.split(',')[1] : base64;
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith('1')) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return raw.trim(); // return as-is if not a standard US number
}

// === Email Templates ===

interface NotificationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  howHeard: string;
  message: string;
  submittedAt: string;
  isCareer: boolean;
  hasResume: boolean;
}

function buildNotificationEmail(data: NotificationData): string {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const messageHtml = esc(data.message).replace(/\n/g, '<br>');

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#f4f4f4;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:24px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
  <tr><td style="background:#00863F;padding:20px 32px;">
    <span style="color:#ffffff;font-size:18px;font-weight:700;">Westside Professional Landscape</span>
  </td></tr>
  <tr><td style="padding:28px 32px 8px;">
    <span style="font-size:20px;font-weight:700;color:#222;">${data.isCareer ? '📋 Career Inquiry' : '🌿 New Estimate Request'}</span>
  </td></tr>
  <tr><td style="padding:8px 32px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#333;">
      <tr><td style="padding:8px 0;border-bottom:1px solid #eee;width:140px;color:#666;vertical-align:top;">Name</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;">${esc(data.firstName)} ${esc(data.lastName)}</td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;vertical-align:top;">Email</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;"><a href="mailto:${esc(data.email)}" style="color:#00863F;">${esc(data.email)}</a></td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;vertical-align:top;">Phone</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;">${data.phone ? `<a href="tel:${esc(data.phone.replace(/\D/g, ''))}" style="color:#00863F;">${esc(data.phone)}</a>` : '<span style="color:#999;">Not provided</span>'}</td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;vertical-align:top;">Service</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;">${esc(data.service)}</td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;vertical-align:top;">How Heard</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;">${esc(data.howHeard)}</td></tr>
      <tr><td style="padding:8px 0;color:#666;vertical-align:top;">Message</td>
          <td style="padding:8px 0;">${messageHtml}</td></tr>
    </table>
  </td></tr>
  ${data.hasResume ? '<tr><td style="padding:16px 32px 0;"><span style="font-size:13px;color:#666;">📎 Resume attached to this email</span></td></tr>' : ''}
  <tr><td style="padding:24px 32px;border-top:1px solid #eee;margin-top:16px;">
    <span style="font-size:12px;color:#999;">Submitted ${esc(data.submittedAt)} via westsideprolandscape.com</span>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

interface ConfirmationData {
  firstName: string;
  service: string;
  isCareer: boolean;
}

function buildConfirmationEmail(data: ConfirmationData): string {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const bodyText = data.isCareer
    ? `Thank you for your interest in joining the Westside team! We've received your application and will review it shortly.`
    : `Thank you for reaching out about <strong>${esc(data.service)}</strong>. We've received your request and will get back to you within one business day.`;

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#f4f4f4;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:24px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
  <tr><td style="background:#00863F;padding:20px 32px;">
    <span style="color:#ffffff;font-size:18px;font-weight:700;">Westside Professional Landscape</span>
  </td></tr>
  <tr><td style="padding:28px 32px 16px;">
    <span style="font-size:16px;color:#222;">Hi ${esc(data.firstName)},</span>
  </td></tr>
  <tr><td style="padding:0 32px 24px;">
    <span style="font-size:14px;color:#333;line-height:1.7;">${bodyText}</span>
  </td></tr>
  <tr><td style="padding:0 32px 24px;">
    <span style="font-size:14px;color:#333;line-height:1.7;">If you need to reach us sooner, don't hesitate to call:</span><br>
    <a href="tel:+15855948420" style="font-size:16px;font-weight:700;color:#00863F;text-decoration:none;">(585) 594-8420</a><br>
    <span style="font-size:13px;color:#666;">Monday – Friday, 8:30 AM – 4:00 PM</span>
  </td></tr>
  <tr><td style="padding:20px 32px;border-top:1px solid #eee;">
    <span style="font-size:13px;color:#666;line-height:1.6;">
      Westside Professional Landscape<br>
      2565 Buffalo Road, Rochester, NY 14624<br>
      <a href="https://westsideprolandscape.com" style="color:#00863F;">westsideprolandscape.com</a>
    </span>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}
