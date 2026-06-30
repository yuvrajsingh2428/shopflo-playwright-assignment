import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  // ── Test discovery ──────────────────────────────────────────────────────────
  testDir: './tests',
  testMatch: '**/*.spec.ts',

  // ── Execution ────────────────────────────────────────────────────────────────
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: process.env.CI ? 1 : 0,

  // ── Timeouts ─────────────────────────────────────────────────────────────────
  timeout: 10_000,
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

  // ── Shared settings ──────────────────────────────────────────────────────────
  use: {
    baseURL: process.env.API_BASE_URL ?? 'https://fakestoreapi.com',
    // No browser — API tests only
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  },

  // ── No browser projects — API only ──────────────────────────────────────────
  projects: [
    {
      name: 'api',
    },
  ],

  // ── Output ───────────────────────────────────────────────────────────────────
  outputDir: 'test-results',
});
