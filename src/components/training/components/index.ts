/**
 * Training components and utilities for Black Trigram Korean martial arts game
 */

// Core training components
export { TrainingModeSelector } from "./TrainingModeSelector";
export { TrainingDummy } from "./TrainingDummy";
export { TrainingStatisticsPanel } from "./TrainingStatisticsPanel";
export { TrainingControls } from "./TrainingControls";
export { TrainingFeedbackSystem } from "./TrainingFeedbackSystem";

// Training hooks
export { useTrainingFeedback } from "./hooks/useTrainingFeedback";
export { useTrainingSession } from "./hooks/useTrainingSession";
export { useTrainingStatistics } from "./hooks/useTrainingStatistics";

// Training constants and utilities
export { TRAINING_MODES } from "./constants/trainingModes";

// Training types
export type {
  TrainingMode,
  TrainingStatistics,
  TrainingDummyState,
  TrainingTechniqueResult,
  TrainingModeConfig,
  TrainingFeedbackMessage,
  TrainingSessionConfig,
  TrainingProgress,
} from "./types/training";

// Utility functions
export {
  calculateTrainingDamage,
  getStanceBaseDamage,
  isPerfectExecution,
  getStancePerfectThreshold,
  calculateTrainingExperience,
  getTrainingModeExperienceMultiplier,
  getStanceDescription,
  executeTrainingTechnique,
  getTrainingFeedback,
  validateTrainingSession,
  generateRandomAccuracy,
} from "./utils/trainingUtils";

// Default exports for convenience
export { default as TrainingModeSelectorDefault } from "./TrainingModeSelector";
export { default as TrainingDummyDefault } from "./TrainingDummy";
export { default as TrainingStatisticsPanelDefault } from "./TrainingStatisticsPanel";
export { default as TrainingControlsDefault } from "./TrainingControls";
export { default as TrainingFeedbackSystemDefault } from "./TrainingFeedbackSystem";
