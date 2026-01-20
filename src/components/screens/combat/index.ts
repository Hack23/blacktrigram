/**
 * Combat system components for Korean martial arts
 */

/**
 * @module components/combat
 * @category Combat System
 */

// Main combat screens (Three.js)
export { CombatScreen3D, default as CombatScreen3DDefault } from "./CombatScreen3D";

// Combat sub-components (combat-specific only, no re-exports)
export * from "./components";

// Re-export component prop types
export type { CombatScreen3DProps } from "./CombatScreen3D";
