/**
 * Guarded Attack Animations (막기자세 공격 애니메이션)
 *
 * Korean martial arts attack animations with proper guard positions.
 * These animations demonstrate the complete guard integration pattern:
 * 1. Start from guard position (준비자세)
 * 2. Maintain non-striking hand guard during technique (방어 유지)
 * 3. Return to guard after technique (복귀)
 *
 * These serve as reference implementations for migrating other animations.
 *
 * @module systems/animation/GuardedAttackAnimations
 * @category Animation System
 * @korean 막기자세공격애니메이션
 */

import type { SkeletalAnimation } from "../../types/skeletal";
import { BoneName } from "../../types/skeletal";
import { MartialArtsAnimationBuilder } from "./MartialArtsAnimationBuilder";

/**
 * Guarded Jab Animation (막기자세 잽)
 *
 * Fast straight punch with proper Korean martial arts guard positioning.
 * Demonstrates middle guard (중단막기) maintained throughout technique.
 *
 * Traditional Taekwondo 정권지르기 (Jeonggwon Jireugi) with defensive posture.
 *
 * Animation phases:
 * 1. Guard (0.0s): Both hands in middle guard (중단막기)
 * 2. Wind-up (0.05s): Right arm prepares, left maintains guard
 * 3. Extension (0.1s): Right arm extends, left maintains guard
 * 4. Full extension (0.15s): Maximum reach, left maintains guard
 * 5. Recovery (0.3s): Both hands return to middle guard
 *
 * Duration: 300ms
 *
 * Guard integration:
 * - Starts: MIDDLE_GUARD both hands
 * - During: MIDDLE_GUARD left hand only
 * - Ends: MIDDLE_GUARD both hands
 *
 * @korean 막기자세잽애니메이션
 */
export const GUARDED_JAB_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("guarded_jab", "막기자세_잽")
    .asAttack(0.3)
    // Start: Both hands in middle guard (중단막기)
    .at(0.0)
    .withGuard("MIDDLE_GUARD") // Both hands protect chest
    .done<MartialArtsAnimationBuilder>()
    // Wind-up: Right arm prepares, left maintains guard
    .at(0.05)
    .rotate(BoneName.SHOULDER_R, 0.3, 0, -0.3) // Shoulder pulled back
    .rotate(BoneName.ELBOW_R, 0, 0, 1.8) // Arm bent tight
    .rotate(BoneName.SPINE_UPPER, 0, -0.15, 0) // Torso rotated back
    .withGuard("MIDDLE_GUARD", "left") // Left hand maintains guard
    .done<MartialArtsAnimationBuilder>()
    // Extension: Right arm snaps forward, left maintains guard
    .at(0.1)
    .rotate(BoneName.SHOULDER_R, -0.5, 0, 0.4) // Shoulder drives forward
    .rotate(BoneName.ELBOW_R, 0, 0, 0.3) // Elbow extends
    .rotate(BoneName.SPINE_UPPER, 0, 0.25, 0) // Torso rotates into punch
    .rotate(BoneName.SPINE_MIDDLE, 0, 0.15, 0)
    .rotate(BoneName.PELVIS, 0, 0.1, 0) // Hip rotation for power
    .withGuard("MIDDLE_GUARD", "left") // Left hand maintains guard
    .done<MartialArtsAnimationBuilder>()
    // Full extension: Maximum reach, left maintains guard
    .at(0.15)
    .rotate(BoneName.SHOULDER_R, -0.7, 0, 0.5) // Full shoulder extension
    .rotate(BoneName.ELBOW_R, 0, 0, 0.05) // Nearly straight arm
    .rotate(BoneName.WRIST_R, 0, 0, -0.2) // Wrist aligned for impact
    .rotate(BoneName.SPINE_UPPER, 0, 0.35, 0) // Peak torso rotation
    .rotate(BoneName.SPINE_MIDDLE, 0, 0.25, 0)
    .rotate(BoneName.PELVIS, 0, 0.2, 0)
    .withGuard("MIDDLE_GUARD", "left") // Left hand maintains guard
    .done<MartialArtsAnimationBuilder>()
    // Recovery: Both hands return to middle guard (복귀)
    .at(0.3)
    .withGuard("MIDDLE_GUARD") // Both hands return to guard
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0) // Reset torso
    .rotate(BoneName.SPINE_MIDDLE, 0, 0, 0)
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .rotate(BoneName.WRIST_R, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * Guarded Cross Animation (막기자세 크로스)
 *
 * Left arm power punch with proper Korean martial arts guard positioning.
 * Demonstrates middle guard (중단막기) with right hand protecting during strike.
 *
 * Traditional Taekwondo 역권지르기 (Yeokgwon Jireugi) with defensive posture.
 *
 * Animation phases:
 * 1. Guard (0.0s): Both hands in middle guard (중단막기)
 * 2. Wind-up (0.08s): Left arm prepares, right maintains guard
 * 3. Hip rotation (0.12s): Hips drive forward, right maintains guard
 * 4. Extension (0.15s): Left arm extends, right maintains guard
 * 5. Full extension (0.2s): Maximum power, right maintains guard
 * 6. Recovery (0.35s): Both hands return to middle guard
 *
 * Duration: 350ms
 *
 * Guard integration:
 * - Starts: MIDDLE_GUARD both hands
 * - During: MIDDLE_GUARD right hand only
 * - Ends: MIDDLE_GUARD both hands
 *
 * @korean 막기자세크로스애니메이션
 */
export const GUARDED_CROSS_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("guarded_cross", "막기자세_크로스")
    .asAttack(0.35)
    // Start: Both hands in middle guard (중단막기)
    .at(0.0)
    .withGuard("MIDDLE_GUARD") // Both hands protect chest
    .done<MartialArtsAnimationBuilder>()
    // Wind-up: Left arm prepares, right maintains guard
    .at(0.08)
    .rotate(BoneName.SHOULDER_L, 0.2, 0, 0.3) // Shoulder pulled back
    .rotate(BoneName.ELBOW_L, 0, 0, -1.8) // Arm bent tight
    .rotate(BoneName.SPINE_UPPER, 0, -0.2, 0) // Torso rotated back
    .rotate(BoneName.PELVIS, 0, -0.15, 0) // Hips coiled
    .withGuard("MIDDLE_GUARD", "right") // Right hand maintains guard
    .done<MartialArtsAnimationBuilder>()
    // Hip rotation: Power generation, right maintains guard
    .at(0.12)
    .rotate(BoneName.PELVIS, 0, 0.15, 0) // Hips drive forward
    .rotate(BoneName.SPINE_LOWER, 0, 0.2, 0)
    .rotate(BoneName.HIP_R, 0, 0.1, 0) // Rear foot pivots
    .withGuard("MIDDLE_GUARD", "right") // Right hand maintains guard
    .done<MartialArtsAnimationBuilder>()
    // Extension: Left arm snaps forward, right maintains guard
    .at(0.15)
    .rotate(BoneName.SHOULDER_L, -0.5, 0, -0.4) // Shoulder drives forward
    .rotate(BoneName.ELBOW_L, 0, 0, -0.3) // Elbow extends
    .rotate(BoneName.SPINE_UPPER, 0, 0.35, 0) // Torso rotates through
    .rotate(BoneName.SPINE_MIDDLE, 0, 0.3, 0)
    .rotate(BoneName.PELVIS, 0, 0.25, 0) // Full hip rotation
    .withGuard("MIDDLE_GUARD", "right") // Right hand maintains guard
    .done<MartialArtsAnimationBuilder>()
    // Full extension: Maximum power delivery, right maintains guard
    .at(0.2)
    .rotate(BoneName.SHOULDER_L, -0.7, 0, -0.5) // Full extension
    .rotate(BoneName.ELBOW_L, 0, 0, -0.05) // Nearly straight
    .rotate(BoneName.WRIST_L, 0, 0, 0.2) // Wrist aligned
    .rotate(BoneName.SPINE_UPPER, 0, 0.45, 0) // Peak rotation
    .rotate(BoneName.SPINE_MIDDLE, 0, 0.35, 0)
    .rotate(BoneName.SPINE_LOWER, 0, 0.25, 0)
    .rotate(BoneName.PELVIS, 0, 0.3, 0)
    .withGuard("MIDDLE_GUARD", "right") // Right hand maintains guard
    .done<MartialArtsAnimationBuilder>()
    // Recovery: Both hands return to middle guard (복귀)
    .at(0.35)
    .withGuard("MIDDLE_GUARD") // Both hands return to guard
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0) // Reset torso
    .rotate(BoneName.SPINE_MIDDLE, 0, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0)
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .rotate(BoneName.WRIST_L, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * Guarded Hook Animation (막기자세 훅)
 *
 * Circular hook punch with proper Korean martial arts guard positioning.
 * Demonstrates middle guard (중단막기) with left hand protecting during strike.
 *
 * Adapted from boxing hook with Korean defensive principles.
 *
 * Animation phases:
 * 1. Guard (0.0s): Both hands in middle guard (중단막기)
 * 2. Wind-up (0.08s): Right arm swings wide, left maintains guard
 * 3. Rotation (0.15s): Torso rotates, delivering hook
 * 4. Impact (0.2s): Maximum circular force
 * 5. Recovery (0.35s): Both hands return to middle guard
 *
 * Duration: 350ms
 *
 * Guard integration:
 * - Starts: MIDDLE_GUARD both hands
 * - During: MIDDLE_GUARD left hand only
 * - Ends: MIDDLE_GUARD both hands
 *
 * @korean 막기자세훅애니메이션
 */
export const GUARDED_HOOK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("guarded_hook", "막기자세_훅")
    .asAttack(0.35)
    // Start: Both hands in middle guard (중단막기)
    .at(0.0)
    .withGuard("MIDDLE_GUARD") // Both hands protect chest
    .done<MartialArtsAnimationBuilder>()
    // Wind-up: Right arm swings wide, left maintains guard
    .at(0.08)
    .rotate(BoneName.SHOULDER_R, -0.3, 0, 0.8) // Shoulder swings back
    .rotate(BoneName.ELBOW_R, 0, 0, 1.4) // Elbow bent for hook
    .rotate(BoneName.SPINE_UPPER, 0, -0.3, 0) // Torso rotates back
    .rotate(BoneName.PELVIS, 0, -0.2, 0)
    .withGuard("MIDDLE_GUARD", "left") // Left hand maintains guard
    .done<MartialArtsAnimationBuilder>()
    // Rotation: Torso rotates, delivering circular force
    .at(0.15)
    .rotate(BoneName.SHOULDER_R, -0.2, 0, -0.6) // Shoulder swings through
    .rotate(BoneName.ELBOW_R, 0, 0, 1.2) // Maintains bent angle
    .rotate(BoneName.SPINE_UPPER, 0, 0.5, 0) // Torso rotates through
    .rotate(BoneName.SPINE_MIDDLE, 0, 0.4, 0)
    .rotate(BoneName.PELVIS, 0, 0.3, 0)
    .withGuard("MIDDLE_GUARD", "left") // Left hand maintains guard
    .done<MartialArtsAnimationBuilder>()
    // Impact: Maximum circular force
    .at(0.2)
    .rotate(BoneName.SHOULDER_R, -0.1, 0, -1.0) // Full swing through
    .rotate(BoneName.ELBOW_R, 0, 0, 1.1) // Slight extension at impact
    .rotate(BoneName.WRIST_R, 0, 0, -0.3) // Wrist alignment
    .rotate(BoneName.SPINE_UPPER, 0, 0.6, 0) // Peak rotation
    .rotate(BoneName.SPINE_MIDDLE, 0, 0.5, 0)
    .rotate(BoneName.PELVIS, 0, 0.4, 0)
    .withGuard("MIDDLE_GUARD", "left") // Left hand maintains guard
    .done<MartialArtsAnimationBuilder>()
    // Recovery: Both hands return to middle guard (복귀)
    .at(0.35)
    .withGuard("MIDDLE_GUARD") // Both hands return to guard
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0) // Reset torso
    .rotate(BoneName.SPINE_MIDDLE, 0, 0, 0)
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .rotate(BoneName.WRIST_R, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * Guarded Front Kick Animation (막기자세 앞차기)
 *
 * Traditional Taekwondo front kick with high guard (상단막기) for face protection.
 * Demonstrates proper hand positioning during kicking techniques.
 *
 * Traditional Taekwondo 앞차기 (Apchagi) with high guard defensive posture.
 *
 * Animation phases:
 * 1. Guard (0.0s): Both hands in high guard (상단막기) - face protection for kick
 * 2. Chamber (0.1s): Knee lifts, hands maintain high guard
 * 3. Extension (0.2s): Leg extends forward, hands maintain high guard
 * 4. Retraction (0.35s): Leg returns to chamber, hands in high guard
 * 5. Recovery (0.55s): Both hands return to middle guard, leg down
 *
 * Duration: 550ms
 *
 * Guard integration:
 * - Starts: HIGH_GUARD both hands (face protection during kick)
 * - During: HIGH_GUARD both hands (maintain throughout kick)
 * - Ends: MIDDLE_GUARD both hands (return to standard guard)
 *
 * @korean 막기자세앞차기애니메이션
 */
export const GUARDED_FRONT_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("guarded_front_kick", "막기자세_앞차기")
    .asAttack(0.55)
    // Start: Both hands in high guard (상단막기) for kick
    .at(0.0)
    .withGuard("HIGH_GUARD") // Both hands protect face during kick
    .done<MartialArtsAnimationBuilder>()
    // Chamber: Knee lifts, hands maintain high guard
    .at(0.1)
    .rotate(BoneName.HIP_R, 1.57, 0, 0) // Hip flexed to 90°
    .rotate(BoneName.KNEE_R, -2.0, 0, 0) // Knee bent tight
    .rotate(BoneName.KNEE_L, -0.3, 0, 0) // Support leg slightly bent
    .rotate(BoneName.PELVIS, -0.15, 0, 0) // Pelvis tilts back
    .withGuard("HIGH_GUARD") // Maintain high guard
    .done<MartialArtsAnimationBuilder>()
    // Extension: Leg extends forward, hands maintain high guard
    .at(0.2)
    .rotate(BoneName.HIP_R, 1.4, 0, 0) // Hip slightly extends
    .rotate(BoneName.KNEE_R, -0.3, 0, 0) // Knee extends
    .rotate(BoneName.FOOT_R, -0.4, 0, 0) // Foot dorsiflexed (toes up)
    .position(BoneName.FOOT_R, 0, 0, 0.7) // Foot drives forward
    .rotate(BoneName.KNEE_L, -0.4, 0, 0) // Support leg powers kick
    .rotate(BoneName.PELVIS, -0.1, 0, 0)
    .withGuard("HIGH_GUARD") // Maintain high guard during impact
    .done<MartialArtsAnimationBuilder>()
    // Retraction: Leg returns to chamber, hands maintain high guard
    .at(0.35)
    .rotate(BoneName.HIP_R, 1.57, 0, 0) // Return to chamber
    .rotate(BoneName.KNEE_R, -2.0, 0, 0)
    .rotate(BoneName.FOOT_R, 0, 0, 0)
    .position(BoneName.FOOT_R, 0, 0, 0)
    .rotate(BoneName.KNEE_L, -0.3, 0, 0)
    .withGuard("HIGH_GUARD") // Maintain high guard
    .done<MartialArtsAnimationBuilder>()
    // Recovery: Leg down, hands return to middle guard (복귀)
    .at(0.55)
    .withGuard("MIDDLE_GUARD") // Return to standard middle guard
    .rotate(BoneName.HIP_R, 0, 0, 0) // Leg returns to stance
    .rotate(BoneName.KNEE_R, -0.2, 0, 0)
    .rotate(BoneName.KNEE_L, -0.2, 0, 0)
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * Export all guarded attack animations
 * @korean 모든막기자세공격애니메이션
 */
export const GUARDED_ATTACK_ANIMATIONS = {
  GUARDED_JAB: GUARDED_JAB_ANIMATION,
  GUARDED_CROSS: GUARDED_CROSS_ANIMATION,
  GUARDED_HOOK: GUARDED_HOOK_ANIMATION,
  GUARDED_FRONT_KICK: GUARDED_FRONT_KICK_ANIMATION,
} as const;
