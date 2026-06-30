import { test, expect } from '../../fixtures';
import { validate } from '../../utils/schemaValidator';
import cartSchema from '../../schemas/cart.schema.json';
import { updatedCartPayload, validCartPayload } from '../../test-data/cart.payloads';

/**
 * Cart — PUT /carts/:id
 *
 * Tests: successful update, response shape, schema validation, negative cases.
 * FakeStore returns a synthetic updated response; data is not persisted.
 */

test.describe('Cart — PUT /carts/:id', () => {
  // ── Positive ──────────────────────────────────────────────────────────────────

  test('PUT /carts/1 returns 200', async ({ request }) => {
    const response = await request.put('/carts/1', {
      data: updatedCartPayload,
    });

    expect(response.status()).toBe(200);
  });

  test('PUT /carts/1 response contains the updated userId', async ({ request }) => {
    const response = await request.put('/carts/1', {
      data: updatedCartPayload,
    });

    const body = await response.json();
    expect(body.userId).toBe(updatedCartPayload.userId);
  });

  test('PUT /carts/1 response contains the updated products', async ({ request }) => {
    const response = await request.put('/carts/1', {
      data: updatedCartPayload,
    });

    const body = await response.json();
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products).toHaveLength(updatedCartPayload.products.length);
  });

  test('PUT /carts/1 response body matches the cart schema', async ({ request }) => {
    const response = await request.put('/carts/1', {
      data: updatedCartPayload,
    });

    const body = await response.json();
    expect(() => validate(cartSchema, body)).not.toThrow();
  });

  test('PUT /carts/1 preserves the cart ID in the response', async ({ request }) => {
    const response = await request.put('/carts/1', {
      data: validCartPayload,
    });

    const body = await response.json();
    expect(body.id).toBe(1);
  });

  // ── Negative ──────────────────────────────────────────────────────────────────

  test('PUT /carts/999 — FakeStore echoes any PUT as 200 (mock behaviour documented)', async ({ request }) => {
    const response = await request.put('/carts/999', {
      data: updatedCartPayload,
    });

    // FakeStore is a fully synthetic mock — it echoes all PUT requests back as 200
    // regardless of whether the cart ID exists. This documents that known behaviour.
    // A real API would return 404; this test captures the mock contract.
    expect(response.status()).toBe(200);
    const body = await response.json();
    // The response should echo back the submitted userId
    expect(body.userId).toBe(updatedCartPayload.userId);
  });

  test('PUT /carts/1 with empty body returns an error or null body', async ({ request }) => {
    const response = await request.put('/carts/1', {
      data: {},
    });

    const body = await response.json();
    const isErrorOrEmpty =
      response.status() >= 400 ||
      body === null ||
      !body.products ||
      body.products === null;
    expect(isErrorOrEmpty).toBe(true);
  });
});
