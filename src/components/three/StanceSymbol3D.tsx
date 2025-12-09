/**
 * StanceSymbol3D - Floating trigram symbol above player
 * 
 * Displays the Unicode trigram symbol (☰☱☲☳☴☵☶☷) floating above the player's head,
 * with rotation animation and pulsing glow effect. Provides immediate visual feedback
 * of the current stance to the player and observers.
 * 
 * @module components/three/StanceSymbol3D
 * @category 3D Components
 * @korean 자세기호3D
 */

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { TrigramStance } from "../../types/common";
import { FONT_FAMILY, KOREAN_COLORS } from "../../types/constants";

/**
 * Props for StanceSymbol3D component
 */
export interface StanceSymbol3DProps {
  /** Current trigram stance to display */
  readonly stance: TrigramStance;
  /** Height offset above player (default: 2.5) */
  readonly heightOffset?: number;
  /** Whether symbol should rotate */
  readonly animated?: boolean;
  /** Symbol scale multiplier */
  readonly scale?: number;
  /** Show Korean name below symbol */
  readonly showName?: boolean;
}

/**
 * Get trigram Unicode symbol for each stance
 * 
 * @param stance - Current trigram stance
 * @returns Unicode trigram symbol
 */
const getTrigramSymbol = (stance: TrigramStance): string => {
  const symbols = {
    [TrigramStance.GEON]: "☰", // Heaven
    [TrigramStance.TAE]: "☱",  // Lake
    [TrigramStance.LI]: "☲",   // Fire
    [TrigramStance.JIN]: "☳",  // Thunder
    [TrigramStance.SON]: "☴",  // Wind
    [TrigramStance.GAM]: "☵",  // Water
    [TrigramStance.GAN]: "☶",  // Mountain
    [TrigramStance.GON]: "☷",  // Earth
  };
  return symbols[stance] ?? "☰";
};

/**
 * Get Korean name for each stance
 * 
 * @param stance - Current trigram stance
 * @returns Korean name (Hangul)
 */
const getStanceKoreanName = (stance: TrigramStance): string => {
  const names = {
    [TrigramStance.GEON]: "건", // Geon
    [TrigramStance.TAE]: "태",  // Tae
    [TrigramStance.LI]: "리",   // Li
    [TrigramStance.JIN]: "진",  // Jin
    [TrigramStance.SON]: "손",  // Son
    [TrigramStance.GAM]: "감",  // Gam
    [TrigramStance.GAN]: "간",  // Gan
    [TrigramStance.GON]: "곤",  // Gon
  };
  return names[stance] ?? "건";
};

/**
 * Get color for each trigram stance
 * 
 * @param stance - Current trigram stance
 * @returns Hex color string for CSS
 */
const getStanceColorHex = (stance: TrigramStance): string => {
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
  const color = stanceColors[stance] ?? KOREAN_COLORS.PRIMARY_CYAN;
  return `#${color.toString(16).padStart(6, '0')}`;
};

/**
 * Animation constants for stance symbol
 */
const ANIMATION_CONSTANTS = {
  ROTATION_SPEED: 0.5,
  BOB_AMPLITUDE: 0.1,
  BOB_FREQUENCY: 2,
} as const;

/**
 * StanceSymbol3D Component
 * 
 * Renders a floating trigram symbol above the player with:
 * - Rotation animation
 * - Pulsing glow effect
 * - Stance-specific coloring
 * - Optional Korean name display
 * 
 * Uses Html from @react-three/drei for crisp text rendering that always faces camera.
 * 
 * @example
 * ```tsx
 * <StanceSymbol3D 
 *   stance={TrigramStance.GEON}
 *   heightOffset={2.5}
 *   animated={true}
 *   showName={true}
 * />
 * ```
 */
export const StanceSymbol3D: React.FC<StanceSymbol3DProps> = ({
  stance,
  heightOffset = 2.5,
  animated = true,
  scale = 1.0,
  showName = true,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Get stance properties
  const symbol = useMemo(() => getTrigramSymbol(stance), [stance]);
  const koreanName = useMemo(() => getStanceKoreanName(stance), [stance]);
  const colorHex = useMemo(() => getStanceColorHex(stance), [stance]);

  // Animation loop - rotation and pulse
  useFrame((state) => {
    if (!animated || !groupRef.current) return;

    const time = state.clock.elapsedTime;

    // Rotate symbol slowly
    groupRef.current.rotation.y = time * ANIMATION_CONSTANTS.ROTATION_SPEED;

    // Gentle vertical bob
    groupRef.current.position.y = heightOffset + Math.sin(time * ANIMATION_CONSTANTS.BOB_FREQUENCY) * ANIMATION_CONSTANTS.BOB_AMPLITUDE;
  });

  return (
    <group ref={groupRef} position={[0, heightOffset, 0]} data-testid="stance-symbol-3d">
      {/* Trigram symbol with glow effect */}
      <Html
        center
        distanceFactor={10}
        zIndexRange={[100, 0]}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {/* Main trigram symbol */}
          <div
            style={{
              fontSize: `${48 * scale}px`,
              fontFamily: FONT_FAMILY.KOREAN,
              color: colorHex,
              textShadow: `
                0 0 10px ${colorHex},
                0 0 20px ${colorHex},
                0 0 30px ${colorHex}
              `,
              fontWeight: 'bold',
              lineHeight: '1',
              animation: 'pulse 2s ease-in-out infinite',
            }}
            data-testid="trigram-symbol"
          >
            {symbol}
          </div>
          
          {/* Korean name below symbol */}
          {showName && (
            <div
              style={{
                fontSize: `${16 * scale}px`,
                fontFamily: FONT_FAMILY.KOREAN,
                color: colorHex,
                textShadow: `0 0 5px ${colorHex}`,
                fontWeight: 'bold',
                letterSpacing: '2px',
              }}
              data-testid="stance-korean-name"
            >
              {koreanName}
            </div>
          )}
        </div>

        {/* CSS animation for pulse effect */}
        <style>
          {`
            @keyframes pulse {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.8; transform: scale(1.1); }
            }
          `}
        </style>
      </Html>
    </group>
  );
};

export default StanceSymbol3D;
