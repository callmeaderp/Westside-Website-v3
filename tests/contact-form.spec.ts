import { expect, test } from '@playwright/test';

/**
 * Contact-form coverage. The form is the only conversion surface on the site,
 * so these lock down both the new qualification fields and the existing
 * attribution/conversion wiring the overhaul must not break.
 */

test.describe('field structure', () => {
  test('required vs optional is explicit', async ({ page }) => {
    await page.goto('/contact/');

    for (const name of ['first_name', 'last_name', 'email', 'phone']) {
      await expect(page.locator(`[name="${name}"]`)).toHaveAttribute('required', '');
    }
    await expect(page.locator('[name="message"]')).toHaveAttribute('required', '');

    // Qualification fields must stay optional — gating on budget kills leads.
    for (const name of ['project_type', 'budget', 'timing', 'zip', 'address']) {
      await expect(page.locator(`[name="${name}"]`)).not.toHaveAttribute('required', '');
    }

    await expect(page.locator('#contact-form')).toContainText('Fields marked');
  });

  test('project qualification fields are present and populated', async ({ page }) => {
    await page.goto('/contact/');

    for (const id of ['project-type', 'budget', 'timing']) {
      const select = page.locator(`#${id}`);
      await expect(select).toBeVisible();
      // Placeholder plus real options.
      expect(await select.locator('option').count()).toBeGreaterThan(3);
    }

    await expect(page.locator('#budget')).toContainText('Not sure yet');
    await expect(page.locator('#zip')).toHaveAttribute('inputmode', 'numeric');
    await expect(page.locator('#phone')).toHaveAttribute('inputmode', 'tel');
  });

  test('contact preference offers phone, text, and email', async ({ page }) => {
    await page.goto('/contact/');
    const radios = page.locator('[name="contact_preference"]');
    expect(await radios.count()).toBe(3);
    await expect(radios.first()).toBeChecked();
  });

  test('service dropdown covers every service route', async ({ page }) => {
    await page.goto('/contact/');
    const options = await page.locator('#service option').allTextContents();
    for (const label of [
      'Hardscaping & Outdoor Living',
      'Walkways, Steps & Front Entries',
      'Retaining & Seat Walls',
      'Outdoor Kitchens & Fire Features',
      'Drainage & Grading',
    ]) {
      expect(options).toContain(label);
    }
  });
});

test.describe('service preselection', () => {
  test('?service=<slug> preselects the matching option', async ({ page }) => {
    await page.goto('/contact/?service=retaining-walls');
    await expect(page.locator('#service')).toHaveValue('Retaining & Seat Walls');
  });

  test('career inquiry swaps project fields for the resume upload', async ({ page }) => {
    await page.goto('/contact/?service=careers');
    await expect(page.locator('#service')).toHaveValue('Career Inquiry');
    await expect(page.locator('#resume-upload-group')).not.toHaveClass(/hidden/);
    await expect(page.locator('#project-fields')).toHaveClass(/hidden/);
  });

  test('switching away from careers restores project fields', async ({ page }) => {
    await page.goto('/contact/?service=careers');
    await page.locator('#service').selectOption('Hardscaping & Outdoor Living');
    await expect(page.locator('#project-fields')).not.toHaveClass(/hidden/);
    await expect(page.locator('#resume-upload-group')).toHaveClass(/hidden/);
  });

  test('service hero CTAs land on a preselected contact form', async ({ page }) => {
    await page.goto('/services/outdoor-kitchens/');
    await page.locator('section.hero a.btn-primary').click();
    await expect(page).toHaveURL(/\/contact\/\?service=outdoor-kitchens/);
    await expect(page.locator('#service')).toHaveValue('Outdoor Kitchens & Fire Features');
  });
});

test.describe('acquisition attribution', () => {
  test('campaign parameters are captured on landing and survive navigation', async ({ page }) => {
    await page.goto('/services/hardscaping/?utm_source=google&utm_medium=cpc&utm_campaign=patios-2026&gclid=TEST123');
    await page.goto('/contact/'); // untagged URL, same session

    const attribution = await page.evaluate(() => (window as any).__wplAttribution());
    expect(attribution.utm_source).toBe('google');
    expect(attribution.utm_medium).toBe('cpc');
    expect(attribution.utm_campaign).toBe('patios-2026');
    expect(attribution.gclid).toBe('TEST123');
  });

  test('first touch wins over a later untagged pageview', async ({ page }) => {
    await page.goto('/?utm_source=facebook&utm_campaign=summer');
    await page.goto('/services/');
    await page.goto('/contact/');
    const attribution = await page.evaluate(() => (window as any).__wplAttribution());
    expect(attribution.utm_source).toBe('facebook');
    expect(attribution.utm_campaign).toBe('summer');
  });

  test('fbclid and msclkid are captured', async ({ page }) => {
    await page.goto('/contact/?fbclid=FB_TEST&msclkid=MS_TEST');
    const attribution = await page.evaluate(() => (window as any).__wplAttribution());
    expect(attribution.fbclid).toBe('FB_TEST');
    expect(attribution.msclkid).toBe('MS_TEST');
  });

  test('untagged visits still record a landing page', async ({ page }) => {
    await page.goto('/contact/');
    const attribution = await page.evaluate(() => (window as any).__wplAttribution());
    expect(attribution.landing_page).toContain('/contact/');
  });
});

test.describe('conversion wiring is preserved', () => {
  test('Google Ads send-to remains on the form', async ({ page }) => {
    await page.goto('/contact/');
    const sendTo = await page.locator('#contact-form').getAttribute('data-ads-send-to');
    expect(sendTo).toMatch(/^AW-\d+\/.+/);
  });

  test('gtag and fbq stubs initialize', async ({ page }) => {
    await page.goto('/contact/');
    expect(await page.evaluate(() => typeof (window as any).gtag)).toBe('function');
    expect(await page.evaluate(() => typeof (window as any).fbq)).toBe('function');
  });

  test('submission posts the qualification and attribution payload', async ({ page }) => {
    await page.goto('/services/hardscaping/?utm_source=google&utm_campaign=patios-2026');
    await page.goto('/contact/');

    // Intercept rather than actually submitting — the endpoint sends real mail.
    let body: Record<string, unknown> | null = null;
    await page.route('**/api/contact/', async (route) => {
      body = JSON.parse(route.request().postData() || '{}');
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' });
    });

    await page.fill('#first-name', 'Test');
    await page.fill('#last-name', 'Homeowner');
    await page.fill('#email', 'test@example.com');
    await page.fill('#phone', '5855550123');
    await page.fill('#zip', '14624');
    await page.selectOption('#service', 'Hardscaping & Outdoor Living');
    await page.selectOption('#project-type', 'Paver patio');
    await page.selectOption('#budget', '$25,000 – $50,000');
    await page.selectOption('#timing', 'Within 1–3 months');
    await page.fill('#message', 'Looking for a patio off the back of the house.');

    // Turnstile blocks submission in a real browser; bypass the widget gate.
    await page.evaluate(() => {
      document.querySelector('.cf-turnstile')?.remove();
    });
    await page.locator('#contact-form button[type="submit"]').click();
    await expect.poll(() => body).not.toBeNull();

    const payload = body as unknown as Record<string, unknown>;
    expect(payload.projectType).toBe('Paver patio');
    expect(payload.budget).toBe('$25,000 – $50,000');
    expect(payload.timing).toBe('Within 1–3 months');
    expect(payload.zip).toBe('14624');
    expect(payload.contactPreference).toBe('Phone call');
    expect(payload.eventId).toBeTruthy();
    expect((payload.attribution as Record<string, string>).utm_source).toBe('google');
    expect((payload.attribution as Record<string, string>).utm_campaign).toBe('patios-2026');
  });
});
