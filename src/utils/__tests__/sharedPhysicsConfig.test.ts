/**
 * Tests for shared physics configuration utilities.
 *
 * Validates that physics configuration is consistent across screens
 * and properly adapts to mobile vs desktop devices.
 */

import { describe, it, expect } from "vitest";
import {
  createCameraConfig,
  createPhysicsConfig,
} from "../sharedPhysicsConfig";
import {
  BASE_STAMINA_REGEN_RATE,
  BASE_MOVEMENT_ACCELERATION,
  COMBAT_RANGES_METERS,
} from "@/types/physicsConstants";

describe("sharedPhysicsConfig", () => {
  describe("createCameraConfig", () => {
    it("should create mobile camera configuration", () => {
      const config = createCameraConfig(true);

      expect(config).toEqual({
        fov: 55,
        position: [0, 6, 10],
        near: 0.1,
        far: 1000,
      });
    });

    it("should create desktop camera configuration", () => {
      const config = createCameraConfig(false);

      expect(config).toEqual({
        fov: 60,
        position: [0, 8, 12],
        near: 0.1,
        far: 1000,
      });
    });

    it("should have different FOV for mobile vs desktop", () => {
      const mobile = createCameraConfig(true);
      const desktop = createCameraConfig(false);

      expect(mobile.fov).toBeLessThan(desktop.fov);
    });

    it("should have closer camera position for mobile", () => {
      const mobile = createCameraConfig(true);
      const desktop = createCameraConfig(false);

      // Y position (height)
      expect(mobile.position[1]).toBeLessThan(desktop.position[1]);
      // Z position (distance)
      expect(mobile.position[2]).toBeLessThan(desktop.position[2]);
    });
  });

  describe("createPhysicsConfig", () => {
    it("should create complete physics configuration", () => {
      const config = createPhysicsConfig(1920, 1080, 60, 100, false);

      expect(config).toHaveProperty("arenaConfig");
      expect(config).toHaveProperty("cameraConfig");
      expect(config).toHaveProperty("staminaRegenRate");
      expect(config).toHaveProperty("movementAcceleration");
      expect(config).toHaveProperty("combatRanges");
      expect(config).toHaveProperty("pixelsPerMeter");
    });

    it("should use shared physics constants", () => {
      const config = createPhysicsConfig(1920, 1080, 60, 100, false);

      expect(config.staminaRegenRate).toBe(BASE_STAMINA_REGEN_RATE);
      expect(config.movementAcceleration).toBe(BASE_MOVEMENT_ACCELERATION);
      expect(config.combatRanges).toBe(COMBAT_RANGES_METERS);
    });

    it("should create consistent arena configuration", () => {
      const config1 = createPhysicsConfig(1920, 1080, 60, 100, false);
      const config2 = createPhysicsConfig(1920, 1080, 60, 100, false);

      expect(config1.arenaConfig).toEqual(config2.arenaConfig);
      expect(config1.pixelsPerMeter).toBe(config2.pixelsPerMeter);
    });

    it("should use mobile camera for mobile devices", () => {
      const config = createPhysicsConfig(1920, 1080, 60, 100, true);

      expect(config.cameraConfig.fov).toBe(55);
      expect(config.cameraConfig.position).toEqual([0, 6, 10]);
    });

    it("should use desktop camera for desktop devices", () => {
      const config = createPhysicsConfig(1920, 1080, 60, 100, false);

      expect(config.cameraConfig.fov).toBe(60);
      expect(config.cameraConfig.position).toEqual([0, 8, 12]);
    });

    it("should calculate pixels per meter from arena config", () => {
      const config = createPhysicsConfig(1920, 1080, 60, 100, false);

      expect(config.pixelsPerMeter).toBeGreaterThan(0);
      expect(config.pixelsPerMeter).toBe(
        config.arenaConfig.pixelsPerMeter,
      );
    });

    it("should handle different screen sizes", () => {
      const small = createPhysicsConfig(640, 480, 60, 100, true);
      const large = createPhysicsConfig(3840, 2160, 60, 100, false);

      // Smaller screen should have smaller arena in pixels
      expect(small.arenaConfig.width).toBeLessThan(large.arenaConfig.width);

      // But both should have valid physics
      expect(small.pixelsPerMeter).toBeGreaterThan(0);
      expect(large.pixelsPerMeter).toBeGreaterThan(0);
    });
  });

  describe("cross-screen consistency", () => {
    it("should produce identical configs for same inputs", () => {
      // Simulate TrainingScreen3D and CombatScreen3D using same function
      const trainingPhysics = createPhysicsConfig(1920, 1080, 60, 100, false);
      const combatPhysics = createPhysicsConfig(1920, 1080, 60, 100, false);

      // Arena configuration should be identical
      expect(trainingPhysics.arenaConfig).toEqual(combatPhysics.arenaConfig);

      // Camera configuration should be identical
      expect(trainingPhysics.cameraConfig).toEqual(combatPhysics.cameraConfig);

      // Physics constants should be identical
      expect(trainingPhysics.staminaRegenRate).toBe(
        combatPhysics.staminaRegenRate,
      );
      expect(trainingPhysics.movementAcceleration).toBe(
        combatPhysics.movementAcceleration,
      );
      expect(trainingPhysics.pixelsPerMeter).toBe(
        combatPhysics.pixelsPerMeter,
      );
    });

    it("should handle mobile consistently across screens", () => {
      const trainingMobile = createPhysicsConfig(640, 480, 60, 100, true);
      const combatMobile = createPhysicsConfig(640, 480, 60, 100, true);

      expect(trainingMobile.cameraConfig).toEqual(combatMobile.cameraConfig);
      expect(trainingMobile.arenaConfig.worldWidthMeters).toBe(
        combatMobile.arenaConfig.worldWidthMeters,
      );
    });
  });
});
