/**
 * Tests for useHUDLayout hook
 */

import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useHUDLayout } from '../useHUDLayout';
import { HUD_WIDTH_PERCENT } from '../../types/LayoutTypes';

describe('useHUDLayout', () => {
  describe('left position', () => {
    it('should calculate desktop layout for training context', () => {
      const { result } = renderHook(() =>
        useHUDLayout(1920, 1080, 1.0, 'left', 'training')
      );

      expect(result.current.hudWidthPercent).toBe(0.14);
      expect(result.current.hudWidth).toBe(Math.round(1920 * 0.14));
      // Training: topHeight = getHUDHeight(1080, 0.06) = 64.8
      expect(result.current.topOffset).toBeCloseTo(64.8, 1);
      // Training: bottomHeight = getHUDHeight(1080, 0.11) = 118.8
      expect(result.current.bottomOffset).toBeCloseTo(118.8, 1);
      // availableHeight = 1080 - 64.8 - 118.8 = 896.4
      expect(result.current.availableHeight).toBeCloseTo(896.4, 1);
      // Desktop padding: getResponsivePadding(1920) = 16
      expect(result.current.padding).toBe(16);
      // Desktop training gap: 18
      expect(result.current.gap).toBe(18);
    });

    it('should calculate mobile layout for training context', () => {
      const { result } = renderHook(() =>
        useHUDLayout(375, 667, 1.0, 'left', 'training')
      );

      expect(result.current.hudWidthPercent).toBe(0.18);
      expect(result.current.hudWidth).toBe(Math.round(375 * 0.18));
      // Training: topHeight = getHUDHeight(667, 0.06) = 40.02
      expect(result.current.topOffset).toBeCloseTo(40.02, 1);
      // Training: bottomHeight = getHUDHeight(667, 0.11) = 73.37
      expect(result.current.bottomOffset).toBeCloseTo(73.37, 1);
      // availableHeight = 667 - 40.02 - 73.37 = 553.61
      expect(result.current.availableHeight).toBeCloseTo(553.61, 1);
      // Mobile padding: getResponsivePadding(375) = 8
      expect(result.current.padding).toBe(8);
      // Mobile training gap: 12
      expect(result.current.gap).toBe(12);
    });

    it('should calculate desktop layout for combat context', () => {
      const { result } = renderHook(() =>
        useHUDLayout(1920, 1080, 1.0, 'left', 'combat')
      );

      expect(result.current.hudWidthPercent).toBe(0.14);
      // Combat: topHeight = getHUDHeight(1080, 0.08) = 86.4
      expect(result.current.topOffset).toBeCloseTo(86.4, 1);
      // Combat: bottomHeight = getHUDHeight(1080, 0.12) = 120 (clamped)
      expect(result.current.bottomOffset).toBe(120);
      // availableHeight = 1080 - 86.4 - 120 = 873.6
      expect(result.current.availableHeight).toBeCloseTo(873.6, 1);
    });

    it('should scale dimensions with positionScale', () => {
      const { result } = renderHook(() =>
        useHUDLayout(3840, 2160, 1.5, 'left', 'training')
      );

      // Training: topHeight = getHUDHeight(2160, 0.06) = 120 (clamped) * 1.5 = 180
      expect(result.current.topOffset).toBeCloseTo(180, 1);
      // Training: bottomHeight = getHUDHeight(2160, 0.11) = 120 (clamped) * 1.5 = 180
      expect(result.current.bottomOffset).toBeCloseTo(180, 1);
      // Desktop padding: 16 * 1.5 = 24
      expect(result.current.padding).toBeCloseTo(24, 1);
      // Desktop training gap: 18 * 1.5 = 27
      expect(result.current.gap).toBeCloseTo(27, 1);
    });
  });

  describe('right position', () => {
    it('should use RIGHT_DESKTOP constant for desktop', () => {
      const { result } = renderHook(() =>
        useHUDLayout(1920, 1080, 1.0, 'right', 'training')
      );

      // Should use HUD_WIDTH_PERCENT.RIGHT_DESKTOP (0.14)
      expect(result.current.hudWidthPercent).toBe(HUD_WIDTH_PERCENT.RIGHT_DESKTOP);
      expect(result.current.hudWidth).toBe(Math.round(1920 * HUD_WIDTH_PERCENT.RIGHT_DESKTOP));
    });

    it('should use RIGHT_MOBILE constant for mobile', () => {
      const { result} = renderHook(() =>
        useHUDLayout(768, 1024, 1.0, 'right', 'training')
      );

      // Should use HUD_WIDTH_PERCENT.RIGHT_MOBILE (0.18)
      expect(result.current.hudWidthPercent).toBe(HUD_WIDTH_PERCENT.RIGHT_MOBILE);
      expect(result.current.hudWidth).toBe(Math.round(768 * HUD_WIDTH_PERCENT.RIGHT_MOBILE));
    });

    it('should calculate same dimensions as left (since LEFT and RIGHT constants match)', () => {
      const leftResult = renderHook(() =>
        useHUDLayout(1920, 1080, 1.0, 'left', 'training')
      ).result;

      const rightResult = renderHook(() =>
        useHUDLayout(1920, 1080, 1.0, 'right', 'training')
      ).result;

      // Currently LEFT and RIGHT constants are equal, so dimensions match
      expect(leftResult.current.hudWidth).toBe(rightResult.current.hudWidth);
      expect(leftResult.current.availableHeight).toBeCloseTo(rightResult.current.availableHeight, 1);
    });
  });

  describe('top position', () => {
    it('should use TOP constant for width', () => {
      const { result } = renderHook(() =>
        useHUDLayout(1920, 1080, 1.0, 'top', 'training')
      );

      // Should use HUD_WIDTH_PERCENT.TOP (1.0)
      expect(result.current.hudWidthPercent).toBe(HUD_WIDTH_PERCENT.TOP);
      expect(result.current.hudWidth).toBe(1920);
      // Training top: getHUDHeight(1080, 0.06) = 64.8
      expect(result.current.hudHeight).toBeCloseTo(64.8, 1);
    });

    it('should use mobile dimensions on mobile', () => {
      const { result } = renderHook(() =>
        useHUDLayout(375, 667, 1.0, 'top', 'training')
      );

      // Training top: getHUDHeight(667, 0.06) = 40.02
      expect(result.current.hudHeight).toBeCloseTo(40.02, 1);
    });
  });

  describe('bottom position', () => {
    it('should use BOTTOM constant for width', () => {
      const { result } = renderHook(() =>
        useHUDLayout(1920, 1080, 1.0, 'bottom', 'training')
      );

      // Should use HUD_WIDTH_PERCENT.BOTTOM (1.0)
      expect(result.current.hudWidthPercent).toBe(HUD_WIDTH_PERCENT.BOTTOM);
      expect(result.current.hudWidth).toBe(1920);
      // Training bottom: getHUDHeight(1080, 0.11) = 118.8
      expect(result.current.hudHeight).toBeCloseTo(118.8, 1);
    });

    it('should use combat dimensions in combat context', () => {
      const { result } = renderHook(() =>
        useHUDLayout(1920, 1080, 1.0, 'bottom', 'combat')
      );

      // Combat bottom: getHUDHeight(1080, 0.12) = 120 (clamped)
      expect(result.current.hudHeight).toBe(120);
    });
  });

  describe('memoization', () => {
    it('should return same result for same inputs', () => {
      const { result, rerender } = renderHook(() =>
        useHUDLayout(1920, 1080, 1.0, 'left', 'training')
      );

      const firstResult = result.current;
      rerender();
      const secondResult = result.current;

      expect(firstResult).toBe(secondResult);
    });

    it('should recalculate when inputs change', () => {
      const { result, rerender } = renderHook(
        ({ width }) => useHUDLayout(width, 1080, 1.0, 'left', 'training'),
        { initialProps: { width: 1920 } }
      );

      const firstResult = result.current;
      
      rerender({ width: 1280 });
      const secondResult = result.current;

      expect(firstResult.hudWidth).not.toBe(secondResult.hudWidth);
    });
  });

  describe('edge cases', () => {
    it('should handle very small screens', () => {
      const { result } = renderHook(() =>
        useHUDLayout(320, 568, 1.0, 'left', 'training')
      );

      expect(result.current.hudWidth).toBeGreaterThan(0);
      expect(result.current.availableHeight).toBeGreaterThan(0);
    });

    it('should handle 4K displays', () => {
      const { result } = renderHook(() =>
        useHUDLayout(3840, 2160, 1.5, 'left', 'training')
      );

      expect(result.current.hudWidth).toBeGreaterThan(0);
      expect(result.current.availableHeight).toBeGreaterThan(0);
      // Training: getHUDHeight(2160, 0.06) = 120 (clamped) * 1.5 = 180
      expect(result.current.topOffset).toBeCloseTo(180, 1);
    });

    it('should handle zero positionScale gracefully', () => {
      const { result } = renderHook(() =>
        useHUDLayout(1920, 1080, 0, 'left', 'training')
      );

      expect(result.current.topOffset).toBe(0);
      expect(result.current.padding).toBe(0);
    });

    it('should guard against division by zero with zero height', () => {
      const { result } = renderHook(() =>
        useHUDLayout(1920, 0, 1.0, 'left', 'training')
      );

      // Should not return Infinity or NaN
      expect(result.current.hudHeightPercent).toBe(0);
      expect(Number.isFinite(result.current.hudHeightPercent)).toBe(true);
      expect(result.current.availableHeight).toBe(0);
    });

    it('should handle negative availableHeight gracefully', () => {
      // When top + bottom offsets exceed total height
      const { result } = renderHook(() =>
        useHUDLayout(1920, 100, 1.0, 'left', 'training')
      );

      // availableHeight should be clamped to 0, not negative
      expect(result.current.availableHeight).toBeGreaterThanOrEqual(0);
      expect(result.current.hudHeight).toBeGreaterThanOrEqual(0);
    });

    it('should clamp hudHeightPercent between 0 and 1', () => {
      const { result } = renderHook(() =>
        useHUDLayout(1920, 100, 1.0, 'top', 'training')
      );

      // Percentage should never exceed 1 or go below 0
      expect(result.current.hudHeightPercent).toBeGreaterThanOrEqual(0);
      expect(result.current.hudHeightPercent).toBeLessThanOrEqual(1);
    });
  });
});
