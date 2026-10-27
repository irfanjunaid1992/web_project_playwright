import { defineConfig } from '@playwright/test';

/**
 * Configures a single headless Chromium run and the Playwright HTML report.
 */
export default defineConfig({
  // Keep the automated scenarios together in the dedicated test folder.
  testDir: './tests',
  // These independent upload scenarios can run concurrently without shared state.
  fullyParallel: true,
  // Catch accidental focused tests locally and in CI.
  forbidOnly: Boolean(process.env.CI),
  // Retry count stays at zero so failures reflect the live application's behavior.
  retries: 0,
  // Use one worker to keep load predictable for the public application under test.
  workers: 1,
  // Show concise test progress and create the browsable HTML report.
  reporter: [
    ['list'],
    [
      'html',
      {
        // Store the self-contained HTML report in the conventional Playwright output folder.
        outputFolder: 'playwright-report',
        // The e2e runner opens the report after tests, including after a failing run.
        open: 'never'
      }
    ]
  ],
  // Bound each scenario so a public-site outage does not hang the full run.
  timeout: 45_000,
  // Give asynchronous browser assertions a reasonable response window.
  expect: {
    timeout: 10_000
  },
  // Share the application origin while allowing the page object to navigate by path.
  use: {
    baseURL: 'https://the-internet.herokuapp.com',
    // Run without requiring a graphical desktop session; retain traces only for failures.
    headless: true,
    trace: 'retain-on-failure'
  },
  // Keep a single Chromium-family project and optionally select the local Chrome channel.
  projects: [
    {
      // Give the only browser project a clear name in terminal and HTML reports.
      name: 'chromium',
      use: {
        // Restrict execution to the Chromium browser family.
        browserName: 'chromium',
        // Select system Chrome when the bootstrap found it; undefined uses bundled Chromium.
        ...(process.env.PLAYWRIGHT_CHROME_CHANNEL === 'chrome' ? { channel: 'chrome' as const } : {})
      }
    }
  ]
});
