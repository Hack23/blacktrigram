/**
 * Skeletal rigging types for Black Trigram
 * 
 * Defines bone hierarchy, skeletal rig structures, and transformation
 * data for realistic fighter animations with articulated joints.
 * 
 * @module types/skeletal
 * @category Animation
 * @korean 골격시스템타입
 */

import * as THREE from "three";

/**
 * Bone identifier names for humanoid rig
 * 
 * Standard naming convention for consistent bone references
 * across animation system and rendering.
 * 
 * @public
 * @korean 뼈이름
 */
export type BoneName =
  // Root and spine
  | "pelvis"
  | "spine_lower"
  | "spine_middle"
  | "spine_upper"
  // Head
  | "neck"
  | "head"
  // Left arm chain
  | "shoulder_L"
  | "upper_arm_L"
  | "elbow_L"
  | "forearm_L"
  | "wrist_L"
  | "hand_L"
  // Right arm chain
  | "shoulder_R"
  | "upper_arm_R"
  | "elbow_R"
  | "forearm_R"
  | "wrist_R"
  | "hand_R"
  // Left leg chain
  | "hip_L"
  | "thigh_L"
  | "knee_L"
  | "shin_L"
  | "ankle_L"
  | "foot_L"
  // Right leg chain
  | "hip_R"
  | "thigh_R"
  | "knee_R"
  | "shin_R"
  | "ankle_R"
  | "foot_R";

/**
 * Single bone in skeletal hierarchy
 * 
 * Represents a bone with position, rotation, scale, and parent-child
 * relationships for hierarchical transformations.
 * 
 * @public
 * @korean 뼈
 */
export interface Bone {
  /**
   * Unique bone identifier
   * @korean 이름
   */
  readonly name: BoneName;

  /**
   * Parent bone (null for root)
   * @korean 부모뼈
   */
  readonly parent: Bone | null;

  /**
   * Local position relative to parent
   * @korean 위치
   */
  position: THREE.Vector3;

  /**
   * Local rotation relative to parent
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
  readonly children: Bone[];

  /**
   * Cached world matrix (updated during animation)
   * @korean 월드행렬
   */
  worldMatrix: THREE.Matrix4;
}

/**
 * Complete skeletal rig for humanoid character
 * 
 * Contains root bone and bone lookup map for efficient access.
 * Maximum 30 bones for 60fps performance target.
 * 
 * @public
 * @korean 골격구조
 */
export interface SkeletalRig {
  /**
   * Root bone (pelvis/center)
   * @korean 루트뼈
   */
  readonly root: Bone;

  /**
   * Fast bone lookup by name
   * @korean 뼈맵
   */
  readonly bones: ReadonlyMap<BoneName, Bone>;
}

/**
 * Bone rendering configuration
 * 
 * Defines how bones are visualized in 3D scene
 * 
 * @public
 * @korean 뼈렌더링설정
 */
export interface BoneRenderConfig {
  /**
   * Bone radius for capsule geometry
   * @korean 반지름
   */
  readonly radius: number;

  /**
   * Bone length (distance to first child)
   * @korean 길이
   */
  readonly length: number;

  /**
   * Bone color
   * @korean 색상
   */
  readonly color: number;

  /**
   * Show debug visualization
   * @korean 디버그표시
   */
  readonly showDebug: boolean;
}

/**
 * Bone transformation at a specific time
 * 
 * Used for keyframe animation data
 * 
 * @public
 * @korean 뼈변환
 */
export interface BoneTransform {
  /**
   * Target bone name
   * @korean 뼈이름
   */
  readonly boneName: BoneName;

  /**
   * Position offset (optional)
   * @korean 위치
   */
  readonly position?: THREE.Vector3;

  /**
   * Rotation (required for most animations)
   * @korean 회전
   */
  readonly rotation?: THREE.Euler;

  /**
   * Scale (optional, rarely used)
   * @korean 크기
   */
  readonly scale?: THREE.Vector3;
}

/**
 * Animation keyframe with bone transformations
 * 
 * Defines bone states at specific time points for interpolation
 * 
 * @public
 * @korean 애니메이션키프레임
 */
export interface AnimationKeyframe {
  /**
   * Time in seconds from animation start
   * @korean 시간
   */
  readonly time: number;

  /**
   * Bone transformations at this keyframe
   * @korean 뼈변환들
   */
  readonly transforms: readonly BoneTransform[];
}

/**
 * Complete animation clip with keyframes
 * 
 * @public
 * @korean 애니메이션클립
 */
export interface AnimationClip {
  /**
   * Animation identifier
   * @korean 이름
   */
  readonly name: string;

  /**
   * Duration in seconds
   * @korean 지속시간
   */
  readonly duration: number;

  /**
   * Keyframes defining bone transformations over time
   * @korean 키프레임들
   */
  readonly keyframes: readonly AnimationKeyframe[];

  /**
   * Whether animation loops
   * @korean 반복여부
   */
  readonly loop: boolean;
}

/**
 * Animation playback state
 * 
 * @public
 * @korean 애니메이션재생상태
 */
export interface AnimationState {
  /**
   * Current animation clip
   * @korean 현재클립
   */
  readonly clip: AnimationClip | null;

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
   * Playback speed multiplier
   * @korean 재생속도
   */
  playbackSpeed: number;
}
