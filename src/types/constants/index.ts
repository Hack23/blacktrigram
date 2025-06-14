/**
 * Main constants export for Black Trigram Korean martial arts system
 */

// Fix: Remove duplicate exports and ensure proper imports
export { KOREAN_COLORS } from "./colors";
export { CYBERPUNK_COLORS } from "./colors";
export { GAME_CONFIG, COMBAT_TIMING, DAMAGE_CONSTANTS } from "./game";
export { COMBAT_CONFIG, COMBAT_CONSTANTS } from "./combat";
export { PLAYER_ARCHETYPES_DATA } from "./player";
export { TRIGRAM_TECHNIQUES, TECHNIQUE_PROPERTIES } from "./techniques";
export { TRIGRAM_DATA, TRIGRAM_STANCES_ORDER } from "./trigram";
export {
  FONT_FAMILY,
  FONT_SIZES,
  FONT_WEIGHTS,
  KOREAN_TEXT_SIZES,
  KOREAN_FONT_FAMILY,
  KOREAN_FONT_WEIGHTS,
  PIXI_TEXT_STYLES,
} from "./typography";
export { UI_CONSTANTS, HEALTH_COLORS } from "./ui";

// Fix: Provide default export
export { KOREAN_COLORS as default } from "./colors";

// Fix: Export COMBAT_CONTROLS from controls
export { COMBAT_CONTROLS } from "./controls";

// Fix: Add missing KOREAN_TYPOGRAPHY export
export { KOREAN_TYPOGRAPHY } from "./typography";

// Fix: Add missing PIXI_FONT_WEIGHTS export
export { PIXI_FONT_WEIGHTS } from "./typography";

// Fix: Add missing ANIMATION_DURATIONS export
export { ANIMATION_DURATIONS } from "./animations";

// Fix: Add missing VITAL_POINT_REGIONS export
export { VITAL_POINT_REGIONS } from "./vital-points";

export const ARCHETYPE_TECHNIQUE_BONUSES: Record<
  string,
  Record<string, number>
> = {
  // Define bonuses for each archetype
};

export const ENHANCED_DAMAGE_CONSTANTS = {
  CRITICAL_MULTIPLIER: 2.0,
  VITAL_POINT_MULTIPLIER: 1.5,
  COMBO_MULTIPLIER: 1.2,
} as const;

// Fix: Add missing STANCE_EFFECTIVENESS_MATRIX
export const STANCE_EFFECTIVENESS_MATRIX: Record<
  string,
  Record<string, number>
> = {
  geon: {
    gon: 1.2,
    son: 0.8,
  },
  tae: {
    jin: 1.2,
    gan: 0.8,
  },
  li: {
    gam: 1.2,
    tae: 0.8,
  },
  jin: {
    son: 1.2,
    geon: 0.8,
  },
  son: {
    gon: 1.2,
    li: 0.8,
  },
  gam: {
    li: 1.2,
    jin: 0.8,
  },
  gan: {
    tae: 1.2,
    gam: 0.8,
  },
  gon: {
    geon: 1.2,
    son: 0.8,
  },
};

export const MAX_TRANSITION_COST_KI = 50;
export const MAX_TRANSITION_COST_STAMINA = 30;
export const MAX_TRANSITION_TIME_MILLISECONDS = 1000;

// Re-export from sub-modules
export * from "./trigram";
export * from "./techniques";
export * from "./player";
export * from "./vital-points";

// Fix: Re-export properly to avoid circular dependencies
export type { TrigramStanceData } from "./trigram";
