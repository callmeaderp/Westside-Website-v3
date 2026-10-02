import { expect, test } from '@playwright/test';
import { onRequestPost } from '../functions/api/contact';

/**
 * Server-side coverage for POST /api/contact/. The static Playwright server never
 * runs Pages Functions, so this calls the handler directly with every outbound
 * service (Turnstile, Azure AD, Microsoft Graph, Meta) stubbed. Nothing is sent.
 */

type Captured = { url: string; body: unknown };

const realFetch = globalThis.fetch;
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
    if (url.includes('graph.microsoft.com')) return new Response(null, { status: 202 });
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
});

test.afterEach(() => {
  globalThis.fetch = realFetch;
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
    expect(mail.subject).toBe('[Career Inquiry] Jack Chen — Career Inquiry');
    expect(mail.body.content).not.toContain('Somewhere LLC');
  });
});
