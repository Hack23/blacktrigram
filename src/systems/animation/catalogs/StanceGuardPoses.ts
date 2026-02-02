/**
 * Fighting Stance Guard Poses for Eight Trigram System
 *
 * Defines default guard positions for all 8 trigram stances (팔괘).
 * Each guard pose includes arm positions, torso rotation, weight distribution,
 * and breathing animation parameters for authentic Korean martial arts stance representation.
 *
 * Based on COMBAT_ARCHITECTURE.md and game-design.md specifications:
 * - ☰ 건 (Geon/Heaven): High guard with strong forward presence
 * - ☱ 태 (Tae/Lake): Fluid mid-guard with adaptive positioning
 * - ☲ 리 (Li/Fire): Aggressive forward guard
 * - ☳ 진 (Jin/Thunder): Explosive ready stance
 * - ☴ 손 (Son/Wind): Continuous motion guard
 * - ☵ 감 (Gam/Water): Flowing defensive guard
 * - ☶ 간 (Gan/Mountain): Solid defensive posture
 * - ☷ 곤 (Gon/Earth): Grounded low guard
 *
 * @module systems/animation/StanceGuardPoses
 * @category Animation
 * @korean 자세방어포즈
 */

import { TrigramStance } from "@/types/common";
import type {
  StanceGuardAnimationConfig,
  StanceGuardPose,
} from "@/types/skeletal";
import { mirrorGuardPose } from "@/types/skeletal";
import * as THREE from "three";
import type { StanceLaterality } from "../../trigram/types";

/**
 * ☰ 건 (Geon) - Heaven: High guard with strong forward presence
 *
 * Traditional Taekwondo Ap Seogi (앞서기) - Walking Stance
 * - Both hands raised high (shoulder level or above)
 * - Ready to deliver powerful overhead strikes
 * - Weight slightly forward for aggressive positioning
 * - Breathing emphasizes chest expansion for power generation
 *
 * **Leg Position (Ap Seogi)**:
 * - Feet shoulder-width apart (0.5m)
 * - Front leg slightly bent, ready to step
 * - Back leg providing power base
 * - Natural, mobile stance for quick movement
 *
 * Combat Application:
 * - Direct frontal bone-breaking strikes
 * - High mobility (+15% movement speed from game-design.md)
 * - Bone-break attacks (+10% startup time)
 *
 * ENHANCED: Proper boxing-style guard - elbows tight to protect ribs, hands at chin
 *
 * @korean 건괘방어포즈
 */
export const GEON_HIGH_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    // ENHANCED: Proper Taekwondo guard - hands protect face, elbows protect body
    // Lead hand slightly forward for probing and deflection
    shoulder: new THREE.Euler(-0.95, 0.25, 0.45), // Shoulder relaxed but ready, slight forward rotation
    elbow: new THREE.Euler(0.05, 0, -2.18), // Elbow TIGHT to body, within ANATOMICAL_LIMITS.ELBOW.MAX_BEND (125°)
    wrist: new THREE.Euler(0.35, 0.15, 0.1), // Fist angled naturally, thumb up, ready to punch
  },
  rightArm: {
    // Rear hand guards the jaw, ready for powerful cross
    shoulder: new THREE.Euler(-1.05, -0.20, -0.40), // Rear shoulder slightly back, coiled for power
    elbow: new THREE.Euler(-0.05, 0, 2.18), // Elbow tight, within ANATOMICAL_LIMITS.ELBOW.MAX_BEND (125°)
    wrist: new THREE.Euler(0.30, -0.18, -0.08), // Fist at jaw level, natural angle
  },
  torso: new THREE.Euler(0.08, -0.25, 0.02), // ENHANCED: Slight forward lean with micro-rotation for balance

  // ENHANCED Ap Seogi (Forward Stance) - Proper Taekwondo biomechanics
  // More natural weight distribution and joint angles for sustained stance
  leftLeg: {
    // Back leg - provides push-off power and stability
    hip: new THREE.Euler(-0.30, 0.12, 0.05), // ENHANCED: Natural hip extension with slight outward rotation
    knee: new THREE.Euler(0.28, 0, 0), // ENHANCED: Micro-bend for active stability (not locked)
    ankle: new THREE.Euler(-0.08, 0.03, 0), // ENHANCED: Natural foot angle with slight eversion
  },
  rightLeg: {
    // Front leg - absorbs impact and allows quick movement
    hip: new THREE.Euler(0.55, -0.12, -0.03), // ENHANCED: Natural flexion with proper alignment
    knee: new THREE.Euler(1.15, 0, 0), // ENHANCED: Deep but sustainable bend (~65° flexion)
    ankle: new THREE.Euler(-0.12, -0.02, 0), // ENHANCED: Dorsiflexion with natural pronation
  },
  pelvis: new THREE.Euler(0.12, -0.45, 0.02), // ENHANCED: Neutral pelvis with power coil, micro-tilt for balance
  stanceWidth: 0.58, // ENHANCED: Slightly narrower for mobility (1.3x shoulder width)
  stanceDepth: 0.62, // ENHANCED: Optimal depth for power transfer
  pelvisHeight: -0.14, // ENHANCED: Athletic crouch - balanced power and mobility

  weight: "forward",
  breathingRange: {
    min: 0.97, // ENHANCED: Natural chest expansion during power breathing
    max: 1.03, // ENHANCED: Fuller exhale for explosive techniques
  },
};

/**
 * ☱ 태 (Tae) - Lake: Fluid mid-guard with adaptive positioning
 *
 * Traditional Taekwondo Ap Koobi Seogi (앞굽이) - Front Stance
 * - Hands at mid-level (chest height)
 * - Ready for joint manipulation and throws
 * - Weight forward for reach (+15% reach from game-design.md)
 * - Breathing flows smoothly for continuous adaptation
 *
 * **Leg Position (Ap Koobi Seogi)**:
 * - Deep front lunge, front knee over toes
 * - Back leg straight, heel down
 * - 70% weight forward, powerful reach
 * - Wide stance (0.9m) for stability
 *
 * Combat Application:
 * - Joint locks and throwing techniques
 * - +15% reach for throws/sweeps
 * - +10% takedown damage
 *
 * ENHANCED: Lead hand parries with rear hand protecting chin - elbows guard ribs
 *
 * @korean 태괘방어포즈
 */
export const TAE_FLUID_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    // ENHANCED: Circular guard ready for joint locks and redirections
    shoulder: new THREE.Euler(-0.85, 0.30, 0.35), // Hands more forward, ready to intercept
    elbow: new THREE.Euler(0.08, 0, -2.0), // Elbows slightly looser for fluid movement
    wrist: new THREE.Euler(0.25, 0.18, 0.08), // Wrists relaxed but controlled
  },
  rightArm: {
    shoulder: new THREE.Euler(-0.85, -0.28, -0.38), // Mirror positioning
    elbow: new THREE.Euler(-0.08, 0, 2.05), // Slight asymmetry for natural flow
    wrist: new THREE.Euler(0.25, -0.16, -0.08), // Ready for circular motions
  },
  torso: new THREE.Euler(0.06, -0.20, 0.03), // ENHANCED: Relaxed forward lean, adaptive posture

  // ENHANCED: Improved front stance (Ap Koobi Seogi 앞굽이) for fluid joint manipulation
  // NOTE: Front stance for reach and Hapkido circular techniques (NOT Cat Stance)
  leftLeg: {
    hip: new THREE.Euler(-0.25, 0.10, 0.06), // ENHANCED: Back leg with natural external rotation
    knee: new THREE.Euler(0.22, 0, 0), // ENHANCED: Nearly straight back leg (soft knee)
    ankle: new THREE.Euler(-0.07, 0.04, 0), // ENHANCED: Natural foot positioning
  },
  rightLeg: {
    hip: new THREE.Euler(0.70, -0.10, -0.04), // ENHANCED: Deep front knee flexion (~90°)
    knee: new THREE.Euler(1.55, 0, 0), // ENHANCED: Deep bend for stability and reach
    ankle: new THREE.Euler(-0.18, -0.03, 0), // ENHANCED: Strong dorsiflexion for power base
  },
  pelvis: new THREE.Euler(0.08, -0.40, 0.03), // ENHANCED: Forward tilt for reach, natural side lean
  stanceWidth: 0.62, // ENHANCED: 1.55x shoulder width for fluid movement
  stanceDepth: 0.70, // ENHANCED: Longer stance for maximum reach
  pelvisHeight: -0.18, // ENHANCED: Lower center for stability

  weight: "forward",
  breathingRange: {
    min: 0.98, // ENHANCED: Smooth flowing breath
    max: 1.02, // Adaptive rhythm
  },
};

/**
 * ☲ 리 (Li) - Fire: Aggressive forward guard
 *
 * Traditional Taekwondo Juchum Seogi (주춤) - Horse Stance
 * - Hands forward in striking position
 * - Ready for precise nerve strikes
 * - Weight neutral but low center of gravity
 * - Breathing controlled for precision (+5% crit hit chance)
 *
 * **Leg Position (Juchum Seogi)**:
 * - WIDE stance (1.2m) - parallel feet
 * - Both knees bent deeply (horse riding position)
 * - Low center of gravity for stability
 * - Equal weight distribution
 *
 * Combat Application:
 * - Precise vital point strikes
 * - +15% stability vs. vital strikes
 * - +10% knockdown resistance
 *
 * ENHANCED: Peekaboo guard - both hands high protecting face, aggressive stance
 *
 * @korean 리괘방어포즈
 */
export const LI_FIRE_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    shoulder: new THREE.Euler(-1.6, 0.2, 0.9), // VERY HIGH - elbows out wide like wings
    elbow: new THREE.Euler(0, 0, -2.4), // Super tight - fists at temples (max anatomical flexion)
    wrist: new THREE.Euler(0.4, 0.15, 0), // Fists glued to cheekbones
  },
  rightArm: {
    shoulder: new THREE.Euler(-1.6, -0.2, -0.9), // Mirror - dramatic peekaboo
    elbow: new THREE.Euler(0, 0, 2.4), // Super tight - fists at temples (max anatomical flexion)
    wrist: new THREE.Euler(0.4, -0.15, 0), // Fists glued to cheekbones
  },
  torso: new THREE.Euler(0.15, 0, 0), // Chin tucked, facing SQUARE forward

  // Fighting Stance (Gyeorugi Junbi) - Balanced precision combat stance
  // Based on LI_FIRE biomechanics: 135° both knees (moderate bend), 50/50 weight
  leftLeg: {
    hip: new THREE.Euler(0.2, 0.3, 0.15), // Left leg forward and out
    knee: new THREE.Euler(0.8, 0, 0), // 135° knee bend (0.8 rad flex)
    ankle: new THREE.Euler(-0.15, 0.1, 0), // Slight toe-out
  },
  rightLeg: {
    hip: new THREE.Euler(0.2, -0.3, -0.15), // Right leg back and out
    knee: new THREE.Euler(0.8, 0, 0), // 135° knee bend (0.8 rad flex)
    ankle: new THREE.Euler(-0.15, -0.1, 0), // Slight toe-out
  },
  pelvis: new THREE.Euler(0.1, 0, 0), // Slight forward tilt, SQUARE facing
  stanceWidth: 0.5, // 1.1x shoulder width (balanced)
  stanceDepth: 0.3, // Slight stagger for mobility
  pelvisHeight: -0.12, // Medium low (hipHeight 0.88)

  weight: "neutral",
  breathingRange: {
    min: 0.99, // Shallow, controlled breathing
    max: 1.01, // Precision focus
  },
};

/**
 * ☳ 진 (Jin) - Thunder: Explosive ready stance
 *
 * Traditional Taekwondo Dwi Koobi Seogi (뒤굽이) - Back Stance
 * - Hands chambered for explosive release
 * - Ready for shocking nerve strikes
 * - Weight back but explosive forward (+15% shock damage)
 * - Breathing deep for power generation
 *
 * **Leg Position (Dwi Koobi Seogi)**:
 * - 70% weight on back leg
 * - Front leg light, ready to kick or step
 * - Back knee bent deeply, coiled spring
 * - Moderate width (0.7m) for mobility
 *
 * Combat Application:
 * - Nerve strike warfare
 * - +15% shock damage on nerve strikes
 * - -30 consciousness on head hits
 *
 * ENHANCED: Chambered guard with chin protection - rear hand guards chin, elbows tight
 *
 * @korean 진괘방어포즈
 */
export const JIN_THUNDER_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    shoulder: new THREE.Euler(-0.6, 0.2, 0.6), // Lead arm low but elbows guard body
    elbow: new THREE.Euler(0, 0, -2.2), // TIGHT elbow - protects left ribs
    wrist: new THREE.Euler(0.4, 0.1, 0), // Chambered fist at ribs
  },
  rightArm: {
    shoulder: new THREE.Euler(-1.0, -0.2, -0.5), // Rear hand at chin level - protects head
    elbow: new THREE.Euler(0, 0, 2.2), // TIGHT elbow - protects right ribs
    wrist: new THREE.Euler(0.3, -0.1, 0), // Fist protecting chin
  },
  torso: new THREE.Euler(-0.1, -0.4, 0.05), // Slight back lean + rotation - coiled

  // Horse Stance (Juchum Seogi) - WIDE, DEEP, POWERFUL
  // Based on JIN_THUNDER biomechanics: 90° both knees, 50/50 weight, 2.0x width
  leftLeg: {
    hip: new THREE.Euler(0.3, 0.5, 0.3), // Wide spread, toes out
    knee: new THREE.Euler(1.57, 0, 0), // 90° FULL bend - deep horse stance
    ankle: new THREE.Euler(-0.25, 0.2, 0), // Toes pointed outward
  },
  rightLeg: {
    hip: new THREE.Euler(0.3, -0.5, -0.3), // Mirror - wide spread
    knee: new THREE.Euler(1.57, 0, 0), // 90° FULL bend - deep horse stance
    ankle: new THREE.Euler(-0.25, -0.2, 0), // Toes pointed outward
  },
  pelvis: new THREE.Euler(0.1, 0, 0), // Slight forward tilt, facing square
  stanceWidth: 0.9, // VERY WIDE (2.0x shoulder width)
  stanceDepth: 0, // Parallel feet - horse stance
  pelvisHeight: -0.25, // VERY LOW for explosive power (hipHeight 0.75)

  weight: "back",
  breathingRange: {
    min: 0.96, // Deep inhale for power
    max: 1.04, // Explosive exhale
  },
};

/**
 * ☴ 손 (Son) - Wind: Continuous motion guard
 *
 * Traditional Taekwondo Niunja Seogi (니은자) - L-Stance
 * - Hands in flowing circular pattern
 * - Ready for continuous pressure attacks
 * - Weight neutral for lateral movement (+10% lateral)
 * - Breathing rhythmic for sustained combos
 *
 * **Leg Position (Niunja Seogi)**:
 * - L-shaped narrow stance (0.4m)
 * - Front foot turned inward (L-shape)
 * - Back foot pointing forward
 * - Weight 50/50 for quick lateral shifts
 *
 * Combat Application:
 * - Pressure point sequences
 * - +10% chaining speed on pressure sequences
 * - +10% lateral movement
 *
 * ENHANCED: Staggered guard - lead hand forward but elbow guards, rear protects chin
 *
 * @korean 손괘방어포즈
 */
export const SON_WIND_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    shoulder: new THREE.Euler(-0.7, 0.5, 0.3), // Lead arm forward but controlled
    elbow: new THREE.Euler(0, 0, -1.8), // Elbow guards left ribs
    wrist: new THREE.Euler(0, 0.3, 0.2), // Knife hand extended
  },
  rightArm: {
    shoulder: new THREE.Euler(-1.0, -0.2, -0.5), // Rear arm at chin level
    elbow: new THREE.Euler(0, 0, 2.2), // TIGHT elbow - protects right ribs
    wrist: new THREE.Euler(0.2, -0.2, 0), // Fist protecting chin
  },
  torso: new THREE.Euler(0.1, -0.5, 0.1), // Rotation for bladed stance

  // Crane Stance (Hakdari Seogi) - ONE LEG RAISED for continuous kicks
  // Based on SON_WIND biomechanics: 170° standing leg, 45° raised leg, 100% on standing
  leftLeg: {
    hip: new THREE.Euler(1.2, 0.3, 0.2), // Left leg RAISED HIGH - knee at waist level
    knee: new THREE.Euler(2.0, 0, 0), // Raised leg deeply bent (45° = knee folded)
    ankle: new THREE.Euler(-0.4, 0.3, 0), // Foot hanging, toes pointed
  },
  rightLeg: {
    hip: new THREE.Euler(0.1, -0.15, 0), // Standing leg nearly straight
    knee: new THREE.Euler(0.18, 0, 0), // Standing knee slightly bent (170°)
    ankle: new THREE.Euler(-0.1, 0, 0), // Foot flat on ground
  },
  pelvis: new THREE.Euler(0.05, -0.6, 0.05), // Slight lean toward standing leg for balance
  stanceWidth: 0, // Zero - single leg stance
  stanceDepth: 0.2, // Standing leg slightly forward
  pelvisHeight: -0.08, // Higher for mobility (hipHeight 0.92)

  weight: "neutral",
  breathingRange: {
    min: 0.985, // Rhythmic breathing
    max: 1.015, // Sustained cycles
  },
};

/**
 * ☵ 감 (Gam) - Water: Flowing defensive guard
 *
 * Traditional Taekwondo Narani Seogi (나란이) - Parallel Stance
 * - Hands at mid-level for counters
 * - Ready for counter-grappling and sweeps
 * - Weight centered for adaptability (+10% counter speed)
 * - Breathing deep and flowing
 *
 * **Leg Position (Narani Seogi)**:
 * - Feet parallel, shoulder-width (0.5m)
 * - Natural standing position
 * - Slight knee bend for readiness
 * - Balanced, adaptive stance
 *
 * Combat Application:
 * - Flow-into counters
 * - +10% adaptability/counter speed
 * - +15 bleed on rib shots
 *
 * ENHANCED: Mid-level guard with tight elbows - hands at solar plexus, elbows protect ribs
 *
 * @korean 감괘방어포즈
 */
export const GAM_WATER_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    // ENHANCED: Flowing guard ready to redirect and counter
    shoulder: new THREE.Euler(-0.80, 0.25, 0.40), // Hands positioned to intercept and flow
    elbow: new THREE.Euler(0.10, 0, -2.1), // Elbows slightly out for circular redirections
    wrist: new THREE.Euler(0.20, 0.15, 0.10), // Wrists loose and adaptive
  },
  rightArm: {
    shoulder: new THREE.Euler(-0.75, -0.22, -0.42), // Rear hand ready for counter strikes
    elbow: new THREE.Euler(-0.10, 0, 2.15), // Mirror with slight variation for flow
    wrist: new THREE.Euler(0.18, -0.13, -0.10), // Ready to snap into counter
  },
  torso: new THREE.Euler(0.04, -0.15, 0.02), // ENHANCED: Minimal lean, adaptive neutral posture

  // ENHANCED Back Stance (Dwit Seogi) - Proper back stance for counter-attacks
  leftLeg: {
    hip: new THREE.Euler(0.18, 0.12, 0.04), // ENHANCED: Front leg lighter, natural rotation
    knee: new THREE.Euler(0.32, 0, 0), // ENHANCED: Slight bend for quick pivots (~18° flexion)
    ankle: new THREE.Euler(-0.07, 0.02, 0), // ENHANCED: Light front foot for adjustments
  },
  rightLeg: {
    hip: new THREE.Euler(-0.28, -0.12, 0.04), // ENHANCED: Back leg deeply loaded
    knee: new THREE.Euler(1.35, 0, 0), // ENHANCED: Deep back knee bend (~103° flexion)
    ankle: new THREE.Euler(-0.18, 0.03, 0), // ENHANCED: Rooted for counter power
  },
  pelvis: new THREE.Euler(0.04, -0.32, 0.02), // ENHANCED: Balanced pelvis, ready to flow
  stanceWidth: 0.48, // ENHANCED: 1.2x shoulder width for balanced flow
  stanceDepth: 0.52, // ENHANCED: Optimal depth for balance and counter
  pelvisHeight: -0.14, // ENHANCED: Lower for stability and counter power

  weight: "back", // INTENTIONAL: 70% rear weight for explosive counter (Dwit Seogi back stance)
  breathingRange: {
    min: 0.98, // ENHANCED: Calm defensive breathing
    max: 1.02, // Ready to explode on counter
  },
};

/**
 * ☶ 간 (Gan) - Mountain: Solid defensive posture
 *
 * Traditional Taekwondo Gibo Seogi (기본) - Basic Stance
 * - Arms in tight defensive position
 * - Immovable blocking stance
 * - Weight balanced for maximum stability (+15% block strength)
 * - Breathing steady and controlled
 *
 * **Leg Position (Gibo Seogi)**:
 * - Feet close together (0.3m) - NARROW
 * - Mountain-solid, immovable
 * - Knees slightly bent for shock absorption
 * - Maximum stability for blocking
 *
 * Combat Application:
 * - Impenetrable defense
 * - +15% block strength
 * - +10% counter-strike speed
 *
 * ENHANCED: High cover guard - forearms cross in front of face for maximum protection
 *
 * @korean 간괘방어포즈
 */
export const GAN_MOUNTAIN_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    shoulder: new THREE.Euler(-1.8, 0.1, 1.0), // Arms CROSSED in front of face
    elbow: new THREE.Euler(0, 0, -2.4), // Forearms crossed - X block (max anatomical flexion)
    wrist: new THREE.Euler(0.5, 0.4, 0.3), // Fists at opposite shoulders
  },
  rightArm: {
    shoulder: new THREE.Euler(-1.8, -0.1, -1.0), // Arms CROSSED - right over left
    elbow: new THREE.Euler(0, 0, 2.4), // Forearms crossed - X block (max anatomical flexion)
    wrist: new THREE.Euler(0.5, -0.4, -0.3), // Fists at opposite shoulders
  },
  torso: new THREE.Euler(0.15, 0, 0), // Chin DOWN, facing square - immovable

  // Closed Stance (Moa Seogi) - Feet TOGETHER, rooted like mountain
  // Based on GAN_MOUNTAIN biomechanics: 145° both knees, 50/50 weight, 0.6x width
  leftLeg: {
    hip: new THREE.Euler(0.1, 0.08, 0), // Feet very close together
    knee: new THREE.Euler(0.6, 0, 0), // Moderate bend (145° = 0.6 rad flex) - shock absorber
    ankle: new THREE.Euler(-0.1, 0, 0), // Flat planted firmly
  },
  rightLeg: {
    hip: new THREE.Euler(0.1, -0.08, 0), // Mirror - feet nearly touching
    knee: new THREE.Euler(0.6, 0, 0), // Moderate bend - shock absorber
    ankle: new THREE.Euler(-0.1, 0, 0), // Flat planted firmly
  },
  pelvis: new THREE.Euler(0.1, 0, 0), // Square forward - no rotation, mountain solid
  stanceWidth: 0.15, // FEET NEARLY TOGETHER - mountain solid (0.6x narrow)
  stanceDepth: 0, // Parallel - rooted
  pelvisHeight: -0.06, // Slightly lowered for stability (hipHeight 0.92)

  weight: "neutral",
  breathingRange: {
    min: 0.99, // Minimal movement
    max: 1.01, // Steady control
  },
};

/**
 * ☷ 곤 (Gon) - Earth: Grounded low guard
 *
 * Traditional Taekwondo Joong Ha Seogi (중하) - Deep Stance
 * - Hands low for ground control
 * - Ready for throws and takedowns
 * - Weight low and stable (+20% ground-control)
 * - Breathing deep from diaphragm
 *
 * **Leg Position (Joong Ha Seogi)**:
 * - VERY DEEP squat position
 * - Wide stance (0.8m) for grounding
 * - Knees bent 100° - DEEP
 * - Low center of gravity - earth connection
 *
 * Combat Application:
 * - Ground clinches and throws
 * - +20% ground-control advantage
 * - +20 bleed on takedowns
 *
 * ENHANCED: Low underhook guard - hands at hip/groin level, elbows tight to protect ribs
 *
 * @korean 곴괘방어포즈
 */
export const GON_EARTH_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    shoulder: new THREE.Euler(-0.4, 0.3, 0.5), // Arms low but elbows guard body
    elbow: new THREE.Euler(0, 0, -2.0), // TIGHT elbow - protects left ribs
    wrist: new THREE.Euler(-0.1, 0.2, 0.3), // Hands ready for underhooks
  },
  rightArm: {
    shoulder: new THREE.Euler(-0.4, -0.3, -0.5), // Mirror - both protecting
    elbow: new THREE.Euler(0, 0, 2.0), // TIGHT elbow - protects right ribs
    wrist: new THREE.Euler(-0.1, -0.2, -0.3), // Hands ready for underhooks
  },
  torso: new THREE.Euler(0.3, 0, 0), // Forward lean - ready to grapple

  // Joong Ha Seogi (Deep Squat) - SUMO wrestler position
  leftLeg: {
    hip: new THREE.Euler(0.1, 0.5, 0.4), // Legs WIDE, toes out
    knee: new THREE.Euler(1.4, 0, 0), // ~80° MAXIMUM bend - deep squat
    ankle: new THREE.Euler(-0.3, 0.2, 0), // Deep flex, toes out
  },
  rightLeg: {
    hip: new THREE.Euler(0.1, -0.5, -0.4), // Mirror - wide sumo
    knee: new THREE.Euler(1.4, 0, 0), // ~80° MAXIMUM bend - deep squat
    ankle: new THREE.Euler(-0.3, -0.2, 0), // Deep flex, toes out
  },
  pelvis: new THREE.Euler(0.2, 0, 0), // Forward tilt - low and square
  stanceWidth: 1.3, // VERY WIDE - sumo squat
  stanceDepth: 0, // Parallel feet - sumo stance
  pelvisHeight: -0.45, // EXTREMELY LOW - deep squat position

  weight: "neutral",
  breathingRange: {
    min: 0.96, // Deep diaphragm breathing
    max: 1.04, // Full power exhale
  },
};

/**
 * Stance Guard Animation Configurations
 *
 * Record mapping each trigram stance to its complete guard animation config.
 * Includes 4-6 frame breathing animation at 60fps for realistic idle behavior.
 *
 * Using Record instead of Map for better performance with small static dataset.
 *
 * Integration:
 * - Links to AnimationStateMachine for stance-specific idle states
 * - Used by SkeletalPlayer3D for rendering guard positions
 * - Integrates with StanceManager for trigram system
 *
 * @korean 자세방어애니메이션설정맵
 */
export const STANCE_GUARD_CONFIGS: Record<
  TrigramStance,
  StanceGuardAnimationConfig
> = {
  [TrigramStance.GEON]: {
    stance: TrigramStance.GEON,
    koreanName: "건",
    englishName: "Heaven",
    guardPose: GEON_HIGH_GUARD_POSE,
    breathingFrames: 6,
    fps: 60,
    loop: true,
    priority: 0,
  },
  [TrigramStance.TAE]: {
    stance: TrigramStance.TAE,
    koreanName: "태",
    englishName: "Lake",
    guardPose: TAE_FLUID_GUARD_POSE,
    breathingFrames: 6,
    fps: 60,
    loop: true,
    priority: 0,
  },
  [TrigramStance.LI]: {
    stance: TrigramStance.LI,
    koreanName: "리",
    englishName: "Fire",
    guardPose: LI_FIRE_GUARD_POSE,
    breathingFrames: 4,
    fps: 60,
    loop: true,
    priority: 0,
  },
  [TrigramStance.JIN]: {
    stance: TrigramStance.JIN,
    koreanName: "진",
    englishName: "Thunder",
    guardPose: JIN_THUNDER_GUARD_POSE,
    breathingFrames: 5,
    fps: 60,
    loop: true,
    priority: 0,
  },
  [TrigramStance.SON]: {
    stance: TrigramStance.SON,
    koreanName: "손",
    englishName: "Wind",
    guardPose: SON_WIND_GUARD_POSE,
    breathingFrames: 6,
    fps: 60,
    loop: true,
    priority: 0,
  },
  [TrigramStance.GAM]: {
    stance: TrigramStance.GAM,
    koreanName: "감",
    englishName: "Water",
    guardPose: GAM_WATER_GUARD_POSE,
    breathingFrames: 6,
    fps: 60,
    loop: true,
    priority: 0,
  },
  [TrigramStance.GAN]: {
    stance: TrigramStance.GAN,
    koreanName: "간",
    englishName: "Mountain",
    guardPose: GAN_MOUNTAIN_GUARD_POSE,
    breathingFrames: 4,
    fps: 60,
    loop: true,
    priority: 0,
  },
  [TrigramStance.GON]: {
    stance: TrigramStance.GON,
    koreanName: "곤",
    englishName: "Earth",
    guardPose: GON_EARTH_GUARD_POSE,
    breathingFrames: 5,
    fps: 60,
    loop: true,
    priority: 0,
  },
} as const;

/**
 * Get guard pose for a specific trigram stance with laterality support
 *
 * **Korean**: 자세 방어 포즈 가져오기
 *
 * Returns the appropriate guard pose for the given stance and laterality.
 * Right laterality returns the base pose; left laterality returns a mirrored version.
 * This supports authentic Korean martial arts stance differentiation:
 * - 오른발서기 (Oreun Bal Seogi): Right foot forward - base pose
 * - 왼발서기 (Oenbal Seogi): Left foot forward - mirrored pose
 *
 * @param stance - Trigram stance identifier (e.g., "geon", "tae")
 * @param laterality - Stance side: "left" or "right" (defaults to "right")
 * @returns Guard pose configuration or undefined if not found
 *
 * @example
 * ```typescript
 * // Get right Heaven stance (default)
 * const rightGeon = getGuardPoseForStance("geon", "right");
 *
 * // Get left Heaven stance (mirrored)
 * const leftGeon = getGuardPoseForStance("geon", "left");
 * // leftGeon now has left foot forward, left hand lead
 * ```
 *
 * @korean 자세방어포즈가져오기
 */
export function getGuardPoseForStance(
  stance: TrigramStance,
  laterality: StanceLaterality = "right",
): StanceGuardPose | undefined {
  const config = STANCE_GUARD_CONFIGS[stance];
  if (!config?.guardPose) {
    return undefined;
  }

  // Right laterality returns base pose
  if (laterality === "right") {
    return config.guardPose;
  }

  // Left laterality returns mirrored pose
  return mirrorGuardPose(config.guardPose);
}

/**
 * Get guard animation config for a specific trigram stance
 *
 * @param stance - Trigram stance identifier
 * @returns Complete guard animation configuration or undefined if not found
 *
 * @korean 자세방어애니메이션설정가져오기
 */
export function getGuardConfigForStance(
  stance: TrigramStance,
): StanceGuardAnimationConfig | undefined {
  return STANCE_GUARD_CONFIGS[stance];
}

/**
 * Get all 16 stance guard poses (8 stances × 2 laterality options)
 *
 * **Korean**: 모든 자세 방어 포즈
 *
 * Returns a map of all possible stance+laterality combinations with their guard poses.
 * This represents the complete set of 16 distinct guard configurations in Black Trigram.
 *
 * The result is cached for performance - subsequent calls return the same Map instance.
 *
 * Format: `"stance_laterality"` → `StanceGuardPose`
 * - Example keys: "geon_left", "geon_right", "tae_left", "tae_right", etc.
 *
 * @returns Map of all 16 stance guard pose configurations
 *
 * @korean 모든자세방어포즈
 */
let cachedAllPoses: Map<string, StanceGuardPose> | null = null;

export function getAllStanceGuardPoses(): Map<string, StanceGuardPose> {
  // Return cached result if available for performance
  if (cachedAllPoses) {
    return cachedAllPoses;
  }

  const allPoses = new Map<string, StanceGuardPose>();

  // For each trigram stance
  Object.values(TrigramStance).forEach((stance) => {
    // Add right laterality (base pose)
    const rightPose = getGuardPoseForStance(stance, "right");
    if (rightPose) {
      allPoses.set(`${stance}_right`, rightPose);
    }

    // Add left laterality (mirrored pose)
    const leftPose = getGuardPoseForStance(stance, "left");
    if (leftPose) {
      allPoses.set(`${stance}_left`, leftPose);
    }
  });

  // Cache the result
  cachedAllPoses = allPoses;
  return allPoses;
}
