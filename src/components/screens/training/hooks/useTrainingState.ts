/**
 * useTrainingState Hook - Consolidated Training State Management
 *
 * Custom hook for managing training state using useReducer.
 * Mirrors useCombatState pattern for consistency.
 *
 * @korean 훈련상태관리훅 - useReducer를 사용한 통합 훈련 상태 관리
 */

import { useCallback, useReducer } from "react";
// Re-export types from components for consistency
import type { AnatomyLayer } from "../components/AnatomyOverlay3D";
import type { TrainingMode } from "../components/TrainingModeSelectorHTML";

// Re-export for convenience
export type { AnatomyLayer, TrainingMode };

/**
 * Training statistics
 */
export interface TrainingStats {
  readonly score: number;
  readonly combo: number;
  readonly hits: number;
  readonly misses: number;
  readonly accuracy: number;
  readonly sessionDuration?: number;
  readonly bestCombo?: number;
  readonly perfectStrikes?: number;
}

/**
 * Hit effect for training
 */
export interface TrainingHitEffect {
  readonly id: number;
  readonly position: [number, number, number];
  readonly type: "success" | "perfect" | "miss";
  readonly visible: boolean;
  readonly damage?: number;
}

/**
 * Training screen state managed by the reducer
 */
export interface TrainingScreenState {
  readonly trainingMode: TrainingMode;
  readonly isTraining: boolean;
  readonly selectedVitalPoint: string | null;
  readonly feedback: string;
  readonly showFeedback: boolean;
  readonly hitEffects: TrainingHitEffect[];
  readonly nextEffectId: number;
  readonly dummyHealth: number;
  readonly sessionStartTime: number | null;
  readonly sessionDuration: number;
  readonly perfectStrikes: number;
  readonly bestCombo: number;
  readonly stats: TrainingStats;
  readonly currentStanceIndex: number;
  readonly stanceWheelExpanded: boolean;
  readonly visibleAnatomyLayers: AnatomyLayer[];
}

/**
 * Training state actions
 */
type TrainingAction =
  | { type: "SET_TRAINING_MODE"; payload: TrainingMode }
  | { type: "START_TRAINING" }
  | { type: "STOP_TRAINING" }
  | { type: "SET_SELECTED_VITAL_POINT"; payload: string | null }
  | { type: "SET_FEEDBACK"; payload: { feedback: string; show: boolean } }
  | { type: "HIDE_FEEDBACK" }
  | { type: "ADD_HIT_EFFECT"; payload: Omit<TrainingHitEffect, "id"> }
  | { type: "REMOVE_HIT_EFFECT"; payload: number }
  | { type: "SET_DUMMY_HEALTH"; payload: number }
  | { type: "RESET_DUMMY" }
  | { type: "UPDATE_SESSION_DURATION"; payload: number }
  | { type: "INCREMENT_PERFECT_STRIKES" }
  | { type: "UPDATE_STATS"; payload: Partial<TrainingStats> }
  | {
      type: "REGISTER_HIT";
      payload: { points: number; damage: number; isPerfect: boolean };
    }
  | { type: "REGISTER_MISS" }
  | { type: "SET_STANCE_INDEX"; payload: number }
  | { type: "TOGGLE_STANCE_WHEEL" }
  | { type: "UPDATE_BEST_COMBO"; payload: number }
  | { type: "TOGGLE_ANATOMY_LAYER"; payload: AnatomyLayer }
  | { type: "SET_ANATOMY_LAYERS"; payload: AnatomyLayer[] };

/**
 * Initial training state
 */
const initialState: TrainingScreenState = {
  trainingMode: "basics",
  isTraining: false,
  selectedVitalPoint: null,
  feedback: "",
  showFeedback: false,
  hitEffects: [],
  nextEffectId: 0,
  dummyHealth: 100,
  sessionStartTime: null,
  sessionDuration: 0,
  perfectStrikes: 0,
  bestCombo: 0,
  stats: {
    score: 0,
    combo: 0,
    hits: 0,
    misses: 0,
    accuracy: 0,
  },
  currentStanceIndex: 0,
  stanceWheelExpanded: false,
  visibleAnatomyLayers: [],
};

/**
 * Training state reducer
 */
function trainingReducer(
  state: TrainingScreenState,
  action: TrainingAction
): TrainingScreenState {
  switch (action.type) {
    case "SET_TRAINING_MODE":
      return { ...state, trainingMode: action.payload };

    case "START_TRAINING":
      return {
        ...state,
        isTraining: true,
        sessionStartTime: Date.now(),
        dummyHealth: 100,
        perfectStrikes: 0,
        bestCombo: 0,
        stats: {
          score: 0,
          combo: 0,
          hits: 0,
          misses: 0,
          accuracy: 0,
        },
        feedback: "훈련 시작! | Training Start!",
        showFeedback: true,
      };

    case "STOP_TRAINING":
      return {
        ...state,
        isTraining: false,
        sessionStartTime: null,
        sessionDuration: 0,
        feedback: "훈련 종료 | Training End",
        showFeedback: true,
      };

    case "SET_SELECTED_VITAL_POINT":
      return { ...state, selectedVitalPoint: action.payload };

    case "SET_FEEDBACK":
      return {
        ...state,
        feedback: action.payload.feedback,
        showFeedback: action.payload.show,
      };

    case "HIDE_FEEDBACK":
      return { ...state, showFeedback: false };

    case "ADD_HIT_EFFECT":
      return {
        ...state,
        hitEffects: [
          ...state.hitEffects,
          { ...action.payload, id: state.nextEffectId },
        ],
        nextEffectId: state.nextEffectId + 1,
      };

    case "REMOVE_HIT_EFFECT":
      return {
        ...state,
        hitEffects: state.hitEffects.filter((e) => e.id !== action.payload),
      };

    case "SET_DUMMY_HEALTH":
      return { ...state, dummyHealth: action.payload };

    case "RESET_DUMMY":
      return {
        ...state,
        dummyHealth: 100,
        feedback: "더미 재설정 | Dummy Reset",
        showFeedback: true,
      };

    case "UPDATE_SESSION_DURATION":
      return { ...state, sessionDuration: action.payload };

    case "INCREMENT_PERFECT_STRIKES":
      return { ...state, perfectStrikes: state.perfectStrikes + 1 };

    case "UPDATE_STATS":
      return { ...state, stats: { ...state.stats, ...action.payload } };

    case "REGISTER_HIT": {
      const newHits = state.stats.hits + 1;
      const totalAttempts = newHits + state.stats.misses;
      const newCombo = state.stats.combo + 1;
      const newBestCombo = Math.max(state.bestCombo, newCombo);

      return {
        ...state,
        perfectStrikes: action.payload.isPerfect
          ? state.perfectStrikes + 1
          : state.perfectStrikes,
        bestCombo: newBestCombo,
        dummyHealth: Math.max(0, state.dummyHealth - action.payload.damage),
        stats: {
          ...state.stats,
          score: state.stats.score + action.payload.points,
          combo: newCombo,
          hits: newHits,
          accuracy: totalAttempts > 0 ? (newHits / totalAttempts) * 100 : 0,
        },
      };
    }

    case "REGISTER_MISS": {
      const newMisses = state.stats.misses + 1;
      const totalAttempts = state.stats.hits + newMisses;

      return {
        ...state,
        stats: {
          ...state.stats,
          combo: 0,
          misses: newMisses,
          accuracy:
            totalAttempts > 0 ? (state.stats.hits / totalAttempts) * 100 : 0,
        },
      };
    }

    case "SET_STANCE_INDEX":
      return { ...state, currentStanceIndex: action.payload };

    case "TOGGLE_STANCE_WHEEL":
      return { ...state, stanceWheelExpanded: !state.stanceWheelExpanded };

    case "UPDATE_BEST_COMBO":
      return {
        ...state,
        bestCombo: Math.max(state.bestCombo, action.payload),
      };

    case "TOGGLE_ANATOMY_LAYER": {
      const layer = action.payload;
      const currentLayers = state.visibleAnatomyLayers;
      const newLayers = currentLayers.includes(layer)
        ? currentLayers.filter((l) => l !== layer)
        : [...currentLayers, layer];
      return { ...state, visibleAnatomyLayers: newLayers };
    }

    case "SET_ANATOMY_LAYERS":
      return { ...state, visibleAnatomyLayers: action.payload };

    default:
      return state;
  }
}

/**
 * Training state actions interface
 */
export interface TrainingActions {
  readonly setTrainingMode: (mode: TrainingMode) => void;
  readonly startTraining: () => void;
  readonly stopTraining: () => void;
  readonly setSelectedVitalPoint: (point: string | null) => void;
  readonly setFeedback: (feedback: string, show?: boolean) => void;
  readonly hideFeedback: () => void;
  readonly addHitEffect: (effect: Omit<TrainingHitEffect, "id">) => void;
  readonly removeHitEffect: (id: number) => void;
  readonly setDummyHealth: (health: number) => void;
  readonly resetDummy: () => void;
  readonly updateSessionDuration: (duration: number) => void;
  readonly registerHit: (
    points: number,
    damage: number,
    isPerfect: boolean
  ) => void;
  readonly registerMiss: () => void;
  readonly setStanceIndex: (index: number) => void;
  readonly toggleStanceWheel: () => void;
  readonly toggleAnatomyLayer: (layer: AnatomyLayer) => void;
  readonly setAnatomyLayers: (layers: AnatomyLayer[]) => void;
}

/**
 * Hook return type
 */
export interface UseTrainingStateReturn {
  readonly state: TrainingScreenState;
  readonly actions: TrainingActions;
}

/**
 * useTrainingState hook
 * Provides consolidated training state management using useReducer
 */
export function useTrainingState(): UseTrainingStateReturn {
  const [state, dispatch] = useReducer(trainingReducer, initialState);

  const actions: TrainingActions = {
    setTrainingMode: useCallback(
      (mode: TrainingMode) =>
        dispatch({ type: "SET_TRAINING_MODE", payload: mode }),
      []
    ),
    startTraining: useCallback(() => dispatch({ type: "START_TRAINING" }), []),
    stopTraining: useCallback(() => dispatch({ type: "STOP_TRAINING" }), []),
    setSelectedVitalPoint: useCallback(
      (point: string | null) =>
        dispatch({ type: "SET_SELECTED_VITAL_POINT", payload: point }),
      []
    ),
    setFeedback: useCallback(
      (feedback: string, show = true) =>
        dispatch({ type: "SET_FEEDBACK", payload: { feedback, show } }),
      []
    ),
    hideFeedback: useCallback(() => dispatch({ type: "HIDE_FEEDBACK" }), []),
    addHitEffect: useCallback(
      (effect: Omit<TrainingHitEffect, "id">) =>
        dispatch({ type: "ADD_HIT_EFFECT", payload: effect }),
      []
    ),
    removeHitEffect: useCallback(
      (id: number) => dispatch({ type: "REMOVE_HIT_EFFECT", payload: id }),
      []
    ),
    setDummyHealth: useCallback(
      (health: number) =>
        dispatch({ type: "SET_DUMMY_HEALTH", payload: health }),
      []
    ),
    resetDummy: useCallback(() => dispatch({ type: "RESET_DUMMY" }), []),
    updateSessionDuration: useCallback(
      (duration: number) =>
        dispatch({ type: "UPDATE_SESSION_DURATION", payload: duration }),
      []
    ),
    registerHit: useCallback(
      (points: number, damage: number, isPerfect: boolean) =>
        dispatch({
          type: "REGISTER_HIT",
          payload: { points, damage, isPerfect },
        }),
      []
    ),
    registerMiss: useCallback(() => dispatch({ type: "REGISTER_MISS" }), []),
    setStanceIndex: useCallback(
      (index: number) => dispatch({ type: "SET_STANCE_INDEX", payload: index }),
      []
    ),
    toggleStanceWheel: useCallback(
      () => dispatch({ type: "TOGGLE_STANCE_WHEEL" }),
      []
    ),
    toggleAnatomyLayer: useCallback(
      (layer: AnatomyLayer) =>
        dispatch({ type: "TOGGLE_ANATOMY_LAYER", payload: layer }),
      []
    ),
    setAnatomyLayers: useCallback(
      (layers: AnatomyLayer[]) =>
        dispatch({ type: "SET_ANATOMY_LAYERS", payload: layers }),
      []
    ),
  };

  return { state, actions };
}

export default useTrainingState;
