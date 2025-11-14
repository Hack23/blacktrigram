import { describe, expect, it } from "vitest";
import { PlayerArchetype, TrigramStance, VitalPointCategory, VitalPointEffectType, VitalPointSeverity } from "../../types/common";
import { EffectIntensity } from "../effects";
import { createMockPlayerState } from "../../test/test-utils";
import { DamageCalculator } from "./DamageCalculator";
import type { KoreanTechnique, VitalPoint } from "./types";

describe("DamageCalculator", () => {
  const mockVitalPoint: VitalPoint = {
    id: "test_vital_point",
    names: {
      korean: "테스트 급소",
      english: "Test Vital Point",
      romanized: "teseuteu geupso",
    },
    position: { x: 100, y: 50 },
    category: VitalPointCategory.MERIDIAN,
    severity: VitalPointSeverity.MAJOR,
    baseDamage: 25,
    effects: [
      {
        id: "test_effect",
        type: VitalPointEffectType.PAIN,
        intensity: EffectIntensity.MODERATE,
        duration: 2000,
        description: {
          korean: "통증 유발",
          english: "Causes pain",
        },
        stackable: false,
      },
    ],
    description: {
      korean: "테스트용 급소",
      english: "Test vital point",
    },
    targetingDifficulty: 0.7,
    effectiveStances: [TrigramStance.GEON],
  };

  const mockTechnique: KoreanTechnique = {
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
      english: "Test technique",
    },
    stance: TrigramStance.GEON,
    type: "strike",
    damageType: "physical",
    damage: 20,
    kiCost: 10,
    staminaCost: 15,
    accuracy: 0.8,
    range: 1.0,
    executionTime: 500,
    recoveryTime: 300,
    critChance: 0.1,
    critMultiplier: 1.5,
    effects: [],
  };

  describe("calculateVitalPointDamage", () => {
    it("should calculate base damage correctly", () => {
      const attacker = createMockPlayerState();
      const result = DamageCalculator.calculateVitalPointDamage(
        mockVitalPoint,
        20,
        attacker,
        1.0
      );

      expect(result.damage).toBeGreaterThan(0);
      expect(result.isVitalPoint).toBe(true);
    });

    it("should apply archetype modifiers for Musa", () => {
      const attacker = createMockPlayerState();
      attacker.archetype = PlayerArchetype.MUSA;

      const result = DamageCalculator.calculateVitalPointDamage(
        mockVitalPoint,
        20,
        attacker,
        1.0
      );

      // Musa has 1.2x modifier
      expect(result.damage).toBeGreaterThan(20);
    });

    it("should apply archetype modifiers for Amsalja (assassin)", () => {
      const attacker = createMockPlayerState();
      attacker.archetype = PlayerArchetype.AMSALJA;

      const result = DamageCalculator.calculateVitalPointDamage(
        mockVitalPoint,
        20,
        attacker,
        1.0
      );

      // Amsalja has 1.5x modifier (highest)
      expect(result.damage).toBeGreaterThan(25);
    });

    it("should scale damage with accuracy", () => {
      const attacker = createMockPlayerState();

      const lowAccuracyResult = DamageCalculator.calculateVitalPointDamage(
        mockVitalPoint,
        20,
        attacker,
        0.5
      );

      const highAccuracyResult = DamageCalculator.calculateVitalPointDamage(
        mockVitalPoint,
        20,
        attacker,
        1.0
      );

      expect(highAccuracyResult.damage).toBeGreaterThan(lowAccuracyResult.damage);
    });

    it("should mark high accuracy hits as critical", () => {
      const attacker = createMockPlayerState();

      const criticalResult = DamageCalculator.calculateVitalPointDamage(
        mockVitalPoint,
        20,
        attacker,
        0.95
      );

      expect(criticalResult.isCritical).toBe(true);
    });

    it("should not mark low accuracy hits as critical", () => {
      const attacker = createMockPlayerState();

      const normalResult = DamageCalculator.calculateVitalPointDamage(
        mockVitalPoint,
        20,
        attacker,
        0.7
      );

      expect(normalResult.isCritical).toBe(false);
    });

    it("should create status effects from vital point", () => {
      const attacker = createMockPlayerState();

      const result = DamageCalculator.calculateVitalPointDamage(
        mockVitalPoint,
        20,
        attacker,
        1.0
      );

      expect(result.effects.length).toBeGreaterThan(0);
      expect(result.effects[0].type).toBe("weakened");
      expect(result.effects[0].source).toBe(mockVitalPoint.id);
    });

    it("should ensure minimum damage of 1", () => {
      const attacker = createMockPlayerState();

      const result = DamageCalculator.calculateVitalPointDamage(
        mockVitalPoint,
        0.1,
        attacker,
        0.01
      );

      expect(result.damage).toBeGreaterThanOrEqual(1);
    });

    it("should handle vital points with damage range", () => {
      const vitalPointWithRange: VitalPoint = {
        ...mockVitalPoint,
        baseDamage: undefined,
        damage: { min: 15, max: 30 },
      };

      const attacker = createMockPlayerState();
      const result = DamageCalculator.calculateVitalPointDamage(
        vitalPointWithRange,
        20,
        attacker,
        1.0
      );

      expect(result.damage).toBeGreaterThan(0);
    });
  });

  describe("getArchetypeModifier", () => {
    it("should return 1.2 for Musa", () => {
      const modifier = DamageCalculator.getArchetypeModifier(PlayerArchetype.MUSA);
      expect(modifier).toBe(1.2);
    });

    it("should return 1.5 for Amsalja (assassin)", () => {
      const modifier = DamageCalculator.getArchetypeModifier(PlayerArchetype.AMSALJA);
      expect(modifier).toBe(1.5);
    });

    it("should return 1.1 for Hacker", () => {
      const modifier = DamageCalculator.getArchetypeModifier(PlayerArchetype.HACKER);
      expect(modifier).toBe(1.1);
    });

    it("should return 1.1 for Jeongbo Yowon (intelligence operative)", () => {
      const modifier = DamageCalculator.getArchetypeModifier(
        PlayerArchetype.JEONGBO_YOWON
      );
      expect(modifier).toBe(1.1);
    });

    it("should return 1.3 for Jojik Pokryeokbae (organized crime)", () => {
      const modifier = DamageCalculator.getArchetypeModifier(
        PlayerArchetype.JOJIK_POKRYEOKBAE
      );
      expect(modifier).toBe(1.3);
    });
  });

  describe("calculateTechniqueDamage", () => {
    it("should calculate technique damage without vital point", () => {
      const attacker = createMockPlayerState();

      const result = DamageCalculator.calculateTechniqueDamage(
        mockTechnique,
        attacker,
        null,
        1.0
      );

      expect(result.damage).toBeGreaterThan(0);
      expect(result.isVitalPoint).toBe(false);
    });

    it("should calculate technique damage with vital point", () => {
      const attacker = createMockPlayerState();

      const result = DamageCalculator.calculateTechniqueDamage(
        mockTechnique,
        attacker,
        mockVitalPoint,
        1.0
      );

      expect(result.damage).toBeGreaterThan(0);
      expect(result.isVitalPoint).toBe(true);
    });

    it("should apply vital point multiplier", () => {
      const attacker = createMockPlayerState();

      const withoutVP = DamageCalculator.calculateTechniqueDamage(
        mockTechnique,
        attacker,
        null,
        1.0
      );

      const withVP = DamageCalculator.calculateTechniqueDamage(
        mockTechnique,
        attacker,
        mockVitalPoint,
        1.0
      );

      expect(withVP.damage).toBeGreaterThan(withoutVP.damage);
    });

    it("should scale with accuracy", () => {
      const attacker = createMockPlayerState();

      const lowAccuracy = DamageCalculator.calculateTechniqueDamage(
        mockTechnique,
        attacker,
        mockVitalPoint,
        0.5
      );

      const highAccuracy = DamageCalculator.calculateTechniqueDamage(
        mockTechnique,
        attacker,
        mockVitalPoint,
        1.0
      );

      expect(highAccuracy.damage).toBeGreaterThan(lowAccuracy.damage);
    });

    it("should apply archetype modifiers", () => {
      const musa = createMockPlayerState();
      musa.archetype = PlayerArchetype.MUSA;

      const assassin = createMockPlayerState();
      assassin.archetype = PlayerArchetype.AMSALJA;

      const musaResult = DamageCalculator.calculateTechniqueDamage(
        mockTechnique,
        musa,
        null,
        1.0
      );

      const assassinResult = DamageCalculator.calculateTechniqueDamage(
        mockTechnique,
        assassin,
        null,
        1.0
      );

      expect(assassinResult.damage).toBeGreaterThan(musaResult.damage);
    });

    it("should mark high accuracy as critical", () => {
      const attacker = createMockPlayerState();

      const result = DamageCalculator.calculateTechniqueDamage(
        mockTechnique,
        attacker,
        null,
        0.9
      );

      expect(result.isCritical).toBe(true);
    });

    it("should include vital point effects", () => {
      const attacker = createMockPlayerState();

      const result = DamageCalculator.calculateTechniqueDamage(
        mockTechnique,
        attacker,
        mockVitalPoint,
        1.0
      );

      expect(result.effects.length).toBeGreaterThan(0);
    });

    it("should ensure minimum damage of 1", () => {
      const attacker = createMockPlayerState();
      const weakTechnique: KoreanTechnique = { ...mockTechnique, damage: 1 };

      const result = DamageCalculator.calculateTechniqueDamage(
        weakTechnique,
        attacker,
        null,
        0.01
      );

      expect(result.damage).toBeGreaterThanOrEqual(1);
    });

    it("should floor damage to integer", () => {
      const attacker = createMockPlayerState();

      const result = DamageCalculator.calculateTechniqueDamage(
        mockTechnique,
        attacker,
        mockVitalPoint,
        1.0
      );

      expect(Number.isInteger(result.damage)).toBe(true);
    });
  });

  describe("calculateDamageReduction", () => {
    it("should reduce damage based on defense", () => {
      const damage = 100;
      const defense = 50;

      const reduced = DamageCalculator.calculateDamageReduction(damage, defense, false);

      expect(reduced).toBeLessThan(damage);
      expect(reduced).toBeGreaterThan(0);
    });

    it("should apply blocking multiplier", () => {
      const damage = 100;
      const defense = 50;

      const normal = DamageCalculator.calculateDamageReduction(damage, defense, false);
      const blocked = DamageCalculator.calculateDamageReduction(damage, defense, true);

      expect(blocked).toBeLessThan(normal);
    });

    it("should cap defense reduction at 80%", () => {
      const damage = 100;
      const highDefense = 1000;

      const reduced = DamageCalculator.calculateDamageReduction(
        damage,
        highDefense,
        false
      );

      // Allow for floating point precision issues
      expect(reduced).toBeGreaterThan(damage * 0.19);
      expect(reduced).toBeLessThanOrEqual(damage * 0.21);
    });

    it("should ensure minimum damage of 1", () => {
      const damage = 10;
      const highDefense = 200;

      const reduced = DamageCalculator.calculateDamageReduction(
        damage,
        highDefense,
        true
      );

      expect(reduced).toBeGreaterThanOrEqual(1);
    });

    it("should handle zero defense", () => {
      const damage = 100;

      const reduced = DamageCalculator.calculateDamageReduction(damage, 0, false);

      expect(reduced).toBe(damage);
    });

    it("should handle blocking without defense", () => {
      const damage = 100;

      const reduced = DamageCalculator.calculateDamageReduction(damage, 0, true);

      expect(reduced).toBe(damage * 0.5);
    });
  });

  describe("calculateCriticalChance", () => {
    it("should calculate base critical chance", () => {
      const attacker = createMockPlayerState();

      const chance = DamageCalculator.calculateCriticalChance(
        0.1,
        attacker,
        mockTechnique
      );

      expect(chance).toBeGreaterThanOrEqual(0.1);
      expect(chance).toBeLessThanOrEqual(1.0);
    });

    it("should apply archetype bonus", () => {
      const musa = createMockPlayerState();
      musa.archetype = PlayerArchetype.MUSA;

      const assassin = createMockPlayerState();
      assassin.archetype = PlayerArchetype.AMSALJA;

      const musaChance = DamageCalculator.calculateCriticalChance(
        0.1,
        musa,
        mockTechnique
      );

      const assassinChance = DamageCalculator.calculateCriticalChance(
        0.1,
        assassin,
        mockTechnique
      );

      expect(assassinChance).toBeGreaterThan(musaChance);
    });

    it("should apply technique bonus", () => {
      const attacker = createMockPlayerState();
      const highCritTechnique: KoreanTechnique = {
        ...mockTechnique,
        critChance: 0.3,
      };

      const normalChance = DamageCalculator.calculateCriticalChance(
        0.1,
        attacker,
        mockTechnique
      );

      const highChance = DamageCalculator.calculateCriticalChance(
        0.1,
        attacker,
        highCritTechnique
      );

      expect(highChance).toBeGreaterThan(normalChance);
    });

    it("should cap critical chance at 95%", () => {
      const attacker = createMockPlayerState();
      attacker.archetype = PlayerArchetype.AMSALJA;

      const highCritTechnique: KoreanTechnique = {
        ...mockTechnique,
        critChance: 0.9,
      };

      const chance = DamageCalculator.calculateCriticalChance(
        0.5,
        attacker,
        highCritTechnique
      );

      expect(chance).toBeLessThanOrEqual(0.95);
    });

    it("should handle zero base crit chance", () => {
      const attacker = createMockPlayerState();

      const chance = DamageCalculator.calculateCriticalChance(
        0,
        attacker,
        mockTechnique
      );

      expect(chance).toBeGreaterThanOrEqual(0);
    });

    it("should handle technique without crit bonus", () => {
      const attacker = createMockPlayerState();
      const noCritTechnique: KoreanTechnique = {
        ...mockTechnique,
        critChance: undefined,
      };

      const chance = DamageCalculator.calculateCriticalChance(
        0.1,
        attacker,
        noCritTechnique
      );

      expect(chance).toBeGreaterThanOrEqual(0.1);
    });
  });

  describe("Korean martial arts integration", () => {
    it("should respect archetype philosophies in damage calculation", () => {
      const archetypes = [
        PlayerArchetype.MUSA,
        PlayerArchetype.AMSALJA,
        PlayerArchetype.HACKER,
        PlayerArchetype.JEONGBO_YOWON,
        PlayerArchetype.JOJIK_POKRYEOKBAE,
      ];

      archetypes.forEach((archetype) => {
        const modifier = DamageCalculator.getArchetypeModifier(archetype);
        expect(modifier).toBeGreaterThan(0);
        expect(modifier).toBeLessThanOrEqual(2.0);
      });
    });

    it("should preserve vital point effects with Korean descriptions", () => {
      const attacker = createMockPlayerState();

      const result = DamageCalculator.calculateVitalPointDamage(
        mockVitalPoint,
        20,
        attacker,
        1.0
      );

      expect(result.effects[0].description).toBeDefined();
    });

    it("should maintain stackable property for effects", () => {
      const attacker = createMockPlayerState();

      const result = DamageCalculator.calculateVitalPointDamage(
        mockVitalPoint,
        20,
        attacker,
        1.0
      );

      expect(result.effects[0].stackable).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle negative accuracy gracefully", () => {
      const attacker = createMockPlayerState();

      const result = DamageCalculator.calculateVitalPointDamage(
        mockVitalPoint,
        20,
        attacker,
        -0.5
      );

      expect(result.damage).toBeGreaterThanOrEqual(1);
    });

    it("should handle accuracy > 1.0", () => {
      const attacker = createMockPlayerState();

      const result = DamageCalculator.calculateVitalPointDamage(
        mockVitalPoint,
        20,
        attacker,
        1.5
      );

      expect(result.damage).toBeGreaterThan(0);
    });

    it("should handle vital point with multiple effects", () => {
      const multiEffectVP: VitalPoint = {
        ...mockVitalPoint,
        effects: [
          mockVitalPoint.effects[0],
          {
            id: "test_effect_2",
            type: VitalPointEffectType.STUN,
            intensity: EffectIntensity.HIGH,
            duration: 1000,
            description: { korean: "기절", english: "Stun" },
            stackable: true,
          },
        ],
      };

      const attacker = createMockPlayerState();
      const result = DamageCalculator.calculateVitalPointDamage(
        multiEffectVP,
        20,
        attacker,
        1.0
      );

      expect(result.effects.length).toBe(2);
    });

    it("should handle vital point with no effects", () => {
      const noEffectVP: VitalPoint = {
        ...mockVitalPoint,
        effects: [],
      };

      const attacker = createMockPlayerState();
      const result = DamageCalculator.calculateVitalPointDamage(
        noEffectVP,
        20,
        attacker,
        1.0
      );

      expect(result.effects.length).toBe(0);
    });
  });
});
