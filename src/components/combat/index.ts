/**
 * Combat system components for Korean martial arts
 */

/**
 * @module components/combat
 * @category Combat System
 */

// Main combat screens (Three.js)
export { CombatScreen3D, default as CombatScreen3DDefault } from "./CombatScreen3D";

// Combat sub-components
export * from "./components";

// Three.js 3D components (re-exports from components)
export { default as HitEffects3D } from "./components/HitEffects3D";
export { default as CombatArena3D } from "./components/CombatArena3D";

// Re-export component prop types
export type { CombatScreen3DProps } from "./CombatScreen3D";
export type { HitEffects3DProps } from "./components/HitEffects3D";
export type { CombatArena3DProps } from "./components/CombatArena3D";
