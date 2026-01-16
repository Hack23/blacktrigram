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
 * Gon Low Grappling Guard Pose
 *
 * **Korean**: 땅 방어 (Ttang Bangeo)
 * **Philosophy**: Low guard position for wrestling engagement
 *
 * Characteristics:
 * - Hands low and forward for grappling grabs
 * - Knees deeply bent for lower center of gravity
 * - Hips back ready to sprawl or shoot
 * - Head up maintaining posture and awareness
 * - Weight neutral for quick directional changes
 *
 * Biomechanics:
 * - Stance width: 1.2x shoulder width (wide stable base)
 * - Pelvis height: -15cm (lowered center of gravity)
 * - Knee bend: -50° (deep athletic position)
 * - Hip position: -20° (hips back for stability)
 *
 * @korean 땅방어
 * @category Guard Pose
 */
export const GON_LOW_GRAPPLING_GUARD: StanceGuardPose = {
  // Left arm - Low forward position for grabbing
  leftArm: {
    shoulder: new THREE.Euler(
      0.52,   // 30° (forward reach)
      0.26,   // 15° (slight abduction)
      -0.35   // -20° (internal rotation for grab)
    ),
    elbow: new THREE.Euler(
      0,      // 0° (neutral)
      0,      // 0°
      -1.4    // -80° (bent ready position)
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
      0.52,   // 30° (forward reach)
      -0.26,  // -15° (slight abduction)
      0.35    // 20° (internal rotation for grab)
    ),
    elbow: new THREE.Euler(
      0,      // 0° (neutral)
      0,      // 0°
      1.4     // 80° (bent ready position)
    ),
    wrist: new THREE.Euler(
      0,      // 0° (neutral wrist)
      0,      // 0°
      0       // 0°
    ),
  },

  // Torso - Forward lean for grappling engagement
  torso: new THREE.Euler(
    0.26,   // 15° (forward lean)
    0,      // 0° (no rotation)
    0       // 0° (no side lean)
  ),

  // Left leg - Deep bend for low center
  leftLeg: {
    hip: new THREE.Euler(
      0,      // 0° (neutral hip)
      0,      // 0°
      0       // 0°
    ),
    knee: new THREE.Euler(
      -0.87,  // -50° (deep bend)
      0,      // 0°
      0       // 0°
    ),
    ankle: new THREE.Euler(
      0.35,   // 20° (dorsiflexion for weight)
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
      -0.87,  // -50° (deep bend)
      0,      // 0°
      0       // 0°
    ),
    ankle: new THREE.Euler(
      0.35,   // 20° (dorsiflexion for weight)
      0,      // 0°
      0       // 0°
    ),
  },

  // Pelvis - Hips back for stability
  pelvis: new THREE.Euler(
    -0.35,  // -20° (hips back)
    0,      // 0° (no rotation)
    0       // 0° (no tilt)
  ),

  // Stance width - Wide base for stability
  stanceWidth: 1.2, // 1.2x shoulder width

  // Stance depth - Neutral parallel stance
  stanceDepth: 0, // 0m (feet parallel)

  // Pelvis height - Lowered for grappling
  pelvisHeight: -0.15, // -15cm (lower center of gravity)

  // Weight distribution - Neutral for movement
  weight: "neutral",

  // Breathing range - Chest expansion in low position
  breathingRange: {
    min: 0.98,  // Slight compression
    max: 1.02,  // Slight expansion
  },
};

/**
 * Gon Guard Variants
 *
 * Collection of Gon guard positions for different scenarios.
 * 
 * Currently contains only the low grappling guard. Additional guard variants
 * (e.g., high wrestling guard, sprawl position) may be added in future updates
 * to provide more tactical options for the Gon trigram stance.
 * 
 * @korean 곤괘방어변형들
 */
export const GON_GUARD_VARIANTS = {
  /**
   * Low Grappling Guard - Default Gon guard position
   * @korean 낮은잡기방어
   */
  LOW_GRAPPLING: GON_LOW_GRAPPLING_GUARD
} as const;
