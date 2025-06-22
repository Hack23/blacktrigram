/**
 * UI Components exports for Black Trigram Korean martial arts game
 */

// Base UI components
export * from "./base";

// Game-specific UI components
export { EndScreen } from "./EndScreen";
export { HealthBar } from "./HealthBar";
export { HitEffectsLayer } from "./HitEffectsLayer";
export { KoreanHeader } from "./KoreanHeader";
export { ProgressTracker } from "./ProgressTracker";
export { RoundTimer } from "./RoundTimer";
export { ScoreDisplay } from "./ScoreDisplay";
export { StanceIndicator } from "./StanceIndicator";
export { TrigramWheel } from "./TrigramWheel";

// Player-related UI
export { Player } from "./Player";
export { PlayerVisuals } from "./PlayerVisuals";

// Default exports for convenience
export { default as EndScreenDefault } from "./EndScreen";
export { default as HealthBarDefault } from "./HealthBar";
export { default as RoundTimerDefault } from "./RoundTimer";
export { default as StanceIndicatorDefault } from "./StanceIndicator";
export { default as TrigramWheelDefault } from "./TrigramWheel";

// Re-export types
export type {
  HealthBarProps,
  ProgressTrackerProps,
  RoundTimerProps,
  ScoreDisplayProps,
  StanceIndicatorProps,
  TrigramWheelProps,
  UIComponentProps,
} from "../../types/ui";
