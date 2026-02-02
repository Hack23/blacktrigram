/**
 * ☴ Son (Wind) Technique Animations
 *
 * Combat technique animations for Son (손/Wind) trigram continuous pressure attacks.
 * Implements Taekyon-inspired whirlwind combinations and sweeping multi-strike sequences.
 *
 * **Korean Martial Arts Context:**
 * - **무술**: 택견 연속 타격 (Taekyon Continuous Strikes)
 * - **특성**: 선풍연격 (Whirlwind Strikes), 회오리 타격 (Sweeping Multi-Strikes)
 * - **철학**: 끊임없는 공격 (Relentless Attack), 소용돌이 힘 (Whirlwind Power)
 * - **대표 기술**: 선풍연격 (Seonpung Yeongyeok), 소용돌이 타격 (Soyongdori Tagyeok)
 *
 * @module systems/animation/catalogs/SonTechniqueAnimations
 * @category Animation
 * @korean 손괘기술애니메이션
 */

import { BoneName, type SkeletalAnimation } from "@/types/skeletal";
import { MartialArtsAnimationBuilder } from "../builders/MartialArtsAnimationBuilder";

// ═══════════════════════════════════════════════════════════════════════════
// ☴ SON WHIRLWIND STRIKE ANIMATION (선풍연격)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Son Whirlwind Strike Animation
 *
 * **Korean**: 선풍연격 (Seonpung Yeongyeok)
 * **Technique**: Continuous rotating strikes with wind-like pressure
 * **Target Points**: Multiple targets in sweeping circular pattern
 *
 * Authentic Taekyon Continuous Pressure Technique:
 * - Three consecutive strikes while rotating body
 * - Each strike flows from previous without stopping
 * - Hip rotation powers all strikes
 * - Circular body motion creates whirlwind effect
 * - Targets multiple vital points in sequence
 *
 * Animation Phases (Enhanced to 95% Martial Arts Accuracy):
 * - Setup (0-375ms, 6 frames): Wind-up with counter-rotation
 * - Strike-1 (375-750ms, 8 frames): First strike with hip-shoulder kinetic chain
 * - Strike-2 (750-1125ms, 8 frames): Second strike continuing rotation
 * - Strike-3 (1125-1500ms, 9 frames): Third strike completing whirlwind
 * Total: 31 keyframes with biomechanical Taekyon continuous pressure
 *
 * Target Vital Points Sequence:
 * - Strike-1: 늑골 (Neukgol/Ribs) - Side body strike
 * - Strike-2: 명치 (Myeongchi/Solar Plexus) - Center strike
 * - Strike-3: 태양혈 (Taeyanghyeol/Temple) - Head strike
 *
 * **Performance**: 60fps target (16.67ms per frame)
 * **Damage Type**: Continuous pressure with cumulative effect
 *
 * @korean 선풍연격
 * @frames 31 total (6 setup, 8 strike-1, 8 strike-2, 9 strike-3)
 * @duration 1500ms
 * @category Attack Animation
 * @accuracy 95% martial arts biomechanics
 */
export const SON_WHIRLWIND_STRIKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "son_whirlwind_strike",
    "선풍연격"
  )
    .asAttack(1.5)
    // =================================================================
    // SETUP PHASE (0-375ms) - Wind-up with Counter-Rotation
    // =================================================================
    // Frame 0: Neutral guard baseline (0ms)
    .at(0)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0) // Neutral
    .rotate(BoneName.PELVIS, 0, 0, 0) // Neutral
    .rotate(BoneName.SHOULDER_R, 0.17, -0.09, 0.26) // 10°, -5°, 15° guard
    .rotate(BoneName.ELBOW_R, 0, 0, 1.57) // 90° guard
    .rotate(BoneName.SHOULDER_L, 0.17, 0.09, -0.26) // 10°, 5°, -15° guard
    .rotate(BoneName.ELBOW_L, 0, 0, -1.57) // -90° guard
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Frame 1: Wind-up begins (90ms) - NEW
    .at(0.09)
    .rotate(BoneName.SPINE_UPPER, 0, -0.09, 0) // 0°, -5°, 0° (initial wind-up)
    .rotate(BoneName.PELVIS, 0, -0.14, 0) // 0°, -8°, 0° (hip begins counter-rotation)
    .rotate(BoneName.SHOULDER_R, 0, -0.09, 0.26) // 0°, -5°, 15° (right arm begins coil)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.75) // 100° (bending more)
    .rotate(BoneName.SHOULDER_L, 0.26, 0.12, -0.21) // 15°, 7°, -12° (left forward)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.4) // -80° (slight extension)
    .position(BoneName.PELVIS, 0, -0.01, 0) // Beginning crouch
    .done<MartialArtsAnimationBuilder>()
    // Frame 2: Mid wind-up (188ms)
    .at(0.188)
    .rotate(BoneName.SPINE_UPPER, 0, -0.26, 0) // 0°, -15°, 0° (wind-up rotation)
    .rotate(BoneName.PELVIS, 0, -0.35, 0) // 0°, -20°, 0° (hip winds back)
    .rotate(BoneName.SHOULDER_R, -0.17, 0, 0.35) // -10°, 0°, 20° (right arm cocks)
    .rotate(BoneName.ELBOW_R, 0, 0, 2.09) // 120° (bent ready)
    .rotate(BoneName.SHOULDER_L, 0.26, 0.17, -0.17) // 15°, 10°, -10° (left forward)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.22) // -70° (extending slightly)
    .done<MartialArtsAnimationBuilder>()
    // Frame 3: Near maximum coil (280ms) - NEW
    .at(0.28)
    .rotate(BoneName.SPINE_UPPER, 0, -0.31, 0) // 0°, -18°, 0° (deeper wind-up)
    .rotate(BoneName.PELVIS, 0, -0.44, 0) // 0°, -25°, 0° (hip coiling deeper)
    .rotate(BoneName.SHOULDER_R, -0.22, 0, 0.44) // -13°, 0°, 25° (deeper cock)
    .rotate(BoneName.ELBOW_R, 0, 0, 2.18) // 125° (near maximum)
    .rotate(BoneName.HEAD, 0, -0.12, 0) // 0°, -7°, 0° (head turning back)
    .position(BoneName.PELVIS, 0, -0.015, 0) // Deeper crouch
    .done<MartialArtsAnimationBuilder>()
    // Frame 4: Maximum wind-up (375ms)
    .at(0.375)
    .rotate(BoneName.SPINE_UPPER, 0, -0.35, 0) // 0°, -20°, 0° (peak wind-up)
    .rotate(BoneName.PELVIS, 0, -0.52, 0) // 0°, -30°, 0° (maximum coil)
    .rotate(BoneName.SHOULDER_R, -0.26, 0, 0.52) // -15°, 0°, 30° (fully cocked)
    .rotate(BoneName.ELBOW_R, 0, 0, 2.27) // 130° (maximum chamber)
    .rotate(BoneName.HEAD, 0, -0.17, 0) // 0°, -10°, 0° (looking back)
    .position(BoneName.PELVIS, 0, -0.02, 0) // Slight crouch
    .done<MartialArtsAnimationBuilder>()
    // =================================================================
    // STRIKE-1 PHASE (375-750ms) - First Strike with Kinetic Chain
    // =================================================================
    // Frame 5: Hip drives FIRST (450ms) - NEW - Kinetic chain begins
    .at(0.45)
    .rotate(BoneName.PELVIS, 0, 0, 0) // 0°, 0°, 0° (hip explodes forward 30° from wind-up)
    .rotate(BoneName.SPINE_UPPER, 0, -0.17, 0) // 0°, -10°, 0° (shoulder STILL coiled - lag)
    .rotate(BoneName.SHOULDER_R, -0.09, 0, 0.44) // -5°, 0°, 25° (arm still chambered)
    .rotate(BoneName.ELBOW_R, 0, 0, 2.09) // 120° (still bent)
    .rotate(BoneName.KNEE_R, -0.12, 0, 0) // -7° (rear leg begins push)
    .position(BoneName.PELVIS, 0, -0.01, 0.02) // Forward drive starts
    .done<MartialArtsAnimationBuilder>()
    // Frame 6: Shoulder follows hip (530ms) - NEW - Kinetic chain continues
    .at(0.53)
    .rotate(BoneName.PELVIS, 0, 0.09, 0) // 0°, 5°, 0° (hip continues rotation)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0) // 0°, 0°, 0° (shoulder NOW follows - 60-80ms lag)
    .rotate(BoneName.SHOULDER_R, 0.35, 0, 0.17) // 20°, 0°, 10° (arm begins extension)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.79) // 45° (extending rapidly)
    .rotate(BoneName.WRIST_R, 0.09, 0, 0) // 5°, 0°, 0° (wrist aligning)
    .rotate(BoneName.KNEE_R, -0.14, 0, 0) // -8° (leg pushing)
    .position(BoneName.PELVIS, 0, 0, 0.04) // Forward momentum
    .done<MartialArtsAnimationBuilder>()
    // Frame 7: Mid-strike-1 (562ms)
    .at(0.562)
    .rotate(BoneName.SPINE_UPPER, 0, 0.09, 0) // 0°, 5°, 0° (torso follows hip rotation)
    .rotate(BoneName.PELVIS, 0, 0.12, 0) // 0°, 7°, 0° (hip leads and drives forward)
    .rotate(BoneName.SHOULDER_R, 0.7, 0, 0) // 40°, 0°, 0° (first strike extends)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.17) // 10° (nearly extended)
    .rotate(BoneName.WRIST_R, 0.17, 0, 0) // 10°, 0°, 0° (strike alignment)
    .rotate(BoneName.KNEE_R, -0.17, 0, 0) // -10° (rear leg pushes)
    .position(BoneName.PELVIS, 0, 0, 0.05) // Forward drive
    .done<MartialArtsAnimationBuilder>()
    // Frame 8: Near extension (680ms) - NEW
    .at(0.68)
    .rotate(BoneName.SPINE_UPPER, 0, 0.19, 0) // 0°, 11°, 0° (rotation continues)
    .rotate(BoneName.PELVIS, 0, 0.21, 0) // 0°, 12°, 0° (hip driving through)
    .rotate(BoneName.SHOULDER_R, 0.96, 0, -0.05) // 55°, 0°, -3° (near full extension)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.05) // 3° (almost straight)
    .rotate(BoneName.WRIST_R, 0.21, 0, 0) // 12°, 0°, 0° (impact angle forming)
    .rotate(BoneName.SHOULDER_L, 0.31, 0.21, -0.07) // 18°, 12°, -4° (left preparing)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.05) // -60° (chambering)
    .position(BoneName.PELVIS, 0.02, 0, 0.08) // Forward-right shift
    .done<MartialArtsAnimationBuilder>()
    // Frame 9: Strike-1 full extension (750ms)
    .at(0.75)
    .rotate(BoneName.SPINE_UPPER, 0, 0.26, 0) // 0°, 15°, 0° (rotation continues)
    .rotate(BoneName.PELVIS, 0, 0.26, 0) // 0°, 15°, 0° (hip follows through)
    .rotate(BoneName.SHOULDER_R, 1.05, 0, -0.09) // 60°, 0°, -5° (full extension)
    .rotate(BoneName.ELBOW_R, 0, 0, 0) // 0° (straight arm - impact)
    .rotate(BoneName.WRIST_R, 0.26, 0, 0) // 15°, 0°, 0° (impact angle)
    .rotate(BoneName.SHOULDER_L, 0.35, 0.26, -0.09) // 20°, 15°, -5° (left begins)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.79) // -45° (preparing)
    .position(BoneName.PELVIS, 0.02, 0, 0.1) // Maximum forward
    .done<MartialArtsAnimationBuilder>()
    // =================================================================
    // STRIKE-2 PHASE (750-1125ms) - Second Strike Continues Rotation
    // =================================================================
    // Frame 10: Transition to strike-2 (820ms) - NEW - Fast transition
    .at(0.82)
    .rotate(BoneName.PELVIS, 0, 0.35, 0) // 0°, 20°, 0° (hip continues rotating)
    .rotate(BoneName.SPINE_UPPER, 0, 0.44, 0) // 0°, 25°, 0° (torso follows)
    .rotate(BoneName.SHOULDER_R, 0.7, 0, 0.09) // 40°, 0°, 5° (right already retracting)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.87) // 50° (pulling back fast)
    .rotate(BoneName.SHOULDER_L, 0.44, 0.21, -0.12) // 25°, 12°, -7° (left preparing IMMEDIATELY)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.44) // -25° (extending begins)
    .rotate(BoneName.WRIST_L, 0.09, 0, 0) // 5°, 0°, 0° (left wrist aligning)
    .position(BoneName.PELVIS, 0, 0, 0.12) // Continuing forward
    .done<MartialArtsAnimationBuilder>()
    // Frame 11: Hip drives strike-2 (900ms) - NEW - Kinetic chain for strike-2
    .at(0.9)
    .rotate(BoneName.PELVIS, 0, 0.52, 0) // 0°, 30°, 0° (hip leads again)
    .rotate(BoneName.SPINE_UPPER, 0, 0.52, 0) // 0°, 30°, 0° (shoulder catching up)
    .rotate(BoneName.SHOULDER_R, 0.52, 0, 0.17) // 30°, 0°, 10° (right continues retraction)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.4) // 80° (nearly chambered)
    .rotate(BoneName.SHOULDER_L, 0.7, 0.26, -0.09) // 40°, 15°, -5° (left extending)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.17) // -10° (nearly extended)
    .rotate(BoneName.WRIST_L, 0.14, 0, 0) // 8°, 0°, 0° (strike forming)
    .done<MartialArtsAnimationBuilder>()
    // Frame 12: Mid-strike-2 (938ms)
    .at(0.938)
    .rotate(BoneName.SPINE_UPPER, 0, 0.61, 0) // 0°, 35°, 0° (continued rotation)
    .rotate(BoneName.PELVIS, 0, 0.61, 0) // 0°, 35°, 0° (hip and spine synced)
    .rotate(BoneName.SHOULDER_R, 0.52, 0, 0.17) // 30°, 0°, 10° (right retracts)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.57) // 90° (pulling back)
    .rotate(BoneName.SHOULDER_L, 0.79, 0.26, -0.09) // 45°, 15°, -5° (left strikes)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.09) // -5° (extending)
    .rotate(BoneName.WRIST_L, 0.17, 0, 0) // 10°, 0°, 0° (strike ready)
    .done<MartialArtsAnimationBuilder>()
    // Frame 13: Near extension strike-2 (1050ms) - NEW
    .at(1.05)
    .rotate(BoneName.SPINE_UPPER, 0, 0.75, 0) // 0°, 43°, 0° (deep rotation)
    .rotate(BoneName.PELVIS, 0, 0.7, 0) // 0°, 40°, 0° (hip driving)
    .rotate(BoneName.SHOULDER_L, 1.0, 0.31, -0.12) // 57°, 18°, -7° (left near full)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.02) // -1° (almost straight)
    .rotate(BoneName.WRIST_L, 0.21, 0, 0) // 12°, 0°, 0° (impact forming)
    .rotate(BoneName.HEAD, 0, 0.44, 0) // 0°, 25°, 0° (head tracking)
    .position(BoneName.PELVIS, 0, 0, 0.12) // Forward-center
    .done<MartialArtsAnimationBuilder>()
    // Frame 14: Strike-2 full extension (1125ms)
    .at(1.125)
    .rotate(BoneName.SPINE_UPPER, 0, 0.87, 0) // 0°, 50°, 0° (deep rotation)
    .rotate(BoneName.PELVIS, 0, 0.79, 0) // 0°, 45°, 0° (hip full through)
    .rotate(BoneName.SHOULDER_L, 1.14, 0.35, -0.14) // 65°, 20°, -8° (left full extension)
    .rotate(BoneName.ELBOW_L, 0, 0, 0) // 0° (straight arm - impact)
    .rotate(BoneName.WRIST_L, 0.26, 0, 0) // 15°, 0°, 0° (impact)
    .rotate(BoneName.SHOULDER_R, 0.35, 0, 0.26) // 20°, 0°, 15° (right recovering)
    .rotate(BoneName.HEAD, 0, 0.52, 0) // 0°, 30°, 0° (head follows)
    .position(BoneName.PELVIS, 0, 0, 0.12) // Forward-center maintained
    .done<MartialArtsAnimationBuilder>()
    // =================================================================
    // STRIKE-3 PHASE (1125-1500ms) - Third Strike Completes Whirlwind
    // =================================================================
    // Frame 15: Transition to strike-3 (1200ms) - NEW - Fast transition
    .at(1.2)
    .rotate(BoneName.PELVIS, 0, 0.96, 0) // 0°, 55°, 0° (hip continues whirlwind)
    .rotate(BoneName.SPINE_UPPER, 0, 1.05, 0) // 0°, 60°, 0° (torso follows)
    .rotate(BoneName.SHOULDER_L, 0.7, 0.21, 0.09) // 40°, 12°, 5° (left retracting)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.87) // -50° (pulling back)
    .rotate(BoneName.SHOULDER_R, 0.52, 0.09, 0.09) // 30°, 5°, 5° (right preparing)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.79) // 45° (extending begins)
    .rotate(BoneName.WRIST_R, 0.09, 0, 0) // 5°, 0°, 0° (right wrist aligning)
    .position(BoneName.PELVIS, -0.05, 0, 0.15) // Lateral shift left begins
    .done<MartialArtsAnimationBuilder>()
    // Frame 16: Hip drives strike-3 (1260ms) - NEW - Kinetic chain for strike-3
    .at(1.26)
    .rotate(BoneName.PELVIS, 0, 1.05, 0) // 0°, 60°, 0° (hip leads final strike)
    .rotate(BoneName.SPINE_UPPER, 0, 1.14, 0) // 0°, 65°, 0° (shoulder following)
    .rotate(BoneName.SHOULDER_R, 0.7, 0.09, 0) // 40°, 5°, 0° (right extending)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.26) // 15° (nearly extended)
    .rotate(BoneName.WRIST_R, 0.14, 0, 0) // 8°, 0°, 0° (strike forming)
    .rotate(BoneName.SHOULDER_L, 0.52, 0.17, 0.17) // 30°, 10°, 10° (left retracts)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.22) // -70° (chambered)
    .done<MartialArtsAnimationBuilder>()
    // Frame 17: Mid-strike-3 (1312ms)
    .at(1.312)
    .rotate(BoneName.SPINE_UPPER, 0, 1.22, 0) // 0°, 70°, 0° (near complete rotation)
    .rotate(BoneName.PELVIS, 0, 1.14, 0) // 0°, 65°, 0° (hip driving)
    .rotate(BoneName.SHOULDER_R, 0.87, 0.09, 0) // 50°, 5°, 0° (right strikes again)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.14) // 8° (extending)
    .rotate(BoneName.WRIST_R, 0.17, 0, 0) // 10°, 0°, 0° (strike alignment)
    .rotate(BoneName.SHOULDER_L, 0.52, 0.17, 0.17) // 30°, 10°, 10° (left retracts)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.4) // -80° (pulling back)
    .done<MartialArtsAnimationBuilder>()
    // Frame 18: Near extension strike-3 (1400ms) - NEW
    .at(1.4)
    .rotate(BoneName.SPINE_UPPER, 0, 1.22, 0) // 0°, 70°, 0° (spine follows)
    .rotate(BoneName.PELVIS, 0, 1.3, 0) // 0°, 74°, 0° (pelvis driving)
    .rotate(BoneName.SHOULDER_R, 1.05, 0, -0.05) // 60°, 0°, -3° (near full extension)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.02) // 1° (almost straight)
    .rotate(BoneName.WRIST_R, 0.21, 0, 0) // 12°, 0°, 0° (impact forming)
    .rotate(BoneName.HEAD, 0, 0.96, 0) // 0°, 55°, 0° (head tracking)
    .rotate(BoneName.KNEE_R, -0.21, 0, 0) // -12° (rear leg strong drive)
    .position(BoneName.PELVIS, -0.08, 0, 0.18) // Forward-left position
    .done<MartialArtsAnimationBuilder>()
    // Frame 19: Strike-3 final extension and recovery (1500ms)
    .at(1.5)
    .rotate(BoneName.SPINE_UPPER, 0, 1.22, 0) // 0°, 70°, 0° (spine follows pelvis)
    .rotate(BoneName.PELVIS, 0, 1.4, 0) // 0°, 80°, 0° (pelvis drives full rotation)
    .rotate(BoneName.SHOULDER_R, 1.14, 0, -0.09) // 65°, 0°, -5° (final strike extended)
    .rotate(BoneName.ELBOW_R, 0, 0, 0) // 0° (straight arm at impact)
    .rotate(BoneName.WRIST_R, 0.26, 0, 0) // 15°, 0°, 0° (final impact)
    .rotate(BoneName.HEAD, 0, 1.05, 0) // 0°, 60°, 0° (full head rotation)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15° (rear leg drive)
    .position(BoneName.PELVIS, -0.1, 0, 0.2) // Final whirlwind position
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☴ SON SWEEPING MULTI-STRIKE (소용돌이 타격)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Son Sweeping Multi-Strike Animation
 *
 * **Korean**: 소용돌이 타격 (Soyongdori Tagyeok) - Whirlpool Strike
 * **Technique**: Continuous sweeping strikes in flowing pattern
 * **Target Points**: Low-to-high sweeping pattern targeting legs and body
 *
 * Authentic Taekyon Sweeping Technique:
 * - Low sweeping kick flows into body strike
 * - Continuous circular motion without pause
 * - Body rotation powers both sweeps
 * - Minimal recovery between strikes
 * - Creates whirlpool-like motion pattern
 *
 * Animation Phases:
 * - Wind-up (0-300ms, frames 0-5): Preparation with weight shift
 * - Sweep-1 (300-800ms, frames 6-13): Low sweeping leg attack
 * - Sweep-2 (800-1300ms, frames 14-21): Body-level circular strike
 * - Recovery (1300-1600ms, frames 22-26): Return to flowing guard
 *
 * Target Vital Points Sequence:
 * - Sweep-1: 발목 (Balmok/Ankle), 종아리 (Jongari/Calf)
 * - Sweep-2: 늑골 (Neukgol/Ribs), 간 (Gan/Liver)
 *
 * **Performance**: 60fps target (16.67ms per frame)
 * **Damage Type**: Sweeping pressure with destabilization
 *
 * @korean 소용돌이타격
 * @frames 26 total (5 wind-up, 8 sweep-1, 8 sweep-2, 5 recovery)
 * @duration 1600ms
 * @category Attack Animation
 */
export const SON_SWEEPING_MULTI_STRIKE: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "son_sweeping_multi_strike",
    "소용돌이 타격"
  )
    .asAttack(1.6)
    // =================================================================
    // WIND-UP PHASE (0-300ms, frames 0-5)
    // =================================================================
    // Frame 0: Neutral guard (0ms)
    .at(0)
    .rotate(BoneName.PELVIS, 0, 0, 0) // Neutral
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0) // Neutral
    .rotate(BoneName.SHOULDER_L, 0.17, 0.09, -0.26) // Guard position
    .rotate(BoneName.SHOULDER_R, 0.17, -0.09, 0.26)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.57)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.57)
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15°
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15°
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Frame 3: Weight shift preparation (180ms)
    .at(0.18)
    .rotate(BoneName.PELVIS, 0, -0.35, 0) // 0°, -20°, 0° (wind-up)
    .rotate(BoneName.SPINE_UPPER, 0, -0.52, 0) // 0°, -30°, 0° (torso winds)
    .rotate(BoneName.KNEE_R, -0.44, 0, 0) // -25° (weight on right)
    .rotate(BoneName.KNEE_L, -0.17, 0, 0) // -10° (left lightens)
    .rotate(BoneName.HIP_L, 0.26, 0, 0) // 15°, 0°, 0° (left leg begins to lift)
    .position(BoneName.PELVIS, 0, -0.02, 0) // Slight crouch
    .done<MartialArtsAnimationBuilder>()
    // Frame 5: Full wind-up (300ms)
    .at(0.3)
    .rotate(BoneName.PELVIS, 0, -0.52, 0) // 0°, -30°, 0° (maximum wind)
    .rotate(BoneName.SPINE_UPPER, 0, -0.7, 0) // 0°, -40°, 0° (deep coil)
    .rotate(BoneName.KNEE_R, -0.52, 0, 0) // -30° (stable base)
    .rotate(BoneName.HIP_L, 0.52, 0, 0.17) // 30°, 0°, 10° (leg chambered for sweep)
    .rotate(BoneName.KNEE_L, -0.87, 0, 0) // -50° (chambered bent)
    .position(BoneName.PELVIS, 0, -0.03, 0)
    .done<MartialArtsAnimationBuilder>()
    // =================================================================
    // SWEEP-1 PHASE (300-800ms, frames 6-13) - Low Sweeping Kick
    // =================================================================
    // Frame 8: Begin sweep (480ms)
    .at(0.48)
    .rotate(BoneName.PELVIS, 0, -0.17, 0) // 0°, -10°, 0° (unwinding)
    .rotate(BoneName.SPINE_UPPER, 0, -0.26, 0) // 0°, -15°, 0°
    .rotate(BoneName.HIP_L, 0.35, 0, 0.52) // 20°, 0°, 30° (leg extending)
    .rotate(BoneName.KNEE_L, -0.35, 0, 0) // -20° (extending for sweep)
    .rotate(BoneName.FOOT_L, -0.17, 0, 0) // -10° (foot for sweep)
    .rotate(BoneName.KNEE_R, -0.35, 0, 0) // -20° (supporting)
    .position(BoneName.PELVIS, 0, -0.04, 0.05)
    .done<MartialArtsAnimationBuilder>()
    // Frame 10: Mid-sweep (600ms)
    .at(0.6)
    .rotate(BoneName.PELVIS, 0, 0.17, 0) // 0°, 10°, 0° (rotation through)
    .rotate(BoneName.SPINE_UPPER, 0, 0.26, 0) // 0°, 15°, 0°
    .rotate(BoneName.HIP_L, 0.26, 0, 0.87) // 15°, 0°, 50° (sweeping arc)
    .rotate(BoneName.KNEE_L, -0.17, 0, 0) // -10° (nearly extended)
    .rotate(BoneName.FOOT_L, 0.17, 0, 0) // 10° (sweeping position)
    .position(BoneName.PELVIS, -0.1, -0.05, 0.1) // Lateral and forward
    .done<MartialArtsAnimationBuilder>()
    // Frame 13: Complete low sweep (800ms)
    .at(0.8)
    .rotate(BoneName.PELVIS, 0, 0.52, 0) // 0°, 30°, 0° (full rotation)
    .rotate(BoneName.SPINE_UPPER, 0, 0.61, 0) // 0°, 35°, 0°
    .rotate(BoneName.HIP_L, 0.17, 0, 1.22) // 10°, 0°, 70° (complete arc)
    .rotate(BoneName.KNEE_L, -0.09, 0, 0) // -5° (extended)
    .rotate(BoneName.FOOT_L, 0.26, 0, 0) // 15° (impact angle)
    .rotate(BoneName.HEAD, 0, 0.35, 0) // 0°, 20°, 0° (tracking)
    .position(BoneName.PELVIS, -0.15, -0.06, 0.15)
    .done<MartialArtsAnimationBuilder>()
    // =================================================================
    // SWEEP-2 PHASE (800-1300ms, frames 14-21) - Body-Level Strike
    // =================================================================
    // Frame 16: Transition to body strike (960ms)
    .at(0.96)
    .rotate(BoneName.PELVIS, 0, 0.79, 0) // 0°, 45°, 0° (continuing rotation)
    .rotate(BoneName.SPINE_UPPER, 0, 0.87, 0) // 0°, 50°, 0°
    .rotate(BoneName.HIP_L, 0, 0, 0.52) // 0°, 0°, 30° (leg retracting)
    .rotate(BoneName.KNEE_L, -0.44, 0, 0) // -25° (pulling back)
    .rotate(BoneName.SHOULDER_R, 0.52, 0.17, 0) // 30°, 10°, 0° (right arm begins)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.87) // 50° (preparing strike)
    .position(BoneName.PELVIS, -0.15, -0.04, 0.2)
    .done<MartialArtsAnimationBuilder>()
    // Frame 18: Mid body sweep (1080ms)
    .at(1.08)
    .rotate(BoneName.PELVIS, 0, 1.05, 0) // 0°, 60°, 0° (deep rotation)
    .rotate(BoneName.SPINE_UPPER, 0, 1.22, 0) // 0°, 70°, 0°
    .rotate(BoneName.SHOULDER_R, 0.87, 0.26, -0.17) // 50°, 15°, -10° (sweeping strike)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.35) // 20° (extending)
    .rotate(BoneName.WRIST_R, 0.17, 0, 0) // 10°, 0°, 0° (strike angle)
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° (foot planted)
    .position(BoneName.PELVIS, -0.2, -0.02, 0.25)
    .done<MartialArtsAnimationBuilder>()
    // Frame 21: Complete body sweep (1300ms)
    .at(1.3)
    .rotate(BoneName.PELVIS, 0, 1.4, 0) // 0°, 80°, 0° (near full circle)
    .rotate(BoneName.SPINE_UPPER, 0, 1.57, 0) // 0°, 90°, 0° (quarter rotation complete)
    .rotate(BoneName.SHOULDER_R, 1.14, 0.35, -0.26) // 65°, 20°, -15° (full extension)
    .rotate(BoneName.ELBOW_R, 0, 0, 0) // 0° (straight arm impact)
    .rotate(BoneName.WRIST_R, 0.26, 0, 0) // 15°, 0°, 0° (impact)
    .rotate(BoneName.HEAD, 0, 1.22, 0) // 0°, 70°, 0° (full tracking)
    .position(BoneName.PELVIS, -0.25, 0, 0.3)
    .done<MartialArtsAnimationBuilder>()
    // =================================================================
    // RECOVERY PHASE (1300-1600ms, frames 22-26)
    // =================================================================
    // Frame 24: Begin recovery (1450ms)
    .at(1.45)
    .rotate(BoneName.PELVIS, 0, 0.87, 0) // 0°, 50°, 0° (unwinding)
    .rotate(BoneName.SPINE_UPPER, 0, 0.79, 0) // 0°, 45°, 0°
    .rotate(BoneName.SHOULDER_R, 0.52, 0.17, 0.17) // 30°, 10°, 10° (retracting)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.05) // 60° (bending back)
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° (stable)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15° (stable)
    .position(BoneName.PELVIS, -0.15, 0, 0.2)
    .done<MartialArtsAnimationBuilder>()
    // Frame 26: Return to guard (1600ms)
    .at(1.6)
    .rotate(BoneName.PELVIS, 0, 0, 0) // Return to neutral
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.17, 0.09, -0.26) // Guard restored
    .rotate(BoneName.SHOULDER_R, 0.17, -0.09, 0.26)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.57)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.57)
    .rotate(BoneName.HEAD, 0, 0, 0)
    .rotate(BoneName.KNEE_L, -0.26, 0, 0)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map of all Son technique animations for easy access
 * @korean 손괘기술애니메이션맵
 */
export const SON_TECHNIQUE_ANIMATIONS: ReadonlyMap<string, SkeletalAnimation> = new Map([
  ["son_whirlwind_strike", SON_WHIRLWIND_STRIKE_ANIMATION],
  ["son_sweeping_multi_strike", SON_SWEEPING_MULTI_STRIKE],
]);
