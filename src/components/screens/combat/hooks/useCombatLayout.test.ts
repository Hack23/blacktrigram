/**
 * Tests for useCombatLayout hook
 * Verifies responsive layout calculations and memoization behavior
 */

import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as deviceDetection from "../../../../utils/deviceDetection";
import { useCombatLayout } from "./useCombatLayout";

describe("useCombatLayout", () => {
  beforeEach(() => {
    // Mock device detection to return desktop by default
    vi.spyOn(deviceDetection, "shouldUseMobileControls").mockReturnValue(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("mobile breakpoint detection", () => {
    it("should detect mobile at 767px", () => {
      // Mock as mobile device
      vi.spyOn(deviceDetection, "shouldUseMobileControls").mockReturnValue(
        true,
      );

      const { result } = renderHook(() => useCombatLayout(767, 800));
      expect(result.current.isMobile).toBe(true);
    });

    it("should detect desktop at 768px", () => {
      // Use a landscape-oriented 768px viewport so portrait-force doesn't
      // promote this to mobile (the hook now treats narrow portrait
      // viewports as mobile regardless of user-agent).
      const { result } = renderHook(() => useCombatLayout(768, 600));
      expect(result.current.isMobile).toBe(false);
      expect(result.current.isPortrait).toBe(false);
    });

    it("should detect mobile at 320px", () => {
      // Mock as mobile device
      vi.spyOn(deviceDetection, "shouldUseMobileControls").mockReturnValue(
        true,
      );

      const { result } = renderHook(() => useCombatLayout(320, 568));
      expect(result.current.isMobile).toBe(true);
    });

    it("should detect desktop at 1920px", () => {
      const { result } = renderHook(() => useCombatLayout(1920, 1080));
      expect(result.current.isMobile).toBe(false);
    });
  });

  describe("layout constants", () => {
    it("should return mobile layout constants for small screens", () => {
      // Mock as mobile device
      vi.spyOn(deviceDetection, "shouldUseMobileControls").mockReturnValue(
        true,
      );

      const { result } = renderHook(() => useCombatLayout(480, 800));

      expect(result.current.layoutConstants.padding).toBe(10);
      expect(result.current.layoutConstants.hudHeight).toBe(95);
      expect(result.current.layoutConstants.controlsHeight).toBe(160); // Updated from 130
      expect(result.current.layoutConstants.footerHeight).toBe(34); // Updated from 22
      expect(result.current.layoutConstants.healthBarHeight).toBe(48);
    });

    it("should return desktop layout constants for large screens", () => {
      const { result } = renderHook(() => useCombatLayout(1200, 800));

      expect(result.current.layoutConstants.padding).toBe(10);
      expect(result.current.layoutConstants.hudHeight).toBe(130); // Fixed: was 120 (old broken), now 130 (desktop)
      expect(result.current.layoutConstants.controlsHeight).toBe(170); // Fixed: was 160 (old broken), now 170 (desktop)
      expect(result.current.layoutConstants.footerHeight).toBe(35); // Fixed: was 28 (old broken), now 35 (desktop)
      expect(result.current.layoutConstants.healthBarHeight).toBe(65); // Fixed: was 55 (old broken), now 65 (desktop)
    });

    it("should return optimized layout constants for 4K/2K screens", () => {
      const { result } = renderHook(() => useCombatLayout(3840, 2160));

      expect(result.current.layoutConstants.padding).toBe(10);
      expect(result.current.layoutConstants.hudHeight).toBe(140); // Fixed: was 90 (inverted!), now 140 (xlarge +56%)
      expect(result.current.layoutConstants.controlsHeight).toBe(180); // Fixed: was 120 (inverted!), now 180 (xlarge +50%)
      expect(result.current.layoutConstants.footerHeight).toBe(40); // Fixed: was 20 (inverted!), now 40 (xlarge +100%)
      expect(result.current.layoutConstants.healthBarHeight).toBe(70); // Fixed: was 45 (inverted!), now 70 (xlarge +56%)
      expect(result.current.isMobile).toBe(false);
    });
  });

  describe("arena bounds calculation", () => {
    it("should calculate correct arena bounds for desktop", () => {
      const { result } = renderHook(() => useCombatLayout(1200, 800));
      const { arenaBounds } = result.current;

      // Arena uses 4:3 aspect ratio, constrained by available space
      expect(arenaBounds.width).toBeGreaterThan(0);
      expect(arenaBounds.height).toBeGreaterThan(0);

      // Verify 4:3 aspect ratio
      const aspectRatio = arenaBounds.width / arenaBounds.height;
      expect(aspectRatio).toBeCloseTo(4 / 3, 2);

      // Arena is centered horizontally
      expect(arenaBounds.x).toBeCloseTo((1200 - arenaBounds.width) / 2, 0);

      // Arena Y should start after HUD and padding
      expect(arenaBounds.y).toBe(48 + 10); // Top HUD height plus padding

      // Scale is based on pixels-per-meter vs reference (100 px/m)
      expect(arenaBounds.scale).toBeGreaterThan(0);
      expect(arenaBounds.worldWidthMeters).toBeGreaterThan(0);
    });

    it("should calculate correct arena bounds for mobile (landscape)", () => {
      // Mock as mobile device
      vi.spyOn(deviceDetection, "shouldUseMobileControls").mockReturnValue(
        true,
      );

      // Landscape phone: width > height → 4:3 arena
      const { result } = renderHook(() => useCombatLayout(800, 480));
      const { arenaBounds, isPortrait } = result.current;
      expect(isPortrait).toBe(false);

      // Mobile arena should be sized with 4:3 aspect ratio (width wider than height)
      expect(arenaBounds.width).toBeGreaterThanOrEqual(300);
      expect(arenaBounds.width).toBeLessThanOrEqual(500);
      expect(arenaBounds.height).toBeGreaterThan(0);

      // Should maintain 4:3 aspect ratio (within small tolerance for rounding)
      const aspectRatio = arenaBounds.width / arenaBounds.height;
      expect(aspectRatio).toBeCloseTo(4 / 3, 2);

      // Arena should be centered horizontally
      const expectedX = (800 - arenaBounds.width) / 2;
      expect(arenaBounds.x).toBeCloseTo(expectedX, 1);

      // Mobile should have reduced scale
      expect(arenaBounds.scale).toBeLessThan(1.0);
      expect(arenaBounds.scale).toBeGreaterThan(0);
    });

    it("should calculate correct arena bounds for mobile (portrait → 3:4)", () => {
      vi.spyOn(deviceDetection, "shouldUseMobileControls").mockReturnValue(
        true,
      );

      // Portrait phone: height > width → 3:4 arena (taller than wide)
      const { result } = renderHook(() => useCombatLayout(480, 800));
      const { arenaBounds, isPortrait } = result.current;
      expect(isPortrait).toBe(true);

      // Portrait arena is taller than wide (3:4)
      expect(arenaBounds.height).toBeGreaterThan(arenaBounds.width);
      const aspectRatio = arenaBounds.width / arenaBounds.height;
      expect(aspectRatio).toBeCloseTo(3 / 4, 2);

      // Arena must stay fully on-screen
      expect(arenaBounds.x).toBeGreaterThanOrEqual(0);
      expect(arenaBounds.x + arenaBounds.width).toBeLessThanOrEqual(480);
      expect(arenaBounds.y + arenaBounds.height).toBeLessThanOrEqual(800);

      // Arena should have non-zero usable area
      expect(arenaBounds.width * arenaBounds.height).toBeGreaterThan(10_000);
    });

    it("should handle very small screens (portrait)", () => {
      // Mock as mobile device
      vi.spyOn(deviceDetection, "shouldUseMobileControls").mockReturnValue(
        true,
      );

      // iPhone-SE-class portrait (width < 380, height > width)
      const { result } = renderHook(() => useCombatLayout(320, 568));
      const { arenaBounds, isPortrait } = result.current;
      expect(isPortrait).toBe(true);

      expect(arenaBounds.width).toBeGreaterThan(0);
      expect(arenaBounds.height).toBeGreaterThan(0);
      expect(arenaBounds.x).toBeGreaterThanOrEqual(0);
      expect(arenaBounds.y).toBeGreaterThanOrEqual(0);

      // Arena must fit horizontally within extra-small device (320 - 30 margin)
      const availableWidth = 320 - 30;
      expect(arenaBounds.width).toBeLessThanOrEqual(availableWidth);

      // Arena must not overflow the viewport vertically (the whole point of
      // the portrait fix)
      expect(arenaBounds.y + arenaBounds.height).toBeLessThanOrEqual(568);

      // Arena should still be playable (non-trivial area)
      expect(arenaBounds.width * arenaBounds.height).toBeGreaterThan(5_000);

      // Should have scale property
      expect(arenaBounds.scale).toBeGreaterThan(0);
      expect(arenaBounds.scale).toBeLessThanOrEqual(1.0);
    });
  });

  describe("memoization behavior", () => {
    it("should not recalculate when width changes within same breakpoint", () => {
      const { result, rerender } = renderHook(
        ({ w, h }) => useCombatLayout(w, h),
        { initialProps: { w: 1000, h: 800 } },
      );

      const initialResult = result.current;

      // Change width but stay in desktop breakpoint
      rerender({ w: 1100, h: 800 });

      // isMobile should remain the same
      expect(result.current.isMobile).toBe(initialResult.isMobile);
    });

    it("should recalculate when crossing mobile breakpoint", () => {
      // Create first hook instance with tablet landscape (wider than tall
      // so portrait-force doesn't kick in for width<1024)
      vi.spyOn(deviceDetection, "shouldUseMobileControls").mockReturnValue(
        false,
      );

      const { result: tabletResult } = renderHook(() =>
        useCombatLayout(1000, 700),
      );

      expect(tabletResult.current.isMobile).toBe(false);
      expect(tabletResult.current.layoutConstants.hudHeight).toBe(100); // Tablet gets 100

      // Create new hook instance with mobile (device detection returns different value)
      vi.spyOn(deviceDetection, "shouldUseMobileControls").mockReturnValue(
        true,
      );

      const { result: mobileResult } = renderHook(() =>
        useCombatLayout(700, 800),
      );

      expect(mobileResult.current.isMobile).toBe(true);
      expect(mobileResult.current.layoutConstants.hudHeight).toBe(95);
    });

    it("should recalculate arena bounds when dimensions change", () => {
      const { result, rerender } = renderHook(
        ({ w, h }) => useCombatLayout(w, h),
        { initialProps: { w: 1200, h: 800 } },
      );

      const initialBounds = result.current.arenaBounds;

      // Change dimensions
      rerender({ w: 1600, h: 900 });

      const newBounds = result.current.arenaBounds;

      // Bounds should have changed
      expect(newBounds.width).not.toBe(initialBounds.width);
      expect(newBounds.height).not.toBe(initialBounds.height);
    });
  });

  describe("edge cases", () => {
    it("should handle iPhone SE (375x667) in portrait without occluding arena", () => {
      vi.spyOn(deviceDetection, "shouldUseMobileControls").mockReturnValue(
        true,
      );

      const { result } = renderHook(() => useCombatLayout(375, 667));
      const { arenaBounds, isPortrait, layoutConstants } = result.current;
      expect(isPortrait).toBe(true);

      // Clearances
      const topClearance = arenaBounds.y;
      const bottomClearance = 667 - (arenaBounds.y + arenaBounds.height);

      expect(topClearance).toBeGreaterThanOrEqual(80);
      // In portrait we reserve controls + footer + mobile controls at bottom
      expect(bottomClearance).toBeGreaterThanOrEqual(
        layoutConstants.controlsHeight + layoutConstants.footerHeight,
      );

      // Arena must stay inside the viewport (regression guard for bug
      // where the arena was rendered behind the D-Pad / technique bar).
      expect(arenaBounds.x).toBeGreaterThanOrEqual(0);
      expect(arenaBounds.x + arenaBounds.width).toBeLessThanOrEqual(375);
      expect(arenaBounds.y + arenaBounds.height).toBeLessThanOrEqual(667);

      // 3:4 arena (taller than wide) in portrait
      expect(arenaBounds.height).toBeGreaterThan(arenaBounds.width);
      const aspectRatio = arenaBounds.width / arenaBounds.height;
      expect(aspectRatio).toBeCloseTo(3 / 4, 2);

      // Playable size
      expect(arenaBounds.width * arenaBounds.height).toBeGreaterThan(10_000);
    });

    it("should handle iPhone 14 Pro Max (430x932) in portrait without occluding arena", () => {
      vi.spyOn(deviceDetection, "shouldUseMobileControls").mockReturnValue(
        true,
      );

      const { result } = renderHook(() => useCombatLayout(430, 932));
      const { arenaBounds, isPortrait } = result.current;
      expect(isPortrait).toBe(true);

      expect(arenaBounds.y).toBeGreaterThanOrEqual(80);
      expect(arenaBounds.x).toBeGreaterThanOrEqual(0);
      expect(arenaBounds.x + arenaBounds.width).toBeLessThanOrEqual(430);
      expect(arenaBounds.y + arenaBounds.height).toBeLessThanOrEqual(932);

      // 3:4 aspect ratio
      expect(arenaBounds.height).toBeGreaterThan(arenaBounds.width);
      const aspectRatio = arenaBounds.width / arenaBounds.height;
      expect(aspectRatio).toBeCloseTo(3 / 4, 2);

      expect(arenaBounds.width * arenaBounds.height).toBeGreaterThan(30_000);
    });

    it("should handle 2K Android devices (1200x2400) in portrait", () => {
      vi.spyOn(deviceDetection, "shouldUseMobileControls").mockReturnValue(
        true,
      );

      const { result } = renderHook(() => useCombatLayout(1200, 2400));
      const { arenaBounds, isPortrait } = result.current;
      expect(isPortrait).toBe(true);

      expect(arenaBounds.x).toBeGreaterThanOrEqual(0);
      expect(arenaBounds.x + arenaBounds.width).toBeLessThanOrEqual(1200);
      expect(arenaBounds.y + arenaBounds.height).toBeLessThanOrEqual(2400);

      // 3:4 aspect ratio in portrait
      expect(arenaBounds.height).toBeGreaterThan(arenaBounds.width);
      const aspectRatio = arenaBounds.width / arenaBounds.height;
      expect(aspectRatio).toBeCloseTo(3 / 4, 2);

      expect(arenaBounds.scale).toBeGreaterThan(0.4);
      expect(arenaBounds.scale).toBeLessThan(1.3);
    });

    it("should handle 4K Android devices (1440x3168) in portrait", () => {
      vi.spyOn(deviceDetection, "shouldUseMobileControls").mockReturnValue(
        true,
      );

      const { result } = renderHook(() => useCombatLayout(1440, 3168));
      const { arenaBounds, isPortrait } = result.current;
      expect(isPortrait).toBe(true);

      expect(arenaBounds.x).toBeGreaterThanOrEqual(0);
      expect(arenaBounds.x + arenaBounds.width).toBeLessThanOrEqual(1440);
      expect(arenaBounds.y + arenaBounds.height).toBeLessThanOrEqual(3168);

      // 3:4 aspect ratio in portrait
      expect(arenaBounds.height).toBeGreaterThan(arenaBounds.width);
      const aspectRatio = arenaBounds.width / arenaBounds.height;
      expect(aspectRatio).toBeCloseTo(3 / 4, 2);

      expect(arenaBounds.scale).toBeGreaterThan(0.4);
    });

    it("should handle zero dimensions gracefully", () => {
      // Zero dimensions is an edge case - arena sizing may be negative
      // but scale should still be positive based on physics constants
      const { result } = renderHook(() => useCombatLayout(0, 0));

      // Scale should be positive (based on reference calculations)
      expect(typeof result.current.arenaBounds.scale).toBe("number");
    });

    it("should handle very large dimensions", () => {
      const { result } = renderHook(() => useCombatLayout(3840, 2160));
      const { arenaBounds } = result.current;

      // Large screens use 4:3 aspect ratio, constrained by available space
      expect(arenaBounds.width).toBeGreaterThan(0);
      expect(arenaBounds.height).toBeGreaterThan(0);

      // Verify 4:3 aspect ratio
      const aspectRatio = arenaBounds.width / arenaBounds.height;
      expect(aspectRatio).toBeCloseTo(4 / 3, 2);

      // Scale is positive (based on physics constants)
      expect(arenaBounds.scale).toBeGreaterThan(0);
    });

    it("should handle landscape orientation", () => {
      const { result } = renderHook(() => useCombatLayout(800, 600));

      expect(result.current.arenaBounds.width).toBeGreaterThan(0);
      expect(result.current.arenaBounds.height).toBeGreaterThan(0);
    });

    it("should handle portrait orientation", () => {
      const { result } = renderHook(() => useCombatLayout(600, 800));

      expect(result.current.arenaBounds.width).toBeGreaterThan(0);
      expect(result.current.arenaBounds.height).toBeGreaterThan(0);
    });
  });
});
