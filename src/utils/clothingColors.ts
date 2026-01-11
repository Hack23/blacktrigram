/**
 * Clothing Color Utilities
 *
 * **Korean**: 의류 색상 유틸리티 (Clothing Color Utilities)
 *
 * Provides color manipulation and variation functions for clothing customization
 * while maintaining Korean cyberpunk aesthetic principles.
 *
 * @module utils/clothingColors
 * @category Utilities
 * @korean 의류색상유틸리티
 */

import * as THREE from "three";

/**
 * Adjust color brightness
 *
 * @param hexColor - Base color as hex number
 * @param factor - Brightness factor (0 = black, 1 = original, 2 = twice as bright)
 * @returns Adjusted color as hex number
 * @korean 색상밝기조정
 */
export function adjustBrightness(hexColor: number, factor: number): number {
  const color = new THREE.Color(hexColor);
  
  // Adjust RGB values
  color.r = Math.min(1, color.r * factor);
  color.g = Math.min(1, color.g * factor);
  color.b = Math.min(1, color.b * factor);
  
  return color.getHex();
}

/**
 * Adjust color saturation
 *
 * @param hexColor - Base color as hex number
 * @param saturation - Saturation amount (0 = grayscale, 1 = original, >1 = more saturated)
 * @returns Adjusted color as hex number
 * @korean 색상채도조정
 */
export function adjustSaturation(hexColor: number, saturation: number): number {
  const color = new THREE.Color(hexColor);
  const hsl = { h: 0, s: 0, l: 0 };
  color.getHSL(hsl);
  
  // Adjust saturation
  hsl.s = Math.min(1, Math.max(0, hsl.s * saturation));
  color.setHSL(hsl.h, hsl.s, hsl.l);
  
  return color.getHex();
}

/**
 * Shift color hue
 *
 * @param hexColor - Base color as hex number
 * @param shift - Hue shift amount (0-1, wraps around)
 * @returns Shifted color as hex number
 * @korean 색상색조이동
 */
export function shiftHue(hexColor: number, shift: number): number {
  const color = new THREE.Color(hexColor);
  const hsl = { h: 0, s: 0, l: 0 };
  color.getHSL(hsl);
  
  // Shift hue (wraps around)
  hsl.h = (hsl.h + shift) % 1;
  if (hsl.h < 0) hsl.h += 1;
  
  color.setHSL(hsl.h, hsl.s, hsl.l);
  
  return color.getHex();
}

/**
 * Mix two colors
 *
 * @param color1 - First color as hex number
 * @param color2 - Second color as hex number
 * @param blend - Blend factor (0 = all color1, 1 = all color2)
 * @returns Mixed color as hex number
 * @korean 색상혼합
 */
export function mixColors(color1: number, color2: number, blend: number): number {
  const c1 = new THREE.Color(color1);
  const c2 = new THREE.Color(color2);
  
  const t = Math.max(0, Math.min(1, blend));
  
  c1.lerp(c2, t);
  
  return c1.getHex();
}

/**
 * Create color variation (for team colors, customization, etc.)
 *
 * @param baseColor - Base color as hex number
 * @param variationType - Type of variation to apply
 * @returns Variant color as hex number
 * @korean 색상변형
 */
export function createColorVariation(
  baseColor: number,
  variationType: "lighter" | "darker" | "saturated" | "desaturated" | "complementary"
): number {
  switch (variationType) {
    case "lighter":
      return adjustBrightness(baseColor, 1.3);
    
    case "darker":
      return adjustBrightness(baseColor, 0.7);
    
    case "saturated":
      return adjustSaturation(baseColor, 1.4);
    
    case "desaturated":
      return adjustSaturation(baseColor, 0.6);
    
    case "complementary":
      return shiftHue(baseColor, 0.5); // Opposite on color wheel
    
    default:
      return baseColor;
  }
}

/**
 * Generate team color set from base color
 *
 * Useful for multiplayer team identification while maintaining aesthetic
 *
 * @param baseColor - Base team color as hex number
 * @returns Set of related team colors
 * @korean 팀색상생성
 */
export function generateTeamColors(baseColor: number): {
  primary: number;
  light: number;
  dark: number;
  accent: number;
} {
  return {
    primary: baseColor,
    light: adjustBrightness(baseColor, 1.4),
    dark: adjustBrightness(baseColor, 0.6),
    accent: shiftHue(baseColor, 0.1), // Slight hue shift for accent
  };
}

/**
 * Apply damage/dirt effect to clothing color
 *
 * Simulates visual wear from combat
 *
 * @param baseColor - Clean clothing color as hex number
 * @param damageLevel - Amount of damage (0 = pristine, 1 = heavily damaged)
 * @returns Damaged color as hex number
 * @korean 손상색상적용
 */
export function applyDamageColor(baseColor: number, damageLevel: number): number {
  const damage = Math.max(0, Math.min(1, damageLevel));
  
  // Darken and desaturate with damage
  let color = adjustBrightness(baseColor, 1 - damage * 0.4);
  color = adjustSaturation(color, 1 - damage * 0.5);
  
  // Mix with brown/dirt color for heavily damaged
  if (damage > 0.5) {
    const dirtColor = 0x3d2817; // Brown dirt color
    color = mixColors(color, dirtColor, (damage - 0.5) * 0.4);
  }
  
  return color;
}

/**
 * Check if color is light or dark (for contrast calculations)
 *
 * @param hexColor - Color to check as hex number
 * @returns True if color is light, false if dark
 * @korean 밝은색상확인
 */
export function isLightColor(hexColor: number): boolean {
  const color = new THREE.Color(hexColor);
  
  // Use perceived luminance formula
  const luminance = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
  
  return luminance > 0.5;
}

/**
 * Get contrasting color for text/UI elements
 *
 * @param backgroundColor - Background color as hex number
 * @returns Contrasting color (black or white) as hex number
 * @korean 대비색상가져오기
 */
export function getContrastingColor(backgroundColor: number): number {
  return isLightColor(backgroundColor) ? 0x000000 : 0xffffff;
}

/**
 * Create color palette from archetype theme
 *
 * Generates a cohesive palette maintaining Korean cyberpunk aesthetic
 *
 * @param primaryColor - Primary archetype color
 * @param accentColor - Accent/secondary color
 * @returns Expanded color palette
 * @korean 색상팔레트생성
 */
export function createArchetypePalette(
  primaryColor: number,
  accentColor: number
): {
  primary: number;
  primaryLight: number;
  primaryDark: number;
  accent: number;
  accentLight: number;
  accentDark: number;
  neutral: number;
} {
  return {
    primary: primaryColor,
    primaryLight: adjustBrightness(primaryColor, 1.3),
    primaryDark: adjustBrightness(primaryColor, 0.7),
    accent: accentColor,
    accentLight: adjustBrightness(accentColor, 1.3),
    accentDark: adjustBrightness(accentColor, 0.7),
    neutral: mixColors(primaryColor, accentColor, 0.5),
  };
}
