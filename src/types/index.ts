/**
 * Central type exports for Black Trigram Korean martial arts game
 */

// Export all enums
export {
  GameMode,
  GamePhase,
  PlayerArchetype,
  TrigramStance,
  VitalPointCategory,
  VitalPointSeverity,
  VitalPointEffectType,
  EffectIntensity,
  DamageType,
  CombatAttackType,
  KoreanTextSize,
  KoreanTextWeight,
} from "./enums";

// Export core types
export type { KoreanText } from "./korean-text";
export type { Position, DamageRange } from "./common";
export type { StatusEffect, HitEffect } from "./effects"; // Fix: Export HitEffect
export type {
  TrigramData,
  TrigramTransitionCost,
  TrigramTransitionRule,
  TransitionPath,
} from "./trigram";
export type {
  PlayerArchetypeData,
  VitalPoint,
  VitalPointEffect,
  VitalPointHitResult,
  VitalPointSystemConfig,
  DamageResult,
  AnatomicalRegion,
  BodyRegion,
} from "./anatomy";

// Export PlayerState from player.ts
export type { PlayerState, PlayerMatchStats } from "./player";

// Export combat types
export type {
  KoreanTechnique,
  CombatResult,
  TrainingCombatResult, // Fix: Add missing export
  CombatEventData,
  CombatStats,
} from "./combat";

// Export game types
export type { GameState, MatchStatistics } from "./game";

// Export component types
export type {
  GameUIProps,
  GameEngineProps,
  TrainingScreenProps,
  CombatScreenProps,
  CombatHUDProps,
  CombatControlsProps,
  CombatArenaProps,
  IntroScreenProps,
  EndScreenProps,
} from "./components";

// Export UI types
export type {
  UIComponentProps,
  StanceIndicatorProps,
  HealthBarProps,
} from "./ui";

// Export system types
export type {
  CombatSystem,
  VitalPointSystem,
  TrigramSystem,
  CombatSystemInterface,
  VitalPointSystemInterface,
  TrigramSystemInterface,
  SystemEvent,
  SystemPerformance,
} from "./systems";
