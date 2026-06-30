import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages';
import { Users } from '../../test-data/users';

/**
 * Login — Positive Test Cases
 *
 * Tests covering successful authentication scenarios.
 * These tests do NOT use the auth fixture — they test the login flow itself.
 */

test.describe('Login Page — Positive', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('standard_user can log in and is redirected to inventory', async ({ page }) => {
    await loginPage.login(Users.standard.username, Users.standard.password);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByTestId('inventory-container')).toBeVisible();
  });

  test('page title is correct on the login page', async ({ page }) => {
    await expect(page).toHaveTitle(/Swag Labs/i);
  });

  test('login button is visible and enabled on page load', async ({ page }) => {
    await expect(page.getByTestId('login-button')).toBeVisible();
    await expect(page.getByTestId('login-button')).toBeEnabled();
  });

  test('username and password fields are present and focusable', async ({ page }) => {
    await expect(page.getByTestId('username')).toBeVisible();
    await expect(page.getByTestId('password')).toBeVisible();
    await page.getByTestId('username').focus();
    await expect(page.getByTestId('username')).toBeFocused();
  });

  test('performance_glitch_user can log in (slower but succeeds)', async ({ page }) => {
    // Extend timeout for this user — intentional 4-6s artificial delay
    test.setTimeout(15_000);

    await loginPage.login(
      Users.performanceGlitch.username,
      Users.performanceGlitch.password,
    );

    await expect(page).toHaveURL(/inventory\.html/, { timeout: 12_000 });
  });

  test('logged-in user can navigate directly to inventory without re-login', async ({ page }) => {
    await loginPage.login(Users.standard.username, Users.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);

    // Session persists — navigating directly to inventory stays on inventory
    await page.goto('/inventory.html');
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByTestId('inventory-container')).toBeVisible();
  });
});
