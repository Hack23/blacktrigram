/**
 * Tests for useCombatLayout hook
 * Verifies responsive layout calculations and memoization behavior
 */

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useCombatLayout } from "./useCombatLayout";

describe("useCombatLayout", () => {
  describe("mobile breakpoint detection", () => {
    it("should detect mobile at 767px", () => {
      const { result } = renderHook(() => useCombatLayout(767, 800));
      expect(result.current.isMobile).toBe(true);
    });

    it("should detect desktop at 768px", () => {
      const { result } = renderHook(() => useCombatLayout(768, 800));
      expect(result.current.isMobile).toBe(false);
    });

    it("should detect mobile at 320px", () => {
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
      const { result } = renderHook(() => useCombatLayout(480, 800));

      expect(result.current.layoutConstants.padding).toBe(10);
      expect(result.current.layoutConstants.hudHeight).toBe(95);
      expect(result.current.layoutConstants.controlsHeight).toBe(130);
      expect(result.current.layoutConstants.footerHeight).toBe(22);
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
    });

    it("should calculate correct arena bounds for mobile", () => {
      const { result } = renderHook(() => useCombatLayout(480, 800));
      const { arenaBounds } = result.current;

      // Arena should be 80% of screen width
      expect(arenaBounds.width).toBe(480 * 0.8);
      expect(arenaBounds.x).toBe(480 * 0.1);

      // Arena should account for HUD, controls, footer, and padding
      const expectedArenaHeight = 800 - 95 - 130 - 22 - 10 * 3;
      expect(arenaBounds.height).toBe(expectedArenaHeight);

      // Arena Y should start after HUD and padding
      expect(arenaBounds.y).toBe(95 + 10);
    });

    it("should handle very small screens", () => {
      const { result } = renderHook(() => useCombatLayout(320, 568));
      const { arenaBounds } = result.current;

      expect(arenaBounds.width).toBeGreaterThan(0);
      expect(arenaBounds.height).toBeGreaterThan(0);
      expect(arenaBounds.x).toBeGreaterThanOrEqual(0);
      expect(arenaBounds.y).toBeGreaterThanOrEqual(0);
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
      const { result, rerender } = renderHook(
        ({ w, h }) => useCombatLayout(w, h),
        { initialProps: { w: 800, h: 800 } }
      );

      expect(result.current.isMobile).toBe(false);
      expect(result.current.layoutConstants.hudHeight).toBe(120);

      // Cross the mobile breakpoint
      rerender({ w: 700, h: 800 });

      expect(result.current.isMobile).toBe(true);
      expect(result.current.layoutConstants.hudHeight).toBe(95);
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
    it("should handle zero dimensions", () => {
      const { result } = renderHook(() => useCombatLayout(0, 0));

      expect(result.current.arenaBounds.width).toBe(0);
      expect(result.current.arenaBounds.height).toBeLessThan(0); // Due to padding
    });

    it("should handle very large dimensions", () => {
      const { result } = renderHook(() => useCombatLayout(3840, 2160));
      const { arenaBounds } = result.current;

      expect(arenaBounds.width).toBe(3840 * 0.8);
      expect(arenaBounds.height).toBeGreaterThan(0);
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
