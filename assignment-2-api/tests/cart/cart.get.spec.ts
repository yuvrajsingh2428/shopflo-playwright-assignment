import { test, expect } from '../../fixtures';
import { validate } from '../../utils/schemaValidator';
import cartSchema from '../../schemas/cart.schema.json';

/**
 * Cart — GET /carts/:id
 *
 * Tests: fetch by valid ID, response schema, required fields, negative cases.
 * FakeStore has carts with IDs 1–7.
 */

test.describe('Cart — GET /carts/:id', () => {
  // ── Positive ──────────────────────────────────────────────────────────────────

  test('GET /carts/1 returns 200', async ({ request }) => {
    const response = await request.get('/carts/1');
    expect(response.status()).toBe(200);
  });

  test('GET /carts/1 response body matches the cart schema', async ({ request }) => {
    const response = await request.get('/carts/1');
    const body = await response.json();
    expect(() => validate(cartSchema, body)).not.toThrow();
  });

  test('GET /carts/1 returns a cart with the expected required fields', async ({ request }) => {
    const response = await request.get('/carts/1');
    const body = await response.json();

    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('userId');
    expect(body).toHaveProperty('date');
    expect(body).toHaveProperty('products');
    expect(Array.isArray(body.products)).toBe(true);
  });

  test('GET /carts/1 id field matches the requested cart ID', async ({ request }) => {
    const response = await request.get('/carts/1');
    const body = await response.json();
    expect(body.id).toBe(1);
  });

  test('products in the cart each have productId and quantity', async ({ request }) => {
    const response = await request.get('/carts/1');
    const body = await response.json();

    for (const product of body.products) {
      expect(product).toHaveProperty('productId');
      expect(product).toHaveProperty('quantity');
      expect(typeof product.productId).toBe('number');
      expect(typeof product.quantity).toBe('number');
    }
  });

  test('GET /carts returns all carts as an array', async ({ request }) => {
    const response = await request.get('/carts');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  // ── Negative ──────────────────────────────────────────────────────────────────

  test('GET /carts/999 returns null or 404 for a non-existent cart', async ({ request }) => {
    const response = await request.get('/carts/999');

    // FakeStore returns null (200 + null body) for unknown IDs
    const isNotFound = response.status() === 404;
    const body = await response.json();
    const isNullBody = body === null;

    expect(isNotFound || isNullBody).toBe(true);
  });

  test('GET /carts/0 returns null or 404 for ID 0', async ({ request }) => {
    const response = await request.get('/carts/0');

    const isNotFound = response.status() === 404;
    const body = await response.json();
    const isNullBody = body === null;

    expect(isNotFound || isNullBody).toBe(true);
  });
});
