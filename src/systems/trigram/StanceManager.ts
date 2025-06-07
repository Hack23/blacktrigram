import type {
  PlayerState,
  TrigramStance,
  TransitionPath,
  TrigramTransitionCost,
} from "../../types";
import type { TrigramCalculator } from "./TrigramCalculator";

// Import constants or define them if they are specific to this module
import {
  MAX_TRANSITION_COST_KI,
  MAX_TRANSITION_COST_STAMINA,
  MAX_TRANSITION_TIME_MILLISECONDS,
} from "../../types/constants";

const DEFAULT_STANCE_COOLDOWN_MS = 500;

export interface StanceTransitionResult {
  // Ensure this interface is defined or imported
  readonly from: TrigramStance;
  readonly to: TrigramStance;
  readonly cost: TrigramTransitionCost;
  readonly effectiveness: number; // Effectiveness of the new stance or transition
  readonly success: boolean;
  readonly reason?: string; // Reason for failure
  readonly newState: PlayerState; // Player state after transition attempt
  readonly timestamp: number; // Timestamp of the transition attempt
}

export class StanceManager {
  private trigramCalculator: TrigramCalculator;

  constructor(trigramCalculator: TrigramCalculator) {
    this.trigramCalculator = trigramCalculator;
  }

  public changeStance(
    playerState: PlayerState,
    targetStance: TrigramStance
  ): StanceTransitionResult {
    const now = Date.now();

    if (playerState.currentStance === targetStance) {
      return {
        from: playerState.currentStance,
        to: targetStance,
        cost: { ki: 0, stamina: 0, timeMilliseconds: 0 },
        effectiveness: 1, // No change, effectiveness is neutral or current
        success: true, // Technically successful as already in stance
        newState: playerState,
        timestamp: now,
      };
    }

    // Check cooldown
    if (
      now - (playerState.lastStanceChangeTime || 0) <
      DEFAULT_STANCE_COOLDOWN_MS
    ) {
      return {
        from: playerState.currentStance,
        to: targetStance,
        cost: { ki: 0, stamina: 0, timeMilliseconds: 0 }, // No cost incurred for failed attempt due to cooldown
        effectiveness: 0,
        success: false,
        reason: "Stance change on cooldown",
        newState: playerState, // State remains unchanged
        timestamp: now,
      };
    }

    const transitionCheck = this.canTransitionTo(playerState, targetStance);
    if (!transitionCheck.possible) {
      return {
        from: playerState.currentStance,
        to: targetStance,
        cost: transitionCheck.cost || {
          ki: 0,
          stamina: 0,
          timeMilliseconds: 0,
        }, // Cost that would have been if possible
        effectiveness: 0,
        success: false,
        reason: transitionCheck.reason || "Cannot transition",
        newState: playerState,
        timestamp: now,
      };
    }

    const transitionCost = transitionCheck.cost!; // Cost is available if possible

    // Successful transition
    const newState: PlayerState = {
      ...playerState,
      currentStance: targetStance,
      ki: playerState.ki - transitionCost.ki,
      stamina: playerState.stamina - transitionCost.stamina,
      lastStanceChangeTime: now,
    };

    // Effectiveness could be related to the target stance or the transition itself
    const effectiveness = this.trigramCalculator.getStanceEffectiveness(
      targetStance,
      playerState.currentStance
    ); // Example: effectiveness of new stance vs old

    return {
      from: playerState.currentStance,
      to: targetStance,
      cost: transitionCost,
      effectiveness: effectiveness, // Placeholder, calculate actual effectiveness
      success: true,
      newState,
      timestamp: now,
    };
  }

  public canTransitionTo(
    playerState: PlayerState,
    targetStance: TrigramStance
  ): { possible: boolean; reason?: string; cost?: TrigramTransitionCost } {
    if (playerState.currentStance === targetStance) {
      return {
        possible: true,
        cost: { ki: 0, stamina: 0, timeMilliseconds: 0 },
      };
    }
    const now = Date.now();
    const cooldown = DEFAULT_STANCE_COOLDOWN_MS;

    if (
      playerState.lastStanceChangeTime &&
      now - playerState.lastStanceChangeTime < cooldown
    ) {
      return { possible: false, reason: "cooldown_active" };
    }

    const cost = this.trigramCalculator.calculateTransitionCost(
      playerState.currentStance,
      targetStance,
      playerState
    );

    if (playerState.ki < cost.ki) {
      return { possible: false, reason: "insufficient_ki", cost };
    }
    if (playerState.stamina < cost.stamina) {
      return { possible: false, reason: "insufficient_stamina", cost };
    }
    if (cost.ki > MAX_TRANSITION_COST_KI) {
      return { possible: false, reason: "exceeds_max_ki_cost", cost };
    }
    if (cost.stamina > MAX_TRANSITION_COST_STAMINA) {
      return { possible: false, reason: "exceeds_max_stamina_cost", cost };
    }
    if (cost.timeMilliseconds > MAX_TRANSITION_TIME_MILLISECONDS) {
      return { possible: false, reason: "exceeds_max_transition_time", cost };
    }

    return { possible: true, cost };
  }

  public findOptimalStancePath(
    playerState: PlayerState,
    targetStance: TrigramStance, // Changed from opponentStance to targetStance for clarity
    _maxDepth: number = 3 // Mark as unused if not passed to calculator
  ): TransitionPath | null {
    // Delegate to TrigramCalculator, ensuring all parameters are passed correctly
    return this.trigramCalculator.calculateOptimalPath(
      playerState.currentStance,
      targetStance, // Pass targetStance
      playerState
      // maxDepth // Pass maxDepth if calculateOptimalPath uses it
    );
  }

  public executeStanceTransition(
    // This method is very similar to changeStance, consider consolidating
    playerState: PlayerState,
    targetStance: TrigramStance
  ): StanceTransitionResult {
    // This is essentially the success path of changeStance.
    // For DRY principle, changeStance should be the main method.
    // If this has a different purpose (e.g., forcing transition ignoring some checks),
    // its logic should reflect that. For now, assuming it's a direct execution.

    const canTrans = this.canTransitionTo(playerState, targetStance);
    if (!canTrans.possible) {
      return {
        from: playerState.currentStance,
        to: targetStance,
        cost: canTrans.cost || { ki: 0, stamina: 0, timeMilliseconds: 0 },
        effectiveness: 0,
        success: false,
        reason: canTrans.reason || "Cannot execute transition",
        newState: playerState,
        timestamp: Date.now(),
      };
    }

    const transitionCost = canTrans.cost!; // Should be defined if possible

    const newPlayerState: PlayerState = {
      ...playerState,
      currentStance: targetStance,
      ki: playerState.ki - transitionCost.ki,
      stamina: playerState.stamina - transitionCost.stamina,
      lastStanceChangeTime: Date.now(),
    };

    const effectiveness = this.trigramCalculator.getStanceEffectiveness(
      targetStance,
      playerState.currentStance
    );

    return {
      from: playerState.currentStance,
      to: targetStance,
      cost: transitionCost,
      effectiveness: effectiveness, // Placeholder
      success: true,
      newState: newPlayerState,
      timestamp: Date.now(),
    };
  }
}
