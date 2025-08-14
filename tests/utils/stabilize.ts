import { Page, expect } from '@playwright/test';

export async function stabilize(page: Page) {
  // Wait for network & fonts
  await page.waitForLoadState('networkidle');
  await page.evaluate(async () => {
    // @ts-ignore
    if (document?.fonts?.ready) { await (document as any).fonts.ready; }
  });

  // Kill animations/transitions/carets to avoid diffs
  await page.addStyleTag({
    content: `
      *, *::before, *::after { animation: none !important; transition: none !important; }
      input, textarea { caret-color: transparent !important; }
    `,
  });
}

// Optional: block noisy third-party requests (analytics, CSE) in tests where you only want shell layout
export async function quietNetwork(page: Page) {
  await page.route('**/*', (route) => {
    const url = route.request().url();
    if (
      /googletagmanager|google-analytics|facebook|hotjar|fullstory/.test(url)
    ) return route.abort();
    return route.continue();
  });
}

// Assert a locator has a stable screenshot with optional masks
export async function expectStable(
  page: Page,
  target: ReturnType<Page['locator']>,
  name: string,
  masks: ReturnType<Page['locator']>[] = []
) {
  await expect(target).toHaveScreenshot(`${name}.png`, { mask: masks });
}
