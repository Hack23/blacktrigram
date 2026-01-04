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
import type { FacialExpression, FacialDamageState } from "../../types/facial";
import { DEFAULT_FACIAL_DAMAGE } from "../../types/facial";
import Hand3D from "./Hand3D";
import Face3D from "./Face3D";

/**
 * Calculate bone thickness multiplier based on physical attributes
 * 
 * Maps muscle mass and fat mass to bone thickness scaling for visual appearance.
 * Higher muscle mass = thicker bones (more muscular skeleton).
 * Higher fat mass = slightly thicker bones (more padding).
 * 
 * @param muscleMass - Muscle mass in kilograms (typical: 32-42kg)
 * @param fatMass - Fat mass in kilograms (typical: 9-20kg)
 * @returns Thickness multiplier for bone radius (typically 0.85-1.25)
 * 
 * @korean 뼈두께계산
 */
const calculateBoneThicknessMultiplier = (
  muscleMass: number,
  fatMass: number
): number => {
  // Reference: 35kg muscle mass, 12kg fat mass → 1.0x thickness
  const referenceMuscle = 35;
  const referenceFat = 12;
  
  // Muscle contribution (70% of thickness variation)
  // 32kg → ~0.91x, 35kg → 1.0x, 42kg → ~1.10x
  const muscleRatio = muscleMass / referenceMuscle;
  const muscleContribution = Math.sqrt(muscleRatio) * 0.7;
  
  // Fat contribution (30% of thickness variation)
  // 9kg → ~0.95x, 12kg → 1.0x, 18kg → ~1.09x
  const fatRatio = fatMass / referenceFat;
  const fatContribution = Math.sqrt(fatRatio) * 0.3;
  
  // Combined thickness multiplier
  // Typical range: 0.85x (lean Amsalja) to 1.25x (bulky Jojik)
  return muscleContribution + fatContribution;
};

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

  /**
   * Current facial expression
   * @korean 얼굴표정
   */
  readonly facialExpression?: FacialExpression;

  /**
   * Facial damage state
   * @korean 얼굴손상
   */
  readonly facialDamage?: FacialDamageState;

  /**
   * Opponent position for eye tracking
   * @korean 상대위치
   */
  readonly opponentPosition?: THREE.Vector3;

  /**
   * Enable facial expressions rendering
   * @korean 얼굴표정렌더링
   */
  readonly enableFacialExpressions?: boolean;

  /**
   * Enable eye tracking
   * @korean 눈추적활성화
   */
  readonly enableEyeTracking?: boolean;

  /**
   * Physical attributes for bone thickness scaling
   * @korean 신체속성
   */
  readonly physicalAttributes?: {
    readonly muscleMass: number;
    readonly fatMass: number;
  };
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
 * @param boneThicknessMultiplier - Thickness multiplier for bone radius
 * @korean 단일뼈렌더러
 */
const SingleBone: React.FC<{
  readonly bone: Bone;
  readonly color: number;
  readonly renderMode: "solid" | "debug";
  readonly leftHandState?: HandAnimationState;
  readonly rightHandState?: HandAnimationState;
  readonly cameraDistance?: number;
  readonly facialExpression?: FacialExpression;
  readonly facialDamage?: FacialDamageState;
  readonly opponentPosition?: THREE.Vector3;
  readonly enableFacialExpressions?: boolean;
  readonly enableEyeTracking?: boolean;
  readonly boneThicknessMultiplier?: number;
}> = ({ 
  bone, 
  color, 
  renderMode, 
  leftHandState, 
  rightHandState, 
  cameraDistance = 10,
  facialExpression,
  facialDamage,
  opponentPosition,
  enableFacialExpressions = false,
  enableEyeTracking = true,
  boneThicknessMultiplier = 1.0,
}) => {
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
            args={[
              boneTransform.length * 0.1 * boneThicknessMultiplier, // Radius scaled by thickness
              boneTransform.length, // Length unchanged
              4, 
              8
            ]}
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
            args={[
              boneTransform.length * 0.1 * boneThicknessMultiplier, // Radius scaled by thickness
              boneTransform.length, // Length unchanged
              4, 
              8
            ]}
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
          <sphereGeometry args={[boneTransform.length * 0.15 * boneThicknessMultiplier, 8, 8]} />
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
          facialExpression={facialExpression}
          facialDamage={facialDamage}
          opponentPosition={opponentPosition}
          enableFacialExpressions={enableFacialExpressions}
          enableEyeTracking={enableEyeTracking}
          boneThicknessMultiplier={boneThicknessMultiplier}
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

      {/* Add facial features at head bone */}
      {bone.name === "head" && enableFacialExpressions && facialExpression && (
        <Face3D
          expression={facialExpression}
          damage={facialDamage ?? DEFAULT_FACIAL_DAMAGE}
          opponentPosition={opponentPosition ?? new THREE.Vector3(5, 2, 0)}
          headRotation={bone.rotation.clone()}
          enableEyeTracking={enableEyeTracking}
          enableDamageVisuals={true}
          isMobile={cameraDistance > 15}
          skinColor={color}
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
  facialExpression,
  facialDamage,
  opponentPosition,
  enableFacialExpressions = false, // Default false to avoid breaking existing tests
  enableEyeTracking = true,
  physicalAttributes,
}) => {
  // Calculate bone thickness multiplier from physical attributes
  const boneThicknessMultiplier = useMemo(() => {
    if (!physicalAttributes) return 1.0;
    return calculateBoneThicknessMultiplier(
      physicalAttributes.muscleMass,
      physicalAttributes.fatMass
    );
  }, [physicalAttributes]);

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
        facialExpression={facialExpression}
        facialDamage={facialDamage}
        opponentPosition={opponentPosition}
        enableFacialExpressions={enableFacialExpressions}
        enableEyeTracking={enableEyeTracking}
        boneThicknessMultiplier={boneThicknessMultiplier}
      />
    </group>
  );
};

export default BoneRenderer;
