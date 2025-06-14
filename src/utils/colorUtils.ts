import { KOREAN_COLORS } from "../types/constants/colors";
import type { PlayerArchetype } from "../types/enums";

/**
 * Convert RGB components to hex color
 */
export function rgbToHex(r: number, g: number, b: number): number {
  return ((r & 0xff) << 16) | ((g & 0xff) << 8) | (b & 0xff);
}

/**
 * Convert hex color to RGB components
 */
export function hexToRgb(hex: number): { r: number; g: number; b: number } {
  return {
    r: (hex >> 16) & 0xff,
    g: (hex >> 8) & 0xff,
    b: hex & 0xff,
  };
}

/**
 * Darken a color by a specified amount
 */
export function darkenColor(color: number, amount: number = 0.1): number {
  const { r, g, b } = hexToRgb(color);
  const factor = Math.max(0, 1 - amount);

  return rgbToHex(
    Math.floor(r * factor),
    Math.floor(g * factor),
    Math.floor(b * factor)
  );
}

/**
 * Lighten a color by a specified amount
 */
export function lightenColor(color: number, amount: number = 0.1): number {
  const { r, g, b } = hexToRgb(color);
  const factor = Math.min(1, amount);

  return rgbToHex(
    Math.min(255, Math.floor(r + (255 - r) * factor)),
    Math.min(255, Math.floor(g + (255 - g) * factor)),
    Math.min(255, Math.floor(b + (255 - b) * factor))
  );
}

/**
 * Get archetype colors
 */
export function getArchetypeColors(archetype: PlayerArchetype): {
  primary: number;
  secondary: number;
} {
  const colorMap: Record<
    PlayerArchetype,
    { primary: number; secondary: number }
  > = {
    musa: {
      primary: KOREAN_COLORS.ACCENT_GOLD,
      secondary: KOREAN_COLORS.SECONDARY_BROWN_DARK, // Fix: Use SECONDARY_BROWN_DARK
    },
    amsalja: {
      primary: KOREAN_COLORS.PRIMARY_RED, // Fix: Use PRIMARY_RED instead of PRIMARY_PURPLE
      secondary: KOREAN_COLORS.UI_STEEL_GRAY,
    },
    hacker: {
      primary: KOREAN_COLORS.PRIMARY_CYAN,
      secondary: KOREAN_COLORS.ACCENT_BLUE,
    },
    jeongbo_yowon: {
      primary: KOREAN_COLORS.POSITIVE_GREEN,
      secondary: KOREAN_COLORS.UI_STEEL_GRAY_DARK,
    },
    jojik_pokryeokbae: {
      primary: KOREAN_COLORS.ACCENT_RED,
      secondary: KOREAN_COLORS.SECONDARY_BROWN_DARK, // Fix: Use SECONDARY_BROWN_DARK
    },
  };

  return (
    colorMap[archetype] || {
      primary: KOREAN_COLORS.WHITE_SOLID,
      secondary: KOREAN_COLORS.UI_STEEL_GRAY,
    }
  );
}

/**
 * Interpolate between two colors
 */
export function interpolateColor(
  color1: number,
  color2: number,
  factor: number
): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const r = Math.floor(rgb1.r + (rgb2.r - rgb1.r) * factor);
  const g = Math.floor(rgb1.g + (rgb2.g - rgb1.g) * factor);
  const b = Math.floor(rgb1.b + (rgb2.b - rgb1.b) * factor);

  return rgbToHex(r, g, b);
}

/**
 * Get color with alpha (for PIXI)
 */
export function getColorWithAlpha(color: number, alpha: number): number {
  return (Math.floor(alpha * 255) << 24) | color;
}

/**
 * Convert PIXI color to standard hex
 */
export function pixiToHex(pixiColor: number): string {
  return `#${pixiColor.toString(16).padStart(6, "0")}`;
}

/**
 * Get contrast color (black or white) for given background
 */
export function getContrastColor(backgroundColor: number): number {
  const { r, g, b } = hexToRgb(backgroundColor);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5
    ? KOREAN_COLORS.BLACK_SOLID
    : KOREAN_COLORS.WHITE_SOLID;
}

/**
 * Get color based on health percentage
 */
export function getHealthColor(healthPercentage: number): number {
  if (healthPercentage > 0.6) {
    return KOREAN_COLORS.POSITIVE_GREEN;
  } else if (healthPercentage > 0.3) {
    return KOREAN_COLORS.SECONDARY_YELLOW;
  } else {
    return KOREAN_COLORS.ACCENT_RED;
  }
}

// DO NOT ADD ANY MORE FUNCTIONS BELOW THIS LINE
// All functions are already exported above using individual export statements
