/**
 * Skeletal rig creation and management for Black Trigram
 * 
 * Provides factory functions for creating humanoid skeletal rigs with
 * proper bone hierarchy, joint articulation, and transformation utilities.
 * 
 * Maximum 30 bones per rig for 60fps performance target.
 * 
 * @module systems/animation/SkeletonRig
 * @category Animation
 * @korean 골격구조시스템
 */

import * as THREE from "three";
import type { Bone, BoneName, SkeletalRig } from "../../types/skeletal";

/**
 * Create a bone with local transform
 * 
 * @param name - Bone identifier
 * @param parent - Parent bone (null for root)
 * @param localPosition - Position relative to parent
 * @returns New bone instance
 * @korean 뼈생성
 */
export const createBone = (
  name: BoneName,
  parent: Bone | null,
  localPosition: [number, number, number]
): Bone => {
  const bone: Bone = {
    name,
    parent,
    position: new THREE.Vector3(...localPosition),
    rotation: new THREE.Euler(0, 0, 0),
    scale: new THREE.Vector3(1, 1, 1),
    children: [],
    worldMatrix: new THREE.Matrix4(),
  };

  // Add to parent's children
  if (parent) {
    (parent.children as Bone[]).push(bone);
  }

  return bone;
};

/**
 * Create complete humanoid skeletal rig
 * 
 * Creates a 30-bone humanoid rig with:
 * - Root: pelvis (center of mass)
 * - Spine: 3 segments (lower, middle, upper)
 * - Head: neck + head
 * - Arms: shoulder → upper arm → elbow → forearm → wrist → hand (x2)
 * - Legs: hip → thigh → knee → shin → ankle → foot (x2)
 * 
 * All positions are in meters, Y-up coordinate system.
 * 
 * @returns Complete skeletal rig with bone hierarchy
 * @korean 휴머노이드골격생성
 */
export const createHumanoidRig = (): SkeletalRig => {
  // Root bone (pelvis/center of mass)
  const pelvis = createBone("pelvis", null, [0, 0.9, 0]);

  // Spine chain (3 segments)
  const spineLower = createBone("spine_lower", pelvis, [0, 0.15, 0]);
  const spineMiddle = createBone("spine_middle", spineLower, [0, 0.2, 0]);
  const spineUpper = createBone("spine_upper", spineMiddle, [0, 0.2, 0]);

  // Head chain
  const neck = createBone("neck", spineUpper, [0, 0.15, 0]);
  const head = createBone("head", neck, [0, 0.2, 0]);

  // Left arm chain
  const shoulderL = createBone("shoulder_L", spineUpper, [-0.15, 0.1, 0]);
  const upperArmL = createBone("upper_arm_L", shoulderL, [-0.15, 0, 0]);
  const elbowL = createBone("elbow_L", upperArmL, [-0.25, 0, 0]);
  const forearmL = createBone("forearm_L", elbowL, [-0.25, 0, 0]);
  const wristL = createBone("wrist_L", forearmL, [-0.15, 0, 0]);
  const handL = createBone("hand_L", wristL, [-0.08, 0, 0]);

  // Right arm chain (mirror of left)
  const shoulderR = createBone("shoulder_R", spineUpper, [0.15, 0.1, 0]);
  const upperArmR = createBone("upper_arm_R", shoulderR, [0.15, 0, 0]);
  const elbowR = createBone("elbow_R", upperArmR, [0.25, 0, 0]);
  const forearmR = createBone("forearm_R", elbowR, [0.25, 0, 0]);
  const wristR = createBone("wrist_R", forearmR, [0.15, 0, 0]);
  const handR = createBone("hand_R", wristR, [0.08, 0, 0]);

  // Left leg chain
  const hipL = createBone("hip_L", pelvis, [-0.1, -0.1, 0]);
  const thighL = createBone("thigh_L", hipL, [0, -0.3, 0]);
  const kneeL = createBone("knee_L", thighL, [0, -0.3, 0]);
  const shinL = createBone("shin_L", kneeL, [0, -0.3, 0]);
  const ankleL = createBone("ankle_L", shinL, [0, -0.1, 0]);
  const footL = createBone("foot_L", ankleL, [0, 0, 0.1]);

  // Right leg chain (mirror of left)
  const hipR = createBone("hip_R", pelvis, [0.1, -0.1, 0]);
  const thighR = createBone("thigh_R", hipR, [0, -0.3, 0]);
  const kneeR = createBone("knee_R", thighR, [0, -0.3, 0]);
  const shinR = createBone("shin_R", kneeR, [0, -0.3, 0]);
  const ankleR = createBone("ankle_R", shinR, [0, -0.1, 0]);
  const footR = createBone("foot_R", ankleR, [0, 0, 0.1]);

  // Create bone lookup map
  const bones = new Map<BoneName, Bone>([
    ["pelvis", pelvis],
    ["spine_lower", spineLower],
    ["spine_middle", spineMiddle],
    ["spine_upper", spineUpper],
    ["neck", neck],
    ["head", head],
    ["shoulder_L", shoulderL],
    ["upper_arm_L", upperArmL],
    ["elbow_L", elbowL],
    ["forearm_L", forearmL],
    ["wrist_L", wristL],
    ["hand_L", handL],
    ["shoulder_R", shoulderR],
    ["upper_arm_R", upperArmR],
    ["elbow_R", elbowR],
    ["forearm_R", forearmR],
    ["wrist_R", wristR],
    ["hand_R", handR],
    ["hip_L", hipL],
    ["thigh_L", thighL],
    ["knee_L", kneeL],
    ["shin_L", shinL],
    ["ankle_L", ankleL],
    ["foot_L", footL],
    ["hip_R", hipR],
    ["thigh_R", thighR],
    ["knee_R", kneeR],
    ["shin_R", shinR],
    ["ankle_R", ankleR],
    ["foot_R", footR],
  ]);

  return {
    root: pelvis,
    bones,
  };
};

/**
 * Update world matrices for entire bone hierarchy
 * 
 * Recursively computes world-space transformations from local
 * bone transforms. Should be called after bone transforms are updated.
 * 
 * @param bone - Root bone to start update from
 * @param parentWorldMatrix - Parent's world matrix (identity for root)
 * @korean 월드행렬업데이트
 */
export const updateBoneWorldMatrices = (
  bone: Bone,
  parentWorldMatrix: THREE.Matrix4 = new THREE.Matrix4()
): void => {
  // Compute local transform matrix
  const localMatrix = new THREE.Matrix4();
  localMatrix.compose(bone.position, new THREE.Quaternion().setFromEuler(bone.rotation), bone.scale);

  // Compute world matrix: parent * local
  bone.worldMatrix.multiplyMatrices(parentWorldMatrix, localMatrix);

  // Recursively update children
  for (const child of bone.children) {
    updateBoneWorldMatrices(child, bone.worldMatrix);
  }
};

/**
 * Get world position of a bone
 * 
 * @param bone - Target bone
 * @returns World-space position
 * @korean 뼈월드위치
 */
export const getBoneWorldPosition = (bone: Bone): THREE.Vector3 => {
  const position = new THREE.Vector3();
  position.setFromMatrixPosition(bone.worldMatrix);
  return position;
};

/**
 * Get world rotation of a bone
 * 
 * @param bone - Target bone
 * @returns World-space rotation as Euler angles
 * @korean 뼈월드회전
 */
export const getBoneWorldRotation = (bone: Bone): THREE.Euler => {
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  const position = new THREE.Vector3();
  bone.worldMatrix.decompose(position, quaternion, scale);
  return new THREE.Euler().setFromQuaternion(quaternion);
};

/**
 * Reset bone to bind pose (identity transform)
 * 
 * @param bone - Bone to reset
 * @korean 뼈리셋
 */
export const resetBone = (bone: Bone): void => {
  bone.rotation.set(0, 0, 0);
  // Keep position and scale as they define the rig structure
};

/**
 * Reset entire rig to bind pose
 * 
 * @param rig - Skeletal rig to reset
 * @korean 골격리셋
 */
export const resetRigToBind = (rig: SkeletalRig): void => {
  const resetRecursive = (bone: Bone): void => {
    resetBone(bone);
    for (const child of bone.children) {
      resetRecursive(child);
    }
  };
  resetRecursive(rig.root);
};

/**
 * Clone a skeletal rig for independent animation
 * 
 * Creates a deep copy of the rig with new bone instances
 * 
 * @param rig - Source rig to clone
 * @returns New independent rig instance
 * @korean 골격복제
 */
export const cloneRig = (rig: SkeletalRig): SkeletalRig => {
  const boneMap = new Map<Bone, Bone>();

  const cloneBoneRecursive = (sourceBone: Bone, parent: Bone | null): Bone => {
    const clonedBone: Bone = {
      name: sourceBone.name,
      parent,
      position: sourceBone.position.clone(),
      rotation: sourceBone.rotation.clone(),
      scale: sourceBone.scale.clone(),
      children: [],
      worldMatrix: sourceBone.worldMatrix.clone(),
    };

    boneMap.set(sourceBone, clonedBone);

    // Clone children
    for (const child of sourceBone.children) {
      const clonedChild = cloneBoneRecursive(child, clonedBone);
      (clonedBone.children as Bone[]).push(clonedChild);
    }

    return clonedBone;
  };

  const clonedRoot = cloneBoneRecursive(rig.root, null);

  // Create cloned bone map
  const clonedBones = new Map<BoneName, Bone>();
  for (const [name, bone] of rig.bones) {
    const clonedBone = boneMap.get(bone);
    if (clonedBone) {
      clonedBones.set(name, clonedBone);
    }
  }

  return {
    root: clonedRoot,
    bones: clonedBones,
  };
};
