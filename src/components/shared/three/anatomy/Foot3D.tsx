/**
 * Foot3D component with anatomically accurate foot geometry
 *
 * Renders detailed 3D foot with proper dimensions for martial arts stances
 * and kicks. Supports left/right feet with Korean skin tone coloring.
 *
 * Implements anatomically correct foot proportions:
 * - Length: ~26-29cm (varies by archetype)
 * - Width: ~10cm at widest point
 * - Height: ~8cm at ankle
 *
 * @module components/three/Foot3D
 * @category 3D Components
 * @korean 발3D컴포넌트
 */

import React, { useEffect, useMemo } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../../../types/constants";

/**
 * Props for Foot3D component
 *
 * @korean 발3D속성
 */
export interface Foot3DProps {
  /**
   * Foot side (left or right)
   * @korean 발쪽
   */
  readonly side: "left" | "right";

  /**
   * Base skin color
   * @korean 피부색
   */
  readonly skinColor?: number;

  /**
   * Scale multiplier (based on archetype physical attributes)
   * @korean 크기배율
   */
  readonly scale?: number;

  /**
   * Whether foot is highlighted (e.g., during kicks)
   * @korean 표시여부
   */
  readonly isHighlighted?: boolean;
}

/**
 * Foot3D Component
 *
 * Complete foot geometry with anatomically correct dimensions suitable
 * for Korean martial arts stance visualization and kick animations.
 *
 * Design notes:
 * - Main foot body is box-shaped with rounded edges
 * - Toe area is slightly elevated and separated
 * - Heel is wider than toe area for stability
 * - Dimensions scale with archetype (Amsalja: smaller, Jojik: larger)
 *
 * @example
 * ```tsx
 * <Foot3D
 *   side="right"
 *   skinColor={0xffdbac}
 *   scale={1.0}
 *   isHighlighted={false}
 * />
 * ```
 *
 * @korean 발3D컴포넌트
 */
export const Foot3D: React.FC<Foot3DProps> = ({
  side,
  skinColor = 0xffdbac,
  scale = 1.0,
  isHighlighted = false,
}) => {
  // Anatomically correct foot dimensions for average male (180cm height)
  // These scale with archetype physical attributes
  const footDimensions = useMemo(() => {
    // Average male foot: 26-29cm length, ~10cm width, ~8cm height
    const footLength = 0.26 * scale; // 26cm base length
    const footWidth = 0.1 * scale; // 10cm width
    const footHeight = 0.08 * scale; // 8cm height at ankle

    // Toe area dimensions (front 30% of foot)
    const toeLength = footLength * 0.3;
    const toeWidth = footWidth * 0.9; // Slightly narrower than heel
    const toeHeight = footHeight * 0.6; // Lower profile

    // Heel area dimensions (back 70% of foot)
    const heelLength = footLength * 0.7;

    return {
      footLength,
      footWidth,
      footHeight,
      toeLength,
      toeWidth,
      toeHeight,
      heelLength,
    };
  }, [scale]);

  // Foot color (highlight during kicks with brighter color)
  const footColor = useMemo(() => {
    if (isHighlighted) {
      return KOREAN_COLORS.ACCENT_GOLD;
    }
    return skinColor;
  }, [isHighlighted, skinColor]);

  // Memoize shared skin material for all foot parts
  const skinMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: footColor,
        metalness: 0,
        roughness: 0.8,
        clearcoat: 0.3,
        clearcoatRoughness: 0.5,
        // PBR skin properties
        transmission: 0,
        thickness: 0.1,
        ior: 1.4, // Index of refraction for skin
        sheen: 0.1, // Subtle skin sheen
        sheenRoughness: 0.8,
        // Subtle emissive for alive appearance
        emissive: new THREE.Color(footColor),
        emissiveIntensity: isHighlighted ? 0.3 : 0.02,
      }),
    [footColor, isHighlighted],
  );

  // Dispose skin material on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      skinMaterial.dispose();
    };
  }, [skinMaterial]);

  return (
    <group name={`foot-3d-${side}`}>
      {/* Ankle connector - larger sphere that bridges shin body surface to foot */}
      <mesh
        position={[0, 0, 0]}
        castShadow
        receiveShadow
        name={`foot-ankle-bridge-${side}`}
      >
        <sphereGeometry args={[footDimensions.footHeight * 0.6, 10, 10]} />
        <primitive object={skinMaterial} attach="material" />
      </mesh>

      {/* Ankle-to-heel transition cylinder */}
      <mesh
        position={[
          0,
          -footDimensions.footHeight * 0.2,
          footDimensions.heelLength * 0.1,
        ]}
        castShadow
        receiveShadow
        name={`foot-ankle-transition-${side}`}
      >
        <cylinderGeometry
          args={[
            footDimensions.footHeight * 0.5, // Top radius matches ankle sphere
            footDimensions.footWidth * 0.45, // Bottom matches heel width
            footDimensions.footHeight * 0.4,
            8,
          ]}
        />
        <primitive object={skinMaterial} attach="material" />
      </mesh>

      {/* Main heel/midfoot body - capsule for smooth organic shape */}
      <mesh
        position={[
          0,
          -footDimensions.footHeight * 0.4,
          footDimensions.heelLength * 0.2,
        ]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
        name={`foot-heel-${side}`}
      >
        <capsuleGeometry
          args={[
            footDimensions.footWidth * 0.45, // Radius
            footDimensions.heelLength * 0.5, // Length (shorter than full heel - caps add length)
            4,
            8,
          ]}
        />
        <primitive object={skinMaterial} attach="material" />
      </mesh>

      {/* Toe area - capsule for rounded toe shape */}
      <mesh
        position={[
          0,
          -footDimensions.footHeight * 0.35 + footDimensions.toeHeight * 0.2,
          footDimensions.heelLength * 0.7 + footDimensions.toeLength / 2,
        ]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
        name={`foot-toes-${side}`}
      >
        <capsuleGeometry
          args={[
            footDimensions.toeWidth * 0.35, // Narrower radius for tapered toes
            footDimensions.toeLength * 0.4, // Shorter length
            4,
            8,
          ]}
        />
        <primitive object={skinMaterial} attach="material" />
      </mesh>
    </group>
  );
};

export default Foot3D;
