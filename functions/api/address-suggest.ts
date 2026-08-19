/**
 * POST /api/address-suggest/ — Address autocomplete proxy
 *
 * Proxies requests to Google Places API (New) Autocomplete endpoint.
 * Keeps the API key server-side and avoids browser CORS issues.
 *
 * Request body: { input: string, sessionToken?: string }
 * Response: { suggestions: [...] } (Google Places format)
 */

interface Env {
  PLACES_API_KEY?: string;
}

const LOCATION_BIAS = {
  circle: {
    center: { latitude: 43.1566, longitude: -77.6088 },
    radius: 50000.0, // ~31 miles — API max is 50km
  },
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.PLACES_API_KEY) {
    console.error('Address suggestions unavailable: PLACES_API_KEY is not configured');
    return Response.json({ suggestions: [] }, { status: 503 });
  }

  let body: { input?: string; sessionToken?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ suggestions: [] }, { status: 400 });
  }

  const input = body.input?.trim();
  if (!input || input.length < 3) {
    return Response.json({ suggestions: [] });
  }
  if (input.length > 200 || (body.sessionToken?.length ?? 0) > 100) {
    return Response.json({ suggestions: [] }, { status: 400 });
  }

  try {
    const res = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': env.PLACES_API_KEY,
      },
      body: JSON.stringify({
        input,
        sessionToken: body.sessionToken || undefined,
        includedRegionCodes: ['us'],
        locationBias: LOCATION_BIAS,
      }),
    });

    if (!res.ok) {
      console.error(`Places autocomplete failed: HTTP ${res.status}`);
      return Response.json({ suggestions: [] }, { status: 502 });
    }

    return Response.json(await res.json());
  } catch (error) {
    console.error('Places autocomplete request failed:', error);
    return Response.json({ suggestions: [] }, { status: 502 });
  }
};
