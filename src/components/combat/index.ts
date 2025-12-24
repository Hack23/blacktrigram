/**
 * Combat Module Index
 *
 * Exports all combat-related components, hooks, and helpers.
 */

// Main combat screen
export { CombatScreen3D } from "./CombatScreen3D";
export type { CombatScreen3DProps } from "./CombatScreen3D";

// Components
export * from "./components";

// Hooks
export { useCombatAudio } from "./hooks/useCombatAudio";
export { usePreloadCombatAudio } from "./hooks/usePreloadCombatAudio";

// Helpers
export { AnimationUpdater } from "./helpers/AnimationUpdater";
