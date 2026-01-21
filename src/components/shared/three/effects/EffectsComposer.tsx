/**
 * Effects Composer - HDR bloom and post-processing for visual effects
 *
 * Adds HDR bloom to emissive materials for Korean cyberpunk aesthetic.
 * Optimized for 60fps performance with quality bloom effects.
 *
 * Features:
 * - HDR bloom for glowing trigram particles
 * - Emissive material support
 * - Korean-themed color bloom
 * - Performance-optimized settings
 *
 * @module components/shared/three/effects/EffectsComposer
 * @category Shared Effects
 * @korean 효과작곡가
 */

import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import React from "react";

/**
 * Props for EffectsComposer component
 * 
 * Note: EffectComposer automatically processes all scene content.
 * Render this component as a sibling to your scene content, not as a wrapper.
 */
export interface EffectsComposerProps {
  /** Enable/disable bloom effect */
  readonly enableBloom?: boolean;
  /** Bloom intensity (default: 1.5) */
  readonly bloomIntensity?: number;
  /** Luminance threshold for bloom (default: 0.9) */
  readonly luminanceThreshold?: number;
  /** Smoothing for bloom (default: 0.9) */
  readonly luminanceSmoothing?: number;
  /** Bloom kernel size (default: KernelSize.MEDIUM) */
  readonly kernelSize?: KernelSize;
}

/**
 * EffectsComposer Component
 *
 * Adds post-processing effects to the 3D scene for enhanced visuals.
 * Primarily used for HDR bloom on emissive materials.
 *
 * Performance notes:
 * - Uses medium kernel size for balance between quality and performance
 * - Configured for 60fps target
 * - Bloom only affects emissive materials (toneMapped: false)
 *
 * Note: Render this as a sibling to your scene, not as a wrapper.
 * EffectComposer automatically processes the entire scene.
 *
 * @example
 * ```tsx
 * <Canvas>
 *   <Scene />
 *   <EffectsComposer enableBloom bloomIntensity={1.5} />
 * </Canvas>
 * ```
 *
 * @example Using with emissive materials
 * ```tsx
 * <mesh>
 *   <sphereGeometry />
 *   <meshBasicMaterial
 *     color={KOREAN_COLORS.PRIMARY_CYAN}
 *     toneMapped={false}  // Required for bloom
 *   />
 * </mesh>
 * ```
 */
export const EffectsComposer: React.FC<EffectsComposerProps> = ({
  enableBloom = true,
  bloomIntensity = 1.5,
  luminanceThreshold = 0.9,
  luminanceSmoothing = 0.9,
  kernelSize = KernelSize.MEDIUM,
}) => {
  if (!enableBloom) {
    return null;
  }

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={luminanceThreshold}
        luminanceSmoothing={luminanceSmoothing}
        kernelSize={kernelSize}
        blendFunction={BlendFunction.ADD}
      />
    </EffectComposer>
  );
};

export default EffectsComposer;
