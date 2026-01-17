/**
 * Validates arena scale values to prevent invalid calculations.
 * 
 * @packageDocumentation
 */

/**
 * Validates an arena scale value and returns a safe fallback if invalid.
 * 
 * Ensures the scale is:
 * - A finite number (not NaN or Infinity)
 * - Greater than zero (prevents division by zero and inverted movement)
 * 
 * Invalid values trigger a console warning in development mode only,
 * avoiding performance impact in production where this may be called
 * frequently (up to 60 times per second during movement updates).
 * 
 * @param rawScale - The raw scale value to validate (may be undefined)
 * @param componentName - Name of the component for logging purposes
 * @returns A valid arena scale value (defaults to 1.0 if invalid)
 * 
 * @example
 * ```typescript
 * const scale = getValidatedArenaScale(arenaBounds.scale, 'inputSystem');
 * // Returns valid scale or 1.0 (with dev warning if invalid)
 * ```
 */
export function getValidatedArenaScale(
  rawScale: number | undefined,
  componentName: string
): number {
  const scale = rawScale ?? 1.0;
  
  if (Number.isFinite(scale) && scale > 0) {
    return scale;
  }
  
  // Only log in development to avoid performance impact in production
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      `[${componentName}] Invalid arena scale: ${String(rawScale)}, falling back to 1.0`
    );
  }
  
  return 1.0;
}
