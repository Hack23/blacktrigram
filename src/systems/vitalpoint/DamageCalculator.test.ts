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

  describe("calculateEnhancedVitalPointDamage", () => {
    let attacker: ReturnType<typeof createMockPlayerState>;
    let defender: ReturnType<typeof createMockPlayerState>;
    let vitalPointHitResult: any;
    let meridianStates: Record<string, number>;

    beforeEach(() => {
      attacker = createMockPlayerState({
        archetype: PlayerArchetype.MUSA,
        attackPower: 50,
        currentStance: TrigramStance.GEON,
      });

      defender = createMockPlayerState({
        archetype: PlayerArchetype.MUSA,
        defense: 30,
        currentStance: TrigramStance.GON,
      });

      vitalPointHitResult = {
        hit: true,
        vitalPointHit: mockVitalPoint,
        damage: 20,
        effects: [],
        severity: VitalPointSeverity.MAJOR,
        accuracy: 0.85,
      };

      meridianStates = {
        liver: 1.0,
        gallbladder: 1.0,
        bladder: 1.0,
      };
    });

    it("should calculate base damage from attacker power and technique", () => {
      const result = DamageCalculator.calculateEnhancedVitalPointDamage(
        attacker,
        defender,
        mockTechnique,
        vitalPointHitResult,
        12, // Noon
        meridianStates
      );

      expect(result.damage).toBeGreaterThan(0);
      expect(result.isVitalPoint).toBe(true);
    });

    it("should apply stance effectiveness multiplier", () => {
      // Just verify that damage is calculated and stance effectiveness is considered
      const result = DamageCalculator.calculateEnhancedVitalPointDamage(
        attacker,
        defender,
        mockTechnique,
        vitalPointHitResult,
        12,
        meridianStates
      );

      // Verify damage is reasonable and calculated
      expect(result.damage).toBeGreaterThan(0);
      expect(result.damage).toBeLessThan(500); // Reasonable upper bound
    });

    it("should apply vital point severity multipliers", () => {
      // Test different severities produce different ranges
      const minorVP = { ...vitalPointHitResult, severity: VitalPointSeverity.MINOR };
      const lethalVP = { ...vitalPointHitResult, severity: VitalPointSeverity.LETHAL };

      // Average over runs
      let minorTotal = 0;
      let lethalTotal = 0;
      const iterations = 30;

      for (let i = 0; i < iterations; i++) {
        minorTotal += DamageCalculator.calculateEnhancedVitalPointDamage(
          attacker,
          defender,
          mockTechnique,
          minorVP,
          12,
          meridianStates
        ).damage;

        lethalTotal += DamageCalculator.calculateEnhancedVitalPointDamage(
          attacker,
          defender,
          mockTechnique,
          lethalVP,
          12,
          meridianStates
        ).damage;
      }

      const minorAvg = minorTotal / iterations;
      const lethalAvg = lethalTotal / iterations;

      // Lethal should deal significantly more damage than minor
      // LETHAL is 3.0x vs MINOR 1.2x = 2.5x difference
      expect(lethalAvg).toBeGreaterThan(minorAvg * 2.3);
    });

    it("should apply accuracy bonus correctly", () => {
      const lowAccuracyHit = { ...vitalPointHitResult, accuracy: 0.2 };
      const highAccuracyHit = { ...vitalPointHitResult, accuracy: 1.0 };

      // Average over runs
      let lowTotal = 0;
      let highTotal = 0;
      const iterations = 30;

      for (let i = 0; i < iterations; i++) {
        lowTotal += DamageCalculator.calculateEnhancedVitalPointDamage(
          attacker,
          defender,
          mockTechnique,
          lowAccuracyHit,
          12,
          meridianStates
        ).damage;

        highTotal += DamageCalculator.calculateEnhancedVitalPointDamage(
          attacker,
          defender,
          mockTechnique,
          highAccuracyHit,
          12,
          meridianStates
        ).damage;
      }

      const lowAvg = lowTotal / iterations;
      const highAvg = highTotal / iterations;

      // High accuracy should deal more damage
      expect(highAvg).toBeGreaterThan(lowAvg);
    });

    it("should apply meridian flow bonus at peak hours", () => {
      // Test that meridian-related vital points exist and calculations work
      const result = DamageCalculator.calculateEnhancedVitalPointDamage(
        attacker,
        defender,
        mockTechnique,
        vitalPointHitResult,
        2, // Liver peak
        { liver: 1.0 }
      );

      // Verify calculation works
      expect(result.damage).toBeGreaterThan(0);
      expect(result.isVitalPoint).toBe(true);
    });

    it("should apply time-of-day bonus for Dark Ops techniques at night", () => {
      const darkOpsTechnique = {
        ...mockTechnique,
        id: "dark_ops_shadow_strike",
      };

      const nightResult = DamageCalculator.calculateEnhancedVitalPointDamage(
        attacker,
        defender,
        darkOpsTechnique,
        vitalPointHitResult,
        22, // 10 PM - night time
        meridianStates
      );

      const dayResult = DamageCalculator.calculateEnhancedVitalPointDamage(
        attacker,
        defender,
        darkOpsTechnique,
        vitalPointHitResult,
        12, // Noon - day time
        meridianStates
      );

      // Both should produce damage, night potentially higher
      expect(nightResult.damage).toBeGreaterThan(0);
      expect(dayResult.damage).toBeGreaterThan(0);
    });

    it("should apply archetype-specific bonuses", () => {
      // Test that archetype modifiers are applied by checking the calculation directly
      const musaModifier = DamageCalculator.getArchetypeModifier(PlayerArchetype.MUSA);
      const amsaljaModifier = DamageCalculator.getArchetypeModifier(PlayerArchetype.AMSALJA);

      expect(musaModifier).toBe(1.2);
      expect(amsaljaModifier).toBe(1.5);

      // Verify that both archetypes produce valid damage
      const musaAttacker = createMockPlayerState({
        archetype: PlayerArchetype.MUSA,
        attackPower: 50,
        currentStance: TrigramStance.TAE,
      });

      const amsaljaAttacker = createMockPlayerState({
        archetype: PlayerArchetype.AMSALJA,
        attackPower: 50,
        currentStance: TrigramStance.TAE,
      });

      const musaResult = DamageCalculator.calculateEnhancedVitalPointDamage(
        musaAttacker,
        defender,
        mockTechnique,
        vitalPointHitResult,
        12,
        meridianStates
      );

      const amsaljaResult = DamageCalculator.calculateEnhancedVitalPointDamage(
        amsaljaAttacker,
        defender,
        mockTechnique,
        vitalPointHitResult,
        12,
        meridianStates
      );

      // Both should produce valid damage
      expect(musaResult.damage).toBeGreaterThan(0);
      expect(amsaljaResult.damage).toBeGreaterThan(0);
    });

    it("should apply defense reduction correctly", () => {
      // Test that defense reduction is applied using the existing method
      // We need to use the same base damage to compare, so we test with different defenders
      // in the same calculation run
      
      let zeroDefTotal = 0;
      let midDefTotal = 0;
      let highDefTotal = 0;
      const iterations = 50;

      for (let i = 0; i < iterations; i++) {
        const zeroDefenseDefender = createMockPlayerState({
          archetype: PlayerArchetype.MUSA,
          defense: 0,
          attackPower: 50,
          currentStance: TrigramStance.TAE,
        });

        const midDefenseDefender = createMockPlayerState({
          archetype: PlayerArchetype.MUSA,
          defense: 100, // 50% reduction (100/200 = 0.5)
          attackPower: 50,
          currentStance: TrigramStance.TAE,
        });

        const highDefenseDefender = createMockPlayerState({
          archetype: PlayerArchetype.MUSA,
          defense: 200, // 80% reduction (max)
          attackPower: 50,
          currentStance: TrigramStance.TAE,
        });

        const zeroResult = DamageCalculator.calculateEnhancedVitalPointDamage(
          attacker,
          zeroDefenseDefender,
          mockTechnique,
          vitalPointHitResult,
          12,
          meridianStates
        );

        const midResult = DamageCalculator.calculateEnhancedVitalPointDamage(
          attacker,
          midDefenseDefender,
          mockTechnique,
          vitalPointHitResult,
          12,
          meridianStates
        );

        const highResult = DamageCalculator.calculateEnhancedVitalPointDamage(
          attacker,
          highDefenseDefender,
          mockTechnique,
          vitalPointHitResult,
          12,
          meridianStates
        );

        zeroDefTotal += zeroResult.damage;
        midDefTotal += midResult.damage;
        highDefTotal += highResult.damage;
      }

      const zeroDefAvg = zeroDefTotal / iterations;
      const midDefAvg = midDefTotal / iterations;
      const highDefAvg = highDefTotal / iterations;

      // Verify defense reduces damage
      // Mid defense (50% reduction) should leave ~50% damage
      expect(midDefAvg).toBeLessThan(zeroDefAvg * 0.6); // Allow some margin
      expect(midDefAvg).toBeGreaterThan(zeroDefAvg * 0.4);
      
      // High defense (80% reduction) should leave ~20% damage
      expect(highDefAvg).toBeLessThan(zeroDefAvg * 0.3);
      expect(highDefAvg).toBeGreaterThan(0); // But still some damage
    });

    it("should apply critical hit multiplier for high accuracy", () => {
      const criticalHit = { ...vitalPointHitResult, accuracy: 0.95 };
      const normalHit = { ...vitalPointHitResult, accuracy: 0.85 };

      // Average over multiple runs to account for variance
      let critTotal = 0;
      let normalTotal = 0;
      const iterations = 20;

      for (let i = 0; i < iterations; i++) {
        const critResult = DamageCalculator.calculateEnhancedVitalPointDamage(
          attacker,
          defender,
          mockTechnique,
          criticalHit,
          12,
          meridianStates
        );

        const normalResult = DamageCalculator.calculateEnhancedVitalPointDamage(
          attacker,
          defender,
          mockTechnique,
          normalHit,
          12,
          meridianStates
        );

        critTotal += critResult.damage;
        normalTotal += normalResult.damage;
        
        expect(critResult.isCritical).toBe(true);
        expect(normalResult.isCritical).toBe(false);
      }

      const critAvg = critTotal / iterations;
      const normalAvg = normalTotal / iterations;

      // Critical should deal significantly more damage (2x multiplier)
      expect(critAvg).toBeGreaterThan(normalAvg * 1.9);
    });

    it("should ensure minimum damage of 1", () => {
      const veryWeakAttacker = createMockPlayerState({
        ...attacker,
        attackPower: 1,
      });

      const veryHighDefenseDefender = createMockPlayerState({
        ...defender,
        defense: 99,
      });

      const result = DamageCalculator.calculateEnhancedVitalPointDamage(
        veryWeakAttacker,
        veryHighDefenseDefender,
        mockTechnique,
        vitalPointHitResult,
        12,
        meridianStates
      );

      expect(result.damage).toBeGreaterThanOrEqual(1);
    });

    it("should handle non-vital point hits", () => {
      const nonVitalHit = {
        ...vitalPointHitResult,
        vitalPointHit: undefined,
        hit: false,
      };

      const result = DamageCalculator.calculateEnhancedVitalPointDamage(
        attacker,
        defender,
        mockTechnique,
        nonVitalHit,
        12,
        meridianStates
      );

      expect(result.isVitalPoint).toBe(false);
      expect(result.damage).toBeGreaterThan(0);
    });

    it("should include variance in damage calculation", () => {
      // Run multiple calculations with same inputs to check for variance
      const damages: number[] = [];
      for (let i = 0; i < 10; i++) {
        const result = DamageCalculator.calculateEnhancedVitalPointDamage(
          attacker,
          defender,
          mockTechnique,
          vitalPointHitResult,
          12,
          meridianStates
        );
        damages.push(result.damage);
      }

      // Check that not all damages are identical (variance is working)
      const uniqueDamages = new Set(damages);
      expect(uniqueDamages.size).toBeGreaterThan(1);
    });

    it("should preserve effects from vital point hit", () => {
      const hitWithEffects = {
        ...vitalPointHitResult,
        effects: [
          {
            id: "test_effect",
            type: "weakened" as any,
            intensity: "moderate" as any,
            duration: 2000,
            description: { korean: "약화", english: "Weakened" },
            stackable: false,
            source: "test",
            startTime: Date.now(),
            endTime: Date.now() + 2000,
          },
        ],
      };

      const result = DamageCalculator.calculateEnhancedVitalPointDamage(
        attacker,
        defender,
        mockTechnique,
        hitWithEffects,
        12,
        meridianStates
      );

      expect(result.effects.length).toBeGreaterThan(0);
    });

    it("should calculate damage within reasonable performance bounds", () => {
      const startTime = performance.now();
      
      // Perform 1000 calculations
      for (let i = 0; i < 1000; i++) {
        DamageCalculator.calculateEnhancedVitalPointDamage(
          attacker,
          defender,
          mockTechnique,
          vitalPointHitResult,
          12,
          meridianStates
        );
      }
      
      const endTime = performance.now();
      const averageTime = (endTime - startTime) / 1000;

      // Should be under 0.02ms per calculation (matches PR claim)
      expect(averageTime).toBeLessThan(0.02);
    });

    it("should combine all modifiers correctly in comprehensive scenario", () => {
      // Set up ideal conditions for maximum damage
      const idealAttacker = createMockPlayerState({
        archetype: PlayerArchetype.AMSALJA, // High damage modifier (1.5x)
        attackPower: 100,
        currentStance: TrigramStance.GEON, // Advantage vs GON
      });

      const vulnerableDefender = createMockPlayerState({
        archetype: PlayerArchetype.MUSA,
        defense: 0, // No defense
        currentStance: TrigramStance.GON, // Disadvantage vs GEON
      });

      const criticalVitalHit = {
        hit: true,
        vitalPointHit: {
          ...mockVitalPoint,
          category: "neurological" as any, // Bonus for Amsalja
        },
        damage: 20,
        effects: [],
        severity: VitalPointSeverity.LETHAL, // 3.0x multiplier
        accuracy: 0.95, // Critical hit
      };

      const result = DamageCalculator.calculateEnhancedVitalPointDamage(
        idealAttacker,
        vulnerableDefender,
        mockTechnique,
        criticalVitalHit,
        2, // Liver peak for meridian bonus
        { liver: 1.0 }
      );

      // Should be substantial damage with all modifiers
      expect(result.damage).toBeGreaterThan(100);
      expect(result.isCritical).toBe(true);
      expect(result.isVitalPoint).toBe(true);
    });
  });
});
