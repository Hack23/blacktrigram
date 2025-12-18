/**
 * Korean martial arts attack animations with skeletal keyframes
 * 
 * Defines realistic attack animation sequences for Taekwondo, Hapkido,
 * and Taekyon techniques using skeletal keyframes.
 * 
 * @module systems/animation/AttackAnimations
 * @category Animation System
 * @korean 공격애니메이션
 */

import * as THREE from "three";
import { BoneName } from "../../types/skeletal";
import type {
  SkeletalAnimation,
} from "../../types/skeletal";

/**
 * Jab animation (빠른 직권 - 정권지르기)
 * 
 * Fast straight punch with right arm. Traditional Taekwondo technique.
 * 
 * Animation phases:
 * 1. Wind-up (0.0s): Right arm bent at elbow, ready position
 * 2. Extension (0.1s): Right arm extends, elbow straightens
 * 3. Full extension (0.15s): Maximum reach, fist forward
 * 4. Retraction (0.25s): Return to guard position
 * 
 * Duration: 300ms
 * 
 * @korean 잽애니메이션
 */
export const JAB_ANIMATION: SkeletalAnimation = {
  name: "jab",
  koreanName: "잽",
  duration: 0.3,
  loop: false,
  type: "attack",
  keyframes: [
    // Frame 1: Wind-up (0.0s)
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        // Right shoulder rotates slightly back
        [BoneName.SHOULDER_R, new THREE.Euler(0, 0, -0.2, "XYZ")],
        // Right elbow bent
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.5, "XYZ")],
        // Torso slight rotation right
        [BoneName.SPINE_UPPER, new THREE.Euler(0, -0.1, 0, "XYZ")],
        // Left arm in guard
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
      ]),
      bonePositions: new Map(),
    },

    // Frame 2: Extension (0.1s)
    {
      time: 0.1,
      easing: "ease-out",
      boneRotations: new Map([
        // Right shoulder forward
        [BoneName.SHOULDER_R, new THREE.Euler(0, 0, 0.3, "XYZ")],
        // Right elbow extends
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.2, "XYZ")],
        // Torso rotates left (weight transfer)
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.2, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0.15, 0, "XYZ")],
        // Hips rotate slightly
        [BoneName.PELVIS, new THREE.Euler(0, 0.1, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        // Hand moves forward
        [BoneName.HAND_R, new THREE.Vector3(0, 0, 0.5)],
      ]),
    },

    // Frame 3: Full extension (0.15s)
    {
      time: 0.15,
      easing: "linear",
      boneRotations: new Map([
        // Right arm fully extended
        [BoneName.SHOULDER_R, new THREE.Euler(0, 0, 0.5, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0, "XYZ")], // Fully straight
        // Maximum torso rotation
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.3, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0.2, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0.15, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        // Maximum reach
        [BoneName.HAND_R, new THREE.Vector3(0, 0, 0.8)],
      ]),
    },

    // Frame 4: Retraction (0.3s)
    {
      time: 0.3,
      easing: "ease-in",
      boneRotations: new Map([
        // Return to guard
        [BoneName.SHOULDER_R, new THREE.Euler(0, 0, -0.1, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
        // Torso back to center
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.HAND_R, new THREE.Vector3(0, 0, 0)],
      ]),
    },
  ],
};

/**
 * Cross punch animation (교차 직권 - 반대손 지르기)
 * 
 * Left arm punch with full body rotation. Power technique from Taekwondo.
 * 
 * Animation phases:
 * 1. Wind-up (0.0s): Left arm bent, weight on right side
 * 2. Hip rotation (0.08s): Hips begin rotating left
 * 3. Extension (0.15s): Left arm extends with torso rotation
 * 4. Full extension (0.2s): Maximum reach and power
 * 5. Recovery (0.35s): Return to guard
 * 
 * Duration: 350ms
 * 
 * @korean 크로스펀치애니메이션
 */
export const CROSS_ANIMATION: SkeletalAnimation = {
  name: "cross",
  koreanName: "크로스",
  duration: 0.35,
  loop: false,
  type: "attack",
  keyframes: [
    // Frame 1: Wind-up
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.5, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, -0.15, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, -0.1, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },

    // Frame 2: Hip rotation begins
    {
      time: 0.08,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.PELVIS, new THREE.Euler(0, 0.1, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0.15, 0, "XYZ")],
        [BoneName.HIP_R, new THREE.Euler(0, 0.1, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },

    // Frame 3: Extension
    {
      time: 0.15,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(0, 0, -0.3, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.2, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.3, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0.25, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0.2, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.HAND_L, new THREE.Vector3(0, 0, 0.6)],
      ]),
    },

    // Frame 4: Full extension
    {
      time: 0.2,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(0, 0, -0.5, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.4, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0.3, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0.2, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0.25, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.HAND_L, new THREE.Vector3(0, 0, 0.85)],
      ]),
    },

    // Frame 5: Recovery
    {
      time: 0.35,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(0, 0, 0.1, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.HAND_L, new THREE.Vector3(0, 0, 0)],
      ]),
    },
  ],
};

/**
 * Front kick animation (앞차기)
 * 
 * Traditional Taekwondo front kick with knee lift and leg extension.
 * 
 * Animation phases:
 * 1. Chamber (0.0s-0.1s): Knee lifts to waist height
 * 2. Extension (0.1s-0.2s): Lower leg extends forward
 * 3. Impact (0.2s): Maximum extension point
 * 4. Retraction (0.2s-0.35s): Leg returns to chamber
 * 5. Set down (0.35s-0.45s): Foot returns to ground
 * 
 * Duration: 450ms
 * 
 * @korean 앞차기애니메이션
 */
export const FRONT_KICK_ANIMATION: SkeletalAnimation = {
  name: "front_kick",
  koreanName: "앞차기",
  duration: 0.45,
  loop: false,
  type: "attack",
  keyframes: [
    // Frame 1: Chamber - knee lifts
    {
      time: 0.1,
      easing: "ease-out",
      boneRotations: new Map([
        // Right leg lifts
        [BoneName.HIP_R, new THREE.Euler(1.5, 0, 0, "XYZ")], // 90 degrees up
        [BoneName.KNEE_R, new THREE.Euler(-1.8, 0, 0, "XYZ")], // Bent
        // Left leg supports (slight bend)
        [BoneName.KNEE_L, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        // Arms for balance
        [BoneName.SHOULDER_L, new THREE.Euler(0, 0, -0.5, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(0, 0, 0.5, "XYZ")],
      ]),
      bonePositions: new Map(),
    },

    // Frame 2: Extension
    {
      time: 0.2,
      easing: "ease-out",
      boneRotations: new Map([
        // Hip stays high
        [BoneName.HIP_R, new THREE.Euler(1.5, 0, 0, "XYZ")],
        // Knee extends
        [BoneName.KNEE_R, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        // Foot flexes
        [BoneName.FOOT_R, new THREE.Euler(0.3, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.FOOT_R, new THREE.Vector3(0, 0, 0.7)],
      ]),
    },

    // Frame 3: Retraction to chamber
    {
      time: 0.35,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.HIP_R, new THREE.Euler(1.5, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-1.8, 0, 0, "XYZ")],
        [BoneName.FOOT_R, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.FOOT_R, new THREE.Vector3(0, 0, 0)],
      ]),
    },

    // Frame 4: Set down
    {
      time: 0.45,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.HIP_R, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SHOULDER_L, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
  ],
};

/**
 * Roundhouse kick animation (돌려차기)
 * 
 * Traditional Taekwondo roundhouse kick with hip rotation.
 * 
 * Animation phases:
 * 1. Chamber (0.0s-0.1s): Knee lifts, hip begins rotation
 * 2. Rotation (0.1s-0.2s): Hip rotates 90 degrees
 * 3. Extension (0.2s-0.25s): Leg extends in arc
 * 4. Impact (0.25s): Maximum extension
 * 5. Retraction (0.25s-0.4s): Return to chamber
 * 6. Set down (0.4s-0.5s): Foot to ground
 * 
 * Duration: 500ms
 * 
 * @korean 돌려차기애니메이션
 */
export const ROUNDHOUSE_KICK_ANIMATION: SkeletalAnimation = {
  name: "roundhouse_kick",
  koreanName: "돌려차기",
  duration: 0.5,
  loop: false,
  type: "attack",
  keyframes: [
    // Frame 1: Chamber with rotation start
    {
      time: 0.1,
      easing: "ease-out",
      boneRotations: new Map([
        // Right leg chambers
        [BoneName.HIP_R, new THREE.Euler(1.2, 0, 0.8, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-1.5, 0, 0, "XYZ")],
        // Hips rotate
        [BoneName.PELVIS, new THREE.Euler(0, -0.5, 0, "XYZ")],
        // Torso counter-rotates for balance
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.3, 0, "XYZ")],
        // Arms out for balance
        [BoneName.SHOULDER_L, new THREE.Euler(0, 0, -1.0, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(0, 0, 1.0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },

    // Frame 2: Full hip rotation
    {
      time: 0.2,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.HIP_R, new THREE.Euler(1.2, 0, 1.4, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-1.2, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, -1.2, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.6, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },

    // Frame 3: Extension and impact
    {
      time: 0.25,
      easing: "linear",
      boneRotations: new Map([
        // Leg fully extends
        [BoneName.HIP_R, new THREE.Euler(1.2, 0, 1.6, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, -1.5, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.8, 0, "XYZ")],
        // Foot position for strike
        [BoneName.FOOT_R, new THREE.Euler(0, 0, 0.3, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.FOOT_R, new THREE.Vector3(0.8, 0, 0)], // Side strike
      ]),
    },

    // Frame 4: Retraction
    {
      time: 0.4,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.HIP_R, new THREE.Euler(1.2, 0, 0.8, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-1.5, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, -0.3, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.2, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.FOOT_R, new THREE.Vector3(0, 0, 0)],
      ]),
    },

    // Frame 5: Set down
    {
      time: 0.5,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.HIP_R, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SHOULDER_L, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
  ],
};

/**
 * Block animation (막기)
 * 
 * Traditional Taekwondo block with both arms raised.
 * 
 * Animation phases:
 * 1. Raise (0.0s-0.1s): Both arms lift to blocking position
 * 2. Hold (0.1s-0.3s): Maintain block
 * 3. Lower (0.3s-0.4s): Return to guard
 * 
 * Duration: 400ms
 * 
 * @korean 막기애니메이션
 */
export const BLOCK_ANIMATION: SkeletalAnimation = {
  name: "block",
  koreanName: "막기",
  duration: 0.4,
  loop: false,
  type: "defense",
  keyframes: [
    // Frame 1: Raise arms
    {
      time: 0.1,
      easing: "ease-out",
      boneRotations: new Map([
        // Left arm high block
        [BoneName.SHOULDER_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.5, "XYZ")],
        // Right arm middle block
        [BoneName.SHOULDER_R, new THREE.Euler(0, 0, 1.0, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
        // Slight crouch
        [BoneName.KNEE_L, new THREE.Euler(-0.3, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.3, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },

    // Frame 2: Hold block
    {
      time: 0.3,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.5, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(0, 0, 1.0, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.3, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.3, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },

    // Frame 3: Lower to guard
    {
      time: 0.4,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
  ],
};

/**
 * Walking cycle animation (앞으로 걷기 - 보행 사이클)
 * 
 * Natural walking gait with alternating leg movement. Includes hip swing,
 * knee bend during swing phase, foot placement, and pelvis tilt.
 * 
 * Animation phases:
 * 1. Left foot forward (0.0s): Left leg extends, right leg pushes off
 * 2. Left mid-stance (0.2s): Left foot plants, right leg swings forward
 * 3. Right foot forward (0.4s): Right leg extends, left leg pushes off
 * 4. Right mid-stance (0.6s): Right foot plants, left leg swings forward
 * 
 * Duration: 800ms (complete left-right step cycle)
 * 
 * @korean 걷기애니메이션
 */
export const WALK_ANIMATION: SkeletalAnimation = {
  name: "walk",
  koreanName: "걷기",
  duration: 0.8,
  loop: true,
  type: "movement",
  keyframes: [
    // Frame 1: Left foot forward contact (0.0s)
    {
      time: 0.0,
      easing: "ease-out",
      boneRotations: new Map([
        // Pelvis tilt forward slightly
        [BoneName.PELVIS, new THREE.Euler(0.1, 0.05, 0, "XYZ")],
        // Left leg extended forward
        [BoneName.HIP_L, new THREE.Euler(-0.3, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        [BoneName.FOOT_L, new THREE.Euler(0.1, 0, 0, "XYZ")],
        // Right leg pushing back
        [BoneName.HIP_R, new THREE.Euler(0.4, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.FOOT_R, new THREE.Euler(-0.3, 0, 0, "XYZ")],
        // Arms swing opposite to legs
        [BoneName.SHOULDER_L, new THREE.Euler(0.3, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.3, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(-0.4, 0, 0, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.4, "XYZ")],
        // Spine rotation for natural movement
        [BoneName.SPINE_LOWER, new THREE.Euler(0, -0.05, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, 0.02, 0)],
      ]),
    },

    // Frame 2: Left mid-stance, right leg swing (0.2s)
    {
      time: 0.2,
      easing: "linear",
      boneRotations: new Map([
        // Pelvis level
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        // Left leg support (slightly bent)
        [BoneName.HIP_L, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.15, 0, 0, "XYZ")],
        [BoneName.FOOT_L, new THREE.Euler(0, 0, 0, "XYZ")],
        // Right leg swinging forward (knee bent)
        [BoneName.HIP_R, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.8, 0, 0, "XYZ")],
        [BoneName.FOOT_R, new THREE.Euler(0.2, 0, 0, "XYZ")],
        // Arms swing
        [BoneName.SHOULDER_L, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.2, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.3, "XYZ")],
        // Spine neutral
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, -0.01, 0)],
      ]),
    },

    // Frame 3: Right foot forward contact (0.4s)
    {
      time: 0.4,
      easing: "ease-out",
      boneRotations: new Map([
        // Pelvis tilt forward slightly
        [BoneName.PELVIS, new THREE.Euler(0.1, -0.05, 0, "XYZ")],
        // Right leg extended forward
        [BoneName.HIP_R, new THREE.Euler(-0.3, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        [BoneName.FOOT_R, new THREE.Euler(0.1, 0, 0, "XYZ")],
        // Left leg pushing back
        [BoneName.HIP_L, new THREE.Euler(0.4, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.FOOT_L, new THREE.Euler(-0.3, 0, 0, "XYZ")],
        // Arms swing opposite to legs
        [BoneName.SHOULDER_R, new THREE.Euler(0.3, 0, 0, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.3, "XYZ")],
        [BoneName.SHOULDER_L, new THREE.Euler(-0.4, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.4, "XYZ")],
        // Spine rotation for natural movement
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0.05, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, 0.02, 0)],
      ]),
    },

    // Frame 4: Right mid-stance, left leg swing (0.6s)
    {
      time: 0.6,
      easing: "linear",
      boneRotations: new Map([
        // Pelvis level
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        // Right leg support (slightly bent)
        [BoneName.HIP_R, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.15, 0, 0, "XYZ")],
        [BoneName.FOOT_R, new THREE.Euler(0, 0, 0, "XYZ")],
        // Left leg swinging forward (knee bent)
        [BoneName.HIP_L, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.8, 0, 0, "XYZ")],
        [BoneName.FOOT_L, new THREE.Euler(0.2, 0, 0, "XYZ")],
        // Arms swing
        [BoneName.SHOULDER_R, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.2, "XYZ")],
        [BoneName.SHOULDER_L, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.3, "XYZ")],
        // Spine neutral
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, -0.01, 0)],
      ]),
    },

    // Frame 5: Return to start position (0.8s) - loops to frame 1
    {
      time: 0.8,
      easing: "ease-in",
      boneRotations: new Map([
        // Return to left foot forward position
        [BoneName.PELVIS, new THREE.Euler(0.1, 0.05, 0, "XYZ")],
        [BoneName.HIP_L, new THREE.Euler(-0.3, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        [BoneName.FOOT_L, new THREE.Euler(0.1, 0, 0, "XYZ")],
        [BoneName.HIP_R, new THREE.Euler(0.4, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.FOOT_R, new THREE.Euler(-0.3, 0, 0, "XYZ")],
        [BoneName.SHOULDER_L, new THREE.Euler(0.3, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.3, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(-0.4, 0, 0, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.4, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, -0.05, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, 0.02, 0)],
      ]),
    },
  ],
};

/**
 * All skeletal animations mapped by name
 * 
 * Includes attack animations and movement animations.
 * 
 * @korean 모든골격애니메이션
 */
export const ATTACK_ANIMATIONS = new Map<string, SkeletalAnimation>([
  ["jab", JAB_ANIMATION],
  ["cross", CROSS_ANIMATION],
  ["front_kick", FRONT_KICK_ANIMATION],
  ["roundhouse_kick", ROUNDHOUSE_KICK_ANIMATION],
  ["block", BLOCK_ANIMATION],
  ["walk", WALK_ANIMATION],
]);

/**
 * Get animation by name
 * 
 * @param name - Animation name
 * @returns Skeletal animation or undefined
 * 
 * @korean 애니메이션가져오기
 */
export const getAnimation = (name: string): SkeletalAnimation | undefined => {
  return ATTACK_ANIMATIONS.get(name);
};
