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
 * - Hands at solar plexus level protecting ribs and vital organs
 * - Elbows tight to body for defensive integrity
 * - Weight slightly forward for aggressive positioning
 * - Breathing emphasizes chest expansion for power generation
 *
 * **Leg Position (Ap Seogi)**:
 * - Front leg hip flexion 45°, knee flexion 30° (knee over toes)
 * - Back leg slight extension, knee never locked (10° flexion)
 * - Proper weight distribution prevents falling backward
 * - Natural, mobile stance for quick movement
 *
 * Combat Application:
 * - Direct frontal bone-breaking strikes
 * - High mobility (+15% movement speed from game-design.md)
 * - Bone-break attacks (+10% startup time)
 *
 * CORRECTED: Authentic Korean guard - hands at solar plexus (-0.7 rad shoulder),
 * elbows tight to protect ribs (2.0 rad), proper forward stance biomechanics
 *
 * @korean 건괘방어포즈
 */
export const GEON_HIGH_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    shoulder: new THREE.Euler(-0.7, 0.15, 0.35), // Solar plexus level - protects liver/ribs
    elbow: new THREE.Euler(0, 0, -2.0), // Tight to ribs (115° flexion) - rib protection
    wrist: new THREE.Euler(0, 0.1, 0), // Neutral ready position - fists ready to strike
  },
  rightArm: {
    shoulder: new THREE.Euler(-0.7, -0.15, -0.35), // Mirror - balanced guard at solar plexus
    elbow: new THREE.Euler(0, 0, 2.0), // Tight to ribs - protects floating ribs
    wrist: new THREE.Euler(0, -0.1, 0), // Neutral ready position
  },
  torso: new THREE.Euler(0.1, -0.3, 0), // Slight forward lean - aggressive but balanced

  // Ap Seogi (Forward Stance) - CORRECTED biomechanics
  // Front leg: 45° hip flexion, 30° knee flexion (knee over toes)
  // Back leg: -10° hip extension, 10° knee flexion (never locked)
  leftLeg: {
    hip: new THREE.Euler(-0.17, 0.15, 0), // Back leg slight extension (-10°) - power push
    knee: new THREE.Euler(0.17, 0, 0), // Back knee 10° flexion - never locked straight
    ankle: new THREE.Euler(-0.26, 0, 0), // Plantarflexion -15° - heel down, toes push
  },
  rightLeg: {
    hip: new THREE.Euler(0.78, -0.15, 0), // Front leg 45° hip flexion - thigh forward
    knee: new THREE.Euler(0.52, 0, 0), // Front knee 30° flexion - knee over toes
    ankle: new THREE.Euler(-0.35, 0, 0), // Dorsiflexion -20° - shin angled forward
  },
  pelvis: new THREE.Euler(0.15, -0.5, 0), // Forward tilt + side stance for power
  stanceWidth: 0.6, // 1.35x shoulder width (40cm standard * 1.35)
  stanceDepth: 0.6, // Deep forward/back split
  pelvisHeight: -0.10, // Corrected hip height (0.90m) - prevents backward fall

  weight: "forward",
  breathingRange: {
    min: 0.98, // Slight chest expansion
    max: 1.02, // Exhale contraction
  },
};

/**
 * ☱ 태 (Tae) - Lake: Fluid mid-guard with adaptive positioning
 *
 * Traditional Taekwondo Cat Stance (Beom Seogi - 범서기)
 * - Lead hand at mid-chest, rear hand protects chin
 * - Elbows tight to body protecting ribs
 * - Weight on back leg for adaptability (+15% reach from game-design.md)
 * - Breathing flows smoothly for continuous adaptation
 *
 * **Leg Position (Beom Seogi - Cat Stance)**:
 * - Front leg light (30% weight), nearly straight (170°)
 * - Back leg loaded (70% weight), bent deeply (120°)
 * - Spring-loaded for quick movements
 * - Narrow stance for mobility
 *
 * Combat Application:
 * - Joint locks and throwing techniques
 * - +15% reach for throws/sweeps
 * - +10% takedown damage
 *
 * CORRECTED: Proper Korean bladed guard - lead hand forward but bent elbow,
 * rear hand protecting chin, both elbows tight to ribs (2.0-2.2 rad)
 *
 * @korean 태괘방어포즈
 */
export const TAE_FLUID_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    shoulder: new THREE.Euler(-0.7, 0.5, 0.25), // Lead hand mid-chest - controlled extension
    elbow: new THREE.Euler(0, 0, -1.9), // Elbow bent for rib protection (110° flexion)
    wrist: new THREE.Euler(0.1, 0.3, 0.2), // Open palm for grappling
  },
  rightArm: {
    shoulder: new THREE.Euler(-0.7, -0.15, -0.35), // Rear hand at solar plexus
    elbow: new THREE.Euler(0, 0, 2.1), // Tight elbow - protects ribs (120° flexion)
    wrist: new THREE.Euler(0, -0.1, 0), // Fist ready to counter
  },
  torso: new THREE.Euler(0.2, -0.5, 0.1), // Forward lean + rotation for reach

  // Cat Stance (Beom Seogi) - Back-weighted fluid position
  // Based on TAE_LAKE biomechanics: 170° front leg (light), 120° back knee (loaded)
  leftLeg: {
    hip: new THREE.Euler(0.1, 0.2, 0), // Front leg light, nearly straight
    knee: new THREE.Euler(0.18, 0, 0), // Front knee almost straight (170° ≈ 0.18 rad flex)
    ankle: new THREE.Euler(-0.08, 0, 0), // Light touch on ground
  },
  rightLeg: {
    hip: new THREE.Euler(-0.3, -0.25, 0), // Back leg loaded, bent back
    knee: new THREE.Euler(1.05, 0, 0), // Deep back knee bend (120° = 1.05 rad flex)
    ankle: new THREE.Euler(-0.2, 0, 0), // Deep flexion, spring loaded
  },
  pelvis: new THREE.Euler(0.1, -0.7, 0), // Slight forward tilt + strong side stance
  stanceWidth: 0.4, // 0.9x narrow stance for mobility
  stanceDepth: 0.4, // Moderate front/back split
  pelvisHeight: -0.1, // Slightly lowered (hipHeight 0.90)

  weight: "forward",
  breathingRange: {
    min: 0.97, // Smooth inhale
    max: 1.03, // Full exhale for fluid motion
  },
};

/**
 * ☲ 리 (Li) - Fire: Aggressive forward guard
 *
 * Traditional Taekwondo Fighting Stance (Gyeorugi Junbi - 겨루기 준비)
 * - Korean bladed guard: lead hand forward, rear hand protecting chin
 * - Elbows tight to body protecting ribs (NOT peekaboo style)
 * - Weight neutral but low center of gravity
 * - Breathing controlled for precision (+5% crit hit chance)
 *
 * **Leg Position (Gyeorugi Junbi)**:
 * - Balanced fighting stance - both knees bent 135°
 * - Feet shoulder-width apart, slight stagger
 * - 50/50 weight distribution for mobility
 * - Ready for explosive strikes
 *
 * Combat Application:
 * - Precise vital point strikes
 * - +15% stability vs. vital strikes
 * - +10% knockdown resistance
 *
 * CORRECTED: Korean bladed guard replaces boxing peekaboo - lead hand extends
 * at chest level, rear hand protects chin, elbows tight (NOT flared out)
 *
 * @korean 리괘방어포즈
 */
export const LI_FIRE_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    shoulder: new THREE.Euler(-0.65, 0.4, 0.2), // Lead hand extended at chest level - parry position
    elbow: new THREE.Euler(0, 0, -1.7), // Elbow bent 100° - maintains rib protection
    wrist: new THREE.Euler(0.1, 0.2, 0), // Fist ready to strike or parry
  },
  rightArm: {
    shoulder: new THREE.Euler(-0.7, -0.15, -0.35), // Rear hand at chin/solar plexus - protection
    elbow: new THREE.Euler(0, 0, 2.0), // Tight elbow - protects right ribs (115° flexion)
    wrist: new THREE.Euler(0, -0.1, 0), // Fist guarding chin
  },
  torso: new THREE.Euler(0.1, -0.4, 0), // Bladed stance - torso rotated 25°

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
 * Traditional Taekwondo Horse Stance (Juchum Seogi - 주춤서기)
 * - Hands at mid-chest level, chambered for explosive release
 * - Elbows tight to protect ribs
 * - Deep horse stance with knees tracking over toes (NO valgus collapse)
 * - Breathing deep for power generation
 *
 * **Leg Position (Juchum Seogi - Horse Stance)**:
 * - Very wide stance (2.0x shoulder width)
 * - Both knees bent 80° (NOT full 90° - maintains power reserve)
 * - Knees MUST track over toes - no inward collapse
 * - 50/50 weight distribution, very low
 *
 * Combat Application:
 * - Nerve strike warfare
 * - +15% shock damage on nerve strikes
 * - -30 consciousness on head hits
 *
 * CORRECTED: Proper horse stance biomechanics - 80° knee flexion (not 90°),
 * hip external rotation ensures knees track over toes (prevents valgus collapse),
 * hands raised to mid-chest for rib protection
 *
 * @korean 진괘방어포즈
 */
export const JIN_THUNDER_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    shoulder: new THREE.Euler(-0.7, 0.15, 0.4), // Hands at mid-chest - not too low
    elbow: new THREE.Euler(0, 0, -2.1), // Tight elbow - protects left ribs (120° flexion)
    wrist: new THREE.Euler(0.2, 0.1, 0), // Chambered fist ready to explode
  },
  rightArm: {
    shoulder: new THREE.Euler(-0.7, -0.15, -0.4), // Mirror - balanced mid-chest guard
    elbow: new THREE.Euler(0, 0, 2.1), // Tight elbow - protects right ribs (120° flexion)
    wrist: new THREE.Euler(0.2, -0.1, 0), // Chambered fist ready to strike
  },
  torso: new THREE.Euler(0.1, 0, 0), // Square facing forward - horse stance posture

  // Horse Stance (Juchum Seogi) - CORRECTED biomechanics
  // 80° knee flexion (not 90°), proper hip rotation for knee tracking
  leftLeg: {
    hip: new THREE.Euler(0.3, 0.7, 0.15), // Hip external rotation 0.7 rad (40°), abduction 0.15
    knee: new THREE.Euler(1.4, 0, 0), // 80° knee flexion (1.4 rad) - NOT full 90°
    ankle: new THREE.Euler(-0.35, 0.3, 0), // Dorsiflexion + 30° external rotation (toes 45° out)
  },
  rightLeg: {
    hip: new THREE.Euler(0.3, -0.7, -0.15), // Mirror - external rotation ensures knee tracks toes
    knee: new THREE.Euler(1.4, 0, 0), // 80° knee flexion - maintains power reserve
    ankle: new THREE.Euler(-0.35, -0.3, 0), // Dorsiflexion + 30° external rotation (toes 45° out)
  },
  pelvis: new THREE.Euler(0.1, 0, 0), // Slight forward tilt, facing square
  stanceWidth: 0.9, // VERY WIDE (2.0x shoulder width)
  stanceDepth: 0, // Parallel feet - horse stance
  pelvisHeight: -0.21, // VERY LOW but thighs near parallel (not below) - hipHeight 0.79

  weight: "back",
  breathingRange: {
    min: 0.96, // Deep inhale for power
    max: 1.04, // Explosive exhale
  },
};

/**
 * ☴ 손 (Son) - Wind: Continuous motion guard
 *
 * Traditional Taekwondo Crane Stance (Hakdari Seogi - 학다리서기)
 * - Lead hand forward at chest level, rear hand protects
 * - Elbows remain tight even with extended lead hand
 * - One leg raised for continuous kicking (+10% lateral movement)
 * - Breathing rhythmic for sustained combos
 *
 * **Leg Position (Hakdari Seogi - Crane Stance)**:
 * - One leg raised with knee at waist level (NOT too high)
 * - Standing leg nearly straight (170°) for balance
 * - 100% weight on standing leg
 * - Pelvis height adjusted for stability
 *
 * Combat Application:
 * - Pressure point sequences
 * - +10% chaining speed on pressure sequences
 * - +10% lateral movement
 *
 * CORRECTED: Guard height lowered to chest level (not too high), pelvis raised
 * for proper crane stance balance, raised leg at appropriate height
 *
 * @korean 손괘방어포즈
 */
export const SON_WIND_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    shoulder: new THREE.Euler(-0.7, 0.4, 0.25), // Lead hand at chest level - controlled extension
    elbow: new THREE.Euler(0, 0, -1.8), // Elbow maintains rib protection (105° flexion)
    wrist: new THREE.Euler(0, 0.3, 0.2), // Knife hand extended
  },
  rightArm: {
    shoulder: new THREE.Euler(-0.7, -0.15, -0.35), // Rear hand at solar plexus
    elbow: new THREE.Euler(0, 0, 2.1), // Tight elbow - protects right ribs (120° flexion)
    wrist: new THREE.Euler(0, -0.1, 0), // Fist protecting body
  },
  torso: new THREE.Euler(0.1, -0.5, 0.1), // Rotation for bladed stance

  // Crane Stance (Hakdari Seogi) - CORRECTED balance and height
  // Raised leg at proper waist level, standing leg 170°, higher pelvis for stability
  leftLeg: {
    hip: new THREE.Euler(1.1, 0.25, 0.15), // Left leg raised to waist level (not too high)
    knee: new THREE.Euler(1.8, 0, 0), // Raised leg bent 105° (knee folded naturally)
    ankle: new THREE.Euler(-0.3, 0.2, 0), // Foot hanging naturally, toes pointed
  },
  rightLeg: {
    hip: new THREE.Euler(0.1, -0.15, 0), // Standing leg nearly straight for balance
    knee: new THREE.Euler(0.18, 0, 0), // Standing knee slightly bent 170° (10° flexion)
    ankle: new THREE.Euler(-0.1, 0, 0), // Foot flat on ground
  },
  pelvis: new THREE.Euler(0.05, -0.6, 0.05), // Slight lean toward standing leg for balance
  stanceWidth: 0, // Zero - single leg stance
  stanceDepth: 0.2, // Standing leg slightly forward
  pelvisHeight: -0.05, // Raised for crane stance stability - hipHeight 0.95m

  weight: "neutral",
  breathingRange: {
    min: 0.985, // Rhythmic breathing
    max: 1.015, // Sustained cycles
  },
};

/**
 * ☵ 감 (Gam) - Water: Flowing defensive guard
 *
 * Traditional Taekwondo Back Stance (Dwit Seogi - 뒷서기)
 * - Hands at chest level for flowing counters
 * - Elbows tight protecting ribs
 * - Weight on back leg for defensive adaptability (+10% counter speed)
 * - Breathing deep and flowing
 *
 * **Leg Position (Dwit Seogi - Back Stance)**:
 * - Front leg light (30% weight), nearly straight (160°)
 * - Back leg loaded (70% weight), deeply bent (100°)
 * - Moderate stance width for stability
 * - Back-weighted for defensive flow
 *
 * Combat Application:
 * - Flow-into counters
 * - +10% adaptability/counter speed
 * - +15 bleed on rib shots
 *
 * CORRECTED: Guard raised to chest level (not hip level), elbows tight to
 * protect ribs, proper back stance with correct weight distribution
 *
 * @korean 감괘방어포즈
 */
export const GAM_WATER_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    shoulder: new THREE.Euler(-0.7, 0.25, 0.35), // Hands at chest level - ready to flow/redirect
    elbow: new THREE.Euler(0, 0, -2.0), // Tight elbow - protects left ribs (115° flexion)
    wrist: new THREE.Euler(-0.1, 0.3, 0.3), // Palm ready to redirect attacks
  },
  rightArm: {
    shoulder: new THREE.Euler(-0.7, -0.25, -0.35), // Mirror - balanced flowing guard
    elbow: new THREE.Euler(0, 0, 2.0), // Tight elbow - protects right ribs (115° flexion)
    wrist: new THREE.Euler(-0.1, -0.3, -0.3), // Palm ready to redirect
  },
  torso: new THREE.Euler(0.1, -0.3, 0.1), // Slight lean + flowing motion

  // Back Stance (Dwit Seogi) - Defensive with weight on back leg
  // Based on GAM_WATER biomechanics: 160° front leg, 100° back knee, 30/70 weight
  leftLeg: {
    hip: new THREE.Euler(0.15, 0.2, 0), // Front leg light, almost straight
    knee: new THREE.Euler(0.35, 0, 0), // Front knee slight bend (160° = 0.35 rad flex)
    ankle: new THREE.Euler(-0.08, 0, 0), // Light on toes
  },
  rightLeg: {
    hip: new THREE.Euler(-0.25, -0.2, 0), // Back leg loaded and bent
    knee: new THREE.Euler(1.4, 0, 0), // Deep back knee bend (100° = 1.4 rad flex)
    ankle: new THREE.Euler(-0.2, 0, 0), // Rooted for stability
  },
  pelvis: new THREE.Euler(0.05, -0.4, 0.05), // Slight rotation for flow
  stanceWidth: 0.5, // 1.15x shoulder width (medium)
  stanceDepth: 0.45, // Moderate forward/back offset
  pelvisHeight: -0.12, // Medium low (hipHeight 0.82)

  weight: "neutral",
  breathingRange: {
    min: 0.97, // Deep, flowing inhale
    max: 1.03, // Full exhale for counter
  },
};

/**
 * ☶ 간 (Gan) - Mountain: Solid defensive posture
 *
 * Traditional Taekwondo Closed Stance (Moa Seogi - 모아서기)
 * - X-block arms lowered to protect body (not head)
 * - Forearms crossed at chest level protecting vital organs
 * - Feet close together for immovable stance (+15% block strength)
 * - Breathing steady and controlled
 *
 * **Leg Position (Moa Seogi - Closed Stance)**:
 * - Feet very close together (0.6x shoulder width)
 * - Both knees moderately bent (145°) for shock absorption
 * - 50/50 weight distribution, rooted like mountain
 * - Maximum stability for blocking
 *
 * Combat Application:
 * - Impenetrable defense
 * - +15% block strength
 * - +10% counter-strike speed
 *
 * CORRECTED: X-block lowered to chest/body level (not face), forearms protect
 * ribs and vital organs, proper mountain-solid stability
 *
 * @korean 간괘방어포즈
 */
export const GAN_MOUNTAIN_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    shoulder: new THREE.Euler(-0.8, 0.1, 0.7), // Arms crossed at CHEST level (not face)
    elbow: new THREE.Euler(0, 0, -2.2), // Forearms crossed - body X-block (126° flexion)
    wrist: new THREE.Euler(0.3, 0.3, 0.2), // Fists crossed protecting chest/ribs
  },
  rightArm: {
    shoulder: new THREE.Euler(-0.8, -0.1, -0.7), // Arms crossed - right over left at chest
    elbow: new THREE.Euler(0, 0, 2.2), // Forearms crossed - body X-block (126° flexion)
    wrist: new THREE.Euler(0.3, -0.3, -0.2), // Fists crossed protecting chest/ribs
  },
  torso: new THREE.Euler(0.1, 0, 0), // Square forward - immovable mountain posture

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
 * Traditional Taekwondo Deep Squat Stance (Joong Ha Seogi - 중하서기)
 * - Hands at hip level for underhooks and ground control
 * - Elbows tight to body protecting ribs even in low guard
 * - Hands closer to centerline for grappling control
 * - Weight low and stable (+20% ground-control)
 * - Breathing deep from diaphragm
 *
 * **Leg Position (Joong Ha Seogi - Deep Squat)**:
 * - VERY WIDE stance (sumo-style)
 * - Knees bent ~80° (deep but not below parallel)
 * - Toes pointed outward 45°
 * - Very low center of gravity for ground control
 *
 * Combat Application:
 * - Ground clinches and throws
 * - +20% ground-control advantage
 * - +20 bleed on takedowns
 *
 * CORRECTED: Hands brought closer to centerline (not too wide), pelvis raised
 * 5cm (thighs parallel, not below), proper underhook positioning
 *
 * @korean 곤괘방어포즈
 */
export const GON_EARTH_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    shoulder: new THREE.Euler(-0.4, 0.2, 0.4), // Arms low but hands at centerline
    elbow: new THREE.Euler(0, 0, -2.0), // Tight elbow - protects left ribs (115° flexion)
    wrist: new THREE.Euler(-0.1, 0.15, 0.2), // Hands ready for underhooks, closer together
  },
  rightArm: {
    shoulder: new THREE.Euler(-0.4, -0.2, -0.4), // Mirror - centerline control
    elbow: new THREE.Euler(0, 0, 2.0), // Tight elbow - protects right ribs (115° flexion)
    wrist: new THREE.Euler(-0.1, -0.15, -0.2), // Hands ready for underhooks
  },
  torso: new THREE.Euler(0.3, 0, 0), // Forward lean - ready to grapple

  // Joong Ha Seogi (Deep Squat) - CORRECTED height
  // Thighs parallel to ground (not below), proper 80° knee flexion
  leftLeg: {
    hip: new THREE.Euler(0.1, 0.5, 0.4), // Legs WIDE, toes out 45°
    knee: new THREE.Euler(1.4, 0, 0), // 80° knee bend - deep but not maximum
    ankle: new THREE.Euler(-0.3, 0.2, 0), // Deep flex, toes out
  },
  rightLeg: {
    hip: new THREE.Euler(0.1, -0.5, -0.4), // Mirror - wide sumo stance
    knee: new THREE.Euler(1.4, 0, 0), // 80° knee bend - thighs parallel to ground
    ankle: new THREE.Euler(-0.3, -0.2, 0), // Deep flex, toes out
  },
  pelvis: new THREE.Euler(0.2, 0, 0), // Forward tilt - low and square
  stanceWidth: 1.3, // VERY WIDE - sumo squat
  stanceDepth: 0, // Parallel feet - sumo stance
  pelvisHeight: -0.40, // VERY LOW but raised 5cm - thighs parallel (hipHeight ~0.60m)

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
