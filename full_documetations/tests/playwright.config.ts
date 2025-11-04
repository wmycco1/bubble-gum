// ═══════════════════════════════════════════════════════════════
// BUBBLE GUM - PLAYWRIGHT CONFIGURATION
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0
// Last Updated: November 2, 2025
// Purpose: Complete Playwright configuration for E2E tests
// ═══════════════════════════════════════════════════════════════

import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TEST DIRECTORY
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  testDir: './tests/e2e',

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TEST EXECUTION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,

  // Maximum time one test can run
  timeout: 30 * 1000, // 30 seconds

  // Timeout for each assertion
  expect: {
    timeout: 5000, // 5 seconds
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // REPORTER
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['junit', { outputFile: 'playwright-report/junit.xml' }],
    ['list'],
  ],

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SHARED SETTINGS FOR ALL PROJECTS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',

    // Emulate user timezone
    timezoneId: 'America/New_York',

    // Emulate user locale
    locale: 'en-US',

    // Browser context options
    contextOptions: {
      // Ignore HTTPS errors
      ignoreHTTPSErrors: true,
    },

    // Network settings
    navigationTimeout: 30000,
    actionTimeout: 10000,

    // Viewport size
    viewport: { width: 1280, height: 720 },

    // User agent
    userAgent: 'Playwright E2E Tests',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // WEB SERVER
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes
    stdout: 'ignore',
    stderr: 'pipe',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PROJECTS (Browsers & Devices)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  projects: [
    // ┌─────────────────────────────────────────────────────────────┐
    // │ DESKTOP BROWSERS                                            │
    // └─────────────────────────────────────────────────────────────┘
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    // ┌─────────────────────────────────────────────────────────────┐
    // │ MOBILE BROWSERS                                             │
    // └─────────────────────────────────────────────────────────────┘
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },

    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    {
      name: 'Mobile Safari Landscape',
      use: { 
        ...devices['iPhone 12'],
        viewport: { width: 844, height: 390 },
      },
    },

    // ┌─────────────────────────────────────────────────────────────┐
    // │ TABLET BROWSERS                                             │
    // └─────────────────────────────────────────────────────────────┘
    {
      name: 'iPad',
      use: { ...devices['iPad Pro'] },
    },

    {
      name: 'iPad Landscape',
      use: { 
        ...devices['iPad Pro'],
        viewport: { width: 1366, height: 1024 },
      },
    },

    // ┌─────────────────────────────────────────────────────────────┐
    // │ BRANDED TESTS (Google Chrome & Microsoft Edge)              │
    // └─────────────────────────────────────────────────────────────┘
    {
      name: 'Google Chrome',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    },

    {
      name: 'Microsoft Edge',
      use: { 
        ...devices['Desktop Edge'],
        channel: 'msedge',
      },
    },
  ],

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // GLOBAL SETUP & TEARDOWN
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  globalSetup: require.resolve('./tests/setup/global-setup.ts'),
  globalTeardown: require.resolve('./tests/setup/global-teardown.ts'),

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // OUTPUT DIRECTORIES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  outputDir: 'test-results/',
  snapshotDir: 'tests/e2e/__snapshots__/',
});

// ═══════════════════════════════════════════════════════════════
// USAGE COMMANDS
// ═══════════════════════════════════════════════════════════════
//
// Run all tests:
//   npx playwright test
//
// Run tests in headed mode:
//   npx playwright test --headed
//
// Run tests in specific browser:
//   npx playwright test --project=chromium
//   npx playwright test --project=firefox
//   npx playwright test --project=webkit
//
// Run tests on mobile:
//   npx playwright test --project="Mobile Chrome"
//   npx playwright test --project="Mobile Safari"
//
// Run specific test file:
//   npx playwright test tests/e2e/auth.spec.ts
//
// Run tests matching pattern:
//   npx playwright test -g "should login"
//
// Debug tests:
//   npx playwright test --debug
//
// Show test report:
//   npx playwright show-report
//
// Update snapshots:
//   npx playwright test --update-snapshots
//
// Run tests in UI mode:
//   npx playwright test --ui
//
// Generate code:
//   npx playwright codegen http://localhost:3000
//
// ═══════════════════════════════════════════════════════════════
// PACKAGE.JSON SCRIPTS
// ═══════════════════════════════════════════════════════════════
//
// Add these scripts to package.json:
//
// {
//   "scripts": {
//     "test:e2e": "playwright test",
//     "test:e2e:headed": "playwright test --headed",
//     "test:e2e:debug": "playwright test --debug",
//     "test:e2e:ui": "playwright test --ui",
//     "test:e2e:report": "playwright show-report",
//     "test:e2e:codegen": "playwright codegen http://localhost:3000"
//   }
// }
//
// ═══════════════════════════════════════════════════════════════
// INSTALLATION
// ═══════════════════════════════════════════════════════════════
//
// Install Playwright:
//   npm install -D @playwright/test
//
// Install browsers:
//   npx playwright install
//
// Install browser dependencies (Linux):
//   npx playwright install-deps
//
// ═══════════════════════════════════════════════════════════════
