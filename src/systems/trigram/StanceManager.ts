import { TrigramStance } from "../../types/common";
import { PlayerState } from "../player";
import { PLAYER_ARCHETYPES_DATA } from "../types";
import { TrigramCalculator } from "./TrigramCalculator";
import { StanceLaterality, TrigramTransitionCost } from "./types";

export interface StanceChangeResult {
  readonly success: boolean;
  readonly updatedPlayer: PlayerState;
  readonly cost: TrigramTransitionCost;
  readonly laterality?: StanceLaterality;
  readonly message?: string;
}

/**
 * Manager for trigram stance changes and laterality state
 * 
 * **Korean**: 자세 관리자
 * 
 * Manages both trigram stance selection (8 stances) and laterality (left/right).
 * Supports authentic Korean martial arts stance configurations with:
 * - 8 trigram stances (☰–☷)
 * - 2 laterality options (left/right foot forward)
 * - 16 total stance configurations
 * 
 * Laterality transitions take 400ms (24 frames @ 60fps) and cost 2 stamina.
 */
export class StanceManager {
  private readonly minTransitionInterval = 500;
  private readonly lateralityTransitionTime = 400; // 400ms for stance side switch
  private currentStance?: TrigramStance;
  private currentLaterality: StanceLaterality = "right"; // Default: right foot forward

  constructor() {
    // No initialization needed
  }

  /**
   * Get the current stance
   * 
   * @returns Current trigram stance or undefined if not set
   * @korean 현재자세가져오기
   */
  public getCurrent(): TrigramStance | undefined {
    return this.currentStance;
  }

  /**
   * Get the current stance laterality (left or right foot forward)
   * 
   * **Korean**: 현재 측면성
   * 
   * @returns Current laterality ("left" or "right")
   * @korean 현재측면성가져오기
   */
  public getCurrentLaterality(): StanceLaterality {
    return this.currentLaterality;
  }

  /**
   * Switch stance side (left ↔ right) without changing trigram stance
   * 
   * **Korean**: 자세 측면 전환
   * 
   * Mirrors the current guard position from left to right or vice versa.
   * Takes 400ms (24 frames @ 60fps) and costs 2 stamina.
   * 
   * Korean terminology:
   * - 왼발서기 (Oenbal Seogi): Left foot forward
   * - 오른발서기 (Oreun Bal Seogi): Right foot forward
   * 
   * @param player - Current player state
   * @returns Result with updated laterality
   * @korean 측면전환
   */
  public switchStanceSide(player: PlayerState): StanceChangeResult {
    const lateralityCost: TrigramTransitionCost = {
      ki: 0,
      stamina: 2,
      timeMilliseconds: this.lateralityTransitionTime,
    };

    // Check if player has enough stamina
    if (player.stamina < lateralityCost.stamina) {
      return {
        success: false,
        updatedPlayer: player,
        cost: lateralityCost,
        laterality: this.currentLaterality,
        message: "Insufficient stamina to switch stance side",
      };
    }

    // Check cooldown
    const timeSinceLastChange = Date.now() - (player.lastStanceChangeTime || 0);
    if (timeSinceLastChange < this.minTransitionInterval) {
      return {
        success: false,
        updatedPlayer: player,
        cost: lateralityCost,
        laterality: this.currentLaterality,
        message: "Stance side switch on cooldown",
      };
    }

    // Switch laterality
    const newLaterality: StanceLaterality = 
      this.currentLaterality === "left" ? "right" : "left";
    this.currentLaterality = newLaterality;

    // Apply stamina cost and update timestamp
    const updatedPlayer: PlayerState = {
      ...player,
      stamina: Math.max(0, player.stamina - lateralityCost.stamina),
      lastStanceChangeTime: Date.now(),
    };

    return {
      success: true,
      updatedPlayer,
      cost: lateralityCost,
      laterality: newLaterality,
    };
  }

  /**
   * Attempt to change stance
   * 
   * @param player - Current player state
   * @param newStance - Target trigram stance
   * @returns Result with success status and updated player
   * @korean 자세변경
   */
  changeStance(
    player: PlayerState,
    newStance: TrigramStance
  ): StanceChangeResult {
    const cost = this.getStanceTransitionCost(
      player.currentStance,
      newStance,
      player
    );

    // Check if transition is possible
    if (!this.canChangeStance(player, newStance)) {
      return {
        success: false,
        updatedPlayer: player,
        cost,
        laterality: this.currentLaterality,
        message:
          "Cannot change stance - insufficient resources or cooldown active",
      };
    }

    // Same stance - no cost, but update laterality info
    if (player.currentStance === newStance) {
      this.currentStance = newStance;
      return {
        success: true,
        updatedPlayer: {
          ...player,
          lastStanceChangeTime: Date.now(),
        },
        cost: { ki: 0, stamina: 0, timeMilliseconds: 0 },
        laterality: this.currentLaterality,
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

    return {
      success: true,
      updatedPlayer,
      cost,
      laterality: this.currentLaterality,
    };
  }

  /**
   * Check if player can change to the specified stance
   */
  canChangeStance(player: PlayerState, newStance: TrigramStance): boolean {
    const cost = this.getStanceTransitionCost(
      player.currentStance,
      newStance,
      player
    );

    // Check resources
    if (player.ki < cost.ki || player.stamina < cost.stamina) {
      return false;
    }

    // Check cooldown
    const timeSinceLastChange = Date.now() - (player.lastStanceChangeTime || 0);
    if (timeSinceLastChange < this.minTransitionInterval) {
      return false;
    }

    // Check if player is stunned or incapacitated
    if (player.isStunned || player.consciousness < 50) {
      return false;
    }

    return true;
  }

  /**
   * Calculate the cost of transitioning between stances
   */
  getStanceTransitionCost(
    fromStance: TrigramStance,
    toStance: TrigramStance,
    player: PlayerState
  ): TrigramTransitionCost {
    if (fromStance === toStance) {
      return { ki: 0, stamina: 0, timeMilliseconds: 0 };
    }

    const baseCost = { ki: 10, stamina: 15, timeMilliseconds: 500 };
    const difficulty = TrigramCalculator.calculateTransitionDifficulty(
      fromStance,
      toStance
    );
    const difficultyMultiplier = 1 + difficulty;

    // Apply archetype modifiers
    const archetypeData = PLAYER_ARCHETYPES_DATA[player.archetype];
    const favoredStances = archetypeData.favoredStances || [];
    const archetypeModifier = favoredStances.includes(toStance) ? 0.8 : 1.0;

    return {
      ki: Math.floor(baseCost.ki * difficultyMultiplier * archetypeModifier),
      stamina: Math.floor(
        baseCost.stamina * difficultyMultiplier * archetypeModifier
      ),
      timeMilliseconds: Math.floor(
        baseCost.timeMilliseconds * difficultyMultiplier
      ),
    };
  }

  /**
   * Get optimal stance recommendation
   */
  getOptimalStance(player: PlayerState, opponent?: PlayerState): TrigramStance {
    if (opponent) {
      // Get counter stance against opponent
      return TrigramCalculator.getCounterStance(opponent.currentStance);
    }

    // Default to archetype preferred stance
    const archetypeData = PLAYER_ARCHETYPES_DATA[player.archetype];
    const favoredStances = archetypeData.favoredStances || [];

    return favoredStances.length > 0 ? favoredStances[0] : TrigramStance.GEON; // Fix: Use enum value
  }

  /**
   * Get all valid transitions from current stance
   */
  getValidTransitions(player: PlayerState): TrigramStance[] {
    return Object.values(TrigramStance).filter(
      (
        stance // Fix: Use enum values
      ) => this.canChangeStance(player, stance)
    );
  }
}
