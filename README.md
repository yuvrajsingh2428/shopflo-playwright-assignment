# shopflo-assignment

QA test suite for two assignments:

| Assignment | Target | Framework |
|---|---|---|
| [assignment-1-ui](./assignment-1-ui) | [saucedemo.com](https://www.saucedemo.com) | Playwright + TypeScript |
| [assignment-2-api](./assignment-2-api) | [fakestoreapi.com](https://fakestoreapi.com) | Playwright + AJV + TypeScript |

---

## Repository Structure

```
shopflo-assignment/
├── assignment-1-ui/     ← Playwright UI tests (POM, positive, negative, e2e)
├── assignment-2-api/    ← Playwright API tests (CRUD, auth, data-driven, contract)
├── .github/
│   └── workflows/
│       └── ci.yml       ← Single unified pipeline
└── README.md
```

---

## Framework Choice

### Why Playwright?

- First-class TypeScript support with zero config overhead
- Built-in `APIRequestContext` — handles both UI and API testing with one tool
- Parallel execution, retry logic, and multi-reporter support out of the box
- Official `@playwright/test` runner replaces the need for Jest or Mocha
- Active community, excellent docs, backed by Microsoft

### Why AJV + JSON Schema (API package)?

- JSON Schema is the industry-standard format used in OpenAPI, Postman, and contract testing tools
- `.schema.json` files are language-agnostic and portable — they serve as living contract artefacts
- AJV is the fastest and most widely adopted JSON Schema validator for Node.js
- Makes the senior bonus (contract test) explicit and self-documenting

---

## Assignment 1 — UI Tests (saucedemo.com)

### Setup

```bash
cd assignment-1-ui
npm install
npx playwright install chromium
```

### Environment

Create a `.env` file (see `.env.example`):

```
BASE_URL=https://www.saucedemo.com
```

> SauceDemo credentials are public and live in `test-data/users.ts` — no `.env` entry required.

### Running Tests

```bash
# Run all tests (headless Chromium)
npm test

# Run with browser visible
npm run test:headed

# Run in debug / step-through mode
npm run test:debug

# Open last HTML report
npm run report
```

### Test Coverage

| Area | Type | File |
|---|---|---|
| Login | Positive | `tests/login/login.positive.spec.ts` |
| Login | Negative | `tests/login/login.negative.spec.ts` |
| Inventory | Positive | `tests/inventory/inventory.positive.spec.ts` |
| Inventory | Negative | `tests/inventory/inventory.negative.spec.ts` |
| Cart | Positive + Negative | `tests/cart/cart.spec.ts` |
| Full Checkout | End-to-End | `tests/e2e/checkout.e2e.spec.ts` |

### Architecture

```
pages/            ← Page Object Model (one class per page)
fixtures/         ← auth.fixture.ts (pre-authenticated storageState)
test-data/        ← Typed credential map and product name constants
utils/            ← Shared UI helpers
```

---

## Assignment 2 — API Tests (fakestoreapi.com)

### Setup

```bash
cd assignment-2-api
npm install
```

### Environment

Create a `.env` file (see `.env.example`):

```
API_BASE_URL=https://fakestoreapi.com
```

### Running Tests

```bash
# Run all tests
npm test

# Run in debug mode
npm run test:debug

# Open last HTML report
npm run report
```

### Test Coverage

| Area | Type | File |
|---|---|---|
| Auth — POST /auth/login | Positive + Negative | `tests/auth/auth.spec.ts` |
| Cart — POST /carts | Positive + Negative | `tests/cart/cart.post.spec.ts` |
| Cart — GET /carts/:id | Positive + Negative | `tests/cart/cart.get.spec.ts` |
| Cart — PUT /carts/:id | Positive + Negative | `tests/cart/cart.put.spec.ts` |
| Cart — DELETE /carts/:id | Positive + Negative | `tests/cart/cart.delete.spec.ts` |
| Data-driven (3 product IDs) | Data-driven | `tests/data-driven/cart.data-driven.spec.ts` |
| Schema contract (senior bonus) | Contract | `tests/contract/cart.contract.spec.ts` |

### Architecture

```
schemas/          ← JSON Schema files (.schema.json) — AJV validates responses against these
fixtures/         ← api.fixture.ts (APIRequestContext with baseURL)
test-data/        ← Typed request payloads and product ID dataset
utils/            ← schemaValidator.ts (AJV wrapper)
```

---

## CI/CD

GitHub Actions — single workflow at `.github/workflows/ci.yml`

**Pipeline on every push to `main` and every PR:**

```
Lint (both packages)
    ↓
UI Tests ──────┐
               ├── (parallel)
API Tests ─────┘
```

HTML reports are uploaded as GitHub Actions artifacts after every run (including failures).

---

## Extension Roadmap

| Phase | Extension | Value |
|---|---|---|
| Phase 2 | **Allure Reporting** | Test history, trend charts, flakiness tracking |
| Phase 2 | **Browser caching in CI** | Shave ~2 min off every run |
| Phase 3 | **Docker** | Reproducible environment, self-hosted runner support |
| Phase 3 | **Test sharding** | 3× speedup via GitHub Actions matrix |
| Phase 4 | **Visual testing** | `toHaveScreenshot()` for UI regression |
| Phase 4 | **Full Pact contract testing** | Bidirectional consumer-provider contracts |

---

## Prerequisites

- Node.js 20 LTS
- npm 9+
