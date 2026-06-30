import { test, expect } from '../../fixtures';
import { validate } from '../../utils/schemaValidator';
import authSchema from '../../schemas/auth.schema.json';

/**
 * Authentication — POST /auth/login
 *
 * FakeStore API behaviour (verified against live API):
 *  - Valid credentials   → 201 + { token: "<jwt>" }
 *  - Invalid credentials → 401 + plain-text body "username or password is incorrect"
 *  - Missing fields      → 401 + plain-text error body
 */

const VALID_CREDENTIALS = {
  username: 'mor_2314',
  password: '83r5^_',
};

test.describe('Auth — POST /auth/login', () => {
  // ── Positive ──────────────────────────────────────────────────────────────────

  test('returns 2xx and a token for valid credentials', async ({ request }) => {
    const response = await request.post('/auth/login', {
      data: VALID_CREDENTIALS,
    });

    // FakeStore returns 201 on successful auth
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body).toHaveProperty('token');
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);
  });

  test('response body matches the auth schema', async ({ request }) => {
    const response = await request.post('/auth/login', {
      data: VALID_CREDENTIALS,
    });

    const body = await response.json();
    // validate() throws a descriptive error if the schema does not match
    expect(() => validate(authSchema, body)).not.toThrow();
  });

  test('returned token is a non-empty JWT string', async ({ request }) => {
    const response = await request.post('/auth/login', {
      data: VALID_CREDENTIALS,
    });

    const body = await response.json();
    expect(typeof body.token).toBe('string');
    expect(body.token.trim()).not.toBe('');
    // JWT has three dot-separated segments
    expect(body.token.split('.').length).toBe(3);
  });

  // ── Negative ──────────────────────────────────────────────────────────────────

  test('returns 401 for invalid credentials', async ({ request }) => {
    const response = await request.post('/auth/login', {
      data: { username: 'wrong_user', password: 'wrong_pass' },
    });

    // FakeStore returns 401 + plain-text body for bad credentials
    expect(response.status()).toBe(401);
    const body = await response.text();
    expect(body.toLowerCase()).toContain('incorrect');
  });

  test('returns 400 for missing username', async ({ request }) => {
    const response = await request.post('/auth/login', {
      data: { password: VALID_CREDENTIALS.password },
    });

    expect(response.status()).toBe(400);
  });

  test('returns 400 for missing password', async ({ request }) => {
    const response = await request.post('/auth/login', {
      data: { username: VALID_CREDENTIALS.username },
    });

    expect(response.status()).toBe(400);
  });

  test('returns 400 for empty username and password', async ({ request }) => {
    const response = await request.post('/auth/login', {
      data: { username: '', password: '' },
    });

    expect(response.status()).toBe(400);
  });
});
