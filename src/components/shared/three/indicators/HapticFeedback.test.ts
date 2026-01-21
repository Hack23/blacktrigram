/**
 * Tests for HapticFeedback
 * 
 * Verifies haptic feedback functionality for combat UI interactions
 * 
 * @module components/shared/three/indicators/HapticFeedback.test
 * @category Combat UI Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  isHapticSupported,
  triggerGuardHaptic,
  triggerStanceChangeHaptic,
  triggerCustomHaptic,
  stopHaptic,
  isMobileDevice,
  applyIntensity,
  triggerWithSettings,
  DEFAULT_HAPTIC_SETTINGS,
  type HapticSettings,
} from "./HapticFeedback";

describe("HapticFeedback", () => {
  // Mock navigator.vibrate
  const mockVibrate = vi.fn();
  const originalNavigator = global.navigator;

  beforeEach(() => {
    mockVibrate.mockClear();
    
    // Mock navigator with vibrate support
    Object.defineProperty(global, "navigator", {
      value: {
        ...originalNavigator,
        vibrate: mockVibrate,
        userAgent: "Mozilla/5.0 (X11; Linux x86_64)",
      },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    // Restore original navigator
    Object.defineProperty(global, "navigator", {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
  });

  describe("isHapticSupported", () => {
    it("should return true when vibrate API is available", () => {
      expect(isHapticSupported()).toBe(true);
    });

    it("should return false when vibrate API is not available", () => {
      Object.defineProperty(global, "navigator", {
        value: {
          ...originalNavigator,
          vibrate: undefined,
        },
        writable: true,
        configurable: true,
      });

      expect(isHapticSupported()).toBe(false);
    });

    it("should return false when navigator is not available", () => {
      Object.defineProperty(global, "navigator", {
        value: undefined,
        writable: true,
        configurable: true,
      });

      expect(isHapticSupported()).toBe(false);
    });
  });

  describe("triggerGuardHaptic", () => {
    it("should trigger light vibration (50ms) for activate", () => {
      triggerGuardHaptic("activate");
      expect(mockVibrate).toHaveBeenCalledWith(50);
    });

    it("should trigger strong pulse pattern for break", () => {
      triggerGuardHaptic("break");
      expect(mockVibrate).toHaveBeenCalledWith([100, 50, 100]);
    });

    it("should not vibrate if haptic is not supported", () => {
      Object.defineProperty(global, "navigator", {
        value: {
          ...originalNavigator,
          vibrate: undefined,
        },
        writable: true,
        configurable: true,
      });

      triggerGuardHaptic("activate");
      expect(mockVibrate).not.toHaveBeenCalled();
    });

    it("should handle vibration API errors gracefully", () => {
      mockVibrate.mockImplementation(() => {
        throw new Error("Vibration not allowed");
      });

      // Should not throw
      expect(() => triggerGuardHaptic("activate")).not.toThrow();
    });
  });

  describe("triggerStanceChangeHaptic", () => {
    it("should trigger medium vibration (75ms)", () => {
      triggerStanceChangeHaptic();
      expect(mockVibrate).toHaveBeenCalledWith(75);
    });

    it("should not vibrate if haptic is not supported", () => {
      Object.defineProperty(global, "navigator", {
        value: {
          ...originalNavigator,
          vibrate: undefined,
        },
        writable: true,
        configurable: true,
      });

      triggerStanceChangeHaptic();
      expect(mockVibrate).not.toHaveBeenCalled();
    });

    it("should handle vibration API errors gracefully", () => {
      mockVibrate.mockImplementation(() => {
        throw new Error("Vibration not allowed");
      });

      // Should not throw
      expect(() => triggerStanceChangeHaptic()).not.toThrow();
    });
  });

  describe("triggerCustomHaptic", () => {
    it("should trigger single duration vibration", () => {
      triggerCustomHaptic(200);
      expect(mockVibrate).toHaveBeenCalledWith(200);
    });

    it("should trigger pattern vibration", () => {
      const pattern = [100, 50, 100, 50, 100];
      triggerCustomHaptic(pattern);
      expect(mockVibrate).toHaveBeenCalledWith(pattern);
    });

    it("should not vibrate if haptic is not supported", () => {
      Object.defineProperty(global, "navigator", {
        value: {
          ...originalNavigator,
          vibrate: undefined,
        },
        writable: true,
        configurable: true,
      });

      triggerCustomHaptic(100);
      expect(mockVibrate).not.toHaveBeenCalled();
    });

    it("should handle vibration API errors gracefully", () => {
      mockVibrate.mockImplementation(() => {
        throw new Error("Vibration not allowed");
      });

      // Should not throw
      expect(() => triggerCustomHaptic(100)).not.toThrow();
    });
  });

  describe("stopHaptic", () => {
    it("should stop vibration by passing 0", () => {
      stopHaptic();
      expect(mockVibrate).toHaveBeenCalledWith(0);
    });

    it("should not call vibrate if haptic is not supported", () => {
      Object.defineProperty(global, "navigator", {
        value: {
          ...originalNavigator,
          vibrate: undefined,
        },
        writable: true,
        configurable: true,
      });

      stopHaptic();
      expect(mockVibrate).not.toHaveBeenCalled();
    });

    it("should handle vibration API errors gracefully", () => {
      mockVibrate.mockImplementation(() => {
        throw new Error("Vibration not allowed");
      });

      // Should not throw
      expect(() => stopHaptic()).not.toThrow();
    });
  });

  describe("isMobileDevice", () => {
    beforeEach(() => {
      // Mock window object
      Object.defineProperty(global, "window", {
        value: {
          innerWidth: 375, // Mobile width
        },
        writable: true,
        configurable: true,
      });

      // Mock navigator with touch support
      Object.defineProperty(global, "navigator", {
        value: {
          ...originalNavigator,
          vibrate: mockVibrate,
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
          maxTouchPoints: 5,
        },
        writable: true,
        configurable: true,
      });
    });

    it("should return true for iPhone user agent with touch", () => {
      expect(isMobileDevice()).toBe(true);
    });

    it("should return true for Android user agent with touch", () => {
      Object.defineProperty(global, "navigator", {
        value: {
          ...originalNavigator,
          vibrate: mockVibrate,
          userAgent: "Mozilla/5.0 (Linux; Android 10)",
          maxTouchPoints: 5,
        },
        writable: true,
        configurable: true,
      });

      expect(isMobileDevice()).toBe(true);
    });

    it("should return false for desktop without touch", () => {
      Object.defineProperty(global, "window", {
        value: {
          innerWidth: 1920, // Desktop width
        },
        writable: true,
        configurable: true,
      });

      Object.defineProperty(global, "navigator", {
        value: {
          ...originalNavigator,
          vibrate: mockVibrate,
          userAgent: "Mozilla/5.0 (X11; Linux x86_64)",
          maxTouchPoints: 0,
        },
        writable: true,
        configurable: true,
      });

      expect(isMobileDevice()).toBe(false);
    });

    it("should return false when window is not defined", () => {
      Object.defineProperty(global, "window", {
        value: undefined,
        writable: true,
        configurable: true,
      });

      expect(isMobileDevice()).toBe(false);
    });
  });

  describe("DEFAULT_HAPTIC_SETTINGS", () => {
    it("should have enabled set to true", () => {
      expect(DEFAULT_HAPTIC_SETTINGS.enabled).toBe(true);
    });

    it("should have intensity set to 1.0", () => {
      expect(DEFAULT_HAPTIC_SETTINGS.intensity).toBe(1.0);
    });
  });

  describe("applyIntensity", () => {
    it("should scale single duration by intensity", () => {
      const scaled = applyIntensity(100, 0.5);
      expect(scaled).toBe(50);
    });

    it("should scale pattern durations by intensity", () => {
      const pattern = [100, 50, 100];
      const scaled = applyIntensity(pattern, 0.5);
      expect(scaled).toEqual([50, 25, 50]);
    });

    it("should clamp intensity to 0.0-1.0 range", () => {
      const scaledHigh = applyIntensity(100, 1.5);
      expect(scaledHigh).toBe(100);

      const scaledLow = applyIntensity(100, -0.5);
      expect(scaledLow).toBe(0);
    });

    it("should round scaled durations to nearest integer", () => {
      const scaled = applyIntensity(75, 0.7);
      expect(scaled).toBe(53); // Math.round(75 * 0.7) = 53
    });
  });

  describe("triggerWithSettings", () => {
    it("should trigger vibration with scaled intensity", () => {
      const settings: HapticSettings = {
        enabled: true,
        intensity: 0.5,
      };

      triggerWithSettings(100, settings);
      expect(mockVibrate).toHaveBeenCalledWith(50);
    });

    it("should trigger pattern vibration with scaled intensity", () => {
      const settings: HapticSettings = {
        enabled: true,
        intensity: 0.5,
      };

      triggerWithSettings([100, 50, 100], settings);
      expect(mockVibrate).toHaveBeenCalledWith([50, 25, 50]);
    });

    it("should not vibrate when disabled in settings", () => {
      const settings: HapticSettings = {
        enabled: false,
        intensity: 1.0,
      };

      triggerWithSettings(100, settings);
      expect(mockVibrate).not.toHaveBeenCalled();
    });

    it("should use default settings when not provided", () => {
      triggerWithSettings(100);
      expect(mockVibrate).toHaveBeenCalledWith(100);
    });

    it("should not vibrate if haptic is not supported", () => {
      Object.defineProperty(global, "navigator", {
        value: {
          ...originalNavigator,
          vibrate: undefined,
        },
        writable: true,
        configurable: true,
      });

      const settings: HapticSettings = {
        enabled: true,
        intensity: 1.0,
      };

      triggerWithSettings(100, settings);
      expect(mockVibrate).not.toHaveBeenCalled();
    });
  });

  describe("Integration with Combat UI", () => {
    it("should provide appropriate feedback for guard activation", () => {
      triggerGuardHaptic("activate");
      
      // Should be a light single vibration
      expect(mockVibrate).toHaveBeenCalledWith(50);
    });

    it("should provide strong feedback for guard break", () => {
      triggerGuardHaptic("break");
      
      // Should be a strong triple pulse
      expect(mockVibrate).toHaveBeenCalledWith([100, 50, 100]);
    });

    it("should provide medium feedback for stance change", () => {
      triggerStanceChangeHaptic();
      
      // Should be medium vibration
      expect(mockVibrate).toHaveBeenCalledWith(75);
    });

    it("should allow customization through settings", () => {
      const userSettings: HapticSettings = {
        enabled: true,
        intensity: 0.7,
      };

      // Guard activation with user settings
      triggerWithSettings(50, userSettings);
      expect(mockVibrate).toHaveBeenCalledWith(35); // 50 * 0.7 = 35
    });
  });
});
