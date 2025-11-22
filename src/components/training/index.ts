/**
 * @module components/training
 * @category Training Components
 */

// Three.js training screen (primary)
export { TrainingScreen3D } from "./TrainingScreen3D";

// Training components (Three.js and HTML)
export * from "./components";

// Re-export component props for external use
export type { TrainingScreen3DProps } from "./TrainingScreen3D";

// Old PixiJS components archived:
// export { default as TrainingControlsPanel } from "./components/TrainingControlsPanel";
// export { default as TrainingDummy } from "./components/TrainingDummy";
// export { default as TrainingFeedback } from "./components/TrainingFeedback";
// export { default as TrainingModeSelector } from "./components/TrainingModeSelector";
// export { default as TrainingStatsPanel } from "./components/TrainingStatsPanel";
// export { default as VitalPointTrainingPanel } from "./components/VitalPointTrainingPanel";
// export { default as TrainingScreen } from "./TrainingScreen";
