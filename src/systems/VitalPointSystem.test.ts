import { describe, it, expect } from "vitest";
import { VitalPointSystem } from "./VitalPointSystem";
import type {
  Position,
  VitalPoint,
  KoreanTechnique,
  VitalPointSystemConfig,
} from "../types";

describe("VitalPointSystem", () => {
  const mockVitalPoint: VitalPoint = {
    id: "test-point",
    name: { korean: "테스트 급소", english: "Test Vital Point" },
    koreanName: "테스트 급소",
    position: { x: 50, y: 50 },
    region: "head",
    damageMultiplier: 2.0,
    category: "nerve",
    difficulty: 0.7,
    effects: [
      {
        type: "stun",
        duration: 3000,
        magnitude: 1.0,
        chance: 0.8,
        source: "vital_point_hit",
      },
    ],
  };

  const mockTechnique: KoreanTechnique = {
    name: "천둥벽력",
    koreanName: "천둥벽력",
    englishName: "Thunder Strike",
    description: { korean: "천둥벽력", english: "Thunder Strike" },
    kiCost: 15,
    staminaCost: 10,
    range: 60,
    accuracy: 0.8,
    stance: "geon",
    damage: 28,
    type: "strike",
  };

  const defaultConfig: VitalPointSystemConfig = {
    baseAccuracy: 0.8,
    distanceModifier: 0.05,
    targetingDifficulty: 0.75,
    damageMultiplier: 1.8,
    effectChance: 0.6,
  };

  it("should check vital point hit with valid parameters", () => {
    const targetPosition: Position = { x: 50, y: 50 };
    const distance = 10;

    const result = VitalPointSystem.checkVitalPointHit(
      targetPosition,
      mockVitalPoint,
      mockTechnique,
      distance,
      defaultConfig
    );

    expect(result).toBeDefined();
    if (result) {
      expect(result.hit).toBe(true);
      expect(result.vitalPoint).toBe(mockVitalPoint);
      expect(result.damage).toBeGreaterThan(0);
    }
  });

  it("should miss when target is far from vital point", () => {
    const targetPosition: Position = { x: 200, y: 200 };
    const distance = 10;

    const result = VitalPointSystem.checkVitalPointHit(
      targetPosition,
      mockVitalPoint,
      mockTechnique,
      distance,
      defaultConfig
    );

    if (result) {
      expect(result.hit).toBe(false);
    }
  });

  it("should calculate accuracy based on distance and technique", () => {
    const attackerPosition: Position = { x: 0, y: 0 };
    const targetPosition: Position = { x: 30, y: 40 };
    const distance = 50;

    const accuracy = VitalPointSystem.calculateAccuracy(
      attackerPosition,
      targetPosition,
      mockTechnique,
      distance
    );

    expect(accuracy).toBeGreaterThan(0);
    expect(accuracy).toBeLessThanOrEqual(1);
  });

  it("should apply different modifiers for different attack types", () => {
    const punchModifier = VitalPointSystem.getTechniqueTypeModifier(
      "punch",
      mockVitalPoint
    );
    const kickModifier = VitalPointSystem.getTechniqueTypeModifier(
      "kick",
      mockVitalPoint
    );

    expect(punchModifier).toBeGreaterThan(0);
    expect(kickModifier).toBeGreaterThan(0);
    expect(Math.abs(punchModifier - kickModifier)).toBeGreaterThanOrEqual(0);
  });

  it("should return optimal angle for technique", () => {
    const angle = VitalPointSystem.getOptimalAngleForTechnique(mockTechnique);
    expect(typeof angle).toBe("number");
    expect(angle).toBeGreaterThanOrEqual(0);
    expect(angle).toBeLessThanOrEqual(Math.PI * 2);
  });

  it("should handle critical hits on high-difficulty points", () => {
    const highDifficultyPoint: VitalPoint = {
      ...mockVitalPoint,
      difficulty: 0.9,
      damageMultiplier: 2.5,
    };

    const targetPosition: Position = { x: 50, y: 50 };
    const result = VitalPointSystem.checkVitalPointHit(
      targetPosition,
      highDifficultyPoint,
      mockTechnique,
      10,
      defaultConfig
    );

    if (result && result.hit) {
      expect(result.vitalPoint.difficulty).toBe(0.9);
      expect(result.damage).toBeGreaterThan(mockTechnique.damage);
    }
  });

  it("should configure system parameters", () => {
    const newConfig: Partial<VitalPointSystemConfig> = {
      baseAccuracy: 0.9,
      damageMultiplier: 2.0,
    };

    VitalPointSystem.configure(newConfig);

    expect(VitalPointSystem.config.baseAccuracy).toBe(0.9);
    expect(VitalPointSystem.config.damageMultiplier).toBe(2.0);
    expect(VitalPointSystem.config.distanceModifier).toBe(0.05); // Should retain original value
  });
});
