/**
 * Main type export for Black Trigram (흑괘)
 * Korean Martial Arts Combat Simulator
 */

// Core type system for Black Trigram Korean martial arts game

// Export all enums first
export * from "./enums";

// Export core types (avoid duplicates by being specific)
export type { Position, CombatCondition } from "./common";
export type { PlayerState, PlayerArchetypeData } from "./player";
export type {
  VitalPoint,
  VitalPointEffect,
  VitalPointHitResult,
  AnatomicalLocation,
  RegionData,
} from "./anatomy";
export type { KoreanTechnique, CombatResult, AttackInput } from "./combat";
export type { HitEffect, StatusEffect } from "./effects";
export type {
  KoreanText,
  KoreanTextProps,
  KoreanTextHeaderProps,
  KoreanTitleProps,
  KoreanTechniqueTextProps,
  KoreanStatusTextProps,
  KoreanMartialTextProps,
  KoreanTextSize,
  KoreanFontWeight,
  KoreanTextVariant,
  KoreanTextEmphasis,
  MartialVariant,
  HonorLevel,
  FontWeight,
  StatusKey,
  ColorValue,
  PixiTextStyleConfig,
  KoreanPixiTextConfig,
} from "./korean-text";
export type {
  TrigramStance,
  TrigramData,
  TrigramEffectivenessMatrix,
  TrigramSystemInterface,
  TrigramTransitionCost,
  TransitionMetrics,
  TransitionPath,
  TrigramTransitionRule,
  StanceTransition,
} from "./trigram";

// Export control types
export type { CombatControlsConfig, StanceControlDetail } from "./controls";

// Export game types
export type {
  AppState,
  GameState,
  GameSettings,
  GameScreen,
  SessionData,
  TrainingStats,
  CombatStats,
} from "./game";

// Export component types
export type {
  GameUIProps,
  GameEngineProps,
  IntroScreenProps,
  TrainingScreenProps,
  CombatScreenProps,
  CombatHUDProps,
  CombatArenaProps,
  CombatControlsProps,
  ProgressTrackerProps,
  TrigramWheelProps,
  BaseComponentProps,
  MenuSectionProps,
  PhilosophySectionProps,
  EndScreenProps,
  KoreanHeaderProps,
  PlayerProps,
} from "./components";

// Export UI types
export type { UITheme, ColorScheme } from "./ui";

// Export system interfaces
export type {
  VitalPointSystemInterface,
  VitalPointSystemConfig,
} from "./systems";

// Export audio types
export type {
  AudioContextState,
  SoundEffect,
  AudioManagerInterface,
} from "./audio";

// Export constants (value exports)
export {
  KOREAN_COLORS,
  TRIGRAM_DATA,
  STANCE_EFFECTIVENESS_MATRIX,
  TRIGRAM_STANCES_ORDER,
  VITAL_POINTS_DATA,
  KOREAN_FONT_FAMILY_PRIMARY,
  KOREAN_FONT_FAMILY_SECONDARY,
  KOREAN_FONT_FAMILY,
  GAME_CONFIG,
  COMBAT_CONTROLS, // Ensure COMBAT_CONTROLS is exported here
} from "./constants";

// Export utility functions
export { createPlayerState } from "../utils/playerUtils";
export type { DamageRange } from "./common";
export type { BodyRegion } from "./enums";
