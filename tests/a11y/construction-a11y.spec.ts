import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * Accessibility gate for the pages the construction overhaul added or
 * substantially rewrote. Scoped to WCAG 2 A/AA, which is the standard the rest
 * of the site was built against.
 */

const PAGES = [
  '/',
  '/services/',
  '/services/hardscaping/',
  '/services/walkways-steps/',
  '/services/retaining-walls/',
  '/services/outdoor-kitchens/',
  '/services/drainage-grading/',
  '/projects/',
  '/contact/',
];

for (const path of PAGES) {
  test(`${path} has no WCAG A/AA violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(
      results.violations.map((v) => `${v.id}: ${v.nodes.length} node(s) — ${v.help}`)
    ).toEqual([]);
  });
}

test('form controls all have accessible labels', async ({ page }) => {
  await page.goto('/contact/');
  const controls = page.locator('#contact-form input:not([type="hidden"]), #contact-form select, #contact-form textarea');
  const count = await controls.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const control = controls.nth(i);
    const name = await control.getAttribute('name');
    // Turnstile injects its own unlabeled response input.
    if (name === 'cf-turnstile-response') continue;
    const accessibleName = await control.evaluate((el) => {
      const id = el.getAttribute('id');
      const label = id ? document.querySelector(`label[for="${CSS.escape(id)}"]`) : null;
      if (label?.textContent?.trim()) return label.textContent.trim();
      if (el.closest('label')?.textContent?.trim()) return el.closest('label')!.textContent!.trim();
      return el.getAttribute('aria-label') || '';
    });
    expect(accessibleName, `control "${name}" needs an accessible name`).not.toBe('');
  }
});

test('project filter buttons expose pressed state', async ({ page }) => {
  await page.goto('/projects/');
  const buttons = page.locator('.project-filter');
  await expect(buttons.first()).toHaveAttribute('aria-pressed', 'true');
  await buttons.nth(1).click();
  await expect(buttons.nth(1)).toHaveAttribute('aria-pressed', 'true');
  await expect(buttons.first()).toHaveAttribute('aria-pressed', 'false');
});
