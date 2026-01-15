/**
 * KoreanSignage3D - Three.js 3D Korean text signage with emissive glow
 *
 * Renders Korean text signs with neon emissive effects positioned around the arena
 * Creates an immersive cyberpunk Korean martial arts atmosphere
 */

import { Text } from "@react-three/drei";
import React, { useMemo, useEffect } from "react";
import * as THREE from "three";
import { KOREAN_COLORS, FONT_FAMILY } from "../../../../../types/constants";

/**
 * Props for the KoreanSignage3D component.
 */
export interface KoreanSignage3DProps {
  /** Scale factor for signage size (1.0 = desktop, <1.0 = mobile). Defaults to 1.0 */
  readonly scale?: number;
}

/**
 * KoreanSignage3D Component
 * Creates Korean text signs with neon emissive glow around the combat arena
 *
 * Signs:
 * - "전투" (Combat) - Left wall, gold accent
 * - "흑괘" (Black Trigram) - Right wall, cyan accent
 * - "급소격" (Vital Point Strike) - Back wall, red accent
 */
export const KoreanSignage3D: React.FC<KoreanSignage3DProps> = ({
  scale = 1.0,
}) => {
  // Emissive material for glowing neon text
  // Using MeshBasicMaterial with toneMapped: false for bloom compatibility
  const goldNeonMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: KOREAN_COLORS.ACCENT_GOLD,
        toneMapped: false, // Prevent tone mapping for bloom effect
      }),
    []
  );

  const cyanNeonMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: KOREAN_COLORS.PRIMARY_CYAN,
        toneMapped: false,
      }),
    []
  );

  const redNeonMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: KOREAN_COLORS.KOREAN_RED,
        toneMapped: false,
      }),
    []
  );

  // Scale-aware positioning and sizing
  const leftWallX = -12 * scale;
  const rightWallX = 12 * scale;
  const backWallZ = -14 * scale;
  const signHeight = 5 * scale;
  const fontSize = 1.5 * scale;
  const outlineWidth = 0.05 * scale;

  // Cleanup materials on unmount
  useEffect(() => {
    return () => {
      goldNeonMaterial.dispose();
      cyanNeonMaterial.dispose();
      redNeonMaterial.dispose();
    };
  }, [goldNeonMaterial, cyanNeonMaterial, redNeonMaterial]);

  return (
    <group>
      {/* "전투" (Combat) sign - left wall */}
      <Text
        position={[leftWallX, signHeight, 0]}
        rotation={[0, Math.PI / 2, 0]}
        font={FONT_FAMILY.KOREAN}
        fontSize={fontSize}
        color={KOREAN_COLORS.ACCENT_GOLD}
        outlineColor={KOREAN_COLORS.PRIMARY_CYAN}
        outlineWidth={outlineWidth}
        material={goldNeonMaterial}
        anchorX="center"
        anchorY="middle"
      >
        전투
      </Text>

      {/* "흑괘" (Black Trigram) sign - right wall */}
      <Text
        position={[rightWallX, signHeight, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        font={FONT_FAMILY.KOREAN}
        fontSize={fontSize}
        color={KOREAN_COLORS.PRIMARY_CYAN}
        outlineColor={KOREAN_COLORS.ACCENT_GOLD}
        outlineWidth={outlineWidth}
        material={cyanNeonMaterial}
        anchorX="center"
        anchorY="middle"
      >
        흑괘
      </Text>

      {/* "급소격" (Vital Point Strike) sign - back wall */}
      <Text
        position={[0, signHeight, backWallZ]}
        rotation={[0, 0, 0]}
        font={FONT_FAMILY.KOREAN}
        fontSize={fontSize * 0.8} // Slightly smaller for back wall
        color={KOREAN_COLORS.KOREAN_RED}
        outlineColor={KOREAN_COLORS.ACCENT_GOLD}
        outlineWidth={outlineWidth}
        material={redNeonMaterial}
        anchorX="center"
        anchorY="middle"
      >
        급소격
      </Text>
    </group>
  );
};

export default KoreanSignage3D;
