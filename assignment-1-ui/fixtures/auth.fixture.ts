import { test as base, type BrowserContext } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import { LoginPage } from '../pages';
import { Users } from '../test-data/users';

/** File path where the authenticated browser state is persisted */
const AUTH_STATE_PATH = path.join(__dirname, '../.auth/standard-user.json');

/**
 * auth.fixture.ts
 *
 * Extends the base Playwright `test` with an `authenticatedPage` fixture.
 *
 * On first use, it performs a real login and saves the storageState to disk.
 * Subsequent tests in the same worker reuse the saved state — no repeated login.
 *
 * This is the recommended Playwright pattern for avoiding login in every test.
 */

type AuthFixtures = {
  /** A Page pre-authenticated as standard_user */
  authenticatedPage: Awaited<ReturnType<BrowserContext['newPage']>>;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ browser }, use) => {
    // Ensure the .auth directory exists
    const authDir = path.dirname(AUTH_STATE_PATH);
    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true });
    }

    let context: BrowserContext;

    if (fs.existsSync(AUTH_STATE_PATH)) {
      // Reuse saved auth state
      context = await browser.newContext({ storageState: AUTH_STATE_PATH });
    } else {
      // Perform login and save state
      context = await browser.newContext();
      const page = await context.newPage();
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.login(Users.standard.username, Users.standard.password);
      // Wait for successful redirect to inventory
      await page.waitForURL('**/inventory.html');
      await context.storageState({ path: AUTH_STATE_PATH });
      await page.close();
    }

    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect } from '@playwright/test';
