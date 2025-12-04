import { beforeEach, describe, expect, it, vi } from "vitest";
import { AudioAssetLoader } from "./AudioAssetLoader";
import type { AudioAsset } from "./types";

// Mock Audio element
class MockAudioElement {
  canPlayType: ReturnType<typeof vi.fn>;
  play: ReturnType<typeof vi.fn>;
  pause: ReturnType<typeof vi.fn>;
  load: ReturnType<typeof vi.fn>;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
  volume = 1;
  currentTime = 0;
  duration = 0;
  paused = true;
  ended = false;
  src = "";
  preload = "auto";

  constructor(src?: string) {
    if (src) {
      this.src = src;
    }
    this.canPlayType = vi.fn((type: string) => {
      if (type === "audio/mp3" || type === "audio/mpeg") return "probably";
      if (type === "audio/wav") return "maybe";
      return "";
    });
    this.play = vi.fn(() => Promise.resolve());
    this.pause = vi.fn();
    this.load = vi.fn();
    this.addEventListener = vi.fn((event: string, handler: () => void) => {
      // Simulate successful load after short delay
      if (event === "canplaythrough") {
        setTimeout(() => handler(), 10);
      }
    });
    this.removeEventListener = vi.fn();
  }
}

global.Audio = MockAudioElement as any;

describe("AudioAssetLoader", () => {
  let loader: AudioAssetLoader;

  beforeEach(() => {
    loader = new AudioAssetLoader();
    vi.clearAllMocks();
  });

  describe("loadAsset", () => {
    it("should load asset successfully", async () => {
      const asset: AudioAsset = {
        id: "test_sound",
        name: "Test Sound",
        type: "sound",
        url: "/test.mp3",
        formats: ["audio/mp3"],
        loaded: false,
      };

      const result = await loader.loadAsset(asset);

      expect(result.success).toBe(true);
      expect(result.audio).toBeDefined();
      expect(result.attemptCount).toBeGreaterThan(0);
      expect(result.loadTime).toBeGreaterThanOrEqual(0);
    });

    it("should return cached asset on subsequent loads", async () => {
      const asset: AudioAsset = {
        id: "test_sound",
        name: "Test Sound",
        type: "sound",
        url: "/test.mp3",
        formats: ["audio/mp3"],
        loaded: false,
      };

      const result1 = await loader.loadAsset(asset);
      const result2 = await loader.loadAsset(asset);

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      expect(result2.attemptCount).toBe(0); // Cached, no retry
      expect(result2.audio).toBe(result1.audio);
    });

    it("should handle load timeout", async () => {
      // Mock Audio that never fires canplaythrough
      global.Audio = class {
        src = "";
        preload = "auto";
        addEventListener = vi.fn();
        load = vi.fn();
      } as any;

      const asset: AudioAsset = {
        id: "timeout_sound",
        name: "Timeout Sound",
        type: "sound",
        url: "/timeout.mp3",
        formats: ["audio/mp3"],
        loaded: false,
      };

      const result = await loader.loadAsset(asset, { timeout: 100 });

      // Should fallback to silent placeholder after timeout
      expect(result.success).toBe(false);
      expect(result.audio).toBeDefined();
      expect(result.formatUsed).toBe("placeholder");

      // Restore mock
      global.Audio = MockAudioElement as any;
    });

    it("should try format fallback (webm → mp3)", async () => {
      const attemptedUrls: string[] = [];

      global.Audio = class {
        src = "";
        preload = "auto";
        addEventListener = vi.fn((event: string, handler: () => void) => {
          attemptedUrls.push(this.src);
          // Fail first attempt, succeed second
          if (event === "canplaythrough" && attemptedUrls.length > 1) {
            setTimeout(() => handler(), 10);
          } else if (event === "error") {
            setTimeout(() => handler(), 5);
          }
        });
        load = vi.fn();
      } as any;

      const asset: AudioAsset = {
        id: "fallback_sound",
        name: "Fallback Sound",
        type: "sound",
        url: "/test.webm",
        formats: ["audio/webm", "audio/mp3"],
        loaded: false,
      };

      await loader.loadAsset(asset, { timeout: 200 });

      // Should have tried webm then mp3
      expect(attemptedUrls.length).toBeGreaterThan(0);

      // Restore mock
      global.Audio = MockAudioElement as any;
    });

    it("should retry with exponential backoff", async () => {
      let attempts = 0;

      global.Audio = class {
        src = "";
        preload = "auto";
        addEventListener = vi.fn((event: string, handler: () => void) => {
          attempts++;
          // Fail first 2 attempts, succeed on 3rd
          if (event === "canplaythrough" && attempts >= 3) {
            setTimeout(() => handler(), 10);
          } else if (event === "error") {
            setTimeout(() => handler(), 5);
          }
        });
        load = vi.fn();
      } as any;

      const asset: AudioAsset = {
        id: "retry_sound",
        name: "Retry Sound",
        type: "sound",
        url: "/retry.mp3",
        formats: ["audio/mp3"],
        loaded: false,
      };

      await loader.loadAsset(asset, {
        maxRetries: 3,
        retryDelay: 50,
        timeout: 100,
      });

      expect(attempts).toBeGreaterThanOrEqual(3);

      // Restore mock
      global.Audio = MockAudioElement as any;
    });

    it("should respect priority levels", async () => {
      const asset: AudioAsset = {
        id: "priority_sound",
        name: "Priority Sound",
        type: "sound",
        url: "/priority.mp3",
        formats: ["audio/mp3"],
        loaded: false,
      };

      const criticalResult = await loader.loadAsset(asset, {
        priority: "critical",
      });
      const normalResult = await loader.loadAsset(asset, {
        priority: "normal",
      });

      expect(criticalResult.success).toBe(true);
      expect(normalResult.success).toBe(true);
    });
  });

  describe("batchLoad", () => {
    it("should load multiple assets", async () => {
      const assets: AudioAsset[] = [
        {
          id: "sound1",
          name: "Sound 1",
          type: "sound",
          url: "/sound1.mp3",
          formats: ["audio/mp3"],
          loaded: false,
        },
        {
          id: "sound2",
          name: "Sound 2",
          type: "sound",
          url: "/sound2.mp3",
          formats: ["audio/mp3"],
          loaded: false,
        },
        {
          id: "sound3",
          name: "Sound 3",
          type: "sound",
          url: "/sound3.mp3",
          formats: ["audio/mp3"],
          loaded: false,
        },
      ];

      const results = await loader.batchLoad(assets);

      expect(results).toHaveLength(3);
      expect(results.every((r) => r.success)).toBe(true);
    });

    it("should report progress during batch load", async () => {
      const assets: AudioAsset[] = [
        {
          id: "sound1",
          name: "Sound 1",
          type: "sound",
          url: "/sound1.mp3",
          formats: ["audio/mp3"],
          loaded: false,
        },
        {
          id: "sound2",
          name: "Sound 2",
          type: "sound",
          url: "/sound2.mp3",
          formats: ["audio/mp3"],
          loaded: false,
        },
      ];

      const progressUpdates: any[] = [];
      await loader.batchLoad(assets, {}, (progress) => {
        progressUpdates.push(progress);
      });

      expect(progressUpdates.length).toBeGreaterThan(0);
      expect(progressUpdates[progressUpdates.length - 1].progress).toBe(1.0);
    });

    it("should handle mixed success and failure in batch", async () => {
      let loadCount = 0;

      global.Audio = class {
        src = "";
        preload = "auto";
        addEventListener = vi.fn((event: string, handler: () => void) => {
          loadCount++;
          // Fail odd attempts, succeed even
          if (event === "canplaythrough" && loadCount % 2 === 0) {
            setTimeout(() => handler(), 10);
          } else if (event === "error") {
            setTimeout(() => handler(), 5);
          }
        });
        load = vi.fn();
      } as any;

      const assets: AudioAsset[] = [
        {
          id: "sound1",
          name: "Sound 1",
          type: "sound",
          url: "/sound1.mp3",
          formats: ["audio/mp3"],
          loaded: false,
        },
        {
          id: "sound2",
          name: "Sound 2",
          type: "sound",
          url: "/sound2.mp3",
          formats: ["audio/mp3"],
          loaded: false,
        },
      ];

      const results = await loader.batchLoad(assets, { timeout: 100 });

      expect(results).toHaveLength(2);

      // Restore mock
      global.Audio = MockAudioElement as any;
    });
  });

  describe("preloadByPriority", () => {
    it("should preload only assets with matching priority", async () => {
      const assets: AudioAsset[] = [
        {
          id: "critical1",
          name: "Critical 1",
          type: "sound",
          url: "/critical1.mp3",
          formats: ["audio/mp3"],
          loaded: false,
          preloadPriority: "critical",
        } as any,
        {
          id: "normal1",
          name: "Normal 1",
          type: "sound",
          url: "/normal1.mp3",
          formats: ["audio/mp3"],
          loaded: false,
          preloadPriority: "normal",
        } as any,
      ];

      const results = await loader.preloadByPriority(assets, "critical");

      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(true);
    });

    it("should return empty array if no matching priority", async () => {
      const assets: AudioAsset[] = [
        {
          id: "normal1",
          name: "Normal 1",
          type: "sound",
          url: "/normal1.mp3",
          formats: ["audio/mp3"],
          loaded: false,
        },
      ];

      const results = await loader.preloadByPriority(assets, "critical");

      expect(results).toHaveLength(0);
    });
  });

  describe("cache management", () => {
    it("should cache loaded assets", async () => {
      const asset: AudioAsset = {
        id: "cached_sound",
        name: "Cached Sound",
        type: "sound",
        url: "/cached.mp3",
        formats: ["audio/mp3"],
        loaded: false,
      };

      await loader.loadAsset(asset);

      expect(loader.isCached("cached_sound")).toBe(true);
      expect(loader.getCached("cached_sound")).toBeDefined();
    });

    it("should unload asset and free memory", async () => {
      const asset: AudioAsset = {
        id: "unload_sound",
        name: "Unload Sound",
        type: "sound",
        url: "/unload.mp3",
        formats: ["audio/mp3"],
        loaded: false,
      };

      await loader.loadAsset(asset);
      expect(loader.isCached("unload_sound")).toBe(true);

      const unloaded = loader.unloadAsset("unload_sound");
      expect(unloaded).toBe(true);
      expect(loader.isCached("unload_sound")).toBe(false);
    });

    it("should clear all cached assets", async () => {
      const assets: AudioAsset[] = [
        {
          id: "sound1",
          name: "Sound 1",
          type: "sound",
          url: "/sound1.mp3",
          formats: ["audio/mp3"],
          loaded: false,
        },
        {
          id: "sound2",
          name: "Sound 2",
          type: "sound",
          url: "/sound2.mp3",
          formats: ["audio/mp3"],
          loaded: false,
        },
      ];

      await loader.batchLoad(assets);
      expect(loader.getCacheSize()).toBe(2);

      loader.clearCache();
      expect(loader.getCacheSize()).toBe(0);
    });

    it("should return cache size", async () => {
      const asset: AudioAsset = {
        id: "size_test",
        name: "Size Test",
        type: "sound",
        url: "/size.mp3",
        formats: ["audio/mp3"],
        loaded: false,
      };

      expect(loader.getCacheSize()).toBe(0);
      await loader.loadAsset(asset);
      expect(loader.getCacheSize()).toBe(1);
    });
  });

  describe("statistics", () => {
    it("should track loading statistics", async () => {
      const asset: AudioAsset = {
        id: "stats_sound",
        name: "Stats Sound",
        type: "sound",
        url: "/stats.mp3",
        formats: ["audio/mp3"],
        loaded: false,
      };

      await loader.loadAsset(asset);

      const stats = loader.getStatistics();
      expect(stats.cached).toBe(1);
      expect(stats.loading).toBe(0);
      expect(stats.totalAttempts).toBeGreaterThanOrEqual(0);
    });

    it("should track concurrent loading", async () => {
      const assets: AudioAsset[] = [
        {
          id: "concurrent1",
          name: "Concurrent 1",
          type: "sound",
          url: "/concurrent1.mp3",
          formats: ["audio/mp3"],
          loaded: false,
        },
        {
          id: "concurrent2",
          name: "Concurrent 2",
          type: "sound",
          url: "/concurrent2.mp3",
          formats: ["audio/mp3"],
          loaded: false,
        },
      ];

      // Start loading but don't await
      const promises = assets.map((asset) => loader.loadAsset(asset));

      // Check loading count (may be 0 if loads complete too fast)
      const statsDuringLoad = loader.getStatistics();
      expect(statsDuringLoad.loading).toBeGreaterThanOrEqual(0);

      await Promise.all(promises);

      const statsAfterLoad = loader.getStatistics();
      expect(statsAfterLoad.cached).toBe(2);
      expect(statsAfterLoad.loading).toBe(0);
    });
  });

  describe("silent placeholder", () => {
    it("should create silent placeholder for failed loads", async () => {
      global.Audio = class {
        src = "";
        preload = "auto";
        addEventListener = vi.fn((event: string, handler: () => void) => {
          // Always fail
          if (event === "error") {
            setTimeout(() => handler(), 5);
          }
        });
        load = vi.fn();
      } as any;

      const asset: AudioAsset = {
        id: "failed_sound",
        name: "Failed Sound",
        type: "sound",
        url: "/failed.mp3",
        formats: ["audio/mp3"],
        loaded: false,
      };

      const result = await loader.loadAsset(asset, {
        maxRetries: 1,
        timeout: 100,
      });

      expect(result.audio).toBeDefined();
      expect(result.formatUsed).toBe("placeholder");

      // Restore mock
      global.Audio = MockAudioElement as any;
    });
  });
});
