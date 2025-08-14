import { test } from '@playwright/test';
import { stabilize, quietNetwork, expectStable } from '../utils/stabilize';

test.describe('App chrome stays unchanged', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await quietNetwork(page);
    await stabilize(page);
  });

  test('Header (role=banner)', async ({ page }) => {
    const header = page.getByRole('banner');
    await expectStable(page, header, 'header');
  });

  test('Navigation (role=navigation)', async ({ page }) => {
    const nav = page.getByRole('navigation').first();
    await expectStable(page, nav, 'navigation');
  });

  test('Footer (role=contentinfo)', async ({ page }) => {
    const footer = page.getByRole('contentinfo');
    await expectStable(page, footer, 'footer');
  });
});
