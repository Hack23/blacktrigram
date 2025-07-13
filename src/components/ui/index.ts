// filepath: /workspaces/blacktrigram/src/components/ui/index.ts
/**
 * @module components/ui
 * @category UI Components
 */

export * from "./base";
export * from "./EndScreen";
export * from "./HealthBar";
export * from "./HitEffectsLayer";
export * from "./KoreanHeader";
export * from "./Player";
export * from "./PlayerVisuals";
export * from "./RoundTimer";
export * from "./StanceIndicator";
export * from "./TrigramWheel";
export * from "./types";

// Re-export component prop types
export type { EndScreenProps } from "./EndScreen";
export type { HealthBarProps } from "./HealthBar";
export type { KoreanHeaderProps } from "./KoreanHeader";
export type { PlayerProps } from "./Player";
export type { PlayerVisualsProps } from "./PlayerVisuals";
export type { StanceIndicatorProps } from "./StanceIndicator";
export type { TrigramWheelProps } from "./TrigramWheel";

/**
 * Barrel exports for ui types
 */

export type {
  BaseComponentProps,
  BaseUIProps,
  ComponentState,
  ErrorState,
  InteractionEvent,
  LoadingState,
  MenuItem,
  Notification,
  ScreenNavigation,
  UIComponentProps,
  UITheme,
} from "./types";
