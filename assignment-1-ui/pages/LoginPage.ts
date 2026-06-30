import { type Page } from '@playwright/test';

/**
 * LoginPage — Page Object for https://www.saucedemo.com/
 *
 * Owns: locators + user-level actions for the login page.
 * Does NOT contain assertions — those live in spec files.
 */
export class LoginPage {
  private readonly page: Page;
  private readonly usernameInput;
  private readonly passwordInput;
  private readonly loginButton;
  readonly errorMessage;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByTestId('username');
    this.passwordInput = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
    this.errorMessage = page.getByTestId('error');
  }

  /** Navigate to the SauceDemo login page */
  async goto() {
    await this.page.goto('/');
  }

  /** Fill credentials and submit the login form */
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /** Fill only the username field and submit (for negative tests) */
  async loginWithUsernameOnly(username: string) {
    await this.usernameInput.fill(username);
    await this.loginButton.click();
  }

  /** Submit the form with no credentials (for negative tests) */
  async loginWithNoCredentials() {
    await this.loginButton.click();
  }

  /** Returns the text content of the error message banner */
  async getErrorText(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? '';
  }

  /** Returns true if the error banner is visible */
  async isErrorVisible(): Promise<boolean> {
    return this.errorMessage.isVisible();
  }
}
