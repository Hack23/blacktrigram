/**
 * @fileoverview Complete Combat System exports for Black Trigram Korean martial arts game
 * @description Provides comprehensive combat functionality including movement system,
 * enhanced input handling, AI opponents, and traditional Korean martial arts mechanics
 */

// Core combat screens and systems

// Combat components
export { CombatArena } from "./CombatArena";
export { CombatControls } from "./CombatControls";
export { CombatHUD } from "./CombatHUD";
export { CombatStats } from "./CombatStats";
export { HitEffectsLayer } from "./HitEffectsLayer";
export { Player } from "./Player";
export { PlayerStatusPanel } from "./PlayerStatusPanel";
export { PlayerVisuals } from "./PlayerVisuals";

// Enhanced game components
// Fix: Import from correct locations
export { GameEngine } from "../engine/GameEngine";
export { default as GameEngineDefault } from "../engine/GameEngine";

export { DojangBackground } from "../backgrounds/DojangBackground";
export { default as DojangBackgroundDefault } from "../backgrounds/DojangBackground";

// Component index export - remove duplicates
export * from "./CombatArena";
export * from "./CombatHUD";
export * from "./CombatControls";
export * from "./CombatStats";
export * from "./PlayerStatusPanel";
export * from "./Player";
export * from "./PlayerVisuals";
export * from "./HitEffectsLayer";

// Re-export types for combat system
export type {
  CombatScreenProps,
  CombatArenaProps,
  CombatHUDProps,
  CombatControlsProps,
  CombatStatsProps,
  PlayerStatusPanelProps,
  GameEngineProps,
  PlayerProps,
  PlayerVisualsProps,
  HitEffectsLayerProps,
} from "../../../types/combat";

export type {
  PlayerState,
  KoreanTechnique,
  CombatResult,
  HitEffect,
  DisplayHitEffect,
} from "../../../types/";
