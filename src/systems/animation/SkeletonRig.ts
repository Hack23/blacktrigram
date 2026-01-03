/**
 * Skeleton rig implementation for articulated body model
 * 
 * Creates and manages humanoid skeletal rig with 28 bones for realistic
 * martial arts animations. Implements bone hierarchy following Korean martial
 * arts body mechanics.
 * 
 * Now supports dynamic scaling based on player physical attributes for
 * anatomically accurate body proportions per archetype.
 * 
 * @module systems/animation/SkeletonRig
 * @category Animation System
 * @korean 골격시스템
 */

import * as THREE from "three";
import { PhysicalAttributes } from "../../types/common";
import { BoneName } from "../../types/skeletal";
import type {
  Bone,
  SkeletalRig,
  JointConstraint,
  BoneChain,
} from "../../types/skeletal";
import { calculateBoneScalingFactors, calculateShoulderOffset } from "../../utils/skeletonScaling";

/**
 * Create a bone with default rest pose
 * 
 * Helper function to create a bone with position, rotation, and scale.
 * Sets up rest pose for animation blending.
 * 
 * @param name - Unique bone identifier
 * @param parent - Parent bone (null for root)
 * @param position - Local position relative to parent [x, y, z]
 * @param length - Bone length for rendering
 * @returns Newly created bone
 * 
 * @korean 뼈생성
 */
export const createBone = (
  name: string,
  parent: Bone | null,
  position: [number, number, number],
  length = 0.1
): Bone => {
  const pos = new THREE.Vector3(position[0], position[1], position[2]);
  const rot = new THREE.Euler(0, 0, 0);
  const scale = new THREE.Vector3(1, 1, 1);

  const bone: Bone = {
    name,
    parent,
    position: pos.clone(),
    rotation: rot.clone(),
    scale: scale.clone(),
    children: [],
    length,
    restPosition: pos.clone(),
    restRotation: rot.clone(),
  };

  // Add to parent's children
  if (parent) {
    parent.children.push(bone);
  }

  return bone;
};

/**
 * Create complete humanoid skeletal rig
 * 
 * Creates 28-bone humanoid skeleton following Korean martial arts anatomy:
 * - 1 root (pelvis)
 * - 3 spine bones
 * - 2 head bones (neck, head)
 * - 12 arm bones (6 per arm)
 * - 10 leg bones (5 per leg)
 * 
 * Total: 28 bones (under 30 bone limit for 60fps performance)
 * 
 * @returns Complete skeletal rig with bone hierarchy
 * 
 * @example
 * ```typescript
 * const rig = createHumanoidRig();
 * const rightHand = rig.bones.get(BoneName.HAND_R);
 * console.log(`Hand position: ${rightHand?.position}`);
 * ```
 * 
 * @korean 인간형골격생성
 */
export const createHumanoidRig = (): SkeletalRig => {
  // Root (pelvis) - center of mass at hip height
  const root = createBone(BoneName.PELVIS, null, [0, 0.9, 0], 0.15);

  // Spine chain (3 bones)
  const spine1 = createBone(
    BoneName.SPINE_LOWER,
    root,
    [0, 0.15, 0],
    0.2
  );
  const spine2 = createBone(
    BoneName.SPINE_MIDDLE,
    spine1,
    [0, 0.2, 0],
    0.2
  );
  const spine3 = createBone(
    BoneName.SPINE_UPPER,
    spine2,
    [0, 0.2, 0],
    0.2
  );

  // Head chain (2 bones)
  const neck = createBone(BoneName.NECK, spine3, [0, 0.15, 0], 0.1);
  const head = createBone(BoneName.HEAD, neck, [0, 0.2, 0], 0.2);

  // Left arm chain (6 bones)
  const leftShoulder = createBone(
    BoneName.SHOULDER_L,
    spine3,
    [-0.15, 0.1, 0],
    0.1
  );
  const leftUpperArm = createBone(
    BoneName.UPPER_ARM_L,
    leftShoulder,
    [-0.15, 0, 0],
    0.25
  );
  const leftElbow = createBone(
    BoneName.ELBOW_L,
    leftUpperArm,
    [-0.25, 0, 0],
    0.05
  );
  const leftForearm = createBone(
    BoneName.FOREARM_L,
    leftElbow,
    [-0.25, 0, 0],
    0.25
  );
  const leftWrist = createBone(
    BoneName.WRIST_L,
    leftForearm,
    [-0.15, 0, 0],
    0.05
  );
  const leftHand = createBone(
    BoneName.HAND_L,
    leftWrist,
    [-0.08, 0, 0],
    0.08
  );

  // Right arm chain (6 bones - mirror of left)
  const rightShoulder = createBone(
    BoneName.SHOULDER_R,
    spine3,
    [0.15, 0.1, 0],
    0.1
  );
  const rightUpperArm = createBone(
    BoneName.UPPER_ARM_R,
    rightShoulder,
    [0.15, 0, 0],
    0.25
  );
  const rightElbow = createBone(
    BoneName.ELBOW_R,
    rightUpperArm,
    [0.25, 0, 0],
    0.05
  );
  const rightForearm = createBone(
    BoneName.FOREARM_R,
    rightElbow,
    [0.25, 0, 0],
    0.25
  );
  const rightWrist = createBone(
    BoneName.WRIST_R,
    rightForearm,
    [0.15, 0, 0],
    0.05
  );
  const rightHand = createBone(
    BoneName.HAND_R,
    rightWrist,
    [0.08, 0, 0],
    0.08
  );

  // Left leg chain (5 bones)
  const leftHip = createBone(BoneName.HIP_L, root, [-0.1, -0.1, 0], 0.1);
  const leftThigh = createBone(
    BoneName.THIGH_L,
    leftHip,
    [0, -0.3, 0],
    0.3
  );
  const leftKnee = createBone(
    BoneName.KNEE_L,
    leftThigh,
    [0, -0.3, 0],
    0.05
  );
  const leftShin = createBone(
    BoneName.SHIN_L,
    leftKnee,
    [0, -0.3, 0],
    0.3
  );
  const leftFoot = createBone(
    BoneName.FOOT_L,
    leftShin,
    [0, -0.1, 0.1],
    0.15
  );

  // Right leg chain (5 bones - mirror of left)
  const rightHip = createBone(BoneName.HIP_R, root, [0.1, -0.1, 0], 0.1);
  const rightThigh = createBone(
    BoneName.THIGH_R,
    rightHip,
    [0, -0.3, 0],
    0.3
  );
  const rightKnee = createBone(
    BoneName.KNEE_R,
    rightThigh,
    [0, -0.3, 0],
    0.05
  );
  const rightShin = createBone(
    BoneName.SHIN_R,
    rightKnee,
    [0, -0.3, 0],
    0.3
  );
  const rightFoot = createBone(
    BoneName.FOOT_R,
    rightShin,
    [0, -0.1, 0.1],
    0.15
  );

  // Create bone map for fast lookup
  const bones = new Map<string, Bone>([
    [BoneName.PELVIS, root],
    [BoneName.SPINE_LOWER, spine1],
    [BoneName.SPINE_MIDDLE, spine2],
    [BoneName.SPINE_UPPER, spine3],
    [BoneName.NECK, neck],
    [BoneName.HEAD, head],
    [BoneName.SHOULDER_L, leftShoulder],
    [BoneName.UPPER_ARM_L, leftUpperArm],
    [BoneName.ELBOW_L, leftElbow],
    [BoneName.FOREARM_L, leftForearm],
    [BoneName.WRIST_L, leftWrist],
    [BoneName.HAND_L, leftHand],
    [BoneName.SHOULDER_R, rightShoulder],
    [BoneName.UPPER_ARM_R, rightUpperArm],
    [BoneName.ELBOW_R, rightElbow],
    [BoneName.FOREARM_R, rightForearm],
    [BoneName.WRIST_R, rightWrist],
    [BoneName.HAND_R, rightHand],
    [BoneName.HIP_L, leftHip],
    [BoneName.THIGH_L, leftThigh],
    [BoneName.KNEE_L, leftKnee],
    [BoneName.SHIN_L, leftShin],
    [BoneName.FOOT_L, leftFoot],
    [BoneName.HIP_R, rightHip],
    [BoneName.THIGH_R, rightThigh],
    [BoneName.KNEE_R, rightKnee],
    [BoneName.SHIN_R, rightShin],
    [BoneName.FOOT_R, rightFoot],
  ]);

  return {
    root,
    bones,
    boneCount: bones.size,
  };
};

/**
 * Create humanoid rig with dynamic scaling based on physical attributes.
 * 
 * **Korean**: 신체 속성 기반 골격 생성 (Physical Attributes-Based Skeleton Creation)
 * 
 * Creates a 28-bone humanoid skeleton with bone lengths scaled according to
 * the fighter's physical attributes. This allows each archetype to have
 * anatomically accurate body proportions that affect combat hitboxes, vital
 * point positioning, and visual representation.
 * 
 * @param attributes - Physical attributes to scale the skeleton
 * @returns Complete skeletal rig with scaled bone dimensions
 * 
 * @example
 * ```typescript
 * import { AMSALJA_PHYSICAL } from "@/data/archetypePhysicalAttributes";
 * 
 * // Create skeleton for lean assassin archetype
 * const amsaljaRig = createScaledHumanoidRig(AMSALJA_PHYSICAL);
 * // Results in taller skeleton with longer limbs, narrower shoulders
 * 
 * // Create skeleton for heavy brawler archetype
 * const jojikRig = createScaledHumanoidRig(JOJIK_PHYSICAL);
 * // Results in stockier skeleton with wider shoulders, thicker torso
 * ```
 * 
 * @public
 * @korean 크기조정된인간형골격생성
 */
export const createScaledHumanoidRig = (
  attributes: PhysicalAttributes
): SkeletalRig => {
  // Calculate scaling factors from physical attributes
  const factors = calculateBoneScalingFactors(attributes);
  const shoulderOffset = calculateShoulderOffset(attributes);
  
  // Convert shoulder offset from cm to meters for Three.js
  const shoulderOffsetMeters = shoulderOffset / 100;
  
  // Root (pelvis) - center of mass at hip height
  // Scale pelvis height by overall factor
  const root = createBone(
    BoneName.PELVIS, 
    null, 
    [0, 0.9 * factors.overall, 0], 
    0.15 * factors.overall
  );

  // Spine chain (3 bones) - scaled by torso length
  const spine1 = createBone(
    BoneName.SPINE_LOWER,
    root,
    [0, 0.15 * factors.spine, 0],
    0.2 * factors.spine
  );
  const spine2 = createBone(
    BoneName.SPINE_MIDDLE,
    spine1,
    [0, 0.2 * factors.spine, 0],
    0.2 * factors.spine
  );
  const spine3 = createBone(
    BoneName.SPINE_UPPER,
    spine2,
    [0, 0.2 * factors.spine, 0],
    0.2 * factors.spine
  );

  // Head chain (2 bones) - scaled by neck/head dimensions
  const neck = createBone(
    BoneName.NECK, 
    spine3, 
    [0, 0.15 * factors.neck, 0], 
    0.1 * factors.neck
  );
  const head = createBone(
    BoneName.HEAD, 
    neck, 
    [0, 0.2 * factors.head, 0], 
    0.2 * factors.head
  );

  // Left arm chain (6 bones) - scaled by arm length and shoulder width
  const leftShoulder = createBone(
    BoneName.SHOULDER_L,
    spine3,
    [-shoulderOffsetMeters, 0.1 * factors.spine, 0],
    0.1 * factors.shoulder
  );
  const leftUpperArm = createBone(
    BoneName.UPPER_ARM_L,
    leftShoulder,
    [-0.15 * factors.shoulder, 0, 0],
    0.25 * factors.upperArm
  );
  const leftElbow = createBone(
    BoneName.ELBOW_L,
    leftUpperArm,
    [-0.25 * factors.upperArm, 0, 0],
    0.05 * factors.upperArm
  );
  const leftForearm = createBone(
    BoneName.FOREARM_L,
    leftElbow,
    [-0.25 * factors.forearm, 0, 0],
    0.25 * factors.forearm
  );
  const leftWrist = createBone(
    BoneName.WRIST_L,
    leftForearm,
    [-0.15 * factors.forearm, 0, 0],
    0.05 * factors.forearm
  );
  const leftHand = createBone(
    BoneName.HAND_L,
    leftWrist,
    [-0.08 * factors.overall, 0, 0],
    0.08 * factors.overall
  );

  // Right arm chain (6 bones - mirror of left)
  const rightShoulder = createBone(
    BoneName.SHOULDER_R,
    spine3,
    [shoulderOffsetMeters, 0.1 * factors.spine, 0],
    0.1 * factors.shoulder
  );
  const rightUpperArm = createBone(
    BoneName.UPPER_ARM_R,
    rightShoulder,
    [0.15 * factors.shoulder, 0, 0],
    0.25 * factors.upperArm
  );
  const rightElbow = createBone(
    BoneName.ELBOW_R,
    rightUpperArm,
    [0.25 * factors.upperArm, 0, 0],
    0.05 * factors.upperArm
  );
  const rightForearm = createBone(
    BoneName.FOREARM_R,
    rightElbow,
    [0.25 * factors.forearm, 0, 0],
    0.25 * factors.forearm
  );
  const rightWrist = createBone(
    BoneName.WRIST_R,
    rightForearm,
    [0.15 * factors.forearm, 0, 0],
    0.05 * factors.forearm
  );
  const rightHand = createBone(
    BoneName.HAND_R,
    rightWrist,
    [0.08 * factors.overall, 0, 0],
    0.08 * factors.overall
  );

  // Left leg chain (5 bones) - scaled by leg length
  const leftHip = createBone(
    BoneName.HIP_L, 
    root, 
    [-0.1 * factors.overall, -0.1 * factors.overall, 0], 
    0.1 * factors.overall
  );
  const leftThigh = createBone(
    BoneName.THIGH_L,
    leftHip,
    [0, -0.3 * factors.thigh, 0],
    0.3 * factors.thigh
  );
  const leftKnee = createBone(
    BoneName.KNEE_L,
    leftThigh,
    [0, -0.3 * factors.thigh, 0],
    0.05 * factors.thigh
  );
  const leftShin = createBone(
    BoneName.SHIN_L,
    leftKnee,
    [0, -0.3 * factors.shin, 0],
    0.3 * factors.shin
  );
  const leftFoot = createBone(
    BoneName.FOOT_L,
    leftShin,
    [0, -0.1 * factors.overall, 0.1 * factors.overall],
    0.15 * factors.overall
  );

  // Right leg chain (5 bones - mirror of left)
  const rightHip = createBone(
    BoneName.HIP_R, 
    root, 
    [0.1 * factors.overall, -0.1 * factors.overall, 0], 
    0.1 * factors.overall
  );
  const rightThigh = createBone(
    BoneName.THIGH_R,
    rightHip,
    [0, -0.3 * factors.thigh, 0],
    0.3 * factors.thigh
  );
  const rightKnee = createBone(
    BoneName.KNEE_R,
    rightThigh,
    [0, -0.3 * factors.thigh, 0],
    0.05 * factors.thigh
  );
  const rightShin = createBone(
    BoneName.SHIN_R,
    rightKnee,
    [0, -0.3 * factors.shin, 0],
    0.3 * factors.shin
  );
  const rightFoot = createBone(
    BoneName.FOOT_R,
    rightShin,
    [0, -0.1 * factors.overall, 0.1 * factors.overall],
    0.15 * factors.overall
  );

  // Create bone map for fast lookup
  const bones = new Map<string, Bone>([
    [BoneName.PELVIS, root],
    [BoneName.SPINE_LOWER, spine1],
    [BoneName.SPINE_MIDDLE, spine2],
    [BoneName.SPINE_UPPER, spine3],
    [BoneName.NECK, neck],
    [BoneName.HEAD, head],
    [BoneName.SHOULDER_L, leftShoulder],
    [BoneName.UPPER_ARM_L, leftUpperArm],
    [BoneName.ELBOW_L, leftElbow],
    [BoneName.FOREARM_L, leftForearm],
    [BoneName.WRIST_L, leftWrist],
    [BoneName.HAND_L, leftHand],
    [BoneName.SHOULDER_R, rightShoulder],
    [BoneName.UPPER_ARM_R, rightUpperArm],
    [BoneName.ELBOW_R, rightElbow],
    [BoneName.FOREARM_R, rightForearm],
    [BoneName.WRIST_R, rightWrist],
    [BoneName.HAND_R, rightHand],
    [BoneName.HIP_L, leftHip],
    [BoneName.THIGH_L, leftThigh],
    [BoneName.KNEE_L, leftKnee],
    [BoneName.SHIN_L, leftShin],
    [BoneName.FOOT_L, leftFoot],
    [BoneName.HIP_R, rightHip],
    [BoneName.THIGH_R, rightThigh],
    [BoneName.KNEE_R, rightKnee],
    [BoneName.SHIN_R, rightShin],
    [BoneName.FOOT_R, rightFoot],
  ]);

  return {
    root,
    bones,
    boneCount: bones.size,
  };
};

/**
 * Joint constraints for anatomically correct movement
 * 
 * Defines rotation limits for each joint to prevent unrealistic poses.
 * Based on human anatomy and Korean martial arts biomechanics.
 * 
 * @korean 관절제약조건들
 */
export const JOINT_CONSTRAINTS: JointConstraint[] = [
  // Elbow joints - can only bend one direction
  {
    boneName: BoneName.ELBOW_L,
    minRotation: new THREE.Vector3(0, 0, -2.4), // ~-137 degrees
    maxRotation: new THREE.Vector3(0, 0, 0),
    canTwist: false,
  },
  {
    boneName: BoneName.ELBOW_R,
    minRotation: new THREE.Vector3(0, 0, 0),
    maxRotation: new THREE.Vector3(0, 0, 2.4), // ~137 degrees
    canTwist: false,
  },

  // Knee joints - can only bend backward
  {
    boneName: BoneName.KNEE_L,
    minRotation: new THREE.Vector3(-2.4, 0, 0), // ~-137 degrees
    maxRotation: new THREE.Vector3(0, 0, 0),
    canTwist: false,
  },
  {
    boneName: BoneName.KNEE_R,
    minRotation: new THREE.Vector3(-2.4, 0, 0), // ~-137 degrees
    maxRotation: new THREE.Vector3(0, 0, 0),
    canTwist: false,
  },

  // Shoulder joints - full range of motion
  {
    boneName: BoneName.SHOULDER_L,
    minRotation: new THREE.Vector3(-1.5, -1.5, -3.0),
    maxRotation: new THREE.Vector3(1.5, 1.5, 3.0),
    canTwist: true,
  },
  {
    boneName: BoneName.SHOULDER_R,
    minRotation: new THREE.Vector3(-1.5, -1.5, -3.0),
    maxRotation: new THREE.Vector3(1.5, 1.5, 3.0),
    canTwist: true,
  },

  // Hip joints - large range for kicks
  {
    boneName: BoneName.HIP_L,
    minRotation: new THREE.Vector3(-1.8, -0.8, -1.5),
    maxRotation: new THREE.Vector3(1.8, 0.8, 1.5),
    canTwist: true,
  },
  {
    boneName: BoneName.HIP_R,
    minRotation: new THREE.Vector3(-1.8, -0.8, -1.5),
    maxRotation: new THREE.Vector3(1.8, 0.8, 1.5),
    canTwist: true,
  },

  // Neck - moderate range
  {
    boneName: BoneName.NECK,
    minRotation: new THREE.Vector3(-0.5, -0.8, -0.5),
    maxRotation: new THREE.Vector3(0.5, 0.8, 0.5),
    canTwist: true,
  },

  // Spine bones - limited rotation for realism
  {
    boneName: BoneName.SPINE_LOWER,
    minRotation: new THREE.Vector3(-0.3, -0.5, -0.3),
    maxRotation: new THREE.Vector3(0.3, 0.5, 0.3),
    canTwist: true,
  },
  {
    boneName: BoneName.SPINE_MIDDLE,
    minRotation: new THREE.Vector3(-0.3, -0.5, -0.3),
    maxRotation: new THREE.Vector3(0.3, 0.5, 0.3),
    canTwist: true,
  },
  {
    boneName: BoneName.SPINE_UPPER,
    minRotation: new THREE.Vector3(-0.3, -0.5, -0.3),
    maxRotation: new THREE.Vector3(0.3, 0.5, 0.3),
    canTwist: true,
  },
];

/**
 * Bone chains for IK (Inverse Kinematics)
 * 
 * Defines logical bone chains for limbs, used for IK solving
 * and animation retargeting.
 * 
 * @korean 뼈체인들
 */
export const BONE_CHAINS: BoneChain[] = [
  // Left arm chain
  {
    name: "left_arm",
    startBone: BoneName.SHOULDER_L,
    endBone: BoneName.HAND_L,
    bones: [
      BoneName.SHOULDER_L,
      BoneName.UPPER_ARM_L,
      BoneName.ELBOW_L,
      BoneName.FOREARM_L,
      BoneName.WRIST_L,
      BoneName.HAND_L,
    ],
  },

  // Right arm chain
  {
    name: "right_arm",
    startBone: BoneName.SHOULDER_R,
    endBone: BoneName.HAND_R,
    bones: [
      BoneName.SHOULDER_R,
      BoneName.UPPER_ARM_R,
      BoneName.ELBOW_R,
      BoneName.FOREARM_R,
      BoneName.WRIST_R,
      BoneName.HAND_R,
    ],
  },

  // Left leg chain
  {
    name: "left_leg",
    startBone: BoneName.HIP_L,
    endBone: BoneName.FOOT_L,
    bones: [
      BoneName.HIP_L,
      BoneName.THIGH_L,
      BoneName.KNEE_L,
      BoneName.SHIN_L,
      BoneName.FOOT_L,
    ],
  },

  // Right leg chain
  {
    name: "right_leg",
    startBone: BoneName.HIP_R,
    endBone: BoneName.FOOT_R,
    bones: [
      BoneName.HIP_R,
      BoneName.THIGH_R,
      BoneName.KNEE_R,
      BoneName.SHIN_R,
      BoneName.FOOT_R,
    ],
  },

  // Spine chain
  {
    name: "spine",
    startBone: BoneName.PELVIS,
    endBone: BoneName.HEAD,
    bones: [
      BoneName.PELVIS,
      BoneName.SPINE_LOWER,
      BoneName.SPINE_MIDDLE,
      BoneName.SPINE_UPPER,
      BoneName.NECK,
      BoneName.HEAD,
    ],
  },
];

/**
 * Apply joint constraints to bone rotation
 * 
 * Clamps bone rotation to anatomically correct ranges.
 * Prevents unrealistic poses like backward-bending elbows.
 * 
 * @param bone - Bone to constrain
 * @param constraints - Joint constraint to apply
 * 
 * @korean 관절제약적용
 */
export const applyJointConstraint = (
  bone: Bone,
  constraint: JointConstraint
): void => {
  // Clamp X rotation
  bone.rotation.x = Math.max(
    constraint.minRotation.x,
    Math.min(constraint.maxRotation.x, bone.rotation.x)
  );

  // Clamp Y rotation
  bone.rotation.y = Math.max(
    constraint.minRotation.y,
    Math.min(constraint.maxRotation.y, bone.rotation.y)
  );

  // Clamp Z rotation
  bone.rotation.z = Math.max(
    constraint.minRotation.z,
    Math.min(constraint.maxRotation.z, bone.rotation.z)
  );
};

/**
 * Get world position of bone
 * 
 * Calculates absolute world position by traversing parent chain.
 * Accounts for parent rotations and positions.
 * 
 * @param bone - Bone to get world position for
 * @returns World position as Vector3
 * 
 * @korean 뼈의세계위치구하기
 */
export const getBoneWorldPosition = (bone: Bone): THREE.Vector3 => {
  const worldPos = new THREE.Vector3();
  let currentBone: Bone | null = bone;

  // Traverse up parent chain
  while (currentBone) {
    worldPos.add(currentBone.position);
    currentBone = currentBone.parent;
  }

  return worldPos;
};

/**
 * Get world rotation of bone
 * 
 * Calculates absolute world rotation by traversing parent chain.
 * Combines all parent rotations.
 * 
 * @param bone - Bone to get world rotation for
 * @returns World rotation as Euler
 * 
 * @korean 뼈의세계회전구하기
 */
export const getBoneWorldRotation = (bone: Bone): THREE.Euler => {
  const worldRot = new THREE.Euler();
  let currentBone: Bone | null = bone;

  // Traverse up parent chain
  while (currentBone) {
    worldRot.x += currentBone.rotation.x;
    worldRot.y += currentBone.rotation.y;
    worldRot.z += currentBone.rotation.z;
    currentBone = currentBone.parent;
  }

  return worldRot;
};

/**
 * Reset bone to rest pose
 * 
 * Resets bone position and rotation to default rest pose.
 * Useful for animation blending and initialization.
 * 
 * @param bone - Bone to reset
 * 
 * @korean 뼈를기본자세로초기화
 */
export const resetBoneToRestPose = (bone: Bone): void => {
  bone.position.copy(bone.restPosition);
  bone.rotation.copy(bone.restRotation);
  bone.scale.set(1, 1, 1);
};

/**
 * Reset entire rig to rest pose
 * 
 * Resets all bones in rig to rest pose.
 * 
 * @param rig - Skeletal rig to reset
 * 
 * @korean 골격을기본자세로초기화
 */
export const resetRigToRestPose = (rig: SkeletalRig): void => {
  rig.bones.forEach((bone) => {
    resetBoneToRestPose(bone);
  });
};

/**
 * Create hand bones with 5 fingers
 * 
 * Creates detailed hand structure with 5 fingers (thumb, index, middle, ring, pinky),
 * attached to an existing hand/palm bone.
 * Each finger has 3-4 bones for realistic animation.
 * 
 * Finger bone structure:
 * - Thumb: 3 bones (metacarpal, proximal, distal) - no intermediate
 * - Other fingers: 4 bones (metacarpal, proximal, intermediate, distal)
 * 
 * Total created by this function: 19 finger bones per hand (3 thumb + 4*4 other fingers),
 * all attached to the provided hand bone.
 * 
 * @param handBone - Parent hand bone (acts as the palm/root for finger bones)
 * @param side - Hand side ("left" or "right")
 * @returns Map of finger bones added to the rig
 * 
 * @korean 손뼈생성
 */
export const createHandBones = (
  handBone: Bone,
  side: "left" | "right"
): Map<string, Bone> => {
  const fingerBones = new Map<string, Bone>();
  
  // Hand orientation: left hand extends to -X, right hand extends to +X
  const sideMultiplier = side === "left" ? -1 : 1;
  
  // Thumb (3 bones) - offset slightly toward palm center and forward
  const thumbMeta = createBone(
    `${BoneName[`THUMB_META_${side.toUpperCase()[0]}` as keyof typeof BoneName]}`,
    handBone,
    [0.015 * sideMultiplier, 0.02, 0.01],
    0.025
  );
  const thumbProx = createBone(
    `${BoneName[`THUMB_PROX_${side.toUpperCase()[0]}` as keyof typeof BoneName]}`,
    thumbMeta,
    [0.015 * sideMultiplier, 0.015, 0.01],
    0.02
  );
  const thumbDist = createBone(
    `${BoneName[`THUMB_DIST_${side.toUpperCase()[0]}` as keyof typeof BoneName]}`,
    thumbProx,
    [0.01 * sideMultiplier, 0.01, 0],
    0.015
  );
  
  fingerBones.set(thumbMeta.name, thumbMeta);
  fingerBones.set(thumbProx.name, thumbProx);
  fingerBones.set(thumbDist.name, thumbDist);
  
  // Index finger (4 bones)
  const indexMeta = createBone(
    `${BoneName[`INDEX_META_${side.toUpperCase()[0]}` as keyof typeof BoneName]}`,
    handBone,
    [0.015 * sideMultiplier, 0.06, 0],
    0.03
  );
  const indexProx = createBone(
    `${BoneName[`INDEX_PROX_${side.toUpperCase()[0]}` as keyof typeof BoneName]}`,
    indexMeta,
    [0, 0.025, 0],
    0.025
  );
  const indexInter = createBone(
    `${BoneName[`INDEX_INTER_${side.toUpperCase()[0]}` as keyof typeof BoneName]}`,
    indexProx,
    [0, 0.02, 0],
    0.02
  );
  const indexDist = createBone(
    `${BoneName[`INDEX_DIST_${side.toUpperCase()[0]}` as keyof typeof BoneName]}`,
    indexInter,
    [0, 0.015, 0],
    0.015
  );
  
  fingerBones.set(indexMeta.name, indexMeta);
  fingerBones.set(indexProx.name, indexProx);
  fingerBones.set(indexInter.name, indexInter);
  fingerBones.set(indexDist.name, indexDist);
  
  // Middle finger (4 bones) - longest finger
  const middleMeta = createBone(
    `${BoneName[`MIDDLE_META_${side.toUpperCase()[0]}` as keyof typeof BoneName]}`,
    handBone,
    [0.005 * sideMultiplier, 0.065, 0],
    0.035
  );
  const middleProx = createBone(
    `${BoneName[`MIDDLE_PROX_${side.toUpperCase()[0]}` as keyof typeof BoneName]}`,
    middleMeta,
    [0, 0.03, 0],
    0.03
  );
  const middleInter = createBone(
    `${BoneName[`MIDDLE_INTER_${side.toUpperCase()[0]}` as keyof typeof BoneName]}`,
    middleProx,
    [0, 0.025, 0],
    0.025
  );
  const middleDist = createBone(
    `${BoneName[`MIDDLE_DIST_${side.toUpperCase()[0]}` as keyof typeof BoneName]}`,
    middleInter,
    [0, 0.02, 0],
    0.02
  );
  
  fingerBones.set(middleMeta.name, middleMeta);
  fingerBones.set(middleProx.name, middleProx);
  fingerBones.set(middleInter.name, middleInter);
  fingerBones.set(middleDist.name, middleDist);
  
  // Ring finger (4 bones)
  const ringMeta = createBone(
    `${BoneName[`RING_META_${side.toUpperCase()[0]}` as keyof typeof BoneName]}`,
    handBone,
    [-0.005 * sideMultiplier, 0.06, 0],
    0.03
  );
  const ringProx = createBone(
    `${BoneName[`RING_PROX_${side.toUpperCase()[0]}` as keyof typeof BoneName]}`,
    ringMeta,
    [0, 0.025, 0],
    0.025
  );
  const ringInter = createBone(
    `${BoneName[`RING_INTER_${side.toUpperCase()[0]}` as keyof typeof BoneName]}`,
    ringProx,
    [0, 0.02, 0],
    0.02
  );
  const ringDist = createBone(
    `${BoneName[`RING_DIST_${side.toUpperCase()[0]}` as keyof typeof BoneName]}`,
    ringInter,
    [0, 0.015, 0],
    0.015
  );
  
  fingerBones.set(ringMeta.name, ringMeta);
  fingerBones.set(ringProx.name, ringProx);
  fingerBones.set(ringInter.name, ringInter);
  fingerBones.set(ringDist.name, ringDist);
  
  // Pinky finger (4 bones) - shortest finger
  const pinkyMeta = createBone(
    `${BoneName[`PINKY_META_${side.toUpperCase()[0]}` as keyof typeof BoneName]}`,
    handBone,
    [-0.015 * sideMultiplier, 0.05, 0],
    0.025
  );
  const pinkyProx = createBone(
    `${BoneName[`PINKY_PROX_${side.toUpperCase()[0]}` as keyof typeof BoneName]}`,
    pinkyMeta,
    [0, 0.02, 0],
    0.02
  );
  const pinkyInter = createBone(
    `${BoneName[`PINKY_INTER_${side.toUpperCase()[0]}` as keyof typeof BoneName]}`,
    pinkyProx,
    [0, 0.015, 0],
    0.015
  );
  const pinkyDist = createBone(
    `${BoneName[`PINKY_DIST_${side.toUpperCase()[0]}` as keyof typeof BoneName]}`,
    pinkyInter,
    [0, 0.01, 0],
    0.01
  );
  
  fingerBones.set(pinkyMeta.name, pinkyMeta);
  fingerBones.set(pinkyProx.name, pinkyProx);
  fingerBones.set(pinkyInter.name, pinkyInter);
  fingerBones.set(pinkyDist.name, pinkyDist);
  
  return fingerBones;
};

/**
 * Create humanoid rig with optional hand bones
 * 
 * Creates complete skeletal rig with optional detailed hand bones.
 * Hand bones can be excluded for performance (LOD system).
 * 
 * @param includeHandBones - Whether to include detailed hand bones (default: false)
 * @returns Complete skeletal rig with or without hand bones
 * 
 * @korean 손뼈포함골격생성
 */
export const createHumanoidRigWithHands = (
  includeHandBones: boolean = false
): SkeletalRig => {
  // Create base rig
  const baseRig = createHumanoidRig();
  
  // If hand bones not requested, return base rig
  if (!includeHandBones) {
    return baseRig;
  }
  
  // Get hand bones from base rig
  const leftHand = baseRig.bones.get(BoneName.HAND_L);
  const rightHand = baseRig.bones.get(BoneName.HAND_R);
  
  if (!leftHand || !rightHand) {
    console.warn("Hand bones not found in base rig");
    return baseRig;
  }
  
  // Create finger bones
  const leftFingerBones = createHandBones(leftHand, "left");
  const rightFingerBones = createHandBones(rightHand, "right");
  
  // Add finger bones to rig bone map
  leftFingerBones.forEach((bone, name) => {
    baseRig.bones.set(name, bone);
  });
  rightFingerBones.forEach((bone, name) => {
    baseRig.bones.set(name, bone);
  });
  
  return {
    ...baseRig,
    boneCount: baseRig.bones.size,
  };
};
