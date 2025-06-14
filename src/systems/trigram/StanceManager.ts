/**
 * ## Stance Manager System
 *
 * **Business Purpose:**
 * Central management system for Korean martial arts stance transitions and
 * trigram-based combat positioning within Black Trigram.
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */

import { TrigramStance, PlayerArchetype } from "../../types/enums";
import type { PlayerState } from "../../types/player";
import { TransitionCalculator } from "./TransitionCalculator";

export interface StanceChangeResult {
  readonly success: boolean;
  readonly updatedPlayer: PlayerState;
  readonly cost: {
    readonly ki: number;
    readonly stamina: number;
    readonly time: number;
  };
  readonly message: string;
}

export class StanceManager {
  private currentStance: TrigramStance = TrigramStance.GEON;
  private transitionCalculator: TransitionCalculator;

  constructor() {
    this.transitionCalculator = new TransitionCalculator();
  }

  /**
   * **Business Logic:** Changes player stance with Korean martial arts validation
   */
  changeStance(
    player: PlayerState,
    targetStance: TrigramStance
  ): StanceChangeResult {
    // Same stance check
    if (player.currentStance === targetStance) {
      return {
        success: true,
        updatedPlayer: player,
        cost: { ki: 0, stamina: 0, time: 0 },
        message: "이미 해당 자세입니다",
      };
    }

    // Calculate transition cost
    const cost = this.transitionCalculator.calculateTransitionCost(
      player,
      targetStance
    );

    // Check if player has sufficient resources
    if (player.ki < cost.ki || player.stamina < cost.stamina) {
      return {
        success: false,
        updatedPlayer: player,
        cost,
        message: `자원 부족 - 기력: ${cost.ki}, 체력: ${cost.stamina}`,
      };
    }

    // Check cooldown
    const timeSinceLastChange = Date.now() - player.lastStanceChangeTime;
    if (timeSinceLastChange < 300) {
      // 300ms cooldown
      return {
        success: false,
        updatedPlayer: player,
        cost,
        message: "자세 변경 대기 중",
      };
    }

    // Apply stance change
    const updatedPlayer: PlayerState = {
      ...player,
      currentStance: targetStance,
      ki: player.ki - cost.ki,
      stamina: player.stamina - cost.stamina,
      lastStanceChangeTime: Date.now(),
    };

    this.currentStance = targetStance;

    return {
      success: true,
      updatedPlayer,
      cost,
      message: `${targetStance} 자세로 변경 완료`,
    };
  }

  /**
   * **Business Logic:** Gets stance mastery bonus for archetype
   */
  getStanceMastery(archetype: PlayerArchetype, stance: TrigramStance): number {
    const masteryMap = {
      [PlayerArchetype.MUSA]: {
        [TrigramStance.GEON]: 1.3, // Heaven mastery
        [TrigramStance.GAN]: 1.2, // Mountain stability
      },
      [PlayerArchetype.AMSALJA]: {
        [TrigramStance.SON]: 1.4, // Wind stealth
        [TrigramStance.GAM]: 1.2, // Water adaptation
      },
      [PlayerArchetype.HACKER]: {
        [TrigramStance.LI]: 1.4, // Fire precision
        [TrigramStance.JIN]: 1.1, // Thunder speed
      },
      [PlayerArchetype.JEONGBO_YOWON]: {
        [TrigramStance.GAM]: 1.3, // Water observation
        [TrigramStance.TAE]: 1.2, // Lake communication
      },
      [PlayerArchetype.JOJIK_POKRYEOKBAE]: {
        [TrigramStance.JIN]: 1.3, // Thunder aggression
        [TrigramStance.GON]: 1.2, // Earth grounding
      },
    };

    return masteryMap[archetype]?.[stance] || 1.0;
  }

  /**
   * **Business Logic:** Gets available stances for player
   */
  getAvailableStances(player: PlayerState): TrigramStance[] {
    const allStances = Object.values(TrigramStance);

    return allStances.filter((stance) => {
      if (stance === player.currentStance) return false;

      const cost = this.transitionCalculator.calculateTransitionCost(player, stance);
      const hasResources = player.ki >= cost.ki && player.stamina >= cost.stamina;
      const cooldownReady = Date.now() - player.lastStanceChangeTime >= 300;

      return hasResources && cooldownReady;
    });
  }

  /**
   * **Business Logic:** Checks if stance change is possible
   */
  canChangeStance(player: PlayerState, targetStance: TrigramStance): boolean {
    if (player.currentStance === targetStance) return true;

    const cost = this.transitionCalculator.calculateTransitionCost(player, targetStance);
    const hasResources = player.ki >= cost.ki && player.stamina >= cost.stamina;
    const cooldownReady = Date.now() - player.lastStanceChangeTime >= 300;

    return hasResources && cooldownReady && !player.isStunned;
  }

  /**
   * **Business Logic:** Gets current stance
   */
  getCurrentStance(): TrigramStance {
    return this.currentStance;
  }

  /**
   * **Business Logic:** Resets stance manager
   */
  reset(initialStance: TrigramStance = TrigramStance.GEON): void {
    this.currentStance = initialStance;
  }
}

export default StanceManager;
    toStance: TrigramStance.GAM,
    difficulty: "medium",
    kiCost: 8,
    staminaCost: 5,
    minCooldown: 750,
  },
  {
    fromStance: TrigramStance.SON,
    toStance: TrigramStance.GEON,
    difficulty: "hard",
    kiCost: 15,
    staminaCost: 10,
    minCooldown: 1500,
  },

  // Water (감) transitions
  {
    fromStance: TrigramStance.GAM,
    toStance: TrigramStance.SON,
    difficulty: "easy",
    kiCost: 5,
    staminaCost: 3,
    minCooldown: 500,
  },
  {
    fromStance: TrigramStance.GAM,
    toStance: TrigramStance.GAN,
    difficulty: "medium",
    kiCost: 8,
    staminaCost: 5,
    minCooldown: 750,
  },
  {
    fromStance: TrigramStance.GAM,
    toStance: TrigramStance.LI,
    difficulty: "hard",
    kiCost: 15,
    staminaCost: 10,
    minCooldown: 1500,
  },

  // Mountain (간) transitions
  {
    fromStance: TrigramStance.GAN,
    toStance: TrigramStance.GAM,
    difficulty: "easy",
    kiCost: 5,
    staminaCost: 3,
    minCooldown: 500,
  },
  {
    fromStance: TrigramStance.GAN,
    toStance: TrigramStance.GON,
    difficulty: "medium",
    kiCost: 8,
    staminaCost: 5,
    minCooldown: 750,
  },
  {
    fromStance: TrigramStance.GAN,
    toStance: TrigramStance.TAE,
    difficulty: "hard",
    kiCost: 15,
    staminaCost: 10,
    minCooldown: 1500,
  },

  // Earth (곤) transitions
  {
    fromStance: TrigramStance.GON,
    toStance: TrigramStance.GAN,
    difficulty: "easy",
    kiCost: 5,
    staminaCost: 3,
    minCooldown: 500,
  },
  {
    fromStance: TrigramStance.GON,
    toStance: TrigramStance.TAE,
    difficulty: "medium",
    kiCost: 8,
    staminaCost: 5,
    minCooldown: 750,
  },
  {
    fromStance: TrigramStance.GON,
    toStance: TrigramStance.GEON,
    difficulty: "hard",
    kiCost: 15,
    staminaCost: 10,
    minCooldown: 1500,
  },
];

export class StanceManager {
  private currentStance: TrigramStance;

  constructor(initialStance: TrigramStance = TrigramStance.GEON) {
    this.currentStance = initialStance;
  }

  /**
   * **Business Logic:** Attempts to change player's stance following Korean martial arts principles
   *
   * **Korean Martial Arts Integration:**
   * - Validates transitions using traditional trigram relationships
   * - Applies archetype-specific bonuses and restrictions
   * - Respects ki and stamina resource management
   * - Enforces cooldown periods for realistic combat flow
   *
   * @param player - Current player state with resources and stance
   * @param newStance - Target trigram stance to transition to
   * @returns Result indicating success/failure and updated player state
   */
  changeStance(
    player: PlayerState,
    newStance: TrigramStance
  ): StanceChangeResult {
    // Same stance - no change needed but update timestamp
    if (player.currentStance === newStance) {
      return {
        success: true,
        updatedPlayer: {
          ...player,
          lastStanceChangeTime: Date.now(),
        },
        cost: { ki: 0, stamina: 0, timeMilliseconds: 0 },
        message: "이미 해당 자세입니다",
      };
    }

    // Find transition rule
    const transitionRule = this.getTransitionRule(
      player.currentStance,
      newStance
    );
    if (!transitionRule) {
      return {
        success: false,
        updatedPlayer: player,
        cost: { ki: 0, stamina: 0, timeMilliseconds: 0 },
        message: "불가능한 자세 전환입니다",
      };
    }

    // Calculate actual costs with archetype modifiers
    const cost = this.calculateStanceCost(player, transitionRule);

    // Check cooldown
    const timeSinceLastChange = Date.now() - player.lastStanceChangeTime;
    if (timeSinceLastChange < transitionRule.minCooldown) {
      return {
        success: false,
        updatedPlayer: player,
        cost,
        message: `자세 변경 대기시간: ${
          Math.ceil((transitionRule.minCooldown - timeSinceLastChange) / 100) /
          10
        }초`,
      };
    }

    // Check resource requirements
    if (player.ki < cost.ki || player.stamina < cost.stamina) {
      return {
        success: false,
        updatedPlayer: player,
        cost,
        message: player.ki < cost.ki ? "기력 부족" : "체력 부족",
      };
    }

    // Apply stance change
    const updatedPlayer: PlayerState = {
      ...player,
      currentStance: newStance,
      ki: Math.max(0, player.ki - cost.ki),
      stamina: Math.max(0, player.stamina - cost.stamina),
      lastStanceChangeTime: Date.now(),
    };

    this.currentStance = newStance;

    const stanceData = TRIGRAM_STANCES_DATA[newStance];
    return {
      success: true,
      updatedPlayer,
      cost,
      message: `${stanceData.korean} 자세로 전환`,
    };
  }

  /**
   * **Business Logic:** Checks if stance change is possible without actually executing it
   *
   * @param player - Current player state
   * @param newStance - Target stance to validate
   * @returns Whether the stance change is currently possible
   */
  canChangeStance(player: PlayerState, newStance: TrigramStance): boolean {
    if (player.currentStance === newStance) return true;

    const transitionRule = this.getTransitionRule(
      player.currentStance,
      newStance
    );
    if (!transitionRule) return false;

    const cost = this.calculateStanceCost(player, transitionRule);
    const timeSinceLastChange = Date.now() - player.lastStanceChangeTime;

    return (
      timeSinceLastChange >= transitionRule.minCooldown &&
      player.ki >= cost.ki &&
      player.stamina >= cost.stamina
    );
  }

  /**
   * **Business Logic:** Gets available stance options for current player state
   *
   * @param player - Current player state
   * @returns Array of stances that can be transitioned to
   */
  getAvailableStances(player: PlayerState): TrigramStance[] {
    return Object.values(TrigramStance).filter((stance) =>
      this.canChangeStance(player, stance)
    );
  }

  /**
   * **Business Logic:** Calculates stance mastery bonus for archetype
   *
   * @param archetype - Player's martial arts archetype
   * @param stance - Trigram stance to check mastery for
   * @returns Bonus multiplier for stance effectiveness
   */
  getStanceMastery(archetype: PlayerArchetype, stance: TrigramStance): number {
    const masteryMap: Record<
      PlayerArchetype,
      Partial<Record<TrigramStance, number>>
    > = {
      [PlayerArchetype.MUSA]: {
        [TrigramStance.GEON]: 1.3, // Warriors excel at Heaven stance
        [TrigramStance.GAN]: 1.2, // Strong Mountain defense
      },
      [PlayerArchetype.AMSALJA]: {
        [TrigramStance.SON]: 1.4, // Assassins master Wind techniques
        [TrigramStance.GAM]: 1.2, // Water flow for stealth
      },
      [PlayerArchetype.HACKER]: {
        [TrigramStance.LI]: 1.3, // Fire for precision strikes
        [TrigramStance.JIN]: 1.2, // Thunder for disruption
      },
      [PlayerArchetype.JEONGBO_YOWON]: {
        [TrigramStance.GAM]: 1.3, // Water for adaptability
        [TrigramStance.TAE]: 1.2, // Lake for information flow
      },
      [PlayerArchetype.JOJIK_POKRYEOKBAE]: {
        [TrigramStance.GON]: 1.2, // Earth for brutal efficiency
        [TrigramStance.JIN]: 1.2, // Thunder for intimidation
      },
    };

    return masteryMap[archetype][stance] || 1.0;
  }

  /**
   * **Business Logic:** Finds transition rule between two stances
   *
   * @private
   * @param fromStance - Current stance
   * @param toStance - Target stance
   * @returns Transition rule if valid, null otherwise
   */
  private getTransitionRule(
    fromStance: TrigramStance,
    toStance: TrigramStance
  ): StanceTransitionRule | null {
    return (
      STANCE_TRANSITION_RULES.find(
        (rule) => rule.fromStance === fromStance && rule.toStance === toStance
      ) || null
    );
  }

  /**
   * **Business Logic:** Calculates actual resource cost for stance change
   *
   * @private
   * @param player - Current player state
   * @param rule - Base transition rule
   * @returns Actual cost accounting for player condition and archetype
   */
  private calculateStanceCost(
    player: PlayerState,
    rule: StanceTransitionRule
  ): {
    ki: number;
    stamina: number;
    timeMilliseconds: number;
  } {
    // Base costs from rule
    let kiCost = rule.kiCost;
    let staminaCost = rule.staminaCost;
    let timeCost = rule.minCooldown;

    // Archetype modifiers
    const mastery = this.getStanceMastery(player.archetype, rule.toStance);
    if (mastery > 1.0) {
      kiCost = Math.floor(kiCost * 0.8); // 20% discount for mastered stances
      staminaCost = Math.floor(staminaCost * 0.8);
      timeCost = Math.floor(timeCost * 0.9); // Faster transitions
    }

    // Fatigue penalty - higher costs when resources are low
    const kiPercentage = player.ki / player.maxKi;
    const staminaPercentage = player.stamina / player.maxStamina;

    if (kiPercentage < 0.3) {
      kiCost = Math.ceil(kiCost * 1.5);
    }
    if (staminaPercentage < 0.3) {
      staminaCost = Math.ceil(staminaCost * 1.5);
    }

    return {
      ki: kiCost,
      stamina: staminaCost,
      timeMilliseconds: timeCost,
    };
  }

  /**
   * **Business Logic:** Gets current stance
   *
   * @returns Current trigram stance
   */
  getCurrentStance(): TrigramStance {
    return this.currentStance;
  }

  /**
   * **Business Logic:** Resets manager to initial state
   *
   * @param stance - Stance to reset to (default: Heaven)
   */
  reset(stance: TrigramStance = TrigramStance.GEON): void {
    this.currentStance = stance;
  }
}

export default StanceManager;
