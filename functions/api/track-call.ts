/**
 * POST /api/track-call/ — Meta CAPI Contact event for phone clicks
 *
 * Fired from the global tel:-link click handler in TrackingScripts.astro.
 * The browser sends a minimal JSON payload (event_id, url, optional fbp/fbc)
 * via fetch({keepalive: true}) so the request survives navigation to the
 * dialer. We dispatch a server-side `Contact` event to Meta CAPI with
 * IP/UA/cookies; Meta dedupes with the matching browser-side
 * fbq('track','Contact', {}, {eventID}) call via the shared event_id.
 *
 * CAPI failure is logged and swallowed — the endpoint always responds 200
 * so the page never sees a broken request.
 *
 * Environment secrets:
 *   META_ACCESS_TOKEN — Meta system-user token (never expires)
 *   META_TEST_EVENT_CODE — optional, routes events to Test Events tab only
 */

import {
  buildUserData,
  extractClientIp,
  readCookie,
  sendCapiEvent,
} from '../_lib/meta-capi';

interface Env {
  META_ACCESS_TOKEN?: string;
  META_TEST_EVENT_CODE?: string;
}

interface TrackCallPayload {
  event_id?: string;
  url?: string;
  /** Caller may forward _fbp / _fbc from document.cookie too — server cookies are usually authoritative. */
  fbp?: string;
  fbc?: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: TrackCallPayload = {};
  try {
    body = (await request.json()) as TrackCallPayload;
  } catch {
    // Empty/invalid body is fine — we still try to fire CAPI with what we have.
  }

  // Always return 200 quickly; CAPI dispatch happens in the same request but failure is swallowed.
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
  } catch (err) {
    console.error('Meta CAPI Contact dispatch threw:', err);
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
