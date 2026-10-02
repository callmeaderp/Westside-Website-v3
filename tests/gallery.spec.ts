import { expect, test } from '@playwright/test';

/**
 * Photo/video gallery and the service-page "From our work" strips. Playwright's
 * bundled Chromium cannot decode H.264, so video checks assert wiring and that
 * the clip is served, not playback.
 */

test.describe('gallery page', () => {
  test('lists the full collection and filters it', async ({ page }) => {
    await page.goto('/gallery/');
    const tiles = page.locator('#gallery-grid .media-item');
    const total = await tiles.count();
    expect(total).toBeGreaterThanOrEqual(40);

    await page.locator('.filter-btn[data-filter="video"]').click();
    await expect(page.locator('.filter-btn[data-filter="video"]')).toHaveAttribute('aria-pressed', 'true');
    const videos = await page.locator('#gallery-grid .media-item[data-kind="video"]').count();
    expect(videos).toBeGreaterThanOrEqual(3);
    await expect(page.locator('#gallery-grid .media-item:visible')).toHaveCount(videos);

    await page.locator('.filter-btn[data-filter="commercial"]').click();
    const commercial = await page.locator('#gallery-grid .media-item[data-category="commercial"]').count();
    expect(commercial).toBeGreaterThan(0);
    await expect(page.locator('#gallery-grid .media-item:visible')).toHaveCount(commercial);

    await page.locator('.filter-btn[data-filter="all"]').click();
    await expect(page.locator('#gallery-grid .media-item:visible')).toHaveCount(total);
  });

  test('?category= deep link preselects a filter', async ({ page }) => {
    await page.goto('/gallery/?category=turf');
    await expect(page.locator('.filter-btn[data-filter="turf"]')).toHaveAttribute('aria-pressed', 'true');
    const turf = await page.locator('#gallery-grid .media-item[data-category="turf"]').count();
    await expect(page.locator('#gallery-grid .media-item:visible')).toHaveCount(turf);
  });

  test('lightbox opens, pages, and returns focus', async ({ page }) => {
    await page.goto('/gallery/');
    const first = page.locator('#gallery-grid .media-item[data-kind="photo"]').first();
    await first.click();

    const lightbox = page.locator('#media-lightbox');
    await expect(lightbox).toHaveClass(/active/);
    await expect(lightbox.locator('.lightbox-img')).toHaveAttribute('src', /\/assets\/.+\.webp/);
    const caption = await lightbox.locator('.lightbox-text').textContent();

    await page.keyboard.press('ArrowRight');
    await expect(lightbox.locator('.lightbox-text')).not.toHaveText(caption ?? '');

    await page.keyboard.press('Escape');
    await expect(lightbox).not.toHaveClass(/active/);
    await expect(first).toBeFocused();
  });

  test('video tiles load their clip into the viewer', async ({ page, request }) => {
    await page.goto('/gallery/');
    const tile = page.locator('#gallery-grid .media-item[data-kind="video"]').first();
    const clip = await tile.getAttribute('data-video');
    expect(clip).toMatch(/^\/media\/video\/.+\.mp4$/);

    await tile.click();
    const video = page.locator('#media-lightbox .lightbox-video');
    await expect(video).toBeVisible();
    await expect(video).toHaveAttribute('src', clip ?? '');
    await expect(page.locator('#media-lightbox .lightbox-img')).toBeHidden();

    const response = await request.get(clip ?? '');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toBe('video/mp4');

    await page.keyboard.press('Escape');
    await expect(video).not.toHaveAttribute('src', /.+/);
  });

  test('every gallery image resolves to a real file', async ({ page }) => {
    const failed: string[] = [];
    page.on('response', (response) => {
      if (/\/assets\/.*\.webp/.test(response.url()) && !response.ok()) {
        failed.push(`${response.status()} ${response.url()}`);
      }
    });
    await page.goto('/gallery/');
    await page.locator('#gallery-grid img').evaluateAll((els) => {
      els.forEach((el) => el.setAttribute('loading', 'eager'));
    });
    await page.waitForLoadState('networkidle');
    expect(failed).toEqual([]);
  });
});

test.describe('service page photo strips', () => {
  for (const route of ['/services/commercial-services/', '/services/artificial-grass/', '/services/lawn-care/']) {
    test(`${route} shows real work that opens in the viewer`, async ({ page }) => {
      await page.goto(route);
      const tiles = page.locator('[data-lightbox-group] .media-item');
      expect(await tiles.count()).toBeGreaterThanOrEqual(3);
      await expect(page.locator('a[href^="/gallery/?category="]')).toBeVisible();

      await tiles.first().click();
      await expect(page.locator('#media-lightbox')).toHaveClass(/active/);
      await page.keyboard.press('Escape');
      await expect(page.locator('#media-lightbox')).not.toHaveClass(/active/);
    });
  }
});
