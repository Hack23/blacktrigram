/**
 * Main constants export for Black Trigram Korean martial arts system
 */

// Fix: Remove duplicate exports and ensure proper imports
export { CYBERPUNK_COLORS, KOREAN_COLORS } from "./colors";
export {
  FONT_FAMILY,
  FONT_SIZES,
  FONT_WEIGHTS,
  // KOREAN_FONT_FAMILY, // Not exported from typography.ts
  KOREAN_FONT_WEIGHTS,
  KOREAN_TEXT_SIZES,
  // PIXI_TEXT_STYLES, // Archived - PixiJS
} from "./typography";
export { HEALTH_COLORS, UI_CONSTANTS } from "./ui";

// Fix: Provide default export
export { KOREAN_COLORS as default } from "./colors";

// Fix: Add missing KOREAN_TYPOGRAPHY export
// export { KOREAN_TYPOGRAPHY } from "./typography"; // Archived - PixiJS

// Fix: Add missing PIXI_FONT_WEIGHTS export
// export { PIXI_FONT_WEIGHTS } from "./typography"; // Archived - PixiJS

// Fix: Add missing ANIMATION_DURATIONS export
export { ANIMATION_DURATIONS } from "./animations";

export const ARCHETYPE_TECHNIQUE_BONUSES: Record<
  string,
  Record<string, number>
> = {
  // Define bonuses for each archetype
};

export const MAX_TRANSITION_COST_KI = 50;
export const MAX_TRANSITION_COST_STAMINA = 30;
export const MAX_TRANSITION_TIME_MILLISECONDS = 1000;
