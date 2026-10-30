import { expect, test } from '@playwright/test';
import { onRequestPost } from '../functions/api/contact';
import { onRequestPost as trackCall } from '../functions/api/track-call';
import { MAX_RESUME_BYTES, MAX_RESUME_MB } from '../src/data/form-limits';

/**
 * Server-side coverage for POST /api/contact/. The static Playwright server never
 * runs Pages Functions, so this calls the handler directly with every outbound
 * service (Turnstile, Azure AD, Microsoft Graph, Meta) stubbed. Nothing is sent.
 */

type Captured = { url: string; body: unknown };

const realFetch = globalThis.fetch;
const realDigest = crypto.subtle.digest.bind(crypto.subtle);
let hashCalls = 0;
let confirmationStatus = 202;
let confirmationThrows = false;
let captured: Captured[] = [];

const ENV = {
  TURNSTILE_SECRET: 'test-secret',
  AZURE_TENANT_ID: 'tenant',
  AZURE_CLIENT_ID: 'client',
  AZURE_CLIENT_SECRET: 'secret',
  META_ACCESS_TOKEN: 'test-token',
};

const BASE = {
  firstName: 'Jack',
  lastName: 'Chen',
  email: 'jack@example.com',
  phone: '5855550123',
  message: 'Seasonal plowing and salting for our tenant lot.',
  turnstileToken: 'token',
  eventId: 'evt-1',
  service: 'Snow & Ice Management',
};

function stubFetch() {
  captured = [];
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    let body: unknown = init?.body;
    if (typeof body === 'string' && body.startsWith('{')) body = JSON.parse(body);
    captured.push({ url, body });
    if (url.includes('turnstile')) return Response.json({ success: true });
    if (url.includes('login.microsoftonline.com')) return Response.json({ access_token: 'graph-token' });
    if (url.includes('graph.microsoft.com')) {
      if (captured.filter((call) => call.url.endsWith('/sendMail')).length > 1) {
        if (confirmationThrows) throw new TypeError('network failed');
        if (confirmationStatus !== 202) return Response.json({ error: { code: 'ErrorAccessDenied', message: BASE.email } }, {
          status: confirmationStatus, headers: { 'request-id': 'test-correlation-id' },
        });
      }
      return new Response(null, { status: 202 });
    }
    if (url.includes('graph.facebook.com')) return Response.json({ events_received: 1 });
    throw new Error(`Unexpected outbound request in test: ${url}`);
  }) as typeof fetch;
}

async function submit(fields: Record<string, unknown>, env: Record<string, string> = {}) {
  const request = new Request('https://westsideprolandscape.com/api/contact/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...BASE, ...fields }),
  });
  return invoke(request, env);
}

async function invoke(request: Request, env: Record<string, string> = {}) {
  const pending: Promise<unknown>[] = [];
  const context = {
    request,
    env: { ...ENV, ...env },
    waitUntil: (promise: Promise<unknown>) => pending.push(promise),
  } as unknown as Parameters<typeof onRequestPost>[0];
  const response = await onRequestPost(context);
  await Promise.all(pending); // the customer confirmation is sent via waitUntil
  return response;
}

/** The office notification is the first Graph sendMail call. */
function notification() {
  const mail = captured.find((c) => c.url.endsWith('/sendMail'));
  return (mail?.body as { message: { subject: string; body: { content: string } } }).message;
}

function capiCustomData() {
  const meta = captured.find((c) => c.url.includes('graph.facebook.com'));
  return (meta?.body as { data: Array<{ custom_data: Record<string, string> }> }).data[0].custom_data;
}

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Server-side only; one project is enough.');
  stubFetch();
  hashCalls = 0;
  confirmationStatus = 202;
  confirmationThrows = false;
  crypto.subtle.digest = ((...args: Parameters<typeof realDigest>) => {
    hashCalls++;
    return realDigest(...args);
  }) as typeof crypto.subtle.digest;
});

test.afterEach(() => {
  globalThis.fetch = realFetch;
  crypto.subtle.digest = realDigest;
});

test.describe('contact Function: property type and company', () => {
  test('a commercial request names the company and property type for triage', async () => {
    const response = await submit({ propertyType: 'Commercial', company: 'Chen Realty Group', budget: 'Not sure yet; help me scope it' });
    expect(response.status).toBe(200);

    const mail = notification();
    expect(mail.subject).toBe(
      '[Estimate Request] Jack Chen (Chen Realty Group) — Commercial — Snow & Ice Management — Not sure yet; help me scope it'
    );
    expect(mail.body.content).toContain('Chen Realty Group');
    expect(mail.body.content).toContain('Property Type');
    expect(mail.body.content).toContain('COMMERCIAL');
    expect(capiCustomData().property_type).toBe('Commercial');
  });

  test('homes stay unflagged in the subject', async () => {
    await submit({ propertyType: 'Home', service: 'Lawn Care' });
    const mail = notification();
    expect(mail.subject).toBe('[Estimate Request] Jack Chen — Lawn Care');
    expect(mail.body.content).toContain('<strong>Home</strong>');
  });

  test('unknown property types are dropped', async () => {
    await submit({ propertyType: '<b>Castle</b>' });
    const mail = notification();
    expect(mail.subject).toBe('[Estimate Request] Jack Chen — Snow & Ice Management');
    expect(mail.body.content).not.toContain('Castle');
  });

  test('long company names are rejected, and shortened only in the subject when allowed', async () => {
    const tooLong = await submit({ propertyType: 'Commercial', company: 'A'.repeat(151) });
    expect(tooLong.status).toBe(400);

    stubFetch();
    const longName = `Lakeside Business Park Owners Association of Greater Rochester ${'B'.repeat(40)}`;
    await submit({ propertyType: 'HOA / community', company: longName });
    const mail = notification();
    expect(mail.subject).toContain('…) — HOA / community — ');
    expect(mail.body.content).toContain(longName);
  });

  test('preview test mode notifies only the test mailbox and skips Meta', async () => {
    const response = await submit(
      { propertyType: 'Commercial', company: 'Chen Realty Group' },
      { CONTACT_TEST_RECIPIENT: 'JoshuaBeldue@westsideprolandscape.com' }
    );
    expect(response.status).toBe(200);
    const sends = captured.filter((c) => c.url.endsWith('/sendMail'));
    const recipients = (body: unknown) =>
      (body as { message: { toRecipients: Array<{ emailAddress: { address: string } }> } }).message.toRecipients.map(
        (r) => r.emailAddress.address
      );
    expect(recipients(sends[0].body)).toEqual(['joshuabeldue@westsideprolandscape.com']);
    expect(recipients(sends[1].body)).toEqual(['jack@example.com']); // customer confirmation still sends
    expect(captured.some((c) => c.url.includes('graph.facebook.com'))).toBe(false);
  });

  test('test mode refuses to redirect leads outside the company', async () => {
    await submit({}, { CONTACT_TEST_RECIPIENT: 'someone@gmail.com' });
    const mail = captured.find((c) => c.url.endsWith('/sendMail'));
    const to = (mail?.body as { message: { toRecipients: Array<{ emailAddress: { address: string } }> } }).message.toRecipients;
    expect(to.map((r) => r.emailAddress.address)).toEqual([
      'office@westsideprolandscape.com',
      'brad@westsideprolandscape.com',
    ]);
  });

  test('career inquiries ignore property fields', async () => {
    await submit({ service: 'Career Inquiry', propertyType: 'Commercial', company: 'Somewhere LLC' });
    const mail = notification();
    expect(mail.subject).toBe('[Career Inquiry] Jack Chen - Career Inquiry');
    expect(mail.body.content).not.toContain('Somewhere LLC');
  });
});

type Mail = {
  subject: string;
  body: { content: string };
  toRecipients: Array<{ emailAddress: { address: string } }>;
  ccRecipients?: Array<{ emailAddress: { address: string } }>;
  replyTo: Array<{ emailAddress: { address: string } }>;
  attachments: Array<{ name: string; contentBytes: string }>;
};
const mails = () => captured.filter((call) => call.url.endsWith('/sendMail')).map((call) => (call.body as { message: Mail }).message);
const career = (fields: Record<string, unknown> = {}, env: Record<string, string> = {}) => submit({
  service: 'Career Inquiry', email: '', phone: '', message: undefined, ...fields,
}, env);
const noCapi = () => {
  expect(captured.some((call) => call.url.includes('graph.facebook.com'))).toBe(false);
  expect(hashCalls).toBe(0);
};

test.describe('contact Function: recruiting intake', () => {
  test('email-only with no message, default recipients and career-only CC', async () => {
    expect((await career({ email: 'candidate@example.com' })).status).toBe(200);
    expect(mails()[0].toRecipients.map((r) => r.emailAddress.address)).toEqual(['office@westsideprolandscape.com', 'brad@westsideprolandscape.com', 'jeff@westsideprolandscape.com', 'admin@westsideprolandscape.com']);
    expect(mails()[0].ccRecipients?.map((r) => r.emailAddress.address)).toEqual(['joshuabeldue@westsideprolandscape.com']);
    expect(mails()[0].body.content).toContain('Relevant Experience');
    expect(mails()).toHaveLength(2);
    expect(mails()[1].subject).not.toContain('—');
    expect(mails()[1].body.content).not.toContain('shortly');
    noCapi();
  });

  test('phone-only international number sends no confirmation or empty reply-to', async () => {
    expect((await career({ phone: '+44 (0)20 7946 0958 ext. 12', message: '' })).status).toBe(200);
    expect(mails()).toHaveLength(1);
    expect(mails()[0].replyTo).toEqual([]);
    expect(mails()[0].body.content).toContain('+44 (0)20 7946 0958 ext. 12');
    noCapi();
  });

  for (const fields of [
    {}, { email: 'bad' }, { email: 'a@b..com' }, { email: '.a@example.com' },
    { phone: '555' }, { phone: 'call me tomorrow' }, { phone: '585++5550123' },
    { email: 'bad', phone: '585-555-0123' }, { email: 'ok@example.com', phone: 'bad' },
    { phone: '1234567890123456' }, { firstName: '', email: 'ok@example.com' },
  ]) {
    test(`rejects missing or unusable contact: ${JSON.stringify(fields)}`, async () => {
      expect((await career(fields)).status).toBe(400);
      expect(captured).toEqual([]);
    });
  }

  test('escapes all career fields, removes property rows, caps attribution and flattens subject', async () => {
    const response = await career({
      email: 'ok@example.com', firstName: '<Jack>\r\nQ', lastName: '"Chen"',
      careerPosition: '<Driver>\r\nTest', careerAvailability: '<Soon>\nWeekends & nights',
      referredBy: '<Pat>', howHeard: '<Friend>', contactPreference: '<Email>',
      message: '<script>alert("x")</script>', company: 'IGNORED', address: 'IGNORED ADDRESS',
      zip: '12345', propertyType: 'Commercial', projectType: 'IGNORED PROJECT', budget: 'IGNORED BUDGET', timing: 'IGNORED TIMING',
      attribution: { utm_campaign: '<Ad>' + 'x'.repeat(400), unknown: 'ignored' }, legacyUnknown: { anything: true },
    });
    expect(response.status).toBe(200);
    const mail = mails()[0];
    expect(mail.subject).toBe('[Career Inquiry] <Jack> Q "Chen" - <Driver> Test');
    expect(mail.subject.length).toBeLessThanOrEqual(400);
    for (const text of ['&lt;Jack&gt;', '&quot;Chen&quot;', '&lt;Driver&gt;', '&lt;Soon&gt;', '&lt;Pat&gt;', '&lt;Friend&gt;', '&lt;Email&gt;', '&lt;script&gt;']) expect(mail.body.content).toContain(text);
    for (const text of ['IGNORED', 'Property Type', '>Address<', '>ZIP<', '>Budget<', '<script>']) expect(mail.body.content).not.toContain(text);
    expect(mail.body.content).toContain('&lt;Ad&gt;' + 'x'.repeat(296));
    expect(mail.body.content).not.toContain('x'.repeat(297));
    noCapi();
  });

  for (const [field, limit] of Object.entries({ careerPosition: 160, careerAvailability: 500, referredBy: 120, howHeard: 300, contactPreference: 40, message: 5000 })) {
    test(`${field} accepts its cap and rejects one extra character`, async () => {
      expect((await career({ email: 'ok@example.com', [field]: 'a'.repeat(limit) })).status).toBe(200);
      stubFetch();
      expect((await career({ email: 'ok@example.com', [field]: 'a'.repeat(limit + 1) })).status).toBe(400);
      expect(captured).toEqual([]);
    });
  }

  test('legacy career and unknown fields bypass hashing on production', async () => {
    expect((await submit({ service: 'Career Inquiry', unknownCareerField: ['ignored'] })).status).toBe(200);
    noCapi();
  });

  test('preview recipient overrides career To and CC, but acknowledgement still goes to supplied email', async () => {
    expect((await career({ email: 'test@example.com' }, { CONTACT_TEST_RECIPIENT: 'test@westsideprolandscape.com' })).status).toBe(200);
    expect(mails()[0].toRecipients.map((r) => r.emailAddress.address)).toEqual(['test@westsideprolandscape.com']);
    expect(mails()[0].ccRecipients).toEqual([]);
    expect(mails()[1].toRecipients[0].emailAddress.address).toBe('test@example.com');
    noCapi();
  });

  for (const failure of ['http', 'network']) {
    test(`confirmation ${failure} failure is logged without PII or false submission failure`, async () => {
      confirmationStatus = failure === 'http' ? 403 : 202;
      confirmationThrows = failure === 'network';
      const original = console.error;
      const errors: unknown[][] = [];
      console.error = (...args) => { errors.push(args); };
      try {
        expect((await career({ email: BASE.email })).status).toBe(200);
        expect(JSON.stringify(errors)).toContain(failure === 'http' ? 'ErrorAccessDenied' : 'TypeError');
        if (failure === 'http') expect(JSON.stringify(errors)).toContain('403');
        expect(JSON.stringify(errors)).not.toContain(BASE.email);
      } finally { console.error = original; }
    });
  }

  test('customer requirements, routing and production Lead CAPI remain intact', async () => {
    for (const fields of [{ email: '' }, { message: '' }, { firstName: '' }, { lastName: '' }]) expect((await submit(fields)).status).toBe(400);
    stubFetch();
    expect((await submit({ service: 'Lawn Care', careerPosition: 'IGNORED POSITION' })).status).toBe(200);
    expect(mails()[0].ccRecipients).toEqual([]);
    expect(mails()[0].body.content).not.toContain('IGNORED POSITION');
    expect(capiCustomData().form_type).toBe('estimate_request');
    expect(hashCalls).toBeGreaterThan(0);
  });

  test('preview hosts still deliver customer mail without conversions, even without test binding', async () => {
    const request = new Request('https://preview.westside-website.pages.dev/api/contact/', { method: 'POST', body: JSON.stringify(BASE) });
    expect((await invoke(request)).status).toBe(200);
    expect(mails()).toHaveLength(2);
    noCapi();
  });
});

test.describe('contact Function: untrusted JSON and attachment bounds', () => {
  for (const value of [null, [], 7, 'text']) {
    test(`rejects root ${JSON.stringify(value)}`, async () => {
      expect((await invoke(new Request('https://westsideprolandscape.com/api/contact/', { method: 'POST', body: JSON.stringify(value) }))).status).toBe(400);
      expect(captured).toEqual([]);
    });
  }
  for (const field of ['firstName', 'lastName', 'email', 'phone', 'service', 'message', 'address', 'zip', 'propertyType', 'company', 'projectType', 'budget', 'timing', 'howHeard', 'contactPreference', 'careerPosition', 'careerAvailability', 'referredBy', 'eventId', 'turnstileToken', 'attribution', 'resume']) {
    test(`rejects malformed ${field} without throwing or fetching`, async () => {
      const values = [null, [], 42, ...(field === 'attribution' ? [] : [{ invalid: true }])];
      for (const value of values) {
        expect((await submit({ [field]: value })).status).toBe(400);
        expect(captured).toEqual([]);
      }
    });
  }
  test('rejects malformed attribution and resume members', async () => {
    for (const fields of [{ attribution: { utm_source: [] } }, { resume: { name: 5, type: 'application/pdf', data: '' } }, { resume: { name: 'x.pdf', type: {}, data: '' } }]) expect((await submit(fields)).status).toBe(400);
    expect(captured).toEqual([]);
  });
  test('bounds actual body bytes and Content-Length independently', async () => {
    for (const [body, headers] of [
      [JSON.stringify({ ...BASE, unknown: 'x'.repeat(3 * 1024 * 1024) }), {}],
      [JSON.stringify(BASE), { 'Content-Length': String(4 * 1024 * 1024) }],
    ] as const) {
      const request = new Request('https://westsideprolandscape.com/api/contact/', { method: 'POST', body, headers });
      expect((await invoke(request)).status).toBe(413);
      expect(captured).toEqual([]);
    }
  });

  const file = (size: number, name = 'resume.pdf', type = 'application/pdf', magic = [0x25, 0x50, 0x44, 0x46]) => {
    const bytes = Buffer.alloc(size);
    if (size >= magic.length) bytes.set(magic);
    return { name, type, data: bytes.toString('base64') };
  };
  test('shared 2 MiB limit accepts exact bytes, rejects one extra byte (same base64 length)', async () => {
    expect(MAX_RESUME_MB).toBe(2);
    expect(MAX_RESUME_BYTES).toBe(2 * 1024 * 1024);
    expect((await career({ email: 'ok@example.com', resume: file(MAX_RESUME_BYTES) })).status).toBe(200);
    expect(Buffer.from(mails()[0].attachments[0].contentBytes, 'base64').byteLength).toBe(MAX_RESUME_BYTES);
    stubFetch();
    const response = await career({ email: 'ok@example.com', resume: file(MAX_RESUME_BYTES + 1) });
    expect(response.status).toBe(400);
    expect((await response.json()).message).toContain('2 MB');
    expect(mails()).toHaveLength(0);
  });
  test('supports PDF, DOC and DOCX magic, normalizes data URL, sanitizes filename', async () => {
    for (const [type, name, magic] of [
      ['application/pdf', '../<resume>.pdf', [0x25, 0x50, 0x44, 0x46]],
      ['application/msword', 'C:\\folder\\resume.doc', [0xd0, 0xcf, 0x11, 0xe0]],
      ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'resume.docx', [0x50, 0x4b, 0x03, 0x04]],
    ] as const) {
      const resume = file(16, name, type, [...magic]);
      resume.data = `data:${type};base64,${resume.data}`;
      expect((await career({ phone: '585-555-0123', resume })).status).toBe(200);
      expect(mails().at(-1)?.attachments[0].name).not.toMatch(/[<>\\/]/);
      expect(mails().at(-1)?.attachments[0].contentBytes).not.toContain('data:');
    }
  });
  test('long filenames retain a matching extension within the 180-character attachment cap', async () => {
    expect((await career({ phone: '585-555-0123', resume: file(16, 'A'.repeat(250) + '.pdf') })).status).toBe(200);
    expect(mails()[0].attachments[0].name).toHaveLength(180);
    expect(mails()[0].attachments[0].name).toMatch(/\.pdf$/);
  });
  test('rejects empty, wrong magic, malformed base64, wrong extension and unsupported files', async () => {
    for (const resume of [file(0), file(16, 'resume.pdf', 'application/pdf', [1, 2, 3, 4]),
      { ...file(16), data: '%%%%' }, file(16, 'resume.exe'), file(16, '.pdf'),
      file(16, 'resume.png', 'image/png'), file(16, 'resume.pdf', 'constructor'),
    ]) {
      expect((await career({ email: 'ok@example.com', resume })).status).toBe(400);
      expect(mails()).toHaveLength(0);
    }
  });
});

test.describe('track-call Function: career and production guards', () => {
  async function call(url: string, fields: unknown, headers: Record<string, string> = {}, env: Record<string, string> = {}) {
    return trackCall({ request: new Request(url, { method: 'POST', body: JSON.stringify(fields), headers }), env: { ...ENV, ...env } } as unknown as Parameters<typeof trackCall>[0]);
  }
  for (const [url, fields, headers, env] of [
    ['https://preview.pages.dev/api/track-call/', { url: 'https://westsideprolandscape.com/' }, {}, {}],
    ['https://westsideprolandscape.com/api/track-call/', { url: 'https://westsideprolandscape.com/careers/' }, {}, {}],
    ['https://westsideprolandscape.com/api/track-call/', { url: 'https://westsideprolandscape.com/' }, { referer: 'https://westsideprolandscape.com/careers/driver/' }, {}],
    ['https://westsideprolandscape.com/api/track-call/', { url: 'https://westsideprolandscape.com/contact/?service=career-inquiry' }, {}, {}],
    ['https://westsideprolandscape.com/api/track-call/', { url: 'https://preview.pages.dev/' }, {}, {}],
    ['https://westsideprolandscape.com/api/track-call/', {}, {}, { CONTACT_TEST_RECIPIENT: 'test@westsideprolandscape.com' }],
    ['https://westsideprolandscape.com/api/track-call/', null, {}, {}],
    ['https://westsideprolandscape.com/api/track-call/', {}, {}, {}],
    ['https://westsideprolandscape.com/api/track-call/', { url: [] }, {}, {}],
  ] as const) {
    test(`skips analytics for ${JSON.stringify([url, fields, headers, env])}`, async () => {
      expect((await call(url, fields, headers, env)).status).toBe(200);
      noCapi();
    });
  }
  test('actual production customer calls retain Contact event and deduplication ID', async () => {
    expect((await call('https://westsideprolandscape.com/api/track-call/', { event_id: 'call-1', url: 'https://westsideprolandscape.com/contact/' })).status).toBe(200);
    const body = captured.find((entry) => entry.url.includes('graph.facebook.com'))?.body as { data: Array<{ event_name: string; event_id: string }> };
    expect(body.data[0].event_name).toBe('Contact');
    expect(body.data[0].event_id).toBe('call-1');
  });
});
