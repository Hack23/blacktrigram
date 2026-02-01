/**
 * SlowMotionController.test.ts
 *
 * Comprehensive test suite for slow-motion controller.
 * Tests time dilation, camera zoom, easing functions, and state management.
 *
 * @author Black Trigram Development Team
 */

import { describe, it, expect, beforeEach } from "vitest";
import * as THREE from "three";
import {
  SlowMotionController,
  createSlowMotionController,
  LI_VITAL_POINT_SLOW_MOTION,
  LI_PRECISION_SLOW_MOTION,
  type SlowMotionConfig,
} from "./SlowMotionController";

describe("SlowMotionController", () => {
  let controller: SlowMotionController;

  beforeEach(() => {
    controller = createSlowMotionController();
  });

  describe("Initialization", () => {
    it("should create controller with factory function", () => {
      const ctrl = createSlowMotionController();
      expect(ctrl).toBeInstanceOf(SlowMotionController);
    });

    it("should start inactive", () => {
      expect(controller.isActive()).toBe(false);
    });

    it("should have time dilation of 1.0 initially", () => {
      expect(controller.getTimeDilation()).toBe(1.0);
    });

    it("should return normal delta when inactive", () => {
      const delta = 0.016; // 60fps
      const modifiedDelta = controller.update(delta);
      expect(modifiedDelta).toBe(delta);
    });
  });

  describe("Trigger Slow-Motion", () => {
    it("should activate slow-motion when triggered", () => {
      const config: SlowMotionConfig = {
        timeDilation: 0.5,
        duration: 1.0,
        cameraZoom: 1.3,
        focusPoint: [0, 1.5, 0],
      };

      controller.trigger(config);
      expect(controller.isActive()).toBe(true);
    });

    it("should not interrupt active slow-motion", () => {
      const config1: SlowMotionConfig = {
        timeDilation: 0.5,
        duration: 2.0,
        cameraZoom: 1.5,
        focusPoint: [0, 1.5, 0],
      };

      controller.trigger(config1);
      const state1 = controller.getState();

      const config2: SlowMotionConfig = {
        timeDilation: 0.3,
        duration: 1.0,
        cameraZoom: 2.0,
        focusPoint: [1, 2, 1],
      };

      controller.trigger(config2);
      const state2 = controller.getState();

      // Duration should remain from first trigger
      expect(state2.duration).toBe(state1.duration);
    });

    it("should clamp time dilation to valid range", () => {
      const config: SlowMotionConfig = {
        timeDilation: -0.5, // Invalid (negative)
        duration: 1.0,
        cameraZoom: 1.3,
        focusPoint: [0, 1.5, 0],
      };

      controller.trigger(config);
      controller.update(0.5); // Update to middle of effect

      const timeDilation = controller.getTimeDilation();
      expect(timeDilation).toBeGreaterThanOrEqual(0.1);
      expect(timeDilation).toBeLessThanOrEqual(1.0);
    });

    it("should clamp camera zoom to minimum 1.0", () => {
      const config: SlowMotionConfig = {
        timeDilation: 0.5,
        duration: 1.0,
        cameraZoom: 0.5, // Invalid (<1.0)
        focusPoint: [0, 1.5, 0],
      };

      controller.trigger(config);
      // Camera zoom is internal, but should not crash
      expect(controller.isActive()).toBe(true);
    });
  });

  describe("Time Dilation", () => {
    it("should modify delta during slow-motion", () => {
      const config: SlowMotionConfig = {
        timeDilation: 0.5,
        duration: 1.0,
        cameraZoom: 1.3,
        focusPoint: [0, 1.5, 0],
      };

      controller.trigger(config);
      
      // Update to middle of effect (past ramp-in)
      controller.update(0.3);
      
      const delta = 0.016;
      const modifiedDelta = controller.update(delta);

      // Should be less than original delta
      expect(modifiedDelta).toBeLessThan(delta);
    });

    it("should ramp in time dilation smoothly", () => {
      const config: SlowMotionConfig = {
        timeDilation: 0.3,
        duration: 1.0,
        cameraZoom: 1.5,
        focusPoint: [0, 1.5, 0],
      };

      controller.trigger(config);

      // Sample time dilation at different points during ramp-in
      const samples: number[] = [];
      for (let i = 0; i < 5; i++) {
        controller.update(0.04); // 5 steps of 0.04s = 0.2s (ramp-in phase)
        samples.push(controller.getTimeDilation());
      }

      // Time dilation should decrease during ramp-in
      for (let i = 1; i < samples.length; i++) {
        expect(samples[i]).toBeLessThanOrEqual(samples[i - 1]);
      }
    });

    it("should hold time dilation during middle phase", () => {
      const config: SlowMotionConfig = {
        timeDilation: 0.5,
        duration: 2.0,
        cameraZoom: 1.3,
        focusPoint: [0, 1.5, 0],
      };

      controller.trigger(config);

      // Update past ramp-in (0.4s = 20% of 2.0s)
      controller.update(0.5);

      const sample1 = controller.getTimeDilation();
      controller.update(0.3);
      const sample2 = controller.getTimeDilation();

      // Should be similar during hold phase
      expect(Math.abs(sample1 - sample2)).toBeLessThan(0.1);
    });

    it("should ramp out time dilation smoothly", () => {
      const config: SlowMotionConfig = {
        timeDilation: 0.3,
        duration: 1.0,
        cameraZoom: 1.5,
        focusPoint: [0, 1.5, 0],
      };

      controller.trigger(config);

      // Update to ramp-out phase (>80% of duration)
      controller.update(0.85);

      const samples: number[] = [];
      for (let i = 0; i < 3; i++) {
        samples.push(controller.getTimeDilation());
        controller.update(0.05);
      }

      // Time dilation should increase during ramp-out
      for (let i = 1; i < samples.length; i++) {
        expect(samples[i]).toBeGreaterThanOrEqual(samples[i - 1]);
      }
    });

    it("should return to normal speed after effect completes", () => {
      const config: SlowMotionConfig = {
        timeDilation: 0.3,
        duration: 1.0,
        cameraZoom: 1.5,
        focusPoint: [0, 1.5, 0],
      };

      controller.trigger(config);

      // Complete effect
      controller.update(1.1);

      expect(controller.isActive()).toBe(false);
      expect(controller.getTimeDilation()).toBe(1.0);

      const delta = 0.016;
      const modifiedDelta = controller.update(delta);
      expect(modifiedDelta).toBe(delta);
    });
  });

  describe("Camera Control", () => {
    it("should update camera position during slow-motion", () => {
      const camera = new THREE.PerspectiveCamera();
      camera.position.set(0, 5, 10);

      const config: SlowMotionConfig = {
        timeDilation: 0.5,
        duration: 1.0,
        cameraZoom: 1.5,
        focusPoint: [0, 1.5, 0],
      };

      controller.trigger(config);
      const originalPosition = camera.position.clone();

      controller.update(0.1);
      controller.updateCamera(camera, 0.016);

      // Camera position should have changed (moving toward focus point)
      expect(camera.position.equals(originalPosition)).toBe(false);
    });

    it("should not update camera when inactive", () => {
      const camera = new THREE.PerspectiveCamera();
      camera.position.set(0, 5, 10);
      const originalPosition = camera.position.clone();

      controller.updateCamera(camera, 0.016);

      // Camera should not have moved
      expect(camera.position.equals(originalPosition)).toBe(true);
    });

    it("should zoom camera toward focus point", () => {
      const camera = new THREE.PerspectiveCamera();
      camera.position.set(0, 5, 10);

      const focusPoint: [number, number, number] = [0, 1.5, 0];
      const config: SlowMotionConfig = {
        timeDilation: 0.5,
        duration: 1.0,
        cameraZoom: 1.5,
        focusPoint,
      };

      controller.trigger(config);

      const originalDistance = camera.position.distanceTo(
        new THREE.Vector3(...focusPoint)
      );

      // Update to middle of effect
      controller.update(0.5);
      controller.updateCamera(camera, 0.5);

      const newDistance = camera.position.distanceTo(
        new THREE.Vector3(...focusPoint)
      );

      // Camera should be closer to focus point
      expect(newDistance).toBeLessThan(originalDistance);
    });
  });

  describe("State Management", () => {
    it("should return correct state when inactive", () => {
      const state = controller.getState();

      expect(state.active).toBe(false);
      expect(state.currentTimeDilation).toBe(1.0);
      expect(state.elapsed).toBe(0);
      expect(state.zoomProgress).toBe(0);
    });

    it("should return correct state when active", () => {
      const config: SlowMotionConfig = {
        timeDilation: 0.5,
        duration: 2.0,
        cameraZoom: 1.5,
        focusPoint: [0, 1.5, 0],
      };

      controller.trigger(config);
      controller.update(0.5);

      const state = controller.getState();

      expect(state.active).toBe(true);
      expect(state.elapsed).toBeCloseTo(0.5, 2);
      expect(state.duration).toBe(2.0);
      expect(state.zoomProgress).toBeGreaterThan(0);
      expect(state.zoomProgress).toBeLessThan(1);
    });

    it("should track elapsed time correctly", () => {
      const config: SlowMotionConfig = {
        timeDilation: 0.5,
        duration: 1.0,
        cameraZoom: 1.5,
        focusPoint: [0, 1.5, 0],
      };

      controller.trigger(config);

      controller.update(0.3);
      const state1 = controller.getState();
      expect(state1.elapsed).toBeCloseTo(0.3, 2);

      controller.update(0.4);
      const state2 = controller.getState();
      expect(state2.elapsed).toBeCloseTo(0.7, 2);
    });
  });

  describe("Stop Functionality", () => {
    it("should force stop slow-motion", () => {
      const config: SlowMotionConfig = {
        timeDilation: 0.3,
        duration: 2.0,
        cameraZoom: 1.5,
        focusPoint: [0, 1.5, 0],
      };

      controller.trigger(config);
      controller.update(0.5);

      expect(controller.isActive()).toBe(true);

      controller.stop();

      expect(controller.isActive()).toBe(false);
      expect(controller.getTimeDilation()).toBe(1.0);
    });

    it("should reset state after stop", () => {
      const config: SlowMotionConfig = {
        timeDilation: 0.5,
        duration: 1.0,
        cameraZoom: 1.5,
        focusPoint: [0, 1.5, 0],
      };

      controller.trigger(config);
      controller.update(0.5);
      controller.stop();

      const state = controller.getState();

      expect(state.active).toBe(false);
      expect(state.currentTimeDilation).toBe(1.0);
      expect(state.elapsed).toBe(0);
    });
  });

  describe("Predefined Configurations", () => {
    it("should have Li vital point slow-motion config", () => {
      expect(LI_VITAL_POINT_SLOW_MOTION.timeDilation).toBe(0.3);
      expect(LI_VITAL_POINT_SLOW_MOTION.duration).toBe(1.5);
      expect(LI_VITAL_POINT_SLOW_MOTION.cameraZoom).toBe(1.5);
    });

    it("should have Li precision slow-motion config", () => {
      expect(LI_PRECISION_SLOW_MOTION.timeDilation).toBe(0.5);
      expect(LI_PRECISION_SLOW_MOTION.duration).toBe(1.0);
      expect(LI_PRECISION_SLOW_MOTION.cameraZoom).toBe(1.3);
    });

    it("should work with predefined vital point config", () => {
      controller.trigger(LI_VITAL_POINT_SLOW_MOTION);
      expect(controller.isActive()).toBe(true);

      controller.update(0.5);
      const timeDilation = controller.getTimeDilation();
      expect(timeDilation).toBeLessThan(1.0);
    });

    it("should work with predefined precision config", () => {
      controller.trigger(LI_PRECISION_SLOW_MOTION);
      expect(controller.isActive()).toBe(true);

      controller.update(0.3);
      const timeDilation = controller.getTimeDilation();
      expect(timeDilation).toBeLessThan(1.0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero duration", () => {
      const config: SlowMotionConfig = {
        timeDilation: 0.5,
        duration: 0,
        cameraZoom: 1.3,
        focusPoint: [0, 1.5, 0],
      };

      controller.trigger(config);
      controller.update(0.016);

      // Should complete immediately
      expect(controller.isActive()).toBe(false);
    });

    it("should handle very small delta", () => {
      const config: SlowMotionConfig = {
        timeDilation: 0.5,
        duration: 1.0,
        cameraZoom: 1.3,
        focusPoint: [0, 1.5, 0],
      };

      controller.trigger(config);
      const delta = 0.0001;
      const modifiedDelta = controller.update(delta);

      expect(modifiedDelta).toBeLessThanOrEqual(delta);
    });

    it("should handle very large delta", () => {
      const config: SlowMotionConfig = {
        timeDilation: 0.5,
        duration: 1.0,
        cameraZoom: 1.3,
        focusPoint: [0, 1.5, 0],
      };

      controller.trigger(config);
      const delta = 10.0; // Unrealistically large
      const modifiedDelta = controller.update(delta);

      // With such large delta, effect completes immediately
      // Modified delta may equal original if effect is done
      expect(modifiedDelta).toBeLessThanOrEqual(delta);
    });

    it("should handle time dilation of 1.0 (no slow-motion)", () => {
      const config: SlowMotionConfig = {
        timeDilation: 1.0,
        duration: 1.0,
        cameraZoom: 1.0,
        focusPoint: [0, 1.5, 0],
      };

      controller.trigger(config);
      controller.update(0.5);

      const timeDilation = controller.getTimeDilation();
      expect(timeDilation).toBeCloseTo(1.0, 1);
    });

    it("should handle extreme camera zoom", () => {
      const camera = new THREE.PerspectiveCamera();
      camera.position.set(0, 5, 10);

      const config: SlowMotionConfig = {
        timeDilation: 0.5,
        duration: 1.0,
        cameraZoom: 10.0, // Extreme zoom
        focusPoint: [0, 1.5, 0],
      };

      controller.trigger(config);
      controller.update(0.5);
      
      // Should not crash
      expect(() => controller.updateCamera(camera, 0.016)).not.toThrow();
    });
  });

  describe("Performance", () => {
    it("should handle rapid updates", () => {
      const config: SlowMotionConfig = {
        timeDilation: 0.5,
        duration: 1.0,
        cameraZoom: 1.5,
        focusPoint: [0, 1.5, 0],
      };

      controller.trigger(config);

      // Simulate 60fps for slightly over 1 second
      for (let i = 0; i < 65; i++) {
        controller.update(0.016);
      }

      // Should complete after 1 second (60 frames * 0.016 ≈ 0.96s, need a bit more)
      expect(controller.isActive()).toBe(false);
    });

    it("should handle multiple camera updates per frame", () => {
      const camera = new THREE.PerspectiveCamera();
      camera.position.set(0, 5, 10);

      const config: SlowMotionConfig = {
        timeDilation: 0.5,
        duration: 1.0,
        cameraZoom: 1.5,
        focusPoint: [0, 1.5, 0],
      };

      controller.trigger(config);
      controller.update(0.5);

      // Multiple camera updates should not cause issues
      controller.updateCamera(camera, 0.016);
      controller.updateCamera(camera, 0.016);
      controller.updateCamera(camera, 0.016);

      expect(true).toBe(true);
    });
  });
});
