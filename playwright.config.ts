import { defineConfig, devices } from '@playwright/test';

/**
 * Tests run against the production build in `dist/`, not the dev server —
 * dev-only transforms and unbundled scripts hide real regressions in the
 * shipped output.
 *
 * `astro preview` cannot be used as the Playwright `webServer`: in Astro 7 it
 * daemonizes and the launching process exits immediately, which Playwright
 * reports as "Process from config.webServer exited early". tests/static-server.mjs
 * serves dist/ in the foreground with the same trailing-slash and 404 behaviour.
 *
 * The suite also uses its own port, because Astro's default 4321 is frequently
 * already held by a developer's dev/preview server from another checkout.
 */
const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 4331);
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],

  webServer: {
    command: `node tests/static-server.mjs ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
