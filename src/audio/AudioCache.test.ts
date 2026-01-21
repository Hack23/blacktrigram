/**
 * AudioCache tests
 * AudioCache 테스트
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { AudioCache, AudioCacheConfig } from "./AudioCache";
import type { AudioAsset } from "./types";

// Mock Audio element
class MockAudioElement {
  src = "";
  paused = true;
  pause = vi.fn();
  play = vi.fn(() => Promise.resolve());
  load = vi.fn();
  volume = 1.0;
  currentTime = 0;
}

describe("AudioCache", () => {
  const MB = 1024 * 1024;

  const createMockAsset = (id: string): AudioAsset => {
    const mockAudio = new MockAudioElement();
    return {
      id,
      type: "sound",
      url: `/assets/audio/${id}.mp3`,
      formats: ["audio/mp3"],
      loaded: true,
      volume: 0.7,
      src: mockAudio.src,
      pause: mockAudio.pause,
    } as unknown as AudioAsset;
  };

  describe("Initialization", () => {
    it("should initialize with config", () => {
      const config: AudioCacheConfig = {
        maxSizeBytes: 30 * MB,
        criticalAssets: ["menu_select", "menu_hover"],
        debug: false,
      };

      const cache = new AudioCache(config);
      const stats = cache.getStats();

      expect(stats.totalSize).toBe(0);
      expect(stats.assetCount).toBe(0);
      expect(stats.criticalCount).toBe(0);
      expect(stats.utilizationPercent).toBe(0);
    });

    it("should support debug mode", () => {
      const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const config: AudioCacheConfig = {
        maxSizeBytes: 30 * MB,
        criticalAssets: [],
        debug: true,
      };

      new AudioCache(config);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("[AudioCache] Initialized")
      );

      consoleLogSpy.mockRestore();
    });
  });

  describe("Basic Operations", () => {
    let cache: AudioCache;
    const config: AudioCacheConfig = {
      maxSizeBytes: 10 * MB,
      criticalAssets: ["critical_asset"],
      debug: false,
    };

    beforeEach(() => {
      cache = new AudioCache(config);
    });

    it("should add and retrieve assets", () => {
      const asset = createMockAsset("test_asset");
      cache.set("test_asset", asset, 1 * MB);

      const retrieved = cache.get("test_asset");
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe("test_asset");

      const stats = cache.getStats();
      expect(stats.assetCount).toBe(1);
      expect(stats.totalSize).toBe(1 * MB);
    });

    it("should track cache hits and misses", () => {
      const asset = createMockAsset("test_asset");
      cache.set("test_asset", asset, 1 * MB);

      // Hit
      cache.get("test_asset");
      // Miss
      cache.get("non_existent");

      const stats = cache.getStats();
      expect(stats.hitCount).toBe(1);
      expect(stats.missCount).toBe(1);
      expect(stats.hitRate).toBe(0.5);
    });

    it("should check if asset exists", () => {
      const asset = createMockAsset("test_asset");
      cache.set("test_asset", asset, 1 * MB);

      expect(cache.has("test_asset")).toBe(true);
      expect(cache.has("non_existent")).toBe(false);
    });

    it("should remove assets", () => {
      const asset = createMockAsset("test_asset");
      cache.set("test_asset", asset, 1 * MB);

      const removed = cache.remove("test_asset");
      expect(removed).toBe(true);
      expect(cache.has("test_asset")).toBe(false);

      const stats = cache.getStats();
      expect(stats.assetCount).toBe(0);
      expect(stats.totalSize).toBe(0);
    });

    it("should handle removing non-existent assets", () => {
      const removed = cache.remove("non_existent");
      expect(removed).toBe(false);
    });
  });

  describe("LRU Eviction", () => {
    let cache: AudioCache;
    const config: AudioCacheConfig = {
      maxSizeBytes: 5 * MB, // Small cache for testing eviction
      criticalAssets: [],
      debug: false,
    };

    beforeEach(() => {
      cache = new AudioCache(config);
    });

    it("should evict least recently used asset when cache is full", () => {
      // Add assets until cache is full
      const asset1 = createMockAsset("asset1");
      const asset2 = createMockAsset("asset2");
      const asset3 = createMockAsset("asset3");

      cache.set("asset1", asset1, 2 * MB);
      cache.set("asset2", asset2, 2 * MB);
      cache.set("asset3", asset3, 2 * MB); // This should evict asset1

      expect(cache.has("asset1")).toBe(false);
      expect(cache.has("asset2")).toBe(true);
      expect(cache.has("asset3")).toBe(true);

      const stats = cache.getStats();
      expect(stats.evictionCount).toBe(1);
    });

    it("should update LRU order on access", async () => {
      const asset1 = createMockAsset("asset1");
      const asset2 = createMockAsset("asset2");
      const asset3 = createMockAsset("asset3");

      cache.set("asset1", asset1, 2 * MB);
      // Small delay to ensure different timestamp
      await new Promise((resolve) => setTimeout(resolve, 5));
      cache.set("asset2", asset2, 2 * MB);

      // Access asset1 to make it recently used
      await new Promise((resolve) => setTimeout(resolve, 5));
      cache.get("asset1");

      // Add asset3, should evict asset2 (not asset1)
      await new Promise((resolve) => setTimeout(resolve, 5));
      cache.set("asset3", asset3, 2 * MB);

      expect(cache.has("asset1")).toBe(true);
      expect(cache.has("asset2")).toBe(false);
      expect(cache.has("asset3")).toBe(true);
    });

    it("should evict multiple assets if needed", async () => {
      const asset1 = createMockAsset("asset1");
      const asset2 = createMockAsset("asset2");
      const asset3 = createMockAsset("asset3");

      cache.set("asset1", asset1, 1 * MB);
      // Small delay to ensure different timestamp
      await new Promise((resolve) => setTimeout(resolve, 5));
      cache.set("asset2", asset2, 1 * MB);

      // Add large asset that requires evicting both previous assets
      // Cache is 5MB. Has 2MB. Adding 5MB requires evicting both to make room.
      await new Promise((resolve) => setTimeout(resolve, 5));
      cache.set("asset3", asset3, 5 * MB);

      expect(cache.has("asset1")).toBe(false);
      expect(cache.has("asset2")).toBe(false);
      expect(cache.has("asset3")).toBe(true);

      const stats = cache.getStats();
      expect(stats.evictionCount).toBe(2);
    });
  });

  describe("Critical Assets Protection", () => {
    let cache: AudioCache;
    const config: AudioCacheConfig = {
      maxSizeBytes: 5 * MB,
      criticalAssets: ["critical1", "critical2"],
      debug: false,
    };

    beforeEach(() => {
      cache = new AudioCache(config);
    });

    it("should never evict critical assets", () => {
      const critical1 = createMockAsset("critical1");
      const critical2 = createMockAsset("critical2");
      const normal = createMockAsset("normal");

      cache.set("critical1", critical1, 2 * MB);
      cache.set("critical2", critical2, 2 * MB);
      cache.set("normal", normal, 2 * MB); // Cache full (6MB)

      // Try to add another asset - should not evict critical assets
      const normal2 = createMockAsset("normal2");
      cache.set("normal2", normal2, 2 * MB);

      expect(cache.has("critical1")).toBe(true);
      expect(cache.has("critical2")).toBe(true);
      expect(cache.has("normal")).toBe(false);
      expect(cache.has("normal2")).toBe(true);
    });

    it("should track critical asset count", () => {
      const critical1 = createMockAsset("critical1");
      const normal = createMockAsset("normal");

      cache.set("critical1", critical1, 2 * MB);
      cache.set("normal", normal, 2 * MB);

      const stats = cache.getStats();
      expect(stats.criticalCount).toBe(1);
      expect(stats.assetCount).toBe(2);
    });

    it("should handle cache full of critical assets", () => {
      const critical1 = createMockAsset("critical1");
      const critical2 = createMockAsset("critical2");

      cache.set("critical1", critical1, 3 * MB);
      cache.set("critical2", critical2, 3 * MB); // Exceeds max (6MB > 5MB)

      // Both critical assets should remain even though cache is over limit
      expect(cache.has("critical1")).toBe(true);
      expect(cache.has("critical2")).toBe(true);

      const stats = cache.getStats();
      expect(stats.totalSize).toBe(6 * MB);
      expect(stats.utilizationPercent).toBeGreaterThan(100);
    });

    it("should update critical assets dynamically", () => {
      const asset1 = createMockAsset("asset1");
      const asset2 = createMockAsset("asset2");

      cache.set("asset1", asset1, 2 * MB);
      cache.set("asset2", asset2, 2 * MB);

      // Initially no critical assets
      let stats = cache.getStats();
      expect(stats.criticalCount).toBe(0);

      // Make asset1 critical
      cache.updateCriticalAssets(["asset1"]);

      stats = cache.getStats();
      expect(stats.criticalCount).toBe(1);
    });
  });

  describe("Cache Statistics", () => {
    let cache: AudioCache;
    const config: AudioCacheConfig = {
      maxSizeBytes: 10 * MB,
      criticalAssets: ["critical"],
      debug: false,
    };

    beforeEach(() => {
      cache = new AudioCache(config);
    });

    it("should calculate utilization percentage", () => {
      const asset = createMockAsset("asset");
      cache.set("asset", asset, 3 * MB);

      const stats = cache.getStats();
      expect(stats.utilizationPercent).toBe(30);
    });

    it("should track eviction count", () => {
      const asset1 = createMockAsset("asset1");
      const asset2 = createMockAsset("asset2");
      const asset3 = createMockAsset("asset3");

      cache.set("asset1", asset1, 4 * MB);
      cache.set("asset2", asset2, 4 * MB);
      cache.set("asset3", asset3, 4 * MB); // Should evict asset1

      const stats = cache.getStats();
      expect(stats.evictionCount).toBe(1);
    });

    it("should provide debug information", () => {
      const asset1 = createMockAsset("asset1");
      const critical = createMockAsset("critical");

      cache.set("asset1", asset1, 2 * MB);
      cache.set("critical", critical, 3 * MB);

      const debugInfo = cache.getDebugInfo();

      expect(debugInfo.entries).toHaveLength(2);
      expect(debugInfo.stats.assetCount).toBe(2);
      expect(debugInfo.entries[0].id).toBe("asset1"); // Oldest first
      expect(debugInfo.entries[1].id).toBe("critical");
    });
  });

  describe("Clear Cache", () => {
    let cache: AudioCache;
    const config: AudioCacheConfig = {
      maxSizeBytes: 10 * MB,
      criticalAssets: ["critical"],
      debug: false,
    };

    beforeEach(() => {
      cache = new AudioCache(config);
    });

    it("should clear all assets", () => {
      const asset1 = createMockAsset("asset1");
      const asset2 = createMockAsset("asset2");

      cache.set("asset1", asset1, 2 * MB);
      cache.set("asset2", asset2, 2 * MB);

      cache.clear();

      const stats = cache.getStats();
      expect(stats.assetCount).toBe(0);
      expect(stats.totalSize).toBe(0);
      expect(cache.has("asset1")).toBe(false);
      expect(cache.has("asset2")).toBe(false);
    });

    it("should clear critical assets too", () => {
      const critical = createMockAsset("critical");
      cache.set("critical", critical, 2 * MB);

      cache.clear();

      expect(cache.has("critical")).toBe(false);
      const stats = cache.getStats();
      expect(stats.criticalCount).toBe(0);
    });
  });

  describe("Memory Management", () => {
    let cache: AudioCache;
    const config: AudioCacheConfig = {
      maxSizeBytes: 10 * MB,
      criticalAssets: [],
      debug: false,
    };

    beforeEach(() => {
      cache = new AudioCache(config);
    });

    it("should update existing asset size", () => {
      const asset1 = createMockAsset("asset1");
      const asset1Updated = createMockAsset("asset1");

      cache.set("asset1", asset1, 2 * MB);
      cache.set("asset1", asset1Updated, 3 * MB); // Update with different size

      const stats = cache.getStats();
      expect(stats.totalSize).toBe(3 * MB);
      expect(stats.assetCount).toBe(1);
    });

    it("should maintain accurate size tracking", () => {
      const asset1 = createMockAsset("asset1");
      const asset2 = createMockAsset("asset2");

      cache.set("asset1", asset1, 2 * MB);
      cache.set("asset2", asset2, 3 * MB);

      let stats = cache.getStats();
      expect(stats.totalSize).toBe(5 * MB);

      cache.remove("asset1");

      stats = cache.getStats();
      expect(stats.totalSize).toBe(3 * MB);
    });
  });

  describe("getCachedAssetIds", () => {
    let cache: AudioCache;
    const config: AudioCacheConfig = {
      maxSizeBytes: 10 * MB,
      criticalAssets: [],
      debug: false,
    };

    beforeEach(() => {
      cache = new AudioCache(config);
    });

    it("should return all cached asset IDs", () => {
      const asset1 = createMockAsset("asset1");
      const asset2 = createMockAsset("asset2");

      cache.set("asset1", asset1, 2 * MB);
      cache.set("asset2", asset2, 2 * MB);

      const ids = cache.getCachedAssetIds();
      expect(ids).toHaveLength(2);
      expect(ids).toContain("asset1");
      expect(ids).toContain("asset2");
    });

    it("should return empty array for empty cache", () => {
      const ids = cache.getCachedAssetIds();
      expect(ids).toHaveLength(0);
    });
  });
});
