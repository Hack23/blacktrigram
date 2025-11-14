import { beforeEach, describe, expect, it } from "vitest";
import { PlayerArchetype, TrigramStance, VitalPointCategory, VitalPointEffectType, VitalPointSeverity } from "../../types/common";
import { createMockPlayerState } from "../../test/test-utils";
import { DamageCalculator } from "./DamageCalculator";
import { VitalPoint, KoreanTechnique } from "./types";
import { CombatAttackType, DamageType } from "../../types/common";

describe("DamageCalculator", () => {
  let mockPlayer: ReturnType<typeof createMockPlayerState>;
  let mockVitalPoint: VitalPoint;
  let mockTechnique: KoreanTechnique;

  beforeEach(() => {
    mockPlayer = createMockPlayerState();
    
    mockVitalPoint = {
      id: "test_vital_point",
      names: {
        korean: "테스트 혈자리",
        english: "Test Vital Point",
        romanized: "teseuteu hyeoljali",
      },
      position: { x: 100, y: 100 },
      category: VitalPointCategory.HEAD,
      severity: VitalPointSeverity.MAJOR,
      baseDamage: 20,
      targetingDifficulty: 0.7,
      effectiveStances: [TrigramStance.GEON, TrigramStance.TAE],
      effects: [
        {
          id: "stun_effect",
          type: VitalPointEffectType.STUN,
          intensity: 0.8,
          duration: 2000,
          description: { korean: "기절 효과", english: "Stun effect" },
          stackable: false,
        },
      ],
      description: {
        korean: "테스트용 혈자리",
        english: "Test vital point for testing",
      },
    };

    mockTechnique = {
      id: "test_technique",
      name: {
        korean: "테스트 기술",
        english: "Test Technique",
        romanized: "teseuteu gisul",
      },
      koreanName: "테스트 기술",
      englishName: "Test Technique",
      romanized: "teseuteu gisul",
      description: {
        korean: "테스트용 기술",
        english: "Test technique for testing",
      },
      stance: TrigramStance.GEON,
      type: CombatAttackType.STRIKE,
      damageType: DamageType.BLUNT,
      damage: 15,
      kiCost: 10,
      staminaCost: 15,
      accuracy: 0.85,
      range: 1.5,
      executionTime: 300,
      recoveryTime: 500,
      critChance: 0.1,
      critMultiplier: 1.5,
      effects: [],
    };
  });

  describe("calculateVitalPointDamage", () => {
    it("should calculate basic vital point damage", () => {
      const result = DamageCalculator.calculateVitalPointDamage(
        mockVitalPoint,
        15,
        mockPlayer,
        0.9
      );

      expect(result).toBeDefined();
      expect(result.damage).toBeGreaterThan(0);
      expect(result.isVitalPoint).toBe(true);
    });

    it("should scale damage with accuracy", () => {
      const lowAccuracyResult = DamageCalculator.calculateVitalPointDamage(
        mockVitalPoint,
        15,
        mockPlayer,
        0.5
      );

      const highAccuracyResult = DamageCalculator.calculateVitalPointDamage(
        mockVitalPoint,
        15,
        mockPlayer,
        0.95
      );

      expect(highAccuracyResult.damage).toBeGreaterThan(lowAccuracyResult.damage);
    });

    it("should apply archetype modifiers", () => {
      const musaPlayer = { ...mockPlayer, archetype: PlayerArchetype.MUSA };
      const amsaljaPlayer = { ...mockPlayer, archetype: PlayerArchetype.AMSALJA };

      const musaResult = DamageCalculator.calculateVitalPointDamage(
        mockVitalPoint,
        15,
        musaPlayer,
        0.9
      );

      const amsaljaResult = DamageCalculator.calculateVitalPointDamage(
        mockVitalPoint,
        15,
        amsaljaPlayer,
        0.9
      );

      // Assassin should do more damage than warrior
      expect(amsaljaResult.damage).toBeGreaterThan(musaResult.damage);
    });

    it("should mark critical hits for high accuracy", () => {
      const criticalResult = DamageCalculator.calculateVitalPointDamage(
        mockVitalPoint,
        15,
        mockPlayer,
        0.95
      );

      expect(criticalResult.isCritical).toBe(true);
    });

    it("should not mark critical hits for low accuracy", () => {
      const normalResult = DamageCalculator.calculateVitalPointDamage(
        mockVitalPoint,
        15,
        mockPlayer,
        0.7
      );

      expect(normalResult.isCritical).toBe(false);
    });

    it("should convert vital point effects to status effects", () => {
      const result = DamageCalculator.calculateVitalPointDamage(
        mockVitalPoint,
        15,
        mockPlayer,
        0.9
      );

      expect(result.effects).toBeDefined();
      expect(result.effects.length).toBeGreaterThan(0);
      expect(result.effects[0]).toHaveProperty("id");
      expect(result.effects[0]).toHaveProperty("type");
      expect(result.effects[0]).toHaveProperty("duration");
      expect(result.effects[0]).toHaveProperty("source");
    });

    it("should ensure minimum damage of 1", () => {
      const result = DamageCalculator.calculateVitalPointDamage(
        mockVitalPoint,
        1,
        mockPlayer,
        0.01
      );

      expect(result.damage).toBeGreaterThanOrEqual(1);
    });

    it("should handle vital point with undefined baseDamage", () => {
      const vitalPointNoDamage = { ...mockVitalPoint, baseDamage: undefined };

      const result = DamageCalculator.calculateVitalPointDamage(
        vitalPointNoDamage,
        15,
        mockPlayer,
        0.9
      );

      expect(result.damage).toBeGreaterThan(0);
    });
  });

  describe("getArchetypeModifier", () => {
    it("should return correct modifier for MUSA", () => {
      const modifier = DamageCalculator.getArchetypeModifier(PlayerArchetype.MUSA);
      expect(modifier).toBe(1.2);
    });

    it("should return correct modifier for AMSALJA", () => {
      const modifier = DamageCalculator.getArchetypeModifier(PlayerArchetype.AMSALJA);
      expect(modifier).toBe(1.5);
    });

    it("should return correct modifier for HACKER", () => {
      const modifier = DamageCalculator.getArchetypeModifier(PlayerArchetype.HACKER);
      expect(modifier).toBe(1.1);
    });

    it("should return correct modifier for JEONGBO_YOWON", () => {
      const modifier = DamageCalculator.getArchetypeModifier(PlayerArchetype.JEONGBO_YOWON);
      expect(modifier).toBe(1.1);
    });

    it("should return correct modifier for JOJIK_POKRYEOKBAE", () => {
      const modifier = DamageCalculator.getArchetypeModifier(PlayerArchetype.JOJIK_POKRYEOKBAE);
      expect(modifier).toBe(1.3);
    });

    it("should return 1.0 for unknown archetype", () => {
      const modifier = DamageCalculator.getArchetypeModifier("UNKNOWN" as PlayerArchetype);
      expect(modifier).toBe(1.0);
    });
  });

  describe("calculateTechniqueDamage", () => {
    it("should calculate basic technique damage without vital point", () => {
      const result = DamageCalculator.calculateTechniqueDamage(
        mockTechnique,
        mockPlayer,
        null,
        0.85
      );

      expect(result).toBeDefined();
      expect(result.damage).toBeGreaterThan(0);
      expect(result.isVitalPoint).toBe(false);
    });

    it("should increase damage with vital point hit", () => {
      const withoutVP = DamageCalculator.calculateTechniqueDamage(
        mockTechnique,
        mockPlayer,
        null,
        0.85
      );

      const withVP = DamageCalculator.calculateTechniqueDamage(
        mockTechnique,
        mockPlayer,
        mockVitalPoint,
        0.85
      );

      expect(withVP.damage).toBeGreaterThan(withoutVP.damage);
    });

    it("should apply archetype modifiers to technique damage", () => {
      const musaPlayer = { ...mockPlayer, archetype: PlayerArchetype.MUSA };
      const amsaljaPlayer = { ...mockPlayer, archetype: PlayerArchetype.AMSALJA };

      const musaResult = DamageCalculator.calculateTechniqueDamage(
        mockTechnique,
        musaPlayer,
        null,
        0.85
      );

      const amsaljaResult = DamageCalculator.calculateTechniqueDamage(
        mockTechnique,
        amsaljaPlayer,
        null,
        0.85
      );

      expect(amsaljaResult.damage).toBeGreaterThan(musaResult.damage);
    });

    it("should scale damage with accuracy", () => {
      const lowAccuracy = DamageCalculator.calculateTechniqueDamage(
        mockTechnique,
        mockPlayer,
        null,
        0.5
      );

      const highAccuracy = DamageCalculator.calculateTechniqueDamage(
        mockTechnique,
        mockPlayer,
        null,
        0.95
      );

      expect(highAccuracy.damage).toBeGreaterThan(lowAccuracy.damage);
    });

    it("should mark critical hits for high accuracy (>0.8)", () => {
      const result = DamageCalculator.calculateTechniqueDamage(
        mockTechnique,
        mockPlayer,
        null,
        0.85
      );

      expect(result.isCritical).toBe(true);
    });

    it("should not mark critical hits for low accuracy", () => {
      const result = DamageCalculator.calculateTechniqueDamage(
        mockTechnique,
        mockPlayer,
        null,
        0.7
      );

      expect(result.isCritical).toBe(false);
    });

    it("should add vital point effects when hitting vital point", () => {
      const result = DamageCalculator.calculateTechniqueDamage(
        mockTechnique,
        mockPlayer,
        mockVitalPoint,
        0.85
      );

      expect(result.effects.length).toBeGreaterThan(0);
      expect(result.isVitalPoint).toBe(true);
    });

    it("should ensure minimum damage of 1", () => {
      const weakTechnique = { ...mockTechnique, damage: 1 };

      const result = DamageCalculator.calculateTechniqueDamage(
        weakTechnique,
        mockPlayer,
        null,
        0.01
      );

      expect(result.damage).toBeGreaterThanOrEqual(1);
    });

    it("should floor damage to integer", () => {
      const result = DamageCalculator.calculateTechniqueDamage(
        mockTechnique,
        mockPlayer,
        null,
        0.85
      );

      expect(result.damage).toBe(Math.floor(result.damage));
    });

    it("should handle technique with undefined damage", () => {
      const noDamageTechnique = { ...mockTechnique, damage: undefined };

      const result = DamageCalculator.calculateTechniqueDamage(
        noDamageTechnique as any,
        mockPlayer,
        null,
        0.85
      );

      expect(result.damage).toBeGreaterThan(0);
    });
  });

  describe("calculateDamageReduction", () => {
    it("should reduce damage based on defense", () => {
      const reducedDamage = DamageCalculator.calculateDamageReduction(
        100,
        50,
        false
      );

      expect(reducedDamage).toBeLessThan(100);
    });

    it("should reduce damage more with higher defense", () => {
      const lowDefense = DamageCalculator.calculateDamageReduction(100, 25, false);
      const highDefense = DamageCalculator.calculateDamageReduction(100, 100, false);

      expect(highDefense).toBeLessThan(lowDefense);
    });

    it("should apply blocking multiplier", () => {
      const notBlocking = DamageCalculator.calculateDamageReduction(100, 50, false);
      const blocking = DamageCalculator.calculateDamageReduction(100, 50, true);

      expect(blocking).toBeLessThan(notBlocking);
      expect(blocking).toBe(notBlocking * 0.5);
    });

    it("should cap defense reduction at 80%", () => {
      const maxDefense = DamageCalculator.calculateDamageReduction(100, 999, false);

      // 100 * (1 - 0.8) = 20 minimum (allow floating point tolerance)
      expect(maxDefense).toBeGreaterThanOrEqual(19.9);
    });

    it("should ensure minimum damage of 1", () => {
      const reduced = DamageCalculator.calculateDamageReduction(2, 999, true);

      expect(reduced).toBeGreaterThanOrEqual(1);
    });

    it("should handle zero defense", () => {
      const result = DamageCalculator.calculateDamageReduction(100, 0, false);

      expect(result).toBe(100);
    });

    it("should handle very high incoming damage", () => {
      const result = DamageCalculator.calculateDamageReduction(9999, 50, false);

      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(9999);
    });
  });

  describe("calculateCriticalChance", () => {
    it("should calculate critical chance with archetype bonus", () => {
      const critChance = DamageCalculator.calculateCriticalChance(
        0.1,
        mockPlayer,
        mockTechnique
      );

      expect(critChance).toBeGreaterThan(0.1);
    });

    it("should cap critical chance at 95%", () => {
      const highCritChance = DamageCalculator.calculateCriticalChance(
        0.9,
        mockPlayer,
        mockTechnique
      );

      expect(highCritChance).toBeLessThanOrEqual(0.95);
    });

    it("should increase crit chance for assassin archetype", () => {
      const musaPlayer = { ...mockPlayer, archetype: PlayerArchetype.MUSA };
      const amsaljaPlayer = { ...mockPlayer, archetype: PlayerArchetype.AMSALJA };

      const musaCrit = DamageCalculator.calculateCriticalChance(
        0.1,
        musaPlayer,
        mockTechnique
      );

      const amsaljaCrit = DamageCalculator.calculateCriticalChance(
        0.1,
        amsaljaPlayer,
        mockTechnique
      );

      expect(amsaljaCrit).toBeGreaterThan(musaCrit);
    });

    it("should include technique crit chance bonus", () => {
      const lowCritTechnique = { ...mockTechnique, critChance: 0.05 };
      const highCritTechnique = { ...mockTechnique, critChance: 0.2 };

      const lowCrit = DamageCalculator.calculateCriticalChance(
        0.1,
        mockPlayer,
        lowCritTechnique
      );

      const highCrit = DamageCalculator.calculateCriticalChance(
        0.1,
        mockPlayer,
        highCritTechnique
      );

      expect(highCrit).toBeGreaterThan(lowCrit);
    });

    it("should handle undefined technique critChance", () => {
      const noCritTechnique = { ...mockTechnique, critChance: undefined };

      const result = DamageCalculator.calculateCriticalChance(
        0.1,
        mockPlayer,
        noCritTechnique as any
      );

      expect(result).toBeGreaterThanOrEqual(0.1);
    });

    it("should return value between 0 and 0.95", () => {
      const result = DamageCalculator.calculateCriticalChance(
        0.5,
        mockPlayer,
        mockTechnique
      );

      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(0.95);
    });
  });

  describe("edge cases", () => {
    it("should handle zero accuracy", () => {
      const result = DamageCalculator.calculateVitalPointDamage(
        mockVitalPoint,
        15,
        mockPlayer,
        0
      );

      expect(result.damage).toBeGreaterThanOrEqual(1);
    });

    it("should handle accuracy over 1.0", () => {
      const result = DamageCalculator.calculateVitalPointDamage(
        mockVitalPoint,
        15,
        mockPlayer,
        1.5
      );

      expect(result.damage).toBeGreaterThan(0);
    });

    it("should handle negative base damage", () => {
      const result = DamageCalculator.calculateVitalPointDamage(
        mockVitalPoint,
        -10,
        mockPlayer,
        0.9
      );

      // Should still ensure minimum damage of 1
      expect(result.damage).toBeGreaterThanOrEqual(1);
    });

    it("should handle vital point with empty effects array", () => {
      const noEffectsVP = { ...mockVitalPoint, effects: [] };

      const result = DamageCalculator.calculateVitalPointDamage(
        noEffectsVP,
        15,
        mockPlayer,
        0.9
      );

      expect(result.effects).toEqual([]);
    });

    it("should handle multiple vital point effects", () => {
      const multiEffectVP = {
        ...mockVitalPoint,
        effects: [
          {
            id: "effect1",
            type: VitalPointEffectType.STUN,
            intensity: 0.8,
            duration: 1000,
            description: { korean: "효과1", english: "Effect 1" },
            stackable: false,
          },
          {
            id: "effect2",
            type: VitalPointEffectType.PAIN,
            intensity: 0.6,
            duration: 2000,
            description: { korean: "효과2", english: "Effect 2" },
            stackable: true,
          },
        ],
      };

      const result = DamageCalculator.calculateVitalPointDamage(
        multiEffectVP,
        15,
        mockPlayer,
        0.9
      );

      expect(result.effects.length).toBe(2);
    });
  });
});
