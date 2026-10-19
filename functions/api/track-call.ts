/** POST /api/track-call/: customer phone-click Contact CAPI, never recruiting. */
import { buildUserData, extractClientIp, readCookie, sendCapiEvent } from '../_lib/meta-capi';

interface Env {
  META_ACCESS_TOKEN?: string;
  META_TEST_EVENT_CODE?: string;
  CONTACT_TEST_RECIPIENT?: string;
}

interface TrackCallPayload {
  event_id?: string;
  url?: string;
  fbp?: string;
  fbc?: string;
}

function productionUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && ['westsideprolandscape.com', 'www.westsideprolandscape.com'].includes(url.hostname) ? url : null;
  } catch { return null; }
}

function careerUrl(url: URL): boolean {
  return /^\/careers?(?:\/|$)/i.test(url.pathname) ||
    ['career inquiry', 'career-inquiry', 'careers', 'career'].includes((url.searchParams.get('service') || '').toLowerCase());
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const ok = () => new Response(JSON.stringify({ ok: true }), {
    status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
  // Fail closed for analytics only; never affect phone navigation or form mail.
  if (!productionUrl(request.url) || env.CONTACT_TEST_RECIPIENT) return ok();
  let body: TrackCallPayload;
  try {
    // Minimal call metadata should never approach this size, even with cookies.
    if (Number(request.headers.get('content-length')) > 8192) return ok();
    const reader = request.body?.getReader();
    if (!reader) return ok();
    const decoder = new TextDecoder();
    let text = '';
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 8192) { await reader.cancel(); return ok(); }
      text += decoder.decode(value, { stream: true });
    }
    const raw: unknown = JSON.parse(text + decoder.decode());
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return ok();
    const fields = raw as Record<string, unknown>;
    if (['event_id', 'url', 'fbp', 'fbc'].some((key) => fields[key] !== undefined && typeof fields[key] !== 'string')) return ok();
    body = fields as TrackCallPayload;
  } catch { return ok(); }

  const sources = [body.url, request.headers.get('referer'), request.headers.get('origin')].filter((value): value is string => !!value);
  if (!sources.length) return ok();
  for (const source of sources) {
    const url = productionUrl(source);
    // A forwarded preview URL or a career referrer independently blocks CAPI.
    if (!url || careerUrl(url)) return ok();
  }
  try {
    const userData = await buildUserData({
      country: 'us',
      clientIp: extractClientIp(request),
      userAgent: request.headers.get('user-agent') || undefined,
      fbc: readCookie(request, '_fbc') || body.fbc || undefined,
      fbp: readCookie(request, '_fbp') || body.fbp || undefined,
    });
    await sendCapiEvent({
      accessToken: env.META_ACCESS_TOKEN || '',
      eventName: 'Contact',
      eventId: body.event_id,
      eventSourceUrl: body.url || request.headers.get('referer') || undefined,
      userData,
      customData: { contact_method: 'phone_call' },
      testEventCode: env.META_TEST_EVENT_CODE,
    });
  } catch (error) {
    console.error('Meta CAPI Contact dispatch threw:', error instanceof Error ? error.name : 'UnknownError');
  }
  return ok();
};
