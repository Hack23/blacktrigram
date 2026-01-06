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

import * as THREE from "three";
import type { StanceGuardPose, StanceGuardAnimationConfig } from "../../types/skeletal";
import { mirrorGuardPose } from "../../types/skeletal";
import { TrigramStance } from "../../types/common";
import type { StanceLaterality } from "../trigram/types";

/**
 * ☰ 건 (Geon) - Heaven: High guard with strong forward presence
 * 
 * Traditional Taekwondo Ap Seogi (앞서기) - Walking Stance
 * - Both hands raised high (shoulder level or above)
 * - Ready to deliver powerful overhead strikes
 * - Weight slightly forward for aggressive positioning
 * - Breathing emphasizes chest expansion for power generation
 * 
 * Combat Application:
 * - Direct frontal bone-breaking strikes
 * - High mobility (+15% movement speed from game-design.md)
 * - Bone-break attacks (+10% startup time)
 * 
 * ENHANCED: Increased rotation angles for clearer visual distinction
 * 
 * @korean 건괘방어포즈
 */
export const GEON_HIGH_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    shoulder: new THREE.Euler(-0.8, 0.6, 0.2), // Raised HIGH, forward
    elbow: new THREE.Euler(0, 1.2, 0),         // Bent 70 degrees - DISTINCT
    wrist: new THREE.Euler(0.3, 0.1, 0),       // Flexed upward
  },
  rightArm: {
    shoulder: new THREE.Euler(-0.8, -0.6, -0.2), // Raised HIGH, forward
    elbow: new THREE.Euler(0, -1.2, 0),          // Bent 70 degrees - DISTINCT
    wrist: new THREE.Euler(0.3, -0.1, 0),        // Flexed upward
  },
  torso: new THREE.Euler(0.15, 0, 0), // INCREASED forward lean - DISTINCT
  weight: "forward",
  breathingRange: {
    min: 0.98,  // Slight chest expansion
    max: 1.02,  // Exhale contraction
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
 * Combat Application:
 * - Joint locks and throwing techniques
 * - +15% reach for throws/sweeps
 * - +10% takedown damage
 * 
 * ENHANCED: One arm extended forward, one back - ASYMMETRIC for clear distinction
 * 
 * @korean 태괘방어포즈
 */
export const TAE_FLUID_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    shoulder: new THREE.Euler(-0.4, 0.9, 0.4),   // EXTENDED forward - DISTINCT
    elbow: new THREE.Euler(0, 0.4, 0),           // Nearly straight - reaching
    wrist: new THREE.Euler(0.2, 0.3, 0),         // Open hand ready to grip
  },
  rightArm: {
    shoulder: new THREE.Euler(-0.5, -0.7, -0.4), // Pulled back - defensive
    elbow: new THREE.Euler(0, -1.1, 0),          // BENT tight - guard
    wrist: new THREE.Euler(0.2, -0.3, 0),        // Ready to deflect
  },
  torso: new THREE.Euler(0.15, 0.2, 0), // Forward, ROTATED for reach - DISTINCT
  weight: "forward",
  breathingRange: {
    min: 0.97,  // Smooth inhale
    max: 1.03,  // Full exhale for fluid motion
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
 * Combat Application:
 * - Precise vital point strikes
 * - +15% stability vs. vital strikes
 * - +10% knockdown resistance
 * 
 * ENHANCED: Both arms forward - AGGRESSIVE double-jab ready position - DISTINCT
 * 
 * @korean 리괘방어포즈
 */
export const LI_FIRE_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    shoulder: new THREE.Euler(-0.3, 0.8, 0.5),   // FORWARD aggressive - DISTINCT
    elbow: new THREE.Euler(0, 0.5, 0),           // Slightly bent - ready to strike
    wrist: new THREE.Euler(0, 0.1, 0),           // Straight for piercing
  },
  rightArm: {
    shoulder: new THREE.Euler(-0.3, -0.6, -0.3), // ALSO forward but lower - DISTINCT
    elbow: new THREE.Euler(0, -0.6, 0),          // Bent ready position
    wrist: new THREE.Euler(0.1, -0.1, 0),        // Ready to strike
  },
  torso: new THREE.Euler(0.05, 0.3, 0), // HEAVY rotation for power - DISTINCT
  weight: "neutral",
  breathingRange: {
    min: 0.99,  // Shallow, controlled breathing
    max: 1.01,  // Precision focus
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
 * Combat Application:
 * - Nerve strike warfare
 * - +15% shock damage on nerve strikes
 * - -30 consciousness on head hits
 * 
 * ENHANCED: Arms PULLED BACK tight to body - coiled spring - VERY DISTINCT
 * 
 * @korean 진괘방어포즈
 */
export const JIN_THUNDER_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    shoulder: new THREE.Euler(-0.8, 0.3, 0.7),   // Chambered TIGHT to body - DISTINCT
    elbow: new THREE.Euler(0, 1.4, 0),           // VERY tightly bent - 80 degrees
    wrist: new THREE.Euler(0.4, 0.1, 0),         // Cocked for strike
  },
  rightArm: {
    shoulder: new THREE.Euler(-0.8, -0.3, -0.7), // Chambered TIGHT to body - DISTINCT
    elbow: new THREE.Euler(0, -1.4, 0),          // VERY tightly bent - 80 degrees
    wrist: new THREE.Euler(0.4, -0.1, 0),        // Cocked for strike
  },
  torso: new THREE.Euler(-0.15, 0, 0), // INCREASED backward lean - DISTINCT
  weight: "back",
  breathingRange: {
    min: 0.96,  // Deep inhale for power
    max: 1.04,  // Explosive exhale
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
 * Combat Application:
 * - Pressure point sequences
 * - +10% chaining speed on pressure sequences
 * - +10% lateral movement
 * 
 * ENHANCED: Hands in windmill pattern - one high, one low - VERY DISTINCT
 * 
 * @korean 손괘방어포즈
 */
export const SON_WIND_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    shoulder: new THREE.Euler(-0.7, 0.7, 0.5),   // HIGH - windmill top - DISTINCT
    elbow: new THREE.Euler(0, 0.6, 0),           // Extended up
    wrist: new THREE.Euler(0.2, 0.4, 0),         // Rotated outward
  },
  rightArm: {
    shoulder: new THREE.Euler(-0.1, -0.7, -0.3), // LOW - windmill bottom - DISTINCT
    elbow: new THREE.Euler(0, -0.5, 0),          // Extended down
    wrist: new THREE.Euler(-0.1, -0.4, 0),       // Rotated downward
  },
  torso: new THREE.Euler(0.05, -0.25, 0), // ROTATED for circular motion - DISTINCT
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
 * Combat Application:
 * - Flow-into counters
 * - +10% adaptability/counter speed
 * - +15 bleed on rib shots
 * 
 * ENHANCED: Hands VERY LOW - waist level - sweep ready - DISTINCT
 * 
 * @korean 감괘방어포즈
 */
export const GAM_WATER_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    shoulder: new THREE.Euler(-0.1, 0.5, 0.6),   // VERY LOW - waist level - DISTINCT
    elbow: new THREE.Euler(0, 0.8, 0),           // Bent for flow
    wrist: new THREE.Euler(-0.2, 0.3, 0),        // Downward ready
  },
  rightArm: {
    shoulder: new THREE.Euler(-0.1, -0.5, -0.6), // VERY LOW - waist level - DISTINCT
    elbow: new THREE.Euler(0, -0.8, 0),          // Bent for flow
    wrist: new THREE.Euler(-0.2, -0.3, 0),       // Downward ready
  },
  torso: new THREE.Euler(0, 0, 0), // Centered, no rotation
  weight: "neutral",
  breathingRange: {
    min: 0.97,  // Deep, flowing inhale
    max: 1.03,  // Full exhale for counter
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
 * Combat Application:
 * - Impenetrable defense
 * - +15% block strength
 * - +10% counter-strike speed
 * 
 * ENHANCED: Arms crossed in front of face - full defensive shell - VERY DISTINCT
 * 
 * @korean 간괘방어포즈
 */
export const GAN_MOUNTAIN_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    shoulder: new THREE.Euler(-0.7, 0.2, 0.8),   // CROSSED in front - DISTINCT
    elbow: new THREE.Euler(0, 1.3, 0),           // VERY tightly bent - full cover
    wrist: new THREE.Euler(0.3, 0.2, 0),         // Protective
  },
  rightArm: {
    shoulder: new THREE.Euler(-0.7, -0.2, -0.8), // CROSSED in front - DISTINCT
    elbow: new THREE.Euler(0, -1.3, 0),          // VERY tightly bent - full cover
    wrist: new THREE.Euler(0.3, -0.2, 0),        // Protective
  },
  torso: new THREE.Euler(0, 0, 0), // Straight, unmoved
  weight: "neutral",
  breathingRange: {
    min: 0.99,  // Minimal movement
    max: 1.01,  // Steady control
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
 * Combat Application:
 * - Ground clinches and throws
 * - +20% ground-control advantage
 * - +20 bleed on takedowns
 * 
 * ENHANCED: Hands at KNEE level - grappling ready - VERY DISTINCT
 * 
 * @korean 곤괘방어포즈
 */
export const GON_EARTH_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    shoulder: new THREE.Euler(0.1, 0.4, 0.8),    // VERY LOW - knee level - DISTINCT
    elbow: new THREE.Euler(0, 0.9, 0),           // Bent for grappling
    wrist: new THREE.Euler(-0.3, 0.2, 0),        // Downward grip
  },
  rightArm: {
    shoulder: new THREE.Euler(0.1, -0.4, -0.8),  // VERY LOW - knee level - DISTINCT
    elbow: new THREE.Euler(0, -0.9, 0),          // Bent for grappling
    wrist: new THREE.Euler(-0.3, -0.2, 0),       // Downward grip
  },
  torso: new THREE.Euler(-0.08, 0, 0), // INCREASED forward, low - DISTINCT
  weight: "neutral",
  breathingRange: {
    min: 0.96,  // Deep diaphragm breathing
    max: 1.04,  // Full power exhale
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
export const STANCE_GUARD_CONFIGS: Record<TrigramStance, StanceGuardAnimationConfig> = {
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
