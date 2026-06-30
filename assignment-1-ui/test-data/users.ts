/**
 * SauceDemo user credentials.
 *
 * These are publicly documented on https://www.saucedemo.com — no secrets concern.
 * All accounts share the same password.
 */

export const SAUCE_PASSWORD = 'secret_sauce';

export const Users = {
  /** Standard user — full access, no issues */
  standard: {
    username: 'standard_user',
    password: SAUCE_PASSWORD,
  },

  /** Locked out user — login is blocked */
  locked: {
    username: 'locked_out_user',
    password: SAUCE_PASSWORD,
  },

  /** Problem user — images are broken, some interactions are buggy */
  problem: {
    username: 'problem_user',
    password: SAUCE_PASSWORD,
  },

  /** Performance glitch user — login has an artificial delay */
  performanceGlitch: {
    username: 'performance_glitch_user',
    password: SAUCE_PASSWORD,
  },
} as const;

export type UserKey = keyof typeof Users;
