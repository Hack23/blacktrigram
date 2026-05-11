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

import { useFrame } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import {
  BASE_BONE_RADIUS_RATIO,
  calculateBoneThickness,
} from "../../../../constants/bodyRenderingConstants";
import type { PlayerArchetype } from "../../../../types/common";
import { KOREAN_COLORS } from "../../../../types/constants";
import type {
  FacialDamageState,
  FacialExpression,
} from "../../../../types/facial";
import { DEFAULT_FACIAL_DAMAGE } from "../../../../types/facial";
import type { HandAnimationState } from "../../../../types/hand-animation";
import type { Bone, SkeletalRig } from "../../../../types/skeletal";
import { BoneMuscles } from "./BoneAttachedMuscles";
import { BoneClothing } from "./BoneClothing";
import { BodySurface } from "./BodySurface";
import Face3D from "./Face3D";
import Foot3D from "./Foot3D";
import Hand3D from "./Hand3D";

/**
 * Props for BoneRenderer component
 *
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
    readonly shoulderWidth?: number;
    readonly torsoLength?: number;
    readonly armLength?: number;
    readonly legLength?: number;
  };

  /**
   * Player archetype for clothing style
   * @korean 플레이어원형
   */
  readonly archetype?: PlayerArchetype;

  /**
   * Muscle tension states for bone-attached muscles
   * Map of muscle group name to tension level (0-1)
   * @korean 근육상태들
   */
  readonly muscleStates?: Map<string, number>;

  /**
   * Whether player is exhausted (triggers muscle shaking)
   * @korean 피로여부
   */
  readonly isExhausted?: boolean;
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
  readonly muscleStates?: Map<string, number>;
  readonly isExhausted?: boolean;
  readonly physicalAttributes?: {
    readonly muscleMass: number;
    readonly fatMass: number;
    readonly shoulderWidth?: number;
    readonly torsoLength?: number;
    readonly armLength?: number;
    readonly legLength?: number;
  };
  readonly archetype?: PlayerArchetype;
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
  muscleStates,
  isExhausted = false,
  physicalAttributes,
  archetype,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.set(
        bone.rotation.x,
        bone.rotation.y,
        bone.rotation.z,
      );
      groupRef.current.position.set(
        bone.position.x,
        bone.position.y,
        bone.position.z,
      );
    }
  });

  const boneTransform = useMemo(() => {
    const length = bone.length;
    const capsuleDefaultDirection = new THREE.Vector3(0, 1, 0);

    let rotation = new THREE.Euler(0, 0, 0);
    let offset = new THREE.Vector3(0, -length / 2, 0);

    if (bone.parent) {
      const x = bone.position.x ?? 0;
      const y = bone.position.y ?? 0;
      const z = bone.position.z ?? 0;

      const positionLength = Math.sqrt(x * x + y * y + z * z);
      if (positionLength > 0.001) {
        const targetX = x / positionLength;
        const targetY = y / positionLength;
        const targetZ = z / positionLength;
        const target = new THREE.Vector3(targetX, targetY, targetZ);

        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          capsuleDefaultDirection,
          target,
        );
        rotation = new THREE.Euler().setFromQuaternion(quaternion);

        offset = new THREE.Vector3(
          (-targetX * length) / 2,
          (-targetY * length) / 2,
          (-targetZ * length) / 2,
        );
      }
    }

    return { length, rotation, offset };
  }, [bone]);

  const hasMuscles = muscleStates !== undefined && muscleStates.size > 0;

  return (
    <group
      ref={groupRef}
      scale={bone.scale.toArray()}
      name={`bone-${bone.name}`}
    >
      {/* Bone capsule connecting to parent - ONLY render if no muscles (muscles provide body shape) */}
      {renderMode === "solid" && !hasMuscles ? (
        <mesh
          position={boneTransform.offset.toArray()}
          rotation={[
            boneTransform.rotation.x,
            boneTransform.rotation.y,
            boneTransform.rotation.z,
          ]}
          castShadow
          receiveShadow
        >
          <capsuleGeometry
            args={[
              boneTransform.length *
                BASE_BONE_RADIUS_RATIO *
                boneThicknessMultiplier, // Radius scaled by thickness
              boneTransform.length, // Length unchanged
              4,
              8,
            ]}
          />
          <meshPhysicalMaterial
            color={color}
            metalness={0.5}
            roughness={0.4}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            envMapIntensity={1.0}
          />
        </mesh>
      ) : renderMode === "debug" ? (
        <mesh
          position={boneTransform.offset.toArray()}
          rotation={[
            boneTransform.rotation.x,
            boneTransform.rotation.y,
            boneTransform.rotation.z,
          ]}
        >
          <capsuleGeometry
            args={[
              boneTransform.length *
                BASE_BONE_RADIUS_RATIO *
                boneThicknessMultiplier, // Radius scaled by thickness
              boneTransform.length, // Length unchanged
              4,
              8,
            ]}
          />
          <meshBasicMaterial
            color={color}
            wireframe={true}
            transparent={true}
            opacity={0.5}
          />
        </mesh>
      ) : null}

      {/* Joint sphere at bone position */}
      {renderMode === "debug" && (
        <mesh>
          <sphereGeometry
            args={[
              boneTransform.length *
                BASE_BONE_RADIUS_RATIO *
                1.2 *
                boneThicknessMultiplier,
              8,
              8,
            ]}
          />
          <meshBasicMaterial color={KOREAN_COLORS.PRIMARY_CYAN} />
        </mesh>
      )}

      {/* Render bone-attached muscles */}
      {renderMode === "solid" && muscleStates && (
        <BoneMuscles
          boneName={bone.name}
          muscleStates={muscleStates}
          isExhausted={isExhausted}
          physicalAttributes={physicalAttributes}
        />
      )}

      {/* Render body surface (skin/flesh layer) - provides continuous humanoid appearance */}
      {renderMode === "solid" && archetype && physicalAttributes && (
        <BodySurface
          boneName={bone.name}
          archetype={archetype}
          cameraDistance={cameraDistance}
          physicalAttributes={{
            muscleMass: physicalAttributes.muscleMass,
            fatMass: physicalAttributes.fatMass,
            shoulderWidth: physicalAttributes.shoulderWidth ?? 45,
            torsoLength: physicalAttributes.torsoLength ?? 59,
            armLength: physicalAttributes.armLength ?? 77,
            legLength: physicalAttributes.legLength ?? 96,
          }}
        />
      )}

      {/* Render bone-attached clothing */}
      {renderMode === "solid" && archetype && physicalAttributes && (
        <BoneClothing
          boneName={bone.name}
          archetype={archetype}
          physicalAttributes={{
            muscleMass: physicalAttributes.muscleMass,
            fatMass: physicalAttributes.fatMass,
            shoulderWidth: physicalAttributes.shoulderWidth ?? 45,
            torsoLength: physicalAttributes.torsoLength ?? 59,
            armLength: physicalAttributes.armLength ?? 77,
            legLength: physicalAttributes.legLength ?? 96,
          }}
        />
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
          muscleStates={muscleStates}
          isExhausted={isExhausted}
          physicalAttributes={physicalAttributes}
          archetype={archetype}
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

      {/* Add feet at foot bones with archetype scaling */}
      {bone.name === "foot_L" && (
        <Foot3D
          side="left"
          skinColor={color}
          scale={boneThicknessMultiplier}
          isHighlighted={false}
        />
      )}
      {bone.name === "foot_R" && (
        <Foot3D
          side="right"
          skinColor={color}
          scale={boneThicknessMultiplier}
          isHighlighted={false}
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
  muscleStates,
  isExhausted = false,
  archetype,
}) => {
  const boneThicknessMultiplier = useMemo(() => {
    if (!physicalAttributes) return 1.0;
    return calculateBoneThickness(
      physicalAttributes.muscleMass,
      physicalAttributes.fatMass,
    );
  }, [physicalAttributes]);

  if (!showBones) {
    return null;
  }

  return (
    <group name="bone-renderer">
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
        muscleStates={muscleStates}
        isExhausted={isExhausted}
        physicalAttributes={physicalAttributes}
        archetype={archetype}
      />
    </group>
  );
};

export default BoneRenderer;
