import { test, expect } from '../../fixtures';
import { validate, isValid } from '../../utils/schemaValidator';
import cartSchema from '../../schemas/cart.schema.json';

/**
 * Contract Test — Senior Bonus
 *
 * Purpose: Assert that the FakeStore API's GET /carts/:id response
 * conforms to the pinned JSON Schema in schemas/cart.schema.json.
 *
 * This is a consumer-side contract test. The schema file IS the contract.
 * If the API changes its response shape, this test catches the drift.
 *
 * Why this counts as a contract test:
 *  - The schema is pinned (committed to source control)
 *  - It documents the expected API surface for downstream consumers
 *  - Any deviation from the schema fails the CI pipeline immediately
 *  - This is the "lightweight contract" pattern, as opposed to full Pact
 */

test.describe('Contract — GET /carts/:id response conforms to pinned schema', () => {
  test('cart id=1 response strictly matches cart.schema.json', async ({ request }) => {
    const response = await request.get('/carts/1');
    expect(response.status()).toBe(200);

    const body = await response.json();

    // validate() throws with full AJV error list if schema is violated
    expect(() => validate(cartSchema, body)).not.toThrow();
  });

  test('cart id=2 response strictly matches cart.schema.json', async ({ request }) => {
    const response = await request.get('/carts/2');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(() => validate(cartSchema, body)).not.toThrow();
  });

  test('cart id=3 response strictly matches cart.schema.json', async ({ request }) => {
    const response = await request.get('/carts/3');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(() => validate(cartSchema, body)).not.toThrow();
  });

  test('all carts (GET /carts) each conform to cart.schema.json', async ({ request }) => {
    const response = await request.get('/carts');
    expect(response.status()).toBe(200);

    const carts = await response.json();
    expect(Array.isArray(carts)).toBe(true);

    // Every item in the collection must individually match the schema
    const violations: { index: number; error: string }[] = [];

    for (let i = 0; i < carts.length; i++) {
      if (!isValid(cartSchema, carts[i])) {
        violations.push({
          index: i,
          error: `Cart at index ${i} (id=${carts[i]?.id}) failed schema validation`,
        });
      }
    }

    expect(violations).toEqual([]);
  });

  test('schema is not satisfied by a structurally invalid object (negative contract)', async () => {
    // This test verifies that the schema validator itself is working correctly.
    // It asserts that a deliberately wrong shape DOES fail validation.
    const invalidCart = {
      // Missing required fields: id, userId, date, products
      name: 'not a cart',
      items: [],
    };

    expect(isValid(cartSchema, invalidCart)).toBe(false);
  });

  test('schema rejects a cart product entry with missing quantity', async () => {
    const cartWithBadProduct = {
      id: 1,
      userId: 1,
      date: '2024-01-01',
      products: [
        { productId: 1 }, // quantity is required
      ],
    };

    expect(isValid(cartSchema, cartWithBadProduct)).toBe(false);
  });
});
