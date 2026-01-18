/**
 * ☳ Jin (Thunder) Stance-Specific Animations
 *
 * Specialized idle, movement, and combat animations for the Jin (진/Thunder) trigram.
 * Embodies explosive power and stunning force from Taekwondo jumping techniques.
 *
 * **Korean Martial Arts Context:**
 * - **무술**: 태권도 폭발 기술 (Taekwondo Explosive Techniques)
 * - **특성**: 기절시키는 힘 (Stunning Power), 뛰어 차기 (Jumping Kicks)
 * - **철학**: 천둥의 폭발력 (Thunder's Explosive Force), 번개같은 충격 (Lightning Shock)
 * - **대표 기술**: 벽력일섬 (Thunder Flash/Explosive Stunning Strike)
 *
 * @module systems/animation/catalogs/JinStanceAnimations
 * @category Animation
 * @korean 진괘자세애니메이션
 */

import { BoneName } from "@/types/skeletal";
import type { SkeletalAnimation } from "@/types/skeletal";
import { MartialArtsAnimationBuilder } from "../builders/MartialArtsAnimationBuilder";
import { ANATOMICAL_LIMITS } from "../constants";

/**
 * Anatomical safety constants for Jin (Thunder) trigram animations
 *
 * These limits ensure joint rotations remain within safe physiological ranges
 * while maintaining explosive, dramatic animation for Jin's jumping techniques.
 */

// ═══════════════════════════════════════════════════════════════════════════
// ☳ JIN IDLE COILED ANIMATION (진괘 도약 자세)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Jin Idle Coiled Animation
 *
 * **Korean**: 진괘 도약 자세 (Jin-gwae Doyak Jase)
 * **Philosophy**: Thunder's coiled spring ready to unleash explosive power
 *
 * Characteristics:
 * - Coiled spring tension in legs and core
 * - Weight on balls of feet, heels slightly raised
 * - Shoulders drawn back for explosive readiness
 * - Fists chambered at hips with maximum tension
 * - Deep squat position (horse stance)
 *
 * Animation Cycle:
 * - 0ms: Neutral coiled position
 * - 1250ms: Increased tension (deeper coil)
 * - 2500ms: Return to neutral
 *
 * @korean 진괘도약자세
 * @duration 2500ms (2.5 second cycle)
 * @category Idle Animation
 */
export const JIN_IDLE_COILED: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "jin_idle_coiled",
    "진괘 도약 자세"
  )
    .asIdle(2.5, true)
    // Keyframe 0ms: Neutral coiled position (baseline)
    .at(0)
    .rotate(BoneName.PELVIS, 0.1, 0, 0) // 5.7° forward tilt for power stance
    .rotate(BoneName.SPINE_UPPER, -0.09, 0, 0) // -5° backward lean for balance
    .rotate(BoneName.HIP_L, 0.52, 0, 0) // 30° hip flexion
    .rotate(BoneName.HIP_R, 0.52, 0, 0) // 30° hip flexion (symmetrical)
    .rotate(BoneName.KNEE_L, -1.4, 0, 0) // -80° deep bend (coiled)
    .rotate(BoneName.KNEE_R, -1.4, 0, 0) // -80° deep bend (coiled)
    .rotate(BoneName.FOOT_L, 0.26, 0, 0) // 15° heels raised (balls of feet)
    .rotate(BoneName.FOOT_R, 0.26, 0, 0) // 15° heels raised
    .rotate(BoneName.SHOULDER_L, -0.26, 0, -0.35) // -15°, 0°, -20° (fists at hips)
    .rotate(BoneName.SHOULDER_R, -0.26, 0, 0.35) // -15°, 0°, 20°
    .rotate(BoneName.ELBOW_L, 0, 0, -1.57) // -90° (chambered)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.57) // 90° (chambered)
    .rotate(BoneName.HEAD, 0, 0, 0) // Neutral, eyes locked forward
    .position(BoneName.PELVIS, 0, -0.25, 0) // Very low for explosive power
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 1250ms: Increased tension (deeper coil)
    .at(1.25)
    .rotate(BoneName.PELVIS, 0.14, 0, 0) // 8° more forward
    .rotate(BoneName.SPINE_UPPER, -0.12, 0, 0) // -7° more backward
    .rotate(BoneName.KNEE_L, ANATOMICAL_LIMITS.KNEE.MAX_FLEXION * -1, 0, 0) // -90° MAXIMUM coil
    .rotate(BoneName.KNEE_R, ANATOMICAL_LIMITS.KNEE.MAX_FLEXION * -1, 0, 0) // -90° MAXIMUM coil
    .rotate(BoneName.FOOT_L, 0.31, 0, 0) // 18° more on toes
    .rotate(BoneName.FOOT_R, 0.31, 0, 0) // 18° more on toes
    .rotate(BoneName.SHOULDER_L, -0.30, 0, -0.38) // -17°, 0°, -22° (tighter)
    .rotate(BoneName.SHOULDER_R, -0.30, 0, 0.38) // -17°, 0°, 22°
    .rotate(BoneName.ELBOW_L, 0, 0, -1.57) // -90° (chambered)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.57) // 90° (chambered)
    .position(BoneName.PELVIS, 0, -0.28, 0) // Even lower - maximum spring load
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 2500ms: Return to neutral
    .at(2.5)
    .rotate(BoneName.PELVIS, 0.1, 0, 0)
    .rotate(BoneName.SPINE_UPPER, -0.09, 0, 0)
    .rotate(BoneName.KNEE_L, -1.4, 0, 0)
    .rotate(BoneName.KNEE_R, -1.4, 0, 0)
    .rotate(BoneName.FOOT_L, 0.26, 0, 0)
    .rotate(BoneName.FOOT_R, 0.26, 0, 0)
    .rotate(BoneName.SHOULDER_L, -0.26, 0, -0.35)
    .rotate(BoneName.SHOULDER_R, -0.26, 0, 0.35)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.57) // -90° (chambered)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.57) // 90° (chambered)
    .position(BoneName.PELVIS, 0, -0.25, 0)
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☳ JIN EXPLOSIVE BURST (천둥 돌진)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Jin Explosive Burst Animation
 *
 * **Korean**: 천둥 돌진 (Cheondung Doljin) - Thunder Rush
 * **Technique**: Explosive forward launch from coiled position
 *
 * Characteristics:
 * - Explosive leg drive with both legs pushing simultaneously
 * - Upper body follows with momentum
 * - Arms drive forward for striking on arrival
 * - Maximum power from ground-up force generation
 *
 * Animation Phases:
 * - 0-167ms: Initial explosive push-off (frames 1-3)
 * - 167-467ms: Forward burst acceleration (frames 4-8)
 * - 467-600ms: Landing in stable position (frames 9-10)
 *
 * @korean 천둥돌진
 * @frames 10 frames (16.67ms per frame at 60fps)
 * @duration 600ms
 * @category Movement Animation
 */
export const JIN_EXPLOSIVE_BURST: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "jin_explosive_burst",
    "천둥 돌진"
  )
    .asMovement(0.6, false)
    // Frames 1-3: Explosive push-off (0-167ms)
    .at(0)
    .rotate(BoneName.PELVIS, 0.14, 0, 0) // 8° deep coil
    .rotate(BoneName.SPINE_UPPER, -0.12, 0, 0) // -7° loaded
    .rotate(BoneName.KNEE_L, ANATOMICAL_LIMITS.KNEE.MAX_FLEXION * -1, 0, 0) // -90° maximum coil
    .rotate(BoneName.KNEE_R, ANATOMICAL_LIMITS.KNEE.MAX_FLEXION * -1, 0, 0) // -90° maximum coil
    .rotate(BoneName.FOOT_L, 0.31, 0, 0) // 18° on toes
    .rotate(BoneName.FOOT_R, 0.31, 0, 0) // 18° on toes
    .rotate(BoneName.SHOULDER_L, -0.30, 0, -0.38) // Fists chambered
    .rotate(BoneName.SHOULDER_R, -0.30, 0, 0.38)
    .position(BoneName.PELVIS, 0, -0.28, 0) // Very low
    .done<MartialArtsAnimationBuilder>()
    // Frames 4-8: Forward burst (167-467ms)
    .at(0.317)
    .rotate(BoneName.PELVIS, 0.35, 0, 0) // 20° explosive forward drive
    .rotate(BoneName.SPINE_UPPER, 0.17, 0, 0) // 10° following through
    .rotate(BoneName.KNEE_L, -0.17, 0, 0) // -10° extending explosively
    .rotate(BoneName.KNEE_R, -0.17, 0, 0) // -10° extending
    .rotate(BoneName.FOOT_L, -0.17, 0, 0) // -10° pushing off
    .rotate(BoneName.FOOT_R, -0.17, 0, 0) // -10° pushing off
    .rotate(BoneName.SHOULDER_L, -0.52, 0, 0.17) // -30°, 0°, 10° (arms driving forward)
    .rotate(BoneName.SHOULDER_R, -0.52, 0, -0.17) // -30°, 0°, -10°
    .position(BoneName.PELVIS, 0, -0.08, 0.6) // Rising and moving forward rapidly
    .done<MartialArtsAnimationBuilder>()
    // Frames 9-10: Landing (467-600ms)
    .at(0.6)
    .rotate(BoneName.PELVIS, 0.1, 0, 0) // 5.7° settling
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0) // Neutral spine
    .rotate(BoneName.KNEE_L, -0.44, 0, 0) // -25° absorbing impact
    .rotate(BoneName.KNEE_R, -0.44, 0, 0) // -25° absorbing impact
    .rotate(BoneName.FOOT_L, 0, 0, 0) // Flat landing
    .rotate(BoneName.FOOT_R, 0, 0, 0) // Flat landing
    .rotate(BoneName.SHOULDER_L, -0.26, 0, -0.35) // Return to ready
    .rotate(BoneName.SHOULDER_R, -0.26, 0, 0.35)
    .position(BoneName.PELVIS, 0, -0.12, 1.0) // Forward position, stable height
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☳ JIN JUMPING ADVANCE (번개 도약)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Jin Jumping Advance Animation
 *
 * **Korean**: 번개 도약 (Byeonggae Doyak) - Lightning Leap
 * **Technique**: Leap forward with both feet leaving ground
 *
 * Characteristics:
 * - Both feet leave ground simultaneously
 * - Arms swing for momentum and balance
 * - Body rotates for striking position in air
 * - Land in stable striking stance
 *
 * Animation Phases:
 * - 0-200ms: Crouch and spring load (frames 1-4)
 * - 200-567ms: Airborne leap forward (frames 5-10)
 * - 567-900ms: Landing and stabilization (frames 11-15)
 *
 * @korean 번개도약
 * @frames 15 frames (16.67ms per frame at 60fps)
 * @duration 900ms
 * @category Movement Animation
 */
export const JIN_JUMPING_ADVANCE: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "jin_jumping_advance",
    "번개 도약"
  )
    .asMovement(0.9, false)
    // Frames 1-4: Spring load (0-200ms)
    .at(0)
    .rotate(BoneName.PELVIS, 0.17, 0, 0) // 10° crouch
    .rotate(BoneName.SPINE_UPPER, -0.14, 0, 0) // -8° counter-balance
    .rotate(BoneName.KNEE_L, -1.22, 0, 0) // -70° deep crouch
    .rotate(BoneName.KNEE_R, -1.22, 0, 0) // -70° deep crouch
    .rotate(BoneName.FOOT_L, 0.35, 0, 0) // 20° on toes
    .rotate(BoneName.FOOT_R, 0.35, 0, 0) // 20° on toes
    .rotate(BoneName.SHOULDER_L, 0.52, 0, -0.26) // 30°, 0°, -15° (arms back)
    .rotate(BoneName.SHOULDER_R, 0.52, 0, 0.26) // 30°, 0°, 15°
    .position(BoneName.PELVIS, 0, -0.35, 0) // Very low crouch
    .done<MartialArtsAnimationBuilder>()
    // Frames 5-7: Takeoff (200-383ms)
    .at(0.292)
    .rotate(BoneName.PELVIS, -0.09, 0, 0) // -5° launching backward
    .rotate(BoneName.SPINE_UPPER, 0.26, 0, 0) // 15° driving up
    .rotate(BoneName.KNEE_L, 0, 0, 0) // 0° fully extended
    .rotate(BoneName.KNEE_R, 0, 0, 0) // 0° fully extended
    .rotate(BoneName.FOOT_L, -0.26, 0, 0) // -15° pushing off
    .rotate(BoneName.FOOT_R, -0.26, 0, 0) // -15° pushing off
    .rotate(BoneName.SHOULDER_L, -0.70, 0, 0.17) // -40°, 0°, 10° (arms swinging forward)
    .rotate(BoneName.SHOULDER_R, -0.70, 0, -0.17) // -40°, 0°, -10°
    .position(BoneName.PELVIS, 0, 0.05, 0.2) // Airborne - rising
    .done<MartialArtsAnimationBuilder>()
    // Frames 8-10: Peak of jump (383-567ms)
    .at(0.475)
    .rotate(BoneName.PELVIS, 0, -0.17, 0) // 0°, -10° rotating in air
    .rotate(BoneName.SPINE_UPPER, 0.17, -0.26, 0) // 10°, -15° twist for striking
    .rotate(BoneName.KNEE_L, -0.52, 0, 0) // -30° tucking legs
    .rotate(BoneName.KNEE_R, -0.52, 0, 0) // -30° tucking legs
    .rotate(BoneName.FOOT_L, 0.17, 0, 0) // 10° feet extended
    .rotate(BoneName.FOOT_R, 0.17, 0, 0) // 10° feet extended
    .rotate(BoneName.SHOULDER_L, -0.87, 0, 0.26) // -50°, 0°, 15° (full swing)
    .rotate(BoneName.SHOULDER_R, -0.87, 0, -0.26) // -50°, 0°, -15°
    .position(BoneName.PELVIS, 0, 0.15, 0.5) // Peak height, forward
    .done<MartialArtsAnimationBuilder>()
    // Frames 11-15: Landing (567-900ms)
    .at(0.9)
    .rotate(BoneName.PELVIS, 0.1, -0.26, 0) // 5.7°, -15° landed with rotation
    .rotate(BoneName.SPINE_UPPER, 0.09, -0.35, 0) // 5°, -20° striking position
    .rotate(BoneName.KNEE_L, -0.61, 0, 0) // -35° absorbing impact
    .rotate(BoneName.KNEE_R, -0.61, 0, 0) // -35° absorbing impact
    .rotate(BoneName.FOOT_L, 0, 0, 0) // Flat landing
    .rotate(BoneName.FOOT_R, 0, 0, 0) // Flat landing
    .rotate(BoneName.SHOULDER_L, -0.26, 0, -0.35) // -15°, 0°, -20° ready to strike
    .rotate(BoneName.SHOULDER_R, -0.26, 0, 0.35) // -15°, 0°, 20°
    .position(BoneName.PELVIS, 0, -0.18, 0.9) // Forward position, stable
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT ANIMATION MAP
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map of all Jin stance-specific animations for easy access
 * 진괘 자세별 애니메이션 맵
 */
export const JIN_ANIMATIONS: ReadonlyMap<string, SkeletalAnimation> =
  new Map([
    ["jin_idle_coiled", JIN_IDLE_COILED],
    ["jin_explosive_burst", JIN_EXPLOSIVE_BURST],
    ["jin_jumping_advance", JIN_JUMPING_ADVANCE],
  ]);
