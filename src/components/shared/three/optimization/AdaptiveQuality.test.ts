/**
 * Tests for AdaptiveQuality system
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  AdaptiveQualitySystem,
  QUALITY_PRESETS,
  type QualityLevel,
} from "./AdaptiveQuality";

describe("AdaptiveQualitySystem", () => {
  let system: AdaptiveQualitySystem;

  beforeEach(() => {
    system = new AdaptiveQualitySystem();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Quality level management", () => {
    it("should initialize at high quality", () => {
      expect(system.getCurrentQuality()).toBe("high");
    });

    it("should get current settings for quality level", () => {
      const settings = system.getCurrentSettings();
      expect(settings).toEqual(QUALITY_PRESETS.high);
      expect(settings.maxParticles).toBe(60);
      expect(settings.shadowMapSize).toBe(1536);
    });

    it("should allow manual quality setting", () => {
      system.setQuality("low");
      expect(system.getCurrentQuality()).toBe("low");
      
      const settings = system.getCurrentSettings();
      expect(settings.maxParticles).toBe(20);
      expect(settings.shadowMapSize).toBe(512);
    });
  });

  describe("Adaptive quality adjustment", () => {
    beforeEach(() => {
      vi.spyOn(performance, "now").mockReturnValue(0);
    });

    it("should not adjust quality without enough samples", () => {
      // System needs 60 samples before adjusting
      for (let i = 0; i < 30; i++) {
        const result = system.update(30); // Low FPS
        expect(result).toBeNull();
      }
      
      // Should still be at high quality
      expect(system.getCurrentQuality()).toBe("high");
    });

    it("should downgrade from high to medium when FPS drops below threshold", () => {
      let now = 0;
      vi.spyOn(performance, "now").mockImplementation(() => {
        now += 100; // Advance time on each call
        return now;
      });
      
      // Feed 61 samples of low FPS (below 45 threshold)
      for (let i = 0; i <= 60; i++) {
        system.update(40);
      }
      
      // Check if downgraded (may happen on last update or need one more)
      expect(system.getCurrentQuality()).toBe("medium");
    });

    it("should downgrade from medium to low when FPS remains low", () => {
      let now = 0;
      vi.spyOn(performance, "now").mockImplementation(() => {
        now += 100;
        return now;
      });
      
      system.setQuality("medium");
      
      // Feed 61 samples of very low FPS
      for (let i = 0; i <= 60; i++) {
        system.update(35);
      }
      
      expect(system.getCurrentQuality()).toBe("low");
    });

    it("should upgrade from low to medium when FPS improves", () => {
      let now = 0;
      vi.spyOn(performance, "now").mockImplementation(() => {
        now += 100;
        return now;
      });
      
      system.setQuality("low");
      
      // Feed 61 samples of good FPS (above 58 threshold)
      for (let i = 0; i <= 60; i++) {
        system.update(60);
      }
      
      expect(system.getCurrentQuality()).toBe("medium");
    });

    it("should upgrade from medium to high when FPS is excellent", () => {
      let now = 0;
      vi.spyOn(performance, "now").mockImplementation(() => {
        now += 100;
        return now;
      });
      
      system.setQuality("medium");
      
      // Feed 61 samples of excellent FPS
      for (let i = 0; i <= 60; i++) {
        system.update(60);
      }
      
      expect(system.getCurrentQuality()).toBe("high");
    });

    it("should respect debounce time between quality changes", () => {
      let now = 0;
      vi.spyOn(performance, "now").mockImplementation(() => now);
      
      // First quality change at time 0
      for (let i = 0; i < 60; i++) {
        system.update(40);
      }
      system.update(40); // Changes to medium
      
      // Try to change again immediately (within 2000ms debounce)
      now = 1000; // Only 1 second passed
      system.reset(); // Reset history but keep quality
      
      for (let i = 0; i < 60; i++) {
        system.update(35);
      }
      
      const result = system.update(35);
      expect(result).toBeNull(); // Should not change yet
    });

    it("should not downgrade below low quality", () => {
      system.setQuality("low");
      vi.spyOn(performance, "now").mockReturnValue(5000);
      
      // Feed samples of very low FPS
      for (let i = 0; i < 60; i++) {
        system.update(20);
      }
      
      const result = system.update(20);
      expect(result).toBeNull(); // No further downgrade
      expect(system.getCurrentQuality()).toBe("low");
    });

    it("should not upgrade above high quality", () => {
      system.setQuality("high");
      vi.spyOn(performance, "now").mockReturnValue(5000);
      
      // Feed samples of excellent FPS
      for (let i = 0; i < 60; i++) {
        system.update(60);
      }
      
      const result = system.update(60);
      expect(result).toBeNull(); // No further upgrade
      expect(system.getCurrentQuality()).toBe("high");
    });
  });

  describe("Quality presets", () => {
    it("should have high quality preset", () => {
      expect(QUALITY_PRESETS.high).toEqual({
        level: "high",
        shadowMapSize: 1536,
        maxParticles: 60,
        postProcessing: false,
        effectsQuality: 1.0,
      });
    });

    it("should have medium quality preset", () => {
      expect(QUALITY_PRESETS.medium).toEqual({
        level: "medium",
        shadowMapSize: 1024,
        maxParticles: 40,
        postProcessing: false,
        effectsQuality: 0.75,
      });
    });

    it("should have low quality preset", () => {
      expect(QUALITY_PRESETS.low).toEqual({
        level: "low",
        shadowMapSize: 512,
        maxParticles: 20,
        postProcessing: false,
        effectsQuality: 0.5,
      });
    });
  });

  describe("Reset functionality", () => {
    it("should reset FPS history and timing", () => {
      vi.spyOn(performance, "now").mockReturnValue(5000);
      
      // Build up some history
      for (let i = 0; i < 30; i++) {
        system.update(50);
      }
      
      system.reset();
      
      // After reset, should need samples again
      const result = system.update(40);
      expect(result).toBeNull();
    });
  });

  describe("Custom thresholds", () => {
    it("should respect custom downgrade threshold", () => {
      let now = 0;
      vi.spyOn(performance, "now").mockImplementation(() => {
        now += 100;
        return now;
      });
      
      const customSystem = new AdaptiveQualitySystem({
        downgradeThreshold: 50, // Higher threshold
        debounceTime: 0,
        sampleSize: 60,
      });
      
      // Feed 61 samples at 48fps (below custom 50 threshold)
      for (let i = 0; i <= 60; i++) {
        customSystem.update(48);
      }
      
      expect(customSystem.getCurrentQuality()).toBe("medium"); // Should downgrade
    });

    it("should respect custom upgrade threshold", () => {
      let now = 0;
      vi.spyOn(performance, "now").mockImplementation(() => {
        now += 100;
        return now;
      });
      
      const customSystem = new AdaptiveQualitySystem({
        upgradeThreshold: 55, // Lower threshold
        debounceTime: 0,
        sampleSize: 60,
      });
      
      customSystem.setQuality("medium");
      
      // Feed 61 samples at 56fps (above custom 55 threshold)
      for (let i = 0; i <= 60; i++) {
        customSystem.update(56);
      }
      
      expect(customSystem.getCurrentQuality()).toBe("high"); // Should upgrade
    });
  });
});
