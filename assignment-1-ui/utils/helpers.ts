import { type Page } from '@playwright/test';

/**
 * Shared UI helper utilities.
 *
 * Keep these small and focused — anything that is called in ≥2 spec files belongs here.
 */

/**
 * Build a full URL relative to the base URL.
 * Useful when you need to assert the current URL path.
 */
export function buildUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/$/, '')}${path}`;
}

/**
 * Wait until there are no pending network requests for a given duration.
 * Useful after actions that trigger XHR/fetch calls.
 */
export async function waitForNetworkIdle(page: Page, timeout = 5_000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Scroll to the bottom of the page.
 * Useful for triggering lazy-loaded content in inventories.
 */
export async function scrollToBottom(page: Page): Promise<void> {
  await page.evaluate(() => {
    // eslint-disable-next-line no-undef
    (globalThis as Window & typeof globalThis).scrollTo(
      0,
      (globalThis as Window & typeof globalThis).document.body.scrollHeight,
    );
  });
}

/**
 * Returns the current page URL path (everything after the origin).
 * e.g. "/inventory.html" from "https://www.saucedemo.com/inventory.html"
 */
export function getUrlPath(url: string): string {
  return new URL(url).pathname;
}
