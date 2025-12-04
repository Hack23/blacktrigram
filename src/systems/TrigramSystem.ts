import { KoreanText, TrigramStance } from "../types/common";
import { PlayerState } from "./player";

import { TRIGRAM_STANCES_ORDER, TrigramTransitionCost } from "./trigram";
import { TrigramCalculator } from "./trigram/TrigramCalculator";
import { PLAYER_ARCHETYPES_DATA } from "./types";

/**
 * System for managing Eight Trigram (팔괘) stance transitions and combat calculations.
 *
 * **Korean**: 팔괘 시스템 (Eight Trigram System)
 *
 * The TrigramSystem implements the core mechanics of the Eight Trigram martial arts system,
 * managing stance transitions, calculating effectiveness, and determining resource costs.
 * Based on I Ching (易經) philosophy adapted for tactical combat.
 *
 * ## Key Responsibilities
 *
 * - Validate stance transitions based on Ki and Stamina costs
 * - Calculate transition difficulty between stances
 * - Recommend optimal stance choices
 * - Determine stance effectiveness in combat matchups
 * - Apply archetype-specific modifiers to transitions
 *
 * @example
 * ```typescript
 * const trigramSystem = new TrigramSystem();
 *
 * // Check if transition is possible
 * const canTransition = trigramSystem.canTransitionTo(
 *   TrigramStance.GEON,
 *   TrigramStance.GAM,
 *   playerState
 * );
 *
 * // Get recommended stance
 * const recommendedStance = trigramSystem.recommendStance(playerState);
 * ```
 *
 * @public
 * @category Trigram System
 * @korean 팔괘시스템
 */
export class TrigramSystem {
  private calculator: TrigramCalculator;

  /**
   * Creates a new TrigramSystem instance.
   *
   * Initializes the internal calculator for stance effectiveness and transition difficulty.
   */
  constructor() {
    this.calculator = new TrigramCalculator();
  }

  /**
   * Gets the defensive/offensive characteristic of a stance.
   *
   * **Korean**: 자세 특성 조회 (Stance Characteristic Query)
   *
   * Returns whether a stance is primarily defensive, offensive, or balanced.
   * This information is useful for UI display and tactical decision-making.
   *
   * ## Stance Classifications
   *
   * - **Defensive**: 간 (GAN/Mountain), 곤 (GON/Earth) - Protect vital areas
   * - **Offensive**: 건 (GEON/Heaven), 진 (JIN/Thunder) - Expose for power
   * - **Balanced**: 태 (TAE/Lake), 리 (LI/Fire), 손 (SON/Wind), 감 (GAM/Water)
   *
   * @param stance - Trigram stance to query
   * @returns "defensive", "offensive", or "balanced"
   *
   * @example
   * ```typescript
   * const characteristic = trigramSystem.getStanceCharacteristic(TrigramStance.GAN);
   * console.log(characteristic); // "defensive"
   *
   * const offensive = trigramSystem.getStanceCharacteristic(TrigramStance.GEON);
   * console.log(offensive); // "offensive"
   * ```
   *
   * @public
   * @korean 자세특성조회
   */
  getStanceCharacteristic(
    stance: TrigramStance
  ): "defensive" | "offensive" | "balanced" {
    switch (stance) {
      case TrigramStance.GAN: // Mountain - Immovable defense
      case TrigramStance.GON: // Earth - Grounding and stability
        return "defensive";

      case TrigramStance.GEON: // Heaven - Direct force and aggression
      case TrigramStance.JIN: // Thunder - Explosive power
        return "offensive";

      default:
        return "balanced";
    }
  }

  /**
   * Checks if a stance provides defensive advantages.
   *
   * **Korean**: 방어 자세 확인 (Check Defensive Stance)
   *
   * @param stance - Trigram stance to check
   * @returns true if stance is defensive, false otherwise
   *
   * @example
   * ```typescript
   * if (trigramSystem.isDefensiveStance(player.currentStance)) {
   *   console.log("Player is in defensive posture");
   * }
   * ```
   *
   * @public
   * @korean 방어자세확인
   */
  isDefensiveStance(stance: TrigramStance): boolean {
    return this.getStanceCharacteristic(stance) === "defensive";
  }

  /**
   * Checks if a stance provides offensive advantages.
   *
   * **Korean**: 공격 자세 확인 (Check Offensive Stance)
   *
   * @param stance - Trigram stance to check
   * @returns true if stance is offensive, false otherwise
   *
   * @example
   * ```typescript
   * if (trigramSystem.isOffensiveStance(player.currentStance)) {
   *   console.log("Player is in offensive posture");
   * }
   * ```
   *
   * @public
   * @korean 공격자세확인
   */
  isOffensiveStance(stance: TrigramStance): boolean {
    return this.getStanceCharacteristic(stance) === "offensive";
  }

  /**
   * Checks if a player can transition from one stance to another.
   *
   * Validates that the player has sufficient Ki (氣) and Stamina resources
   * to perform the stance transition. Same-stance transitions are always valid.
   *
   * @param fromStance - Current stance
   * @param toStance - Target stance
   * @param player - Player state with current Ki and Stamina
   * @returns true if transition is possible, false otherwise
   *
   * @example
   * ```typescript
   * const canChange = trigramSystem.canTransitionTo(
   *   TrigramStance.GEON, // From Heaven
   *   TrigramStance.GON,  // To Earth
   *   player
   * );
   * ```
   *
   * @public
   * @korean 자세전환가능확인
   */
  canTransitionTo(
    fromStance: TrigramStance,
    toStance: TrigramStance,
    player: PlayerState
  ): boolean {
    if (fromStance === toStance) return true;

    const cost = this.getTransitionCost(fromStance, toStance, player);

    // Check if player has sufficient resources
    const hasEnoughKi = player.ki >= cost.ki;
    const hasEnoughStamina = player.stamina >= cost.stamina;

    return hasEnoughKi && hasEnoughStamina;
  }

  /**
   * Recommends the optimal stance for current combat situation.
   *
   * Calculates the least-cost stance transition from the player's current position.
   * Uses combined cost of Ki, Stamina, and transition time to determine best option.
   *
   * **Algorithm**: Evaluates all eight stances and selects the one with minimum
   * total cost (Ki + Stamina + Time).
   *
   * @param player - Player state with current stance
   * @returns Recommended stance to transition to
   *
   * @example
   * ```typescript
   * const recommended = trigramSystem.recommendStance(player);
   * console.log(`Consider switching to ${recommended}`);
   * ```
   *
   * @public
   * @korean 최적자세추천
   */
  recommendStance(player: PlayerState): TrigramStance {
    const from = player.currentStance;
    let best = from;
    let bestScore = Infinity;

    for (const to of TRIGRAM_STANCES_ORDER) {
      const costObj: TrigramTransitionCost = this.getTransitionCost(from, to);
      const score = costObj.ki + costObj.stamina + costObj.timeMilliseconds;
      if (score < bestScore) {
        bestScore = score;
        best = to;
      }
    }

    return best;
  }

  /**
   * Calculates the resource cost for transitioning between stances.
   *
   * Determines Ki, Stamina, and time costs based on the I Ching philosophical
   * distance between trigrams. Applies archetype-specific modifiers for favored stances.
   *
   * ## Cost Calculation
   *
   * - **Base Cost**: 10 Ki, 15 Stamina per difficulty point
   * - **Base Time**: 500ms per difficulty point
   * - **Archetype Modifier**: 0.8x for favored stances, 1.0x otherwise
   * - **Same Stance**: Zero cost
   *
   * @param from - Starting stance
   * @param to - Target stance
   * @param player - Optional player for archetype modifiers
   * @returns Transition cost breakdown
   *
   * @example
   * ```typescript
   * const cost = trigramSystem.getTransitionCost(
   *   TrigramStance.GEON,
   *   TrigramStance.TAE,
   *   player
   * );
   * console.log(`Cost: ${cost.ki} Ki, ${cost.stamina} Stamina`);
   * ```
   *
   * @public
   * @korean 자세전환비용
   */
  public getTransitionCost(
    from: TrigramStance,
    to: TrigramStance,
    player?: PlayerState
  ): TrigramTransitionCost {
    if (from === to) {
      return {
        ki: 0,
        stamina: 0,
        timeMilliseconds: 0, // neutral
      };
    }

    const difficulty = TrigramCalculator.calculateTransitionDifficulty(
      from,
      to
    );
    const baseCost = 10;
    const baseTime = 500;

    let ki = Math.ceil(baseCost * difficulty);
    let stamina = Math.ceil(baseCost * difficulty * 1.5);

    // apply archetype stance‐change cost modifier if player provided
    if (player) {
      const archData = PLAYER_ARCHETYPES_DATA[player.archetype];
      const favs = archData.favoredStances || [];
      const mod = favs.includes(to) ? 0.8 : 1.0;
      ki = Math.ceil(ki * mod);
      stamina = Math.ceil(stamina * mod);
    }

    return {
      ki,
      stamina,
      timeMilliseconds: Math.ceil(baseTime * difficulty),
    };
  }

  /**
   * Calculates stance effectiveness in combat matchup.
   *
   * Determines the multiplier advantage/disadvantage when one stance attacks another.
   * Based on I Ching elemental relationships (e.g., Water extinguishes Fire).
   *
   * @param attackerStance - Attacking player's stance
   * @param defenderStance - Defending player's stance
   * @returns Effectiveness multiplier (0.5 = disadvantage, 1.0 = neutral, 1.5 = advantage)
   *
   * @example
   * ```typescript
   * const effectiveness = trigramSystem.calculateStanceEffectiveness(
   *   TrigramStance.GAM,  // Water
   *   TrigramStance.LI    // Fire
   * ); // Returns > 1.0 (Water beats Fire)
   * ```
   *
   * @public
   * @korean 자세효과성계산
   */
  calculateStanceEffectiveness(
    attackerStance: TrigramStance,
    defenderStance: TrigramStance
  ): number {
    return this.calculator.calculateStanceEffectiveness(
      attackerStance,
      defenderStance
    );
  }

  /**
   * Gets bilingual name for a stance.
   *
   * Returns Korean (Hangul) and English names for display purposes.
   *
   * @param stance - Stance to get name for
   * @returns Object with korean and english name properties
   *
   * @example
   * ```typescript
   * const name = trigramSystem.getStanceName(TrigramStance.GEON);
   * console.log(`${name.korean} (${name.english})`); // "건 (Heaven)"
   * ```
   *
   * @public
   * @korean 자세이름조회
   */
  getStanceName(stance: TrigramStance): { korean: string; english: string } {
    const stanceNames = {
      [TrigramStance.GEON]: { korean: "건", english: "Heaven" },
      [TrigramStance.TAE]: { korean: "태", english: "Lake" },
      [TrigramStance.LI]: { korean: "리", english: "Fire" },
      [TrigramStance.JIN]: { korean: "진", english: "Thunder" },
      [TrigramStance.SON]: { korean: "손", english: "Wind" },
      [TrigramStance.GAM]: { korean: "감", english: "Water" },
      [TrigramStance.GAN]: { korean: "간", english: "Mountain" },
      [TrigramStance.GON]: { korean: "곤", english: "Earth" },
    };

    return stanceNames[stance] || { korean: "Unknown", english: "Unknown" };
  }

  /**
   * Gets complete stance data for UI display.
   *
   * Returns structured data object containing stance ID and bilingual names.
   *
   * @param stance - Stance to get data for
   * @returns Stance data object
   *
   * @public
   * @korean 자세데이터조회
   */
  getCurrentStanceData(stance: TrigramStance): {
    id: TrigramStance;
    name: KoreanText;
    korean: string;
    english: string;
  } {
    const stanceName = this.getStanceName(stance);
    return {
      id: stance,
      name: stanceName,
      korean: stanceName.korean,
      english: stanceName.english,
    };
  }

  /**
   * Validates a stance transition with detailed feedback.
   *
   * Checks if transition is valid and provides reason if not.
   * More detailed than {@link canTransitionTo}, includes specific failure reasons.
   *
   * @param fromStance - Current stance
   * @param toStance - Target stance
   * @param player - Player state
   * @returns Validation result with optional failure reason
   *
   * @example
   * ```typescript
   * const validation = trigramSystem.validateTransition(
   *   TrigramStance.GEON,
   *   TrigramStance.GON,
   *   player
   * );
   * if (!validation.valid) {
   *   console.error(validation.reason);
   * }
   * ```
   *
   * @public
   * @korean 자세전환검증
   */
  validateTransition(
    fromStance: TrigramStance,
    toStance: TrigramStance,
    player: PlayerState
  ): { valid: boolean; reason?: string } {
    if (fromStance === toStance) {
      return { valid: true };
    }

    const cost = this.getTransitionCost(fromStance, toStance, player);

    if (player.ki < cost.ki) {
      return {
        valid: false,
        reason: `Insufficient Ki: need ${cost.ki}, have ${player.ki}`,
      };
    }

    if (player.stamina < cost.stamina) {
      return {
        valid: false,
        reason: `Insufficient Stamina: need ${cost.stamina}, have ${player.stamina}`,
      };
    }

    return { valid: true };
  }
}

export default TrigramSystem;
