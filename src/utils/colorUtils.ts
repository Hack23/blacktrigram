import type { PlayerArchetype } from "../types/common";
import { KOREAN_COLORS } from "../types/constants/colors";

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
    Math.floor(b * factor),
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
    Math.min(255, Math.floor(b + (255 - b) * factor)),
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
      primary: KOREAN_COLORS.PRIMARY_CYAN, // Stealth assassin - cyan theme
      secondary: KOREAN_COLORS.KOREAN_BLACK,
    },
    hacker: {
      primary: KOREAN_COLORS.SECONDARY_PURPLE, // Cyber hacker - purple theme
      secondary: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
    },
    jeongbo_yowon: {
      primary: KOREAN_COLORS.ACCENT_BLUE, // Intelligence operative - blue tactical theme
      secondary: KOREAN_COLORS.UI_BACKGROUND_DARK,
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
  factor: number,
): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const r = Math.floor(rgb1.r + (rgb2.r - rgb1.r) * factor);
  const g = Math.floor(rgb1.g + (rgb2.g - rgb1.g) * factor);
  const b = Math.floor(rgb1.b + (rgb2.b - rgb1.b) * factor);

  return rgbToHex(r, g, b);
}

/**
 * Get color with alpha
 */
export function getColorWithAlpha(color: number, alpha: number): number {
  return (Math.floor(alpha * 255) << 24) | color;
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

/**
 * Convert hex color to RGBA string for CSS
 * @param hex - Hex color value (e.g., 0x1a1a1a)
 * @param alpha - Alpha value between 0 and 1 (default: 1)
 * @returns RGBA string (e.g., "rgba(26, 26, 26, 0.96)")
 */
export function hexToRgbaString(hex: number, alpha: number = 1): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Convert numeric color to hex string for CSS
 * @param color - Numeric color value (e.g., 0x00ffff)
 * @returns Hex color string without # prefix (e.g., "00ffff")
 * @example
 * toHex(0x00ffff) // "00ffff"
 * toHex(KOREAN_COLORS.PRIMARY_CYAN) // "00ffff"
 */
export function toHex(color: number): string {
  return color.toString(16).padStart(6, "0");
}

/**
 * Convert numeric color to CSS hex string with # prefix
 * @param color - Numeric color value (e.g., 0x00ffff)
 * @returns CSS hex color string (e.g., "#00ffff")
 * @example
 * hexColorToCSS(0x00ffff) // "#00ffff"
 * hexColorToCSS(KOREAN_COLORS.PRIMARY_CYAN) // "#00ffff"
 */
export function hexColorToCSS(color: number): string {
  return `#${color.toString(16).padStart(6, "0")}`;
}

/**
 * Skin tone definitions for archetype visual differentiation
 *
 * **Korean**: 원형별 피부색 (Archetype Skin Tones)
 *
 * Each archetype has a unique skin tone that reflects their
 * background and lifestyle:
 * - MUSA: Healthy tan from outdoor training
 * - AMSALJA: Pale from stealth operations in darkness
 * - HACKER: Slightly pale from indoor tech work
 * - JEONGBO_YOWON: Natural healthy tone
 * - JOJIK_POKRYEOKBAE: Weathered from street life
 *
 * @korean 원형피부색
 */
const ARCHETYPE_SKIN_TONES: Record<PlayerArchetype, number> = {
  musa: 0xdbb896, // Healthy tan - outdoor military training
  amsalja: 0xe8d4c4, // Pale complexion - stealth operative
  hacker: 0xf0d8c8, // Light skin - indoor tech work
  jeongbo_yowon: 0xe0c4a8, // Natural healthy tone - government operative
  jojik_pokryeokbae: 0xc8a882, // Weathered tan - street fighter
};

/**
 * Get skin tone color for archetype
 *
 * **Korean**: 원형 피부색 가져오기 (Get Archetype Skin Tone)
 *
 * Returns the skin tone color appropriate for the character's
 * background and lifestyle. Used for body, face, and exposed skin.
 *
 * @param archetype - Player archetype
 * @returns Skin tone color as hex number
 *
 * @example
 * ```typescript
 * const skinColor = getArchetypeSkinTone(PlayerArchetype.MUSA);
 * // Returns: 0xdbb896 (healthy tan)
 * ```
 *
 * @korean 원형피부색가져오기
 */
export function getArchetypeSkinTone(archetype: PlayerArchetype): number {
  return ARCHETYPE_SKIN_TONES[archetype] ?? KOREAN_COLORS.SKIN_TONE;
}

/**
 * Get extended archetype visual properties
 *
 * **Korean**: 원형 시각 속성 (Archetype Visual Properties)
 *
 * Returns comprehensive visual properties for an archetype including:
 * - Primary and secondary colors (from clothing theme)
 * - Skin tone color
 * - Emissive accent color for glow effects
 * - Material properties (metalness, roughness)
 *
 * @param archetype - Player archetype
 * @returns Extended visual properties object
 *
 * @korean 원형시각속성
 */
export function getArchetypeVisualProperties(archetype: PlayerArchetype): {
  readonly primary: number;
  readonly secondary: number;
  readonly skinTone: number;
  readonly emissive: number;
  readonly emissiveIntensity: number;
} {
  const colors = getArchetypeColors(archetype);
  const skinTone = getArchetypeSkinTone(archetype);

  // Emissive colors based on archetype theme
  const emissiveMap: Record<
    PlayerArchetype,
    { color: number; intensity: number }
  > = {
    musa: { color: KOREAN_COLORS.ACCENT_GOLD, intensity: 0.1 },
    amsalja: { color: KOREAN_COLORS.PRIMARY_CYAN, intensity: 0.3 },
    hacker: { color: KOREAN_COLORS.SECONDARY_PURPLE, intensity: 0.25 },
    jeongbo_yowon: { color: KOREAN_COLORS.ACCENT_BLUE, intensity: 0.15 },
    jojik_pokryeokbae: { color: KOREAN_COLORS.ACCENT_RED, intensity: 0.2 },
  };

  const emissiveProps = emissiveMap[archetype] ?? {
    color: 0x000000,
    intensity: 0,
  };

  return {
    primary: colors.primary,
    secondary: colors.secondary,
    skinTone,
    emissive: emissiveProps.color,
    emissiveIntensity: emissiveProps.intensity,
  };
}

// DO NOT ADD ANY MORE FUNCTIONS BELOW THIS LINE
// All functions are already exported above using individual export statements
