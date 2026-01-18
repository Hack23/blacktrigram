/**
 * Anatomical Limits Constants
 *
 * Centralized biomechanical safety limits for Korean martial arts animations.
 * These constants document safe physiological ranges for joint movements,
 * validated by Korean martial arts experts and biomechanical research.
 *
 * **Korean Martial Arts Context:**
 * - 한국 무술 생체역학 안전 기준 (Korean Martial Arts Biomechanical Safety Standards)
 * - 관절 안전 범위 (Joint Safety Ranges)
 * - 실전 기술 적용 (Practical Technique Application)
 *
 * **Purpose:**
 * These limits serve as reference documentation and inform animation design
 * to ensure realistic, safe joint mechanics. Actual animations are designed
 * to stay well within these limits through authentic martial arts biomechanics.
 *
 * **Note:** All values are in radians for Three.js compatibility.
 * Convert degrees to radians: degrees * (π / 180)
 *
 * @module systems/animation/constants
 * @category Animation Constants
 * @korean 생체역학안전상수
 */

/**
 * Anatomical Limits for Joint Rotations
 *
 * Comprehensive set of safe physiological ranges for all major joints
 * used in Korean martial arts movements.
 */
export const ANATOMICAL_LIMITS = {
  // ═══════════════════════════════════════════════════════════════════════════
  // UPPER BODY LIMITS (상체 관절 제한)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Shoulder Joint Limits (어깨 관절)
   */
  SHOULDER: {
    /**
     * Maximum safe shoulder overhead rotation: -135° (-2.35 radians)
     *
     * Shoulder flexion limit is approximately 150-180°, making -135° a safe
     * threshold for dramatic overhead positioning (used in Geon/Heaven stance)
     * without risking constraint violations.
     *
     * **Used in:** Geon (건) overhead strikes, powerful techniques
     */
    MAX_OVERHEAD: -2.35, // -135° in radians

    /**
     * Maximum safe shoulder rotation: ±90° (±1.57 radians)
     *
     * Safe shoulder rotation range for circular movements without risking
     * impingement or constraint violations (used in Tae/Lake, Son/Wind stances).
     *
     * **Used in:** Tae (태) circular motions, Son (손) continuous attacks
     */
    MAX_ROTATION: 1.57, // ±90° in radians

    /**
     * Maximum safe shoulder elevation: -35° (-0.61 radians)
     *
     * Conservative shoulder elevation for defensive positions
     * (used in Gan/Mountain guard stance).
     *
     * **Used in:** Gan (간) defensive guard positioning
     */
    MAX_ELEVATION: -0.61, // -35° in radians
  },

  /**
   * Elbow Joint Limits (팔꿈치 관절)
   */
  ELBOW: {
    /**
     * Maximum safe elbow bend: ±125° (±2.18 radians)
     *
     * Typical elbow flexion limit is 145-160°, making 125° a conservative
     * threshold for powerful chambering positions (used in Geon/Heaven strikes).
     *
     * **Used in:** Geon (건) powerful overhead chambering
     */
    MAX_BEND: 2.18, // ±125° in radians

    /**
     * Maximum safe elbow flexion: 145° (2.53 radians)
     *
     * Full elbow flexion for natural guard positions and joint manipulation
     * techniques (used in Tae/Lake, Son/Wind stances).
     *
     * **Used in:** Tae (태) joint locks, Son (손) guard positions
     */
    MAX_FLEXION: 2.53, // 145° in radians

    /**
     * Maximum safe elbow bend for guard: 120° (2.09 radians)
     *
     * Conservative elbow flexion for defensive guard positions
     * (used in Gan/Mountain defensive stance).
     *
     * **Used in:** Gan (간) defensive guard
     */
    MAX_BEND_GUARD: 2.09, // 120° in radians
  },

  /**
   * Wrist Joint Limits (손목 관절)
   */
  WRIST: {
    /**
     * Maximum safe wrist flexion/extension: ±70° (±1.22 radians)
     *
     * Typical wrist range is 70-90° flexion/extension. We use 70° as a safe
     * threshold for joint lock techniques (used in Tae/Lake Hapkido techniques).
     *
     * **Used in:** Tae (태) wrist locks and joint manipulation
     */
    MAX_BEND: 1.22, // ±70° in radians
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LOWER BODY LIMITS (하체 관절 제한)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Hip Joint Limits (엉덩이 관절)
   */
  HIP: {
    /**
     * Maximum safe hip flexion: 110° (1.92 radians)
     *
     * Hip flexion for ground techniques and takedowns
     * (used in Gon/Earth ground control stance).
     *
     * **Used in:** Gon (곤) ground techniques, throws
     */
    MAX_FLEXION: 1.92, // 110° in radians

    /**
     * Maximum safe hip rotation: ±70° (±1.22 radians)
     *
     * Safe hip rotation range for continuous flowing movements
     * (used in Son/Wind circular attacks).
     *
     * **Used in:** Son (손) circular movements, flow techniques
     */
    MAX_ROTATION: 1.22, // ±70° in radians
  },

  /**
   * Knee Joint Limits (무릎 관절)
   */
  KNEE: {
    /**
     * Maximum safe knee flexion: 90° (1.57 radians)
     *
     * Deep horse stance knee bend for explosive power generation
     * (used in Jin/Thunder explosive stance).
     *
     * **Used in:** Jin (진) explosive power generation
     */
    MAX_FLEXION: 1.57, // 90° in radians

    /**
     * Maximum safe knee bend: 130° (2.27 radians)
     *
     * Deep knee bend for ground control and takedown positioning
     * (used in Gon/Earth ground techniques).
     *
     * **Used in:** Gon (곤) ground control, low positioning
     */
    MAX_BEND: 2.27, // 130° in radians

    /**
     * Maximum safe knee bend for rooted stance: 25° (0.44 radians)
     *
     * Conservative knee bend for defensive rooted positions
     * (used in Gan/Mountain defensive stance).
     *
     * **Used in:** Gan (간) rooted defensive positioning
     */
    MAX_BEND_ROOTED: 0.44, // 25° in radians
  },

  /**
   * Ankle Joint Limits (발목 관절)
   */
  ANKLE: {
    /**
     * Maximum safe ankle dorsiflexion: 25° (0.44 radians)
     *
     * Heel raising for explosive launch and power generation
     * (used in Jin/Thunder explosive techniques).
     *
     * **Used in:** Jin (진) explosive heel raises
     */
    MAX_DORSIFLEXION: 0.44, // 25° in radians

    /**
     * Maximum safe ankle dorsiflex: 20° (0.35 radians)
     *
     * Conservative ankle flexion for ground control positioning
     * (used in Gon/Earth ground techniques).
     *
     * **Used in:** Gon (곤) stable ground positioning
     */
    MAX_DORSIFLEX: 0.35, // 20° in radians
  },
} as const;

/**
 * Type-safe access to anatomical limits
 */
export type AnatomicalLimits = typeof ANATOMICAL_LIMITS;

/**
 * Helper function to get anatomical limit by body part and movement type
 *
 * @param bodyPart - Body part category (SHOULDER, ELBOW, WRIST, HIP, KNEE, ANKLE)
 * @param limitType - Specific limit type (MAX_BEND, MAX_FLEXION, etc.)
 * @returns The anatomical limit value in radians
 *
 * @example
 * ```typescript
 * const maxElbowBend = getAnatomicalLimit('ELBOW', 'MAX_BEND'); // 2.18 radians
 * ```
 */
export function getAnatomicalLimit(
  bodyPart: keyof AnatomicalLimits,
  limitType: string
): number {
  const part = ANATOMICAL_LIMITS[bodyPart];
  if (typeof part === "object" && limitType in part) {
    return (part as Record<string, number>)[limitType];
  }
  throw new Error(
    `Invalid anatomical limit: ${bodyPart}.${limitType}`
  );
}

/**
 * Convert degrees to radians for animation calculations
 *
 * @param degrees - Angle in degrees
 * @returns Angle in radians
 *
 * @example
 * ```typescript
 * const radians = degreesToRadians(90); // 1.5708 (π/2)
 * ```
 */
export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees for human-readable output
 *
 * @param radians - Angle in radians
 * @returns Angle in degrees
 *
 * @example
 * ```typescript
 * const degrees = radiansToDegrees(1.5708); // 90
 * ```
 */
export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}
