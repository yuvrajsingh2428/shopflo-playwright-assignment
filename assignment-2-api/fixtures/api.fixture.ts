import { test as base, type APIRequestContext } from '@playwright/test';

/**
 * api.fixture.ts
 *
 * Extends the Playwright base `test` with a pre-configured `request` context
 * that has the correct baseURL and default JSON headers set.
 *
 * Spec files import `test` from this fixture instead of @playwright/test.
 */

type ApiFixtures = {
  /** APIRequestContext pre-configured with baseURL and Accept/Content-Type headers */
  request: APIRequestContext;
};

export const test = base.extend<ApiFixtures>({
  request: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({
      baseURL: process.env.API_BASE_URL ?? 'https://fakestoreapi.com',
      extraHTTPHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    await use(context);
    await context.dispose();
  },
});

export { expect } from '@playwright/test';
