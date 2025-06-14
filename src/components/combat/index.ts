/**
 * Combat system components for Korean martial arts
 */

// Main combat screen
export { CombatScreen } from "./CombatScreen";
export { default as CombatScreenDefault } from "./CombatScreen";

// Combat sub-components
export * from "./components";

// Individual component exports
export { CombatArena } from "./components/CombatArena";
export { CombatHUD } from "./components/CombatHUD";
export { CombatControls } from "./components/CombatControls";

// Default exports for convenience
export { default as CombatArenaDefault } from "./components/CombatArena";
export { default as CombatHUDDefault } from "./components/CombatHUD";
export { default as CombatControlsDefault } from "./components/CombatControls";
