/**
 * SauceDemo product names.
 *
 * Used to avoid magic strings in tests and provide refactorable constants.
 * Product names are stable and publicly known from the SauceDemo catalogue.
 */

export const Products = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltTShirt: 'Sauce Labs Bolt T-Shirt',
  fleeceJacket: 'Sauce Labs Fleece Jacket',
  onesie: 'Sauce Labs Onesie',
  redTShirt: 'Test.allTheThings() T-Shirt (Red)',
} as const;

export type ProductName = (typeof Products)[keyof typeof Products];

/** All product names as an array — useful for data-driven tests */
export const ALL_PRODUCTS: ProductName[] = Object.values(Products);

/** Sort option values used in the SauceDemo sort dropdown */
export const SortOptions = {
  nameAZ: 'az',
  nameZA: 'za',
  priceLowHigh: 'lohi',
  priceHighLow: 'hilo',
} as const;
