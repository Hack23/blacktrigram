import { describe, it, expect } from "vitest";
import {
  calculateDifficultyMultiplier,
  getKoreanAssessment,
  calculateExperienceGain,
  canAccessTrainingMode,
  formatTrainingTime,
  calculateComboMultiplier,
  getTrainingFeedback,
} from "./trainingUtils";
import { TrigramStance, PlayerArchetype } from "../../../../types/enums";

describe("Training Utils", () => {
  describe("calculateDifficultyMultiplier", () => {
    it("should calculate correct difficulty for different stances", () => {
      const playerLevel = 5;

      const geonDifficulty = calculateDifficultyMultiplier(
        TrigramStance.GEON,
        playerLevel
      );
      const gamDifficulty = calculateDifficultyMultiplier(
        TrigramStance.GAM,
        playerLevel
      );

      expect(geonDifficulty).toBeLessThan(gamDifficulty);
      expect(geonDifficulty).toBeGreaterThan(0);
    });

    it("should adjust for player level", () => {
      const lowLevel = calculateDifficultyMultiplier(TrigramStance.GEON, 1);
      const highLevel = calculateDifficultyMultiplier(TrigramStance.GEON, 20);

      expect(lowLevel).toBeLessThan(highLevel);
    });
  });

  describe("getKoreanAssessment", () => {
    it("should return excellent for high accuracy", () => {
      const assessment = getKoreanAssessment(95);

      expect(assessment.grade).toBe("우수");
      expect(assessment.english).toBe("Excellent");
      expect(assessment.color).toBe("gold");
    });

    it("should return poor for low accuracy", () => {
      const assessment = getKoreanAssessment(30);

      expect(assessment.grade).toBe("부족");
      expect(assessment.english).toBe("Poor");
      expect(assessment.color).toBe("red");
    });

    it("should provide Korean descriptions", () => {
      const assessment = getKoreanAssessment(85);

      expect(assessment.description).toContain("훌륭한");
      expect(assessment.description).toMatch(/[\u3131-\u318E\uAC00-\uD7A3]/); // Korean chars
    });
  });

  describe("calculateExperienceGain", () => {
    const mockStats = {
      attempts: 10,
      hits: 8,
      perfectStrikes: 3,
      accuracy: 80,
      sessionTime: 300,
      experienceGained: 0,
    };

    it("should calculate base experience correctly", () => {
      const exp = calculateExperienceGain(mockStats, PlayerArchetype.MUSA, 1.0);

      expect(exp).toBeGreaterThan(0);
      expect(typeof exp).toBe("number");
    });

    it("should apply archetype bonuses", () => {
      const musaExp = calculateExperienceGain(
        mockStats,
        PlayerArchetype.MUSA,
        1.0
      );
      const jeongboExp = calculateExperienceGain(
        mockStats,
        PlayerArchetype.JEONGBO_YOWON,
        1.0
      );

      expect(jeongboExp).toBeGreaterThan(musaExp);
    });

    it("should consider difficulty multiplier", () => {
      const easyExp = calculateExperienceGain(
        mockStats,
        PlayerArchetype.MUSA,
        1.0
      );
      const hardExp = calculateExperienceGain(
        mockStats,
        PlayerArchetype.MUSA,
        2.0
      );

      expect(hardExp).toBeGreaterThan(easyExp);
    });
  });

  describe("canAccessTrainingMode", () => {
    it("should allow access when level meets requirement", () => {
      const canAccess = canAccessTrainingMode(5, 3, PlayerArchetype.MUSA);

      expect(canAccess).toBe(true);
    });

    it("should deny access when level is too low", () => {
      const canAccess = canAccessTrainingMode(2, 5, PlayerArchetype.MUSA);

      expect(canAccess).toBe(false);
    });

    it("should give special access to intelligence archetype", () => {
      const canAccess = canAccessTrainingMode(
        4,
        5,
        PlayerArchetype.JEONGBO_YOWON
      );

      expect(canAccess).toBe(true);
    });
  });

  describe("formatTrainingTime", () => {
    it("should format minutes and seconds", () => {
      const formatted = formatTrainingTime(125);

      expect(formatted).toBe("2분 5초");
    });

    it("should format seconds only", () => {
      const formatted = formatTrainingTime(45);

      expect(formatted).toBe("45초");
    });

    it("should handle zero time", () => {
      const formatted = formatTrainingTime(0);

      expect(formatted).toBe("0초");
    });
  });

  describe("calculateComboMultiplier", () => {
    it("should return 1.0 for no combo", () => {
      const multiplier = calculateComboMultiplier(0);

      expect(multiplier).toBe(1.0);
    });

    it("should increase with combo count", () => {
      const lowCombo = calculateComboMultiplier(3);
      const highCombo = calculateComboMultiplier(10);

      expect(highCombo).toBeGreaterThan(lowCombo);
    });

    it("should cap at maximum multiplier", () => {
      const veryHighCombo = calculateComboMultiplier(50);

      expect(veryHighCombo).toBe(2.5);
    });
  });

  describe("getTrainingFeedback", () => {
    it("should provide success feedback for excellent performance", () => {
      const feedback = getTrainingFeedback({
        accuracy: 95,
        combo: 10,
        recentTrend: "stable",
      });

      expect(feedback.type).toBe("success");
      expect(feedback.message).toContain("완벽한");
    });

    it("should provide warning for declining performance", () => {
      const feedback = getTrainingFeedback({
        accuracy: 70,
        combo: 2,
        recentTrend: "declining",
      });

      expect(feedback.type).toBe("warning");
      expect(feedback.message).toContain("집중력");
    });

    it("should provide error feedback for poor performance", () => {
      const feedback = getTrainingFeedback({
        accuracy: 30,
        combo: 0,
        recentTrend: "stable",
      });

      expect(feedback.type).toBe("error");
      expect(feedback.message).toContain("기본기");
    });

    it("should use Korean text in all messages", () => {
      const feedback = getTrainingFeedback({
        accuracy: 75,
        combo: 3,
        recentTrend: "stable",
      });

      expect(feedback.message).toMatch(/[\u3131-\u318E\uAC00-\uD7A3]/); // Korean characters
    });
  });
});
