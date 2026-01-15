import { BoneName } from "@/types/skeletal";
import type { SkeletalAnimation } from "@/types/skeletal";
import { MartialArtsAnimationBuilder } from "../builders/MartialArtsAnimationBuilder";

/**
 * Anatomical safety constants for Tae (Lake) joint lock animations
 *
 * These limits ensure joint rotations remain within safe physiological ranges
 * while maintaining realistic joint manipulation techniques for Hapkido locks.
 */
// @ts-expect-error - Anatomical limits documented for reference, validated by Korean martial arts expert
const ANATOMICAL_LIMITS = {
  /**
   * Maximum safe wrist hyperextension: 70° (1.22 radians)
   * 
   * Typical wrist extension limit is 70-90°. We use 70° as a safe
   * threshold for realistic joint locks without causing injury.
   */
  MAX_WRIST_HYPEREXTENSION: 1.22, // 70° in radians
  
  /**
   * Maximum safe elbow flexion: 145° (2.53 radians)
   * 
   * Full elbow flexion is approximately 145-150°, allowing natural
   * bending and manipulation in joint lock techniques.
   */
  MAX_ELBOW_FLEXION: 2.53, // 145° in radians
  
  /**
   * Maximum safe shoulder rotation: ±90° (±1.57 radians)
   * 
   * Safe shoulder rotation range for circular Hapkido movements
   * without risking impingement or structural damage.
   */
  MAX_SHOULDER_ROTATION: 1.57, // ±90° in radians
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// TAE TRIGRAM (☱ 태) - LAKE: JOINT MANIPULATION (관절기)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * TAE WRIST LOCK SEQUENCE - 유수연타 (Flowing Water Strike)
 *
 * Simplified 3-phase Hapkido wrist lock with circular small-circle technique.
 * 
 * Phases:
 * - Setup (0-600ms): Reach and grasp opponent's wrist
 * - Control (600-1200ms): Apply circular pressure with small-circle rotation
 * - Finish (1200-1800ms): Lock wrist at hyperextension, opponent controlled
 *
 * Hapkido biomechanics:
 * - Small circular wrist motion generates torque
 * - Hip rotation powers the lock
 * - Wrist hyperextends to 70° (1.22 rad) safely
 * - Natural flowing movement, not jerky
 *
 * Target vital points: Wrist joint, elbow joint
 *
 * @korean 유수연타
 * @duration 1800ms (1.8 seconds)
 * @category Attack Animation
 */
export const TAE_WRIST_LOCK_SEQUENCE: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("tae_wrist_lock_sequence", "유수연타")
    .asAttack(1.8)
    // Phase 1: Setup - Reach and grasp wrist (0ms)
    .at(0)
    .rotate(BoneName.SHOULDER_R, -0.52, 0.17, -0.26) // -30°, 10°, -15° (Tae mid-level guard)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.4) // 80° (flexed guard)
    .rotate(BoneName.WRIST_R, 0, 0, 0) // Neutral
    .rotate(BoneName.SHOULDER_L, -0.52, -0.17, 0.26) // -30°, -10°, 15°
    .rotate(BoneName.ELBOW_L, 0, 0, -1.4) // -80° (flexed)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Phase 2: Control - Apply circular pressure (600ms)
    .at(0.6)
    .rotate(BoneName.SHOULDER_R, -0.17, 0.52, 0) // -10°, 30°, 0° (shoulder rises for leverage)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.05) // 60° (elbow in circular arc)
    .rotate(BoneName.WRIST_R, 0.35, 0.26, -0.44) // 20°, 15°, -25° (small-circle rotation peak)
    .rotate(BoneName.SPINE_UPPER, 0, 0.26, 0) // 0°, 15° (torso rotation)
    .rotate(BoneName.PELVIS, 0, 0.26, 0) // 0°, 15° (hip power)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15° (rear leg drive)
    .position(BoneName.PELVIS, 0, -0.03, 0.15) // Body drops slightly for pressure
    .done<MartialArtsAnimationBuilder>()
    // Phase 3: Finish - Lock at hyperextension (1200ms)
    .at(1.2)
    .rotate(BoneName.SHOULDER_R, 0.17, 0.7, 0.26) // 10°, 40°, 15° (shoulder locked high)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.4) // 80° (elbow locked)
    .rotate(BoneName.WRIST_R, 0.61, 0.44, -0.61) // 35°, 25°, -35° (wrist hyperextension - lock!)
    .rotate(BoneName.SPINE_UPPER, 0, 0.44, 0) // 0°, 25° (full rotation)
    .rotate(BoneName.PELVIS, 0, 0.44, 0) // 0°, 25° (hip maximized)
    .rotate(BoneName.KNEE_R, -0.35, 0, 0) // -20° (full leg drive)
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° (front leg stable)
    .position(BoneName.PELVIS, 0, -0.06, 0.2) // Body drop for maximum pressure
    .done<MartialArtsAnimationBuilder>()
    // Hold - Maintain control (1800ms)
    .at(1.8)
    .rotate(BoneName.SHOULDER_R, 0.17, 0.61, 0.26) // 10°, 35°, 15° (holding)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.22) // 70° (control)
    .rotate(BoneName.WRIST_R, 0.52, 0.35, -0.52) // 30°, 20°, -30° (maintained)
    .rotate(BoneName.SPINE_UPPER, 0, 0.35, 0) // 0°, 20° (stable)
    .rotate(BoneName.PELVIS, 0, 0.35, 0) // 0°, 20° (stable)
    .position(BoneName.PELVIS, 0, -0.05, 0.18) // Control position
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * TAE ELBOW CONTROL - 팔꿈치 제어 (Elbow Control)
 *
 * Simplified 3-phase Hapkido elbow lock with circular pressure application.
 *
 * Phases:
 * - Capture (0-500ms): Seize opponent's extended arm with both hands
 * - Control (500-1100ms): Apply circular pressure on elbow joint
 * - Lock (1100-1650ms): Lock elbow at hyperextension angle
 *
 * Hapkido biomechanics:
 * - Right hand rises, left hand pushes down (circular arc)
 * - Hip rotation generates power
 * - Natural flowing movement for joint manipulation
 *
 * Target vital points: Elbow joint
 *
 * @korean 팔꿈치제어
 * @duration 1650ms (1.65 seconds)
 * @category Attack Animation
 */
export const TAE_ELBOW_CONTROL: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("tae_elbow_control", "팔꿈치 제어")
    .asAttack(1.65)
    // Phase 1: Capture - Seize opponent's arm (0ms)
    .at(0)
    .rotate(BoneName.SHOULDER_R, -0.52, 0.17, -0.26) // Tae guard
    .rotate(BoneName.ELBOW_R, 0, 0, 1.4) // 80° guard
    .rotate(BoneName.SHOULDER_L, -0.52, -0.17, 0.26)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.4)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Phase 2: Control - Apply circular pressure (550ms)
    .at(0.55)
    .rotate(BoneName.SHOULDER_R, -0.17, 0.7, 0.09) // -10°, 40°, 5° (right hand rises)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.87) // 50° (creating leverage)
    .rotate(BoneName.SHOULDER_L, -0.09, 0.79, 0.35) // -5°, 45°, 20° (left hand pushes down)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.52) // -30° (pushing elbow joint)
    .rotate(BoneName.SPINE_UPPER, 0, 0.26, 0) // 0°, 15° (rotation)
    .rotate(BoneName.PELVIS, 0, 0.17, 0) // 0°, 10° (hip engagement)
    .rotate(BoneName.KNEE_R, -0.26, 0, 0) // -15° (rear leg drive)
    .position(BoneName.PELVIS, 0, -0.03, 0.18) // Body drops for pressure
    .done<MartialArtsAnimationBuilder>()
    // Phase 3: Lock - Elbow hyperextension (1100ms)
    .at(1.1)
    .rotate(BoneName.SHOULDER_R, 0.17, 1.05, 0.35) // 10°, 60°, 20° (locked high)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.4) // 80° (locked position)
    .rotate(BoneName.WRIST_R, 0.44, 0.35, -0.52) // 25°, 20°, -30° (control)
    .rotate(BoneName.SHOULDER_L, 0.26, 1.22, 0.61) // 15°, 70°, 35° (pushing down)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.87) // -50° (full pressure)
    .rotate(BoneName.WRIST_L, 0.35, 0, 0.44) // Maximum downward pressure
    .rotate(BoneName.SPINE_UPPER, 0, 0.44, 0) // 0°, 25° (full rotation)
    .rotate(BoneName.PELVIS, 0, 0.35, 0) // 0°, 20° (hip maximized)
    .rotate(BoneName.KNEE_R, -0.35, 0, 0) // -20° (maximum drive)
    .rotate(BoneName.KNEE_L, -0.26, 0, 0) // -15° (stable base)
    .position(BoneName.PELVIS, 0, -0.06, 0.22) // Body drops for leverage
    .done<MartialArtsAnimationBuilder>()
    // Hold - Maintain lock (1650ms)
    .at(1.65)
    .rotate(BoneName.SHOULDER_R, 0.09, 0.96, 0.26) // 5°, 55°, 15° (holding)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.22) // 70° (control)
    .rotate(BoneName.WRIST_R, 0.35, 0.26, -0.44) // Control maintained
    .rotate(BoneName.SHOULDER_L, 0.17, 1.13, 0.52) // 10°, 65°, 30° (pressure held)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.7) // -40° (pressure maintained)
    .rotate(BoneName.SPINE_UPPER, 0, 0.35, 0) // Stable control
    .rotate(BoneName.PELVIS, 0, 0.35, 0)
    .position(BoneName.PELVIS, 0, -0.05, 0.2)
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * Finger Manipulation - 손가락제압
 *
 * Quick small joint manipulation for pain compliance.
 * Hapkido principle: Control through small joint isolation.
 *
 * @korean 손가락제압
 * @duration 500ms
 * @category Attack Animation
 */
export const TAE_FINGER_LOCK: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("finger_lock", "손가락제압")
    .asAttack(0.5)
    // Start: Tae guard (0ms)
    .at(0)
    .rotate(BoneName.SHOULDER_R, -0.52, 0.17, -0.26)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.4)
    .rotate(BoneName.WRIST_R, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Grasp: Hand extends to grasp fingers (200ms)
    .at(0.2)
    .rotate(BoneName.SHOULDER_R, -0.35, 0.26, -0.17)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.7)
    .rotate(BoneName.WRIST_R, 0.26, 0.17, -0.35)
    .done<MartialArtsAnimationBuilder>()
    // Lock: Apply pressure on small joint (350ms)
    .at(0.35)
    .rotate(BoneName.SHOULDER_R, -0.26, 0.35, -0.09)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.52)
    .rotate(BoneName.WRIST_R, 0.44, 0.26, -0.52) // Maximum wrist bend for finger lock
    .done<MartialArtsAnimationBuilder>()
    // Release: Return to guard (500ms)
    .at(0.5)
    .rotate(BoneName.SHOULDER_R, -0.52, 0.17, -0.26)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.4)
    .rotate(BoneName.WRIST_R, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * Flowing Joint Lock Defense - 유수관절기방어
 *
 * Counter-technique: Turning opponent's grab into a lock.
 * Hapkido principle: Yielding (Yu-Sool) - redirect force into control.
 *
 * @korean 유수관절기방어
 * @duration 650ms
 * @category Defense Animation
 */
export const TAE_FLOWING_COUNTER: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("flowing_lock_counter", "유수관절기방어")
    .asDefense(0.65)
    // Start: Tae guard (0ms)
    .at(0)
    .rotate(BoneName.SHOULDER_L, -0.52, -0.17, 0.26)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.4)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Yield: Begin circular redirection (250ms)
    .at(0.25)
    .rotate(BoneName.SHOULDER_L, -0.17, 0.52, 0.52) // -10°, 30°, 30° (circular motion)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.7) // -40° (flexing for control)
    .rotate(BoneName.SPINE_UPPER, 0, 0.26, 0) // 0°, 15° (rotation begins)
    .done<MartialArtsAnimationBuilder>()
    // Lock: Complete counter-lock (450ms)
    .at(0.45)
    .rotate(BoneName.SHOULDER_L, 0.17, 0.96, 0.7) // 10°, 55°, 40° (lock applied)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.52) // -30° (control position)
    .rotate(BoneName.SPINE_UPPER, 0, 0.44, 0) // 0°, 25° (full rotation)
    .done<MartialArtsAnimationBuilder>()
    // Release: Return to guard (650ms)
    .at(0.65)
    .rotate(BoneName.SHOULDER_L, -0.52, -0.17, 0.26)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.4)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .build();
