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
 * Difficulty tier levels (5 tiers for adaptive system)
 */
export enum DifficultyTier {
  BEGINNER = 1,
  NOVICE = 2,
  INTERMEDIATE = 3,
  ADVANCED = 4,
  EXPERT = 5,
}

/**
 * Difficulty parameters that control AI behavior
 * Applied dynamically based on player skill level
 * 
 * @korean 난이도 매개변수 - 플레이어 실력에 따라 AI 행동 제어
 */
export interface DifficultyParameters {
  /** AI reaction time range in milliseconds */
  readonly reactionTimeMs: { readonly min: number; readonly max: number };
  /** Accuracy for vital point strikes (0.0-1.0) */
  readonly vitalPointAccuracy: number;
  /** Accuracy for basic attacks (0.0-1.0) */
  readonly basicAttackAccuracy: number;
  /** Block timing window in milliseconds (smaller = harder to block) */
  readonly blockTimingWindow: number;
  /** Decision quality affects technique selection optimality (0.0-1.0) */
  readonly decisionQuality: number;
  /** Aggression modifier multiplier (0.5-2.0) */
  readonly aggressionModifier: number;
  /** Chance to attempt combo sequences (0.0-1.0) */
  readonly comboChance: number;
}

/**
 * Difficulty parameter sets for each skill tier
 * Defines AI behavior characteristics at each difficulty level
 * 
 * @korean 각 난이도 단계별 매개변수 설정
 */
export const DIFFICULTY_PARAMETERS: Record<DifficultyTier, DifficultyParameters> = {
  [DifficultyTier.BEGINNER]: {
    reactionTimeMs: { min: 800, max: 1200 },
    vitalPointAccuracy: 0.40,
    basicAttackAccuracy: 0.70,
    blockTimingWindow: 150,
    decisionQuality: 0.50,
    aggressionModifier: 0.7,
    comboChance: 0.20,
  },
  [DifficultyTier.NOVICE]: {
    reactionTimeMs: { min: 500, max: 800 },
    vitalPointAccuracy: 0.55,
    basicAttackAccuracy: 0.78,
    blockTimingWindow: 120,
    decisionQuality: 0.65,
    aggressionModifier: 0.9,
    comboChance: 0.35,
  },
  [DifficultyTier.INTERMEDIATE]: {
    reactionTimeMs: { min: 300, max: 500 },
    vitalPointAccuracy: 0.65,
    basicAttackAccuracy: 0.85,
    blockTimingWindow: 90,
    decisionQuality: 0.75,
    aggressionModifier: 1.1,
    comboChance: 0.50,
  },
  [DifficultyTier.ADVANCED]: {
    reactionTimeMs: { min: 150, max: 300 },
    vitalPointAccuracy: 0.75,
    basicAttackAccuracy: 0.90,
    blockTimingWindow: 70,
    decisionQuality: 0.85,
    aggressionModifier: 1.3,
    comboChance: 0.60,
  },
  [DifficultyTier.EXPERT]: {
    reactionTimeMs: { min: 50, max: 150 },
    vitalPointAccuracy: 0.85,
    basicAttackAccuracy: 0.95,
    blockTimingWindow: 50,
    decisionQuality: 0.95,
    aggressionModifier: 1.5,
    comboChance: 0.70,
  },
};

/**
 * Map skill score (0.0-1.0) to difficulty tier
 * Uses fixed thresholds for consistent tier assignment
 * 
 * @korean 실력 점수를 난이도 단계로 변환
 * 
 * @param score - Player skill score (0.0-1.0)
 * @returns Corresponding difficulty tier
 */
export function skillScoreToTier(score: number): DifficultyTier {
  if (score < 0.2) return DifficultyTier.BEGINNER;
  if (score < 0.4) return DifficultyTier.NOVICE;
  if (score < 0.6) return DifficultyTier.INTERMEDIATE;
  if (score < 0.8) return DifficultyTier.ADVANCED;
  return DifficultyTier.EXPERT;
}

/**
 * Linear interpolation helper
 * @param a - Start value
 * @param b - End value
 * @param t - Interpolation factor (0.0-1.0)
 * @returns Interpolated value
 */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

/**
 * Interpolate between two difficulty parameter sets
 * Used for smooth difficulty transitions over time
 * 
 * @korean 난이도 매개변수 간 부드러운 전환
 * 
 * @param from - Starting difficulty parameters
 * @param to - Target difficulty parameters
 * @param progress - Interpolation progress (0.0-1.0)
 * @returns Interpolated difficulty parameters
 */
export function interpolateDifficultyParameters(
  from: DifficultyParameters,
  to: DifficultyParameters,
  progress: number
): DifficultyParameters {
  const t = Math.max(0, Math.min(1, progress));
  
  return {
    reactionTimeMs: {
      min: lerp(from.reactionTimeMs.min, to.reactionTimeMs.min, t),
      max: lerp(from.reactionTimeMs.max, to.reactionTimeMs.max, t),
    },
    vitalPointAccuracy: lerp(from.vitalPointAccuracy, to.vitalPointAccuracy, t),
    basicAttackAccuracy: lerp(from.basicAttackAccuracy, to.basicAttackAccuracy, t),
    blockTimingWindow: lerp(from.blockTimingWindow, to.blockTimingWindow, t),
    decisionQuality: lerp(from.decisionQuality, to.decisionQuality, t),
    aggressionModifier: lerp(from.aggressionModifier, to.aggressionModifier, t),
    comboChance: lerp(from.comboChance, to.comboChance, t),
  };
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
        : matchData.damageDealt > 0
        ? 1.0 // Perfect defense with damage dealt
        : 0.5; // No damage on either side
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
   * Get current difficulty tier based on skill level
   */
  getDifficultyTier(): DifficultyTier {
    const skillLevel = this.calculatePlayerSkill();
    return skillScoreToTier(skillLevel);
  }

  /**
   * Get difficulty parameters for current skill tier
   * Returns the appropriate DifficultyParameters based on player skill
   * 
   * @korean 현재 실력 단계에 맞는 난이도 매개변수 반환
   */
  getDifficultyParameters(): DifficultyParameters {
    const tier = this.getDifficultyTier();
    return DIFFICULTY_PARAMETERS[tier];
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
    const shouldIncrease = skillLevel > 0.7 && tier < DifficultyTier.EXPERT;

    const tierNames: Record<DifficultyTier, string> = {
      [DifficultyTier.BEGINNER]: "Beginner (초보)",
      [DifficultyTier.NOVICE]: "Novice (입문)",
      [DifficultyTier.INTERMEDIATE]: "Intermediate (중급)",
      [DifficultyTier.ADVANCED]: "Advanced (고급)",
      [DifficultyTier.EXPERT]: "Expert (전문)",
    };

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
