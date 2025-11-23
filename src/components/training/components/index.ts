/**
 * @module components/training/components
 * @category Training System
 */

// Three.js training components
export { default as TrainingDummy3D } from "./TrainingDummy3D";
export { default as TrainingArena3D } from "./TrainingArena3D";
export { default as TrainingHitEffects3D } from "./TrainingHitEffects3D";
export { default as TrainingAICharacter3D } from "./TrainingAICharacter3D";

// HTML training UI components
export { default as TrainingControlsHTML } from "./TrainingControlsHTML";
export { default as TrainingFeedbackHTML } from "./TrainingFeedbackHTML";
export { default as TrainingModeSelectorHTML } from "./TrainingModeSelectorHTML";
export { default as TrainingStatsHTML } from "./TrainingStatsHTML";
export { default as VitalPointTrainingHTML } from "./VitalPointTrainingHTML";

// Re-export component prop types for external use
export type { TrainingDummy3DProps } from "./TrainingDummy3D";
export type { TrainingAICharacter3DProps } from "./TrainingAICharacter3D";

// Old PixiJS components archived:
// export * from "./TrainingControlsPanel";
// export * from "./TrainingDummy";
// export * from "./TrainingFeedback";
// export * from "./TrainingModeSelector";
// export * from "./TrainingStatsPanel";
// export * from "./VitalPointTrainingPanel";
