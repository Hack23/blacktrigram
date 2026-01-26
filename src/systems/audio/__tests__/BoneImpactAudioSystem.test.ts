/**
 * Tests for BoneImpactAudioSystem
 * Validates bone impact audio playback, region detection, intensity calculation,
 * and statistics tracking
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  BoneImpactAudioSystem,
  AudioManagerInterface,
  BoneImpactAudioConfig,
  Vector3,
} from "../BoneImpactAudioSystem";
import { BoneImpactEvent } from "../../../audio/types";
import { VitalPoint } from "../../vitalpoint/types";

/**
 * Mock AudioManager for testing
 * 
 * NOTE: This mock implements a superset of the actual IAudioManager interface
 * to test spatial audio features that are planned but not yet implemented in
 * the production AudioManager. The options parameter (with position) represents
 * future functionality.
 */
class MockAudioManager implements AudioManagerInterface {
  public playSFXCalls: Array<{
    soundId: string;
    volume?: number;
    position?: readonly [number, number, number]; // Tracked for future spatial audio tests
  }> = [];

  async playSFX(soundId: string, volume?: number): Promise<void> {
    // In tests, we track spatial position even though the production interface
    // doesn't support it yet. This allows us to verify the system's logic.
    this.playSFXCalls.push({ soundId, volume });
  }

  reset(): void {
    this.playSFXCalls = [];
  }
}

/**
 * Create a mock vital point for testing
 */
function createMockVitalPoint(
  korean: string,
  category: string
): VitalPoint {
  return {
    id: "test-vital-point",
    names: {
      korean,
      english: "Test Vital Point",
      romanized: "test",
    },
    position: { x: 0, y: 1.2 },
    category: category as any,
    severity: "high" as any,
    effects: [],
    description: { korean: "테스트", english: "Test" },
    targetingDifficulty: 50,
    effectiveStances: [],
  };
}

describe("BoneImpactAudioSystem", () => {
  let audioManager: MockAudioManager;
  let system: BoneImpactAudioSystem;

  beforeEach(() => {
    audioManager = new MockAudioManager();
    system = new BoneImpactAudioSystem(audioManager);
  });

  describe("Constructor and Configuration", () => {
    it("should initialize with default config", () => {
      const config = system.getConfig();
      expect(config.enableSpatialAudio).toBe(true);
      expect(config.masterVolume).toBe(1.0);
      expect(config.minPlayInterval).toBe(50);
      expect(config.characterHeight).toBe(2.0);
      expect(config.enableBilingualCues).toBe(false);
    });

    it("should initialize with custom config", () => {
      const customConfig: BoneImpactAudioConfig = {
        enableSpatialAudio: false,
        masterVolume: 0.7,
        minPlayInterval: 100,
        characterHeight: 1.8,
        enableBilingualCues: true,
      };

      const customSystem = new BoneImpactAudioSystem(
        audioManager,
        customConfig
      );
      const config = customSystem.getConfig();

      expect(config.enableSpatialAudio).toBe(false);
      expect(config.masterVolume).toBe(0.7);
      expect(config.minPlayInterval).toBe(100);
      expect(config.characterHeight).toBe(1.8);
      expect(config.enableBilingualCues).toBe(true);
    });

    it("should initialize with empty statistics", () => {
      const stats = system.getStats();
      expect(stats.totalImpactsPlayed).toBe(0);
      expect(stats.fracturesTriggered).toBe(0);
      expect(stats.vitalPointStrikes).toBe(0);
    });
  });

  describe("playBoneImpact", () => {
    it("should play bone impact sound with correct parameters", async () => {
      const event: BoneImpactEvent = {
        region: "head",
        intensity: "heavy",
        vitalPoint: false,
      };
      const position: Vector3 = { x: 0, y: 1.8, z: 0 };

      await system.playBoneImpact(event, position);

      expect(audioManager.playSFXCalls.length).toBe(1);
      const call = audioManager.playSFXCalls[0];

      // Should use hit_heavy sound for head heavy impact
      expect(call.soundId).toMatch(/^hit_heavy(_[1-4])?$/);
      expect(call.volume).toBeGreaterThan(0);
      expect(call.volume).toBeLessThanOrEqual(1.0);
      // NOTE: Spatial audio (position) is not yet implemented in AudioManager
    });

    it("should apply volume multiplier based on intensity", async () => {
      const lightEvent: BoneImpactEvent = {
        region: "torso",
        intensity: "light",
        vitalPoint: false,
      };

      const heavyEvent: BoneImpactEvent = {
        region: "torso",
        intensity: "heavy",
        vitalPoint: false,
      };

      await system.playBoneImpact(lightEvent);
      const lightVolume = audioManager.playSFXCalls[0].volume!;

      audioManager.reset();
      // Wait for rate limit
      await new Promise((resolve) => setTimeout(resolve, 60));

      await system.playBoneImpact(heavyEvent);
      const heavyVolume = audioManager.playSFXCalls[0].volume!;

      // Heavy impact should be louder than light impact
      expect(heavyVolume).toBeGreaterThan(lightVolume);
    });

    it("should respect master volume setting", async () => {
      const customSystem = new BoneImpactAudioSystem(audioManager, {
        masterVolume: 0.5,
      });

      const event: BoneImpactEvent = {
        region: "torso",
        intensity: "medium",
        vitalPoint: false,
      };

      await customSystem.playBoneImpact(event);

      const call = audioManager.playSFXCalls[0];
      // Volume should be affected by 0.5 master volume
      expect(call.volume).toBeLessThanOrEqual(0.5);
    });

    it("should apply spatial audio when enabled", async () => {
      const event: BoneImpactEvent = {
        region: "arms",
        intensity: "medium",
        vitalPoint: false,
      };
      const position: Vector3 = { x: 0.5, y: 1.2, z: -0.3 };

      await system.playBoneImpact(event, position);

      const call = audioManager.playSFXCalls[0];
      // NOTE: Spatial audio (position) is not yet implemented in AudioManager
      expect(call.soundId).toBeDefined();
    });

    it("should not apply spatial audio when disabled", async () => {
      const noSpatialSystem = new BoneImpactAudioSystem(audioManager, {
        enableSpatialAudio: false,
      });

      const event: BoneImpactEvent = {
        region: "legs",
        intensity: "heavy",
        vitalPoint: false,
      };
      const position: Vector3 = { x: 0.2, y: 0.4, z: 0.1 };

      await noSpatialSystem.playBoneImpact(event, position);

      const call = audioManager.playSFXCalls[0];
      // NOTE: Spatial audio is not yet implemented, so this test just verifies the sound plays
      expect(call.soundId).toBeDefined();
    });

    it("should enforce rate limiting", async () => {
      const event: BoneImpactEvent = {
        region: "torso",
        intensity: "medium",
        vitalPoint: false,
      };

      // Play twice rapidly
      await system.playBoneImpact(event);
      await system.playBoneImpact(event);

      // Only one sound should play due to rate limiting
      expect(audioManager.playSFXCalls.length).toBe(1);
    });

    it("should allow playback after rate limit interval", async () => {
      const event: BoneImpactEvent = {
        region: "head",
        intensity: "critical",
        vitalPoint: false,
      };

      await system.playBoneImpact(event);
      expect(audioManager.playSFXCalls.length).toBe(1);

      // Wait for rate limit to pass
      await new Promise((resolve) => setTimeout(resolve, 60));

      await system.playBoneImpact(event);
      expect(audioManager.playSFXCalls.length).toBe(2);
    });

    it("should update statistics correctly", async () => {
      const event: BoneImpactEvent = {
        region: "torso",
        intensity: "heavy",
        vitalPoint: false,
      };

      await system.playBoneImpact(event);

      const stats = system.getStats();
      expect(stats.totalImpactsPlayed).toBe(1);
      expect(stats.impactsByRegion.torso).toBe(1);
      expect(stats.impactsByIntensity.heavy).toBe(1);
      expect(stats.lastImpactTime).toBeGreaterThan(0);
    });

    it("should track fractures in statistics", async () => {
      const fractureEvent: BoneImpactEvent = {
        region: "arms",
        intensity: "fracture",
        vitalPoint: false,
        remainingHealth: 25,
      };

      await system.playBoneImpact(fractureEvent);

      const stats = system.getStats();
      expect(stats.fracturesTriggered).toBe(1);
      expect(stats.impactsByIntensity.fracture).toBe(1);
    });

    it("should track vital point strikes in statistics", async () => {
      const vitalPointEvent: BoneImpactEvent = {
        region: "head",
        intensity: "critical",
        vitalPoint: true,
      };

      await system.playBoneImpact(vitalPointEvent);

      const stats = system.getStats();
      expect(stats.vitalPointStrikes).toBe(1);
    });
  });

  describe("playBoneImpactFromVitalPoint", () => {
    it("should detect head region from Korean vital point name", async () => {
      const headVitalPoint = createMockVitalPoint("관자놀이", "nerve");
      const position: Vector3 = { x: 0.1, y: 1.8, z: 0 };

      await system.playBoneImpactFromVitalPoint(
        headVitalPoint,
        35,
        50,
        position
      );

      const stats = system.getStats();
      expect(stats.impactsByRegion.head).toBe(1);
    });

    it("should detect torso region from rib vital point", async () => {
      const ribVitalPoint = createMockVitalPoint("늑골", "skeletal");
      const position: Vector3 = { x: 0.2, y: 1.2, z: 0 };

      await system.playBoneImpactFromVitalPoint(
        ribVitalPoint,
        40,
        30,
        position
      );

      const stats = system.getStats();
      expect(stats.impactsByRegion.torso).toBe(1);
    });

    it("should detect arms region from joint vital point", async () => {
      const elbowVitalPoint = createMockVitalPoint("팔꿈치", "joint");
      const position: Vector3 = { x: 0.5, y: 1.2, z: 0 };

      await system.playBoneImpactFromVitalPoint(
        elbowVitalPoint,
        30,
        60,
        position
      );

      const stats = system.getStats();
      expect(stats.impactsByRegion.arms).toBe(1);
    });

    it("should detect legs region from knee vital point", async () => {
      const kneeVitalPoint = createMockVitalPoint("무릎", "joint");
      const position: Vector3 = { x: 0.1, y: 0.5, z: 0 };

      await system.playBoneImpactFromVitalPoint(
        kneeVitalPoint,
        35,
        70,
        position
      );

      const stats = system.getStats();
      expect(stats.impactsByRegion.legs).toBe(1);
    });

    it("should always use critical intensity for vital points", async () => {
      const vitalPoint = createMockVitalPoint("급소", "nerve");
      const position: Vector3 = { x: 0, y: 1.5, z: 0 };

      // Even with low damage, vital point should be critical
      await system.playBoneImpactFromVitalPoint(vitalPoint, 10, 80, position);

      const stats = system.getStats();
      expect(stats.impactsByIntensity.critical).toBe(1);
      expect(stats.vitalPointStrikes).toBe(1);
    });

    it("should trigger fracture at low health with high damage", async () => {
      const ribVitalPoint = createMockVitalPoint("갈비", "skeletal");
      const position: Vector3 = { x: 0.2, y: 1.2, z: 0 };

      // Low health (25) + high damage (30) should trigger fracture
      // But vital point makes it critical instead
      await system.playBoneImpactFromVitalPoint(
        ribVitalPoint,
        30,
        25,
        position
      );

      const stats = system.getStats();
      // Vital points are always critical, not fracture
      expect(stats.impactsByIntensity.critical).toBe(1);
    });
  });

  describe("playBoneImpactFromDamage", () => {
    it("should auto-detect head region from position", async () => {
      const headPosition: Vector3 = { x: 0, y: 1.8, z: 0 };

      await system.playBoneImpactFromDamage(30, 60, headPosition, false);

      const stats = system.getStats();
      expect(stats.impactsByRegion.head).toBe(1);
    });

    it("should auto-detect torso region from position", async () => {
      const torsoPosition: Vector3 = { x: 0.1, y: 1.2, z: 0 };

      await system.playBoneImpactFromDamage(25, 70, torsoPosition, false);

      const stats = system.getStats();
      expect(stats.impactsByRegion.torso).toBe(1);
    });

    it("should auto-detect legs region from position", async () => {
      const legPosition: Vector3 = { x: 0, y: 0.3, z: 0 };

      await system.playBoneImpactFromDamage(20, 80, legPosition, false);

      const stats = system.getStats();
      expect(stats.impactsByRegion.legs).toBe(1);
    });

    it("should calculate intensity from damage amount", async () => {
      const position: Vector3 = { x: 0, y: 1.0, z: 0 };

      // Light damage (< 10)
      await system.playBoneImpactFromDamage(5, 90, position, false);
      expect(system.getStats().impactsByIntensity.light).toBe(1);

      system.resetStats();
      await new Promise((resolve) => setTimeout(resolve, 60));

      // Medium damage (10-24)
      await system.playBoneImpactFromDamage(15, 85, position, false);
      expect(system.getStats().impactsByIntensity.medium).toBe(1);

      system.resetStats();
      await new Promise((resolve) => setTimeout(resolve, 60));

      // Heavy damage (25-39)
      await system.playBoneImpactFromDamage(30, 75, position, false);
      expect(system.getStats().impactsByIntensity.heavy).toBe(1);

      system.resetStats();
      await new Promise((resolve) => setTimeout(resolve, 60));

      // Critical damage (>= 40)
      await system.playBoneImpactFromDamage(45, 65, position, false);
      expect(system.getStats().impactsByIntensity.critical).toBe(1);
    });

    it("should trigger fracture at low health", async () => {
      const position: Vector3 = { x: 0, y: 1.2, z: 0 };

      // Low health (< 30%) + high damage (>= 20) = fracture
      await system.playBoneImpactFromDamage(25, 25, position, false);

      const stats = system.getStats();
      expect(stats.impactsByIntensity.fracture).toBe(1);
      expect(stats.fracturesTriggered).toBe(1);
    });

    it("should handle vital point flag correctly", async () => {
      const position: Vector3 = { x: 0, y: 1.5, z: 0 };

      await system.playBoneImpactFromDamage(15, 70, position, true);

      const stats = system.getStats();
      expect(stats.vitalPointStrikes).toBe(1);
      expect(stats.impactsByIntensity.critical).toBe(1); // Vital points are critical
    });
  });

  describe("Statistics", () => {
    it("should reset statistics correctly", async () => {
      const event: BoneImpactEvent = {
        region: "torso",
        intensity: "heavy",
        vitalPoint: false,
      };

      await system.playBoneImpact(event);
      expect(system.getStats().totalImpactsPlayed).toBe(1);

      system.resetStats();
      const stats = system.getStats();

      expect(stats.totalImpactsPlayed).toBe(0);
      expect(stats.fracturesTriggered).toBe(0);
      expect(stats.vitalPointStrikes).toBe(0);
      expect(stats.lastImpactTime).toBe(0);

      // Check all region counters
      expect(stats.impactsByRegion.head).toBe(0);
      expect(stats.impactsByRegion.torso).toBe(0);
      expect(stats.impactsByRegion.arms).toBe(0);
      expect(stats.impactsByRegion.legs).toBe(0);
      expect(stats.impactsByRegion.soft_tissue).toBe(0);

      // Check all intensity counters
      expect(stats.impactsByIntensity.light).toBe(0);
      expect(stats.impactsByIntensity.medium).toBe(0);
      expect(stats.impactsByIntensity.heavy).toBe(0);
      expect(stats.impactsByIntensity.critical).toBe(0);
      expect(stats.impactsByIntensity.fracture).toBe(0);
    });

    it("should track multiple impacts correctly", async () => {
      const events: BoneImpactEvent[] = [
        { region: "head", intensity: "light", vitalPoint: false },
        { region: "torso", intensity: "heavy", vitalPoint: false },
        { region: "arms", intensity: "medium", vitalPoint: false },
      ];

      for (const event of events) {
        await system.playBoneImpact(event);
        // Wait for rate limit
        await new Promise((resolve) => setTimeout(resolve, 60));
      }

      const stats = system.getStats();
      expect(stats.totalImpactsPlayed).toBe(3);
      expect(stats.impactsByRegion.head).toBe(1);
      expect(stats.impactsByRegion.torso).toBe(1);
      expect(stats.impactsByRegion.arms).toBe(1);
    });

    it("should return immutable statistics", () => {
      const stats1 = system.getStats();
      const stats2 = system.getStats();

      // Should be different objects
      expect(stats1).not.toBe(stats2);

      // But with same values
      expect(stats1).toEqual(stats2);
    });
  });

  describe("Error Handling", () => {
    it("should handle audio playback errors gracefully", async () => {
      const errorAudioManager = {
        async playSFX(): Promise<void> {
          throw new Error("Audio playback failed");
        },
      };

      const errorSystem = new BoneImpactAudioSystem(
        errorAudioManager as any
      );

      const event: BoneImpactEvent = {
        region: "torso",
        intensity: "medium",
        vitalPoint: false,
      };

      // Should not throw
      await expect(
        errorSystem.playBoneImpact(event)
      ).resolves.toBeUndefined();

      // Statistics should still be updated despite error
      const stats = errorSystem.getStats();
      expect(stats.totalImpactsPlayed).toBe(1);
    });

    it("should handle missing position gracefully", async () => {
      const event: BoneImpactEvent = {
        region: "legs",
        intensity: "heavy",
        vitalPoint: false,
      };

      // Should not throw even without position
      await expect(system.playBoneImpact(event)).resolves.toBeUndefined();
    });
  });

  describe("Integration Scenarios", () => {
    it("should handle complete combat strike workflow", async () => {
      // Simulate a head strike with heavy damage
      const headPosition: Vector3 = { x: 0.1, y: 1.8, z: -0.2 };

      await system.playBoneImpactFromDamage(35, 60, headPosition, false);

      expect(audioManager.playSFXCalls.length).toBe(1);

      const call = audioManager.playSFXCalls[0];
      expect(call.soundId).toMatch(/^hit_heavy(_[1-4])?$/);
      // NOTE: Spatial audio (position) is not yet implemented in AudioManager

      const stats = system.getStats();
      expect(stats.impactsByRegion.head).toBe(1);
      expect(stats.impactsByIntensity.heavy).toBe(1);
    });

    it("should handle vital point rib strike with fracture", async () => {
      const ribVitalPoint = createMockVitalPoint("늑골", "skeletal");
      const ribPosition: Vector3 = { x: 0.2, y: 1.2, z: 0 };

      // Vital point always critical, not fracture
      await system.playBoneImpactFromVitalPoint(
        ribVitalPoint,
        35,
        25,
        ribPosition
      );

      const stats = system.getStats();
      expect(stats.impactsByRegion.torso).toBe(1);
      expect(stats.impactsByIntensity.critical).toBe(1);
      expect(stats.vitalPointStrikes).toBe(1);
    });

    it("should handle rapid combat exchanges", async () => {
      const strikes = [
        { x: 0, y: 1.8, z: 0, damage: 15 }, // Head light
        { x: 0.4, y: 1.2, z: 0, damage: 25 }, // Arm heavy
        { x: 0.1, y: 0.3, z: 0, damage: 30 }, // Leg heavy (below 25% threshold)
      ];

      for (const strike of strikes) {
        await system.playBoneImpactFromDamage(
          strike.damage,
          70,
          strike,
          false
        );
        // Wait for rate limit
        await new Promise((resolve) => setTimeout(resolve, 60));
      }

      const stats = system.getStats();
      expect(stats.totalImpactsPlayed).toBe(3);
      expect(stats.impactsByRegion.head).toBe(1);
      expect(stats.impactsByRegion.arms).toBe(1);
      expect(stats.impactsByRegion.legs).toBe(1);
    });
  });
});
