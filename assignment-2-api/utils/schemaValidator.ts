import Ajv, { type JSONSchemaType, type ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';

/**
 * schemaValidator.ts
 *
 * Singleton AJV instance shared across all API tests.
 * Validates API response bodies against JSON Schema files.
 *
 * Usage:
 *   import { validate } from '../../utils/schemaValidator';
 *   import cartSchema from '../../schemas/cart.schema.json';
 *
 *   validate(cartSchema, responseBody);  // throws on mismatch
 */

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

/**
 * Validates `data` against the provided JSON Schema.
 *
 * @param schema - A JSON Schema object (imported from schemas/*.schema.json)
 * @param data   - The parsed response body to validate
 * @throws       - An Error with all AJV validation error messages if invalid
 */
export function validate<T>(schema: object, data: unknown): asserts data is T {
  const validateFn: ValidateFunction = ajv.compile(schema as JSONSchemaType<T>);
  const valid = validateFn(data);

  if (!valid) {
    const errors = ajv.errorsText(validateFn.errors, { separator: '\n  ' });
    throw new Error(
      `Schema validation failed:\n  ${errors}\n\nReceived:\n  ${JSON.stringify(data, null, 2)}`,
    );
  }
}

/**
 * Returns true if `data` is valid against the schema, false otherwise.
 * Non-throwing alternative — useful for conditional assertions.
 */
export function isValid(schema: object, data: unknown): boolean {
  const validateFn: ValidateFunction = ajv.compile(schema);
  return validateFn(data) as boolean;
}
