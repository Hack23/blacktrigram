/**
 * BoneRenderer component for visualizing skeletal hierarchy
 * 
 * Renders bone hierarchy as connected capsule meshes with proper transformations.
 * Recursively renders parent-child bone relationships for complete skeleton visualization.
 * 
 * @module components/three/BoneRenderer
 * @category 3D Components
 * @korean 뼈렌더러컴포넌트
 */

import React, { useMemo } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../types/constants";
import type { HandAnimationState } from "../../types/hand-animation";
import type { Bone, SkeletalRig } from "../../types/skeletal";
import Hand3D from "./Hand3D";

/**
 * Props for BoneRenderer component
 * 
 * @public
 * @category Component Props
 * @korean 뼈렌더러속성
 */
export interface BoneRendererProps {
  /**
   * Skeletal rig to render
   * @korean 골격
   */
  readonly rig: SkeletalRig;

  /**
   * Bone color
   * @korean 뼈색상
   */
  readonly color?: number;

  /**
   * Whether to show bones (for debugging)
   * @korean 뼈표시여부
   */
  readonly showBones?: boolean;

  /**
   * Render mode: 'solid' for solid meshes, 'debug' for wireframe
   * @korean 렌더모드
   */
  readonly renderMode?: "solid" | "debug";

  /**
   * Left hand animation state
   * @korean 왼손애니메이션상태
   */
  readonly leftHandState?: HandAnimationState;

  /**
   * Right hand animation state
   * @korean 오른손애니메이션상태
   */
  readonly rightHandState?: HandAnimationState;

  /**
   * Distance from camera for LOD
   * @korean 카메라거리
   */
  readonly cameraDistance?: number;
}

/**
 * Single bone renderer with transformation
 * 
 * Renders a single bone as a capsule connecting to its parent.
 * 
 * @param bone - Bone to render
 * @param color - Bone color
 * @param renderMode - Render mode
 * @param leftHandState - Left hand animation state
 * @param rightHandState - Right hand animation state
 * @param cameraDistance - Distance from camera
 * @korean 단일뼈렌더러
 */
const SingleBone: React.FC<{
  readonly bone: Bone;
  readonly color: number;
  readonly renderMode: "solid" | "debug";
  readonly leftHandState?: HandAnimationState;
  readonly rightHandState?: HandAnimationState;
  readonly cameraDistance?: number;
}> = ({ bone, color, renderMode, leftHandState, rightHandState, cameraDistance = 10 }) => {
  // Calculate bone direction and length
  const boneTransform = useMemo(() => {
    const length = bone.length;
    const direction = new THREE.Vector3(1, 0, 0); // Default direction along X-axis

    // Calculate rotation to align with bone direction if parent exists
    let rotation = new THREE.Euler(0, 0, 0);
    if (bone.parent) {
      // Point towards local position
      const target = bone.position.clone().normalize();
      if (target.length() > 0.001) {
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          direction,
          target
        );
        rotation = new THREE.Euler().setFromQuaternion(quaternion);
      }
    }

    return { length, rotation };
  }, [bone]);

  return (
    <group
      position={bone.position.toArray()}
      rotation={[bone.rotation.x, bone.rotation.y, bone.rotation.z]}
      scale={bone.scale.toArray()}
      data-testid={`bone-${bone.name}`}
    >
      {/* Bone capsule connecting to parent */}
      {renderMode === "solid" ? (
        <mesh
          rotation={[
            boneTransform.rotation.x,
            boneTransform.rotation.y,
            boneTransform.rotation.z + Math.PI / 2,
          ]}
          castShadow
          receiveShadow
        >
          <capsuleGeometry
            args={[boneTransform.length * 0.1, boneTransform.length, 4, 8]}
          />
          <meshStandardMaterial
            color={color}
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>
      ) : (
        <mesh
          rotation={[
            boneTransform.rotation.x,
            boneTransform.rotation.y,
            boneTransform.rotation.z + Math.PI / 2,
          ]}
        >
          <capsuleGeometry
            args={[boneTransform.length * 0.1, boneTransform.length, 4, 8]}
          />
          <meshBasicMaterial
            color={color}
            wireframe={true}
            transparent={true}
            opacity={0.5}
          />
        </mesh>
      )}

      {/* Joint sphere at bone position */}
      {renderMode === "debug" && (
        <mesh>
          <sphereGeometry args={[boneTransform.length * 0.15, 8, 8]} />
          <meshBasicMaterial color={KOREAN_COLORS.PRIMARY_CYAN} />
        </mesh>
      )}

      {/* Render children recursively */}
      {bone.children.map((childBone) => (
        <SingleBone
          key={childBone.name}
          bone={childBone}
          color={color}
          renderMode={renderMode}
          leftHandState={leftHandState}
          rightHandState={rightHandState}
          cameraDistance={cameraDistance}
        />
      ))}

      {/* Add hands at hand bones with animation state */}
      {bone.name === "hand_L" && leftHandState && (
        <Hand3D 
          side="left" 
          pose={leftHandState.currentPose}
          fingerCurl={leftHandState.currentFingerCurl}
          distanceFromCamera={cameraDistance}
          wristRotation={leftHandState.currentWristRotation}
          isHighlighted={leftHandState.isHighlighted}
          highlightMode={leftHandState.highlightMode}
          skinColor={color}
          scale={1.0} 
        />
      )}
      {bone.name === "hand_R" && rightHandState && (
        <Hand3D 
          side="right" 
          pose={rightHandState.currentPose}
          fingerCurl={rightHandState.currentFingerCurl}
          distanceFromCamera={cameraDistance}
          wristRotation={rightHandState.currentWristRotation}
          isHighlighted={rightHandState.isHighlighted}
          highlightMode={rightHandState.highlightMode}
          skinColor={color}
          scale={1.0} 
        />
      )}
    </group>
  );
};

/**
 * BoneRenderer component
 * 
 * Renders complete skeletal rig with recursive bone hierarchy.
 * 
 * @example
 * ```tsx
 * const rig = createHumanoidRig();
 * <BoneRenderer rig={rig} color={0xFF6B6B} renderMode="solid" />
 * ```
 * 
 * @korean 뼈렌더러컴포넌트
 */
export const BoneRenderer: React.FC<BoneRendererProps> = ({
  rig,
  color = KOREAN_COLORS.ACCENT_RED,
  showBones = true,
  renderMode = "solid",
  leftHandState,
  rightHandState,
  cameraDistance = 10,
}) => {
  if (!showBones) {
    return null;
  }

  return (
    <group data-testid="bone-renderer">
      <SingleBone 
        bone={rig.root} 
        color={color} 
        renderMode={renderMode}
        leftHandState={leftHandState}
        rightHandState={rightHandState}
        cameraDistance={cameraDistance}
      />
    </group>
  );
};

export default BoneRenderer;
