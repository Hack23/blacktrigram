/**
 * Color utility functions for Three.js components
 * 
 * @module utils/colorHelpers
 * @category Utilities
 */

import { colorUtils } from '../types/constants/colors';

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

/**
 * Extract RGB components from hex color value
 * Re-export of colorUtils.hexToRgb for mobile component convenience
 * 
 * @param color - Hex color value (e.g., 0x00ffff)
 * @returns RGB components as object with r, g, b properties (0-255)
 * @korean RGB추출
 * 
 * @example
 * ```typescript
 * const { r, g, b } = getColorRGB(0x00ffff);
 * // { r: 0, g: 255, b: 255 }
 * 
 * // Use in CSS rgba
 * const cssColor = `rgba(${r}, ${g}, ${b}, 0.8)`;
 * ```
 */
export const getColorRGB = colorUtils.hexToRgb;
