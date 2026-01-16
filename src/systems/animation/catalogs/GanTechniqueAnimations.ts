/**
 * ☶ Gan (Mountain) Technique Combat Animations
 *
 * Specialized combat technique animations for the Gan (간/Mountain) trigram.
 * Embodies defensive blocks, absorption, and powerful counter-attacks.
 *
 * **Korean Martial Arts Context:**
 * - **무술**: 합기도 방어 기술 (Hapkido Defensive Techniques)
 * - **특성**: 반석방어 (Rock Defense), 역습 (Reversal Counter)
 * - **철학**: 바위처럼 막기 (Block Like Rock), 산처럼 역습 (Counter Like Mountain)
 * - **대표 기술**: 반석방어 (Rock Defense), 방어 역습 (Defensive Reversal)
 *
 * @module systems/animation/catalogs/GanTechniqueAnimations
 * @category Animation
 * @korean 간괘기술애니메이션
 */

import { BoneName, type SkeletalAnimation } from "@/types/skeletal";
import { MartialArtsAnimationBuilder } from "../builders/MartialArtsAnimationBuilder";

// ═══════════════════════════════════════════════════════════════════════════
// ☶ GAN ROCK DEFENSE ANIMATION (반석방어)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gan Rock Defense Animation
 *
 * **Korean**: 반석방어 (Banseok Bangeo) - Rock Defense
 * **Technique**: Solid block followed by powerful counter from absorbed energy
 * **Target Points**: Superior striking position after absorption
 *
 * Characteristics:
 * - Block: Solid block with reinforced structure
 * - Absorb: Ground impact force through stable stance
 * - Counter: Powerful counter using stored energy
 * - Recovery: Return to immovable guard
 *
 * Animation Phases:
 * - 0-300ms: Block phase (frames 0-5) - Reinforced block with structure
 * - 300-600ms: Absorb phase (frames 6-10) - Ground impact through stance
 * - 600-1000ms: Counter phase (frames 11-17) - Explosive counter strike
 * - 1000-1200ms: Recovery phase (frames 18-20) - Return to guard
 *
 * **Performance**: Targets 60fps (16.67ms per frame)
 * **Damage Type**: Defensive counter with accumulated power
 *
 * @korean 반석방어
 * @frames 20 total (6 block, 6 absorb, 8 counter)
 * @duration 1200ms
 * @category Defense Animation
 */
export const GAN_ROCK_DEFENSE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "gan_rock_defense",
    "반석방어"
  )
    .asDefense(1.2)
    // =================================================================
    // BLOCK PHASE (0-300ms, frames 0-6)
    // =================================================================
    // Frame 0: Guard position baseline (0ms)
    .at(0)
    .rotate(BoneName.SHOULDER_L, -0.35, 0, -0.44) // -20°, 0°, -25° (guard position)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.92) // -110° (guard ready)
    .rotate(BoneName.WRIST_L, 0, 0, 0) // Neutral wrist
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0) // Neutral spine
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° (stable stance)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Frame 3: Block engagement (150ms)
    .at(0.15)
    .rotate(BoneName.SHOULDER_L, -0.35, 0.174, -0.524) // -20°, 10°, -30° (block extends)
    .rotate(BoneName.ELBOW_L, 0, 0, -2.09) // -120° (elbow structure solid)
    .rotate(BoneName.FOREARM_L, 0.174, 0, 0) // 10°, 0°, 0° (forearm absorbs)
    .rotate(BoneName.SHOULDER_R, -0.262, 0, 0.349) // -15°, 0°, 20° (supporting arm)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.74) // 100° (support structure)
    .rotate(BoneName.SPINE_UPPER, 0, -0.087, 0) // 0°, -5° (minor rotation to block)
    .done<MartialArtsAnimationBuilder>()
    // Frame 6: Maximum block (300ms)
    .at(0.3)
    .rotate(BoneName.SHOULDER_L, -0.436, 0.262, -0.558) // -25°, 15°, -32° (reinforced block)
    .rotate(BoneName.ELBOW_L, 0, 0, -2.18) // -125° (maximum elbow structure)
    .rotate(BoneName.FOREARM_L, 0.174, 0, 0) // 10° (forearm solid)
    .rotate(BoneName.SHOULDER_R, -0.262, 0, 0.349) // -15°, 0°, 20° (supporting)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.74) // 100°
    .rotate(BoneName.SPINE_UPPER, 0, -0.087, 0) // 0°, -5°
    .done<MartialArtsAnimationBuilder>()
    // =================================================================
    // ABSORB PHASE (300-600ms, frames 7-12)
    // =================================================================
    // Frame 9: Begin absorption (450ms)
    .at(0.45)
    .rotate(BoneName.SPINE_UPPER, 0, -0.14, 0) // 0°, -8° (ground the impact)
    .rotate(BoneName.PELVIS, 0, -0.105, 0) // 0°, -6° (hip absorbs)
    .rotate(BoneName.KNEE_L, -0.349, 0, 0) // -20° (lower stance absorbs)
    .rotate(BoneName.KNEE_R, -0.349, 0, 0) // -20°
    .rotate(BoneName.SHOULDER_L, -0.489, 0.14, -0.558) // -28°, 8°, -32° (maintain block)
    .rotate(BoneName.ELBOW_L, 0, 0, -2.18) // -125° (structure held)
    .position(BoneName.PELVIS, 0, -0.02, 0) // Slight drop to absorb
    .done<MartialArtsAnimationBuilder>()
    // Frame 12: Maximum absorption (600ms)
    .at(0.6)
    .rotate(BoneName.SPINE_UPPER, 0, -0.174, 0) // 0°, -10° (maximum absorption)
    .rotate(BoneName.PELVIS, 0, -0.14, 0) // 0°, -8°
    .rotate(BoneName.KNEE_L, -0.384, 0, 0) // -22° (deepest absorption)
    .rotate(BoneName.KNEE_R, -0.384, 0, 0) // -22°
    .rotate(BoneName.SHOULDER_L, -0.524, 0.174, -0.611) // -30°, 10°, -35° (block held firm)
    .rotate(BoneName.ELBOW_L, 0, 0, -2.18) // -125°
    .position(BoneName.PELVIS, 0, -0.04, 0) // Lower for absorption
    .done<MartialArtsAnimationBuilder>()
    // =================================================================
    // COUNTER PHASE (600-1000ms, frames 13-20)
    // =================================================================
    // Frame 15: Counter preparation (750ms)
    .at(0.75)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0) // 0°, 0° (returning to neutral)
    .rotate(BoneName.PELVIS, 0, 0.087, 0) // 0°, 5° (hip begins counter rotation)
    .rotate(BoneName.KNEE_L, -0.262, 0, 0) // -15° (rising from absorption)
    .rotate(BoneName.KNEE_R, -0.262, 0, 0) // -15°
    .rotate(BoneName.SHOULDER_L, -0.35, 0.087, -0.349) // -20°, 5°, -20° (guard maintained)
    .rotate(BoneName.SHOULDER_R, 0.436, 0, -0.174) // 25°, 0°, -10° (counter preparing)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.262) // 15° (arm extending for counter)
    .position(BoneName.PELVIS, 0, -0.02, 0)
    .done<MartialArtsAnimationBuilder>()
    // Frame 18: Counter strike (900ms)
    .at(0.9)
    .rotate(BoneName.SPINE_UPPER, 0, 0.174, 0) // 0°, 10° (counter rotation)
    .rotate(BoneName.PELVIS, 0, 0.262, 0) // 0°, 15° (hip drives counter)
    .rotate(BoneName.KNEE_L, -0.174, 0, 0) // -10° (rise from absorption)
    .rotate(BoneName.KNEE_R, -0.174, 0, 0) // -10°
    .rotate(BoneName.SHOULDER_R, 0.785, 0, 0) // 45°, 0°, 0° (counter strike forward)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.262) // -15° (extending)
    .rotate(BoneName.WRIST_R, 0.174, 0, 0) // 10° (strike alignment)
    .rotate(BoneName.SHOULDER_L, -0.35, 0.087, -0.349) // -20°, 5°, -20° (guard maintained)
    .position(BoneName.PELVIS, 0, 0, 0.05) // Forward shift for power
    .done<MartialArtsAnimationBuilder>()
    // Frame 20: Full counter extension (1000ms)
    .at(1.0)
    .rotate(BoneName.SPINE_UPPER, 0, 0.262, 0) // 0°, 15° (full counter rotation)
    .rotate(BoneName.PELVIS, 0, 0.314, 0) // 0°, 18° (maximum hip drive)
    .rotate(BoneName.KNEE_L, -0.262, 0, 0) // -15° (stable stance)
    .rotate(BoneName.KNEE_R, -0.262, 0, 0) // -15°
    .rotate(BoneName.SHOULDER_R, 1.047, 0, -0.087) // 60°, 0°, -5° (counter strike extended)
    .rotate(BoneName.ELBOW_R, 0, 0, 0) // 0° (fully extended)
    .rotate(BoneName.WRIST_R, 0.174, 0, 0) // 10° (impact position)
    .position(BoneName.PELVIS, 0, 0, 0.1) // Full forward drive
    .done<MartialArtsAnimationBuilder>()
    // =================================================================
    // RECOVERY PHASE (1000-1200ms, frames 21-22)
    // =================================================================
    // Frame 22: Return to guard (1200ms)
    .at(1.2)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0) // Return to neutral
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° (stable stance)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0)
    .rotate(BoneName.SHOULDER_L, -0.35, 0, -0.44) // -20°, 0°, -25° (guard restored)
    .rotate(BoneName.SHOULDER_R, -0.35, 0, 0.44) // -20°, 0°, 25°
    .rotate(BoneName.ELBOW_L, 0, 0, -1.92) // -110°
    .rotate(BoneName.ELBOW_R, 0, 0, 1.92) // 110°
    .rotate(BoneName.WRIST_L, 0, 0, 0)
    .rotate(BoneName.WRIST_R, 0, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☶ GAN DEFENSIVE REVERSAL ANIMATION (방어 역습)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gan Defensive Reversal Animation
 *
 * **Korean**: 바위 역습 (Bawi Yeokseup) - Rock Reversal
 * **Technique**: Block opponent's attack, control limb, reverse position with power
 *
 * Characteristics:
 * - Block opponent's attack solidly
 * - Control opponent's limb with lock
 * - Reverse position with power
 * - Maintain immovable foundation throughout
 *
 * Animation Phases:
 * - 0-300ms: Block phase (frames 0-5) - Solid defensive block
 * - 300-700ms: Control phase (frames 6-13) - Limb control and lock
 * - 700-1100ms: Reversal phase (frames 14-21) - Power reversal
 * - 1100-1333ms: Recovery phase (frames 22-24) - Return to guard
 *
 * **Performance**: Targets 60fps (16.67ms per frame)
 * **Damage Type**: Joint manipulation and positional reversal
 *
 * @korean 바위역습
 * @frames 24 total (6 block, 8 control, 10 reversal)
 * @duration 1333ms
 * @category Defense Animation
 */
export const GAN_DEFENSIVE_REVERSAL: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "gan_defensive_reversal",
    "바위 역습"
  )
    .asDefense(1.333)
    // =================================================================
    // BLOCK PHASE (0-300ms, frames 0-6)
    // =================================================================
    // Frame 0: Guard baseline (0ms)
    .at(0)
    .rotate(BoneName.SHOULDER_L, -0.35, 0, -0.44) // -20°, 0°, -25° (guard)
    .rotate(BoneName.SHOULDER_R, -0.35, 0, 0.44) // -20°, 0°, 25°
    .rotate(BoneName.ELBOW_L, 0, 0, -1.92) // -110° (guard ready)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.92) // 110°
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° (stable)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Frame 3: Block engagement (150ms)
    .at(0.15)
    .rotate(BoneName.SHOULDER_L, -0.35, 0.262, -0.524) // -20°, 15°, -30° (block extends)
    .rotate(BoneName.ELBOW_L, 0, 0, -2.09) // -120° (solid structure)
    .rotate(BoneName.SHOULDER_R, -0.262, 0, 0.349) // -15°, 0°, 20° (supporting)
    .rotate(BoneName.SPINE_UPPER, 0, -0.087, 0) // 0°, -5° (rotation into block)
    .done<MartialArtsAnimationBuilder>()
    // Frame 6: Block solid (300ms)
    .at(0.3)
    .rotate(BoneName.SHOULDER_L, -0.436, 0.349, -0.558) // -25°, 20°, -32° (reinforced)
    .rotate(BoneName.ELBOW_L, 0, 0, -2.18) // -125° (maximum structure)
    .rotate(BoneName.FOREARM_L, 0.174, 0, 0) // 10° (absorbing)
    .rotate(BoneName.SPINE_UPPER, 0, -0.14, 0) // 0°, -8°
    .done<MartialArtsAnimationBuilder>()
    // =================================================================
    // CONTROL PHASE (300-700ms, frames 7-14)
    // =================================================================
    // Frame 9: Begin limb control (450ms)
    .at(0.45)
    .rotate(BoneName.SHOULDER_L, -0.349, 0.436, -0.436) // -20°, 25°, -25° (rotating to control)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.92) // -110° (bending to grasp)
    .rotate(BoneName.WRIST_L, 0.174, 0.262, 0) // 10°, 15°, 0° (wrist control)
    .rotate(BoneName.SHOULDER_R, -0.262, 0.262, 0.524) // -15°, 15°, 30° (assisting control)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.57) // 90° (reaching to assist)
    .rotate(BoneName.SPINE_UPPER, 0, -0.174, 0) // 0°, -10° (twisting for control)
    .done<MartialArtsAnimationBuilder>()
    // Frame 11: Limb captured (550ms)
    .at(0.55)
    .rotate(BoneName.SHOULDER_L, -0.262, 0.524, -0.349) // -15°, 30°, -20° (control grip)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.74) // -100° (locked position)
    .rotate(BoneName.WRIST_L, 0.262, 0.349, 0) // 15°, 20°, 0° (firm control)
    .rotate(BoneName.SHOULDER_R, -0.174, 0.349, 0.611) // -10°, 20°, 35° (both hands control)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.4) // 80° (assisting grip)
    .rotate(BoneName.WRIST_R, 0.174, 0.262, 0) // 10°, 15°, 0°
    .rotate(BoneName.SPINE_UPPER, 0, -0.262, 0) // 0°, -15° (torque on limb)
    .done<MartialArtsAnimationBuilder>()
    // Frame 14: Maximum control (700ms)
    .at(0.7)
    .rotate(BoneName.SHOULDER_L, -0.174, 0.611, -0.262) // -10°, 35°, -15° (peak control)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.57) // -90° (locked)
    .rotate(BoneName.WRIST_L, 0.349, 0.436, 0) // 20°, 25°, 0° (maximum pressure)
    .rotate(BoneName.SHOULDER_R, -0.087, 0.436, 0.698) // -5°, 25°, 40° (both hands)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.22) // 70° (tight grip)
    .rotate(BoneName.WRIST_R, 0.262, 0.349, 0) // 15°, 20°, 0°
    .rotate(BoneName.SPINE_UPPER, 0, -0.349, 0) // 0°, -20° (maximum torque)
    .rotate(BoneName.PELVIS, 0, -0.174, 0) // 0°, -10° (hip into control)
    .done<MartialArtsAnimationBuilder>()
    // =================================================================
    // REVERSAL PHASE (700-1100ms, frames 15-22)
    // =================================================================
    // Frame 17: Begin reversal (850ms)
    .at(0.85)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0) // 0°, 0° (unwinding)
    .rotate(BoneName.PELVIS, 0, 0.174, 0) // 0°, 10° (reversing rotation)
    .rotate(BoneName.SHOULDER_L, -0.087, 0.349, -0.174) // -5°, 20°, -10° (pulling)
    .rotate(BoneName.SHOULDER_R, 0.174, 0.174, 0.349) // 10°, 10°, 20° (pushing)
    .rotate(BoneName.KNEE_L, -0.35, 0, 0) // -20° (dropping for power)
    .rotate(BoneName.KNEE_R, -0.35, 0, 0)
    .position(BoneName.PELVIS, 0, -0.03, 0) // Lowering for reversal power
    .done<MartialArtsAnimationBuilder>()
    // Frame 19: Mid-reversal (950ms)
    .at(0.95)
    .rotate(BoneName.SPINE_UPPER, 0, 0.262, 0) // 0°, 15° (reversing direction)
    .rotate(BoneName.PELVIS, 0, 0.349, 0) // 0°, 20° (hip drives reversal)
    .rotate(BoneName.SHOULDER_L, 0, 0, -0.087) // 0°, 0°, -5° (releasing control)
    .rotate(BoneName.SHOULDER_R, 0.611, 0, 0.174) // 35°, 0°, 10° (pushing through)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.524) // 30° (extending for push)
    .rotate(BoneName.KNEE_L, -0.262, 0, 0) // -15° (rising)
    .rotate(BoneName.KNEE_R, -0.262, 0, 0)
    .position(BoneName.PELVIS, 0, -0.01, 0.05) // Forward and up
    .done<MartialArtsAnimationBuilder>()
    // Frame 22: Full reversal (1100ms)
    .at(1.1)
    .rotate(BoneName.SPINE_UPPER, 0, 0.436, 0) // 0°, 25° (full reversal rotation)
    .rotate(BoneName.PELVIS, 0, 0.524, 0) // 0°, 30° (maximum hip drive)
    .rotate(BoneName.SHOULDER_L, 0.174, -0.174, 0) // 10°, -10°, 0° (cleared)
    .rotate(BoneName.SHOULDER_R, 0.873, 0, 0) // 50°, 0°, 0° (full push extension)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.174) // 10° (extended)
    .rotate(BoneName.WRIST_R, 0.174, 0, 0) // 10° (push position)
    .rotate(BoneName.KNEE_L, -0.174, 0, 0) // -10° (stable)
    .rotate(BoneName.KNEE_R, -0.174, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0.15) // Maximum forward reversal
    .done<MartialArtsAnimationBuilder>()
    // =================================================================
    // RECOVERY PHASE (1100-1333ms, frames 23-24)
    // =================================================================
    // Frame 24: Return to guard (1333ms)
    .at(1.333)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0) // Return to neutral
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .rotate(BoneName.SHOULDER_L, -0.35, 0, -0.44) // -20°, 0°, -25° (guard restored)
    .rotate(BoneName.SHOULDER_R, -0.35, 0, 0.44) // -20°, 0°, 25°
    .rotate(BoneName.ELBOW_L, 0, 0, -1.92) // -110°
    .rotate(BoneName.ELBOW_R, 0, 0, 1.92) // 110°
    .rotate(BoneName.WRIST_L, 0, 0, 0)
    .rotate(BoneName.WRIST_R, 0, 0, 0)
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° (stable stance)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map of all Gan technique combat animations for easy access
 * @korean 간괘기술애니메이션맵
 */
export const GAN_TECHNIQUE_ANIMATIONS: ReadonlyMap<string, SkeletalAnimation> = new Map([
  // Combat Techniques
  ["gan_rock_defense", GAN_ROCK_DEFENSE_ANIMATION],
  ["gan_defensive_reversal", GAN_DEFENSIVE_REVERSAL],
]);
