/**
 * Training Hooks Index
 *
 * Exports all training-related hooks for cleaner imports.
 *
 * @example
 * ```typescript
 * import { useTrainingState, useTrainingActions } from './hooks';
 * ```
 */

export { useTrainingState } from "./useTrainingState";
export type {
  AnatomyLayer,
  TrainingActions,
  TrainingHitEffect,
  TrainingMode,
  TrainingScreenState,
  TrainingStats,
  UseTrainingStateReturn,
} from "./useTrainingState";

export { useTrainingActions } from "./useTrainingActions";
export type {
  UseTrainingActionsConfig,
  UseTrainingActionsReturn,
} from "./useTrainingActions";
