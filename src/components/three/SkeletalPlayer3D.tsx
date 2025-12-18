/**
 * SkeletalPlayer3D - Skeletal rigged 3D player component
 * 
 * Renders a complete skeletal rig with articulated joints for realistic
 * martial arts animations. Supports keyframe animation with interpolation.
 * 
 * @module components/three/SkeletalPlayer3D
 * @category 3D Components
 * @korean 골격플레이어3D
 */

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../types/constants";
import type { AnimationClip, SkeletalAnimationState, Bone, BoneName } from "../../types/skeletal";
import {
  createHumanoidRig,
  updateBoneWorldMatrices,
  getBoneWorldPosition,
} from "../../systems/animation/SkeletonRig";
import { ANIMATION_CLIPS } from "../../systems/animation/AttackAnimations";

/**
 * Props for SkeletalPlayer3D component
 * 
 * @public
 * @korean 골격플레이어3D속성
 */
export interface SkeletalPlayer3DProps {
  /**
   * Player identifier
   * @korean 플레이어ID
   */
  readonly playerId: string;

  /**
   * Position in 3D space
   * @korean 위치
   */
  readonly position?: [number, number, number];

  /**
   * Y-axis rotation in radians
   * @korean 회전
   */
  readonly rotation?: number;

  /**
   * Current animation name
   * @korean 현재애니메이션
   */
  readonly currentAnimation?: string;

  /**
   * Body color
   * @korean 몸색상
   */
  readonly bodyColor?: number;

  /**
   * Show debug visualization
   * @korean 디버그표시
   */
  readonly showDebug?: boolean;

  /**
   * Whether to show hand geometry
   * @korean 손표시여부
   */
  readonly showHands?: boolean;
}

// Reusable objects for interpolation to avoid allocations (frozen to prevent mutations)
const _defaultEuler: Readonly<THREE.Euler> = Object.freeze(new THREE.Euler(0, 0, 0));
const _defaultVector: Readonly<THREE.Vector3> = Object.freeze(new THREE.Vector3(0, 0, 0));

/**
 * Interpolate between two keyframes
 * 
 * Performance note: Creates new Euler/Vector3 for Map storage (required).
 * Optimized by avoiding unnecessary intermediate allocations.
 * 
 * @param clip - Animation clip with keyframes
 * @param time - Current time in animation
 * @returns Interpolated bone transforms
 * @korean 키프레임보간
 */
const interpolateKeyframes = (
  clip: AnimationClip,
  time: number
): Map<string, { rotation: THREE.Euler; position: THREE.Vector3 }> => {
  const transforms = new Map<string, { rotation: THREE.Euler; position: THREE.Vector3 }>();

  // Find surrounding keyframes
  let prevKeyframe = clip.keyframes[0];
  let nextKeyframe = clip.keyframes[clip.keyframes.length - 1];

  for (let i = 0; i < clip.keyframes.length - 1; i++) {
    if (time >= clip.keyframes[i].time && time <= clip.keyframes[i + 1].time) {
      prevKeyframe = clip.keyframes[i];
      nextKeyframe = clip.keyframes[i + 1];
      break;
    }
  }

  // Calculate interpolation factor
  const duration = nextKeyframe.time - prevKeyframe.time;
  const t = duration > 0 ? (time - prevKeyframe.time) / duration : 0;

  // Collect bone names (reuse array iteration instead of Set)
  const boneNames: string[] = [];
  const seenBones = new Set<string>();
  
  for (const transform of prevKeyframe.transforms) {
    if (!seenBones.has(transform.boneName)) {
      boneNames.push(transform.boneName);
      seenBones.add(transform.boneName);
    }
  }
  
  for (const transform of nextKeyframe.transforms) {
    if (!seenBones.has(transform.boneName)) {
      boneNames.push(transform.boneName);
      seenBones.add(transform.boneName);
    }
  }

  // Interpolate each bone
  for (const boneName of boneNames) {
    const prevTransform = prevKeyframe.transforms.find((t) => t.boneName === boneName);
    const nextTransform = nextKeyframe.transforms.find((t) => t.boneName === boneName);

    // Interpolate rotation (reuse defaults to avoid allocations)
    const prevRot = prevTransform?.rotation ?? _defaultEuler;
    const nextRot = nextTransform?.rotation ?? _defaultEuler;

    // Create new Euler for this bone (required for Map storage)
    const rotation = new THREE.Euler(
      THREE.MathUtils.lerp(prevRot.x, nextRot.x, t),
      THREE.MathUtils.lerp(prevRot.y, nextRot.y, t),
      THREE.MathUtils.lerp(prevRot.z, nextRot.z, t)
    );

    // Interpolate position (create new Vector3 for Map storage)
    const prevPos = prevTransform?.position ?? _defaultVector;
    const nextPos = nextTransform?.position ?? _defaultVector;
    const position = new THREE.Vector3().lerpVectors(prevPos, nextPos, t);

    transforms.set(boneName, { rotation, position });
  }

  return transforms;
};

/**
 * Render a single bone as a capsule mesh
 * 
 * @param bone - Bone to render
 * @param color - Bone color
 * @param showDebug - Show debug visualization
 * @returns Bone mesh JSX
 * @korean 뼈렌더링
 */
const BoneMesh: React.FC<{
  readonly bone: Bone;
  readonly color: number;
  readonly showDebug: boolean;
}> = React.memo(({ bone, color, showDebug }) => {
  const worldPos = getBoneWorldPosition(bone);

  // Calculate bone length and direction to first child
  const hasChild = bone.children.length > 0;
  const length = hasChild ? bone.children[0].position.length() : 0.1;

  // Bone thickness varies by bone type for realistic proportions
  const radius = bone.name.includes("spine") || bone.name === "pelvis" 
    ? 0.15  // Thicker torso/pelvis
    : bone.name.includes("thigh") || bone.name.includes("upper_arm")
    ? 0.10  // Medium limbs
    : bone.name.includes("shin") || bone.name.includes("forearm")
    ? 0.08  // Thinner lower limbs
    : 0.05; // Thin extremities (hands, feet, neck)

  // Calculate rotation to point toward child bone
  const rotation = useMemo<[number, number, number]>(() => {
    if (!hasChild) return [0, 0, 0];
    
    const childPos = bone.children[0].position;
    // Create direction vector pointing to child
    const direction = new THREE.Vector3(childPos.x, childPos.y, childPos.z).normalize();
    
    // Default capsule points along Y axis, rotate to align with direction
    const defaultDirection = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(defaultDirection, direction);
    const euler = new THREE.Euler().setFromQuaternion(quaternion);
    
    return [euler.x, euler.y, euler.z];
  }, [bone, hasChild]);

  // Memoize geometry and material to avoid recreating them
  const geometry = useMemo(
    () => new THREE.CapsuleGeometry(radius, length, 4, 8),
    [radius, length]
  );

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        metalness: 0.3,
        roughness: 0.7,
      }),
    [color]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return (
    <group position={worldPos.toArray()} rotation={rotation}>
      <mesh castShadow receiveShadow geometry={geometry} material={material} />

      {showDebug && (
        <Html center>
          <div
            style={{
              color: "white",
              fontSize: "8px",
              background: "rgba(0,0,0,0.5)",
              padding: "2px",
            }}
          >
            {bone.name}
          </div>
        </Html>
      )}
    </group>
  );
});

/**
 * Render bone hierarchy recursively
 * 
 * @param bone - Root bone to render
 * @param color - Bone color
 * @param showDebug - Show debug visualization
 * @returns Bone hierarchy JSX
 * @korean 뼈계층렌더링
 */
const BoneHierarchy: React.FC<{
  readonly bone: Bone;
  readonly color: number;
  readonly showDebug: boolean;
}> = ({ bone, color, showDebug }) => {
  return (
    <>
      <BoneMesh bone={bone} color={color} showDebug={showDebug} />
      {bone.children.map((child) => (
        <BoneHierarchy
          key={child.name}
          bone={child}
          color={color}
          showDebug={showDebug}
        />
      ))}
    </>
  );
};

/**
 * Simplified hand geometry with 5 fingers
 * 
 * @param side - Left or right hand
 * @param color - Hand color
 * @returns Hand geometry JSX
 * @korean 손기하학
 */
const HandGeometry: React.FC<{
  readonly side: "L" | "R";
  readonly color: number;
  readonly bone: Bone;
}> = ({ side, color, bone }) => {
  const worldPos = getBoneWorldPosition(bone);
  const xOffset = side === "L" ? -0.08 : 0.08;

  // Memoize palm geometry and material to avoid recreating every frame
  const palmGeometry = useMemo(() => new THREE.BoxGeometry(0.06, 0.1, 0.02), []);
  const palmMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color }), [color]);

  // Memoize finger geometry and material to avoid recreating every frame
  const fingerGeometry = useMemo(() => new THREE.CapsuleGeometry(0.005, 0.04, 4, 8), []);
  const fingerMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color }), [color]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      palmGeometry.dispose();
      palmMaterial.dispose();
      fingerGeometry.dispose();
      fingerMaterial.dispose();
    };
  }, [palmGeometry, palmMaterial, fingerGeometry, fingerMaterial]);

  return (
    <group position={worldPos.toArray()}>
      {/* Palm */}
      <mesh 
        castShadow 
        receiveShadow 
        position={[xOffset, 0, 0]}
        geometry={palmGeometry}
        material={palmMaterial}
      />

      {/* Five fingers */}
      {[0, 1, 2, 3, 4].map((fingerIndex) => {
        const fingerOffset = (fingerIndex - 2) * 0.015;
        const fingerX = side === "L" ? xOffset - 0.03 : xOffset + 0.03;
        return (
          <mesh
            key={fingerIndex}
            castShadow
            receiveShadow
            position={[fingerX, 0.06, fingerOffset]}
            geometry={fingerGeometry}
            material={fingerMaterial}
          />
        );
      })}
    </group>
  );
};

/**
 * SkeletalPlayer3D Component
 * 
 * Complete skeletal rig with articulated joints for realistic animations
 * 
 * @example
 * ```tsx
 * <SkeletalPlayer3D
 *   playerId="player1"
 *   position={[0, 0, 0]}
 *   currentAnimation="jab"
 *   bodyColor={KOREAN_COLORS.PRIMARY_CYAN}
 *   showHands={true}
 * />
 * ```
 * 
 * @korean 골격플레이어3D컴포넌트
 */
export const SkeletalPlayer3D: React.FC<SkeletalPlayer3DProps> = ({
  playerId,
  position = [0, 0, 0],
  rotation = 0,
  currentAnimation = "idle",
  bodyColor = KOREAN_COLORS.PRIMARY_CYAN,
  showDebug = false,
  showHands = true,
}) => {
  // Create skeletal rig (memoized) - we need both the rig and bind pose
  const { rig, bindPose } = useMemo(() => {
    const baseRig = createHumanoidRig();
    // Store bind pose positions for each bone
    const pose = new Map<string, THREE.Vector3>();
    baseRig.bones.forEach((bone, name) => {
      pose.set(name, bone.position.clone());
    });
    return { rig: baseRig, bindPose: pose };
  }, []);

  // Animation state
  const animationStateRef = useRef<SkeletalAnimationState>({
    clip: ANIMATION_CLIPS[currentAnimation] ?? ANIMATION_CLIPS.idle,
    currentTime: 0,
    isPlaying: true,
    playbackSpeed: 1.0,
  });

  // Update animation state when currentAnimation changes
  useEffect(() => {
    const newClip = ANIMATION_CLIPS[currentAnimation];
    if (newClip && newClip !== animationStateRef.current.clip) {
      animationStateRef.current = {
        clip: newClip,
        currentTime: 0,
        isPlaying: true,
        playbackSpeed: 1.0,
      };
    }
  }, [currentAnimation]);

  // Animation loop
  useFrame((_, delta) => {
    const state = animationStateRef.current;
    if (!state.clip || !state.isPlaying) return;

    // Update animation time
    state.currentTime += delta * state.playbackSpeed;

    // Loop or clamp
    if (state.clip.loop) {
      state.currentTime = state.currentTime % state.clip.duration;
    } else {
      state.currentTime = Math.min(state.currentTime, state.clip.duration);
    }

    // Interpolate keyframes
    const transforms = interpolateKeyframes(state.clip, state.currentTime);

    // Apply transforms to bones
    transforms.forEach((transform, boneName) => {
      const bone = rig.bones.get(boneName as BoneName);
      if (bone) {
        bone.rotation.copy(transform.rotation);
        // Position offsets: apply relative to bind pose, not accumulate
        if (transform.position.lengthSq() > 0.0001) {
          const bindPos = bindPose.get(boneName);
          if (bindPos) {
            bone.position.copy(bindPos).add(transform.position);
          }
        }
      }
    });

    // Update world matrices
    updateBoneWorldMatrices(rig.root);
  });

  const groupRef = useRef<THREE.Group>(null);

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[0, rotation, 0]}
      scale={[2, 2, 2]}  // Scale up 2x to match Player3DUnified size
      data-testid={`skeletal-player3d-${playerId}`}
    >
      {/* Render bone hierarchy */}
      <BoneHierarchy bone={rig.root} color={bodyColor} showDebug={showDebug} />

      {/* Render hands if enabled */}
      {showHands && (() => {
        const handL = rig.bones.get("hand_L");
        const handR = rig.bones.get("hand_R");
        return handL && handR ? (
          <>
            <HandGeometry side="L" color={bodyColor} bone={handL} />
            <HandGeometry side="R" color={bodyColor} bone={handR} />
          </>
        ) : null;
      })()}
    </group>
  );
};
