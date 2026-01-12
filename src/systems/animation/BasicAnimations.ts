/**
 * Basic Animations Module
 *
 * Core locomotion and state animations: Idle, Run, Walk, Fall
 * These are the foundational animations for character states.
 * Uses MartialArtsAnimationBuilder for readable, martial arts expert-friendly code.
 *
 * 기본 애니메이션 모듈 - 대기, 달리기, 걷기, 낙법
 *
 * @module systems/animation/BasicAnimations
 * @korean 기본애니메이션
 */

import type { SkeletalAnimation } from "../../types/skeletal";
import { BoneName } from "../../types/skeletal";
import { MartialArtsAnimationBuilder } from "./MartialArtsAnimationBuilder";

// ═══════════════════════════════════════════════════════════════════════════
// IDLE ANIMATIONS (대기 애니메이션)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Idle Breathing - 대기호흡
 *
 * Subtle breathing animation while standing ready.
 * Looping idle state with slight body movement.
 *
 * @korean 대기호흡애니메이션
 */
export const IDLE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("idle", "대기")
    .asIdle(2.0, true)
    .at(0.0, "linear")
    .rotate(BoneName.KNEE_L, -0.15, 0, 0)
    .rotate(BoneName.KNEE_R, -0.15, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0.02, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.1, 0, -0.2)
    .rotate(BoneName.SHOULDER_R, 0.1, 0, 0.2)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.4)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.4)
    .done<MartialArtsAnimationBuilder>()
    .at(0.5, "ease-in-out")
    .rotate(BoneName.SPINE_UPPER, 0.05, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0.02, 0, 0)
    .position(BoneName.PELVIS, 0, 0.01, 0)
    .rotate(BoneName.SHOULDER_L, 0.12, 0, -0.22)
    .rotate(BoneName.SHOULDER_R, 0.12, 0, 0.22)
    .done<MartialArtsAnimationBuilder>()
    .at(1.0, "ease-in-out")
    .rotate(BoneName.SPINE_UPPER, 0.06, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0.03, 0, 0)
    .position(BoneName.PELVIS, 0, 0.015, 0)
    .rotate(BoneName.KNEE_L, -0.14, 0, 0)
    .rotate(BoneName.KNEE_R, -0.14, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(1.5, "ease-in-out")
    .rotate(BoneName.SPINE_UPPER, 0.03, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0.01, 0, 0)
    .position(BoneName.PELVIS, 0, 0.005, 0)
    .rotate(BoneName.SHOULDER_L, 0.11, 0, -0.21)
    .rotate(BoneName.SHOULDER_R, 0.11, 0, 0.21)
    .done<MartialArtsAnimationBuilder>()
    .at(2.0, "ease-in-out")
    .rotate(BoneName.KNEE_L, -0.15, 0, 0)
    .rotate(BoneName.KNEE_R, -0.15, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0.02, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.1, 0, -0.2)
    .rotate(BoneName.SHOULDER_R, 0.1, 0, 0.2)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.4)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.4)
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// RUN ANIMATIONS (달리기 애니메이션)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Run Cycle - 달리기
 *
 * Full running gait cycle with arm swing and leg drive.
 * Looping animation for sprint movement.
 *
 * @korean 달리기애니메이션
 */
export const RUN_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("run", "달리기")
    .asMovement(0.5, true)
    .at(0.0, "ease-out")
    .rotate(BoneName.PELVIS, 0.15, 0.08, 0)
    .rotate(BoneName.HIP_L, -0.5, 0, 0)
    .rotate(BoneName.KNEE_L, -0.2, 0, 0)
    .rotate(BoneName.FOOT_L, 0.2, 0, 0)
    .rotate(BoneName.HIP_R, 0.6, 0, 0)
    .rotate(BoneName.KNEE_R, -0.9, 0, 0)
    .rotate(BoneName.FOOT_R, -0.4, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.5, 0, 0)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.9)
    .rotate(BoneName.SHOULDER_R, -0.6, 0, 0)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.5)
    .rotate(BoneName.SPINE_LOWER, 0.1, -0.08, 0)
    .rotate(BoneName.SPINE_UPPER, 0.05, -0.05, 0)
    .position(BoneName.PELVIS, 0, 0.03, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.125, "linear")
    .rotate(BoneName.PELVIS, 0.1, 0, 0)
    .rotate(BoneName.HIP_L, 0, 0, 0)
    .rotate(BoneName.KNEE_L, -0.8, 0, 0)
    .rotate(BoneName.FOOT_L, 0, 0, 0)
    .rotate(BoneName.HIP_R, 0.3, 0, 0)
    .rotate(BoneName.KNEE_R, -0.4, 0, 0)
    .rotate(BoneName.FOOT_R, 0.1, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.2, 0, 0)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.7)
    .rotate(BoneName.SHOULDER_R, -0.3, 0, 0)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.6)
    .position(BoneName.PELVIS, 0, 0.06, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.25, "ease-out")
    .rotate(BoneName.PELVIS, 0.15, -0.08, 0)
    .rotate(BoneName.HIP_R, -0.5, 0, 0)
    .rotate(BoneName.KNEE_R, -0.2, 0, 0)
    .rotate(BoneName.FOOT_R, 0.2, 0, 0)
    .rotate(BoneName.HIP_L, 0.6, 0, 0)
    .rotate(BoneName.KNEE_L, -0.9, 0, 0)
    .rotate(BoneName.FOOT_L, -0.4, 0, 0)
    .rotate(BoneName.SHOULDER_R, 0.5, 0, 0)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.9)
    .rotate(BoneName.SHOULDER_L, -0.6, 0, 0)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.5)
    .rotate(BoneName.SPINE_LOWER, 0.1, 0.08, 0)
    .rotate(BoneName.SPINE_UPPER, 0.05, 0.05, 0)
    .position(BoneName.PELVIS, 0, 0.03, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.375, "linear")
    .rotate(BoneName.PELVIS, 0.1, 0, 0)
    .rotate(BoneName.HIP_R, 0, 0, 0)
    .rotate(BoneName.KNEE_R, -0.8, 0, 0)
    .rotate(BoneName.FOOT_R, 0, 0, 0)
    .rotate(BoneName.HIP_L, 0.3, 0, 0)
    .rotate(BoneName.KNEE_L, -0.4, 0, 0)
    .rotate(BoneName.FOOT_L, 0.1, 0, 0)
    .rotate(BoneName.SHOULDER_R, 0.2, 0, 0)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.7)
    .rotate(BoneName.SHOULDER_L, -0.3, 0, 0)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.6)
    .position(BoneName.PELVIS, 0, 0.06, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.5, "ease-out")
    .rotate(BoneName.PELVIS, 0.15, 0.08, 0)
    .rotate(BoneName.HIP_L, -0.5, 0, 0)
    .rotate(BoneName.KNEE_L, -0.2, 0, 0)
    .rotate(BoneName.FOOT_L, 0.2, 0, 0)
    .rotate(BoneName.HIP_R, 0.6, 0, 0)
    .rotate(BoneName.KNEE_R, -0.9, 0, 0)
    .rotate(BoneName.FOOT_R, -0.4, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.5, 0, 0)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.9)
    .rotate(BoneName.SHOULDER_R, -0.6, 0, 0)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.5)
    .rotate(BoneName.SPINE_LOWER, 0.1, -0.08, 0)
    .rotate(BoneName.SPINE_UPPER, 0.05, -0.05, 0)
    .position(BoneName.PELVIS, 0, 0.03, 0)
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * Walk Cycle - 걷기
 *
 * Full walking gait cycle with natural arm swing.
 * Looping animation for walking movement.
 * Uses MartialArtsAnimationBuilder (migrated from AnimationBuilder).
 *
 * @korean 걷기애니메이션
 */
export const WALK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("walk", "걷기")
    .asMovement(0.8, true)
    .at(0.0, "ease-out")
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
    .done<MartialArtsAnimationBuilder>()
    .at(0.2, "linear")
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
    .done<MartialArtsAnimationBuilder>()
    .at(0.4, "ease-out")
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
    .done<MartialArtsAnimationBuilder>()
    .at(0.6, "linear")
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
    .done<MartialArtsAnimationBuilder>()
    .at(0.8, "ease-out")
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
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// FALL ANIMATIONS (낙법 애니메이션)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Fall Forward - 전방낙법
 *
 * Forward fall animation (전방낙법 - Jeonbang Nakbeop).
 * Hands brace, body rotates to prone position.
 *
 * @korean 전방낙법애니메이션
 */
export const FALL_FORWARD_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("fall_forward", "전방낙법")
    .asMovement(0.4, false)
    .at(0.0, "linear")
    .rotate(BoneName.PELVIS, 0.3, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0.2, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0.3, 0, 0)
    .rotate(BoneName.KNEE_L, -0.3, 0, 0)
    .rotate(BoneName.KNEE_R, -0.3, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.1, "ease-in")
    .rotate(BoneName.PELVIS, 0.5, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0.4, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0.5, 0, 0)
    .rotate(BoneName.KNEE_L, -1.2, 0, 0)
    .rotate(BoneName.KNEE_R, -1.2, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.8, 0, -0.3)
    .rotate(BoneName.SHOULDER_R, 0.8, 0, 0.3)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.3)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.3)
    .position(BoneName.PELVIS, 0, -0.2, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.25, "ease-in")
    .rotate(BoneName.PELVIS, 0.8, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0.6, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0.7, 0, 0)
    .rotate(BoneName.SHOULDER_L, 1.2, 0, -0.2)
    .rotate(BoneName.SHOULDER_R, 1.2, 0, 0.2)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.2)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.2)
    .rotate(BoneName.HIP_L, 0.3, 0, 0)
    .rotate(BoneName.HIP_R, 0.3, 0, 0)
    .position(BoneName.PELVIS, 0, -0.4, 0.2)
    .done<MartialArtsAnimationBuilder>()
    .at(0.4, "ease-out")
    .rotate(BoneName.PELVIS, 1.57, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0.1, 0, 0)
    .rotate(BoneName.SPINE_UPPER, -0.1, 0, 0)
    .rotate(BoneName.HEAD, -0.3, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.3, 0, -0.8)
    .rotate(BoneName.SHOULDER_R, 0.3, 0, 0.8)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.0)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.0)
    .rotate(BoneName.HIP_L, 0, 0, 0)
    .rotate(BoneName.HIP_R, 0, 0, 0)
    .rotate(BoneName.KNEE_L, 0, 0, 0)
    .rotate(BoneName.KNEE_R, 0, 0, 0)
    .position(BoneName.PELVIS, 0, -0.8, 0.3)
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * Fall Backward - 후방낙법
 *
 * Backward fall animation (후방낙법 - Hubang Nakbeop).
 * Sit down, back impact, arms slap ground.
 *
 * @korean 후방낙법애니메이션
 */
export const FALL_BACKWARD_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("fall_backward", "후방낙법")
    .asMovement(0.5, false)
    .at(0.0, "linear")
    .rotate(BoneName.PELVIS, -0.2, 0, 0)
    .rotate(BoneName.SPINE_LOWER, -0.1, 0, 0)
    .rotate(BoneName.SPINE_UPPER, -0.2, 0, 0)
    .rotate(BoneName.KNEE_L, -0.2, 0, 0)
    .rotate(BoneName.KNEE_R, -0.2, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.12, "ease-in")
    .rotate(BoneName.PELVIS, -0.4, 0, 0)
    .rotate(BoneName.SPINE_LOWER, -0.3, 0, 0)
    .rotate(BoneName.SPINE_UPPER, -0.4, 0, 0)
    .rotate(BoneName.KNEE_L, -0.8, 0, 0)
    .rotate(BoneName.KNEE_R, -0.8, 0, 0)
    .rotate(BoneName.HIP_L, 0.5, 0, 0)
    .rotate(BoneName.HIP_R, 0.5, 0, 0)
    .position(BoneName.PELVIS, 0, -0.15, -0.1)
    .done<MartialArtsAnimationBuilder>()
    .at(0.25, "ease-in")
    .rotate(BoneName.PELVIS, -0.6, 0, 0)
    .rotate(BoneName.SPINE_LOWER, -0.4, 0, 0)
    .rotate(BoneName.SPINE_UPPER, -0.5, 0, 0)
    .rotate(BoneName.HIP_L, 0.8, 0, 0)
    .rotate(BoneName.HIP_R, 0.8, 0, 0)
    .rotate(BoneName.KNEE_L, -0.4, 0, 0)
    .rotate(BoneName.KNEE_R, -0.4, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.4, 0, -0.5)
    .rotate(BoneName.SHOULDER_R, 0.4, 0, 0.5)
    .position(BoneName.PELVIS, 0, -0.4, -0.15)
    .done<MartialArtsAnimationBuilder>()
    .at(0.38, "ease-in")
    .rotate(BoneName.PELVIS, -0.9, 0, 0)
    .rotate(BoneName.SPINE_LOWER, -0.6, 0, 0)
    .rotate(BoneName.SPINE_UPPER, -0.7, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.6, 0, -0.8)
    .rotate(BoneName.SHOULDER_R, 0.6, 0, 0.8)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.3)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.3)
    .rotate(BoneName.HEAD, 0.3, 0, 0)
    .position(BoneName.PELVIS, 0, -0.5, -0.2)
    .done<MartialArtsAnimationBuilder>()
    .at(0.5, "ease-out")
    .rotate(BoneName.PELVIS, -1.57, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0.1, 0, 0)
    .rotate(BoneName.HEAD, 0.2, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0, 0, -1.2)
    .rotate(BoneName.SHOULDER_R, 0, 0, 1.2)
    .rotate(BoneName.ELBOW_L, 0, 0, 0)
    .rotate(BoneName.ELBOW_R, 0, 0, 0)
    .rotate(BoneName.HIP_L, 0, 0, 0)
    .rotate(BoneName.HIP_R, 0, 0, 0)
    .rotate(BoneName.KNEE_L, -0.2, 0, 0)
    .rotate(BoneName.KNEE_R, -0.2, 0, 0)
    .position(BoneName.PELVIS, 0, -0.7, -0.3)
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * Fall Side Left - 좌측낙법
 *
 * Side fall to the left (측방낙법 - Cheukbang Nakbeop).
 * Shoulder/hip impact, arm slaps ground.
 *
 * @korean 좌측낙법애니메이션
 */
export const FALL_SIDE_LEFT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("fall_side_left", "좌측낙법")
    .asMovement(0.45, false)
    .at(0.0, "linear")
    .rotate(BoneName.PELVIS, 0, 0, 0.2)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0.3)
    .rotate(BoneName.KNEE_L, -0.3, 0, 0)
    .rotate(BoneName.KNEE_R, -0.2, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.1, "ease-in")
    .rotate(BoneName.PELVIS, 0, 0, 0.5)
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0.3)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0.5)
    .rotate(BoneName.HIP_L, 0.3, 0, 0.3)
    .rotate(BoneName.KNEE_L, -0.8, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0, 0, -0.5)
    .position(BoneName.PELVIS, -0.1, -0.1, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.22, "ease-in")
    .rotate(BoneName.PELVIS, 0, 0, 1.0)
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0.6)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0.8)
    .rotate(BoneName.SHOULDER_L, 0.3, 0, -0.9)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.4)
    .rotate(BoneName.HIP_L, 0.4, 0, 0.5)
    .rotate(BoneName.HIP_R, -0.2, 0, 0)
    .position(BoneName.PELVIS, -0.2, -0.3, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.33, "ease-in")
    .rotate(BoneName.PELVIS, 0, 0, 1.3)
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0.8)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 1.0)
    .rotate(BoneName.SHOULDER_L, 0.2, 0, -1.2)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.2)
    .rotate(BoneName.HEAD, 0, 0, 0.3)
    .position(BoneName.PELVIS, -0.3, -0.5, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.45, "ease-out")
    .rotate(BoneName.PELVIS, 0, 1.57, 1.57)
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0.2)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0.3)
    .rotate(BoneName.HEAD, 0, 0, 0.2)
    .rotate(BoneName.SHOULDER_L, 0, 0, -1.4)
    .rotate(BoneName.SHOULDER_R, 0.3, 0, 0.2)
    .rotate(BoneName.HIP_L, 0.2, 0, 0)
    .rotate(BoneName.HIP_R, -0.3, 0, 0)
    .rotate(BoneName.KNEE_L, -0.3, 0, 0)
    .rotate(BoneName.KNEE_R, -0.5, 0, 0)
    .position(BoneName.PELVIS, -0.4, -0.7, 0)
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * Fall Side Right - 우측낙법
 *
 * Side fall to the right (측방낙법 - Cheukbang Nakbeop).
 * Mirror of left side fall.
 *
 * @korean 우측낙법애니메이션
 */
export const FALL_SIDE_RIGHT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("fall_side_right", "우측낙법")
    .asMovement(0.45, false)
    .at(0.0, "linear")
    .rotate(BoneName.PELVIS, 0, 0, -0.2)
    .rotate(BoneName.SPINE_UPPER, 0, 0, -0.3)
    .rotate(BoneName.KNEE_R, -0.3, 0, 0)
    .rotate(BoneName.KNEE_L, -0.2, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.1, "ease-in")
    .rotate(BoneName.PELVIS, 0, 0, -0.5)
    .rotate(BoneName.SPINE_LOWER, 0, 0, -0.3)
    .rotate(BoneName.SPINE_UPPER, 0, 0, -0.5)
    .rotate(BoneName.HIP_R, 0.3, 0, -0.3)
    .rotate(BoneName.KNEE_R, -0.8, 0, 0)
    .rotate(BoneName.SHOULDER_R, 0, 0, 0.5)
    .position(BoneName.PELVIS, 0.1, -0.1, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.22, "ease-in")
    .rotate(BoneName.PELVIS, 0, 0, -1.0)
    .rotate(BoneName.SPINE_LOWER, 0, 0, -0.6)
    .rotate(BoneName.SPINE_UPPER, 0, 0, -0.8)
    .rotate(BoneName.SHOULDER_R, 0.3, 0, 0.9)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.4)
    .rotate(BoneName.HIP_R, 0.4, 0, -0.5)
    .rotate(BoneName.HIP_L, -0.2, 0, 0)
    .position(BoneName.PELVIS, 0.2, -0.3, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.33, "ease-in")
    .rotate(BoneName.PELVIS, 0, 0, -1.3)
    .rotate(BoneName.SPINE_LOWER, 0, 0, -0.8)
    .rotate(BoneName.SPINE_UPPER, 0, 0, -1.0)
    .rotate(BoneName.SHOULDER_R, 0.2, 0, 1.2)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.2)
    .rotate(BoneName.HEAD, 0, 0, -0.3)
    .position(BoneName.PELVIS, 0.3, -0.5, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.45, "ease-out")
    .rotate(BoneName.PELVIS, 0, -1.57, -1.57)
    .rotate(BoneName.SPINE_LOWER, 0, 0, -0.2)
    .rotate(BoneName.SPINE_UPPER, 0, 0, -0.3)
    .rotate(BoneName.HEAD, 0, 0, -0.2)
    .rotate(BoneName.SHOULDER_R, 0, 0, 1.4)
    .rotate(BoneName.SHOULDER_L, 0.3, 0, -0.2)
    .rotate(BoneName.HIP_R, 0.2, 0, 0)
    .rotate(BoneName.HIP_L, -0.3, 0, 0)
    .rotate(BoneName.KNEE_R, -0.3, 0, 0)
    .rotate(BoneName.KNEE_L, -0.5, 0, 0)
    .position(BoneName.PELVIS, 0.4, -0.7, 0)
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT BASIC ANIMATION MAP
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map of all basic animations for easy access
 * 기본 애니메이션 맵
 */
export const BASIC_ANIMATIONS: ReadonlyMap<string, SkeletalAnimation> = new Map(
  [
    // Idle
    ["idle", IDLE_ANIMATION],

    // Locomotion
    ["walk", WALK_ANIMATION],
    ["run", RUN_ANIMATION],

    // Falls (낙법)
    ["fall_forward", FALL_FORWARD_ANIMATION],
    ["fall_backward", FALL_BACKWARD_ANIMATION],
    ["fall_side_left", FALL_SIDE_LEFT_ANIMATION],
    ["fall_side_right", FALL_SIDE_RIGHT_ANIMATION],
  ]
);
