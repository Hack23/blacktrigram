import { BoneName } from "@/types/skeletal";
import type { SkeletalAnimation } from "@/types/skeletal";
import { MartialArtsAnimationBuilder } from "../builders/MartialArtsAnimationBuilder";

// ═══════════════════════════════════════════════════════════════════════════
// TAE TRIGRAM (☱ 태) - LAKE: JOINT MANIPULATION (관절기)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * TAE WRIST LOCK SEQUENCE - Enhanced 유수연타 (Flowing Water Strike)
 *
 * Detailed 28-frame animation (1800ms total):
 * - Setup phase (0-500ms, 8 frames): Hand reaches for opponent's wrist
 * - Control phase (500-1300ms, 12 frames): Apply circular pressure with small-circle technique
 * - Finish phase (1300-1800ms, 8 frames): Opponent's arm twisted, balance broken
 *
 * Hapkido biomechanics:
 * - Small circular wrist motion generates high torque
 * - Hip rotation powers the lock
 * - Opponent's wrist hyperextends to 35° past neutral (0.61 rad)
 * - Elbow rises in arc for leverage
 *
 * Target vital points: Wrist joint, elbow joint, shoulder joint
 *
 * @korean 유수연타
 * @duration 1800ms (1.8 seconds)
 * @frames 28 frames at 60fps
 * @category Attack Animation
 */
export const TAE_WRIST_LOCK_SEQUENCE: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("tae_wrist_lock_sequence", "유수연타")
    .asAttack(1.8)
    // =================================================================
    // SETUP PHASE (0-500ms, frames 0-8)
    // =================================================================
    // Frame 0: Neutral Tae guard (0ms)
    .at(0)
    .rotate(BoneName.SHOULDER_R, -0.52, 0.17, -0.26) // -30°, 10°, -15° mid-level guard
    .rotate(BoneName.ELBOW_R, 0, 0, 1.4) // 80° flexed guard
    .rotate(BoneName.WRIST_R, 0, 0, 0) // Neutral
    .rotate(BoneName.SHOULDER_L, -0.52, -0.17, 0.26) // -30°, -10°, 15°
    .rotate(BoneName.ELBOW_L, 0, 0, -1.4) // -80° flexed
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Frame 3: Hand reaching out (180ms)
    .at(0.18)
    .rotate(BoneName.SHOULDER_R, -0.35, 0.26, -0.17) // -20°, 15°, -10° reaching forward
    .rotate(BoneName.ELBOW_R, 0, 0, 0.87) // 50° extending
    .rotate(BoneName.WRIST_R, 0.09, 0, -0.17) // 5°, 0°, -10° hand open and reaching
    .rotate(BoneName.SPINE_UPPER, 0, -0.09, 0) // 0°, -5° slight torso turn
    .position(BoneName.PELVIS, 0, 0, 0.05) // Slight forward shift
    .done<MartialArtsAnimationBuilder>()
    // Frame 8: Initial contact with wrist (500ms)
    .at(0.5)
    .rotate(BoneName.SHOULDER_R, -0.26, 0.35, -0.09) // -15°, 20°, -5° making contact
    .rotate(BoneName.ELBOW_R, 0, 0, 0.52) // 30° slightly bent for control
    .rotate(BoneName.WRIST_R, 0.17, 0, -0.26) // 10°, 0°, -15° grasping position
    .rotate(BoneName.SPINE_UPPER, 0, -0.17, 0) // 0°, -10° preparing for rotation
    .rotate(BoneName.PELVIS, 0, -0.09, 0) // 0°, -5° hip engagement begins
    .position(BoneName.PELVIS, 0, 0, 0.08) // Forward engagement
    .done<MartialArtsAnimationBuilder>()
    // =================================================================
    // CONTROL PHASE (500-1300ms, frames 9-20) - Small circle technique
    // =================================================================
    // Frame 11: Begin circular rotation (680ms)
    .at(0.68)
    .rotate(BoneName.SHOULDER_R, -0.17, 0.44, 0) // -10°, 25°, 0° shoulder rises for leverage
    .rotate(BoneName.ELBOW_R, 0, 0, 0.7) // 40° elbow begins upward arc
    .rotate(BoneName.WRIST_R, 0.26, 0.17, -0.35) // 15°, 10°, -20° wrist rotates clockwise (small circle)
    .rotate(BoneName.SPINE_UPPER, 0, 0.09, 0) // 0°, 5° torso begins counter-rotation
    .rotate(BoneName.PELVIS, 0, 0.09, 0) // 0°, 5° hip drives power
    .rotate(BoneName.KNEE_R, -0.17, 0, 0) // -10° rear leg begins push
    .position(BoneName.PELVIS, 0, 0, 0.12) // Forward pressure maintained
    .done<MartialArtsAnimationBuilder>()
    // Frame 15: Peak of circular motion (1000ms)
    .at(1.0)
    .rotate(BoneName.SHOULDER_R, -0.09, 0.52, 0.17) // -5°, 30°, 10° maximum shoulder elevation
    .rotate(BoneName.ELBOW_R, 0, 0, 1.05) // 60° elbow at peak of arc
    .rotate(BoneName.WRIST_R, 0.35, 0.26, -0.44) // 20°, 15°, -25° maximum rotation (small circle peak)
    .rotate(BoneName.SPINE_UPPER, 0, 0.26, 0) // 0°, 15° torso fully rotated
    .rotate(BoneName.PELVIS, 0, 0.26, 0) // 0°, 15° hip power transfer
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15° rear leg driving
    .position(BoneName.PELVIS, 0, -0.02, 0.15) // Slight body drop for pressure
    .done<MartialArtsAnimationBuilder>()
    // Frame 20: Completing circle, opponent's balance broken (1300ms)
    .at(1.3)
    .rotate(BoneName.SHOULDER_R, 0.09, 0.61, 0.26) // 5°, 35°, 15° shoulder continues arc
    .rotate(BoneName.ELBOW_R, 0, 0, 1.22) // 70° elbow completing circle
    .rotate(BoneName.WRIST_R, 0.44, 0.35, -0.52) // 25°, 20°, -30° wrist hyperextension begins
    .rotate(BoneName.SPINE_UPPER, 0, 0.35, 0) // 0°, 20° torso rotation increases
    .rotate(BoneName.PELVIS, 0, 0.35, 0) // 0°, 20° hip fully engaged
    .rotate(BoneName.KNEE_R, -0.35, 0, 0) // -20° rear leg max push
    .position(BoneName.PELVIS, 0, -0.05, 0.18) // Body drops further for lock
    .done<MartialArtsAnimationBuilder>()
    // =================================================================
    // FINISH PHASE (1300-1800ms, frames 21-28) - Lock completion
    // =================================================================
    // Frame 24: Maximum lock applied (1550ms)
    .at(1.55)
    .rotate(BoneName.SHOULDER_R, 0.26, 0.7, 0.35) // 15°, 40°, 20° shoulder locked high
    .rotate(BoneName.ELBOW_R, 0, 0, 1.4) // 80° elbow locked at height
    .rotate(BoneName.WRIST_R, 0.61, 0.44, -0.61) // 35°, 25°, -35° maximum wrist hyperextension (lock!)
    .rotate(BoneName.SPINE_UPPER, 0, 0.44, 0) // 0°, 25° full torso rotation
    .rotate(BoneName.PELVIS, 0, 0.44, 0) // 0°, 25° hip power maximized
    .rotate(BoneName.KNEE_R, -0.44, 0, 0) // -25° full leg drive
    .rotate(BoneName.KNEE_L, -0.35, 0, 0) // -20° forward leg stable
    .position(BoneName.PELVIS, 0, -0.08, 0.2) // Maximum body drop and pressure
    .done<MartialArtsAnimationBuilder>()
    // Frame 28: Control maintained (1800ms)
    .at(1.8)
    .rotate(BoneName.SHOULDER_R, 0.17, 0.61, 0.26) // 10°, 35°, 15° holding lock
    .rotate(BoneName.ELBOW_R, 0, 0, 1.22) // 70° control position
    .rotate(BoneName.WRIST_R, 0.52, 0.35, -0.52) // 30°, 20°, -30° maintaining hyperextension
    .rotate(BoneName.SPINE_UPPER, 0, 0.35, 0) // 0°, 20° stable control
    .rotate(BoneName.PELVIS, 0, 0.35, 0) // 0°, 20° stable
    .position(BoneName.PELVIS, 0, -0.05, 0.18) // Control position
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * TAE ELBOW CONTROL - 팔꿈치 제어 (Elbow Control)
 *
 * Detailed 26-frame animation (1650ms total):
 * - Capture phase (0-390ms, 6 frames): Seize opponent's extended arm
 * - Control phase (390-1040ms, 10 frames): Apply circular pressure on elbow joint
 * - Lock phase (1040-1650ms, 8 frames): Lock elbow at painful hyperextension angle
 *
 * Target vital points: Elbow joint, shoulder manipulation point
 *
 * @korean 팔꿈치제어
 * @duration 1650ms (1.65 seconds)
 * @frames 26 frames at 60fps
 * @category Attack Animation
 */
export const TAE_ELBOW_CONTROL: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("tae_elbow_control", "팔꿈치 제어")
    .asAttack(1.65)
    // =================================================================
    // CAPTURE PHASE (0-390ms, frames 0-6)
    // =================================================================
    // Frame 0: Ready position (0ms)
    .at(0)
    .rotate(BoneName.SHOULDER_R, -0.52, 0.17, -0.26) // Mid-level Tae guard
    .rotate(BoneName.ELBOW_R, 0, 0, 1.4) // 80° guard
    .rotate(BoneName.SHOULDER_L, -0.52, -0.17, 0.26)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.4)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Frame 3: Both hands reaching for arm (195ms)
    .at(0.195)
    .rotate(BoneName.SHOULDER_R, -0.44, 0.35, -0.17) // -25°, 20°, -10° right hand reaching
    .rotate(BoneName.ELBOW_R, 0, 0, 0.7) // 40° extending
    .rotate(BoneName.WRIST_R, 0.09, 0, -0.17) // Ready to grab
    .rotate(BoneName.SHOULDER_L, -0.35, 0.44, 0.17) // -20°, 25°, 10° left hand reaching
    .rotate(BoneName.ELBOW_L, 0, 0, -0.61) // -35° extending
    .rotate(BoneName.SPINE_UPPER, 0, -0.09, 0) // Slight preparation
    .position(BoneName.PELVIS, 0, 0, 0.05)
    .done<MartialArtsAnimationBuilder>()
    // Frame 6: Capture opponent's arm (390ms)
    .at(0.39)
    .rotate(BoneName.SHOULDER_R, -0.35, 0.52, -0.09) // -20°, 30°, -5° securing upper arm
    .rotate(BoneName.ELBOW_R, 0, 0, 0.52) // 30° bent for control
    .rotate(BoneName.WRIST_R, 0.17, 0, -0.26) // 10°, 0°, -15° gripping
    .rotate(BoneName.SHOULDER_L, -0.26, 0.61, 0.26) // -15°, 35°, 15° securing forearm
    .rotate(BoneName.ELBOW_L, 0, 0, -0.35) // -20° control grip
    .rotate(BoneName.WRIST_L, 0.17, 0, 0.26) // Gripping position
    .rotate(BoneName.SPINE_UPPER, 0, -0.17, 0) // 0°, -10° preparing rotation
    .position(BoneName.PELVIS, 0, 0, 0.1)
    .done<MartialArtsAnimationBuilder>()
    // =================================================================
    // CONTROL PHASE (390-1040ms, frames 7-16) - Circular manipulation
    // =================================================================
    // Frame 10: Begin circular pressure on elbow (650ms)
    .at(0.65)
    .rotate(BoneName.SHOULDER_R, -0.17, 0.7, 0.09) // -10°, 40°, 5° right hand rises
    .rotate(BoneName.ELBOW_R, 0, 0, 0.87) // 50° creating leverage
    .rotate(BoneName.WRIST_R, 0.26, 0.17, -0.35) // Applying pressure
    .rotate(BoneName.SHOULDER_L, -0.09, 0.79, 0.35) // -5°, 45°, 20° left hand pushes down
    .rotate(BoneName.ELBOW_L, 0, 0, -0.52) // -30° pushing elbow joint
    .rotate(BoneName.SPINE_UPPER, 0, 0.17, 0) // 0°, 10° rotation begins
    .rotate(BoneName.PELVIS, 0, 0.09, 0) // 0°, 5° hip engagement
    .position(BoneName.PELVIS, 0, -0.02, 0.15)
    .done<MartialArtsAnimationBuilder>()
    // Frame 16: Maximum circular pressure (1040ms)
    .at(1.04)
    .rotate(BoneName.SHOULDER_R, 0, 0.87, 0.26) // 0°, 50°, 15° right hand high
    .rotate(BoneName.ELBOW_R, 0, 0, 1.22) // 70° maximum arc
    .rotate(BoneName.WRIST_R, 0.35, 0.26, -0.44) // 20°, 15°, -25° control grip
    .rotate(BoneName.SHOULDER_L, 0.09, 1.05, 0.52) // 5°, 60°, 30° left hand pushing through
    .rotate(BoneName.ELBOW_L, 0, 0, -0.7) // -40° maximum push
    .rotate(BoneName.WRIST_L, 0.26, 0, 0.35) // Pressure applied
    .rotate(BoneName.SPINE_UPPER, 0, 0.35, 0) // 0°, 20° full rotation
    .rotate(BoneName.PELVIS, 0, 0.26, 0) // 0°, 15° hip power
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15° rear leg drive
    .position(BoneName.PELVIS, 0, -0.05, 0.2)
    .done<MartialArtsAnimationBuilder>()
    // =================================================================
    // LOCK PHASE (1040-1650ms, frames 17-26) - Hyperextension lock
    // =================================================================
    // Frame 21: Elbow hyperextension applied (1365ms)
    .at(1.365)
    .rotate(BoneName.SHOULDER_R, 0.17, 1.05, 0.35) // 10°, 60°, 20° arm locked high
    .rotate(BoneName.ELBOW_R, 0, 0, 1.4) // 80° locked position
    .rotate(BoneName.WRIST_R, 0.44, 0.35, -0.52) // 25°, 20°, -30° maximum control
    .rotate(BoneName.SHOULDER_L, 0.26, 1.22, 0.61) // 15°, 70°, 35° pushing down hard
    .rotate(BoneName.ELBOW_L, 0, 0, -0.87) // -50° full pressure
    .rotate(BoneName.WRIST_L, 0.35, 0, 0.44) // Maximum downward pressure
    .rotate(BoneName.SPINE_UPPER, 0, 0.44, 0) // 0°, 25° full body rotation
    .rotate(BoneName.PELVIS, 0, 0.35, 0) // 0°, 20° hip fully engaged
    .rotate(BoneName.KNEE_R, -0.35, 0, 0) // -20° maximum drive
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° stable base
    .position(BoneName.PELVIS, 0, -0.08, 0.22) // Body drops for leverage
    .done<MartialArtsAnimationBuilder>()
    // Frame 26: Lock maintained (1650ms)
    .at(1.65)
    .rotate(BoneName.SHOULDER_R, 0.09, 0.96, 0.26) // 5°, 55°, 15° holding
    .rotate(BoneName.ELBOW_R, 0, 0, 1.22) // 70° control
    .rotate(BoneName.WRIST_R, 0.35, 0.26, -0.44) // Control maintained
    .rotate(BoneName.SHOULDER_L, 0.17, 1.13, 0.52) // 10°, 65°, 30° pressure held
    .rotate(BoneName.ELBOW_L, 0, 0, -0.7) // -40° pressure maintained
    .rotate(BoneName.SPINE_UPPER, 0, 0.35, 0) // Stable control
    .rotate(BoneName.PELVIS, 0, 0.35, 0)
    .position(BoneName.PELVIS, 0, -0.05, 0.2)
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * Finger Manipulation - 손가락제압
 *
 * Small joint manipulation for pain compliance.
 *
 * Target: Phalanges
 * Principle: Isolating small joints
 *
 * @korean 손가락제압애니메이션
 */
export const TAE_FINGER_LOCK: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("finger_lock", "손가락제압")
    .asAttack(0.5)
    .at(0)
    .rotate(BoneName.SHOULDER_R, -0.52, 0.17, -0.26)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.4)
    .done<MartialArtsAnimationBuilder>()
    .at(0.1)
    .rotate(BoneName.SHOULDER_R, -0.35, 0.26, -0.17)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.7)
    .done<MartialArtsAnimationBuilder>()
    .at(0.25)
    .rotate(BoneName.WRIST_R, 0.26, 0.17, -0.35)
    .done<MartialArtsAnimationBuilder>()
    .at(0.35)
    .rotate(BoneName.WRIST_R, 0.44, 0.26, -0.52)
    .done<MartialArtsAnimationBuilder>()
    .at(0.5)
    .rotate(BoneName.SHOULDER_R, -0.52, 0.17, -0.26)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.4)
    .rotate(BoneName.WRIST_R, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * Flowing Joint Lock Defense - 유수관절기방어
 *
 * Counter-technique: Turning an opponent's grab into a lock.
 *
 * Principle: Yielding (Yu-Sool)
 *
 * @korean 유수관절기방어애니메이션
 */
export const TAE_FLOWING_COUNTER: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("flowing_lock_counter", "유수관절기방어")
    .asDefense(0.65)
    .at(0)
    .rotate(BoneName.SHOULDER_L, -0.52, -0.17, 0.26)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.4)
    .done<MartialArtsAnimationBuilder>()
    .at(0.15)
    .rotate(BoneName.SHOULDER_L, -0.26, 0.35, 0.44)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.7)
    .done<MartialArtsAnimationBuilder>()
    .at(0.35)
    .rotate(BoneName.SHOULDER_L, 0, 0.7, 0.61)
    .rotate(BoneName.SPINE_UPPER, 0, 0.26, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.5)
    .rotate(BoneName.SHOULDER_L, 0.17, 0.96, 0.7)
    .rotate(BoneName.SPINE_UPPER, 0, 0.44, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.65)
    .rotate(BoneName.SHOULDER_L, -0.52, -0.17, 0.26)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.4)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .build();
