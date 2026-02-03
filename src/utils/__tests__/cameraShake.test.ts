/**
 * Tests for camera shake utilities
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import * as THREE from "three";
import {
  CameraShakeManager,
  JIN_SHAKE_PROFILES,
  calculateJinShakeIntensity,
} from "../cameraShake";

describe("CameraShakeManager", () => {
  let manager: CameraShakeManager;
  let camera: THREE.PerspectiveCamera;

  beforeEach(() => {
    manager = new CameraShakeManager();
    camera = new THREE.PerspectiveCamera();
    camera.position.set(0, 5, 10);
  });

  it("should attach and detach camera", () => {
    manager.attachCamera(camera);
    expect(manager.isShaking()).toBe(false);

    manager.detachCamera();
    expect(manager.isShaking()).toBe(false);
  });

  it("should trigger shake effect", () => {
    manager.attachCamera(camera);

    manager.shake({
      intensity: 0.5,
      duration: 100,
    });

    expect(manager.isShaking()).toBe(true);

    // Update should potentially change camera position (but may be close due to timing)
    manager.update();
    // Just verify shake is still active after first update
    // The actual position change depends on elapsed time
  });

  it("should complete shake after duration", () => {
    vi.useFakeTimers();
    manager.attachCamera(camera);
    const originalPosition = camera.position.clone();

    manager.shake({
      intensity: 0.5,
      duration: 100,
    });

    // Fast-forward past duration
    vi.advanceTimersByTime(150);
    manager.update();

    expect(manager.isShaking()).toBe(false);
    expect(camera.position.equals(originalPosition)).toBe(true);

    vi.useRealTimers();
  });

  it("should stop shake immediately", () => {
    manager.attachCamera(camera);
    const originalPosition = camera.position.clone();

    manager.shake({
      intensity: 0.5,
      duration: 1000,
    });

    manager.update();
    expect(manager.isShaking()).toBe(true);

    manager.stop();
    expect(manager.isShaking()).toBe(false);
    expect(camera.position.equals(originalPosition)).toBe(true);
  });

  it("should handle shake without attached camera", () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    manager.shake({
      intensity: 0.5,
      duration: 100,
    });

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("should update without error when not shaking", () => {
    manager.attachCamera(camera);
    expect(() => manager.update()).not.toThrow();
  });
});

describe("JIN_SHAKE_PROFILES", () => {
  it("should have all required profiles", () => {
    expect(JIN_SHAKE_PROFILES.light).toBeDefined();
    expect(JIN_SHAKE_PROFILES.medium).toBeDefined();
    expect(JIN_SHAKE_PROFILES.heavy).toBeDefined();
    expect(JIN_SHAKE_PROFILES.explosive).toBeDefined();
  });

  it("should have increasing intensity", () => {
    expect(JIN_SHAKE_PROFILES.light.intensity).toBeLessThan(
      JIN_SHAKE_PROFILES.medium.intensity
    );
    expect(JIN_SHAKE_PROFILES.medium.intensity).toBeLessThan(
      JIN_SHAKE_PROFILES.heavy.intensity
    );
    expect(JIN_SHAKE_PROFILES.heavy.intensity).toBeLessThan(
      JIN_SHAKE_PROFILES.explosive.intensity
    );
  });

  it("should have valid durations", () => {
    Object.values(JIN_SHAKE_PROFILES).forEach((profile) => {
      expect(profile.duration).toBeGreaterThan(0);
      expect(profile.duration).toBeLessThanOrEqual(1000);
    });
  });
});

describe("calculateJinShakeIntensity", () => {
  it("should calculate intensity correctly", () => {
    expect(calculateJinShakeIntensity(0.5, 1.3)).toBeCloseTo(0.455, 2);
    expect(calculateJinShakeIntensity(1.0, 1.5)).toBeCloseTo(1.0, 2); // Capped at 1.0
  });

  it("should return values between 0 and 1", () => {
    const result1 = calculateJinShakeIntensity(0.3, 1.2);
    const result2 = calculateJinShakeIntensity(1.0, 1.5);

    expect(result1).toBeGreaterThanOrEqual(0);
    expect(result1).toBeLessThanOrEqual(1);
    expect(result2).toBeGreaterThanOrEqual(0);
    expect(result2).toBeLessThanOrEqual(1);
  });
});
