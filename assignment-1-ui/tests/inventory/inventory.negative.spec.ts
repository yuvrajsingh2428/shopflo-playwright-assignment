import { test, expect } from '@playwright/test';
import { LoginPage, InventoryPage } from '../../pages';
import { Users } from '../../test-data/users';

/**
 * Inventory Page — Negative Test Cases
 *
 * Tests covering access control, problem user behaviour, and unauthenticated access.
 */

test.describe('Inventory Page — Negative', () => {
  test('unauthenticated user is redirected away from inventory', async ({ page }) => {
    await page.goto('/inventory.html');

    // SauceDemo redirects unauthenticated access back to the login page
    await expect(page).toHaveURL(/^https:\/\/www\.saucedemo\.com\/?$/);
  });

  test('problem_user sees broken product images (all same wrong src)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(Users.problem.username, Users.problem.password);
    await page.waitForURL('**/inventory.html');

    // problem_user bug: all product images use the same broken src
    // (a cat image instead of the actual product image)
    const images = page.locator('.inventory_item_img img');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);

    const srcs: string[] = await images.evaluateAll((imgs: Element[]) =>
      (imgs as HTMLImageElement[]).map((img) => img.getAttribute('src') ?? ''),
    );

    // All images point to the same (broken) URL — a known problem_user defect
    const uniqueSrcs = new Set(srcs);
    expect(uniqueSrcs.size).toBe(1);
  });

  test('direct navigation to inventory without session shows login page', async ({ page }) => {
    // Clear all cookies/storage to simulate no session
    await page.context().clearCookies();
    await page.goto('/inventory.html');

    await expect(page).toHaveURL(/^https:\/\/www\.saucedemo\.com\/?$/);
    await expect(page.getByTestId('login-button')).toBeVisible();
  });

  test('logout navigates back to login page and clears session', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(Users.standard.username, Users.standard.password);
    await page.waitForURL('**/inventory.html');

    await inventoryPage.logout();
    await expect(page).toHaveURL(/^https:\/\/www\.saucedemo\.com\/?$/);

    // After logout, navigating to inventory should redirect to login
    await page.goto('/inventory.html');
    await expect(page).toHaveURL(/^https:\/\/www\.saucedemo\.com\/?$/);
  });
});
