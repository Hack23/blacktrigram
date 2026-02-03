/**
 * Punch Animations Module
 *
 * All punch and hand strike animations (주먹 공격) for Korean martial arts.
 * Uses MartialArtsAnimationBuilder for readable, martial arts expert-friendly code.
 *
 * Updated to include proper Korean martial arts biomechanics:
 * - Hip rotation (엉덩이회전) for power generation
 * - Shoulder torque (어깨비틀기) coordination
 * - Fist rotation (주먹회전) from vertical to pronated
 * - Hikite (당기기) - opposite arm pulling for power
 * - Full arm extension (팔완전펴기) at impact
 *
 * 한국 무술 주먹 공격 애니메이션 모듈
 *
 * @module systems/animation/PunchAnimations
 * @korean 주먹애니메이션
 */

import type { SkeletalAnimation } from "@/types/skeletal";
import { BoneName } from "@/types/skeletal";
import { MartialArtsAnimationBuilder, TECHNIQUE_TIMING } from "../builders/MartialArtsAnimationBuilder";

// ═══════════════════════════════════════════════════════════════════════════
// JAB (잽) - Quick Straight Punch
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Jab - 잽 (빠른 직권)
 *
 * Fast straight punch with lead hand (left in orthodox stance) using proper Korean martial arts form.
 * Probing attack to gauge distance and set up combinations.
 *
 * Korean martial arts biomechanics (PHASE 2 - 95%+ Quality):
 * ═══════════════════════════════════════════════════════════════════
 * 1. Hip Rotation Sequence (엉덩이회전)
 *    - Hips rotate FIRST to generate power
 *    - Shoulders follow to transfer power
 *    - Arm extends LAST to deliver power
 *    - Multiple keyframes showing progression
 *
 * 2. Foot Pivot (발 회전)
 *    - Rear foot (right) pivots on ball of foot
 *    - Hip rotation drives the pivot
 *    - Ankle rotation: heel lifts, ball stays planted
 *
 * 3. Shoulder Mechanics (어깨 역학)
 *    - Lead shoulder (left): protraction (forward)
 *    - Rear shoulder (right): retraction (back) during wind-up
 *    - Proper scapular movement
 *
 * 4. Hikite - Opposite Arm Pull (당기기)
 *    - Right arm pulls back to hip
 *    - Creates rotational force
 *    - Essential for power generation
 *
 * 5. Fist Rotation (주먹회전)
 *    - Starts vertical (thumb up)
 *    - Rotates to horizontal (palm down) at full extension
 *    - Wrist pronation through the punch
 *
 * 6. Weight Transfer (체중이동)
 *    - Subtle forward shift (not a lunge)
 *    - Follows hip rotation
 *    - Center of gravity stays controlled
 *
 * Phases (7 keyframes for proper biomechanics):
 * 1. Start (시작): Both hands in guard, ready stance - 0ms
 * 2. Hip Initiation (엉덩이 시작): Hips begin rotation FIRST - 60ms
 * 3. Shoulder Drive (어깨 구동): Shoulders rotate, hikite begins - 40ms
 * 4. Extension Start (지르기 시작): Arm begins extending, fist rotating - 80ms
 * 5. Full Extension (완전 지르기): Full arm extension, fist pronated - 70ms
 * 6. Peak Impact (정점): Maximum reach, all power aligned - 50ms
 * 7. Recovery (복귀): Return to guard position - 250ms
 *
 * Total duration: 550ms (FAST technique)
 *
 * @korean 잽애니메이션
 */
export const JAB_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("jab", "잽")
    .asAttack(TECHNIQUE_TIMING.FAST.total)
    // Keyframe 1: Start - Guard position (0ms)
    .at(0, "linear")
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
    .rotate(BoneName.SHOULDER_L, -0.6, 0.4, 0.3)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.8)
    .rotate(BoneName.SHOULDER_R, -0.6, -0.4, -0.3)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.8)
    .rotate(BoneName.FOOT_L, 0, 0, 0)
    .rotate(BoneName.FOOT_R, 0, 0, 0)
    .rotate(BoneName.KNEE_L, -0.2, 0, 0)
    .rotate(BoneName.KNEE_R, -0.2, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 2: Hip Initiation - Hips rotate FIRST (60ms)
    .at(0.06, "ease-out")
    .rotate(BoneName.PELVIS, 0, 0.1, 0)
    .rotate(BoneName.SPINE_LOWER, 0, 0.08, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0, 0.05, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
    .rotate(BoneName.FOOT_R, 0.15, 0, 0)
    .rotate(BoneName.KNEE_R, -0.25, 0, 0)
    .rotate(BoneName.SHOULDER_L, -0.6, 0.4, 0.3)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.8)
    .rotate(BoneName.SHOULDER_R, -0.6, -0.4, -0.3)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.8)
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 3: Shoulder Drive - Shoulders rotate, hikite begins (100ms)
    .at(0.1, "ease-out")
    .rotate(BoneName.PELVIS, 0, 0.15, 0)
    .rotate(BoneName.SPINE_LOWER, 0, 0.15, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0, 0.18, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0.2, 0)
    .rotate(BoneName.FOOT_R, 0.2, 0, 0)
    .rotate(BoneName.SHOULDER_R, -0.4, -0.5, -0.4)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.6)
    .rotate(BoneName.SHOULDER_L, -0.5, 0.5, 0.4)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.7)
    .rotate(BoneName.WRIST_L, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 4: Extension Start - Arm begins extending (180ms)
    .at(0.18, "ease-out")
    .rotate(BoneName.PELVIS, 0, 0.18, 0)
    .rotate(BoneName.SPINE_LOWER, 0, 0.2, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0, 0.25, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0.3, 0)
    .position(BoneName.PELVIS, 0.02, 0, 0)
    .rotate(BoneName.FOOT_R, 0.25, 0, 0)
    .rotate(BoneName.SHOULDER_L, -0.3, 0.6, 0.5)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.8)
    .rotate(BoneName.WRIST_L, 0, 0, 0.1)
    .rotate(BoneName.SHOULDER_R, -0.2, -0.6, -0.5)
    .rotate(BoneName.ELBOW_R, 0, 0, -1.4)
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 5: Full Extension - Full arm extension, fist pronated (250ms)
    .at(0.25, "ease-in")
    .rotate(BoneName.PELVIS, 0, 0.2, 0)
    .rotate(BoneName.SPINE_LOWER, 0, 0.25, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0, 0.3, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0.35, 0)
    .position(BoneName.PELVIS, 0.03, 0, 0)
    .rotate(BoneName.FOOT_R, 0.28, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.2, 0.7, 0.6)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.15)
    .rotate(BoneName.WRIST_L, 0, 0, 0.2)
    .rotate(BoneName.SHOULDER_R, -0.2, -0.7, -0.6)
    .rotate(BoneName.ELBOW_R, 0, 0, -1.5)
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 6: Peak Impact - Maximum reach, all power aligned (300ms)
    .at(0.3, "linear")
    .rotate(BoneName.PELVIS, 0, 0.22, 0)
    .rotate(BoneName.SPINE_LOWER, 0, 0.27, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0, 0.32, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0.37, 0)
    .position(BoneName.PELVIS, 0.03, 0, 0)
    .rotate(BoneName.FOOT_R, 0.3, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.25, 0.75, 0.65)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.1)
    .rotate(BoneName.WRIST_L, 0, 0, 0.2)
    .rotate(BoneName.SHOULDER_R, -0.2, -0.75, -0.65)
    .rotate(BoneName.ELBOW_R, 0, 0, -1.57)
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 7: Recovery - Return to guard (550ms)
    .at(0.55, "ease-in-out")
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0)
    .rotate(BoneName.FOOT_R, 0, 0, 0)
    .rotate(BoneName.SHOULDER_L, -0.6, 0.4, 0.3)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.8)
    .rotate(BoneName.WRIST_L, 0, 0, 0)
    .rotate(BoneName.SHOULDER_R, -0.6, -0.4, -0.3)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.8)
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// CROSS (크로스) - Power Straight Punch
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Cross - 크로스 (교차 직권)
 *
 * Powerful straight punch with rear hand using full Korean martial arts biomechanics.
 * Full body rotation generates maximum power through hip and shoulder engagement.
 *
 * Korean martial arts biomechanics (역권지르기 - Yeokwon Jireugi) (PHASE 2 - 95%+ Quality):
 * ═══════════════════════════════════════════════════════════════════
 * 1. Hip Rotation Sequence (엉덩이회전)
 *    - Hips rotate FIRST to generate power (~25-30°)
 *    - Shoulders follow to transfer power
 *    - Arm extends LAST to deliver power
 *    - Sequential cascade creates maximum force
 *
 * 2. Foot Pivot (발 회전)
 *    - Rear foot (right) pivots dramatically on ball
 *    - Hip rotation drives strong pivot motion
 *    - Ankle rotation: heel lifts high, ball stays planted
 *    - Front foot stays stable for power transfer
 *
 * 3. Shoulder Mechanics (어깨 역학)
 *    - Rear shoulder (right): powerful protraction (forward)
 *    - Lead shoulder (left): retraction (back) for hikite
 *    - Full scapular movement for maximum reach
 *
 * 4. Hikite - Opposite Arm Pull (당기기)
 *    - Left arm pulls strongly back to hip
 *    - Creates powerful rotational force
 *    - Essential for maximum power generation
 *    - Counter-rotation multiplies force
 *
 * 5. Fist Rotation (주먹회전)
 *    - Starts vertical (thumb up) at chamber
 *    - Rotates to horizontal (palm down) during extension
 *    - Full wrist pronation maximizes impact surface
 *
 * 6. Weight Transfer (체중이동)
 *    - Significant forward weight shift
 *    - Follows hip rotation sequence
 *    - Center of gravity drives into target
 *    - More pronounced than jab
 *
 * Phases (7 keyframes for proper biomechanics):
 * 1. Start (시작): Both hands in guard, ready stance - 0ms
 * 2. Chamber (준비): Rear arm coils, body winds up - 90ms
 * 3. Hip Explosion (엉덩이 폭발): Hips rotate FIRST, powerful - 90ms
 * 4. Shoulder Drive (어깨 구동): Shoulders drive, hikite strong - 70ms
 * 5. Extension Power (지르기 힘): Arm extends with full rotation - 90ms
 * 6. Peak Impact (정점): Maximum power delivery - 80ms
 * 7. Recovery (복귀): Return to guard position - 310ms
 *
 * Total duration: 730ms (MEDIUM technique)
 *
 * @korean 크로스애니메이션
 */
export const CROSS_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("cross", "크로스")
    .asAttack(TECHNIQUE_TIMING.MEDIUM.total)
    // Keyframe 1: Start - Guard position (0ms)
    .at(0, "linear")
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
    .rotate(BoneName.SHOULDER_L, -0.6, 0.4, 0.3)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.8)
    .rotate(BoneName.SHOULDER_R, -0.6, -0.4, -0.3)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.8)
    .rotate(BoneName.FOOT_L, 0, 0, 0)
    .rotate(BoneName.FOOT_R, 0, 0, 0)
    .rotate(BoneName.KNEE_L, -0.2, 0, 0)
    .rotate(BoneName.KNEE_R, -0.2, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 2: Chamber - Rear arm coils, body winds up (90ms)
    .at(0.09, "ease-in")
    .rotate(BoneName.PELVIS, 0, -0.15, 0)
    .rotate(BoneName.SPINE_LOWER, 0, -0.12, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0, -0.1, 0)
    .rotate(BoneName.SPINE_UPPER, 0, -0.08, 0)
    .rotate(BoneName.SHOULDER_R, -0.2, -0.5, -0.4)
    .rotate(BoneName.ELBOW_R, 0, 0, -1.57)
    .rotate(BoneName.WRIST_R, 0, 0, 0)
    .rotate(BoneName.SHOULDER_L, -0.6, 0.4, 0.3)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.8)
    .rotate(BoneName.FOOT_R, 0.1, 0, 0)
    .rotate(BoneName.KNEE_R, -0.25, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 3: Hip Explosion - Hips rotate FIRST, powerfully (180ms)
    .at(0.18, "ease-out")
    .rotate(BoneName.PELVIS, 0, 0.3, 0)
    .rotate(BoneName.SPINE_LOWER, 0, 0.25, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0, 0.15, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0.05, 0)
    .rotate(BoneName.FOOT_R, 0.35, 0, 0)
    .rotate(BoneName.KNEE_R, -0.2, 0, 0)
    .position(BoneName.PELVIS, 0.03, 0, 0)
    .rotate(BoneName.SHOULDER_R, -0.2, -0.5, -0.4)
    .rotate(BoneName.ELBOW_R, 0, 0, -1.57)
    .rotate(BoneName.SHOULDER_L, -0.6, 0.4, 0.3)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.8)
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 4: Shoulder Drive - Shoulders drive, hikite strong (250ms)
    .at(0.25, "ease-out")
    .rotate(BoneName.PELVIS, 0, 0.4, 0)
    .rotate(BoneName.SPINE_LOWER, 0, 0.38, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0, 0.4, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0.45, 0)
    .rotate(BoneName.FOOT_R, 0.4, 0, 0)
    .position(BoneName.PELVIS, 0.05, 0, 0)
    .rotate(BoneName.SHOULDER_L, -0.3, 0.2, -0.4)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.5)
    .rotate(BoneName.SHOULDER_R, -0.4, -0.2, 0.3)
    .rotate(BoneName.ELBOW_R, 0, 0, -1.0)
    .rotate(BoneName.WRIST_R, 0, 0, 0.05)
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 5: Extension Power - Arm extends with full rotation (340ms)
    .at(0.34, "ease-in")
    .rotate(BoneName.PELVIS, 0, 0.45, 0)
    .rotate(BoneName.SPINE_LOWER, 0, 0.45, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0, 0.5, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0.55, 0)
    .rotate(BoneName.FOOT_R, 0.45, 0, 0)
    .position(BoneName.PELVIS, 0.06, 0, 0)
    .rotate(BoneName.SHOULDER_L, -0.2, 0, -0.6)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.57)
    .rotate(BoneName.SHOULDER_R, 0.3, 0, 0.7)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.15)
    .rotate(BoneName.WRIST_R, 0, 0, 0.15)
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 6: Peak Impact - Maximum power delivery (420ms)
    .at(0.42, "linear")
    .rotate(BoneName.PELVIS, 0, 0.5, 0)
    .rotate(BoneName.SPINE_LOWER, 0, 0.5, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0, 0.55, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0.6, 0)
    .rotate(BoneName.FOOT_R, 0.5, 0, 0)
    .position(BoneName.PELVIS, 0.07, 0, 0)
    .rotate(BoneName.SHOULDER_L, -0.2, -0.1, -0.7)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.57)
    .rotate(BoneName.SHOULDER_R, 0.35, 0.1, 0.8)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.09)
    .rotate(BoneName.WRIST_R, 0, 0, 0.2)
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 7: Recovery - Return to guard (730ms)
    .at(0.73, "ease-in-out")
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0)
    .rotate(BoneName.FOOT_R, 0, 0, 0)
    .rotate(BoneName.SHOULDER_L, -0.6, 0.4, 0.3)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.8)
    .rotate(BoneName.WRIST_R, 0, 0, 0)
    .rotate(BoneName.SHOULDER_R, -0.6, -0.4, -0.3)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.8)
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// PALM STRIKE (장권) - Open Palm Heel Strike
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Palm Strike - 장권
 *
 * Open palm heel strike targeting chin or solar plexus.
 * Traditional Taekwondo technique for close range.
 *
 * Total duration: 730ms (MEDIUM technique)
 *
 * @korean 장권애니메이션
 */
export const PALM_STRIKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("palm_strike", "장권")
    .asAttack(TECHNIQUE_TIMING.MEDIUM.total)
    .punchWindup(TECHNIQUE_TIMING.MEDIUM.chamber) // 준비 - 150ms
    .palmStrike(TECHNIQUE_TIMING.MEDIUM.extend) // 장권 - 200ms palm heel forward
    .palmStrike(TECHNIQUE_TIMING.MEDIUM.peak) // 정점 - 80ms hold
    .recover(TECHNIQUE_TIMING.MEDIUM.retract + TECHNIQUE_TIMING.MEDIUM.recover) // 복귀 - 300ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// HOOK (훅) - Curved Power Punch
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hook - 훅 (곡권)
 *
 * Curved punch targeting jaw or temple.
 * Generates power from hip and shoulder rotation.
 *
 * Phases:
 * 1. Wind-up (준비): Arm pulls back, elbow bent 90° - 150ms
 * 2. Rotation & Strike (회전+타격): Hip rotates, fist arcs into target - 300ms
 * 3. Recovery (복귀): Return to guard - 350ms
 *
 * Total duration: 800ms (HEAVY_LIGHT technique)
 *
 * @korean 훅애니메이션
 */
export const HOOK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("hook", "훅")
    .asAttack(TECHNIQUE_TIMING.HEAVY_LIGHT.total)
    .hookWindup(TECHNIQUE_TIMING.HEAVY_LIGHT.chamber) // 준비 - 150ms arm pulls back
    .hookPunch(TECHNIQUE_TIMING.HEAVY_LIGHT.extend) // 타격 - 200ms curved strike
    .hookPunch(TECHNIQUE_TIMING.HEAVY_LIGHT.peak) // 정점 - 100ms hold
    .recover(TECHNIQUE_TIMING.HEAVY_LIGHT.retract + TECHNIQUE_TIMING.HEAVY_LIGHT.recover) // 복귀 - 350ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// LEAD HOOK (리드훅) - Quick Lead Hand Hook
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Lead Hook - 리드훅
 *
 * Fast hook with lead hand.
 * Shorter range but quicker than rear hook.
 *
 * Total duration: 700ms (MEDIUM_LIGHT technique)
 *
 * @korean 리드훅애니메이션
 */
export const LEAD_HOOK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("lead_hook", "리드훅")
    .asAttack(TECHNIQUE_TIMING.MEDIUM_LIGHT.total)
    .hookWindup(TECHNIQUE_TIMING.MEDIUM_LIGHT.chamber) // Quick wind-up - 120ms
    .hookPunch(TECHNIQUE_TIMING.MEDIUM_LIGHT.extend) // Fast hook - 180ms
    .hookPunch(TECHNIQUE_TIMING.MEDIUM_LIGHT.peak) // Peak - 80ms
    .recover(TECHNIQUE_TIMING.MEDIUM_LIGHT.retract + TECHNIQUE_TIMING.MEDIUM_LIGHT.recover) // Recover - 320ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// UPPERCUT (어퍼컷) - Rising Power Punch
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Uppercut - 어퍼컷 (상권)
 *
 * Rising punch targeting chin from below.
 * Power generated from legs and hips.
 *
 * Phases:
 * 1. Crouch (낮추기): Drop level to load punch - 150ms
 * 2. Drive (상승): Drive up through legs - 200ms
 * 3. Strike (타격): Fist rises into chin - 100ms
 * 4. Recovery (복귀): Return to guard - 350ms
 *
 * Total duration: 800ms (HEAVY_LIGHT technique)
 *
 * @korean 어퍼컷애니메이션
 */
export const UPPERCUT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("uppercut", "어퍼컷")
    .asAttack(TECHNIQUE_TIMING.HEAVY_LIGHT.total)
    .uppercutCrouch(TECHNIQUE_TIMING.HEAVY_LIGHT.chamber) // 낮추기 - 150ms drop level
    .uppercutPunch(TECHNIQUE_TIMING.HEAVY_LIGHT.extend) // 상권 - 200ms rising strike
    .uppercutPunch(TECHNIQUE_TIMING.HEAVY_LIGHT.peak) // 정점 - 100ms hold
    .recover(TECHNIQUE_TIMING.HEAVY_LIGHT.retract + TECHNIQUE_TIMING.HEAVY_LIGHT.recover) // 복귀 - 350ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// LEAD UPPERCUT (리드어퍼컷) - Quick Lead Uppercut
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Lead Uppercut - 리드어퍼컷
 *
 * Fast uppercut with lead hand.
 * Good counter when opponent ducks.
 *
 * Total duration: 700ms (MEDIUM_LIGHT technique)
 *
 * @korean 리드어퍼컷애니메이션
 */
export const LEAD_UPPERCUT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("lead_uppercut", "리드어퍼컷")
    .asAttack(TECHNIQUE_TIMING.MEDIUM_LIGHT.total)
    .uppercutCrouch(TECHNIQUE_TIMING.MEDIUM_LIGHT.chamber) // Quick drop - 120ms
    .uppercutPunch(TECHNIQUE_TIMING.MEDIUM_LIGHT.extend) // Fast uppercut - 180ms
    .uppercutPunch(TECHNIQUE_TIMING.MEDIUM_LIGHT.peak) // Peak - 80ms
    .recover(TECHNIQUE_TIMING.MEDIUM_LIGHT.retract + TECHNIQUE_TIMING.MEDIUM_LIGHT.recover) // Recover - 320ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// OVERHAND (오버핸드) - Looping Power Punch
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Overhand - 오버핸드 (천권)
 *
 * Looping punch over opponent's guard.
 * High arc to strike top of head or jaw.
 *
 * Phases:
 * 1. Wind-up (준비): Arm raises high - 200ms
 * 2. Loop (호): Arm loops over - 300ms
 * 3. Strike (타격): Fist crashes down - 120ms
 * 4. Recovery (복귀): Return to guard - 380ms
 *
 * Total duration: 1000ms (HEAVY technique)
 *
 * @korean 오버핸드애니메이션
 */
export const OVERHAND_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("overhand", "오버핸드")
    .asAttack(TECHNIQUE_TIMING.HEAVY.total)
    .overhandPunch(TECHNIQUE_TIMING.HEAVY.chamber + TECHNIQUE_TIMING.HEAVY.extend) // 천권 - 500ms looping strike
    .overhandPunch(TECHNIQUE_TIMING.HEAVY.peak) // 정점 - 120ms hold
    .recover(TECHNIQUE_TIMING.HEAVY.retract + TECHNIQUE_TIMING.HEAVY.recover) // 복귀 - 380ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// BACKFIST (등주먹) - Spinning Backfist
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Backfist - 등주먹
 *
 * Back of fist whips into target.
 * Can be spinning or direct.
 *
 * Total duration: 700ms (MEDIUM_LIGHT technique)
 *
 * @korean 등주먹애니메이션
 */
export const BACKFIST_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("backfist", "등주먹")
    .asAttack(TECHNIQUE_TIMING.MEDIUM_LIGHT.total)
    .punchWindup(TECHNIQUE_TIMING.MEDIUM_LIGHT.chamber) // Pull back - 120ms
    .counterStrike(TECHNIQUE_TIMING.MEDIUM_LIGHT.extend) // Whip motion - 180ms
    .counterStrike(TECHNIQUE_TIMING.MEDIUM_LIGHT.peak) // Peak - 80ms
    .recover(TECHNIQUE_TIMING.MEDIUM_LIGHT.retract + TECHNIQUE_TIMING.MEDIUM_LIGHT.recover) // Recover - 320ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// SPINNING BACKFIST (회전등주먹) - Full Spin Backfist
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Spinning Backfist - 회전등주먹
 *
 * Full 360° rotation into backfist.
 * High-risk knockout technique.
 *
 * Total duration: 1200ms (SPINNING technique)
 *
 * @korean 회전등주먹애니메이션
 */
export const SPINNING_BACKFIST_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("spinning_backfist", "회전등주먹")
    .asAttack(TECHNIQUE_TIMING.SPINNING.total)
    .backKickSpin(TECHNIQUE_TIMING.SPINNING.chamber) // Full spin - 300ms
    .counterStrike(TECHNIQUE_TIMING.SPINNING.extend) // Backfist on completion - 350ms
    .counterStrike(TECHNIQUE_TIMING.SPINNING.peak) // Peak - 120ms
    .spinRecover(TECHNIQUE_TIMING.SPINNING.retract + TECHNIQUE_TIMING.SPINNING.recover) // Complete rotation - 430ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// HAMMER FIST (철퇴권) - Downward Hammer Strike
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hammer Fist - 철퇴권
 *
 * Bottom of fist strikes downward like a hammer.
 * Effective in ground-and-pound.
 *
 * Total duration: 900ms (JUMPING technique timing)
 *
 * @korean 철퇴권애니메이션
 */
export const HAMMER_FIST_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("hammer_fist", "철퇴권")
    .asAttack(TECHNIQUE_TIMING.JUMPING.total)
    .overhandPunch(TECHNIQUE_TIMING.JUMPING.chamber + TECHNIQUE_TIMING.JUMPING.extend) // Similar arc to overhand - 400ms
    .overhandPunch(TECHNIQUE_TIMING.JUMPING.peak) // Peak - 80ms
    .recover(TECHNIQUE_TIMING.JUMPING.retract + TECHNIQUE_TIMING.JUMPING.recover) // Recover - 420ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// SUPERMAN PUNCH (슈퍼맨펀치) - Flying Cross
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Superman Punch - 슈퍼맨펀치
 *
 * Jumping cross punch for extended range.
 * Fakes kick then throws power punch.
 *
 * Total duration: 1000ms (HEAVY technique)
 *
 * @korean 슈퍼맨펀치애니메이션
 */
export const SUPERMAN_PUNCH_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("superman_punch", "슈퍼맨펀치")
    .asAttack(TECHNIQUE_TIMING.HEAVY.total)
    .chamber(TECHNIQUE_TIMING.HEAVY.chamber * 0.75) // Fake kick chamber - 150ms (0.75 × 200ms)
    .punchWindup(TECHNIQUE_TIMING.HEAVY.chamber * 0.75) // Transfer to punch - 150ms
    .crossPunch(TECHNIQUE_TIMING.HEAVY.extend) // Throw cross in air - 300ms
    .crossPunch(TECHNIQUE_TIMING.HEAVY.peak) // Peak - 120ms
    .recover(TECHNIQUE_TIMING.HEAVY.recover + 0.05) // Land and recover - 280ms (230ms + 50ms landing)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// JAB-CROSS COMBINATION (잽크로스) - 1-2 Combo
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Jab-Cross - 잽크로스
 *
 * Classic 1-2 boxing combination.
 * Lead jab sets up rear cross.
 *
 * Phases (준비, 실행, 회수, 복귀):
 * 1. Jab chamber (잽 준비): 80ms
 * 2. Jab extend (잽 실행): 120ms  
 * 3. Cross transition (크로스 전환): 80ms (using peak for transition)
 * 4. Cross extend (크로스 실행): 100ms (using retract)
 * 5. Recovery (복귀): 320ms
 *
 * Total duration: 700ms (COMBO_FAST technique)
 * Sum: 80 + 120 + 80 + 100 + 320 = 700ms ✓
 *
 * @korean 잽크로스애니메이션
 */
export const JAB_CROSS_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("jab_cross", "잽크로스")
    .asAttack(TECHNIQUE_TIMING.COMBO_FAST.total)
    .punchWindup(TECHNIQUE_TIMING.COMBO_FAST.chamber) // Jab prep - 80ms
    .punchExtend(TECHNIQUE_TIMING.COMBO_FAST.extend) // Jab lands - 120ms
    .punchWindup(TECHNIQUE_TIMING.COMBO_FAST.peak) // Cross transition - 80ms (using peak for quick transition)
    .crossPunch(TECHNIQUE_TIMING.COMBO_FAST.retract) // Cross lands - 100ms (faster for speed combo)
    .recover(TECHNIQUE_TIMING.COMBO_FAST.recover) // Recover - 320ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// HOOK-HOOK COMBINATION (더블훅) - Double Hook
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Double Hook - 더블훅
 *
 * Left hook followed by right hook.
 * Body rotation carries momentum.
 *
 * Phases (준비, 실행, 회수, 복귀):
 * 1. First hook chamber (첫 훅 준비): 120ms (0.6 × chamber)
 * 2. First hook extend (첫 훅 실행): 180ms (0.6 × extend)
 * 3. Second hook chamber (둘째 훅 준비): 120ms (0.8 × retract)
 * 4. Second hook extend (둘째 훅 실행): 350ms (extend + 50ms)
 * 5. Recovery (복귀): 230ms
 *
 * Total duration: 1000ms (HEAVY technique)
 * Sum: 120 + 180 + 120 + 350 + 230 = 1000ms ✓
 *
 * @korean 더블훅애니메이션
 */
export const DOUBLE_HOOK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("double_hook", "더블훅")
    .asAttack(TECHNIQUE_TIMING.HEAVY.total)
    .hookWindup(TECHNIQUE_TIMING.HEAVY.chamber * 0.6) // First hook prep - 120ms (0.6 × chamber)
    .hookPunch(TECHNIQUE_TIMING.HEAVY.extend * 0.6) // First hook - 180ms (0.6 × extend)
    .hookWindup(TECHNIQUE_TIMING.HEAVY.retract * 0.8) // Second hook prep - 120ms (0.8 × retract)
    .hookPunch(TECHNIQUE_TIMING.HEAVY.extend + 0.05) // Second hook - 350ms (extend + 50ms)
    .recover(TECHNIQUE_TIMING.HEAVY.recover) // Recover - 230ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// BODY SHOT (바디샷) - Hook to Body
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Body Shot - 바디샷
 *
 * Hook targeting ribs/liver.
 * Lower trajectory than head hook.
 *
 * Total duration: 750ms (MEDIUM_HEAVY technique)
 *
 * @korean 바디샷애니메이션
 */
export const BODY_SHOT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("body_shot", "바디샷")
    .asAttack(TECHNIQUE_TIMING.MEDIUM_HEAVY.total)
    .uppercutCrouch(TECHNIQUE_TIMING.MEDIUM_HEAVY.chamber) // Drop level - 120ms
    .hookPunch(TECHNIQUE_TIMING.MEDIUM_HEAVY.extend) // Hook to body - 200ms
    .hookPunch(TECHNIQUE_TIMING.MEDIUM_HEAVY.peak) // Peak - 80ms
    .recover(TECHNIQUE_TIMING.MEDIUM_HEAVY.retract + TECHNIQUE_TIMING.MEDIUM_HEAVY.recover) // Recover - 350ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT PUNCH ANIMATION MAP
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map of all punch animations for easy access
 * 주먹 애니메이션 맵
 */
export const PUNCH_ANIMATIONS: ReadonlyMap<string, SkeletalAnimation> = new Map(
  [
    ["jab", JAB_ANIMATION],
    ["cross", CROSS_ANIMATION],
    ["palm_strike", PALM_STRIKE_ANIMATION],
    ["hook", HOOK_ANIMATION],
    ["lead_hook", LEAD_HOOK_ANIMATION],
    ["uppercut", UPPERCUT_ANIMATION],
    ["lead_uppercut", LEAD_UPPERCUT_ANIMATION],
    ["overhand", OVERHAND_ANIMATION],
    ["backfist", BACKFIST_ANIMATION],
    ["spinning_backfist", SPINNING_BACKFIST_ANIMATION],
    ["hammer_fist", HAMMER_FIST_ANIMATION],
    ["superman_punch", SUPERMAN_PUNCH_ANIMATION],
    ["jab_cross", JAB_CROSS_ANIMATION],
    ["double_hook", DOUBLE_HOOK_ANIMATION],
    ["body_shot", BODY_SHOT_ANIMATION],
  ]
);
