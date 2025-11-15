/**
 * Combat hooks for extracting complex logic from CombatScreen
 * @module combat/hooks
 */

export { useCombatLayout } from "./useCombatLayout";
export type { CombatLayoutConstants, ArenaBounds } from "./useCombatLayout";

export { useAICombat } from "./useAICombat";
export type { AIState, AICombatCallbacks } from "./useAICombat";
