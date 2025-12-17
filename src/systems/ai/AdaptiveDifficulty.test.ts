/**
 * Tests for Adaptive Difficulty System
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  AdaptiveDifficulty,
  DifficultyTier,
  DIFFICULTY_PARAMETERS,
  interpolateDifficultyParameters,
  skillScoreToTier,
} from "./AdaptiveDifficulty";
import { AI_PERSONALITIES } from "./AIPersonality";

describe("AdaptiveDifficulty", () => {
  let difficulty: AdaptiveDifficulty;

  beforeEach(() => {
    difficulty = new AdaptiveDifficulty();
  });

  describe("initialization", () => {
    it("should create with default metrics", () => {
      const metrics = difficulty.getMetrics();
      expect(metrics.averageAccuracy).toBe(0.5);
      expect(metrics.comboCount).toBe(0);
      expect(metrics.perfectBlocks).toBe(0);
      expect(metrics.reactionTime).toBe(800);
      expect(metrics.matchesPlayed).toBe(0);
    });

    it("should start at beginner tier", () => {
      const tier = difficulty.getDifficultyTier();
      expect(tier).toBe(DifficultyTier.BEGINNER);
    });
  });

  describe("updateSkillMetrics", () => {
    it("should update accuracy based on match performance", () => {
      difficulty.updateSkillMetrics({
        hitsLanded: 8,
        totalAttacks: 10,
        combosExecuted: 2,
        perfectBlockCount: 3,
        avgReactionTimeMs: 500,
        vitalPointsHit: 2,
        effectiveStanceChanges: 4,
        damageDealt: 100,
        damageTaken: 50,
      });

      const metrics = difficulty.getMetrics();
      expect(metrics.averageAccuracy).toBeGreaterThan(0.5);
      expect(metrics.comboCount).toBe(2);
      expect(metrics.perfectBlocks).toBe(3);
      expect(metrics.matchesPlayed).toBe(1);
    });

    it("should update multiple matches progressively", () => {
      for (let i = 0; i < 5; i++) {
        difficulty.updateSkillMetrics({
          hitsLanded: 9,
          totalAttacks: 10,
          combosExecuted: 3,
          perfectBlockCount: 4,
          avgReactionTimeMs: 400,
          vitalPointsHit: 3,
          effectiveStanceChanges: 5,
          damageDealt: 150,
          damageTaken: 50,
        });
      }

      const metrics = difficulty.getMetrics();
      expect(metrics.averageAccuracy).toBeGreaterThan(0.6);
      expect(metrics.matchesPlayed).toBe(5);
    });

    it("should handle poor performance", () => {
      difficulty.updateSkillMetrics({
        hitsLanded: 2,
        totalAttacks: 10,
        combosExecuted: 0,
        perfectBlockCount: 0,
        avgReactionTimeMs: 1200,
        vitalPointsHit: 0,
        effectiveStanceChanges: 1,
        damageDealt: 30,
        damageTaken: 100,
      });

      const metrics = difficulty.getMetrics();
      expect(metrics.averageAccuracy).toBeLessThan(0.5);
    });
  });

  describe("calculatePlayerSkill", () => {
    it("should return skill between 0 and 1", () => {
      const skill = difficulty.calculatePlayerSkill();
      expect(skill).toBeGreaterThanOrEqual(0);
      expect(skill).toBeLessThanOrEqual(1);
    });

    it("should increase with good performance", () => {
      const initialSkill = difficulty.calculatePlayerSkill();

      difficulty.updateSkillMetrics({
        hitsLanded: 9,
        totalAttacks: 10,
        combosExecuted: 5,
        perfectBlockCount: 5,
        avgReactionTimeMs: 300,
        vitalPointsHit: 5,
        effectiveStanceChanges: 8,
        damageDealt: 200,
        damageTaken: 50,
      });

      const newSkill = difficulty.calculatePlayerSkill();
      expect(newSkill).toBeGreaterThan(initialSkill);
    });

    it("should weight components correctly", () => {
      // Test with perfect accuracy
      difficulty.updateSkillMetrics({
        hitsLanded: 10,
        totalAttacks: 10,
        combosExecuted: 20,
        perfectBlockCount: 10,
        avgReactionTimeMs: 200,
        vitalPointsHit: 15,
        effectiveStanceChanges: 10,
        damageDealt: 300,
        damageTaken: 50,
      });

      const skill = difficulty.calculatePlayerSkill();
      expect(skill).toBeGreaterThan(0.7);
    });
  });

  describe("getDifficultyTier", () => {
    it("should return BEGINNER for low skill", () => {
      const tier = difficulty.getDifficultyTier();
      expect(tier).toBe(DifficultyTier.BEGINNER);
    });

    it("should progress through tiers", () => {
      // Novice level
      difficulty.updateSkillMetrics({
        hitsLanded: 5,
        totalAttacks: 10,
        combosExecuted: 5,
        perfectBlockCount: 3,
        avgReactionTimeMs: 700,
        vitalPointsHit: 2,
        effectiveStanceChanges: 3,
        damageDealt: 80,
        damageTaken: 80,
      });

      let tier = difficulty.getDifficultyTier();
      expect(tier).toBeGreaterThanOrEqual(DifficultyTier.BEGINNER);

      // Advanced level
      for (let i = 0; i < 5; i++) {
        difficulty.updateSkillMetrics({
          hitsLanded: 9,
          totalAttacks: 10,
          combosExecuted: 8,
          perfectBlockCount: 6,
          avgReactionTimeMs: 400,
          vitalPointsHit: 5,
          effectiveStanceChanges: 7,
          damageDealt: 150,
          damageTaken: 50,
        });
      }

      tier = difficulty.getDifficultyTier();
      expect(tier).toBeGreaterThan(DifficultyTier.NOVICE);
    });

    it("should reach MASTER tier with perfect play", () => {
      for (let i = 0; i < 10; i++) {
        difficulty.updateSkillMetrics({
          hitsLanded: 10,
          totalAttacks: 10,
          combosExecuted: 10,
          perfectBlockCount: 8,
          avgReactionTimeMs: 200,
          vitalPointsHit: 8,
          effectiveStanceChanges: 10,
          damageDealt: 250,
          damageTaken: 25,
        });
      }

      const tier = difficulty.getDifficultyTier();
      expect(tier).toBeGreaterThanOrEqual(DifficultyTier.EXPERT);
    });
  });

  describe("adjustAIPersonality", () => {
    it("should increase AI difficulty for skilled players", () => {
      const basePersonality = AI_PERSONALITIES.BALANCED_FIGHTER;

      // Train up skill
      for (let i = 0; i < 5; i++) {
        difficulty.updateSkillMetrics({
          hitsLanded: 9,
          totalAttacks: 10,
          combosExecuted: 6,
          perfectBlockCount: 5,
          avgReactionTimeMs: 400,
          vitalPointsHit: 4,
          effectiveStanceChanges: 6,
          damageDealt: 150,
          damageTaken: 60,
        });
      }

      const adjusted = difficulty.adjustAIPersonality(basePersonality);

      expect(adjusted.aggressionLevel).toBeGreaterThan(
        basePersonality.aggressionLevel
      );
      expect(adjusted.feintChance).toBeGreaterThan(basePersonality.feintChance);
    });

    it("should maintain caps on adjusted stats", () => {
      const basePersonality = AI_PERSONALITIES.AGGRESSIVE_STRIKER;

      // Max out skill
      for (let i = 0; i < 20; i++) {
        difficulty.updateSkillMetrics({
          hitsLanded: 10,
          totalAttacks: 10,
          combosExecuted: 10,
          perfectBlockCount: 10,
          avgReactionTimeMs: 200,
          vitalPointsHit: 10,
          effectiveStanceChanges: 10,
          damageDealt: 300,
          damageTaken: 30,
        });
      }

      const adjusted = difficulty.adjustAIPersonality(basePersonality);

      expect(adjusted.aggressionLevel).toBeLessThanOrEqual(0.95);
      expect(adjusted.feintChance).toBeLessThanOrEqual(0.6);
      expect(adjusted.comboTendency).toBeLessThanOrEqual(0.85);
    });

    it("should preserve personality characteristics", () => {
      const defensive = AI_PERSONALITIES.DEFENSIVE_SPECIALIST;
      const adjusted = difficulty.adjustAIPersonality(defensive);

      // Should still be relatively defensive even when adjusted
      expect(adjusted.archetype).toBe(defensive.archetype);
      expect(adjusted.defensePreference).toBe(defensive.defensePreference);
    });
  });

  describe("getDifficultyRecommendation", () => {
    it("should provide recommendation with tier info", () => {
      const recommendation = difficulty.getDifficultyRecommendation();

      expect(recommendation).toHaveProperty("tier");
      expect(recommendation).toHaveProperty("tierName");
      expect(recommendation).toHaveProperty("skillLevel");
      expect(recommendation).toHaveProperty("shouldIncrease");
      expect(recommendation).toHaveProperty("message");
    });

    it("should recommend increase for skilled players", () => {
      for (let i = 0; i < 10; i++) {
        difficulty.updateSkillMetrics({
          hitsLanded: 9,
          totalAttacks: 10,
          combosExecuted: 8,
          perfectBlockCount: 7,
          avgReactionTimeMs: 300,
          vitalPointsHit: 6,
          effectiveStanceChanges: 8,
          damageDealt: 200,
          damageTaken: 50,
        });
      }

      const recommendation = difficulty.getDifficultyRecommendation();
      expect(recommendation.skillLevel).toBeGreaterThan(0.6);
    });

    it("should have bilingual tier names", () => {
      const recommendation = difficulty.getDifficultyRecommendation();
      expect(recommendation.tierName).toContain("(");
      expect(recommendation.tierName).toContain(")");
    });
  });

  describe("reset", () => {
    it("should reset all metrics to default", () => {
      difficulty.updateSkillMetrics({
        hitsLanded: 10,
        totalAttacks: 10,
        combosExecuted: 10,
        perfectBlockCount: 10,
        avgReactionTimeMs: 200,
        vitalPointsHit: 10,
        effectiveStanceChanges: 10,
        damageDealt: 300,
        damageTaken: 30,
      });

      difficulty.reset();

      const metrics = difficulty.getMetrics();
      expect(metrics.averageAccuracy).toBe(0.5);
      expect(metrics.comboCount).toBe(0);
      expect(metrics.matchesPlayed).toBe(0);
    });
  });

  describe("persistence", () => {
    it("should export metrics as JSON", () => {
      difficulty.updateSkillMetrics({
        hitsLanded: 8,
        totalAttacks: 10,
        combosExecuted: 3,
        perfectBlockCount: 2,
        avgReactionTimeMs: 500,
        vitalPointsHit: 2,
        effectiveStanceChanges: 4,
        damageDealt: 100,
        damageTaken: 60,
      });

      const exported = difficulty.exportMetrics();
      expect(typeof exported).toBe("string");
      expect(() => JSON.parse(exported)).not.toThrow();
    });

    it("should import metrics from JSON", () => {
      difficulty.updateSkillMetrics({
        hitsLanded: 8,
        totalAttacks: 10,
        combosExecuted: 3,
        perfectBlockCount: 2,
        avgReactionTimeMs: 500,
        vitalPointsHit: 2,
        effectiveStanceChanges: 4,
        damageDealt: 100,
        damageTaken: 60,
      });

      const exported = difficulty.exportMetrics();
      const newDifficulty = new AdaptiveDifficulty();
      const imported = newDifficulty.importMetrics(exported);

      expect(imported).toBe(true);
      expect(newDifficulty.getMetrics().matchesPlayed).toBe(1);
    });

    it("should handle invalid import data", () => {
      const imported = difficulty.importMetrics("invalid json");
      expect(imported).toBe(false);
    });
  });

  describe("getDifficultyParameters", () => {
    it("should return parameters for current skill tier", () => {
      const params = difficulty.getDifficultyParameters();
      
      expect(params).toHaveProperty("reactionTimeMs");
      expect(params).toHaveProperty("vitalPointAccuracy");
      expect(params).toHaveProperty("basicAttackAccuracy");
      expect(params).toHaveProperty("blockTimingWindow");
      expect(params).toHaveProperty("decisionQuality");
      expect(params).toHaveProperty("aggressionModifier");
      expect(params).toHaveProperty("comboChance");
    });

    it("should return beginner parameters for low skill", () => {
      const params = difficulty.getDifficultyParameters();
      
      // Default skill is low (beginner tier)
      expect(params.reactionTimeMs.min).toBe(800);
      expect(params.reactionTimeMs.max).toBe(1200);
      expect(params.vitalPointAccuracy).toBe(0.40);
      expect(params.basicAttackAccuracy).toBe(0.70);
    });

    it("should return expert parameters for high skill", () => {
      // Train to expert level
      for (let i = 0; i < 15; i++) {
        difficulty.updateSkillMetrics({
          hitsLanded: 10,
          totalAttacks: 10,
          combosExecuted: 8,
          perfectBlockCount: 8,
          avgReactionTimeMs: 250,
          vitalPointsHit: 7,
          effectiveStanceChanges: 9,
          damageDealt: 250,
          damageTaken: 40,
        });
      }

      const params = difficulty.getDifficultyParameters();
      
      // Expert tier parameters
      expect(params.reactionTimeMs.min).toBe(50);
      expect(params.reactionTimeMs.max).toBe(150);
      expect(params.vitalPointAccuracy).toBe(0.85);
      expect(params.basicAttackAccuracy).toBe(0.95);
    });
  });
});

describe("skillScoreToTier", () => {
  it("should map score 0.0-0.2 to BEGINNER", () => {
    expect(skillScoreToTier(0.0)).toBe(DifficultyTier.BEGINNER);
    expect(skillScoreToTier(0.1)).toBe(DifficultyTier.BEGINNER);
    expect(skillScoreToTier(0.19)).toBe(DifficultyTier.BEGINNER);
  });

  it("should map score 0.2-0.4 to NOVICE", () => {
    expect(skillScoreToTier(0.2)).toBe(DifficultyTier.NOVICE);
    expect(skillScoreToTier(0.3)).toBe(DifficultyTier.NOVICE);
    expect(skillScoreToTier(0.39)).toBe(DifficultyTier.NOVICE);
  });

  it("should map score 0.4-0.6 to INTERMEDIATE", () => {
    expect(skillScoreToTier(0.4)).toBe(DifficultyTier.INTERMEDIATE);
    expect(skillScoreToTier(0.5)).toBe(DifficultyTier.INTERMEDIATE);
    expect(skillScoreToTier(0.59)).toBe(DifficultyTier.INTERMEDIATE);
  });

  it("should map score 0.6-0.8 to ADVANCED", () => {
    expect(skillScoreToTier(0.6)).toBe(DifficultyTier.ADVANCED);
    expect(skillScoreToTier(0.7)).toBe(DifficultyTier.ADVANCED);
    expect(skillScoreToTier(0.79)).toBe(DifficultyTier.ADVANCED);
  });

  it("should map score 0.8-1.0 to EXPERT", () => {
    expect(skillScoreToTier(0.8)).toBe(DifficultyTier.EXPERT);
    expect(skillScoreToTier(0.9)).toBe(DifficultyTier.EXPERT);
    expect(skillScoreToTier(1.0)).toBe(DifficultyTier.EXPERT);
  });
});

describe("interpolateDifficultyParameters", () => {
  it("should interpolate at progress 0.0 to return 'from' params", () => {
    const from = DIFFICULTY_PARAMETERS[DifficultyTier.BEGINNER];
    const to = DIFFICULTY_PARAMETERS[DifficultyTier.EXPERT];
    
    const result = interpolateDifficultyParameters(from, to, 0.0);
    
    expect(result.reactionTimeMs.min).toBeCloseTo(from.reactionTimeMs.min);
    expect(result.vitalPointAccuracy).toBeCloseTo(from.vitalPointAccuracy);
  });

  it("should interpolate at progress 1.0 to return 'to' params", () => {
    const from = DIFFICULTY_PARAMETERS[DifficultyTier.BEGINNER];
    const to = DIFFICULTY_PARAMETERS[DifficultyTier.EXPERT];
    
    const result = interpolateDifficultyParameters(from, to, 1.0);
    
    expect(result.reactionTimeMs.min).toBeCloseTo(to.reactionTimeMs.min);
    expect(result.vitalPointAccuracy).toBeCloseTo(to.vitalPointAccuracy);
  });

  it("should interpolate at progress 0.5 to return midpoint", () => {
    const from = DIFFICULTY_PARAMETERS[DifficultyTier.BEGINNER];
    const to = DIFFICULTY_PARAMETERS[DifficultyTier.EXPERT];
    
    const result = interpolateDifficultyParameters(from, to, 0.5);
    
    // Midpoint of 800 and 50 is 425
    expect(result.reactionTimeMs.min).toBeCloseTo(425, 0);
    // Midpoint of 0.40 and 0.85 is 0.625
    expect(result.vitalPointAccuracy).toBeCloseTo(0.625, 2);
  });

  it("should clamp progress below 0.0", () => {
    const from = DIFFICULTY_PARAMETERS[DifficultyTier.BEGINNER];
    const to = DIFFICULTY_PARAMETERS[DifficultyTier.EXPERT];
    
    const result = interpolateDifficultyParameters(from, to, -0.5);
    
    expect(result.reactionTimeMs.min).toBeCloseTo(from.reactionTimeMs.min);
  });

  it("should clamp progress above 1.0", () => {
    const from = DIFFICULTY_PARAMETERS[DifficultyTier.BEGINNER];
    const to = DIFFICULTY_PARAMETERS[DifficultyTier.EXPERT];
    
    const result = interpolateDifficultyParameters(from, to, 1.5);
    
    expect(result.reactionTimeMs.min).toBeCloseTo(to.reactionTimeMs.min);
  });
});
