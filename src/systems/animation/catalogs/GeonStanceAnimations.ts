/**
 * ☰ Geon (Heaven) Stance-Specific Animations
 *
 * Specialized idle, movement, and combat animations for the Geon (건/Heaven) trigram.
 * Embodies direct force and bone-breaking power from Taekwondo techniques.
 *
 * **Korean Martial Arts Context:**
 * - **무술**: 태권도 파워 기술 (Taekwondo Power Techniques)
 * - **특성**: 정면 공격 (Direct Frontal Strikes), 골절력 (Bone-Breaking Force)
 * - **철학**: 압도적인 힘 (Overwhelming Power), 하늘의 권위 (Heavenly Authority)
 * - **대표 기술**: 천둥벽력 (Heavenly Fist/Thunderclap Strike)
 *
 * @module systems/animation/catalogs/GeonStanceAnimations
 * @category Animation
 * @korean 건괘자세애니메이션
 */

import { BoneName } from "@/types/skeletal";
import type { SkeletalAnimation } from "@/types/skeletal";
import { MartialArtsAnimationBuilder } from "../builders/MartialArtsAnimationBuilder";

// ═══════════════════════════════════════════════════════════════════════════
// ☰ GEON IDLE BREATHING ANIMATION (건괘 호흡 자세)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Geon Idle Breathing Animation
 *
 * **Korean**: 건괘 호흡 자세 (Geon-gwae Hoheup Jase)
 * **Philosophy**: Embodying heavenly authority through powerful breathing
 *
 * Characteristics:
 * - Chest expansion emphasizing power readiness
 * - Shoulder squaring for frontal dominance
 * - Fists clenched at ready position
 * - Head held high (authoritative posture)
 *
 * Animation Cycle:
 * - 0ms: Neutral breathing position
 * - 1250ms: Chest expansion (inhale)
 * - 2500ms: Return to neutral (exhale)
 *
 * @korean 건괘호흡자세
 * @duration 2500ms (2.5 second cycle)
 * @category Idle Animation
 */
export const GEON_IDLE_BREATHING: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "geon_idle_breathing",
    "건괘 호흡 자세"
  )
    .asIdle(2.5, true)
    // Keyframe 0ms: Neutral breathing position
    .at(0)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
    .rotate(BoneName.SHOULDER_L, -0.17, 0, -0.09) // -10°, 0°, -5° (relaxed high guard)
    .rotate(BoneName.SHOULDER_R, -0.17, 0, 0.09) // -10°, 0°, 5°
    .rotate(BoneName.ELBOW_L, 0, 0, -1.57) // -90° (bent)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.57) // 90° (bent)
    .rotate(BoneName.HEAD, 0.09, 0, 0) // 5° (head held high)
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 1250ms: Chest expansion (inhale)
    .at(1.25)
    .rotate(BoneName.SPINE_UPPER, -0.09, 0, 0) // -5° (chest expands backward)
    .rotate(BoneName.SHOULDER_L, -0.21, 0, -0.14) // -12°, 0°, -8° (shoulders back)
    .rotate(BoneName.SHOULDER_R, -0.21, 0, 0.14) // -12°, 0°, 8°
    .rotate(BoneName.HEAD, 0.14, 0, 0) // 8° (emphasize power)
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 2500ms: Return to neutral (exhale)
    .at(2.5)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
    .rotate(BoneName.SHOULDER_L, -0.17, 0, -0.09)
    .rotate(BoneName.SHOULDER_R, -0.17, 0, 0.09)
    .rotate(BoneName.HEAD, 0.09, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☰ GEON FORWARD ADVANCE (천둥 전진)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Geon Forward Advance Animation
 *
 * **Korean**: 천둥 전진 (Cheondung Jeonjin) - Thunder Advance
 * **Technique**: Heavy forward step with power weight transfer
 *
 * Characteristics:
 * - Lead shoulder driving forward
 * - Rear leg pushing with explosive force
 * - Maintains high center of gravity
 * - Powerful, authoritative stride
 *
 * Animation Phases:
 * - 0-200ms: Initial push-off
 * - 200-500ms: Weight transfer forward
 * - 500-667ms: Landing with power
 *
 * @korean 천둥전진
 * @frames 12 frames (~55.5ms per frame at 60fps)
 * @duration 667ms
 * @category Movement Animation
 */
export const GEON_FORWARD_ADVANCE: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "geon_forward_advance",
    "천둥 전진"
  )
    .asMovement(0.667, false)
    // Frame 0-4: Push-off phase (0-200ms)
    .at(0)
    .rotate(BoneName.PELVIS, 0.1, 0, 0) // Forward tilt
    .rotate(BoneName.SPINE_UPPER, 0.15, 0, 0) // Lean forward
    .rotate(BoneName.KNEE_R, -0.35, 0, 0) // -20° rear leg push
    .rotate(BoneName.KNEE_L, -0.52, 0, 0) // -30° front leg ready
    .rotate(BoneName.SHOULDER_R, -0.26, 0, 0.17) // -15°, 0°, 10° (driving forward)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Frame 5-9: Weight transfer (200-500ms)
    .at(0.35)
    .rotate(BoneName.PELVIS, 0.17, 0, 0) // More forward
    .rotate(BoneName.SPINE_UPPER, 0.2, 0, 0)
    .rotate(BoneName.KNEE_R, -0.17, 0, 0) // -10° extending
    .rotate(BoneName.KNEE_L, -0.7, 0, 0) // -40° absorbing weight
    .rotate(BoneName.SHOULDER_R, -0.35, 0, 0.26) // -20°, 0°, 15°
    .position(BoneName.PELVIS, 0, 0.02, 0.3) // Forward and slight up
    .done<MartialArtsAnimationBuilder>()
    // Frame 10-12: Landing phase (500-667ms)
    .at(0.667)
    .rotate(BoneName.PELVIS, 0.09, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0.1, 0, 0)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15° planted
    .rotate(BoneName.KNEE_L, -0.52, 0, 0) // -30° forward stance
    .rotate(BoneName.SHOULDER_R, -0.17, 0, 0.09)
    .position(BoneName.PELVIS, 0, 0, 0.5) // Full step forward
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☰ GEON DIAGONAL POWER STEP (대각선 강타보)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Geon Diagonal Power Step Animation
 *
 * **Korean**: 대각선 강타보 (Daegakseon Gangtabo) - Diagonal Power Step
 * **Technique**: 45° angle power movement with hip rotation
 *
 * Characteristics:
 * - 45° diagonal movement for tactical positioning
 * - Hip rotation for torque generation
 * - Maintain high center of gravity
 * - Explosive lateral power transfer
 *
 * Animation Phases:
 * - 0-233ms: Initial 45° pivot
 * - 233-583ms: Diagonal weight transfer
 * - 583-778ms: Landing in power position
 *
 * @korean 대각선강타보
 * @frames 14 frames (~55.5ms per frame at 60fps)
 * @duration 778ms
 * @category Movement Animation
 */
export const GEON_DIAGONAL_POWER_STEP: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "geon_diagonal_power_step",
    "대각선 강타보"
  )
    .asMovement(0.778, false)
    // Frames 0-4: Pivot phase (0-233ms)
    .at(0)
    .rotate(BoneName.PELVIS, 0.09, -0.79, 0) // 5°, -45° rotation
    .rotate(BoneName.SPINE_UPPER, 0.14, -0.87, 0) // 8°, -50° torso twist
    .rotate(BoneName.KNEE_R, -0.52, 0, 0) // -30° coiled
    .rotate(BoneName.KNEE_L, -0.35, 0, 0) // -20° ready
    .rotate(BoneName.HIP_L, 0, 0.35, 0) // 0°, 20° hip out
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Frames 5-10: Diagonal transfer (233-583ms)
    .at(0.408)
    .rotate(BoneName.PELVIS, 0.14, -0.52, 0) // 8°, -30°
    .rotate(BoneName.SPINE_UPPER, 0.17, -0.61, 0) // 10°, -35°
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15° extending
    .rotate(BoneName.KNEE_L, -0.7, 0, 0) // -40° loading
    .rotate(BoneName.HIP_L, 0, 0.52, 0) // 0°, 30° maximum reach
    .position(BoneName.PELVIS, -0.3, 0.03, 0.3) // Diagonal movement
    .done<MartialArtsAnimationBuilder>()
    // Frames 11-14: Landing phase (583-778ms)
    .at(0.778)
    .rotate(BoneName.PELVIS, 0.09, -0.79, 0) // 5°, -45° settled
    .rotate(BoneName.SPINE_UPPER, 0.12, -0.87, 0) // 7°, -50°
    .rotate(BoneName.KNEE_R, -0.35, 0, 0) // -20°
    .rotate(BoneName.KNEE_L, -0.52, 0, 0) // -30° grounded
    .rotate(BoneName.HIP_L, 0, 0.79, 0) // 0°, 45° full diagonal
    .position(BoneName.PELVIS, -0.4, 0, 0.4) // 45° position
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☰ GEON HEAVENLY FIST ANIMATION (천둥벽력 - Enhanced)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Geon Heavenly Fist Attack Animation (Enhanced)
 *
 * **Korean**: 천둥벽력 (Cheondung Byeokryeok) - Thunderclap Strike
 * **Technique**: Direct frontal punch with bone-breaking force
 * **Target Points**: 백회혈 (Baekhoehoel/Crown), 명치 (Solar Plexus), 흉골 (Sternum)
 *
 * Characteristics:
 * - Explosive forward drive with hip rotation
 * - Full arm extension with shoulder follow-through
 * - Generates maximum power from ground up
 * - Direct bone-breaking intent
 *
 * Animation Phases:
 * - 0-300ms: Wind-up (6 frames) - Cock fist to ear, twist torso
 * - 300-800ms: Strike (8 frames) - Explosive forward rotation
 * - 800-1200ms: Recovery (6 frames) - Return to guard
 *
 * **Performance**: Targets 60fps (16.67ms per frame)
 * **Damage Type**: Bone-breaking blunt force
 *
 * @korean 천둥벽력
 * @frames 20 total (6 wind-up, 8 strike, 6 recovery)
 * @duration 1200ms
 * @category Attack Animation
 */
export const GEON_HEAVENLY_FIST_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "geon_heavenly_fist",
    "천둥벽력"
  )
    .asAttack(1.2)
    // =================================================================
    // WIND-UP PHASE (0-300ms, frames 0-6)
    // =================================================================
    // Frame 0: Neutral Geon guard baseline
    .at(0)
    .rotate(BoneName.SHOULDER_R, -0.17, 0, 0.09) // -10°, 0°, 5° guard position
    .rotate(BoneName.ELBOW_R, -1.57, 0, 0) // -90° guard bend
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0) // Neutral
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Frame 2: Start of wind-up (100ms)
    .at(0.1)
    .rotate(BoneName.SHOULDER_R, -0.35, 0, 0.26) // -20°, 0°, 15° cock back
    .rotate(BoneName.ELBOW_R, -2.09, 0, 0) // -120° bent
    .rotate(BoneName.SPINE_UPPER, 0, -0.26, 0) // 0°, -15° torso winds up
    .rotate(BoneName.PELVIS, 0, -0.17, 0) // 0°, -10° hip winds
    .done<MartialArtsAnimationBuilder>()
    // Frame 6: Maximum wind-up (300ms)
    .at(0.3)
    .rotate(BoneName.SHOULDER_R, -0.44, 0, 0.35) // -25°, 0°, 20° maximum cock
    .rotate(BoneName.ELBOW_R, -2.27, 0, 0) // -130° maximum bend
    .rotate(BoneName.SPINE_UPPER, 0, -0.35, 0) // 0°, -20° peak twist
    .rotate(BoneName.PELVIS, 0, -0.26, 0) // 0°, -15° maximum coil
    .done<MartialArtsAnimationBuilder>()
    // =================================================================
    // STRIKE PHASE (300-800ms, frames 7-14)
    // =================================================================
    // Frame 10: Mid-strike (500ms)
    .at(0.5)
    .rotate(BoneName.SHOULDER_R, 0.79, 0, 0) // 45° explosive forward
    .rotate(BoneName.ELBOW_R, -0.17, 0, 0) // -10° extending
    .rotate(BoneName.SPINE_UPPER, 0, 0.35, 0) // 0°, 20° rotates through
    .rotate(BoneName.PELVIS, 0, 0.26, 0) // 0°, 15° hip drives
    .rotate(BoneName.KNEE_R, -0.09, 0, 0) // -5° rear leg drives
    .position(BoneName.PELVIS, 0, 0, 0.05)
    .done<MartialArtsAnimationBuilder>()
    // Frame 14: Full extension + follow-through (800ms)
    // NOTE: Shoulder rotation of 1.05 rad (~60°) is intentionally more aggressive
    // than the generic PUNCH_PHASES.EXTENSION (~30-45°) to reflect Geon's
    // 골절력 (bone-breaking power) philosophy. This over-rotation emphasizes
    // maximum penetration and dominance while remaining within anatomically
    // plausible limits for a stylized power strike.
    .at(0.8)
    .rotate(BoneName.SHOULDER_R, 1.05, 0, -0.09) // 60°, 0°, -5° full extension (power-optimized)
    .rotate(BoneName.ELBOW_R, 0, 0, 0) // 0° fully extended
    .rotate(BoneName.WRIST_R, 0.17, 0, 0) // 10° impact alignment
    .rotate(BoneName.SPINE_UPPER, 0, 0.44, 0) // 0°, 25° maximum rotation
    .rotate(BoneName.PELVIS, 0, 0.35, 0) // 0°, 20° hip follow-through
    .position(BoneName.PELVIS, 0, 0, 0.1)
    .done<MartialArtsAnimationBuilder>()
    // =================================================================
    // RECOVERY PHASE (800-1200ms, frames 15-20)
    // =================================================================
    // Frame 17: Begin retraction (1000ms)
    .at(1.0)
    .rotate(BoneName.SHOULDER_R, 0.35, 0, 0.09) // 20°, 0°, 5°
    .rotate(BoneName.ELBOW_R, -1.05, 0, 0) // -60° retracting
    .rotate(BoneName.SPINE_UPPER, 0, 0.17, 0) // 0°, 10°
    .rotate(BoneName.PELVIS, 0, 0.09, 0)
    .position(BoneName.PELVIS, 0, 0, 0.05)
    .done<MartialArtsAnimationBuilder>()
    // Frame 20: Return to guard (1200ms)
    .at(1.2)
    .rotate(BoneName.SHOULDER_R, -0.17, 0, 0.09) // -10°, 0°, 5° guard position
    .rotate(BoneName.ELBOW_R, -1.57, 0, 0) // -90° guard bend
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0) // 0°, 0° neutral
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☰ GEON OVERHEAD HAMMER (하늘의 망치)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Geon Overhead Hammer Strike Animation
 *
 * **Korean**: 천둥 망치타 (Cheondung Mangchita) - Heavenly Hammer Strike
 * **Technique**: Downward overhead strike with full body weight
 * **Target Points**: 정수리 (Crown), 쇄골 (Clavicle), 어깨 (Shoulder)
 *
 * Characteristics:
 * - Arms raised overhead in chambered position
 * - Downward strike with full body weight behind it
 * - Devastating impact on shoulder, clavicle, or skull targets
 * - Uses gravity and body drop for maximum force
 *
 * Animation Phases:
 * - 0-350ms: Wind-up (7 frames) - Raise arms overhead
 * - 350-850ms: Strike (10 frames) - Downward hammer with body drop
 * - 850-1200ms: Recovery (7 frames) - Return to stance
 *
 * **Performance**: 60fps target (16.67ms per frame)
 * **Damage Type**: Crushing overhead force
 *
 * @korean 천둥망치타
 * @frames 24 total (7 wind-up, 10 strike, 7 recovery)
 * @duration 1200ms
 * @category Attack Animation
 */
export const GEON_OVERHEAD_HAMMER: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "geon_overhead_hammer",
    "천둥 망치타"
  )
    .asAttack(1.2)
    // =================================================================
    // WIND-UP PHASE (0-350ms, frames 0-7)
    // =================================================================
    // Frame 0: Start raising arms
    .at(0)
    .rotate(BoneName.SHOULDER_L, -0.52, 0.17, 0.35) // -30°, 10°, 20° starting lift
    .rotate(BoneName.SHOULDER_R, -0.52, -0.17, -0.35) // -30°, -10°, -20°
    .rotate(BoneName.ELBOW_L, 0, 0, -1.57) // -90° bent
    .rotate(BoneName.ELBOW_R, 0, 0, 1.57) // 90° bent
    .rotate(BoneName.SPINE_UPPER, -0.09, 0, 0) // -5° slight back
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Frame 4: Arms rising (175ms)
    .at(0.175)
    .rotate(BoneName.SHOULDER_L, -1.22, 0.26, 0.52) // -70°, 15°, 30°
    .rotate(BoneName.SHOULDER_R, -1.22, -0.26, -0.52) // -70°, -15°, -30°
    .rotate(BoneName.ELBOW_L, 0, 0, -2.09) // -120° more bent
    .rotate(BoneName.ELBOW_R, 0, 0, 2.09) // 120° more bent
    .rotate(BoneName.SPINE_UPPER, -0.17, 0, 0) // -10° leaning back
    .position(BoneName.PELVIS, 0, -0.02, 0) // Slight crouch
    .done<MartialArtsAnimationBuilder>()
    // Frame 7: Near-maximum overhead chamber (350ms)
    .at(0.35)
    .rotate(BoneName.SHOULDER_L, -2.35, 0.35, 0.7) // -135°, 20°, 40° powerful overhead
    .rotate(BoneName.SHOULDER_R, -2.35, -0.35, -0.7) // -135°, -20°, -40°
    .rotate(BoneName.ELBOW_L, 0, 0, -2.18) // ~-125° strong bend within safe limit
    .rotate(BoneName.ELBOW_R, 0, 0, 2.18) // ~125° strong bend within safe limit
    .rotate(BoneName.WRIST_L, -0.17, 0, 0) // -10° wrists cocked
    .rotate(BoneName.WRIST_R, -0.17, 0, 0) // -10°
    .rotate(BoneName.SPINE_UPPER, -0.26, 0, 0) // -15° back lean
    .rotate(BoneName.HEAD, -0.17, 0, 0) // -10° looking up
    .position(BoneName.PELVIS, 0, -0.05, 0) // Deep crouch for power
    .done<MartialArtsAnimationBuilder>()
    // =================================================================
    // STRIKE PHASE (350-850ms, frames 8-17)
    // =================================================================
    // Frame 10: Beginning descent (475ms)
    .at(0.475)
    .rotate(BoneName.SHOULDER_L, -1.92, 0.26, 0.52) // -110°, 15°, 30° starting down
    .rotate(BoneName.SHOULDER_R, -1.92, -0.26, -0.52) // -110°, -15°, -30°
    .rotate(BoneName.ELBOW_L, 0, 0, -1.92) // -110° extending
    .rotate(BoneName.ELBOW_R, 0, 0, 1.92) // 110° extending
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0) // 0° coming forward
    .rotate(BoneName.HEAD, 0, 0, 0)
    .position(BoneName.PELVIS, 0, -0.03, 0.02)
    .done<MartialArtsAnimationBuilder>()
    // Frame 13: Mid-strike acceleration (650ms)
    .at(0.65)
    .rotate(BoneName.SHOULDER_L, -0.87, 0.17, 0.26) // -50°, 10°, 15°
    .rotate(BoneName.SHOULDER_R, -0.87, -0.17, -0.26) // -50°, -10°, -15°
    .rotate(BoneName.ELBOW_L, 0, 0, -0.79) // -45° mostly extended
    .rotate(BoneName.ELBOW_R, 0, 0, 0.79) // 45° mostly extended
    .rotate(BoneName.SPINE_UPPER, 0.26, 0, 0) // 15° forward lean
    .rotate(BoneName.PELVIS, 0.17, 0, 0) // 10° forward
    .position(BoneName.PELVIS, 0, 0, 0.05) // Body dropping forward
    .done<MartialArtsAnimationBuilder>()
    // Frame 17: Impact (850ms)
    .at(0.85)
    .rotate(BoneName.SHOULDER_L, 0.17, 0.09, 0.09) // 10°, 5°, 5° full extension down
    .rotate(BoneName.SHOULDER_R, 0.17, -0.09, -0.09) // 10°, -5°, -5°
    .rotate(BoneName.ELBOW_L, 0, 0, -0.17) // -10° nearly straight
    .rotate(BoneName.ELBOW_R, 0, 0, 0.17) // 10° nearly straight
    .rotate(BoneName.WRIST_L, 0.26, 0, 0) // 15° hammer fist angle
    .rotate(BoneName.WRIST_R, 0.26, 0, 0) // 15° hammer fist angle
    .rotate(BoneName.SPINE_UPPER, 0.44, 0, 0) // 25° full forward
    .rotate(BoneName.PELVIS, 0.26, 0, 0) // 15° forward
    .rotate(BoneName.KNEE_L, -0.35, 0, 0) // -20° legs bent for absorption
    .rotate(BoneName.KNEE_R, -0.35, 0, 0) // -20°
    .position(BoneName.PELVIS, 0, -0.08, 0.15) // Body dropped and forward
    .done<MartialArtsAnimationBuilder>()
    // =================================================================
    // RECOVERY PHASE (850-1200ms, frames 18-24)
    // =================================================================
    // Frame 20: Begin recovery (1000ms)
    .at(1.0)
    .rotate(BoneName.SHOULDER_L, -0.26, 0.09, 0.17) // -15°, 5°, 10° pulling back
    .rotate(BoneName.SHOULDER_R, -0.26, -0.09, -0.17) // -15°, -5°, -10°
    .rotate(BoneName.ELBOW_L, 0, 0, -0.87) // -50° bending
    .rotate(BoneName.ELBOW_R, 0, 0, 0.87) // 50° bending
    .rotate(BoneName.SPINE_UPPER, 0.17, 0, 0) // 10° still forward
    .rotate(BoneName.PELVIS, 0.09, 0, 0)
    .position(BoneName.PELVIS, 0, -0.04, 0.08)
    .done<MartialArtsAnimationBuilder>()
    // Frame 24: Return to guard (1200ms)
    .at(1.2)
    .rotate(BoneName.SHOULDER_L, -0.17, 0, 0.09) // -10°, 0°, 5° guard
    .rotate(BoneName.SHOULDER_R, -0.17, 0, -0.09) // -10°, 0°, -5°
    .rotate(BoneName.ELBOW_L, 0, 0, -1.57) // -90° guard position
    .rotate(BoneName.ELBOW_R, 0, 0, 1.57) // 90°
    .rotate(BoneName.WRIST_L, 0, 0, 0)
    .rotate(BoneName.WRIST_R, 0, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0) // 0° neutral
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .rotate(BoneName.HEAD, 0, 0, 0)
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° stance
    .rotate(BoneName.KNEE_R, -0.26, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map of all Geon-specific animations for easy access
 * @korean 건괘애니메이션맵
 */
export const GEON_ANIMATIONS: ReadonlyMap<string, SkeletalAnimation> = new Map([
  ["geon_idle_breathing", GEON_IDLE_BREATHING],
  ["geon_forward_advance", GEON_FORWARD_ADVANCE],
  ["geon_diagonal_power_step", GEON_DIAGONAL_POWER_STEP],
  ["geon_heavenly_fist", GEON_HEAVENLY_FIST_ANIMATION],
  ["geon_overhead_hammer", GEON_OVERHEAD_HAMMER],
]);
