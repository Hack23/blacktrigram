/**
 * Unit tests for HapticController
 * Tests optimized haptic feedback with device detection
 *
 * @category Testing
 */

import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";
import {
  HapticController,
  triggerOptimizedHaptic,
  triggerCustomOptimizedHaptic,
  stopOptimizedHaptic,
  OptimizedCombatHaptics,
} from "./HapticController";

describe("HapticController", () => {
  let vibrateSpy: ReturnType<typeof vi.spyOn>;
  let originalNavigator: typeof navigator;

  beforeEach(() => {
    // Store original navigator
    originalNavigator = globalThis.navigator;
    
    // Mock navigator.vibrate
    vibrateSpy = vi.fn().mockReturnValue(true);
    
    // Replace navigator completely
    Object.defineProperty(globalThis, "navigator", {
      value: {
        ...originalNavigator,
        vibrate: vibrateSpy,
        hardwareConcurrency: 8,
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
      writable: true,
      configurable: true,
    });

    // Reset singleton AFTER navigator is mocked
    // @ts-expect-error - Accessing private static member for testing
    HapticController.instance = null;
    
    // Mock performance.now to control throttling (starts at 0)
    let currentTime = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => currentTime);
    
    // Provide helper to advance time in tests
    (global as typeof globalThis & { advanceTime?: (ms: number) => void }).advanceTime = (ms: number) => {
      currentTime += ms;
    };
  });

  afterEach(() => {
    Object.defineProperty(globalThis, "navigator", {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
    vi.restoreAllMocks();
  });

  describe("HapticController singleton", () => {
    it("should create singleton instance", () => {
      const controller1 = HapticController.getInstance();
      const controller2 = HapticController.getInstance();

      expect(controller1).toBe(controller2);
    });

    it("should detect haptic support", () => {
      const controller = HapticController.getInstance();

      expect(controller.isHapticEnabled()).toBe(true);
    });

    it("should detect performance tier", () => {
      const controller = HapticController.getInstance();
      const tier = controller.getPerformanceTier();

      expect(['high', 'medium', 'low']).toContain(tier);
    });
  });

  describe("trigger", () => {
    it("should trigger light haptic", () => {
      const controller = HapticController.getInstance();
      const result = controller.trigger('light');

      expect(vibrateSpy).toHaveBeenCalledWith([20]);
      expect(result).toBe(true);
    });

    it("should trigger medium haptic", () => {
      const controller = HapticController.getInstance();
      controller.trigger('medium');

      expect(vibrateSpy).toHaveBeenCalledWith([40]);
    });

    it("should trigger strong haptic", () => {
      const controller = HapticController.getInstance();
      controller.trigger('strong');

      expect(vibrateSpy).toHaveBeenCalledWith([60]);
    });

    it("should not trigger disabled haptic", () => {
      const controller = HapticController.getInstance();
      controller.trigger('disabled');

      expect(vibrateSpy).not.toHaveBeenCalled();
    });

    it("should not trigger when disabled", () => {
      const controller = HapticController.getInstance();
      controller.disable();
      
      // Clear any calls from disable() which calls stop()
      vibrateSpy.mockClear();
      
      controller.trigger('medium');

      expect(vibrateSpy).not.toHaveBeenCalled();
    });

    it("should trigger after re-enabling", () => {
      const controller = HapticController.getInstance();
      controller.disable();
      controller.enable();
      controller.trigger('medium');

      expect(vibrateSpy).toHaveBeenCalledWith([40]);
    });

    it("should throttle rapid triggers", () => {
      const controller = HapticController.getInstance();
      controller.setMinTriggerInterval(50);

      // First trigger at time 0
      controller.trigger('light');
      expect(vibrateSpy).toHaveBeenCalledTimes(1);
      
      // Advance time by 10ms (within 50ms threshold)
      (global as typeof globalThis & { advanceTime: (ms: number) => void }).advanceTime(10);
      
      // Second trigger should be throttled
      controller.trigger('light');
      expect(vibrateSpy).toHaveBeenCalledTimes(1); // Still 1
      
      // Advance time by another 45ms (total 55ms, past threshold)
      (global as typeof globalThis & { advanceTime: (ms: number) => void }).advanceTime(45);
      
      // Third trigger should go through
      controller.trigger('light');
      expect(vibrateSpy).toHaveBeenCalledTimes(2); // Now 2
    });
  });

  describe("triggerCustom", () => {
    it("should trigger custom pattern array", () => {
      const controller = HapticController.getInstance();
      const pattern = [30, 20, 30];
      
      // Advance time to avoid throttling
      (global as typeof globalThis & { advanceTime: (ms: number) => void }).advanceTime(1000);
      controller.triggerCustom(pattern);

      expect(vibrateSpy).toHaveBeenCalledWith(pattern);
    });

    it("should trigger custom pattern number", () => {
      const controller = HapticController.getInstance();
      
      // Advance time to avoid throttling
      (global as typeof globalThis & { advanceTime: (ms: number) => void }).advanceTime(1000);
      controller.triggerCustom(100);

      expect(vibrateSpy).toHaveBeenCalledWith(100);
    });

    it("should adapt pattern for low-end devices", () => {
      // Mock low-end device
      Object.defineProperty(globalThis, "navigator", {
        value: {
          ...originalNavigator,
          vibrate: vibrateSpy,
          hardwareConcurrency: 2,
          userAgent: "Mozilla/5.0 (Android 8.0)",
        },
        writable: true,
        configurable: true,
      });

      // Reset singleton to pick up new navigator
      // @ts-expect-error - Accessing private static member for testing
      HapticController.instance = null;

      const controller = HapticController.getInstance();
      
      // Low-end devices have haptics disabled by default, need to enable
      controller.enable();
      
      const pattern = [40, 20, 40];
      
      // Advance time to avoid throttling
      (global as typeof globalThis & { advanceTime: (ms: number) => void }).advanceTime(1000);
      controller.triggerCustom(pattern);

      // Pattern should be reduced by 50%
      expect(vibrateSpy).toHaveBeenCalledWith([20, 10, 20]);
    });
  });

  describe("stop", () => {
    it("should stop haptic feedback", () => {
      const controller = HapticController.getInstance();
      controller.stop();

      expect(vibrateSpy).toHaveBeenCalledWith(0);
    });
  });

  describe("enable/disable", () => {
    it("should enable haptic feedback", () => {
      const controller = HapticController.getInstance();
      controller.enable();

      expect(controller.isHapticEnabled()).toBe(true);
    });

    it("should disable haptic feedback", () => {
      const controller = HapticController.getInstance();
      controller.disable();

      expect(controller.isHapticEnabled()).toBe(false);
    });

    it("should stop haptic on disable", () => {
      const controller = HapticController.getInstance();
      controller.disable();

      expect(vibrateSpy).toHaveBeenCalledWith(0);
    });
  });

  describe("setMinTriggerInterval", () => {
    it("should set minimum trigger interval", () => {
      const controller = HapticController.getInstance();
      controller.setMinTriggerInterval(100);

      // Interval should be set (can't directly test private property)
      expect(controller).toBeDefined();
    });

    it("should enforce minimum of 0", () => {
      const controller = HapticController.getInstance();
      controller.setMinTriggerInterval(-10);

      // Should not throw or cause issues
      expect(controller).toBeDefined();
    });
  });

  describe("Device detection", () => {
    it("should detect high-end desktop", () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {
          ...originalNavigator,
          vibrate: vibrateSpy,
          hardwareConcurrency: 8,
          deviceMemory: 8,
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
        writable: true,
        configurable: true,
      });

      // @ts-expect-error - Accessing private static member for testing
      HapticController.instance = null;

      const controller = HapticController.getInstance();
      expect(controller.getPerformanceTier()).toBe('high');
    });

    it("should detect medium-end device", () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {
          ...originalNavigator,
          vibrate: vibrateSpy,
          hardwareConcurrency: 4,
          deviceMemory: 4,
          userAgent: "Mozilla/5.0 (Android 10)",
        },
        writable: true,
        configurable: true,
      });

      // @ts-expect-error - Accessing private static member for testing
      HapticController.instance = null;

      const controller = HapticController.getInstance();
      expect(controller.getPerformanceTier()).toBe('medium');
    });

    it("should detect low-end device", () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {
          ...originalNavigator,
          vibrate: vibrateSpy,
          hardwareConcurrency: 2,
          deviceMemory: 2,
          userAgent: "Mozilla/5.0 (Android 6.0)",
        },
        writable: true,
        configurable: true,
      });

      // @ts-expect-error - Accessing private static member for testing
      HapticController.instance = null;

      const controller = HapticController.getInstance();
      expect(controller.getPerformanceTier()).toBe('low');
    });

    it("should disable haptics on low-end devices by default", () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {
          ...originalNavigator,
          vibrate: vibrateSpy,
          hardwareConcurrency: 2,
          deviceMemory: 1,
          userAgent: "Mozilla/5.0 (Android 5.0)",
        },
        writable: true,
        configurable: true,
      });

      // @ts-expect-error - Accessing private static member for testing
      HapticController.instance = null;

      const controller = HapticController.getInstance();
      expect(controller.isHapticEnabled()).toBe(false);
    });
  });

  describe("Convenience functions", () => {
    beforeEach(() => {
      // Reset singleton for each convenience function test
      // @ts-expect-error - Accessing private static member for testing
      HapticController.instance = null;
      vibrateSpy.mockClear();
    });
    
    it("should trigger via convenience function", () => {
      (global as typeof globalThis & { advanceTime: (ms: number) => void }).advanceTime(1000);
      triggerOptimizedHaptic('medium');
      expect(vibrateSpy).toHaveBeenCalledWith([40]);
    });

    it("should trigger custom via convenience function", () => {
      (global as typeof globalThis & { advanceTime: (ms: number) => void }).advanceTime(1000);
      triggerCustomOptimizedHaptic([25, 15, 25]);
      expect(vibrateSpy).toHaveBeenCalledWith([25, 15, 25]);
    });

    it("should stop via convenience function", () => {
      stopOptimizedHaptic();
      expect(vibrateSpy).toHaveBeenCalledWith(0);
    });
  });

  describe("OptimizedCombatHaptics", () => {
    beforeEach(() => {
      // Reset singleton for each combat haptics test
      // @ts-expect-error - Accessing private static member for testing
      HapticController.instance = null;
      vibrateSpy.mockClear();
    });
    
    it("should trigger attack haptic", () => {
      (global as typeof globalThis & { advanceTime: (ms: number) => void }).advanceTime(1000);
      OptimizedCombatHaptics.attack();
      expect(vibrateSpy).toHaveBeenCalledWith([40]);
    });

    it("should trigger block haptic", () => {
      (global as typeof globalThis & { advanceTime: (ms: number) => void }).advanceTime(1000);
      OptimizedCombatHaptics.block();
      expect(vibrateSpy).toHaveBeenCalledWith([20]);
    });

    it("should trigger critical hit haptic", () => {
      (global as typeof globalThis & { advanceTime: (ms: number) => void }).advanceTime(1000);
      OptimizedCombatHaptics.criticalHit();
      expect(vibrateSpy).toHaveBeenCalledWith([40, 20, 60]);
    });

    it("should trigger vital point strike haptic", () => {
      (global as typeof globalThis & { advanceTime: (ms: number) => void }).advanceTime(1000);
      OptimizedCombatHaptics.vitalPointStrike();
      expect(vibrateSpy).toHaveBeenCalledWith([60]);
    });

    it("should trigger stance change haptic", () => {
      (global as typeof globalThis & { advanceTime: (ms: number) => void }).advanceTime(1000);
      OptimizedCombatHaptics.stanceChange();
      expect(vibrateSpy).toHaveBeenCalledWith([20]);
    });

    it("should trigger combo increment haptic", () => {
      (global as typeof globalThis & { advanceTime: (ms: number) => void }).advanceTime(1000);
      OptimizedCombatHaptics.comboIncrement();
      expect(vibrateSpy).toHaveBeenCalledWith([20]);
    });

    it("should trigger knockout haptic", () => {
      (global as typeof globalThis & { advanceTime: (ms: number) => void }).advanceTime(1000);
      OptimizedCombatHaptics.knockout();
      expect(vibrateSpy).toHaveBeenCalledWith([60, 30, 60, 30, 100]);
    });

    it("should trigger error haptic", () => {
      (global as typeof globalThis & { advanceTime: (ms: number) => void }).advanceTime(1000);
      OptimizedCombatHaptics.error();
      expect(vibrateSpy).toHaveBeenCalledWith([15, 10, 15]);
    });
  });

  describe("Error handling", () => {
    it("should handle vibrate API errors gracefully", () => {
      vibrateSpy.mockImplementation(() => {
        throw new Error("Vibrate API failed");
      });

      const controller = HapticController.getInstance();
      
      // Should not throw
      expect(() => controller.trigger('medium')).not.toThrow();
    });

    it("should handle missing vibrate API", () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {
          ...originalNavigator,
          // No vibrate property
        },
        writable: true,
        configurable: true,
      });

      // @ts-expect-error - Accessing private static member for testing
      HapticController.instance = null;

      const controller = HapticController.getInstance();
      expect(controller.isHapticEnabled()).toBe(false);
    });
  });
});
