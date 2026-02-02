/**
 * ☷ Gon (Earth) Guard Positions
 *
 * Low grappling guard positions for the Gon (곤/Earth) trigram.
 * Embodies grounding and wrestling readiness from Ssireum techniques.
 *
 * **Korean Martial Arts Context:**
 * - **무술**: 씨름 자세 (Ssireum Stance)
 * - **특성**: 낮은 잡기 방어 (Low Grappling Guard)
 * - **철학**: 땅의 안정 (Earth's Stability)
 *
 * @module systems/animation/catalogs/GonGuardPoses
 * @category Animation
 * @korean 곤괘방어자세
 */

import * as THREE from "three";
import type { StanceGuardPose } from "@/types/skeletal";

/**
 * Gon Low Grappling Guard Pose - OVERHAULED
 *
 * **Korean**: 땅 방어 (Ttang Bangeo)
 * **Philosophy**: HEAVY low guard position for wrestling engagement
 *
 * **IMPROVED Features:**
 * - **Deeper Stance**: -55° knee bend (was -50°) for more grounded feel
 * - **Lower Height**: -18cm pelvis (was -15cm) creating heavier impression
 * - **Wider Base**: 1.3x shoulder width (was 1.2x) for more stability
 * - **Heavy Weight**: 27° ankle dorsiflexion (was 20°) showing loaded feet
 * - **Lower Hands**: 35° shoulder flexion (was 30°) for deeper grappling ready
 *
 * Characteristics:
 * - Hands low and forward for IMMEDIATE grappling grabs
 * - Knees DEEPLY bent for VERY low center of gravity
 * - Hips back ready to sprawl or shoot explosively
 * - Head up maintaining posture and awareness
 * - Weight HEAVILY loaded on feet - ROOTED feel
 *
 * Biomechanics:
 * - Stance width: 1.3x shoulder width (WIDER stable base)
 * - Pelvis height: -18cm (LOWER center of gravity)
 * - Knee bend: -55° (DEEPER athletic position)
 * - Hip position: -25° (hips back MORE for stability)
 * - Ankle dorsiflexion: 27° (HEAVY weight loading)
 *
 * @korean 땅방어
 * @category Guard Pose
 */
export const GON_LOW_GRAPPLING_GUARD: StanceGuardPose = {
  // Left arm - Lower forward position for grappling
  leftArm: {
    shoulder: new THREE.Euler(
      0.61,   // 35° (forward reach - LOWER!)
      0.30,   // 17° (slight abduction)
      -0.38   // -22° (internal rotation for grab)
    ),
    elbow: new THREE.Euler(
      0,      // 0° (neutral)
      0,      // 0°
      -1.48   // -85° (bent ready position - MORE bent!)
    ),
    wrist: new THREE.Euler(
      0,      // 0° (neutral wrist)
      0,      // 0°
      0       // 0°
    ),
  },

  // Right arm - Mirror of left for symmetrical guard
  rightArm: {
    shoulder: new THREE.Euler(
      0.61,   // 35° (forward reach - LOWER!)
      -0.30,  // -17° (slight abduction)
      0.38    // 22° (internal rotation for grab)
    ),
    elbow: new THREE.Euler(
      0,      // 0° (neutral)
      0,      // 0°
      1.48    // 85° (bent ready position - MORE bent!)
    ),
    wrist: new THREE.Euler(
      0,      // 0° (neutral wrist)
      0,      // 0°
      0       // 0°
    ),
  },

  // Torso - Forward lean for grappling engagement
  torso: new THREE.Euler(
    0.30,   // 17° (forward lean - MORE!)
    0,      // 0° (no rotation)
    0       // 0° (no side lean)
  ),

  // Left leg - DEEPER bend for HEAVY low center
  leftLeg: {
    hip: new THREE.Euler(
      0,      // 0° (neutral hip)
      0,      // 0°
      0       // 0°
    ),
    knee: new THREE.Euler(
      -0.96,  // -55° (DEEPER bend!)
      0,      // 0°
      0       // 0°
    ),
    ankle: new THREE.Euler(
      0.47,   // 27° (HEAVY dorsiflexion for weight)
      0,      // 0°
      0       // 0°
    ),
  },

  // Right leg - Mirror left for symmetric stance
  rightLeg: {
    hip: new THREE.Euler(
      0,      // 0° (neutral hip)
      0,      // 0°
      0       // 0°
    ),
    knee: new THREE.Euler(
      -0.96,  // -55° (DEEPER bend!)
      0,      // 0°
      0       // 0°
    ),
    ankle: new THREE.Euler(
      0.47,   // 27° (HEAVY dorsiflexion for weight)
      0,      // 0°
      0       // 0°
    ),
  },

  // Pelvis - Hips back MORE for stability
  pelvis: new THREE.Euler(
    -0.44,  // -25° (hips back MORE!)
    0,      // 0° (no rotation)
    0       // 0° (no tilt)
  ),

  // Stance width - WIDER base for MAXIMUM stability
  stanceWidth: 1.3, // 1.3x shoulder width (WIDER!)

  // Stance depth - Neutral parallel stance
  stanceDepth: 0, // 0m (feet parallel)

  // Pelvis height - LOWER for heavier grappling feel
  pelvisHeight: -0.18, // -18cm (LOWER center of gravity!)

  // Weight distribution - Neutral but HEAVY feel
  weight: "neutral",

  // Breathing range - Chest expansion in VERY low position
  breathingRange: {
    min: 0.97,  // Slight compression (more restricted in low position)
    max: 1.03,  // Slight expansion
  },
};

/**
 * Gon Defensive Sprawl Guard Pose - NEW
 *
 * **Korean**: 버티기 방어 (Beotigi Bangeo)
 * **Philosophy**: Defensive sprawl position blocking takedown attempts
 *
 * Characteristics:
 * - Hips pushed back and down (sprawling position)
 * - Legs extended back to block takedown
 * - Chest forward and down over opponent
 * - Hands posted forward for base/control
 * - HEAVY pressure downward
 *
 * @korean 버티기방어
 * @category Guard Pose
 */
export const GON_DEFENSIVE_SPRAWL_GUARD: StanceGuardPose = {
  // Arms posted forward for base
  leftArm: {
    shoulder: new THREE.Euler(
      0.79,   // 45° (posted forward)
      0.35,   // 20° (wide base)
      -0.26   // -15° (internal rotation)
    ),
    elbow: new THREE.Euler(
      0,      // 0° (neutral)
      0,      // 0°
      -1.75   // -100° (posted on ground)
    ),
    wrist: new THREE.Euler(
      0.17,   // 10° (extension for posting)
      0,      // 0°
      0       // 0°
    ),
  },

  rightArm: {
    shoulder: new THREE.Euler(
      0.79,   // 45° (posted forward)
      -0.35,  // -20° (wide base)
      0.26    // 15° (internal rotation)
    ),
    elbow: new THREE.Euler(
      0,      // 0° (neutral)
      0,      // 0°
      1.75    // 100° (posted on ground)
    ),
    wrist: new THREE.Euler(
      0.17,   // 10° (extension for posting)
      0,      // 0°
      0       // 0°
    ),
  },

  // Torso - Forward and down (sprawling)
  torso: new THREE.Euler(
    0.52,   // 30° (forward lean - sprawl)
    0,      // 0° (no rotation)
    0       // 0° (no side lean)
  ),

  // Legs extended back
  leftLeg: {
    hip: new THREE.Euler(
      -0.26,  // -15° (leg extended back)
      0,      // 0°
      0       // 0°
    ),
    knee: new THREE.Euler(
      -0.35,  // -20° (slight bend for drive)
      0,      // 0°
      0       // 0°
    ),
    ankle: new THREE.Euler(
      -0.17,  // -10° (plantar flexion - pushing)
      0,      // 0°
      0       // 0°
    ),
  },

  rightLeg: {
    hip: new THREE.Euler(
      -0.26,  // -15° (leg extended back)
      0,      // 0°
      0       // 0°
    ),
    knee: new THREE.Euler(
      -0.35,  // -20° (slight bend for drive)
      0,      // 0°
      0       // 0°
    ),
    ankle: new THREE.Euler(
      -0.17,  // -10° (plantar flexion - pushing)
      0,      // 0°
      0       // 0°
    ),
  },

  // Pelvis - Back and down (sprawl)
  pelvis: new THREE.Euler(
    -0.17,  // -10° (hips back but not as much)
    0,      // 0° (no rotation)
    0       // 0° (no tilt)
  ),

  stanceWidth: 1.4, // Wide sprawl base
  stanceDepth: -0.5, // Legs back (negative = behind)
  pelvisHeight: -0.20, // Very low (sprawling)
  weight: "forward", // Weight forward on posts

  breathingRange: {
    min: 0.95,  // Compressed (chest down)
    max: 1.02,  // Limited expansion
  },
};

/**
 * Gon Guard Variants - EXPANDED
 *
 * Collection of Gon guard positions for different tactical scenarios.
 * 
 * @korean 곤괘방어변형들
 */
export const GON_GUARD_VARIANTS = {
  /**
   * Low Grappling Guard - Default Gon guard position for wrestling engagement
   * @korean 낮은잡기방어
   */
  LOW_GRAPPLING: GON_LOW_GRAPPLING_GUARD,
  
  /**
   * Defensive Sprawl Guard - Sprawl position blocking takedown attempts
   * @korean 버티기방어
   */
  DEFENSIVE_SPRAWL: GON_DEFENSIVE_SPRAWL_GUARD,
} as const;
