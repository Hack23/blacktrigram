/**
 * Tests for Bone Impact Audio Mapping System
 * Validates body region detection, intensity calculation, and sound selection
 */

import { describe, it, expect } from "vitest";
import {
  BODY_REGION_SOUND_MAP,
  SOUND_VARIANT_COUNTS,
  IMPACT_VOLUME_MULTIPLIERS,
  getBoneImpactSoundId,
  calculateImpactIntensity,
  detectBodyRegion,
  getImpactVolumeMultiplier,
} from "./BoneImpactAudioMap";
import { BodyRegion, ImpactIntensity } from "./types";

describe("BoneImpactAudioMap", () => {
  describe("BODY_REGION_SOUND_MAP", () => {
    it("should have mappings for all body regions", () => {
      const expectedRegions: BodyRegion[] = [
        "head",
        "torso",
        "arms",
        "legs",
        "soft_tissue",
      ];

      expectedRegions.forEach((region) => {
        expect(BODY_REGION_SOUND_MAP[region]).toBeDefined();
        expect(typeof BODY_REGION_SOUND_MAP[region]).toBe("object");
      });
    });

    it("should have all intensity levels for each region", () => {
      const expectedIntensities: ImpactIntensity[] = [
        "light",
        "medium",
        "heavy",
        "critical",
        "fracture",
      ];

      Object.values(BODY_REGION_SOUND_MAP).forEach((regionMap) => {
        expectedIntensities.forEach((intensity) => {
          expect(regionMap[intensity]).toBeDefined();
          expect(typeof regionMap[intensity]).toBe("string");
        });
      });
    });

    it("should use appropriate sounds for head strikes", () => {
      const headMap = BODY_REGION_SOUND_MAP.head;
      expect(headMap.light).toBe("hit_light");
      expect(headMap.medium).toBe("hit_medium");
      expect(headMap.heavy).toBe("hit_heavy");
      expect(headMap.critical).toBe("hit_critical");
      expect(headMap.fracture).toBe("hit_critical"); // Skull fracture
    });

    it("should use appropriate sounds for soft tissue", () => {
      const softMap = BODY_REGION_SOUND_MAP.soft_tissue;
      expect(softMap.light).toBe("hit_flesh");
      expect(softMap.medium).toBe("hit_flesh");
      expect(softMap.heavy).toBe("body_realistic_sound");
    });
  });

  describe("SOUND_VARIANT_COUNTS", () => {
    it("should define variant counts for all sound types", () => {
      const expectedSounds = [
        "hit_flesh",
        "hit_light",
        "hit_medium",
        "hit_heavy",
        "hit_critical",
        "body_realistic_sound",
      ];

      expectedSounds.forEach((soundType) => {
        expect(SOUND_VARIANT_COUNTS[soundType]).toBeDefined();
        expect(typeof SOUND_VARIANT_COUNTS[soundType]).toBe("number");
        expect(SOUND_VARIANT_COUNTS[soundType]).toBeGreaterThanOrEqual(1);
      });
    });

    it("should have 4 variants for most hit sounds", () => {
      expect(SOUND_VARIANT_COUNTS.hit_light).toBe(4);
      expect(SOUND_VARIANT_COUNTS.hit_medium).toBe(4);
      expect(SOUND_VARIANT_COUNTS.hit_heavy).toBe(4);
      expect(SOUND_VARIANT_COUNTS.hit_critical).toBe(4);
    });
  });

  describe("IMPACT_VOLUME_MULTIPLIERS", () => {
    it("should have multipliers for all intensities", () => {
      const expectedIntensities: ImpactIntensity[] = [
        "light",
        "medium",
        "heavy",
        "critical",
        "fracture",
      ];

      expectedIntensities.forEach((intensity) => {
        expect(IMPACT_VOLUME_MULTIPLIERS[intensity]).toBeDefined();
        expect(typeof IMPACT_VOLUME_MULTIPLIERS[intensity]).toBe("number");
      });
    });

    it("should increase volume with intensity", () => {
      expect(IMPACT_VOLUME_MULTIPLIERS.light).toBeLessThan(
        IMPACT_VOLUME_MULTIPLIERS.medium
      );
      expect(IMPACT_VOLUME_MULTIPLIERS.medium).toBeLessThan(
        IMPACT_VOLUME_MULTIPLIERS.heavy
      );
      expect(IMPACT_VOLUME_MULTIPLIERS.heavy).toBeLessThan(
        IMPACT_VOLUME_MULTIPLIERS.critical
      );
      expect(IMPACT_VOLUME_MULTIPLIERS.critical).toBeLessThan(
        IMPACT_VOLUME_MULTIPLIERS.fracture
      );
    });

    it("should have appropriate volume ranges", () => {
      expect(IMPACT_VOLUME_MULTIPLIERS.light).toBeGreaterThanOrEqual(0.5);
      expect(IMPACT_VOLUME_MULTIPLIERS.fracture).toBeLessThanOrEqual(1.5);
    });
  });

  describe("getBoneImpactSoundId", () => {
    it("should return base sound ID when randomize is false", () => {
      const soundId = getBoneImpactSoundId("head", "heavy", false);
      expect(soundId).toBe("hit_heavy");
    });

    it("should return variant when randomize is true", () => {
      const soundId = getBoneImpactSoundId("torso", "medium", true);
      expect(soundId).toMatch(/^hit_medium(_[1-4])?$/);
    });

    it("should handle single-variant sounds", () => {
      const soundId = getBoneImpactSoundId("soft_tissue", "heavy", true);
      // body_realistic_sound has only 1 variant
      expect(soundId).toBe("body_realistic_sound");
    });

    it("should return valid variants within range", () => {
      // Test multiple calls to ensure random variants are valid
      for (let i = 0; i < 20; i++) {
        const soundId = getBoneImpactSoundId("head", "critical", true);
        expect(soundId).toMatch(/^hit_critical(_[1-4])?$/);
      }
    });

    it("should work for all body regions and intensities", () => {
      const regions: BodyRegion[] = [
        "head",
        "torso",
        "arms",
        "legs",
        "soft_tissue",
      ];
      const intensities: ImpactIntensity[] = [
        "light",
        "medium",
        "heavy",
        "critical",
        "fracture",
      ];

      regions.forEach((region) => {
        intensities.forEach((intensity) => {
          const soundId = getBoneImpactSoundId(region, intensity, false);
          expect(soundId).toBeDefined();
          expect(typeof soundId).toBe("string");
          expect(soundId.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("calculateImpactIntensity", () => {
    it("should return fracture for low health + high damage", () => {
      const intensity = calculateImpactIntensity(25, 25, false);
      expect(intensity).toBe("fracture");
    });

    it("should return critical for vital point strikes", () => {
      const intensity = calculateImpactIntensity(15, 80, true);
      expect(intensity).toBe("critical");
    });

    it("should prioritize vital point over fracture", () => {
      const intensity = calculateImpactIntensity(30, 20, true);
      expect(intensity).toBe("critical");
    });

    it("should return critical for high damage (>=40)", () => {
      const intensity = calculateImpactIntensity(45, undefined, false);
      expect(intensity).toBe("critical");
    });

    it("should return heavy for damage 25-39", () => {
      expect(calculateImpactIntensity(25, undefined, false)).toBe("heavy");
      expect(calculateImpactIntensity(35, undefined, false)).toBe("heavy");
      expect(calculateImpactIntensity(39, undefined, false)).toBe("heavy");
    });

    it("should return medium for damage 10-24", () => {
      expect(calculateImpactIntensity(10, undefined, false)).toBe("medium");
      expect(calculateImpactIntensity(15, undefined, false)).toBe("medium");
      expect(calculateImpactIntensity(24, undefined, false)).toBe("medium");
    });

    it("should return light for damage <10", () => {
      expect(calculateImpactIntensity(0, undefined, false)).toBe("light");
      expect(calculateImpactIntensity(5, undefined, false)).toBe("light");
      expect(calculateImpactIntensity(9, undefined, false)).toBe("light");
    });

    it("should not trigger fracture above 30% health", () => {
      const intensity = calculateImpactIntensity(40, 35, false);
      expect(intensity).toBe("critical"); // High damage, not fracture
    });

    it("should not trigger fracture with low damage even at low health", () => {
      const intensity = calculateImpactIntensity(15, 25, false);
      expect(intensity).toBe("medium"); // Not enough damage for fracture
    });

    it("should handle edge case: exactly 30% health", () => {
      const intensity = calculateImpactIntensity(25, 30, false);
      expect(intensity).toBe("heavy"); // 30% is not <30%, so no fracture
    });

    it("should handle edge case: exactly 29% health", () => {
      const intensity = calculateImpactIntensity(25, 29, false);
      expect(intensity).toBe("fracture"); // 29% is <30%, fracture triggered
    });
  });

  describe("detectBodyRegion", () => {
    const defaultHeight = 2.0;

    it("should detect head region (top 25%)", () => {
      expect(detectBodyRegion({ x: 0, y: 1.8 }, defaultHeight)).toBe("head");
      expect(detectBodyRegion({ x: 0, y: 1.5 }, defaultHeight)).toBe("head"); // 75%
      expect(detectBodyRegion({ x: 0, y: 2.0 }, defaultHeight)).toBe("head"); // 100%
    });

    it("should detect torso region (center)", () => {
      expect(detectBodyRegion({ x: 0, y: 1.2 }, defaultHeight)).toBe("torso");
      expect(detectBodyRegion({ x: 0, y: 1.0 }, defaultHeight)).toBe("torso"); // 50%
      expect(detectBodyRegion({ x: 0.1, y: 0.8 }, defaultHeight)).toBe(
        "torso"
      );
    });

    it("should detect arms region (sides of torso)", () => {
      expect(detectBodyRegion({ x: 0.4, y: 1.2 }, defaultHeight)).toBe("arms");
      expect(detectBodyRegion({ x: -0.5, y: 1.0 }, defaultHeight)).toBe(
        "arms"
      );
      expect(detectBodyRegion({ x: 0.31, y: 0.6 }, defaultHeight)).toBe(
        "arms"
      );
    });

    it("should detect legs region (bottom 25%)", () => {
      expect(detectBodyRegion({ x: 0, y: 0.4 }, defaultHeight)).toBe("legs");
      expect(detectBodyRegion({ x: 0, y: 0.1 }, defaultHeight)).toBe("legs");
      expect(detectBodyRegion({ x: 0, y: 0.0 }, defaultHeight)).toBe("legs"); // 0%
    });

    it("should handle different character heights", () => {
      const tallHeight = 3.0;
      expect(detectBodyRegion({ x: 0, y: 2.5 }, tallHeight)).toBe("head"); // 83%
      expect(detectBodyRegion({ x: 0, y: 1.5 }, tallHeight)).toBe("torso"); // 50%
      expect(detectBodyRegion({ x: 0, y: 0.3 }, tallHeight)).toBe("legs"); // 10%
    });

    it("should prioritize arms over torso for side hits", () => {
      // Torso height (0.5) but horizontal position outside core (0.35)
      expect(detectBodyRegion({ x: 0.35, y: 1.0 }, defaultHeight)).toBe(
        "arms"
      );
    });

    it("should handle edge cases", () => {
      // Exactly on boundaries
      expect(detectBodyRegion({ x: 0, y: 1.5 }, defaultHeight)).toBe("head"); // 75%
      expect(detectBodyRegion({ x: 0, y: 0.5 }, defaultHeight)).toBe("torso"); // 25%
      expect(detectBodyRegion({ x: 0.3, y: 1.0 }, defaultHeight)).toBe(
        "torso"
      ); // Exactly on arm threshold
    });
  });

  describe("getImpactVolumeMultiplier", () => {
    it("should return correct multipliers for all intensities", () => {
      expect(getImpactVolumeMultiplier("light")).toBe(0.7);
      expect(getImpactVolumeMultiplier("medium")).toBe(0.85);
      expect(getImpactVolumeMultiplier("heavy")).toBe(1.0);
      expect(getImpactVolumeMultiplier("critical")).toBe(1.15);
      expect(getImpactVolumeMultiplier("fracture")).toBe(1.3);
    });

    it("should have reasonable volume ranges", () => {
      const intensities: ImpactIntensity[] = [
        "light",
        "medium",
        "heavy",
        "critical",
        "fracture",
      ];

      intensities.forEach((intensity) => {
        const multiplier = getImpactVolumeMultiplier(intensity);
        expect(multiplier).toBeGreaterThan(0);
        expect(multiplier).toBeLessThanOrEqual(2);
      });
    });
  });

  describe("Integration Scenarios", () => {
    it("should handle complete head strike workflow", () => {
      const hitPosition = { x: 0, y: 1.8, z: 0 };
      const region = detectBodyRegion(hitPosition);
      expect(region).toBe("head");

      const intensity = calculateImpactIntensity(35, 50, false);
      expect(intensity).toBe("heavy");

      const soundId = getBoneImpactSoundId(region, intensity, false);
      expect(soundId).toBe("hit_heavy");

      const volume = getImpactVolumeMultiplier(intensity);
      expect(volume).toBe(1.0);
    });

    it("should handle vital point leg strike", () => {
      const hitPosition = { x: 0, y: 0.3, z: 0 };
      const region = detectBodyRegion(hitPosition);
      expect(region).toBe("legs");

      const intensity = calculateImpactIntensity(20, 80, true);
      expect(intensity).toBe("critical"); // Vital point

      const soundId = getBoneImpactSoundId(region, intensity, false);
      expect(soundId).toBe("hit_critical");

      const volume = getImpactVolumeMultiplier(intensity);
      expect(volume).toBe(1.15);
    });

    it("should handle fracture scenario", () => {
      const hitPosition = { x: 0, y: 1.0, z: 0 };
      const region = detectBodyRegion(hitPosition);
      expect(region).toBe("torso");

      const intensity = calculateImpactIntensity(30, 25, false);
      expect(intensity).toBe("fracture"); // Low health + high damage

      const soundId = getBoneImpactSoundId(region, intensity, false);
      expect(soundId).toBe("hit_critical");

      const volume = getImpactVolumeMultiplier(intensity);
      expect(volume).toBe(1.3); // Maximum volume for fracture
    });

    it("should handle soft tissue arm strike", () => {
      const hitPosition = { x: 0.4, y: 1.2, z: 0 };
      const region = detectBodyRegion(hitPosition);
      expect(region).toBe("arms");

      const intensity = calculateImpactIntensity(8, 70, false);
      expect(intensity).toBe("light");

      const soundId = getBoneImpactSoundId(region, intensity, false);
      expect(soundId).toBe("hit_flesh"); // Soft tissue for light arm hits

      const volume = getImpactVolumeMultiplier(intensity);
      expect(volume).toBe(0.7);
    });
  });
});
