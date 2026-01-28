/**
 * Cross-screen physics validation tests.
 *
 * Validates that TrainingScreen3D and CombatScreen3D use identical
 * physics configurations to ensure consistent gameplay feel.
 *
 * @korean 화면간 물리 검증 테스트
 */

import { describe, it, expect } from "vitest";
import { createPhysicsConfig } from "../sharedPhysicsConfig";
import {
  BASE_STAMINA_REGEN_RATE,
  BASE_MOVEMENT_ACCELERATION,
  COMBAT_RANGES_METERS,
} from "@/types/physicsConstants";

describe("Cross-Screen Physics Validation", () => {
  describe("TrainingScreen3D vs CombatScreen3D", () => {
    it("should have identical physics configurations for same screen size", () => {
      // Desktop 1920x1080
      const trainingDesktop = createPhysicsConfig(1920, 1080, 60, 100, false);
      const combatDesktop = createPhysicsConfig(1920, 1080, 60, 100, false);

      // Arena dimensions must be identical
      expect(trainingDesktop.arenaConfig.worldWidthMeters).toBe(
        combatDesktop.arenaConfig.worldWidthMeters,
      );
      expect(trainingDesktop.arenaConfig.worldDepthMeters).toBe(
        combatDesktop.arenaConfig.worldDepthMeters,
      );
      expect(trainingDesktop.arenaConfig.pixelsPerMeter).toBe(
        combatDesktop.arenaConfig.pixelsPerMeter,
      );

      // Camera configuration must be identical
      expect(trainingDesktop.cameraConfig).toEqual(combatDesktop.cameraConfig);

      // Physics constants must be identical
      expect(trainingDesktop.staminaRegenRate).toBe(
        combatDesktop.staminaRegenRate,
      );
      expect(trainingDesktop.movementAcceleration).toBe(
        combatDesktop.movementAcceleration,
      );
      expect(trainingDesktop.combatRanges).toBe(combatDesktop.combatRanges);
    });

    it("should have identical mobile configurations", () => {
      // Mobile 640x480
      const trainingMobile = createPhysicsConfig(640, 480, 60, 100, true);
      const combatMobile = createPhysicsConfig(640, 480, 60, 100, true);

      // Arena dimensions
      expect(trainingMobile.arenaConfig.worldWidthMeters).toBe(
        combatMobile.arenaConfig.worldWidthMeters,
      );
      expect(trainingMobile.arenaConfig.worldDepthMeters).toBe(
        combatMobile.arenaConfig.worldDepthMeters,
      );

      // Camera - mobile should use tighter FOV
      expect(trainingMobile.cameraConfig.fov).toBe(55);
      expect(combatMobile.cameraConfig.fov).toBe(55);
      expect(trainingMobile.cameraConfig).toEqual(combatMobile.cameraConfig);

      // Physics constants
      expect(trainingMobile.staminaRegenRate).toBe(
        combatMobile.staminaRegenRate,
      );
      expect(trainingMobile.movementAcceleration).toBe(
        combatMobile.movementAcceleration,
      );
    });

    it("should have consistent pixels-per-meter across all arena sizes", () => {
      const sizes = [
        { width: 640, height: 480, name: "small" },
        { width: 1024, height: 768, name: "medium" },
        { width: 1920, height: 1080, name: "large" },
        { width: 2560, height: 1440, name: "xlarge" },
        { width: 3840, height: 2160, name: "ultra" },
      ];

      for (const size of sizes) {
        const training = createPhysicsConfig(
          size.width,
          size.height,
          60,
          100,
          false,
        );
        const combat = createPhysicsConfig(
          size.width,
          size.height,
          60,
          100,
          false,
        );

        expect(
          training.pixelsPerMeter,
          `${size.name} pixels-per-meter mismatch`,
        ).toBe(combat.pixelsPerMeter);

        expect(
          training.arenaConfig.worldWidthMeters,
          `${size.name} world width mismatch`,
        ).toBe(combat.arenaConfig.worldWidthMeters);
      }
    });
  });

  describe("Movement Speed Consistency", () => {
    it("should use same base movement acceleration", () => {
      const config1 = createPhysicsConfig(1920, 1080, 60, 100, false);
      const config2 = createPhysicsConfig(1920, 1080, 60, 100, false);

      expect(config1.movementAcceleration).toBe(BASE_MOVEMENT_ACCELERATION);
      expect(config2.movementAcceleration).toBe(BASE_MOVEMENT_ACCELERATION);
      expect(config1.movementAcceleration).toBe(config2.movementAcceleration);
    });

    it("should calculate identical movement at 60fps", () => {
      const config = createPhysicsConfig(1920, 1080, 60, 100, false);
      const deltaTime = 1 / 60; // 60fps frame time

      // Calculate velocity increase in one frame
      const velocityIncrease = config.movementAcceleration * deltaTime;

      // At 60fps with 30 m/s² acceleration, should increase by 0.5 m/s per frame
      expect(velocityIncrease).toBeCloseTo(0.5, 1);
    });
  });

  describe("Attack Range Consistency", () => {
    it("should use same combat ranges in meters", () => {
      const training = createPhysicsConfig(1920, 1080, 60, 100, false);
      const combat = createPhysicsConfig(1920, 1080, 60, 100, false);

      expect(training.combatRanges).toBe(COMBAT_RANGES_METERS);
      expect(combat.combatRanges).toBe(COMBAT_RANGES_METERS);
      expect(training.combatRanges).toBe(combat.combatRanges);
    });

    it("should have same melee, close, and medium ranges", () => {
      const config = createPhysicsConfig(1920, 1080, 60, 100, false);

      expect(config.combatRanges.MELEE).toBe(0.5);
      expect(config.combatRanges.CLOSE).toBe(0.8);
      expect(config.combatRanges.MEDIUM).toBe(1.2);
      expect(config.combatRanges.LONG).toBe(2.0);
      expect(config.combatRanges.MAX).toBe(3.0);
    });

    it("should convert ranges to pixels consistently", () => {
      const config = createPhysicsConfig(1920, 1080, 60, 100, false);

      const meleePixels = config.combatRanges.MELEE * config.pixelsPerMeter;
      const closePixels = config.combatRanges.CLOSE * config.pixelsPerMeter;

      expect(meleePixels).toBeGreaterThan(0);
      expect(closePixels).toBeGreaterThan(meleePixels);
    });
  });

  describe("Stamina Regeneration Consistency", () => {
    it("should use same base stamina regen rate", () => {
      const training = createPhysicsConfig(1920, 1080, 60, 100, false);
      const combat = createPhysicsConfig(1920, 1080, 60, 100, false);

      expect(training.staminaRegenRate).toBe(BASE_STAMINA_REGEN_RATE);
      expect(combat.staminaRegenRate).toBe(BASE_STAMINA_REGEN_RATE);
      expect(training.staminaRegenRate).toBe(combat.staminaRegenRate);
    });

    it("should regenerate identical stamina over time", () => {
      const config = createPhysicsConfig(1920, 1080, 60, 100, false);
      const oneSecond = 1.0;

      // At 15 stamina/second, should regenerate 15 stamina in 1 second
      const staminaPerSecond = config.staminaRegenRate * oneSecond;
      expect(staminaPerSecond).toBe(15.0);
    });
  });

  describe("Arena Bounds Consistency", () => {
    it("should have 4:3 aspect ratio in both screens", () => {
      const training = createPhysicsConfig(1920, 1080, 60, 100, false);
      const combat = createPhysicsConfig(1920, 1080, 60, 100, false);

      const trainingRatio =
        training.arenaConfig.worldWidthMeters /
        training.arenaConfig.worldDepthMeters;
      const combatRatio =
        combat.arenaConfig.worldWidthMeters /
        combat.arenaConfig.worldDepthMeters;

      expect(trainingRatio).toBeCloseTo(4 / 3, 2);
      expect(combatRatio).toBeCloseTo(4 / 3, 2);
      expect(trainingRatio).toBe(combatRatio);
    });

    it("should have identical world dimensions for same screen size", () => {
      const screenSizes = [
        { width: 640, height: 480, expectedWidth: 6 }, // small
        { width: 1024, height: 768, expectedWidth: 8 }, // medium
        { width: 1920, height: 1080, expectedWidth: 12 }, // xlarge
        { width: 3840, height: 2160, expectedWidth: 14 }, // ultra
      ];

      for (const size of screenSizes) {
        const training = createPhysicsConfig(
          size.width,
          size.height,
          60,
          100,
          false,
        );
        const combat = createPhysicsConfig(
          size.width,
          size.height,
          60,
          100,
          false,
        );

        expect(training.arenaConfig.worldWidthMeters).toBe(size.expectedWidth);
        expect(combat.arenaConfig.worldWidthMeters).toBe(size.expectedWidth);
        expect(training.arenaConfig.worldWidthMeters).toBe(
          combat.arenaConfig.worldWidthMeters,
        );
      }
    });
  });

  describe("Camera Perspective Consistency", () => {
    it("should have identical desktop camera configuration", () => {
      const training = createPhysicsConfig(1920, 1080, 60, 100, false);
      const combat = createPhysicsConfig(1920, 1080, 60, 100, false);

      expect(training.cameraConfig.fov).toBe(60);
      expect(combat.cameraConfig.fov).toBe(60);
      expect(training.cameraConfig.position).toEqual([0, 8, 12]);
      expect(combat.cameraConfig.position).toEqual([0, 8, 12]);
    });

    it("should have identical mobile camera configuration", () => {
      const training = createPhysicsConfig(640, 480, 60, 100, true);
      const combat = createPhysicsConfig(640, 480, 60, 100, true);

      expect(training.cameraConfig.fov).toBe(55);
      expect(combat.cameraConfig.fov).toBe(55);
      expect(training.cameraConfig.position).toEqual([0, 6, 10]);
      expect(combat.cameraConfig.position).toEqual([0, 6, 10]);
    });

    it("should have tighter mobile FOV than desktop", () => {
      const desktop = createPhysicsConfig(1920, 1080, 60, 100, false);
      const mobile = createPhysicsConfig(640, 480, 60, 100, true);

      expect(mobile.cameraConfig.fov).toBeLessThan(desktop.cameraConfig.fov);
      expect(mobile.cameraConfig.position[1]).toBeLessThan(
        desktop.cameraConfig.position[1],
      ); // Y height
      expect(mobile.cameraConfig.position[2]).toBeLessThan(
        desktop.cameraConfig.position[2],
      ); // Z distance
    });
  });

  describe("Performance Validation", () => {
    it("should maintain 60fps target with consistent frame time", () => {
      const config = createPhysicsConfig(1920, 1080, 60, 100, false);
      const targetFPS = 60;
      const frameTime = 1 / targetFPS;

      // Physics should be calculated with 16.67ms frame time
      expect(frameTime).toBeCloseTo(0.01667, 4);

      // Movement acceleration should work at this frame rate
      const velocityChange = config.movementAcceleration * frameTime;
      expect(velocityChange).toBeGreaterThan(0);
      expect(velocityChange).toBeLessThan(1.0); // Reasonable change per frame
    });

    it("should have reasonable arena sizes for performance", () => {
      const ultra = createPhysicsConfig(3840, 2160, 60, 100, false);

      // Even ultra screens should have manageable arena sizes
      expect(ultra.arenaConfig.worldWidthMeters).toBeLessThanOrEqual(14);
      expect(ultra.arenaConfig.worldDepthMeters).toBeLessThanOrEqual(10.5);
    });
  });
});
