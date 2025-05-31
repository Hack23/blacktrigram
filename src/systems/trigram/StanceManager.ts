import type {
  TrigramStance,
  PlayerState,
  KiFlowFactors,
  TransitionMetrics,
  StanceState,
  StanceTransition,
  StanceRecommendation,
  TransitionResult,
  StanceAnalysis,
} from "../../types";
import {
  TRIGRAM_DATA,
  STANCE_EFFECTIVENESS_MATRIX,
  TRIGRAM_STANCES_ORDER,
} from "../../types";
import { TransitionCalculator } from "./TransitionCalculator";

/**
 * Korean Martial Arts Stance Manager
 * Manages trigram stance transitions, ki flow, and combat effectiveness
 * Based on traditional I-Ching philosophy and Korean martial arts principles
 */

// Export for tests
export const STANCE_ORDER = TRIGRAM_STANCES_ORDER;

export class StanceManager {
  private playerStances = new Map<string, StanceState>();
  private activeTransitions = new Map<string, StanceTransition>();
  private stanceMasteryData = new Map<string, Map<TrigramStance, number>>();
  private transitionHistory: Array<{
    playerId: string;
    from: TrigramStance;
    to: TrigramStance;
    timestamp: number;
  }> = [];

  // Static helper methods
  public static getPlayerLevelModifier(playerLevel: number = 1): number {
    return Math.min(2.0, 1.0 + (playerLevel - 1) * 0.1);
  }

  public static getStanceAffinity(
    fromStance: TrigramStance,
    toStance: TrigramStance
  ): number {
    if (fromStance === toStance) return 1.0;

    const distance = this.calculateStanceDistance(fromStance, toStance);
    return Math.max(0.5, 1.0 - (distance - 1) * 0.2);
  }

  public static calculateKiFlow(
    stance: TrigramStance,
    factors: KiFlowFactors
  ): number {
    const baseFlow = TRIGRAM_DATA[stance].kiRegenRate || 1.0;
    const playerModifier = factors.playerLevelModifier || 1.0;
    const affinityModifier = factors.stanceAffinity || 1.0;

    return baseFlow * playerModifier * affinityModifier;
  }

  /**
   * Calculate transition metrics between stances
   */
  public static calculateTransition(
    fromStance: TrigramStance,
    toStance: TrigramStance,
    playerLevel: number = 1
  ): TransitionMetrics {
    // Use parameters that match TransitionCalculator.calculateTransition signature
    return TransitionCalculator.calculateTransition(fromStance, toStance, {
      playerLevelModifier: StanceManager.getPlayerLevelModifier(playerLevel),
      stanceAffinity: StanceManager.getStanceAffinity(fromStance, toStance),
      // Remove timeInStance if it's not part of the expected interface
    });
  }

  /**
   * Initialize stance state for a player
   */
  public initializeStanceState(
    playerId: string,
    initialStance: TrigramStance = "geon"
  ): void {
    const stanceState: StanceState = {
      current: initialStance,
      previous: null,
      timeInStance: 0,
      transitionCooldown: 0,
      lastTransitionTime: 0,
      stability: 1.0,
      mastery: 0.0,
    };

    this.playerStances.set(playerId, stanceState);

    // Initialize mastery data
    if (!this.stanceMasteryData.has(playerId)) {
      const masteryMap = new Map<TrigramStance, number>();
      STANCE_ORDER.forEach((stance) => masteryMap.set(stance, 0));
      this.stanceMasteryData.set(playerId, masteryMap);
    }
  }

  /**
   * Transition to new stance
   */
  public transitionToStance(
    playerId: string,
    newStance: TrigramStance,
    force: boolean = false
  ): boolean {
    const currentState = this.playerStances.get(playerId);
    if (!currentState) {
      this.initializeStanceState(playerId, newStance);
      return true;
    }

    if (!force && !this.canTransitionToStance(playerId, newStance)) {
      return false;
    }

    // Calculate transition metrics with correct parameters
    const transitionMetrics = TransitionCalculator.calculateTransition(
      currentState.current,
      newStance,
      {
        playerLevelModifier: StanceManager.getPlayerLevelModifier(1),
        stanceAffinity: StanceManager.getStanceAffinity(
          currentState.current,
          newStance
        ),
        // Remove timeInStance - it's not expected by TransitionCalculator
      }
    );

    // Update stance state
    const updatedState: StanceState = {
      current: newStance,
      previous: currentState.current,
      timeInStance: 0,
      transitionCooldown: transitionMetrics.cooldown || 1000,
      lastTransitionTime: Date.now(),
      stability: (currentState.stability || 1.0) * 0.8, // Reduce stability after transition
      mastery: currentState.mastery || 0.0,
    };

    this.playerStances.set(playerId, updatedState);

    // Record transition
    this.transitionHistory.push({
      playerId,
      from: currentState.current,
      to: newStance,
      timestamp: Date.now(),
    });

    return true;
  }

  /**
   * Execute transition for player with proper return type
   */
  public executeTransition(
    player: PlayerState,
    newStance: TrigramStance
  ): TransitionResult {
    if (!this.canTransition(player, newStance)) {
      return {
        success: false,
        message: "Cannot transition to stance",
        transitionData: {
          success: false,
          reason: player.conditions.some((c) => c.type === "stun")
            ? "Cannot change stance while stunned"
            : "Insufficient resources or invalid transition",
        },
        updatedPlayer: player,
      };
    }

    // Use the correct calculateTransition method with proper parameters
    const transition = TransitionCalculator.calculateTransition(
      player.stance,
      newStance,
      {
        playerLevelModifier: StanceManager.getPlayerLevelModifier(1),
        stanceAffinity: StanceManager.getStanceAffinity(
          player.stance,
          newStance
        ),
        // Remove timeInStance - not expected by TransitionCalculator
      }
    );

    const updatedPlayer: PlayerState = {
      ...player,
      stance: newStance,
      ki: player.ki - transition.kiCost,
      stamina: player.stamina - transition.staminaCost,
      lastStanceChangeTime: Date.now(),
    };

    this.transitionHistory.push({
      playerId: player.playerId,
      from: player.stance,
      to: newStance,
      timestamp: Date.now(),
    });

    return {
      success: true,
      message: "Stance transition successful",
      transitionData: {
        success: true,
        cost: transition.kiCost + transition.staminaCost,
      },
      updatedPlayer,
    };
  }

  /**
   * Get stance analysis between attacker and defender
   */
  public getStanceAnalysis(
    attackerStance: TrigramStance,
    defenderStance: TrigramStance
  ): StanceAnalysis {
    const advantage = StanceManager.calculateStanceAdvantage(
      attackerStance,
      defenderStance
    );

    let recommendation = "";
    let effectiveness = advantage;

    if (advantage > 1.2) {
      recommendation = "Strong advantage - continue with current stance";
    } else if (advantage < 0.8) {
      const counter = StanceManager.getCounterStance(defenderStance);
      recommendation = `Consider switching to ${counter} for advantage`;
    } else {
      recommendation = "Neutral matchup - maintain current strategy";
    }

    return {
      advantage,
      effectiveness,
      recommendation,
      counterStances: [StanceManager.getCounterStance(defenderStance)],
    };
  }

  /**
   * Get optimal stance recommendation with proper return type
   */
  public getOptimalStance(
    currentStance: TrigramStance,
    targetStance: TrigramStance,
    playerState: PlayerState
  ): StanceRecommendation {
    const efficient =
      StanceManager.getStancesByTransitionEfficiency(currentStance);

    for (const stance of efficient) {
      if (this.canTransition(playerState, stance)) {
        const advantage = StanceManager.calculateStanceAdvantage(
          stance,
          targetStance
        );
        if (advantage >= 1.1) {
          return {
            recommendedStance: stance,
            reason: `${stance} provides advantage against ${targetStance}`,
            confidence: Math.min(1.0, advantage),
            alternatives: efficient.slice(0, 3),
          };
        }
      }
    }

    return {
      recommendedStance: currentStance,
      reason:
        playerState.ki < 10 || playerState.stamina < 10
          ? "No available transitions - insufficient resources"
          : "Stay in current stance - no clear advantage available",
      confidence: 0.5,
    };
  }

  /**
   * Calculate current stance analytics with corrected methods
   */
  public getStanceAnalytics(playerId: string): {
    efficiency: number;
    kiFlow: number;
    stabilityIndex: number;
    masteryLevel: number;
  } {
    const state = this.playerStances.get(playerId);
    if (!state) {
      return { efficiency: 0, kiFlow: 0, stabilityIndex: 0, masteryLevel: 0 };
    }

    return {
      efficiency: this.calculateStanceEffectiveness(playerId),
      kiFlow: StanceManager.calculateKiFlow(state.current, {
        playerLevelModifier: 1.0,
        stanceAffinity: 1.0,
        timeInStance: state.timeInStance,
      }),
      stabilityIndex: state.stability || 0,
      masteryLevel: state.mastery || 0,
    };
  }

  /**
   * Calculate stance effectiveness (renamed from efficiency)
   */
  private calculateStanceEffectiveness(playerId: string): number {
    const state = this.playerStances.get(playerId);
    if (!state) return 0;

    const stabilityBonus = (state.stability || 0) * 0.2;
    const masteryBonus = (state.mastery || 0) * 0.3;

    return Math.min(1.0, 0.5 + stabilityBonus + masteryBonus);
  }

  /**
   * Increase stance mastery
   */
  public increaseMastery(playerId: string, stance: TrigramStance): void {
    const masteryMap = this.stanceMasteryData.get(playerId);
    if (masteryMap) {
      const currentMastery = masteryMap.get(stance) || 0;
      masteryMap.set(stance, Math.min(1.0, currentMastery + 0.01));
    }
  }

  /**
   * Get stance mastery level
   */
  public getMasteryLevel(playerId: string, stance: TrigramStance): number {
    const masteryMap = this.stanceMasteryData.get(playerId);
    return masteryMap?.get(stance) || 0;
  }

  /**
   * Enhanced ki flow calculation
   */
  public calculateAdvancedKiFlow(
    playerId: string,
    stance: TrigramStance
  ): number {
    const factors: KiFlowFactors = {
      playerLevelModifier: StanceManager.getPlayerLevelModifier(1),
      stanceAffinity: StanceManager.getStanceAffinity(stance, stance),
      timeInStance: this.playerStances.get(playerId)?.timeInStance || 0,
    };

    return StanceManager.calculateKiFlow(stance, factors);
  }

  /**
   * Start stance transition
   */
  public startTransition(
    playerId: string,
    from: TrigramStance,
    to: TrigramStance
  ): void {
    const transition: StanceTransition = {
      from,
      to,
      startTime: Date.now(),
      duration: 1000,
      progress: 0,
      playerId,
      isActive: true,
    };

    this.activeTransitions.set(playerId, transition);

    const currentState = this.playerStances.get(playerId);
    if (currentState) {
      const updatedState: StanceState = {
        ...currentState,
        previous: currentState.current,
        current: to,
        timeInStance: 0,
        lastTransitionTime: Date.now(),
        stability: 0.8,
        mastery: currentState.mastery || 0,
      };
      this.playerStances.set(playerId, updatedState);
    }
  }

  /**
   * Calculate transition recovery time
   */
  public calculateRecoveryTime(playerId: string): number {
    const state = this.playerStances.get(playerId);
    if (!state) return 0;

    const baseRecovery = 2000;
    const masteryBonus = (state.mastery || 0) * 0.3;

    return Math.max(500, baseRecovery * (1 - masteryBonus));
  }

  /**
   * Calculate flow state bonus (removed unused parameter)
   */
  public calculateFlowStateBonus(): number {
    const factors: KiFlowFactors = {
      playerLevelModifier: 1.0,
      stanceAffinity: 1.0,
      timeInStance: 0,
    };

    return StanceManager.calculateKiFlow("geon", factors);
  }

  // Static methods for stance calculations

  /**
   * Calculate ki flow rate for stance with player state
   */
  public static calculateKiFlowRate(
    stance: TrigramStance,
    playerState: PlayerState
  ): number {
    const factors: KiFlowFactors = {
      playerLevelModifier: StanceManager.getPlayerLevelModifier(1),
      stanceAffinity: StanceManager.getStanceAffinity(
        stance,
        playerState.stance
      ),
      timeInStance: playerState.lastStanceChangeTime
        ? Date.now() - playerState.lastStanceChangeTime
        : 0,
    };

    return StanceManager.calculateKiFlow(stance, factors);
  }

  /**
   * Get counter stance for given stance
   */
  public static getCounterStance(stance: TrigramStance): TrigramStance {
    let bestCounter: TrigramStance = "geon";
    let bestEffectiveness = 0;

    (Object.keys(STANCE_EFFECTIVENESS_MATRIX) as TrigramStance[]).forEach(
      (counterStance) => {
        const effectiveness =
          STANCE_EFFECTIVENESS_MATRIX[counterStance][stance];
        if (effectiveness > bestEffectiveness) {
          bestEffectiveness = effectiveness;
          bestCounter = counterStance;
        }
      }
    );

    return bestCounter;
  }

  /**
   * Calculate stance advantage between attacker and defender
   */
  public static calculateStanceAdvantage(
    attackerStance: TrigramStance,
    defenderStance: TrigramStance
  ): number {
    return STANCE_EFFECTIVENESS_MATRIX[attackerStance][defenderStance];
  }

  /**
   * Calculate distance between two stances in the trigram circle
   */
  public static calculateStanceDistance(
    fromStance: TrigramStance,
    toStance: TrigramStance
  ): number {
    const fromIndex = STANCE_ORDER.indexOf(fromStance);
    const toIndex = STANCE_ORDER.indexOf(toStance);

    if (fromIndex === -1 || toIndex === -1) {
      throw new Error("Invalid stance provided");
    }

    const direct = Math.abs(toIndex - fromIndex);
    const wrap = STANCE_ORDER.length - direct;

    return Math.min(direct, wrap);
  }

  /**
   * Get adjacent stances (previous and next in the trigram circle)
   */
  public static getAdjacentStances(stance: TrigramStance): {
    previous: TrigramStance;
    next: TrigramStance;
  } {
    const index = STANCE_ORDER.indexOf(stance);
    if (index === -1) {
      throw new Error("Invalid stance provided");
    }

    const previousIndex =
      (index - 1 + STANCE_ORDER.length) % STANCE_ORDER.length;
    const nextIndex = (index + 1) % STANCE_ORDER.length;

    const previous = STANCE_ORDER[previousIndex];
    const next = STANCE_ORDER[nextIndex];

    if (!previous || !next) {
      throw new Error("Failed to find adjacent stances");
    }

    return { previous, next };
  }

  /**
   * Check if transition is optimal (adjacent or strategic)
   */
  public static isOptimalTransition(
    fromStance: TrigramStance,
    toStance: TrigramStance
  ): boolean {
    if (fromStance === toStance) return true;

    const distance = this.calculateStanceDistance(fromStance, toStance);
    const effectiveness = STANCE_EFFECTIVENESS_MATRIX[toStance][fromStance];

    return distance <= 1 || effectiveness >= 1.2;
  }

  /**
   * Get stances sorted by transition efficiency from current stance
   */
  public static getStancesByTransitionEfficiency(
    currentStance: TrigramStance
  ): TrigramStance[] {
    return STANCE_ORDER.filter((stance) => stance !== currentStance).sort(
      (a, b) => {
        const distanceA = this.calculateStanceDistance(currentStance, a);
        const distanceB = this.calculateStanceDistance(currentStance, b);
        const effectivenessA = STANCE_EFFECTIVENESS_MATRIX[a][currentStance];
        const effectivenessB = STANCE_EFFECTIVENESS_MATRIX[b][currentStance];

        const scoreA = effectivenessA / (distanceA + 1);
        const scoreB = effectivenessB / (distanceB + 1);

        return scoreB - scoreA;
      }
    );
  }

  // Instance methods for state management

  /**
   * Check if player can transition to new stance
   */
  public canTransition(player: PlayerState, newStance: TrigramStance): boolean {
    if (player.stance === newStance) return false;

    if (
      player.conditions.some((c) => c.type === "stun" || c.type === "paralysis")
    ) {
      return false;
    }

    if (player.isAttacking) return false;

    const cooldownTime = 500;
    if (
      player.lastStanceChangeTime &&
      Date.now() - player.lastStanceChangeTime < cooldownTime
    ) {
      return false;
    }

    const transition = StanceManager.calculateTransition(
      player.stance,
      newStance
    );
    return (
      player.ki >= transition.kiCost && player.stamina >= transition.staminaCost
    );
  }

  /**
   * Check if can transition to stance (internal method)
   */
  private canTransitionToStance(
    playerId: string,
    newStance: TrigramStance
  ): boolean {
    const state = this.playerStances.get(playerId);
    if (!state) return true;

    if (state.current === newStance) return false;

    const cooldownTime = 500;
    if (Date.now() - state.lastTransitionTime < cooldownTime) {
      return false;
    }

    return true;
  }

  /**
   * Get transition history
   */
  public getTransitionHistory(): Array<{
    playerId: string;
    from: TrigramStance;
    to: TrigramStance;
    timestamp: number;
  }> {
    return [...this.transitionHistory];
  }

  /**
   * Clear transition history
   */
  public clearHistory(): void {
    this.transitionHistory = [];
  }

  /**
   * Get stance state
   */
  public getStanceState(playerId: string): StanceState | null {
    return this.playerStances.get(playerId) || null;
  }

  /**
   * Get active transition
   */
  public getActiveTransition(playerId: string): StanceTransition | null {
    return this.activeTransitions.get(playerId) || null;
  }

  /**
   * Clear all data
   */
  public clearAll(): void {
    this.playerStances.clear();
    this.activeTransitions.clear();
    this.transitionHistory = [];
    this.stanceMasteryData.clear();
  }
}

// Global stance manager instance
export const stanceManager = new StanceManager();
