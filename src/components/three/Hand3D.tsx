/**
 * Hand3D component with 5 fingers
 * 
 * Simplified hand geometry with palm and 5 fingers for realistic martial arts poses.
 * Each finger is a simplified capsule (no full finger bones for performance).
 * 
 * @module components/three/Hand3D
 * @category 3D Components
 * @korean 손3D컴포넌트
 */

import React from "react";


/**
 * Props for Hand3D component
 * 
 * @public
 * @category Component Props
 * @korean 손3D속성
 */
export interface Hand3DProps {
  /**
   * Hand side (left or right)
   * @korean 손방향
   */
  readonly side: "left" | "right";

  /**
   * Hand color
   * @korean 손색상
   */
  readonly color?: number;

  /**
   * Scale multiplier
   * @korean 크기
   */
  readonly scale?: number;

  /**
   * Whether hand is closed (fist)
   * @korean 주먹쥔상태
   */
  readonly isClosed?: boolean;
}

/**
 * Hand3D component
 * 
 * Renders a simplified hand with palm and 5 fingers.
 * Fingers are positioned and scaled appropriately for left/right hand.
 * 
 * @example
 * ```tsx
 * <Hand3D side="right" color={0xFF6B6B} scale={1.0} isClosed={false} />
 * ```
 * 
 * @korean 손3D컴포넌트
 */
export const Hand3D: React.FC<Hand3DProps> = ({
  side,
  color = 0xFFCBA4, // Default skin tone color
  scale = 1.0,
  isClosed = false,
}) => {
  // Hand orientation: left hand points left, right hand points right
  const xOffset = side === "left" ? -0.08 : 0.08;
  const handScale = side === "left" ? -scale : scale;

  // Finger curl amount when closed
  const fingerCurl = isClosed ? 0.5 : 0;

  return (
    <group position={[xOffset * scale, 0, 0]} scale={[handScale, scale, scale]}>
      {/* Palm */}
      <mesh castShadow receiveShadow data-testid={`hand-palm-${side}`}>
        <boxGeometry args={[0.06, 0.1, 0.02]} />
        <meshStandardMaterial
          color={color}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* Thumb (offset more to the side) */}
      <mesh
        position={[-0.035, -0.02, 0.01]}
        rotation={[0, 0, isClosed ? 0.5 : 0.3]}
        castShadow
        data-testid={`hand-finger-thumb-${side}`}
      >
        <capsuleGeometry args={[0.005, 0.035, 4, 8]} />
        <meshStandardMaterial
          color={color}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* Index finger */}
      <mesh
        position={[-0.018, 0.06 - fingerCurl * 0.02, 0]}
        rotation={[fingerCurl, 0, 0]}
        castShadow
        data-testid={`hand-finger-index-${side}`}
      >
        <capsuleGeometry args={[0.005, 0.04, 4, 8]} />
        <meshStandardMaterial
          color={color}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* Middle finger (longest) */}
      <mesh
        position={[-0.003, 0.065 - fingerCurl * 0.025, 0]}
        rotation={[fingerCurl, 0, 0]}
        castShadow
        data-testid={`hand-finger-middle-${side}`}
      >
        <capsuleGeometry args={[0.005, 0.045, 4, 8]} />
        <meshStandardMaterial
          color={color}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* Ring finger */}
      <mesh
        position={[0.012, 0.06 - fingerCurl * 0.02, 0]}
        rotation={[fingerCurl, 0, 0]}
        castShadow
        data-testid={`hand-finger-ring-${side}`}
      >
        <capsuleGeometry args={[0.005, 0.04, 4, 8]} />
        <meshStandardMaterial
          color={color}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* Pinky finger (shortest) */}
      <mesh
        position={[0.027, 0.055 - fingerCurl * 0.015, 0]}
        rotation={[fingerCurl, 0, 0]}
        castShadow
        data-testid={`hand-finger-pinky-${side}`}
      >
        <capsuleGeometry args={[0.005, 0.035, 4, 8]} />
        <meshStandardMaterial
          color={color}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>
    </group>
  );
};

export default Hand3D;
