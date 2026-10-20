import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { careerRoles, careerJobPosting, formatCareerPay, referralBonus } from '../src/data/careers';
import { mockProductionSite } from './mock-production-site';

async function applicant(page: Page, contact: 'phone' | 'email' = 'phone') {
  await page.fill('#career-first-name', 'Test');
  await page.fill('#career-last-name', 'Applicant');
  await page.fill(`#career-${contact}`, contact === 'phone' ? '5855550123' : 'test@example.com');
  await page.evaluate(() => document.querySelector('.cf-turnstile')?.remove());
}

test('all published roles show their own pay, description, schema and selected application', async ({ page }) => {
  expect(careerRoles.length).toBeGreaterThan(0);
  await page.goto('/careers/');
  await expect(page.locator('#openings article')).toHaveCount(careerRoles.length);
  for (const role of careerRoles) {
    await page.goto(`/careers/${role.slug}/`);
    await expect(page.locator('h1')).toHaveText(role.title);
    await expect(page.locator('main')).toContainText(formatCareerPay(role.pay));
    await expect(page.locator('#career-position')).toHaveValue(role.slug);
    const schema = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
      scripts.map((script) => JSON.parse(script.textContent || '{}')).find((value) => value['@type'] === 'JobPosting'));
    expect(schema).toEqual(careerJobPosting(role));
    expect(schema.baseSalary.value.unitText).toBe(role.pay.unit);
    expect(schema.hiringOrganization.logo).toContain('/sig/westside-logo.png');
  }
});

test('referral bonus appears with its conditions and only for referred hires', async ({ page }) => {
  for (const path of ['/careers/', ...careerRoles.map((role) => `/careers/${role.slug}/`)]) {
    await page.goto(path);
    const box = page.locator('[data-referral-bonus]');
    await expect(box).toHaveCount(1);
    await expect(box).toContainText(`${referralBonus.lead} ${referralBonus.howTo}`);
    await expect(box).toContainText(`${referralBonus.newHire} ${referralBonus.referrer}`);
  }
  // The memo pays the $300 once both thresholds are met; hours may take longer than 30 days for snow hires.
  for (const text of [referralBonus.newHire, referralBonus.incentive]) {
    expect(text).toMatch(/\$300 bonus once .+ 30 days and worked at least 128 hours\.$/);
  }
  // Only referred hires are offered the $300; never word it as a bonus for every new hire.
  expect(referralBonus.incentive).toMatch(/^Hires referred by a Westside employee/);
  for (const role of careerRoles) {
    const schema = careerJobPosting(role);
    expect(schema.incentiveCompensation).toBe(referralBonus.incentive);
    expect(schema.description).toContain(`<h3>Referral bonus</h3><p>Referred by a Westside employee? ${referralBonus.howTo} ${referralBonus.newHire}</p>`);
  }
});

test('job-board descriptions state the pay range and read as plain language', () => {
  for (const role of careerRoles) {
    const { description } = careerJobPosting(role);
    expect(description).toContain(`<h3>Pay</h3><p>${formatCareerPay(role.pay)}.`);
    // Phrases from earlier drafts that read as internal or legal fine print to applicants.
    expect(description).not.toMatch(/applicable New York requirements|benefit eligibility|company driving|reporting location|when applicable|subject to (plan terms|service requirements)/);
  }
});

test('invalid pay cannot generate a public JobPosting', () => {
  for (const pay of [{ min: 0, max: 20 }, { min: 30, max: 20 }, { min: NaN, max: 20 }]) {
    expect(() => careerJobPosting({ ...careerRoles[0], pay: { ...pay, unit: 'HOUR' } })).toThrow('Invalid base-pay range');
  }
});

for (const contact of ['phone', 'email'] as const) {
  test(`${contact}-only application needs no résumé or experience and sends one request`, async ({ page }) => {
    await page.goto(`/careers/${careerRoles[0].slug}/?utm_source=nalp&utm_medium=jobboard`);
    const bodies: Record<string, any>[] = [];
    await page.route('**/api/contact/', async (route) => {
      bodies.push(route.request().postDataJSON());
      await route.fulfill({ json: { success: true } });
    });
    await applicant(page, contact);
    await page.fill('#career-referred-by', 'A colleague');
    await page.fill('#career-availability', 'Weekdays');
    await page.locator('#career-form button[type="submit"]').click();
    await expect(page.locator('#career-form-status')).toContainText('application is in');
    expect(bodies).toHaveLength(1);
    expect(bodies[0]).toMatchObject({ service: 'Career Inquiry', careerPosition: careerRoles[0].title, message: '', referredBy: 'A colleague', careerAvailability: 'Weekdays', attribution: { utm_source: 'nalp' } });
    expect(bodies[0].resume).toBeUndefined();
    expect(bodies[0][contact === 'phone' ? 'email' : 'phone']).toBe('');
    await expect(page.locator('#career-form button[type="submit"]')).toBeDisabled();
  });
}

test('contact requirement, file limits and rejection preserve the application', async ({ page }) => {
  await page.goto('/careers/');
  let requests = 0;
  await page.route('**/api/contact/', async (route) => {
    requests++;
    await route.fulfill({ status: 400, json: { success: false, message: 'Please check the phone number.' } });
  });
  await page.fill('#career-first-name', 'Test');
  await page.fill('#career-last-name', 'Applicant');
  await page.locator('#career-form button[type="submit"]').click();
  expect(await page.locator('#career-phone').evaluate((el: HTMLInputElement) => el.validationMessage)).toContain('phone number or email');
  expect(requests).toBe(0);
  await applicant(page);
  await page.locator('#career-resume').setInputFiles({ name: 'large.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(2 * 1024 * 1024 + 1) });
  await page.locator('#career-form button[type="submit"]').click();
  await expect(page.locator('#career-form-status')).toContainText('2 MB');
  expect(requests).toBe(0);
  await page.locator('#career-resume').setInputFiles({ name: 'resume.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4\n test') });
  await page.locator('#career-form button[type="submit"]').click();
  await expect(page.locator('#career-form-status')).toContainText('check the phone');
  await expect(page.locator('#career-first-name')).toHaveValue('Test');
  await expect(page.locator('#career-form button[type="submit"]')).toBeEnabled();
});

test('legacy redirect retains acquisition attribution', async ({ page }) => {
  await page.goto('/contact/?service=careers&utm_source=school&utm_campaign=autumn');
  await expect(page).toHaveURL(/\/careers\/\?utm_source=school&utm_campaign=autumn#apply/);
  const attribution = await page.evaluate(() => (window as any).__wplAttribution());
  expect(attribution.utm_source).toBe('school');
  expect(attribution.landing_page).toContain('/contact/?service=careers');
});

test('local and preview pages load no analytics or unconditional pixel', async ({ page }) => {
  const trackingRequests: string[] = [];
  page.on('request', (request) => {
    if (/googletagmanager|google-analytics|facebook\.com\/tr|fbevents|bat\.bing/.test(request.url())) trackingRequests.push(request.url());
  });
  await page.goto('/careers/');
  await page.evaluate(() => (window as any).__wplTrackFormSuccess({ service: 'Career Inquiry' }));
  expect(trackingRequests).toEqual([]);
  expect(await page.evaluate(() => (window as any).dataLayer)).toEqual([]);
  await expect(page.locator('noscript img')).toHaveCount(0);
});

test('careers pages have no serious accessibility violations or horizontal overflow', async ({ page }) => {
  for (const path of ['/careers/', `/careers/${careerRoles[0].slug}/`]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});

test.describe('production recruiting conversion separation', () => {
  test.use({ baseURL: 'https://westsideprolandscape.com' });
  test.beforeEach(async ({ page }) => { await mockProductionSite(page); });

  test('career submissions and calls emit recruiting events only, without applicant details', async ({ page }) => {
    await page.goto('/careers/');
    await page.route('**/api/contact/', (route) => route.fulfill({ json: { success: true } }));
    await applicant(page);
    await page.fill('#career-experience', 'PRIVATE applicant experience');
    await page.locator('#career-form button[type="submit"]').click();
    await expect(page.locator('#career-form-status')).toContainText('application is in');
    await page.locator('[data-contact-purpose="career"]').click();
    const events = await page.evaluate(() => ({
      ga: (window as any).dataLayer.map((args: any) => Array.from(args)),
      meta: (window as any).fbq.queue,
      uet: (window as any).uetq,
    }));
    expect(events.ga.filter((event: any) => event[0] === 'event').map((event: any) => event[1])).toEqual(['career_application_submit', 'career_phone_click']);
    expect(JSON.stringify(events)).not.toContain('PRIVATE');
    expect(JSON.stringify(events)).not.toContain('5855550123');
    expect(events.meta).toEqual([]);
    expect(events.uet).toBeUndefined();
  });

  test('legacy manual career submission and phone clicks never emit customer goals', async ({ page }) => {
    await page.goto('/contact/');
    await page.route('**/api/contact/', (route) => route.fulfill({ json: { success: true } }));
    await page.fill('#first-name', 'Test');
    await page.fill('#last-name', 'Applicant');
    await page.selectOption('#service', 'Career Inquiry');
    await page.fill('#phone', '5855550123');
    await page.evaluate(() => document.querySelector('.cf-turnstile')?.remove());
    await page.locator('a[href^="tel:"]').first().click();
    await page.locator('#contact-form button[type="submit"]').click();
    await expect(page.locator('#form-status')).toContainText('Message sent');
    const events = await page.evaluate(() => (window as any).dataLayer.map((args: any) => Array.from(args)));
    expect(events.filter((event: any) => event[0] === 'event').map((event: any) => event[1])).toEqual(['career_phone_click', 'career_application_submit']);
  });
});
