import { test, expect } from '../../fixtures';

/**
 * Cart — DELETE /carts/:id
 *
 * Tests: successful delete, response body, and negative cases.
 * FakeStore returns a synthetic deleted cart response; data is not actually removed.
 */

test.describe('Cart — DELETE /carts/:id', () => {
  // ── Positive ──────────────────────────────────────────────────────────────────

  test('DELETE /carts/1 returns 200', async ({ request }) => {
    const response = await request.delete('/carts/1');
    expect(response.status()).toBe(200);
  });

  test('DELETE /carts/1 response body contains the deleted cart id', async ({ request }) => {
    const response = await request.delete('/carts/1');
    const body = await response.json();

    // FakeStore returns the deleted cart object in the response body
    expect(body).toHaveProperty('id');
    expect(body.id).toBe(1);
  });

  test('DELETE /carts/1 response body contains required cart fields', async ({ request }) => {
    const response = await request.delete('/carts/1');
    const body = await response.json();

    expect(body).toHaveProperty('userId');
    expect(body).toHaveProperty('date');
    expect(body).toHaveProperty('products');
    expect(Array.isArray(body.products)).toBe(true);
  });

  test('DELETE /carts/7 (last known cart) returns 200', async ({ request }) => {
    const response = await request.delete('/carts/7');
    expect(response.status()).toBe(200);
  });

  // ── Negative ──────────────────────────────────────────────────────────────────

  test('DELETE /carts/999 returns null or 404 for non-existent cart', async ({ request }) => {
    const response = await request.delete('/carts/999');

    const isNotFound = response.status() === 404;
    const body = await response.json();
    const isNullBody = body === null;

    expect(isNotFound || isNullBody).toBe(true);
  });

  test('DELETE /carts/0 returns null or 404 for ID 0', async ({ request }) => {
    const response = await request.delete('/carts/0');

    const isNotFound = response.status() === 404;
    const body = await response.json();
    const isNullBody = body === null;

    expect(isNotFound || isNullBody).toBe(true);
  });
});
