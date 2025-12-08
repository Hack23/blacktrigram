/**
 * Color utility functions for Three.js components
 * 
 * @module utils/colorHelpers
 * @category Utilities
 */

/**
 * Convert a numeric color value to a hex string with # prefix
 * 
 * @param color - Numeric color value (e.g., 0xff6b6b)
 * @returns Hex color string with # prefix (e.g., "#ff6b6b")
 * @korean 색상변환
 * 
 * @example
 * ```typescript
 * toHexColor(0xff6b6b) // "#ff6b6b"
 * toHexColor(KOREAN_COLORS.PRIMARY_CYAN) // "#00ffff"
 * ```
 */
export function toHexColor(color: number): string {
  return `#${color.toString(16).padStart(6, "0")}`;
}
