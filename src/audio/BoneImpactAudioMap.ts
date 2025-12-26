/**
 * Body Region Sound Mapping for Black Trigram
 * Maps body regions and impact intensities to existing audio assets
 *
 * Uses only existing sound files - no new audio creation needed:
 * - hit_flesh_* for soft tissue impacts
 * - hit_light_* for minor bone contact
 * - hit_medium_* for solid bone impacts
 * - hit_heavy_* for devastating bone damage
 * - hit_critical_* for fracture-level and vital point strikes
 * - body_realistic_sound_* as ambient bone/flesh mixing
 */

import { BodyRegion, ImpactIntensity } from "./types";

/**
 * Body region to sound ID mapping
 * Returns base sound ID without variant number
 */
export const BODY_REGION_SOUND_MAP: Record<
  BodyRegion,
  Record<ImpactIntensity, string>
> = {
  head: {
    // Head strikes: skull thud, skull crack sounds
    light: "hit_light", // Glancing temple/jaw hits
    medium: "hit_medium", // Solid jaw/temple strikes
    heavy: "hit_heavy", // Devastating skull impacts
    critical: "hit_critical", // Vital point (temple, back of neck)
    fracture: "hit_critical", // Skull fracture sounds (severe)
  },
  torso: {
    // Torso strikes: rib impact, rib crack, internal organ thuds
    light: "hit_light", // Light rib contact
    medium: "hit_medium", // Solid rib/sternum impact
    heavy: "hit_heavy", // Rib-breaking force, liver strikes
    critical: "hit_critical", // Solar plexus, heart vital points
    fracture: "hit_critical", // Multiple rib fractures, internal damage
  },
  arms: {
    // Arm/limb strikes: limb bone thud, joint crack
    light: "hit_flesh", // Muscle strikes, glancing blows
    medium: "hit_medium", // Solid elbow/forearm bone contact
    heavy: "hit_heavy", // Joint destruction (shoulder, elbow, wrist)
    critical: "hit_critical", // Nerve strikes, joint breaks
    fracture: "hit_critical", // Complete arm bone fracture
  },
  legs: {
    // Leg strikes: knee cap, shin bone, ankle impacts
    light: "hit_flesh", // Thigh muscle strikes
    medium: "hit_medium", // Shin/knee bone impacts
    heavy: "hit_heavy", // Knee destruction, ankle breaks
    critical: "hit_critical", // Vital leg nerve strikes
    fracture: "hit_critical", // Femur/tibia fractures
  },
  soft_tissue: {
    // Soft tissue: muscle thud, flesh impact (no bone contact)
    light: "hit_flesh", // Light muscle contact
    medium: "hit_flesh", // Solid muscle compression
    heavy: "body_realistic_sound", // Deep muscle trauma
    critical: "hit_critical", // Soft vital points (throat, groin)
    fracture: "hit_critical", // Severe soft tissue damage
  },
};

/**
 * Number of audio variants per sound type
 * Used for random selection in combat
 */
export const SOUND_VARIANT_COUNTS: Record<string, number> = {
  hit_flesh: 4,
  hit_light: 4,
  hit_medium: 4,
  hit_heavy: 4,
  hit_critical: 4,
  body_realistic_sound: 1, // Only 1 variant available
};

/**
 * Volume multipliers based on impact intensity
 * Higher damage = louder sounds (as per requirements)
 */
export const IMPACT_VOLUME_MULTIPLIERS: Record<ImpactIntensity, number> = {
  light: 0.7, // -30% volume
  medium: 0.85, // -15% volume
  heavy: 1.0, // Normal volume
  critical: 1.15, // +15% volume
  fracture: 1.3, // +30% volume (bone-breaking audio)
};

/**
 * Get sound ID for a bone impact event
 * @param region - Body region struck
 * @param intensity - Impact intensity level
 * @param randomize - Whether to add random variant (default: true)
 * @returns Sound ID to play (e.g., "hit_critical_3")
 */
export function getBoneImpactSoundId(
  region: BodyRegion,
  intensity: ImpactIntensity,
  randomize: boolean = true
): string {
  const baseSoundId = BODY_REGION_SOUND_MAP[region][intensity];

  if (!randomize) {
    return baseSoundId;
  }

  // Get variant count for this sound type
  const variantCount = SOUND_VARIANT_COUNTS[baseSoundId] ?? 1;

  if (variantCount === 1) {
    return baseSoundId;
  }

  // Random variant selection (1 to variantCount)
  const variant = Math.floor(Math.random() * variantCount) + 1;
  return `${baseSoundId}_${variant}`;
}

/**
 * Calculate impact intensity from damage amount
 * @param damage - Damage dealt in attack
 * @param remainingHealth - Target's remaining health (for fracture detection)
 * @param isVitalPoint - Whether strike hit a vital point
 * @returns Impact intensity level
 */
export function calculateImpactIntensity(
  damage: number,
  remainingHealth?: number,
  isVitalPoint?: boolean
): ImpactIntensity {
  // Vital point strikes are always critical (highest priority)
  if (isVitalPoint) {
    return "critical";
  }

  // Fracture detection: health below 30% + high damage
  if (
    remainingHealth !== undefined &&
    remainingHealth < 30 &&
    damage >= 20
  ) {
    return "fracture";
  }

  // Intensity based on damage amount
  if (damage >= 40) return "critical";
  if (damage >= 25) return "heavy";
  if (damage >= 10) return "medium";
  return "light";
}

/**
 * Detect body region from 3D hit coordinates
 * Uses Y-axis (vertical) and X-axis (horizontal) to determine region
 *
 * @param hitPosition - 3D position where strike landed
 * @param characterHeight - Total height of character model (default: 2.0)
 * @returns Body region struck
 */
export function detectBodyRegion(
  hitPosition: { x: number; y: number; z?: number },
  characterHeight: number = 2.0
): BodyRegion {
  const { x, y } = hitPosition;
  const normalizedY = y / characterHeight; // Normalize to 0-1 range

  // Head region: top 25% of body (0.75 - 1.0)
  if (normalizedY >= 0.75) {
    return "head";
  }

  // Torso region: middle 50% of body (0.25 - 0.75)
  if (normalizedY >= 0.25) {
    // Check horizontal position for arms
    const absX = Math.abs(x);
    if (absX > 0.3) {
      // Hits on the sides are likely arms
      return "arms";
    }
    return "torso";
  }

  // Legs region: bottom 25% of body (0 - 0.25)
  return "legs";
}

/**
 * Get volume multiplier for impact intensity
 * @param intensity - Impact intensity level
 * @returns Volume multiplier (0.7 to 1.3)
 */
export function getImpactVolumeMultiplier(intensity: ImpactIntensity): number {
  return IMPACT_VOLUME_MULTIPLIERS[intensity];
}
