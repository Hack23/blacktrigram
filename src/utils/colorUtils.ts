import * as PIXI from "pixi.js";

/**
 * Utility functions for converting between different color formats
 * Used throughout Black Trigram for PixiJS and CSS compatibility
 */

/**
 * Convert numeric color to hex string for CSS
 */
export function numericToHex(color: number): string {
  return `#${color.toString(16).padStart(6, "0")}`;
}

/**
 * Convert hex string to numeric color for PixiJS
 */
export function hexToNumeric(hex: string): number {
  return parseInt(hex.replace("#", ""), 16);
}

/**
 * Convert KOREAN_COLORS numeric values to CSS-compatible colors
 */
export function convertKoreanColorForCSS(colorValue: number | string): string {
  if (typeof colorValue === "string") {
    return colorValue;
  }
  return numericToHex(colorValue);
}

/**
 * Ensure color is valid for PixiJS (numeric)
 */
export function ensurePixiColor(color: number | string): number {
  if (typeof color === "number") {
    return color;
  }
  return hexToNumeric(color);
}

/**
 * Lighten a color
 * @param color - The original color
 * @returns The lightened color
 */
export function lightenColor(color: number): number {
  let r = (color >> 16) & 0xff;
  let g = (color >> 8) & 0xff;
  let b = color & 0xff;

  r = Math.min(255, r + 25);
  g = Math.min(255, g + 25);
  b = Math.min(255, b + 25);

  return (r << 16) | (g << 8) | b;
}

import { STANCE_VISUAL_THEMES, CYBERPUNK_PALETTE } from "../types/constants";
import type { TrigramStance } from "../types";

export function getTrigramColor(
  stance: TrigramStance,
  type: "primary" | "secondary" | "glow" = "primary"
): number {
  const theme = STANCE_VISUAL_THEMES[stance];
  if (theme) {
    return theme[type];
  }
  // Fallback color if stance or type is not found
  return CYBERPUNK_PALETTE.TEXT_SECONDARY; // Cyberpunk neutral fallback
}

export function getTrigramColorFromTheme(
  stance: TrigramStance,
  themePart: "primary" | "secondary" | "glow" = "primary"
): number {
  const theme = STANCE_VISUAL_THEMES[stance];
  return theme ? theme[themePart] : CYBERPUNK_PALETTE.TECH_WHITE; // Default to tech white if not found
}
