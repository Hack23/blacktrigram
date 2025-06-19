/**
 * Re-export all constants from the constants directory
 * Single source of truth for all game constants
 */

// Fix: Export only from index to avoid conflicts
export * from "./constants/index";

// Remove duplicate exports that cause conflicts
// All constants should be exported through constants/index.ts

// Add missing color constants
export const KOREAN_COLORS = {
  // ...existing colors...

  // Add missing constants
  TEXT_DISABLED: 0x666666,
  CARDINAL_EAST: 0x00ff88,
  CARDINAL_WEST: 0xffffff,
  CARDINAL_SOUTH: 0xff4444,
  CARDINAL_NORTH: 0x000000,
  CARDINAL_CENTER: 0xffaa00,
  TRIGRAM_GEON_SECONDARY: 0x4a90e2,
  TRIGRAM_SON_SECONDARY: 0x7ed321,
  TRIGRAM_TAE_SECONDARY: 0xf5a623,
  TRIGRAM_JIN_SECONDARY: 0xd0021b,
  ACCENT_MAGENTA: 0x9013fe,
  UI_DARK_GRAY: 0x2d2d2d,

  // ...existing colors...
} as const;
