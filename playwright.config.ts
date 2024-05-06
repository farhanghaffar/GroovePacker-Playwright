import devices, { defineConfig } from '@playwright/test';
import 'dotenv/config';
import { generateCustomLayoutSimpleMeta } from './Utils/slackCustomLayout';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './Tests',
  timeout: 5 * 60 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 50 * 1 * 1000,
  },
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter:
    process.env.SEND_REPORT_SLACK === 'true'
      ? [
          [
            './node_modules/playwright-slack-report/dist/src/SlackReporter.js',
            {
              channels: [process.env.CHANNEL_NAME], // provide one or more Slack channels
              sendResults: 'always', // "always" , "on-failure", "off"
              showInThread: true,
              layoutAsync: generateCustomLayoutSimpleMeta,
              meta: [
                {
                  key: 'User Account Name',
                  value: process.env.VALID_USER_ACCOUNT_2,
                },
                {
                  key: 'BASE URL',
                  value: process.env.BASE_URL, // depending on your CI environment, this can be the branch name, build id, etc
                },
              ],
            },
          ],
          ['html', { open: 'never' }],
          ['./customReport.ts'],
          // ['playwright-qase-reporter', require('./Utils/qase.config')],
        ]
      : [['html', { open: 'never' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    headless: process.env.CI ? true : false,
    // baseURL: process.env.BASE_URL,
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    screenshot: 'on',
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 872 },
      },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     channel: 'chrome',
    //     viewport: { width: 1500, height: 800 },
    //   },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
