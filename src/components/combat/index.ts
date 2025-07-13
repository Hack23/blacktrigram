/**
 * Combat system components for Korean martial arts
 */

/**
 * @module components/combat
 * @category Combat System
 */

// Main combat screen
export { CombatScreen, default as CombatScreenDefault } from "./CombatScreen";

// Combat sub-components
export * from "./components";

// Individual component exports
export { CombatControls } from "./components/CombatControls";
export { CombatHUD } from "./components/CombatHUD";

// Default exports for convenience
export { default as CombatControlsDefault } from "./components/CombatControls";
export { default as CombatHUDDefault } from "./components/CombatHUD";

// Re-export component prop types
export type { CombatScreenProps } from "./CombatScreen";
