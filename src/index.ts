/**
 * Main export file for Black Trigram game
 *
 * This file provides public API exports for external consumers.
 * Internal usage should import directly from specific files.
 */

// Main app component
export { App } from "./App";

// Game modes and types
export { GameMode } from "./types";

// Audio system
export { AudioProvider, useAudio } from "./audio/AudioProvider";
export type { AudioProviderProps, AudioContextValue } from "./audio/AudioProvider";

// Screens (lazy loaded)
export { IntroScreenThreeJS } from "./components/intro/IntroScreenThreeJS";
export { CombatScreen3D } from "./components/combat/CombatScreen3D";
export { TrainingScreen3D } from "./components/training/TrainingScreen3D";
