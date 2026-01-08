/**
 * Combat Visual Effects Components
 * 
 * Blood effects, hit effects, trauma overlays, consciousness blur, and vital point markers
 * 
 * @module components/screens/combat/components/effects
 * @category Combat Components
 */

export { default as BloodDecals3D } from "./BloodDecals3D";
export type { BloodDecals3DProps, BloodDecal } from "./BloodDecals3D";

export { BloodLossOverlay } from "./BloodLossOverlay";
export type { BloodLossOverlayProps } from "./BloodLossOverlay";

export { default as BloodParticles3D } from "./BloodParticles3D";
export type { BloodParticles3DProps, BloodSplatterEffect } from "./BloodParticles3D";

export { ConsciousnessBlur } from "./ConsciousnessBlur";
export type { ConsciousnessBlurProps } from "./ConsciousnessBlur";

export { default as HitEffects3D } from "./HitEffects3D";
export type { HitEffects3DProps } from "./HitEffects3D";

export { PainVignette } from "./PainVignette";
export type { PainVignetteProps } from "./PainVignette";

export { default as TraumaOverlay3D } from "./TraumaOverlay3D";
export type { TraumaOverlay3DProps, Injury, InjuryType } from "./TraumaOverlay3D";

export { default as VitalPointMarkers3D } from "./VitalPointMarkers3D";
export type { VitalPointMarkers3DProps, BodyRegionFilter } from "./VitalPointMarkers3D";
