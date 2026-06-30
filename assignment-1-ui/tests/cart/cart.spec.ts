import { test as base, expect } from '@playwright/test';
import { LoginPage, InventoryPage, CartPage } from '../../pages';
import { Users } from '../../test-data/users';
import { Products } from '../../test-data/products';

/**
 * Cart — Positive and Negative Test Cases
 *
 * Covers adding items, viewing the cart, removing items, and edge cases.
 */

const test = base.extend<{ inventoryPage: InventoryPage; cartPage: CartPage }>({
  inventoryPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(Users.standard.username, Users.standard.password);
    await page.waitForURL('**/inventory.html');
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
});

test.describe('Cart', () => {
  // ── Positive ──────────────────────────────────────────────────────────────────

  test('added item appears in the cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCartByName(Products.backpack);
    await inventoryPage.goToCart();

    const names = await cartPage.getCartItemNames();
    expect(names).toContain(Products.backpack);
  });

  test('multiple added items all appear in the cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCartByName(Products.backpack);
    await inventoryPage.addToCartByName(Products.bikeLight);
    await inventoryPage.goToCart();

    const names = await cartPage.getCartItemNames();
    expect(names).toContain(Products.backpack);
    expect(names).toContain(Products.bikeLight);
    expect(await cartPage.getCartItemCount()).toBe(2);
  });

  test('removing an item from the cart decrements the item count', async ({
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addToCartByName(Products.backpack);
    await inventoryPage.addToCartByName(Products.bikeLight);
    await inventoryPage.goToCart();

    await cartPage.removeItemByName(Products.backpack);

    const names = await cartPage.getCartItemNames();
    expect(names).not.toContain(Products.backpack);
    expect(await cartPage.getCartItemCount()).toBe(1);
  });

  test('Continue Shopping button navigates back to inventory', async ({
    inventoryPage,
    cartPage,
    page,
  }) => {
    await inventoryPage.goToCart();
    await cartPage.continueShopping();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('Checkout button navigates to checkout step one', async ({
    inventoryPage,
    cartPage,
    page,
  }) => {
    await inventoryPage.addToCartByName(Products.backpack);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  // ── Negative ──────────────────────────────────────────────────────────────────

  test('cart is empty on first login — no items are shown', async ({
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.goToCart();
    expect(await cartPage.isEmpty()).toBe(true);
  });

  test('removing all items leaves the cart empty', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCartByName(Products.backpack);
    await inventoryPage.goToCart();

    await cartPage.removeItemByName(Products.backpack);

    expect(await cartPage.isEmpty()).toBe(true);
  });
});
