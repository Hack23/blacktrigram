import { BoneName } from "@/types/skeletal";
import type { SkeletalAnimation } from "@/types/skeletal";
import { MartialArtsAnimationBuilder } from "../builders/MartialArtsAnimationBuilder";

/**
 * Anatomical safety constants for Tae (Lake) joint lock animations
 *
 * These limits document safe physiological ranges for joint manipulation techniques.
 * The constants serve as reference documentation validated by Korean martial arts experts
 * and inform the design of all joint lock animations to ensure realistic Hapkido mechanics
 * without exceeding anatomical safety thresholds.
 *
 * Note: These are documentation constants. The actual animation rotations are designed
 * to stay within these limits naturally through authentic joint lock biomechanics.
 *
 * @internal - For documentation purposes only
 */
export const ANATOMICAL_LIMITS_TAE_JOINT_LOCKS = {
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
 * TAE WRIST LOCK SEQUENCE - 손목꺾기 (Wrist Lock)
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
 * @korean 손목꺾기
 * @duration 1800ms (1.8 seconds)
 * @category Joint Lock Animation
 */
export const TAE_WRIST_LOCK_SEQUENCE: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("tae_wrist_lock_sequence", "손목꺾기")
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
 * @korean 팔꿈치 제어
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

// ═══════════════════════════════════════════════════════════════════════════
// ADDITIONAL TAE COMBAT TECHNIQUES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * TAE FLOWING STRIKES - 유수연타 (Flowing Water Strikes)
 *
 * Continuous palm strikes with fluid transitions between attacks.
 * This is a flowing strike sequence (연타), not a wrist-lock chain;
 * wrist-lock flows are modeled separately as 손목꺾기 (Wrist Lock).
 *
 * Hapkido principle: Flowing like water, never stopping.
 *
 * Phases:
 * - Setup (0-200ms): Initial palm strike
 * - Flow (200-400ms): Transition to second strike
 * - Finish (400-600ms): Final palm heel strike
 *
 * @korean 유수연타
 * @duration 600ms
 * @category Attack Animation
 */
export const TAE_FLOWING_STRIKES: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("tae_flowing_strikes", "유수연타")
    .asAttack(0.6)
    // Phase 1: First palm strike (0ms)
    .at(0)
    .rotate(BoneName.SHOULDER_R, -0.52, 0.17, -0.26) // Guard position
    .rotate(BoneName.ELBOW_R, 0, 0, 1.4)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Phase 2: Flow to second strike (300ms)
    .at(0.3)
    .rotate(BoneName.SHOULDER_R, -0.17, 0.44, -0.09) // -10°, 25°, -5° (palm out)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.52) // 30° (extended)
    .rotate(BoneName.SHOULDER_L, -0.26, -0.35, 0.17) // -15°, -20°, 10° (preparing)
    .rotate(BoneName.SPINE_UPPER, 0, 0.17, 0) // 0°, 10° (rotation)
    .rotate(BoneName.PELVIS, 0, 0.17, 0) // 0°, 10° (hip power)
    .position(BoneName.PELVIS, 0, 0, 0.1) // Forward
    .done<MartialArtsAnimationBuilder>()
    // Phase 3: Final palm heel strike (600ms)
    .at(0.6)
    .rotate(BoneName.SHOULDER_L, -0.09, 0.52, 0.09) // -5°, 30°, 5° (strike)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.44) // -25° (extended)
    .rotate(BoneName.SPINE_UPPER, 0, -0.17, 0) // 0°, -10° (counter-rotation)
    .rotate(BoneName.PELVIS, 0, -0.09, 0) // 0°, -5° (return)
    .position(BoneName.PELVIS, 0, 0, 0.15) // Maximum reach
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * TAE SMALL CIRCLE TECHNIQUE - 소원법 (Small Circle Method)
 *
 * Advanced Hapkido technique using minimal circular motion for maximum leverage.
 * Controls both wrist and elbow simultaneously with small-circle manipulation.
 *
 * Phases:
 * - Contact (0-250ms): Grasp wrist and elbow
 * - Circle (250-550ms): Apply small-circle pressure
 * - Lock (550-750ms): Lock both joints
 *
 * @korean 소원법
 * @duration 750ms
 * @category Attack Animation
 */
export const TAE_SMALL_CIRCLE: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("tae_small_circle", "소원법")
    .asAttack(0.75)
    // Phase 1: Contact - Grasp wrist and elbow (0ms)
    .at(0)
    .rotate(BoneName.SHOULDER_R, -0.52, 0.17, -0.26) // Guard
    .rotate(BoneName.ELBOW_R, 0, 0, 1.4)
    .rotate(BoneName.SHOULDER_L, -0.52, -0.17, 0.26)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.4)
    .done<MartialArtsAnimationBuilder>()
    // Phase 2: Circle - Small-circle pressure (400ms)
    .at(0.4)
    .rotate(BoneName.SHOULDER_R, -0.26, 0.61, 0.17) // -15°, 35°, 10° (wrist control)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.87) // 50° (circular motion)
    .rotate(BoneName.WRIST_R, 0.26, 0.17, -0.35) // 15°, 10°, -20° (small circle)
    .rotate(BoneName.SHOULDER_L, -0.17, 0.7, 0.35) // -10°, 40°, 20° (elbow control)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.61) // -35° (pressure)
    .rotate(BoneName.SPINE_UPPER, 0, 0.26, 0) // 0°, 15° (rotation)
    .rotate(BoneName.PELVIS, 0, 0.17, 0) // 0°, 10° (hip power)
    .position(BoneName.PELVIS, 0, -0.02, 0.12) // Body drops
    .done<MartialArtsAnimationBuilder>()
    // Phase 3: Lock - Both joints locked (750ms)
    .at(0.75)
    .rotate(BoneName.SHOULDER_R, 0.09, 0.79, 0.35) // 5°, 45°, 20° (wrist locked)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.22) // 70° (locked)
    .rotate(BoneName.WRIST_R, 0.52, 0.35, -0.52) // 30°, 20°, -30° (hyperextension)
    .rotate(BoneName.SHOULDER_L, 0.17, 0.96, 0.52) // 10°, 55°, 30° (elbow locked)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.79) // -45° (maximum pressure)
    .rotate(BoneName.SPINE_UPPER, 0, 0.35, 0) // 0°, 20° (full rotation)
    .rotate(BoneName.PELVIS, 0, 0.26, 0) // 0°, 15° (hip maximized)
    .position(BoneName.PELVIS, 0, -0.04, 0.15) // Maximum control
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * TAE SHOULDER LOCK - 어깨꺾기 (Shoulder Manipulation)
 *
 * Hapkido shoulder lock twisting arm behind back.
 * Extremely effective control technique causing severe pain and compliance.
 *
 * Phases:
 * - Capture (0-300ms): Seize arm
 * - Twist (300-650ms): Rotate arm behind back
 * - Lock (650-850ms): Lock shoulder joint
 *
 * @korean 어깨꺾기
 * @duration 850ms
 * @category Attack Animation
 */
export const TAE_SHOULDER_LOCK: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("tae_shoulder_lock", "어깨꺾기")
    .asAttack(0.85)
    // Phase 1: Capture - Seize arm (0ms)
    .at(0)
    .rotate(BoneName.SHOULDER_R, -0.52, 0.17, -0.26) // Guard
    .rotate(BoneName.ELBOW_R, 0, 0, 1.4)
    .rotate(BoneName.SHOULDER_L, -0.52, -0.17, 0.26)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.4)
    .done<MartialArtsAnimationBuilder>()
    // Phase 2: Twist - Rotate arm behind (500ms)
    .at(0.5)
    .rotate(BoneName.SHOULDER_R, 0.26, 0.87, -0.52) // 15°, 50°, -30° (twisting motion)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.57) // 90° (behind back)
    .rotate(BoneName.WRIST_R, -0.35, 0.52, 0.79) // -20°, 30°, 45° (twisted)
    .rotate(BoneName.SHOULDER_L, -0.09, -0.44, 0.61) // -5°, -25°, 35° (assisting)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.87) // -50° (pushing)
    .rotate(BoneName.SPINE_UPPER, 0, 0.44, 0) // 0°, 25° (rotation for leverage)
    .rotate(BoneName.PELVIS, 0, 0.35, 0) // 0°, 20° (hip power)
    .position(BoneName.PELVIS, 0, -0.03, 0.1) // Body position
    .done<MartialArtsAnimationBuilder>()
    // Phase 3: Lock - Shoulder joint locked (850ms)
    .at(0.85)
    .rotate(BoneName.SHOULDER_R, 0.44, 1.05, -0.79) // 25°, 60°, -45° (locked behind)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.92) // 110° (extreme angle)
    .rotate(BoneName.WRIST_R, -0.52, 0.61, 1.05) // -30°, 35°, 60° (locked)
    .rotate(BoneName.SHOULDER_L, 0.09, -0.52, 0.79) // 5°, -30°, 45° (controlling)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.05) // -60° (maximum pressure)
    .rotate(BoneName.SPINE_UPPER, 0, 0.52, 0) // 0°, 30° (full rotation)
    .rotate(BoneName.PELVIS, 0, 0.44, 0) // 0°, 25° (hip maximized)
    .position(BoneName.PELVIS, 0, -0.05, 0.12) // Control position
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * TAE ARM BAR - 팔꺾기 (Arm Bar Submission)
 *
 * Hapkido arm bar immobilizing elbow for submission.
 * Most powerful Tae technique - forces opponent submission or risks arm break.
 *
 * Phases:
 * - Control (0-350ms): Secure arm extension
 * - Position (350-700ms): Pivot body for leverage
 * - Submit (700-900ms): Apply hyperextension pressure
 *
 * @korean 팔꺾기
 * @duration 900ms
 * @category Attack Animation
 */
export const TAE_ARM_BAR: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("tae_arm_bar", "팔꺾기")
    .asAttack(0.9)
    // Phase 1: Control - Secure extended arm (0ms)
    .at(0)
    .rotate(BoneName.SHOULDER_R, -0.52, 0.17, -0.26) // Guard
    .rotate(BoneName.ELBOW_R, 0, 0, 1.4)
    .rotate(BoneName.SHOULDER_L, -0.52, -0.17, 0.26)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.4)
    .done<MartialArtsAnimationBuilder>()
    // Phase 2: Position - Pivot for leverage (550ms)
    .at(0.55)
    .rotate(BoneName.SHOULDER_R, 0.17, 0.96, 0.44) // 10°, 55°, 25° (securing)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.52) // 30° (control)
    .rotate(BoneName.WRIST_R, 0.26, 0.17, -0.26) // 15°, 10°, -15° (grip)
    .rotate(BoneName.SHOULDER_L, 0.26, 1.13, 0.61) // 15°, 65°, 35° (holding)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.44) // -25° (positioning)
    .rotate(BoneName.SPINE_UPPER, 0, 0.61, 0) // 0°, 35° (pivot)
    .rotate(BoneName.PELVIS, 0, 0.52, 0) // 0°, 30° (hip rotation)
    .rotate(BoneName.KNEE_R, -0.44, 0, 0) // -25° (body drop)
    .position(BoneName.PELVIS, 0, -0.08, 0.15) // Low position for leverage
    .done<MartialArtsAnimationBuilder>()
    // Phase 3: Submit - Hyperextension pressure (900ms)
    .at(0.9)
    .rotate(BoneName.SHOULDER_R, 0.35, 1.22, 0.61) // 20°, 70°, 35° (locked)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.17) // 10° (slight bend for control)
    .rotate(BoneName.WRIST_R, 0.44, 0.26, -0.35) // 25°, 15°, -20° (firm grip)
    .rotate(BoneName.SHOULDER_L, 0.44, 1.4, 0.79) // 25°, 80°, 45° (maximum pressure)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.26) // -15° (locked position)
    .rotate(BoneName.WRIST_L, 0.35, 0, 0.44) // Downward pressure
    .rotate(BoneName.SPINE_UPPER, 0, 0.79, 0) // 0°, 45° (full pivot)
    .rotate(BoneName.PELVIS, 0, 0.7, 0) // 0°, 40° (maximum rotation)
    .rotate(BoneName.KNEE_R, -0.61, 0, 0) // -35° (full body weight)
    .rotate(BoneName.KNEE_L, -0.52, 0, 0) // -30° (grounded)
    .position(BoneName.PELVIS, 0, -0.12, 0.18) // Maximum leverage position
    .done<MartialArtsAnimationBuilder>()
    .build();
