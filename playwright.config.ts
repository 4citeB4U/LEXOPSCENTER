import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/vr',
  fullyParallel: true,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  snapshotPathTemplate: '{testDir}/__snapshots__/{testFilePath}/{arg}{ext}',
  timeout: 30_000,
  expect: {
    toHaveScreenshot: {
      // Tight but safe; tune if your UI has gradient noise
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
    },
  },
  use: {
    baseURL: 'http://localhost:4173',
    screenshot: 'only-on-failure',
    video: 'off',
    trace: 'retain-on-failure',
    viewport: { width: 1366, height: 900 },
    deviceScaleFactor: 1,
    colorScheme: 'light',
    timezoneId: 'America/Chicago',
    testIdAttribute: 'data-testid',
  },
  webServer: {
    command: 'vite preview --port 4173',
    url: 'http://localhost:4173',
    timeout: 120_000,
    reuseExistingServer: true,
  },
  projects: [
    { name: 'chromium-desktop' },
    { name: 'webkit-desktop', use: { browserName: 'webkit' } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
  ],
});
