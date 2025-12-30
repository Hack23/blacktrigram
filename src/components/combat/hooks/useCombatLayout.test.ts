/**
 * Tests for useCombatLayout hook
 * Verifies responsive layout calculations and memoization behavior
 */

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { useCombatLayout } from "./useCombatLayout";
import * as deviceDetection from "../../../utils/deviceDetection";

describe("useCombatLayout", () => {
  beforeEach(() => {
    // Mock device detection to return desktop by default
    vi.spyOn(deviceDetection, 'shouldUseMobileControls').mockReturnValue(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("mobile breakpoint detection", () => {
    it("should detect mobile at 767px", () => {
      // Mock as mobile device
      vi.spyOn(deviceDetection, 'shouldUseMobileControls').mockReturnValue(true);

      const { result } = renderHook(() => useCombatLayout(767, 800));
      expect(result.current.isMobile).toBe(true);
    });

    it("should detect desktop at 768px", () => {
      const { result } = renderHook(() => useCombatLayout(768, 800));
      expect(result.current.isMobile).toBe(false);
    });

    it("should detect mobile at 320px", () => {
      // Mock as mobile device
      vi.spyOn(deviceDetection, 'shouldUseMobileControls').mockReturnValue(true);

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
      vi.spyOn(deviceDetection, 'shouldUseMobileControls').mockReturnValue(true);

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
      expect(result.current.layoutConstants.hudHeight).toBe(120);
      expect(result.current.layoutConstants.controlsHeight).toBe(160);
      expect(result.current.layoutConstants.footerHeight).toBe(28);
      expect(result.current.layoutConstants.healthBarHeight).toBe(55);
    });

    it("should return optimized layout constants for 4K/2K screens", () => {
      const { result } = renderHook(() => useCombatLayout(3840, 2160));

      expect(result.current.layoutConstants.padding).toBe(10);
      expect(result.current.layoutConstants.hudHeight).toBe(90);
      expect(result.current.layoutConstants.controlsHeight).toBe(120);
      expect(result.current.layoutConstants.footerHeight).toBe(20);
      expect(result.current.layoutConstants.healthBarHeight).toBe(45);
      expect(result.current.isMobile).toBe(false);
    });
  });

  describe("arena bounds calculation", () => {
    it("should calculate correct arena bounds for desktop", () => {
      const { result } = renderHook(() => useCombatLayout(1200, 800));
      const { arenaBounds } = result.current;

      // Arena should be 80% of screen width
      expect(arenaBounds.width).toBe(1200 * 0.8);
      expect(arenaBounds.x).toBe(1200 * 0.1);

      // Arena should account for HUD, controls, footer, and padding
      const expectedArenaHeight = 800 - 120 - 160 - 28 - 10 * 3;
      expect(arenaBounds.height).toBe(expectedArenaHeight);

      // Arena Y should start after HUD and padding
      expect(arenaBounds.y).toBe(120 + 10);

      // Desktop should have full scale
      expect(arenaBounds.scale).toBe(1.0);
    });

    it("should calculate correct arena bounds for mobile", () => {
      // Mock as mobile device
      vi.spyOn(deviceDetection, 'shouldUseMobileControls').mockReturnValue(true);

      const { result } = renderHook(() => useCombatLayout(480, 800));
      const { arenaBounds } = result.current;

      // Mobile arena should be sized with 4:3 aspect ratio (width wider than height)
      expect(arenaBounds.width).toBeGreaterThanOrEqual(300);
      expect(arenaBounds.width).toBeLessThanOrEqual(400);
      expect(arenaBounds.height).toBeGreaterThanOrEqual(225); // 300 * 3/4
      expect(arenaBounds.height).toBeLessThanOrEqual(350); // Conservative upper bound

      // Should maintain 4:3 aspect ratio (within small tolerance for rounding)
      const aspectRatio = arenaBounds.width / arenaBounds.height;
      expect(aspectRatio).toBeCloseTo(4 / 3, 2);

      // Arena should be centered horizontally
      const expectedX = (480 - arenaBounds.width) / 2;
      expect(arenaBounds.x).toBeCloseTo(expectedX, 1);

      // Arena Y should start after HUD and padding
      expect(arenaBounds.y).toBe(95 + 10);

      // Mobile should have reduced scale
      expect(arenaBounds.scale).toBeLessThan(1.0);
      expect(arenaBounds.scale).toBeGreaterThan(0);
    });

    it("should handle very small screens", () => {
      // Mock as mobile device
      vi.spyOn(deviceDetection, 'shouldUseMobileControls').mockReturnValue(true);

      const { result } = renderHook(() => useCombatLayout(320, 568));
      const { arenaBounds } = result.current;

      expect(arenaBounds.width).toBeGreaterThan(0);
      expect(arenaBounds.height).toBeGreaterThan(0);
      expect(arenaBounds.x).toBeGreaterThanOrEqual(0);
      expect(arenaBounds.y).toBeGreaterThanOrEqual(0);

      // Arena should fit within available space (320 - 40 = 280px)
      // and not exceed it to prevent overflow
      const availableWidth = 320 - 40; // 280px
      expect(arenaBounds.width).toBeLessThanOrEqual(availableWidth);
      
      // Arena should still be playable (reasonable size)
      expect(arenaBounds.width).toBeGreaterThan(200);
      expect(arenaBounds.height).toBeGreaterThan(150);

      // Should have scale property
      expect(arenaBounds.scale).toBeGreaterThan(0);
      expect(arenaBounds.scale).toBeLessThanOrEqual(1.0);
    });
  });

  describe("memoization behavior", () => {
    it("should not recalculate when width changes within same breakpoint", () => {
      const { result, rerender } = renderHook(
        ({ w, h }) => useCombatLayout(w, h),
        { initialProps: { w: 1000, h: 800 } }
      );

      const initialResult = result.current;

      // Change width but stay in desktop breakpoint
      rerender({ w: 1100, h: 800 });

      // isMobile should remain the same
      expect(result.current.isMobile).toBe(initialResult.isMobile);
    });

    it("should recalculate when crossing mobile breakpoint", () => {
      // Create first hook instance with desktop
      vi.spyOn(deviceDetection, 'shouldUseMobileControls').mockReturnValue(false);
      
      const { result: desktopResult } = renderHook(() => useCombatLayout(800, 800));
      
      expect(desktopResult.current.isMobile).toBe(false);
      expect(desktopResult.current.layoutConstants.hudHeight).toBe(120);

      // Create new hook instance with mobile (device detection returns different value)
      vi.spyOn(deviceDetection, 'shouldUseMobileControls').mockReturnValue(true);
      
      const { result: mobileResult } = renderHook(() => useCombatLayout(700, 800));

      expect(mobileResult.current.isMobile).toBe(true);
      expect(mobileResult.current.layoutConstants.hudHeight).toBe(95);
    });

    it("should recalculate arena bounds when dimensions change", () => {
      const { result, rerender } = renderHook(
        ({ w, h }) => useCombatLayout(w, h),
        { initialProps: { w: 1200, h: 800 } }
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
    it("should handle iPhone SE (375x667) with proper arena sizing", () => {
      // Mock as mobile device
      vi.spyOn(deviceDetection, 'shouldUseMobileControls').mockReturnValue(true);

      const { result } = renderHook(() => useCombatLayout(375, 667));
      const { arenaBounds } = result.current;

      // Arena should fit within screen with proper clearances
      const topClearance = arenaBounds.y;
      const bottomClearance = 667 - (arenaBounds.y + arenaBounds.height);

      expect(topClearance).toBeGreaterThanOrEqual(80); // Min 80px top clearance
      expect(bottomClearance).toBeGreaterThanOrEqual(120); // Min 120px bottom clearance

      // Arena should be sized appropriately for iPhone SE
      // Width should be around 335px (375 - 40 for margins)
      // Height should be around 251px (335 * 3/4 to maintain 4:3 ratio)
      expect(arenaBounds.width).toBeGreaterThanOrEqual(300);
      expect(arenaBounds.width).toBeLessThanOrEqual(375);
      expect(arenaBounds.height).toBeGreaterThanOrEqual(225);
      expect(arenaBounds.height).toBeLessThanOrEqual(300);

      // Should maintain 4:3 aspect ratio
      const aspectRatio = arenaBounds.width / arenaBounds.height;
      expect(aspectRatio).toBeCloseTo(4 / 3, 2);
    });

    it("should handle iPhone 14 Pro Max (430x932) with proper arena sizing", () => {
      // Mock as mobile device
      vi.spyOn(deviceDetection, 'shouldUseMobileControls').mockReturnValue(true);

      const { result } = renderHook(() => useCombatLayout(430, 932));
      const { arenaBounds } = result.current;

      // Arena should fit within screen with proper clearances
      const topClearance = arenaBounds.y;
      const bottomClearance = 932 - (arenaBounds.y + arenaBounds.height);

      expect(topClearance).toBeGreaterThanOrEqual(80); // Min 80px top clearance
      expect(bottomClearance).toBeGreaterThanOrEqual(120); // Min 120px bottom clearance

      // Arena should be sized appropriately for larger phones
      // Width should be around 390px (430 - 40 for margins), capped at 400
      // Height should be around 292.5px (390 * 3/4 to maintain 4:3 ratio), capped at 300
      expect(arenaBounds.width).toBeGreaterThanOrEqual(350);
      expect(arenaBounds.width).toBeLessThanOrEqual(400);
      expect(arenaBounds.height).toBeGreaterThanOrEqual(260);
      expect(arenaBounds.height).toBeLessThanOrEqual(310);

      // Should maintain 4:3 aspect ratio
      const aspectRatio = arenaBounds.width / arenaBounds.height;
      expect(aspectRatio).toBeCloseTo(4 / 3, 2);
    });

    it("should handle 2K Android devices (1200x2400) with larger arena", () => {
      // Mock as mobile device (user-agent based detection)
      vi.spyOn(deviceDetection, 'shouldUseMobileControls').mockReturnValue(true);

      const { result } = renderHook(() => useCombatLayout(1200, 2400));
      const { arenaBounds } = result.current;

      // Arena should fit within screen with proper clearances
      const topClearance = arenaBounds.y;
      const bottomClearance = 2400 - (arenaBounds.y + arenaBounds.height);

      expect(topClearance).toBeGreaterThanOrEqual(80); // Min 80px top clearance
      expect(bottomClearance).toBeGreaterThanOrEqual(120); // Min 120px bottom clearance

      // 2K devices should get larger arena (up to 600px width)
      expect(arenaBounds.width).toBeGreaterThanOrEqual(400);
      expect(arenaBounds.width).toBeLessThanOrEqual(600);
      expect(arenaBounds.height).toBeGreaterThanOrEqual(300);
      expect(arenaBounds.height).toBeLessThanOrEqual(450);

      // Should maintain 4:3 aspect ratio
      const aspectRatio = arenaBounds.width / arenaBounds.height;
      expect(aspectRatio).toBeCloseTo(4 / 3, 2);

      // Scale should be appropriate for larger arena
      expect(arenaBounds.scale).toBeGreaterThan(0.4);
      expect(arenaBounds.scale).toBeLessThan(0.7);
    });

    it("should handle 4K Android devices (1440x3168) with largest mobile arena", () => {
      // Mock as mobile device (user-agent based detection)
      vi.spyOn(deviceDetection, 'shouldUseMobileControls').mockReturnValue(true);

      const { result } = renderHook(() => useCombatLayout(1440, 3168));
      const { arenaBounds } = result.current;

      // Arena should fit within screen with proper clearances
      const topClearance = arenaBounds.y;
      const bottomClearance = 3168 - (arenaBounds.y + arenaBounds.height);

      expect(topClearance).toBeGreaterThanOrEqual(80); // Min 80px top clearance
      expect(bottomClearance).toBeGreaterThanOrEqual(120); // Min 120px bottom clearance

      // 4K devices should get largest mobile arena (up to 800px width)
      expect(arenaBounds.width).toBeGreaterThanOrEqual(600);
      expect(arenaBounds.width).toBeLessThanOrEqual(800);
      expect(arenaBounds.height).toBeGreaterThanOrEqual(450);
      expect(arenaBounds.height).toBeLessThanOrEqual(600);

      // Should maintain 4:3 aspect ratio
      const aspectRatio = arenaBounds.width / arenaBounds.height;
      expect(aspectRatio).toBeCloseTo(4 / 3, 2);

      // Scale should be closer to desktop for high-res devices
      expect(arenaBounds.scale).toBeGreaterThan(0.6);
      expect(arenaBounds.scale).toBeLessThan(0.9);
    });

    it("should handle zero dimensions", () => {
      const { result } = renderHook(() => useCombatLayout(0, 0));

      expect(result.current.arenaBounds.width).toBeGreaterThanOrEqual(0);
      expect(result.current.arenaBounds.scale).toBeGreaterThan(0);
    });

    it("should handle very large dimensions", () => {
      const { result } = renderHook(() => useCombatLayout(3840, 2160));
      const { arenaBounds } = result.current;

      expect(arenaBounds.width).toBe(3840 * 0.8);
      expect(arenaBounds.height).toBeGreaterThan(0);
      expect(arenaBounds.scale).toBe(1.0); // Desktop uses full scale
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
