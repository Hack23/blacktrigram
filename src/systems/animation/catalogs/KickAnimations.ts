/**
 * Kick Animations Module
 *
 * All kick animations (발차기) for Korean martial arts.
 * Uses MartialArtsAnimationBuilder for readable, martial arts expert-friendly code.
 *
 * 한국 무술 발차기 애니메이션 모듈
 *
 * @module systems/animation/KickAnimations
 * @korean 발차기애니메이션
 */

import type { SkeletalAnimation } from "@/types/skeletal";
import { BoneName } from "@/types/skeletal";
import {
  MartialArtsAnimationBuilder,
  TECHNIQUE_TIMING,
} from "../builders/MartialArtsAnimationBuilder";

// ═══════════════════════════════════════════════════════════════════════════
// FRONT KICK (앞차기) - Basic Taekwondo Kick
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Front Kick - 앞차기
 *
 * Biomechanically accurate Taekwondo front kick with proper chamber mechanics.
 * Ball of foot strikes forward with explosive hip drive and snap.
 *
 * **Biomechanical Phases (생체역학 단계):**
 *
 * 0. **Stance (기본자세)** - 0ms
 *    - Fighting stance with weight centered
 *    - Arms in middle guard position
 *
 * 1. **Chamber Lift (들어올리기)** - 120ms
 *    - Hip flexed to 90° (1.57 rad) - knee at waist height
 *    - Knee bent tight to 120° (-2.0 rad) for coiled power
 *    - Foot plantarflexed (toes pointed down initially)
 *    - Supporting leg slight bend (-0.25 rad) for stability
 *    - Pelvis tilts back (-0.1 rad) for balance
 *    - Arms maintain guard
 *
 * 2. **Pre-Extension (준비확장)** - 180ms
 *    - Hip begins forward drive (1.7 rad)
 *    - Knee starts extension (-1.0 rad) - halfway point
 *    - Foot dorsiflexes (0.3 rad) - toes begin pointing up
 *    - Support leg deepens bend (-0.3 rad) for power transfer
 *    - Pelvis starts forward tilt (0.05 rad)
 *
 * 3. **Full Extension (완전확장)** - 300ms
 *    - Hip fully extended with forward drive (1.7 rad)
 *    - Knee nearly straight (0.1 rad) - maximum reach
 *    - Foot fully dorsiflexed (0.5 rad) - ball-of-foot strike
 *    - Pelvis tilted forward (0.15 rad) - hip thrust complete
 *    - Support leg in power position (-0.35 rad)
 *    - Spine slight forward lean (0.05 rad)
 *
 * 4. **Impact Peak (충격정점)** - 380ms
 *    - Maximum extension held briefly
 *    - All joints locked for power transfer
 *    - Full body alignment maintained
 *
 * 5. **Early Retraction (초기회수)** - 430ms
 *    - Knee begins to bend (-1.2 rad)
 *    - Hip maintains height (1.6 rad)
 *    - Foot returns to neutral (0.2 rad)
 *    - Controlled pull-back begins
 *
 * 6. **Chamber Return (준비복귀)** - 480ms
 *    - Returns through full chamber position
 *    - Hip at 90° (1.57 rad), knee tight (-2.0 rad)
 *    - Critical for proper technique and defense
 *
 * 7. **Recovery (복귀)** - 700ms
 *    - Leg lowers to stance
 *    - Weight redistributes
 *    - Return to fighting stance
 *
 * Total duration: 700ms (MEDIUM_LIGHT technique)
 *
 * **Korean Martial Arts Principles:**
 * - 준비 (Chamber): Essential coiling phase, not optional
 * - 차기 (Kick): Explosive snap from chamber
 * - 회수 (Retraction): Must return through chamber for defense
 * - 복귀 (Recovery): Controlled return to guard
 *
 * @korean 앞차기애니메이션
 */
export const FRONT_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("front_kick", "앞차기")
    .asAttack(TECHNIQUE_TIMING.MEDIUM_LIGHT.total)
    // Phase 0: Stance (기본자세) - 0ms
    .at(0.0)
    .withGuard("MIDDLE_GUARD")
    .done<MartialArtsAnimationBuilder>()
    // Phase 1: Chamber Lift (들어올리기) - 120ms
    .at(0.12)
    .rotate(BoneName.HIP_R, 1.57, 0, 0) // 90° hip flexion - knee at waist
    .rotate(BoneName.KNEE_R, -2.0, 0, 0) // Tight chamber - 120° knee bend
    .rotate(BoneName.FOOT_R, 0, 0, 0) // Foot neutral initially
    .rotate(BoneName.HIP_L, -0.05, 0, 0) // Support hip stable
    .rotate(BoneName.KNEE_L, -0.25, 0, 0) // Support leg slightly bent
    .rotate(BoneName.PELVIS, -0.1, 0, 0) // Pelvis tilts back for balance
    .rotate(BoneName.SPINE_LOWER, -0.05, 0, 0) // Slight back lean
    .rotate(BoneName.SPINE_UPPER, -0.03, 0, 0) // Upper body stable
    .withGuard("MIDDLE_GUARD")
    .done<MartialArtsAnimationBuilder>()
    // Phase 2: Pre-Extension (준비확장) - 180ms
    .at(0.18)
    .rotate(BoneName.HIP_R, 1.65, 0, 0) // Hip driving forward
    .rotate(BoneName.KNEE_R, -1.0, 0, 0) // Knee extending halfway
    .rotate(BoneName.FOOT_R, 0.3, 0, 0) // Foot starting dorsiflexion
    .rotate(BoneName.HIP_L, -0.1, 0, 0) // Support hip engages
    .rotate(BoneName.KNEE_L, -0.3, 0, 0) // Deeper bend for power
    .rotate(BoneName.PELVIS, 0.05, 0, 0) // Forward tilt starts
    .rotate(BoneName.SPINE_LOWER, 0.02, 0, 0) // Hip thrust beginning
    .rotate(BoneName.SPINE_UPPER, 0.01, 0, 0)
    .withGuard("MIDDLE_GUARD")
    .done<MartialArtsAnimationBuilder>()
    // Phase 3: Full Extension (완전확장) - 300ms
    .at(0.3)
    .rotate(BoneName.HIP_R, 1.7, 0, 0) // Hip fully extended
    .rotate(BoneName.KNEE_R, 0.1, 0, 0) // Knee nearly straight
    .rotate(BoneName.FOOT_R, 0.5, 0, 0) // Full dorsiflexion - ball of foot
    .rotate(BoneName.HIP_L, -0.1, 0, 0)
    .rotate(BoneName.KNEE_L, -0.35, 0, 0) // Support in power position
    .rotate(BoneName.PELVIS, 0.15, 0, 0) // Hip thrust complete
    .rotate(BoneName.SPINE_LOWER, 0.05, 0, 0) // Forward lean for power
    .rotate(BoneName.SPINE_UPPER, 0.03, 0, 0)
    .position(BoneName.FOOT_R, 0.6, 0, 0) // Foot forward for impact
    .withGuard("MIDDLE_GUARD")
    .done<MartialArtsAnimationBuilder>()
    // Phase 4: Impact Peak (충격정점) - 380ms
    .at(0.38)
    .rotate(BoneName.HIP_R, 1.7, 0, 0) // Hold extension
    .rotate(BoneName.KNEE_R, 0.1, 0, 0)
    .rotate(BoneName.FOOT_R, 0.5, 0, 0)
    .rotate(BoneName.PELVIS, 0.15, 0, 0)
    .position(BoneName.FOOT_R, 0.6, 0, 0)
    .withGuard("MIDDLE_GUARD")
    .done<MartialArtsAnimationBuilder>()
    // Phase 5: Early Retraction (초기회수) - 430ms
    .at(0.43)
    .rotate(BoneName.HIP_R, 1.6, 0, 0) // Hip still high
    .rotate(BoneName.KNEE_R, -1.2, 0, 0) // Knee bending back
    .rotate(BoneName.FOOT_R, 0.2, 0, 0) // Foot returns to neutral
    .rotate(BoneName.HIP_L, -0.05, 0, 0)
    .rotate(BoneName.KNEE_L, -0.28, 0, 0)
    .rotate(BoneName.PELVIS, 0.05, 0, 0) // Pelvis returning
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
    .position(BoneName.FOOT_R, 0.3, 0, 0)
    .withGuard("MIDDLE_GUARD")
    .done<MartialArtsAnimationBuilder>()
    // Phase 6: Chamber Return (준비복귀) - 480ms
    .at(0.48)
    .rotate(BoneName.HIP_R, 1.57, 0, 0) // Return to chamber
    .rotate(BoneName.KNEE_R, -2.0, 0, 0) // Tight chamber again
    .rotate(BoneName.FOOT_R, 0, 0, 0)
    .rotate(BoneName.HIP_L, -0.05, 0, 0)
    .rotate(BoneName.KNEE_L, -0.25, 0, 0)
    .rotate(BoneName.PELVIS, -0.05, 0, 0)
    .rotate(BoneName.SPINE_LOWER, -0.03, 0, 0)
    .rotate(BoneName.SPINE_UPPER, -0.02, 0, 0)
    .position(BoneName.FOOT_R, 0, 0, 0)
    .withGuard("MIDDLE_GUARD")
    .done<MartialArtsAnimationBuilder>()
    // Phase 7: Recovery (복귀) - 700ms
    .at(0.7)
    .withGuard("MIDDLE_GUARD")
    .rotate(BoneName.HIP_R, 0, 0, 0) // Return to stance
    .rotate(BoneName.KNEE_R, -0.2, 0, 0)
    .rotate(BoneName.FOOT_R, 0, 0, 0)
    .rotate(BoneName.HIP_L, 0, 0, 0)
    .rotate(BoneName.KNEE_L, -0.2, 0, 0)
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ROUNDHOUSE KICK (돌려차기) - Signature Taekwondo Kick
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Roundhouse Kick - 돌려차기
 *
 * Biomechanically accurate Taekwondo signature kick with explosive hip rotation.
 * Instep or shin strikes target in circular whipping arc.
 *
 * **Biomechanical Phases (생체역학 단계):**
 *
 * 0. **Stance (기본자세)** - 0ms
 *    - Fighting stance, ready position
 *    - Arms in middle guard
 *
 * 1. **Chamber with Hip Rotation (회전준비)** - 150ms
 *    - Hip flexed (1.2 rad) and rotated out (0.8 rad Z-axis)
 *    - Knee bent tight (-1.5 rad) for snap power
 *    - Supporting foot begins pivot (~-0.3 rad heel turn)
 *    - Pelvis rotates away (-0.5 rad Y-axis)
 *    - Torso counters with rotation (0.3 rad Y-axis)
 *    - Arms transition to high guard
 *
 * 2. **Early Extension (초기확장)** - 250ms
 *    - Hip continues rotation (1.3 rad flex, 1.2 rad rotation)
 *    - Knee begins snap extension (-0.8 rad)
 *    - Support foot pivots more (-0.6 rad)
 *    - Pelvis accelerates rotation (-0.9 rad Y)
 *    - Torso rotation builds (0.5 rad Y)
 *
 * 3. **Full Extension Whip (완전채찍)** - 350ms
 *    - Hip maximally rotated (1.2 rad flex, 1.6 rad rotation)
 *    - Knee snaps nearly straight (-0.1 rad)
 *    - Foot aligned with shin, slightly rotated
 *    - Support foot fully pivoted (90-180°, -1.4 rad)
 *    - Pelvis fully rotated (-1.2 rad Y)
 *    - Torso follows through (0.8 rad Y)
 *    - Foot extends laterally (0.8m forward)
 *
 * 4. **Impact Peak (충격정점)** - 450ms
 *    - Maximum hip rotation maintained
 *    - Full body coil unleashed
 *    - Instep/shin contact point
 *
 * 5. **Early Retraction (초기회수)** - 550ms
 *    - Knee begins to bend back (-0.8 rad)
 *    - Hip maintains rotation (1.4 rad rotation)
 *    - Support foot holds pivot
 *    - Controlled withdrawal begins
 *
 * 6. **Chamber Return (준비복귀)** - 600ms
 *    - Returns through chamber position
 *    - Hip rotated and flexed (1.2 rad flex, 0.8 rad rotation)
 *    - Knee tight (-1.5 rad)
 *    - Essential for defense
 *
 * 7. **Recovery (복귀)** - 800ms
 *    - Support foot counter-pivots back to stance
 *    - Hip closes and lowers
 *    - Return to fighting stance
 *    - Arms return to middle guard
 *
 * Total duration: 800ms (HEAVY_LIGHT technique)
 *
 * **Korean Martial Arts Principles:**
 * - 회전 (Rotation): Hip rotation is primary power source
 * - 채찍 (Whip): Knee snap creates whipping action
 * - 발바닥 축 (Pivot): Supporting foot pivot is essential
 * - 회수 (Retraction): Must return through chamber
 *
 * @korean 돌려차기애니메이션
 */
export const ROUNDHOUSE_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("roundhouse_kick", "돌려차기")
    .asAttack(TECHNIQUE_TIMING.HEAVY_LIGHT.total)
    // Phase 0: Stance (기본자세) - 0ms
    .at(0.0)
    .withGuard("MIDDLE_GUARD")
    .done<MartialArtsAnimationBuilder>()
    // Phase 1: Chamber with Hip Rotation (회전준비) - 150ms
    .at(0.15)
    .rotate(BoneName.HIP_R, 1.2, 0, 0.8) // Hip flexed and rotated out
    .rotate(BoneName.KNEE_R, -1.5, 0, 0) // Tight chamber for power
    .rotate(BoneName.FOOT_R, 0.2, 0, 0.1) // Foot positioned for strike
    .rotate(BoneName.HIP_L, 0.1, 0, 0) // Support hip engages
    .rotate(BoneName.KNEE_L, -0.3, 0, 0) // Support knee bends
    .rotate(BoneName.FOOT_L, 0, -0.3, 0) // Support foot begins pivot
    .rotate(BoneName.PELVIS, 0, -0.5, 0) // Pelvis rotates away
    .rotate(BoneName.SPINE_LOWER, 0, 0.2, 0) // Spine counter-rotates
    .rotate(BoneName.SPINE_MIDDLE, 0, 0.25, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0.3, 0) // Torso rotation
    .withGuard("HIGH_GUARD")
    .done<MartialArtsAnimationBuilder>()
    // Phase 2: Early Extension (초기확장) - 250ms
    .at(0.25)
    .rotate(BoneName.HIP_R, 1.3, 0, 1.2) // Hip rotation accelerating
    .rotate(BoneName.KNEE_R, -0.8, 0, 0) // Knee begins snap
    .rotate(BoneName.FOOT_R, 0.3, 0, 0.2) // Foot alignment
    .rotate(BoneName.HIP_L, 0.15, 0, 0)
    .rotate(BoneName.KNEE_L, -0.35, 0, 0)
    .rotate(BoneName.FOOT_L, 0, -0.6, 0) // More pivot
    .rotate(BoneName.PELVIS, 0, -0.9, 0) // Pelvis rotation builds
    .rotate(BoneName.SPINE_LOWER, 0, 0.35, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0, 0.4, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0.5, 0)
    .position(BoneName.FOOT_R, 0.4, 0, 0) // Foot begins arc
    .withGuard("HIGH_GUARD")
    .done<MartialArtsAnimationBuilder>()
    // Phase 3: Full Extension Whip (완전채찍) - 350ms
    .at(0.35)
    .rotate(BoneName.HIP_R, 1.2, 0, 1.6) // Maximum hip rotation
    .rotate(BoneName.KNEE_R, -0.1, 0, 0) // Snap extension
    .rotate(BoneName.FOOT_R, 0.4, 0, 0.3) // Foot aligned for contact
    .rotate(BoneName.HIP_L, 0.2, 0, 0)
    .rotate(BoneName.KNEE_L, -0.4, 0, 0) // Support in power position
    .rotate(BoneName.FOOT_L, 0, -1.4, 0) // Full pivot (90-180°)
    .rotate(BoneName.PELVIS, 0, -1.2, 0) // Full pelvis rotation
    .rotate(BoneName.SPINE_LOWER, 0, 0.5, -0.15) // Lateral lean away for balance
    .rotate(BoneName.SPINE_MIDDLE, 0, 0.6, -0.2) // Compensatory torso lean
    .rotate(BoneName.SPINE_UPPER, 0, 0.8, -0.25) // Upper spine leans most
    .position(BoneName.FOOT_R, 0.8, 0, 0) // Maximum lateral extension
    .withGuard("HIGH_GUARD")
    .done<MartialArtsAnimationBuilder>()
    // Phase 4: Impact Peak (충격정점) - 450ms
    .at(0.45)
    .rotate(BoneName.HIP_R, 1.2, 0, 1.6) // Hold maximum rotation
    .rotate(BoneName.KNEE_R, -0.1, 0, 0)
    .rotate(BoneName.FOOT_R, 0.4, 0, 0.3)
    .rotate(BoneName.PELVIS, 0, -1.2, 0)
    .rotate(BoneName.SPINE_LOWER, 0, 0.5, -0.15) // Maintain lean
    .rotate(BoneName.SPINE_MIDDLE, 0, 0.6, -0.2) // Maintain lean
    .rotate(BoneName.SPINE_UPPER, 0, 0.8, -0.25) // Maintain lean
    .position(BoneName.FOOT_R, 0.8, 0, 0)
    .withGuard("HIGH_GUARD")
    .done<MartialArtsAnimationBuilder>()
    // Phase 5: Early Retraction (초기회수) - 550ms
    .at(0.55)
    .rotate(BoneName.HIP_R, 1.25, 0, 1.4) // Begin withdrawal
    .rotate(BoneName.KNEE_R, -0.8, 0, 0) // Knee bends back
    .rotate(BoneName.FOOT_R, 0.2, 0, 0.2)
    .rotate(BoneName.HIP_L, 0.15, 0, 0)
    .rotate(BoneName.KNEE_L, -0.35, 0, 0)
    .rotate(BoneName.FOOT_L, 0, -1.2, 0) // Hold pivot
    .rotate(BoneName.PELVIS, 0, -1.0, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0.6, 0)
    .position(BoneName.FOOT_R, 0.5, 0, 0)
    .withGuard("HIGH_GUARD")
    .done<MartialArtsAnimationBuilder>()
    // Phase 6: Chamber Return (준비복귀) - 600ms
    .at(0.6)
    .rotate(BoneName.HIP_R, 1.2, 0, 0.8) // Back to chamber
    .rotate(BoneName.KNEE_R, -1.5, 0, 0) // Tight chamber again
    .rotate(BoneName.FOOT_R, 0.2, 0, 0.1)
    .rotate(BoneName.HIP_L, 0.1, 0, 0)
    .rotate(BoneName.KNEE_L, -0.3, 0, 0)
    .rotate(BoneName.FOOT_L, 0, -0.8, 0)
    .rotate(BoneName.PELVIS, 0, -0.6, 0)
    .rotate(BoneName.SPINE_LOWER, 0, 0.3, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0.4, 0)
    .position(BoneName.FOOT_R, 0, 0, 0)
    .withGuard("HIGH_GUARD")
    .done<MartialArtsAnimationBuilder>()
    // Phase 7: Recovery (복귀) - 800ms
    .at(0.8)
    .withGuard("MIDDLE_GUARD")
    .rotate(BoneName.HIP_R, 0, 0, 0) // Return to stance
    .rotate(BoneName.KNEE_R, -0.2, 0, 0)
    .rotate(BoneName.FOOT_R, 0, 0, 0)
    .rotate(BoneName.HIP_L, 0, 0, 0)
    .rotate(BoneName.KNEE_L, -0.2, 0, 0)
    .rotate(BoneName.FOOT_L, 0, 0, 0) // Counter-pivot back
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// SIDE KICK (옆차기) - Lateral Heel Strike
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Side Kick - 옆차기
 *
 * Powerful lateral kick with heel striking target.
 * Body turns sideways for maximum reach.
 *
 * Phases:
 * 0. Stance (기본자세): Initial fighting stance - 0ms
 * 1. Chamber (준비): Turn sideways, knee lifts - 120ms
 * 2. Extension (차기): Heel drives through target - 200ms
 * 3. Peak (정점): Hold at extension - 80ms
 * 4. Retraction (회수): Leg returns - 150ms
 * 5. Recovery (복귀): Return to stance - 200ms
 *
 * Total duration: 750ms (MEDIUM_HEAVY technique)
 *
 * @korean 옆차기애니메이션
 */
export const SIDE_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("side_kick", "옆차기")
    .asAttack(TECHNIQUE_TIMING.MEDIUM_HEAVY.total)
    .stance() // 기본자세 - Initial stance at t=0
    .withKoreanMiddleGuard() // 중단막기 - Hands protect face
    .sideKickChamber(TECHNIQUE_TIMING.MEDIUM_HEAVY.chamber) // 준비 - 120ms turn sideways
    .withKoreanHighGuard() // 상단막기 - High guard when turned sideways
    .sideKickExtend(TECHNIQUE_TIMING.MEDIUM_HEAVY.extend) // 차기 - 200ms heel drives
    .withKoreanHighGuard() // 상단막기 - Maintain high guard during thrust
    .sideKickExtend(TECHNIQUE_TIMING.MEDIUM_HEAVY.peak) // 정점 - 80ms hold at extension
    .withKoreanHighGuard() // 상단막기 - Maintain guard at peak
    .retract(TECHNIQUE_TIMING.MEDIUM_HEAVY.retract) // 회수 - 150ms
    .recover(TECHNIQUE_TIMING.MEDIUM_HEAVY.recover) // 복귀 - 200ms
    .withKoreanMiddleGuard() // 중단막기 - Return to guard
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// AXE KICK (내려차기) - Downward Heel Strike
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Axe Kick - 내려차기
 *
 * High kick that comes down like an axe on target.
 * Heel strikes head or collarbone from above.
 *
 * Phases:
 * 1. Rise (올리기): Leg rises high above target - 200ms
 * 2. Chop (내려치기): Heel drives down - 300ms
 * 3. Peak (정점): Brief hold at impact - 120ms
 * 4. Set down (착지): Controlled leg descent - 150ms
 * 5. Recovery (복귀): Return to stance - 230ms
 *
 * Total duration: 1000ms (HEAVY technique)
 *
 * @korean 내려차기애니메이션
 */
export const AXE_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("axe_kick", "내려차기")
    .asAttack(TECHNIQUE_TIMING.HEAVY.total)
    .axeKickRise(TECHNIQUE_TIMING.HEAVY.chamber) // 올리기 - 200ms leg rises high
    .withKoreanHighGuard()
    .axeKickChop(TECHNIQUE_TIMING.HEAVY.extend) // 내려치기 - 300ms heel chops down
    .axeKickChop(TECHNIQUE_TIMING.HEAVY.peak) // 정점 - 120ms hold at impact
    .setDown(TECHNIQUE_TIMING.HEAVY.retract) // 착지 - 150ms controlled descent
    .recover(TECHNIQUE_TIMING.HEAVY.recover) // 복귀 - 230ms return to stance
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// BACK KICK (뒤차기) - Spinning Heel Strike
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Back Kick - 뒤차기
 *
 * Powerful spinning kick with heel thrust backward.
 * Body rotates 180° for surprise attack.
 *
 * Phases:
 * 0. Stance (기본자세): Initial fighting stance - 0ms
 * 1. Spin & chamber (회전+준비): Body rotates 180° and leg loads - 200ms
 * 2. Thrust (차기): Heel drives backward - 300ms
 * 3. Peak (정점): Hold at extension - 120ms
 * 4. Recovery (복귀): Complete rotation, return to stance - 380ms
 *
 * Total duration: 1000ms (HEAVY technique)
 *
 * @korean 뒤차기애니메이션
 */
export const BACK_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("back_kick", "뒤차기")
    .asAttack(TECHNIQUE_TIMING.HEAVY.total)
    .stance() // 기본자세 - Initial stance at t=0
    .withKoreanMiddleGuard() // 중단막기 - Hands protect face
    .backKickSpin(TECHNIQUE_TIMING.HEAVY.chamber) // 회전+준비 - 200ms body rotates and chambers
    .withKoreanHighGuard() // 상단막기 - High guard during spin (exposed)
    .backKickThrust(TECHNIQUE_TIMING.HEAVY.extend) // 차기 - 300ms heel thrusts
    .withKoreanHighGuard() // 상단막기 - Maintain guard during thrust
    .backKickThrust(TECHNIQUE_TIMING.HEAVY.peak) // 정점 - 120ms hold at extension
    .withKoreanHighGuard() // 상단막기 - Maintain guard at peak
    .spinRecover(
      TECHNIQUE_TIMING.HEAVY.retract + TECHNIQUE_TIMING.HEAVY.recover,
    ) // 복귀 - 380ms (150ms + 230ms)
    .withKoreanMiddleGuard() // 중단막기 - Return to guard
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// TORNADO KICK (회전차기) - Jumping Spin Kick
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Tornado Kick - 회전차기
 *
 * Jumping spinning kick with full 360° rotation and instep strike.
 * Full 360° body rotation with both feet off ground.
 *
 * ENHANCED with proper full rotation using tornadoJump method:
 * - Jump with full 360° spin, not just chamber
 * - Arms generate rotational momentum
 * - Peak height reached at completion of spin
 * - Roundhouse kick executes at apex
 *
 * Phases:
 * 1. Jump & Spin (도약/회전): 360° rotation in air - 300ms
 * 2. Strike (차기): Roundhouse at apex - 350ms
 * 3. Peak (정점): Full extension hold - 120ms
 * 4. Landing (착지): Return to ground - 430ms
 *
 * Total duration: 1200ms (SPINNING technique)
 *
 * @korean 회전차기애니메이션
 */
export const TORNADO_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("tornado_kick", "회전차기")
    .asAttack(TECHNIQUE_TIMING.SPINNING.total)
    .tornadoJump(TECHNIQUE_TIMING.SPINNING.chamber) // Jump with full 360° rotation - 300ms
    .withKoreanHighGuard() // 상단막기 - High guard during airborne spin
    .roundhouseExtend(TECHNIQUE_TIMING.SPINNING.extend) // Roundhouse at apex - 350ms
    .withKoreanHighGuard() // 상단막기 - Maintain guard during strike
    .roundhouseExtend(TECHNIQUE_TIMING.SPINNING.peak) // Peak - 120ms
    .withKoreanHighGuard() // 상단막기 - Maintain guard at peak
    .spinRecover(
      TECHNIQUE_TIMING.SPINNING.retract + TECHNIQUE_TIMING.SPINNING.recover,
    ) // Land and recover - 430ms
    .withKoreanMiddleGuard() // 중단막기 - Return to guard on landing
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// JUMPING KICK (뛰어차기) - Airborne Front Kick
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Jumping Kick - 뛰어차기
 *
 * Front kick executed while airborne for extra height/reach.
 * Traditional Taekwondo flying kick technique.
 *
 * Total duration: 900ms (JUMPING technique)
 *
 * @korean 뛰어차기애니메이션
 */
export const JUMPING_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("jumping_kick", "뛰어차기")
    .asAttack(TECHNIQUE_TIMING.JUMPING.total)
    .chamber(TECHNIQUE_TIMING.JUMPING.chamber) // Jump prep with chamber - 180ms
    .withKoreanHighGuard() // 상단막기 - High guard during airborne attack
    .extend(TECHNIQUE_TIMING.JUMPING.extend) // Kick in air - 220ms
    .withKoreanHighGuard() // 상단막기 - Maintain guard during kick
    .retract(TECHNIQUE_TIMING.JUMPING.retract) // Retract before landing - 120ms
    .withKoreanMiddleGuard() // 중단막기 - Prepare for landing
    .recover(TECHNIQUE_TIMING.JUMPING.recover) // Land and recover - 300ms
    .withKoreanMiddleGuard() // 중단막기 - Return to guard
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// SWEEP (걸기) - Low Leg Sweep
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Sweep - 걸기
 *
 * Low sweeping kick targeting opponent's legs.
 * Used to unbalance or take down opponent.
 *
 * Total duration: 800ms (HEAVY_LIGHT technique)
 *
 * @korean 걸기애니메이션
 */
export const SWEEP_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("sweep", "걸기")
    .asAttack(TECHNIQUE_TIMING.HEAVY_LIGHT.total)
    .sweep(
      TECHNIQUE_TIMING.HEAVY_LIGHT.chamber +
        TECHNIQUE_TIMING.HEAVY_LIGHT.extend +
        TECHNIQUE_TIMING.HEAVY_LIGHT.peak,
    ) // Sweeping motion - 450ms
    .withKoreanLowGuard() // 하단막기 - Low guard during low sweep (protect groin)
    .recover(
      TECHNIQUE_TIMING.HEAVY_LIGHT.retract +
        TECHNIQUE_TIMING.HEAVY_LIGHT.recover,
    ) // Recover from low position - 350ms
    .withKoreanMiddleGuard() // 중단막기 - Return to guard
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// LOW KICK (하단차기) - Muay Thai Leg Kick
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Low Kick - 하단차기
 *
 * Muay Thai style leg kick targeting thigh.
 * Shin strikes outer thigh to damage mobility.
 *
 * Phases:
 * 1. Chamber (준비): Slight hip rotation - 100ms
 * 2. Sweep (차기): Shin sweeps through low target - 150ms
 * 3. Recovery (복귀): Return to stance - 350ms
 *
 * Total duration: 600ms (FAST_MEDIUM technique)
 *
 * @korean 하단차기애니메이션
 */
export const LOW_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("low_kick", "하단차기")
    .asAttack(TECHNIQUE_TIMING.FAST_MEDIUM.total)
    .lowKickChamber(TECHNIQUE_TIMING.FAST_MEDIUM.chamber) // 준비 - 100ms hip rotation
    .withKoreanMiddleGuard() // 중단막기 - Hands protect
    .lowKickSweep(TECHNIQUE_TIMING.FAST_MEDIUM.extend) // 차기 - 150ms shin sweeps
    .lowKickSweep(TECHNIQUE_TIMING.FAST_MEDIUM.peak) // 정점 - 50ms hold
    .recover(
      TECHNIQUE_TIMING.FAST_MEDIUM.retract +
        TECHNIQUE_TIMING.FAST_MEDIUM.recover,
    ) // 복귀 - 300ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// CRESCENT KICK (초승달차기) - Inside/Outside Crescent
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Crescent Kick - 초승달차기
 *
 * Arcing kick that sweeps in a crescent path.
 * Instep strikes head or arm in sweeping motion.
 *
 * Phases:
 * 1. Chamber (준비): Leg rises across body - 150ms
 * 2. Arc (호): Leg sweeps in crescent path - 200ms
 * 3. Recovery (복귀): Return to stance - 450ms
 *
 * Total duration: 800ms (HEAVY_LIGHT technique)
 *
 * @korean 초승달차기애니메이션
 */
export const CRESCENT_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("crescent_kick", "초승달차기")
    .asAttack(TECHNIQUE_TIMING.HEAVY_LIGHT.total)
    .crescentKickChamber(TECHNIQUE_TIMING.HEAVY_LIGHT.chamber) // 준비 - 150ms leg rises
    .withKoreanHighGuard()
    .crescentKickArc(TECHNIQUE_TIMING.HEAVY_LIGHT.extend) // 호 - 200ms sweeping arc
    .crescentKickArc(TECHNIQUE_TIMING.HEAVY_LIGHT.peak) // 정점 - 100ms hold
    .setDown(TECHNIQUE_TIMING.HEAVY_LIGHT.retract) // 착지 - 150ms
    .recover(TECHNIQUE_TIMING.HEAVY_LIGHT.recover) // 복귀 - 200ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// PUSH KICK (밀어차기) - Teep Kick
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Push Kick - 밀어차기 (Teep)
 *
 * Front kick used to push opponent away.
 * Ball of foot thrusts into opponent's torso.
 *
 * Phases:
 * 1. Chamber (준비): Knee lifts high - 120ms
 * 2. Thrust (밀기): Foot pushes forward - 180ms
 * 3. Recovery (복귀): Return to stance - 400ms
 *
 * Total duration: 700ms (MEDIUM_LIGHT technique)
 *
 * @korean 밀어차기애니메이션
 */
export const PUSH_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("push_kick", "밀어차기")
    .asAttack(TECHNIQUE_TIMING.MEDIUM_LIGHT.total)
    .pushKickChamber(TECHNIQUE_TIMING.MEDIUM_LIGHT.chamber) // 준비 - 120ms high chamber
    .withKoreanHighGuard()
    .pushKickThrust(TECHNIQUE_TIMING.MEDIUM_LIGHT.extend) // 밀기 - 180ms push through
    .retract(TECHNIQUE_TIMING.MEDIUM_LIGHT.retract) // 회수 - 100ms
    .recover(TECHNIQUE_TIMING.MEDIUM_LIGHT.recover) // 복귀 - 220ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// SPINNING HEEL KICK (뒤돌려차기) - Reverse Hook Kick
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Spinning Heel Kick - 뒤돌려차기
 *
 * Full spin with heel striking in reverse arc.
 * High-risk, high-reward knockout technique.
 *
 * Phases:
 * 1. Spin (회전): Body rotates 360° - 300ms
 * 2. Strike (차기): Heel hooks around - 350ms
 * 3. Recovery (복귀): Complete rotation - 430ms
 *
 * Total duration: 1200ms (SPINNING technique)
 *
 * @korean 뒤돌려차기애니메이션
 */
export const SPINNING_HEEL_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("spinning_heel_kick", "뒤돌려차기")
    .asAttack(TECHNIQUE_TIMING.SPINNING.total)
    .backKickSpin(TECHNIQUE_TIMING.SPINNING.chamber) // 회전 - 300ms begin spin
    .withKoreanHighGuard() // 상단막기 - High guard during spin
    .spinningHeelKick(TECHNIQUE_TIMING.SPINNING.extend) // 차기 - 350ms heel hooks
    .withKoreanHighGuard() // 상단막기 - Maintain guard during hook
    .spinningHeelKick(TECHNIQUE_TIMING.SPINNING.peak) // 정점 - 120ms hold
    .withKoreanHighGuard() // 상단막기 - Maintain guard at peak
    .spinRecover(
      TECHNIQUE_TIMING.SPINNING.retract + TECHNIQUE_TIMING.SPINNING.recover,
    ) // 복귀 - 430ms complete rotation
    .withKoreanMiddleGuard() // 중단막기 - Return to guard
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// JUMPING ROUNDHOUSE (뛰어돌려차기) - Flying Roundhouse
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Jumping Roundhouse - 뛰어돌려차기
 *
 * Roundhouse kick executed while airborne.
 * Added height and power from jumping momentum.
 *
 * Total duration: 1000ms (HEAVY technique)
 *
 * @korean 뛰어돌려차기애니메이션
 */
export const JUMPING_ROUNDHOUSE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("jumping_roundhouse", "뛰어돌려차기")
    .asAttack(TECHNIQUE_TIMING.HEAVY.total)
    .chamber(TECHNIQUE_TIMING.HEAVY.chamber * 0.75) // Jump prep - 150ms (0.75 × 200ms)
    .withKoreanHighGuard() // 상단막기 - High guard during jump
    .roundhouseChamber(TECHNIQUE_TIMING.HEAVY.chamber) // Chamber in air - 200ms
    .withKoreanHighGuard() // 상단막기 - Maintain guard in air
    .roundhouseExtend(TECHNIQUE_TIMING.HEAVY.extend * 0.83) // Strike through - 250ms (0.83 × 300ms)
    .withKoreanHighGuard() // 상단막기 - Maintain guard during strike
    .roundhouseExtend(TECHNIQUE_TIMING.HEAVY.retract * 0.67) // Peak - 100ms (0.67 × 150ms)
    .withKoreanHighGuard() // 상단막기 - Maintain guard at peak
    .recover(TECHNIQUE_TIMING.HEAVY.recover + 0.07) // Land - 300ms (230ms + 70ms landing adjustment)
    .withKoreanMiddleGuard() // 중단막기 - Return to guard on landing
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// QUESTION MARK KICK (물음표차기) - Feint to Roundhouse
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Question Mark Kick - 물음표차기
 *
 * Feints low kick then arcs up to head.
 * Path resembles a question mark.
 *
 * Total duration: 850ms (HEAVY_MEDIUM technique)
 *
 * @korean 물음표차기애니메이션
 */
export const QUESTION_MARK_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("question_mark_kick", "물음표차기")
    .asAttack(TECHNIQUE_TIMING.HEAVY_MEDIUM.total)
    .lowKickChamber(TECHNIQUE_TIMING.HEAVY_MEDIUM.chamber) // Feint low - 120ms
    .withKoreanHighGuard()
    .roundhouseChamber(TECHNIQUE_TIMING.HEAVY_MEDIUM.extend) // Redirect up - 220ms (includes transition)
    .roundhouseExtend(TECHNIQUE_TIMING.HEAVY_MEDIUM.peak) // Strike high - 80ms
    .recover(
      TECHNIQUE_TIMING.HEAVY_MEDIUM.retract +
        TECHNIQUE_TIMING.HEAVY_MEDIUM.recover,
    ) // Recover - 430ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// HOOK KICK (후려차기) - Heel Hook
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hook Kick - 후려차기
 *
 * Authentic Korean hook kick that extends past target then hooks back.
 * Heel strikes from unexpected angle, catching opponent off-guard.
 *
 * CORRECTED biomechanics (previous version used crescent arc incorrectly):
 * - Chamber: Side kick chamber position
 * - Extend: Leg extends PAST target position
 * - Hook: Heel HOOKS BACK toward target (not sweep across)
 * - Recovery: Return to fighting stance
 *
 * This is distinct from crescent kick which sweeps ACROSS the body.
 *
 * Total duration: 800ms (HEAVY_LIGHT technique)
 *
 * @korean 후려차기애니메이션
 */
export const HOOK_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("hook_kick", "후려차기")
    .asAttack(TECHNIQUE_TIMING.HEAVY_LIGHT.total)
    .sideKickChamber(TECHNIQUE_TIMING.HEAVY_LIGHT.chamber) // Chamber - 150ms
    .withKoreanHighGuard()
    .hookKickExtend(TECHNIQUE_TIMING.HEAVY_LIGHT.extend) // Extend PAST target - 200ms
    .hookKickHook(TECHNIQUE_TIMING.HEAVY_LIGHT.peak) // Hook BACK at target - 100ms
    .recover(
      TECHNIQUE_TIMING.HEAVY_LIGHT.retract +
        TECHNIQUE_TIMING.HEAVY_LIGHT.recover,
    ) // Recover - 350ms
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// DOUBLE KICK (이중차기) - Two Rapid Kicks
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Double Kick - 이중차기
 *
 * Two rapid kicks from same leg.
 * First low, second high to confuse defense.
 *
 * Phases (준비, 실행, 회수, 복귀):
 * 1. First kick chamber (첫 차기 준비): 120ms
 * 2. First kick extend (첫 차기 실행): 145ms (0.66 × 220ms, shortened)
 * 3. Second kick chamber (둘째 차기 준비): 80ms (using peak for quick transition)
 * 4. Second kick extend (둘째 차기 실행): 145ms (0.66 × 220ms, shortened)
 * 5. Second kick peak (둘째 차기 정점): 80ms
 * 6. Recovery (복귀): 380ms
 *
 * Total duration: 950ms (COMBO_HEAVY technique)
 * Sum: 120 + 145 + 80 + 145 + 80 + 380 = 950ms ✓
 *
 * @korean 이중차기애니메이션
 */
export const DOUBLE_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("double_kick", "이중차기")
    .asAttack(TECHNIQUE_TIMING.COMBO_HEAVY.total)
    .lowKickChamber(TECHNIQUE_TIMING.COMBO_HEAVY.chamber) // First kick chamber - 120ms
    .withKoreanMiddleGuard() // 중단막기 - Guard during low kick
    .lowKickSweep(TECHNIQUE_TIMING.COMBO_HEAVY.extend * 0.66) // First kick strikes - 145ms (shortened for speed)
    .withKoreanMiddleGuard() // 중단막기 - Maintain guard
    .roundhouseChamber(TECHNIQUE_TIMING.COMBO_HEAVY.peak) // Second kick chamber - 80ms (using peak for quick transition)
    .withKoreanHighGuard() // 상단막기 - High guard for high kick
    .roundhouseExtend(TECHNIQUE_TIMING.COMBO_HEAVY.extend * 0.66) // Second kick strikes - 145ms (shortened for speed)
    .withKoreanHighGuard() // 상단막기 - Maintain guard
    .roundhouseExtend(TECHNIQUE_TIMING.COMBO_HEAVY.peak) // Peak - 80ms
    .withKoreanHighGuard() // 상단막기 - Maintain guard at peak
    .recover(TECHNIQUE_TIMING.COMBO_HEAVY.recover) // Recover - 380ms
    .withKoreanMiddleGuard() // 중단막기 - Return to guard
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// SPINNING BACK KICK (뒤돌아차기) - 540 Kick
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Spinning Back Kick - 뒤돌아차기
 *
 * Full rotation into powerful back kick.
 * 540 degrees of spinning momentum.
 *
 * Total duration: 1200ms (SPINNING technique)
 *
 * @korean 뒤돌아차기애니메이션
 */
export const SPINNING_BACK_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("spinning_back_kick", "뒤돌아차기")
    .asAttack(TECHNIQUE_TIMING.SPINNING.total)
    .backKickSpin(TECHNIQUE_TIMING.SPINNING.chamber) // Full spin - 300ms
    .withKoreanHighGuard() // 상단막기 - High guard during spin
    .backKickThrust(TECHNIQUE_TIMING.SPINNING.extend) // Thrust heel - 350ms
    .withKoreanHighGuard() // 상단막기 - Maintain guard during thrust
    .backKickThrust(TECHNIQUE_TIMING.SPINNING.peak) // Peak - 120ms
    .withKoreanHighGuard() // 상단막기 - Maintain guard at peak
    .spinRecover(
      TECHNIQUE_TIMING.SPINNING.retract + TECHNIQUE_TIMING.SPINNING.recover,
    ) // Complete rotation - 430ms
    .withKoreanMiddleGuard() // 중단막기 - Return to guard
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// NEW KOREAN KICK VARIATIONS (추가 한국 발차기 변형)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Spinning Hook Kick - 회전후려차기
 *
 * Full spin with heel hook. Similar to spinning heel kick but with more hook action.
 *
 * Total duration: 1200ms (SPINNING technique)
 *
 * @korean 회전후려차기애니메이션
 */
export const SPINNING_HOOK_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("spinning_hook", "회전후려차기")
    .asAttack(TECHNIQUE_TIMING.SPINNING.total)
    .backKickSpin(TECHNIQUE_TIMING.SPINNING.chamber) // Spin - 300ms
    .withKoreanHighGuard() // 상단막기 - High guard during spin
    .crescentKickArc(TECHNIQUE_TIMING.SPINNING.extend) // Hook motion - 350ms
    .withKoreanHighGuard() // 상단막기 - Maintain guard
    .crescentKickArc(TECHNIQUE_TIMING.SPINNING.peak) // Peak - 120ms
    .withKoreanHighGuard() // 상단막기 - Maintain guard
    .spinRecover(
      TECHNIQUE_TIMING.SPINNING.retract + TECHNIQUE_TIMING.SPINNING.recover,
    ) // Recover - 430ms
    .withKoreanMiddleGuard() // 중단막기 - Return to guard
    .build();

/**
 * Flying Side Kick - 이단옆차기
 *
 * Running jump side kick. Signature Taekwondo breaking technique.
 *
 * Total duration: 1100ms (JUMPING technique)
 *
 * @korean 이단옆차기애니메이션
 */
export const FLYING_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("flying_kick", "이단옆차기")
    .asAttack(TECHNIQUE_TIMING.JUMPING.total + 200) // Extra air time
    .chamber(TECHNIQUE_TIMING.JUMPING.chamber) // Run up/Jump - 180ms
    .withKoreanHighGuard() // 상단막기 - High guard
    .sideKickChamber(150) // Tuck in air
    .withKoreanHighGuard() // 상단막기
    .sideKickExtend(300) // Extend in air
    .withKoreanHighGuard() // 상단막기
    .sideKickExtend(100) // Hold (breaking moment)
    .withKoreanHighGuard() // 상단막기
    .recover(370) // Land and recover
    .withKoreanMiddleGuard() // 중단막기
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT KICK ANIMATION MAP
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map of all kick animations for easy access
 * 발차기 애니메이션 맵
 */
export const KICK_ANIMATIONS: ReadonlyMap<string, SkeletalAnimation> = new Map([
  ["front_kick", FRONT_KICK_ANIMATION],
  ["roundhouse_kick", ROUNDHOUSE_KICK_ANIMATION],
  ["side_kick", SIDE_KICK_ANIMATION],
  ["axe_kick", AXE_KICK_ANIMATION],
  ["back_kick", BACK_KICK_ANIMATION],
  ["tornado_kick", TORNADO_KICK_ANIMATION],
  ["jumping_kick", JUMPING_KICK_ANIMATION],
  ["sweep", SWEEP_ANIMATION],
  ["low_kick", LOW_KICK_ANIMATION],
  ["crescent_kick", CRESCENT_KICK_ANIMATION],
  ["push_kick", PUSH_KICK_ANIMATION],
  ["spinning_heel_kick", SPINNING_HEEL_KICK_ANIMATION],
  ["jumping_roundhouse", JUMPING_ROUNDHOUSE_ANIMATION],
  ["question_mark_kick", QUESTION_MARK_KICK_ANIMATION],
  ["hook_kick", HOOK_KICK_ANIMATION],
  ["double_kick", DOUBLE_KICK_ANIMATION],
  ["spinning_back_kick", SPINNING_BACK_KICK_ANIMATION],
  ["spinning_hook", SPINNING_HOOK_KICK_ANIMATION],
  ["flying_kick", FLYING_KICK_ANIMATION],
]);
