/**
 * Physical attribute profiles for each player archetype.
 *
 * **Korean**: 원형별 신체 속성 (Archetype Physical Attributes)
 *
 * Defines realistic body dimensions and composition for each of the five
 * player archetypes based on their combat style and background. These
 * attributes directly affect combat calculations including reach, movement
 * speed, damage, and stamina.
 *
 * ## Design Philosophy
 *
 * Each archetype's physical profile reflects their training, lifestyle, and
 * combat specialization:
 *
 * - **무사 (Musa)**: Balanced warrior with traditional training
 * - **암살자 (Amsalja)**: Lean and agile for stealth operations
 * - **해커 (Hacker)**: Average build with tech enhancements
 * - **정보요원 (Jeongbo)**: Fit operative with intelligence background
 * - **조직폭력배 (Jojik)**: Heavy and brutal street fighter
 *
 * @module data/archetypePhysicalAttributes
 * @category Player & Archetypes
 * @korean 원형신체데이터
 */

import { PhysicalAttributes, PlayerArchetype } from "@/types";

/**
 * 무사 (Musa) - Traditional Warrior Physical Profile
 *
 * **Philosophy**: Honor through disciplined strength
 * **Training**: Military special forces with traditional martial arts
 * **Build**: Balanced, athletic, well-conditioned warrior
 *
 * Physical characteristics reflect years of traditional Korean martial arts
 * training combined with modern military conditioning. Optimal balance between
 * strength, speed, and endurance for prolonged combat effectiveness.
 *
 * @korean 무사신체
 */
export const MUSA_PHYSICAL: PhysicalAttributes = {
  /**
   * Weight: 82 kg
   * Athletic military build for strength and mobility
   * Korean Special Forces standard physique
   * Optimal power-to-weight ratio for combat
   */
  weight: 82,

  /**
   * Leg Length: 96 cm
   * Athletic leg length for powerful kicks
   * Trained for devastating Taekwondo kicks
   * Balanced reach and stability
   */
  legLength: 96,

  /**
   * Arm Length: 77 cm
   * Strong arm reach for disciplined striking
   * Conditioned for both precision and power
   * Effective grappling range
   */
  armLength: 77,

  /**
   * Muscle Mass: 35 kg (43% of body weight)
   * High muscle mass from military training
   * Realistic for trained special forces soldier
   * Excellent functional strength
   */
  muscleMass: 35,

  /**
   * Fat Mass: 13 kg (16% body fat)
   * Athletic body fat percentage
   * Maintains energy reserves for combat endurance
   * Optimal for sustained operations
   */
  fatMass: 13,

  /**
   * Age: 32 years
   * Prime combat age combining experience and physical capability
   * Peak of martial arts mastery and physical conditioning
   * Balanced wisdom and reflexes
   */
  age: 32,

  /**
   * Total Height: 180 cm
   * Solid military build height
   * Above average for imposing presence
   * Good proportions for all-around combat
   */
  totalHeight: 180,

  /**
   * Torso Length: 59 cm
   * Strong core providing stable base
   * Optimal for breath control and Ki cultivation
   * Protected vital points
   */
  torsoLength: 59,

  /**
   * Head Size: 22 cm
   * Average head diameter
   * Standard vital point target area
   * Balanced consciousness vulnerability
   */
  headSize: 22,

  /**
   * Neck Length: 11 cm
   * Strong, trained neck
   * Moderate vulnerability to chokes
   * Conditioned for impact resistance
   */
  neckLength: 11,

  /**
   * Shoulder Width: 46 cm
   * Broad military shoulders
   * Strong defense coverage
   * Excellent grappling control points
   */
  shoulderWidth: 46,
};

/**
 * 암살자 (Amsalja) - Shadow Assassin Physical Profile
 *
 * **Philosophy**: Efficiency through invisibility
 * **Training**: Covert operations and silent elimination specialist
 * **Build**: Lean, agile, optimized for stealth and precision
 *
 * Physical characteristics emphasize low body mass for stealth movement,
 * exceptional reach for vital point targeting, and minimal fat for maximum
 * agility. Every attribute optimized for silent, deadly efficiency.
 *
 * @korean 암살자신체
 */
export const AMSALJA_PHYSICAL: PhysicalAttributes = {
  /**
   * Weight: 75 kg
   * Lean athletic build like a kickboxer (Israel Adesanya type)
   * Optimized for speed, reach, and precision
   * Light enough for stealth, heavy enough for power
   */
  weight: 75,

  /**
   * Leg Length: 102 cm
   * Long legs for exceptional reach and stride
   * Enables precise high kicks to vital points
   * Excellent for maintaining distance
   */
  legLength: 102,

  /**
   * Arm Length: 82 cm
   * Extended reach for range advantage
   * Crucial for vital point precision strikes
   * Keeps opponents at safe distance
   */
  armLength: 82,

  /**
   * Muscle Mass: 30 kg (40% of body weight)
   * Lean, functional muscle for speed
   * Optimized for explosive movements
   * Sufficient for devastating precision strikes
   */
  muscleMass: 30,

  /**
   * Fat Mass: 10 kg (13% body fat)
   * Very low fat for maximum definition
   * Peak agility and flexibility
   * Athletic performance optimized
   */
  fatMass: 10,

  /**
   * Age: 28 years
   * Young and at peak physical agility
   * Optimal reflexes for split-second decisions
   * Experience balanced with peak conditioning
   */
  age: 28,

  /**
   * Total Height: 186 cm
   * Tall for exceptional reach advantage
   * Long limb ratios for vital point access
   * Intimidating presence while maintaining agility
   */
  totalHeight: 186,

  /**
   * Torso Length: 58 cm
   * Compact torso for lower center of gravity
   * Agile core for quick movement
   * Reduced vital point target area
   */
  torsoLength: 58,

  /**
   * Head Size: 22 cm
   * Normal head profile
   * Standard target area for head strikes
   * Balanced consciousness vulnerability
   */
  headSize: 22,

  /**
   * Neck Length: 11 cm
   * Longer neck for head movement evasion
   * Slightly increased choke vulnerability
   * Requires skilled guard positioning
   */
  neckLength: 11,

  /**
   * Shoulder Width: 44 cm
   * Lean but athletic shoulders
   * Good mobility with adequate coverage
   * Efficient for striking mechanics
   */
  shoulderWidth: 44,
};

/**
 * 해커 (Hacker) - Cyber Warrior Physical Profile
 *
 * **Philosophy**: Information as power through technology
 * **Training**: Digital native with supplemental physical training
 * **Build**: Average physique enhanced by technological augmentation
 *
 * Physical characteristics reflect a tech-focused lifestyle with functional
 * fitness rather than peak athletic conditioning. Attributes are average
 * but compensated by cybernetic enhancements and data-driven combat analysis.
 *
 * @korean 해커신체
 */
export const HACKER_PHYSICAL: PhysicalAttributes = {
  /**
   * Weight: 72 kg
   * Average weight for height
   * Functional fitness from regular training
   * Tech worker who maintains fitness
   */
  weight: 72,

  /**
   * Leg Length: 92 cm
   * Standard leg proportions
   * Adequate for tech-assisted movement
   * Compensated by augmented targeting systems
   */
  legLength: 92,

  /**
   * Arm Length: 73 cm
   * Average arm reach
   * Sufficient when aided by cybernetic enhancements
   * Precision compensated by data analysis
   */
  armLength: 73,

  /**
   * Muscle Mass: 28 kg (39% of body weight)
   * Moderate muscle mass for tech worker
   * Maintained through efficient training
   * Relies more on tech than raw strength
   */
  muscleMass: 28,

  /**
   * Fat Mass: 15 kg (21% body fat)
   * Average body fat from desk work
   * Still functional for combat
   * Less emphasis on peak conditioning
   */
  fatMass: 15,

  /**
   * Age: 26 years
   * Young digital native
   * High neuroplasticity for tech integration
   * Peak learning and adaptation capabilities
   */
  age: 26,

  /**
   * Total Height: 175 cm
   * Average Korean male height
   * Standard proportions for tech integration
   * Balanced body type for augmentation
   */
  totalHeight: 175,

  /**
   * Torso Length: 57 cm
   * Average torso length
   * Standard core for cyber implants
   * Balanced Ki flow for tech-bio integration
   */
  torsoLength: 57,

  /**
   * Head Size: 22 cm
   * Average head size
   * Standard neural interface compatibility
   * Balanced for augmented reality overlays
   */
  headSize: 22,

  /**
   * Neck Length: 10 cm
   * Average neck length
   * Standard vulnerability to chokes
   * Adequate for neural interface cables
   */
  neckLength: 10,

  /**
   * Shoulder Width: 43 cm
   * Average shoulder span
   * Standard defense coverage
   * Balanced for wearable tech integration
   */
  shoulderWidth: 43,
};

/**
 * 정보요원 (Jeongbo Yowon) - Intelligence Operative Physical Profile
 *
 * **Philosophy**: Knowledge through observation and strategy
 * **Training**: Government intelligence agency with specialized combat
 * **Build**: Athletic operative with strategic fitness
 *
 * Physical characteristics reflect intelligence agency fitness standards
 * with emphasis on versatility, endurance, and adaptability. Balanced
 * attributes suitable for varied operational requirements.
 *
 * @korean 정보요원신체
 */
export const JEONGBO_PHYSICAL: PhysicalAttributes = {
  /**
   * Weight: 78 kg
   * Fit intelligence operative build
   * Government agency fitness standard
   * Balance between capability and inconspicuousness
   */
  weight: 78,

  /**
   * Leg Length: 95 cm
   * Balanced leg length for varied terrain
   * Standard proportions for operational flexibility
   * Suitable for extended pursuit or evasion
   */
  legLength: 95,

  /**
   * Arm Length: 76 cm
   * Standard operative reach
   * Trained for weapon and hand-to-hand versatility
   * Balanced for multiple combat scenarios
   */
  armLength: 76,

  /**
   * Muscle Mass: 32 kg (41% of body weight)
   * Agency-required conditioning
   * Balanced strength for operational demands
   * Emphasis on functional fitness
   */
  muscleMass: 32,

  /**
   * Fat Mass: 12 kg (15% body fat)
   * Low but sustainable body fat
   * Maintains energy reserves for long operations
   * Within intelligence service standards
   */
  fatMass: 12,

  /**
   * Age: 34 years
   * Experienced operative
   * Peak of analytical and physical capability
   * Wisdom from field experience
   */
  age: 34,

  /**
   * Total Height: 179 cm
   * Standard government agency height
   * Balanced proportions for versatility
   * Neither imposing nor inconspicuous
   */
  totalHeight: 179,

  /**
   * Torso Length: 58 cm
   * Balanced torso for varied operations
   * Good breath control and stamina
   * Standard vital point distribution
   */
  torsoLength: 58,

  /**
   * Head Size: 22 cm
   * Average head size
   * Standard tactical gear compatibility
   * Balanced consciousness resilience
   */
  headSize: 22,

  /**
   * Neck Length: 10 cm
   * Average neck length
   * Trained resistance to chokes
   * Standard blood choke vulnerability
   */
  neckLength: 10,

  /**
   * Shoulder Width: 45 cm
   * Athletic shoulder width
   * Good defense coverage
   * Versatile grappling control
   */
  shoulderWidth: 45,
};

/**
 * 조직폭력배 (Jojik Pokryeokbae) - Organized Crime Physical Profile
 *
 * **Philosophy**: Survival through ruthlessness and brutality
 * **Training**: Street fighting and underground martial arts
 * **Build**: Heavy, powerful, intimidating presence
 *
 * Physical characteristics emphasize raw power and intimidation over
 * refined technique. Heavier build with high muscle mass for brutal
 * effectiveness and street-proven durability.
 *
 * @korean 조직폭력배신체
 */
export const JOJIK_PHYSICAL: PhysicalAttributes = {
  /**
   * Weight: 105 kg
   * MASSIVE build for power and intimidation
   * Like a heavyweight MMA fighter or large taekwondo practitioner
   * Dominant mass advantage in any confrontation
   */
  weight: 105,

  /**
   * Leg Length: 100 cm
   * Long, powerful legs despite heavy build
   * Devastating kicks with massive power
   * Surprising mobility for size
   */
  legLength: 100,

  /**
   * Arm Length: 84 cm
   * Long, thick arms for crushing power
   * Exceptional reach for grappling and strikes
   * Street-fighting dominance
   */
  armLength: 84,

  /**
   * Muscle Mass: 48 kg (46% of body weight)
   * Highest muscle mass of all archetypes
   * Built through intense street combat and heavy training
   * Raw, overwhelming power
   */
  muscleMass: 48,

  /**
   * Fat Mass: 20 kg (19% body fat)
   * Functional body fat for damage absorption
   * Provides padding against strikes
   * Still very fit despite bulk
   */
  fatMass: 20,

  /**
   * Age: 36 years
   * Veteran of street conflicts
   * Battle-scarred and experienced
   * Peak brutality and survival instincts
   */
  age: 36,

  /**
   * Total Height: 188 cm
   * Tall AND massive build
   * Physically imposing presence
   * Dominates any confrontation visually
   */
  totalHeight: 188,

  /**
   * Torso Length: 64 cm
   * Thick, powerful torso
   * Massive core strength
   * Enhanced durability and power generation
   */
  torsoLength: 64,

  /**
   * Head Size: 24 cm
   * Large, thick skull
   * Significant head strike resistance
   * High consciousness resilience
   */
  headSize: 24,

  /**
   * Neck Length: 11 cm
   * Thick, muscular neck
   * Very difficult to choke
   * Protected blood vessels
   */
  neckLength: 11,

  /**
   * Shoulder Width: 54 cm
   * WIDEST shoulders - intimidating presence
   * Maximum defense coverage
   * Overwhelming physical dominance
   */
  shoulderWidth: 54,
};

/**
 * Archetype physical attributes lookup map.
 *
 * **Korean**: 원형 신체 속성 맵 (Archetype Physical Attributes Map)
 *
 * Provides quick access to physical attribute profiles by archetype.
 * Used by combat system to retrieve realistic body dimensions and
 * composition for calculations.
 *
 * @example
 * ```typescript
 * const playerArchetype = PlayerArchetype.MUSA;
 * const physicalAttrs = ARCHETYPE_PHYSICAL_ATTRIBUTES[playerArchetype];
 * const kickRange = calculateKickRange(physicalAttrs.legLength);
 * ```
 *
 * @public
 * @korean 원형신체맵
 */
export const ARCHETYPE_PHYSICAL_ATTRIBUTES: Record<
  PlayerArchetype,
  PhysicalAttributes
> = {
  [PlayerArchetype.MUSA]: MUSA_PHYSICAL,
  [PlayerArchetype.AMSALJA]: AMSALJA_PHYSICAL,
  [PlayerArchetype.HACKER]: HACKER_PHYSICAL,
  [PlayerArchetype.JEONGBO_YOWON]: JEONGBO_PHYSICAL,
  [PlayerArchetype.JOJIK_POKRYEOKBAE]: JOJIK_PHYSICAL,
};

/**
 * Get physical attributes for a specific archetype.
 *
 * **Korean**: 원형 신체 속성 가져오기 (Get Archetype Physical Attributes)
 *
 * Retrieves the physical attribute profile for the specified player archetype.
 * Returns a readonly copy to prevent accidental mutations.
 *
 * @param archetype - The player archetype to get attributes for
 * @returns Physical attributes for the specified archetype
 *
 * @example
 * ```typescript
 * const musaAttrs = getArchetypePhysicalAttributes(PlayerArchetype.MUSA);
 * console.log(`Musa weight: ${musaAttrs.weight}kg`);
 * console.log(`Musa arm reach: ${musaAttrs.armLength}cm`);
 * ```
 *
 * @public
 * @korean 원형신체가져오기
 */
export function getArchetypePhysicalAttributes(
  archetype: PlayerArchetype
): Readonly<PhysicalAttributes> {
  return ARCHETYPE_PHYSICAL_ATTRIBUTES[archetype];
}

/**
 * Calculate effective reach based on limb length and stance.
 *
 * **Korean**: 유효 거리 계산 (Calculate Effective Reach)
 *
 * Computes the effective combat reach considering limb length and
 * body positioning. Different techniques use different limbs and
 * leverage different amounts of body extension.
 *
 * @param limbLength - Length of the limb in centimeters
 * @param extension - Percentage of full extension (0.0 to 1.0)
 * @returns Effective reach in centimeters
 *
 * @example
 * ```typescript
 * // Full extension punch
 * const punchReach = calculateEffectiveReach(75, 1.0); // 75cm
 *
 * // 70% extension kick (stable stance)
 * const kickReach = calculateEffectiveReach(95, 0.7); // 66.5cm
 * ```
 *
 * @public
 * @korean 유효거리계산
 */
export function calculateEffectiveReach(
  limbLength: number,
  extension: number = 1.0
): number {
  return limbLength * Math.max(0, Math.min(1, extension));
}

/**
 * Calculate movement speed modifier based on weight and leg length.
 *
 * **Korean**: 이동 속도 계산 (Calculate Movement Speed)
 *
 * Computes movement speed modifier based on body weight (inversely)
 * and leg length (positively). Heavier fighters move slower, while
 * longer legs provide faster base movement.
 *
 * Formula: baseSpeed * (legLength / 95) * (75 / weight)
 * - Normalized around 95cm legs and 75kg weight
 *
 * @param physical - Physical attributes of the fighter
 * @param baseSpeed - Base movement speed (default: 100)
 * @returns Modified movement speed
 *
 * @example
 * ```typescript
 * const musaSpeed = calculateMovementSpeed(MUSA_PHYSICAL);
 * // Result: 100 * (95/95) * (75/75) = 100
 *
 * const jojikSpeed = calculateMovementSpeed(JOJIK_PHYSICAL);
 * // Result: 100 * (90/95) * (75/85) = ~88.2 (slower)
 * ```
 *
 * @public
 * @korean 이동속도계산
 */
export function calculateMovementSpeed(
  physical: PhysicalAttributes,
  baseSpeed: number = 100
): number {
  const legFactor = physical.legLength / 95; // Normalized to 95cm average
  const weightFactor = 75 / physical.weight; // Normalized to 75kg average
  return baseSpeed * legFactor * weightFactor;
}

/**
 * Calculate damage modifier based on muscle mass.
 *
 * **Korean**: 공격력 계산 (Calculate Damage Output)
 *
 * Computes damage output modifier based on muscle mass. More muscle
 * means more power in strikes, but with diminishing returns.
 *
 * Formula: 1.0 + ((muscleMass - 35) / 35) * 0.3
 * - Normalized around 35kg muscle mass
 * - Maximum 30% bonus from muscle
 *
 * @param physical - Physical attributes of the fighter
 * @returns Damage multiplier (typically 0.7 to 1.3)
 *
 * @example
 * ```typescript
 * const musaDamage = calculateDamageModifier(MUSA_PHYSICAL);
 * // Result: 1.0 + ((38-35)/35)*0.3 = ~1.026
 *
 * const jojikDamage = calculateDamageModifier(JOJIK_PHYSICAL);
 * // Result: 1.0 + ((42-35)/35)*0.3 = ~1.06 (stronger)
 * ```
 *
 * @public
 * @korean 공격력계산
 */
export function calculateDamageModifier(physical: PhysicalAttributes): number {
  const normalizedMuscle = (physical.muscleMass - 35) / 35;
  return 1.0 + normalizedMuscle * 0.3;
}

/**
 * Calculate defense modifier based on fat mass and muscle mass.
 *
 * **Korean**: 방어력 계산 (Calculate Defense)
 *
 * Computes defense modifier based on fat mass (padding) and muscle mass
 * (structural integrity). Fat absorbs blunt damage, muscle protects
 * against impact.
 *
 * Formula: 1.0 + (fatMass / 100) + (muscleMass / 200)
 *
 * @param physical - Physical attributes of the fighter
 * @returns Defense multiplier (typically 1.0 to 1.3)
 *
 * @example
 * ```typescript
 * const amsaljaDefense = calculateDefenseModifier(AMSALJA_PHYSICAL);
 * // Result: 1.0 + (9/100) + (32/200) = 1.25
 *
 * const jojikDefense = calculateDefenseModifier(JOJIK_PHYSICAL);
 * // Result: 1.0 + (18/100) + (42/200) = 1.39 (tankier)
 * ```
 *
 * @public
 * @korean 방어력계산
 */
export function calculateDefenseModifier(physical: PhysicalAttributes): number {
  const fatPadding = physical.fatMass / 100;
  const muscleStructure = physical.muscleMass / 200;
  return 1.0 + fatPadding + muscleStructure;
}

/**
 * Calculate stamina regeneration rate based on age and fat mass.
 *
 * **Korean**: 체력 회복 속도 (Stamina Recovery Rate)
 *
 * Computes stamina recovery speed based on age (optimal 25-35) and
 * fat mass (lower is better for recovery). Younger fighters and leaner
 * builds recover faster.
 *
 * Formula: baseRate * ageFactor * fatFactor
 * - Age factor peaks at 30 years (1.0), decreases before and after
 * - Fat factor = 1.0 - (fatMass - 10) / 50
 *
 * @param physical - Physical attributes of the fighter
 * @param baseRate - Base recovery rate (default: 10 per second)
 * @returns Modified stamina recovery rate
 *
 * @example
 * ```typescript
 * const amsaljaRecovery = calculateStaminaRecovery(AMSALJA_PHYSICAL);
 * // Age 28, fat 9kg: ~10.2 per second
 *
 * const jojikRecovery = calculateStaminaRecovery(JOJIK_PHYSICAL);
 * // Age 36, fat 18kg: ~8.4 per second (slower)
 * ```
 *
 * @public
 * @korean 체력회복계산
 */
export function calculateStaminaRecovery(
  physical: PhysicalAttributes,
  baseRate: number = 10
): number {
  // Age factor: peaks at 30, decreases before and after
  const ageOptimal = 30;
  const ageDiff = Math.abs(physical.age - ageOptimal);
  const ageFactor = Math.max(0.7, 1.0 - ageDiff / 30);

  // Fat factor: lower fat = faster recovery
  const fatFactor = Math.max(0.7, 1.0 - (physical.fatMass - 10) / 50);

  return baseRate * ageFactor * fatFactor;
}
