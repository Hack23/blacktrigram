/**
 * Main components export for Black Trigram
 */

// Combat components
export * from "./combat";

// Game components
export { GameEngine } from "./game/GameEngine";
export { DojangBackground } from "./game/DojangBackground";
export { Player } from "./game/Player";
export { PlayerVisuals } from "./game/PlayerVisuals";

// Create a simple GameUI component export
export const GameUI: React.FC<any> = () => null; // Placeholder - implement as needed

// UI components
export { BaseButton } from "./ui/base/BaseButton";
export { KoreanHeader } from "./ui/base/KoreanHeader";
export { HealthBar } from "./ui/HealthBar";
export { StanceIndicator } from "./ui/StanceIndicator";
export { TrigramWheel } from "./ui/TrigramWheel";
export { EndScreen } from "./ui/EndScreen";

// Screen components
export { IntroScreen } from "./intro/IntroScreen";
export { CombatScreen } from "./combat/CombatScreen";
export { TrainingScreen } from "./training";

// Combat components
export { CombatArena } from "./combat/components/CombatArena";
export { CombatHUD } from "./combat/components/CombatHUD";
export { CombatControls } from "./combat/components/CombatControls";

import React from "react";
