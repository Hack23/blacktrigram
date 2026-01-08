/**
 * Debug visualization component for collision detection bounding boxes.
 * 
 * **Korean**: 충돌 감지 디버그 시각화
 * 
 * Provides visual debugging tools for the collision detection system, including:
 * - Bounding boxes for all 5 anatomical regions
 * - Attack reach spheres
 * - Raycaster visualization
 * 
 * @module components/three/DebugCollision
 * @category Debug Components
 * @korean 충돌디버그
 */

import React, { useMemo, useEffect } from "react";
import { CollisionDetection } from "../../../../systems/physics/CollisionDetection";
import { KOREAN_COLORS } from "../../../../types/constants";
import type { Position3D, AnatomicalRegionPhysics } from "../../../../types/physics";

/**
 * Props for DebugCollision component.
 * 
 * @public
 * @korean 디버그충돌속성
 */
export interface DebugCollisionProps {
  /** Whether to show bounding boxes */
  readonly showBoundingBoxes?: boolean;
  
  /** Whether to show attack reach sphere */
  readonly showAttackReach?: boolean;
  
  /** Attack reach radius in meters */
  readonly attackReach?: number;
  
  /** Position of the attacker (for reach sphere) */
  readonly attackerPosition?: Position3D;
  
  /** Position of the defender (for bounding boxes) */
  readonly defenderPosition?: Position3D;
  
  /** Opacity of debug visuals (0-1) */
  readonly opacity?: number;
}

/**
 * Color mapping for different anatomical regions.
 * 
 * @private
 * @korean 영역색상매핑
 */
const REGION_COLORS: Record<AnatomicalRegionPhysics, number> = {
  head: 0x000000,                             // Black for head
  neck: KOREAN_COLORS.ACCENT_BLUE,            // Blue for neck
  torso: KOREAN_COLORS.ACCENT_GOLD,           // Yellow/Gold for torso
  arms: KOREAN_COLORS.SECONDARY_MAGENTA,      // Magenta for arms
  legs: 0x00FF88,                             // Green for legs
};

/**
 * Debug visualization component for collision detection.
 * 
 * **Korean**: 충돌 감지 디버그 컴포넌트
 * 
 * Renders transparent wireframe visualizations of bounding boxes and attack reach.
 * Useful for debugging collision detection logic and tuning parameters.
 * 
 * @example
 * ```tsx
 * <Canvas>
 *   <DebugCollision
 *     showBoundingBoxes={true}
 *     showAttackReach={true}
 *     attackReach={0.77}
 *     attackerPosition={{ x: 0, y: 0, z: 5 }}
 *     defenderPosition={{ x: 0, y: 0, z: 6 }}
 *     opacity={0.3}
 *   />
 * </Canvas>
 * ```
 * 
 * @public
 * @korean 디버그충돌컴포넌트
 */
export const DebugCollision: React.FC<DebugCollisionProps> = ({
  showBoundingBoxes = true,
  showAttackReach = true,
  attackReach = 0.7,
  attackerPosition = { x: 0, y: 0, z: 5 },
  defenderPosition = { x: 0, y: 0, z: 6 },
  opacity = 0.3,
}) => {
  // Create collision detection instance
  const collision = useMemo(() => new CollisionDetection(), []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      collision.dispose();
    };
  }, [collision]);
  
  // Get all bounding boxes
  const boundingBoxes = useMemo(() => {
    const boxes = collision.getAllBoundingBoxes();
    return Array.from(boxes.entries());
  }, [collision]);
  
  return (
    <group data-testid="debug-collision">
      {/* Bounding boxes for anatomical regions */}
      {showBoundingBoxes && boundingBoxes.map(([region, box]) => {
        const color = REGION_COLORS[region];
        const position: [number, number, number] = [
          defenderPosition.x + box.center.x,
          defenderPosition.y + box.center.y,
          defenderPosition.z + box.center.z,
        ];
        
        // Render different geometry based on bounding box type
        switch (box.type) {
          case "sphere":
            return (
              <mesh key={region} position={position}>
                <sphereGeometry args={[box.dimensions.x, 16, 16]} />
                <meshBasicMaterial
                  color={color}
                  wireframe
                  transparent
                  opacity={opacity}
                />
              </mesh>
            );
          
          case "box":
            return (
              <mesh key={region} position={position}>
                <boxGeometry args={[
                  box.dimensions.x,
                  box.dimensions.y,
                  box.dimensions.z,
                ]} />
                <meshBasicMaterial
                  color={color}
                  wireframe
                  transparent
                  opacity={opacity}
                />
              </mesh>
            );
          
          case "capsule":
            return (
              <mesh key={region} position={position}>
                <capsuleGeometry args={[
                  box.dimensions.x,
                  box.dimensions.y,
                  8,
                  16,
                ]} />
                <meshBasicMaterial
                  color={color}
                  wireframe
                  transparent
                  opacity={opacity}
                />
              </mesh>
            );
          
          default:
            return null;
        }
      })}
      
      {/* Attack reach sphere */}
      {showAttackReach && (
        <mesh
          position={[attackerPosition.x, attackerPosition.y, attackerPosition.z]}
          data-testid="attack-reach-sphere"
        >
          <sphereGeometry args={[attackReach, 32, 32]} />
          <meshBasicMaterial
            color={KOREAN_COLORS.PRIMARY_CYAN}
            wireframe
            transparent
            opacity={opacity * 0.5}
          />
        </mesh>
      )}
      
      {/* Attack direction ray */}
      {showAttackReach && (
        <line key="attack-direction-ray">
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              args={[new Float32Array([
                attackerPosition.x, attackerPosition.y, attackerPosition.z,
                defenderPosition.x, defenderPosition.y, defenderPosition.z,
              ]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={KOREAN_COLORS.ACCENT_GOLD}
            linewidth={2}
            transparent
            opacity={opacity}
          />
        </line>
      )}
    </group>
  );
};

export default DebugCollision;
