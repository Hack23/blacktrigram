/**
 * Unit tests for PerformanceMonitor
 * Tests device capability detection and performance monitoring
 *
 * @category Testing
 */

import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";
import {
  PerformanceMonitor,
  getPerformanceMonitor,
  getPerformanceTier,
  canHandle60Fps,
  getQualityRecommendations,
} from "./PerformanceMonitor";

describe("PerformanceMonitor", () => {
  let rafSpy: ReturnType<typeof vi.spyOn>;
  let originalNavigator: typeof navigator;

  beforeEach(() => {
    // Mock requestAnimationFrame to return an ID but not call callback immediately
    let rafId = 0;
    rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => {
      return ++rafId;
    });

    // Mock cancelAnimationFrame
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});

    // Mock performance.now
    vi.spyOn(performance, 'now').mockReturnValue(0);

    originalNavigator = globalThis.navigator;
    Object.defineProperty(globalThis, "navigator", {
      value: {
        ...originalNavigator,
        hardwareConcurrency: 8,
        deviceMemory: 8,
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
      writable: true,
      configurable: true,
    });

    // Reset singleton
    // @ts-expect-error - Accessing private static member for testing
    PerformanceMonitor.instance = null;
  });

  afterEach(() => {
    Object.defineProperty(globalThis, "navigator", {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
    vi.restoreAllMocks();
  });

  describe("PerformanceMonitor singleton", () => {
    it("should create singleton instance", () => {
      const monitor1 = PerformanceMonitor.getInstance();
      const monitor2 = PerformanceMonitor.getInstance();

      expect(monitor1).toBe(monitor2);
    });

    it("should initialize with options", () => {
      const monitor = PerformanceMonitor.getInstance({
        sampleWindow: 30,
        targetFps: 30,
      });

      expect(monitor).toBeDefined();
    });
  });

  describe("getPerformanceTier", () => {
    it("should detect high-end desktop", () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {
          ...originalNavigator,
          hardwareConcurrency: 8,
          deviceMemory: 8,
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
        writable: true,
        configurable: true,
      });

      // @ts-expect-error - Accessing private static member for testing
      PerformanceMonitor.instance = null;

      const monitor = PerformanceMonitor.getInstance();
      expect(monitor.getPerformanceTier()).toBe('high');
    });

    it("should detect medium-end device", () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {
          ...originalNavigator,
          hardwareConcurrency: 4,
          deviceMemory: 4,
          userAgent: "Mozilla/5.0 (Android 10)",
          connection: {
            effectiveType: '4g',
          },
        },
        writable: true,
        configurable: true,
      });

      // @ts-expect-error - Accessing private static member for testing
      PerformanceMonitor.instance = null;

      const monitor = PerformanceMonitor.getInstance();
      expect(monitor.getPerformanceTier()).toBe('medium');
    });

    it("should detect low-end device", () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {
          ...originalNavigator,
          hardwareConcurrency: 2,
          deviceMemory: 2,
          userAgent: "Mozilla/5.0 (Android 6.0)",
        },
        writable: true,
        configurable: true,
      });

      // @ts-expect-error - Accessing private static member for testing
      PerformanceMonitor.instance = null;

      const monitor = PerformanceMonitor.getInstance();
      expect(monitor.getPerformanceTier()).toBe('low');
    });

    it("should detect iOS devices correctly", () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {
          ...originalNavigator,
          hardwareConcurrency: 6,
          deviceMemory: 4,
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)",
        },
        writable: true,
        configurable: true,
      });

      // @ts-expect-error - Accessing private static member for testing
      PerformanceMonitor.instance = null;

      const monitor = PerformanceMonitor.getInstance();
      const tier = monitor.getPerformanceTier();
      
      // iOS should get bonus points
      expect(['high', 'medium']).toContain(tier);
    });
  });

  describe("startMonitoring and stopMonitoring", () => {
    it("should start monitoring", () => {
      const monitor = PerformanceMonitor.getInstance();
      monitor.startMonitoring();

      expect(rafSpy).toHaveBeenCalled();
    });

    it("should stop monitoring", () => {
      const monitor = PerformanceMonitor.getInstance();
      const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame');

      monitor.startMonitoring();
      monitor.stopMonitoring();

      expect(cancelSpy).toHaveBeenCalled();
    });

    it("should not start monitoring twice", () => {
      const monitor = PerformanceMonitor.getInstance();
      monitor.startMonitoring();
      
      rafSpy.mockClear();
      monitor.startMonitoring();

      // Should not call RAF again if already monitoring
      expect(rafSpy).not.toHaveBeenCalled();
    });
  });

  describe("getMetrics", () => {
    it("should return performance metrics", () => {
      const monitor = PerformanceMonitor.getInstance();
      const metrics = monitor.getMetrics();

      expect(metrics).toHaveProperty('fps');
      expect(metrics).toHaveProperty('avgFrameTime');
      expect(metrics).toHaveProperty('frameDrops');
      expect(metrics).toHaveProperty('memoryUsage');
      expect(metrics).toHaveProperty('tier');
      expect(metrics).toHaveProperty('isSixtyFps');
    });

    it("should have valid metric values", () => {
      const monitor = PerformanceMonitor.getInstance();
      const metrics = monitor.getMetrics();

      expect(metrics.fps).toBeGreaterThanOrEqual(0);
      expect(metrics.avgFrameTime).toBeGreaterThanOrEqual(0);
      expect(metrics.frameDrops).toBeGreaterThanOrEqual(0);
      expect(['high', 'medium', 'low']).toContain(metrics.tier);
      expect(typeof metrics.isSixtyFps).toBe('boolean');
    });
  });

  describe("canHandle60Fps", () => {
    it("should return true for high-end devices", () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {
          ...originalNavigator,
          hardwareConcurrency: 8,
          deviceMemory: 8,
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
        writable: true,
        configurable: true,
      });

      // @ts-expect-error - Accessing private static member for testing
      PerformanceMonitor.instance = null;

      const monitor = PerformanceMonitor.getInstance();
      expect(monitor.canHandle60Fps()).toBe(true);
    });

    it("should return false for low-end devices", () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {
          ...originalNavigator,
          hardwareConcurrency: 2,
          deviceMemory: 1,
          userAgent: "Mozilla/5.0 (Android 5.0)",
        },
        writable: true,
        configurable: true,
      });

      // @ts-expect-error - Accessing private static member for testing
      PerformanceMonitor.instance = null;

      const monitor = PerformanceMonitor.getInstance();
      expect(monitor.canHandle60Fps()).toBe(false);
    });
  });

  describe("getQualityRecommendations", () => {
    it("should recommend high quality for high-end devices", () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {
          ...originalNavigator,
          hardwareConcurrency: 8,
          deviceMemory: 8,
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
        writable: true,
        configurable: true,
      });

      // @ts-expect-error - Accessing private static member for testing
      PerformanceMonitor.instance = null;

      const monitor = PerformanceMonitor.getInstance();
      const recommendations = monitor.getQualityRecommendations();

      expect(recommendations.enableHaptics).toBe(true);
      expect(recommendations.enableParticles).toBe(true);
      expect(recommendations.enableShadows).toBe(true);
      expect(recommendations.targetFps).toBe(60);
      expect(recommendations.coalescingRate).toBe(5);
    });

    it("should recommend medium quality for medium-end devices", () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {
          ...originalNavigator,
          hardwareConcurrency: 4,
          deviceMemory: 4,
          userAgent: "Mozilla/5.0 (Android 10)",
          connection: {
            effectiveType: '4g',
          },
        },
        writable: true,
        configurable: true,
      });

      // @ts-expect-error - Accessing private static member for testing
      PerformanceMonitor.instance = null;

      const monitor = PerformanceMonitor.getInstance();
      const recommendations = monitor.getQualityRecommendations();

      expect(recommendations.enableHaptics).toBe(true);
      expect(recommendations.enableParticles).toBe(true);
      expect(recommendations.enableShadows).toBe(false);
      expect(recommendations.targetFps).toBe(60);
      expect(recommendations.coalescingRate).toBe(3);
    });

    it("should recommend low quality for low-end devices", () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {
          ...originalNavigator,
          hardwareConcurrency: 2,
          deviceMemory: 2,
          userAgent: "Mozilla/5.0 (Android 6.0)",
        },
        writable: true,
        configurable: true,
      });

      // @ts-expect-error - Accessing private static member for testing
      PerformanceMonitor.instance = null;

      const monitor = PerformanceMonitor.getInstance();
      const recommendations = monitor.getQualityRecommendations();

      expect(recommendations.enableHaptics).toBe(false);
      expect(recommendations.enableParticles).toBe(false);
      expect(recommendations.enableShadows).toBe(false);
      expect(recommendations.targetFps).toBe(30);
      expect(recommendations.coalescingRate).toBe(1);
    });
  });

  describe("hasFrameDrops", () => {
    it("should detect frame drops", () => {
      const monitor = PerformanceMonitor.getInstance();
      
      // Initially no frame drops
      expect(monitor.hasFrameDrops()).toBe(false);
    });
  });

  describe("getCurrentFps", () => {
    it("should return current FPS", () => {
      const monitor = PerformanceMonitor.getInstance();
      const fps = monitor.getCurrentFps();

      expect(fps).toBeGreaterThanOrEqual(0);
      expect(fps).toBeLessThanOrEqual(120);
    });
  });

  describe("getAvgFrameTime", () => {
    it("should return average frame time", () => {
      const monitor = PerformanceMonitor.getInstance();
      const frameTime = monitor.getAvgFrameTime();

      expect(frameTime).toBeGreaterThan(0);
    });
  });

  describe("reset", () => {
    it("should reset metrics", () => {
      const monitor = PerformanceMonitor.getInstance();
      monitor.reset();

      const metrics = monitor.getMetrics();
      expect(metrics.fps).toBe(60);
      expect(metrics.frameDrops).toBe(0);
    });
  });

  describe("Convenience functions", () => {
    it("should get performance monitor via convenience function", () => {
      const monitor = getPerformanceMonitor();
      expect(monitor).toBeInstanceOf(PerformanceMonitor);
    });

    it("should get performance tier via convenience function", () => {
      const tier = getPerformanceTier();
      expect(['high', 'medium', 'low']).toContain(tier);
    });

    it("should check 60fps capability via convenience function", () => {
      const can60fps = canHandle60Fps();
      expect(typeof can60fps).toBe('boolean');
    });

    it("should get quality recommendations via convenience function", () => {
      const recommendations = getQualityRecommendations();
      expect(recommendations).toHaveProperty('enableHaptics');
      expect(recommendations).toHaveProperty('enableParticles');
      expect(recommendations).toHaveProperty('enableShadows');
      expect(recommendations).toHaveProperty('targetFps');
      expect(recommendations).toHaveProperty('coalescingRate');
    });
  });

  describe("Memory monitoring", () => {
    it("should track memory usage if available", () => {
      // Mock performance.memory
      Object.defineProperty(performance, 'memory', {
        value: {
          usedJSHeapSize: 10485760, // 10MB in bytes
          totalJSHeapSize: 20971520, // 20MB in bytes
        },
        writable: true,
        configurable: true,
      });

      // @ts-expect-error - Accessing private static member for testing
      PerformanceMonitor.instance = null;

      const monitor = PerformanceMonitor.getInstance();
      monitor.startMonitoring();
      
      const metrics = monitor.getMetrics();
      expect(metrics.memoryUsage).toBeDefined();
    });

    it("should handle missing memory API gracefully", () => {
      // Ensure no memory property
      Object.defineProperty(performance, 'memory', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      // @ts-expect-error - Accessing private static member for testing
      PerformanceMonitor.instance = null;

      const monitor = PerformanceMonitor.getInstance();
      const metrics = monitor.getMetrics();
      
      expect(metrics.memoryUsage).toBeNull();
    });
  });

  describe("Connection type detection", () => {
    it("should consider connection type in tier detection", () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {
          ...originalNavigator,
          hardwareConcurrency: 4,
          deviceMemory: 4,
          userAgent: "Mozilla/5.0 (Android 10)",
          connection: {
            effectiveType: '4g',
          },
        },
        writable: true,
        configurable: true,
      });

      // @ts-expect-error - Accessing private static member for testing
      PerformanceMonitor.instance = null;

      const monitor = PerformanceMonitor.getInstance();
      const tier = monitor.getPerformanceTier();
      
      // 4G connection should boost tier
      expect(['high', 'medium']).toContain(tier);
    });
  });
});
