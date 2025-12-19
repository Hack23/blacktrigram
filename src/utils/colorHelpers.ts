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

/**
 * Mix two hex colors with a given ratio
 * 
 * Performs linear interpolation between two colors using bit-shifting operations.
 * Useful for damage visualization, bruising effects, and color transitions.
 * 
 * @param color1 - First color (hex value, e.g., 0xffdbac)
 * @param color2 - Second color (hex value, e.g., 0x663366)
 * @param ratio - Mix ratio (0-1, where 0 = color1, 1 = color2)
 * @returns Mixed color as hex value
 * @korean 색상혼합
 * 
 * @example
 * ```typescript
 * // Mix skin color with bruise color at 30%
 * const skinColor = 0xffdbac;
 * const bruiseColor = 0x663366;
 * const damaged = mixColors(skinColor, bruiseColor, 0.3);
 * 
 * // Gradually transition between colors
 * const transitionColor = mixColors(startColor, endColor, progress);
 * ```
 */
export function mixColors(color1: number, color2: number, ratio: number): number {
  // Extract RGB components from color1
  const r1 = (color1 >> 16) & 0xff;
  const g1 = (color1 >> 8) & 0xff;
  const b1 = color1 & 0xff;
  
  // Extract RGB components from color2
  const r2 = (color2 >> 16) & 0xff;
  const g2 = (color2 >> 8) & 0xff;
  const b2 = color2 & 0xff;
  
  // Linear interpolation for each channel
  const r = Math.floor(r1 * (1 - ratio) + r2 * ratio);
  const g = Math.floor(g1 * (1 - ratio) + g2 * ratio);
  const b = Math.floor(b1 * (1 - ratio) + b2 * ratio);
  
  // Combine back into hex value
  return (r << 16) | (g << 8) | b;
}

