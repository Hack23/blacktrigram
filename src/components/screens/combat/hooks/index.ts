/**
 * Combat Hooks
 * 
 * Custom React hooks for combat system state management,
 * audio integration, and layout calculations
 * 
 * @module components/screens/combat/hooks
 * @category Combat System
 */

export { useCombatActions } from "./useCombatActions";
export type { UseCombatActionsConfig, UseCombatActionsReturn } from "./useCombatActions";

export { useCombatAudio } from "./useCombatAudio";
export type { AttackIntensity } from "./useCombatAudio";

export { useCombatLayout } from "./useCombatLayout";
export type { LayoutConstants, ArenaBounds, CombatLayout } from "./useCombatLayout";

export { usePreloadCombatAudio } from "./usePreloadCombatAudio";
