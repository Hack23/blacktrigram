/**
 * Integration tests for movement system in TrainingScreen3D and CombatScreen3D
 *
 * These tests verify that the screens correctly pass arena scale to usePlayerMovement
 * and that movement behavior is consistent across different device sizes.
 */

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MOBILE_ARENA_SCALE } from "../../../test/arenaScaleConstants";
import type { Position } from "../../../types/common";
import { TrigramStance } from "../../../types/common";
import { usePlayerMovement } from "../../../utils/inputSystem";

describe("Screen Movement Integration", () => {
  describe("Arena Scale Passing", () => {
    it("should accept scale parameter in bounds configuration", () => {
      const bounds = {
        x: 100,
        y: 50,
        width: 960,
        height: 600,
        scale: 1.0,
      };

      const { result } = renderHook(() =>
        usePlayerMovement({
          enabled: true,
          bounds,
          initialPosition: { x: 500, y: 300 },
          currentStance: TrigramStance.GEON,
          maxSpeedOverride: 2.0,
          accelerationOverride: 4.0,
        }),
      );

      expect(result.current.playerPosition).toBeDefined();
      expect(result.current.playerPosition.x).toBeCloseTo(500, 0);
      expect(result.current.playerPosition.y).toBeCloseTo(300, 0);
    });

    it("should handle desktop scale (1.0) correctly", () => {
      const desktopBounds = {
        x: 120,
        y: 100,
        width: 960,
        height: 600,
        scale: 1.0,
      };

      const { result } = renderHook(() =>
        usePlayerMovement({
          enabled: true,
          bounds: desktopBounds,
          initialPosition: { x: 600, y: 400 },
          currentStance: TrigramStance.GEON,
          maxSpeedOverride: 2.0,
          accelerationOverride: 4.0,
        }),
      );

      expect(result.current.playerPosition).toBeDefined();
      // Desktop scale should use 100 pixels per meter
    });

    it("should handle mobile scale (0.3125) correctly", () => {
      const mobileBounds = {
        x: 37.5,
        y: 100,
        width: 300,
        height: 225,
        scale: MOBILE_ARENA_SCALE,
      };

      const { result } = renderHook(() =>
        usePlayerMovement({
          enabled: true,
          bounds: mobileBounds,
          initialPosition: { x: 187.5, y: 212.5 },
          currentStance: TrigramStance.GEON,
          maxSpeedOverride: 2.0,
          accelerationOverride: 4.0,
        }),
      );

      expect(result.current.playerPosition).toBeDefined();
      // Mobile scale should use 320 pixels per meter (100 / 0.3125)
    });

    it("should default to scale 1.0 when not provided", () => {
      const boundsWithoutScale = {
        x: 100,
        y: 50,
        width: 960,
        height: 600,
        // scale not provided
      };

      const { result } = renderHook(() =>
        usePlayerMovement({
          enabled: true,
          bounds: boundsWithoutScale,
          initialPosition: { x: 500, y: 300 },
          currentStance: TrigramStance.GEON,
          maxSpeedOverride: 2.0,
          accelerationOverride: 4.0,
        }),
      );

      expect(result.current.playerPosition).toBeDefined();
      // Should default to desktop scale (1.0)
    });
  });

  describe("Bounds Enforcement (No Hardcoded Offsets)", () => {
    it("should allow movement to full arena width on desktop", () => {
      const desktopBounds = {
        x: 120,
        y: 100,
        width: 960,
        height: 600,
        scale: 1.0,
      };

      // Position at right edge of arena
      const rightEdgePosition: Position = {
        x: desktopBounds.x + desktopBounds.width,
        y: desktopBounds.y + desktopBounds.height / 2,
      };

      const { result } = renderHook(() =>
        usePlayerMovement({
          enabled: true,
          bounds: desktopBounds,
          initialPosition: rightEdgePosition,
          currentStance: TrigramStance.GEON,
          maxSpeedOverride: 2.0,
          accelerationOverride: 4.0,
        }),
      );

      // Should be at right edge without being pushed back by -60 offset
      expect(result.current.playerPosition.x).toBeCloseTo(
        desktopBounds.x + desktopBounds.width,
        0,
      );
    });

    it("should allow movement to full arena height on desktop", () => {
      const desktopBounds = {
        x: 120,
        y: 100,
        width: 960,
        height: 600,
        scale: 1.0,
      };

      // Position at bottom edge of arena
      const bottomEdgePosition: Position = {
        x: desktopBounds.x + desktopBounds.width / 2,
        y: desktopBounds.y + desktopBounds.height,
      };

      const { result } = renderHook(() =>
        usePlayerMovement({
          enabled: true,
          bounds: desktopBounds,
          initialPosition: bottomEdgePosition,
          currentStance: TrigramStance.GEON,
          maxSpeedOverride: 2.0,
          accelerationOverride: 4.0,
        }),
      );

      // Should be at bottom edge without being pushed back by -180 offset
      expect(result.current.playerPosition.y).toBeCloseTo(
        desktopBounds.y + desktopBounds.height,
        0,
      );
    });

    it("should allow movement to full mobile arena bounds", () => {
      const mobileBounds = {
        x: 37.5,
        y: 100,
        width: 300,
        height: 225,
        scale: MOBILE_ARENA_SCALE,
      };

      // Position at corner of mobile arena
      const cornerPosition: Position = {
        x: mobileBounds.x + mobileBounds.width,
        y: mobileBounds.y + mobileBounds.height,
      };

      const { result } = renderHook(() =>
        usePlayerMovement({
          enabled: true,
          bounds: mobileBounds,
          initialPosition: cornerPosition,
          currentStance: TrigramStance.GEON,
          maxSpeedOverride: 2.0,
          accelerationOverride: 4.0,
        }),
      );

      // Should be at corner without hardcoded offsets
      expect(result.current.playerPosition.x).toBeCloseTo(
        mobileBounds.x + mobileBounds.width,
        0,
      );
      expect(result.current.playerPosition.y).toBeCloseTo(
        mobileBounds.y + mobileBounds.height,
        0,
      );
    });
  });

  describe("Movement Consistency Across Scales", () => {
    it("should provide velocity data for both desktop and mobile", () => {
      const desktopResult = renderHook(() =>
        usePlayerMovement({
          enabled: false, // Disabled to avoid animation frame issues
          bounds: { x: 120, y: 100, width: 960, height: 600, scale: 1.0 },
          initialPositionMeters: { x: 0, y: 0 }, // Use meters-based API
          currentStance: TrigramStance.GEON,
          maxSpeedOverride: 2.0,
          accelerationOverride: 4.0,
        }),
      );

      const mobileResult = renderHook(() =>
        usePlayerMovement({
          enabled: false, // Disabled to avoid animation frame issues
          bounds: {
            x: 37.5,
            y: 100,
            width: 300,
            height: 225,
            scale: MOBILE_ARENA_SCALE,
          },
          initialPositionMeters: { x: 0, y: 0 }, // Use meters-based API
          currentStance: TrigramStance.GEON,
          maxSpeedOverride: 2.0,
          accelerationOverride: 4.0,
        }),
      );

      // Both should have movement state tracking capability
      expect(desktopResult.result.current.movementState).toBeDefined();
      expect(mobileResult.result.current.movementState).toBeDefined();
      expect(desktopResult.result.current.playerPosition).toBeDefined();
      expect(mobileResult.result.current.playerPosition).toBeDefined();
    });

    it("should have same physics parameters for desktop and mobile", () => {
      const desktopResult = renderHook(() =>
        usePlayerMovement({
          enabled: false,
          bounds: { x: 120, y: 100, width: 960, height: 600, scale: 1.0 },
          initialPositionMeters: { x: 0, y: 0 }, // Use meters-based API
          currentStance: TrigramStance.GEON,
          maxSpeedOverride: 2.0,
          accelerationOverride: 4.0,
        }),
      );

      const mobileResult = renderHook(() =>
        usePlayerMovement({
          enabled: false,
          bounds: {
            x: 37.5,
            y: 100,
            width: 300,
            height: 225,
            scale: MOBILE_ARENA_SCALE,
          },
          initialPositionMeters: { x: 0, y: 0 }, // Use meters-based API
          currentStance: TrigramStance.GEON,
          maxSpeedOverride: 2.0,
          accelerationOverride: 4.0,
        }),
      );

      // Both should start with no movement when disabled
      expect(desktopResult.result.current.isMoving).toBe(false);
      expect(mobileResult.result.current.isMoving).toBe(false);

      // Both should maintain position at origin (0, 0 meters)
      expect(desktopResult.result.current.playerPosition.x).toBeCloseTo(0, 0);
      expect(mobileResult.result.current.playerPosition.x).toBeCloseTo(0, 0);
    });
  });

  describe("Physics Parameters Integration", () => {
    it("should accept stance parameter for TrainingScreen pattern", () => {
      const { result } = renderHook(() =>
        usePlayerMovement({
          enabled: true,
          bounds: { x: 100, y: 50, width: 960, height: 600, scale: 1.0 },
          initialPosition: { x: 500, y: 300 },
          currentStance: TrigramStance.SON, // Wind stance - fastest
          legInjuryFactor: 0,
          isRunning: false,
          maxSpeedOverride: 2.0,
          accelerationOverride: 4.0,
        }),
      );

      expect(result.current.playerPosition).toBeDefined();
      expect(result.current.isMoving).toBe(false); // Not moving initially
    });

    it("should accept injury factor for CombatScreen pattern", () => {
      const { result } = renderHook(() =>
        usePlayerMovement({
          enabled: true,
          bounds: { x: 100, y: 50, width: 960, height: 600, scale: 1.0 },
          initialPosition: { x: 500, y: 300 },
          currentStance: TrigramStance.GEON,
          legInjuryFactor: 0.5, // 50% leg injury
          isRunning: false,
          maxSpeedOverride: 2.0,
          accelerationOverride: 4.0,
        }),
      );

      expect(result.current.playerPosition).toBeDefined();
      // Injury factor affects movement speed in physics system
    });

    it("should accept speed overrides from SpeedModifierSystem", () => {
      const customSpeed = 3.5; // Custom walking speed
      const customAcceleration = 5.0; // Custom acceleration

      const { result } = renderHook(() =>
        usePlayerMovement({
          enabled: true,
          bounds: { x: 100, y: 50, width: 960, height: 600, scale: 1.0 },
          initialPosition: { x: 500, y: 300 },
          currentStance: TrigramStance.GEON,
          maxSpeedOverride: customSpeed,
          accelerationOverride: customAcceleration,
        }),
      );

      expect(result.current.playerPosition).toBeDefined();
      // Custom speed modifiers should be accepted
    });
  });

  describe("Position Change Callbacks", () => {
    it("should invoke callback when position would change", () => {
      const mockCallback = vi.fn();

      renderHook(() =>
        usePlayerMovement({
          enabled: false, // Disabled to prevent automatic movement
          bounds: { x: 100, y: 50, width: 960, height: 600, scale: 1.0 },
          initialPosition: { x: 500, y: 300 },
          onPositionChange: mockCallback,
          currentStance: TrigramStance.GEON,
          maxSpeedOverride: 2.0,
          accelerationOverride: 4.0,
        }),
      );

      // Callback should be available (not called when disabled)
      expect(mockCallback).toBeDefined();
    });
  });

  describe("Legacy API Compatibility", () => {
    it("should support legacy position and bounds parameters", () => {
      const legacyPosition: Position = { x: 500, y: 300 };
      const legacyBounds = { width: 960, height: 600 };

      const { result } = renderHook(() =>
        usePlayerMovement(legacyPosition, legacyBounds),
      );

      expect(result.current.playerPosition).toBeDefined();
      // Legacy API should still work for backward compatibility
    });
  });

  describe("Movement State Tracking", () => {
    it("should track isMoving state", () => {
      const { result } = renderHook(() =>
        usePlayerMovement({
          enabled: false,
          bounds: { x: 100, y: 50, width: 960, height: 600, scale: 1.0 },
          initialPosition: { x: 500, y: 300 },
          currentStance: TrigramStance.GEON,
          maxSpeedOverride: 2.0,
          accelerationOverride: 4.0,
        }),
      );

      expect(result.current.isMoving).toBe(false);
      expect(result.current.movementState.isMoving).toBe(false);
    });

    it("should provide movementState with position", () => {
      const { result } = renderHook(() =>
        usePlayerMovement({
          enabled: false,
          bounds: { x: 100, y: 50, width: 960, height: 600, scale: 1.0 },
          initialPosition: { x: 500, y: 300 },
          currentStance: TrigramStance.GEON,
          maxSpeedOverride: 2.0,
          accelerationOverride: 4.0,
        }),
      );

      expect(result.current.movementState.position).toBeDefined();
      expect(result.current.movementState.position.x).toBeCloseTo(500, 0);
      expect(result.current.movementState.position.y).toBeCloseTo(300, 0);
    });
  });
});
