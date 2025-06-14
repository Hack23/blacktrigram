/**
 * UI Components exports for Black Trigram Korean martial arts game
 */

// Base UI components
export * from "./base";

// Game-specific UI components
export { HealthBar } from "./HealthBar";
export { RoundTimer } from "./RoundTimer";
export { StanceIndicator } from "./StanceIndicator";
export { TrigramWheel } from "./TrigramWheel";
export { ProgressTracker } from "./ProgressTracker";
export { ScoreDisplay } from "./ScoreDisplay";
export { HitEffectsLayer } from "./HitEffectsLayer";
export { EndScreen } from "./EndScreen";
export { ArchetypeDisplay } from "./ArchetypeDisplay";
export { KoreanHeader } from "./KoreanHeader";

// Player-related UI
export { Player } from "./Player";
export { PlayerVisuals } from "./PlayerVisuals";

// Default exports for convenience
export { default as HealthBarDefault } from "./HealthBar";
export { default as RoundTimerDefault } from "./RoundTimer";
export { default as StanceIndicatorDefault } from "./StanceIndicator";
export { default as TrigramWheelDefault } from "./TrigramWheel";
export { default as EndScreenDefault } from "./EndScreen";

// Re-export types
export type {
  UIComponentProps,
  HealthBarProps,
  StanceIndicatorProps,
  TrigramWheelProps,
  ProgressTrackerProps,
  RoundTimerProps,
  ScoreDisplayProps,
} from "../../types/ui";
