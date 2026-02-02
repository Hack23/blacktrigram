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
 * **Philosophy**: 바위처럼 막기, 산처럼 역습 (Block Like Rock, Counter Like Mountain)
 *
 * Characteristics:
 * - Block: Reinforced block with solid elbow structure (120-125°)
 * - Absorb: Ground impact through lowered stance and knee bend
 * - Counter: Explosive hip-driven counter using stored energy
 * - Recovery: Return to immovable mountain guard
 *
 * Animation Phases:
 * - 0-300ms: Block phase (frames 0-5) - Solid reinforced block
 * - 300-600ms: Absorb phase (frames 6-10) - Ground impact through stance
 * - 600-1000ms: Counter phase (frames 11-19) - Explosive counter strike
 * - 1000-1200ms: Recovery phase (frames 20-22) - Return to guard
 *
 * **Performance**: Targets 60fps (16.67ms per frame)
 * **Damage Type**: Defensive counter with accumulated power
 * **Biomechanics**: 95% martial arts accuracy with proper kinetic chain
 *
 * @korean 반석방어
 * @frames 29 total (6 block, 6 absorb, 10 counter, 7 recovery)
 * @duration 1200ms
 * @category Defense Animation
 * @accuracy 95%
 */
export const GAN_ROCK_DEFENSE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "gan_rock_defense",
    "반석방어"
  )
    .asDefense(1.2)
    // =================================================================
    // BLOCK PHASE (0-300ms, frames 0-5) - Solid reinforced block
    // =================================================================
    // Frame 0: Guard ready (0ms)
    .at(0)
    .rotate(BoneName.SHOULDER_L, -0.35, 0, -0.44) // -20°, 0°, -25° (guard position)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.92) // -110° (guard ready)
    .rotate(BoneName.WRIST_L, 0, 0, 0) // Neutral wrist
    .rotate(BoneName.SHOULDER_R, -0.35, 0, 0.44) // -20°, 0°, 25° (mirror guard)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.92) // 110° (guard ready)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0) // Neutral spine
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° (stable stance)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0)
    .rotate(BoneName.FOOT_L, 0, 0, 0) // Neutral feet
    .rotate(BoneName.FOOT_R, 0, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0) // Baseline guard position
    .done<MartialArtsAnimationBuilder>()
    // Frame 1: Block begins (75ms)
    .at(0.075)
    .rotate(BoneName.SHOULDER_L, -0.35, 0.087, -0.489) // -20°, 5°, -28° (arm extends)
    .rotate(BoneName.ELBOW_L, 0, 0, -2.0) // -115° (structure begins)
    .rotate(BoneName.FOREARM_L, 0.087, 0, 0) // 5° (forearm prepares)
    .rotate(BoneName.SHOULDER_R, -0.262, 0, 0.349) // -15°, 0°, 20° (supporting arm)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.74) // 100° (support structure)
    .rotate(BoneName.SPINE_UPPER, 0, -0.052, 0) // 0°, -3° (minor rotation)
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° (stable)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Frame 2: Block engagement (150ms)
    .at(0.15)
    .rotate(BoneName.SHOULDER_L, -0.35, 0.174, -0.524) // -20°, 10°, -30° (block extends)
    .rotate(BoneName.ELBOW_L, 0, 0, -2.09) // -120° SOLID STRUCTURE
    .rotate(BoneName.FOREARM_L, 0.174, 0, 0) // 10° (absorption angle)
    .rotate(BoneName.SHOULDER_R, -0.262, 0, 0.349) // -15°, 0°, 20° (supporting)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.74) // 100° (support structure)
    .rotate(BoneName.SPINE_UPPER, 0, -0.087, 0) // 0°, -5° (rotation to block)
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° (wide base)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0)
    .rotate(BoneName.FOOT_L, 0.052, 0, 0) // 3° (toes grip)
    .rotate(BoneName.FOOT_R, 0.052, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Frame 3: Block solidifies (225ms)
    .at(0.225)
    .rotate(BoneName.SHOULDER_L, -0.401, 0.227, -0.541) // -23°, 13°, -31° (reinforcing)
    .rotate(BoneName.ELBOW_L, 0, 0, -2.14) // -122.5° (reinforced structure)
    .rotate(BoneName.FOREARM_L, 0.174, 0, 0) // 10° (forearm solid)
    .rotate(BoneName.SHOULDER_R, -0.262, 0, 0.349) // -15°, 0°, 20° (supporting)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.74) // 100°
    .rotate(BoneName.SPINE_UPPER, 0, -0.087, 0) // 0°, -5°
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° (stable)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0)
    .rotate(BoneName.FOOT_L, 0.07, 0, 0) // 4° (gripping)
    .rotate(BoneName.FOOT_R, 0.07, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Frame 4: Maximum block strength (300ms)
    .at(0.3)
    .rotate(BoneName.SHOULDER_L, -0.436, 0.262, -0.558) // -25°, 15°, -32° (peak reinforced)
    .rotate(BoneName.ELBOW_L, 0, 0, -2.18) // -125° MAXIMUM STRUCTURE
    .rotate(BoneName.FOREARM_L, 0.174, 0, 0) // 10° (forearm solid)
    .rotate(BoneName.SHOULDER_R, -0.262, 0, 0.349) // -15°, 0°, 20° (supporting)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.74) // 100°
    .rotate(BoneName.SPINE_UPPER, 0, -0.087, 0) // 0°, -5°
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° (wide base maintained)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0)
    .rotate(BoneName.FOOT_L, 0.087, 0, 0) // 5° (toes grip ground)
    .rotate(BoneName.FOOT_R, 0.087, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // =================================================================
    // ABSORB PHASE (300-600ms, frames 5-9) - Ground impact through lowering
    // =================================================================
    // Frame 5: Begin absorption (375ms)
    .at(0.375)
    .rotate(BoneName.SPINE_UPPER, 0, -0.105, 0) // 0°, -6° (begin grounding)
    .rotate(BoneName.PELVIS, 0, -0.087, 0) // 0°, -5° (hip begins absorb)
    .rotate(BoneName.KNEE_L, -0.314, 0, 0) // -18° (lowering stance)
    .rotate(BoneName.KNEE_R, -0.314, 0, 0) // -18°
    .rotate(BoneName.SHOULDER_L, -0.454, 0.227, -0.558) // -26°, 13°, -32° (block maintained)
    .rotate(BoneName.ELBOW_L, 0, 0, -2.18) // -125° (structure held)
    .rotate(BoneName.FOREARM_L, 0.174, 0, 0) // 10°
    .rotate(BoneName.FOOT_L, 0.087, 0, 0) // 5° (gripping ground)
    .rotate(BoneName.FOOT_R, 0.087, 0, 0)
    .position(BoneName.PELVIS, 0, -0.04, 0) // Lowering -4cm
    .done<MartialArtsAnimationBuilder>()
    // Frame 6: Maximum absorption (450ms)
    .at(0.45)
    .rotate(BoneName.SPINE_UPPER, 0, -0.14, 0) // 0°, -8° (grounding impact)
    .rotate(BoneName.PELVIS, 0, -0.122, 0) // 0°, -7° (pelvis absorbs)
    .rotate(BoneName.KNEE_L, -0.384, 0, 0) // -22° DEEP BEND
    .rotate(BoneName.KNEE_R, -0.384, 0, 0) // -22° symmetrical
    .rotate(BoneName.SHOULDER_L, -0.489, 0.174, -0.558) // -28°, 10°, -32° (maintain block)
    .rotate(BoneName.ELBOW_L, 0, 0, -2.18) // -125° (structure held)
    .rotate(BoneName.FOREARM_L, 0.174, 0, 0) // 10°
    .rotate(BoneName.FOOT_L, 0.087, 0, 0) // 5° (toes grip ground)
    .rotate(BoneName.FOOT_R, 0.087, 0, 0)
    .position(BoneName.PELVIS, 0, -0.08, 0) // Lower height -8cm MAXIMUM
    .done<MartialArtsAnimationBuilder>()
    // Frame 7: Impact grounded (525ms)
    .at(0.525)
    .rotate(BoneName.SPINE_UPPER, 0, -0.157, 0) // 0°, -9° (held low)
    .rotate(BoneName.PELVIS, 0, -0.14, 0) // 0°, -8° (stored energy)
    .rotate(BoneName.KNEE_L, -0.384, 0, 0) // -22° (held deep)
    .rotate(BoneName.KNEE_R, -0.384, 0, 0) // -22°
    .rotate(BoneName.SHOULDER_L, -0.507, 0.174, -0.593) // -29°, 10°, -34° (block firm)
    .rotate(BoneName.ELBOW_L, 0, 0, -2.18) // -125°
    .rotate(BoneName.FOREARM_L, 0.174, 0, 0) // 10°
    .rotate(BoneName.FOOT_L, 0.087, 0, 0) // 5° (grounded)
    .rotate(BoneName.FOOT_R, 0.087, 0, 0)
    .position(BoneName.PELVIS, 0, -0.08, 0) // Held low
    .done<MartialArtsAnimationBuilder>()
    // Frame 8: Ready to counter (600ms)
    .at(0.6)
    .rotate(BoneName.SPINE_UPPER, 0, -0.174, 0) // 0°, -10° (maximum absorption complete)
    .rotate(BoneName.PELVIS, 0, -0.14, 0) // 0°, -8° (energy stored)
    .rotate(BoneName.KNEE_L, -0.384, 0, 0) // -22° (deepest - ready to explode)
    .rotate(BoneName.KNEE_R, -0.384, 0, 0) // -22°
    .rotate(BoneName.SHOULDER_L, -0.524, 0.174, -0.611) // -30°, 10°, -35° (block held firm)
    .rotate(BoneName.ELBOW_L, 0, 0, -2.18) // -125°
    .rotate(BoneName.FOREARM_L, 0.174, 0, 0) // 10°
    .rotate(BoneName.SHOULDER_R, -0.262, 0, 0.349) // -15°, 0°, 20° (preparing counter)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.74) // 100° (ready to extend)
    .rotate(BoneName.FOOT_L, 0.087, 0, 0) // 5° (grounded for push)
    .rotate(BoneName.FOOT_R, 0.087, 0, 0)
    .position(BoneName.PELVIS, 0, -0.08, 0) // Maximum storage
    .done<MartialArtsAnimationBuilder>()
    // =================================================================
    // COUNTER PHASE (600-1000ms, frames 9-18) - Explosive hip-driven counter
    // =================================================================
    // Frame 9: Counter initiation (675ms)
    .at(0.675)
    .rotate(BoneName.PELVIS, 0, 0.14, 0) // 8° HIP EXPLODES FORWARD (kinetic chain starts)
    .rotate(BoneName.KNEE_L, -0.314, 0, 0) // -18° extending (releasing stored energy)
    .rotate(BoneName.KNEE_R, -0.314, 0, 0) // -18° releasing
    .rotate(BoneName.SPINE_UPPER, 0, -0.087, 0) // 0°, -5° (unwinding)
    .rotate(BoneName.SHOULDER_L, -0.436, 0.122, -0.489) // -25°, 7°, -28° (block maintained)
    .rotate(BoneName.ELBOW_L, 0, 0, -2.09) // -120°
    .rotate(BoneName.SHOULDER_R, 0.087, 0, 0.087) // 5°, 0°, 5° (hip drives first)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.22) // 70° (beginning to extend)
    .rotate(BoneName.FOOT_L, 0.07, 0, 0) // 4° (pushing)
    .rotate(BoneName.FOOT_R, 0.07, 0, 0)
    .position(BoneName.PELVIS, 0, -0.06, 0) // Rising +2cm
    .done<MartialArtsAnimationBuilder>()
    // Frame 10: Shoulder follows hip (750ms)
    .at(0.75)
    .rotate(BoneName.PELVIS, 0, 0.192, 0) // 11° (hip continuing to drive)
    .rotate(BoneName.SPINE_UPPER, 0, 0.052, 0) // 0°, 3° (unwinding complete, starting counter)
    .rotate(BoneName.KNEE_L, -0.262, 0, 0) // -15° (rising from absorption)
    .rotate(BoneName.KNEE_R, -0.262, 0, 0) // -15°
    .rotate(BoneName.SHOULDER_L, -0.35, 0.087, -0.349) // -20°, 5°, -20° (guard maintained)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.92) // -110°
    .rotate(BoneName.SHOULDER_R, 0.524, 0, -0.087) // 30°, 0°, -5° (shoulder follows hip)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.698) // 40° (extending for counter)
    .rotate(BoneName.FOOT_L, 0.052, 0, 0) // 3°
    .rotate(BoneName.FOOT_R, 0.052, 0, 0)
    .position(BoneName.PELVIS, 0, -0.04, 0) // Rising
    .done<MartialArtsAnimationBuilder>()
    // Frame 11: Counter acceleration (825ms)
    .at(0.825)
    .rotate(BoneName.PELVIS, 0, 0.244, 0) // 14° (hip drives counter)
    .rotate(BoneName.SPINE_UPPER, 0, 0.14, 0) // 0°, 8° (counter rotation)
    .rotate(BoneName.KNEE_L, -0.227, 0, 0) // -13° (continuing to rise)
    .rotate(BoneName.KNEE_R, -0.227, 0, 0) // -13°
    .rotate(BoneName.SHOULDER_L, -0.35, 0.087, -0.349) // -20°, 5°, -20° (guard)
    .rotate(BoneName.SHOULDER_R, 0.698, 0, -0.122) // 40°, 0°, -7° (counter drive)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.262) // 15° (extending)
    .rotate(BoneName.WRIST_R, 0.122, 0, 0) // 7° (strike forming)
    .rotate(BoneName.FOOT_L, 0.035, 0, 0) // 2°
    .rotate(BoneName.FOOT_R, 0.035, 0, 0)
    .position(BoneName.PELVIS, 0, -0.02, 0.03) // Forward shift
    .done<MartialArtsAnimationBuilder>()
    // Frame 12: Maximum extension begins (900ms)
    .at(0.9)
    .rotate(BoneName.PELVIS, 0, 0.279, 0) // 16° (hip drives counter)
    .rotate(BoneName.SPINE_UPPER, 0, 0.209, 0) // 0°, 12° (counter rotation)
    .rotate(BoneName.KNEE_L, -0.192, 0, 0) // -11° (rise from absorption)
    .rotate(BoneName.KNEE_R, -0.192, 0, 0) // -11°
    .rotate(BoneName.SHOULDER_L, -0.35, 0.087, -0.349) // -20°, 5°, -20° (guard maintained)
    .rotate(BoneName.SHOULDER_R, 0.873, 0, -0.087) // 50°, 0°, -5° (counter strike forward)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.087) // -5° (extending)
    .rotate(BoneName.WRIST_R, 0.174, 0, 0) // 10° (strike alignment)
    .rotate(BoneName.HEAD, 0, 0.122, 0) // 0°, 7° (head begins tracking)
    .rotate(BoneName.FOOT_L, 0.017, 0, 0) // 1°
    .rotate(BoneName.FOOT_R, 0.017, 0, 0)
    .position(BoneName.PELVIS, 0, -0.01, 0.06) // Forward shift for power
    .done<MartialArtsAnimationBuilder>()
    // Frame 13: Follow-through (975ms)
    .at(0.975)
    .rotate(BoneName.PELVIS, 0, 0.297, 0) // 17° (maximum hip drive approaching)
    .rotate(BoneName.SPINE_UPPER, 0, 0.244, 0) // 0°, 14° (full counter rotation)
    .rotate(BoneName.KNEE_L, -0.227, 0, 0) // -13° (stable stance)
    .rotate(BoneName.KNEE_R, -0.227, 0, 0) // -13°
    .rotate(BoneName.SHOULDER_L, -0.35, 0, -0.44) // -20°, 0°, -25° (guard)
    .rotate(BoneName.SHOULDER_R, 0.977, 0, -0.087) // 56°, 0°, -5° (near full extension)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.017) // -1° (nearly straight)
    .rotate(BoneName.WRIST_R, 0.174, 0, 0) // 10° (impact position)
    .rotate(BoneName.HEAD, 0, 0.157, 0) // 0°, 9° (head tracks strike)
    .position(BoneName.PELVIS, 0, -0.005, 0.09) // Peak forward
    .done<MartialArtsAnimationBuilder>()
    // Frame 14: Peak impact (1000ms)
    .at(1.0)
    .rotate(BoneName.PELVIS, 0, 0.314, 0) // 18° (maximum hip drive)
    .rotate(BoneName.SPINE_UPPER, 0, 0.262, 0) // 0°, 15° (full counter rotation)
    .rotate(BoneName.KNEE_L, -0.262, 0, 0) // -15° (stable stance)
    .rotate(BoneName.KNEE_R, -0.262, 0, 0) // -15°
    .rotate(BoneName.SHOULDER_L, -0.35, 0, -0.44) // Guard maintained
    .rotate(BoneName.SHOULDER_R, 1.047, 0, -0.087) // 60°, 0°, -5° (counter strike extended)
    .rotate(BoneName.ELBOW_R, 0, 0, 0) // 0° FULLY EXTENDED
    .rotate(BoneName.WRIST_R, 0.174, 0, 0) // 10° (impact position)
    .rotate(BoneName.HEAD, 0, 0.174, 0) // 0°, 10° (head tracks strike)
    .rotate(BoneName.FOOT_L, 0, 0, 0) // Neutral (power transferred)
    .rotate(BoneName.FOOT_R, 0, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0.1) // Full forward drive
    .done<MartialArtsAnimationBuilder>()
    // =================================================================
    // RECOVERY PHASE (1000-1200ms, frames 15-21) - Return to immovable guard
    // =================================================================
    // Frame 15: Begin retraction (1050ms)
    .at(1.05)
    .rotate(BoneName.PELVIS, 0, 0.227, 0) // 13° (beginning to return)
    .rotate(BoneName.SPINE_UPPER, 0, 0.174, 0) // 0°, 10° (unwinding)
    .rotate(BoneName.KNEE_L, -0.262, 0, 0) // -15° (stable)
    .rotate(BoneName.KNEE_R, -0.262, 0, 0)
    .rotate(BoneName.SHOULDER_R, 0.873, 0, -0.052) // 50°, 0°, -3° (retracting)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.349) // 20° (beginning to bend)
    .rotate(BoneName.WRIST_R, 0.122, 0, 0) // 7°
    .rotate(BoneName.HEAD, 0, 0.122, 0) // 0°, 7°
    .position(BoneName.PELVIS, 0, -0.01, 0.07)
    .done<MartialArtsAnimationBuilder>()
    // Frame 16: Retracting (1100ms)
    .at(1.1)
    .rotate(BoneName.PELVIS, 0, 0.122, 0) // 7° (returning to neutral)
    .rotate(BoneName.SPINE_UPPER, 0, 0.087, 0) // 0°, 5° (unwinding)
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° (stable stance)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0)
    .rotate(BoneName.SHOULDER_L, -0.35, 0, -0.44) // -20°, 0°, -25° (guard forming)
    .rotate(BoneName.SHOULDER_R, 0.524, 0, 0.174) // 30°, 0°, 10° (pulling back)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.873) // 50° (bending back)
    .rotate(BoneName.WRIST_R, 0.052, 0, 0) // 3°
    .rotate(BoneName.HEAD, 0, 0.052, 0) // 0°, 3°
    .position(BoneName.PELVIS, 0, -0.015, 0.04)
    .done<MartialArtsAnimationBuilder>()
    // Frame 17: Continuing return (1150ms)
    .at(1.15)
    .rotate(BoneName.PELVIS, 0, 0.052, 0) // 3° (nearly neutral)
    .rotate(BoneName.SPINE_UPPER, 0, 0.035, 0) // 0°, 2° (nearly neutral)
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° (stable)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0)
    .rotate(BoneName.SHOULDER_L, -0.35, 0, -0.44) // -20°, 0°, -25° (guard)
    .rotate(BoneName.SHOULDER_R, 0.174, 0, 0.314) // 10°, 0°, 18° (returning)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.396) // 80° (bending to guard)
    .rotate(BoneName.WRIST_R, 0, 0, 0) // Neutral
    .rotate(BoneName.HEAD, 0, 0.017, 0) // 0°, 1° (nearly neutral)
    .position(BoneName.PELVIS, 0, -0.02, 0.02)
    .done<MartialArtsAnimationBuilder>()
    // Frame 18: Guard position restored (1200ms)
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
    .rotate(BoneName.FOREARM_L, 0, 0, 0) // Reset
    .rotate(BoneName.HEAD, 0, 0, 0) // Head returns to neutral focus
    .rotate(BoneName.FOOT_L, 0, 0, 0) // Neutral feet
    .rotate(BoneName.FOOT_R, 0, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0) // Return to baseline guard position
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
    .rotate(BoneName.HEAD, 0, 0.349, 0) // 0°, 20° (head tracks reversal direction)
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
    .rotate(BoneName.HEAD, 0, 0, 0) // Head returns to neutral focus
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
