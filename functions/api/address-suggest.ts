/**
 * POST /api/address-suggest/ — Address autocomplete proxy
 *
 * Proxies requests to Google Places API (New) Autocomplete endpoint.
 * Keeps the API key server-side and avoids browser CORS issues.
 *
 * Request body: { input: string, sessionToken?: string }
 * Response: { suggestions: [...] } (Google Places format)
 */

const PLACES_API_KEY = 'AIzaSyAWvCy3qmk0g_1A27OJYFftXn73941ac4Q';

const LOCATION_BIAS = {
  circle: {
    center: { latitude: 43.1566, longitude: -77.6088 },
    radius: 50000.0, // ~31 miles — API max is 50km
  },
};

export const onRequestPost: PagesFunction = async ({ request }) => {
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

  try {
    const res = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': PLACES_API_KEY,
      },
      body: JSON.stringify({
        input,
        sessionToken: body.sessionToken || undefined,
        includedRegionCodes: ['us'],
        locationBias: LOCATION_BIAS,
      }),
    });

    if (!res.ok) {
      return Response.json({ suggestions: [] });
    }

    return Response.json(await res.json());
  } catch {
    return Response.json({ suggestions: [] });
  }
};
