import { test, expect } from '../../fixtures';
import { validate } from '../../utils/schemaValidator';
import cartSchema from '../../schemas/cart.schema.json';
import { validCartPayload, singleItemCartPayload } from '../../test-data/cart.payloads';

/**
 * Cart — POST /carts
 *
 * Tests: successful cart creation, response shape, schema validation, negative cases.
 *
 * Note: FakeStore API is a mock — POST does not persist data.
 * It returns a synthetic response with the submitted payload + an assigned id.
 */

test.describe('Cart — POST /carts', () => {
  // ── Positive ──────────────────────────────────────────────────────────────────

  test('creates a cart and returns 200 or 201 with the created cart body', async ({ request }) => {
    const response = await request.post('/carts', {
      data: validCartPayload,
    });

    expect([200, 201]).toContain(response.status());

    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(typeof body.id).toBe('number');
  });

  test('response contains the submitted userId', async ({ request }) => {
    const response = await request.post('/carts', {
      data: validCartPayload,
    });

    const body = await response.json();
    expect(body.userId).toBe(validCartPayload.userId);
  });

  test('response contains the submitted products array', async ({ request }) => {
    const response = await request.post('/carts', {
      data: validCartPayload,
    });

    const body = await response.json();
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products).toHaveLength(validCartPayload.products.length);
  });

  test('response body matches the cart schema', async ({ request }) => {
    const response = await request.post('/carts', {
      data: validCartPayload,
    });

    const body = await response.json();
    expect(() => validate(cartSchema, body)).not.toThrow();
  });

  test('creates a single-item cart successfully', async ({ request }) => {
    const response = await request.post('/carts', {
      data: singleItemCartPayload,
    });

    expect([200, 201]).toContain(response.status());
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body.products).toHaveLength(1);
  });

  test('Content-Type of the response is application/json', async ({ request }) => {
    const response = await request.post('/carts', {
      data: validCartPayload,
    });

    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');
  });

  // ── Negative ──────────────────────────────────────────────────────────────────

  test('POST with empty body returns a non-successful response or error body', async ({
    request,
  }) => {
    const response = await request.post('/carts', {
      data: {},
    });

    // FakeStore may return 200 with null fields or a 4xx
    const body = await response.json();
    const isErrorOrEmpty =
      response.status() >= 400 ||
      body === null ||
      !body.products ||
      body.products === null;
    expect(isErrorOrEmpty).toBe(true);
  });
});
