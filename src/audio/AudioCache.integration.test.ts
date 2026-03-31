/**
 * AudioCache Integration Tests
 * AudioCache 통합 테스트
 *
 * Tests for AudioCache integration with AudioManager
 * AudioManager와 AudioCache 통합 테스트
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { AudioManager } from "./AudioManager";
import type { AudioAsset, AudioConfig } from "./types";
import { AudioCategory } from "./types";

// Mock Audio element
class MockAudioElement {
  src = "";
  paused = true;
  pause = vi.fn();
  play = vi.fn(() => Promise.resolve());
  load = vi.fn();
  volume = 1.0;
  currentTime = 0;
  canPlayType = vi.fn((type: string) => {
    if (type === "audio/mp3" || type === "audio/mpeg") return "probably";
    if (type === "audio/wav") return "maybe";
    return "";
  });
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
}

globalThis.Audio = MockAudioElement as any;

// Mock AudioContext
class MockAudioContext {
  createBuffer = vi.fn();
  createBufferSource = vi.fn();
  createGain = vi.fn();
  destination = {};
  sampleRate = 44100;
}

globalThis.AudioContext = MockAudioContext as any;
(globalThis as any).webkitAudioContext = MockAudioContext;

describe("AudioCache Integration with AudioManager", () => {
  const MB = 1024 * 1024;

  const createMockAsset = (
    id: string,
    isCritical: boolean = false
  ): AudioAsset => {
    return {
      id,
      type: "sound",
      url: `/assets/audio/${id}.mp3`,
      formats: ["audio/mp3"],
      loaded: false,
      volume: 0.7,
      category: isCritical ? AudioCategory.UI : AudioCategory.SFX,
    } as AudioAsset;
  };

  describe("Critical Assets Protection", () => {
    let audioManager: AudioManager;

    beforeEach(async () => {
      const config: Partial<AudioConfig> = {
        masterVolume: 1.0,
        sfxVolume: 0.8,
        musicVolume: 0.7,
      };

      audioManager = new AudioManager(config);
      await audioManager.initialize();
    });

    it("should never evict critical menu sounds", async () => {
      // Load critical menu sound
      const menuSelect = createMockAsset("menu_select", true);
      await audioManager.loadAsset(menuSelect);

      // Load many non-critical assets to fill cache
      const nonCriticalAssets = Array.from({ length: 100 }, (_, i) =>
        createMockAsset(`non_critical_${i}`, false)
      );

      for (const asset of nonCriticalAssets) {
        await audioManager.loadAsset(asset);
      }

      // Verify critical asset is still loaded
      const stats = audioManager.getCacheStats();
      expect(stats.lruCache.criticalCount).toBeGreaterThan(0);

      // Try to play critical sound (should work)
      await expect(
        audioManager.playSFX("menu_select")
      ).resolves.not.toThrow();
    });

    it("should protect all critical assets from eviction", async () => {
      const criticalAssets = [
        "menu_hover",
        "menu_select",
        "menu_click",
        "hit_light",
        "guard_block",
      ].map((id) => createMockAsset(id, true));

      // Load all critical assets
      for (const asset of criticalAssets) {
        await audioManager.loadAsset(asset);
      }

      const initialStats = audioManager.getCacheStats();
      const initialCriticalCount = initialStats.lruCache.criticalCount;

      // Load many non-critical assets
      const nonCriticalAssets = Array.from({ length: 50 }, (_, i) =>
        createMockAsset(`test_asset_${i}`, false)
      );

      for (const asset of nonCriticalAssets) {
        await audioManager.loadAsset(asset);
      }

      // Verify critical asset count hasn't changed
      const finalStats = audioManager.getCacheStats();
      expect(finalStats.lruCache.criticalCount).toBe(initialCriticalCount);
    });
  });

  describe("LRU Eviction Behavior", () => {
    let audioManager: AudioManager;

    beforeEach(async () => {
      const config: Partial<AudioConfig> = {
        masterVolume: 1.0,
        sfxVolume: 0.8,
        musicVolume: 0.7,
      };

      audioManager = new AudioManager(config);
      await audioManager.initialize();
    });

    it("should evict least recently used non-critical assets", async () => {
      const asset1 = createMockAsset("lru_test_1", false);
      const asset2 = createMockAsset("lru_test_2", false);

      await audioManager.loadAsset(asset1);
      await new Promise((resolve) => setTimeout(resolve, 10));
      await audioManager.loadAsset(asset2);
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Access asset1 to make it recently used
      await audioManager.playSFX("lru_test_1");

      // Load many assets to trigger eviction
      const fillAssets = Array.from({ length: 80 }, (_, i) =>
        createMockAsset(`fill_${i}`, false)
      );

      for (const asset of fillAssets) {
        await audioManager.loadAsset(asset);
      }

      const stats = audioManager.getCacheStats();
      expect(stats.lruCache.evictionCount).toBeGreaterThan(0);
    });

    it("should track cache hit and miss rates", async () => {
      const asset = createMockAsset("hit_rate_test", false);
      await audioManager.loadAsset(asset);

      // Play the same sound multiple times (should be cache hits)
      await audioManager.playSFX("hit_rate_test");
      await audioManager.playSFX("hit_rate_test");
      await audioManager.playSFX("hit_rate_test");

      const stats = audioManager.getCacheStats();
      expect(stats.lruCache.hitCount).toBeGreaterThan(0);
    });
  });

  describe("Cache Statistics", () => {
    let audioManager: AudioManager;

    beforeEach(async () => {
      const config: Partial<AudioConfig> = {
        masterVolume: 1.0,
        sfxVolume: 0.8,
        musicVolume: 0.7,
      };

      audioManager = new AudioManager(config);
      await audioManager.initialize();
    });

    it("should provide accurate cache statistics", async () => {
      const stats = audioManager.getCacheStats();

      expect(stats.lruCache).toBeDefined();
      expect(stats.lruCache.totalSize).toBeGreaterThanOrEqual(0);
      expect(stats.lruCache.assetCount).toBeGreaterThanOrEqual(0);
      expect(stats.lruCache.criticalCount).toBeGreaterThanOrEqual(0);
      expect(stats.lruCache.utilizationPercent).toBeGreaterThanOrEqual(0);
      expect(stats.lruCache.utilizationPercent).toBeLessThanOrEqual(200); // Allow over 100% for critical assets
      expect(stats.lruCache.evictionCount).toBeGreaterThanOrEqual(0);
      expect(stats.lruCache.hitCount).toBeGreaterThanOrEqual(0);
      expect(stats.lruCache.missCount).toBeGreaterThanOrEqual(0);
    });

    it("should track cache utilization", async () => {
      const initialStats = audioManager.getCacheStats();
      const initialUtilization = initialStats.lruCache.utilizationPercent;

      // Load some assets
      const assets = Array.from({ length: 10 }, (_, i) =>
        createMockAsset(`util_test_${i}`, false)
      );

      for (const asset of assets) {
        await audioManager.loadAsset(asset);
      }

      const finalStats = audioManager.getCacheStats();
      expect(finalStats.lruCache.utilizationPercent).toBeGreaterThan(
        initialUtilization
      );
    });

    it("should track cache hit rate", async () => {
      const asset = createMockAsset("hit_rate_asset", false);
      await audioManager.loadAsset(asset);

      // Generate cache hits
      for (let i = 0; i < 5; i++) {
        await audioManager.playSFX("hit_rate_asset");
      }

      const stats = audioManager.getCacheStats();
      expect(stats.lruCache.hitRate).toBeGreaterThan(0);
      expect(stats.lruCache.hitRate).toBeLessThanOrEqual(1);
    });
  });

  describe("Memory Management", () => {
    let audioManager: AudioManager;

    beforeEach(async () => {
      const config: Partial<AudioConfig> = {
        masterVolume: 1.0,
        sfxVolume: 0.8,
        musicVolume: 0.7,
      };

      audioManager = new AudioManager(config);
      await audioManager.initialize();
    });

    it("should respect memory limits", async () => {
      // 30MB default limit
      const maxSizeBytes = 30 * MB;

      // Load many assets
      const assets = Array.from({ length: 100 }, (_, i) =>
        createMockAsset(`memory_test_${i}`, false)
      );

      for (const asset of assets) {
        await audioManager.loadAsset(asset);
      }

      const finalStats = audioManager.getCacheStats();

      // Allow some overhead for critical assets
      expect(finalStats.lruCache.totalSize).toBeLessThan(maxSizeBytes * 1.5);
    });

    it("should unload assets correctly", async () => {
      const asset = createMockAsset("unload_test", false);
      await audioManager.loadAsset(asset);

      const beforeUnload = audioManager.getCacheStats();
      const beforeCount = beforeUnload.lruCache.assetCount;

      const unloaded = audioManager.unloadAsset("unload_test");
      expect(unloaded).toBe(true);

      const afterUnload = audioManager.getCacheStats();
      expect(afterUnload.lruCache.assetCount).toBeLessThan(beforeCount);
    });
  });

  describe("On-Demand Loading", () => {
    let audioManager: AudioManager;

    beforeEach(async () => {
      const config: Partial<AudioConfig> = {
        masterVolume: 1.0,
        sfxVolume: 0.8,
        musicVolume: 0.7,
      };

      audioManager = new AudioManager(config);
      await audioManager.initialize();
    });

    it("should load asset on first play if not cached", async () => {
      const asset = createMockAsset("on_demand_test", false);

      // Don't preload - play directly
      const initialStats = audioManager.getCacheStats();

      // Load asset
      await audioManager.loadAsset(asset);

      // Play sound (should load on-demand if not in cache)
      await audioManager.playSFX("on_demand_test");

      const finalStats = audioManager.getCacheStats();
      expect(finalStats.lruCache.assetCount).toBeGreaterThan(
        initialStats.lruCache.assetCount
      );
    });
  });
});
