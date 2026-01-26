/**
 * Comprehensive Integration Tests for Breathing Disruption System with CombatSystem.
 * 
 * **Korean**: 호흡곤란 시스템 통합 테스트
 * 
 * Tests the complete flow from torso strikes to stamina regeneration penalties:
 * - Vital point strikes trigger breathing disruption
 * - General torso damage applies appropriate disruption levels
 * - Stamina regeneration is reduced based on disruption severity
 * - Multiple respiratory strikes accumulate effects
 * - Recovery mechanics work correctly with torso health
 * - Performance meets <1ms per calculation requirement
 * 
 * Target Coverage: 95%+
 */

import { beforeEach, describe, expect, it } from "vitest";
import { CombatSystem } from "../CombatSystem";
import { BreathingDisruptionSystem, BreathingDisruptionLevel } from "../breathing/BreathingDisruptionSystem";
import { applyBreathingDisruptionFromVitalPoint } from "../breathing/integration";
import { createMockPlayerState } from "../../test/test-utils";
import { PlayerArchetype, TrigramStance, VitalPointCategory, VitalPointSeverity } from "../../types";
import { BASE_STAMINA_REGEN_RATE } from "../../types/physicsConstants";
import type { KoreanTechnique } from "../vitalpoint/types";
import { AnimationType } from "../animation";

describe("Breathing Disruption System Integration with CombatSystem", () => {
  let combatSystem: CombatSystem;
  let attacker: ReturnType<typeof createMockPlayerState>;
  let defender: ReturnType<typeof createMockPlayerState>;

  // Helper to create a properly typed mock technique
  const createMockTechnique = (overrides: Partial<KoreanTechnique> = {}): KoreanTechnique => {
    const defaults: KoreanTechnique = {
      id: "test_technique",
      name: { korean: "테스트", english: "Test", romanized: "teseuteu" },
      koreanName: "테스트",
      englishName: "Test",
      romanized: "teseuteu",
      description: { korean: "테스트 기술", english: "Test technique" },
      stance: TrigramStance.GEON,
      type: "strike",
      damageType: "strike",
      damage: 20,
      kiCost: 5,
      staminaCost: 10,
      accuracy: 0.9,
      reachConfig: {
        bodyPart: "arm",
        techniqueType: "punch",
        baseExtension: 0.9,
      },
      executionTime: 500,
      recoveryTime: 300,
      critChance: 0.1,
      critMultiplier: 1.5,
      effects: [],
      animationType: AnimationType.JAB,
    };
    return { ...defaults, ...overrides };
  };

  beforeEach(() => {
    combatSystem = new CombatSystem();
    
    // Create players with healthy torsos
    attacker = createMockPlayerState({
      id: "player1",
      archetype: PlayerArchetype.MUSA,
      currentStance: TrigramStance.GEON,
    });
    
    defender = createMockPlayerState({
      id: "player2", 
      archetype: PlayerArchetype.AMSALJA,
      currentStance: TrigramStance.GAM,
      bodyPartHealth: {
        head: 100,
        neck: 100,
        torsoUpper: 100,
        torsoLower: 100,
        armLeft: 100,
        armRight: 100,
        legLeft: 100,
        legRight: 100,
      },
      bodyPartMaxHealth: {
        head: 100,
        neck: 100,
        torsoUpper: 100,
        torsoLower: 100,
        armLeft: 100,
        armRight: 100,
        legLeft: 100,
        legRight: 100,
      },
    });
  });

  describe("Solar Plexus Strike Flow", () => {
    it("should trigger severe breathing disruption on solar plexus vital point hit", () => {
      // Create a mock vital point for solar plexus
      const solarPlexusVitalPoint = {
        id: "torso_solar_plexus",
        names: {
          korean: "명치",
          english: "Solar Plexus",
          romanized: "myeongchi",
        },
        position: { x: 102, y: 140 },
        category: VitalPointCategory.NEUROLOGICAL,
        severity: VitalPointSeverity.CRITICAL,
        baseDamage: 40,
        effects: [],
        description: {
          korean: "신경총 타격, 호흡 곤란",
          english: "Nerve plexus strike, breathing difficulty",
        },
        targetingDifficulty: 0.6,
        effectiveStances: [TrigramStance.JIN, TrigramStance.GEON],
      };

      // Directly apply breathing disruption from vital point
      const timestamp = Date.now();
      const updatedDefender = applyBreathingDisruptionFromVitalPoint(
        defender,
        solarPlexusVitalPoint,
        timestamp
      );

      // Verify breathing disruption was applied
      const breathingEffect = BreathingDisruptionSystem.getActiveEffect(updatedDefender);
      expect(breathingEffect).toBeDefined();
      expect(breathingEffect?.level).toBe(BreathingDisruptionLevel.SEVERELY_WINDED);
      expect(breathingEffect?.staminaRegenMultiplier).toBe(0.25); // 75% penalty
      expect(breathingEffect?.duration).toBe(15000); // 15 seconds
    });

    it("should reduce stamina regeneration by 75% with severe breathing disruption", () => {
      // Apply severe breathing disruption manually
      const timestamp = Date.now();
      const severeEffect = BreathingDisruptionSystem.createEffect(
        BreathingDisruptionLevel.SEVERELY_WINDED,
        "Solar Plexus Strike",
        timestamp
      );

      const defenderWithDisruption = {
        ...defender,
        stamina: 50, // Low stamina to test regen
        statusEffects: [severeEffect],
      };

      // Base stamina regen rate (from CombatSystem.updatePlayerState)
      const deltaTime = 1000; // 1 second
      const regenRate = deltaTime / 1000; // Convert to seconds
      const baseStaminaRegen = regenRate * BASE_STAMINA_REGEN_RATE;

      // Calculate modified regen with breathing disruption
      const modifiedRegen = BreathingDisruptionSystem.calculateStaminaRegen(
        defenderWithDisruption,
        baseStaminaRegen
      );

      // Verify 75% penalty (only 25% of base regen)
      expect(modifiedRegen).toBe(baseStaminaRegen * 0.25);
      expect(modifiedRegen).toBe(3.75); // BASE_STAMINA_REGEN_RATE * 0.25 = 3.75 stamina/second
    });
  });

  describe("Multiple Respiratory Strikes", () => {
    it("should accumulate breathing disruption from multiple torso strikes", () => {
      // Test accumulation by directly applying disruption effects
      const timestamp = Date.now();
      
      // First strike: Apply Winded effect
      const firstEffect = BreathingDisruptionSystem.createEffect(
        BreathingDisruptionLevel.WINDED,
        "First Rib Strike",
        timestamp
      );
      
      // Verify first effect is applied
      expect(firstEffect.level).toBe(BreathingDisruptionLevel.WINDED);
      expect(firstEffect.staminaRegenMultiplier).toBe(0.75); // 25% penalty
      const firstDuration = firstEffect.duration;
      
      // Second strike: Stack with another Winded effect (simulating second rib strike)
      const secondEffect = BreathingDisruptionSystem.stackEffect(
        firstEffect,
        BreathingDisruptionLevel.WINDED,
        "Second Rib Strike",
        timestamp + 2000 // 2 seconds later
      );
      
      // Verify effects accumulate - duration should increase
      expect(secondEffect.duration).toBeGreaterThan(firstDuration);
      expect(secondEffect.level).toBe(BreathingDisruptionLevel.WINDED); // Still winded but longer
      
      // Third strike: Stack again, should escalate to Gasping
      const thirdEffect = BreathingDisruptionSystem.stackEffect(
        secondEffect,
        BreathingDisruptionLevel.GASPING,
        "Third Rib Strike",
        timestamp + 4000 // 4 seconds later
      );
      
      // Verify escalation to higher severity
      expect(thirdEffect.level).toBe(BreathingDisruptionLevel.GASPING);
      expect(thirdEffect.staminaRegenMultiplier).toBe(0.5); // 50% penalty
      expect(thirdEffect.duration).toBeGreaterThan(secondEffect.duration);
    });

    it("should escalate severity when stronger strike follows weaker one", () => {
      const timestamp = Date.now();

      // Start with Winded effect
      const windedEffect = BreathingDisruptionSystem.createEffect(
        BreathingDisruptionLevel.WINDED,
        "Rib Strike",
        timestamp
      );

      const defenderWithEffect = {
        ...defender,
        statusEffects: [windedEffect],
      };

      // Stack with Severely Winded (solar plexus)
      const stackedEffect = BreathingDisruptionSystem.stackEffect(
        windedEffect,
        BreathingDisruptionLevel.SEVERELY_WINDED,
        "Solar Plexus",
        timestamp + 2000
      );

      // Verify escalation to higher severity
      expect(stackedEffect.level).toBe(BreathingDisruptionLevel.SEVERELY_WINDED);
      expect(stackedEffect.staminaRegenMultiplier).toBe(0.25); // Severe penalty
      
      // Verify defenderWithEffect would have the winded effect
      expect(defenderWithEffect.statusEffects).toHaveLength(1);
      expect(defenderWithEffect.statusEffects[0]).toBe(windedEffect);
    });
  });

  describe("Recovery Mechanics", () => {
    it("should allow recovery when torso health > 50%", () => {
      const timestamp = Date.now();
      
      // Apply breathing disruption
      const effect = BreathingDisruptionSystem.createEffect(
        BreathingDisruptionLevel.GASPING,
        "Torso Strike",
        timestamp
      );

      const defenderWithHealthyTorso = {
        ...defender,
        health: 80,
        bodyPartHealth: {
          head: 100,
          neck: 100,
          torsoUpper: 70, // > 50%
          torsoLower: 70, // > 50%
          armLeft: 100,
          armRight: 100,
          legLeft: 100,
          legRight: 100,
        },
        bodyPartMaxHealth: {
          head: 100,
          neck: 100,
          torsoUpper: 100,
          torsoLower: 100,
          armLeft: 100,
          armRight: 100,
          legLeft: 100,
          legRight: 100,
        },
        statusEffects: [effect],
      };

      // Verify recovery is possible
      const canRecover = BreathingDisruptionSystem.canRecover(defenderWithHealthyTorso);
      expect(canRecover).toBe(true);

      // Apply gradual recovery
      const recovered = BreathingDisruptionSystem.applyGradualRecovery(
        effect,
        1000, // 1 second
        timestamp + 1000
      );

      // Recovery should reduce duration faster than normal expiration
      expect(recovered).toBeDefined();
      if (recovered) {
        expect(recovered.endTime).toBeLessThan(effect.endTime);
      }
    });

    it("should not allow recovery when torso health ≤ 50%", () => {
      const defenderWithDamagedTorso = {
        ...defender,
        health: 50,
        bodyPartHealth: {
          head: 100,
          neck: 100,
          torsoUpper: 40, // ≤ 50%
          torsoLower: 40, // ≤ 50%
          armLeft: 100,
          armRight: 100,
          legLeft: 100,
          legRight: 100,
        },
        bodyPartMaxHealth: {
          head: 100,
          neck: 100,
          torsoUpper: 100,
          torsoLower: 100,
          armLeft: 100,
          armRight: 100,
          legLeft: 100,
          legRight: 100,
        },
      };

      const canRecover = BreathingDisruptionSystem.canRecover(defenderWithDamagedTorso);
      expect(canRecover).toBe(false);
    });
  });

  describe("CombatSystem.updatePlayerState Integration", () => {
    it("should apply breathing disruption penalty during stamina regeneration", () => {
      const timestamp = Date.now();
      
      // Create defender with breathing disruption
      const effect = BreathingDisruptionSystem.createEffect(
        BreathingDisruptionLevel.GASPING, // 50% penalty
        "Torso Strike",
        timestamp
      );

      const defenderWithDisruption = {
        ...defender,
        stamina: 50,
        maxStamina: 100,
        statusEffects: [effect],
      };

      // Update player state (simulates 1 second passing)
      const updatedDefender = combatSystem.updatePlayerState(
        defenderWithDisruption,
        1000
      );

      // Calculate expected stamina gain
      // Base regen: BASE_STAMINA_REGEN_RATE stamina/second * effectModifiers.staminaRegen (default 1.0)
      // With 50% breathing penalty: BASE_STAMINA_REGEN_RATE * 0.50 = 7.5 stamina/second
      // Expected: 50 + (BASE_STAMINA_REGEN_RATE * 1.0 * 0.50) = 57.5

      // Verify stamina increased with penalty applied
      expect(updatedDefender.stamina).toBeGreaterThan(50);
      expect(updatedDefender.stamina).toBeCloseTo(57.5, 1); // Within 0.1 of expected
    });

    it("should update breathing disruption effects each frame", () => {
      const timestamp = Date.now();
      
      // Create short-duration effect
      const effect = BreathingDisruptionSystem.createEffect(
        BreathingDisruptionLevel.WINDED,
        "Test",
        timestamp
      );

      // Manually set shorter duration for testing
      const shortEffect = {
        ...effect,
        duration: 100, // 0.1 seconds
        endTime: timestamp + 100,
      };

      const defenderWithEffect = {
        ...defender,
        statusEffects: [shortEffect],
      };

      // Fast-forward past expiration
      const updatedDefender = combatSystem.updatePlayerState(
        defenderWithEffect,
        200 // 0.2 seconds
      );

      // Verify effect was removed
      const activeEffect = BreathingDisruptionSystem.getActiveEffect(updatedDefender);
      expect(activeEffect).toBeUndefined();
    });
  });

  describe("Performance Requirements", () => {
    it("should complete disruption calculation in <1ms", () => {
      const iterations = 1000;
      const timestamp = Date.now();

      const startTime = performance.now();

      for (let i = 0; i < iterations; i++) {
        const effect = BreathingDisruptionSystem.createEffect(
          BreathingDisruptionLevel.GASPING,
          "Performance Test",
          timestamp + i
        );

        const defenderWithEffect = {
          ...defender,
          statusEffects: [effect],
        };

        BreathingDisruptionSystem.calculateStaminaRegen(defenderWithEffect, 10);
      }

      const endTime = performance.now();
      const avgTime = (endTime - startTime) / iterations;

      expect(avgTime).toBeLessThan(1); // Average < 1ms per calculation
    });

    it("should handle frame updates efficiently (<0.1ms per update)", () => {
      const timestamp = Date.now();
      const effect = BreathingDisruptionSystem.createEffect(
        BreathingDisruptionLevel.GASPING,
        "Performance Test",
        timestamp
      );

      const defenderWithEffect = {
        ...defender,
        health: 80,
        bodyPartHealth: {
          head: 100,
          neck: 100,
          torsoUpper: 70,
          torsoLower: 70,
          armLeft: 100,
          armRight: 100,
          legLeft: 100,
          legRight: 100,
        },
        bodyPartMaxHealth: {
          head: 100,
          neck: 100,
          torsoUpper: 100,
          torsoLower: 100,
          armLeft: 100,
          armRight: 100,
          legLeft: 100,
          legRight: 100,
        },
        statusEffects: [effect],
      };

      const iterations = 10000; // 10,000 frame updates
      const startTime = performance.now();

      for (let i = 0; i < iterations; i++) {
        combatSystem.updatePlayerState(defenderWithEffect, 16.67); // 60fps
      }

      const endTime = performance.now();
      const avgTime = (endTime - startTime) / iterations;

      expect(avgTime).toBeLessThan(0.1); // Average < 0.1ms per frame update
    });
  });

  describe("Edge Cases", () => {
    it("should handle player without body part health tracking", () => {
      const defenderWithoutBodyParts = {
        ...defender,
        bodyPartHealth: undefined,
        bodyPartMaxHealth: undefined,
      };

      const canRecover = BreathingDisruptionSystem.canRecover(defenderWithoutBodyParts);
      expect(canRecover).toBeDefined();
      expect(typeof canRecover).toBe("boolean");
    });

    it("should handle zero stamina with breathing disruption", () => {
      const timestamp = Date.now();
      const effect = BreathingDisruptionSystem.createEffect(
        BreathingDisruptionLevel.SEVERELY_WINDED,
        "Test",
        timestamp
      );

      const defenderWithZeroStamina = {
        ...defender,
        stamina: 0,
        maxStamina: 100,
        statusEffects: [effect],
      };

      const updated = combatSystem.updatePlayerState(defenderWithZeroStamina, 1000);

      // Should still regenerate stamina, just slower
      // Base regen: BASE_STAMINA_REGEN_RATE stamina/second
      // With 75% penalty (SEVERELY_WINDED): BASE_STAMINA_REGEN_RATE * 0.25 = 3.75 stamina/second
      expect(updated.stamina).toBeGreaterThan(0);
      expect(updated.stamina).toBeCloseTo(3.75, 1); // Within 0.1 of expected
    });

    it("should not apply breathing disruption from non-torso strikes", () => {
      const technique = createMockTechnique({
        id: "test_head_strike",
        name: { korean: "머리 타격", english: "Head Strike", romanized: "meori tagyeok" },
        koreanName: "머리 타격",
        englishName: "Head Strike",
        romanized: "meori tagyeok",
        damage: 25,
        accuracy: 1.0, // 100% hit chance
      });
      
      // Target head instead of torso
      const result = combatSystem.resolveAttack(
        attacker,
        defender,
        technique,
        "head_temple"
      );

      const { updatedDefender } = CombatSystem.applyCombatResult(
        result,
        attacker,
        defender
      );

      // No breathing disruption should be applied
      const breathingEffect = BreathingDisruptionSystem.getActiveEffect(updatedDefender);
      expect(breathingEffect).toBeUndefined();
    });
  });

  describe("Korean Martial Arts Authenticity", () => {
    it("should use Korean terminology in effect descriptions", () => {
      const effect = BreathingDisruptionSystem.createEffect(
        BreathingDisruptionLevel.SEVERELY_WINDED,
        "명치 타격", // Solar plexus strike
        Date.now()
      );

      expect(effect.description.korean).toBeDefined();
      expect(effect.description.korean).toContain("호흡곤란"); // Breathing difficulty
      expect(effect.description.english).toBeDefined();
      expect(effect.description.romanized).toBeDefined();
    });

    it("should reflect realistic torso strike mechanics", () => {
      // Solar plexus should always cause severe disruption
      const solarPlexusLevel = BreathingDisruptionSystem.calculateLevelFromDamage(
        5, // Low damage
        true // But solar plexus area
      );

      expect(solarPlexusLevel).toBe(BreathingDisruptionLevel.SEVERELY_WINDED);

      // Regular torso strikes scale with damage
      const lowDamageLevel = BreathingDisruptionSystem.calculateLevelFromDamage(8, false);
      const medDamageLevel = BreathingDisruptionSystem.calculateLevelFromDamage(15, false);
      const highDamageLevel = BreathingDisruptionSystem.calculateLevelFromDamage(25, false);

      expect(lowDamageLevel).toBe(BreathingDisruptionLevel.NONE);
      expect(medDamageLevel).toBe(BreathingDisruptionLevel.WINDED);
      expect(highDamageLevel).toBe(BreathingDisruptionLevel.GASPING);
    });
  });
});
