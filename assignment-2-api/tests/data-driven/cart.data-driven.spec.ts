import { test, expect } from '../../fixtures';
import { validate } from '../../utils/schemaValidator';
import cartSchema from '../../schemas/cart.schema.json';
import { productTestCases } from '../../test-data/product.ids';

/**
 * Data-Driven Test: Cart Creation with Multiple Product IDs
 *
 * Parameterises over `productTestCases` (5 entries across different categories).
 * For each product ID, it creates a cart and asserts:
 *  - HTTP 200 response
 *  - Response body contains a cart id
 *  - Response body contains the correct productId
 *  - Response body matches the cart schema
 *
 * Playwright's test.describe.each / for-of pattern is used for parameterisation.
 */

test.describe('Cart — Data-Driven: POST /carts with multiple product IDs', () => {
  for (const { productId, description } of productTestCases) {
    test(`creates a cart with productId ${productId} (${description})`, async ({ request }) => {
      const payload = {
        userId: 1,
        date: '2024-06-01',
        products: [{ productId, quantity: 1 }],
      };

      const response = await request.post('/carts', {
        data: payload,
      });

      // ── Assertions ────────────────────────────────────────────────────────────
      // FakeStore returns 200 or 201 for POST /carts depending on version
      expect([200, 201]).toContain(response.status());

      const body = await response.json();

      // Cart ID is assigned by the API
      expect(body).toHaveProperty('id');
      expect(typeof body.id).toBe('number');

      // Products array contains the submitted productId
      expect(Array.isArray(body.products)).toBe(true);
      expect(body.products[0].productId).toBe(productId);

      // Full schema validation
      expect(() => validate(cartSchema, body)).not.toThrow();
    });
  }
});
