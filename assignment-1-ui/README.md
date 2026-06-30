# Assignment 1: UI Testing (SauceDemo)

This module contains the automated UI test suite for [saucedemo.com](https://www.saucedemo.com).

## Framework Choice

**Playwright** was selected as the testing framework over Selenium or Cypress.

### Why Playwright?
- **Speed & Parallelization**: Playwright executes tests completely concurrently out of the box using worker processes.
- **Native TypeScript Support**: Zero configuration is required to run strict TypeScript tests, ensuring type safety in POMs and test data.
- **Auto-waiting Mechanism**: Playwright automatically waits for elements to be actionable before performing interactions, drastically reducing test flakiness.
- **Modern Architecture**: It speaks directly to the browser via CDP (Chrome DevTools Protocol), bypassing the overhead of WebDriver.

### Architecture Decisions
- **Page Object Model (POM)**: `pages/` isolates the locators and actions from the assertions.
- **storageState (auth.fixture.ts)**: For a scalable test suite, logging in via the UI for every single test adds significant runtime overhead. We utilized Playwright's `storageState` to log in once per worker, persisting the session cookies/storage. This ensures tests run quickly while remaining completely isolated (since each test still runs in a fresh, incognito `BrowserContext` pre-loaded with the state). This is an enterprise-grade optimization pattern.

## Extension Plan

If this framework were to be extended over the next 1-3 years, I would prioritize:
1. **Parallelisation Strategy**: Sharding tests across multiple GitHub Actions runner nodes (using `npx playwright test --shard=1/3`) to keep execution times under 3 minutes even with hundreds of tests.
2. **Reporting**: Integrating Allure Report for historical trends, flakiness detection, and management-friendly dashboards.
3. **Docker Environment**: Containerizing the test execution so that all developers and CI pipelines run against the exact same browser binaries and OS dependencies.
4. **Visual Regression Testing**: Implementing Playwright's native `toHaveScreenshot()` for critical pages (like the checkout summary) to catch CSS/layout regressions.
