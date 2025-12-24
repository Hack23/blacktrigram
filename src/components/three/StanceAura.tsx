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
 * Renders an animated 3D aura effect that pulses and glows based on
 * the player's stance and Ki energy level.
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

    // Inner aura: fast pulse
    if (innerAuraRef.current) {
      const innerPulse = Math.sin(time * 3) * 0.1 + 1;
      innerAuraRef.current.scale.setScalar(innerPulse * intensity);
      innerAuraRef.current.rotation.y = time * 0.5;
    }

    // Outer aura: slow pulse
    if (outerAuraRef.current) {
      const outerPulse = Math.sin(time * 1.5) * 0.15 + 1;
      outerAuraRef.current.scale.setScalar(outerPulse * intensity * 1.3);
      outerAuraRef.current.rotation.y = -time * 0.3;
    }
  });

  // Only render if intensity is above threshold
  if (intensity < 0.1) return null;

  return (
    <group>
      {/* Inner aura - solid sphere */}
      <mesh ref={innerAuraRef} position={[0, 1, 0]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial
          color={stanceColor}
          transparent
          opacity={0.2 * intensity}
          wireframe={false}
        />
      </mesh>

      {/* Outer aura - wireframe sphere */}
      <mesh ref={outerAuraRef} position={[0, 1, 0]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial
          color={stanceColor}
          transparent
          opacity={0.15 * intensity}
          wireframe
        />
      </mesh>

      {/* Stance ring on ground */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.45, 0.5, 32]} />
        <meshBasicMaterial
          color={stanceColor}
          transparent
          opacity={0.7 * intensity}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

