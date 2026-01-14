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
 * ENHANCED: Proper boxing-style guard - elbows tight, hands protect chin/temple
 *
 * @korean 건괘방어포즈
 */
export const GEON_HIGH_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    shoulder: new THREE.Euler(-1.5, 0.3, 0.8), // VERY HIGH - arms up like victory pose
    elbow: new THREE.Euler(0, 0, -1.8), // Bent outward - ready to hammer down
    wrist: new THREE.Euler(0.5, 0.3, 0), // Fists above head level
  },
  rightArm: {
    shoulder: new THREE.Euler(-1.5, -0.3, -0.8), // Mirror - both arms raised high
    elbow: new THREE.Euler(0, 0, 1.8), // Bent outward - ready to hammer down
    wrist: new THREE.Euler(0.5, -0.3, 0), // Fists above head level
  },
  torso: new THREE.Euler(0.2, -0.4, 0), // Strong forward lean - aggressive

  // Ap Seogi (Walking Stance) - Natural, mobile leg position
  leftLeg: {
    hip: new THREE.Euler(0.15, 0.2, 0), // Forward + rotated outward
    knee: new THREE.Euler(0.25, 0, 0), // 25° bend - spring loaded
    ankle: new THREE.Euler(-0.12, 0, 0), // Ready stance
  },
  rightLeg: {
    hip: new THREE.Euler(0.08, -0.2, 0), // Back + rotated inward
    knee: new THREE.Euler(0.2, 0, 0), // 20° bend - stable base
    ankle: new THREE.Euler(-0.1, 0, 0), // Natural position
  },
  pelvis: new THREE.Euler(0.1, -0.5, 0), // Forward tilt + ~30° side stance
  stanceWidth: 0.55, // Shoulder width - mobile
  stanceDepth: 0.15, // Slight forward stance
  pelvisHeight: 0, // Normal standing height

  weight: "forward",
  breathingRange: {
    min: 0.98, // Slight chest expansion
    max: 1.02, // Exhale contraction
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
 * ENHANCED: Lead hand parries, rear hand protects chin - grappling ready
 *
 * @korean 태괘방어포즈
 */
export const TAE_FLUID_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    shoulder: new THREE.Euler(-0.4, 1.0, 0.3), // Lead arm EXTENDED FAR FORWARD - reaching
    elbow: new THREE.Euler(0, 0, -0.8), // Almost straight - maximum reach
    wrist: new THREE.Euler(0.1, 0.4, 0.2), // Open palm facing down - grappling ready
  },
  rightArm: {
    shoulder: new THREE.Euler(-1.2, -0.3, -0.6), // Rear arm at hip - ready to pull
    elbow: new THREE.Euler(0, 0, 2.0), // Bent at hip - underhook position
    wrist: new THREE.Euler(0.3, -0.2, 0), // Fist at hip for power
  },
  torso: new THREE.Euler(0.25, -0.6, 0.1), // Deep forward lean + strong rotation

  // Ap Koobi Seogi (Front Stance) - VERY DEEP lunge position
  leftLeg: {
    hip: new THREE.Euler(0.6, 0.25, 0), // Deep forward lunge
    knee: new THREE.Euler(1.2, 0, 0), // ~70° VERY DEEP bend - power stance
    ankle: new THREE.Euler(-0.25, 0, 0), // Deep dorsiflexion
  },
  rightLeg: {
    hip: new THREE.Euler(-0.2, -0.25, 0), // Extended far back
    knee: new THREE.Euler(0.05, 0, 0), // Nearly locked straight
    ankle: new THREE.Euler(-0.03, 0, 0), // Heel firmly planted
  },
  pelvis: new THREE.Euler(0.15, -0.7, 0), // Strong forward tilt + ~40° side stance
  stanceWidth: 0.7, // Moderate width
  stanceDepth: 1.2, // VERY DEEP front lunge - dramatic difference
  pelvisHeight: -0.2, // Lowered for deep lunge

  weight: "forward",
  breathingRange: {
    min: 0.97, // Smooth inhale
    max: 1.03, // Full exhale for fluid motion
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
    elbow: new THREE.Euler(0, 0, -2.5), // Super tight - fists at temples
    wrist: new THREE.Euler(0.4, 0.15, 0), // Fists glued to cheekbones
  },
  rightArm: {
    shoulder: new THREE.Euler(-1.6, -0.2, -0.9), // Mirror - dramatic peekaboo
    elbow: new THREE.Euler(0, 0, 2.5), // Super tight - fists at temples
    wrist: new THREE.Euler(0.4, -0.15, 0), // Fists glued to cheekbones
  },
  torso: new THREE.Euler(0.15, 0, 0), // Chin tucked, facing SQUARE forward

  // Juchum Seogi (Horse Stance) - VERY WIDE, VERY LOW
  leftLeg: {
    hip: new THREE.Euler(0, 0.4, 0.35), // Legs spread WIDE apart, toes out
    knee: new THREE.Euler(1.1, 0, 0), // ~63° DEEP bend - sumo low
    ankle: new THREE.Euler(-0.2, 0.15, 0), // Toes pointed outward
  },
  rightLeg: {
    hip: new THREE.Euler(0, -0.4, -0.35), // Mirror - legs spread wide
    knee: new THREE.Euler(1.1, 0, 0), // ~63° DEEP bend - sumo low
    ankle: new THREE.Euler(-0.2, -0.15, 0), // Toes pointed outward
  },
  pelvis: new THREE.Euler(0.05, 0, 0), // Slight forward tilt, SQUARE to opponent
  stanceWidth: 1.5, // MAXIMUM width horse stance
  stanceDepth: 0, // Parallel feet - perfect horse stance
  pelvisHeight: -0.35, // VERY LOW center of gravity

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
 * ENHANCED: Chambered guard - fists at ribs ready to explode, elbows protect body
 *
 * @korean 진괘방어포즈
 */
export const JIN_THUNDER_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    shoulder: new THREE.Euler(-0.3, 0.15, 0.9), // Arm DOWN at hip - fully chambered
    elbow: new THREE.Euler(0, 0, -2.8), // MAXIMUM chamber - fist at waist
    wrist: new THREE.Euler(0.6, 0.1, 0), // Fist palm-up at hip bone
  },
  rightArm: {
    shoulder: new THREE.Euler(-0.3, -0.15, -0.9), // Mirror - both at hips
    elbow: new THREE.Euler(0, 0, 2.8), // MAXIMUM chamber - fist at waist
    wrist: new THREE.Euler(0.6, -0.1, 0), // Fist palm-up at hip bone
  },
  torso: new THREE.Euler(-0.2, -0.8, 0.05), // Backward lean + STRONG rotation - coiled

  // Dwi Koobi Seogi (Back Stance) - Weight HEAVILY back, coiled spring
  leftLeg: {
    hip: new THREE.Euler(0.2, 0.3, 0), // Front leg very light - toe touch
    knee: new THREE.Euler(0.15, 0, 0), // Almost straight front leg
    ankle: new THREE.Euler(-0.3, 0, 0), // On ball of foot only
  },
  rightLeg: {
    hip: new THREE.Euler(-0.15, -0.3, 0), // Back leg LOADED
    knee: new THREE.Euler(1.0, 0, 0), // ~57° DEEP bend - coiled spring
    ankle: new THREE.Euler(-0.25, 0, 0), // Firmly rooted
  },
  pelvis: new THREE.Euler(-0.15, -0.9, 0), // Back tilt + ~50° side stance - VERY rotated
  stanceWidth: 0.5, // Narrower - spring loaded
  stanceDepth: 0.9, // Deep back stance - dramatic weight shift
  pelvisHeight: -0.15, // Lowered for explosive power

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
 * ENHANCED: Staggered guard - lead hand forward, rear protects chin, ready for combos
 *
 * @korean 손괘방어포즈
 */
export const SON_WIND_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    shoulder: new THREE.Euler(-0.5, 1.2, 0.2), // Lead arm POINTING FORWARD like fencer
    elbow: new THREE.Euler(0, 0, -0.5), // ALMOST STRAIGHT - maximum reach
    wrist: new THREE.Euler(0, 0.5, 0.3), // Knife hand extended - spear finger
  },
  rightArm: {
    shoulder: new THREE.Euler(-0.6, -0.8, -0.4), // Rear arm BACK - counterbalance
    elbow: new THREE.Euler(0, 0, 1.6), // Bent back near hip
    wrist: new THREE.Euler(0.3, -0.3, 0), // Hand near rear hip
  },
  torso: new THREE.Euler(0.1, -0.7, 0.1), // Strong rotation - bladed stance

  // Niunja Seogi (L-Stance) - Perpendicular feet, narrow
  leftLeg: {
    hip: new THREE.Euler(0.1, 0.6, 0), // Front foot turned 90° inward
    knee: new THREE.Euler(0.5, 0, 0), // Moderate bend
    ankle: new THREE.Euler(-0.15, 0.4, 0), // Toe pointing to the side
  },
  rightLeg: {
    hip: new THREE.Euler(0, 0, 0), // Back foot pointing forward
    knee: new THREE.Euler(0.5, 0, 0), // Moderate bend
    ankle: new THREE.Euler(-0.1, 0, 0), // Natural forward position
  },
  pelvis: new THREE.Euler(0, -0.8, 0), // ~45° side stance - VERY bladed
  stanceWidth: 0.35, // VERY NARROW - fencing stance
  stanceDepth: 0.5, // L-shaped foot offset
  pelvisHeight: -0.05, // Slight crouch

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
 * - Hands low and flowing
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
 * ENHANCED: Mid-level guard - hands at solar plexus, ready to parry and counter
 *
 * @korean 감괘방어포즈
 */
export const GAM_WATER_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    shoulder: new THREE.Euler(-0.2, 0.7, 0.3), // Arm LOW and FORWARD - wave motion
    elbow: new THREE.Euler(0, 0, -1.2), // Flowing bend
    wrist: new THREE.Euler(-0.3, 0.4, 0.5), // Palm DOWN - pushing water
  },
  rightArm: {
    shoulder: new THREE.Euler(-0.2, -0.7, -0.3), // Mirror - both low
    elbow: new THREE.Euler(0, 0, 1.2), // Flowing bend
    wrist: new THREE.Euler(-0.3, -0.4, -0.5), // Palm DOWN - pushing water
  },
  torso: new THREE.Euler(0.1, -0.3, 0.1), // Slight lean + wave motion

  // Narani Seogi (Parallel Stance) - Soft knees, ready to flow
  leftLeg: {
    hip: new THREE.Euler(0.05, 0.15, 0), // Slight outward
    knee: new THREE.Euler(0.4, 0, 0), // Softer knees for flow
    ankle: new THREE.Euler(-0.1, 0, 0), // Ready to shift
  },
  rightLeg: {
    hip: new THREE.Euler(0.05, -0.15, 0), // Slight inward
    knee: new THREE.Euler(0.4, 0, 0), // Softer knees for flow
    ankle: new THREE.Euler(-0.1, 0, 0), // Ready to shift
  },
  pelvis: new THREE.Euler(0.08, -0.35, 0.05), // Slight sway - water motion
  stanceWidth: 0.6, // Comfortable width
  stanceDepth: 0.1, // Slight offset for flow
  pelvisHeight: -0.08, // Slightly lower - knees soft

  weight: "neutral",
  breathingRange: {
    min: 0.97, // Deep, flowing inhale
    max: 1.03, // Full exhale for counter
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
    elbow: new THREE.Euler(0, 0, -2.6), // Forearms crossed - X block
    wrist: new THREE.Euler(0.5, 0.4, 0.3), // Fists at opposite shoulders
  },
  rightArm: {
    shoulder: new THREE.Euler(-1.8, -0.1, -1.0), // Arms CROSSED - right over left
    elbow: new THREE.Euler(0, 0, 2.6), // Forearms crossed - X block
    wrist: new THREE.Euler(0.5, -0.4, -0.3), // Fists at opposite shoulders
  },
  torso: new THREE.Euler(0.15, 0, 0), // Chin DOWN, facing square - immovable

  // Moa Seogi (Closed Stance) - Feet TOGETHER, rooted
  leftLeg: {
    hip: new THREE.Euler(0, 0.05, 0), // Feet nearly touching
    knee: new THREE.Euler(0.15, 0, 0), // Slight bend - shock absorber
    ankle: new THREE.Euler(-0.05, 0, 0), // Flat planted
  },
  rightLeg: {
    hip: new THREE.Euler(0, -0.05, 0), // Feet nearly touching
    knee: new THREE.Euler(0.15, 0, 0), // Slight bend - shock absorber
    ankle: new THREE.Euler(-0.05, 0, 0), // Flat planted
  },
  pelvis: new THREE.Euler(0.1, 0, 0), // Square forward - no rotation
  stanceWidth: 0.15, // FEET TOGETHER - mountain solid
  stanceDepth: 0, // Parallel - rooted
  pelvisHeight: 0, // Standing tall

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
 * ENHANCED: Low underhook guard - hands at hip level, elbows in protecting ribs
 *
 * @korean 곴괘방어포즈
 */
export const GON_EARTH_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    shoulder: new THREE.Euler(0.2, 0.6, 0.4), // Arms DOWN on thighs - sumo style
    elbow: new THREE.Euler(0, 0, -1.4), // Hands resting on inner thighs
    wrist: new THREE.Euler(-0.2, 0.3, 0.4), // Palms on thighs
  },
  rightArm: {
    shoulder: new THREE.Euler(0.2, -0.6, -0.4), // Mirror - both on thighs
    elbow: new THREE.Euler(0, 0, 1.4), // Hands resting on inner thighs
    wrist: new THREE.Euler(-0.2, -0.3, -0.4), // Palms on thighs
  },
  torso: new THREE.Euler(0.35, 0, 0), // HEAVY forward lean - ready to pounce

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
  laterality: StanceLaterality = "right"
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
  stance: TrigramStance
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
