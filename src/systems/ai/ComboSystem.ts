/**
 * AI Combo System for Korean Martial Arts
 * Manages multi-hit combo sequences based on trigram stances
 */

import { TrigramStance } from "@/types";
import { KoreanTechnique } from "@/systems/vitalpoint";
import { TRIGRAM_TECHNIQUES } from "@/systems/trigram";
import { PlayerState } from "@/systems/player";
import { AIPersonality } from "./AIPersonality";

/**
 * Combo sequence for a specific trigram stance
 */
export interface ComboSequence {
  readonly stanceId: TrigramStance;
  readonly techniques: readonly KoreanTechnique[];
  readonly minDistance: number;
  readonly maxDistance: number;
  readonly requiredKi: number;
  readonly requiredStamina: number;
  readonly name: {
    readonly korean: string;
    readonly english: string;
  };
}

/**
 * AI Combo System manages combo execution and decision-making
 */
export class AIComboSystem {
  private comboSequences: Map<TrigramStance, ComboSequence[]>;
  private currentCombo: KoreanTechnique[] = [];
  private comboProgress = 0;
  private lastComboTime = 0;
  private readonly comboTimeout = 2000; // 2 seconds to continue combo

  constructor() {
    this.comboSequences = this.initializeComboSequences();
  }

  /**
   * Initialize combo sequences for each trigram stance
   */
  private initializeComboSequences(): Map<TrigramStance, ComboSequence[]> {
    const sequences = new Map<TrigramStance, ComboSequence[]>();

    // Geon (Heaven) - Direct force combos
    sequences.set(TrigramStance.GEON, [
      {
        stanceId: TrigramStance.GEON,
        techniques: this.getTechniqueSequence(TrigramStance.GEON, 3),
        minDistance: 80,
        maxDistance: 140,
        requiredKi: 30,
        requiredStamina: 40,
        name: {
          korean: "천둥벽력 연타",
          english: "Thunder Strike Combo",
        },
      },
    ]);

    // Tae (Lake) - Fluid manipulation combos
    sequences.set(TrigramStance.TAE, [
      {
        stanceId: TrigramStance.TAE,
        techniques: this.getTechniqueSequence(TrigramStance.TAE, 3),
        minDistance: 70,
        maxDistance: 130,
        requiredKi: 25,
        requiredStamina: 35,
        name: {
          korean: "유수연타",
          english: "Flowing Water Combo",
        },
      },
    ]);

    // Li (Fire) - Precision strike combos
    sequences.set(TrigramStance.LI, [
      {
        stanceId: TrigramStance.LI,
        techniques: this.getTechniqueSequence(TrigramStance.LI, 3),
        minDistance: 90,
        maxDistance: 150,
        requiredKi: 35,
        requiredStamina: 30,
        name: {
          korean: "화염연격",
          english: "Flame Strike Series",
        },
      },
    ]);

    // Jin (Thunder) - Explosive combos
    sequences.set(TrigramStance.JIN, [
      {
        stanceId: TrigramStance.JIN,
        techniques: this.getTechniqueSequence(TrigramStance.JIN, 3),
        minDistance: 80,
        maxDistance: 140,
        requiredKi: 40,
        requiredStamina: 45,
        name: {
          korean: "벽력난타",
          english: "Lightning Barrage",
        },
      },
    ]);

    // Son (Wind) - Continuous pressure combos
    sequences.set(TrigramStance.SON, [
      {
        stanceId: TrigramStance.SON,
        techniques: this.getTechniqueSequence(TrigramStance.SON, 3),
        minDistance: 70,
        maxDistance: 130,
        requiredKi: 28,
        requiredStamina: 38,
        name: {
          korean: "선풍연쇄",
          english: "Whirlwind Chain",
        },
      },
    ]);

    // Gam (Water) - Adaptive flow combos
    sequences.set(TrigramStance.GAM, [
      {
        stanceId: TrigramStance.GAM,
        techniques: this.getTechniqueSequence(TrigramStance.GAM, 3),
        minDistance: 75,
        maxDistance: 135,
        requiredKi: 30,
        requiredStamina: 35,
        name: {
          korean: "수류연환",
          english: "Water Flow Sequence",
        },
      },
    ]);

    // Gan (Mountain) - Defensive counter combos
    sequences.set(TrigramStance.GAN, [
      {
        stanceId: TrigramStance.GAN,
        techniques: this.getTechniqueSequence(TrigramStance.GAN, 3),
        minDistance: 70,
        maxDistance: 130,
        requiredKi: 25,
        requiredStamina: 40,
        name: {
          korean: "반석반격",
          english: "Mountain Counter",
        },
      },
    ]);

    // Gon (Earth) - Grounding combos
    sequences.set(TrigramStance.GON, [
      {
        stanceId: TrigramStance.GON,
        techniques: this.getTechniqueSequence(TrigramStance.GON, 3),
        minDistance: 60,
        maxDistance: 120,
        requiredKi: 30,
        requiredStamina: 50,
        name: {
          korean: "대지낙타",
          english: "Earth Slam Combo",
        },
      },
    ]);

    return sequences;
  }

  /**
   * Get technique sequence for a stance
   */
  private getTechniqueSequence(
    stance: TrigramStance,
    count: number
  ): readonly KoreanTechnique[] {
    const techniques = TRIGRAM_TECHNIQUES[stance] ?? [];
    
    // Warn if not enough techniques for full combo (issue #2529727989)
    if (techniques.length < count) {
      console.warn(
        `[AIComboSystem] Not enough techniques defined for stance '${stance}'. Requested ${count}, but only ${techniques.length} available. Returning partial combo.`
      );
    }
    
    // Return only available techniques
    return techniques.slice(0, count);
  }

  /**
   * Calculate distance between two players
   */
  private getDistance(player: PlayerState, opponent: PlayerState): number {
    const dx = player.position.x - opponent.position.x;
    const dy = player.position.y - opponent.position.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Check if AI should continue current combo
   * 
   * Enhanced with:
   * - Opponent balance state checking (SHAKEN/VULNERABLE)
   * - Combo length limit (max 3 techniques)
   * - Stamina threshold (>20 for combo continuation)
   * 
   * @korean 연계 기술 계속 여부 판단
   */
  shouldContinueCombo(
    player: PlayerState,
    opponent: PlayerState,
    personality: AIPersonality
  ): boolean {
    const now = Date.now();

    // No active combo - check if combo exists
    if (this.currentCombo.length === 0) {
      return false;
    }

    // Combo timed out
    if (now - this.lastComboTime > this.comboTimeout) {
      this.resetCombo();
      return false;
    }

    // Combo completed
    if (this.comboProgress >= this.currentCombo.length) {
      this.resetCombo();
      return false;
    }

    // Combo length limit: max 3 techniques
    if (this.comboProgress >= 3) {
      this.resetCombo();
      return false;
    }

    // Korean martial arts philosophy: flow like water
    const distance = this.getDistance(player, opponent);
    const distanceOk = distance < 120;
    
    // Stamina threshold for combo continuation (>20)
    const hasResources = player.ki >= 10 && player.stamina > 20;
    
    // Balance thresholds for vulnerability detection
    // Balance is a numeric value (0-100) representing stability
    // Values below 30 indicate SHAKEN/VULNERABLE states in combat
    const VULNERABLE_BALANCE_THRESHOLD = 30;
    
    // Check opponent balance state - continue combo if opponent is vulnerable
    const opponentVulnerable = 
      opponent.balance < VULNERABLE_BALANCE_THRESHOLD || // Low balance (SHAKEN/VULNERABLE state)
      opponent.isStunned || // Stunned state
      opponent.health < opponent.maxHealth * 0.3; // Low health (<30%)
    
    // Higher chance to continue if opponent is vulnerable
    const baseChance = personality.comboTendency;
    const vulnerabilityBonus = opponentVulnerable ? 0.3 : 0;
    const finalContinueChance = Math.min(0.95, baseChance + vulnerabilityBonus);
    const randomChance = Math.random() < finalContinueChance;

    return distanceOk && hasResources && randomChance;
  }

  /**
   * Start a new combo sequence
   */
  startCombo(
    player: PlayerState,
    opponent: PlayerState,
    personality: AIPersonality
  ): boolean {
    // Check if suitable for combo
    const distance = this.getDistance(player, opponent);
    const sequences = this.comboSequences.get(player.currentStance);

    if (!sequences || sequences.length === 0) {
      return false;
    }

    // Find suitable combo for current situation
    const suitableCombo = sequences.find(
      (seq) =>
        distance >= seq.minDistance &&
        distance <= seq.maxDistance &&
        player.ki >= seq.requiredKi &&
        player.stamina >= seq.requiredStamina
    );

    if (!suitableCombo) {
      return false;
    }

    // Random chance based on personality
    if (Math.random() > personality.comboTendency) {
      return false;
    }

    // Start combo
    this.currentCombo = [...suitableCombo.techniques];
    this.comboProgress = 0;
    this.lastComboTime = Date.now();
    return true;
  }

  /**
   * Get next technique in combo
   */
  getNextComboTechnique(): KoreanTechnique | null {
    if (
      this.comboProgress >= this.currentCombo.length ||
      this.currentCombo.length === 0
    ) {
      return null;
    }

    const technique = this.currentCombo[this.comboProgress];
    this.comboProgress++;
    this.lastComboTime = Date.now();
    return technique;
  }

  /**
   * Reset current combo
   */
  resetCombo(): void {
    this.currentCombo = [];
    this.comboProgress = 0;
    this.lastComboTime = 0;
  }

  /**
   * Check if combo is active (fix for issue #2529727999)
   */
  isComboActive(): boolean {
    return (
      this.currentCombo.length > 0 &&
      this.comboProgress >= 0 &&
      this.comboProgress < this.currentCombo.length &&
      Date.now() - this.lastComboTime < this.comboTimeout
    );
  }

  /**
   * Get combo progress information
   */
  getComboInfo(): {
    active: boolean;
    progress: number;
    total: number;
    percentage: number;
  } {
    return {
      active: this.isComboActive(),
      progress: this.comboProgress,
      total: this.currentCombo.length,
      percentage:
        this.currentCombo.length > 0
          ? (this.comboProgress / this.currentCombo.length) * 100
          : 0,
    };
  }

  /**
   * Get available combos for stance
   */
  getAvailableCombos(stance: TrigramStance): readonly ComboSequence[] {
    return this.comboSequences.get(stance) ?? [];
  }
}
