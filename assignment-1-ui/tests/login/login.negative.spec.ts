import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages';
import { Users } from '../../test-data/users';

/**
 * Login — Negative Test Cases
 *
 * Tests covering failed authentication and form validation errors.
 */

test.describe('Login Page — Negative', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('locked_out_user sees a locked account error', async () => {
    await loginPage.login(Users.locked.username, Users.locked.password);

    expect(await loginPage.isErrorVisible()).toBe(true);
    expect(await loginPage.getErrorText()).toContain('Sorry, this user has been locked out');
  });

  test('wrong password shows an invalid credentials error', async () => {
    await loginPage.login(Users.standard.username, 'wrong_password');

    expect(await loginPage.isErrorVisible()).toBe(true);
    expect(await loginPage.getErrorText()).toContain(
      'Username and password do not match any user in this service',
    );
  });

  test('empty username shows a required field error', async () => {
    await loginPage.loginWithUsernameOnly('');
    // Clicking login with empty username
    await loginPage.loginWithNoCredentials();

    expect(await loginPage.isErrorVisible()).toBe(true);
    expect(await loginPage.getErrorText()).toContain('Username is required');
  });

  test('empty password shows a required field error', async ({ page }) => {
    await page.getByTestId('username').fill(Users.standard.username);
    await page.getByTestId('login-button').click();

    expect(await loginPage.isErrorVisible()).toBe(true);
    expect(await loginPage.getErrorText()).toContain('Password is required');
  });

  test('both fields empty shows a username required error', async () => {
    await loginPage.loginWithNoCredentials();

    expect(await loginPage.isErrorVisible()).toBe(true);
    expect(await loginPage.getErrorText()).toContain('Username is required');
  });

  test('page URL remains on login after failed login', async ({ page }) => {
    await loginPage.login('bad_user', 'bad_pass');

    await expect(page).toHaveURL(/^https:\/\/www\.saucedemo\.com\/?$/);
  });

  test('error message has a close button that dismisses the error', async ({ page }) => {
    await loginPage.login(Users.locked.username, Users.locked.password);
    expect(await loginPage.isErrorVisible()).toBe(true);

    await page.getByTestId('error').getByRole('button').click();
    await expect(loginPage.errorMessage).not.toBeVisible();
  });

  test('unknown username shows an invalid credentials error', async () => {
    await loginPage.login('nonexistent_user', Users.standard.password);

    expect(await loginPage.isErrorVisible()).toBe(true);
    expect(await loginPage.getErrorText()).toContain(
      'Username and password do not match any user in this service',
    );
  });
});
