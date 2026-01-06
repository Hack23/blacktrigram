/**
 * Skeletal rigging types for articulated body model
 * 
 * Defines bone hierarchy, skeletal rig structure, and animation keyframes
 * for realistic human-like fighter animations with independent limb movement.
 * 
 * @module types/skeletal
 * @category Type Definitions
 * @korean 골격타입
 */

import * as THREE from "three";

/**
 * Bone in skeletal rig hierarchy
 * 
 * Represents a single bone with position, rotation, scale, and parent-child relationships.
 * Bones form a tree structure for realistic articulated body movement.
 * 
 * @public
 * @category Skeletal System
 * @korean 뼈
 */
export interface Bone {
  /**
   * Unique identifier for the bone
   * @korean 이름
   */
  readonly name: string;

  /**
   * Parent bone (null for root bone)
   * @korean 부모뼈
   */
  parent: Bone | null;

  /**
   * Local position relative to parent
   * @korean 위치
   */
  position: THREE.Vector3;

  /**
   * Local rotation in Euler angles
   * @korean 회전
   */
  rotation: THREE.Euler;

  /**
   * Local scale
   * @korean 크기
   */
  scale: THREE.Vector3;

  /**
   * Child bones
   * @korean 자식뼈들
   */
  children: Bone[];

  /**
   * Length of the bone (for rendering)
   * @korean 길이
   */
  readonly length: number;

  /**
   * Rest pose position (default pose)
   * @korean 기본위치
   */
  readonly restPosition: THREE.Vector3;

  /**
   * Rest pose rotation (default pose)
   * @korean 기본회전
   */
  readonly restRotation: THREE.Euler;
}

/**
 * Skeletal rig with complete bone hierarchy
 * 
 * Contains root bone and map of all bones for efficient lookup.
 * Maximum 30 bones for 60fps performance.
 * 
 * @public
 * @category Skeletal System
 * @korean 골격
 */
export interface SkeletalRig {
  /**
   * Root bone (pelvis/center)
   * @korean 뿌리뼈
   */
  readonly root: Bone;

  /**
   * Map of bone name to bone for fast lookup
   * @korean 뼈맵
   */
  readonly bones: Map<string, Bone>;

  /**
   * Total number of bones in rig
   * @korean 뼈개수
   */
  readonly boneCount: number;
}

/**
 * Animation keyframe for skeletal animation
 * 
 * Defines bone transformations at a specific time in the animation.
 * Keyframes are interpolated for smooth animation between poses.
 * 
 * @public
 * @category Animation
 * @korean 애니메이션키프레임
 */
export interface AnimationKeyframe {
  /**
   * Time in seconds from animation start
   * @korean 시간
   */
  readonly time: number;

  /**
   * Bone rotations at this keyframe
   * Map of bone name to rotation
   * @korean 뼈회전들
   */
  readonly boneRotations: Map<string, THREE.Euler>;

  /**
   * Bone positions at this keyframe (optional, for IK or special moves)
   * Map of bone name to position offset from rest pose
   * @korean 뼈위치들
   */
  readonly bonePositions: Map<string, THREE.Vector3>;

  /**
   * Optional easing function name for interpolation
   * @korean 이징함수
   */
  readonly easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out";
}

/**
 * Attack animation type categories
 * 
 * Defines the 5 base categories of attack animations with variants.
 * Each technique maps to one of these animation types.
 * 
 * @public
 * @category Animation
 * @korean 공격애니메이션타입
 */
export enum AttackAnimationType {
  // Punch category (주먹 타격)
  PUNCH_HIGH = "punch_high",
  PUNCH_MID = "punch_mid",
  PUNCH_LOW = "punch_low",

  // Kick category (발차기)
  KICK_FRONT = "kick_front",
  KICK_SIDE = "kick_side",
  KICK_ROUNDHOUSE = "kick_round",

  // Elbow category (팔꿈치 타격)
  ELBOW_STRIKE = "elbow_strike",
  ELBOW_UPPERCUT = "elbow_uppercut",

  // Knee category (무릎 타격)
  KNEE_STRIKE = "knee_strike",
  KNEE_CLINCH = "knee_clinch",

  // Pressure point category (급소 타격)
  PRESSURE_POINT = "pressure_point",
  PRESSURE_POINT_RAPID = "pressure_point_rapid",
}

/**
 * Animation configuration for a technique
 * 
 * Links a technique to its specific attack animation with speed modifier.
 * 
 * @public
 * @category Animation
 * @korean 기술애니메이션설정
 */
export interface TechniqueAnimationConfig {
  /**
   * Type of attack animation to play
   * @korean 애니메이션타입
   */
  readonly type: AttackAnimationType;

  /**
   * Speed modifier (0.8-1.2)
   * - Light techniques: 1.2x speed
   * - Normal techniques: 1.0x speed
   * - Heavy techniques: 0.8x speed
   * @korean 속도배율
   */
  readonly speedModifier: number;
}

/**
 * Complete skeletal animation sequence
 * 
 * Sequence of keyframes defining a complete animation
 * (e.g., jab, cross, roundhouse kick).
 * 
 * @public
 * @category Animation
 * @korean 골격애니메이션
 */
export interface SkeletalAnimation {
  /**
   * Animation identifier
   * @korean 이름
   */
  readonly name: string;

  /**
   * Korean name for animation
   * @korean 한글이름
   */
  readonly koreanName: string;

  /**
   * Animation keyframes in chronological order
   * @korean 키프레임들
   */
  readonly keyframes: AnimationKeyframe[];

  /**
   * Total duration in seconds
   * @korean 지속시간
   */
  readonly duration: number;

  /**
   * Whether animation loops
   * @korean 반복여부
   */
  readonly loop: boolean;

  /**
   * Animation type (attack, defense, stance change, movement, etc.)
   * @korean 애니메이션타입
   */
  readonly type: "attack" | "defense" | "stance" | "walk" | "idle" | "movement";
}

/**
 * Bone chain definition for IK (Inverse Kinematics)
 * 
 * Defines a chain of bones for IK solving (e.g., arm chain, leg chain).
 * Used for realistic limb positioning and movement.
 * 
 * @public
 * @category Skeletal System
 * @korean 뼈체인
 */
export interface BoneChain {
  /**
   * Chain identifier
   * @korean 이름
   */
  readonly name: string;

  /**
   * Start bone (e.g., shoulder for arm chain)
   * @korean 시작뼈
   */
  readonly startBone: string;

  /**
   * End bone (e.g., hand for arm chain)
   * @korean 끝뼈
   */
  readonly endBone: string;

  /**
   * Bones in chain from start to end
   * @korean 뼈들
   */
  readonly bones: string[];

  /**
   * IK target position (for end effector)
   * @korean IK목표
   */
  ikTarget?: THREE.Vector3;
}

/**
 * Hand bone structure with 5 fingers
 * 
 * Simplified hand model with palm and 5 fingers.
 * Each finger has 3 segments (proximal, middle, distal).
 * 
 * @public
 * @category Skeletal System
 * @korean 손뼈
 */
export interface HandBones {
  /**
   * Palm bone
   * @korean 손바닥
   */
  readonly palm: Bone;

  /**
   * Thumb bones (3 segments)
   * @korean 엄지손가락
   */
  readonly thumb: [Bone, Bone, Bone];

  /**
   * Index finger bones (3 segments)
   * @korean 검지손가락
   */
  readonly index: [Bone, Bone, Bone];

  /**
   * Middle finger bones (3 segments)
   * @korean 중지손가락
   */
  readonly middle: [Bone, Bone, Bone];

  /**
   * Ring finger bones (3 segments)
   * @korean 약지손가락
   */
  readonly ring: [Bone, Bone, Bone];

  /**
   * Pinky finger bones (3 segments)
   * @korean 새끼손가락
   */
  readonly pinky: [Bone, Bone, Bone];
}

/**
 * Joint constraint for realistic movement
 * 
 * Defines rotation limits for joints (e.g., elbow can't bend backward).
 * Ensures anatomically correct movement.
 * 
 * @public
 * @category Skeletal System
 * @korean 관절제약
 */
export interface JointConstraint {
  /**
   * Bone name this constraint applies to
   * @korean 뼈이름
   */
  readonly boneName: string;

  /**
   * Minimum rotation angles (X, Y, Z) in radians
   * @korean 최소회전
   */
  readonly minRotation: THREE.Vector3;

  /**
   * Maximum rotation angles (X, Y, Z) in radians
   * @korean 최대회전
   */
  readonly maxRotation: THREE.Vector3;

  /**
   * Whether this joint can twist (rotate around its length)
   * @korean 비틀기가능
   */
  readonly canTwist: boolean;
}

/**
 * Bone names for humanoid rig
 * 
 * Standard bone naming convention for humanoid skeleton.
 * Total: 28 bones base + optional 38 hand bones (19 per hand) = 66 bones max.
 * 
 * Hand bones are optional and can be excluded for performance (LOD system).
 * 
 * @public
 * @category Skeletal System
 * @korean 뼈이름들
 */
export enum BoneName {
  // Core (1 bone)
  PELVIS = "pelvis",

  // Spine (3 bones)
  SPINE_LOWER = "spine_lower",
  SPINE_MIDDLE = "spine_middle",
  SPINE_UPPER = "spine_upper",

  // Head (2 bones)
  NECK = "neck",
  HEAD = "head",

  // Left Arm (6 bones)
  SHOULDER_L = "shoulder_L",
  UPPER_ARM_L = "upper_arm_L",
  ELBOW_L = "elbow_L",
  FOREARM_L = "forearm_L",
  WRIST_L = "wrist_L",
  HAND_L = "hand_L",

  // Right Arm (6 bones)
  SHOULDER_R = "shoulder_R",
  UPPER_ARM_R = "upper_arm_R",
  ELBOW_R = "elbow_R",
  FOREARM_R = "forearm_R",
  WRIST_R = "wrist_R",
  HAND_R = "hand_R",

  // Left Leg (5 bones)
  HIP_L = "hip_L",
  THIGH_L = "thigh_L",
  KNEE_L = "knee_L",
  SHIN_L = "shin_L",
  FOOT_L = "foot_L",

  // Right Leg (5 bones)
  HIP_R = "hip_R",
  THIGH_R = "thigh_R",
  KNEE_R = "knee_R",
  SHIN_R = "shin_R",
  FOOT_R = "foot_R",

  // Left Hand Fingers (19 bones - optional for LOD)
  THUMB_META_L = "thumb_meta_L",
  THUMB_PROX_L = "thumb_prox_L",
  THUMB_DIST_L = "thumb_dist_L",
  INDEX_META_L = "index_meta_L",
  INDEX_PROX_L = "index_prox_L",
  INDEX_INTER_L = "index_inter_L",
  INDEX_DIST_L = "index_dist_L",
  MIDDLE_META_L = "middle_meta_L",
  MIDDLE_PROX_L = "middle_prox_L",
  MIDDLE_INTER_L = "middle_inter_L",
  MIDDLE_DIST_L = "middle_dist_L",
  RING_META_L = "ring_meta_L",
  RING_PROX_L = "ring_prox_L",
  RING_INTER_L = "ring_inter_L",
  RING_DIST_L = "ring_dist_L",
  PINKY_META_L = "pinky_meta_L",
  PINKY_PROX_L = "pinky_prox_L",
  PINKY_INTER_L = "pinky_inter_L",
  PINKY_DIST_L = "pinky_dist_L",

  // Right Hand Fingers (19 bones - optional for LOD)
  THUMB_META_R = "thumb_meta_R",
  THUMB_PROX_R = "thumb_prox_R",
  THUMB_DIST_R = "thumb_dist_R",
  INDEX_META_R = "index_meta_R",
  INDEX_PROX_R = "index_prox_R",
  INDEX_INTER_R = "index_inter_R",
  INDEX_DIST_R = "index_dist_R",
  MIDDLE_META_R = "middle_meta_R",
  MIDDLE_PROX_R = "middle_prox_R",
  MIDDLE_INTER_R = "middle_inter_R",
  MIDDLE_DIST_R = "middle_dist_R",
  RING_META_R = "ring_meta_R",
  RING_PROX_R = "ring_prox_R",
  RING_INTER_R = "ring_inter_R",
  RING_DIST_R = "ring_dist_R",
  PINKY_META_R = "pinky_meta_R",
  PINKY_PROX_R = "pinky_prox_R",
  PINKY_INTER_R = "pinky_inter_R",
  PINKY_DIST_R = "pinky_dist_R",
}

/**
 * Animation state for skeletal player
 * 
 * Tracks current animation playback state for skeletal animations.
 * 
 * @public
 * @category Animation
 * @korean 애니메이션상태
 */
export interface SkeletalAnimationState {
  /**
   * Current animation being played
   * @korean 현재애니메이션
   */
  currentAnimation: SkeletalAnimation | null;

  /**
   * Current time in animation (seconds)
   * @korean 현재시간
   */
  currentTime: number;

  /**
   * Whether animation is playing
   * @korean 재생중
   */
  isPlaying: boolean;

  /**
   * Animation playback speed multiplier
   * @korean 재생속도
   */
  playbackSpeed: number;

  /**
   * Previous keyframe index
   * @korean 이전키프레임
   */
  previousKeyframeIndex: number;

  /**
   * Next keyframe index
   * @korean 다음키프레임
   */
  nextKeyframeIndex: number;
}

/**
 * Fighting stance guard pose configuration
 * 
 * Defines the default guard position for each trigram stance (팔괘),
 * including arm positions, torso rotation, and weight distribution.
 * Used for stance-specific idle animations at 60fps.
 * 
 * @public
 * @category Animation
 * @korean 자세방어포즈
 */
export interface StanceGuardPose {
  /**
   * Left arm bone rotations (shoulder, elbow, wrist)
   * @korean 왼팔
   */
  readonly leftArm: {
    readonly shoulder: THREE.Euler;
    readonly elbow: THREE.Euler;
    readonly wrist: THREE.Euler;
  };

  /**
   * Right arm bone rotations (shoulder, elbow, wrist)
   * @korean 오른팔
   */
  readonly rightArm: {
    readonly shoulder: THREE.Euler;
    readonly elbow: THREE.Euler;
    readonly wrist: THREE.Euler;
  };

  /**
   * Torso rotation (spine upper bone)
   * @korean 몸통회전
   */
  readonly torso: THREE.Euler;

  /**
   * Weight distribution (forward/neutral/back)
   * @korean 무게중심
   */
  readonly weight: "forward" | "neutral" | "back";

  /**
   * Breathing animation range (min/max for chest movement)
   * @korean 호흡범위
   */
  readonly breathingRange: {
    readonly min: number;
    readonly max: number;
  };
}

/**
 * Stance guard animation configuration
 * 
 * Extends base AnimationConfig with stance-specific guard pose data.
 * Includes 4-6 frame breathing animation for realistic idle behavior.
 * 
 * @public
 * @category Animation
 * @korean 자세방어애니메이션설정
 */
export interface StanceGuardAnimationConfig {
  /**
   * Trigram stance identifier
   * @korean 괘
   */
  readonly stance: string;

  /**
   * Korean name of stance
   * @korean 한글이름
   */
  readonly koreanName: string;

  /**
   * English name of stance
   * @korean 영어이름
   */
  readonly englishName: string;

  /**
   * Guard pose keyframe (default position)
   * @korean 방어포즈
   */
  readonly guardPose: StanceGuardPose;

  /**
   * Breathing animation frames (4-6 frames)
   * @korean 호흡프레임
   */
  readonly breathingFrames: number;

  /**
   * Target frames per second (60fps)
   * @korean 초당프레임
   */
  readonly fps: number;

  /**
   * Breathing cycle loop enabled
   * @korean 반복여부
   */
  readonly loop: boolean;

  /**
   * Animation priority (0 for idle guards)
   * @korean 우선순위
   */
  readonly priority: number;
}

/**
 * Mirror a guard pose for left/right stance laterality.
 * 
 * **Korean**: 자세 좌우 대칭
 * 
 * Creates a mirror-image guard pose by swapping left and right limb positions
 * and negating lateral (Y-axis and Z-axis) rotations. This enables authentic
 * left/right stance differentiation in Korean martial arts.
 * 
 * Key transformations:
 * - Swap leftArm ↔ rightArm bone rotations
 * - Negate Y rotation (lateral twist)
 * - Negate Z rotation (roll)
 * - Preserve X rotation (forward/back bend)
 * - Keep weight distribution and breathing range unchanged
 * 
 * @param pose - Original guard pose to mirror
 * @returns Mirrored guard pose with swapped and negated rotations
 * 
 * @example
 * ```typescript
 * // Create right-handed version of a left-handed guard
 * const leftGeonGuard = GEON_HIGH_GUARD_POSE;
 * const rightGeonGuard = mirrorGuardPose(leftGeonGuard);
 * 
 * // leftGeonGuard has left hand forward
 * // rightGeonGuard has right hand forward (mirrored)
 * ```
 * 
 * @public
 * @category Animation
 * @korean 방어포즈대칭
 */
export function mirrorGuardPose(pose: StanceGuardPose): StanceGuardPose {
  // Helper to negate Y and Z rotations while preserving X
  const mirrorEuler = (euler: THREE.Euler): THREE.Euler => {
    return new THREE.Euler(
      euler.x,      // Preserve forward/back bend
      -euler.y,     // Negate lateral twist
      -euler.z      // Negate roll
    );
  };

  return {
    // Swap left and right arms with mirrored rotations
    leftArm: {
      shoulder: mirrorEuler(pose.rightArm.shoulder),
      elbow: mirrorEuler(pose.rightArm.elbow),
      wrist: mirrorEuler(pose.rightArm.wrist),
    },
    rightArm: {
      shoulder: mirrorEuler(pose.leftArm.shoulder),
      elbow: mirrorEuler(pose.leftArm.elbow),
      wrist: mirrorEuler(pose.leftArm.wrist),
    },
    // Mirror torso rotation
    torso: mirrorEuler(pose.torso),
    // Weight distribution remains the same
    weight: pose.weight,
    // Breathing range unchanged (not affected by laterality, reuse original object)
    breathingRange: pose.breathingRange,
  };
}
