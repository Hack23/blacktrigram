/**
 * Type declarations for jest-axe
 *
 * This module provides axe-core integration for accessibility testing
 * with Vitest/Jest matchers.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

declare module "jest-axe" {
  import type { AxeResults, RunOptions, Spec } from "axe-core";

  export interface JestAxeConfigureOptions {
    globalOptions?: Spec;
    impactLevels?: readonly string[];
  }

  /**
   * Run axe accessibility tests on a DOM element
   */
  export function axe(
    html: Element | string,
    options?: RunOptions,
  ): Promise<AxeResults>;

  /**
   * Configure jest-axe globally
   */
  export function configureAxe(options: JestAxeConfigureOptions): typeof axe;

  /**
   * Custom matchers to extend expect
   */
  export const toHaveNoViolations: {
    toHaveNoViolations(results: AxeResults): {
      message: () => string;
      pass: boolean;
    };
  };
}
