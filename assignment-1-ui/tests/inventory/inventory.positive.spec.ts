import { test as base, expect } from '@playwright/test';
import { InventoryPage } from '../../pages';
import { LoginPage } from '../../pages';
import { Users } from '../../test-data/users';
import { Products, SortOptions } from '../../test-data/products';

/**
 * Inventory Page — Positive Test Cases
 *
 * Uses a fresh login before each test rather than storageState,
 * to keep this file self-contained and easy to run in isolation.
 */

const test = base.extend<{ inventoryPage: InventoryPage }>({
  inventoryPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(Users.standard.username, Users.standard.password);
    await page.waitForURL('**/inventory.html');
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },
});

test.describe('Inventory Page — Positive', () => {
  test('displays 6 products on the inventory page', async ({ inventoryPage }) => {
    expect(await inventoryPage.getItemCount()).toBe(6);
  });

  test('adds a product to cart and cart badge shows count 1', async ({ inventoryPage }) => {
    await inventoryPage.addToCartByName(Products.backpack);
    expect(await inventoryPage.getCartCount()).toBe(1);
  });

  test('adds multiple products and cart badge reflects the total count', async ({
    inventoryPage,
  }) => {
    await inventoryPage.addToCartByName(Products.backpack);
    await inventoryPage.addToCartByName(Products.bikeLight);
    expect(await inventoryPage.getCartCount()).toBe(2);
  });

  test('removes a product from cart and badge decrements', async ({ inventoryPage }) => {
    await inventoryPage.addToCartByName(Products.backpack);
    await inventoryPage.addToCartByName(Products.bikeLight);
    await inventoryPage.removeFromCartByName(Products.backpack);
    expect(await inventoryPage.getCartCount()).toBe(1);
  });

  test('cart badge is not visible when cart is empty', async ({ inventoryPage }) => {
    expect(await inventoryPage.getCartCount()).toBe(0);
  });

  test('sorts products A→Z correctly', async ({ inventoryPage }) => {
    await inventoryPage.sortBy(SortOptions.nameAZ);
    const names = await inventoryPage.getProductNames();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test('sorts products Z→A correctly', async ({ inventoryPage }) => {
    await inventoryPage.sortBy(SortOptions.nameZA);
    const names = await inventoryPage.getProductNames();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  test('navigates to the cart page via cart icon', async ({ inventoryPage, page }) => {
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/cart\.html/);
  });

  test('all 6 product names are present in the catalogue', async ({ inventoryPage }) => {
    const names = await inventoryPage.getProductNames();
    expect(names).toContain(Products.backpack);
    expect(names).toContain(Products.bikeLight);
    expect(names).toContain(Products.fleeceJacket);
  });
});
