/**
 * ☶ Gan (Mountain) Stance-Specific Animations
 *
 * Specialized idle, movement, and guard animations for the Gan (간/Mountain) trigram.
 * Embodies immovable defense and patient counter from Hapkido defensive techniques.
 *
 * **Korean Martial Arts Context:**
 * - **무술**: 합기도 방어 기술 (Hapkido Defensive Blocks)
 * - **특성**: 부동의 방어 (Immovable Defense), 반격 기술 (Counter Techniques)
 * - **철학**: 산의 불변성 (Mountain's Immutability), 바위의 견고함 (Rock's Solidity)
 * - **대표 기술**: 반석방어 (Rock Defense/Immovable Counter)
 *
 * @module systems/animation/catalogs/GanStanceAnimations
 * @category Animation
 * @korean 간괘자세애니메이션
 */

import { BoneName, type SkeletalAnimation } from "@/types/skeletal";
import { MartialArtsAnimationBuilder } from "../builders/MartialArtsAnimationBuilder";

/**
 * Anatomical safety constants for Gan (Mountain) trigram animations
 *
 * These limits ensure joint rotations remain within safe physiological ranges
 * while maintaining stable, immovable defensive postures characteristic of Gan.
 */
export const ANATOMICAL_LIMITS_GAN_STANCE = {
  /**
   * Maximum safe knee bend for deep rooted stance: 25° (0.44 radians)
   * 
   * Gan stance requires deep, stable leg positioning. Knees bent to ~15-25°
   * provide optimal balance between stability and mobility for defensive counters.
   */
  MAX_KNEE_BEND_ROOTED: 0.44, // 25° in radians
  
  /**
   * Maximum safe elbow bend for solid guard: 120° (2.09 radians)
   * 
   * High solid guard requires elbows bent to create reinforced blocking structure.
   * 110-120° provides maximum structural integrity for absorbing attacks.
   */
  MAX_ELBOW_BEND_GUARD: 2.09, // 120° in radians
  
  /**
   * Maximum safe shoulder elevation for high guard: -35° (-0.61 radians)
   * 
   * High guard positioning with shoulders elevated to protect head and face.
   * -30° to -35° elevation creates solid defensive wall without strain.
   */
  MAX_SHOULDER_ELEVATION: -0.61, // -35° in radians
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// ☶ GAN IDLE ROOTED ANIMATION (간괘 뿌리 자세)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gan Idle Rooted Animation
 *
 * **Korean**: 간괘 뿌리 자세 (Gan-gwae Ppuri Jase)
 * **Philosophy**: Mountain's immovability through rooted stillness
 *
 * Characteristics:
 * - Minimal movement emphasizing stability (산의 고요)
 * - Deep breathing without upper body motion
 * - Weight grounded through entire stance
 * - High solid guard position maintained
 *
 * Animation Cycle:
 * - 0ms: Rooted neutral position
 * - 1600ms: Deep breath (minimal chest expansion)
 * - 3200ms: Return to start (complete cycle)
 *
 * @korean 간괘뿌리자세
 * @duration 3200ms (3.2 second cycle)
 * @category Idle Animation
 */
export const GAN_IDLE_ROOTED: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "gan_idle_rooted",
    "간괘 뿌리 자세"
  )
    .asIdle(3.2, true)
    // Keyframe 0ms: Rooted neutral position (baseline)
    .at(0)
    .rotate(BoneName.PELVIS, 0, 0, 0) // Neutral pelvis - immovable
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0) // Neutral spine - solid
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0) // Lower spine stable
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° bent for stability
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15° bent for stability
    .rotate(BoneName.SHOULDER_L, -0.35, 0, -0.44) // -20°, 0°, -25° (high guard)
    .rotate(BoneName.SHOULDER_R, -0.35, 0, 0.44) // -20°, 0°, 25° (high guard)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.92) // -110° (reinforced structure)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.92) // 110° (reinforced structure)
    .rotate(BoneName.WRIST_L, 0, 0, 0) // Neutral wrists
    .rotate(BoneName.WRIST_R, 0, 0, 0)
    .rotate(BoneName.HEAD, 0, 0, 0) // Head steady, focused
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 1600ms: Deep breath (minimal movement - mountain stillness)
    .at(1.6)
    .rotate(BoneName.SPINE_UPPER, -0.017, 0, 0) // -1° (tiny chest expansion)
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0) // Lower spine remains stable
    .rotate(BoneName.SHOULDER_L, -0.366, 0, -0.453) // -21°, 0°, -26° (slight shoulder adjustment)
    .rotate(BoneName.SHOULDER_R, -0.366, 0, 0.453) // -21°, 0°, 26°
    .rotate(BoneName.ELBOW_L, 0, 0, -1.92) // -110° (maintained guard structure)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.92) // 110° (maintained guard structure)
    .rotate(BoneName.WRIST_L, 0, 0, 0) // Wrists remain neutral
    .rotate(BoneName.WRIST_R, 0, 0, 0)
    .rotate(BoneName.KNEE_L, -0.279, 0, 0) // -16° (slightly deeper root)
    .rotate(BoneName.KNEE_R, -0.279, 0, 0) // -16°
    .rotate(BoneName.HEAD, 0, 0, 0) // Head steady - mountain focus
    .position(BoneName.PELVIS, 0, 0, 0) // No movement - mountain doesn't shift
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 3200ms: Return to start (complete cycle)
    .at(3.2)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0) // Stable lower spine
    .rotate(BoneName.SHOULDER_L, -0.35, 0, -0.44)
    .rotate(BoneName.SHOULDER_R, -0.35, 0, 0.44)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.92) // -110° (guard restored)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.92) // 110° (guard restored)
    .rotate(BoneName.WRIST_L, 0, 0, 0) // Neutral wrists
    .rotate(BoneName.WRIST_R, 0, 0, 0)
    .rotate(BoneName.KNEE_L, -0.26, 0, 0)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0)
    .rotate(BoneName.HEAD, 0, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☶ GAN SHORT ROOT STEP (산의 걸음)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gan Short Root Step Animation
 *
 * **Korean**: 산의 걸음 (San-ui Georeum) - Mountain's Walk
 * **Technique**: Minimal forward movement maintaining root
 *
 * Characteristics:
 * - Each step reinforces stability (no excess motion)
 * - Weight stays low and grounded
 * - Guard remains solid throughout
 * - No compromise to balance
 *
 * Animation Phases:
 * - 0-133ms: Weight shift preparation (frames 0-2)
 * - 133-267ms: Minimal forward step (frames 3-5)
 * - 267-400ms: Root reinforcement (frames 6-8)
 *
 * @korean 산의걸음
 * @frames 9 frames (~44ms per frame at 60fps)
 * @duration 400ms
 * @category Movement Animation
 */
export const GAN_SHORT_ROOT_STEP: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "gan_short_root_step",
    "산의 걸음"
  )
    .asMovement(0.4, false)
    // Phase 1: Weight shift preparation (0ms, frame 0)
    .at(0)
    .rotate(BoneName.PELVIS, 0.087, 0, 0) // 5° forward tilt (minimal)
    .rotate(BoneName.KNEE_R, -0.35, 0, 0) // -20° rear leg prepares
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° front leg ready
    .rotate(BoneName.FOOT_L, 0, 0, 0) // Front foot flat
    .rotate(BoneName.FOOT_R, 0.087, 0, 0) // 5° rear foot prepares to push
    .rotate(BoneName.SHOULDER_L, -0.35, 0, -0.44) // Guard maintained
    .rotate(BoneName.SHOULDER_R, -0.35, 0, 0.44)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.92)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.92)
    .rotate(BoneName.HEAD, 0.052, 0, 0) // 3° head slightly forward (aware)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Phase 2: Minimal forward step (200ms, frame 5)
    .at(0.2)
    .rotate(BoneName.PELVIS, 0.105, 0, 0) // 6° slight forward
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15° extending
    .rotate(BoneName.KNEE_L, -0.35, 0, 0) // -20° absorbing weight
    .rotate(BoneName.FOOT_L, -0.052, 0, 0) // -3° foot plants
    .rotate(BoneName.FOOT_R, 0.174, 0, 0) // 10° rear foot pushes off
    .rotate(BoneName.SHOULDER_L, -0.35, 0, -0.44) // Guard solid
    .rotate(BoneName.SHOULDER_R, -0.35, 0, 0.44)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.92) // -110° (maintained)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.92) // 110° (maintained)
    .rotate(BoneName.HEAD, 0.052, 0, 0) // 3° head tracks forward
    .position(BoneName.PELVIS, 0, 0, 0.15) // Minimal forward movement
    .done<MartialArtsAnimationBuilder>()
    // Phase 3: Root reinforcement (400ms, frame 9)
    .at(0.4)
    .rotate(BoneName.PELVIS, 0, 0, 0) // Return to neutral
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15° rooted
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° rooted
    .rotate(BoneName.FOOT_L, 0, 0, 0) // Front foot grounded
    .rotate(BoneName.FOOT_R, 0, 0, 0) // Rear foot settled
    .rotate(BoneName.SHOULDER_L, -0.35, 0, -0.44) // Guard maintained
    .rotate(BoneName.SHOULDER_R, -0.35, 0, 0.44)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.92)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.92)
    .rotate(BoneName.HEAD, 0, 0, 0) // Head returns to neutral focus
    .position(BoneName.PELVIS, 0, 0, 0.25) // Short step complete
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☶ GAN DEFENSIVE ANGLE SHIFT (방어 각도 전환)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gan Defensive Angle Shift Animation
 *
 * **Korean**: 방어 각도 전환 (Bangeo Gakdo Jeonhwan) - Defensive Angle Transition
 * **Technique**: Small angle change for better defensive position
 *
 * Characteristics:
 * - Pivot on one foot maintaining stability
 * - Guard remains solid throughout
 * - No compromise to balance
 * - Repositions for optimal counter angle
 *
 * Animation Phases:
 * - 0-167ms: Begin pivot (frames 0-3)
 * - 167-367ms: Angle rotation (frames 4-7)
 * - 367-500ms: Settle and root (frames 8-10)
 *
 * @korean 방어각도전환
 * @frames 11 frames (~45ms per frame at 60fps)
 * @duration 500ms
 * @category Movement Animation
 */
export const GAN_DEFENSIVE_ANGLE_SHIFT: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "gan_defensive_angle_shift",
    "방어 각도 전환"
  )
    .asMovement(0.5, false)
    // Phase 1: Begin pivot (0ms, frame 0)
    .at(0)
    .rotate(BoneName.PELVIS, 0, -0.174, 0) // 0°, -10° (begin rotation)
    .rotate(BoneName.KNEE_L, -0.35, 0, 0) // -20° (pivot foot loads)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15° (support foot stable)
    .rotate(BoneName.FOOT_L, 0, -0.087, 0) // 0°, -5° (beginning pivot)
    .rotate(BoneName.FOOT_R, 0, 0, 0) // Support foot flat
    .rotate(BoneName.SHOULDER_L, -0.35, 0, -0.44) // Guard maintained
    .rotate(BoneName.SHOULDER_R, -0.35, 0, 0.44)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.92)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.92)
    .rotate(BoneName.HEAD, 0, -0.087, 0) // 0°, -5° (head begins tracking)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Phase 2: Angle rotation (267ms, frame 6)
    .at(0.267)
    .rotate(BoneName.PELVIS, 0, -0.349, 0) // 0°, -20° (maximum rotation)
    .rotate(BoneName.SPINE_LOWER, 0, -0.262, 0) // 0°, -15° (torso follows)
    .rotate(BoneName.SPINE_UPPER, 0, -0.174, 0) // 0°, -10° (upper body stable)
    .rotate(BoneName.KNEE_L, -0.35, 0, 0) // -20° (pivot foot)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15° (support foot)
    .rotate(BoneName.FOOT_L, 0, -0.262, 0) // 0°, -15° (pivot complete)
    .rotate(BoneName.FOOT_R, 0, 0.052, 0) // 0°, 3° (support adjusts)
    .rotate(BoneName.HEAD, 0, -0.174, 0) // 0°, -10° (eyes track forward)
    .rotate(BoneName.SHOULDER_L, -0.35, 0, -0.44) // Guard maintained
    .rotate(BoneName.SHOULDER_R, -0.35, 0, 0.44)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.92) // -110° (maintained)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.92) // 110° (maintained)
    .position(BoneName.PELVIS, -0.05, 0, 0) // Minimal lateral shift
    .done<MartialArtsAnimationBuilder>()
    // Phase 3: Settle and root (500ms, frame 11)
    .at(0.5)
    .rotate(BoneName.PELVIS, 0, -0.349, 0) // 0°, -20° (settled angle)
    .rotate(BoneName.SPINE_LOWER, 0, -0.262, 0) // 0°, -15°
    .rotate(BoneName.SPINE_UPPER, 0, -0.174, 0) // 0°, -10°
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° (rooted)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15° (rooted)
    .rotate(BoneName.FOOT_L, 0, -0.262, 0) // 0°, -15° (planted)
    .rotate(BoneName.FOOT_R, 0, 0, 0) // Support foot flat and stable
    .rotate(BoneName.HEAD, 0, -0.174, 0) // 0°, -10°
    .rotate(BoneName.SHOULDER_L, -0.35, 0, -0.44) // Guard solid
    .rotate(BoneName.SHOULDER_R, -0.35, 0, 0.44)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.92)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.92)
    .position(BoneName.PELVIS, -0.08, 0, 0) // Final position
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☶ GAN HIGH SOLID GUARD TRANSITION (산 방어 전환)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gan High Solid Guard Transition Animation
 *
 * **Korean**: 산 방어 전환 (San Bangeo Jeonhwan) - Mountain Guard Transition
 * **Technique**: Transition into Gan's characteristic high solid guard
 *
 * Characteristics:
 * - High guard protecting head and upper body
 * - Elbows reinforcing structure
 * - Fists positioned for blocking
 * - Stance wide and immovable
 *
 * Animation Phases:
 * - 0-167ms: Begin guard transition
 * - 167-333ms: Establish high solid guard
 *
 * @korean 산방어전환
 * @duration 333ms
 * @category Stance Animation
 */
export const GAN_HIGH_SOLID_GUARD_TRANSITION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "gan_high_solid_guard_transition",
    "산 방어 전환"
  )
    .asStance(0.333, false)
    // Phase 1: Begin guard transition (0ms)
    .at(0)
    .rotate(BoneName.SHOULDER_L, -0.262, 0, -0.349) // -15°, 0°, -20° (raising)
    .rotate(BoneName.SHOULDER_R, -0.262, 0, 0.349) // -15°, 0°, 20° (raising)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.57) // -90° (transitioning)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.57) // 90° (transitioning)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0) // Neutral upper spine
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0) // Stable lower spine
    .rotate(BoneName.PELVIS, 0, 0, 0) // Neutral pelvis
    .rotate(BoneName.HEAD, 0.052, 0, 0) // 3° head lifts slightly
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Phase 2: Establish high solid guard (333ms)
    .at(0.333)
    .rotate(BoneName.SHOULDER_L, -0.35, 0, -0.44) // -20°, 0°, -25° (Gan high guard)
    .rotate(BoneName.SHOULDER_R, -0.35, 0, 0.44) // -20°, 0°, 25° (Gan high guard)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.92) // -110° (reinforced structure)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.92) // 110° (reinforced structure)
    .rotate(BoneName.WRIST_L, 0, 0, 0) // Neutral wrists for blocking
    .rotate(BoneName.WRIST_R, 0, 0, 0)
    .rotate(BoneName.SPINE_UPPER, -0.035, 0, 0) // -2° slight chest lift for solid structure
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0) // Lower spine stable
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° (stable stance)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15° (stable stance)
    .rotate(BoneName.HEAD, 0, 0, 0) // Head neutral, focused
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map of all Gan stance-specific animations for easy access
 * @korean 간괘자세애니메이션맵
 */
export const GAN_STANCE_ANIMATIONS: ReadonlyMap<string, SkeletalAnimation> = new Map([
  // Idle & Movement
  ["gan_idle_rooted", GAN_IDLE_ROOTED],
  ["gan_short_root_step", GAN_SHORT_ROOT_STEP],
  ["gan_defensive_angle_shift", GAN_DEFENSIVE_ANGLE_SHIFT],
  
  // Stance Transitions
  ["gan_high_solid_guard_transition", GAN_HIGH_SOLID_GUARD_TRANSITION],
]);
