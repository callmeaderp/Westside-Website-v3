import type { Page } from '@playwright/test';

/** Render the local build under its production origin without contacting the live
 * website, mail endpoints or advertising networks. Later test routes override it.
 */
export async function mockProductionSite(page: Page) {
  const local = `http://127.0.0.1:${process.env.PLAYWRIGHT_PORT || '4331'}`;
  await page.route('**/*', (route) => route.abort());
  await page.route('https://westsideprolandscape.com/**', async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.startsWith('/api/')) {
      await route.fulfill({ status: 400, contentType: 'application/json', body: '{"success":false,"message":"Unmocked test API request"}' });
      return;
    }
    const response = await route.fetch({ url: `${local}${url.pathname}${url.search}` });
    await route.fulfill({ response });
  });
}
