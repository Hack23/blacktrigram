/**
 * Vitest matcher augmentation for jest-axe
 *
 * This extends Vitest's Assertion interface to include the toHaveNoViolations matcher
 * provided by jest-axe for accessibility testing.
 */

import "vitest";

declare module "vitest" {
  interface Assertion {
    /**
     * Assert that there are no accessibility violations
     * @see https://github.com/nickcolley/jest-axe
     */
    toHaveNoViolations(): void;
  }
  interface AsymmetricMatchersContaining {
    /**
     * Assert that there are no accessibility violations
     * @see https://github.com/nickcolley/jest-axe
     */
    toHaveNoViolations(): void;
  }
}
