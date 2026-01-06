/**
 * Face3D component with realistic facial features
 *
 * Renders facial features with expressions, eye tracking, and damage visualization:
 * - Eyes with pupils that track opponent
 * - Mouth that opens/closes based on expression
 * - Nose geometry
 * - Damage effects (bruises, swelling, bleeding)
 *
 * @module components/three/Face3D
 * @category 3D Components
 * @korean 얼굴3D컴포넌트
 */

import React, { useMemo } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../types/constants";
import {
  EYE_OPENNESS,
  MOUTH_OPENNESS,
  type EyeProps,
  type Face3DProps,
  type MouthProps,
} from "../../types/facial";
import { mixColors } from "../../utils/colorHelpers";

/**
 * Head position offset from bone center
 * Since Face3D is rendered inside the head bone group,
 * this is a small offset to position the face correctly
 * @korean 머리위치오프셋
 */
const HEAD_POSITION_OFFSET = 0.1;

/**
 * Eye component with pupil tracking and swelling
 *
 * Renders eye with adjustable openness, pupil tracking, and swelling effects.
 *
 * @param props - Eye component props
 * @returns Eye 3D mesh group
 *
 * @korean 눈컴포넌트
 */
const Eye: React.FC<EyeProps> = ({
  position,
  expression,
  lookDirection,
  swelling,
  side,
}) => {
  // Calculate eye openness based on expression
  const eyeOpenness = useMemo(() => {
    return EYE_OPENNESS[expression];
  }, [expression]);

  // Calculate pupil offset based on look direction
  const pupilOffset = useMemo(() => {
    // Normalize look direction
    const normalized = lookDirection.clone().normalize();

    // Convert to 2D offset (x, y in eye space)
    // Limit pupil movement to realistic range
    const maxOffset = 0.015;
    const x = normalized.x * maxOffset;
    const y = -normalized.y * maxOffset * 0.5; // Less vertical movement

    return new THREE.Vector3(x, y, 0.03);
  }, [lookDirection]);

  // Swelling color (purple bruise)
  const swellingColor = 0x663366;

  return (
    <group position={position} data-testid={`eye-${side}`}>
      {/* Eye white (sclera) */}
      <mesh scale={[1, eyeOpenness, 1]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color={0xffffff} />
      </mesh>

      {/* Pupil (tracks opponent) */}
      {eyeOpenness > 0.1 && (
        <mesh position={pupilOffset}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshBasicMaterial color={0x000000} />
        </mesh>
      )}

      {/* Swelling indicator */}
      {swelling > 0 && (
        <mesh scale={[1 + swelling * 0.5, 1 + swelling * 0.5, 1]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial
            color={swellingColor}
            transparent
            opacity={swelling * 0.6}
          />
        </mesh>
      )}
    </group>
  );
};

/**
 * Mouth component with expression-based openness and bleeding
 *
 * Renders mouth that opens/closes based on expression.
 *
 * @param props - Mouth component props
 * @returns Mouth 3D mesh group
 *
 * @korean 입컴포넌트
 */
const Mouth: React.FC<MouthProps> = ({ position, expression, bleeding }) => {
  // Calculate mouth openness based on expression
  const mouthOpenness = useMemo(() => {
    return MOUTH_OPENNESS[expression];
  }, [expression]);

  // Blood color
  const bloodColor = KOREAN_COLORS.ACCENT_RED;

  return (
    <group position={position} data-testid="mouth">
      {/* Mouth line */}
      <mesh scale={[0.08, mouthOpenness * 0.04 + 0.005, 0.01]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={0x330000} />
      </mesh>

      {/* Blood effect */}
      {bleeding > 0 && (
        <>
          {/* Blood on lip */}
          <mesh position={[0, -0.01, 0]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshBasicMaterial
              color={bloodColor}
              transparent
              opacity={bleeding * 0.8}
            />
          </mesh>

          {/* Blood drip */}
          {bleeding > 0.5 && (
            <mesh position={[0, -0.03, 0]} scale={[0.5, 1, 0.5]}>
              <cylinderGeometry args={[0.005, 0.008, 0.04, 8]} />
              <meshBasicMaterial
                color={bloodColor}
                transparent
                opacity={bleeding * 0.7}
              />
            </mesh>
          )}
        </>
      )}
    </group>
  );
};

/**
 * Nose component
 *
 * Simple geometric nose.
 *
 * @param position - Nose position
 * @param skinColor - Skin tone color
 * @param bleeding - Bleeding intensity (0-1)
 * @returns Nose 3D mesh
 *
 * @korean 코컴포넌트
 */
const Nose: React.FC<{
  position: [number, number, number];
  skinColor: number;
  bleeding: number;
}> = ({ position, skinColor, bleeding }) => {
  const bloodColor = KOREAN_COLORS.ACCENT_RED;

  return (
    <group position={position} data-testid="nose">
      {/* Nose */}
      <mesh rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.03, 0.06, 8]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* Blood from nose */}
      {bleeding > 0 && (
        <mesh position={[0, -0.03, 0.01]}>
          <sphereGeometry args={[0.01, 6, 6]} />
          <meshBasicMaterial
            color={bloodColor}
            transparent
            opacity={bleeding * 0.8}
          />
        </mesh>
      )}
    </group>
  );
};

/**
 * Face3D component
 *
 * Main facial features component with head sphere, eyes, mouth, nose,
 * and damage visualization.
 *
 * @param props - Face3D props
 * @returns Face 3D mesh group
 *
 * @example
 * ```tsx
 * <Face3D
 *   expression={FacialExpression.PAINED}
 *   damage={damageState}
 *   opponentPosition={new THREE.Vector3(5, 2, 0)}
 *   headRotation={new THREE.Euler(0, 0, 0)}
 *   enableEyeTracking={true}
 * />
 * ```
 *
 * @korean 얼굴3D
 */
export const Face3D: React.FC<Face3DProps> = ({
  expression,
  damage,
  opponentPosition,
  headRotation,
  enableEyeTracking = true,
  enableDamageVisuals = true,
  isMobile = false,
  skinColor = 0xffdbac, // Default skin tone
}) => {
  // Calculate eye direction toward opponent
  const eyeDirection = useMemo(() => {
    if (!enableEyeTracking) {
      return new THREE.Vector3(0, 0, 1); // Look forward
    }

    // Validate opponent position - check for required THREE.Vector3 methods
    // This is more robust than instanceof check in test environments
    if (
      !opponentPosition ||
      typeof opponentPosition.x !== "number" ||
      typeof opponentPosition.y !== "number" ||
      typeof opponentPosition.z !== "number"
    ) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "Face3D: opponentPosition is not a valid THREE.Vector3; defaulting eye direction forward."
        );
      }
      return new THREE.Vector3(0, 0, 1);
    }

    // Calculate direction from head to opponent using component subtraction
    // to avoid prototype chain issues in test environments
    // Use the same offset as the face position
    const headPos = new THREE.Vector3(0, HEAD_POSITION_OFFSET, 0);
    const dir = new THREE.Vector3(
      opponentPosition.x - headPos.x,
      opponentPosition.y - headPos.y,
      opponentPosition.z - headPos.z
    );
    dir.normalize();

    return dir;
  }, [opponentPosition, enableEyeTracking]);

  // Calculate overall bruise color intensity
  const bruiseIntensity = useMemo(() => {
    if (!enableDamageVisuals) return 0;

    const avgBruise =
      (damage.leftCheekBruise +
        damage.rightCheekBruise +
        damage.foreheadBruise +
        damage.jawBruise) /
      4;
    return avgBruise;
  }, [damage, enableDamageVisuals]);

  // Adjust head color for bruising using helper function
  const headColor = useMemo(() => {
    if (bruiseIntensity === 0) return skinColor;

    // Mix skin color with purple bruise color
    const bruiseColor = 0x663366;
    return mixColors(skinColor, bruiseColor, bruiseIntensity * 0.3);
  }, [skinColor, bruiseIntensity]);

  // NOTE: Damage visuals are currently handled via headColor bruise interpolation.
  // In a future implementation, this could be replaced with a canvas-based texture.
  const damageTexture = null;

  return (
    <group
      position={[0, HEAD_POSITION_OFFSET, 0]}
      rotation={headRotation}
      data-testid="face3d"
    >
      {/* Head sphere */}
      <mesh>
        <sphereGeometry args={[0.2, isMobile ? 12 : 16, isMobile ? 12 : 16]} />
        <meshStandardMaterial
          color={headColor}
          map={damageTexture}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Left eye */}
      <Eye
        position={[-0.08, 0.05, 0.15]}
        expression={expression}
        lookDirection={eyeDirection}
        swelling={enableDamageVisuals ? damage.leftEyeSwelling : 0}
        side="left"
      />

      {/* Right eye */}
      <Eye
        position={[0.08, 0.05, 0.15]}
        expression={expression}
        lookDirection={eyeDirection}
        swelling={enableDamageVisuals ? damage.rightEyeSwelling : 0}
        side="right"
      />

      {/* Mouth */}
      <Mouth
        position={[0, -0.05, 0.15]}
        expression={expression}
        bleeding={enableDamageVisuals ? damage.mouthBleeding : 0}
      />

      {/* Nose */}
      <Nose
        position={[0, 0.02, 0.18]}
        skinColor={skinColor}
        bleeding={enableDamageVisuals ? damage.noseBleeding : 0}
      />

      {/* Ears (simple geometric shapes) */}
      {!isMobile && (
        <>
          {/* Left ear */}
          <mesh position={[-0.2, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color={headColor} />
          </mesh>

          {/* Right ear */}
          <mesh position={[0.2, 0, 0]} rotation={[0, 0, -Math.PI / 6]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color={headColor} />
          </mesh>
        </>
      )}
    </group>
  );
};

export default Face3D;
