/**
 * Hand3D component with finger geometry for martial arts techniques
 * 
 * Renders detailed hand with palm and 5 fingers, supporting multiple
 * Korean martial arts hand poses (Fist, Knife-hand, Spear-hand, etc.).
 * 
 * Implements LOD (Level of Detail) for performance optimization:
 * - High detail (<5 units): Full finger bones (4 segments per finger)
 * - Medium detail (5-15 units): Simplified fingers (3 segments)
 * - Low detail (>15 units): No finger detail (hand as single unit)
 * 
 * @module components/three/Hand3D
 * @category 3D Components
 * @korean 손3D컴포넌트
 */

import React, { useMemo } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../types/constants";
import type {
  HandSide,
  HandPoseType,
  FingerCurl,
  HandLODConfig,
} from "../../types/hand-animation";

/**
 * Props for Hand3D component
 * 
 * @public
 * @korean 손3D속성
 */
export interface Hand3DProps {
  /**
   * Hand side (left or right)
   * @korean 손쪽
   */
  readonly side: HandSide;

  /**
   * Current hand pose
   * @korean 현재손자세
   */
  readonly pose: HandPoseType;

  /**
   * Finger curl amounts (0-1 per finger)
   * @korean 손가락구부림
   */
  readonly fingerCurl: FingerCurl;

  /**
   * Distance from camera for LOD
   * @korean 카메라거리
   */
  readonly distanceFromCamera: number;

  /**
   * Wrist rotation
   * @korean 손목회전
   */
  readonly wristRotation: THREE.Euler;

  /**
   * Whether hand is highlighted for vital point targeting
   * @korean 표시여부
   */
  readonly isHighlighted?: boolean;

  /**
   * Highlight mode for striking surfaces
   * @korean 표시모드
   */
  readonly highlightMode?:
    | "none"
    | "knuckles"
    | "palm"
    | "knife_edge"
    | "fingertips"
    | null;

  /**
   * Base skin color
   * @korean 피부색
   */
  readonly skinColor?: number;

  /**
   * Scale multiplier
   * @korean 크기배율
   */
  readonly scale?: number;
}

/**
 * Determine LOD config based on camera distance
 * 
 * @param distance - Distance from camera
 * @returns LOD configuration
 * @korean LOD설정결정
 */
const getLODConfig = (distance: number): HandLODConfig => {
  if (distance < 5) {
    return {
      detailLevel: "high",
      distanceThresholds: { high: 5, medium: 15, low: 100 },
      renderFingers: true,
      fingerSegments: 4,
    };
  } else if (distance < 15) {
    return {
      detailLevel: "medium",
      distanceThresholds: { high: 5, medium: 15, low: 100 },
      renderFingers: true,
      fingerSegments: 3,
    };
  } else {
    return {
      detailLevel: "low",
      distanceThresholds: { high: 5, medium: 15, low: 100 },
      renderFingers: false,
      fingerSegments: 0,
    };
  }
};

/**
 * Finger segment component
 * 
 * Renders a single finger segment (proximal, intermediate, or distal phalanx).
 * 
 * @korean 손가락세그먼트컴포넌트
 */
interface FingerSegmentProps {
  readonly position: [number, number, number];
  readonly rotation: [number, number, number];
  readonly length: number;
  readonly radius: number;
  readonly color: number;
  readonly emissive: number;
  readonly emissiveIntensity: number;
}

const FingerSegment: React.FC<FingerSegmentProps> = ({
  position,
  rotation,
  length,
  radius,
  color,
  emissive,
  emissiveIntensity,
}) => {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <capsuleGeometry args={[radius, length, 4, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        metalness={0.1}
        roughness={0.8}
      />
    </mesh>
  );
};

/**
 * Single finger component with curl animation
 * 
 * @korean 손가락컴포넌트
 */
interface FingerProps {
  readonly fingerName: string;
  readonly basePosition: [number, number, number];
  readonly curl: number;
  readonly segments: number;
  readonly isHighlighted: boolean;
  readonly skinColor: number;
}

const Finger: React.FC<FingerProps> = ({
  fingerName,
  basePosition,
  curl,
  segments,
  isHighlighted,
  skinColor,
}) => {
  // Finger dimensions based on anatomical proportions
  const dimensions = useMemo(() => {
    const baseLength = fingerName === "thumb" ? 0.02 : 0.025;
    const baseRadius = fingerName === "pinky" ? 0.003 : 0.004;

    return {
      proximalLength: baseLength,
      intermediateLength: baseLength * 0.8,
      distalLength: baseLength * 0.6,
      radius: baseRadius,
    };
  }, [fingerName]);

  // Calculate curl rotations for each segment
  // Curl value 0-1 maps to rotation angles
  // These factors represent biomechanical constraints of human finger joints
  const PROXIMAL_CURL_FACTOR = 0.5; // Proximal joint bends less (0-90 degrees)
  const INTERMEDIATE_CURL_FACTOR = 0.7; // Middle joint bends moderately (0-126 degrees)
  const DISTAL_CURL_FACTOR = 1.0; // Distal joint bends most (0-180 degrees)
  
  const proximalCurl = curl * PROXIMAL_CURL_FACTOR * Math.PI;
  const intermediateCurl = curl * INTERMEDIATE_CURL_FACTOR * Math.PI;
  const distalCurl = curl * DISTAL_CURL_FACTOR * Math.PI;

  // Highlight settings
  const emissive = isHighlighted ? KOREAN_COLORS.ACCENT_RED : 0x000000;
  const emissiveIntensity = isHighlighted ? 0.7 : 0;

  return (
    <group position={basePosition}>
      {/* Proximal phalanx (knuckle joint) */}
      <FingerSegment
        position={[0, dimensions.proximalLength / 2, 0]}
        rotation={[0, 0, proximalCurl]}
        length={dimensions.proximalLength}
        radius={dimensions.radius}
        color={skinColor}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
      />

      {/* Intermediate phalanx (middle joint) - skip for thumb or low detail */}
      {segments >= 4 && fingerName !== "thumb" && (
        <FingerSegment
          position={[
            0,
            dimensions.proximalLength + dimensions.intermediateLength / 2,
            0,
          ]}
          rotation={[0, 0, intermediateCurl]}
          length={dimensions.intermediateLength}
          radius={dimensions.radius * 0.9}
          color={skinColor}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      )}

      {/* Distal phalanx (fingertip) */}
      <FingerSegment
        position={[
          0,
          dimensions.proximalLength +
            (fingerName !== "thumb" && segments >= 4
              ? dimensions.intermediateLength
              : 0) +
            dimensions.distalLength / 2,
          0,
        ]}
        rotation={[0, 0, distalCurl]}
        length={dimensions.distalLength}
        radius={dimensions.radius * 0.7}
        color={skinColor}
        emissive={emissive}
        emissiveIntensity={isHighlighted ? 1.0 : 0} // Extra bright at fingertip
      />
    </group>
  );
};

/**
 * Hand3D Component
 * 
 * Complete hand with palm and 5 fingers, supporting Korean martial arts
 * hand poses with LOD optimization for performance.
 * 
 * @example
 * ```tsx
 * <Hand3D
 *   side="right"
 *   pose={HandPoseType.FIST}
 *   fingerCurl={{
 *     thumb: 0.8,
 *     index: 1.0,
 *     middle: 1.0,
 *     ring: 1.0,
 *     pinky: 1.0,
 *   }}
 *   distanceFromCamera={3}
 *   wristRotation={new THREE.Euler(0, 0, 0)}
 *   isHighlighted={false}
 *   highlightMode="knuckles"
 * />
 * ```
 * 
 * @korean 손3D컴포넌트
 */
export const Hand3D: React.FC<Hand3DProps> = ({
  side,
  // pose, // TODO: Reserved for future pose-specific hand adjustments (e.g., different palm sizes per pose)
  fingerCurl,
  distanceFromCamera,
  wristRotation,
  isHighlighted = false,
  highlightMode = null,
  skinColor = 0xffdbac,
  scale = 1.0,
}) => {
  // Determine LOD based on distance
  const lodConfig = useMemo(
    () => getLODConfig(distanceFromCamera),
    [distanceFromCamera]
  );

  // Hand orientation
  const sideMultiplier = side === "left" ? -1 : 1;

  // Palm dimensions
  const palmWidth = 0.06 * scale;
  const palmLength = 0.1 * scale;
  const palmThickness = 0.02 * scale;

  // Determine which parts to highlight
  const highlightKnuckles = highlightMode === "knuckles";
  const highlightPalm = highlightMode === "palm";
  const highlightKnifeEdge = highlightMode === "knife_edge";
  const highlightFingertips = highlightMode === "fingertips";

  // Palm highlight settings
  const palmEmissive = isHighlighted && highlightPalm
    ? KOREAN_COLORS.ACCENT_GOLD
    : 0x000000;
  const palmEmissiveIntensity = isHighlighted && highlightPalm ? 0.5 : 0;

  return (
    <group rotation={[wristRotation.x, wristRotation.y, wristRotation.z]} data-testid={`hand-3d-${side}`}>
      {/* Palm */}
      <mesh castShadow receiveShadow data-testid={`hand-palm-${side}`}>
        <boxGeometry args={[palmWidth, palmLength, palmThickness]} />
        <meshStandardMaterial
          color={skinColor}
          emissive={palmEmissive}
          emissiveIntensity={palmEmissiveIntensity}
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>

      {/* Knife edge highlight (pinky side of hand) */}
      {isHighlighted && highlightKnifeEdge && (
        <mesh
          position={[-palmWidth / 2 * sideMultiplier, 0, 0]}
          castShadow
          receiveShadow
          data-testid={`hand-knife-edge-${side}`}
        >
          <boxGeometry args={[0.005, palmLength, palmThickness]} />
          <meshStandardMaterial
            color={KOREAN_COLORS.ACCENT_GOLD}
            emissive={KOREAN_COLORS.ACCENT_GOLD}
            emissiveIntensity={0.8}
            metalness={0.3}
            roughness={0.5}
          />
        </mesh>
      )}

      {/* Render fingers based on LOD */}
      {lodConfig.renderFingers && (
        <>
          {/* Thumb - offset toward palm center and forward */}
          <Finger
            fingerName="thumb"
            basePosition={[
              0.015 * sideMultiplier * scale,
              palmLength / 2,
              palmThickness / 2,
            ]}
            curl={fingerCurl.thumb}
            segments={3} // Thumb has no intermediate phalanx
            isHighlighted={isHighlighted && highlightFingertips}
            skinColor={skinColor}
          />

          {/* Index finger */}
          <Finger
            fingerName="index"
            basePosition={[0.015 * sideMultiplier * scale, palmLength / 2, 0]}
            curl={fingerCurl.index}
            segments={lodConfig.fingerSegments}
            isHighlighted={
              isHighlighted && (highlightFingertips || highlightKnuckles)
            }
            skinColor={skinColor}
          />

          {/* Middle finger */}
          <Finger
            fingerName="middle"
            basePosition={[0.005 * sideMultiplier * scale, palmLength / 2, 0]}
            curl={fingerCurl.middle}
            segments={lodConfig.fingerSegments}
            isHighlighted={
              isHighlighted && (highlightFingertips || highlightKnuckles)
            }
            skinColor={skinColor}
          />

          {/* Ring finger */}
          <Finger
            fingerName="ring"
            basePosition={[-0.005 * sideMultiplier * scale, palmLength / 2, 0]}
            curl={fingerCurl.ring}
            segments={lodConfig.fingerSegments}
            isHighlighted={
              isHighlighted && (highlightFingertips || highlightKnuckles)
            }
            skinColor={skinColor}
          />

          {/* Pinky finger */}
          <Finger
            fingerName="pinky"
            basePosition={[-0.015 * sideMultiplier * scale, palmLength / 2, 0]}
            curl={fingerCurl.pinky}
            segments={lodConfig.fingerSegments}
            isHighlighted={
              isHighlighted && (highlightFingertips || highlightKnuckles)
            }
            skinColor={skinColor}
          />
        </>
      )}

      {/* Low detail: just palm, no fingers */}
      {!lodConfig.renderFingers && (
        <mesh
          position={[0, palmLength / 2, 0]}
          castShadow
          receiveShadow
          data-testid={`hand-simple-${side}`}
        >
          <capsuleGeometry args={[palmWidth / 2, palmLength * 0.3, 4, 8]} />
          <meshStandardMaterial
            color={skinColor}
            metalness={0.1}
            roughness={0.8}
          />
        </mesh>
      )}
    </group>
  );
};

export default Hand3D;
