/**
 * Stance-specific attack animations for Eight Trigram combat system
 * 
 * Implements 24 unique attack animations (3 per stance) based on Korean martial arts
 * and I Ching philosophy. Each stance has 3 attack variations that reflect its
 * fundamental nature and combat characteristics.
 * 
 * Coverage:
 * - 8 stances × 3 attack moves = 24 attack animations
 * - Bone-breaking strikes, joint manipulations, nerve strikes, and more
 * - Integration with existing AnimationStateMachine
 * 
 * @module systems/animation/StanceAttackAnimations
 * @category Animation
 * @korean 자세공격애니메이션
 */

import * as THREE from "three";
import type { SkeletalAnimation } from "../../types/skeletal";
import { BoneName } from "../../types/skeletal";
import { TrigramStance } from "../../types/common";

// =============================================================================
// ☰ GEON (Heaven) - Direct Force Attack Animations
// =============================================================================

/**
 * ☰ 건 (Geon) - Heaven Attack 1: Bone-Breaking Strike (뼈부러뜨리기 1)
 * 
 * Powerful overhead descending strike targeting collarbone or shoulder.
 * Direct downward force with full body weight transfer.
 * 
 * Enhanced with PR #1132 mobility improvements:
 * - Hip rotation (골반회전) for power generation (30% damage bonus)
 * - Segmented spine rotation (척추분절회전) for realistic torso twist
 * - Shoulder elevation (어깨들어올림) for overhead mechanics
 * 
 * Duration: 350ms
 * 
 * @korean 건뼈부러뜨리기1
 */
export const GEON_BONE_BREAKING_STRIKE_1: SkeletalAnimation = {
  name: "geon_bone_breaking_strike_1",
  koreanName: "건 뼈부러뜨리기 1",
  duration: 0.35,
  loop: false,
  type: "attack",
  keyframes: [
    {
      time: 0.0,
      easing: "ease-out",
      boneRotations: new Map([
        // Upper body coiled back, preparing for strike
        [BoneName.SHOULDER_R, new THREE.Euler(-1.2, -0.3, -0.5, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.5, "XYZ")],
        // Spine segments - wind-up phase with torso rotation
        [BoneName.SPINE_UPPER, new THREE.Euler(0, -0.4, 0.1, "XYZ")],  // Twist back
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, -0.3, 0, "XYZ")],   // Mid-spine twist
        [BoneName.SPINE_LOWER, new THREE.Euler(0, -0.2, -0.1, "XYZ")], // Lower twist
        // Hip and pelvis - load phase
        [BoneName.PELVIS, new THREE.Euler(-0.1, -0.3, 0, "XYZ")],      // Hip rotation back
        [BoneName.HIP_R, new THREE.Euler(0, -0.2, 0, "XYZ")],          // Right hip engaged
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.18,
      easing: "linear",
      boneRotations: new Map([
        // Strike impact - maximum power delivery
        [BoneName.SHOULDER_R, new THREE.Euler(0.8, -0.2, 0.7, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.1, "XYZ")],
        // Spine segments - explosive forward rotation
        [BoneName.SPINE_UPPER, new THREE.Euler(0.2, 0.5, -0.1, "XYZ")],  // Forward twist peak
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0.15, 0.4, 0, "XYZ")],   // Mid-spine follows
        [BoneName.SPINE_LOWER, new THREE.Euler(0.1, 0.3, 0.05, "XYZ")],  // Lower drives
        // Hip and pelvis - power generation phase (30% bonus)
        [BoneName.PELVIS, new THREE.Euler(0.1, 0.5, 0, "XYZ")],          // Hip explosion forward
        [BoneName.HIP_R, new THREE.Euler(0, 0.3, 0, "XYZ")],             // Right hip drives
        [BoneName.HIP_L, new THREE.Euler(0, 0.1, 0, "XYZ")],             // Left hip supports
      ]),
      bonePositions: new Map([[BoneName.HAND_R, new THREE.Vector3(0, 0, 1.0)]]),
    },
    {
      time: 0.35,
      easing: "ease-in",
      boneRotations: new Map([
        // Recovery to guard position
        [BoneName.SHOULDER_R, new THREE.Euler(-0.2, -0.3, -0.3, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
        // Spine segments - return to neutral
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0, "XYZ")],
        // Hip and pelvis - reset
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.HIP_R, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.HIP_L, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_R, new THREE.Vector3(0, 0, 0)]]),
    },
  ],
};

/**
 * ☰ 건 (Geon) - Heaven Attack 2: Thunderous Uppercut (천둥어퍼컷)
 * 
 * Rising strike targeting jaw or solar plexus with explosive upward force.
 * Uses leg drive and hip rotation for maximum power.
 * 
 * Enhanced with PR #1132 mobility improvements:
 * - Strong hip rotation (골반회전) for upward power generation
 * - Knee drive (무릎밀어올림) for explosive leg power
 * - Spinal extension (척추확장) for upward trajectory
 * 
 * Duration: 300ms
 * 
 * @korean 건천둥어퍼컷
 */
export const GEON_THUNDEROUS_UPPERCUT: SkeletalAnimation = {
  name: "geon_thunderous_uppercut",
  koreanName: "건 천둥어퍼컷",
  duration: 0.3,
  loop: false,
  type: "attack",
  keyframes: [
    {
      time: 0.0,
      easing: "ease-out",
      boneRotations: new Map([
        // Arms chambered low, coiled for upward strike
        [BoneName.SHOULDER_L, new THREE.Euler(-0.3, 0.5, 0.8, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.4, "XYZ")],
        // Legs bent, loading power
        [BoneName.KNEE_L, new THREE.Euler(-0.8, 0, 0, "XYZ")],          // Deep crouch
        [BoneName.KNEE_R, new THREE.Euler(-0.8, 0, 0, "XYZ")],          // Deep crouch
        [BoneName.HIP_L, new THREE.Euler(-0.2, 0, 0, "XYZ")],           // Hip flexed
        [BoneName.HIP_R, new THREE.Euler(-0.2, 0, 0, "XYZ")],           // Hip flexed
        // Spine segments - slightly forward lean for loading
        [BoneName.SPINE_LOWER, new THREE.Euler(-0.15, -0.2, 0, "XYZ")], // Lower lean
        [BoneName.SPINE_MIDDLE, new THREE.Euler(-0.1, -0.1, 0, "XYZ")], // Mid lean
        [BoneName.SPINE_UPPER, new THREE.Euler(-0.05, 0, 0, "XYZ")],    // Upper ready
        [BoneName.PELVIS, new THREE.Euler(-0.2, -0.3, 0, "XYZ")],       // Pelvis loaded
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.15,
      easing: "linear",
      boneRotations: new Map([
        // Strike rising - explosive upward motion
        [BoneName.SHOULDER_L, new THREE.Euler(-0.8, 0.3, 0.5, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.3, "XYZ")],
        // Legs exploding upward - knee drive mechanics
        [BoneName.KNEE_L, new THREE.Euler(-0.1, 0, 0, "XYZ")],          // Extending
        [BoneName.KNEE_R, new THREE.Euler(-0.1, 0, 0, "XYZ")],          // Extending
        [BoneName.HIP_L, new THREE.Euler(0.1, 0.2, 0, "XYZ")],          // Hip extension
        [BoneName.HIP_R, new THREE.Euler(0.1, 0.2, 0, "XYZ")],          // Hip extension
        // Spine segments - explosive extension upward
        [BoneName.SPINE_LOWER, new THREE.Euler(-0.2, 0.4, 0, "XYZ")],   // Drive upward
        [BoneName.SPINE_MIDDLE, new THREE.Euler(-0.15, 0.3, 0, "XYZ")], // Follow through
        [BoneName.SPINE_UPPER, new THREE.Euler(-0.1, 0.2, 0, "XYZ")],   // Upper rises
        [BoneName.PELVIS, new THREE.Euler(0, 0.5, 0, "XYZ")],           // Pelvis rotates up
      ]),
      bonePositions: new Map([[BoneName.HAND_L, new THREE.Vector3(0, 0.6, 0.5)]]),
    },
    {
      time: 0.3,
      easing: "ease-in",
      boneRotations: new Map([
        // Recovery to guard
        [BoneName.SHOULDER_L, new THREE.Euler(-0.4, 0.2, 0.3, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        // Legs stabilize
        [BoneName.KNEE_L, new THREE.Euler(-0.3, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.3, 0, 0, "XYZ")],
        [BoneName.HIP_L, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.HIP_R, new THREE.Euler(0, 0, 0, "XYZ")],
        // Spine segments - return to neutral
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
  ],
};

/**
 * ☰ 건 (Geon) - Heaven Attack 3: Crushing Elbow (파괴팔꿈치)
 * 
 * Horizontal elbow strike with full torso rotation.
 * Targets temple, jaw, or ribs with overwhelming force.
 * 
 * Duration: 280ms
 * 
 * @korean 건파괴팔꿈치
 */
export const GEON_CRUSHING_ELBOW: SkeletalAnimation = {
  name: "geon_crushing_elbow",
  koreanName: "건 파괴팔꿈치",
  duration: 0.28,
  loop: false,
  type: "attack",
  keyframes: [
    {
      time: 0.0,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.4, -0.9, -0.6, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 2.0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, -0.8, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.14,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.3, 0.5, 0.3, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 2.1, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.9, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0.6, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.ELBOW_R, new THREE.Vector3(0, 0, 0.7)]]),
    },
    {
      time: 0.28,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.4, -0.9, -0.6, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.8, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.ELBOW_R, new THREE.Vector3(0, 0, 0)]]),
    },
  ],
};

// =============================================================================
// ☱ TAE (Lake) - Fluid Joint Manipulation Attacks
// =============================================================================

/**
 * ☱ 태 (Tae) - Lake Attack 1: Wrist Lock Strike (손목꺾기타격)
 * 
 * Circular grabbing motion targeting opponent's wrist for control.
 * Fluid transition from strike to lock.
 * 
 * Duration: 320ms
 * 
 * @korean 태손목꺾기타격
 */
export const TAE_WRIST_LOCK_STRIKE: SkeletalAnimation = {
  name: "tae_wrist_lock_strike",
  koreanName: "태 손목꺾기타격",
  duration: 0.32,
  loop: false,
  type: "attack",
  keyframes: [
    {
      time: 0.0,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.2, 0.7, 0.5, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.8, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.16,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.3, 1.0, 0.8, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.4, "XYZ")],
        [BoneName.WRIST_L, new THREE.Euler(0.4, 0.6, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.4, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_L, new THREE.Vector3(0, 0, 0.8)]]),
    },
    {
      time: 0.32,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.2, 0.7, 0.5, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.0, "XYZ")],
        [BoneName.WRIST_L, new THREE.Euler(0.6, 0.8, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_L, new THREE.Vector3(0, 0, 0)]]),
    },
  ],
};

/**
 * ☱ 태 (Tae) - Lake Attack 2: Flowing Arm Bar (유수팔걸이)
 * 
 * Circular arm control transitioning into hyperextension.
 * Uses opponent's resistance against them.
 * 
 * Duration: 380ms
 * 
 * @korean 태유수팔걸이
 */
export const TAE_FLOWING_ARM_BAR: SkeletalAnimation = {
  name: "tae_flowing_arm_bar",
  koreanName: "태 유수팔걸이",
  duration: 0.38,
  loop: false,
  type: "attack",
  keyframes: [
    {
      time: 0.0,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.5, -0.7, -0.4, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.6, "XYZ")],
        [BoneName.SHOULDER_L, new THREE.Euler(-0.3, 0.5, 0.6, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.7, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.19,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.2, 0.8, 0.7, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.3, "XYZ")],
        [BoneName.SHOULDER_L, new THREE.Euler(-0.4, 0.9, 0.8, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.5, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.5, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.HAND_R, new THREE.Vector3(0, 0, 0.7)],
        [BoneName.HAND_L, new THREE.Vector3(0, 0, 0.7)],
      ]),
    },
    {
      time: 0.38,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.5, -0.7, -0.4, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.8, "XYZ")],
        [BoneName.SHOULDER_L, new THREE.Euler(-0.3, 0.5, 0.6, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.9, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.HAND_R, new THREE.Vector3(0, 0, 0)],
        [BoneName.HAND_L, new THREE.Vector3(0, 0, 0)],
      ]),
    },
  ],
};

/**
 * ☱ 태 (Tae) - Lake Attack 3: Spiral Shoulder Throw (회오리어깨던지기)
 * 
 * Rotating throw using circular hip and shoulder movement.
 * Fluid transition from contact to off-balance.
 * 
 * Duration: 400ms
 * 
 * @korean 태회오리어깨던지기
 */
export const TAE_SPIRAL_SHOULDER_THROW: SkeletalAnimation = {
  name: "tae_spiral_shoulder_throw",
  koreanName: "태 회오리어깨던지기",
  duration: 0.4,
  loop: false,
  type: "attack",
  keyframes: [
    {
      time: 0.0,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.3, -0.5, -0.4, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, -0.3, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.15,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(0.2, 0.8, 0.6, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.5, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0.2, 0.6, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0.1, 0.7, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.8, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.8, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_R, new THREE.Vector3(0, 0, 0.6)]]),
    },
    {
      time: 0.28,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(0.5, 1.2, 0.9, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0.3, 1.0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0.15, 1.1, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.4,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.3, -0.5, -0.4, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.4, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.4, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_R, new THREE.Vector3(0, 0, 0)]]),
    },
  ],
};

// =============================================================================
// ☲ LI (Fire) - Precise Nerve Strike Attacks
// =============================================================================

/**
 * ☲ 리 (Li) - Fire Attack 1: Burning Finger Strike (화염지창 1)
 * 
 * Precise fingertip strike targeting pressure points on neck or temple.
 * Lightning-fast extension with pinpoint accuracy.
 * 
 * Duration: 250ms
 * 
 * @korean 리화염지창1
 */
export const LI_BURNING_FINGER_STRIKE_1: SkeletalAnimation = {
  name: "li_burning_finger_strike_1",
  koreanName: "리 화염지창 1",
  duration: 0.25,
  loop: false,
  type: "attack",
  keyframes: [
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.4, -0.6, -0.5, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.5, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.12,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.2, -0.2, 0.3, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.1, "XYZ")],
        [BoneName.WRIST_R, new THREE.Euler(0.1, -0.3, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_R, new THREE.Vector3(0, 0, 0.85)]]),
    },
    {
      time: 0.25,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.4, -0.6, -0.5, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.3, "XYZ")],
        [BoneName.WRIST_R, new THREE.Euler(0.1, -0.1, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_R, new THREE.Vector3(0, 0, 0)]]),
    },
  ],
};

/**
 * ☲ 리 (Li) - Fire Attack 2: Solar Plexus Spear (태양신경총창)
 * 
 * Precise thrust targeting solar plexus with rigid fingers.
 * Targets nerve cluster for breath disruption.
 * 
 * Duration: 260ms
 * 
 * @korean 리태양신경총창
 */
export const LI_SOLAR_PLEXUS_SPEAR: SkeletalAnimation = {
  name: "li_solar_plexus_spear",
  koreanName: "리 태양신경총창",
  duration: 0.26,
  loop: false,
  type: "attack",
  keyframes: [
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.3, 0.7, 0.6, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.4, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, -0.2, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.13,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.1, 0.3, 0.2, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.2, "XYZ")],
        [BoneName.WRIST_L, new THREE.Euler(0.15, 0.25, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.2, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_L, new THREE.Vector3(0, 0, 0.9)]]),
    },
    {
      time: 0.26,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.3, 0.7, 0.6, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.WRIST_L, new THREE.Euler(0.15, 0.2, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_L, new THREE.Vector3(0, 0, 0)]]),
    },
  ],
};

/**
 * ☲ 리 (Li) - Fire Attack 3: Phoenix Eye Strike (봉안권)
 * 
 * Single-knuckle punch targeting vital points on face or throat.
 * Concentrated force through one extended knuckle.
 * 
 * Duration: 240ms
 * 
 * @korean 리봉안권
 */
export const LI_PHOENIX_EYE_STRIKE: SkeletalAnimation = {
  name: "li_phoenix_eye_strike",
  koreanName: "리 봉안권",
  duration: 0.24,
  loop: false,
  type: "attack",
  keyframes: [
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.2, -0.4, -0.3, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.3, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.11,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.1, 0, 0.4, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.15, "XYZ")],
        [BoneName.WRIST_R, new THREE.Euler(0.2, -0.15, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.25, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_R, new THREE.Vector3(0, 0, 0.8)]]),
    },
    {
      time: 0.24,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.2, -0.4, -0.3, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.1, "XYZ")],
        [BoneName.WRIST_R, new THREE.Euler(0.2, -0.1, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_R, new THREE.Vector3(0, 0, 0)]]),
    },
  ],
};

// =============================================================================
// ☳ JIN (Thunder) - Explosive Power Attacks
// =============================================================================

/**
 * ☳ 진 (Jin) - Thunder Attack 1: Lightning Straight (벽력일섬)
 * 
 * Explosive straight punch with sudden full-body burst.
 * Maximum speed and shocking impact.
 * 
 * Duration: 200ms
 * 
 * @korean 진벽력일섬
 */
export const JIN_LIGHTNING_STRAIGHT: SkeletalAnimation = {
  name: "jin_lightning_straight",
  koreanName: "진 벽력일섬",
  duration: 0.2,
  loop: false,
  type: "attack",
  keyframes: [
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.2, 0.5, 0.4, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.5, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, -0.3, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.08,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.1, 0.1, 0.5, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.05, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.4, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0.3, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_L, new THREE.Vector3(0, 0, 1.0)]]),
    },
    {
      time: 0.2,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.2, 0.5, 0.4, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.3, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_L, new THREE.Vector3(0, 0, 0)]]),
    },
  ],
};

/**
 * ☳ 진 (Jin) - Thunder Attack 2: Shocking Hammer Fist (충격망치)
 * 
 * Downward hammer strike with explosive drop of body weight.
 * Creates stunning impact.
 * 
 * Duration: 220ms
 * 
 * @korean 진충격망치
 */
export const JIN_SHOCKING_HAMMER_FIST: SkeletalAnimation = {
  name: "jin_shocking_hammer_fist",
  koreanName: "진 충격망치",
  duration: 0.22,
  loop: false,
  type: "attack",
  keyframes: [
    {
      time: 0.0,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-1.4, -0.2, -0.6, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.6, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.09,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(0.6, -0.1, 0.6, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.2, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0.15, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0.1, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_R, new THREE.Vector3(0, 0, 0.9)]]),
    },
    {
      time: 0.22,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.2, -0.3, -0.4, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.4, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_R, new THREE.Vector3(0, 0, 0)]]),
    },
  ],
};

/**
 * ☳ 진 (Jin) - Thunder Attack 3: Explosive Knee (폭발무릎)
 * 
 * Sudden knee strike with full leg drive and hip thrust.
 * Targets midsection with shocking power.
 * 
 * Duration: 280ms
 * 
 * @korean 진폭발무릎
 */
export const JIN_EXPLOSIVE_KNEE: SkeletalAnimation = {
  name: "jin_explosive_knee",
  koreanName: "진 폭발무릎",
  duration: 0.28,
  loop: false,
  type: "attack",
  keyframes: [
    {
      time: 0.0,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.KNEE_R, new THREE.Euler(-0.4, 0, 0, "XYZ")],
        [BoneName.HIP_R, new THREE.Euler(-0.2, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.12,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.KNEE_R, new THREE.Euler(-2.2, 0, 0, "XYZ")],
        [BoneName.HIP_R, new THREE.Euler(0.7, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0.15, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.KNEE_R, new THREE.Vector3(0, 0, 0.8)]]),
    },
    {
      time: 0.28,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.KNEE_R, new THREE.Euler(-0.4, 0, 0, "XYZ")],
        [BoneName.HIP_R, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.KNEE_R, new THREE.Vector3(0, 0, 0)]]),
    },
  ],
};

// =============================================================================
// ☴ SON (Wind) - Continuous Pressure Attacks
// =============================================================================

/**
 * ☴ 손 (Son) - Wind Attack 1: Whirlwind Combo (선풍연격 1)
 * 
 * Rapid alternating hand strikes maintaining constant pressure.
 * Continuous flowing motion without pause.
 * 
 * Duration: 400ms
 * 
 * @korean 손선풍연격1
 */
export const SON_WHIRLWIND_COMBO_1: SkeletalAnimation = {
  name: "son_whirlwind_combo_1",
  koreanName: "손 선풍연격 1",
  duration: 0.4,
  loop: false,
  type: "attack",
  keyframes: [
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.2, -0.3, -0.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.13,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.1, 0, 0.3, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.2, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.2, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_R, new THREE.Vector3(0, 0, 0.7)]]),
    },
    {
      time: 0.26,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.1, 0, -0.3, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.2, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, -0.2, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.HAND_R, new THREE.Vector3(0, 0, 0)],
        [BoneName.HAND_L, new THREE.Vector3(0, 0, 0.7)],
      ]),
    },
    {
      time: 0.4,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.2, 0.3, 0.2, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(-0.2, -0.3, -0.2, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_L, new THREE.Vector3(0, 0, 0)]]),
    },
  ],
};

/**
 * ☴ 손 (Son) - Wind Attack 2: Pressure Point Chain (연속급소타격)
 * 
 * Sequential pressure point strikes flowing from one target to next.
 * Maintains momentum through circular motion.
 * 
 * Duration: 380ms
 * 
 * @korean 손연속급소타격
 */
export const SON_PRESSURE_POINT_CHAIN: SkeletalAnimation = {
  name: "son_pressure_point_chain",
  koreanName: "손 연속급소타격",
  duration: 0.38,
  loop: false,
  type: "attack",
  keyframes: [
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.3, 0.5, 0.5, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.3, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.12,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.2, 0.2, 0.3, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.3, "XYZ")],
        [BoneName.WRIST_L, new THREE.Euler(0.15, 0.2, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_L, new THREE.Vector3(0, 0, 0.6)]]),
    },
    {
      time: 0.24,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.2, -0.2, -0.3, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.3, "XYZ")],
        [BoneName.WRIST_R, new THREE.Euler(0.15, -0.2, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.3, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.HAND_L, new THREE.Vector3(0, 0, 0)],
        [BoneName.HAND_R, new THREE.Vector3(0, 0, 0.6)],
      ]),
    },
    {
      time: 0.38,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.3, 0.5, 0.5, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(-0.3, -0.5, -0.5, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.3, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.3, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_R, new THREE.Vector3(0, 0, 0)]]),
    },
  ],
};

/**
 * ☴ 손 (Son) - Wind Attack 3: Penetrating Palm Rush (관통장타)
 * 
 * Multiple palm strikes driving forward with relentless pressure.
 * Each strike flows into the next without stopping.
 * 
 * Duration: 420ms
 * 
 * @korean 손관통장타
 */
export const SON_PENETRATING_PALM_RUSH: SkeletalAnimation = {
  name: "son_penetrating_palm_rush",
  koreanName: "손 관통장타",
  duration: 0.42,
  loop: false,
  type: "attack",
  keyframes: [
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.1, -0.4, -0.3, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.0, "XYZ")],
        [BoneName.WRIST_R, new THREE.Euler(-0.2, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.14,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.05, 0, 0.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.3, "XYZ")],
        [BoneName.WRIST_R, new THREE.Euler(-0.3, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_R, new THREE.Vector3(0, 0, 0.65)]]),
    },
    {
      time: 0.28,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.05, 0, -0.2, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.3, "XYZ")],
        [BoneName.WRIST_L, new THREE.Euler(-0.3, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.HAND_R, new THREE.Vector3(0, 0, 0)],
        [BoneName.HAND_L, new THREE.Vector3(0, 0, 0.65)],
      ]),
    },
    {
      time: 0.42,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.1, 0.4, 0.3, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(-0.1, -0.4, -0.3, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.0, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_L, new THREE.Vector3(0, 0, 0)]]),
    },
  ],
};

// =============================================================================
// ☵ GAM (Water) - Flow-Counter Attacks
// =============================================================================

/**
 * ☵ 감 (Gam) - Water Attack 1: Flowing River Strike (유수타격)
 * 
 * Circular strike that follows and redirects opponent's energy.
 * Adapts mid-motion to openings.
 * 
 * Duration: 340ms
 * 
 * @korean 감유수타격
 */
export const GAM_FLOWING_RIVER_STRIKE: SkeletalAnimation = {
  name: "gam_flowing_river_strike",
  koreanName: "감 유수타격",
  duration: 0.34,
  loop: false,
  type: "attack",
  keyframes: [
    {
      time: 0.0,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.2, 0.7, 0.6, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.9, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, -0.3, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.17,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.1, 0.9, 0.7, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.4, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.4, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0.3, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_L, new THREE.Vector3(0, 0, 0.75)]]),
    },
    {
      time: 0.34,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.2, 0.7, 0.6, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_L, new THREE.Vector3(0, 0, 0)]]),
    },
  ],
};

/**
 * ☵ 감 (Gam) - Water Attack 2: Tidal Wave Palm (파도장타)
 * 
 * Sweeping palm strike that flows around defenses.
 * Uses circular motion to bypass guards.
 * 
 * Duration: 360ms
 * 
 * @korean 감파도장타
 */
export const GAM_TIDAL_WAVE_PALM: SkeletalAnimation = {
  name: "gam_tidal_wave_palm",
  koreanName: "감 파도장타",
  duration: 0.36,
  loop: false,
  type: "attack",
  keyframes: [
    {
      time: 0.0,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(0.1, -0.8, -0.7, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.8, "XYZ")],
        [BoneName.WRIST_R, new THREE.Euler(-0.25, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.18,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.2, 0.5, 0.5, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.4, "XYZ")],
        [BoneName.WRIST_R, new THREE.Euler(-0.35, 0, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.4, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_R, new THREE.Vector3(0, 0, 0.7)]]),
    },
    {
      time: 0.36,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(0.1, -0.8, -0.7, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.9, "XYZ")],
        [BoneName.WRIST_R, new THREE.Euler(-0.25, 0, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_R, new THREE.Vector3(0, 0, 0)]]),
    },
  ],
};

/**
 * ☵ 감 (Gam) - Water Attack 3: Whirlpool Counter (소용돌이반격)
 * 
 * Spinning strike that uses opponent's momentum against them.
 * Full body rotation for maximum redirection.
 * 
 * Duration: 380ms
 * 
 * @korean 감소용돌이반격
 */
export const GAM_WHIRLPOOL_COUNTER: SkeletalAnimation = {
  name: "gam_whirlpool_counter",
  koreanName: "감 소용돌이반격",
  duration: 0.38,
  loop: false,
  type: "attack",
  keyframes: [
    {
      time: 0.0,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.3, 0.6, 0.5, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.8, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, -0.5, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, -0.4, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.19,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.2, 1.0, 0.8, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.5, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.8, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0.6, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_L, new THREE.Vector3(0, 0, 0.8)]]),
    },
    {
      time: 0.38,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.3, 0.6, 0.5, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.9, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_L, new THREE.Vector3(0, 0, 0)]]),
    },
  ],
};

// =============================================================================
// ☶ GAN (Mountain) - Defensive Counter Attacks
// =============================================================================

/**
 * ☶ 간 (Gan) - Mountain Attack 1: Fortress Counter Strike (요새반격타)
 * 
 * Solid counter punch from defensive stance with immovable base.
 * Power generated from stable mountain stance.
 * 
 * Duration: 300ms
 * 
 * @korean 간요새반격타
 */
export const GAN_FORTRESS_COUNTER_STRIKE: SkeletalAnimation = {
  name: "gan_fortress_counter_strike",
  koreanName: "간 요새반격타",
  duration: 0.3,
  loop: false,
  type: "attack",
  keyframes: [
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.5, -0.4, -0.5, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.4, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.5, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.5, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.15,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.1, 0, 0.4, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.2, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.3, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.5, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.5, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_R, new THREE.Vector3(0, 0, 0.85)]]),
    },
    {
      time: 0.3,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.5, -0.4, -0.5, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.3, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.5, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.5, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_R, new THREE.Vector3(0, 0, 0)]]),
    },
  ],
};

/**
 * ☶ 간 (Gan) - Mountain Attack 2: Avalanche Hammer (눈사태망치)
 * 
 * Powerful overhead strike from high guard position.
 * Uses gravity and body weight like falling rocks.
 * 
 * Duration: 350ms
 * 
 * @korean 간눈사태망치
 */
export const GAN_AVALANCHE_HAMMER: SkeletalAnimation = {
  name: "gan_avalanche_hammer",
  koreanName: "간 눈사태망치",
  duration: 0.35,
  loop: false,
  type: "attack",
  keyframes: [
    {
      time: 0.0,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-1.3, 0.3, 0.7, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.5, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.18,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(0.7, 0.2, 0.6, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.2, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0.2, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0.15, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_L, new THREE.Vector3(0, 0, 0.9)]]),
    },
    {
      time: 0.35,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.3, 0.3, 0.5, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.3, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_L, new THREE.Vector3(0, 0, 0)]]),
    },
  ],
};

/**
 * ☶ 간 (Gan) - Mountain Attack 3: Stone Wall Thrust (석벽관통)
 * 
 * Immovable forward thrust with locked elbow and shoulder.
 * Unyielding linear force from stable base.
 * 
 * Duration: 320ms
 * 
 * @korean 간석벽관통
 */
export const GAN_STONE_WALL_THRUST: SkeletalAnimation = {
  name: "gan_stone_wall_thrust",
  koreanName: "간 석벽관통",
  duration: 0.32,
  loop: false,
  type: "attack",
  keyframes: [
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.3, -0.5, -0.4, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.3, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.6, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.6, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.16,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.15, -0.1, 0.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.1, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.2, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.6, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.6, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_R, new THREE.Vector3(0, 0, 0.85)]]),
    },
    {
      time: 0.32,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.3, -0.5, -0.4, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.6, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.6, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_R, new THREE.Vector3(0, 0, 0)]]),
    },
  ],
};

// =============================================================================
// ☷ GON (Earth) - Grounding/Takedown Attacks
// =============================================================================

/**
 * ☷ 곤 (Gon) - Earth Attack 1: Ground Sweep Strike (접지쓸기)
 * 
 * Low sweeping leg attack targeting opponent's base.
 * Uses grounded center of gravity for stability.
 * 
 * Duration: 380ms
 * 
 * @korean 곤접지쓸기
 */
export const GON_GROUND_SWEEP_STRIKE: SkeletalAnimation = {
  name: "gon_ground_sweep_strike",
  koreanName: "곤 접지쓸기",
  duration: 0.38,
  loop: false,
  type: "attack",
  keyframes: [
    {
      time: 0.0,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.HIP_R, new THREE.Euler(-0.3, 0, -0.3, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.9, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-1.2, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0.2, -0.3, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.19,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.HIP_R, new THREE.Euler(-0.1, 0, 0.5, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.3, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-1.2, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0.2, 0.4, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0.3, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.FOOT_R, new THREE.Vector3(0, 0, 0.8)]]),
    },
    {
      time: 0.38,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.HIP_R, new THREE.Euler(-0.3, 0, -0.3, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.9, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-1.2, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.FOOT_R, new THREE.Vector3(0, 0, 0)]]),
    },
  ],
};

/**
 * ☷ 곤 (Gon) - Earth Attack 2: Earthquake Stomp (지진발구르기)
 * 
 * Powerful downward stomp targeting opponent's foot or knee.
 * Uses full body weight dropped through leg.
 * 
 * Duration: 320ms
 * 
 * @korean 곤지진발구르기
 */
export const GON_EARTHQUAKE_STOMP: SkeletalAnimation = {
  name: "gon_earthquake_stomp",
  koreanName: "곤 지진발구르기",
  duration: 0.32,
  loop: false,
  type: "attack",
  keyframes: [
    {
      time: 0.0,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.HIP_L, new THREE.Euler(0.8, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-1.6, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-1.0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.16,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.HIP_L, new THREE.Euler(-0.5, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-1.0, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(-0.15, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(-0.1, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.FOOT_L, new THREE.Vector3(0, 0, 0.7)]]),
    },
    {
      time: 0.32,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.HIP_L, new THREE.Euler(-0.3, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.9, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-1.0, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.FOOT_L, new THREE.Vector3(0, 0, 0)]]),
    },
  ],
};

/**
 * ☷ 곤 (Gon) - Earth Attack 3: Rooting Takedown (뿌리내림꺾기)
 * 
 * Low grabbing motion transitioning to ground takedown.
 * Uses low center of gravity to pull opponent down.
 * 
 * Duration: 450ms
 * 
 * @korean 곤뿌리내림꺾기
 */
export const GON_ROOTING_TAKEDOWN: SkeletalAnimation = {
  name: "gon_rooting_takedown",
  koreanName: "곤 뿌리내림꺾기",
  duration: 0.45,
  loop: false,
  type: "attack",
  keyframes: [
    {
      time: 0.0,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(0.3, -0.5, -0.6, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.9, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-1.1, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-1.1, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.18,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(0.5, 0.3, 0.4, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.5, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0.3, 0.2, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-1.2, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-1.2, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_R, new THREE.Vector3(0, 0, 0.7)]]),
    },
    {
      time: 0.32,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(0.6, 0.5, 0.6, "XYZ")],
        [BoneName.SHOULDER_L, new THREE.Euler(0.6, -0.5, -0.6, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0.4, 0.3, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0.2, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.45,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(0.3, -0.5, -0.6, "XYZ")],
        [BoneName.SHOULDER_L, new THREE.Euler(0.3, 0.5, 0.6, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.9, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-1.1, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-1.1, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_R, new THREE.Vector3(0, 0, 0)]]),
    },
  ],
};

// =============================================================================
// Exports and Helper Functions
// =============================================================================

/**
 * Map of all attack animations by stance
 * 
 * Each stance has 3 unique attack animations that reflect its philosophy:
 * - GEON: Bone-breaking strikes with overwhelming force
 * - TAE: Fluid joint manipulation with circular motion
 * - LI: Precise nerve strikes targeting vital points
 * - JIN: Explosive power techniques with sudden bursts
 * - SON: Continuous pressure combo attacks
 * - GAM: Flow-counter attacks that redirect force
 * - GAN: Defensive counter-attacks from solid stance
 * - GON: Grounding/takedown attacks with low center
 * 
 * @korean 자세별공격애니메이션
 */
export const ATTACK_ANIMATIONS_BY_STANCE: ReadonlyMap<
  TrigramStance,
  readonly SkeletalAnimation[]
> = new Map([
  [
    TrigramStance.GEON,
    [
      GEON_BONE_BREAKING_STRIKE_1,
      GEON_THUNDEROUS_UPPERCUT,
      GEON_CRUSHING_ELBOW,
    ] as const,
  ],
  [
    TrigramStance.TAE,
    [
      TAE_WRIST_LOCK_STRIKE,
      TAE_FLOWING_ARM_BAR,
      TAE_SPIRAL_SHOULDER_THROW,
    ] as const,
  ],
  [
    TrigramStance.LI,
    [
      LI_BURNING_FINGER_STRIKE_1,
      LI_SOLAR_PLEXUS_SPEAR,
      LI_PHOENIX_EYE_STRIKE,
    ] as const,
  ],
  [
    TrigramStance.JIN,
    [
      JIN_LIGHTNING_STRAIGHT,
      JIN_SHOCKING_HAMMER_FIST,
      JIN_EXPLOSIVE_KNEE,
    ] as const,
  ],
  [
    TrigramStance.SON,
    [
      SON_WHIRLWIND_COMBO_1,
      SON_PRESSURE_POINT_CHAIN,
      SON_PENETRATING_PALM_RUSH,
    ] as const,
  ],
  [
    TrigramStance.GAM,
    [
      GAM_FLOWING_RIVER_STRIKE,
      GAM_TIDAL_WAVE_PALM,
      GAM_WHIRLPOOL_COUNTER,
    ] as const,
  ],
  [
    TrigramStance.GAN,
    [
      GAN_FORTRESS_COUNTER_STRIKE,
      GAN_AVALANCHE_HAMMER,
      GAN_STONE_WALL_THRUST,
    ] as const,
  ],
  [
    TrigramStance.GON,
    [
      GON_GROUND_SWEEP_STRIKE,
      GON_EARTHQUAKE_STOMP,
      GON_ROOTING_TAKEDOWN,
    ] as const,
  ],
]);

/**
 * All attack animations in a single map for easy lookup
 * 
 * @korean 모든공격애니메이션
 */
export const ALL_ATTACK_ANIMATIONS = new Map<string, SkeletalAnimation>([
  // GEON (Heaven)
  ["geon_bone_breaking_strike_1", GEON_BONE_BREAKING_STRIKE_1],
  ["geon_thunderous_uppercut", GEON_THUNDEROUS_UPPERCUT],
  ["geon_crushing_elbow", GEON_CRUSHING_ELBOW],
  // TAE (Lake)
  ["tae_wrist_lock_strike", TAE_WRIST_LOCK_STRIKE],
  ["tae_flowing_arm_bar", TAE_FLOWING_ARM_BAR],
  ["tae_spiral_shoulder_throw", TAE_SPIRAL_SHOULDER_THROW],
  // LI (Fire)
  ["li_burning_finger_strike_1", LI_BURNING_FINGER_STRIKE_1],
  ["li_solar_plexus_spear", LI_SOLAR_PLEXUS_SPEAR],
  ["li_phoenix_eye_strike", LI_PHOENIX_EYE_STRIKE],
  // JIN (Thunder)
  ["jin_lightning_straight", JIN_LIGHTNING_STRAIGHT],
  ["jin_shocking_hammer_fist", JIN_SHOCKING_HAMMER_FIST],
  ["jin_explosive_knee", JIN_EXPLOSIVE_KNEE],
  // SON (Wind)
  ["son_whirlwind_combo_1", SON_WHIRLWIND_COMBO_1],
  ["son_pressure_point_chain", SON_PRESSURE_POINT_CHAIN],
  ["son_penetrating_palm_rush", SON_PENETRATING_PALM_RUSH],
  // GAM (Water)
  ["gam_flowing_river_strike", GAM_FLOWING_RIVER_STRIKE],
  ["gam_tidal_wave_palm", GAM_TIDAL_WAVE_PALM],
  ["gam_whirlpool_counter", GAM_WHIRLPOOL_COUNTER],
  // GAN (Mountain)
  ["gan_fortress_counter_strike", GAN_FORTRESS_COUNTER_STRIKE],
  ["gan_avalanche_hammer", GAN_AVALANCHE_HAMMER],
  ["gan_stone_wall_thrust", GAN_STONE_WALL_THRUST],
  // GON (Earth)
  ["gon_ground_sweep_strike", GON_GROUND_SWEEP_STRIKE],
  ["gon_earthquake_stomp", GON_EARTHQUAKE_STOMP],
  ["gon_rooting_takedown", GON_ROOTING_TAKEDOWN],
]);

/**
 * Get attack animations for a specific stance
 * 
 * @param stance - Trigram stance
 * @returns Array of 3 attack animations for the stance
 * 
 * @example
 * ```typescript
 * const geonAttacks = getAttackAnimationsForStance(TrigramStance.GEON);
 * console.log(geonAttacks[0].koreanName); // "건 뼈부러뜨리기 1"
 * ```
 * 
 * @korean 자세공격애니메이션가져오기
 */
export function getAttackAnimationsForStance(
  stance: TrigramStance
): readonly SkeletalAnimation[] {
  return ATTACK_ANIMATIONS_BY_STANCE.get(stance) || [];
}

/**
 * Get an attack animation by name
 * 
 * @param name - Animation name
 * @returns Skeletal animation or undefined
 * 
 * @korean 공격애니메이션가져오기
 */
export function getAttackAnimation(
  name: string
): SkeletalAnimation | undefined {
  return ALL_ATTACK_ANIMATIONS.get(name);
}
