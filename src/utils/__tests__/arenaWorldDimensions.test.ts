/**
 * Unit tests for arenaWorldDimensions module
 * Tests resolution-based arena sizing logic
 */

import { describe, expect, it } from "vitest";
import {
  calculateArenaWorldDimensions,
  calculateArenaConfiguration,
  getScreenSizeCategory,
  getPlayerHeightMeters,
} from "../arenaWorldDimensions";

describe("arenaWorldDimensions", () => {
  describe("getScreenSizeCategory", () => {
    it("should categorize small screens (< 768px)", () => {
      expect(getScreenSizeCategory(320)).toBe("small");
      expect(getScreenSizeCategory(640)).toBe("small");
      expect(getScreenSizeCategory(767)).toBe("small");
    });

    it("should categorize medium screens (768-1199px)", () => {
      expect(getScreenSizeCategory(768)).toBe("medium");
      expect(getScreenSizeCategory(1024)).toBe("medium");
      expect(getScreenSizeCategory(1199)).toBe("medium");
    });

    it("should categorize large screens (1200-1919px)", () => {
      expect(getScreenSizeCategory(1200)).toBe("large");
      expect(getScreenSizeCategory(1600)).toBe("large");
      expect(getScreenSizeCategory(1919)).toBe("large");
    });

    it("should categorize xlarge screens (1920-2559px)", () => {
      expect(getScreenSizeCategory(1920)).toBe("xlarge");
      expect(getScreenSizeCategory(2048)).toBe("xlarge");
      expect(getScreenSizeCategory(2559)).toBe("xlarge");
    });

    it("should categorize ultra screens (≥ 2560px)", () => {
      expect(getScreenSizeCategory(2560)).toBe("ultra");
      expect(getScreenSizeCategory(3840)).toBe("ultra");
      expect(getScreenSizeCategory(7680)).toBe("ultra");
    });

    it("should handle boundary values correctly", () => {
      // Test exact boundaries
      expect(getScreenSizeCategory(767)).toBe("small");
      expect(getScreenSizeCategory(768)).toBe("medium");
      expect(getScreenSizeCategory(1199)).toBe("medium");
      expect(getScreenSizeCategory(1200)).toBe("large");
      expect(getScreenSizeCategory(1919)).toBe("large");
      expect(getScreenSizeCategory(1920)).toBe("xlarge");
      expect(getScreenSizeCategory(2559)).toBe("xlarge");
      expect(getScreenSizeCategory(2560)).toBe("ultra");
    });
  });

  describe("calculateArenaWorldDimensions", () => {
    it("should return 6m × 4.5m for small screens (< 768px)", () => {
      const result = calculateArenaWorldDimensions(640);
      
      expect(result.widthMeters).toBe(6);
      expect(result.depthMeters).toBe(4.5); // 6 * 0.75 = 4.5
      expect(result.screenCategory).toBe("small");
    });

    it("should return 8m × 6m for medium screens (768-1199px)", () => {
      const result = calculateArenaWorldDimensions(1024);
      
      expect(result.widthMeters).toBe(8);
      expect(result.depthMeters).toBe(6); // 8 * 0.75 = 6
      expect(result.screenCategory).toBe("medium");
    });

    it("should return 10m × 7.5m for large screens (1200-1919px)", () => {
      const result = calculateArenaWorldDimensions(1600);
      
      expect(result.widthMeters).toBe(10);
      expect(result.depthMeters).toBe(7.5); // 10 * 0.75 = 7.5
      expect(result.screenCategory).toBe("large");
    });

    it("should return 12m × 9m for xlarge screens (1920-2559px)", () => {
      const result = calculateArenaWorldDimensions(1920);
      
      expect(result.widthMeters).toBe(12);
      expect(result.depthMeters).toBe(9); // 12 * 0.75 = 9
      expect(result.screenCategory).toBe("xlarge");
    });

    it("should return 14m × 10.5m for ultra screens (≥ 2560px)", () => {
      const result = calculateArenaWorldDimensions(3840);
      
      expect(result.widthMeters).toBe(14);
      expect(result.depthMeters).toBe(10.5); // 14 * 0.75 = 10.5
      expect(result.screenCategory).toBe("ultra");
    });

    it("should use 4:3 aspect ratio for all arenas", () => {
      const sizes = [640, 1024, 1600, 1920, 3840];
      
      sizes.forEach(size => {
        const result = calculateArenaWorldDimensions(size);
        // depth should be 75% of width (4:3 aspect ratio)
        expect(result.depthMeters).toBeCloseTo(result.widthMeters * 0.75, 2);
      });
    });

    it("should handle boundary screen widths", () => {
      // Test exact boundary transitions
      expect(calculateArenaWorldDimensions(767).widthMeters).toBe(6);
      expect(calculateArenaWorldDimensions(768).widthMeters).toBe(8);
      expect(calculateArenaWorldDimensions(1199).widthMeters).toBe(8);
      expect(calculateArenaWorldDimensions(1200).widthMeters).toBe(10);
      expect(calculateArenaWorldDimensions(1919).widthMeters).toBe(10);
      expect(calculateArenaWorldDimensions(1920).widthMeters).toBe(12);
      expect(calculateArenaWorldDimensions(2559).widthMeters).toBe(12);
      expect(calculateArenaWorldDimensions(2560).widthMeters).toBe(14);
    });

    it("should include sizeMeters property equal to widthMeters", () => {
      const result = calculateArenaWorldDimensions(1920);
      
      expect(result.sizeMeters).toBe(result.widthMeters);
      expect(result.sizeMeters).toBe(12);
    });
  });

  describe("getPlayerHeightMeters", () => {
    it("should convert centimeters to meters correctly", () => {
      expect(getPlayerHeightMeters(180)).toBe(1.8);
      expect(getPlayerHeightMeters(175)).toBe(1.75);
      expect(getPlayerHeightMeters(190)).toBe(1.9);
    });

    it("should handle short players", () => {
      expect(getPlayerHeightMeters(150)).toBe(1.5);
      expect(getPlayerHeightMeters(160)).toBe(1.6);
    });

    it("should handle tall players", () => {
      expect(getPlayerHeightMeters(200)).toBe(2.0);
      expect(getPlayerHeightMeters(210)).toBe(2.1);
    });

    it("should handle fractional centimeters", () => {
      expect(getPlayerHeightMeters(182.5)).toBeCloseTo(1.825, 3);
    });

    it("should handle zero height", () => {
      expect(getPlayerHeightMeters(0)).toBe(0);
    });
  });

  describe("Integration - pixels per meter calculation", () => {
    it("should maintain consistent px/m ratio for different arena sizes", () => {
      // Small: 300px / 6m = 50 px/m
      const small = calculateArenaWorldDimensions(640);
      const smallPxPerM = 300 / small.widthMeters;
      expect(smallPxPerM).toBe(50);

      // XLarge (1920px): 960px arena / 12m = 80 px/m
      const xlarge = calculateArenaWorldDimensions(1920);
      const xlargePxPerM = 960 / xlarge.widthMeters;
      expect(xlargePxPerM).toBe(80);

      // Ultra (4K): 1920px arena / 14m ≈ 137 px/m
      const ultra = calculateArenaWorldDimensions(3840);
      const ultraPxPerM = 1920 / ultra.widthMeters;
      expect(ultraPxPerM).toBeCloseTo(137.14, 2);
    });

    it("should ensure 4m/s movement looks realistic across resolutions", () => {
      // At 4 m/s, player should move at reasonable visual speed
      const speedMetersPerSec = 4;

      // Small: 4 m/s * 50 px/m = 200 px/s
      const small = calculateArenaWorldDimensions(640);
      const smallSpeedPxPerSec = speedMetersPerSec * (300 / small.widthMeters);
      expect(smallSpeedPxPerSec).toBe(200);

      // XLarge: 4 m/s * 80 px/m = 320 px/s
      const xlarge = calculateArenaWorldDimensions(1920);
      const xlargeSpeedPxPerSec = speedMetersPerSec * (960 / xlarge.widthMeters);
      expect(xlargeSpeedPxPerSec).toBe(320);

      // Both speeds should appear proportional to screen size
      // XLarge speed should be ~1.6x small speed (320/200 = 1.6)
      expect(xlargeSpeedPxPerSec / smallSpeedPxPerSec).toBe(1.6);
    });
  });

  describe("Edge Cases and Additional Coverage", () => {
    it("should handle extreme screen sizes gracefully", () => {
      // Very small screen
      const tiny = calculateArenaWorldDimensions(100);
      expect(tiny.widthMeters).toBeGreaterThan(0);
      expect(tiny.depthMeters).toBeGreaterThan(0);
      expect(tiny.screenCategory).toBe("small");

      // Very large screen
      const huge = calculateArenaWorldDimensions(10000);
      expect(huge.widthMeters).toBeGreaterThan(0);
      expect(huge.depthMeters).toBeGreaterThan(0);
      expect(huge.screenCategory).toBe("ultra");
    });

    it("should always maintain 4:3 aspect ratio (depth = width × 0.75)", () => {
      const sizes = [320, 800, 1400, 2000, 3000];

      sizes.forEach((width) => {
        const dimensions = calculateArenaWorldDimensions(width);
        // Depth should always be 75% of width (4:3 aspect ratio)
        expect(dimensions.depthMeters).toBeCloseTo(
          dimensions.widthMeters * 0.75,
          2,
        );
      });
    });

    it("should return consistent dimensions for same category", () => {
      // Multiple widths in same category should give same arena size
      const medium1 = calculateArenaWorldDimensions(768);
      const medium2 = calculateArenaWorldDimensions(1000);
      const medium3 = calculateArenaWorldDimensions(1199);

      expect(medium1.widthMeters).toBe(medium2.widthMeters);
      expect(medium2.widthMeters).toBe(medium3.widthMeters);
      expect(medium1.depthMeters).toBe(medium2.depthMeters);
    });

    it("should increase arena size as screen width increases", () => {
      const small = calculateArenaWorldDimensions(640);
      const medium = calculateArenaWorldDimensions(1024);
      const large = calculateArenaWorldDimensions(1600);
      const xlarge = calculateArenaWorldDimensions(2400);

      // Arena should get larger as screen size increases
      expect(medium.widthMeters).toBeGreaterThan(small.widthMeters);
      expect(large.widthMeters).toBeGreaterThan(medium.widthMeters);
      expect(xlarge.widthMeters).toBeGreaterThan(large.widthMeters);

      // Depth should also increase proportionally
      expect(medium.depthMeters).toBeGreaterThan(small.depthMeters);
      expect(large.depthMeters).toBeGreaterThan(medium.depthMeters);
      expect(xlarge.depthMeters).toBeGreaterThan(large.depthMeters);
    });
  });

  describe("calculateArenaConfiguration", () => {
    it("should calculate complete arena configuration with pixel and meter dimensions", () => {
      const config = calculateArenaConfiguration(1920, 1080, 100, 50);

      // Should have world dimensions
      expect(config.worldWidthMeters).toBeGreaterThan(0);
      expect(config.worldDepthMeters).toBeGreaterThan(0);

      // Should have pixel dimensions
      expect(config.width).toBeGreaterThan(0);
      expect(config.height).toBeGreaterThan(0);

      // Should have position
      expect(config.x).toBeGreaterThanOrEqual(0);
      expect(config.y).toBeGreaterThanOrEqual(0);

      // Should calculate pixels per meter
      expect(config.pixelsPerMeter).toBeGreaterThan(0);
      expect(config.pixelsPerMeter).toBe(
        config.width / config.worldWidthMeters,
      );

      // Should calculate scale
      expect(config.scale).toBeGreaterThan(0);
    });

    it("should respect top and bottom offsets", () => {
      const topOffset = 100;
      const bottomOffset = 50;
      const config = calculateArenaConfiguration(
        1920,
        1080,
        topOffset,
        bottomOffset,
      );

      // Arena should start at topOffset
      expect(config.y).toBe(topOffset);

      // Arena height should account for offsets
      const availableHeight = 1080 - topOffset - bottomOffset;
      expect(config.height).toBeLessThanOrEqual(availableHeight);
    });

    it("should center arena horizontally with margins", () => {
      const screenWidth = 1920;
      const horizontalMargin = 0.1;
      const config = calculateArenaConfiguration(
        screenWidth,
        1080,
        100,
        50,
        horizontalMargin,
      );

      // Arena should be centered
      const expectedAvailableWidth = screenWidth * (1 - 2 * horizontalMargin);
      expect(config.width).toBeLessThanOrEqual(expectedAvailableWidth);

      // X position should account for centering
      expect(config.x).toBeGreaterThan(0);
      expect(config.x + config.width).toBeLessThanOrEqual(screenWidth);
    });

    it("should handle different screen sizes correctly", () => {
      const small = calculateArenaConfiguration(640, 480, 50, 30);
      const large = calculateArenaConfiguration(3840, 2160, 100, 50);

      // Larger screen should have larger world dimensions
      expect(large.worldWidthMeters).toBeGreaterThan(small.worldWidthMeters);

      // Both should have valid pixel-to-meter ratios
      expect(small.pixelsPerMeter).toBeGreaterThan(0);
      expect(large.pixelsPerMeter).toBeGreaterThan(0);

      // Arena should fit within screen bounds
      expect(small.x + small.width).toBeLessThanOrEqual(640);
      expect(large.x + large.width).toBeLessThanOrEqual(3840);
    });
  });
});
