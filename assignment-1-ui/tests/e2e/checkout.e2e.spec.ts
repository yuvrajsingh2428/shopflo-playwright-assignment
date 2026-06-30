import { test, expect } from '@playwright/test';
import { LoginPage, InventoryPage, CartPage, CheckoutPage } from '../../pages';
import { Users } from '../../test-data/users';
import { Products } from '../../test-data/products';

/**
 * End-to-End: Full Checkout Flow
 *
 * Scenario: A standard user logs in, adds two products to the cart,
 * proceeds through checkout, fills in customer info, and completes the order.
 *
 * This test exercises the entire user journey across four pages:
 * Login → Inventory → Cart → Checkout Step 1 → Checkout Step 2 → Order Complete
 */

test.describe('E2E — Full Checkout Flow', () => {
  test('standard_user completes a full order successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // ── Step 1: Login ──────────────────────────────────────────────────────────
    await loginPage.goto();
    await loginPage.login(Users.standard.username, Users.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);

    // ── Step 2: Add products to cart ──────────────────────────────────────────
    await inventoryPage.addToCartByName(Products.backpack);
    await inventoryPage.addToCartByName(Products.bikeLight);
    expect(await inventoryPage.getCartCount()).toBe(2);

    // ── Step 3: Navigate to cart and verify items ─────────────────────────────
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/cart\.html/);

    const cartItems = await cartPage.getCartItemNames();
    expect(cartItems).toContain(Products.backpack);
    expect(cartItems).toContain(Products.bikeLight);

    // ── Step 4: Proceed to checkout ───────────────────────────────────────────
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    // ── Step 5: Fill customer information ─────────────────────────────────────
    await checkoutPage.fillCustomerInfo('Jane', 'Doe', '560001');
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    // ── Step 6: Verify order summary and finish ───────────────────────────────
    const total = await checkoutPage.getTotalText();
    expect(total).toMatch(/Total:/);

    await checkoutPage.finish();
    await expect(page).toHaveURL(/checkout-complete\.html/);

    // ── Step 7: Confirm order completion ─────────────────────────────────────
    const confirmationHeader = await checkoutPage.getConfirmationHeader();
    expect(confirmationHeader).toContain('Thank you for your order');
  });

  test('checkout step 1 shows error when first name is missing', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login(Users.standard.username, Users.standard.password);
    await inventoryPage.addToCartByName(Products.backpack);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();

    // Submit with no customer info
    await checkoutPage.continueWithNoInfo();

    await expect(checkoutPage.stepOneError).toBeVisible();
    expect(await checkoutPage.stepOneError.textContent()).toContain('First Name is required');
  });

  test('checkout step 1 shows error when postal code is missing', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login(Users.standard.username, Users.standard.password);
    await inventoryPage.addToCartByName(Products.backpack);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();

    // Fill name but leave postal code empty
    await page.getByTestId('firstName').fill('Jane');
    await page.getByTestId('lastName').fill('Doe');
    await page.getByTestId('continue').click();

    await expect(checkoutPage.stepOneError).toBeVisible();
    expect(await checkoutPage.stepOneError.textContent()).toContain('Postal Code is required');
  });
});
