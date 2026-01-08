/**
 * @module components/training/components
 * @category Training System
 */

// Three.js training components
export { default as TrainingDummy3D } from "./TrainingDummy3D";
export { default as TrainingArena3D } from "./TrainingArena3D";
export { default as TrainingHitEffects3D } from "./TrainingHitEffects3D";
export { default as TrainingAICharacter3D } from "./TrainingAICharacter3D";
export { default as DamageNumber3D } from "./DamageNumber3D";

// New enhanced 3D components
export { default as VitalPointMarker3D } from "./VitalPointMarker3D";
export { default as AnatomyOverlay3D } from "./AnatomyOverlay3D";
export { default as HitFeedbackEffect3D } from "./HitFeedbackEffect3D";

// HTML training UI components
export { default as TrainingControlsHTML } from "./TrainingControlsHTML";
export { default as TrainingFeedbackHTML } from "./TrainingFeedbackHTML";
export { default as TrainingModeSelectorHTML } from "./TrainingModeSelectorHTML";
export { default as TrainingStatsHTML } from "./TrainingStatsHTML";
export { default as VitalPointTrainingHTML } from "./VitalPointTrainingHTML";
export { default as AnatomyControlsHTML } from "./AnatomyControlsHTML";

// Re-export component prop types for external use
export type { TrainingDummy3DProps, DifficultyMode } from "./TrainingDummy3D";
export type { TrainingAICharacter3DProps } from "./TrainingAICharacter3D";
export type { VitalPointMarker3DProps } from "./VitalPointMarker3D";
export type { AnatomyOverlay3DProps, AnatomyLayer } from "./AnatomyOverlay3D";
export type { HitFeedbackEffect3DProps } from "./HitFeedbackEffect3D";
export type { AnatomyControlsHTMLProps } from "./AnatomyControlsHTML";

