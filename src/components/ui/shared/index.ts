/**
 * Shared 3D HUD Components
 * 
 * Exports all shared HUD components for use in CombatScreen3D and TrainingScreen3D.
 * These components use Html overlays from @react-three/drei for integration with
 * Three.js 3D scenes while maintaining consistent Korean cyberpunk theming.
 * 
 * @module components/ui/shared
 * @category Combat UI
 * @korean 공유 HUD 컴포넌트
 */

export { HealthBar3D } from "./HealthBar3D";
export type { HealthBar3DProps } from "./HealthBar3D";

export { StaminaBar3D } from "./StaminaBar3D";
export type { StaminaBar3DProps } from "./StaminaBar3D";

export { StatusIndicator3D } from "./StatusIndicator3D";
export type { StatusIndicator3DProps, StatusType } from "./StatusIndicator3D";

// Re-export theme utilities for convenience
export {
  type HUDVariant,
  getVariantColors,
  getHealthGradient,
  getResponsiveValue,
} from "../../../theme/korean-cyberpunk";
