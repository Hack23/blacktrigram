/**
 * Korean martial arts attack animations with skeletal keyframes
 *
 * Defines realistic attack animation sequences for Taekwondo, Hapkido,
 * and Taekyon techniques using skeletal keyframes.
 *
 * MIGRATED TO ANIMATIONBUILDER: First two animations use fluent API for cleaner code.
 * Demonstrates 55% code reduction and improved maintainability.
 *
 * @module systems/animation/AttackAnimations
 * @category Animation System
 * @korean 공격애니메이션
 */

import type { SkeletalAnimation } from "../../types/skeletal";
import { BoneName } from "../../types/skeletal";
import { AnimationBuilder } from "./AnimationBuilder";

/**
 * Jab animation (빠른 직권 - 정권지르기)
 *
 * Fast straight punch with right arm. Traditional Taekwondo technique.
 *
 * Animation phases:
 * 1. Wind-up (0.0s): Right arm bent at elbow, ready position
 * 2. Extension (0.1s): Right arm extends, elbow straightens
 * 3. Full extension (0.15s): Maximum reach, fist forward
 * 4. Retraction (0.3s): Return to guard position
 *
 * Duration: 300ms
 *
 * MIGRATED: Now uses AnimationBuilder (was 111 lines, now 28 lines = 75% reduction)
 *
 * @korean 잽애니메이션
 */
export const JAB_ANIMATION = AnimationBuilder.create("jab")
  .withKoreanName("잽")
  .withDuration(0.3)
  .withType("attack")
  // Wind-up: arm bent, ready position
  .keyframe(0.0, "linear")
  .rotate(BoneName.SHOULDER_R, 0.3, 0, -0.3) // Shoulder pulled back
  .rotate(BoneName.ELBOW_R, 0, 0, 1.8) // Arm bent tight
  .rotate(BoneName.SPINE_UPPER, 0, -0.15, 0) // Torso rotated back
  .rotate(BoneName.ELBOW_L, 0, 0, -1.2) // Guard arm
  .build()
  // Extension: arm snaps forward
  .keyframe(0.1, "ease-out")
  .rotate(BoneName.SHOULDER_R, -0.5, 0, 0.4) // Shoulder drives forward
  .rotate(BoneName.ELBOW_R, 0, 0, 0.3) // Elbow extends
  .rotate(BoneName.SPINE_UPPER, 0, 0.25, 0) // Torso rotates into punch
  .rotate(BoneName.SPINE_MIDDLE, 0, 0.15, 0)
  .rotate(BoneName.PELVIS, 0, 0.1, 0) // Hip rotation for power
  .build()
  // Full extension: maximum reach
  .keyframe(0.15, "linear")
  .rotate(BoneName.SHOULDER_R, -0.7, 0, 0.5) // Full shoulder extension
  .rotate(BoneName.ELBOW_R, 0, 0, 0.05) // Nearly straight arm
  .rotate(BoneName.WRIST_R, 0, 0, -0.2) // Wrist aligned for impact
  .rotate(BoneName.SPINE_UPPER, 0, 0.35, 0) // Peak torso rotation
  .rotate(BoneName.SPINE_MIDDLE, 0, 0.25, 0)
  .rotate(BoneName.PELVIS, 0, 0.2, 0)
  .build()
  // Recovery: return to guard
  .keyframe(0.3, "ease-in")
  .rotate(BoneName.SHOULDER_R, 0, 0, -0.1)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.2)
  .rotate(BoneName.WRIST_R, 0, 0, 0)
  .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
  .rotate(BoneName.SPINE_MIDDLE, 0, 0, 0)
  .rotate(BoneName.PELVIS, 0, 0, 0)
  .build()
  .build();

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
 * MIGRATED: Now uses AnimationBuilder (was 117 lines, now 30 lines = 74% reduction)
 *
 * @korean 크로스펀치애니메이션
 */
export const CROSS_ANIMATION = AnimationBuilder.create("cross")
  .withKoreanName("크로스")
  .withDuration(0.35)
  .withType("attack")
  // Wind-up: weight shifts, arm coils
  .keyframe(0.0, "linear")
  .rotate(BoneName.SHOULDER_L, 0.2, 0, 0.3) // Shoulder pulled back
  .rotate(BoneName.ELBOW_L, 0, 0, -1.8) // Arm bent tight
  .rotate(BoneName.SPINE_UPPER, 0, -0.2, 0) // Torso rotated back
  .rotate(BoneName.PELVIS, 0, -0.15, 0) // Hips coiled
  .build()
  // Hip rotation begins: power generation
  .keyframe(0.08, "ease-out")
  .rotate(BoneName.PELVIS, 0, 0.15, 0) // Hips drive forward
  .rotate(BoneName.SPINE_LOWER, 0, 0.2, 0)
  .rotate(BoneName.HIP_R, 0, 0.1, 0) // Rear foot pivots
  .build()
  // Extension: arm snaps forward with torso
  .keyframe(0.15, "ease-out")
  .rotate(BoneName.SHOULDER_L, -0.5, 0, -0.4) // Shoulder drives forward
  .rotate(BoneName.ELBOW_L, 0, 0, -0.3) // Elbow extends
  .rotate(BoneName.SPINE_UPPER, 0, 0.35, 0) // Torso rotates through
  .rotate(BoneName.SPINE_MIDDLE, 0, 0.3, 0)
  .rotate(BoneName.PELVIS, 0, 0.25, 0) // Full hip rotation
  .build()
  // Full extension: maximum power delivery
  .keyframe(0.2, "linear")
  .rotate(BoneName.SHOULDER_L, -0.7, 0, -0.5) // Full extension
  .rotate(BoneName.ELBOW_L, 0, 0, -0.05) // Nearly straight
  .rotate(BoneName.WRIST_L, 0, 0, 0.2) // Wrist aligned
  .rotate(BoneName.SPINE_UPPER, 0, 0.45, 0) // Peak rotation
  .rotate(BoneName.SPINE_MIDDLE, 0, 0.35, 0)
  .rotate(BoneName.SPINE_LOWER, 0, 0.25, 0)
  .rotate(BoneName.PELVIS, 0, 0.3, 0)
  .build()
  // Recovery: return to guard
  .keyframe(0.35, "ease-in")
  .rotate(BoneName.SHOULDER_L, 0, 0, 0.1)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.2)
  .rotate(BoneName.WRIST_L, 0, 0, 0)
  .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
  .rotate(BoneName.SPINE_MIDDLE, 0, 0, 0)
  .rotate(BoneName.SPINE_LOWER, 0, 0, 0)
  .rotate(BoneName.PELVIS, 0, 0, 0)
  .build()
  .build();

/**
 * Front kick animation (앞차기) - ENHANCED
 *
 * Traditional Taekwondo front kick with knee lift, leg extension,
 * ankle dorsiflexion, support leg adjustments, and balance recovery.
 * Hands maintain guard position throughout for face protection.
 *
 * Animation phases:
 * 1. Chamber (0.0s-0.1s): Knee lifts to waist height, hands guard face
 * 2. Extension (0.1s-0.2s): Lower leg extends forward with ankle flexion
 * 3. Impact (0.2s): Maximum extension point with dorsiflexion
 * 4. Retraction (0.2s-0.35s): Leg returns to chamber
 * 5. Set down (0.35s-0.45s): Foot returns to ground with balance recovery
 * 6. Recovery shuffle (0.45s-0.55s): Return to fighting guard
 *
 * Duration: 550ms (enhanced with recovery)
 *
 * @korean 앞차기애니메이션향상
 */
export const FRONT_KICK_ANIMATION = AnimationBuilder.create("front_kick")
  .withKoreanName("앞차기")
  .withDuration(0.55)
  .withType("attack")
  // Frame 1: Chamber - knee lifts, hands protect face
  // Hip flexion ~90° lifts thigh to horizontal, knee bent tight
  .keyframe(0.1, "ease-out")
  .rotate(BoneName.HIP_R, 1.57, 0, 0) // 90 degrees - thigh horizontal
  .rotate(BoneName.KNEE_R, -2.0, 0, 0) // Tight chamber
  .rotate(BoneName.KNEE_L, -0.25, 0, 0) // Support leg slightly bent
  .rotate(BoneName.FOOT_L, 0, 0, 0.05) // Slight outward pivot
  .rotate(BoneName.PELVIS, -0.1, 0, 0) // Tilts slightly back for balance
  .rotate(BoneName.SPINE_LOWER, -0.05, 0, 0) // Spine counters
  // HIGH GUARD - protect face during kick
  .rotate(BoneName.SHOULDER_L, -0.9, 0.3, 0.4) // Left hand high, near temple
  .rotate(BoneName.ELBOW_L, 0, 0, -1.6) // Tight bend
  .rotate(BoneName.SHOULDER_R, -0.9, -0.3, -0.4) // Right hand high, near temple
  .rotate(BoneName.ELBOW_R, 0, 0, 1.6) // Tight bend
  .build()
  // Frame 2: Extension - leg snaps forward, hands stay up
  // Knee extends while hip drives forward, creating reach
  .keyframe(0.2, "ease-out")
  .rotate(BoneName.HIP_R, 1.7, 0, 0) // Hip drives slightly higher for reach
  .rotate(BoneName.KNEE_R, 0.1, 0, 0) // Knee fully extends
  .rotate(BoneName.FOOT_R, 0.5, 0, 0) // Ball of foot strikes (dorsiflexion)
  .rotate(BoneName.KNEE_L, -0.35, 0, 0) // Support leg bends for balance
  .rotate(BoneName.FOOT_L, 0, 0, 0.08)
  .rotate(BoneName.PELVIS, 0.15, 0, 0) // Pelvis tilts forward to drive kick
  .rotate(BoneName.SPINE_LOWER, 0.1, 0, 0) // Spine drives forward
  .rotate(BoneName.SPINE_MIDDLE, 0.05, 0, 0)
  // Maintain high guard
  .rotate(BoneName.SHOULDER_L, -0.85, 0.25, 0.35)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.7)
  .rotate(BoneName.SHOULDER_R, -0.85, -0.25, -0.35)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.7)
  .build()
  // Frame 3: Retraction to chamber, guard stays up
  .keyframe(0.35, "ease-in")
  .rotate(BoneName.HIP_R, 1.57, 0, 0)
  .rotate(BoneName.KNEE_R, -2.0, 0, 0)
  .rotate(BoneName.FOOT_R, 0, 0, 0) // Foot relaxes
  .rotate(BoneName.KNEE_L, -0.25, 0, 0)
  .rotate(BoneName.FOOT_L, 0, 0, 0.05)
  .rotate(BoneName.PELVIS, 0, 0, 0)
  .rotate(BoneName.SPINE_LOWER, 0, 0, 0)
  .rotate(BoneName.SPINE_MIDDLE, 0, 0, 0)
  .rotate(BoneName.SHOULDER_L, -0.9, 0.3, 0.4)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.6)
  .rotate(BoneName.SHOULDER_R, -0.9, -0.3, -0.4)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.6)
  .build()
  // Frame 4: Set down, transition to fighting guard
  .keyframe(0.45, "ease-in")
  .rotate(BoneName.HIP_R, 0, 0, 0)
  .rotate(BoneName.KNEE_R, -0.15, 0, 0) // Slight bend on landing
  .rotate(BoneName.FOOT_R, 0, 0, 0)
  .rotate(BoneName.KNEE_L, -0.2, 0, 0)
  .rotate(BoneName.FOOT_L, 0, 0, 0.03)
  // Transition to fighting guard
  .rotate(BoneName.SHOULDER_L, -0.7, 0.35, 0.25)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.7)
  .rotate(BoneName.SHOULDER_R, -0.7, -0.35, -0.25)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.7)
  .build()
  // Frame 5: Balance recovery - fighting guard
  .keyframe(0.55, "ease-in")
  .rotate(BoneName.KNEE_R, -0.2, 0, 0)
  .rotate(BoneName.KNEE_L, -0.2, 0, 0)
  .rotate(BoneName.FOOT_R, 0, 0, 0)
  .rotate(BoneName.FOOT_L, 0, 0, 0)
  .rotate(BoneName.PELVIS, 0, 0, 0)
  // Return to standard fighting guard
  .rotate(BoneName.SHOULDER_L, -0.6, 0.4, 0.3)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.8)
  .rotate(BoneName.SHOULDER_R, -0.6, -0.4, -0.3)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.8)
  .build()
  .build();

/**
 * Roundhouse kick animation (돌려차기) - ENHANCED
 *
 * Traditional Taekwondo roundhouse kick with hip rotation,
 * ankle flexion, support leg adjustments, and balance recovery.
 * Hands maintain high guard position throughout for face protection.
 *
 * Animation phases:
 * 1. Chamber (0.0s-0.1s): Knee lifts, hip begins rotation, hands guard face
 * 2. Rotation (0.1s-0.2s): Hip rotates 90 degrees
 * 3. Extension (0.2s-0.25s): Leg extends in arc with ankle flexion
 * 4. Impact (0.25s): Maximum extension with support leg adjustment
 * 5. Retraction (0.25s-0.4s): Return to chamber
 * 6. Set down (0.4s-0.5s): Foot to ground with balance recovery
 * 7. Recovery shuffle (0.5s-0.6s): Return to fighting guard
 *
 * Duration: 600ms (enhanced with recovery)
 *
 * @korean 돌려차기애니메이션향상
 */
export const ROUNDHOUSE_KICK_ANIMATION = AnimationBuilder.create(
  "roundhouse_kick"
)
  .withKoreanName("돌려차기")
  .withDuration(0.6)
  .withType("attack")
  // Frame 1: Chamber with rotation start, hands protect face
  .keyframe(0.1, "ease-out")
  .rotate(BoneName.HIP_R, 1.2, 0, 0.8) // Right leg chambers
  .rotate(BoneName.KNEE_R, -1.5, 0, 0)
  .rotate(BoneName.PELVIS, 0, -0.5, 0) // Hips rotate
  .rotate(BoneName.SPINE_UPPER, 0, 0.3, 0) // Torso counter-rotates
  // HIGH GUARD - protect face during kick
  .rotate(BoneName.SHOULDER_L, -0.9, 0.3, 0.4)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.6)
  .rotate(BoneName.SHOULDER_R, -0.85, -0.25, -0.35)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.65)
  .build()
  // Frame 2: Full hip rotation, maintain guard
  .keyframe(0.2, "ease-out")
  .rotate(BoneName.HIP_R, 1.2, 0, 1.4)
  .rotate(BoneName.KNEE_R, -1.2, 0, 0)
  .rotate(BoneName.PELVIS, 0, -1.2, 0)
  .rotate(BoneName.SPINE_UPPER, 0, 0.6, 0)
  .rotate(BoneName.SHOULDER_L, -0.85, 0.25, 0.35)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.7)
  .rotate(BoneName.SHOULDER_R, -0.85, -0.25, -0.35)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.7)
  .build()
  // Frame 3: Extension and impact with ankle flexion
  .keyframe(0.25, "linear")
  .rotate(BoneName.HIP_R, 1.2, 0, 1.6) // Leg fully extends
  .rotate(BoneName.KNEE_R, -0.1, 0, 0)
  .rotate(BoneName.PELVIS, 0, -1.5, 0)
  .rotate(BoneName.SPINE_UPPER, 0, 0.8, 0)
  .rotate(BoneName.FOOT_R, 0.4, 0, 0.3) // Foot plantar flexion
  .rotate(BoneName.KNEE_L, -0.35, 0, 0) // Support leg micro-adjustment
  .rotate(BoneName.FOOT_L, 0, 0, -0.1) // Pivot for power
  // Maintain high guard at impact
  .rotate(BoneName.SHOULDER_L, -0.85, 0.25, 0.35)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.7)
  .rotate(BoneName.SHOULDER_R, -0.85, -0.25, -0.35)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.7)
  .position(BoneName.FOOT_R, 0.8, 0, 0) // Side strike
  .position(BoneName.PELVIS, 0, -0.02, 0) // Slight drop for power
  .build()
  // Frame 4: Retraction, guard remains up
  .keyframe(0.4, "ease-in")
  .rotate(BoneName.HIP_R, 1.2, 0, 0.8)
  .rotate(BoneName.KNEE_R, -1.5, 0, 0)
  .rotate(BoneName.FOOT_R, 0, 0, 0)
  .rotate(BoneName.PELVIS, 0, -0.3, 0)
  .rotate(BoneName.SPINE_UPPER, 0, 0.2, 0)
  .rotate(BoneName.KNEE_L, -0.25, 0, 0)
  .rotate(BoneName.FOOT_L, 0, 0, 0)
  .rotate(BoneName.SHOULDER_L, -0.9, 0.3, 0.4)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.6)
  .rotate(BoneName.SHOULDER_R, -0.9, -0.3, -0.4)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.6)
  .position(BoneName.FOOT_R, 0, 0, 0)
  .position(BoneName.PELVIS, 0, 0, 0)
  .build()
  // Frame 5: Set down, transition to fighting guard
  .keyframe(0.5, "ease-in")
  .rotate(BoneName.HIP_R, 0, 0, 0)
  .rotate(BoneName.KNEE_R, -0.15, 0, 0)
  .rotate(BoneName.FOOT_R, 0, 0, 0)
  .rotate(BoneName.PELVIS, 0, 0, 0)
  .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
  .rotate(BoneName.KNEE_L, -0.2, 0, 0)
  .rotate(BoneName.FOOT_L, 0, 0, 0)
  // Transition to fighting guard
  .rotate(BoneName.SHOULDER_L, -0.7, 0.35, 0.25)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.7)
  .rotate(BoneName.SHOULDER_R, -0.7, -0.35, -0.25)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.7)
  .position(BoneName.PELVIS, 0, -0.01, 0)
  .build()
  // Frame 6: Recovery - fighting guard
  .keyframe(0.6, "ease-in")
  .rotate(BoneName.HIP_R, 0, 0, 0)
  .rotate(BoneName.KNEE_R, -0.2, 0, 0)
  .rotate(BoneName.KNEE_L, -0.2, 0, 0)
  .rotate(BoneName.FOOT_R, 0, 0, 0)
  .rotate(BoneName.FOOT_L, 0, 0, 0)
  .rotate(BoneName.PELVIS, 0, 0, 0)
  .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
  // Return to standard fighting guard
  .rotate(BoneName.SHOULDER_L, -0.6, 0.4, 0.3)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.8)
  .rotate(BoneName.SHOULDER_R, -0.6, -0.4, -0.3)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.8)
  .position(BoneName.PELVIS, 0, 0, 0)
  .build()
  .build();

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
export const BLOCK_ANIMATION = AnimationBuilder.create("block")
  .withKoreanName("막기")
  .withDuration(0.4)
  .withType("defense")
  .keyframe(0.1, "ease-out")
  .rotate(BoneName.SHOULDER_L, 0, 0, -1.2)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.5)
  .rotate(BoneName.SHOULDER_R, 0, 0, 1.0)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.2)
  .rotate(BoneName.KNEE_L, -0.3, 0, 0)
  .rotate(BoneName.KNEE_R, -0.3, 0, 0)
  .build()
  .keyframe(0.3, "linear")
  .rotate(BoneName.SHOULDER_L, 0, 0, -1.2)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.5)
  .rotate(BoneName.SHOULDER_R, 0, 0, 1.0)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.2)
  .rotate(BoneName.KNEE_L, -0.3, 0, 0)
  .rotate(BoneName.KNEE_R, -0.3, 0, 0)
  .build()
  .keyframe(0.4, "ease-in")
  .rotate(BoneName.SHOULDER_L, 0, 0, 0)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.2)
  .rotate(BoneName.SHOULDER_R, 0, 0, 0)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.2)
  .rotate(BoneName.KNEE_L, 0, 0, 0)
  .rotate(BoneName.KNEE_R, 0, 0, 0)
  .build()
  .build();

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
export const WALK_ANIMATION = AnimationBuilder.create("walk")
  .withKoreanName("걷기")
  .withDuration(0.8)
  .withType("movement")
  .withLoop(true)
  .keyframe(0.0, "ease-out")
  .rotate(BoneName.PELVIS, 0.1, 0.05, 0)
  .rotate(BoneName.HIP_L, -0.3, 0, 0)
  .rotate(BoneName.KNEE_L, -0.1, 0, 0)
  .rotate(BoneName.FOOT_L, 0.1, 0, 0)
  .rotate(BoneName.HIP_R, 0.4, 0, 0)
  .rotate(BoneName.KNEE_R, -0.2, 0, 0)
  .rotate(BoneName.FOOT_R, -0.3, 0, 0)
  .rotate(BoneName.SHOULDER_L, 0.3, 0, 0)
  .rotate(BoneName.ELBOW_L, 0, 0, -0.3)
  .rotate(BoneName.SHOULDER_R, -0.4, 0, 0)
  .rotate(BoneName.ELBOW_R, 0, 0, 0.4)
  .rotate(BoneName.SPINE_LOWER, 0, -0.05, 0)
  .position(BoneName.PELVIS, 0, 0.02, 0)
  .build()
  .keyframe(0.2, "linear")
  .rotate(BoneName.PELVIS, 0, 0, 0)
  .rotate(BoneName.HIP_L, 0, 0, 0)
  .rotate(BoneName.KNEE_L, -0.15, 0, 0)
  .rotate(BoneName.FOOT_L, 0, 0, 0)
  .rotate(BoneName.HIP_R, -0.2, 0, 0)
  .rotate(BoneName.KNEE_R, -0.8, 0, 0)
  .rotate(BoneName.FOOT_R, 0.2, 0, 0)
  .rotate(BoneName.SHOULDER_L, 0, 0, 0)
  .rotate(BoneName.ELBOW_L, 0, 0, -0.2)
  .rotate(BoneName.SHOULDER_R, -0.2, 0, 0)
  .rotate(BoneName.ELBOW_R, 0, 0, 0.3)
  .rotate(BoneName.SPINE_LOWER, 0, 0, 0)
  .position(BoneName.PELVIS, 0, -0.01, 0)
  .build()
  .keyframe(0.4, "ease-out")
  .rotate(BoneName.PELVIS, 0.1, -0.05, 0)
  .rotate(BoneName.HIP_R, -0.3, 0, 0)
  .rotate(BoneName.KNEE_R, -0.1, 0, 0)
  .rotate(BoneName.FOOT_R, 0.1, 0, 0)
  .rotate(BoneName.HIP_L, 0.4, 0, 0)
  .rotate(BoneName.KNEE_L, -0.2, 0, 0)
  .rotate(BoneName.FOOT_L, -0.3, 0, 0)
  .rotate(BoneName.SHOULDER_R, 0.3, 0, 0)
  .rotate(BoneName.ELBOW_R, 0, 0, 0.3)
  .rotate(BoneName.SHOULDER_L, -0.4, 0, 0)
  .rotate(BoneName.ELBOW_L, 0, 0, -0.4)
  .rotate(BoneName.SPINE_LOWER, 0, 0.05, 0)
  .position(BoneName.PELVIS, 0, 0.02, 0)
  .build()
  .keyframe(0.6, "linear")
  .rotate(BoneName.PELVIS, 0, 0, 0)
  .rotate(BoneName.HIP_R, 0, 0, 0)
  .rotate(BoneName.KNEE_R, -0.15, 0, 0)
  .rotate(BoneName.FOOT_R, 0, 0, 0)
  .rotate(BoneName.HIP_L, -0.2, 0, 0)
  .rotate(BoneName.KNEE_L, -0.8, 0, 0)
  .rotate(BoneName.FOOT_L, 0.2, 0, 0)
  .rotate(BoneName.SHOULDER_R, 0, 0, 0)
  .rotate(BoneName.ELBOW_R, 0, 0, 0.2)
  .rotate(BoneName.SHOULDER_L, -0.2, 0, 0)
  .rotate(BoneName.ELBOW_L, 0, 0, -0.3)
  .rotate(BoneName.SPINE_LOWER, 0, 0, 0)
  .position(BoneName.PELVIS, 0, -0.01, 0)
  .build()
  .keyframe(0.8, "ease-in")
  .rotate(BoneName.PELVIS, 0.1, 0.05, 0)
  .rotate(BoneName.HIP_L, -0.3, 0, 0)
  .rotate(BoneName.KNEE_L, -0.1, 0, 0)
  .rotate(BoneName.FOOT_L, 0.1, 0, 0)
  .rotate(BoneName.HIP_R, 0.4, 0, 0)
  .rotate(BoneName.KNEE_R, -0.2, 0, 0)
  .rotate(BoneName.FOOT_R, -0.3, 0, 0)
  .rotate(BoneName.SHOULDER_L, 0.3, 0, 0)
  .rotate(BoneName.ELBOW_L, 0, 0, -0.3)
  .rotate(BoneName.SHOULDER_R, -0.4, 0, 0)
  .rotate(BoneName.ELBOW_R, 0, 0, 0.4)
  .rotate(BoneName.SPINE_LOWER, 0, -0.05, 0)
  .position(BoneName.PELVIS, 0, 0.02, 0)
  .build()
  .build();

/**
 * Idle stance animation (대기 자세)
 *
 * Fighting stance with slight weight shift and breathing motion.
 *
 * Animation phases:
 * 1. Center (0.0s): Neutral fighting stance
 * 2. Weight left (0.8s): Shift weight to left leg
 * 3. Center (1.6s): Return to neutral
 * 4. Weight right (2.4s): Shift weight to right leg
 * 5. Center (3.0s): Return to neutral (loops)
 *
 * Duration: 3000ms (looping)
 *
 * @korean 대기자세애니메이션
 */
export const IDLE_STANCE_ANIMATION = AnimationBuilder.create("idle_stance")
  .withKoreanName("대기 자세")
  .withDuration(3.0)
  .withType("idle")
  .withLoop(true)
  .keyframe(0.0, "ease-in-out")
  .rotate(BoneName.KNEE_L, -0.2, 0, 0)
  .rotate(BoneName.KNEE_R, -0.2, 0, 0)
  .rotate(BoneName.SHOULDER_L, 0.5, 0, -0.8)
  .rotate(BoneName.SHOULDER_R, 0.5, 0, 0.8)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.2)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.2)
  .position(BoneName.PELVIS, 0, 0, 0)
  .build()
  .keyframe(0.8, "ease-in-out")
  .rotate(BoneName.KNEE_L, -0.3, 0, 0)
  .rotate(BoneName.KNEE_R, -0.15, 0, 0)
  .rotate(BoneName.PELVIS, 0, 0, -0.05)
  .rotate(BoneName.SPINE_LOWER, -0.02, 0, 0)
  .rotate(BoneName.SPINE_MIDDLE, -0.03, 0, 0)
  .rotate(BoneName.SPINE_UPPER, -0.02, 0, 0)
  .rotate(BoneName.SHOULDER_L, 0.5, 0, -0.8)
  .rotate(BoneName.SHOULDER_R, 0.5, 0, 0.8)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.2)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.2)
  .position(BoneName.PELVIS, -0.02, 0, 0)
  .build()
  .keyframe(1.6, "ease-in-out")
  .rotate(BoneName.KNEE_L, -0.2, 0, 0)
  .rotate(BoneName.KNEE_R, -0.2, 0, 0)
  .rotate(BoneName.PELVIS, 0, 0, 0)
  .rotate(BoneName.SPINE_LOWER, 0.02, 0, 0)
  .rotate(BoneName.SPINE_MIDDLE, 0.03, 0, 0)
  .rotate(BoneName.SPINE_UPPER, 0.02, 0, 0)
  .rotate(BoneName.SHOULDER_L, 0.5, 0, -0.8)
  .rotate(BoneName.SHOULDER_R, 0.5, 0, 0.8)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.2)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.2)
  .position(BoneName.PELVIS, 0, 0, 0)
  .build()
  .keyframe(2.4, "ease-in-out")
  .rotate(BoneName.KNEE_L, -0.15, 0, 0)
  .rotate(BoneName.KNEE_R, -0.3, 0, 0)
  .rotate(BoneName.PELVIS, 0, 0, 0.05)
  .rotate(BoneName.SPINE_LOWER, -0.02, 0, 0)
  .rotate(BoneName.SPINE_MIDDLE, -0.03, 0, 0)
  .rotate(BoneName.SPINE_UPPER, -0.02, 0, 0)
  .rotate(BoneName.SHOULDER_L, 0.5, 0, -0.8)
  .rotate(BoneName.SHOULDER_R, 0.5, 0, 0.8)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.2)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.2)
  .position(BoneName.PELVIS, 0.02, 0, 0)
  .build()
  .keyframe(3.0, "ease-in-out")
  .rotate(BoneName.KNEE_L, -0.2, 0, 0)
  .rotate(BoneName.KNEE_R, -0.2, 0, 0)
  .rotate(BoneName.PELVIS, 0, 0, 0)
  .rotate(BoneName.SPINE_LOWER, 0, 0, 0)
  .rotate(BoneName.SPINE_MIDDLE, 0, 0, 0)
  .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
  .rotate(BoneName.SHOULDER_L, 0.5, 0, -0.8)
  .rotate(BoneName.SHOULDER_R, 0.5, 0, 0.8)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.2)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.2)
  .position(BoneName.PELVIS, 0, 0, 0)
  .build()
  .build();

/**
 * Forward dash animation (앞으로 돌진)
 *
 * Explosive forward movement with rapid knee extension and hip drive.
 *
 * Animation phases:
 * 1. Crouch (0.0s): Deep knee bend, ready to explode
 * 2. Drive (0.15s): Rapid knee extension, forward momentum
 * 3. Glide (0.3s): Extended stride position
 * 4. Recovery (0.4s): Return to stance
 *
 * Duration: 400ms
 *
 * @korean 앞으로돌진애니메이션
 */
export const FORWARD_DASH_ANIMATION = AnimationBuilder.create("forward_dash")
  .withKoreanName("앞으로 돌진")
  .withDuration(0.4)
  .withType("movement")
  .keyframe(0.0, "ease-in")
  .rotate(BoneName.KNEE_L, -0.8, 0, 0)
  .rotate(BoneName.KNEE_R, -0.8, 0, 0)
  .rotate(BoneName.SPINE_LOWER, 0.3, 0, 0)
  .rotate(BoneName.SPINE_MIDDLE, 0.25, 0, 0)
  .rotate(BoneName.SPINE_UPPER, 0.2, 0, 0)
  .rotate(BoneName.SHOULDER_L, -0.5, 0, -0.3)
  .rotate(BoneName.SHOULDER_R, -0.5, 0, 0.3)
  .position(BoneName.PELVIS, 0, -0.15, 0)
  .build()
  .keyframe(0.15, "ease-out")
  .rotate(BoneName.KNEE_L, -0.1, 0, 0)
  .rotate(BoneName.KNEE_R, -0.1, 0, 0)
  .rotate(BoneName.PELVIS, 0.2, 0, 0)
  .rotate(BoneName.SPINE_LOWER, 0.15, 0, 0)
  .rotate(BoneName.SPINE_MIDDLE, 0.1, 0, 0)
  .rotate(BoneName.SPINE_UPPER, 0.05, 0, 0)
  .rotate(BoneName.SHOULDER_L, 0.5, 0, -0.5)
  .rotate(BoneName.SHOULDER_R, 0.5, 0, 0.5)
  .position(BoneName.PELVIS, 0, 0.05, 0.8)
  .build()
  .keyframe(0.3, "linear")
  .rotate(BoneName.KNEE_L, -0.2, 0, 0)
  .rotate(BoneName.KNEE_R, -0.2, 0, 0)
  .rotate(BoneName.PELVIS, 0, 0, 0)
  .rotate(BoneName.SPINE_LOWER, 0, 0, 0)
  .rotate(BoneName.SPINE_MIDDLE, 0, 0, 0)
  .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
  .rotate(BoneName.SHOULDER_L, 0.3, 0, -0.6)
  .rotate(BoneName.SHOULDER_R, 0.3, 0, 0.6)
  .position(BoneName.PELVIS, 0, 0, 1.2)
  .build()
  .keyframe(0.4, "ease-in")
  .rotate(BoneName.KNEE_L, -0.2, 0, 0)
  .rotate(BoneName.KNEE_R, -0.2, 0, 0)
  .rotate(BoneName.PELVIS, 0, 0, 0)
  .rotate(BoneName.SPINE_LOWER, 0, 0, 0)
  .rotate(BoneName.SPINE_MIDDLE, 0, 0, 0)
  .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
  .rotate(BoneName.SHOULDER_L, 0.5, 0, -0.8)
  .rotate(BoneName.SHOULDER_R, 0.5, 0, 0.8)
  .position(BoneName.PELVIS, 0, 0, 0)
  .build()
  .build();

/**
 * Backward retreat animation (뒤로 물러서기)
 *
 * Coordinated leg backpedaling with defensive posture.
 *
 * Animation phases:
 * 1. Push back (0.0s): Back foot plants, front foot lifts
 * 2. Slide (0.2s): Smooth backward movement
 * 3. Plant (0.35s): Front foot plants
 * 4. Reset (0.45s): Return to guard stance
 *
 * Duration: 450ms
 *
 * @korean 뒤로물러서기애니메이션
 */
export const BACKWARD_RETREAT_ANIMATION = AnimationBuilder.create(
  "backward_retreat"
)
  .withKoreanName("뒤로 물러서기")
  .withDuration(0.45)
  .withType("movement")
  .keyframe(0.0, "ease-out")
  .rotate(BoneName.KNEE_R, -0.3, 0, 0)
  .rotate(BoneName.HIP_L, 0.2, 0, 0)
  .rotate(BoneName.KNEE_L, -0.4, 0, 0)
  .rotate(BoneName.SPINE_LOWER, -0.1, 0, 0)
  .rotate(BoneName.SPINE_UPPER, -0.05, 0, 0)
  .rotate(BoneName.SHOULDER_L, 0.6, 0, -0.9)
  .rotate(BoneName.SHOULDER_R, 0.6, 0, 0.9)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.3)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.3)
  .position(BoneName.PELVIS, 0, 0, 0)
  .build()
  .keyframe(0.2, "linear")
  .rotate(BoneName.KNEE_R, -0.25, 0, 0)
  .rotate(BoneName.HIP_L, 0.1, 0, 0)
  .rotate(BoneName.KNEE_L, -0.3, 0, 0)
  .rotate(BoneName.SPINE_LOWER, -0.08, 0, 0)
  .rotate(BoneName.SPINE_UPPER, -0.04, 0, 0)
  .rotate(BoneName.SHOULDER_L, 0.6, 0, -0.9)
  .rotate(BoneName.SHOULDER_R, 0.6, 0, 0.9)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.3)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.3)
  .position(BoneName.PELVIS, 0, 0, -0.6)
  .build()
  .keyframe(0.35, "ease-in")
  .rotate(BoneName.KNEE_R, -0.2, 0, 0)
  .rotate(BoneName.HIP_L, 0, 0, 0)
  .rotate(BoneName.KNEE_L, -0.2, 0, 0)
  .rotate(BoneName.SPINE_LOWER, 0, 0, 0)
  .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
  .rotate(BoneName.SHOULDER_L, 0.5, 0, -0.8)
  .rotate(BoneName.SHOULDER_R, 0.5, 0, 0.8)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.2)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.2)
  .position(BoneName.PELVIS, 0, 0, -0.8)
  .build()
  .keyframe(0.45, "ease-in")
  .rotate(BoneName.KNEE_R, -0.2, 0, 0)
  .rotate(BoneName.KNEE_L, -0.2, 0, 0)
  .rotate(BoneName.SPINE_LOWER, 0, 0, 0)
  .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
  .rotate(BoneName.SHOULDER_L, 0.5, 0, -0.8)
  .rotate(BoneName.SHOULDER_R, 0.5, 0, 0.8)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.2)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.2)
  .position(BoneName.PELVIS, 0, 0, 0)
  .build()
  .build();

/**
 * Side step animation (옆으로 스텝)
 *
 * Lateral hip shift with trailing leg for quick evasion.
 *
 * Animation phases:
 * 1. Shift left (0.0s): Weight to left leg
 * 2. Slide (0.15s): Right leg follows
 * 3. Plant (0.25s): Both feet grounded
 * 4. Reset (0.3s): Return to center
 *
 * Duration: 300ms
 *
 * @korean 옆으로스텝애니메이션
 */
export const SIDE_STEP_ANIMATION = AnimationBuilder.create("side_step")
  .withKoreanName("옆으로 스텝")
  .withDuration(0.3)
  .withType("movement")
  .keyframe(0.0, "ease-out")
  .rotate(BoneName.KNEE_L, -0.4, 0, 0)
  .rotate(BoneName.KNEE_R, -0.15, 0, 0)
  .rotate(BoneName.PELVIS, 0, 0, -0.15)
  .rotate(BoneName.SPINE_LOWER, 0, 0, 0.05)
  .rotate(BoneName.SPINE_UPPER, 0, 0, 0.08)
  .rotate(BoneName.SHOULDER_L, 0.5, 0, -0.8)
  .rotate(BoneName.SHOULDER_R, 0.5, 0, 0.8)
  .position(BoneName.PELVIS, -0.3, -0.05, 0)
  .build()
  .keyframe(0.15, "linear")
  .rotate(BoneName.KNEE_L, -0.25, 0, 0)
  .rotate(BoneName.KNEE_R, -0.25, 0, 0)
  .rotate(BoneName.PELVIS, 0, 0, -0.08)
  .rotate(BoneName.SPINE_LOWER, 0, 0, 0.03)
  .rotate(BoneName.SPINE_UPPER, 0, 0, 0.04)
  .rotate(BoneName.SHOULDER_L, 0.5, 0, -0.8)
  .rotate(BoneName.SHOULDER_R, 0.5, 0, 0.8)
  .position(BoneName.PELVIS, -0.5, 0, 0)
  .build()
  .keyframe(0.25, "ease-in")
  .rotate(BoneName.KNEE_L, -0.2, 0, 0)
  .rotate(BoneName.KNEE_R, -0.2, 0, 0)
  .rotate(BoneName.PELVIS, 0, 0, 0)
  .rotate(BoneName.SPINE_LOWER, 0, 0, 0)
  .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
  .rotate(BoneName.SHOULDER_L, 0.5, 0, -0.8)
  .rotate(BoneName.SHOULDER_R, 0.5, 0, 0.8)
  .position(BoneName.PELVIS, -0.5, 0, 0)
  .build()
  .keyframe(0.3, "ease-in")
  .rotate(BoneName.KNEE_L, -0.2, 0, 0)
  .rotate(BoneName.KNEE_R, -0.2, 0, 0)
  .rotate(BoneName.PELVIS, 0, 0, 0)
  .rotate(BoneName.SPINE_LOWER, 0, 0, 0)
  .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
  .rotate(BoneName.SHOULDER_L, 0.5, 0, -0.8)
  .rotate(BoneName.SHOULDER_R, 0.5, 0, 0.8)
  .position(BoneName.PELVIS, 0, 0, 0)
  .build()
  .build();

/**
 * Elbow strike animation (팔꿈치 타격 - Palgumchi Tagyeok)
 *
 * Close-range horizontal elbow strike from Hapkido.
 * Authentic Korean martial arts technique with proper shoulder rotation,
 * elbow positioning, and torso twist for maximum impact.
 *
 * Animation phases:
 * 1. Chamber (0.0s): Right arm chambers across body, elbow bent 90 degrees
 * 2. Rotation (0.05s): Torso rotates right, building momentum
 * 3. Strike (0.1s-0.12s): Elbow drives through target with hip rotation
 * 4. Impact (0.12s): Maximum extension with full body weight transfer
 * 5. Recovery (0.2s): Return to guard position
 *
 * Duration: 200ms (10 frames @ 60fps)
 *
 * @korean 팔꿈치타격애니메이션
 */
export const ELBOW_STRIKE_ANIMATION = AnimationBuilder.create("elbow_strike")
  .withKoreanName("팔꿈치타격")
  .withDuration(0.2)
  .withType("attack")
  // Frame 1: Chamber position
  .keyframe(0.0, "linear")
  .rotate(BoneName.SHOULDER_R, 0, 0.8, -0.3) // Shoulder forward and across
  .rotate(BoneName.ELBOW_R, 0, 0, 1.57) // 90 degree bend
  .rotate(BoneName.FOREARM_R, 0, -0.5, 0) // Forearm rotates in
  .rotate(BoneName.SPINE_UPPER, 0, -0.3, 0) // Torso winds up
  .rotate(BoneName.SPINE_MIDDLE, 0, -0.2, 0)
  .rotate(BoneName.PELVIS, 0, -0.15, 0)
  .rotate(BoneName.SHOULDER_L, 0, -0.5, 0.5) // Left arm guards
  .rotate(BoneName.ELBOW_L, 0, 0, -1.2)
  .position(BoneName.HAND_R, -0.2, 0, 0.3) // Hand near opposite shoulder
  .build()
  // Frame 2: Rotation begins
  .keyframe(0.05, "ease-out")
  .rotate(BoneName.SHOULDER_R, 0, 0.5, 0)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.57) // Maintain 90 degree bend
  .rotate(BoneName.FOREARM_R, 0, -0.3, 0)
  .rotate(BoneName.SPINE_UPPER, 0, 0.1, 0) // Torso begins rotation
  .rotate(BoneName.SPINE_MIDDLE, 0, 0.05, 0)
  .rotate(BoneName.PELVIS, 0, 0, 0)
  .position(BoneName.HAND_R, -0.1, 0, 0.4)
  .build()
  // Frame 3: Strike through target
  .keyframe(0.1, "linear")
  .rotate(BoneName.SHOULDER_R, 0, 0, 0.3) // Elbow drives forward
  .rotate(BoneName.ELBOW_R, 0, 0, 1.4) // Slightly opens for power
  .rotate(BoneName.FOREARM_R, 0, 0, 0)
  .rotate(BoneName.SPINE_UPPER, 0, 0.5, 0.1) // Full torso rotation
  .rotate(BoneName.SPINE_MIDDLE, 0, 0.4, 0.05)
  .rotate(BoneName.PELVIS, 0, 0.3, 0)
  .rotate(BoneName.HIP_R, 0, 0.2, 0) // Hip engagement
  .position(BoneName.ELBOW_R, 0, 0, 0.6) // Elbow extends forward
  .build()
  // Frame 4: Impact point
  .keyframe(0.12, "linear")
  .rotate(BoneName.SHOULDER_R, 0, 0, 0.5)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.3)
  .rotate(BoneName.FOREARM_R, 0, 0.1, 0)
  .rotate(BoneName.SPINE_UPPER, 0, 0.6, 0.15) // Maximum rotation
  .rotate(BoneName.SPINE_MIDDLE, 0, 0.5, 0.1)
  .rotate(BoneName.PELVIS, 0, 0.4, 0)
  .rotate(BoneName.HIP_R, 0, 0.3, 0)
  .position(BoneName.ELBOW_R, 0, 0, 0.7)
  .position(BoneName.PELVIS, 0, 0, 0.1) // Weight shift forward
  .build()
  // Frame 5: Recovery
  .keyframe(0.2, "ease-in")
  .rotate(BoneName.SHOULDER_R, 0, 0, -0.1) // Return to guard
  .rotate(BoneName.ELBOW_R, 0, 0, 1.2)
  .rotate(BoneName.FOREARM_R, 0, 0, 0)
  .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
  .rotate(BoneName.SPINE_MIDDLE, 0, 0, 0)
  .rotate(BoneName.PELVIS, 0, 0, 0)
  .rotate(BoneName.HIP_R, 0, 0, 0)
  .rotate(BoneName.SHOULDER_L, 0, 0, 0.5)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.2)
  .position(BoneName.ELBOW_R, 0, 0, 0)
  .position(BoneName.HAND_R, 0, 0, 0)
  .position(BoneName.PELVIS, 0, 0, 0)
  .build()
  .build();

/**
 * Knee strike animation (무릎 타격 - Mureup Tagyeok)
 *
 * Close-range knee strike from Muay Thai-influenced Korean martial arts.
 * Clinch position with explosive knee drive and proper hip engagement.
 *
 * Animation phases:
 * 1. Clinch setup (0.0s): Arms position for control, weight on support leg
 * 2. Chamber (0.05s): Knee begins to lift, hip flexes
 * 3. Drive (0.1s-0.12s): Knee drives upward with hip thrust
 * 4. Impact (0.12s): Maximum extension with full body weight
 * 5. Retraction (0.15s): Knee returns to chamber
 * 6. Recovery (0.2s): Return to fighting stance
 *
 * Duration: 200ms (10 frames @ 60fps)
 *
 * @korean 무릎타격애니메이션
 */
export const KNEE_STRIKE_ANIMATION = AnimationBuilder.create("knee_strike")
  .withKoreanName("무릎타격")
  .withDuration(0.2)
  .withType("attack")
  // Frame 1: Clinch setup
  .keyframe(0.0, "linear")
  .rotate(BoneName.SHOULDER_L, 0.8, 0, -0.5) // Arms in clinch position
  .rotate(BoneName.SHOULDER_R, 0.8, 0, 0.5)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.3) // Bent for control
  .rotate(BoneName.ELBOW_R, 0, 0, 1.3)
  .rotate(BoneName.KNEE_L, -0.2, 0, 0) // Support leg stabilizes
  .rotate(BoneName.FOOT_L, 0, 0, 0.03)
  .rotate(BoneName.HIP_R, 0, 0, 0) // Striking leg neutral
  .rotate(BoneName.KNEE_R, -0.2, 0, 0)
  .position(BoneName.PELVIS, 0, -0.01, 0)
  .build()
  // Frame 2: Chamber begins
  .keyframe(0.05, "ease-out")
  .rotate(BoneName.SHOULDER_L, 0.5, 0, -0.6) // Arms pull opponent down
  .rotate(BoneName.SHOULDER_R, 0.5, 0, 0.6)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.4)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.4)
  .rotate(BoneName.HIP_R, 1.0, 0, 0) // Hip flexes
  .rotate(BoneName.KNEE_R, -1.3, 0, 0) // Knee bends tight
  .rotate(BoneName.KNEE_L, -0.25, 0, 0) // Support leg adjusts
  .rotate(BoneName.FOOT_L, 0, 0, 0.05)
  .rotate(BoneName.SPINE_UPPER, -0.1, 0, 0) // Torso leans back slightly
  .position(BoneName.PELVIS, 0, -0.02, -0.05)
  .build()
  // Frame 3: Knee drive begins
  .keyframe(0.1, "ease-out")
  .rotate(BoneName.SHOULDER_L, 0.3, 0, -0.7) // Arms maintain clinch
  .rotate(BoneName.SHOULDER_R, 0.3, 0, 0.7)
  .rotate(BoneName.HIP_R, 1.3, 0, 0) // Knee drives upward
  .rotate(BoneName.KNEE_R, -0.8, 0, 0) // Opens slightly
  .rotate(BoneName.FOOT_R, 0.3, 0, 0) // Ankle plantarflexion
  .rotate(BoneName.PELVIS, 0.15, 0, 0) // Forward thrust
  .rotate(BoneName.SPINE_LOWER, 0.1, 0, 0)
  .rotate(BoneName.KNEE_L, -0.15, 0, 0) // Support leg extends
  .position(BoneName.KNEE_R, 0, 0.3, 0.4) // Knee rises forward
  .position(BoneName.PELVIS, 0, 0, 0.15) // Hip drives forward
  .build()
  // Frame 4: Impact point
  .keyframe(0.12, "linear")
  .rotate(BoneName.SHOULDER_L, 0.2, 0, -0.8) // Maximum pull down
  .rotate(BoneName.SHOULDER_R, 0.2, 0, 0.8)
  .rotate(BoneName.HIP_R, 1.4, 0, 0) // Maximum knee extension
  .rotate(BoneName.KNEE_R, -0.5, 0, 0)
  .rotate(BoneName.FOOT_R, 0.4, 0, 0)
  .rotate(BoneName.PELVIS, 0.2, 0, 0) // Full hip thrust
  .rotate(BoneName.SPINE_LOWER, 0.15, 0, 0)
  .rotate(BoneName.SPINE_MIDDLE, 0.05, 0, 0)
  .rotate(BoneName.KNEE_L, -0.1, 0, 0) // Support leg fully extended
  .position(BoneName.KNEE_R, 0, 0.4, 0.5)
  .position(BoneName.PELVIS, 0, 0.02, 0.2)
  .build()
  // Frame 5: Retraction
  .keyframe(0.15, "ease-in")
  .rotate(BoneName.HIP_R, 1.0, 0, 0) // Return to chamber
  .rotate(BoneName.KNEE_R, -1.3, 0, 0)
  .rotate(BoneName.FOOT_R, 0, 0, 0)
  .rotate(BoneName.PELVIS, 0, 0, 0)
  .rotate(BoneName.SPINE_LOWER, 0, 0, 0)
  .rotate(BoneName.SPINE_MIDDLE, 0, 0, 0)
  .position(BoneName.KNEE_R, 0, 0.2, 0.2)
  .position(BoneName.PELVIS, 0, -0.01, 0)
  .build()
  // Frame 6: Recovery
  .keyframe(0.2, "ease-in")
  .rotate(BoneName.SHOULDER_L, 0, 0, 0.5) // Arms return to guard
  .rotate(BoneName.SHOULDER_R, 0, 0, -0.5)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.2)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.2)
  .rotate(BoneName.HIP_R, 0, 0, 0) // Leg returns to stance
  .rotate(BoneName.KNEE_R, -0.2, 0, 0)
  .rotate(BoneName.FOOT_R, 0, 0, 0)
  .rotate(BoneName.KNEE_L, -0.2, 0, 0)
  .rotate(BoneName.FOOT_L, 0, 0, 0)
  .rotate(BoneName.SPINE_UPPER, 0, 0, 0) // Body neutral
  .position(BoneName.KNEE_R, 0, 0, 0)
  .position(BoneName.PELVIS, 0, 0, 0)
  .build()
  .build();

/**
 * Side kick animation (옆차기 - Yeopchagi)
 *
 * Traditional Taekwondo side kick with lateral hip rotation,
 * leg extension to the side, and proper chamber-drive-retract sequence.
 *
 * Animation phases:
 * 1. Chamber (0.0s-0.1s): Knee lifts with hip turning sideways
 * 2. Drive (0.1s-0.15s): Leg drives laterally with hip thrust
 * 3. Extension (0.15s-0.2s): Full extension with heel strike
 * 4. Impact (0.2s): Maximum lateral extension
 * 5. Retraction (0.2s-0.35s): Return to chamber
 * 6. Recovery (0.35s-0.5s): Foot returns to ground, stance reset
 *
 * Duration: 500ms (30 frames @ 60fps)
 *
 * @korean 옆차기애니메이션
 */
export const SIDE_KICK_ANIMATION = AnimationBuilder.create("side_kick")
  .withKoreanName("옆차기")
  .withDuration(0.5)
  .withType("attack")
  // Frame 1: Chamber with sideways turn
  .keyframe(0.1, "ease-out")
  .rotate(BoneName.HIP_R, 1.3, 0, 0.3) // Lift and turn
  .rotate(BoneName.KNEE_R, -1.6, 0, 0) // Tight chamber
  .rotate(BoneName.PELVIS, 0, -1.57, 0) // Turn left (90 degrees)
  .rotate(BoneName.SPINE_LOWER, 0, -1.4, 0)
  .rotate(BoneName.SPINE_UPPER, 0, -1.2, 0.2) // Lean away
  .rotate(BoneName.KNEE_L, -0.3, 0, 0) // Support leg adjusts
  .rotate(BoneName.FOOT_L, 0, 0, 0.1)
  .rotate(BoneName.SHOULDER_L, 0, 0, -1.2) // Arms for balance
  .rotate(BoneName.SHOULDER_R, 0, 0, 0.8)
  .position(BoneName.PELVIS, 0, -0.02, 0)
  .build()
  // Frame 2: Drive begins
  .keyframe(0.15, "ease-out")
  .rotate(BoneName.HIP_R, 1.3, 0, 0.5) // Leg begins lateral extension
  .rotate(BoneName.KNEE_R, -1.0, 0, 0)
  .rotate(BoneName.FOOT_R, 0, 0.3, 0) // Heel positioning
  .rotate(BoneName.PELVIS, 0, -1.57, 0) // Hip thrust lateral
  .rotate(BoneName.SPINE_LOWER, 0, -1.4, 0)
  .rotate(BoneName.SPINE_UPPER, 0, -1.2, 0.3)
  .rotate(BoneName.KNEE_L, -0.25, 0, 0) // Support leg stabilizes
  .position(BoneName.FOOT_R, 0.4, 0, 0) // Lateral movement
  .build()
  // Frame 3: Full extension and impact
  .keyframe(0.2, "linear")
  .rotate(BoneName.HIP_R, 1.3, 0, 0.7) // Maximum lateral extension
  .rotate(BoneName.KNEE_R, -0.1, 0, 0) // Nearly straight
  .rotate(BoneName.FOOT_R, 0, 0.4, 0) // Heel strike position
  .rotate(BoneName.PELVIS, 0, -1.57, 0) // Maximum hip drive
  .rotate(BoneName.SPINE_LOWER, 0, -1.4, 0)
  .rotate(BoneName.SPINE_UPPER, 0, -1.2, 0.4) // Maximum lean
  .rotate(BoneName.KNEE_L, -0.15, 0, 0) // Support leg extends
  .position(BoneName.FOOT_R, 0.7, 0, 0) // Maximum reach
  .position(BoneName.PELVIS, 0.1, 0, 0) // Slight lateral shift
  .build()
  // Frame 4: Retraction
  .keyframe(0.35, "ease-in")
  .rotate(BoneName.HIP_R, 1.3, 0, 0.3) // Return to chamber
  .rotate(BoneName.KNEE_R, -1.6, 0, 0)
  .rotate(BoneName.FOOT_R, 0, 0, 0)
  .rotate(BoneName.PELVIS, 0, -1.2, 0) // Begin turning back
  .rotate(BoneName.SPINE_LOWER, 0, -1.0, 0)
  .rotate(BoneName.SPINE_UPPER, 0, -0.8, 0.2)
  .position(BoneName.FOOT_R, 0.3, 0, 0)
  .position(BoneName.PELVIS, 0, -0.01, 0)
  .build()
  // Frame 5: Recovery
  .keyframe(0.5, "ease-in")
  .rotate(BoneName.HIP_R, 0, 0, 0) // Return to neutral stance
  .rotate(BoneName.KNEE_R, -0.2, 0, 0)
  .rotate(BoneName.FOOT_R, 0, 0, 0)
  .rotate(BoneName.PELVIS, 0, 0, 0)
  .rotate(BoneName.SPINE_LOWER, 0, 0, 0)
  .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
  .rotate(BoneName.KNEE_L, -0.2, 0, 0)
  .rotate(BoneName.FOOT_L, 0, 0, 0)
  .rotate(BoneName.SHOULDER_L, 0, 0, 0.5)
  .rotate(BoneName.SHOULDER_R, 0, 0, -0.5)
  .position(BoneName.FOOT_R, 0, 0, 0)
  .position(BoneName.PELVIS, 0, 0, 0)
  .build()
  .build();

/**
 * Elbow uppercut animation (팔꿈치 올려치기 - Palgumchi Ollyeochigi)
 *
 * Upward elbow strike from Hapkido, targeting chin/jaw area.
 * Close-range technique with explosive upward drive and leg spring.
 *
 * Animation phases:
 * 1. Crouch (0.0s): Lower stance, elbow chambers low
 * 2. Spring (0.05s): Legs drive upward with explosive force
 * 3. Drive (0.1s-0.12s): Elbow drives upward with hip thrust
 * 4. Impact (0.12s): Maximum upward extension at chin level
 * 5. Recovery (0.18s): Return to guard position
 *
 * Duration: 180ms (11 frames @ 60fps)
 *
 * @korean 팔꿈치올려치기애니메이션
 */
export const ELBOW_UPPERCUT_ANIMATION = AnimationBuilder.create(
  "elbow_uppercut"
)
  .withKoreanName("팔꿈치올려치기")
  .withDuration(0.18)
  .withType("attack")
  .keyframe(0.0, "linear")
  .rotate(BoneName.SHOULDER_R, -0.3, 0, 0.5)
  .rotate(BoneName.ELBOW_R, 0, 0, 2.0)
  .rotate(BoneName.FOREARM_R, 0, -0.8, 0)
  .rotate(BoneName.KNEE_L, -0.5, 0, 0)
  .rotate(BoneName.KNEE_R, -0.5, 0, 0)
  .rotate(BoneName.SPINE_UPPER, 0.2, 0, 0)
  .rotate(BoneName.SPINE_LOWER, 0.15, 0, 0)
  .rotate(BoneName.PELVIS, 0.1, 0, 0)
  .rotate(BoneName.SHOULDER_L, 0, 0, 0.5)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.2)
  .position(BoneName.PELVIS, 0, -0.1, 0)
  .build()
  .keyframe(0.05, "ease-out")
  .rotate(BoneName.SHOULDER_R, 0, 0, 0.8)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.8)
  .rotate(BoneName.FOREARM_R, 0, -0.5, 0)
  .rotate(BoneName.KNEE_L, -0.2, 0, 0)
  .rotate(BoneName.KNEE_R, -0.2, 0, 0)
  .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
  .rotate(BoneName.SPINE_LOWER, 0, 0, 0)
  .rotate(BoneName.PELVIS, 0, 0, 0)
  .position(BoneName.PELVIS, 0, -0.02, 0)
  .position(BoneName.ELBOW_R, 0, 0.2, 0.3)
  .build()
  .keyframe(0.1, "ease-out")
  .rotate(BoneName.SHOULDER_R, 0.5, 0, 1.0)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.5)
  .rotate(BoneName.FOREARM_R, 0, -0.2, 0)
  .rotate(BoneName.KNEE_L, -0.1, 0, 0)
  .rotate(BoneName.KNEE_R, -0.1, 0, 0)
  .rotate(BoneName.PELVIS, -0.1, 0, 0)
  .rotate(BoneName.SPINE_LOWER, -0.05, 0, 0)
  .position(BoneName.PELVIS, 0, 0.05, 0.1)
  .position(BoneName.ELBOW_R, 0, 0.5, 0.4)
  .build()
  .keyframe(0.12, "linear")
  .rotate(BoneName.SHOULDER_R, 0.8, 0, 1.2)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.4)
  .rotate(BoneName.FOREARM_R, 0, 0, 0)
  .rotate(BoneName.KNEE_L, -0.05, 0, 0)
  .rotate(BoneName.KNEE_R, -0.05, 0, 0)
  .rotate(BoneName.PELVIS, -0.15, 0, 0)
  .rotate(BoneName.SPINE_LOWER, -0.1, 0, 0)
  .rotate(BoneName.SPINE_UPPER, -0.05, 0, 0)
  .position(BoneName.PELVIS, 0, 0.08, 0.15)
  .position(BoneName.ELBOW_R, 0, 0.7, 0.5)
  .build()
  .keyframe(0.18, "ease-in")
  .rotate(BoneName.SHOULDER_R, 0, 0, -0.1)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.2)
  .rotate(BoneName.FOREARM_R, 0, 0, 0)
  .rotate(BoneName.KNEE_L, -0.2, 0, 0)
  .rotate(BoneName.KNEE_R, -0.2, 0, 0)
  .rotate(BoneName.PELVIS, 0, 0, 0)
  .rotate(BoneName.SPINE_LOWER, 0, 0, 0)
  .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
  .rotate(BoneName.SHOULDER_L, 0, 0, 0.5)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.2)
  .position(BoneName.PELVIS, 0, 0, 0)
  .position(BoneName.ELBOW_R, 0, 0, 0)
  .build()
  .build();

/**
 * Axe kick animation (내려차기 - Naeryeochagi)
 *
 * Traditional Taekwondo downward axe kick targeting head/shoulder.
 * Leg rises high then chops downward with heel strike.
 *
 * Animation phases:
 * 1. Chamber (0.0s-0.15s): Leg rises high in front
 * 2. Peak (0.15s-0.2s): Maximum height, leg nearly vertical
 * 3. Chop (0.2s-0.3s): Leg descends rapidly with heel strike
 * 4. Impact (0.3s): Maximum downward force
 * 5. Recovery (0.3s-0.5s): Return to stance
 *
 * Duration: 500ms
 *
 * @korean 내려차기애니메이션
 */
export const AXE_KICK_ANIMATION = AnimationBuilder.create("axe_kick")
  .withKoreanName("내려차기")
  .withDuration(0.5)
  .withType("attack")
  // Frame 1: Leg rises in front
  .keyframe(0.15, "ease-out")
  .rotate(BoneName.HIP_R, 2.0, 0, 0) // High lift (>120 degrees)
  .rotate(BoneName.KNEE_R, -0.3, 0, 0) // Nearly straight
  .rotate(BoneName.FOOT_R, 0.5, 0, 0) // Dorsiflexion
  .rotate(BoneName.KNEE_L, -0.3, 0, 0) // Support leg bent
  .rotate(BoneName.PELVIS, -0.2, 0, 0) // Tilts back
  .rotate(BoneName.SPINE_LOWER, -0.15, 0, 0)
  .rotate(BoneName.SPINE_UPPER, -0.1, 0, 0) // Lean back for balance
  .rotate(BoneName.SHOULDER_L, -0.8, 0.3, 0.4) // Guard position
  .rotate(BoneName.ELBOW_L, 0, 0, -1.6)
  .rotate(BoneName.SHOULDER_R, -0.8, -0.3, -0.4)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.6)
  .position(BoneName.PELVIS, 0, -0.05, -0.1)
  .build()
  // Frame 2: Peak height (nearly vertical)
  .keyframe(0.2, "linear")
  .rotate(BoneName.HIP_R, 2.5, 0, 0) // Maximum height (>140 degrees)
  .rotate(BoneName.KNEE_R, -0.1, 0, 0) // Fully extended
  .rotate(BoneName.FOOT_R, 0.6, 0, 0)
  .rotate(BoneName.KNEE_L, -0.35, 0, 0)
  .rotate(BoneName.PELVIS, -0.25, 0, 0)
  .rotate(BoneName.SPINE_LOWER, -0.2, 0, 0)
  .rotate(BoneName.SPINE_UPPER, -0.15, 0, 0)
  .position(BoneName.FOOT_R, 0, 1.5, 0.3) // High above
  .position(BoneName.PELVIS, 0, -0.08, -0.15)
  .build()
  // Frame 3: Downward chop
  .keyframe(0.3, "ease-in")
  .rotate(BoneName.HIP_R, 0.8, 0, 0) // Descending rapidly
  .rotate(BoneName.KNEE_R, -0.15, 0, 0)
  .rotate(BoneName.FOOT_R, -0.3, 0, 0) // Heel strike angle
  .rotate(BoneName.KNEE_L, -0.25, 0, 0)
  .rotate(BoneName.PELVIS, 0.1, 0, 0) // Pelvis drives forward
  .rotate(BoneName.SPINE_LOWER, 0.1, 0, 0)
  .rotate(BoneName.SPINE_UPPER, 0.05, 0, 0)
  .position(BoneName.FOOT_R, 0, 0.5, 0.4) // Striking down
  .position(BoneName.PELVIS, 0, 0, 0.1)
  .build()
  // Frame 4: Recovery
  .keyframe(0.5, "ease-in")
  .rotate(BoneName.HIP_R, 0, 0, 0)
  .rotate(BoneName.KNEE_R, -0.2, 0, 0)
  .rotate(BoneName.FOOT_R, 0, 0, 0)
  .rotate(BoneName.KNEE_L, -0.2, 0, 0)
  .rotate(BoneName.PELVIS, 0, 0, 0)
  .rotate(BoneName.SPINE_LOWER, 0, 0, 0)
  .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
  .rotate(BoneName.SHOULDER_L, -0.6, 0.4, 0.3)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.8)
  .rotate(BoneName.SHOULDER_R, -0.6, -0.4, -0.3)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.8)
  .position(BoneName.FOOT_R, 0, 0, 0)
  .position(BoneName.PELVIS, 0, 0, 0)
  .build()
  .build();

/**
 * Back kick animation (뒤차기 - Dwichagi)
 *
 * Traditional Taekwondo spinning back kick with powerful heel thrust.
 * Turn 180 degrees and deliver straight back kick.
 *
 * Animation phases:
 * 1. Turn start (0.0s-0.1s): Begin spinning left
 * 2. Chamber (0.1s-0.15s): Look over shoulder, leg chambers
 * 3. Thrust (0.15s-0.2s): Heel drives backward
 * 4. Impact (0.2s-0.25s): Full extension
 * 5. Recovery (0.25s-0.45s): Complete rotation, return to stance
 *
 * Duration: 450ms
 *
 * @korean 뒤차기애니메이션
 */
export const BACK_KICK_ANIMATION = AnimationBuilder.create("back_kick")
  .withKoreanName("뒤차기")
  .withDuration(0.45)
  .withType("attack")
  // Frame 1: Begin spin
  .keyframe(0.1, "ease-out")
  .rotate(BoneName.PELVIS, 0, -1.5, 0) // Turn left ~90 degrees
  .rotate(BoneName.SPINE_LOWER, 0, -1.3, 0)
  .rotate(BoneName.SPINE_UPPER, 0, -1.0, 0.1) // Look over shoulder
  .rotate(BoneName.HEAD, 0, 0.5, 0) // Look back at target
  .rotate(BoneName.HIP_R, 0.3, 0, 0) // Begin lift
  .rotate(BoneName.KNEE_R, -0.8, 0, 0) // Chamber
  .rotate(BoneName.KNEE_L, -0.3, 0, 0)
  .rotate(BoneName.SHOULDER_L, 0.3, 0, -0.5)
  .rotate(BoneName.SHOULDER_R, 0.3, 0, 0.5)
  .position(BoneName.PELVIS, 0, -0.02, 0)
  .build()
  // Frame 2: Full chamber
  .keyframe(0.15, "linear")
  .rotate(BoneName.PELVIS, 0, -2.8, 0) // Turn ~160 degrees
  .rotate(BoneName.SPINE_LOWER, 0, -2.5, 0)
  .rotate(BoneName.SPINE_UPPER, 0, -2.2, 0.15)
  .rotate(BoneName.HEAD, 0, 0.8, 0)
  .rotate(BoneName.HIP_R, 0.8, 0, 0) // Knee lifts
  .rotate(BoneName.KNEE_R, -1.5, 0, 0) // Tight chamber
  .rotate(BoneName.KNEE_L, -0.25, 0, 0)
  .position(BoneName.PELVIS, 0, -0.01, -0.05)
  .build()
  // Frame 3: Thrust backward
  .keyframe(0.2, "ease-out")
  .rotate(BoneName.PELVIS, 0, -3.14, 0) // Full 180 degrees
  .rotate(BoneName.SPINE_LOWER, 0, -3.0, 0)
  .rotate(BoneName.SPINE_UPPER, 0, -2.8, 0.2)
  .rotate(BoneName.HEAD, 0, 1.0, 0)
  .rotate(BoneName.HIP_R, 0.5, 0, 0) // Extends backward
  .rotate(BoneName.KNEE_R, -0.2, 0, 0) // Leg straightens
  .rotate(BoneName.FOOT_R, -0.4, 0, 0) // Heel strike
  .rotate(BoneName.KNEE_L, -0.15, 0, 0)
  .position(BoneName.FOOT_R, 0, 0, -0.8) // Thrust back
  .position(BoneName.PELVIS, 0, 0, 0.15)
  .build()
  // Frame 4: Impact
  .keyframe(0.25, "linear")
  .rotate(BoneName.PELVIS, 0, -3.14, 0)
  .rotate(BoneName.SPINE_LOWER, 0, -3.0, 0)
  .rotate(BoneName.SPINE_UPPER, 0, -2.8, 0.25)
  .rotate(BoneName.HIP_R, 0.3, 0, 0) // Full extension
  .rotate(BoneName.KNEE_R, -0.05, 0, 0) // Straight
  .rotate(BoneName.FOOT_R, -0.5, 0, 0)
  .position(BoneName.FOOT_R, 0, 0.2, -1.0) // Maximum reach
  .position(BoneName.PELVIS, 0, 0, 0.2)
  .build()
  // Frame 5: Recovery (complete rotation)
  .keyframe(0.45, "ease-in")
  .rotate(BoneName.PELVIS, 0, 0, 0) // Return to forward
  .rotate(BoneName.SPINE_LOWER, 0, 0, 0)
  .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
  .rotate(BoneName.HEAD, 0, 0, 0)
  .rotate(BoneName.HIP_R, 0, 0, 0)
  .rotate(BoneName.KNEE_R, -0.2, 0, 0)
  .rotate(BoneName.FOOT_R, 0, 0, 0)
  .rotate(BoneName.KNEE_L, -0.2, 0, 0)
  .rotate(BoneName.SHOULDER_L, -0.6, 0.4, 0.3)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.8)
  .rotate(BoneName.SHOULDER_R, -0.6, -0.4, -0.3)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.8)
  .position(BoneName.FOOT_R, 0, 0, 0)
  .position(BoneName.PELVIS, 0, 0, 0)
  .build()
  .build();

/**
 * Tornado kick animation (회오리차기 - Hoeori Chagi)
 *
 * 360-degree spinning kick with explosive roundhouse at peak rotation.
 *
 * Animation phases:
 * 1. Wind-up (0.0s-0.15s): Begin 360 spin
 * 2. Half turn (0.15s-0.25s): Continue rotation, leg chambers
 * 3. Kick (0.25s-0.35s): Roundhouse executes at peak rotation
 * 4. Complete spin (0.35s-0.55s): Finish rotation, land
 *
 * Duration: 550ms
 *
 * @korean 회오리차기애니메이션
 */
export const TORNADO_KICK_ANIMATION = AnimationBuilder.create("tornado_kick")
  .withKoreanName("회오리차기")
  .withDuration(0.55)
  .withType("attack")
  // Frame 1: Begin spin
  .keyframe(0.15, "ease-out")
  .rotate(BoneName.PELVIS, 0, -2.0, 0) // Spin ~115 degrees
  .rotate(BoneName.SPINE_LOWER, 0, -1.8, 0)
  .rotate(BoneName.SPINE_UPPER, 0, -1.5, 0)
  .rotate(BoneName.KNEE_L, -0.2, 0, 0)
  .rotate(BoneName.FOOT_L, 0, 0, -0.2) // Pivot foot
  .rotate(BoneName.HIP_R, 0.4, 0, 0.3) // Leg begins lift
  .rotate(BoneName.KNEE_R, -0.8, 0, 0)
  .rotate(BoneName.SHOULDER_L, 0.5, 0, -0.5)
  .rotate(BoneName.SHOULDER_R, 0.5, 0, 0.5)
  .position(BoneName.PELVIS, 0, 0.1, 0) // Slight jump
  .build()
  // Frame 2: Continue spin, chamber
  .keyframe(0.25, "linear")
  .rotate(BoneName.PELVIS, 0, -4.0, 0) // Spin ~230 degrees
  .rotate(BoneName.SPINE_LOWER, 0, -3.8, 0)
  .rotate(BoneName.SPINE_UPPER, 0, -3.5, 0)
  .rotate(BoneName.KNEE_L, -0.15, 0, 0)
  .rotate(BoneName.FOOT_L, 0, 0, -0.3)
  .rotate(BoneName.HIP_R, 1.2, 0, 0.8) // Chamber for roundhouse
  .rotate(BoneName.KNEE_R, -1.5, 0, 0)
  .position(BoneName.PELVIS, 0, 0.15, 0) // Jump peak
  .build()
  // Frame 3: Execute kick at peak rotation
  .keyframe(0.35, "ease-out")
  .rotate(BoneName.PELVIS, 0, -5.5, 0) // Spin ~315 degrees
  .rotate(BoneName.SPINE_LOWER, 0, -5.3, 0)
  .rotate(BoneName.SPINE_UPPER, 0, -5.0, 0.3)
  .rotate(BoneName.KNEE_L, -0.1, 0, 0)
  .rotate(BoneName.HIP_R, 1.2, 0, 1.6) // Full roundhouse extension
  .rotate(BoneName.KNEE_R, -0.1, 0, 0)
  .rotate(BoneName.FOOT_R, 0.4, 0, 0.3)
  .position(BoneName.FOOT_R, 0.8, 0, 0) // Lateral strike
  .position(BoneName.PELVIS, 0, 0.1, 0) // Descending
  .build()
  // Frame 4: Complete rotation and land
  .keyframe(0.55, "ease-in")
  .rotate(BoneName.PELVIS, 0, -6.28, 0) // Full 360 degrees
  .rotate(BoneName.SPINE_LOWER, 0, -6.28, 0)
  .rotate(BoneName.SPINE_UPPER, 0, -6.28, 0)
  .rotate(BoneName.HIP_R, 0, 0, 0)
  .rotate(BoneName.KNEE_R, -0.2, 0, 0)
  .rotate(BoneName.FOOT_R, 0, 0, 0)
  .rotate(BoneName.KNEE_L, -0.25, 0, 0) // Absorb landing
  .rotate(BoneName.SHOULDER_L, -0.6, 0.4, 0.3)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.8)
  .rotate(BoneName.SHOULDER_R, -0.6, -0.4, -0.3)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.8)
  .position(BoneName.FOOT_R, 0, 0, 0)
  .position(BoneName.PELVIS, 0, -0.05, 0) // Land
  .build()
  .build();

/**
 * Jumping kick animation (뛰어차기 - Ttwieo Chagi)
 *
 * Jumping front kick with explosive upward momentum.
 *
 * Animation phases:
 * 1. Crouch (0.0s-0.1s): Load legs for jump
 * 2. Jump (0.1s-0.2s): Explosive upward, front kick chambers
 * 3. Kick (0.2s-0.3s): Front kick at peak height
 * 4. Retract (0.3s-0.4s): Leg pulls back
 * 5. Land (0.4s-0.5s): Absorb landing
 *
 * Duration: 500ms
 *
 * @korean 뛰어차기애니메이션
 */
export const JUMPING_KICK_ANIMATION = AnimationBuilder.create("jumping_kick")
  .withKoreanName("뛰어차기")
  .withDuration(0.5)
  .withType("attack")
  // Frame 1: Crouch to load
  .keyframe(0.1, "ease-out")
  .rotate(BoneName.KNEE_L, -0.6, 0, 0)
  .rotate(BoneName.KNEE_R, -0.6, 0, 0)
  .rotate(BoneName.PELVIS, 0.1, 0, 0)
  .rotate(BoneName.SPINE_LOWER, 0.1, 0, 0)
  .rotate(BoneName.SHOULDER_L, 0.3, 0, -0.5)
  .rotate(BoneName.SHOULDER_R, 0.3, 0, 0.5)
  .position(BoneName.PELVIS, 0, -0.15, 0)
  .build()
  // Frame 2: Jump and chamber
  .keyframe(0.2, "ease-out")
  .rotate(BoneName.KNEE_L, -0.1, 0, 0) // Jump leg extends
  .rotate(BoneName.HIP_R, 1.6, 0, 0) // Chamber
  .rotate(BoneName.KNEE_R, -2.0, 0, 0)
  .rotate(BoneName.PELVIS, -0.1, 0, 0)
  .rotate(BoneName.SPINE_LOWER, -0.05, 0, 0)
  .rotate(BoneName.SHOULDER_L, -0.9, 0.3, 0.4)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.6)
  .rotate(BoneName.SHOULDER_R, -0.9, -0.3, -0.4)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.6)
  .position(BoneName.PELVIS, 0, 0.3, 0) // Airborne
  .build()
  // Frame 3: Kick extends at peak
  .keyframe(0.3, "linear")
  .rotate(BoneName.KNEE_L, -0.05, 0, 0)
  .rotate(BoneName.HIP_R, 1.7, 0, 0)
  .rotate(BoneName.KNEE_R, 0.1, 0, 0) // Full extension
  .rotate(BoneName.FOOT_R, 0.5, 0, 0) // Dorsiflexion
  .rotate(BoneName.PELVIS, 0.15, 0, 0)
  .rotate(BoneName.SPINE_LOWER, 0.1, 0, 0)
  .position(BoneName.PELVIS, 0, 0.35, 0.1) // Peak height
  .build()
  // Frame 4: Retract
  .keyframe(0.4, "ease-in")
  .rotate(BoneName.KNEE_L, -0.1, 0, 0)
  .rotate(BoneName.HIP_R, 1.4, 0, 0)
  .rotate(BoneName.KNEE_R, -1.5, 0, 0)
  .rotate(BoneName.FOOT_R, 0, 0, 0)
  .rotate(BoneName.PELVIS, 0, 0, 0)
  .position(BoneName.PELVIS, 0, 0.15, 0) // Descending
  .build()
  // Frame 5: Land
  .keyframe(0.5, "ease-in")
  .rotate(BoneName.KNEE_L, -0.35, 0, 0) // Absorb landing
  .rotate(BoneName.KNEE_R, -0.35, 0, 0)
  .rotate(BoneName.HIP_R, 0, 0, 0)
  .rotate(BoneName.PELVIS, 0, 0, 0)
  .rotate(BoneName.SHOULDER_L, -0.6, 0.4, 0.3)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.8)
  .rotate(BoneName.SHOULDER_R, -0.6, -0.4, -0.3)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.8)
  .position(BoneName.PELVIS, 0, -0.05, 0)
  .build()
  .build();

/**
 * Sweep animation (다리걸기 - Dari Geolgi)
 *
 * Low sweeping kick targeting opponent's ankles for takedown.
 *
 * Animation phases:
 * 1. Drop (0.0s-0.1s): Lower stance, weight on one leg
 * 2. Sweep (0.1s-0.2s): Leg sweeps low in arc
 * 3. Follow through (0.2s-0.3s): Complete sweep arc
 * 4. Recovery (0.3s-0.45s): Return to stance
 *
 * Duration: 450ms
 *
 * @korean 다리걸기애니메이션
 */
export const SWEEP_ANIMATION = AnimationBuilder.create("sweep")
  .withKoreanName("다리걸기")
  .withDuration(0.45)
  .withType("attack")
  // Frame 1: Drop low
  .keyframe(0.1, "ease-out")
  .rotate(BoneName.KNEE_L, -1.2, 0, 0) // Deep crouch
  .rotate(BoneName.KNEE_R, -0.3, 0, 0) // Sweep leg lighter
  .rotate(BoneName.PELVIS, 0.2, 0, 0) // Lean forward
  .rotate(BoneName.SPINE_LOWER, 0.3, 0, 0)
  .rotate(BoneName.SPINE_UPPER, 0.4, 0, 0)
  .rotate(BoneName.SHOULDER_L, 0.6, 0, -0.8) // Arms for balance
  .rotate(BoneName.SHOULDER_R, 0.6, 0, 0.8)
  .position(BoneName.PELVIS, 0, -0.3, 0) // Low position
  .build()
  // Frame 2: Sweep begins
  .keyframe(0.2, "ease-out")
  .rotate(BoneName.KNEE_L, -1.3, 0, 0)
  .rotate(BoneName.HIP_R, 0.3, 0, 1.0) // Leg sweeps outward
  .rotate(BoneName.KNEE_R, -0.2, 0, 0) // Nearly straight
  .rotate(BoneName.FOOT_R, 0, 0, 0.3) // Foot sweeps
  .rotate(BoneName.PELVIS, 0.25, -0.5, 0) // Rotate into sweep
  .rotate(BoneName.SPINE_LOWER, 0.35, -0.4, 0)
  .rotate(BoneName.SPINE_UPPER, 0.45, -0.3, 0)
  .position(BoneName.FOOT_R, 0.5, 0, 0) // Lateral sweep
  .position(BoneName.PELVIS, 0, -0.35, 0)
  .build()
  // Frame 3: Follow through
  .keyframe(0.3, "linear")
  .rotate(BoneName.KNEE_L, -1.2, 0, 0)
  .rotate(BoneName.HIP_R, 0.5, 0, 1.5) // Maximum sweep
  .rotate(BoneName.KNEE_R, -0.15, 0, 0)
  .rotate(BoneName.FOOT_R, 0, 0, 0.4)
  .rotate(BoneName.PELVIS, 0.3, -0.8, 0)
  .rotate(BoneName.SPINE_LOWER, 0.4, -0.6, 0)
  .rotate(BoneName.SPINE_UPPER, 0.5, -0.4, 0)
  .position(BoneName.FOOT_R, 0.8, -0.1, 0) // Low and wide
  .position(BoneName.PELVIS, 0.1, -0.3, 0)
  .build()
  // Frame 4: Recovery
  .keyframe(0.45, "ease-in")
  .rotate(BoneName.KNEE_L, -0.3, 0, 0)
  .rotate(BoneName.KNEE_R, -0.3, 0, 0)
  .rotate(BoneName.HIP_R, 0, 0, 0)
  .rotate(BoneName.FOOT_R, 0, 0, 0)
  .rotate(BoneName.PELVIS, 0, 0, 0)
  .rotate(BoneName.SPINE_LOWER, 0, 0, 0)
  .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
  .rotate(BoneName.SHOULDER_L, -0.6, 0.4, 0.3)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.8)
  .rotate(BoneName.SHOULDER_R, -0.6, -0.4, -0.3)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.8)
  .position(BoneName.FOOT_R, 0, 0, 0)
  .position(BoneName.PELVIS, 0, 0, 0)
  .build()
  .build();

/**
 * Throw animation (던지기 - Deonjigi)
 *
 * Hapkido/Judo style hip throw technique.
 *
 * Animation phases:
 * 1. Entry (0.0s-0.15s): Step in, grab opponent
 * 2. Load (0.15s-0.25s): Hip under opponent
 * 3. Throw (0.25s-0.4s): Execute throw over hip
 * 4. Recovery (0.4s-0.55s): Return to stance
 *
 * Duration: 550ms
 *
 * @korean 던지기애니메이션
 */
export const THROW_ANIMATION = AnimationBuilder.create("throw")
  .withKoreanName("던지기")
  .withDuration(0.55)
  .withType("attack")
  // Frame 1: Entry and grab
  .keyframe(0.15, "ease-out")
  .rotate(BoneName.SHOULDER_L, 0.6, 0.5, -0.3) // Reach for collar
  .rotate(BoneName.ELBOW_L, 0, 0, -1.0)
  .rotate(BoneName.SHOULDER_R, 0.8, -0.3, 0.2) // Reach for sleeve/hip
  .rotate(BoneName.ELBOW_R, 0, 0, 1.2)
  .rotate(BoneName.PELVIS, 0, 0.8, 0) // Turn into opponent
  .rotate(BoneName.SPINE_LOWER, 0, 0.7, 0)
  .rotate(BoneName.SPINE_UPPER, 0, 0.5, 0)
  .rotate(BoneName.KNEE_L, -0.4, 0, 0) // Step in
  .rotate(BoneName.KNEE_R, -0.3, 0, 0)
  .position(BoneName.PELVIS, 0, -0.05, 0.2) // Move into opponent
  .build()
  // Frame 2: Load hip under opponent
  .keyframe(0.25, "linear")
  .rotate(BoneName.SHOULDER_L, 0.3, 0.7, -0.5) // Pull collar
  .rotate(BoneName.ELBOW_L, 0, 0, -1.3)
  .rotate(BoneName.SHOULDER_R, 0.5, -0.5, 0.4) // Pull sleeve
  .rotate(BoneName.ELBOW_R, 0, 0, 1.0)
  .rotate(BoneName.PELVIS, 0.2, 1.2, 0) // Hip under, body turns
  .rotate(BoneName.SPINE_LOWER, 0.3, 1.0, 0)
  .rotate(BoneName.SPINE_UPPER, 0.4, 0.8, 0)
  .rotate(BoneName.KNEE_L, -0.6, 0, 0) // Knees bend to get under
  .rotate(BoneName.KNEE_R, -0.5, 0, 0)
  .position(BoneName.PELVIS, 0, -0.15, 0.15)
  .build()
  // Frame 3: Execute throw
  .keyframe(0.4, "ease-out")
  .rotate(BoneName.SHOULDER_L, -0.4, 0.8, -0.8) // Drive down with pull
  .rotate(BoneName.ELBOW_L, 0, 0, -0.8)
  .rotate(BoneName.SHOULDER_R, -0.2, -0.6, 0.6) // Lift and rotate
  .rotate(BoneName.ELBOW_R, 0, 0, 0.6)
  .rotate(BoneName.PELVIS, 0.5, 1.8, 0) // Hip drives through
  .rotate(BoneName.SPINE_LOWER, 0.6, 1.5, 0)
  .rotate(BoneName.SPINE_UPPER, 0.7, 1.2, -0.2) // Bend forward
  .rotate(BoneName.KNEE_L, -0.3, 0, 0) // Legs straighten for lift
  .rotate(BoneName.KNEE_R, -0.2, 0, 0)
  .position(BoneName.PELVIS, 0, 0.05, 0.1)
  .build()
  // Frame 4: Recovery
  .keyframe(0.55, "ease-in")
  .rotate(BoneName.SHOULDER_L, -0.6, 0.4, 0.3)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.8)
  .rotate(BoneName.SHOULDER_R, -0.6, -0.4, -0.3)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.8)
  .rotate(BoneName.PELVIS, 0, 0, 0)
  .rotate(BoneName.SPINE_LOWER, 0, 0, 0)
  .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
  .rotate(BoneName.KNEE_L, -0.25, 0, 0)
  .rotate(BoneName.KNEE_R, -0.25, 0, 0)
  .position(BoneName.PELVIS, 0, 0, 0)
  .build()
  .build();

/**
 * Grapple animation (잡기/꺾기 - Japgi/Kkeokgi)
 *
 * Joint lock/grapple technique from Hapkido.
 *
 * Animation phases:
 * 1. Catch (0.0s-0.12s): Grab opponent's arm
 * 2. Control (0.12s-0.25s): Apply joint pressure
 * 3. Lock (0.25s-0.4s): Full joint lock applied
 * 4. Hold (0.4s-0.5s): Maintain control
 *
 * Duration: 500ms
 *
 * @korean 잡기꺾기애니메이션
 */
export const GRAPPLE_ANIMATION = AnimationBuilder.create("grapple")
  .withKoreanName("잡기/꺾기")
  .withDuration(0.5)
  .withType("attack")
  // Frame 1: Catch arm
  .keyframe(0.12, "ease-out")
  .rotate(BoneName.SHOULDER_L, 0.4, 0.6, -0.2) // Both hands reach
  .rotate(BoneName.ELBOW_L, 0, 0, -1.2)
  .rotate(BoneName.WRIST_L, 0, -0.3, 0) // Rotate to grab
  .rotate(BoneName.SHOULDER_R, 0.6, -0.4, 0.3)
  .rotate(BoneName.ELBOW_R, 0, 0, 0.8)
  .rotate(BoneName.WRIST_R, 0, 0.3, 0)
  .rotate(BoneName.PELVIS, 0, 0.3, 0) // Body turns slightly
  .rotate(BoneName.SPINE_LOWER, 0, 0.25, 0)
  .rotate(BoneName.SPINE_UPPER, 0, 0.2, -0.1)
  .rotate(BoneName.KNEE_L, -0.25, 0, 0)
  .rotate(BoneName.KNEE_R, -0.2, 0, 0)
  .position(BoneName.PELVIS, 0, -0.03, 0.1)
  .build()
  // Frame 2: Apply control
  .keyframe(0.25, "linear")
  .rotate(BoneName.SHOULDER_L, 0.2, 0.8, -0.4) // Pull down
  .rotate(BoneName.ELBOW_L, 0, 0, -1.5)
  .rotate(BoneName.WRIST_L, 0, -0.5, -0.3)
  .rotate(BoneName.SHOULDER_R, 0.3, -0.6, 0.5) // Rotate opponent's arm
  .rotate(BoneName.ELBOW_R, 0, 0, 1.2)
  .rotate(BoneName.WRIST_R, 0, 0.5, 0.2)
  .rotate(BoneName.PELVIS, 0.1, 0.5, 0)
  .rotate(BoneName.SPINE_LOWER, 0.15, 0.4, 0)
  .rotate(BoneName.SPINE_UPPER, 0.2, 0.3, -0.15)
  .rotate(BoneName.KNEE_L, -0.35, 0, 0)
  .rotate(BoneName.KNEE_R, -0.3, 0, 0)
  .position(BoneName.PELVIS, 0, -0.08, 0.08)
  .build()
  // Frame 3: Lock position
  .keyframe(0.4, "ease-in")
  .rotate(BoneName.SHOULDER_L, -0.1, 1.0, -0.6) // Secure lock
  .rotate(BoneName.ELBOW_L, 0, 0, -1.7)
  .rotate(BoneName.WRIST_L, 0, -0.6, -0.4)
  .rotate(BoneName.SHOULDER_R, 0.1, -0.8, 0.7)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.4)
  .rotate(BoneName.WRIST_R, 0, 0.6, 0.3)
  .rotate(BoneName.PELVIS, 0.15, 0.6, 0)
  .rotate(BoneName.SPINE_LOWER, 0.2, 0.5, 0)
  .rotate(BoneName.SPINE_UPPER, 0.25, 0.4, -0.2)
  .rotate(BoneName.KNEE_L, -0.4, 0, 0)
  .rotate(BoneName.KNEE_R, -0.35, 0, 0)
  .position(BoneName.PELVIS, 0, -0.1, 0.05)
  .build()
  // Frame 4: Hold
  .keyframe(0.5, "linear")
  .rotate(BoneName.SHOULDER_L, -0.1, 1.0, -0.6)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.7)
  .rotate(BoneName.SHOULDER_R, 0.1, -0.8, 0.7)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.4)
  .rotate(BoneName.PELVIS, 0.15, 0.6, 0)
  .rotate(BoneName.SPINE_LOWER, 0.2, 0.5, 0)
  .rotate(BoneName.SPINE_UPPER, 0.25, 0.4, -0.2)
  .rotate(BoneName.KNEE_L, -0.4, 0, 0)
  .rotate(BoneName.KNEE_R, -0.35, 0, 0)
  .position(BoneName.PELVIS, 0, -0.1, 0.05)
  .build()
  .build();

/**
 * Counter attack animation (반격 - Bangyeok)
 *
 * Parry and counter technique from Hapkido.
 *
 * Animation phases:
 * 1. Parry (0.0s-0.1s): Deflect incoming attack
 * 2. Redirect (0.1s-0.18s): Guide opponent's momentum
 * 3. Counter (0.18s-0.28s): Strike to vulnerable point
 * 4. Recovery (0.28s-0.4s): Return to guard
 *
 * Duration: 400ms
 *
 * @korean 반격애니메이션
 */
export const COUNTER_ATTACK_ANIMATION = AnimationBuilder.create(
  "counter_attack"
)
  .withKoreanName("반격")
  .withDuration(0.4)
  .withType("attack")
  // Frame 1: Parry
  .keyframe(0.1, "ease-out")
  .rotate(BoneName.SHOULDER_L, 0.2, 0.5, -0.8) // Parry hand
  .rotate(BoneName.ELBOW_L, 0, 0, -0.8)
  .rotate(BoneName.WRIST_L, 0, 0.4, 0)
  .rotate(BoneName.SHOULDER_R, 0, 0, 0.5) // Ready to strike
  .rotate(BoneName.ELBOW_R, 0, 0, 1.5)
  .rotate(BoneName.PELVIS, 0, -0.3, 0) // Turn away from attack
  .rotate(BoneName.SPINE_LOWER, 0, -0.25, 0)
  .rotate(BoneName.SPINE_UPPER, 0, -0.2, 0)
  .rotate(BoneName.KNEE_L, -0.3, 0, 0)
  .rotate(BoneName.KNEE_R, -0.25, 0, 0)
  .position(BoneName.PELVIS, 0, -0.02, -0.1) // Slight retreat
  .build()
  // Frame 2: Redirect
  .keyframe(0.18, "linear")
  .rotate(BoneName.SHOULDER_L, 0.3, 0.8, -0.5) // Guide opponent
  .rotate(BoneName.ELBOW_L, 0, 0, -1.0)
  .rotate(BoneName.WRIST_L, 0, 0.3, -0.2)
  .rotate(BoneName.SHOULDER_R, 0.2, 0, 0) // Chamber counter
  .rotate(BoneName.ELBOW_R, 0, 0, 1.8)
  .rotate(BoneName.PELVIS, 0, 0.2, 0) // Begin rotation into counter
  .rotate(BoneName.SPINE_LOWER, 0, 0.15, 0)
  .rotate(BoneName.SPINE_UPPER, 0, 0.1, 0)
  .position(BoneName.PELVIS, 0, -0.01, 0)
  .build()
  // Frame 3: Counter strike
  .keyframe(0.28, "ease-out")
  .rotate(BoneName.SHOULDER_L, 0.1, 0.5, -0.3) // Maintain control
  .rotate(BoneName.ELBOW_L, 0, 0, -1.2)
  .rotate(BoneName.SHOULDER_R, -0.5, 0, 0.4) // Drive counter
  .rotate(BoneName.ELBOW_R, 0, 0, 0.3)
  .rotate(BoneName.WRIST_R, 0, 0, -0.2)
  .rotate(BoneName.PELVIS, 0, 0.5, 0) // Full rotation into strike
  .rotate(BoneName.SPINE_LOWER, 0, 0.4, 0)
  .rotate(BoneName.SPINE_UPPER, 0, 0.3, 0)
  .rotate(BoneName.KNEE_L, -0.25, 0, 0)
  .rotate(BoneName.KNEE_R, -0.2, 0, 0)
  .position(BoneName.PELVIS, 0, 0, 0.1)
  .build()
  // Frame 4: Recovery
  .keyframe(0.4, "ease-in")
  .rotate(BoneName.SHOULDER_L, -0.6, 0.4, 0.3)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.8)
  .rotate(BoneName.SHOULDER_R, -0.6, -0.4, -0.3)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.8)
  .rotate(BoneName.PELVIS, 0, 0, 0)
  .rotate(BoneName.SPINE_LOWER, 0, 0, 0)
  .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
  .rotate(BoneName.KNEE_L, -0.2, 0, 0)
  .rotate(BoneName.KNEE_R, -0.2, 0, 0)
  .position(BoneName.PELVIS, 0, 0, 0)
  .build()
  .build();

/**
 * Palm strike animation (장권 - Janggwon)
 *
 * Open palm heel strike from Taekwondo.
 *
 * Animation phases:
 * 1. Chamber (0.0s-0.08s): Palm pulls back
 * 2. Drive (0.08s-0.15s): Hip rotation and palm drives forward
 * 3. Impact (0.15s-0.18s): Maximum extension
 * 4. Recovery (0.18s-0.3s): Return to guard
 *
 * Duration: 300ms
 *
 * @korean 장권애니메이션
 */
export const PALM_STRIKE_ANIMATION = AnimationBuilder.create("palm_strike")
  .withKoreanName("장권")
  .withDuration(0.3)
  .withType("attack")
  // Frame 1: Chamber
  .keyframe(0.08, "linear")
  .rotate(BoneName.SHOULDER_R, 0.2, 0, -0.3) // Pull back
  .rotate(BoneName.ELBOW_R, 0, 0, 1.6)
  .rotate(BoneName.WRIST_R, -0.8, 0, 0) // Palm faces forward
  .rotate(BoneName.SPINE_UPPER, 0, -0.2, 0) // Wind up
  .rotate(BoneName.SPINE_MIDDLE, 0, -0.15, 0)
  .rotate(BoneName.PELVIS, 0, -0.1, 0)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.2) // Guard
  .build()
  // Frame 2: Drive
  .keyframe(0.15, "ease-out")
  .rotate(BoneName.SHOULDER_R, -0.5, 0, 0.4) // Drive forward
  .rotate(BoneName.ELBOW_R, 0, 0, 0.3) // Extend
  .rotate(BoneName.WRIST_R, -0.6, 0, 0) // Heel of palm forward
  .rotate(BoneName.SPINE_UPPER, 0, 0.3, 0) // Torso rotates
  .rotate(BoneName.SPINE_MIDDLE, 0, 0.25, 0)
  .rotate(BoneName.PELVIS, 0, 0.2, 0)
  .build()
  // Frame 3: Impact
  .keyframe(0.18, "linear")
  .rotate(BoneName.SHOULDER_R, -0.7, 0, 0.5) // Full extension
  .rotate(BoneName.ELBOW_R, 0, 0, 0.05)
  .rotate(BoneName.WRIST_R, -0.5, 0, 0.1)
  .rotate(BoneName.SPINE_UPPER, 0, 0.4, 0)
  .rotate(BoneName.SPINE_MIDDLE, 0, 0.35, 0)
  .rotate(BoneName.PELVIS, 0, 0.25, 0)
  .build()
  // Frame 4: Recovery
  .keyframe(0.3, "ease-in")
  .rotate(BoneName.SHOULDER_R, -0.6, -0.4, -0.3)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.8)
  .rotate(BoneName.WRIST_R, 0, 0, 0)
  .rotate(BoneName.SHOULDER_L, -0.6, 0.4, 0.3)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.8)
  .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
  .rotate(BoneName.SPINE_MIDDLE, 0, 0, 0)
  .rotate(BoneName.PELVIS, 0, 0, 0)
  .build()
  .build();

/**
 * Hook punch animation (후크 - 횡타)
 *
 * Circular punch targeting the side of the head. Power technique.
 *
 * Animation phases:
 * 1. Wind-up (0.0s): Arm pulls to side
 * 2. Arc swing (0.1s): Arm swings in horizontal arc
 * 3. Impact (0.15s): Fist connects at temple level
 * 4. Recovery (0.3s): Return to guard
 *
 * Duration: 300ms
 *
 * @korean 후크애니메이션
 */
export const HOOK_ANIMATION = AnimationBuilder.create("hook")
  .withKoreanName("후크")
  .withDuration(0.3)
  .withType("attack")
  // Wind-up: arm pulls back and to side
  .keyframe(0.0, "linear")
  .rotate(BoneName.SHOULDER_R, 0.1, -0.6, -0.5) // Shoulder rotated out
  .rotate(BoneName.ELBOW_R, 0, 0, 1.57) // 90° bend
  .rotate(BoneName.SPINE_UPPER, 0, -0.3, 0) // Torso twisted back
  .rotate(BoneName.PELVIS, 0, -0.2, 0) // Hip loaded
  .rotate(BoneName.ELBOW_L, 0, 0, -1.2) // Guard
  .build()
  // Arc swing: horizontal sweep
  .keyframe(0.1, "ease-out")
  .rotate(BoneName.SHOULDER_R, 0, 0.4, 0.3) // Shoulder drives across
  .rotate(BoneName.ELBOW_R, 0, 0, 1.4) // Elbow stays bent
  .rotate(BoneName.SPINE_UPPER, 0, 0.4, 0) // Torso rotates into punch
  .rotate(BoneName.SPINE_MIDDLE, 0, 0.3, 0)
  .rotate(BoneName.PELVIS, 0, 0.25, 0) // Hip rotation for power
  .build()
  // Impact: full rotation
  .keyframe(0.15, "linear")
  .rotate(BoneName.SHOULDER_R, -0.1, 0.6, 0.4) // Full horizontal
  .rotate(BoneName.ELBOW_R, 0, 0, 1.35) // Elbow locked at angle
  .rotate(BoneName.WRIST_R, 0, 0.2, 0) // Wrist aligned
  .rotate(BoneName.SPINE_UPPER, 0, 0.5, 0)
  .rotate(BoneName.SPINE_MIDDLE, 0, 0.4, 0)
  .rotate(BoneName.PELVIS, 0, 0.35, 0)
  .build()
  // Recovery: return to guard
  .keyframe(0.3, "ease-in")
  .rotate(BoneName.SHOULDER_R, -0.6, -0.4, -0.3)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.8)
  .rotate(BoneName.SHOULDER_L, -0.6, 0.4, 0.3)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.8)
  .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
  .rotate(BoneName.PELVIS, 0, 0, 0)
  .build()
  .build();

/**
 * Low kick animation (하단차기 - 낮은차기)
 *
 * Low sweeping kick targeting opponent's thighs or calves.
 * Used to destabilize and damage legs.
 *
 * Animation phases:
 * 1. Chamber (0.0s): Small knee lift
 * 2. Swing (0.12s): Leg sweeps low horizontally
 * 3. Impact (0.18s): Shin connects at thigh height
 * 4. Recovery (0.35s): Return to stance
 *
 * Duration: 350ms
 *
 * @korean 하단차기애니메이션
 */
export const LOW_KICK_ANIMATION = AnimationBuilder.create("low_kick")
  .withKoreanName("하단차기")
  .withDuration(0.35)
  .withType("attack")
  // Chamber: small lift
  .keyframe(0.0, "linear")
  .rotate(BoneName.HIP_R, 0.5, 0, 0.3) // Low hip flexion
  .rotate(BoneName.KNEE_R, -0.8, 0, 0) // Knee bent
  .rotate(BoneName.KNEE_L, -0.2, 0, 0) // Support knee bent
  .rotate(BoneName.PELVIS, 0, -0.2, 0) // Slight turn
  .rotate(BoneName.SHOULDER_L, -0.6, 0.4, 0.3) // High guard
  .rotate(BoneName.ELBOW_L, 0, 0, -1.6)
  .build()
  // Swing: low horizontal sweep
  .keyframe(0.12, "ease-out")
  .rotate(BoneName.HIP_R, 0.4, 0, 1.2) // Hip rotates out
  .rotate(BoneName.KNEE_R, -0.3, 0, 0) // Leg extends
  .rotate(BoneName.FOOT_R, 0.2, 0, 0.2) // Ankle pointed
  .rotate(BoneName.PELVIS, 0, -0.8, 0) // Full hip rotation
  .rotate(BoneName.SPINE_UPPER, 0, 0.4, 0) // Counter-rotate
  .rotate(BoneName.KNEE_L, -0.4, 0, 0) // Lower for stability
  .build()
  // Impact: shin at thigh height
  .keyframe(0.18, "linear")
  .rotate(BoneName.HIP_R, 0.3, 0, 1.5) // Full rotation
  .rotate(BoneName.KNEE_R, -0.15, 0, 0) // Nearly straight
  .rotate(BoneName.FOOT_R, 0.3, 0, 0.3)
  .rotate(BoneName.PELVIS, 0, -1.2, 0)
  .rotate(BoneName.SPINE_UPPER, 0, 0.6, 0)
  .build()
  // Recovery: return to stance
  .keyframe(0.35, "ease-in")
  .rotate(BoneName.HIP_R, 0, 0, 0)
  .rotate(BoneName.KNEE_R, -0.2, 0, 0)
  .rotate(BoneName.KNEE_L, -0.2, 0, 0)
  .rotate(BoneName.FOOT_R, 0, 0, 0)
  .rotate(BoneName.PELVIS, 0, 0, 0)
  .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
  .rotate(BoneName.SHOULDER_R, -0.6, -0.4, -0.3)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.8)
  .build()
  .build();

/**
 * Slam animation (슬램 - 내던지기)
 *
 * Powerful lifting and slamming throw. High damage grappling technique.
 *
 * Animation phases:
 * 1. Clinch (0.0s): Grab and secure opponent
 * 2. Lift (0.2s): Hoist opponent up
 * 3. Slam (0.35s): Drive opponent down
 * 4. Recovery (0.5s): Return to stance
 *
 * Duration: 500ms
 *
 * @korean 슬램애니메이션
 */
export const SLAM_ANIMATION = AnimationBuilder.create("slam")
  .withKoreanName("슬램")
  .withDuration(0.5)
  .withType("attack")
  // Clinch: grab opponent
  .keyframe(0.0, "linear")
  .rotate(BoneName.SHOULDER_L, 0.6, 0.4, -0.5) // Arms wrap around
  .rotate(BoneName.ELBOW_L, 0, 0, -1.3)
  .rotate(BoneName.SHOULDER_R, 0.6, -0.4, 0.5)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.3)
  .rotate(BoneName.KNEE_L, -0.4, 0, 0) // Deep stance
  .rotate(BoneName.KNEE_R, -0.4, 0, 0)
  .rotate(BoneName.PELVIS, 0.2, 0, 0) // Lean in
  .build()
  // Lift: hoist up
  .keyframe(0.2, "ease-out")
  .rotate(BoneName.SHOULDER_L, 0.9, 0.2, -0.3) // Arms lift high
  .rotate(BoneName.ELBOW_L, 0, 0, -0.8)
  .rotate(BoneName.SHOULDER_R, 0.9, -0.2, 0.3)
  .rotate(BoneName.ELBOW_R, 0, 0, 0.8)
  .rotate(BoneName.KNEE_L, -0.1, 0, 0) // Standing tall
  .rotate(BoneName.KNEE_R, -0.1, 0, 0)
  .rotate(BoneName.PELVIS, -0.3, 0, 0) // Lean back
  .rotate(BoneName.SPINE_UPPER, -0.2, 0, 0) // Arched back
  .position(BoneName.PELVIS, 0, 0.1, 0) // Slight rise
  .build()
  // Slam: drive down
  .keyframe(0.35, "ease-in")
  .rotate(BoneName.SHOULDER_L, 0.3, 0.3, -0.6) // Arms drive down
  .rotate(BoneName.ELBOW_L, 0, 0, -1.4)
  .rotate(BoneName.SHOULDER_R, 0.3, -0.3, 0.6)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.4)
  .rotate(BoneName.KNEE_L, -0.6, 0, 0) // Deep squat
  .rotate(BoneName.KNEE_R, -0.6, 0, 0)
  .rotate(BoneName.PELVIS, 0.4, 0, 0) // Lean forward
  .rotate(BoneName.SPINE_UPPER, 0.3, 0, 0) // Forward bend
  .rotate(BoneName.SPINE_MIDDLE, 0.2, 0, 0)
  .position(BoneName.PELVIS, 0, -0.15, 0.2) // Low position
  .build()
  // Recovery
  .keyframe(0.5, "ease-in")
  .rotate(BoneName.SHOULDER_L, -0.6, 0.4, 0.3)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.8)
  .rotate(BoneName.SHOULDER_R, -0.6, -0.4, -0.3)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.8)
  .rotate(BoneName.KNEE_L, -0.2, 0, 0)
  .rotate(BoneName.KNEE_R, -0.2, 0, 0)
  .rotate(BoneName.PELVIS, 0, 0, 0)
  .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
  .rotate(BoneName.SPINE_MIDDLE, 0, 0, 0)
  .position(BoneName.PELVIS, 0, 0, 0)
  .build()
  .build();

/**
 * Wrist lock animation (손목꺾기 - 손목관절기)
 *
 * Joint lock targeting the wrist. Painful control technique.
 *
 * Animation phases:
 * 1. Grab (0.0s): Secure opponent's wrist
 * 2. Control (0.15s): Two-hand grip
 * 3. Lock (0.3s): Apply rotational pressure
 * 4. Hold (0.4s): Maintain lock position
 *
 * Duration: 400ms
 *
 * @korean 손목꺾기애니메이션
 */
export const WRIST_LOCK_ANIMATION = AnimationBuilder.create("wrist_lock")
  .withKoreanName("손목꺾기")
  .withDuration(0.4)
  .withType("attack")
  // Grab: secure wrist
  .keyframe(0.0, "linear")
  .rotate(BoneName.SHOULDER_R, 0.4, 0, 0.2) // Reach forward
  .rotate(BoneName.ELBOW_R, 0, 0, 0.6) // Arm extended
  .rotate(BoneName.WRIST_R, 0, -0.3, 0) // Palm faces opponent
  .rotate(BoneName.SHOULDER_L, 0.3, 0.2, -0.1) // Support hand
  .rotate(BoneName.ELBOW_L, 0, 0, -0.8)
  .rotate(BoneName.KNEE_L, -0.3, 0, 0) // Stable stance
  .rotate(BoneName.KNEE_R, -0.3, 0, 0)
  .build()
  // Control: two-hand grip
  .keyframe(0.15, "ease-out")
  .rotate(BoneName.SHOULDER_R, 0.2, 0.3, 0.4) // Hands come together
  .rotate(BoneName.ELBOW_R, 0, 0, 1.0)
  .rotate(BoneName.WRIST_R, 0.3, -0.4, 0.2) // Grip position
  .rotate(BoneName.SHOULDER_L, 0.3, 0.4, -0.3) // Both hands on wrist
  .rotate(BoneName.ELBOW_L, 0, 0, -1.2)
  .rotate(BoneName.WRIST_L, -0.2, 0.3, 0)
  .rotate(BoneName.PELVIS, 0, 0.2, 0) // Body turns
  .rotate(BoneName.SPINE_UPPER, 0, 0.15, 0)
  .build()
  // Lock: apply pressure
  .keyframe(0.3, "ease-in")
  .rotate(BoneName.SHOULDER_R, -0.1, 0.5, 0.6) // Rotate wrist down
  .rotate(BoneName.ELBOW_R, 0, 0, 1.3)
  .rotate(BoneName.WRIST_R, 0.5, -0.5, 0.4) // Twist
  .rotate(BoneName.SHOULDER_L, 0.1, 0.6, -0.4) // Counter-pressure
  .rotate(BoneName.ELBOW_L, 0, 0, -1.4)
  .rotate(BoneName.WRIST_L, -0.3, 0.4, -0.2)
  .rotate(BoneName.PELVIS, 0, 0.4, 0) // Body supports lock
  .rotate(BoneName.SPINE_UPPER, 0.1, 0.3, 0) // Lean in
  .rotate(BoneName.KNEE_L, -0.4, 0, 0) // Lower for control
  .build()
  // Hold: maintain position
  .keyframe(0.4, "linear")
  .rotate(BoneName.SHOULDER_R, -0.1, 0.5, 0.6)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.3)
  .rotate(BoneName.WRIST_R, 0.5, -0.5, 0.4)
  .rotate(BoneName.SHOULDER_L, 0.1, 0.6, -0.4)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.4)
  .rotate(BoneName.WRIST_L, -0.3, 0.4, -0.2)
  .rotate(BoneName.PELVIS, 0, 0.4, 0)
  .rotate(BoneName.SPINE_UPPER, 0.1, 0.3, 0)
  .rotate(BoneName.KNEE_L, -0.4, 0, 0)
  .build()
  .build();

/**
 * Arm bar animation (팔꺾기 - 팔관절기)
 *
 * Arm lock submission technique. Hyperextends the elbow.
 *
 * Animation phases:
 * 1. Grab (0.0s): Secure opponent's arm
 * 2. Control (0.2s): Pull arm across body
 * 3. Drop (0.35s): Go to ground position
 * 4. Lock (0.5s): Apply elbow pressure
 *
 * Duration: 500ms
 *
 * @korean 팔꺾기애니메이션
 */
export const ARM_BAR_ANIMATION = AnimationBuilder.create("arm_bar")
  .withKoreanName("팔꺾기")
  .withDuration(0.5)
  .withType("attack")
  // Grab: secure arm
  .keyframe(0.0, "linear")
  .rotate(BoneName.SHOULDER_R, 0.5, 0.3, 0.3) // Reach for arm
  .rotate(BoneName.ELBOW_R, 0, 0, 0.8)
  .rotate(BoneName.SHOULDER_L, 0.4, -0.2, -0.2) // Support hand
  .rotate(BoneName.ELBOW_L, 0, 0, -0.9)
  .rotate(BoneName.KNEE_L, -0.3, 0, 0)
  .rotate(BoneName.KNEE_R, -0.3, 0, 0)
  .build()
  // Control: pull across
  .keyframe(0.2, "ease-out")
  .rotate(BoneName.SHOULDER_R, 0.2, 0.6, 0.5) // Arms wrap arm
  .rotate(BoneName.ELBOW_R, 0, 0, 1.4)
  .rotate(BoneName.SHOULDER_L, 0.3, 0.5, -0.4)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.3)
  .rotate(BoneName.PELVIS, 0.2, 0.5, 0) // Turn body
  .rotate(BoneName.SPINE_UPPER, 0.1, 0.4, 0)
  .build()
  // Drop: go to ground
  .keyframe(0.35, "ease-in")
  .rotate(BoneName.SHOULDER_R, -0.2, 0.8, 0.7)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.5)
  .rotate(BoneName.SHOULDER_L, 0.1, 0.7, -0.5)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.5)
  .rotate(BoneName.PELVIS, 0.8, 0.3, 0) // Lean back for drop
  .rotate(BoneName.SPINE_UPPER, 0.6, 0.2, 0)
  .rotate(BoneName.SPINE_MIDDLE, 0.4, 0.1, 0)
  .rotate(BoneName.HIP_R, 1.2, 0, 0.3) // Legs go up
  .rotate(BoneName.KNEE_R, -0.5, 0, 0)
  .rotate(BoneName.HIP_L, 1.0, 0, -0.2)
  .rotate(BoneName.KNEE_L, -0.4, 0, 0)
  .position(BoneName.PELVIS, 0, -0.3, 0) // Lower position
  .build()
  // Lock: apply pressure
  .keyframe(0.5, "linear")
  .rotate(BoneName.SHOULDER_R, -0.3, 0.9, 0.8)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.6)
  .rotate(BoneName.SHOULDER_L, 0, 0.8, -0.6)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.6)
  .rotate(BoneName.PELVIS, 1.0, 0.2, 0) // Full recline
  .rotate(BoneName.SPINE_UPPER, 0.7, 0.15, 0)
  .rotate(BoneName.SPINE_MIDDLE, 0.5, 0.1, 0)
  .rotate(BoneName.HIP_R, 1.4, 0, 0.4) // Legs over opponent
  .rotate(BoneName.KNEE_R, -0.3, 0, 0)
  .rotate(BoneName.HIP_L, 1.2, 0, -0.3)
  .rotate(BoneName.KNEE_L, -0.2, 0, 0)
  .position(BoneName.PELVIS, 0, -0.4, -0.1) // Ground position
  .build()
  .build();

/**
 * Counter strike animation (반격 - 반격타격)
 *
 * Quick counter-attack after parrying. Exploits opponent's opening.
 *
 * Animation phases:
 * 1. Parry (0.0s): Deflect incoming attack
 * 2. Open (0.08s): Create opening
 * 3. Strike (0.15s): Fast counter punch
 * 4. Recovery (0.25s): Return to guard
 *
 * Duration: 250ms
 *
 * @korean 반격애니메이션
 */
export const COUNTER_STRIKE_ANIMATION = AnimationBuilder.create(
  "counter_strike"
)
  .withKoreanName("반격")
  .withDuration(0.25)
  .withType("attack")
  // Parry: deflect
  .keyframe(0.0, "linear")
  .rotate(BoneName.SHOULDER_L, 0.2, 0.5, -0.6) // Parrying arm
  .rotate(BoneName.ELBOW_L, 0, 0, -0.9)
  .rotate(BoneName.WRIST_L, 0, 0.3, 0) // Palm out
  .rotate(BoneName.SHOULDER_R, 0.1, 0, -0.2) // Counter arm ready
  .rotate(BoneName.ELBOW_R, 0, 0, 1.5)
  .rotate(BoneName.PELVIS, 0, -0.2, 0) // Slight turn
  .rotate(BoneName.KNEE_L, -0.25, 0, 0)
  .rotate(BoneName.KNEE_R, -0.3, 0, 0)
  .build()
  // Open: create gap
  .keyframe(0.08, "ease-out")
  .rotate(BoneName.SHOULDER_L, 0.3, 0.7, -0.5) // Push away
  .rotate(BoneName.ELBOW_L, 0, 0, -0.7)
  .rotate(BoneName.SHOULDER_R, 0.2, 0, -0.3) // Load counter
  .rotate(BoneName.ELBOW_R, 0, 0, 1.6)
  .rotate(BoneName.SPINE_UPPER, 0, -0.2, 0)
  .rotate(BoneName.PELVIS, 0, -0.15, 0)
  .build()
  // Strike: counter punch
  .keyframe(0.15, "ease-out")
  .rotate(BoneName.SHOULDER_R, -0.6, 0, 0.4) // Fast extension
  .rotate(BoneName.ELBOW_R, 0, 0, 0.1) // Full extend
  .rotate(BoneName.WRIST_R, 0, 0, -0.2)
  .rotate(BoneName.SHOULDER_L, 0.1, 0.3, -0.4) // Guard returns
  .rotate(BoneName.ELBOW_L, 0, 0, -1.2)
  .rotate(BoneName.SPINE_UPPER, 0, 0.35, 0) // Torso rotates
  .rotate(BoneName.SPINE_MIDDLE, 0, 0.25, 0)
  .rotate(BoneName.PELVIS, 0, 0.2, 0)
  .build()
  // Recovery: guard
  .keyframe(0.25, "ease-in")
  .rotate(BoneName.SHOULDER_R, -0.6, -0.4, -0.3)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.8)
  .rotate(BoneName.SHOULDER_L, -0.6, 0.4, 0.3)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.8)
  .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
  .rotate(BoneName.SPINE_MIDDLE, 0, 0, 0)
  .rotate(BoneName.PELVIS, 0, 0, 0)
  .rotate(BoneName.WRIST_R, 0, 0, 0)
  .build()
  .build();

/**
 * All skeletal animations mapped by name
 *
 * Includes attack, defense, movement, and idle animations.
 *
 * @korean 모든골격애니메이션
 */
export const ATTACK_ANIMATIONS = new Map<string, SkeletalAnimation>([
  ["jab", JAB_ANIMATION],
  ["cross", CROSS_ANIMATION],
  ["hook", HOOK_ANIMATION],
  ["front_kick", FRONT_KICK_ANIMATION],
  ["roundhouse_kick", ROUNDHOUSE_KICK_ANIMATION],
  ["side_kick", SIDE_KICK_ANIMATION],
  ["axe_kick", AXE_KICK_ANIMATION],
  ["back_kick", BACK_KICK_ANIMATION],
  ["tornado_kick", TORNADO_KICK_ANIMATION],
  ["jumping_kick", JUMPING_KICK_ANIMATION],
  ["low_kick", LOW_KICK_ANIMATION],
  ["elbow_strike", ELBOW_STRIKE_ANIMATION],
  ["elbow_uppercut", ELBOW_UPPERCUT_ANIMATION],
  ["knee_strike", KNEE_STRIKE_ANIMATION],
  ["block", BLOCK_ANIMATION],
  ["sweep", SWEEP_ANIMATION],
  ["throw", THROW_ANIMATION],
  ["slam", SLAM_ANIMATION],
  ["grapple", GRAPPLE_ANIMATION],
  ["wrist_lock", WRIST_LOCK_ANIMATION],
  ["arm_bar", ARM_BAR_ANIMATION],
  ["counter_attack", COUNTER_ATTACK_ANIMATION],
  ["counter_strike", COUNTER_STRIKE_ANIMATION],
  ["palm_strike", PALM_STRIKE_ANIMATION],
  ["walk", WALK_ANIMATION],
  ["idle_stance", IDLE_STANCE_ANIMATION],
  ["forward_dash", FORWARD_DASH_ANIMATION],
  ["backward_retreat", BACKWARD_RETREAT_ANIMATION],
  ["side_step", SIDE_STEP_ANIMATION],
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

/**
 * Maps technique keywords to animation names
 *
 * Used to determine which skeletal animation to play based on
 * technique name, ID, or description keywords.
 *
 * NOTE: Order matters! More specific patterns must come first.
 *
 * @korean 기술애니메이션매핑
 */
const TECHNIQUE_ANIMATION_MAP: ReadonlyArray<readonly [RegExp, string]> = [
  // Kicks (차기) - more specific patterns first
  [/axe.?kick|내려차기|naeryeo/i, "axe_kick"],
  [/back.?kick|뒤차기|dwi.?chagi/i, "back_kick"],
  [/tornado|회오리|hoe.?ori/i, "tornado_kick"],
  [/jump|뛰어|ttwi/i, "jumping_kick"],
  [/sweep|쓸기|걸기|품밟기|dari.?geolgi/i, "sweep"],
  [/side.?kick|옆차기|yeop.?chagi/i, "side_kick"],
  [/low.?kick|하단차기|낮은차기|thigh.?kick|leg.?kick/i, "low_kick"],
  [/front.?kick|앞차기|snap.?kick|ap.?chagi/i, "front_kick"],
  [/roundhouse|돌려차기|dolryeo/i, "roundhouse_kick"],
  // Knee strikes (무릎)
  [/knee|무릎|mureup/i, "knee_strike"],
  // Elbow strikes (팔꿈치)
  [/elbow|팔꿈치|팔굽|palkkumchi/i, "elbow_strike"],
  // Throws & Slams (던지기/내던지기)
  [/slam|내던지기|smash/i, "slam"],
  [/throw|던지기|deonjigi|ground.?pound/i, "throw"],
  // Grapple/Lock (꺾기/잡기) - specific locks first
  [/arm.?bar|팔꺾기|팔관절기|juji.?gatame/i, "arm_bar"],
  [/wrist.?lock|손목꺾기|손목관절기|kote.?gaeshi/i, "wrist_lock"],
  [/lock|grapple|꺾기|잡기|embrace|kkeokgi|japgi|submission/i, "grapple"],
  // Counter attacks (반격) - specific counter types
  [/counter.?strike|반격타격|카운터스트라이크/i, "counter_strike"],
  [/counter|반격|bangyeok|parry|redirect/i, "counter_attack"],
  // Blocks (막기)
  [/block|막기|makgi|defense|방어/i, "block"],
  // Punches (주먹) - check after specific patterns
  [/hook|후크|횡타|갈고리/i, "hook"],
  [/palm|장권|jang.?gwon/i, "palm_strike"],
  [/cross|십자|교차/i, "cross"],
  [/jab|잽|직권|찌르기|punch|주먹|권/i, "jab"],
  // Generic strikes last
  [/strike|타격|격|chigi/i, "jab"],
  // Default to jab for any other attack
] as const;

/**
 * Get animation name for a technique
 *
 * Analyzes technique name/ID to determine the appropriate skeletal animation.
 * Falls back to "jab" for unmatched techniques.
 *
 * @param techniqueNameOrId - Technique name, ID, or Korean name
 * @returns Animation name from ATTACK_ANIMATIONS map
 *
 * @example
 * ```typescript
 * getAnimationForTechnique("thunder_strike") // "jab"
 * getAnimationForTechnique("roundhouse_kick") // "roundhouse_kick"
 * getAnimationForTechnique("앞차기") // "front_kick"
 * ```
 *
 * @korean 기술에맞는애니메이션가져오기
 */
export const getAnimationForTechnique = (techniqueNameOrId: string): string => {
  for (const [pattern, animationName] of TECHNIQUE_ANIMATION_MAP) {
    if (pattern.test(techniqueNameOrId)) {
      return animationName;
    }
  }
  // Default to jab for any unmatched technique
  return "jab";
};
