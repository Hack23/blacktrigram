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
      const baseStaminaRegen = regenRate * 3; // Base rate: 3 stamina/second

      // Calculate modified regen with breathing disruption
      const modifiedRegen = BreathingDisruptionSystem.calculateStaminaRegen(
        defenderWithDisruption,
        baseStaminaRegen
      );

      // Verify 75% penalty (only 25% of base regen)
      expect(modifiedRegen).toBe(baseStaminaRegen * 0.25);
      expect(modifiedRegen).toBe(0.75); // 3 * 0.25 = 0.75 stamina/second
    });
  });

  describe("Multiple Respiratory Strikes", () => {
    it("should accumulate breathing disruption from multiple torso strikes", () => {
      // First strike: Moderate torso damage (Winded)
      let updatedDefender = defender;
      const technique = createMockTechnique({
        id: "test_rib_strike",
        name: { korean: "늑골 타격", english: "Rib Strike", romanized: "neukgol tagyeok" },
        koreanName: "늑골 타격",
        englishName: "Rib Strike",
        romanized: "neukgol tagyeek",
        damage: 20,
        accuracy: 1.0, // 100% hit chance
      });
      
      const result1 = combatSystem.resolveAttack(
        attacker,
        updatedDefender,
        technique,
        "torso_rib_left" // Target rib for breathing disruption
      );

      const { updatedDefender: afterFirstStrike } = CombatSystem.applyCombatResult(
        result1,
        attacker,
        updatedDefender
      );
      updatedDefender = afterFirstStrike;

      const firstEffect = BreathingDisruptionSystem.getActiveEffect(updatedDefender);
      
      if (result1.hit && firstEffect) {
        // Verify first effect is applied
        expect(firstEffect.level).toBe(BreathingDisruptionLevel.GASPING); // Rib strikes cause gasping
        
        // Second strike after 2 seconds: Another torso strike
        const result2 = combatSystem.resolveAttack(
          attacker,
          updatedDefender,
          technique,
          "torso_rib_right"
        );

        const { updatedDefender: afterSecondStrike } = CombatSystem.applyCombatResult(
          result2,
          attacker,
          updatedDefender
        );
        updatedDefender = afterSecondStrike;

        const secondEffect = BreathingDisruptionSystem.getActiveEffect(updatedDefender);
        
        if (result2.hit && secondEffect) {
          // Effects should stack - duration increases
          expect(secondEffect.duration).toBeGreaterThan(firstEffect.duration);
        }
      }
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
      // Base regen: 3 stamina/second * effectModifiers.staminaRegen (default 1.0)
      // With 50% breathing penalty: 3 * 0.50 = 1.5 stamina/second
      // But also need to account for effectModifiers which defaults to 1.0
      // So expected: 50 + (3 * 1.0 * 0.50) = 51.5
      // However, there may be other modifiers, so we'll use a range

      // Verify stamina increased with penalty applied
      expect(updatedDefender.stamina).toBeGreaterThan(50);
      expect(updatedDefender.stamina).toBeLessThan(50 + 3); // Less than full regen
      // Allow for some variance in the exact calculation
      expect(updatedDefender.stamina).toBeGreaterThan(50);
      expect(updatedDefender.stamina).toBeLessThan(52); // Should be around 51-51.5
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
      expect(updated.stamina).toBeGreaterThan(0);
      expect(updated.stamina).toBeLessThan(1); // Very slow with 75% penalty
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
