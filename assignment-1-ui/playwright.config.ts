import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  // ── Test discovery ──────────────────────────────────────────────────────────
  testDir: './tests',
  testMatch: '**/*.spec.ts',

  // ── Execution ────────────────────────────────────────────────────────────────
  fullyParallel: true,
  workers: process.env.CI ? 2 : '50%',
  retries: process.env.CI ? 2 : 0,

  // ── Global timeout ──────────────────────────────────────────────────────────
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },

  // ── Reporters ────────────────────────────────────────────────────────────────
  reporter: process.env.CI
    ? [
        ['github'],
        ['html', { open: 'never', outputFolder: 'playwright-report' }],
        ['json', { outputFile: 'playwright-report/results.json' }],
      ]
    : [
        ['list'],
        ['html', { open: 'on-failure', outputFolder: 'playwright-report' }],
      ],

  // ── Shared settings for all projects ────────────────────────────────────────
  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.saucedemo.com',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    // Align getByTestId() with SauceDemo's data-test attribute
    testIdAttribute: 'data-test',
  },

  // ── Browser projects ─────────────────────────────────────────────────────────
  projects: [
    // Primary: runs on every push
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // Secondary: run locally with --project=firefox or on nightly CI
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    // Optional: run locally with --project=webkit or on nightly CI
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // ── Output directories ───────────────────────────────────────────────────────
  outputDir: 'test-results',
});
