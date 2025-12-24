/**
 * @module components/training/components
 * @category Training System
 */

// Three.js training components
export { TrainingDummy3D } from "./TrainingDummy3D";
export { TrainingArena3D } from "./TrainingArena3D";
export { TrainingHitEffects3D } from "./TrainingHitEffects3D";
export { TrainingAICharacter3D } from "./TrainingAICharacter3D";
export { DamageNumber3D } from "./DamageNumber3D";

// New enhanced 3D components
export { VitalPointMarker3D } from "./VitalPointMarker3D";
export { AnatomyOverlay3D } from "./AnatomyOverlay3D";
export { HitFeedbackEffect3D } from "./HitFeedbackEffect3D";

// HTML training UI components
export { TrainingControlsHTML } from "./TrainingControlsHTML";
export { TrainingFeedbackHTML } from "./TrainingFeedbackHTML";
export { TrainingModeSelectorHTML } from "./TrainingModeSelectorHTML";
export { TrainingStatsHTML } from "./TrainingStatsHTML";
export { VitalPointTrainingHTML } from "./VitalPointTrainingHTML";
export { AnatomyControlsHTML } from "./AnatomyControlsHTML";

// Re-export component prop types for external use
export type { TrainingDummy3DProps, DifficultyMode } from "./TrainingDummy3D";
export type { TrainingAICharacter3DProps } from "./TrainingAICharacter3D";
export type { VitalPointMarker3DProps } from "./VitalPointMarker3D";
export type { AnatomyOverlay3DProps, AnatomyLayer } from "./AnatomyOverlay3D";
export type { HitFeedbackEffect3DProps } from "./HitFeedbackEffect3D";
export type { AnatomyControlsHTMLProps } from "./AnatomyControlsHTML";
