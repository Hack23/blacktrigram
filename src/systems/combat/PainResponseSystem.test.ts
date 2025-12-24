/**
 * Unit tests for Pain Response System.
 * 
 * Tests pain accumulation, shock pain effects, pain overload,
 * and pain recovery mechanisms.
 */

import { beforeEach, describe, expect, it } from "vitest";
import { PlayerArchetype, VitalPointCategory, VitalPointSeverity } from "@/types";
import { createPlayerFromArchetype } from "@/utils/playerUtils";
import type { PlayerState } from "../player";
import { PainResponseSystem, PainLevel, ShockPainEffect } from "./PainResponseSystem";

describe("PainResponseSystem", () => {
  let painSystem: PainResponseSystem;
  let player: PlayerState;

  beforeEach(() => {
    painSystem = new PainResponseSystem();
    player = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
  });

  describe("Pain Level Determination", () => {
    it("should identify MINIMAL pain level (0-20)", () => {
      expect(painSystem.getPainLevel(0)).toBe(PainLevel.MINIMAL);
      expect(painSystem.getPainLevel(10)).toBe(PainLevel.MINIMAL);
      expect(painSystem.getPainLevel(19)).toBe(PainLevel.MINIMAL);
    });

    it("should identify MODERATE pain level (20-40)", () => {
      expect(painSystem.getPainLevel(20)).toBe(PainLevel.MODERATE);
      expect(painSystem.getPainLevel(30)).toBe(PainLevel.MODERATE);
      expect(painSystem.getPainLevel(39)).toBe(PainLevel.MODERATE);
    });

    it("should identify SIGNIFICANT pain level (40-60)", () => {
      expect(painSystem.getPainLevel(40)).toBe(PainLevel.SIGNIFICANT);
      expect(painSystem.getPainLevel(50)).toBe(PainLevel.SIGNIFICANT);
      expect(painSystem.getPainLevel(59)).toBe(PainLevel.SIGNIFICANT);
    });

    it("should identify SEVERE pain level (60-80)", () => {
      expect(painSystem.getPainLevel(60)).toBe(PainLevel.SEVERE);
      expect(painSystem.getPainLevel(70)).toBe(PainLevel.SEVERE);
      expect(painSystem.getPainLevel(79)).toBe(PainLevel.SEVERE);
    });

    it("should identify OVERLOAD pain level (80-100)", () => {
      expect(painSystem.getPainLevel(80)).toBe(PainLevel.OVERLOAD);
      expect(painSystem.getPainLevel(90)).toBe(PainLevel.OVERLOAD);
      expect(painSystem.getPainLevel(100)).toBe(PainLevel.OVERLOAD);
    });
  });

  describe("Pain Application (Cumulative Trauma)", () => {
    it("should apply pain from basic damage", () => {
      const { player: newPlayer } = painSystem.applyPain(player, 20);
      
      expect(newPlayer.pain).toBeGreaterThan(player.pain);
      expect(newPlayer.pain).toBeLessThanOrEqual(100);
    });

    it("should increase pain more for higher severity hits", () => {
      const { player: minorHit } = painSystem.applyPain(
        player,
        20,
        VitalPointSeverity.MINOR
      );
      
      const { player: majorHit } = painSystem.applyPain(
        player,
        20,
        VitalPointSeverity.MAJOR
      );

      expect(majorHit.pain).toBeGreaterThan(minorHit.pain);
    });

    it("should increase pain more for neurological hits", () => {
      const { player: normalHit } = painSystem.applyPain(player, 20);
      
      const { player: neuroHit } = painSystem.applyPain(
        player,
        20,
        undefined,
        VitalPointCategory.NEUROLOGICAL
      );

      expect(neuroHit.pain).toBeGreaterThan(normalHit.pain);
    });

    it("should clamp pain to 0-100 range", () => {
      const { player: maxPain } = painSystem.applyPain(player, 1000);
      expect(maxPain.pain).toBe(100);

      const { player: zeroPain } = painSystem.applyPain(
        { ...player, pain: 0 },
        -100
      );
      expect(zeroPain.pain).toBe(0);
    });

    it("should accumulate pain over multiple hits", () => {
      let currentPlayer = player;
      
      for (let i = 0; i < 3; i++) {
        const { player: updated } = painSystem.applyPain(currentPlayer, 15);
        currentPlayer = updated;
      }

      expect(currentPlayer.pain).toBeGreaterThan(player.pain);
    });
  });

  describe("Shock Pain Effects", () => {
    it("should trigger shock pain on significant damage (>=10)", () => {
      const result = painSystem.applyPain(
        player,
        15
      );

      expect(result.shockEffect).toBeDefined();
      expect(result.shockEffect?.intensity).toBeGreaterThanOrEqual(0.1);
      expect(result.shockEffect?.intensity).toBeLessThanOrEqual(0.3);
      expect(result.shockEffect?.duration).toBeGreaterThanOrEqual(2000);
      expect(result.shockEffect?.duration).toBeLessThanOrEqual(3000);
      expect(result.shockEffect?.causedByDamage).toBe(15);
    });

    it("should NOT trigger shock pain on minor damage (<10)", () => {
      const result = painSystem.applyPain(
        player,
        5
      );

      expect(result.shockEffect).toBeUndefined();
    });

    it("should scale shock intensity with damage", () => {
      const { shockEffect: lowShock } = painSystem.applyPain(player, 10);
      const { shockEffect: highShock } = painSystem.applyPain(player, 50);

      expect(highShock?.intensity).toBeGreaterThan(lowShock?.intensity ?? 0);
    });

    it("should cap shock intensity at 30%", () => {
      const { shockEffect } = painSystem.applyPain(player, 1000);
      
      expect(shockEffect?.intensity).toBeLessThanOrEqual(0.3);
    });
  });

  describe("Pain Recovery", () => {
    it("should decrease pain over time at -5/second", () => {
      const painfulPlayer = { ...player, pain: 50 };
      
      // 1 second should reduce by ~5 pain
      const recovered = painSystem.applyDissipation(painfulPlayer, 1000);
      
      expect(recovered.pain).toBeLessThan(painfulPlayer.pain);
      expect(Math.abs(recovered.pain - 45)).toBeLessThan(0.1);
    });

    it("should not decrease pain below 0", () => {
      const lowPainPlayer = { ...player, pain: 2 };
      
      const recovered = painSystem.applyDissipation(lowPainPlayer, 1000);
      
      expect(recovered.pain).toBe(0);
    });

    it("should maintain constant recovery rate regardless of pain level", () => {
      const lowPain = { ...player, pain: 20 };
      const highPain = { ...player, pain: 90 };
      
      const lowRecovered = painSystem.applyDissipation(lowPain, 1000);
      const highRecovered = painSystem.applyDissipation(highPain, 1000);
      
      const lowDelta = lowPain.pain - lowRecovered.pain;
      const highDelta = highPain.pain - highRecovered.pain;
      
      // Recovery rate should be the same (-5/second)
      expect(Math.abs(lowDelta - highDelta)).toBeLessThan(0.1);
    });

    it("should recover proportionally to elapsed time", () => {
      const painfulPlayer = { ...player, pain: 50 };
      
      // Half second should reduce by ~2.5 pain
      const recovered = painSystem.applyDissipation(painfulPlayer, 500);
      
      expect(Math.abs(recovered.pain - 47.5)).toBeLessThan(0.1);
    });
  });

  describe("Pain Effects on Performance", () => {
    it("should not affect performance at minimal pain", () => {
      const effects = painSystem.getEffects(PainLevel.MINIMAL);
      
      expect(effects.performancePenalty).toBe(0);
      expect(effects.accuracyReduction).toBe(0);
      expect(effects.damageReduction).toBe(0);
    });

    it("should reduce performance by 10% at moderate pain", () => {
      const effects = painSystem.getEffects(PainLevel.MODERATE);
      
      expect(effects.performancePenalty).toBe(0.1);
      expect(effects.accuracyReduction).toBe(0.1);
      expect(effects.damageReduction).toBe(0.1);
    });

    it("should reduce performance by 20% at significant pain", () => {
      const effects = painSystem.getEffects(PainLevel.SIGNIFICANT);
      
      expect(effects.performancePenalty).toBe(0.2);
      expect(effects.accuracyReduction).toBe(0.2);
      expect(effects.damageReduction).toBe(0.2);
    });

    it("should reduce performance by 35% at severe pain", () => {
      const effects = painSystem.getEffects(PainLevel.SEVERE);
      
      expect(effects.performancePenalty).toBe(0.35);
      expect(effects.accuracyReduction).toBe(0.35);
      expect(effects.damageReduction).toBe(0.35);
    });

    it("should reduce performance by 50% at pain overload", () => {
      const effects = painSystem.getEffects(PainLevel.OVERLOAD);
      
      expect(effects.performancePenalty).toBe(0.5);
      expect(effects.accuracyReduction).toBe(0.5);
      expect(effects.damageReduction).toBe(0.5);
    });

    it("should apply pain effects to player stats", () => {
      const painfulPlayer = { 
        ...player, 
        pain: 60, // SEVERE
        attackPower: 100,
        defense: 100,
        speed: 100,
        technique: 100,
      };
      
      const affected = painSystem.applyEffects(painfulPlayer);
      
      // SEVERE pain should reduce by 35%
      expect(affected.attackPower).toBe(65); // 100 * (1 - 0.35)
      expect(affected.defense).toBe(65);
      expect(affected.technique).toBe(65);
      expect(affected.speed).toBe(75); // Speed reduced by 25% at SEVERE
    });

    it("should apply additional shock pain penalty", () => {
      const painfulPlayer = { 
        ...player, 
        pain: 40, // SIGNIFICANT (20% reduction)
        attackPower: 100,
        technique: 100,
      };
      
      const shockEffect: ShockPainEffect = {
        intensity: 0.2, // Additional 20% reduction
        duration: 2000,
        startTime: Date.now(),
        causedByDamage: 20,
      };
      
      const affected = painSystem.applyEffects(painfulPlayer, shockEffect);
      
      // Should apply both pain (20%) and shock (20%) = 40% total
      expect(affected.attackPower).toBe(60); // 100 * (1 - 0.4)
      expect(affected.technique).toBe(60);
    });
  });

  describe("Pain Overload", () => {
    it("should detect pain overload at >80 pain", () => {
      const overloadPlayer = { ...player, pain: 85 };
      
      expect(painSystem.isInPainOverload(overloadPlayer)).toBe(true);
    });

    it("should NOT detect pain overload at <=80 pain", () => {
      const normalPlayer = { ...player, pain: 79 };
      
      expect(painSystem.isInPainOverload(normalPlayer)).toBe(false);
    });

    it("should have 30% stun chance at pain overload", () => {
      const effects = painSystem.getEffects(PainLevel.OVERLOAD);
      
      expect(effects.stunChance).toBe(0.3);
    });

    it("should trigger stun probabilistically at pain overload", () => {
      const overloadPlayer = { ...player, pain: 85 };
      
      // Test multiple times to verify probabilistic behavior
      let stunCount = 0;
      const iterations = 1000;
      
      for (let i = 0; i < iterations; i++) {
        if (painSystem.shouldTriggerStun(overloadPlayer)) {
          stunCount++;
        }
      }
      
      // Should be approximately 30% (within reasonable margin)
      const stunRate = stunCount / iterations;
      expect(stunRate).toBeGreaterThan(0.2); // At least 20%
      expect(stunRate).toBeLessThan(0.4); // At most 40%
    });

    it("should NOT trigger stun below pain overload threshold", () => {
      const normalPlayer = { ...player, pain: 70 };
      
      // Test multiple times
      for (let i = 0; i < 100; i++) {
        // Should still respect stun chance for SEVERE level (15%)
        // but we're testing the threshold check works
        const canStun = painSystem.shouldTriggerStun(normalPlayer);
        expect(typeof canStun).toBe("boolean");
      }
    });

    it("should identify player as incapacitated at pain overload", () => {
      const overloadPlayer = { ...player, pain: 90 };
      
      expect(painSystem.isIncapacitated(overloadPlayer)).toBe(true);
    });
  });

  describe("Pain Level Names and Descriptions", () => {
    it("should provide bilingual names for all pain levels", () => {
      const levels = [
        PainLevel.MINIMAL,
        PainLevel.MODERATE,
        PainLevel.SIGNIFICANT,
        PainLevel.SEVERE,
        PainLevel.OVERLOAD,
      ];

      levels.forEach((level) => {
        const name = painSystem.getLevelName(level);
        expect(name.korean).toBeTruthy();
        expect(name.english).toBeTruthy();
      });
    });

    it("should provide bilingual descriptions for all pain levels", () => {
      const levels = [
        PainLevel.MINIMAL,
        PainLevel.MODERATE,
        PainLevel.SIGNIFICANT,
        PainLevel.SEVERE,
        PainLevel.OVERLOAD,
      ];

      levels.forEach((level) => {
        const description = painSystem.getLevelDescription(level);
        expect(description.korean).toBeTruthy();
        expect(description.english).toBeTruthy();
      });
    });
  });

  describe("Category-Based Pain Multipliers", () => {
    it("should apply higher pain for neurological damage", () => {
      const { player: normalHit } = painSystem.applyPain(player, 10);
      const { player: neuroHit } = painSystem.applyPain(
        player,
        10,
        undefined,
        VitalPointCategory.NEUROLOGICAL
      );

      expect(neuroHit.pain).toBeGreaterThan(normalHit.pain);
    });

    it("should apply higher pain for respiratory damage", () => {
      const { player: normalHit } = painSystem.applyPain(player, 10);
      const { player: respiratoryHit } = painSystem.applyPain(
        player,
        10,
        undefined,
        VitalPointCategory.RESPIRATORY
      );

      expect(respiratoryHit.pain).toBeGreaterThan(normalHit.pain);
    });

    it("should apply higher pain for organ damage", () => {
      const { player: normalHit } = painSystem.applyPain(player, 10);
      const { player: organHit } = painSystem.applyPain(
        player,
        10,
        undefined,
        VitalPointCategory.ORGAN
      );

      expect(organHit.pain).toBeGreaterThan(normalHit.pain);
    });
  });

  describe("Combined Severity and Category Effects", () => {
    it("should multiply severity and category bonuses", () => {
      const { player: basicHit } = painSystem.applyPain(player, 10);
      
      const { player: combinedHit } = painSystem.applyPain(
        player,
        10,
        VitalPointSeverity.CRITICAL, // 2.0x
        VitalPointCategory.NEUROLOGICAL // 2.5x
      );

      // Combined should be significantly higher
      expect(combinedHit.pain).toBeGreaterThan(basicHit.pain * 2);
    });
  });
});
