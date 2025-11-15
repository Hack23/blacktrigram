import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useCombatLayout } from "./useCombatLayout";

describe("useCombatLayout", () => {
  describe("mobile layout", () => {
    it("should return mobile layout constants for width < 768", () => {
      const { result } = renderHook(() => useCombatLayout(600, 800));

      expect(result.current.isMobile).toBe(true);
      expect(result.current.layoutConstants).toEqual({
        padding: 10,
        hudHeight: 100,
        controlsHeight: 140,
        footerHeight: 25,
        healthBarHeight: 50,
      });
    });

    it("should calculate correct arena bounds for mobile", () => {
      const { result } = renderHook(() => useCombatLayout(600, 800));

      const { arenaBounds } = result.current;
      expect(arenaBounds.x).toBe(60); // 600 * 0.1
      expect(arenaBounds.width).toBe(480); // 600 * 0.8
      expect(arenaBounds.y).toBe(110); // hudHeight + padding
      // height = 800 - (100 + 140 + 25) - 30 = 505
      expect(arenaBounds.height).toBe(505);
    });
  });

  describe("desktop layout", () => {
    it("should return desktop layout constants for width >= 768", () => {
      const { result } = renderHook(() => useCombatLayout(1200, 800));

      expect(result.current.isMobile).toBe(false);
      expect(result.current.layoutConstants).toEqual({
        padding: 10,
        hudHeight: 140,
        controlsHeight: 180,
        footerHeight: 30,
        healthBarHeight: 60,
      });
    });

    it("should calculate correct arena bounds for desktop", () => {
      const { result } = renderHook(() => useCombatLayout(1200, 800));

      const { arenaBounds } = result.current;
      expect(arenaBounds.x).toBe(120); // 1200 * 0.1
      expect(arenaBounds.width).toBe(960); // 1200 * 0.8
      expect(arenaBounds.y).toBe(150); // hudHeight + padding
      // height = 800 - (140 + 180 + 30) - 30 = 420
      expect(arenaBounds.height).toBe(420);
    });
  });

  describe("breakpoint behavior", () => {
    it("should use mobile layout at exactly 767px", () => {
      const { result } = renderHook(() => useCombatLayout(767, 800));
      expect(result.current.isMobile).toBe(true);
    });

    it("should use desktop layout at exactly 768px", () => {
      const { result } = renderHook(() => useCombatLayout(768, 800));
      expect(result.current.isMobile).toBe(false);
    });
  });

  describe("responsive updates", () => {
    it("should update layout when width changes across breakpoint", () => {
      const { result, rerender } = renderHook(
        ({ width, height }) => useCombatLayout(width, height),
        {
          initialProps: { width: 600, height: 800 },
        }
      );

      expect(result.current.isMobile).toBe(true);
      expect(result.current.layoutConstants.hudHeight).toBe(100);

      rerender({ width: 1200, height: 800 });

      expect(result.current.isMobile).toBe(false);
      expect(result.current.layoutConstants.hudHeight).toBe(140);
    });

    it("should update arena bounds when dimensions change", () => {
      const { result, rerender } = renderHook(
        ({ width, height }) => useCombatLayout(width, height),
        {
          initialProps: { width: 1200, height: 800 },
        }
      );

      const initialBounds = result.current.arenaBounds;

      rerender({ width: 1600, height: 900 });

      const updatedBounds = result.current.arenaBounds;
      expect(updatedBounds.x).not.toBe(initialBounds.x);
      expect(updatedBounds.width).not.toBe(initialBounds.width);
      expect(updatedBounds.height).not.toBe(initialBounds.height);
    });
  });

  describe("calculation consistency", () => {
    it("should maintain proper proportions for arena", () => {
      const { result } = renderHook(() => useCombatLayout(1000, 800));

      const { arenaBounds } = result.current;
      // Arena should be 80% of width
      expect(arenaBounds.width).toBe(1000 * 0.8);
      // Arena should start at 10% from left
      expect(arenaBounds.x).toBe(1000 * 0.1);
    });

    it("should leave proper space for UI elements", () => {
      const { result } = renderHook(() => useCombatLayout(1200, 800));

      const { arenaBounds, layoutConstants } = result.current;
      const totalReservedHeight =
        layoutConstants.hudHeight +
        layoutConstants.controlsHeight +
        layoutConstants.footerHeight +
        layoutConstants.padding * 3;

      // Arena height + reserved height should equal total height
      expect(arenaBounds.height + totalReservedHeight).toBe(800);
    });
  });

  describe("edge cases", () => {
    it("should handle very small screens", () => {
      const { result } = renderHook(() => useCombatLayout(320, 480));

      expect(result.current.isMobile).toBe(true);
      expect(result.current.arenaBounds.width).toBeGreaterThan(0);
      expect(result.current.arenaBounds.height).toBeGreaterThan(0);
    });

    it("should enforce minimum arena height of 300px", () => {
      // Screen with very limited height after UI elements
      // With mobile layout: hudHeight=100, controlsHeight=140, footerHeight=25, padding=10*3=30
      // Total reserved: 100 + 140 + 25 + 30 = 295
      // For 400px height: 400 - 295 = 105 (would be less than 300 without minimum)
      const { result } = renderHook(() => useCombatLayout(600, 400));

      // Even if calculated height would be less, should be at least 300
      expect(result.current.arenaBounds.height).toBeGreaterThanOrEqual(300);
      expect(result.current.arenaBounds.height).toBe(300); // Should be exactly 300 for this case
    });

    it("should allow arena height greater than 300px when space is available", () => {
      // Screen with sufficient height
      const { result } = renderHook(() => useCombatLayout(1200, 1000));

      // Should be greater than minimum when space allows
      expect(result.current.arenaBounds.height).toBeGreaterThan(300);
    });

    it("should handle very large screens", () => {
      const { result } = renderHook(() => useCombatLayout(3840, 2160));

      expect(result.current.isMobile).toBe(false);
      expect(result.current.arenaBounds.width).toBe(3840 * 0.8);
      expect(result.current.arenaBounds.height).toBeGreaterThan(0);
    });
  });
});
