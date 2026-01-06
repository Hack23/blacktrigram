/**
 * StanceAura - 3D visual effect for trigram stance
 * 
 * Renders a pulsing, color-coded aura around the player based on their
 * current trigram stance and Ki energy level.
 * 
 * @module components/three/StanceAura
 * @category 3D Components
 * @korean 자세오라
 */

import { useFrame } from "@react-three/fiber";
import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { TrigramStance } from "../../types/common";
import { KOREAN_COLORS } from "../../types/constants";
import type { StanceAuraProps } from "../../types/player-visual";

/**
 * Get color for each trigram stance
 * Maps 8 trigrams to Korean cyberpunk color palette
 * 
 * @param stance - Current trigram stance
 * @returns Hex color number
 * @korean 자세색상가져오기
 */
const getStanceColor = (stance: TrigramStance): number => {
  const stanceColors = {
    [TrigramStance.GEON]: KOREAN_COLORS.TRIGRAM_GEON_PRIMARY,
    [TrigramStance.TAE]: KOREAN_COLORS.TRIGRAM_TAE_PRIMARY,
    [TrigramStance.LI]: KOREAN_COLORS.TRIGRAM_LI_PRIMARY,
    [TrigramStance.JIN]: KOREAN_COLORS.TRIGRAM_JIN_PRIMARY,
    [TrigramStance.SON]: KOREAN_COLORS.TRIGRAM_SON_PRIMARY,
    [TrigramStance.GAM]: KOREAN_COLORS.TRIGRAM_GAM_PRIMARY,
    [TrigramStance.GAN]: KOREAN_COLORS.TRIGRAM_GAN_PRIMARY,
    [TrigramStance.GON]: KOREAN_COLORS.TRIGRAM_GON_PRIMARY,
  };
  return stanceColors[stance] ?? KOREAN_COLORS.PRIMARY_CYAN;
};

/**
 * StanceAura Component
 * 
 * Renders a SUBTLE animated 3D aura effect that pulses and glows based on
 * the player's stance and Ki energy level.
 * 
 * **UPDATED**: Reduced visibility to prevent "radiant circle" effect.
 * Only visible at high Ki levels (>0.7), creating realistic energy visualization.
 * 
 * @example
 * ```tsx
 * <StanceAura 
 *   stance={TrigramStance.GEON} 
 *   intensity={0.8} 
 *   animated={true}
 * />
 * ```
 * 
 * @korean 자세오라컴포넌트
 */
export const StanceAura: React.FC<StanceAuraProps> = ({
  stance,
  intensity,
  animated = true,
}) => {
  const innerAuraRef = useRef<THREE.Mesh>(null);
  const outerAuraRef = useRef<THREE.Mesh>(null);

  // Get stance-specific color
  const stanceColor = useMemo(() => getStanceColor(stance), [stance]);

  // Animation loop for pulsing effect
  useFrame((state) => {
    if (!animated) return;

    const time = state.clock.elapsedTime;

    // Inner aura: fast pulse - REDUCED scale
    if (innerAuraRef.current) {
      const innerPulse = Math.sin(time * 3) * 0.05 + 1; // Reduced from 0.1
      innerAuraRef.current.scale.setScalar(innerPulse * intensity * 0.7); // Reduced overall scale
      innerAuraRef.current.rotation.y = time * 0.5;
    }

    // Outer aura: slow pulse - REDUCED scale
    if (outerAuraRef.current) {
      const outerPulse = Math.sin(time * 1.5) * 0.08 + 1; // Reduced from 0.15
      outerAuraRef.current.scale.setScalar(outerPulse * intensity * 0.9); // Reduced overall scale
      outerAuraRef.current.rotation.y = -time * 0.3;
    }
  });

  // INCREASED threshold - only render if intensity is HIGH (Ki > 0.7)
  // This prevents constant "radiant circle" and makes aura meaningful
  if (intensity < 0.7) return null;

  return (
    <group>
      {/* Inner aura - VERY subtle solid sphere - REDUCED opacity */}
      <mesh ref={innerAuraRef} position={[0, 1, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} /> {/* Reduced from 0.6 */}
        <meshBasicMaterial
          color={stanceColor}
          transparent
          opacity={0.08 * intensity} // Reduced from 0.2 - VERY subtle
          wireframe={false}
        />
      </mesh>

      {/* Outer aura - VERY subtle wireframe sphere */}
      <mesh ref={outerAuraRef} position={[0, 1, 0]}>
        <sphereGeometry args={[0.7, 16, 16]} /> {/* Reduced from 0.8 */}
        <meshBasicMaterial
          color={stanceColor}
          transparent
          opacity={0.06 * intensity} // Reduced from 0.15 - VERY subtle
          wireframe
        />
      </mesh>

      {/* Stance ring on ground - MORE visible (primary stance indicator) */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 0.45, 32]} /> {/* Thinner ring */}
        <meshBasicMaterial
          color={stanceColor}
          transparent
          opacity={0.5 * intensity} // Reduced from 0.7 - subtle ground indicator
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

export default StanceAura;
