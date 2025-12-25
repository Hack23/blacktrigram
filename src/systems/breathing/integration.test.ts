/**
 * Integration tests for Breathing Disruption System with Vital Point System.
 * 
 * Tests integration between breathing disruption and vital point targeting.
 */

import { beforeEach, describe, expect, it } from "vitest";
import {
  causesBreathingDisruption,
  getBreathingDisruptionLevel,
  applyBreathingDisruptionFromVitalPoint,
  applyBreathingDisruptionFromTorsoDamage,
  updateBreathingDisruption,
  upgradeLegacyBreathlessness,
} from "./integration";
import {
  BreathingDisruptionSystem,
  BreathingDisruptionLevel,
} from "./BreathingDisruptionSystem";
import { createMockPlayerState } from "../../test/test-utils";
import { VitalPointCategory, VitalPointEffectType, VitalPointSeverity, TrigramStance } from "../../types";
import { VitalPoint } from "../vitalpoint/types";
import { EffectIntensity } from "../effects";

describe("Breathing Disruption Integration", () => {
  let mockPlayer: ReturnType<typeof createMockPlayerState>;
  let timestamp: number;
  let solarPlexusVitalPoint: VitalPoint;
  let ribVitalPoint: VitalPoint;

  beforeEach(() => {
    mockPlayer = createMockPlayerState();
    timestamp = Date.now();

    solarPlexusVitalPoint = {
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

    ribVitalPoint = {
      id: "torso_rib_left",
      names: {
        korean: "좌측 늑골",
        english: "Left Rib",
        romanized: "jwa-cheuk neukgol",
      },
      position: { x: 95, y: 145 },
      category: VitalPointCategory.SKELETAL,
      severity: VitalPointSeverity.MAJOR,
      baseDamage: 25,
      effects: [],
      description: {
        korean: "늑골 타격으로 호흡 곤란",
        english: "Rib strike causes breathing difficulty",
      },
      targetingDifficulty: 0.65,
      effectiveStances: [TrigramStance.SON, TrigramStance.LI],
    };
  });

  describe("Vital Point Detection", () => {
    it("should detect solar plexus as causing breathing disruption", () => {
      expect(causesBreathingDisruption("torso_solar_plexus")).toBe(true);
    });

    it("should detect rib vital points as causing breathing disruption", () => {
      expect(causesBreathingDisruption("torso_rib_left")).toBe(true);
      expect(causesBreathingDisruption("torso_rib_right")).toBe(true);
    });

    it("should not detect head vital points as causing breathing disruption", () => {
      expect(causesBreathingDisruption("head_temple")).toBe(false);
      expect(causesBreathingDisruption("head_jaw")).toBe(false);
    });

    it("should get SEVERELY_WINDED level for solar plexus", () => {
      const level = getBreathingDisruptionLevel("torso_solar_plexus");
      expect(level).toBe(BreathingDisruptionLevel.SEVERELY_WINDED);
    });

    it("should get GASPING level for rib strikes", () => {
      const level = getBreathingDisruptionLevel("torso_rib_left");
      expect(level).toBe(BreathingDisruptionLevel.GASPING);
    });

    it("should get NONE level for non-torso vital points", () => {
      const level = getBreathingDisruptionLevel("head_temple");
      expect(level).toBe(BreathingDisruptionLevel.NONE);
    });
  });

  describe("Vital Point Strike Integration", () => {
    it("should apply severe breathing disruption from solar plexus strike", () => {
      const updatedPlayer = applyBreathingDisruptionFromVitalPoint(
        mockPlayer,
        solarPlexusVitalPoint,
        40,
        timestamp
      );

      const activeEffect = BreathingDisruptionSystem.getActiveEffect(updatedPlayer);
      expect(activeEffect).toBeDefined();
      expect(activeEffect?.level).toBe(BreathingDisruptionLevel.SEVERELY_WINDED);
      expect(activeEffect?.staminaRegenMultiplier).toBe(0.25); // 75% penalty
      expect(activeEffect?.duration).toBe(15000); // 15 seconds
    });

    it("should apply moderate breathing disruption from rib strike", () => {
      const updatedPlayer = applyBreathingDisruptionFromVitalPoint(
        mockPlayer,
        ribVitalPoint,
        25,
        timestamp
      );

      const activeEffect = BreathingDisruptionSystem.getActiveEffect(updatedPlayer);
      expect(activeEffect).toBeDefined();
      expect(activeEffect?.level).toBe(BreathingDisruptionLevel.GASPING);
      expect(activeEffect?.staminaRegenMultiplier).toBe(0.50); // 50% penalty
    });

    it("should not apply breathing disruption for non-torso vital points", () => {
      const headVitalPoint: VitalPoint = {
        id: "head_temple",
        names: { korean: "태양혈", english: "Temple", romanized: "taeyang-hyeol" },
        position: { x: 100, y: 50 },
        category: VitalPointCategory.NEUROLOGICAL,
        severity: VitalPointSeverity.CRITICAL,
        baseDamage: 35,
        effects: [],
        description: { korean: "관자놀이", english: "Temple strike" },
        targetingDifficulty: 0.7,
        effectiveStances: [TrigramStance.LI],
      };

      const updatedPlayer = applyBreathingDisruptionFromVitalPoint(
        mockPlayer,
        headVitalPoint,
        35,
        timestamp
      );

      const activeEffect = BreathingDisruptionSystem.getActiveEffect(updatedPlayer);
      expect(activeEffect).toBeUndefined();
    });

    it("should stack breathing disruption from multiple vital point strikes", () => {
      // First strike: Rib (Gasping)
      let player = applyBreathingDisruptionFromVitalPoint(
        mockPlayer,
        ribVitalPoint,
        25,
        timestamp
      );

      // Second strike: Solar plexus (Severely Winded) - should escalate
      player = applyBreathingDisruptionFromVitalPoint(
        player,
        solarPlexusVitalPoint,
        40,
        timestamp + 2000
      );

      const activeEffect = BreathingDisruptionSystem.getActiveEffect(player);
      expect(activeEffect).toBeDefined();
      expect(activeEffect?.level).toBe(BreathingDisruptionLevel.SEVERELY_WINDED);
      expect(activeEffect?.source).toContain("좌측 늑골");
      expect(activeEffect?.source).toContain("명치");
    });
  });

  describe("General Torso Damage Integration", () => {
    it("should apply light disruption from low torso damage", () => {
      const updatedPlayer = applyBreathingDisruptionFromTorsoDamage(
        mockPlayer,
        12,
        false,
        timestamp
      );

      const activeEffect = BreathingDisruptionSystem.getActiveEffect(updatedPlayer);
      expect(activeEffect).toBeDefined();
      expect(activeEffect?.level).toBe(BreathingDisruptionLevel.WINDED);
    });

    it("should apply moderate disruption from high torso damage", () => {
      const updatedPlayer = applyBreathingDisruptionFromTorsoDamage(
        mockPlayer,
        22,
        false,
        timestamp
      );

      const activeEffect = BreathingDisruptionSystem.getActiveEffect(updatedPlayer);
      expect(activeEffect).toBeDefined();
      expect(activeEffect?.level).toBe(BreathingDisruptionLevel.GASPING);
    });

    it("should apply severe disruption when solar plexus area flag is true", () => {
      const updatedPlayer = applyBreathingDisruptionFromTorsoDamage(
        mockPlayer,
        8, // Low damage, but solar plexus area
        true,
        timestamp
      );

      const activeEffect = BreathingDisruptionSystem.getActiveEffect(updatedPlayer);
      expect(activeEffect).toBeDefined();
      expect(activeEffect?.level).toBe(BreathingDisruptionLevel.SEVERELY_WINDED);
    });

    it("should not apply disruption from very low damage", () => {
      const updatedPlayer = applyBreathingDisruptionFromTorsoDamage(
        mockPlayer,
        5,
        false,
        timestamp
      );

      const activeEffect = BreathingDisruptionSystem.getActiveEffect(updatedPlayer);
      expect(activeEffect).toBeUndefined();
    });
  });

  describe("Frame Update Integration", () => {
    it("should remove expired breathing disruption effects", () => {
      // Apply breathing disruption
      let player = applyBreathingDisruptionFromVitalPoint(
        mockPlayer,
        ribVitalPoint,
        25,
        timestamp
      );

      // Fast-forward past expiration (10 seconds for Gasping)
      const futureTimestamp = timestamp + 11000;
      player = updateBreathingDisruption(player, 16.67, futureTimestamp);

      const activeEffect = BreathingDisruptionSystem.getActiveEffect(player);
      expect(activeEffect).toBeUndefined();
    });

    it("should apply gradual recovery when torso health > 50%", () => {
      // Apply breathing disruption
      let player = applyBreathingDisruptionFromVitalPoint(
        mockPlayer,
        ribVitalPoint,
        25,
        timestamp
      );

      // Set healthy torso
      player = {
        ...player,
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
      };

      const initialEffect = BreathingDisruptionSystem.getActiveEffect(player);
      expect(initialEffect).toBeDefined();
      const initialEndTime = initialEffect?.endTime ?? 0;

      // Update with recovery
      player = updateBreathingDisruption(player, 16.67, timestamp + 16.67);

      const recoveredEffect = BreathingDisruptionSystem.getActiveEffect(player);
      expect(recoveredEffect).toBeDefined();
      if (recoveredEffect) {
        expect(recoveredEffect.endTime).toBeLessThan(initialEndTime);
      }
    });

    it("should not apply recovery when torso health ≤ 50%", () => {
      // Apply breathing disruption
      let player = applyBreathingDisruptionFromVitalPoint(
        mockPlayer,
        ribVitalPoint,
        25,
        timestamp
      );

      // Set damaged torso
      player = {
        ...player,
        health: 50,
        bodyPartHealth: {
          head: 100,
          neck: 100,
          torsoUpper: 40,
          torsoLower: 40,
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

      const initialEffect = BreathingDisruptionSystem.getActiveEffect(player);
      expect(initialEffect).toBeDefined();
      const initialEndTime = initialEffect?.endTime ?? 0;

      // Update (should not recover)
      player = updateBreathingDisruption(player, 16.67, timestamp + 16.67);

      const effect = BreathingDisruptionSystem.getActiveEffect(player);
      expect(effect).toBeDefined();
      // End time should be unchanged (no recovery)
      expect(Math.abs(effect!.endTime - initialEndTime)).toBeLessThan(1);
    });
  });

  describe("Legacy Effect Upgrade", () => {
    it("should upgrade legacy breathlessness effects to new system", () => {
      // Create player with legacy breathlessness effect
      const legacyEffect = {
        id: "legacy_breathless",
        type: VitalPointEffectType.BREATHLESSNESS,
        intensity: EffectIntensity.HIGH,
        duration: 3000,
        description: { korean: "호흡 곤란", english: "Breathing difficulty" },
        stackable: false,
        source: "Legacy Strike",
        startTime: timestamp,
        endTime: timestamp + 3000,
      };

      const playerWithLegacy = {
        ...mockPlayer,
        statusEffects: [legacyEffect],
      };

      const upgraded = upgradeLegacyBreathlessness(playerWithLegacy, timestamp);

      const activeEffect = BreathingDisruptionSystem.getActiveEffect(upgraded);
      expect(activeEffect).toBeDefined();
      expect(activeEffect?.level).toBe(BreathingDisruptionLevel.SEVERELY_WINDED);
      expect("staminaRegenMultiplier" in activeEffect!).toBe(true);
    });

    it("should map legacy intensity to appropriate disruption level", () => {
      const testCases = [
        { intensity: EffectIntensity.LOW, expectedLevel: BreathingDisruptionLevel.WINDED },
        { intensity: EffectIntensity.MEDIUM, expectedLevel: BreathingDisruptionLevel.GASPING },
        { intensity: EffectIntensity.HIGH, expectedLevel: BreathingDisruptionLevel.SEVERELY_WINDED },
      ];

      for (const { intensity, expectedLevel } of testCases) {
        const legacyEffect = {
          id: "legacy_test",
          type: VitalPointEffectType.BREATHLESSNESS,
          intensity,
          duration: 3000,
          description: { korean: "테스트", english: "Test" },
          stackable: false,
          source: "Test",
          startTime: timestamp,
          endTime: timestamp + 3000,
        };

        const playerWithLegacy = {
          ...mockPlayer,
          statusEffects: [legacyEffect],
        };

        const upgraded = upgradeLegacyBreathlessness(playerWithLegacy, timestamp);
        const activeEffect = BreathingDisruptionSystem.getActiveEffect(upgraded);

        expect(activeEffect?.level).toBe(expectedLevel);
      }
    });

    it("should not modify player state when no legacy effects exist", () => {
      const upgraded = upgradeLegacyBreathlessness(mockPlayer, timestamp);
      expect(upgraded).toBe(mockPlayer); // Should return same reference
    });
  });

  describe("Performance", () => {
    it("should handle frame updates efficiently", () => {
      // Apply breathing disruption
      let player = applyBreathingDisruptionFromVitalPoint(
        mockPlayer,
        ribVitalPoint,
        25,
        timestamp
      );

      const iterations = 1000;
      const startTime = performance.now();

      for (let i = 0; i < iterations; i++) {
        player = updateBreathingDisruption(player, 16.67, timestamp + i * 16.67);
      }

      const endTime = performance.now();
      const avgTime = (endTime - startTime) / iterations;

      expect(avgTime).toBeLessThan(0.1); // Average < 0.1ms per update (60fps compatible)
    });
  });
});
