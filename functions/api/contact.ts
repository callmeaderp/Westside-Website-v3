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
 * 6. Fires a Meta CAPI `Lead` event server-side (dedupes with browser pixel
 *    via shared `event_id`). Failure is logged and swallowed.
 *
 * Environment secrets (set via wrangler pages secret put):
 *   TURNSTILE_SECRET, AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET,
 *   META_ACCESS_TOKEN
 */

import {
  buildUserData,
  extractCity,
  extractClientIp,
  extractStateCode,
  extractZip,
  readCookie,
  sendCapiEvent,
} from '../_lib/meta-capi';

interface Env {
  TURNSTILE_SECRET: string;
  AZURE_TENANT_ID: string;
  AZURE_CLIENT_ID: string;
  AZURE_CLIENT_SECRET: string;
  /** Meta system-user access token (never expires). Optional — missing token logs and skips CAPI. */
  META_ACCESS_TOKEN?: string;
  /** Meta Events Manager test code (optional). When set, server events show up only in the Test Events tab. */
  META_TEST_EVENT_CODE?: string;
}

interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  gclid?: string;
  msclkid?: string;
  landing_page?: string;
  referrer?: string;
}

interface ContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  contactPreference?: string;
  address?: string;
  zip?: string;
  service?: string;
  projectType?: string;
  budget?: string;
  timing?: string;
  howHeard?: string;
  message: string;
  /** First-touch campaign parameters captured client-side. Untrusted display data. */
  attribution?: Attribution;
  turnstileToken?: string;
  /** UUID generated client-side and reused by the browser fbq Lead event for dedup. */
  eventId?: string;
  resume?: {
    name: string;
    type: string;
    data: string; // base64
  };
}

/** Attribution keys we surface, in the order they appear in the notification. */
const ATTRIBUTION_FIELDS: Array<[keyof Attribution, string]> = [
  ['utm_source', 'Source'],
  ['utm_medium', 'Medium'],
  ['utm_campaign', 'Campaign'],
  ['utm_content', 'Content'],
  ['utm_term', 'Term'],
  ['gclid', 'Google click ID'],
  ['fbclid', 'Meta click ID'],
  ['msclkid', 'Microsoft click ID'],
  ['landing_page', 'Landing page'],
  ['referrer', 'Referrer'],
];

const MAX_ATTRIBUTION_VALUE = 300;

/**
 * Attribution is attacker-controllable (it comes from the query string), so it
 * is length-capped here and HTML-escaped at render time. It is never used for
 * any control decision — only displayed in the internal notification.
 */
function sanitizeAttribution(raw: unknown): Array<[string, string]> {
  if (!raw || typeof raw !== 'object') return [];
  const source = raw as Record<string, unknown>;
  const out: Array<[string, string]> = [];
  for (const [key, label] of ATTRIBUTION_FIELDS) {
    const value = source[key];
    if (typeof value === 'string' && value.trim()) {
      out.push([label, value.trim().slice(0, MAX_ATTRIBUTION_VALUE)]);
    }
  }
  return out;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB (base64 is ~33% larger, so ~6.7MB in payload)
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_ADDRESS_LENGTH = 300;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_FILENAME_LENGTH = 180;
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
// Customer confirmation replies go to the monitored office mailbox. The website
// sender account is intentionally disabled for interactive use and is not an inbox.
const REPLY_TO = 'office@westsideprolandscape.com';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

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
  if (
    firstName.trim().length > MAX_NAME_LENGTH ||
    lastName.trim().length > MAX_NAME_LENGTH ||
    email.trim().length > MAX_EMAIL_LENGTH ||
    (payload.address?.trim().length ?? 0) > MAX_ADDRESS_LENGTH ||
    message.trim().length > MAX_MESSAGE_LENGTH
  ) {
    return json(400, { success: false, message: 'One or more fields are too long.' });
  }

  if (!turnstileToken) {
    return json(400, { success: false, message: 'Missing verification token.' });
  }

  let tsResult: { success: boolean };
  try {
    const tsRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET,
        response: turnstileToken,
        remoteip: request.headers.get('CF-Connecting-IP') || '',
      }),
    });
    if (!tsRes.ok) {
      throw new Error(`Turnstile returned HTTP ${tsRes.status}`);
    }
    tsResult = (await tsRes.json()) as { success: boolean };
  } catch (error) {
    console.error('Turnstile verification request failed:', error);
    return json(503, { success: false, message: 'Verification is temporarily unavailable. Please try again.' });
  }
  if (!tsResult.success) {
    return json(403, { success: false, message: 'Verification failed.' });
  }

  let resumeBytes: Uint8Array | null = null;
  let resumeName = '';
  if (payload.resume) {
    const { type, data } = payload.resume;
    resumeName = sanitizeFilename(payload.resume.name, ALLOWED_TYPES[type] || '');
    if (!resumeName) {
      return json(400, { success: false, message: 'Invalid file name.' });
    }

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

    const expected = MAGIC_BYTES[type];
    if (expected && !expected.every((b, i) => resumeBytes![i] === b)) {
      return json(400, { success: false, message: 'File content does not match its type.' });
    }
  }

  const phone = formatPhone(payload.phone || '');
  const address = payload.address?.trim() || '';
  const zip = payload.zip?.trim().slice(0, 10) || '';
  const contactPreference = payload.contactPreference?.trim().slice(0, 40) || '';
  const service = payload.service?.trim() || 'Not specified';
  const projectType = payload.projectType?.trim().slice(0, 120) || '';
  const budget = payload.budget?.trim().slice(0, 60) || '';
  const timing = payload.timing?.trim().slice(0, 60) || '';
  const howHeard = payload.howHeard?.trim() || 'Not specified';
  const attribution = sanitizeAttribution(payload.attribution);
  const isCareer = service === 'Career Inquiry';
  const submittedAt = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  });

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

  const inquiryType = isCareer ? 'Career Inquiry' : 'Estimate Request';
  // Budget in the subject line lets the office triage from the inbox list view.
  const subjectScope = [projectType || service, budget].filter(Boolean).join(' — ');
  const subject = `[${inquiryType}] ${firstName.trim()} ${lastName.trim()} — ${subjectScope || service}`;

  const attachments: Record<string, unknown>[] = [];
  if (payload.resume && resumeBytes) {
    attachments.push({
      '@odata.type': '#microsoft.graph.fileAttachment',
      name: resumeName,
      contentType: payload.resume.type,
      contentBytes: payload.resume.data, // already base64
    });
  }

  const notificationHtml = buildNotificationEmail({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim(),
    phone,
    contactPreference,
    address,
    zip,
    service,
    projectType,
    budget,
    timing,
    howHeard,
    message: message.trim(),
    submittedAt,
    isCareer,
    hasResume: !!payload.resume,
    attribution,
  });

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

  // --- Meta Conversions API — server-side Lead event ---
  // Mirrors the browser-side fbq('track','Lead', ..., {eventID}) so Meta can
  // dedupe via the shared event_id (sent in payload.eventId) and recover
  // signal lost to ad blockers / ITP / iOS opt-outs. Failure is logged and
  // swallowed — CAPI is supplementary and must never break the form response.
  try {
    const fullAddress = address;
    const userData = await buildUserData({
      email: email.trim(),
      phone: payload.phone, // raw — buildUserData strips to digits before hashing
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      city: fullAddress ? extractCity(fullAddress) : undefined,
      state: fullAddress ? extractStateCode(fullAddress) : undefined,
      // The dedicated ZIP field is more reliable than parsing it back out of a
      // free-text address, so it wins when the visitor filled it in.
      zip: zip || (fullAddress ? extractZip(fullAddress) : undefined),
      country: 'us',
      clientIp: extractClientIp(request),
      userAgent: request.headers.get('user-agent') || undefined,
      fbc: readCookie(request, '_fbc') || undefined,
      fbp: readCookie(request, '_fbp') || undefined,
    });

    await sendCapiEvent({
      accessToken: env.META_ACCESS_TOKEN || '',
      eventName: 'Lead',
      eventId: payload.eventId,
      eventSourceUrl: request.headers.get('referer') || undefined,
      userData,
      customData: {
        service_interest: service,
        how_heard: howHeard,
        lead_source: 'website',
        form_type: isCareer ? 'career_inquiry' : 'estimate_request',
        ...(projectType ? { project_type: projectType } : {}),
        ...(budget ? { budget_band: budget } : {}),
        ...(timing ? { project_timing: timing } : {}),
        ...(payload.attribution?.utm_source ? { utm_source: String(payload.attribution.utm_source).slice(0, 100) } : {}),
        ...(payload.attribution?.utm_campaign ? { utm_campaign: String(payload.attribution.utm_campaign).slice(0, 100) } : {}),
      },
      testEventCode: env.META_TEST_EVENT_CODE,
    });
  } catch (err) {
    console.error('Meta CAPI Lead dispatch threw:', err);
  }

  return json(200, { success: true });
};

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

function sanitizeFilename(raw: string, expectedExtension: string): string {
  const leaf = String(raw || '').split(/[\\/]/).pop()?.trim() || '';
  const cleaned = leaf
    .replace(/[ -]/g, '')
    .replace(/["<>:|?*]/g, '_')
    .slice(0, MAX_FILENAME_LENGTH);
  if (!cleaned) return '';
  return cleaned.toLowerCase().endsWith(expectedExtension) ? cleaned : `${cleaned}${expectedExtension}`;
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

interface NotificationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  contactPreference: string;
  address: string;
  zip: string;
  service: string;
  projectType: string;
  budget: string;
  timing: string;
  howHeard: string;
  message: string;
  submittedAt: string;
  isCareer: boolean;
  hasResume: boolean;
  attribution: Array<[string, string]>;
}

function buildNotificationEmail(data: NotificationData): string {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const messageHtml = esc(data.message).replace(/\n/g, '<br>');
  const notProvided = '<span style="color:#999;">Not provided</span>';

  const row = (label: string, valueHtml: string) =>
    `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;width:150px;color:#666;vertical-align:top;">${esc(label)}</td>
         <td style="padding:8px 0;border-bottom:1px solid #eee;">${valueHtml}</td></tr>`;

  // Project rows are omitted entirely on career inquiries rather than shown empty.
  const projectRows = data.isCareer
    ? ''
    : [
        row('Project Type', data.projectType ? `<strong>${esc(data.projectType)}</strong>` : notProvided),
        row('Budget', data.budget ? `<strong>${esc(data.budget)}</strong>` : notProvided),
        row('Timing', data.timing ? esc(data.timing) : notProvided),
      ].join('');

  const attributionHtml = data.attribution.length
    ? `<tr><td colspan="2" style="padding:20px 0 8px;">
         <span style="font-size:12px;font-weight:700;color:#666;text-transform:uppercase;letter-spacing:1px;">Where this lead came from</span>
       </td></tr>` +
      data.attribution.map(([label, value]) => row(label, `<span style="color:#555;">${esc(value)}</span>`)).join('')
    : '';

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
      ${row('Name', `<strong>${esc(data.firstName)} ${esc(data.lastName)}</strong>`)}
      ${row('Email', `<a href="mailto:${esc(data.email)}" style="color:#00863F;">${esc(data.email)}</a>`)}
      ${row('Phone', data.phone ? `<a href="tel:${esc(data.phone.replace(/\D/g, ''))}" style="color:#00863F;">${esc(data.phone)}</a>` : notProvided)}
      ${row('Prefers', data.contactPreference ? esc(data.contactPreference) : notProvided)}
      ${row('Address', data.address ? esc(data.address) : notProvided)}
      ${row('ZIP', data.zip ? esc(data.zip) : notProvided)}
      ${row('Service', esc(data.service))}
      ${projectRows}
      ${row('How Heard', esc(data.howHeard))}
      <tr><td style="padding:8px 0;color:#666;vertical-align:top;">Message</td>
          <td style="padding:8px 0;">${messageHtml}</td></tr>
      ${attributionHtml}
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
    : `Thank you for reaching out about <strong>${esc(data.service)}</strong>. We've received your request. A member of our team will review the details and contact you about the next step.`;

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
