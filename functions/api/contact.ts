/**
 * POST /api/contact/ — Contact form endpoint
 *
 * Replaces Web3Forms + R2 resume pipeline with a single MS Graph sendMail endpoint.
 *
 * Receives JSON body with form fields + optional resume as base64.
 * 1. Validates Turnstile server-side
 * 2. Validates resume file if present (magic bytes, size, type)
 * 3. Exchanges Azure AD client credentials for Graph token
 * 4. Sends HTML notification to office@ + brad@; careers CC Joshua for launch coordination
 * 5. Sends a branded acknowledgement when an email address was supplied
 * 6. Sends customer-only Meta CAPI `Lead` events on production hosts, using the
 *    browser's shared event_id for deduplication. Careers exit before hashing.
 *
 * Environment secrets (set via wrangler pages secret put):
 *   TURNSTILE_SECRET, AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET,
 *   META_ACCESS_TOKEN, CONTACT_TEST_RECIPIENT (preview environment only)
 */

import { MAX_RESUME_BYTES, MAX_RESUME_MB } from '../../src/data/form-limits';
import { isPropertyType, RESIDENTIAL_PROPERTY_TYPE } from '../../src/data/property-types';
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
  /**
   * Preview-environment test mode. When set to a Westside mailbox, the office
   * notification goes only there and the Meta CAPI Lead event is skipped, so a
   * preview test never reaches the office or ad reporting. Never set it on the
   * production environment.
   */
  CONTACT_TEST_RECIPIENT?: string;
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
  /** One of src/data/property-types.ts; anything else is dropped. */
  propertyType?: string;
  company?: string;
  projectType?: string;
  budget?: string;
  timing?: string;
  howHeard?: string;
  careerPosition?: string;
  careerAvailability?: string;
  referredBy?: string;
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

// Base64 for a 2 MiB file plus bounded form metadata fits comfortably in 3 MiB.
const MAX_REQUEST_BYTES = 3 * 1024 * 1024;
const MAX_BASE64_LENGTH = 4 * Math.ceil(MAX_RESUME_BYTES / 3);
const FIELD_LIMITS = {
  firstName: 100, lastName: 100, email: 254, phone: 80,
  address: 300, zip: 10, contactPreference: 40, service: 160,
  propertyType: 100, company: 150, projectType: 120, budget: 60,
  timing: 60, howHeard: 300, message: 5000, turnstileToken: 2048,
  eventId: 100, careerPosition: 160, careerAvailability: 500, referredBy: 120,
} as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

class PayloadError extends Error {
  constructor(message: string, readonly status = 400) { super(message); }
}

/** Content-Length is advisory; count the stream too, including chunked requests. */
async function readPayload(request: Request): Promise<ContactPayload> {
  if (Number(request.headers.get('content-length')) > MAX_REQUEST_BYTES) {
    throw new PayloadError('Request too large. Please use a resume of 2 MB or less.', 413);
  }
  const reader = request.body?.getReader();
  if (!reader) throw new PayloadError('Invalid request body.');
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_REQUEST_BYTES) {
      await reader.cancel();
      throw new PayloadError('Request too large. Please use a resume of 2 MB or less.', 413);
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  let raw: unknown;
  try { raw = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); }
  catch { throw new PayloadError('Invalid request body.'); }
  if (!isRecord(raw)) throw new PayloadError('Invalid request body.');
  // Whitelist known fields. Unknown legacy fields remain harmless and ignored.
  const fields: Record<string, unknown> = {};
  for (const [key, limit] of Object.entries(FIELD_LIMITS)) {
    if (raw[key] === undefined) continue;
    const label = key.replace(/([A-Z])/g, ' $1').toLowerCase();
    if (typeof raw[key] !== 'string') throw new PayloadError(`Invalid ${label} field. Please enter text.`);
    const value = raw[key].trim();
    if (value.length > limit) throw new PayloadError(`The ${label} field is too long. Maximum ${limit} characters.`);
    fields[key] = value;
  }
  if (raw.attribution !== undefined) {
    if (!isRecord(raw.attribution)) throw new PayloadError('Invalid attribution field.');
    const attribution: Record<string, string> = {};
    for (const [key] of ATTRIBUTION_FIELDS) {
      const value = raw.attribution[key];
      if (value === undefined) continue;
      if (typeof value !== 'string') throw new PayloadError('Invalid attribution field.');
      attribution[key] = value.trim().slice(0, MAX_ATTRIBUTION_VALUE);
    }
    fields.attribution = attribution;
  }
  if (raw.resume !== undefined) {
    const candidateResume = raw.resume;
    if (!isRecord(candidateResume) || ['name', 'type', 'data'].some((key) => typeof candidateResume[key] !== 'string')) {
      throw new PayloadError('Invalid resume. Please attach a PDF, DOC, or DOCX file.');
    }
    const resume = raw.resume as { name: string; type: string; data: string };
    const data = resume.data.startsWith('data:') ? resume.data.slice(resume.data.indexOf(',') + 1) : resume.data;
    if (data.length > MAX_BASE64_LENGTH) throw new PayloadError(`Resume too large. Maximum ${MAX_RESUME_MB} MB.`);
    if (resume.name.length > 500 || resume.type.length > 100) throw new PayloadError('Invalid resume file name or type.');
    fields.resume = { ...resume, data };
  }
  // These default to empty for the branch-specific required-field checks below.
  return { firstName: '', lastName: '', email: '', message: '', ...fields } as unknown as ContactPayload;
}

function isUsableEmail(value: string): boolean {
  if (!/^[^\s@<>"\x00-\x1f\x7f]+@[^\s@<>"\x00-\x1f\x7f]+\.[^\s@<>"\x00-\x1f\x7f]+$/.test(value)) return false;
  const [local, domain] = value.split('@');
  return local.length <= 64 && !local.startsWith('.') && !local.endsWith('.') && !local.includes('..') &&
    domain.split('.').every((label) => label.length > 0 && label.length <= 63 &&
      !label.startsWith('-') && !label.endsWith('-') && /^[\p{L}\p{N}-]+$/u.test(label));
}

function isUsablePhone(value: string): boolean {
  // Accept common international punctuation and optional extensions, not arbitrary prose.
  const parts = value.split(/\s*(?:ext\.?|x|#)\s*/i);
  if (parts.length > 2 || (parts[1] !== undefined && !/^\d{1,6}$/.test(parts[1]))) return false;
  const number = parts[0];
  const digits = number.replace(/\D/g, '');
  return /^\+?[\d\s()./\-]+$/.test(number) && digits.length >= 7 && digits.length <= 15;
}

function isProductionRequest(request: Request): boolean {
  const production = (value: string) => {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && ['westsideprolandscape.com', 'www.westsideprolandscape.com'].includes(url.hostname);
    } catch { return false; }
  };
  return production(request.url) && ['origin', 'referer'].every((key) => !request.headers.get(key) || production(request.headers.get(key)!));
}

/** Long company names are shortened in the subject only; the body keeps the full name. */
const MAX_SUBJECT_COMPANY_LENGTH = 60;
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

/** Preview test mode may only redirect notifications to a company mailbox. */
function testRecipient(env: Env): string | null {
  const value = env.CONTACT_TEST_RECIPIENT?.trim().toLowerCase() || '';
  return /^[a-z0-9._%+-]+@westsideprolandscape\.com$/.test(value) ? value : null;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  let payload: ContactPayload;
  try {
    payload = await readPayload(request);
  } catch (error) {
    return json(error instanceof PayloadError ? error.status : 400, {
      success: false, message: error instanceof PayloadError ? error.message : 'Invalid request body.',
    });
  }

  const { firstName, lastName, email, message, turnstileToken } = payload;
  const isCareer = payload.service === 'Career Inquiry';
  if (!firstName || !lastName || (!isCareer && (!email || !message))) {
    return json(400, { success: false, message: isCareer
      ? 'First name and last name are required.'
      : 'First name, last name, email, and message are required.' });
  }
  if (isCareer && !email && !payload.phone) {
    return json(400, { success: false, message: 'Please provide an email address or phone number so we can contact you.' });
  }
  if (email && !isUsableEmail(email)) {
    return json(400, { success: false, message: 'Please enter a valid email address.' });
  }
  if (payload.phone && !isUsablePhone(payload.phone)) {
    return json(400, { success: false, message: 'Please enter a valid phone number, including the area or country code.' });
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
    if (!Object.hasOwn(ALLOWED_TYPES, type)) {
      return json(400, { success: false, message: 'Please attach a PDF, DOC, or DOCX resume.' });
    }
    resumeName = sanitizeFilename(payload.resume.name, ALLOWED_TYPES[type]);
    if (!resumeName) {
      return json(400, { success: false, message: 'Please use a valid resume file name ending in .pdf, .doc, or .docx that matches its type.' });
    }

    try {
      resumeBytes = base64ToUint8Array(data);
    } catch {
      return json(400, { success: false, message: 'Invalid file data.' });
    }

    if (resumeBytes.byteLength === 0) {
      return json(400, { success: false, message: 'Empty file.' });
    }
    if (resumeBytes.byteLength > MAX_RESUME_BYTES) {
      return json(400, { success: false, message: `Resume too large. Maximum ${MAX_RESUME_MB} MB.` });
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
  const propertyType = isPropertyType(payload.propertyType) ? payload.propertyType : '';
  // Collapse whitespace so a pasted multi-line name cannot reshape the subject line.
  const company = typeof payload.company === 'string' ? payload.company.replace(/\s+/g, ' ').trim() : '';
  const projectType = payload.projectType?.trim().slice(0, 120) || '';
  const budget = payload.budget?.trim().slice(0, 60) || '';
  const timing = payload.timing?.trim().slice(0, 60) || '';
  const howHeard = payload.howHeard?.trim() || 'Not specified';
  const attribution = sanitizeAttribution(payload.attribution);
  const careerPosition = payload.careerPosition || '';
  const careerAvailability = payload.careerAvailability || '';
  const referredBy = payload.referredBy || '';
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
  const previewRecipient = testRecipient(env);
  const notifyRecipients = previewRecipient ? [previewRecipient] : NOTIFY;

  const inquiryType = isCareer ? 'Career Inquiry' : 'Estimate Request';
  // Property type, company, and budget in the subject line let the office triage
  // from the inbox list view. Homes are the default case, so only other property
  // types are called out.
  const flaggedPropertyType = !isCareer && propertyType !== RESIDENTIAL_PROPERTY_TYPE ? propertyType : '';
  const subjectCompany =
    company.length > MAX_SUBJECT_COMPANY_LENGTH ? `${company.slice(0, MAX_SUBJECT_COMPANY_LENGTH - 1).trimEnd()}…` : company;
  const subjectWho = `${firstName.trim()} ${lastName.trim()}${!isCareer && subjectCompany ? ` (${subjectCompany})` : ''}`;
  const subjectScope = isCareer ? careerPosition || service : [flaggedPropertyType, projectType || service, budget].filter(Boolean).join(' — ');
  const subject = `[${inquiryType}] ${subjectWho}${isCareer ? ' - ' : ' — '}${subjectScope || service}`.replace(/\s+/g, ' ').trim().slice(0, 400);

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
    propertyType: isCareer ? '' : propertyType,
    company: isCareer ? '' : company,
    projectType,
    budget,
    timing,
    howHeard,
    careerPosition,
    careerAvailability,
    referredBy,
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
          toRecipients: notifyRecipients.map((addr) => ({ emailAddress: { address: addr } })),
          ccRecipients: isCareer && !previewRecipient
            ? [{ emailAddress: { address: 'joshuabeldue@westsideprolandscape.com' } }] : [],
          replyTo: email ? [{ emailAddress: { address: email, name: `${firstName} ${lastName}` } }] : [],
          attachments,
          // No Outlook categories: sender-set categories never reached the office
          // mailbox (checked 2026-10-02), so the subject line carries triage info.
        },
        saveToSentItems: false,
      }),
    },
  );

  if (!sendRes.ok) {
    await logMailFailure('notification', sendRes);
    return json(500, { success: false, message: 'Unable to send your message. Please call us instead.' });
  }

  if (email) {
    const confirmationHtml = buildConfirmationEmail({ firstName, service, isCareer });
    // Keep the Worker alive, but never report an accepted notification as failed
    // just because its optional acknowledgement could not be sent.
    const confirmation = fetch(`https://graph.microsoft.com/v1.0/users/${SENDER}/sendMail`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${graphToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          subject: isCareer
            ? 'Application received - Westside Professional Landscape'
            : 'We received your request — Westside Professional Landscape',
          body: { contentType: 'HTML', content: confirmationHtml },
          toRecipients: [{ emailAddress: { address: email, name: `${firstName} ${lastName}` } }],
          replyTo: [{ emailAddress: { address: REPLY_TO, name: 'Westside Professional Landscape' } }],
        },
        saveToSentItems: false,
      }),
    }).then(async (response) => {
      if (!response.ok) await logMailFailure('confirmation', response);
    }).catch((error) => console.error('Graph sendMail (confirmation) request failed:', error instanceof Error ? error.name : 'UnknownError'));
    context.waitUntil(confirmation);
  }

  // Career inquiries are not customer leads. Exit BEFORE building/hashing user
  // data, independently of browser tags, tokens, or legacy form field shape.
  if (isCareer || previewRecipient || !isProductionRequest(request)) {
    return json(200, { success: true });
  }
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
        form_type: 'estimate_request',
        ...(propertyType ? { property_type: propertyType } : {}),
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

async function logMailFailure(kind: 'notification' | 'confirmation', response: Response): Promise<void> {
  // Graph error messages can echo addresses or content. Keep exact status/code
  // and correlation ID, never log applicant data or the raw response body.
  let code = 'UnknownError';
  try {
    const body = await response.json() as { error?: { code?: unknown } };
    if (typeof body.error?.code === 'string' && /^[A-Za-z0-9_.-]{1,100}$/.test(body.error.code)) code = body.error.code;
  } catch { /* Non-JSON service failure; HTTP status still identifies it. */ }
  console.error(`Graph sendMail (${kind}) failed:`, response.status, code, response.headers.get('request-id') || 'no-request-id');
}

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
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .replace(/["<>:|?*]/g, '_');
  if (!cleaned || !cleaned.toLowerCase().endsWith(expectedExtension)) return '';
  const stem = cleaned.slice(0, -expectedExtension.length).trim();
  if (!stem || /^\.+$/.test(stem)) return '';
  return `${stem.slice(0, MAX_FILENAME_LENGTH - expectedExtension.length)}${expectedExtension}`;
}

function base64ToUint8Array(base64: string): Uint8Array {
  // Data URL prefixes were normalized at the boundary; reject malformed base64.
  if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(base64)) {
    throw new Error('Invalid base64');
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function phoneLink(raw: string): string {
  const [number, extension] = raw.split(/\s*(?:ext\.?|x|#)\s*/i);
  return `${number.trim().startsWith('+') ? '+' : ''}${number.replace(/\D/g, '')}${extension ? `;ext=${extension}` : ''}`;
}

function formatPhone(raw: string): string {
  if (/(?:ext\.?|x|#)/i.test(raw) || (raw.startsWith('+') && !raw.startsWith('+1'))) return raw;
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
  propertyType: string;
  company: string;
  projectType: string;
  budget: string;
  timing: string;
  howHeard: string;
  careerPosition: string;
  careerAvailability: string;
  referredBy: string;
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
        row('Property Type', data.propertyType ? `<strong>${esc(data.propertyType)}</strong>` : notProvided),
        row('Project Type', data.projectType ? `<strong>${esc(data.projectType)}</strong>` : notProvided),
        row('Budget', data.budget ? `<strong>${esc(data.budget)}</strong>` : notProvided),
        row('Timing', data.timing ? esc(data.timing) : notProvided),
      ].join('');

  const attributionHtml = data.attribution.length
    ? `<tr><td colspan="2" style="padding:20px 0 8px;">
         <span style="font-size:12px;font-weight:700;color:#666;text-transform:uppercase;letter-spacing:1px;">${data.isCareer ? 'Acquisition attribution' : 'Where this lead came from'}</span>
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
    ${!data.isCareer && data.propertyType && data.propertyType !== RESIDENTIAL_PROPERTY_TYPE
      ? `<br><span style="display:inline-block;margin-top:8px;padding:3px 10px;border-radius:12px;background:#e7f4ec;color:#00572B;font-size:12px;font-weight:700;letter-spacing:0.5px;">${esc(data.propertyType.toUpperCase())}</span>`
      : ''}
  </td></tr>
  <tr><td style="padding:8px 32px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#333;">
      ${row('Name', `<strong>${esc(data.firstName)} ${esc(data.lastName)}</strong>`)}
      ${data.company ? row('Company', `<strong>${esc(data.company)}</strong>`) : ''}
      ${row('Email', data.email ? `<a href="mailto:${esc(encodeURIComponent(data.email))}" style="color:#00863F;">${esc(data.email)}</a>` : notProvided)}
      ${row('Phone', data.phone ? `<a href="tel:${esc(phoneLink(data.phone))}" style="color:#00863F;">${esc(data.phone)}</a>` : notProvided)}
      ${row('Prefers', data.contactPreference ? esc(data.contactPreference) : notProvided)}
      ${data.isCareer ? [
        row('Position', data.careerPosition ? esc(data.careerPosition) : notProvided),
        row('Availability', data.careerAvailability ? esc(data.careerAvailability).replace(/\n/g, '<br>') : notProvided),
        row('Referred By', data.referredBy ? esc(data.referredBy) : notProvided),
      ].join('') : [
        row('Address', data.address ? esc(data.address) : notProvided),
        row('ZIP', data.zip ? esc(data.zip) : notProvided),
        row('Service', esc(data.service)),
      ].join('')}
      ${projectRows}
      ${row('How Heard', esc(data.howHeard))}
      <tr><td style="padding:8px 0;color:#666;vertical-align:top;">${data.isCareer ? 'Relevant Experience' : 'Message'}</td>
          <td style="padding:8px 0;">${messageHtml || notProvided}</td></tr>
      ${data.isCareer ? row('Resume', data.hasResume ? 'Attached to this email' : notProvided) : ''}
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
    ? `Thank you for your interest in joining the Westside team. We've received your application. This email confirms receipt only; it does not guarantee an interview or a job offer.`
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
