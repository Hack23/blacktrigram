/**
 * ## Training Utility Functions
 *
 * **Business Purpose:**
 * Provides utility functions for Korean martial arts training calculations,
 * validation, and data processing. Ensures consistent training mechanics
 * across all training components.
 *
 * **Korean Martial Arts Integration:**
 * - Implements authentic Korean martial arts scoring methodology
 * - Provides traditional Korean assessment terminology
 * - Maintains cultural accuracy in training calculations
 *
 * @module TrainingUtils
 * @since 0.2.5
 * @author Black Trigram Development Team
 */

import { TrigramStance, PlayerArchetype } from "../../../../types/enums";
import type { TrainingStatistics } from "../types/training";

/**
 * **Business Logic:** Calculates training difficulty multiplier based on
 * traditional Korean martial arts progression principles
 *
 * @param stance - Current trigram stance
 * @param playerLevel - Player's experience level
 * @returns Difficulty multiplier (0.5 - 2.0)
 */
export const calculateDifficultyMultiplier = (
  stance: TrigramStance,
  playerLevel: number
): number => {
  const stanceDifficulty = {
    [TrigramStance.GEON]: 1.0, // Heaven - Balanced
    [TrigramStance.TAE]: 1.1, // Lake - Slightly complex
    [TrigramStance.LI]: 1.3, // Fire - Precise timing
    [TrigramStance.JIN]: 1.2, // Thunder - Quick execution
    [TrigramStance.SON]: 1.4, // Wind - Continuous flow
    [TrigramStance.GAM]: 1.5, // Water - Advanced technique
    [TrigramStance.GAN]: 1.3, // Mountain - Defensive mastery
    [TrigramStance.GON]: 1.1, // Earth - Grounding basics
  };

  const baseDifficulty = stanceDifficulty[stance];
  const levelAdjustment = Math.max(0.5, Math.min(2.0, playerLevel / 10));

  return baseDifficulty * levelAdjustment;
};

/**
 * **Business Logic:** Generates Korean martial arts assessment based on
 * traditional Korean grading standards
 *
 * @param accuracy - Training accuracy percentage (0-100)
 * @returns Korean assessment object with grade and description
 */
export const getKoreanAssessment = (accuracy: number) => {
  if (accuracy >= 95) {
    return {
      grade: "우수",
      english: "Excellent",
      description: "완벽한 실력! 고수의 경지입니다.",
      color: "gold",
    };
  } else if (accuracy >= 85) {
    return {
      grade: "양호",
      english: "Good",
      description: "훌륭한 실력! 거의 완성 단계입니다.",
      color: "green",
    };
  } else if (accuracy >= 70) {
    return {
      grade: "보통",
      english: "Average",
      description: "좋은 실력! 꾸준히 발전하고 있습니다.",
      color: "cyan",
    };
  } else if (accuracy >= 50) {
    return {
      grade: "미흡",
      english: "Below Average",
      description: "괜찮은 실력! 더 많은 연습이 필요합니다.",
      color: "yellow",
    };
  } else {
    return {
      grade: "부족",
      english: "Poor",
      description: "기본기부터 다시 시작하세요.",
      color: "red",
    };
  }
};

/**
 * **Business Logic:** Calculates experience points gained from training
 * using traditional Korean martial arts progression principles
 *
 * @param stats - Current training statistics
 * @param archetype - Player's martial arts archetype
 * @param difficulty - Training difficulty multiplier
 * @returns Experience points earned
 */
export const calculateExperienceGain = (
  stats: TrainingStatistics,
  archetype: PlayerArchetype,
  difficulty: number
): number => {
  const baseExp = stats.hits * 10;
  const accuracyBonus = (stats.accuracy / 100) * 20;
  const perfectBonus = stats.perfectStrikes * 5;

  // Archetype-specific bonuses
  const archetypeMultiplier = {
    [PlayerArchetype.MUSA]: 1.0,
    [PlayerArchetype.AMSALJA]: 1.2,
    [PlayerArchetype.HACKER]: 1.1,
    [PlayerArchetype.JEONGBO_YOWON]: 1.3,
    [PlayerArchetype.JOJIK_POKRYEOKBAE]: 0.9,
  }[archetype];

  return Math.round(
    (baseExp + accuracyBonus + perfectBonus) * difficulty * archetypeMultiplier
  );
};

/**
 * **Business Logic:** Validates if a training mode is accessible
 * based on Korean martial arts progression requirements
 *
 * @param playerLevel - Current player level
 * @param requiredLevel - Required level for training mode
 * @param archetype - Player's archetype
 * @returns Whether mode is accessible
 */
export const canAccessTrainingMode = (
  playerLevel: number,
  requiredLevel: number,
  archetype: PlayerArchetype
): boolean => {
  // Some archetypes have special access privileges
  const specialAccess = {
    [PlayerArchetype.JEONGBO_YOWON]: -1, // Intelligence agents learn faster
    [PlayerArchetype.HACKER]: -1, // Tech advantage
    [PlayerArchetype.MUSA]: 0, // Standard access
    [PlayerArchetype.AMSALJA]: 0, // Standard access
    [PlayerArchetype.JOJIK_POKRYEOKBAE]: 1, // Harder path
  }[archetype];

  return playerLevel >= requiredLevel + specialAccess;
};

/**
 * **Business Logic:** Formats training time in Korean style
 *
 * @param seconds - Time in seconds
 * @returns Formatted Korean time string
 */
export const formatTrainingTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}분 ${remainingSeconds}초`;
  }
  return `${remainingSeconds}초`;
};

/**
 * **Business Logic:** Calculates combo multiplier based on
 * traditional Korean martial arts flow principles
 *
 * @param comboCount - Current combo count
 * @returns Damage/score multiplier
 */
export const calculateComboMultiplier = (comboCount: number): number => {
  if (comboCount < 2) return 1.0;
  if (comboCount < 5) return 1.2;
  if (comboCount < 10) return 1.5;
  if (comboCount < 20) return 2.0;
  return 2.5; // Maximum traditional Korean martial arts flow state
};

/**
 * **Business Logic:** Determines training feedback message
 * based on Korean martial arts teaching methodology
 *
 * @param performance - Performance metrics
 * @returns Korean feedback message with type
 */
export const getTrainingFeedback = (performance: {
  accuracy: number;
  combo: number;
  recentTrend: "improving" | "stable" | "declining";
}): { message: string; type: "success" | "warning" | "info" | "error" } => {
  const { accuracy, combo, recentTrend } = performance;

  if (accuracy >= 90 && combo >= 5) {
    return {
      message: "완벽한 흐름! 진정한 무사의 경지입니다!",
      type: "success",
    };
  }

  if (recentTrend === "improving") {
    return {
      message: "실력이 향상되고 있습니다! 이 기세를 유지하세요!",
      type: "success",
    };
  }

  if (recentTrend === "declining") {
    return {
      message: "집중력이 흐트러지고 있습니다. 마음을 가다듬으세요.",
      type: "warning",
    };
  }

  if (accuracy < 50) {
    return {
      message: "기본기부터 차근차근 다시 시작하세요.",
      type: "error",
    };
  }

  return {
    message: "꾸준히 연습하세요. 무예는 하루아침에 완성되지 않습니다.",
    type: "info",
  };
};

export default {
  calculateDifficultyMultiplier,
  getKoreanAssessment,
  calculateExperienceGain,
  canAccessTrainingMode,
  formatTrainingTime,
  calculateComboMultiplier,
  getTrainingFeedback,
  calculateTechniqueAccuracy,
  getStanceMastery,
  validateTrainingMode,
  formatSessionTime,
  getKoreanGrade,
  calculateProgressPercentage,
};
export function getStanceBaseDamage(stance: TrigramStance): number {
  const stanceDamageMap: Record<TrigramStance, number> = {
    [TrigramStance.GEON]: 25, // Heaven - Strong direct strikes
    [TrigramStance.TAE]: 18, // Lake - Fluid techniques
    [TrigramStance.LI]: 22, // Fire - Precise nerve strikes
    [TrigramStance.JIN]: 28, // Thunder - Stunning power
    [TrigramStance.SON]: 20, // Wind - Continuous pressure
    [TrigramStance.GAM]: 16, // Water - Flow and control
    [TrigramStance.GAN]: 15, // Mountain - Defensive counters
    [TrigramStance.GON]: 24, // Earth - Ground techniques
  };

  return stanceDamageMap[stance] || 20;
}

/**
 * Determine if technique execution is perfect based on timing and accuracy
 */
export function isPerfectExecution(
  accuracy: number,
  timingAccuracy: number,
  stance: TrigramStance
): boolean {
  const perfectThreshold = getStancePerfectThreshold(stance);
  const combinedAccuracy = (accuracy + timingAccuracy) / 2;
  return combinedAccuracy >= perfectThreshold;
}

/**
 * Get perfect execution threshold for each stance
 */
export function getStancePerfectThreshold(stance: TrigramStance): number {
  const thresholdMap: Record<TrigramStance, number> = {
    [TrigramStance.GEON]: 0.85, // Heaven - High precision required
    [TrigramStance.TAE]: 0.75, // Lake - More forgiving
    [TrigramStance.LI]: 0.9, // Fire - Extremely precise
    [TrigramStance.JIN]: 0.8, // Thunder - Good timing needed
    [TrigramStance.SON]: 0.7, // Wind - Flow-based
    [TrigramStance.GAM]: 0.75, // Water - Adaptive
    [TrigramStance.GAN]: 0.85, // Mountain - Solid execution
    [TrigramStance.GON]: 0.8, // Earth - Stable technique
  };

  return thresholdMap[stance] || 0.8;
}

/**
 * Calculate training experience gained from session
 */
export function calculateTrainingExperience(
  mode: TrainingMode,
  accuracy: number,
  perfectStrikes: number,
  sessionTime: number
): number {
  const modeMultiplier = getTrainingModeExperienceMultiplier(mode);
  const accuracyBonus = Math.floor(accuracy * 0.5);
  const perfectBonus = perfectStrikes * 2;
  const timeBonus = Math.min(10, Math.floor(sessionTime / 60)); // Max 10 bonus for time

  return Math.floor(
    (20 + accuracyBonus + perfectBonus + timeBonus) * modeMultiplier
  );
}

/**
 * Get experience multiplier for training modes
 */
export function getTrainingModeExperienceMultiplier(
  mode: TrainingMode
): number {
  const multiplierMap: Record<TrainingMode, number> = {
    basics: 1.0,
    advanced: 1.5,
    techniques: 1.3,
    combat: 2.0,
    free: 0.8,
  };

  return multiplierMap[mode] || 1.0;
}

/**
 * Get stance description in Korean and English
 */
export function getStanceDescription(stance: TrigramStance): KoreanText {
  const descriptions: Record<TrigramStance, KoreanText> = {
    [TrigramStance.GEON]: {
      korean: "건",
      english: "Heaven",
      description: "하늘처럼 강직하고 정의로운 기술",
    },
    [TrigramStance.TAE]: {
      korean: "태",
      english: "Lake",
      description: "호수처럼 유연하고 흐르는 기술",
    },
    [TrigramStance.LI]: {
      korean: "리",
      english: "Fire",
      description: "불처럼 정확하고 뜨거운 공격",
    },
    [TrigramStance.JIN]: {
      korean: "진",
      english: "Thunder",
      description: "천둥처럼 강력하고 빠른 타격",
    },
    [TrigramStance.SON]: {
      korean: "손",
      english: "Wind",
      description: "바람처럼 연속적이고 끊임없는 압박",
    },
    [TrigramStance.GAM]: {
      korean: "감",
      english: "Water",
      description: "물처럼 흐르며 상대를 감싸는 기술",
    },
    [TrigramStance.GAN]: {
      korean: "간",
      english: "Mountain",
      description: "산처럼 견고하고 흔들리지 않는 방어",
    },
    [TrigramStance.GON]: {
      korean: "곤",
      english: "Earth",
      description: "대지처럼 안정되고 균형잡힌 기초",
    },
  };

  return descriptions[stance] || { korean: stance, english: stance };
}

/**
 * Execute training technique and return result
 */
export function executeTrainingTechnique(
  stance: TrigramStance,
  player: PlayerState,
  dummy: TrainingDummyState,
  accuracy: number = Math.random()
): TrainingTechniqueResult {
  const timingAccuracy = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
  const damage = calculateTrainingDamage(stance, accuracy, player);
  const perfect = isPerfectExecution(accuracy, timingAccuracy, stance);
  const critical = accuracy > 0.9 && Math.random() > 0.7;
  const hit = accuracy > 0.3; // Miss if accuracy too low
  const miss = !hit;

  return {
    hit,
    damage: hit ? damage : 0,
    critical,
    perfect,
    miss,
    stance,
    accuracy,
  };
}

/**
 * Get training feedback based on performance
 */
export function getTrainingFeedback(
  accuracy: number,
  perfectStrikes: number,
  attempts: number
): KoreanText {
  if (attempts === 0) {
    return { korean: "훈련을 시작하세요!", english: "Begin your training!" };
  }

  if (accuracy >= 90) {
    return { korean: "완벽한 실력입니다!", english: "Perfect mastery!" };
  } else if (accuracy >= 80) {
    return { korean: "훌륭한 기술입니다!", english: "Excellent technique!" };
  } else if (accuracy >= 70) {
    return { korean: "좋은 진전이 있습니다!", english: "Good progress!" };
  } else if (accuracy >= 60) {
    return { korean: "꾸준히 연습하세요!", english: "Keep practicing!" };
  } else if (accuracy >= 40) {
    return {
      korean: "더 많은 연습이 필요합니다.",
      english: "More practice needed.",
    };
  } else {
    return {
      korean: "기본기부터 다시 시작하세요.",
      english: "Start with the basics.",
    };
  }
}

/**
 * Validate training session parameters
 */
export function validateTrainingSession(
  mode: TrainingMode,
  playerLevel: number,
  requiredLevel: number
): { valid: boolean; message?: KoreanText } {
  if (playerLevel < requiredLevel) {
    return {
      valid: false,
      message: {
        korean: `레벨 ${requiredLevel} 필요 (현재: ${playerLevel})`,
        english: `Level ${requiredLevel} required (current: ${playerLevel})`,
      },
    };
  }

  return { valid: true };
}

/**
 * Generate random accuracy for AI demonstration
 */
export function generateRandomAccuracy(difficulty: number): number {
  const baseAccuracy = 0.5 + Math.random() * 0.5;
  const difficultyModifier = 1 - difficulty * 0.1;
  return Math.max(0.1, Math.min(1.0, baseAccuracy * difficultyModifier));
}

export default {
  calculateStanceEffectiveness,
  calculateTrainingResult,
  calculateKoreanMartialArtsExperience,
  evaluateTrainingPerformance,
  formatTrainingTime,
  getStanceDescription,
  calculateOptimalTrainingSequence,
  calculateTrainingAccuracy,
  calculateAverageDamage,
  getTrainingPerformanceLevel,
  getStanceEffectiveness,
  calculateExperienceGain,
  getTrainingRecommendation,
};
