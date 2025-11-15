/**
 * Adaptive Difficulty System for Korean Martial Arts Combat
 * Tracks player skill metrics and adjusts AI difficulty dynamically
 */

import { AIPersonality } from "./AIPersonality";

/**
 * Player skill metrics tracked for adaptive difficulty
 */
export interface PlayerSkillMetrics {
  averageAccuracy: number; // 0.0-1.0: Hit rate
  comboCount: number; // Total combos executed
  perfectBlocks: number; // Perfect timing blocks
  reactionTime: number; // Average reaction time in ms
  vitalPointHits: number; // Successful vital point strikes
  stanceTransitions: number; // Effective stance changes
  damageEfficiency: number; // 0.0-1.0: Damage dealt vs taken ratio
  matchesPlayed: number; // Total matches for scaling
}

/**
 * Difficulty tier levels
 */
export enum DifficultyTier {
  BEGINNER = 0,
  NOVICE = 1,
  INTERMEDIATE = 2,
  ADVANCED = 3,
  EXPERT = 4,
  MASTER = 5,
}

/**
 * Adaptive Difficulty System
 */
export class AdaptiveDifficulty {
  private playerSkillMetrics: PlayerSkillMetrics;
  private readonly skillDecay = 0.95; // Gradual skill decay between matches
  private readonly learningRate = 0.1; // How quickly to adapt

  constructor() {
    this.playerSkillMetrics = {
      averageAccuracy: 0.5,
      comboCount: 0,
      perfectBlocks: 0,
      reactionTime: 800,
      vitalPointHits: 0,
      stanceTransitions: 0,
      damageEfficiency: 0.5,
      matchesPlayed: 0,
    };
  }

  /**
   * Update player skill metrics based on match performance
   */
  updateSkillMetrics(matchData: {
    hitsLanded: number;
    totalAttacks: number;
    combosExecuted: number;
    perfectBlockCount: number;
    avgReactionTimeMs: number;
    vitalPointsHit: number;
    effectiveStanceChanges: number;
    damageDealt: number;
    damageTaken: number;
  }): void {
    const { metrics } = this;

    // Update accuracy with learning rate
    const matchAccuracy =
      matchData.totalAttacks > 0
        ? matchData.hitsLanded / matchData.totalAttacks
        : 0.5;
    metrics.averageAccuracy =
      metrics.averageAccuracy * (1 - this.learningRate) +
      matchAccuracy * this.learningRate;

    // Update combo count
    metrics.comboCount += matchData.combosExecuted;

    // Update perfect blocks
    metrics.perfectBlocks += matchData.perfectBlockCount;

    // Update reaction time
    if (matchData.avgReactionTimeMs > 0) {
      metrics.reactionTime =
        metrics.reactionTime * (1 - this.learningRate) +
        matchData.avgReactionTimeMs * this.learningRate;
    }

    // Update vital point hits
    metrics.vitalPointHits += matchData.vitalPointsHit;

    // Update stance transitions
    metrics.stanceTransitions += matchData.effectiveStanceChanges;

    // Update damage efficiency
    const matchEfficiency =
      matchData.damageTaken > 0
        ? Math.min(1, matchData.damageDealt / matchData.damageTaken)
        : 0.5;
    metrics.damageEfficiency =
      metrics.damageEfficiency * (1 - this.learningRate) +
      matchEfficiency * this.learningRate;

    // Increment matches played
    metrics.matchesPlayed += 1;

    // Apply skill decay to prevent over-adjustment
    this.applySkillDecay();
  }

  /**
   * Apply gradual skill decay to prevent over-adjustment
   */
  private applySkillDecay(): void {
    const { metrics } = this;
    metrics.averageAccuracy =
      metrics.averageAccuracy * this.skillDecay +
      0.5 * (1 - this.skillDecay);
    metrics.damageEfficiency =
      metrics.damageEfficiency * this.skillDecay +
      0.5 * (1 - this.skillDecay);
  }

  /**
   * Calculate overall player skill level (0.0 - 1.0)
   */
  calculatePlayerSkill(): number {
    const { metrics } = this;

    // Weight different skill components
    const accuracyScore = metrics.averageAccuracy * 0.3;
    const comboScore = Math.min(1, metrics.comboCount / 20) * 0.2;
    const blockScore = Math.min(1, metrics.perfectBlocks / 10) * 0.2;
    const reactionScore = Math.max(0, 1 - metrics.reactionTime / 1000) * 0.15;
    const vitalScore = Math.min(1, metrics.vitalPointHits / 15) * 0.15;

    return accuracyScore + comboScore + blockScore + reactionScore + vitalScore;
  }

  /**
   * Get current difficulty tier
   */
  getDifficultyTier(): DifficultyTier {
    const skillLevel = this.calculatePlayerSkill();

    if (skillLevel < 0.2) return DifficultyTier.BEGINNER;
    if (skillLevel < 0.4) return DifficultyTier.NOVICE;
    if (skillLevel < 0.6) return DifficultyTier.INTERMEDIATE;
    if (skillLevel < 0.75) return DifficultyTier.ADVANCED;
    if (skillLevel < 0.9) return DifficultyTier.EXPERT;
    return DifficultyTier.MASTER;
  }

  /**
   * Adjust AI personality based on player skill
   */
  adjustAIPersonality(personality: AIPersonality): AIPersonality {
    const skillLevel = this.calculatePlayerSkill();
    const tier = this.getDifficultyTier();

    // Scale factors based on difficulty tier
    const aggressionScale = 1 + tier * 0.1; // +10% per tier
    const feintScale = 1 + tier * 0.15; // +15% per tier
    const comboScale = 1 + tier * 0.12; // +12% per tier
    const stanceScale = 1 + tier * 0.08; // +8% per tier

    return {
      ...personality,
      aggressionLevel: Math.min(
        0.95,
        personality.aggressionLevel * aggressionScale
      ),
      feintChance: Math.min(0.6, personality.feintChance * feintScale),
      comboTendency: Math.min(0.85, personality.comboTendency * comboScale),
      stanceSwitchFrequency: Math.min(
        0.9,
        personality.stanceSwitchFrequency * stanceScale
      ),
      // Adjust retreat threshold - better players face more aggressive AI
      tacticalRetreatThreshold: Math.max(
        0.1,
        personality.tacticalRetreatThreshold * (1 - skillLevel * 0.3)
      ),
    };
  }

  /**
   * Get skill metrics
   */
  getMetrics(): Readonly<PlayerSkillMetrics> {
    return { ...this.playerSkillMetrics };
  }

  /**
   * Reset skill metrics
   */
  reset(): void {
    this.playerSkillMetrics = {
      averageAccuracy: 0.5,
      comboCount: 0,
      perfectBlocks: 0,
      reactionTime: 800,
      vitalPointHits: 0,
      stanceTransitions: 0,
      damageEfficiency: 0.5,
      matchesPlayed: 0,
    };
  }

  /**
   * Get difficulty adjustment recommendation
   */
  getDifficultyRecommendation(): {
    tier: DifficultyTier;
    tierName: string;
    skillLevel: number;
    shouldIncrease: boolean;
    message: string;
  } {
    const skillLevel = this.calculatePlayerSkill();
    const tier = this.getDifficultyTier();
    const shouldIncrease = skillLevel > 0.7 && tier < DifficultyTier.MASTER;

    const tierNames = [
      "Beginner (초보)",
      "Novice (입문)",
      "Intermediate (중급)",
      "Advanced (고급)",
      "Expert (전문)",
      "Master (달인)",
    ];

    let message = "";
    if (shouldIncrease) {
      message = "Player shows mastery - increasing difficulty";
    } else if (skillLevel < 0.3) {
      message = "Player struggling - maintaining current difficulty";
    } else {
      message = "Player performing well - difficulty appropriate";
    }

    return {
      tier,
      tierName: tierNames[tier],
      skillLevel,
      shouldIncrease,
      message,
    };
  }

  /**
   * Export metrics for persistence
   */
  exportMetrics(): string {
    return JSON.stringify(this.playerSkillMetrics);
  }

  /**
   * Import metrics from persistence
   */
  importMetrics(data: string): boolean {
    try {
      const metrics = JSON.parse(data) as PlayerSkillMetrics;
      this.playerSkillMetrics = metrics;
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get reference to metrics (for internal use)
   */
  private get metrics(): PlayerSkillMetrics {
    return this.playerSkillMetrics;
  }
}
