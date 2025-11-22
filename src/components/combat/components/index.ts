/**
 * @module components/combat/components
 * @category Combat System
 */

// Three.js 3D components
export { default as CombatArena3D } from "./CombatArena3D";
export { default as VitalPointMarkers3D } from "./VitalPointMarkers3D";
export { default as HitEffects3D } from "./HitEffects3D";
export { default as Player3DModel } from "./Player3DModel";

// Re-export component prop types
export type { VitalPointMarkers3DProps } from "./VitalPointMarkers3D";
export type { HitEffects3DProps } from "./HitEffects3D";
export type { Player3DModelProps } from "./Player3DModel";
