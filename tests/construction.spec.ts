import { expect, test } from '@playwright/test';

/**
 * Construction funnel coverage. These assert the properties the overhaul was
 * built to guarantee — every construction page must route, must offer a hero
 * CTA, and must never publish a price band without its caveat.
 */

const CONSTRUCTION_ROUTES = [
  '/services/hardscaping/',
  '/services/walkways-steps/',
  '/services/retaining-walls/',
  '/services/outdoor-kitchens/',
  '/services/drainage-grading/',
];

const ALL_SERVICE_ROUTES = [
  ...CONSTRUCTION_ROUTES,
  '/services/landscape-design/',
  '/services/landscape-maintenance/',
  '/services/lawn-care/',
  '/services/plant-health/',
  '/services/water-features/',
  '/services/artificial-grass/',
  '/services/snow-ice-management/',
  '/services/commercial-services/',
  '/services/holiday-lighting/',
];

test.describe('routes', () => {
  for (const route of [...ALL_SERVICE_ROUTES, '/projects/', '/services/']) {
    test(`${route} responds 200`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      // Scoped to #main-content: the Astro dev toolbar injects its own h1s
      // into the preview server's output.
      await expect(page.locator('#main-content h1')).toBeVisible();
    });
  }
});

test.describe('hero calls to action', () => {
  // The generic ServiceLayout previously passed no hero buttons at all, which
  // left every service page's first screen a dead end.
  for (const route of ALL_SERVICE_ROUTES) {
    test(`${route} has a hero CTA above the content`, async ({ page }) => {
      await page.goto(route);
      const heroButtons = page.locator('section.hero a.btn');
      await expect(heroButtons.first()).toBeVisible();
      expect(await heroButtons.count()).toBeGreaterThanOrEqual(1);
    });
  }
});

test.describe('investment ranges', () => {
  for (const route of CONSTRUCTION_ROUTES) {
    test(`${route} publishes ranges with the caveat`, async ({ page }) => {
      await page.goto(route);
      const section = page.locator('#investment');
      await expect(section).toBeAttached();
      // A published dollar band without its qualifier reads as a quote.
      await expect(section).toContainText('These are ranges, not quotes.');
      await expect(section).toContainText(/\$[\d,]+/);
    });
  }

  test('hero range link jumps to the investment section', async ({ page }) => {
    await page.goto('/services/hardscaping/');
    await page.locator('section.hero a[href$="#investment"]').click();
    await expect(page.locator('#investment')).toBeInViewport();
  });

  test('financing link points at the live Wells Fargo application', async ({ page }) => {
    await page.goto('/services/hardscaping/');
    const financing = page.locator('#investment a[href*="retailservices.wellsfargo.com"]');
    await expect(financing.first()).toBeVisible();
    await expect(financing.first()).toHaveAttribute('rel', /noopener/);
  });
});

test.describe('project case studies', () => {
  test('projects page lists case studies with scope and range', async ({ page }) => {
    await page.goto('/projects/');
    const cards = page.locator('.project-card');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(6);

    // Every card publishes what was built and the comparable planning range.
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i)).toContainText('What we built');
      await expect(cards.nth(i)).toContainText('Current planning range for comparable work:');
    }

    // "The design challenge" is optional — it renders only for the projects whose
    // original site condition is actually supported (src/data/projects.ts evidence
    // rules), so at least one card has it and none may render an empty block.
    await expect(page.locator('.project-card', { hasText: 'The design challenge' }).first()).toBeVisible();
  });

  test('category filter narrows the grid', async ({ page }) => {
    await page.goto('/projects/');
    const total = await page.locator('.project-card').count();
    await page.locator('.project-filter[data-filter="walkways"]').click();
    const visible = await page.locator('.project-card:not([hidden])').count();
    expect(visible).toBeGreaterThan(0);
    expect(visible).toBeLessThan(total);
  });

  test('every project image resolves to a real file', async ({ page }) => {
    // Assert on the network rather than on decode state: the cards are lazy,
    // so most images below the fold never load during a test run.
    const failed: string[] = [];
    page.on('response', (response) => {
      const url = response.url();
      if (/\/assets\/proj-.*\.webp/.test(url) && !response.ok()) {
        failed.push(`${response.status()} ${url}`);
      }
    });

    await page.goto('/projects/');
    const sources = await page.locator('.project-card img').evaluateAll((els) =>
      els.flatMap((el) => {
        const img = el as HTMLImageElement;
        return [img.getAttribute('src') || '', img.getAttribute('srcset') || ''];
      })
    );
    expect(sources.length).toBeGreaterThan(0);
    for (const value of sources) {
      expect(value, 'project images must have a resolved source').not.toBe('');
    }

    // Force-load every image and confirm none 404s.
    await page.locator('.project-card img').evaluateAll((els) => {
      els.forEach((el) => el.setAttribute('loading', 'eager'));
    });
    await page.waitForLoadState('networkidle');
    expect(failed).toEqual([]);
  });
});

test.describe('professional title claims', () => {
  // NY Education Law §7322 protects the "landscape architect" title. No
  // Westside licence has been found, so the site must never assert one.
  // Phrasings that would constitute a claim if published:
  const CLAIM_PATTERNS = [
    /landscape architecture/,
    /\blandscape architects\b/, // plural reads as a service offering
    /our landscape architect/,
    /westside(?:'s)? landscape architect/,
    /(?:staff|team|in-house|certified) landscape architect/,
  ];

  for (const route of ['/', '/about/', '/services/', '/services/landscape-design/', '/projects/']) {
    test(`${route} makes no landscape-architect claim`, async ({ page }) => {
      await page.goto(route);
      const body = (await page.locator('#main-content').innerText()).toLowerCase();
      for (const pattern of CLAIM_PATTERNS) {
        expect(body, `${route} matched forbidden claim ${pattern}`).not.toMatch(pattern);
      }
    });
  }

  test('the landscape-design page disclaims the licence rather than implying one', async ({ page }) => {
    await page.goto('/services/landscape-design/');
    const body = await page.locator('#main-content').innerText();
    // The one legitimate mention is the FAQ that answers the question honestly.
    expect(body).toContain('licensed landscape architect');
    expect(body).toMatch(/protected by state license|title protected/i);
    expect(body).toContain('design-build landscape contractor');
  });

  test('service metadata makes no landscape-architect claim', async ({ page }) => {
    await page.goto('/services/landscape-design/');
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description?.toLowerCase()).not.toContain('landscape architect');
    const title = await page.title();
    expect(title.toLowerCase()).not.toContain('landscape architect');
  });
});

test.describe('structured data', () => {
  test('service pages emit Service and FAQPage JSON-LD', async ({ page }) => {
    await page.goto('/services/retaining-walls/');
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = blocks.flatMap((raw) => {
      const parsed = JSON.parse(raw);
      const graph = parsed['@graph'] ?? [parsed];
      return graph.map((node: { '@type': string }) => node['@type']);
    });
    expect(types).toContain('Service');
    expect(types).toContain('BreadcrumbList');
    expect(types).toContain('FAQPage');
  });

  test('projects page emits a valid ItemList', async ({ page }) => {
    await page.goto('/projects/');
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const itemList = blocks.map((raw) => JSON.parse(raw)).find((n) => n['@type'] === 'ItemList');
    expect(itemList).toBeTruthy();
    expect(itemList.itemListElement.length).toBeGreaterThanOrEqual(6);
  });
});

test.describe('internal linking', () => {
  test('homepage makes curated projects primary while retaining the full gallery', async ({ page }) => {
    await page.goto('/');
    const main = page.locator('#main-content');
    await expect(main.locator('a[href="/projects/"]').first()).toBeVisible();
    await expect(main.locator('a[href="/gallery/"]')).toContainText('Browse the full photo gallery');
  });

  test('gallery routes visitors to curated project stories and the estimate form', async ({ page }) => {
    await page.goto('/gallery/');
    await expect(page.locator('section.hero a[href="/projects/"]')).toContainText('Explore Featured Projects');
    await expect(page.locator('section.hero a[href="/contact/"]')).toContainText('Start Your Project');
    await expect(page.locator('#main-content')).toContainText('featured projects');
  });

  test('entry CTA matches the form capabilities', async ({ page }) => {
    await page.goto('/services/walkways-steps/');
    await expect(page.locator('#main-content')).not.toContainText(/send us a photo/i);
    await expect(page.locator('#main-content')).toContainText('take an honest look on site');
  });

  test('hardscaping hub links to every construction lane', async ({ page }) => {
    await page.goto('/services/hardscaping/');
    for (const route of CONSTRUCTION_ROUTES.filter((r) => r !== '/services/hardscaping/')) {
      await expect(page.locator(`a[href="${route}"]`).first()).toBeAttached();
    }
  });

  test('no internal link is missing its trailing slash', async ({ page }) => {
    await page.goto('/services/hardscaping/');
    const hrefs = await page.locator('a[href^="/"]').evaluateAll((els) =>
      els.map((el) => el.getAttribute('href') || '')
    );
    for (const href of hrefs) {
      if (href.includes('.') || href.startsWith('#')) continue;
      const path = href.split(/[?#]/)[0];
      expect(path, `${href} must end in a trailing slash`).toMatch(/\/$/);
    }
  });
});
