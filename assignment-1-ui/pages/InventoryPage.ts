import { type Page } from '@playwright/test';
import { type ProductName } from '../test-data/products';

/**
 * InventoryPage — Page Object for /inventory.html
 *
 * Owns: locators + actions for the products listing page.
 * Does NOT contain assertions — those live in spec files.
 */
export class InventoryPage {
  private readonly page: Page;
  private readonly sortDropdown;
  private readonly cartBadge;
  private readonly cartLink;
  private readonly inventoryItems;
  private readonly inventoryItemNames;
  private readonly menuButton;
  private readonly logoutLink;

  constructor(page: Page) {
    this.page = page;
    this.sortDropdown = page.getByTestId('product-sort-container');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.inventoryItems = page.getByTestId('inventory-item');
    this.inventoryItemNames = page.getByTestId('inventory-item-name');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.getByTestId('logout-sidebar-link');
  }

  /** Navigate directly to the inventory page */
  async goto() {
    await this.page.goto('/inventory.html');
  }

  /**
   * Add a product to the cart by its exact display name.
   * Finds the item container first, then clicks its add-to-cart button.
   */
  async addToCartByName(productName: ProductName) {
    const item = this.inventoryItems.filter({ hasText: productName });
    await item.getByRole('button', { name: /add to cart/i }).click();
  }

  /**
   * Remove a product from the cart by its exact display name.
   */
  async removeFromCartByName(productName: ProductName) {
    const item = this.inventoryItems.filter({ hasText: productName });
    await item.getByRole('button', { name: /remove/i }).click();
  }

  /** Select a sort option from the dropdown (pass a SortOptions value) */
  async sortBy(value: string) {
    await this.sortDropdown.selectOption(value);
  }

  /** Navigate to the cart page */
  async goToCart() {
    await this.cartLink.click();
  }

  /** Returns the number shown on the cart badge, or 0 if badge is not visible */
  async getCartCount(): Promise<number> {
    const isVisible = await this.cartBadge.isVisible();
    if (!isVisible) return 0;
    const text = await this.cartBadge.textContent();
    return parseInt(text ?? '0', 10);
  }

  /** Returns all visible product names on the inventory page */
  async getProductNames(): Promise<string[]> {
    return this.inventoryItemNames.allTextContents();
  }

  /** Returns the number of inventory items displayed */
  async getItemCount(): Promise<number> {
    return this.inventoryItems.count();
  }

  /** Logs out via the hamburger menu */
  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }
}
