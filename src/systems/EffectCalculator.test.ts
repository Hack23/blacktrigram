/**
 * Unit tests for EffectCalculator
 * 
 * Tests duration calculation, intensity scaling, archetype modifiers,
 * critical hit bonuses, and effect stacking logic.
 */

import { describe, it, expect } from "vitest";
import {
  calculateEffectDuration,
  calculateEffectIntensity,
  convertToStatusEffect,
  applyEffectStacking,
  getArchetypeOffensiveModifier,
  getArchetypeDefensiveModifier,
  isCriticalHit,
  MAX_CONCURRENT_EFFECTS,
} from "./EffectCalculator";
import { PlayerArchetype, VitalPointEffectType, VitalPointSeverity } from "../types/common";
import { EffectIntensity } from "./effects";
import { StatusEffect } from "./types";
import { VitalPointEffect } from "./vitalpoint/types";

describe("EffectCalculator", () => {
  describe("calculateEffectDuration", () => {
    const baseEffect: VitalPointEffect = {
      id: "test_paralysis",
      type: VitalPointEffectType.PARALYSIS,
      intensity: EffectIntensity.MEDIUM,
      duration: 2000,
      description: { korean: "마비", english: "Paralysis" },
      stackable: false,
    };

    it("should calculate base duration with no modifiers", () => {
      const duration = calculateEffectDuration(
        baseEffect,
        0.5, // Mid accuracy
        VitalPointSeverity.MODERATE,
        PlayerArchetype.MUSA, // No offensive bonus
        PlayerArchetype.MUSA // 20% resistance
      );

      // Formula: 2000 * 1.0 (accuracy) * 1.0 (severity) * 1.0 (offensive) * 0.8 (resistance)
      expect(duration).toBe(1600);
    });

    it("should apply accuracy bonus for high accuracy (but not critical)", () => {
      const duration = calculateEffectDuration(
        baseEffect,
        0.85, // High but not critical accuracy
        VitalPointSeverity.MODERATE,
        PlayerArchetype.MUSA,
        PlayerArchetype.MUSA
      );

      // Formula: 2000 * 1.175 (accuracy at 0.85) * 1.0 * 1.0 * 0.8
      expect(duration).toBe(1880);
    });

    it("should apply critical hit bonus for perfect accuracy", () => {
      const duration = calculateEffectDuration(
        baseEffect,
        1.0, // Perfect accuracy triggers critical
        VitalPointSeverity.MODERATE,
        PlayerArchetype.MUSA,
        PlayerArchetype.MUSA
      );

      // Formula: 2000 * 1.25 (accuracy at 1.0) * 1.0 * 1.0 * 0.8 * 2.0 (critical)
      expect(duration).toBe(4000);
    });

    it("should apply accuracy penalty for low accuracy", () => {
      const duration = calculateEffectDuration(
        baseEffect,
        0.0, // Poor accuracy
        VitalPointSeverity.MODERATE,
        PlayerArchetype.MUSA,
        PlayerArchetype.MUSA
      );

      // Formula: 2000 * 0.75 (accuracy at 0.0) * 1.0 * 1.0 * 0.8
      expect(duration).toBe(1200);
    });

    it("should apply severity multipliers correctly", () => {
      // MINOR (0.5x)
      const minor = calculateEffectDuration(
        baseEffect,
        0.5,
        VitalPointSeverity.MINOR,
        PlayerArchetype.MUSA,
        PlayerArchetype.MUSA
      );
      expect(minor).toBe(800); // 2000 * 1.0 * 0.5 * 1.0 * 0.8

      // MAJOR (1.5x)
      const major = calculateEffectDuration(
        baseEffect,
        0.5,
        VitalPointSeverity.MAJOR,
        PlayerArchetype.MUSA,
        PlayerArchetype.MUSA
      );
      expect(major).toBe(2400); // 2000 * 1.0 * 1.5 * 1.0 * 0.8

      // CRITICAL (2.0x)
      const critical = calculateEffectDuration(
        baseEffect,
        0.5,
        VitalPointSeverity.CRITICAL,
        PlayerArchetype.MUSA,
        PlayerArchetype.MUSA
      );
      expect(critical).toBe(3200); // 2000 * 1.0 * 2.0 * 1.0 * 0.8

      // LETHAL (3.0x)
      const lethal = calculateEffectDuration(
        baseEffect,
        0.5,
        VitalPointSeverity.LETHAL,
        PlayerArchetype.MUSA,
        PlayerArchetype.MUSA
      );
      expect(lethal).toBe(4800); // 2000 * 1.0 * 3.0 * 1.0 * 0.8
    });

    it("should apply assassin offensive bonus (+30%)", () => {
      const duration = calculateEffectDuration(
        baseEffect,
        0.5,
        VitalPointSeverity.MODERATE,
        PlayerArchetype.AMSALJA, // +30% offensive
        PlayerArchetype.MUSA // 20% resistance
      );

      // Formula: 2000 * 1.0 * 1.0 * 1.3 * 0.8
      expect(duration).toBe(2080);
    });

    it("should apply warrior defensive resistance (+20%)", () => {
      const duration = calculateEffectDuration(
        baseEffect,
        0.5,
        VitalPointSeverity.MODERATE,
        PlayerArchetype.AMSALJA, // +30% offensive
        PlayerArchetype.MUSA // +20% resistance
      );

      // Formula: 2000 * 1.0 * 1.0 * 1.3 * 0.8 (1 - 0.2)
      expect(duration).toBe(2080);
    });

    it("should apply assassin vulnerability (-10% resistance)", () => {
      const duration = calculateEffectDuration(
        baseEffect,
        0.5,
        VitalPointSeverity.MODERATE,
        PlayerArchetype.MUSA, // No bonus
        PlayerArchetype.AMSALJA // -10% resistance (more vulnerable)
      );

      // Formula: 2000 * 1.0 * 1.0 * 1.0 * 1.1 (1 - (-0.1))
      expect(duration).toBe(2200);
    });

    it("should apply critical hit bonus (2x duration) for accuracy >= 0.9", () => {
      const duration = calculateEffectDuration(
        baseEffect,
        0.95, // Critical hit accuracy
        VitalPointSeverity.MODERATE,
        PlayerArchetype.MUSA,
        PlayerArchetype.MUSA
      );

      // Formula: 2000 * 1.225 * 1.0 * 1.0 * 0.8 * 2.0 (critical)
      expect(duration).toBe(3920);
    });

    it("should combine all modifiers correctly", () => {
      const duration = calculateEffectDuration(
        baseEffect,
        0.95, // Critical accuracy
        VitalPointSeverity.CRITICAL, // 2x severity
        PlayerArchetype.AMSALJA, // +30% offensive
        PlayerArchetype.AMSALJA // -10% resistance
      );

      // Formula: 2000 * 1.225 (accuracy) * 2.0 (severity) * 1.3 (offensive) * 1.1 (resistance) * 2.0 (critical)
      expect(duration).toBeGreaterThan(10000);
    });
  });

  describe("calculateEffectIntensity", () => {
    it("should maintain intensity at mid accuracy (0.5)", () => {
      const intensity = calculateEffectIntensity(EffectIntensity.MEDIUM, 0.5);
      expect(intensity).toBe(EffectIntensity.MEDIUM);
    });

    it("should increase intensity at high accuracy", () => {
      const intensity = calculateEffectIntensity(EffectIntensity.MEDIUM, 1.0);
      // Medium (4) * 1.5 = 6 = HIGH
      expect(intensity).toBe(EffectIntensity.HIGH);
    });

    it("should decrease intensity at low accuracy", () => {
      const intensity = calculateEffectIntensity(EffectIntensity.MEDIUM, 0.0);
      // Medium (4) * 0.5 = 2 = MINOR
      expect(intensity).toBe(EffectIntensity.MINOR);
    });

    it("should handle extreme cases without going out of bounds", () => {
      // Should not go below WEAK
      const lowest = calculateEffectIntensity(EffectIntensity.WEAK, 0.0);
      expect(lowest).toBe(EffectIntensity.WEAK);

      // Should not go above EXTREME
      const highest = calculateEffectIntensity(EffectIntensity.EXTREME, 1.0);
      expect(highest).toBe(EffectIntensity.EXTREME);
    });
  });

  describe("convertToStatusEffect", () => {
    const vitalPointEffect: VitalPointEffect = {
      id: "pain",
      type: VitalPointEffectType.PAIN,
      intensity: EffectIntensity.MEDIUM,
      duration: 3000,
      description: { korean: "고통", english: "Pain" },
      stackable: true,
    };

    it("should convert vital point effect to status effect", () => {
      const timestamp = Date.now();
      const statusEffect = convertToStatusEffect(
        vitalPointEffect,
        0.8,
        VitalPointSeverity.MAJOR,
        PlayerArchetype.AMSALJA,
        PlayerArchetype.MUSA,
        "liver",
        timestamp
      );

      expect(statusEffect.type).toBe(VitalPointEffectType.PAIN);
      expect(statusEffect.source).toBe("liver");
      expect(statusEffect.startTime).toBe(timestamp);
      expect(statusEffect.endTime).toBeGreaterThan(timestamp);
      expect(statusEffect.stackable).toBe(true);
    });

    it("should generate unique IDs with timestamp", () => {
      const timestamp1 = Date.now();
      const effect1 = convertToStatusEffect(
        vitalPointEffect,
        0.5,
        VitalPointSeverity.MODERATE,
        PlayerArchetype.MUSA,
        PlayerArchetype.MUSA,
        "point1",
        timestamp1
      );

      const timestamp2 = timestamp1 + 10;
      const effect2 = convertToStatusEffect(
        vitalPointEffect,
        0.5,
        VitalPointSeverity.MODERATE,
        PlayerArchetype.MUSA,
        PlayerArchetype.MUSA,
        "point1",
        timestamp2
      );

      expect(effect1.id).not.toBe(effect2.id);
    });
  });

  describe("applyEffectStacking", () => {
    const createEffect = (
      id: string,
      type: VitalPointEffectType,
      startTime: number,
      endTime: number,
      stackable = true
    ): StatusEffect => ({
      id,
      type,
      intensity: EffectIntensity.MEDIUM,
      duration: 2000,
      description: { korean: "효과", english: "Effect" },
      stackable,
      source: "test",
      startTime,
      endTime,
    });

    it("should add new effects to empty list", () => {
      const currentTime = Date.now();
      const newEffects = [
        createEffect("effect1", VitalPointEffectType.PAIN, currentTime, currentTime + 5000),
      ];

      const result = applyEffectStacking([], newEffects, currentTime);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("effect1");
    });

    it("should remove expired effects", () => {
      const currentTime = Date.now();
      const currentEffects = [
        createEffect("expired", VitalPointEffectType.PAIN, currentTime - 2000, currentTime - 1000),
        createEffect("active", VitalPointEffectType.STUN, currentTime, currentTime + 5000),
      ];

      const result = applyEffectStacking(currentEffects, [], currentTime);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("active");
    });

    it("should replace non-stackable effects of same type", () => {
      const currentTime = Date.now();
      const currentEffects = [
        createEffect("old_stun", VitalPointEffectType.STUN, currentTime, currentTime + 2000, false),
      ];
      const newEffects = [
        createEffect("new_stun", VitalPointEffectType.STUN, currentTime + 100, currentTime + 3000, false),
      ];

      const result = applyEffectStacking(currentEffects, newEffects, currentTime);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("new_stun");
    });

    it("should stack stackable effects", () => {
      const currentTime = Date.now();
      const currentEffects = [
        createEffect("pain1", VitalPointEffectType.PAIN, currentTime, currentTime + 2000, true),
      ];
      const newEffects = [
        createEffect("pain2", VitalPointEffectType.PAIN, currentTime + 100, currentTime + 3000, true),
      ];

      const result = applyEffectStacking(currentEffects, newEffects, currentTime);

      expect(result).toHaveLength(2);
    });

    it("should limit to MAX_CONCURRENT_EFFECTS (5)", () => {
      const currentTime = Date.now();
      // Create effects with different start times so they can be sorted
      const currentEffects = [
        createEffect("effect1", VitalPointEffectType.PAIN, currentTime + 100, currentTime + 5000),
        createEffect("effect2", VitalPointEffectType.STUN, currentTime + 200, currentTime + 5000),
        createEffect("effect3", VitalPointEffectType.WEAKNESS, currentTime + 300, currentTime + 5000),
        createEffect("effect4", VitalPointEffectType.PARALYSIS, currentTime + 400, currentTime + 5000),
      ];
      const newEffects = [
        createEffect("effect5", VitalPointEffectType.BREATHLESSNESS, currentTime + 500, currentTime + 5000),
        createEffect("effect6", VitalPointEffectType.DISORIENTATION, currentTime + 600, currentTime + 5000),
      ];

      const result = applyEffectStacking(currentEffects, newEffects, currentTime);

      expect(result).toHaveLength(MAX_CONCURRENT_EFFECTS);
      // Should keep most recent effects (sorted by startTime descending)
      const resultIds = result.map((e) => e.id);
      expect(resultIds.includes("effect6")).toBe(true); // Most recent (t+600)
      expect(resultIds.includes("effect5")).toBe(true); // Second most recent (t+500)
      // Oldest effect (effect1 at t+100) should be dropped
      expect(resultIds.includes("effect1")).toBe(false);
    });
  });

  describe("getArchetypeOffensiveModifier", () => {
    it("should return correct modifiers for each archetype", () => {
      expect(getArchetypeOffensiveModifier(PlayerArchetype.MUSA)).toBe(1.0);
      expect(getArchetypeOffensiveModifier(PlayerArchetype.AMSALJA)).toBe(1.3);
      expect(getArchetypeOffensiveModifier(PlayerArchetype.HACKER)).toBe(1.15);
      expect(getArchetypeOffensiveModifier(PlayerArchetype.JEONGBO_YOWON)).toBe(1.25);
      expect(getArchetypeOffensiveModifier(PlayerArchetype.JOJIK_POKRYEOKBAE)).toBe(1.2);
    });
  });

  describe("getArchetypeDefensiveModifier", () => {
    it("should return correct modifiers for each archetype", () => {
      expect(getArchetypeDefensiveModifier(PlayerArchetype.MUSA)).toBe(0.2);
      expect(getArchetypeDefensiveModifier(PlayerArchetype.AMSALJA)).toBe(-0.1);
      expect(getArchetypeDefensiveModifier(PlayerArchetype.HACKER)).toBe(0.0);
      expect(getArchetypeDefensiveModifier(PlayerArchetype.JEONGBO_YOWON)).toBe(0.1);
      expect(getArchetypeDefensiveModifier(PlayerArchetype.JOJIK_POKRYEOKBAE)).toBe(0.15);
    });
  });

  describe("isCriticalHit", () => {
    it("should return true for accuracy >= 0.9", () => {
      expect(isCriticalHit(0.9)).toBe(true);
      expect(isCriticalHit(0.95)).toBe(true);
      expect(isCriticalHit(1.0)).toBe(true);
    });

    it("should return false for accuracy < 0.9", () => {
      expect(isCriticalHit(0.89)).toBe(false);
      expect(isCriticalHit(0.5)).toBe(false);
      expect(isCriticalHit(0.0)).toBe(false);
    });
  });
});
