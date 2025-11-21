/**
 * Combat system components for Korean martial arts
 */

/**
 * @module components/combat
 * @category Combat System
 */

// Main combat screens
export { CombatScreen, default as CombatScreenDefault } from "./CombatScreen";
export { CombatScreen3D, default as CombatScreen3DDefault } from "./CombatScreen3D";

// Combat sub-components
export * from "./components";

// Individual component exports
export { CombatControls } from "./components/CombatControls";
export { CombatHUD } from "./components/CombatHUD";

// Three.js 3D components
export { Player3DModel } from "./components/Player3DModel";
export { HitEffects3D } from "./components/HitEffects3D";
export { CombatArena3D } from "./components/CombatArena3D";

// Default exports for convenience
export { default as CombatControlsDefault } from "./components/CombatControls";
export { default as CombatHUDDefault } from "./components/CombatHUD";
export { default as Player3DModelDefault } from "./components/Player3DModel";
export { default as HitEffects3DDefault } from "./components/HitEffects3D";
export { default as CombatArena3DDefault } from "./components/CombatArena3D";

// Re-export component prop types
export type { CombatScreenProps } from "./CombatScreen";
export type { CombatScreen3DProps } from "./CombatScreen3D";
export type { Player3DModelProps } from "./components/Player3DModel";
export type { HitEffects3DProps } from "./components/HitEffects3D";
export type { CombatArena3DProps } from "./components/CombatArena3D";
