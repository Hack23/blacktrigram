/**
 * Main constants export for Black Trigram Korean martial arts system
 */

// Re-export all constants from subdirectories
export * from "./colors";
export * from "./combat";
export * from "./controls";
export * from "./game";
export * from "./player";
export * from "./techniques";
export * from "./trigram";
export * from "./typography";
export * from "./vital-points";

// Legacy exports for compatibility
export { KOREAN_COLORS } from "./colors";
export { CYBERPUNK_PALETTE } from "./colors";

// Additional constants that don't fit in specific categories
export const APP_CONSTANTS = {
  NAME: "흑괘 (Black Trigram)",
  VERSION: "1.0.0",
  DESCRIPTION: "Korean Martial Arts Combat Simulator",
} as const;
