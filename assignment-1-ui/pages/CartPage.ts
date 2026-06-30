import { type Page } from '@playwright/test';

/**
 * CartPage — Page Object for /cart.html
 *
 * Owns: locators + actions for the shopping cart page.
 * Does NOT contain assertions — those live in spec files.
 */
export class CartPage {
  private readonly page: Page;
  private readonly cartItems;
  private readonly cartItemNames;
  private readonly checkoutButton;
  private readonly continueShoppingButton;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.getByTestId('inventory-item');
    this.cartItemNames = page.getByTestId('inventory-item-name');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
  }

  /** Navigate directly to the cart page */
  async goto() {
    await this.page.goto('/cart.html');
  }

  /** Click the Checkout button */
  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  /** Click Continue Shopping to return to the inventory page */
  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  /**
   * Remove an item from the cart by its name.
   * Finds the cart item container, then clicks its remove button.
   */
  async removeItemByName(productName: string) {
    const item = this.cartItems.filter({ hasText: productName });
    // SauceDemo cart remove buttons use data-test="remove-{product-slug}"
    // getByRole('button') with name matching is more robust than text matching
    await item.locator('button[data-test^="remove"]').click();
  }

  /** Returns the names of all items currently in the cart */
  async getCartItemNames(): Promise<string[]> {
    return this.cartItemNames.allTextContents();
  }

  /** Returns the number of items in the cart */
  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  /** Returns true if the cart is empty (no items visible) */
  async isEmpty(): Promise<boolean> {
    return (await this.cartItems.count()) === 0;
  }
}
