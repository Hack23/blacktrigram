/**
 * StanceTransitionEffect - Smooth visual transition between trigram stances
 * 
 * Manages the visual transition when a player changes stance, providing:
 * - 0.5s smooth color fade between old and new stance colors
 * - Expanding energy ring effect
 * - Bilingual stance name display (Korean + English) for 1s
 * - Audio synchronization for stance change SFX
 * 
 * @module components/three/StanceTransitionEffect
 * @category 3D Components
 * @korean 자세전환효과
 */

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { TrigramStance } from "../../types/common";
import { FONT_FAMILY, KOREAN_COLORS } from "../../types/constants";
import { colorUtils } from "../../types/constants/colors";

/**
 * Props for StanceTransitionEffect component
 */
export interface StanceTransitionEffectProps {
  /** Previous stance (for color interpolation) */
  readonly fromStance: TrigramStance | null;
  /** New stance being transitioned to */
  readonly toStance: TrigramStance;
  /** Callback when transition completes */
  readonly onTransitionComplete?: () => void;
  /** Transition duration in seconds (default: 0.5) */
  readonly duration?: number;
  /** Show stance name overlay (default: true) */
  readonly showNameOverlay?: boolean;
}

/**
 * Get color for each trigram stance
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
 * Get stance display names (Korean + English)
 */
const getStanceNames = (stance: TrigramStance) => {
  const names = {
    [TrigramStance.GEON]: { korean: "건", english: "Heaven", romanized: "Geon" },
    [TrigramStance.TAE]: { korean: "태", english: "Lake", romanized: "Tae" },
    [TrigramStance.LI]: { korean: "리", english: "Fire", romanized: "Li" },
    [TrigramStance.JIN]: { korean: "진", english: "Thunder", romanized: "Jin" },
    [TrigramStance.SON]: { korean: "손", english: "Wind", romanized: "Son" },
    [TrigramStance.GAM]: { korean: "감", english: "Water", romanized: "Gam" },
    [TrigramStance.GAN]: { korean: "간", english: "Mountain", romanized: "Gan" },
    [TrigramStance.GON]: { korean: "곤", english: "Earth", romanized: "Gon" },
  };
  return names[stance] ?? { korean: "건", english: "Heaven", romanized: "Geon" };
};

/**
 * StanceTransitionEffect Component
 * 
 * Provides smooth visual feedback during stance changes:
 * 1. Expanding energy ring effect from player center
 * 2. Color interpolation from old to new stance
 * 3. Bilingual stance name overlay (1 second display)
 * 
 * Performance optimized:
 * - Single animation frame callback
 * - Auto-cleanup after transition completes
 * - Reuses Three.js materials and geometries
 * 
 * @example
 * ```tsx
 * <StanceTransitionEffect
 *   fromStance={TrigramStance.GEON}
 *   toStance={TrigramStance.TAE}
 *   onTransitionComplete={() => console.log('Transition done')}
 *   duration={0.5}
 * />
 * ```
 */
export const StanceTransitionEffect: React.FC<StanceTransitionEffectProps> = ({
  fromStance,
  toStance,
  onTransitionComplete,
  duration = 0.5,
  showNameOverlay = true,
}) => {
  const ringRef = useRef<THREE.Mesh>(null);
  const startTimeRef = useRef<number>(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [showName, setShowName] = useState(showNameOverlay);

  // Get colors and names
  const fromColor = useMemo(
    () => (fromStance ? getStanceColor(fromStance) : getStanceColor(toStance)),
    [fromStance, toStance]
  );
  const toColor = useMemo(() => getStanceColor(toStance), [toStance]);
  const stanceNames = useMemo(() => getStanceNames(toStance), [toStance]);

  // Initialize start time
  useEffect(() => {
    startTimeRef.current = performance.now() / 1000;
    setIsTransitioning(true);
    setShowName(showNameOverlay);

    // Hide name after 1 second
    if (showNameOverlay) {
      const nameTimer = setTimeout(() => {
        setShowName(false);
      }, 1000);

      return () => clearTimeout(nameTimer);
    }
  }, [toStance, showNameOverlay]);

  // Animation loop
  useFrame((state) => {
    if (!isTransitioning || !ringRef.current) return;

    const elapsed = state.clock.elapsedTime - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1.0);

    // Interpolate color
    const currentColor = colorUtils.blend(fromColor, toColor, progress);
    (ringRef.current.material as THREE.MeshBasicMaterial).color.setHex(currentColor);

    // Expand ring outward
    const scale = 0.5 + progress * 2.5; // From 0.5 to 3.0
    ringRef.current.scale.setScalar(scale);

    // Fade out as it expands
    const opacity = 1.0 - progress * 0.7; // From 1.0 to 0.3
    (ringRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;

    // Complete transition
    if (progress >= 1.0) {
      setIsTransitioning(false);
      onTransitionComplete?.();
    }
  });

  // Convert color to hex string for CSS
  const toColorHex = `#${toColor.toString(16).padStart(6, '0')}`;

  return (
    <group data-testid="stance-transition-effect">
      {/* Expanding energy ring */}
      <mesh 
        ref={ringRef} 
        position={[0, 0.05, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
        data-testid="transition-ring"
      >
        <ringGeometry args={[0.8, 1.0, 32]} />
        <meshBasicMaterial
          color={fromColor}
          transparent
          opacity={1.0}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Stance name overlay (Korean + English) */}
      {showName && (
        <Html
          position={[0, 2.0, 0]}
          center
          distanceFactor={10}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
          data-testid="stance-name-overlay"
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 16px',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              borderRadius: '8px',
              border: `2px solid ${toColorHex}`,
              boxShadow: `0 0 20px ${toColorHex}`,
              animation: 'fadeInOut 1s ease-in-out',
            }}
          >
            {/* Korean name */}
            <div
              style={{
                fontSize: '24px',
                fontFamily: FONT_FAMILY.KOREAN,
                color: toColorHex,
                fontWeight: 'bold',
                textShadow: `0 0 10px ${toColorHex}`,
              }}
            >
              {stanceNames.korean}
            </div>
            
            {/* English name */}
            <div
              style={{
                fontSize: '14px',
                fontFamily: FONT_FAMILY.KOREAN,
                color: toColorHex,
                fontWeight: 'normal',
                opacity: 0.8,
              }}
            >
              {stanceNames.english}
            </div>
          </div>

          {/* CSS animation */}
          <style>
            {`
              @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(10px); }
                20% { opacity: 1; transform: translateY(0); }
                80% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-10px); }
              }
            `}
          </style>
        </Html>
      )}
    </group>
  );
};

export default StanceTransitionEffect;
