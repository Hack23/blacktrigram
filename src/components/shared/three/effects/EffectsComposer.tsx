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
 */
export interface EffectsComposerProps {
  /** Enable bloom effect (default: true) */
  readonly enableBloom?: boolean;
  /** Bloom intensity (default: 1.5) */
  readonly bloomIntensity?: number;
  /** Luminance threshold for bloom (default: 0.9) */
  readonly luminanceThreshold?: number;
  /** Smoothing for bloom (default: 0.9) */
  readonly luminanceSmoothing?: number;
  /** Bloom kernel size (default: KernelSize.MEDIUM) */
  readonly kernelSize?: KernelSize;
  /** Children to render */
  readonly children?: React.ReactNode;
}

/**
 * EffectsComposer Component
 *
 * Wraps the 3D scene with post-processing effects for enhanced visuals.
 * Primarily used for HDR bloom on emissive materials.
 *
 * Performance notes:
 * - Uses medium kernel size for balance between quality and performance
 * - Configured for 60fps target
 * - Bloom only affects emissive materials (toneMapped: false)
 *
 * @example
 * ```tsx
 * <Canvas>
 *   <Scene />
 *   <EffectsComposer
 *     enableBloom={true}
 *     bloomIntensity={1.5}
 *     luminanceThreshold={0.9}
 *   />
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
  children,
}) => {
  if (!enableBloom) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={bloomIntensity}
          luminanceThreshold={luminanceThreshold}
          luminanceSmoothing={luminanceSmoothing}
          kernelSize={kernelSize}
          blendFunction={BlendFunction.ADD}
        />
      </EffectComposer>
    </>
  );
};

export default EffectsComposer;
