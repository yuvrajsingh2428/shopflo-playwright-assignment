# Assignment 2: API Testing (FakeStoreAPI)

This module contains the automated API test suite for [fakestoreapi.com](https://fakestoreapi.com).

## Framework Choice

**Playwright + AJV** was selected as the testing framework over RestAssured or Supertest.

### Why Playwright?
- **Unified Tooling**: Playwright includes `APIRequestContext`, allowing us to use the exact same test runner, assertions (`expect`), configuration, and reporting engine as the UI tests.
- **Speed**: Built-in async/await support with Node.js makes making multiple API calls completely non-blocking and extremely fast.

### Why AJV + JSON Schema?
- **Contract Testing (Senior Bonus)**: Instead of manually asserting every property in the response body, we define language-agnostic `.schema.json` files. AJV validates the API response against these pinned schemas. If the backend changes a data type or drops a required field, the schema contract catches it instantly.

## Known API Quirks (FakeStoreAPI)

During validation, the following behaviors were discovered and accommodated in the test suite:
- **`POST /carts`**: Returns HTTP `200` or `201` depending on the state, and echoes the payload with an assigned `id`. Data is not actually persisted.
- **`PUT /carts/:id`**: Returns HTTP `200` and echoes the updated payload *even for non-existent IDs* like `999`. A real API would return `404 Not Found`. Our negative test documents this mock behavior explicitly.
- **`POST /auth/login`**: When passed missing or invalid credentials, the API returns a `400` or `401` status code with a plain-text error string (`"username or password is incorrect"`), rather than a structured JSON error object.

## Extension Plan

If this framework were to be extended over the next 1-3 years, I would prioritize:
1. **Full Pact Contract Testing**: Evolving from AJV schema validation to bidirectional consumer-provider contract testing using Pact. This ensures the frontend and backend teams are mathematically guaranteed to be compatible before deploying.
2. **Parallelisation Strategy**: Utilizing Playwright's sharding capabilities to split data-driven test payloads across multiple GitHub Actions runners.
3. **Reporting**: Integrating Allure Report for API trend analysis and payload attachment logging.
4. **Docker Environment**: Containerizing the test runner to ensure exact parity between local development and CI environments.
