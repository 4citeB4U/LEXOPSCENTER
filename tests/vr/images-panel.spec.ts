import { test, expect } from '@playwright/test';
import { stabilize, expectStable } from '../utils/stabilize';

test.describe('Images-only block does not shift layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await stabilize(page);
  });

  test('Container exists and does not move layout chrome', async ({ page }) => {
    const container = page.locator('#lexintel-images'); // your images-only div
    await expect(container).toHaveCount(1);

    // Take a full-viewport shot but mask the dynamic image grid so only layout chrome is compared
    const mask = [container];
    await expect(page).toHaveScreenshot('viewport-with-images-mask.png', { mask });
  });

  test('Container baseline region itself (optional)', async ({ page }) => {
    const container = page.locator('#lexintel-images');
    await expect(container).toHaveCount(1);
    // If the image results change, this will naturally differ; keep only to catch gross CSS regressions.
    await expectStable(page, container, 'images-container-shell');
  });
});
