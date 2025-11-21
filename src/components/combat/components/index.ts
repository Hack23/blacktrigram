/**
 * @module components/combat/components
 * @category Combat System
 */

export * from "./CombatControls";
export * from "./CombatHUD";
export * from "./CombatStatsPanel";
export * from "./PlayerStatusPanel";

// Three.js 3D components
export { default as VitalPointMarkers3D } from "./VitalPointMarkers3D";
export type { VitalPointMarkers3DProps } from "./VitalPointMarkers3D";

// Re-export component prop types
export type { CombatHUDProps } from "./CombatHUD";
