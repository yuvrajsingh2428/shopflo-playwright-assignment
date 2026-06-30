/**
 * Typed request payloads for Cart API tests.
 *
 * FakeStore API accepts these shapes for POST /carts and PUT /carts/:id.
 * Note: FakeStore is a mock API — mutations return synthetic responses,
 * but the request/response contract is still testable.
 */

export interface CartProduct {
  productId: number;
  quantity: number;
}

export interface CartPayload {
  userId: number;
  date: string;
  products: CartProduct[];
}

/** A valid cart creation payload */
export const validCartPayload: CartPayload = {
  userId: 1,
  date: '2024-01-15',
  products: [
    { productId: 1, quantity: 2 },
    { productId: 2, quantity: 1 },
  ],
};

/** A cart payload with multiple items — used in update (PUT) tests */
export const updatedCartPayload: CartPayload = {
  userId: 1,
  date: '2024-02-20',
  products: [
    { productId: 3, quantity: 1 },
    { productId: 5, quantity: 4 },
  ],
};

/** A minimal single-item cart payload */
export const singleItemCartPayload: CartPayload = {
  userId: 2,
  date: '2024-03-01',
  products: [{ productId: 1, quantity: 1 }],
};

/** A cart payload with a high-quantity item */
export const bulkCartPayload: CartPayload = {
  userId: 3,
  date: '2024-04-10',
  products: [{ productId: 4, quantity: 10 }],
};
