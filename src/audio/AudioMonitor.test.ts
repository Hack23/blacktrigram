import { beforeEach, describe, expect, it, vi } from "vitest";
import { AudioMonitor } from "./AudioMonitor";

describe("AudioMonitor", () => {
  let monitor: AudioMonitor;

  beforeEach(() => {
    monitor = new AudioMonitor();
    vi.clearAllMocks();
  });

  describe("load tracking", () => {
    it("should record successful load", () => {
      monitor.recordLoad("test_sound", 150, 2.5);

      const stats = monitor.getPerformanceStats();
      expect(stats.totalLoads).toBe(1);
      expect(stats.failedLoads).toBe(0);
      expect(stats.averageLoadTimeMs).toBe(150);
    });

    it("should record multiple loads and calculate average", () => {
      monitor.recordLoad("sound1", 100, 1.0);
      monitor.recordLoad("sound2", 200, 2.0);
      monitor.recordLoad("sound3", 300, 3.0);

      const stats = monitor.getPerformanceStats();
      expect(stats.totalLoads).toBe(3);
      expect(stats.averageLoadTimeMs).toBe(200);
      expect(stats.minLoadTimeMs).toBe(100);
      expect(stats.maxLoadTimeMs).toBe(300);
    });

    it("should record load failures", () => {
      const error = new Error("Load failed");
      monitor.recordLoadFailure("failed_sound", error);

      const stats = monitor.getPerformanceStats();
      expect(stats.totalLoads).toBe(1);
      expect(stats.failedLoads).toBe(1);
    });

    it("should keep only last 100 load times", () => {
      // Record 150 loads
      for (let i = 0; i < 150; i++) {
        monitor.recordLoad(`sound${i}`, 100 + i, 1.0);
      }

      const stats = monitor.getPerformanceStats();
      expect(stats.totalLoads).toBe(150);
      // Average should be based on last 100 only
      expect(stats.averageLoadTimeMs).toBeGreaterThan(149);
    });
  });

  describe("memory tracking", () => {
    it("should track loaded asset memory", () => {
      monitor.recordLoad("sound1", 100, 2.5);
      monitor.recordLoad("sound2", 150, 3.0);

      const memStats = monitor.getMemoryStats();
      expect(memStats.totalLoadedMB).toBe(5.5);
      expect(memStats.assetCount).toBe(2);
      expect(memStats.averageAssetMB).toBe(2.75);
      expect(memStats.largestAssetMB).toBe(3.0);
    });

    it("should warn when memory exceeds 80% threshold", () => {
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      monitor.setMemoryThreshold(100);

      // Load 85MB
      monitor.recordLoad("large_sound", 1000, 85);

      const warnings = monitor.getWarnings();
      expect(warnings.length).toBeGreaterThan(0);
      expect(warnings[0].level).toBe("info");

      consoleWarnSpy.mockRestore();
    });

    it("should warn when memory exceeds 100% threshold", () => {
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      monitor.setMemoryThreshold(100);

      // Load 105MB
      monitor.recordLoad("large_sound", 1000, 105);

      const warnings = monitor.getWarnings();
      expect(warnings.length).toBeGreaterThan(0);
      expect(warnings.some((w) => w.level === "warning")).toBe(true);

      consoleWarnSpy.mockRestore();
    });

    it("should create critical warning at 150% threshold", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      monitor.setMemoryThreshold(100);

      // Load 155MB
      monitor.recordLoad("huge_sound", 1000, 155);

      const warnings = monitor.getWarnings();
      expect(warnings.some((w) => w.level === "critical")).toBe(true);

      consoleErrorSpy.mockRestore();
    });

    it("should allow custom memory threshold", () => {
      monitor.setMemoryThreshold(200);

      // Load 180MB (below custom threshold)
      monitor.recordLoad("large_sound", 1000, 180);

      const warnings = monitor.getWarnings();
      // Should have info warning (90% of 200)
      expect(warnings.some((w) => w.level === "info")).toBe(true);
    });

    it("should unregister assets when unloaded", () => {
      monitor.recordLoad("sound1", 100, 2.5);
      monitor.recordLoad("sound2", 150, 3.0);

      let memStats = monitor.getMemoryStats();
      expect(memStats.assetCount).toBe(2);

      monitor.unregisterAsset("sound1");

      memStats = monitor.getMemoryStats();
      expect(memStats.assetCount).toBe(1);
      expect(memStats.totalLoadedMB).toBe(3.0);
    });
  });

  describe("playback latency tracking", () => {
    it("should record playback latency", () => {
      monitor.recordPlaybackLatency(50);
      monitor.recordPlaybackLatency(60);
      monitor.recordPlaybackLatency(55);

      const stats = monitor.getPerformanceStats();
      expect(stats.averagePlaybackLatencyMs).toBe(55);
    });

    it("should keep only last 100 latency measurements", () => {
      // Record 150 measurements
      for (let i = 0; i < 150; i++) {
        monitor.recordPlaybackLatency(50 + i);
      }

      const stats = monitor.getPerformanceStats();
      // Average should be based on last 100 only
      expect(stats.averagePlaybackLatencyMs).toBeGreaterThan(99);
    });
  });

  describe("FPS monitoring", () => {
    it("should update FPS measurements", () => {
      monitor.updateFPS(60);
      monitor.updateFPS(58);
      monitor.updateFPS(59);

      const fpsImpact = monitor.getFPSImpact();
      expect(fpsImpact.currentFPS).toBe(59);
    });

    it("should detect FPS impact", () => {
      // Set baseline
      for (let i = 0; i < 60; i++) {
        monitor.updateFPS(60);
      }

      // Simulate FPS drop
      for (let i = 0; i < 30; i++) {
        monitor.updateFPS(50);
      }

      const fpsImpact = monitor.getFPSImpact();
      expect(fpsImpact.impactDetected).toBe(true);
      expect(fpsImpact.fpsDropDuringLoad).toBeGreaterThanOrEqual(5);
    });

    it("should update baseline FPS over time", () => {
      // Initial measurements at 60fps
      for (let i = 0; i < 30; i++) {
        monitor.updateFPS(60);
      }

      const initialImpact = monitor.getFPSImpact();
      expect(initialImpact.baselineFPS).toBeGreaterThanOrEqual(60);
    });

    it("should keep only last 60 FPS measurements", () => {
      // Record 100 measurements
      for (let i = 0; i < 100; i++) {
        monitor.updateFPS(60 - i * 0.1);
      }

      const fpsImpact = monitor.getFPSImpact();
      // Should be based on recent measurements
      expect(fpsImpact.currentFPS).toBeLessThan(60);
    });

    it("should not detect impact with stable FPS", () => {
      for (let i = 0; i < 60; i++) {
        monitor.updateFPS(60);
      }

      const fpsImpact = monitor.getFPSImpact();
      expect(fpsImpact.impactDetected).toBe(false);
    });
  });

  describe("warnings management", () => {
    it("should store warnings", () => {
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      monitor.setMemoryThreshold(50);
      monitor.recordLoad("sound1", 100, 45); // 90% threshold

      const warnings = monitor.getWarnings();
      expect(warnings.length).toBeGreaterThan(0);

      consoleWarnSpy.mockRestore();
    });

    it("should get recent warnings", () => {
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      monitor.setMemoryThreshold(10);

      // Create multiple warnings
      for (let i = 0; i < 15; i++) {
        monitor.recordLoad(`sound${i}`, 100, 1);
      }

      const recentWarnings = monitor.getRecentWarnings(5);
      expect(recentWarnings.length).toBeLessThanOrEqual(5);

      consoleWarnSpy.mockRestore();
    });

    it("should clear warnings", () => {
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      monitor.setMemoryThreshold(50);
      monitor.recordLoad("sound1", 100, 45);

      expect(monitor.getWarnings().length).toBeGreaterThan(0);

      monitor.clearWarnings();

      expect(monitor.getWarnings().length).toBe(0);

      consoleWarnSpy.mockRestore();
    });

    it("should keep only last 100 warnings", () => {
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      monitor.setMemoryThreshold(1);

      // Create 150 warnings
      for (let i = 0; i < 150; i++) {
        monitor.recordLoad(`sound${i}`, 100, 0.1);
      }

      const warnings = monitor.getWarnings();
      expect(warnings.length).toBeLessThanOrEqual(100);

      consoleWarnSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it("should include warning metadata", () => {
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      monitor.setMemoryThreshold(50);
      monitor.recordLoad("sound1", 100, 45);

      const warnings = monitor.getWarnings();
      expect(warnings[0]).toHaveProperty("level");
      expect(warnings[0]).toHaveProperty("message");
      expect(warnings[0]).toHaveProperty("currentMB");
      expect(warnings[0]).toHaveProperty("thresholdMB");
      expect(warnings[0]).toHaveProperty("timestamp");

      consoleWarnSpy.mockRestore();
    });
  });

  describe("comprehensive reporting", () => {
    it("should generate comprehensive report", () => {
      monitor.recordLoad("sound1", 150, 2.5);
      monitor.recordLoad("sound2", 200, 3.0);
      monitor.recordPlaybackLatency(50);
      monitor.updateFPS(60);

      const report = monitor.getReport();

      expect(report).toHaveProperty("memory");
      expect(report).toHaveProperty("performance");
      expect(report).toHaveProperty("fps");
      expect(report).toHaveProperty("warnings");

      expect(report.memory.assetCount).toBe(2);
      expect(report.performance.totalLoads).toBe(2);
      expect(report.fps.currentFPS).toBe(60);
    });

    it("should include recent warnings in report", () => {
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      monitor.setMemoryThreshold(50);

      // Create warnings
      for (let i = 0; i < 10; i++) {
        monitor.recordLoad(`sound${i}`, 100, 6);
      }

      const report = monitor.getReport();
      expect(report.warnings.length).toBeLessThanOrEqual(5);

      consoleWarnSpy.mockRestore();
    });
  });

  describe("reset functionality", () => {
    it("should reset all statistics", () => {
      monitor.recordLoad("sound1", 150, 2.5);
      monitor.recordPlaybackLatency(50);
      monitor.updateFPS(60);

      monitor.reset();

      const perfStats = monitor.getPerformanceStats();
      const memStats = monitor.getMemoryStats();
      const warnings = monitor.getWarnings();

      expect(perfStats.totalLoads).toBe(0);
      expect(perfStats.failedLoads).toBe(0);
      expect(memStats.assetCount).toBe(0);
      expect(warnings.length).toBe(0);
    });
  });

  describe("edge cases", () => {
    it("should handle zero loads gracefully", () => {
      const stats = monitor.getPerformanceStats();

      expect(stats.averageLoadTimeMs).toBe(0);
      expect(stats.maxLoadTimeMs).toBe(0);
      expect(stats.minLoadTimeMs).toBe(0);
      expect(stats.totalLoads).toBe(0);
    });

    it("should handle zero assets gracefully", () => {
      const memStats = monitor.getMemoryStats();

      expect(memStats.totalLoadedMB).toBe(0);
      expect(memStats.assetCount).toBe(0);
      expect(memStats.averageAssetMB).toBe(0);
      expect(memStats.largestAssetMB).toBe(0);
    });

    it("should handle negative FPS values", () => {
      monitor.updateFPS(-1);

      const fpsImpact = monitor.getFPSImpact();
      expect(fpsImpact.currentFPS).toBe(-1);
    });

    it("should handle very large asset sizes", () => {
      monitor.recordLoad("huge_asset", 1000, 999999);

      const memStats = monitor.getMemoryStats();
      expect(memStats.totalLoadedMB).toBe(999999);
    });

    it("should handle rapid FPS updates", () => {
      for (let i = 0; i < 1000; i++) {
        monitor.updateFPS(60 - (i % 10));
      }

      const fpsImpact = monitor.getFPSImpact();
      expect(fpsImpact.currentFPS).toBeDefined();
    });
  });

  describe("performance statistics accuracy", () => {
    it("should calculate min/max correctly with single load", () => {
      monitor.recordLoad("sound1", 150, 2.5);

      const stats = monitor.getPerformanceStats();
      expect(stats.minLoadTimeMs).toBe(150);
      expect(stats.maxLoadTimeMs).toBe(150);
      expect(stats.averageLoadTimeMs).toBe(150);
    });

    it("should track failed loads separately", () => {
      monitor.recordLoad("sound1", 100, 1.0);
      monitor.recordLoadFailure("sound2", new Error("Failed"));
      monitor.recordLoad("sound3", 200, 2.0);

      const stats = monitor.getPerformanceStats();
      expect(stats.totalLoads).toBe(3);
      expect(stats.failedLoads).toBe(1);
      // Average should only include successful loads
      expect(stats.averageLoadTimeMs).toBe(150);
    });
  });
});
