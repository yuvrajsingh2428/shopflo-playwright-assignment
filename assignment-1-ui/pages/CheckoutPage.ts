import { type Page } from '@playwright/test';

/**
 * CheckoutPage — Page Object covering the two-step SauceDemo checkout flow:
 *
 *   Step 1: /checkout-step-one.html  (customer info form)
 *   Step 2: /checkout-step-two.html  (order summary + finish)
 *   Complete: /checkout-complete.html
 *
 * Does NOT contain assertions — those live in spec files.
 */
export class CheckoutPage {
  private readonly page: Page;

  // ── Step 1 locators ──────────────────────────────────────────────────────────
  private readonly firstNameInput;
  private readonly lastNameInput;
  private readonly postalCodeInput;
  private readonly continueButton;
  private readonly cancelButton;
  readonly stepOneError;

  // ── Step 2 locators ──────────────────────────────────────────────────────────
  private readonly finishButton;
  readonly summaryTotal;

  // ── Complete page locators ───────────────────────────────────────────────────
  readonly confirmationHeader;
  readonly confirmationText;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.cancelButton = page.getByTestId('cancel');
    this.stepOneError = page.getByTestId('error');
    this.finishButton = page.getByTestId('finish');
    this.summaryTotal = page.getByTestId('total-label');
    this.confirmationHeader = page.getByTestId('complete-header');
    this.confirmationText = page.getByTestId('complete-text');
  }

  /** Navigate directly to Step 1 */
  async gotoStepOne() {
    await this.page.goto('/checkout-step-one.html');
  }

  /**
   * Fill the customer information form and click Continue.
   * Leave any field empty to trigger form validation errors.
   */
  async fillCustomerInfo(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  /** Submit the form with all fields empty */
  async continueWithNoInfo() {
    await this.continueButton.click();
  }

  /** Cancel checkout and return to the previous page */
  async cancel() {
    await this.cancelButton.click();
  }

  /** Click the Finish button on Step 2 to complete the order */
  async finish() {
    await this.finishButton.click();
  }

  /** Returns the order total string from the Step 2 summary */
  async getTotalText(): Promise<string> {
    return (await this.summaryTotal.textContent()) ?? '';
  }

  /** Returns the confirmation header text from the complete page */
  async getConfirmationHeader(): Promise<string> {
    return (await this.confirmationHeader.textContent()) ?? '';
  }
}
