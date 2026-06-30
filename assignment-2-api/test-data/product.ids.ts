/**
 * Product IDs for data-driven cart tests.
 *
 * FakeStore API has 20 products (IDs 1–20).
 * These IDs are used in the parameterised test to verify that
 * a cart can be created with any valid product.
 */

export interface ProductTestCase {
  productId: number;
  description: string;
}

/**
 * Dataset for the data-driven test in cart.data-driven.spec.ts.
 * Minimum 3 entries as per assignment requirements.
 */
export const productTestCases: ProductTestCase[] = [
  { productId: 1, description: 'Fjallraven Backpack (electronics)' },
  { productId: 6, description: 'Solid Gold Petite Micropave (jewellery)' },
  { productId: 11, description: 'Silicon Power SSD (electronics)' },
  { productId: 15, description: 'BIYLACLESEN Hoodie (men clothing)' },
  { productId: 20, description: 'DANVOUY Womens T-Shirt (women clothing)' },
];
