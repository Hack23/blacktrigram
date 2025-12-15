/**
 * useCombatState Hook - Consolidated Combat State Management
 * 
 * Custom hook for managing complex combat state using useReducer.
 * Consolidates multiple useState calls into a single reducer for better
 * performance and maintainability.
 *
 * Performance:
 * - Uses useReducer to batch state updates
 * - Reduces number of re-renders
 * - Provides clear action-based state updates
 *
 * @returns Combat state and dispatch actions
 * 
 * @example
 * ```typescript
 * const { state, actions } = useCombatState();
 * actions.setHitEffects([effect1, effect2]);
 * actions.incrementCombo();
 * ```
 */

import { HitEffect } from "@/systems";
import { useCallback, useReducer } from "react";

/**
 * Combat screen state managed by the reducer
 * Note: Renamed from CombatState to avoid conflict with CombatState enum in types/common.ts
 */
export interface CombatScreenState {
  readonly hitEffects: HitEffect[];
  readonly isExecutingTechnique: boolean;
  readonly combatMessages: string[];
  readonly roundStarted: boolean;
  readonly roundEnded: boolean;
  readonly roundDisplayStatus: "start" | "fight" | "ko" | "end" | null;
  readonly comboCount: number;
  readonly lastHitTime: number;
  readonly screenShake: { x: number; y: number };
}

/**
 * Combat state actions
 */
type CombatAction =
  | { type: "SET_HIT_EFFECTS"; payload: HitEffect[] }
  | { type: "ADD_HIT_EFFECT"; payload: HitEffect }
  | { type: "REMOVE_HIT_EFFECT"; payload: string }
  | { type: "SET_EXECUTING_TECHNIQUE"; payload: boolean }
  | { type: "ADD_COMBAT_MESSAGE"; payload: string }
  | { type: "SET_ROUND_STARTED"; payload: boolean }
  | { type: "SET_ROUND_ENDED"; payload: boolean }
  | { type: "SET_ROUND_DISPLAY_STATUS"; payload: "start" | "fight" | "ko" | "end" | null }
  | { type: "SET_COMBO_COUNT"; payload: number }
  | { type: "INCREMENT_COMBO" }
  | { type: "RESET_COMBO" }
  | { type: "SET_LAST_HIT_TIME"; payload: number }
  | { type: "SET_SCREEN_SHAKE"; payload: { x: number; y: number } }
  | { type: "RESET_SCREEN_SHAKE" }
  | { type: "RESET_ROUND_STATE" };

/**
 * Initial combat state
 */
const initialState: CombatScreenState = {
  hitEffects: [],
  isExecutingTechnique: false,
  combatMessages: [],
  roundStarted: false,
  roundEnded: false,
  roundDisplayStatus: null,
  comboCount: 0,
  lastHitTime: 0,
  screenShake: { x: 0, y: 0 },
};

/**
 * Combat state reducer
 * Handles all combat state updates in a centralized, performant way
 */
function combatReducer(state: CombatScreenState, action: CombatAction): CombatScreenState {
  switch (action.type) {
    case "SET_HIT_EFFECTS":
      return { ...state, hitEffects: action.payload };

    case "ADD_HIT_EFFECT":
      return { ...state, hitEffects: [...state.hitEffects, action.payload] };

    case "REMOVE_HIT_EFFECT":
      return {
        ...state,
        hitEffects: state.hitEffects.filter((effect) => effect.id !== action.payload),
      };

    case "SET_EXECUTING_TECHNIQUE":
      return { ...state, isExecutingTechnique: action.payload };

    case "ADD_COMBAT_MESSAGE":
      return {
        ...state,
        combatMessages: [action.payload, ...state.combatMessages.slice(0, 4)],
      };

    case "SET_ROUND_STARTED":
      return { ...state, roundStarted: action.payload };

    case "SET_ROUND_ENDED":
      return { ...state, roundEnded: action.payload };

    case "SET_ROUND_DISPLAY_STATUS":
      return { ...state, roundDisplayStatus: action.payload };

    case "SET_COMBO_COUNT":
      return { ...state, comboCount: action.payload };

    case "INCREMENT_COMBO":
      return { ...state, comboCount: state.comboCount + 1 };

    case "RESET_COMBO":
      return { ...state, comboCount: 0 };

    case "SET_LAST_HIT_TIME":
      return { ...state, lastHitTime: action.payload };

    case "SET_SCREEN_SHAKE":
      return { ...state, screenShake: action.payload };

    case "RESET_SCREEN_SHAKE":
      return { ...state, screenShake: { x: 0, y: 0 } };

    case "RESET_ROUND_STATE":
      return {
        ...state,
        roundStarted: false,
        roundEnded: false,
        roundDisplayStatus: null,
        comboCount: 0,
        hitEffects: [],
        combatMessages: [],
      };

    default:
      return state;
  }
}

/**
 * Combat state action creators
 */
export interface CombatActions {
  readonly setHitEffects: (effects: HitEffect[]) => void;
  readonly addHitEffect: (effect: HitEffect) => void;
  readonly removeHitEffect: (effectId: string) => void;
  readonly setExecutingTechnique: (executing: boolean) => void;
  readonly addCombatMessage: (message: string) => void;
  readonly setRoundStarted: (started: boolean) => void;
  readonly setRoundEnded: (ended: boolean) => void;
  readonly setRoundDisplayStatus: (status: "start" | "fight" | "ko" | "end" | null) => void;
  readonly setComboCount: (count: number) => void;
  readonly incrementCombo: () => void;
  readonly resetCombo: () => void;
  readonly setLastHitTime: (time: number) => void;
  readonly setScreenShake: (shake: { x: number; y: number }) => void;
  readonly resetScreenShake: () => void;
  readonly resetRoundState: () => void;
}

/**
 * Custom hook for combat state management
 */
export function useCombatState() {
  const [state, dispatch] = useReducer(combatReducer, initialState);

  // Memoized action creators to prevent recreation on every render
  const actions: CombatActions = {
    setHitEffects: useCallback(
      (effects: HitEffect[]) => dispatch({ type: "SET_HIT_EFFECTS", payload: effects }),
      []
    ),
    addHitEffect: useCallback(
      (effect: HitEffect) => dispatch({ type: "ADD_HIT_EFFECT", payload: effect }),
      []
    ),
    removeHitEffect: useCallback(
      (effectId: string) => dispatch({ type: "REMOVE_HIT_EFFECT", payload: effectId }),
      []
    ),
    setExecutingTechnique: useCallback(
      (executing: boolean) =>
        dispatch({ type: "SET_EXECUTING_TECHNIQUE", payload: executing }),
      []
    ),
    addCombatMessage: useCallback(
      (message: string) => dispatch({ type: "ADD_COMBAT_MESSAGE", payload: message }),
      []
    ),
    setRoundStarted: useCallback(
      (started: boolean) => dispatch({ type: "SET_ROUND_STARTED", payload: started }),
      []
    ),
    setRoundEnded: useCallback(
      (ended: boolean) => dispatch({ type: "SET_ROUND_ENDED", payload: ended }),
      []
    ),
    setRoundDisplayStatus: useCallback(
      (status: "start" | "fight" | "ko" | "end" | null) =>
        dispatch({ type: "SET_ROUND_DISPLAY_STATUS", payload: status }),
      []
    ),
    setComboCount: useCallback(
      (count: number) => dispatch({ type: "SET_COMBO_COUNT", payload: count }),
      []
    ),
    incrementCombo: useCallback(() => dispatch({ type: "INCREMENT_COMBO" }), []),
    resetCombo: useCallback(() => dispatch({ type: "RESET_COMBO" }), []),
    setLastHitTime: useCallback(
      (time: number) => dispatch({ type: "SET_LAST_HIT_TIME", payload: time }),
      []
    ),
    setScreenShake: useCallback(
      (shake: { x: number; y: number }) =>
        dispatch({ type: "SET_SCREEN_SHAKE", payload: shake }),
      []
    ),
    resetScreenShake: useCallback(() => dispatch({ type: "RESET_SCREEN_SHAKE" }), []),
    resetRoundState: useCallback(() => dispatch({ type: "RESET_ROUND_STATE" }), []),
  };

  return { state, actions };
}
