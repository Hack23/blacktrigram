/**
 * Elbow and Knee Animations Module
 *
 * Close-range elbow (팔꿈치) and knee (무릎) techniques for Korean martial arts.
 * Uses MartialArtsAnimationBuilder for readable, martial arts expert-friendly code.
 *
 * 한국 무술 팔꿈치/무릎 애니메이션 모듈
 *
 * @module systems/animation/ElbowKneeAnimations
 * @korean 팔꿈치무릎애니메이션
 */

import type { SkeletalAnimation } from "../../types/skeletal";
import { MartialArtsAnimationBuilder } from "./MartialArtsAnimationBuilder";

// ═══════════════════════════════════════════════════════════════════════════
// ELBOW STRIKE (팔꿈치치기) - Horizontal Elbow
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Elbow Strike - 팔꿈치치기
 *
 * Horizontal elbow strike to temple or jaw.
 * Devastating close-range technique from Muay Thai influence.
 *
 * Phases:
 * 1. Chamber (준비): Arm crosses body
 * 2. Strike (치기): Elbow drives through target
 * 3. Recovery (복귀): Return to guard
 *
 * @korean 팔꿈치치기애니메이션
 */
export const ELBOW_STRIKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("elbow_strike", "팔꿈치치기")
    .asAttack(0.35)
    .elbowChamber(0.08) // 준비 - Arm crosses body
    .elbowStrike(0.12) // 치기 - Elbow drives through
    .recover(0.15) // 복귀
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ELBOW UPPERCUT (팔꿈치올려치기) - Rising Elbow
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Elbow Uppercut - 팔꿈치올려치기
 *
 * Rising elbow strike targeting chin from below.
 * Explosive vertical strike for close-range combat.
 *
 * @korean 팔꿈치올려치기애니메이션
 */
export const ELBOW_UPPERCUT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("elbow_uppercut", "팔꿈치올려치기")
    .asAttack(0.35)
    .elbowChamber(0.08) // 준비
    .elbowUppercut(0.12) // 올려치기 - Rising elbow
    .recover(0.15) // 복귀
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// KNEE STRIKE (무릎차기) - Clinch Knee
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Knee Strike - 무릎차기
 *
 * Powerful knee strike from clinch position.
 * Targets midsection or thigh from close range.
 *
 * Phases:
 * 1. Clinch (클린치): Control opponent's head
 * 2. Strike (차기): Knee drives up into target
 * 3. Reset: Return to clinch or disengage
 *
 * @korean 무릎차기애니메이션
 */
export const KNEE_STRIKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("knee_strike", "무릎차기")
    .asAttack(0.4)
    .withClinch() // 클린치 - Control position
    .kneeStrike(0.15) // 차기 - Knee drives up
    .recover(0.25) // Reset position
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT ELBOW/KNEE ANIMATION MAP
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map of all elbow and knee animations for easy access
 * 팔꿈치/무릎 애니메이션 맵
 */
export const ELBOW_KNEE_ANIMATIONS: ReadonlyMap<string, SkeletalAnimation> =
  new Map([
    ["elbow_strike", ELBOW_STRIKE_ANIMATION],
    ["elbow_uppercut", ELBOW_UPPERCUT_ANIMATION],
    ["knee_strike", KNEE_STRIKE_ANIMATION],
  ]);
