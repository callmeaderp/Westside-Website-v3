/**
 * Meta Conversions API (CAPI) helper for Pages Functions.
 *
 * Mirrors browser-side fbq events server-side so Meta can dedupe and recover
 * conversion signal lost to ad blockers, ITP, and iOS opt-outs. Browser event
 * + server event with the same `event_id` are treated as one conversion.
 *
 * Pixel ID and API version are pinned here. The access token comes from the
 * Cloudflare Pages secret `META_ACCESS_TOKEN`. If the secret is missing or
 * the API call fails, we log and swallow — CAPI is supplementary and must
 * never break the form/click handler.
 *
 * Hashing: all user_data PII fields use SHA-256 hex (lowercase) after
 * trim+lowercase normalization, per Meta's spec.
 *   https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters
 */
export const META_PIXEL_ID = '414143897932367';
export const META_API_VERSION = 'v21.0';

/** Hash a normalized value (trim + lowercase) with SHA-256 → lowercase hex. */
export async function sha256Hex(value: string): Promise<string> {
  const normalized = value.trim().toLowerCase();
  const bytes = new TextEncoder().encode(normalized);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Read a named cookie from a Request. Returns the raw value or null. */
export function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get('cookie');
  if (!header) return null;
  for (const part of header.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) return decodeURIComponent(rest.join('=')) || null;
  }
  return null;
}

/** Extract the best-guess client IP (XFF first hop, then CF header). */
export function extractClientIp(request: Request): string | undefined {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  const cf = request.headers.get('cf-connecting-ip');
  return cf || undefined;
}

/** Best-effort 5-digit US ZIP extraction from a free-form address string. */
export function extractZip(address: string): string | undefined {
  const m = address.match(/\b(\d{5})(?:-\d{4})?\b/);
  return m ? m[1] : undefined;
}

/** Best-effort 2-letter US state extraction (e.g. ", NY 14624"). */
export function extractStateCode(address: string): string | undefined {
  const m = address.match(/,\s*([A-Za-z]{2})\s+\d{5}\b/);
  return m ? m[1].toLowerCase() : undefined;
}

/** Best-effort city extraction (token before ", ST ZIP"). */
export function extractCity(address: string): string | undefined {
  const m = address.match(/,\s*([^,]+?),\s*[A-Za-z]{2}\s+\d{5}\b/);
  return m ? m[1].trim() : undefined;
}

/** Build a user_data object, hashing PII and omitting empty fields. */
export interface UserDataInput {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  clientIp?: string;
  userAgent?: string;
  fbc?: string;
  fbp?: string;
}

export async function buildUserData(input: UserDataInput): Promise<Record<string, unknown>> {
  const out: Record<string, unknown> = {};

  // Hashed PII — arrays per Meta spec
  if (input.email) {
    const v = input.email.trim();
    if (v) out.em = [await sha256Hex(v)];
  }
  if (input.phone) {
    const digits = input.phone.replace(/\D/g, '');
    if (digits) out.ph = [await sha256Hex(digits)];
  }
  if (input.firstName) {
    const v = input.firstName.trim();
    if (v) out.fn = [await sha256Hex(v)];
  }
  if (input.lastName) {
    const v = input.lastName.trim();
    if (v) out.ln = [await sha256Hex(v)];
  }
  if (input.city) {
    const v = input.city.replace(/\s+/g, '').trim();
    if (v) out.ct = [await sha256Hex(v)];
  }
  if (input.state) {
    const v = input.state.trim();
    if (v.length === 2) out.st = [await sha256Hex(v)];
  }
  if (input.zip) {
    const v = input.zip.trim();
    if (v) out.zp = [await sha256Hex(v)];
  }
  if (input.country) {
    const v = input.country.trim();
    if (v) out.country = [await sha256Hex(v)];
  }

  // Plaintext context — Meta uses these to dedupe / match
  if (input.clientIp) out.client_ip_address = input.clientIp;
  if (input.userAgent) out.client_user_agent = input.userAgent;
  if (input.fbc) out.fbc = input.fbc;
  if (input.fbp) out.fbp = input.fbp;

  return out;
}

export interface SendEventArgs {
  accessToken: string;
  eventName: 'Lead' | 'Contact' | string;
  eventId?: string;
  eventSourceUrl?: string;
  userData: Record<string, unknown>;
  customData?: Record<string, unknown>;
  testEventCode?: string;
}

/**
 * Send a single event to Meta CAPI. Returns a brief status string for logging.
 * Never throws — failure path logs and returns "failed".
 */
export async function sendCapiEvent(args: SendEventArgs): Promise<string> {
  if (!args.accessToken) {
    console.warn('Meta CAPI skipped: META_ACCESS_TOKEN not configured');
    return 'skipped';
  }

  const event: Record<string, unknown> = {
    event_name: args.eventName,
    event_time: Math.floor(Date.now() / 1000),
    action_source: 'website',
    user_data: args.userData,
  };
  if (args.eventId) event.event_id = args.eventId;
  if (args.eventSourceUrl) event.event_source_url = args.eventSourceUrl;
  if (args.customData) event.custom_data = args.customData;

  const body: Record<string, unknown> = { data: [event] };
  if (args.testEventCode) body.test_event_code = args.testEventCode;

  const url = `https://graph.facebook.com/${META_API_VERSION}/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(args.accessToken)}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error(`Meta CAPI ${args.eventName} failed: ${res.status} ${errText}`);
      return 'failed';
    }
    return 'ok';
  } catch (err) {
    console.error(`Meta CAPI ${args.eventName} threw:`, err);
    return 'failed';
  }
}
