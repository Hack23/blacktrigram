/**
 * Unit tests for Breathing Disruption System.
 * 
 * Tests all aspects of respiratory targeting mechanics including:
 * - Effect creation and severity levels
 * - Stamina regeneration penalties
 * - Cumulative effect stacking
 * - Recovery mechanics
 * - Integration with player state
 * 
 * Target coverage: 85%+
 */

import { beforeEach, describe, expect, it } from "vitest";
import {
  BreathingDisruptionSystem,
  BreathingDisruptionLevel,
} from "./BreathingDisruptionSystem";
import { createMockPlayerState } from "../../test/test-utils";
import { VitalPointEffectType } from "../../types";
import { EffectIntensity } from "../effects";

describe("BreathingDisruptionSystem", () => {
  let mockPlayer: ReturnType<typeof createMockPlayerState>;
  let timestamp: number;

  beforeEach(() => {
    mockPlayer = createMockPlayerState();
    timestamp = Date.now();
  });

  describe("Effect Creation", () => {
    it("should create Winded effect with correct properties", () => {
      const effect = BreathingDisruptionSystem.createEffect(
        BreathingDisruptionLevel.WINDED,
        "Rib Strike",
        timestamp
      );

      expect(effect).toBeDefined();
      expect(effect.type).toBe(VitalPointEffectType.BREATHLESSNESS);
      expect(effect.level).toBe(BreathingDisruptionLevel.WINDED);
      expect(effect.staminaRegenMultiplier).toBe(0.75); // 25% penalty
      expect(effect.duration).toBe(5000); // 5 seconds
      expect(effect.intensity).toBe(EffectIntensity.LOW);
      expect(effect.stackable).toBe(true);
      expect(effect.source).toBe("Rib Strike");
      expect(effect.startTime).toBe(timestamp);
      expect(effect.endTime).toBe(timestamp + 5000);
    });

    it("should create Gasping effect with correct properties", () => {
      const effect = BreathingDisruptionSystem.createEffect(
        BreathingDisruptionLevel.GASPING,
        "Torso Strike",
        timestamp
      );

      expect(effect.level).toBe(BreathingDisruptionLevel.GASPING);
      expect(effect.staminaRegenMultiplier).toBe(0.50); // 50% penalty
      expect(effect.duration).toBe(10000); // 10 seconds
      expect(effect.intensity).toBe(EffectIntensity.MEDIUM);
    });

    it("should create Severely Winded effect with correct properties", () => {
      const effect = BreathingDisruptionSystem.createEffect(
        BreathingDisruptionLevel.SEVERELY_WINDED,
        "Solar Plexus Strike",
        timestamp
      );

      expect(effect.level).toBe(BreathingDisruptionLevel.SEVERELY_WINDED);
      expect(effect.staminaRegenMultiplier).toBe(0.25); // 75% penalty
      expect(effect.duration).toBe(15000); // 15 seconds
      expect(effect.intensity).toBe(EffectIntensity.HIGH);
    });

    it("should include Korean-English bilingual descriptions", () => {
      const effect = BreathingDisruptionSystem.createEffect(
        BreathingDisruptionLevel.WINDED,
        "Test Strike",
        timestamp
      );

      expect(effect.description.korean).toBeDefined();
      expect(effect.description.english).toBeDefined();
      expect(effect.description.romanized).toBeDefined();
    });

    it("should generate unique effect IDs based on timestamp", () => {
      const effect1 = BreathingDisruptionSystem.createEffect(
        BreathingDisruptionLevel.WINDED,
        "Strike 1",
        timestamp
      );

      const effect2 = BreathingDisruptionSystem.createEffect(
        BreathingDisruptionLevel.WINDED,
        "Strike 2",
        timestamp + 100
      );

      expect(effect1.id).not.toBe(effect2.id);
    });
  });

  describe("calculateLevelFromDamage", () => {
    it("should return NONE for low damage (<10)", () => {
      const level = BreathingDisruptionSystem.calculateLevelFromDamage(5, false);
      expect(level).toBe(BreathingDisruptionLevel.NONE);
    });

    it("should return WINDED for moderate damage (10-19)", () => {
      const level1 = BreathingDisruptionSystem.calculateLevelFromDamage(10, false);
      expect(level1).toBe(BreathingDisruptionLevel.WINDED);

      const level2 = BreathingDisruptionSystem.calculateLevelFromDamage(15, false);
      expect(level2).toBe(BreathingDisruptionLevel.WINDED);
    });

    it("should return GASPING for high damage (20+)", () => {
      const level1 = BreathingDisruptionSystem.calculateLevelFromDamage(20, false);
      expect(level1).toBe(BreathingDisruptionLevel.GASPING);

      const level2 = BreathingDisruptionSystem.calculateLevelFromDamage(25, false);
      expect(level2).toBe(BreathingDisruptionLevel.GASPING);
    });

    it("should always return SEVERELY_WINDED for solar plexus strikes", () => {
      // Low damage but solar plexus still causes severe disruption
      const level1 = BreathingDisruptionSystem.calculateLevelFromDamage(5, true);
      expect(level1).toBe(BreathingDisruptionLevel.SEVERELY_WINDED);

      // High damage solar plexus
      const level2 = BreathingDisruptionSystem.calculateLevelFromDamage(30, true);
      expect(level2).toBe(BreathingDisruptionLevel.SEVERELY_WINDED);
    });
  });

  describe("Effect Stacking", () => {
    it("should stack duration when same level effects occur", () => {
      const initialEffect = BreathingDisruptionSystem.createEffect(
        BreathingDisruptionLevel.WINDED,
        "First Strike",
        timestamp
      );

      const stackedEffect = BreathingDisruptionSystem.stackEffect(
        initialEffect,
        BreathingDisruptionLevel.WINDED,
        "Second Strike",
        timestamp + 2000 // 2 seconds later
      );

      // Remaining time: 3000ms (5000 - 2000)
      // Additional time: 2500ms (50% of 5000)
      // Total: ~5500ms
      expect(stackedEffect.duration).toBeGreaterThan(5000);
      expect(stackedEffect.source).toContain("First Strike");
      expect(stackedEffect.source).toContain("Second Strike");
    });

    it("should escalate to higher severity level when stacking", () => {
      const initialEffect = BreathingDisruptionSystem.createEffect(
        BreathingDisruptionLevel.WINDED,
        "First Strike",
        timestamp
      );

      const stackedEffect = BreathingDisruptionSystem.stackEffect(
        initialEffect,
        BreathingDisruptionLevel.GASPING,
        "Heavy Strike",
        timestamp + 2000
      );

      // Should escalate to Gasping level
      expect(stackedEffect.level).toBe(BreathingDisruptionLevel.GASPING);
      expect(stackedEffect.staminaRegenMultiplier).toBe(0.50); // Gasping penalty
      expect(stackedEffect.intensity).toBe(EffectIntensity.MEDIUM);
    });

    it("should maintain higher severity when lower level stacks on higher", () => {
      const initialEffect = BreathingDisruptionSystem.createEffect(
        BreathingDisruptionLevel.SEVERELY_WINDED,
        "Solar Plexus",
        timestamp
      );

      const stackedEffect = BreathingDisruptionSystem.stackEffect(
        initialEffect,
        BreathingDisruptionLevel.WINDED,
        "Rib Strike",
        timestamp + 2000
      );

      // Should maintain Severely Winded level
      expect(stackedEffect.level).toBe(BreathingDisruptionLevel.SEVERELY_WINDED);
      expect(stackedEffect.staminaRegenMultiplier).toBe(0.25); // Severe penalty
    });
  });

  describe("Player State Integration", () => {
    it("should detect active breathing disruption effect", () => {
      const effect = BreathingDisruptionSystem.createEffect(
        BreathingDisruptionLevel.WINDED,
        "Test Strike",
        timestamp
      );

      const playerWithEffect = {
        ...mockPlayer,
        statusEffects: [effect],
      };

      const activeEffect = BreathingDisruptionSystem.getActiveEffect(playerWithEffect);
      expect(activeEffect).toBeDefined();
      expect(activeEffect?.level).toBe(BreathingDisruptionLevel.WINDED);
    });

    it("should return undefined when no breathing disruption is active", () => {
      const activeEffect = BreathingDisruptionSystem.getActiveEffect(mockPlayer);
      expect(activeEffect).toBeUndefined();
    });

    it("should get current disruption level", () => {
      const effect = BreathingDisruptionSystem.createEffect(
        BreathingDisruptionLevel.GASPING,
        "Test Strike",
        timestamp
      );

      const playerWithEffect = {
        ...mockPlayer,
        statusEffects: [effect],
      };

      const level = BreathingDisruptionSystem.getCurrentLevel(playerWithEffect);
      expect(level).toBe(BreathingDisruptionLevel.GASPING);
    });

    it("should return NONE level when no effect is active", () => {
      const level = BreathingDisruptionSystem.getCurrentLevel(mockPlayer);
      expect(level).toBe(BreathingDisruptionLevel.NONE);
    });

    it("should check if breathing disruption is active", () => {
      const effect = BreathingDisruptionSystem.createEffect(
        BreathingDisruptionLevel.WINDED,
        "Test Strike",
        timestamp
      );

      const playerWithEffect = {
        ...mockPlayer,
        statusEffects: [effect],
      };

      expect(BreathingDisruptionSystem.isActive(playerWithEffect)).toBe(true);
      expect(BreathingDisruptionSystem.isActive(mockPlayer)).toBe(false);
    });
  });

  describe("Stamina Regeneration Calculation", () => {
    it("should return base regen rate when no breathing disruption", () => {
      const baseRegen = 10;
      const modifiedRegen = BreathingDisruptionSystem.calculateStaminaRegen(
        mockPlayer,
        baseRegen
      );

      expect(modifiedRegen).toBe(baseRegen);
    });

    it("should apply 25% penalty for Winded effect", () => {
      const effect = BreathingDisruptionSystem.createEffect(
        BreathingDisruptionLevel.WINDED,
        "Rib Strike",
        timestamp
      );

      const playerWithEffect = {
        ...mockPlayer,
        statusEffects: [effect],
      };

      const baseRegen = 10;
      const modifiedRegen = BreathingDisruptionSystem.calculateStaminaRegen(
        playerWithEffect,
        baseRegen
      );

      expect(modifiedRegen).toBe(7.5); // 75% of base rate
    });

    it("should apply 50% penalty for Gasping effect", () => {
      const effect = BreathingDisruptionSystem.createEffect(
        BreathingDisruptionLevel.GASPING,
        "Torso Strike",
        timestamp
      );

      const playerWithEffect = {
        ...mockPlayer,
        statusEffects: [effect],
      };

      const baseRegen = 10;
      const modifiedRegen = BreathingDisruptionSystem.calculateStaminaRegen(
        playerWithEffect,
        baseRegen
      );

      expect(modifiedRegen).toBe(5); // 50% of base rate
    });

    it("should apply 75% penalty for Severely Winded effect", () => {
      const effect = BreathingDisruptionSystem.createEffect(
        BreathingDisruptionLevel.SEVERELY_WINDED,
        "Solar Plexus",
        timestamp
      );

      const playerWithEffect = {
        ...mockPlayer,
        statusEffects: [effect],
      };

      const baseRegen = 10;
      const modifiedRegen = BreathingDisruptionSystem.calculateStaminaRegen(
        playerWithEffect,
        baseRegen
      );

      expect(modifiedRegen).toBe(2.5); // 25% of base rate
    });
  });

  describe("Recovery Mechanics", () => {
    it("should allow recovery when torso health > 50%", () => {
      const playerWithHealthyTorso = {
        ...mockPlayer,
        health: 80,
        maxHealth: 100,
        bodyPartHealth: { 
          head: 100, 
          neck: 100,
          torsoUpper: 60, 
          torsoLower: 60,
          armLeft: 100, 
          armRight: 100, 
          legLeft: 100, 
          legRight: 100 
        },
        bodyPartMaxHealth: { 
          head: 100, 
          neck: 100,
          torsoUpper: 100, 
          torsoLower: 100,
          armLeft: 100, 
          armRight: 100, 
          legLeft: 100, 
          legRight: 100 
        },
      };

      const canRecover = BreathingDisruptionSystem.canRecover(playerWithHealthyTorso);
      expect(canRecover).toBe(true);
    });

    it("should not allow recovery when torso health ≤ 50%", () => {
      const playerWithDamagedTorso = {
        ...mockPlayer,
        health: 60,
        maxHealth: 100,
        bodyPartHealth: { 
          head: 100, 
          neck: 100,
          torsoUpper: 40, 
          torsoLower: 40,
          armLeft: 100, 
          armRight: 100, 
          legLeft: 100, 
          legRight: 100 
        },
        bodyPartMaxHealth: { 
          head: 100, 
          neck: 100,
          torsoUpper: 100, 
          torsoLower: 100,
          armLeft: 100, 
          armRight: 100, 
          legLeft: 100, 
          legRight: 100 
        },
      };

      const canRecover = BreathingDisruptionSystem.canRecover(playerWithDamagedTorso);
      expect(canRecover).toBe(false);
    });

    it("should use overall health as fallback when body part tracking unavailable", () => {
      const playerWithOverallHealth = {
        ...mockPlayer,
        health: 60,
        maxHealth: 100,
        bodyPartHealth: undefined,
      };

      const canRecover = BreathingDisruptionSystem.canRecover(playerWithOverallHealth);
      expect(canRecover).toBe(true); // 60 > 50
    });

    it("should apply gradual recovery to breathing effect", () => {
      const effect = BreathingDisruptionSystem.createEffect(
        BreathingDisruptionLevel.WINDED,
        "Rib Strike",
        timestamp
      );

      // Simulate 1 second passing (60 frames @ 16.67ms each)
      const deltaTime = 16.67; // One frame
      const newTimestamp = timestamp + deltaTime;

      const recovered = BreathingDisruptionSystem.applyGradualRecovery(
        effect,
        deltaTime,
        newTimestamp
      );

      // Recovery is 2x faster, so should reduce duration more than normal
      expect(recovered).toBeDefined();
      if (recovered) {
        expect(recovered.endTime).toBeLessThan(effect.endTime);
      }
    });

    it("should return undefined when recovery is complete", () => {
      const effect = BreathingDisruptionSystem.createEffect(
        BreathingDisruptionLevel.WINDED,
        "Rib Strike",
        timestamp
      );

      // Simulate enough time passing for recovery to complete
      const deltaTime = 3000; // 3 seconds of recovery (6 seconds effective with 2x multiplier)
      const newTimestamp = timestamp + 6000; // Well past end time

      const recovered = BreathingDisruptionSystem.applyGradualRecovery(
        effect,
        deltaTime,
        newTimestamp
      );

      expect(recovered).toBeUndefined();
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero damage gracefully", () => {
      const level = BreathingDisruptionSystem.calculateLevelFromDamage(0, false);
      expect(level).toBe(BreathingDisruptionLevel.NONE);
    });

    it("should handle negative damage gracefully", () => {
      const level = BreathingDisruptionSystem.calculateLevelFromDamage(-5, false);
      expect(level).toBe(BreathingDisruptionLevel.NONE);
    });

    it("should handle very high damage values", () => {
      const level = BreathingDisruptionSystem.calculateLevelFromDamage(1000, false);
      expect(level).toBe(BreathingDisruptionLevel.GASPING); // Caps at Gasping unless solar plexus
    });

    it("should handle stacking with zero remaining duration", () => {
      const initialEffect = BreathingDisruptionSystem.createEffect(
        BreathingDisruptionLevel.WINDED,
        "First Strike",
        timestamp
      );

      // Stack after effect has expired
      const stackedEffect = BreathingDisruptionSystem.stackEffect(
        initialEffect,
        BreathingDisruptionLevel.WINDED,
        "Second Strike",
        timestamp + 10000 // Well past expiration
      );

      // Should still create valid effect with new duration
      expect(stackedEffect.duration).toBeGreaterThan(0);
    });

    it("should handle missing body part health data", () => {
      const playerWithoutBodyParts = {
        ...mockPlayer,
        bodyPartHealth: undefined,
        bodyPartMaxHealth: undefined,
      };

      const canRecover = BreathingDisruptionSystem.canRecover(playerWithoutBodyParts);
      expect(canRecover).toBeDefined();
      expect(typeof canRecover).toBe("boolean");
    });
  });

  describe("Performance", () => {
    it("should create effect efficiently (<1ms for single creation)", () => {
      const iterations = 1000;
      const startTime = performance.now();

      for (let i = 0; i < iterations; i++) {
        BreathingDisruptionSystem.createEffect(
          BreathingDisruptionLevel.WINDED,
          "Test Strike",
          timestamp + i
        );
      }

      const endTime = performance.now();
      const avgTime = (endTime - startTime) / iterations;

      expect(avgTime).toBeLessThan(1); // Average < 1ms per creation
    });

    it("should calculate stamina regen efficiently", () => {
      const effect = BreathingDisruptionSystem.createEffect(
        BreathingDisruptionLevel.WINDED,
        "Test Strike",
        timestamp
      );

      const playerWithEffect = {
        ...mockPlayer,
        statusEffects: [effect],
      };

      const iterations = 10000;
      const startTime = performance.now();

      for (let i = 0; i < iterations; i++) {
        BreathingDisruptionSystem.calculateStaminaRegen(playerWithEffect, 10);
      }

      const endTime = performance.now();
      const avgTime = (endTime - startTime) / iterations;

      expect(avgTime).toBeLessThan(0.1); // Average < 0.1ms per calculation (60fps compatible)
    });
  });

  describe("Korean Martial Arts Authenticity", () => {
    it("should use authentic Korean terminology", () => {
      const effect = BreathingDisruptionSystem.createEffect(
        BreathingDisruptionLevel.SEVERELY_WINDED,
        "명치 타격",
        timestamp
      );

      expect(effect.description.korean).toContain("명치"); // Solar plexus (myeongchi)
      expect(effect.description.korean).toContain("호흡곤란"); // Breathing difficulty
    });

    it("should provide romanization for pronunciation", () => {
      const windedEffect = BreathingDisruptionSystem.createEffect(
        BreathingDisruptionLevel.WINDED,
        "Test",
        timestamp
      );

      const gaspingEffect = BreathingDisruptionSystem.createEffect(
        BreathingDisruptionLevel.GASPING,
        "Test",
        timestamp
      );

      const severeEffect = BreathingDisruptionSystem.createEffect(
        BreathingDisruptionLevel.SEVERELY_WINDED,
        "Test",
        timestamp
      );

      expect(windedEffect.description.romanized).toBeDefined();
      expect(gaspingEffect.description.romanized).toBeDefined();
      expect(severeEffect.description.romanized).toBeDefined();
    });
  });
});
